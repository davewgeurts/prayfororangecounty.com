/**
 * Runtime renderer detection and factory.
 * Uses WebGL2 on desktop, Canvas on mobile for better stability.
 */
export type RendererType = "webgl2" | "canvas";
export interface RendererInfo {
    type: RendererType;
    isMobile: boolean;
    userAgent: string;
}
/**
 * Detect if running on a mobile device
 */
export declare function isMobileDevice(): boolean;
/**
 * Force a specific renderer type (for testing)
 */
export declare function setRendererOverride(type: RendererType | null): void;
/**
 * Check if device is in portrait (vertical) orientation
 */
export declare function isPortraitMode(): boolean;
/**
 * Get the current renderer info
 */
export declare function getRendererInfo(): RendererInfo;
/**
 * Get the renderer type to use
 */
export declare function getRendererType(): RendererType;
type RiveModuleInit = (options?: {
    locateFile?: (file: string) => string;
}) => Promise<any>;
export interface RiveModuleResult {
    default: RiveModuleInit;
    type: RendererType;
}
/**
 * Load the appropriate Rive module based on renderer type
 */
export declare function loadRiveModule(): Promise<RiveModuleResult>;
export {};
