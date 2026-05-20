import {
  Queue,
  determineOperation,
  fullInfoToObject,
  set,
  useWebsocketListeners,
} from '../../utils';
import {
  AppStatus,
  CallControl,
  CallControlParticipantAction,
  CallParticipant,
  ConnectAppRequest,
  DNDevice,
  DialingSetup,
  DnInfoModel,
  EventType,
  TFailedCall,
  WSEvent,
} from '../../types';
import {
  AppType,
  CAMPAIGN_SOURCE_BUSY,
  NO_SOURCE_OR_DISCONNECTED,
  PARTICIPANT_TYPE_UPDATE,
  UNKNOWN_CALL_ERROR,
  WS_CLOSE_REASON_TERMINATE,
} from '../../constants';
import { inject, injectable, singleton } from 'tsyringe';
import { ExternalApiService } from '../ExternalApi.service';
import { BadRequest, InternalServerError } from '../../Error';
import { WebSocket } from 'ws';
import axios from 'axios';
import chalk from 'chalk';

@injectable()
@singleton()
export class OutboundCampaignService {
  private fullInfo?: CallControl;
  private sourceDn: string | null = null;

  public callQueue = new Queue<string>();
  public failedCalls: TFailedCall[] = [];
  public incomingCallsParticipants: Map<number, CallParticipant> = new Map();

  constructor(@inject(ExternalApiService) private externalApiSvc: ExternalApiService) {}

  /**
   *  App Connect to pbx method
   * @param connectConfig
   */
  public async connect(connectConfig: ConnectAppRequest, appType: AppType) {
    try {
      if (
        !connectConfig.appId ||
        !connectConfig.appSecret ||
        !connectConfig.pbxBase ||
        appType !== AppType.Campaign
      ) {
        throw new BadRequest('App Connection configuration is broken');
      }
      await this.externalApiSvc.setup(connectConfig, appType);

      //* ws part
      if (!this.externalApiSvc.wsClient)
        throw new BadRequest('Websocket client is not initialized');

      useWebsocketListeners(
        this.externalApiSvc.wsClient,
        this.wsEventHandler,
        this.onReconnectWs,
        this.externalApiSvc.restoreTries,
      );
      //* other part
      const fullInfo = await this.externalApiSvc.getFullInfo();
      this.fullInfo = fullInfoToObject(fullInfo.data);

      const thesource: DnInfoModel | undefined = Array.from(
        this.fullInfo.callcontrol.values(),
      ).find((val) => val.type === 'Wivr' || val.type === 'Wqueue');
      if (!thesource) {
        throw new BadRequest(
          'Application bound to the wrong dn, dn is not found or application hook is invalid, type should be IVR/Queue',
        );
      }

      this.sourceDn = thesource.dn ?? null;
      if (!this.sourceDn) {
        throw new BadRequest('Source DN is missing');
      }
      this.externalApiSvc.connected = true;
    } catch (err) {
      this.externalApiSvc.disconnect();
      throw err;
    }
  }
  /**
   * App disconect from pbx method
   */
  async disconnect() {
    this.externalApiSvc.disconnect();
    this.sourceDn = null;
    this.incomingCallsParticipants.clear();
    this.fullInfo?.callcontrol.clear();
    this.failedCalls = [];
    this.callQueue.clear();
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

  /**
   * receive app status
   * @returns
   */
  public status(): AppStatus {
    const callQueue = [];
    for (const item of this.callQueue.items) {
      if (item) {
        callQueue.push(item);
      }
    }
    const participants = this.getParticipantsOfDn(this.sourceDn);

    return {
      connected: this.externalApiSvc.connected,
      sorceDn: this.sourceDn,
      failedCalls: this.failedCalls,
      callQueue,
      currentParticipants: participants ? Array.from(participants.values()) : [],
      wsConnected: this.externalApiSvc.wsClient?.readyState !== WebSocket.CLOSED,
    };
  }
  /**
   * webhook event handler
   * @param webhook
   * @returns
   */
  private wsEventHandler = (json: string) => {
    try {
      const wsEvent: WSEvent = JSON.parse(json);
      if (!this.externalApiSvc.connected || !wsEvent?.event?.entity) {
        return;
      }
      const { dn, type } = determineOperation(wsEvent.event.entity);
      switch (wsEvent.event.event_type) {
        case EventType.Upset:
          {
            this.externalApiSvc
              .requestUpdatedEntityFromWebhookEvent(wsEvent)
              .then((res) => {
                const data = res.data;
                set(this.fullInfo!, wsEvent.event.entity, data);
                if (dn === this.sourceDn) {
                  if (type === PARTICIPANT_TYPE_UPDATE) {
                    /**
                     * handle here update of participants
                     */
                  }
                }
              })
              .catch((err) => {
                if (axios.isAxiosError(err)) {
                  console.error(chalk.red(`❌ AXIOS ERROR code: ${err.response?.status}`));
                } else console.error(chalk.red('❌ Unknown error', err));
              });
          }
          break;
        case EventType.Remove: {
          const removed = set<CallParticipant>(this.fullInfo!, wsEvent.event.entity, undefined);
          if (dn === this.sourceDn) {
            if (type === PARTICIPANT_TYPE_UPDATE) {
              /**
               * handle here removed participants
               */
              if (removed?.id) {
                this.incomingCallsParticipants.delete(removed.id);
                const participants = this.getParticipantsOfDn(this.sourceDn);
                if (!participants || participants?.size < 1) {
                  this.makeCallsToDst();
                }
              }
            }
          }
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(chalk.red(`❌ AXIOS ERROR code: ${err.response?.status}`));
      } else console.error(chalk.red('❌ Unknown error', err));
    }
  };

  private getParticipantOfDnById(dn: string, id: string) {
    return this.fullInfo?.callcontrol.get(dn)?.participants.get(id);
  }

  private getParticipantsOfDn(dn?: string | null) {
    return dn ? this.fullInfo?.callcontrol.get(dn)?.participants : undefined;
  }
  /**
   * start prepare queue and start makeCalls
   * @param dialingSetup
   */
  public startDialing(dialingSetup: DialingSetup) {
    const destinations = dialingSetup.sources
      .split(',')
      .map((num) => num.trim())
      .filter(Boolean);

    destinations.forEach((destNumber) => this.callQueue.enqueue(destNumber));

    this.makeCallsToDst();
  }

  /**
   * makes calls from call queue
   * @returns
   */
  public async makeCallsToDst() {
    if (this.callQueue.isEmpty()) return;

    const destNumber = this.callQueue.dequeue();

    if (!this.sourceDn || !this.externalApiSvc.connected) {
      if (destNumber)
        this.failedCalls.push({
          callerId: destNumber,
          reason: NO_SOURCE_OR_DISCONNECTED,
        });
      return;
    }

    const participants = this.getParticipantsOfDn(this.sourceDn);

    if (participants && participants.size > 0) {
      if (destNumber)
        this.failedCalls.push({
          callerId: destNumber,
          reason: CAMPAIGN_SOURCE_BUSY,
        });
      return;
    }

    try {
      const source = this.fullInfo?.callcontrol.get(this.sourceDn);
      const device: DNDevice | undefined = source?.devices?.values().next().value;
      if (!device?.device_id) {
        throw new BadRequest('Devices not found');
      }
      const response = await this.externalApiSvc.makeCallFromDevice(
        this.sourceDn,
        encodeURIComponent(device.device_id),
        destNumber!,
      );
      if (response.data.result?.id) {
        this.incomingCallsParticipants.set(response.data.result.id, response.data.result);
      } else {
        this.failedCalls.push({
          callerId: destNumber!,
          reason: response?.data?.reasontext || UNKNOWN_CALL_ERROR,
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        this.failedCalls.push({
          callerId: destNumber!,
          reason: error.response?.data.reasontext || UNKNOWN_CALL_ERROR,
        });
      } else {
        this.failedCalls.push({
          callerId: destNumber!,
          reason: UNKNOWN_CALL_ERROR,
        });
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
}
