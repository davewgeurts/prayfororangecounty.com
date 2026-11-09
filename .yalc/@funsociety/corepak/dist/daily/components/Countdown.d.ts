import './Countdown.css';
export interface CountdownProps {
    onMidnight?: () => void;
    label?: string;
}
export declare const Countdown: ({ onMidnight, label }: CountdownProps) => import("react").JSX.Element;
