import { inject, injectable, singleton } from 'tsyringe';
import {
  AppStatus,
  CallControl,
  CallControlParticipantAction,
  CallParticipant,
  ConnectAppRequest,
  DeviceModel,
  DnInfoModel,
  EventType,
  WSEvent,
} from '../../types';
import { ExternalApiService } from '../ExternalApi.service';
import {
  AppType,
  PARTICIPANT_TYPE_UPDATE,
  UNREGISTERED_DEVICE_ID,
  WS_CLOSE_REASON_TERMINATE,
} from '../../constants';
import { determineOperation, fullInfoToObject, set, useWebsocketListeners } from '../../utils';
import * as EventEmitter from 'events';
import axios, { isAxiosError } from 'axios';
import { BadRequest, InternalServerError } from '../../Error';
import { WebSocket } from 'ws';
import * as chalk from 'chalk';

@injectable()
@singleton()
export class DialerAppService {
  private fullInfo?: CallControl;
  private sourceDn: string | null = null;
  private activeDeviceId: string | null = null;

  public sseEventEmitter = new EventEmitter();

  private deviceMap: Map<string, DeviceModel> = new Map();

  constructor(@inject(ExternalApiService) private externalApiSvc: ExternalApiService) {
    this.sseEventEmitter.setMaxListeners(0);
  }

  public async connect(conenctConfig: ConnectAppRequest, appType: AppType) {
    try {
      if (
        conenctConfig.appId === undefined ||
        conenctConfig.appSecret === undefined ||
        conenctConfig.pbxBase === undefined ||
        appType !== AppType.Dialer
      ) {
        throw new BadRequest('App Connection configuration is broken');
      }

      await this.externalApiSvc.setup(conenctConfig, appType);
      // * ws part
      if (!this.externalApiSvc.wsClient)
        throw new BadRequest('Websocket client is not initialized');

      useWebsocketListeners(
        this.externalApiSvc.wsClient,
        this.wsEventHandler,
        this.onReconnectWs,
        this.externalApiSvc.restoreTries,
      );
      //*
      const fullInfo = await this.externalApiSvc.getFullInfo();
      this.fullInfo = fullInfoToObject(fullInfo.data);

      const thesource: DnInfoModel | undefined = Array.from(
        this.fullInfo.callcontrol.values(),
      ).find((val) => val.type === 'Wextension');

      if (!thesource) {
        throw new BadRequest(
          'Application bound to the wrong dn, dn is not found or application hook is invalid, type should be Extension',
        );
      }

      if (thesource.devices.size > 0) {
        for (const device of thesource.devices.values()) {
          if (device.device_id) {
            this.deviceMap.set(device.device_id, {
              ...device,
              currentCalls: new Map(),
            });
          }
        }
      }
      this.deviceMap.set(UNREGISTERED_DEVICE_ID, {
        dn: thesource.dn,
        device_id: UNREGISTERED_DEVICE_ID,
        user_agent: 'Unregistered Devices',
        currentCalls: new Map(),
      });

      if (!this.activeDeviceId) {
        const firstDevice: DeviceModel | undefined = this.deviceMap.values().next()?.value;
        this.activeDeviceId = firstDevice!.device_id!;
      }
      this.sourceDn = thesource.dn ?? null;
      if (!this.sourceDn) {
        throw new BadRequest('Source DN is missing');
      }
      this.externalApiSvc.connected = true;
      this.sseEventEmitter.emit('data', {
        currentCalls: this.status()?.currentCalls,
      });
    } catch (e) {
      this.externalApiSvc.disconnect();
      throw e;
    }
  }
  /**
   * App disconect from pbx method
   */
  async disconnect() {
    this.externalApiSvc.disconnect();
    this.sourceDn = null;
    this.fullInfo?.callcontrol.clear();
    this.deviceMap.clear();
    this.activeDeviceId = null;
    this.sseEventEmitter.emit('data', {
      currentCalls: this.status()?.currentCalls,
    });
    this.externalApiSvc.wsClient?.terminate();
    this.externalApiSvc.connected = false;
  }

  private onReconnectWs = () => {
    this.externalApiSvc
      .reconnectWs()
      .then((ws) => {
        useWebsocketListeners(
          ws,
          this.wsEventHandler,
          this.onReconnectWs,
          this.externalApiSvc.restoreTries,
        );
      })
      .catch((reason) => {
        if (reason === WS_CLOSE_REASON_TERMINATE) {
          this.disconnect();
        }
      });
  };

  public status(): AppStatus {
    const activeDevice = this.activeDeviceId ? this.deviceMap.get(this.activeDeviceId) : undefined;

    return {
      connected: this.externalApiSvc.connected,
      sorceDn: this.sourceDn,
      devices: Array.from(this.deviceMap.values()),
      activeDeviceId: this.activeDeviceId ?? undefined,
      currentCalls: activeDevice?.currentCalls
        ? Array.from(activeDevice.currentCalls.values())
        : [],
      wsConnected: this.externalApiSvc.wsClient?.readyState !== WebSocket.CLOSED,
    };
  }

  setActiveDeviceId(id: string) {
    if (!this.deviceMap.has(id)) {
      throw new BadRequest('Unknown device');
    }
    this.activeDeviceId = id;

    this.sseEventEmitter.emit('data', {
      currentCalls: this.status()?.currentCalls,
    });
    return this.activeDeviceId;
  }
  /**
   * webhook event handler
   * @param webhook
   * @returns
   */
  private wsEventHandler = async (json: string) => {
    try {
      const wsEvent: WSEvent = JSON.parse(json);
      if (!this.externalApiSvc.connected || !wsEvent?.event?.entity || !this.activeDeviceId) {
        return;
      }
      const { dn, id, type } = determineOperation(wsEvent.event.entity);
      switch (wsEvent.event.event_type) {
        case EventType.Upset: {
          this.externalApiSvc
            .requestUpdatedEntityFromWebhookEvent(wsEvent)
            .then((res) => {
              const data = res.data;
              set(this.fullInfo!, wsEvent.event.entity, data);
              if (dn === this.sourceDn) {
                if (type === PARTICIPANT_TYPE_UPDATE) {
                  const participant = this.getParticipantOfDnById(dn, id);
                  if (participant?.id) {
                    let device = participant?.device_id
                      ? this.deviceMap.get(participant.device_id)
                      : undefined;

                    if (!device) {
                      device = this.deviceMap.get(UNREGISTERED_DEVICE_ID);
                    }
                    device?.currentCalls.set(participant.id, {
                      participantId: participant?.id,
                      party: participant?.party_caller_id,
                      status: participant?.status,
                      name: participant?.party_caller_name,
                      callid: participant?.callid,
                      legid: participant?.legid,
                      directControll: participant?.direct_control,
                    });

                    this.sseEventEmitter?.emit('data', {
                      currentCalls: this.status()?.currentCalls,
                    });
                  }
                }
              }
            })
            .catch((err) => {
              if (axios.isAxiosError(err)) {
                console.error(chalk.red(`❌ AXIOS ERROR code: ${err.response?.status}`));
              } else console.error(chalk.red('❌ Unknown error', err));
            });

          break;
        }
        case EventType.Remove:
          {
            const removed = set<CallParticipant>(this.fullInfo!, wsEvent.event.entity, undefined);
            if (dn === this.sourceDn) {
              if (type === PARTICIPANT_TYPE_UPDATE) {
                /**
                 * handle here removed participants
                 */
                const numId = parseFloat(id);
                if (removed?.id) {
                  // standart case with registered device
                  let device = removed.device_id
                    ? this.deviceMap.get(removed.device_id)
                    : undefined;
                  if (!device) {
                    device = this.deviceMap.get(UNREGISTERED_DEVICE_ID);
                  }
                  device?.currentCalls.delete(removed.id);
                } else if (numId) {
                  //participant already removed from fullInfo for any race conditions
                  const deletedCallDevice = Array.from(this.deviceMap.values()).find((dev) =>
                    dev.currentCalls.has(numId),
                  );
                  if (deletedCallDevice) {
                    deletedCallDevice.currentCalls.delete(numId);
                  }
                }
                this.sseEventEmitter?.emit('data', {
                  currentCalls: this.status()?.currentCalls,
                });
              }
            }
          }
          break;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(`AXIOS ERROR code: ${err.response?.status}`);
      } else console.error('Unknown error', err);
    }
  };

  public async makeCall(dest: string) {
    if (!this.sourceDn || !this.externalApiSvc.connected || !this.activeDeviceId) {
      throw new InternalServerError(
        'Source Dn is not defined or application is not connected or device no device selected',
      );
    }
    const selectedDevice = this.getDeviceById(this.activeDeviceId);
    if (!selectedDevice?.device_id) {
      throw new InternalServerError('Device id missing');
    }

    try {
      if (selectedDevice.device_id !== UNREGISTERED_DEVICE_ID) {
        await this.externalApiSvc.makeCallFromDevice(
          this.sourceDn,
          encodeURIComponent(selectedDevice.device_id),
          dest,
        );
      } else {
        await this.externalApiSvc.makeCall(this.sourceDn, dest);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        console.error(chalk.red('❌', err.code, err.message));
      } else {
        console.error(chalk.red('❌', err));
      }
    }
  }

  /**
   * drop call
   * @param participantId
   * @returns
   */
  public controlParticipant(
    participantId: number,
    action: CallControlParticipantAction,
    destination?: string,
  ) {
    if (!this.sourceDn) {
      throw new InternalServerError('Source Dn is not defined or application is not connected');
    }
    const participant = this.getParticipantOfDnById(this.sourceDn, String(participantId));

    if (!participant) {
      return;
    }
    return this.externalApiSvc.controlParticipant(
      this.sourceDn,
      participant.id!,
      action,
      destination,
    );
  }

  private getDeviceById(id: string) {
    if (!this.sourceDn) {
      throw new InternalServerError('Source DN is not defined');
    }
    return this.deviceMap.get(id);
  }

  private getParticipantOfDnById(dn: string, id: string) {
    return this.fullInfo?.callcontrol.get(dn)?.participants.get(id);
  }
}
