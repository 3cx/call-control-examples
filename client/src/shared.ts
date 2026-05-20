import { APP_TYPE_CUSTOM_IVR, APP_TYPE_DIALER, APP_TYPE_OUTBOUND_CAMPAIGN } from './constants';
import { AppError, AppStatus, CallControlParticipantAction, ConnectFormProps } from './types';

export const getStatusFunc = (appType: ConnectFormProps['appType']) => {
  const getStatus = async () => {
    const enumered = getEnumeredType(appType);
    if (enumered === undefined) {
      return Promise.reject();
    }
    const response: Promise<AppStatus> = fetch(
      `${import.meta.env.VITE_SERVER_BASE}/api/status?appId=${enumered}`,
      {
        method: 'GET'
      }
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));
    return (await response) || null;
  };

  return getStatus;
};

export function getEnumeredType(type: ConnectFormProps['appType']) {
  switch (type) {
    case APP_TYPE_CUSTOM_IVR:
      return '0';
    case APP_TYPE_OUTBOUND_CAMPAIGN:
      return '1';
    case APP_TYPE_DIALER:
      return '2';
    default:
      return undefined;
  }
}

export function controlParticipantRequest(
  appType: ConnectFormProps['appType'],
  action: CallControlParticipantAction,
  participantId?: number,
  destination?: string
): Promise<Response> {
  const enumeredType = getEnumeredType(appType);
  if (enumeredType === undefined || !participantId) {
    return Promise.reject();
  }
  return fetch(`${import.meta.env.VITE_SERVER_BASE}/api/controlcall?appId=${enumeredType}`, {
    method: 'POST',
    body: JSON.stringify({
      participantId: participantId,
      action,
      destination
    }),
    headers: {
      'Content-type': 'application/json'
    }
  });
}

export function makeCallRequest(
  appType: ConnectFormProps['appType'],
  sources?: string
): Promise<Response> {
  const enumeredType = getEnumeredType(appType);
  if (enumeredType === undefined || !sources) {
    return Promise.reject();
  }

  return fetch(`${import.meta.env.VITE_SERVER_BASE}/api/dialing?appId=${enumeredType}`, {
    method: 'POST',
    body: JSON.stringify({
      sources: sources
    }),
    headers: {
      'Content-type': 'application/json'
    }
  });
}

export function selectDevice(id: string) {
  if (id === undefined) {
    return Promise.reject();
  }
  return fetch(`${import.meta.env.VITE_SERVER_BASE}/api/dialer/setdevice`, {
    method: 'POST',
    body: JSON.stringify({
      activeDeviceId: id
    }),
    headers: {
      'Content-type': 'application/json'
    }
  });
}

export function stringifyError(error: AppError) {
  return `[${error.errorCode + ' '}${error.name ?? 'Unknown Error'}]: ${error.message || ''}`;
}

export enum DialerState {
  Idle,
  Dialing,
  Ringing,
  Connected
}
