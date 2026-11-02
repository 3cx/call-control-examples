type BtnFormProps = {
    type: 'button' | 'submit';
    disabled: boolean;
    label: string;
    isLoading: boolean;
    onBtnClick?: React.MouseEventHandler<HTMLButtonElement>;
};
export declare const ButtonForms: React.FC<BtnFormProps>;
export {};
