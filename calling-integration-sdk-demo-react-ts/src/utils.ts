import { AppStatus } from "./types/externalAppTypes";

export const getStatusFunc = () => {
  const getStatus = async () => {
    const response: Promise<AppStatus> = fetch(
      `${process.env.REACT_APP_SERVER_BASE}/api/status?appId=2`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));
    return (await response) || null;
  };

  return getStatus;
};