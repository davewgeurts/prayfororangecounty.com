declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}
export declare function initGA4(measurementId: string): void;
export declare function trackPageView(path: string, title?: string, measurementId?: string | undefined): void;
export declare function trackEvent(eventName: string, params?: Record<string, string | number | boolean>, measurementId?: string | undefined): void;
