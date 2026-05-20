import { BackSpaceBtn } from "../BackSpaceBtn/BackSpaceBtnComponent";
import { Spinner } from "../Spinner/SpinnerComponent";

type TransferComponentProps = {
  onPerformingOperation: boolean;
  onOperation: () => void;
  inputRef: React.Ref<HTMLInputElement>;
  destinationNumber: string;
  setDestinationNumber: (num: string) => void;
  label: string;
};

export const TransferComponent: React.FC<TransferComponentProps> = ({
  onPerformingOperation: performingTransfer,
  onOperation: onTransfer,
  inputRef,
  destinationNumber: transferNumber,
  setDestinationNumber: setTransferNumber,
  label,
}) => {
  return (
    <div className="flex gap-2 items-center justify-center text-sm py-5">
      <label htmlFor="tranferField" className="text-sm">
        {label}
      </label>
      <input
        id="transferField"
        ref={inputRef}
        className="focus:outline-none text-center h-[34px] bg-transparent border-b border-darklight"
        value={transferNumber}
        onChange={(e) => setTransferNumber(e.target.value)}
      ></input>
      <BackSpaceBtn
        onClickBS={() =>
          setTransferNumber(
            transferNumber.substring(0, transferNumber.length - 1)
          )
        }
      />
      <button
        disabled={transferNumber.length < 1 || performingTransfer}
        className="bg-green-500 p-2 rounded-md disabled:bg-gray-400"
        onClick={() => onTransfer()}
      >
        {performingTransfer ? <Spinner /> : "Proceed"}
      </button>
    </div>
  );
};
