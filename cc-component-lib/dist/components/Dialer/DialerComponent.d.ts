import { CallControlParticipantAction, CallingExtensionsContract, DNDevice } from '../../types';

export interface DialerProps {
    eventSourceUrl: string;
    devices: DNDevice[];
    activeDeviceId?: string;
    phoneNumber?: string;
    sourceCallerId: string;
    onMakeCall: (dest?: string) => Promise<Response>;
    onDeviceSelect: (id: string) => Promise<Response>;
    onCallControlParticipant: (action: CallControlParticipantAction, participantid?: number, dest?: string) => Promise<Response>;
    extensions?: CallingExtensionsContract;
    engagementId?: number | null;
}
export declare enum DialerState {
    Idle = 0,
    Dialing = 1,
    Ringing = 2,
    Connected = 3
}
export declare const Dialer: React.FC<DialerProps>;
