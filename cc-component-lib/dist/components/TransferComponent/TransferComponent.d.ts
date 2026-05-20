type TransferComponentProps = {
    onPerformingOperation: boolean;
    onOperation: () => void;
    inputRef: React.Ref<HTMLInputElement>;
    destinationNumber: string;
    setDestinationNumber: (num: string) => void;
    label: string;
};
export declare const TransferComponent: React.FC<TransferComponentProps>;
export {};
