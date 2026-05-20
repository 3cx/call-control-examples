import {
  PARTICIPANT_CONTROL_ANSWER,
  PARTICIPANT_CONTROL_ATTACH_DATA,
  PARTICIPANT_CONTROL_DIVERT,
  PARTICIPANT_CONTROL_DROP,
  PARTICIPANT_CONTROL_ROUTE_TO,
  PARTICIPANT_CONTROL_TRANSFER_TO,
} from "./constants";

export interface DNDevice {
  dn?: string | null;
  device_id?: string | null;
  user_agent?: string | null;
}
export type CallControlParticipantAction =
  | typeof PARTICIPANT_CONTROL_DROP
  | typeof PARTICIPANT_CONTROL_ANSWER
  | typeof PARTICIPANT_CONTROL_DIVERT
  | typeof PARTICIPANT_CONTROL_ROUTE_TO
  | typeof PARTICIPANT_CONTROL_TRANSFER_TO
  | typeof PARTICIPANT_CONTROL_ATTACH_DATA;

export interface CurrentCall {
  participantId: CallParticipant["id"];
  callid: CallParticipant["callid"];
  legid: CallParticipant["legid"];
  party: CallParticipant["party_caller_id"];
  status: CallParticipant["status"];
  name: CallParticipant["party_caller_name"];
  directControll: CallParticipant["direct_control"];
  attachedData: any;
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

export interface CallingExtensionsContract {
  initialized: (userData: unknown) => void;
  userAvailable: () => void;
  userUnavailable: () => void;
  userLoggedIn: () => void;
  userLoggedOut: () => void;
  incomingCall: (callDetails: CallInfo) => void;
  outgoingCall: (callDetails: CallInfo) => void;
  callAnswered: () => void;
  callData: (data: unknown) => void;
  callEnded: (engagementData: unknown) => void;
  callCompleted: (callCompletedData: unknown) => void;
  sendError: (errorData: unknown) => void;
  resizeWidget: (sizeInfo: unknown) => void;
  sendMessage: (message: unknown) => void;
  logDebugMessage: (messageData: unknown) => void;
}
interface CallInfo {
  callStartTime?: number; // in milliseconds
  createEngagement: true; // whether HubSpot should create an engagement for this call
  toNumber: string; // Required: The recipient's number
  fromNumber: string; // Required: The caller's number
}
