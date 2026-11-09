import { config } from '../config.js';
const DEFAULT_DAILY_BASE = '/daily';
const DEFAULT_TIMEZONE = 'America/Denver';
const contentCache = new Map();
function isDailyReflection(val) {
    return Boolean(val && typeof val === 'object' && 'dialogue' in val);
}
function resolveOptions(fallbackOrOptions) {
    if (!fallbackOrOptions)
        return {};
    if (isDailyReflection(fallbackOrOptions)) {
        return { fallbackReflection: fallbackOrOptions };
    }
    return fallbackOrOptions;
}
function getVersion(options) {
    const isDev = options?.isDev ?? config.isDev;
    const buildId = options?.buildId ?? config.buildId;
    return isDev ? `t=${Date.now()}` : `v=${buildId}`;
}
export function formatDateKey(date, timeZone = DEFAULT_TIMEZONE) {
    return date.toLocaleDateString('en-CA', { timeZone });
}
export function getToday(timeZone = DEFAULT_TIMEZONE) {
    return formatDateKey(new Date(), timeZone);
}
export function getTodayDateStr(timeZone = DEFAULT_TIMEZONE) {
    return getToday(timeZone);
}
export function getAdjacentDate(dates, current, direction) {
    const idx = dates.indexOf(current);
    if (idx === -1)
        return null;
    if (direction === 'prev' && idx > 0)
        return dates[idx - 1];
    if (direction === 'next' && idx < dates.length - 1)
        return dates[idx + 1];
    return null;
}
export async function fetchManifest(options) {
    const base = options?.dailyBase ?? DEFAULT_DAILY_BASE;
    const filterFuture = options?.filterFutureDates ?? !(options?.allowFutureDates ?? false);
    const res = await fetch(`${base}/manifest.json?${getVersion(options)}`, { cache: 'no-cache' });
    if (!res.ok)
        throw new Error('Failed to load manifest');
    const manifest = await res.json();
    if (!filterFuture) {
        return manifest;
    }
    const today = getToday(options?.timeZone);
    return {
        ...manifest,
        dates: manifest.dates.filter((d) => d <= today),
    };
}
export async function fetchAvailableDates(options) {
    const manifest = await fetchManifest(options);
    return manifest.dates;
}
export async function fetchDailyContent(dateStr, fallbackOrOptions) {
    const options = resolveOptions(fallbackOrOptions);
    const base = options.dailyBase ?? DEFAULT_DAILY_BASE;
    const isDev = options.isDev ?? config.isDev;
    const allowFuture = options.allowFutureDates ?? (options.filterFutureDates === false);
    if (!allowFuture && dateStr > getToday(options.timeZone)) {
        throw new Error(`Content for ${dateStr} is not available yet`);
    }
    const cacheKey = `${base}:${dateStr}`;
    if (!isDev) {
        const cached = contentCache.get(cacheKey);
        if (cached)
            return cached;
    }
    const v = getVersion(options);
    try {
        const res = await fetch(`${base}/${dateStr}/dialogue.json?${v}`, { cache: 'no-cache' });
        if (!res.ok)
            throw new Error(`Failed to load content for ${dateStr}`);
        const dialogue = await res.json();
        const content = {
            date: dateStr,
            dialogue,
            imageUrl: `${base}/${dateStr}/image.webp?${v}`,
        };
        contentCache.set(cacheKey, content);
        return content;
    }
    catch (err) {
        if (options.fallbackReflection) {
            return {
                date: dateStr,
                dialogue: options.fallbackReflection.dialogue,
                imageUrl: options.fallbackReflection.imageUrl || `${base}/${dateStr}/image.webp?${v}`,
            };
        }
        throw err;
    }
}
export function createDailyContentFetcher(fallbackOrOptions) {
    const options = resolveOptions(fallbackOrOptions);
    const fetcher = ((dateStr) => fetchDailyContent(dateStr, options));
    fetcher.fetchManifest = () => fetchManifest(options);
    fetcher.fetchAvailableDates = () => fetchAvailableDates(options);
    fetcher.fetchDailyContent = (dateStr) => fetchDailyContent(dateStr, options);
    fetcher.getToday = () => getToday(options.timeZone);
    fetcher.getTodayDateStr = () => getTodayDateStr(options.timeZone);
    fetcher.formatDateKey = (date) => formatDateKey(date, options.timeZone);
    fetcher.getAdjacentDate = getAdjacentDate;
    return fetcher;
}
