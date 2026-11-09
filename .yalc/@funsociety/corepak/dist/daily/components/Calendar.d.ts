import './Calendar.css';
interface Props {
    availableDates: string[];
    currentDate: string;
    onSelectDate: (date: string) => void;
}
export declare const Calendar: ({ availableDates, currentDate, onSelectDate }: Props) => import("react").JSX.Element;
export {};
