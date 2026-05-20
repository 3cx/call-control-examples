import { useQuery } from "@tanstack/react-query";
import { Dialer } from "cc-component-lib";
import { getStatusFunc } from "../../utils";
import { useCallback } from "react";
import { CallingExtensionsContract } from "../../hooks/useCti";
import { CallControlParticipantAction } from "cc-component-lib/dist/types";

interface CallScreenProps {
  cti: CallingExtensionsContract;
  phoneNumber: string;
  engagementId: number | null;
}

export const CallScreen: React.FC<CallScreenProps> = ({
  cti,
  phoneNumber,
  engagementId,
}) => {
  const { data } = useQuery({
    queryFn: getStatusFunc(),
    queryKey: ["status", "dialer"],
  });

  const onMakeCall = useCallback((dest?: string) => {
    if (dest === undefined) {
      cti.sendError(`[MakeCall] DestinationNumber is missing`);
      return Promise.reject();
    }
    return fetch(`${process.env.REACT_APP_SERVER_BASE}/api/dialing?appId=2`, {
      method: "POST",
      body: JSON.stringify({
        sources: dest,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
  }, []);
  const onDeviceSelect = useCallback((id: string) => {
    if (id === undefined) {
      cti.sendError(`[DeviceSelect] Device Id is missing`);
      return Promise.reject();
    }
    return fetch(`${process.env.REACT_APP_SERVER_BASE}/api/dialer/setdevice`, {
      method: "POST",
      body: JSON.stringify({
        activeDeviceId: id,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
  }, []);
  const onControlParticipant = useCallback(
    (operation: CallControlParticipantAction, id?: number, dest?: string) => {
      if (operation === undefined || id === undefined) {
        cti.sendError(
          `[ControlParticipant] Some of required fields are missing`
        );
        return Promise.reject();
      }
      return fetch(
        `${process.env.REACT_APP_SERVER_BASE}/api/controlcall?appId=2`,
        {
          method: "POST",
          body: JSON.stringify({
            participantId: id,
            action: operation,
            destination: dest,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
    },
    []
  );

  return (
    <Dialer
      eventSourceUrl={`${process.env.REACT_APP_SERVER_BASE}/sse`}
      devices={data?.devices ?? []}
      activeDeviceId={data?.activeDeviceId}
      phoneNumber={phoneNumber}
      sourceCallerId={data?.sorceDn!}
      onMakeCall={onMakeCall}
      onDeviceSelect={onDeviceSelect}
      onCallControlParticipant={onControlParticipant}
      extensions={cti}
      engagementId={engagementId}
    />
  );
};
