import { Dialer } from 'cc-component-lib';
import { APP_TYPE_DIALER } from '../constants';
import AppStatus from './app-status';
import Instructions from './instructions';
import { useQuery } from '@tanstack/react-query';
import { controlParticipantRequest, getStatusFunc, makeCallRequest, selectDevice } from '../shared';
import { useCallback } from 'react';
import { CallControlParticipantAction } from '../types';

export default function DialerApp() {
  const { data } = useQuery({
    queryFn: getStatusFunc(APP_TYPE_DIALER),
    queryKey: ['status', APP_TYPE_DIALER]
  });

  const onMakeCall = useCallback((dest?: string) => makeCallRequest(APP_TYPE_DIALER, dest), []);

  const onDeviceSelect = useCallback((id: string) => selectDevice(id), []);

  const onControlParticipant = useCallback(
    (action: CallControlParticipantAction, participantId?: number, dest?: string) =>
      controlParticipantRequest(APP_TYPE_DIALER, action, participantId, dest),
    []
  );

  return (
    <div className="pt-6 pb-8 mb-4 flex flex-row gap-10 my-2">
      <div className="flex w-1/2">
        <Dialer
          eventSourceUrl={`${import.meta.env.VITE_SERVER_BASE}/sse`}
          devices={data?.devices ?? []}
          activeDeviceId={data?.activeDeviceId}
          sourceCallerId={data!.sorceDn!}
          onMakeCall={onMakeCall}
          onDeviceSelect={onDeviceSelect}
          onCallControlParticipant={onControlParticipant}
        />
      </div>
      <div className="flex flex-col gap-5 w-1/2">
        <Instructions
          appType={APP_TYPE_DIALER}
          text="This application mimics a simple Dialer. You may use it like a physical phone device. You are also free to choose which device you will select for call handling from the list."
        />
        <AppStatus appType={APP_TYPE_DIALER} />
      </div>
    </div>
  );
}
