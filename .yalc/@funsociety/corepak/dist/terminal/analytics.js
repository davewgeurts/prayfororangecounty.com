// No built-in default: each site supplies its own GA4 ID. Without one, events omit
// send_to and gtag delivers them to whatever tag the page itself configured.
let activeMeasurementId;
export function initGA4(measurementId) {
    activeMeasurementId = measurementId;
    if (typeof window === "undefined" || typeof document === "undefined")
        return;
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
        window.gtag = function gtag(...args) {
            window.dataLayer?.push(args);
        };
    }
    const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (!existing) {
        const script = document.createElement("script");
        script.async = true;
        script.src = scriptSrc;
        document.head.appendChild(script);
    }
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
}
function withSendTo(params, measurementId) {
    return measurementId ? { ...params, send_to: measurementId } : params;
}
export function trackPageView(path, title, measurementId = activeMeasurementId) {
    if (typeof window === "undefined" || typeof window.gtag !== "function")
        return;
    window.gtag("event", "page_view", withSendTo({
        page_path: path,
        page_location: window.location.href,
        page_title: title ?? document.title,
    }, measurementId));
}
export function trackEvent(eventName, params, measurementId = activeMeasurementId) {
    if (typeof window === "undefined" || typeof window.gtag !== "function")
        return;
    window.gtag("event", eventName, withSendTo({ ...params }, measurementId));
}
