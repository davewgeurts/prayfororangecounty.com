/**
 * Canvas Joystick Component
 * A simple virtual joystick for touch/mouse input
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
export interface JoystickConfig extends UIComponentConfig {
    /** Outer circle radius (default: 50) */
    outerRadius?: number;
    /** Inner thumb radius (default: 20) */
    innerRadius?: number;
    /** Outer circle color */
    outerColor?: number;
    /** Outer circle alpha */
    outerAlpha?: number;
    /** Inner thumb color */
    innerColor?: number;
    /** Inner thumb alpha */
    innerAlpha?: number;
    /** Border color */
    borderColor?: number;
    /** Border width */
    borderWidth?: number;
    /** Called continuously while dragging with normalized x,y (-1 to 1) */
    onMove?: (x: number, y: number) => void;
    /** Called when joystick is released */
    onRelease?: () => void;
    /** Whether to snap back to center on release (default: true) */
    snapBack?: boolean;
    /** Dead zone radius as percentage (0-1, default: 0.1) */
    deadZone?: number;
}
export interface JoystickValue {
    x: number;
    y: number;
    angle: number;
    distance: number;
}
export declare class CanvasJoystickObj extends BaseUIComponent {
    private _joystickConfig;
    private _outerRadius;
    private _innerRadius;
    private _outerColor;
    private _outerAlpha;
    private _innerColor;
    private _innerAlpha;
    private _borderColor;
    private _borderWidth;
    private _snapBack;
    private _deadZone;
    private _outerCircle;
    private _innerCircle;
    private _isDragging;
    private _thumbX;
    private _thumbY;
    private _normalizedX;
    private _normalizedY;
    private _onMove?;
    private _onJoystickRelease?;
    constructor(config: JoystickConfig);
    protected InitComponent(): void;
    private setupGlobalListeners;
    private removeGlobalListeners;
    private handleGlobalPointerMove;
    private handleGlobalPointerUp;
    private doJoystickRelease;
    private updateThumbPositionFromGlobal;
    protected Render(): void;
    protected HandlePointerDown: (event: PIXI.FederatedPointerEvent) => void;
    protected HandlePointerUp: (event: PIXI.FederatedPointerEvent) => void;
    protected HandlePointerOver: (event: PIXI.FederatedPointerEvent) => void;
    protected HandlePointerOut: (event: PIXI.FederatedPointerEvent) => void;
    private updateThumbPosition;
    /**
     * Get current joystick value
     */
    getValue(): JoystickValue;
    /**
     * Get normalized X value (-1 to 1)
     */
    getX(): number;
    /**
     * Get normalized Y value (-1 to 1)
     */
    getY(): number;
    /**
     * Check if joystick is currently being dragged
     */
    isDragging(): boolean;
    /**
     * Reset joystick to center position
     */
    reset(): void;
    /**
     * Set outer circle color
     */
    setOuterColor(color: number, alpha?: number): void;
    /**
     * Set inner thumb color
     */
    setInnerColor(color: number, alpha?: number): void;
    Dispose(): void;
}
