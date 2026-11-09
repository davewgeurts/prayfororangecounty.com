import type { ShareButtonsConfig } from '../types/daily.js';
import './ShareButtons.css';
export interface ShareButtonsProps extends ShareButtonsConfig {
    date: string;
    punchline: string;
}
export declare const ShareButtons: ({ date, punchline, siteUrl, siteName, quoteAuthorFallback, sharePrefix, shareText, emailSubject, }: ShareButtonsProps) => import("react").JSX.Element;
