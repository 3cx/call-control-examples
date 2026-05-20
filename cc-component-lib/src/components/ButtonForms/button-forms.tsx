import { Spinner } from "../Spinner/SpinnerComponent";

type BtnFormProps = {
  type: "button" | "submit";
  disabled: boolean;
  label: string;
  isLoading: boolean;
  onBtnClick?: (...args: any[]) => void;
};

export const ButtonForms: React.FC<BtnFormProps> = ({
  type,
  disabled,
  label,
  isLoading,
  onBtnClick,
}: BtnFormProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onBtnClick}
      type={type}
      className="flex justify-center items-center rounded w-[150px] h-[45px] bg-gray-800 hover:bg-gray-700 text-white disabled:bg-gray-400 disabled:text-gray-600"
    >
      {isLoading ? <Spinner /> : label}
    </button>
  );
};
