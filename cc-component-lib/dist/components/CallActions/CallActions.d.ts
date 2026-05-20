import { DialerState } from '../Dialer/DialerComponent';
import { CallControlParticipantAction } from '../../types';

type CallActionsProps = {
    state: DialerState;
    onCallAction: (action: CallControlParticipantAction) => void;
    initializing: boolean;
};
export declare const CallActions: React.FC<CallActionsProps>;
export {};
