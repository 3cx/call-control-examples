import { DNDevice } from '../../types';

interface SelectProps {
    title?: string;
    data: DNDevice[];
    selectedId?: string;
    onSelect?: (id: string) => void;
}
export declare const Select: React.FC<SelectProps>;
export {};
