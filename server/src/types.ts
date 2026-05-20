import Pumpify from 'pumpify';
import {
  PARTICIPANT_CONTROL_ANSWER,
  PARTICIPANT_CONTROL_ATTACH_DATA,
  PARTICIPANT_CONTROL_DIVERT,
  PARTICIPANT_CONTROL_DROP,
  PARTICIPANT_CONTROL_ROUTE_TO,
  PARTICIPANT_CONTROL_TRANSFER_TO,
} from './constants';
import { CancelationToken } from './utils';

export type ConnectAppRequest = {
  appId: string;
  appSecret: string;
  pbxBase: string;
};

export type WebSocketRequest = {
  RequestID?: string;
  Path?: string;
  RequestData?: CallControlRequest;
};

export type WebSocketResponse = {
  RequestID?: string;
  Path?: string;
  StatusCode: number;
  Response?: object;
  dtmf_input?: string;
};

export type CallControlRequest = {
  Reason?: string;
  Destination?: string;
  Timeout?: number;
  AttachedData?: unknown;
};

export type ControlParticipantRequest = {
  participantId: number;
  action: CallControlParticipantAction;
  destination?: string;
};

export type DialingSetup = {
  sources: string;
};

export type TFailedCall = {
  reason: string;
  callerId: string;
};

export type AppStatus = {
  sorceDn: string | null;
  connected: boolean;
  keymap?: string[];
  callQueue?: string[];
  currentParticipants?: CallParticipant[];
  wavSource?: string;
  failedCalls?: TFailedCall[];
  devices?: DNDevice[];
  activeDeviceId?: string;
  currentCalls?: CurrentCall[];
  wsConnected: boolean;
  aiModeOn?: boolean;
  aiStreamMode?: number;
};

export type TCustomIVRConfig = {
  keyCommands: string[];
  wavSource?: string;
  aiStreamMode?: StreamMode;
  aiModeOn: boolean;
};

export enum StreamMode {
  Echo,
  AiChat,
}

export type TAiIntegrationConfig = {
  streamMode: StreamMode;
};

export enum CallRequestStatus {
  Failed = -1,
  Rejected = 0,
  Success = 1,
}

export type CallControlParticipantAction =
  | typeof PARTICIPANT_CONTROL_DROP
  | typeof PARTICIPANT_CONTROL_ANSWER
  | typeof PARTICIPANT_CONTROL_DIVERT
  | typeof PARTICIPANT_CONTROL_ROUTE_TO
  | typeof PARTICIPANT_CONTROL_TRANSFER_TO
  | typeof PARTICIPANT_CONTROL_ATTACH_DATA;

export interface DeviceModel extends DNDevice {
  currentCalls: Map<number, CurrentCall>;
}

export interface CurrentCall {
  participantId: CallParticipant['id'];
  callid: CallParticipant['callid'];
  legid: CallParticipant['legid'];
  party: CallParticipant['party_caller_id'];
  status: CallParticipant['status'];
  name: CallParticipant['party_caller_name'];
  directControll: CallParticipant['direct_control'];
}

export interface DNInfo {
  dn?: string | null;
  type?: string | null;
  devices?: DNDevice[] | null;
  participants?: CallParticipant[] | null;
}

export interface DNDevice {
  dn?: string | null;
  device_id?: string | null;
  user_agent?: string | null;
}

export interface CallParticipant {
  id?: number;
  status?: string | null;
  party_caller_name?: string | null;
  party_dn?: string | null;
  party_caller_id?: string | null;
  device_id?: string | null;
  party_dn_type?: string | null;
  direct_control?: boolean;
  callid?: number;
  legid?: number;
  dn?: string | null;
}

export interface ExtendedParticipant extends CallParticipant {
  streamCancelationToken?: CancelationToken;
  flushChunksToken?: CancelationToken;
  recognizeStream?: Pumpify;
  dtmfHandlingInProcess?: boolean;
  stream?: WritableStreamDefaultWriter<unknown>;
}

export interface CallControlResultResponse {
  finalstatus?: CallRequestStatus;
  reason?: string | null;
  result?: ExtendedParticipant;
  reasontext?: string | null;
}

export type WSEvent = {
  sequence: number;
  event: {
    event_type: EventType;
    entity: string;
    attached_data: WebSocketResponse;
  };
};

export enum EventType {
  Upset,
  Remove,
  DTMFstring,
  PromptPlaybackFinished,
}

export type DnInfoModel = {
  dn?: string | null;
  type?: string | null;
  devices: Map<string, DNDevice>;
  participants: Map<string, ExtendedParticipant>;
};

export type CallControl = {
  callcontrol: Map<string, DnInfoModel>;
};
