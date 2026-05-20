import {
  APP_TYPE_CUSTOM_IVR,
  APP_TYPE_DIALER,
  APP_TYPE_OUTBOUND_CAMPAIGN,
  PARTICIPANT_CONTROL_ANSWER,
  PARTICIPANT_CONTROL_ATTACH_DATA,
  PARTICIPANT_CONTROL_DIVERT,
  PARTICIPANT_CONTROL_DROP,
  PARTICIPANT_CONTROL_ROUTE_TO,
  PARTICIPANT_CONTROL_TRANSFER_TO,
} from './constants';
export type TFailedCall = {
  reason: string;
  callerId: string;
};

export type AppStatus = {
  sorceDn: string | null;
  connected: boolean;
  keymap?: string[];
  callQueue: string[];
  failedCalls?: TFailedCall[];
  currentParticipants: CallParticipant[];
  wavSource?: string;
  devices?: DNDevice[];
  activeDeviceId?: string;
  currentCalls: CurrentCall[];
  wsConnected: boolean;
  aiModeOn?: boolean;
  aiStreamMode?: number;
};

export type AppError = {
  errorCode: number;
  name: string;
  message: string;
};

export type CallControlParticipantAction =
  | typeof PARTICIPANT_CONTROL_DROP
  | typeof PARTICIPANT_CONTROL_ANSWER
  | typeof PARTICIPANT_CONTROL_DIVERT
  | typeof PARTICIPANT_CONTROL_ROUTE_TO
  | typeof PARTICIPANT_CONTROL_TRANSFER_TO
  | typeof PARTICIPANT_CONTROL_ATTACH_DATA;

export interface CurrentCall {
  participantId: CallParticipant['id'];
  callid: CallParticipant['callid'];
  legid: CallParticipant['legid'];
  party: CallParticipant['party_caller_id'];
  status: CallParticipant['status'];
  name: CallParticipant['party_caller_name'];
  directControll: CallParticipant['direct_control'];
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

export type ConnectFormProps = {
  appType: typeof APP_TYPE_OUTBOUND_CAMPAIGN | typeof APP_TYPE_CUSTOM_IVR | typeof APP_TYPE_DIALER;
};

export interface DNDevice {
  dn?: string | null;
  device_id?: string | null;
  user_agent?: string | null;
}
