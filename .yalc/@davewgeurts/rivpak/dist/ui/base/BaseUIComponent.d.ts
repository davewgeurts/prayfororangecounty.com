/**
 * Base UI Component for all RivePak UI elements
 */
import * as PIXI from "pixi.js";
import { BaseCanvasObj, CanvasObjectDef } from "../../canvasObjects/_baseCanvasObj";
import { UITheme } from "./UITheme";
import { ChangeCallback, InteractionCallback } from "./UIEventTypes";
export interface UIComponentConfig extends CanvasObjectDef {
    enabled?: boolean;
    visible?: boolean;
    theme?: string | UITheme;
    required?: boolean;
    validationMessage?: string;
    onChange?: ChangeCallback;
    onDown?: InteractionCallback;
    onUp?: InteractionCallback;
    onPress?: InteractionCallback;
    onRelease?: InteractionCallback;
    onOver?: InteractionCallback;
    onOut?: InteractionCallback;
    onFocus?: InteractionCallback;
    onBlur?: InteractionCallback;
    animated?: boolean;
    animationDuration?: number;
}
export declare abstract class BaseUIComponent extends BaseCanvasObj {
    protected _container: PIXI.Container;
    protected _graphics: PIXI.Graphics;
    protected _theme: UITheme;
    protected _config: UIComponentConfig;
    protected _enabled: boolean;
    protected _visible: boolean;
    protected _focused: boolean;
    protected _hovered: boolean;
    protected _pressed: boolean;
    protected _value: any;
    protected _required: boolean;
    protected _isValid: boolean;
    protected _validationMessage: string;
    protected _animated: boolean;
    protected _animationDuration: number;
    protected _animationStartTime: number;
    protected _animating: boolean;
    protected _onChange?: ChangeCallback;
    protected _onDown?: InteractionCallback;
    protected _onUp?: InteractionCallback;
    protected _onPress?: InteractionCallback;
    protected _onRelease?: InteractionCallback;
    protected _onOver?: InteractionCallback;
    protected _onOut?: InteractionCallback;
    protected _onFocus?: InteractionCallback;
    protected _onBlur?: InteractionCallback;
    constructor(config: UIComponentConfig);
    /**
     * Initialize the component - override in subclasses
     */
    protected abstract InitComponent(): void;
    /**
     * Render the component - override in subclasses
     */
    protected abstract Render(): void;
    /**
     * Setup interaction handlers
     */
    protected SetupInteraction(): void;
    /**
     * Remove interaction handlers
     */
    protected RemoveInteraction(): void;
    /**
     * Handle pointer down
     */
    protected HandlePointerDown: (event: PIXI.FederatedPointerEvent) => void;
    protected BasePointerDown(event: PIXI.FederatedPointerEvent): void;
    /**
     * Handle pointer up
     */
    protected HandlePointerUp: (event: PIXI.FederatedPointerEvent) => void;
    /**
     * Handle pointer over
     */
    protected HandlePointerOver: (event: PIXI.FederatedPointerEvent) => void;
    /**
     * Handle pointer out
     */
    protected HandlePointerOut: (event: PIXI.FederatedPointerEvent) => void;
    /**
     * Get component value
     */
    getValue(): any;
    /**
     * Set component value
     */
    setValue(value: any): void;
    /**
     * Enable/disable component
     */
    setEnabled(enabled: boolean): void;
    /**
     * Show/hide component
     */
    setVisible(visible: boolean): void;
    /**
     * Validate component
     */
    validate(): boolean;
    /**
     * Update component - called by CanvasEngine
     */
    Update(time: number, frameCount: number, onceSecond: boolean): void;
    /**
     * Update animation - override in subclasses for custom animations
     */
    protected UpdateAnimation(progress: number): void;
    /**
     * Get the PIXI container for this component
     */
    getContainer(): PIXI.Container;
    /**
     * Start an animation
     */
    protected StartAnimation(): void;
    /**
     * Set theme
     */
    setTheme(theme: string | UITheme): void;
    /**
     * Get current state color based on interaction state
     */
    protected getStateColor(baseColor: number, hoverColor: number, activeColor: number): number;
    /**
     * Dispose component
     */
    Dispose(): void;
}
