import { useEffect, useRef, useState } from "react";
import useOutsideClick from "../../hooks";
import { DNDevice } from "../../types";

interface SelectProps {
  title?: string;
  data: DNDevice[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  title = "Select",
  data,
  selectedId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: selectRef,
    handler: () => setIsOpen(false),
  });
  const [selectedItem, setSelected] = useState<DNDevice | undefined>(
    selectedId ? data.find((item) => item.device_id === selectedId) : undefined
  );

  const handleChange = (item: DNDevice) => {
    setSelected(item);
    onSelect && onSelect(item.device_id!);
    setIsOpen(false);
  };

  useEffect(() => {
    if (selectedId && data) {
      const newSelected = data.find((item) => item.device_id === selectedId);
      newSelected && setSelected(newSelected);
    } else {
      setSelected(undefined);
    }
  }, [selectedId, data]);

  return (
    <div
      ref={selectRef}
      className="w-full relative inline-block text-left bg-darklight"
    >
      <div className="group">
        <button
          type="button"
          className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedItem?.user_agent || title}</span>
          <svg
            className="w-4 h-4 ml-2 -mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
          </svg>
        </button>
        {isOpen && (
          <ul className="absolute w-full left-0 origin-top-left bg-darklight text-white divide-y divide-gray-100 shadow-lg">
            {data?.map((item) => (
              <li
                key={item.device_id}
                onClick={() => handleChange(item)}
                className="block px-4 py-2 text-sm text-white-600 cursor-pointer border-none hover:bg-bghover"
              >
                {item.user_agent}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
