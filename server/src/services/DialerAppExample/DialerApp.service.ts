import { inject, injectable, singleton } from "tsyringe";
import {
  AppStatus,
  CallControl,
  CallControlParticipantAction,
  CallControlResultResponse,
  CallParticipant,
  ConnectAppRequest,
  DNDevice,
  DeviceModel,
  DnInfoModel,
  EventType,
  WebhookEvent,
} from "../../types";
import { ExternalApiService } from "../ExternalApi.service";
import { AppType, PARTICIPANT_TYPE_UPDATE } from "../../constants";
import { determineOperation, fullInfoToObject, set } from "../../utils";

@injectable()
@singleton()
export class dialerAppService {
  private fullInfo?: CallControl;
  private sourceDn: string | null = null;
  private activeDeviceId: string | null = null;

  public connected = false;

  private deviceMap: Map<string, DeviceModel> = new Map();

  constructor(
    @inject(ExternalApiService) private externalApiSvc: ExternalApiService
  ) {}

  public async connect(conenctConfig: ConnectAppRequest, appType: AppType) {
    try {
      if (
        conenctConfig.appId === undefined ||
        conenctConfig.appSecret === undefined ||
        conenctConfig.pbxBase === undefined ||
        appType !== AppType.Dialer
      ) {
        throw new Error("Configuration is broken");
      }

      this.externalApiSvc.setup(conenctConfig, appType);
      const fullInfo = await this.externalApiSvc.getFullInfo();
      this.fullInfo = fullInfoToObject(fullInfo.data);

      if (this.fullInfo.callcontrol.size > 1) {
        throw new Error(
          "More than 1 DN founded, please make sure you didn't specify DN_LSIT property for application"
        );
      }
      const next = this.fullInfo.callcontrol.values().next();
      const thesource: DnInfoModel = next.value;
      if (!thesource || thesource.type !== "Wextension") {
        throw new Error(
          "Application binded to the wrong dn or dn is not founed, type should be Extension"
        );
      }
      if (thesource.devices.size > 0) {
        for (const device of thesource.devices.values()) {
          if (device.device_id) {
            if (!this.activeDeviceId) {
              this.activeDeviceId = device.device_id;
            }

            this.deviceMap.set(device.device_id, {
              ...device,
              currentCalls: new Map(),
            });
          }
        }
      }
      this.sourceDn = thesource.dn ?? null;
      if (!this.sourceDn) {
        throw new Error("Source DN is missing");
      }
      this.connected = true;
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
    this.connected = false;
  }

  public status(): AppStatus {
    const activeDevice = this.activeDeviceId
      ? this.deviceMap.get(this.activeDeviceId)
      : undefined;

    return {
      connected: this.connected,
      sorceDn: this.sourceDn,
      devices: this.getDnDevices(this.sourceDn),
      activeDeviceId: this.activeDeviceId ?? undefined,
      currentCalls: activeDevice?.currentCalls
        ? Array.from(activeDevice.currentCalls.values())
        : [],
    };
  }

  setActiveDeviceId(id: string) {
    if (!this.deviceMap.has(id)) {
      throw Error("Unknown device");
    }
    this.activeDeviceId = id;
    return this.activeDeviceId;
  }
  /**
   * webhook event handler
   * @param webhook
   * @returns
   */
  public async webHookEventHandler(webhook: WebhookEvent) {
    if (!this.connected || !webhook?.event?.entity || !this.activeDeviceId) {
      return;
    }

    const { dn, id, type } = determineOperation(webhook.event.entity);
    switch (webhook.event.event_type) {
      case EventType.Upset: {
        try {
          const request =
            await this.externalApiSvc.requestUpdatedEntityFromWebhookEvent(
              webhook
            );
          const data = request.data;
          set(this.fullInfo!, webhook.event.entity, data);
          if (dn === this.sourceDn) {
            if (type === PARTICIPANT_TYPE_UPDATE) {
              const participant = this.getParticipantOfDnById(dn, id);
              if (participant?.id && participant.device_id) {
                const existing = this.deviceMap
                  .get(participant.device_id)
                  ?.currentCalls.get(participant.id);

                const device = this.deviceMap.get(participant.device_id);
                device?.currentCalls.set(participant.id, {
                  participantId: participant?.id,
                  party: participant?.party_caller_id,
                  status: participant?.status,
                  name: participant?.party_caller_name,
                  isIncoming:
                    existing?.isIncoming !== undefined
                      ? existing.isIncoming
                      : true,
                  callid: participant?.callid,
                  legid: participant?.legid,
                  directControll: participant?.direct_control,
                });
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
        break;
      }
      case EventType.Remove:
        {
          const removed: CallParticipant = set(
            this.fullInfo!,
            webhook.event.entity,
            undefined
          );
          if (dn === this.sourceDn) {
            if (type === PARTICIPANT_TYPE_UPDATE) {
              /**
               * handle here removed participants
               */
              //console.log(removed?.id, this.deviceMap);
              if (removed?.id && removed?.device_id) {
                this.deviceMap
                  .get(removed.device_id)
                  ?.currentCalls.delete(removed.id);
              }
            }
          }
        }
        break;
    }
  }

  public async makeCall(dest: string) {
    if (!this.sourceDn || !this.connected || !this.activeDeviceId) {
      throw Error(
        "Source Dn is not defined or application is not connected or device no device selected"
      );
    }
    const selectedDevice = this.getDeviceById(this.activeDeviceId);
    if (!selectedDevice?.device_id) {
      throw Error("Device id missing");
    }

    try {
      const response = await this.externalApiSvc.makeCallFromDevice(
        this.sourceDn,
        encodeURIComponent(selectedDevice.device_id),
        dest
      );
      const data: CallControlResultResponse = response.data;
      if (data.result?.id) {
        const device = this.deviceMap.get(selectedDevice.device_id);
        device?.currentCalls.set(data.result.id, {
          participantId: data.result.id,
          party: data.result.party_caller_id,
          status: data.result.status,
          name: data.result.party_caller_name,
          isIncoming: false,
          callid: data.result.callid,
          legid: data.result.legid,
          directControll: data.result.direct_control,
        });
      }
    } catch (err) {
      console.log(err);
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
    destination?: string
  ) {
    if (!this.sourceDn) {
      throw Error("Source Dn is not defined or application is not connected");
    }
    const participant = this.getParticipantOfDnById(
      this.sourceDn,
      String(participantId)
    );

    if (!participant) {
      return;
    }
    return this.externalApiSvc.controlParticipant(
      this.sourceDn,
      participant.id!,
      action,
      destination
    );
  }

  private getDeviceById(id: string) {
    if (!this.sourceDn) {
      throw Error("Source DN is not defined");
    }
    return this.fullInfo?.callcontrol.get(this.sourceDn)?.devices.get(id);
  }

  private getDnDevices(dn?: string | null) {
    return dn
      ? Array.from(this.fullInfo?.callcontrol.get(dn)?.devices?.values() ?? [])
      : [];
  }

  private getParticipantsOfDn(dn?: string | null) {
    return dn ? this.fullInfo?.callcontrol.get(dn)?.participants : undefined;
  }
  private getParticipantOfDnById(dn: string, id: string) {
    return this.fullInfo?.callcontrol.get(dn)?.participants.get(id);
  }
}