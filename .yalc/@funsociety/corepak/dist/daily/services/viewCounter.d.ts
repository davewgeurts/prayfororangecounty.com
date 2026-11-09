import type { ViewStats } from '../types/daily.js';
export type { ViewStats };
export declare function getSessionId(): string;
export declare function hasViewedDate(date: string): boolean;
export declare function clearSession(): void;
export declare function registerView(date: string): Promise<boolean>;
export declare function fetchStats(date: string): Promise<ViewStats | null>;
export declare function resetAllData(): Promise<boolean>;
export declare function sendHeartbeat(date: string): Promise<void>;
