import {
  PARTICIPANT_CONTROL_DIVERT,
  PARTICIPANT_CONTROL_TRANSFER_TO,
} from "../../constants";
import { DialerState } from "../Dialer/DialerComponent";
import { CallControlParticipantAction } from "../../types";

type CallActionsProps = {
  state: DialerState;
  onCallAction: (action: CallControlParticipantAction) => void;
  initializing: boolean;
};

export const CallActions: React.FC<CallActionsProps> = ({
  onCallAction,
  state,
  initializing,
}) => {
  return (
    <div className="h-3/5 border-t-2 border-b-2 border-darklight grid grid-cols-3 text-white text-center font-bold text-lg">
      <button
        className="btn-dialer"
        disabled={state !== DialerState.Ringing || initializing}
        onClick={() => onCallAction(PARTICIPANT_CONTROL_DIVERT)}
      >
        <svg
          className="h-[35px] w-[35px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
        >
          <path
            fill="white"
            d="M232 0c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-39 39 58.7 58.7C282.3 152.4 300.8 160 320 160s37.7-7.6 51.3-21.3L503 7c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L405.3 172.7C382.6 195.3 352 208 320 208s-62.6-12.7-85.3-35.3L176 113.9l-39 39c-6.9 6.9-17.2 8.9-26.2 5.2s-14.8-12.5-14.8-22.2V24c0-13.3 10.7-24 24-24H232zM51.4 489.9l-35.4-62c-9.7-16.9-8.3-38.1 5.5-51.7C72.6 325.9 178.1 256 320 256s247.4 69.9 298.5 120.2c13.9 13.6 15.2 34.8 5.5 51.7l-35.4 62c-7.4 12.9-22.7 19.1-37 14.8L438.8 470.8c-13.5-4.1-22.8-16.5-22.8-30.6V384c-62.3-20.8-129.7-20.8-192 0v56.2c0 14.1-9.3 26.6-22.8 30.6L88.4 504.7c-14.3 4.3-29.6-1.8-37-14.8z"
          />
        </svg>
        <span>Divert</span>
      </button>
      <button
        onClick={() => onCallAction(PARTICIPANT_CONTROL_TRANSFER_TO)}
        className="btn-dialer"
        disabled={state !== DialerState.Connected || initializing}
      >
        <svg
          className="h-[35px] w-[35px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
        >
          <path
            d="M26.74 10.6c-1.35-1.44-2.73-2.84-4.11-4.25-.42-.42-.95-.4-1.45-.2-.51.21-.67.65-.67 1.18v2.01c-.81 0-.79.05-1.5-.02-.75-.07-1.26.23-1.76.78-3.37 3.76-6.77 7.48-10.13 11.24-.37.41-.75.59-1.29.57-1.03-.04.29-.02-.75-.01-.87.02-.95.1-.96 1.02-.01.77-.01 1.54 0 2.3.02.83.1.93.9.93 1.67 0 .98-.02 2.65.01.5.01.84-.16 1.18-.53 3.41-3.8 6.87-7.58 10.26-11.4.66-.74.58-.69 1.41-.56 0 .66.01 1.29 0 1.91-.01.56.18 1.01.71 1.23.52.22 1.03.18 1.44-.24 1.35-1.37 2.69-2.74 4.02-4.14.46-.5.5-1.34.05-1.83zM5.03 13.14c1.17-.04-.19.03.98-.03.66-.03 1.12.16 1.55.69.75.91 1.58 1.76 2.41 2.69 1.05-1.19 2.02-2.28 3.06-3.45-1.35-1.49-2.61-2.91-3.91-4.3-.18-.19-.53-.3-.81-.3-1.97-.03-1.4-.01-3.38-.02-.56 0-.83.24-.83.82.01 1.01.01 2.01 0 3.01-.01.67.3.91.93.89z"
            fill="white"
          />
        </svg>
        <span>Transfer</span>
      </button>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
