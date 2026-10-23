interface OutsideClickHandlerProps {
    ref: React.RefObject<HTMLElement | null>;
    handler: () => void;
}
declare const useOutsideClick: ({ ref, handler }: OutsideClickHandlerProps) => void;
export default useOutsideClick;
