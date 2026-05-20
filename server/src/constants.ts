export const PARTICIPANT_TYPE_UPDATE = 'participants';

export enum AppType {
  CustomIvr,
  Campaign,
  Dialer,
  AiIntegration,
}

export const PARTICIPANT_STATUS_CONNECTED = 'Connected';
export const PARTICIPANT_STATUS_DIALING = 'Dialing';

// methods of call control participant
export const PARTICIPANT_CONTROL_DROP = 'drop';
export const PARTICIPANT_CONTROL_ANSWER = 'answer';
export const PARTICIPANT_CONTROL_DIVERT = 'divert';
export const PARTICIPANT_CONTROL_ROUTE_TO = 'routeto';
export const PARTICIPANT_CONTROL_TRANSFER_TO = 'transferto';
export const PARTICIPANT_CONTROL_ATTACH_DATA = 'attach_participant_data';

export const UNREGISTERED_DEVICE_ID = 'not_registered_dev';

export const BAD_REQUEST = 'Bad Request';
export const INTERNAL_SERVER_ERROR = 'Internal Server Error';
export const NOT_FOUND = 'Not Found';

//ws
export const MAX_WS_RECONNECT_TIMES = 10;
export const WS_CLOSE_REASON_TERMINATE = 'TERMINATE';
export const WS_CLOSE_REASON_RETRY = 'RETRY';

//fail call reasons
export const CAMPAIGN_SOURCE_BUSY = 'Campaign source is busy, please finish campaign and try again';
export const NO_SOURCE_OR_DISCONNECTED = 'Application is disconnected or source DN is not found';
export const UNKNOWN_CALL_ERROR = 'The call has been failed due to unexpected reason';
