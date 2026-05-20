import { ConnectAppRequest, DialingSetup, ControlParticipantRequest } from '../types';
import { AppType } from '../constants';
import * as busboy from 'busboy';
import { inject, injectable, singleton } from 'tsyringe';
import * as wav from 'wav';
import { ExtendableContext } from 'koa';
import { CustomIVRAppService } from './CustomIVRAppExample/CustomIVRApp.service';
import { OutboundCampaignService } from './OutboundCampaignExample/OutboundCampaignApp.service';
import * as path from 'path';
import { DialerAppService } from './DialerAppExample/DialerApp.service';
import { BadRequest, InternalServerError } from '../Error';

@injectable()
@singleton()
export class AppService {
  constructor(
    @inject(CustomIVRAppService) public customIvrSvc: CustomIVRAppService,
    @inject(OutboundCampaignService)
    public outboundCampaignSvc: OutboundCampaignService,
    @inject(DialerAppService) public dialerAppSvc: DialerAppService,
  ) {}
  /**
   * entire method to connect specified application
   * @param body
   * @param intId
   */
  public async connectApplication(body: ConnectAppRequest, intId: AppType): Promise<void> {
    if (intId === AppType.CustomIvr) {
      await this.customIvrSvc.connect(body, intId);
    } else if (intId === AppType.Campaign) {
      await this.outboundCampaignSvc.connect(body, intId);
    } else if (intId === AppType.Dialer) {
      await this.dialerAppSvc.connect(body, intId);
    } else {
      throw new BadRequest('Unknown application type');
    }
  }
  /**
   * entire method to disconnect specified application
   * @param intId
   */
  public async disconnectApplication(intId: AppType): Promise<void> {
    if (intId === AppType.CustomIvr) {
      await this.customIvrSvc.disconnect();
    } else if (intId === AppType.Campaign) {
      await this.outboundCampaignSvc.disconnect();
    } else if (intId === AppType.Dialer) {
      await this.dialerAppSvc.disconnect();
    } else {
      throw new BadRequest('Unknown application type');
    }
  }

  public getAppStatus(intId: AppType) {
    if (intId === AppType.CustomIvr) {
      return this.customIvrSvc.status();
    } else if (intId === AppType.Campaign) {
      return this.outboundCampaignSvc.status();
    } else if (intId === AppType.Dialer) {
      return this.dialerAppSvc.status();
    } else {
      throw new BadRequest('Unknown application type');
    }
  }
  /**
   * Load config for custom IVR
   * @param req
   * @returns
   */
  public async loadIVRconfig(req: ExtendableContext['req']): Promise<void> {
    return new Promise((res, rej) => {
      const bb = busboy({ headers: req.headers });
      const config: Record<string, unknown> = {};
      bb.on('file', (fieldName, file, info) => {
        const { filename, mimeType } = info;
        if (mimeType === 'audio/wav') {
          config.wavSource = filename;
          const pathToFile = path.resolve(__dirname, '../../', 'public');
          const outputWriter = new wav.FileWriter(path.join(pathToFile, 'output.wav'), {
            sampleRate: 8000,
            channels: 1,
          });
          file.pipe(outputWriter);
        }
      });
      bb.on('field', (name, val) => {
        try {
          config[name] = JSON.parse(val);
        } catch {
          config[name] = val;
        }
      });
      bb.on('close', async () => {
        try {
          this.customIvrSvc.setup(config);
          res();
        } catch {
          rej(new BadRequest('Configuration contains errors'));
        }
      });
      bb.on('error', () => rej(new InternalServerError('Form upload failed')));
      req.pipe(bb);
    });
  }

  setDialerActiveDevice({ activeDeviceId }: { activeDeviceId: string }) {
    return this.dialerAppSvc.setActiveDeviceId(activeDeviceId);
  }
  /**
   * entire method for control participant for specified application
   * @param body
   * @param intId
   */
  public controlParticipant(body: ControlParticipantRequest, intId: AppType) {
    if (body.participantId === undefined || body.action === undefined) {
      throw new BadRequest(
        `${body.participantId === undefined ? 'participantID' : ''}${
          body.action === undefined ? 'action' : ''
        } is not specified`,
      );
    }

    if (intId === AppType.Campaign) {
      return this.outboundCampaignSvc.controlParticipant(
        body.participantId,
        body.action,
        body.destination,
      );
    } else if (intId === AppType.CustomIvr) {
      return this.customIvrSvc.controlParticipant(
        body.participantId,
        body.action,
        body.destination,
      );
    } else if (intId === AppType.Dialer) {
      return this.dialerAppSvc.controlParticipant(
        body.participantId,
        body.action,
        body.destination,
      );
    } else {
      throw new BadRequest('Unknown Application Type');
    }
  }

  /**
   * entire method for dialing for specified application
   * @param dialingSetup
   * @param intId
   */
  public async startDialing(dialingSetup: DialingSetup, intId: AppType): Promise<void> {
    if (intId === AppType.Campaign) {
      this.outboundCampaignSvc.startDialing(dialingSetup);
    } else if (intId === AppType.CustomIvr) {
      this.customIvrSvc.startDialing(dialingSetup);
    } else if (intId === AppType.Dialer) {
      this.dialerAppSvc.makeCall(dialingSetup.sources);
    } else {
      throw new BadRequest('Failed to start Dialing: Unknown Application Type');
    }
  }
}
