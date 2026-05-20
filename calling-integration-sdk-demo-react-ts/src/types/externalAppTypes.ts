export interface AppStatus {
  sorceDn: string | null;
  connected: boolean;
  keymap?: string[];
  callQueue: string[];
  currentParticipants: CallParticipant[];
  wavSource?: string;
  devices?: DNDevice[];
  activeDeviceId?: string;
  currentCalls: CurrentCall[];
  wsConnected: boolean;
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
export interface DNDevice {
  dn?: string | null;
  device_id?: string | null;
  user_agent?: string | null;
}
export interface CurrentCall {
  participantId: CallParticipant["id"];
  callid: CallParticipant["callid"];
  legid: CallParticipant["legid"];
  party: CallParticipant["party_caller_id"];
  status: CallParticipant["status"];
  name: CallParticipant["party_caller_name"];
  directControll: CallParticipant["direct_control"];
  isIncoming: boolean;
}
