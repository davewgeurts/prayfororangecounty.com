import type { TopicEntry, TopicCategory } from '../types/daily.js';
import './ShowTopics.css';
export type { TopicEntry, TopicCategory };
export interface ShowTopicsProps {
    categories?: TopicCategory[];
    title?: string;
    subtitle?: string;
    buttonLabel?: string;
    filterFutureDates?: boolean;
    emptyErrorMessage?: string;
    onBack?: () => void;
}
export declare const ShowTopics: React.FC<ShowTopicsProps>;
