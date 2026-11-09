/**
 * Runtime renderer detection and factory.
 * Uses WebGL2 on desktop, Canvas on mobile for better stability.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let _cachedRendererInfo = null;
let _rendererTypeOverride = null;
/**
 * Detect if running on a mobile device
 */
export function isMobileDevice() {
    if (typeof window === "undefined")
        return false;
    const ua = navigator.userAgent || navigator.vendor || window.opera || "";
    // Check for mobile user agents
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    // Also check for touch capability + small screen as backup
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    return mobileRegex.test(ua) || (hasTouch && isSmallScreen);
}
/**
 * Force a specific renderer type (for testing)
 */
export function setRendererOverride(type) {
    _rendererTypeOverride = type;
    _cachedRendererInfo = null; // Clear cache
    console.log(`[RendererFactory] Renderer override set to: ${type || "auto"}`);
}
/**
 * Check if device is in portrait (vertical) orientation
 */
export function isPortraitMode() {
    if (typeof window === "undefined")
        return false;
    return window.innerHeight > window.innerWidth;
}
/**
 * Get the current renderer info
 */
export function getRendererInfo() {
    if (_cachedRendererInfo)
        return _cachedRendererInfo;
    const isMobile = isMobileDevice();
    // Always use webgl2 renderer for all devices
    const type = _rendererTypeOverride || "webgl2";
    _cachedRendererInfo = {
        type,
        isMobile,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown"
    };
    console.log(`[RendererFactory] Detected: ${type} (mobile: ${isMobile}, portrait: ${isPortraitMode()})`);
    return _cachedRendererInfo;
}
/**
 * Get the renderer type to use
 */
export function getRendererType() {
    return getRendererInfo().type;
}
/**
 * Load the appropriate Rive module based on renderer type
 */
export function loadRiveModule() {
    return __awaiter(this, void 0, void 0, function* () {
        const rendererType = getRendererType();
        console.log(`[RendererFactory] Loading Rive module: ${rendererType}`);
        if (rendererType === "canvas") {
            const module = yield import("@rive-app/canvas-advanced");
            return { default: module.default, type: "canvas" };
        }
        else {
            const module = yield import("@rive-app/webgl2-advanced");
            return { default: module.default, type: "webgl2" };
        }
    });
}
