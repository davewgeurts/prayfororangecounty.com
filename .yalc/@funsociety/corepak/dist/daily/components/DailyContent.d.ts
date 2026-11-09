import type { DailyContent as DailyContentType, DailyContentConfig } from '../types/daily.js';
import './DailyContent.css';
export interface DailyContentProps extends DailyContentConfig {
    content: DailyContentType;
    onPrev: (() => void) | null;
    onNext: (() => void) | null;
    availableDates: string[];
    onSelectDate: (date: string) => void;
    onFavoriteToggle?: () => void;
    config?: DailyContentConfig;
}
export declare const DailyContent: ({ content, onPrev, onNext, availableDates, onSelectDate, onFavoriteToggle, config: contentConfig, imageAltPrefix, imageAltBuilder, firstSpeaker, secondSpeaker, punchlineSpeaker, shareConfig, }: DailyContentProps) => import("react").JSX.Element;
