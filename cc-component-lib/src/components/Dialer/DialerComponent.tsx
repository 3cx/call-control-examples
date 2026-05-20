import {
  PARTICIPANT_CONTROL_ANSWER,
  PARTICIPANT_CONTROL_DROP,
  PARTICIPANT_CONTROL_TRANSFER_TO,
  PARTICIPANT_STATUS_CONNECTED,
  PARTICIPANT_STATUS_DIALING,
  PARTICIPANT_STATUS_RINGING,
} from "../../constants";
import { Select } from "../Select/SelectComponent";
import {
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  CallControlParticipantAction,
  CallingExtensionsContract,
  CurrentCall,
  DNDevice,
} from "../../types";
import { CallActions } from "../CallActions/CallActions";
import { TransferComponent } from "../TransferComponent/TransferComponent";
import { BackSpaceBtn } from "../BackSpaceBtn/BackSpaceBtnComponent";
import { Spinner } from "../Spinner/SpinnerComponent";

export interface DialerProps {
  eventSourceUrl: string;
  devices: DNDevice[];
  activeDeviceId?: string;
  phoneNumber?: string;
  sourceCallerId: string;
  onMakeCall: (dest?: string) => Promise<Response>;
  onDeviceSelect: (id: string) => Promise<Response>;
  onCallControlParticipant: (
    action: CallControlParticipantAction,
    participantid?: number,
    dest?: string
  ) => Promise<Response>;
  extensions?: CallingExtensionsContract;
  engagementId?: number | null;
}

export enum DialerState {
  Idle,
  Dialing,
  Ringing,
  Connected,
}

function callStateReducer(
  state: CurrentCall | undefined,
  action: {
    type: "full_update" | "attach_data";
    newState?: CurrentCall;
    attachedData?: CurrentCall["attachedData"];
  }
): CurrentCall | undefined {
  switch (action.type) {
    case "full_update": {
      if (action.newState !== undefined) {
        return {
          ...action.newState,
          attachedData: {
            ...action.newState.attachedData,
            ...(state?.attachedData || []), // we keep old attached data because it can contain hubspot data
          },
        };
      } else {
        return undefined;
      }
    }
    case "attach_data": {
      if (action.attachedData !== undefined && state !== undefined) {
        return {
          ...state,
          attachedData: action.attachedData,
        };
      } else {
        return state;
      }
    }
  }
}

export const Dialer: React.FC<DialerProps> = ({
  eventSourceUrl,
  onDeviceSelect,
  devices,
  onMakeCall,
  onCallControlParticipant,
  activeDeviceId,
  phoneNumber,
  extensions,
  sourceCallerId,
  engagementId,
}) => {
  const [dialedNumber, setDialed] = useState(phoneNumber ?? "");
  const [dialerState, setState] = useState(DialerState.Idle);
  const [currentCalls, setCurrentCalls] = useState<CurrentCall[]>([]);
  const [callState, dispatchCallState] = useReducer(
    callStateReducer,
    undefined
  );

  const [ccOpertation, setCCOperation] = useState<
    CallControlParticipantAction | undefined
  >(undefined);
  const [operationDestination, setOperationDestination] = useState("");

  const [isOperationInProcess, setIsOperationInProccess] = useState(false);
  const [performingAnswer, setPerformingAnswer] = useState(false);
  const [switchingDevice, setSwitchingDevice] = useState(false);
  const [isForceDropEnabled, setEnableForceDrop] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const endCallTimeout = useRef<number | null>(null);
  const allowDropTimeout = useRef<number | null>(null);

  useEffect(() => {
    const source = new EventSource(eventSourceUrl);
    source.onopen = () => {
      console.log("EventSource Connected");
      extensions?.initialized({
        isLoggedIn: true,
        sizeInfo: { width: 400, height: 600 },
        engagementId,
      });
    };
    source.onerror = console.error;
    source.onmessage = function (e) {
      try {
        const data = JSON.parse(e.data);
        setCurrentCalls(data.currentCalls);
      } catch (e) {
        extensions?.sendError({
          message: "Failed to parse JSON from EventSource",
        });
      }
    };
    return () => source.close();
  }, []);

  useEffect(() => {
    if (dialerState === DialerState.Idle) {
      if (phoneNumber && phoneNumber.length > 0) {
        handleCallAnswer(phoneNumber);
      }
    }
  }, [phoneNumber]);

  useEffect(() => {
    dispatchCallState({
      type: "attach_data",
      attachedData: { engagementId },
    });
  }, [engagementId]);

  useEffect(() => {
    const connectedCall = currentCalls?.find(
      (call) => call.status === PARTICIPANT_STATUS_CONNECTED
    );
    const incomingCall = currentCalls?.find(
      (call) => call.status === PARTICIPANT_STATUS_RINGING
    );
    const outgoingCall = currentCalls?.find(
      (call) => call.status === PARTICIPANT_STATUS_DIALING
    );

    if (connectedCall && dialerState !== DialerState.Connected) {
      if (dialerState === DialerState.Dialing) {
        extensions?.callAnswered(); // hubspot outgoing call answered notify
      }
      setDialerState(DialerState.Connected);

      dispatchCallState({ type: "full_update", newState: connectedCall });
    }

    if (outgoingCall && !callState) {
      dispatchCallState({ type: "full_update", newState: outgoingCall });
      if (dialerState !== DialerState.Dialing) {
        setDialerState(DialerState.Dialing);
      }
      extensions?.outgoingCall({
        //hubspot outgoing call notify
        toNumber: outgoingCall.party || "",
        createEngagement: true,
        fromNumber: sourceCallerId,
      });
    }

    if (incomingCall && !callState && dialerState === DialerState.Idle) {
      setDialerState(DialerState.Ringing);
      dispatchCallState({ type: "full_update", newState: incomingCall });
    }
    const validCall = currentCalls.find((call) => {
      if (call.callid && call.legid && callState?.callid && callState.legid) {
        const callId = call?.callid + call?.legid;
        return callId === callState.callid + callState.legid;
      }
      return undefined;
    });
    if (
      validCall === undefined &&
      callState !== undefined &&
      dialerState !== DialerState.Idle
    ) {
      const callEndStatus =
        callState.status === PARTICIPANT_STATUS_CONNECTED
          ? "COMPLETED"
          : "CANCELED";
      extensions?.callEnded({
        callEndStatus,
      });
      extensions?.callCompleted({
        engagementId: callState.attachedData.engagementId,
        engagementProperties: {
          hs_call_status: callEndStatus,
        },
      }); // Hubspot call completed

      setDialerState(DialerState.Idle);
      dispatchCallState({ type: "full_update", newState: undefined });
    }
  }, [
    dialerState,
    setDialerState,
    dispatchCallState,
    callState,
    currentCalls,
    setCurrentCalls,
    extensions,
  ]);

  const renderButtons = () => {
    const content: ReactNode[] = [];
    for (let i = 1; i <= 12; i++) {
      let symbol: string | number = "";
      if (i < 10) {
        symbol = i;
      } else if (i === 10) {
        symbol = "*";
      } else if (i === 11) {
        symbol = 0;
      } else if (i === 12) {
        symbol = "#";
      }
      content.push(
        <button
          onClick={() => setDialed((prev) => prev + symbol)}
          className="btn-dialer"
          key={i}
        >
          {symbol}
        </button>
      );
    }
    return content;
  };

  const onCallControlAction = useCallback(
    (action: CallControlParticipantAction) => {
      setOperationDestination("");
      if (ccOpertation) {
        setCCOperation(undefined);
      } else {
        setCCOperation(action);
      }
    },
    [setOperationDestination, ccOpertation, setCCOperation]
  );

  const handleCallControlParticipant = useCallback(async () => {
    if (!ccOpertation) {
      return;
    }
    setIsOperationInProccess(true);
    try {
      await onCallControlParticipant(
        ccOpertation,
        callState?.participantId,
        operationDestination
      );
    } catch (e) {
    } finally {
      setCCOperation(undefined);
      setIsOperationInProccess(false);
    }
  }, [
    ccOpertation,
    setCCOperation,
    setIsOperationInProccess,
    operationDestination,
    onCallControlParticipant,
    callState,
  ]);

  const handleActiveDevice = useCallback(
    async (id: string) => {
      setSwitchingDevice(true);
      try {
        await onDeviceSelect(id);
      } catch (e) {
      } finally {
        setSwitchingDevice(false);
        setDialerState(DialerState.Idle);
        dispatchCallState({ type: "full_update", newState: undefined });
      }
    },
    [onDeviceSelect]
  );

  const handleOnDrop = async () => {
    setEnableForceDrop(false);
    try {
      await onCallControlParticipant(
        PARTICIPANT_CONTROL_DROP,
        callState?.participantId
      );
    } catch (e) {
      setDialerState(DialerState.Idle);
    } finally {
      if (isOperationInProcess) {
        setOperationDestination("");
        setIsOperationInProccess(false);
        setCCOperation(undefined);
      }
    }
  };

  const handleCallAnswer = async (phoneNumber?: string) => {
    const isIncoming = callState?.status === PARTICIPANT_STATUS_RINGING;

    if (isIncoming && callState.directControll) {
      setPerformingAnswer(true);
      try {
        await onCallControlParticipant(
          PARTICIPANT_CONTROL_ANSWER,
          callState.participantId
        );
      } catch (e) {
      } finally {
        setPerformingAnswer(false);
      }
    } else if (phoneNumber?.length || dialedNumber.length) {
      try {
        await onMakeCall(phoneNumber || dialedNumber);
        setDialed("");
        if (dialerState !== DialerState.Dialing) {
          setDialerState(DialerState.Dialing);
          allowDropTimeout.current = setTimeout(() => {
            setEnableForceDrop(true);
            if (currentCalls.length === 0) {
              endCallTimeout.current = setTimeout(() => {
                if (currentCalls.length === 0) {
                  setDialerState(DialerState.Idle);
                }
              }, 300000);
            }
          }, 5000);
        }
      } catch (e) {
        setDialerState(DialerState.Idle);
        if (allowDropTimeout.current) {
          clearTimeout(allowDropTimeout.current);
        }
        if (endCallTimeout.current) {
          clearTimeout(endCallTimeout.current);
        }
      }
    }
  };

  function setDialerState(state: DialerState) {
    setState(state);
    if (endCallTimeout.current) {
      clearTimeout(endCallTimeout.current);
    }
    if (allowDropTimeout.current) {
      clearTimeout(allowDropTimeout.current);
    }
  }

  const renderStateNumber = () => {
    switch (dialerState) {
      case DialerState.Idle:
        return (
          <div className="flex justify-center items-end">
            <input
              ref={inputRef}
              className="bg-transparent focus:outline-none text-center"
              value={dialedNumber}
              onChange={(e) => setDialed(e.target.value)}
            ></input>
          </div>
        );
      case DialerState.Dialing:
      case DialerState.Connected:
      case DialerState.Ringing: {
        return (
          <div className="flex flex-col items-center justify-end">
            <span>
              {callState?.party ? (
                <div className="flex flex-col gap-2">
                  <span className="text-center">{callState.party}</span>
                  <span
                    className={`flex items-center gap-1 font-bold text-sm animate-pulse ${
                      dialerState === DialerState.Connected
                        ? "text-green-500"
                        : "text-yellow-400"
                    }`}
                  >
                    <svg
                      className={`w-[12px] h-[12px] ${
                        dialerState === DialerState.Connected
                          ? "fill-green-500"
                          : "fill-yellow-400"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                    </svg>
                    {dialerState === DialerState.Connected
                      ? "Connected"
                      : "Dialing"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="animate-pulse font-bold text-sm text-white"></span>
                  <Spinner />
                </div>
              )}
            </span>
            {callState?.name && <span>{callState.name}</span>}
          </div>
        );
      }
    }
  };

  return (
    <div className="w-[400px] h-[600px] bg-darkBg flex flex-col">
      <div>
        {devices && (
          <Select
            data={devices}
            selectedId={activeDeviceId}
            onSelect={handleActiveDevice}
          />
        )}
      </div>
      <div
        className="h-2/5 text-white font-bold text-xl grid grid-rows-2"
        onClick={() => inputRef.current?.focus()}
      >
        {renderStateNumber()}
        {dialerState === DialerState.Idle && (
          <div className="flex justify-end items-center">
            <BackSpaceBtn
              onClickBS={() =>
                setDialed(dialedNumber.substring(0, dialedNumber.length - 1))
              }
            />
          </div>
        )}
        {dialerState !== DialerState.Idle && ccOpertation !== undefined && (
          <TransferComponent
            inputRef={inputRef}
            onOperation={handleCallControlParticipant}
            onPerformingOperation={isOperationInProcess}
            destinationNumber={operationDestination}
            setDestinationNumber={setOperationDestination}
            label={
              ccOpertation === PARTICIPANT_CONTROL_TRANSFER_TO
                ? "Transfer to:"
                : "Divert to:"
            }
          />
        )}
      </div>
      {dialerState === DialerState.Idle ? (
        <div className="h-3/5 border-t-2 border-b-2 border-darklight grid grid-cols-3 text-white text-center font-bold text-lg">
          {renderButtons()}
        </div>
      ) : (
        <CallActions
          onCallAction={onCallControlAction}
          state={dialerState}
          initializing={!callState}
        />
      )}
      <div className="h-1/6 flex flex-row">
        {(dialerState === DialerState.Idle ||
          dialerState === DialerState.Ringing) && (
          <div className="flex justify-center items-center w-full">
            <button
              type="button"
              disabled={
                switchingDevice ||
                performingAnswer ||
                (callState !== undefined
                  ? callState.directControll !== true
                  : false)
              }
              onClick={() => handleCallAnswer()}
              className="flex justify-center items-center w-full h-full bg-green-500 hover:bg-green-700 disabled:bg-gray-400"
            >
              <svg
                fill="white"
                className="w-[25px] h-[25px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
              </svg>
            </button>
          </div>
        )}
        {dialerState !== DialerState.Idle && (
          <div className="flex justify-center items-center w-full">
            <button
              disabled={
                (switchingDevice ||
                  (dialerState === DialerState.Dialing &&
                    callState === undefined)) &&
                !isForceDropEnabled
              }
              onClick={() => handleOnDrop()}
              className="flex justify-center items-center w-full h-full bg-red-500 hover:bg-red-700 disabled:bg-gray-400"
            >
              <svg
                fill="white"
                className="w-[25px] h-[25px] rotate-[133deg]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
