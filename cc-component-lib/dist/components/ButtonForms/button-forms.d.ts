type BtnFormProps = {
    type: "button" | "submit";
    disabled: boolean;
    label: string;
    isLoading: boolean;
    onBtnClick?: (...args: any[]) => void;
};
export declare const ButtonForms: React.FC<BtnFormProps>;
export {};
