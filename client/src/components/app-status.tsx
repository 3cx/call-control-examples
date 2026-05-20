import { useQuery } from '@tanstack/react-query';
import { controlParticipantRequest, getEnumeredType, getStatusFunc } from '../shared';
import { CallParticipant, ConnectFormProps, TFailedCall } from '../types';
import { useNavigate } from 'react-router-dom';
import { APP_TYPE_CUSTOM_IVR, PARTICIPANT_CONTROL_DROP } from '../constants';
import { ErrorPortal } from '../error-portal';
import { useState } from 'react';

export function TooltipNumber({ callerId, reason }: TFailedCall) {
  const [showTooltip, setShow] = useState(false);
  return (
    <div className="relative">
      <div
        className="bg-slate-600 text-white absolute bottom-5 left-2 p-1 opacity-3 rounded-md w-[200px] text-center"
        style={{ visibility: showTooltip ? 'visible' : 'hidden' }}
      >
        Reason: {reason}
      </div>
      <div
        className="font-bold text-red-500 cursor-pointer"
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {callerId}
      </div>
    </div>
  );
}

export default function AppStatus({ appType }: ConnectFormProps) {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryFn: getStatusFunc(appType),
    queryKey: ['status', appType],
    refetchInterval: 5000,
  });

  const onDisconnect = async () => {
    const enumeredType = getEnumeredType(appType);
    if (enumeredType === undefined) {
      return;
    }
    try {
      await fetch(`${import.meta.env.VITE_SERVER_BASE}/api/disconnect?appId=${enumeredType}`, {
        method: 'POST',
      });
      navigate(`/${appType}/connect`);
    } catch (err) {
      console.error(err);
    }
  };

  const onDrop = async (participantId?: number) => {
    try {
      await controlParticipantRequest(appType, PARTICIPANT_CONTROL_DROP, participantId);
    } catch (err) {
      console.error(err);
    }
  };

  function renderCurrentCall(idx: number, part?: CallParticipant) {
    return (
      <div key={idx} className="w-[200px] h-[35px] flex rounded-full items-center">
        {part?.status === 'Dialing' ? (
          <span
            className={`h-full rounded-s-lg bg-yellow-500 p-1 flex items-center gap-1 text-white font-bold`}
          >
            <svg
              fill="white"
              className="h-4 w-5 animate-bounce"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            >
              <path d="M11.7 266.3l41.9 94.3c6.1 13.7 20.8 21.3 35.5 18.4l109.2-21.8c15-3 25.7-16.1 25.7-31.4V240c62.3-20.8 129.7-20.8 192 0v85.8c0 15.3 10.8 28.4 25.7 31.4L550.9 379c14.7 2.9 29.4-4.7 35.5-18.4l41.9-94.3c7.2-16.2 5.1-35.1-7.4-47.7C570.8 168.1 464.2 96 320 96S69.2 168.1 19.1 218.6c-12.5 12.6-14.6 31.5-7.4 47.7z" />
            </svg>
            <span>Dialing</span>
          </span>
        ) : (
          <span
            className={`h-full rounded-s-lg bg-green-400 p-1 flex items-center gap-1 text-white font-bold`}
          >
            <svg
              fill="white"
              className="h-4 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" />
            </svg>
            <span>Connected</span>
          </span>
        )}
        <span className="font-bold w-full h-full flex items-center justify-center border-t-2 border-b-2 border-black-500 px-2">
          {part?.party_caller_id}
        </span>
        <button
          type="button"
          onClick={() => onDrop(part?.id)}
          className="h-full rounded-e-lg p-1 font-sans text-xs font medium bg-red-500 text-white font-bold active:scale-95"
        >
          Drop
        </button>
      </div>
    );
  }

  return (
    <div className="w-full whitespace-normal break-words rounded-lg border border-blue-gray-50 bg-white p-4 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none">
      {data?.wsConnected === false && (
        <ErrorPortal message="Experiencing problems with Websocket Connection, trying to reconnect..." />
      )}
      {appType === APP_TYPE_CUSTOM_IVR && (
        <div className="pb-8">
          <span className="block font-sans text-base font-medium leading-relaxed tracking-normal text-blue-gray-900 antialiased transition-colors hover:text-pink-500">
            Application Config
          </span>
          <span className="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased">
            AI Mode: {data?.aiModeOn ? 'enabled' : 'disabled'}
          </span>
          <span className="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased">
            Wav Source: {data?.wavSource ?? 'Empty'}
          </span>
          <span className="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased">
            DTMFS:{' '}
            {data?.keymap?.map((el, idx) => (
              <span key={idx}>
                <span className="font-bold">{idx}:</span>
                {el || ' - '}
                {'; '}
              </span>
            )) ?? 'Empty'}
          </span>
        </div>
      )}
      <div className="mb-2 flex items-center gap-3">
        <span className="block font-sans text-base font-medium leading-relaxed tracking-normal text-blue-gray-900 antialiased transition-colors hover:text-pink-500">
          Application Status
        </span>
        {data?.connected === true ? (
          <div className="center relative inline-block select-none whitespace-nowrap rounded-full bg-green-500 py-1 px-2 align-baseline font-sans text-xs font-medium capitalize leading-none tracking-wide text-white">
            <div className="mt-px">Connected</div>
          </div>
        ) : (
          <div className="center relative inline-block select-none whitespace-nowrap rounded-full bg-red-500 py-1 px-2 align-baseline font-sans text-xs font-medium capitalize leading-none tracking-wide text-white">
            <div className="mt-px">Disconnected</div>
          </div>
        )}
      </div>
      <div>
        <span className="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased">
          Application DN: {data?.sorceDn}
        </span>
        <span className="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased">
          Current Call Queue: {data?.callQueue?.join(',') ?? 'Empty'}
        </span>
        <span className="flex gap-1 font-sans text-sm font-normal leading-normal text-gray-700 antialiased">
          Failed Calls:{' '}
          {data?.failedCalls?.map((fcall, idx) => {
            return <TooltipNumber {...fcall} key={idx} />;
          }) ?? 'Empty'}
        </span>
        <div className="flex gap-1 items-center font-sans text-sm font-normal leading-normal text-gray-700 antialiased">
          Current Calls:{' '}
        </div>
        <div className="flex flex-col">
          {data?.currentParticipants?.map((part, idx) => renderCurrentCall(idx, part)) ?? 'Empty'}
        </div>
      </div>
      <button
        disabled={!data?.connected}
        className="mt-10 rounded w-[150px] h-[36px] bg-red-500 hover:bg-red-700 text-white cursor-pointer disabled:bg-gray-200 transform active:scale-95 transition-transform"
        type="button"
        onClick={() => onDisconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
