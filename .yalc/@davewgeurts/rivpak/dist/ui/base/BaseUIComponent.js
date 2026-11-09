/**
 * Base UI Component for all RivePak UI elements
 */
import * as PIXI from "pixi.js";
import { BaseCanvasObj } from "../../canvasObjects/_baseCanvasObj";
import { PIXI_LAYER, PixiController } from "../../controllers/PixiController";
import { UIThemeManager } from "./UITheme";
import { UIEventBus } from "./UIEventBus";
import { UIEventType } from "./UIEventTypes";
import { CanvasEngine } from "../../useCanvasEngine";
export class BaseUIComponent extends BaseCanvasObj {
    constructor(config) {
        super(config);
        // State
        this._enabled = true;
        this._visible = true;
        this._focused = false;
        this._hovered = false;
        this._pressed = false;
        this._value = null;
        // Validation
        this._required = false;
        this._isValid = true;
        this._validationMessage = '';
        // Animation
        this._animated = true;
        this._animationDuration = 200;
        this._animationStartTime = 0;
        this._animating = false;
        /**
         * Handle pointer down
         */
        this.HandlePointerDown = (event) => {
            this.BasePointerDown(event);
        };
        /**
         * Handle pointer up
         */
        this.HandlePointerUp = (event) => {
            var _a, _b;
            if (!this._enabled)
                return;
            const wasPressed = this._pressed;
            this._pressed = false;
            this.Render();
            if (wasPressed) {
                // Emit events
                UIEventBus.emit(UIEventBus.createEvent(UIEventType.UP, this));
                UIEventBus.emit(UIEventBus.createEvent(UIEventType.CLICK, this));
                (_a = this._onUp) === null || _a === void 0 ? void 0 : _a.call(this, this);
                (_b = this._onRelease) === null || _b === void 0 ? void 0 : _b.call(this, this);
            }
        };
        /**
         * Handle pointer over
         */
        this.HandlePointerOver = (event) => {
            var _a;
            if (!this._enabled)
                return;
            this._hovered = true;
            this.Render();
            // Emit events
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.OVER, this));
            (_a = this._onOver) === null || _a === void 0 ? void 0 : _a.call(this, this);
        };
        /**
         * Handle pointer out
         */
        this.HandlePointerOut = (event) => {
            var _a;
            if (!this._enabled)
                return;
            this._hovered = false;
            this._pressed = false;
            this.Render();
            // Emit events
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.OUT, this));
            (_a = this._onOut) === null || _a === void 0 ? void 0 : _a.call(this, this);
        };
        this._config = config;
        // Set theme
        if (typeof config.theme === 'string') {
            this._theme = UIThemeManager.GetTheme(config.theme) || UIThemeManager.Current;
        }
        else if (config.theme) {
            this._theme = config.theme;
        }
        else {
            this._theme = UIThemeManager.Current;
        }
        // Initialize state
        this._enabled = config.enabled !== false;
        this._visible = config.visible !== false;
        this._required = config.required || false;
        this._animated = config.animated !== false;
        this._animationDuration = config.animationDuration || this._theme.animation.duration;
        // Set callbacks
        this._onChange = config.onChange;
        this._onDown = config.onDown;
        this._onUp = config.onUp;
        this._onPress = config.onPress;
        this._onRelease = config.onRelease;
        this._onOver = config.onOver;
        this._onOut = config.onOut;
        this._onFocus = config.onFocus;
        this._onBlur = config.onBlur;
        // Create PIXI container and graphics
        this._container = new PIXI.Container();
        this._graphics = new PIXI.Graphics();
        this._container.addChild(this._graphics);
        // Add to PIXI stage
        const pixiLayer = config.pixiLayer || PIXI_LAYER.ABOVE;
        PixiController.get().GetPixiInstance(pixiLayer).stage.addChild(this._container);
        // Set position and size
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 100;
        this.height = config.height || 40;
        // Initialize component
        this.InitComponent();
        // Setup interaction
        if (this._enabled) {
            this.SetupInteraction();
        }
        // Initial render
        this.Render();
    }
    /**
     * Setup interaction handlers
     */
    SetupInteraction() {
        this._container.eventMode = 'static';
        this._container.cursor = 'pointer';
        // Mouse/touch events
        this._container.on('pointerdown', this.HandlePointerDown, this);
        this._container.on('pointerup', this.HandlePointerUp, this);
        this._container.on('pointerupoutside', this.HandlePointerUp, this);
        this._container.on('pointerover', this.HandlePointerOver, this);
        this._container.on('pointerout', this.HandlePointerOut, this);
    }
    /**
     * Remove interaction handlers
     */
    RemoveInteraction() {
        this._container.eventMode = 'none';
        this._container.cursor = 'default';
        this._container.off('pointerdown', this.HandlePointerDown, this);
        this._container.off('pointerup', this.HandlePointerUp, this);
        this._container.off('pointerupoutside', this.HandlePointerUp, this);
        this._container.off('pointerover', this.HandlePointerOver, this);
        this._container.off('pointerout', this.HandlePointerOut, this);
    }
    // A method, not a field, so subclasses that override HandlePointerDown can still reach it.
    BasePointerDown(event) {
        var _a, _b;
        if (!this._enabled)
            return;
        this._pressed = true;
        this.Render();
        // Emit events
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.DOWN, this));
        (_a = this._onDown) === null || _a === void 0 ? void 0 : _a.call(this, this);
        (_b = this._onPress) === null || _b === void 0 ? void 0 : _b.call(this, this);
    }
    /**
     * Get component value
     */
    getValue() {
        return this._value;
    }
    /**
     * Set component value
     */
    setValue(value) {
        var _a;
        const previousValue = this._value;
        this._value = value;
        // Emit change event
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.CHANGE, this, value, previousValue));
        (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this, value, this);
        // Re-render
        this.Render();
    }
    /**
     * Enable/disable component
     */
    setEnabled(enabled) {
        this._enabled = enabled;
        if (enabled) {
            this.SetupInteraction();
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.ENABLE, this));
        }
        else {
            this.RemoveInteraction();
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.DISABLE, this));
        }
        this.Render();
    }
    /**
     * Show/hide component
     */
    setVisible(visible) {
        this._visible = visible;
        this._container.visible = visible;
        UIEventBus.emit(UIEventBus.createEvent(visible ? UIEventType.SHOW : UIEventType.HIDE, this));
    }
    /**
     * Validate component
     */
    validate() {
        if (this._required) {
            const value = this.getValue();
            if (value === null || value === undefined || value === '' ||
                (typeof value === 'string' && value.trim() === '')) {
                this._isValid = false;
                this._validationMessage = 'This field is required';
            }
            else {
                this._isValid = true;
                this._validationMessage = '';
            }
        }
        else {
            this._isValid = true;
            this._validationMessage = '';
        }
        // Emit validation event
        UIEventBus.emit(UIEventBus.createEvent(this._isValid ? UIEventType.VALID : UIEventType.INVALID, this, this._isValid, !this._isValid, { message: this._validationMessage }));
        this.Render();
        return this._isValid;
    }
    /**
     * Update component - called by CanvasEngine
     */
    Update(time, frameCount, onceSecond) {
        var _a;
        if (!this._visible)
            return;
        // Handle animations
        if (this._animating) {
            const elapsed = Date.now() - this._animationStartTime;
            const progress = Math.min(elapsed / this._animationDuration, 1);
            this.UpdateAnimation(progress);
            if (progress >= 1) {
                this._animating = false;
                UIEventBus.emit(UIEventBus.createEvent(UIEventType.ANIMATION_END, this));
            }
        }
        // Update container position
        if ((_a = CanvasEngine.get().EngineSettings) === null || _a === void 0 ? void 0 : _a.autoScale) {
            const scale = CanvasEngine.get().CurrentCanvasScale;
            this._container.x = this.x * scale;
            this._container.y = this.y * scale;
            this._container.scale.set(scale, scale);
        }
        else {
            this._container.x = this.x;
            this._container.y = this.y;
        }
    }
    /**
     * Update animation - override in subclasses for custom animations
     */
    UpdateAnimation(progress) {
        // Default: no animation
    }
    /**
     * Get the PIXI container for this component
     */
    getContainer() {
        return this._container;
    }
    /**
     * Start an animation
     */
    StartAnimation() {
        if (this._animated) {
            this._animating = true;
            this._animationStartTime = Date.now();
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.ANIMATION_START, this));
        }
    }
    /**
     * Set theme
     */
    setTheme(theme) {
        if (typeof theme === 'string') {
            this._theme = UIThemeManager.GetTheme(theme) || UIThemeManager.Current;
        }
        else {
            this._theme = theme;
        }
        this.Render();
    }
    /**
     * Get current state color based on interaction state
     */
    getStateColor(baseColor, hoverColor, activeColor) {
        if (this._pressed)
            return activeColor;
        if (this._hovered)
            return hoverColor;
        return baseColor;
    }
    /**
     * Dispose component
     */
    Dispose() {
        // Remove interaction
        this.RemoveInteraction();
        // Clear event listeners
        UIEventBus.clearComponentListeners(this);
        // Remove from PIXI stage
        if (this._container.parent) {
            this._container.parent.removeChild(this._container);
        }
        // Destroy PIXI objects
        this._graphics.destroy();
        this._container.destroy();
        // Call parent dispose
        super.Dispose();
    }
}
