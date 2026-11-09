import type { DailyContent, DailyManifest, DailyReflection, DailyContentOptions } from '../types/daily.js';
export declare function formatDateKey(date: Date, timeZone?: string): string;
export declare function getToday(timeZone?: string): string;
export declare function getTodayDateStr(timeZone?: string): string;
export declare function getAdjacentDate(dates: string[], current: string, direction: 'prev' | 'next'): string | null;
export declare function fetchManifest(options?: DailyContentOptions): Promise<DailyManifest>;
export declare function fetchAvailableDates(options?: DailyContentOptions): Promise<string[]>;
export declare function fetchDailyContent(dateStr: string, fallbackOrOptions?: DailyReflection | DailyContentOptions): Promise<DailyContent>;
export interface DailyContentFetcher {
    (dateStr: string): Promise<DailyContent>;
    fetchManifest: () => Promise<DailyManifest>;
    fetchAvailableDates: () => Promise<string[]>;
    fetchDailyContent: (dateStr: string) => Promise<DailyContent>;
    getToday: () => string;
    getTodayDateStr: () => string;
    formatDateKey: (date: Date) => string;
    getAdjacentDate: (dates: string[], current: string, direction: 'prev' | 'next') => string | null;
}
export declare function createDailyContentFetcher(fallbackOrOptions?: DailyReflection | DailyContentOptions): DailyContentFetcher;
