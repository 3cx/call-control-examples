import { AppStatus } from './types/externalAppTypes';

export const getStatusFunc = () => {
  const getStatus = async () => {
    const response: Promise<AppStatus> = fetch(
      `${process.env.REACT_APP_SERVER_BASE}/api/status?appId=2`,
      {
        method: 'GET',
      },
    )
      .then((res) => res.json())
      .catch((err) => console.error(err));
    return (await response) || null;
  };

  return getStatus;
};

export function stringifyError(error: any) {
  return `[${error.errorCode + ' '}${error.name ?? 'Unknown Error'}]: ${error.message || ''}`;
}
