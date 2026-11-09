/**
 * Canvas Button Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent } from "../base/BaseUIComponent";
import { UIEventBus } from "../base/UIEventBus";
import { UIEventType } from "../base/UIEventTypes";
export class CanvasButtonObj extends BaseUIComponent {
    constructor(config) {
        // Set default dimensions based on size
        if (!config.width || !config.height) {
            switch (config.size || 'medium') {
                case 'small':
                    config.width = config.width || 80;
                    config.height = config.height || 32;
                    break;
                case 'large':
                    config.width = config.width || 140;
                    config.height = config.height || 48;
                    break;
                default: // medium
                    config.width = config.width || 100;
                    config.height = config.height || 40;
            }
        }
        // Store config temporarily in a static variable
        CanvasButtonObj._tempConfig = config;
        super(config);
        this.HandlePointerDown = (event) => {
            var _a, _b;
            if (!this._enabled)
                return;
            (_a = this._parentHandlePointerDown) === null || _a === void 0 ? void 0 : _a.call(this, event);
            // Fire onPress callback if provided
            if ((_b = this._buttonConfig) === null || _b === void 0 ? void 0 : _b.onPress) {
                this._buttonConfig.onPress(this);
            }
            // Start press animation
            this._targetScale = 0.95;
            this.StartAnimation();
        };
        this.HandlePointerUp = (event) => {
            var _a, _b;
            if (!this._enabled)
                return;
            const wasPressed = this._pressed;
            // Handle toggle
            if (this._toggle && wasPressed) {
                this.setSelected(!this._selected);
            }
            (_a = this._parentHandlePointerUp) === null || _a === void 0 ? void 0 : _a.call(this, event);
            // Fire onRelease callback if provided and button was pressed
            if (wasPressed && ((_b = this._buttonConfig) === null || _b === void 0 ? void 0 : _b.onRelease)) {
                this._buttonConfig.onRelease(this);
            }
            // Start release animation
            this._targetScale = 1.0;
            this.StartAnimation();
        };
        this.HandlePointerOver = (event) => {
            var _a;
            if (!this._enabled)
                return;
            (_a = this._parentHandlePointerOver) === null || _a === void 0 ? void 0 : _a.call(this, event);
            // Start hover animation
            if (!this._pressed) {
                this._targetScale = 1.05;
                this.StartAnimation();
            }
        };
        this.HandlePointerOut = (event) => {
            var _a;
            if (!this._enabled)
                return;
            (_a = this._parentHandlePointerOut) === null || _a === void 0 ? void 0 : _a.call(this, event);
            // Start unhover animation
            this._targetScale = 1.0;
            this.StartAnimation();
        };
        // Store parent method references before child overrides
        this._parentHandlePointerDown = this.HandlePointerDown;
        this._parentHandlePointerUp = this.HandlePointerUp;
        this._parentHandlePointerOver = this.HandlePointerOver;
        this._parentHandlePointerOut = this.HandlePointerOut;
        // Initialize all properties after super
        this._text = null;
        this._buttonText = config.text || '';
        this._buttonConfig = config;
        this._variant = config.variant || 'primary';
        this._size = config.size || 'medium';
        this._fontSize = config.fontSize;
        this._toggle = config.toggle || false;
        this._selected = config.selected || false;
        this._value = config.value !== undefined ? config.value : config.text;
        this._currentScale = 1;
        this._targetScale = 1;
        // Override base onClick if provided
        if (config.onClick) {
            this._onPress = config.onClick;
        }
    }
    InitComponent() {
        // Get config from temp storage (set in constructor before super)
        const config = CanvasButtonObj._tempConfig;
        if (!config || !config.text) {
            console.error('CanvasButtonObj: No text provided in config', config);
            return;
        }
        // Store values for later use
        if (!this._buttonText)
            this._buttonText = config.text;
        if (!this._variant)
            this._variant = config.variant || 'primary';
        if (!this._size)
            this._size = config.size || 'medium';
        // Get size from config
        const size = config.size || 'medium';
        // Clean up temp config after we're done with it
        delete CanvasButtonObj._tempConfig;
        // Create text
        // Use explicit fontSize if provided, otherwise use size-based defaults
        const fontSize = config.fontSize ||
            (size === 'small' ? this._theme.fonts.sizeSmall :
                size === 'large' ? this._theme.fonts.sizeLarge :
                    this._theme.fonts.size);
        this._text = new PIXI.Text({
            text: config.text,
            style: {
                fontFamily: this._theme.fonts.family,
                fontSize: fontSize,
                fontWeight: 'bold',
                fill: this.getTextColor(),
                align: 'center'
            }
        });
        // Center text
        this._text.anchor.set(0.5, 0.5);
        this._text.x = this.width / 2;
        this._text.y = this.height / 2;
        this._container.addChild(this._text);
    }
    Render() {
        this._graphics.clear();
        // Get colors based on state and variant
        const bgColor = this.getBackgroundColor();
        const borderColor = this.getBorderColor();
        const textColor = this.getTextColor();
        // Draw rounded rectangle with fill and/or stroke
        // In PIXI v8, we need to define the shape first, then fill/stroke it
        this._graphics.roundRect(0, 0, this.width, this.height, this._theme.borderRadius || 8);
        // Apply fill for non-ghost variants
        if (this._variant !== 'ghost' && this._variant !== 'outline') {
            this._graphics.fill({ color: bgColor });
        }
        // Apply stroke for outline and ghost variants
        if (this._variant === 'outline' || this._variant === 'ghost') {
            // Need to redraw the shape for stroke
            this._graphics.roundRect(0, 0, this.width, this.height, this._theme.borderRadius || 8);
            this._graphics.stroke({ width: this._theme.borderWidth || 2, color: borderColor });
        }
        // Update text color
        if (this._text) {
            this._text.style.fill = textColor;
            // Add subtle shadow for better readability
            if (this._variant === 'primary' || this._variant === 'secondary') {
                this._text.style.dropShadow = {
                    color: 0x000000,
                    alpha: 0.1,
                    blur: 2,
                    distance: 1,
                    angle: Math.PI / 4
                };
            }
            else {
                this._text.style.dropShadow = false;
            }
        }
        // Set interactive area
        this._container.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
        // Apply scale for animation
        this._container.scale.set(this._currentScale);
        // Adjust opacity for disabled state
        this._container.alpha = this._enabled ? 1.0 : 0.5;
    }
    getBackgroundColor() {
        if (!this._enabled)
            return this._theme.colors.disabled;
        switch (this._variant) {
            case 'primary':
                if (this._toggle && this._selected)
                    return this._theme.colors.primaryActive;
                return this.getStateColor(this._theme.colors.primary, this._theme.colors.primaryHover, this._theme.colors.primaryActive);
            case 'secondary':
                if (this._toggle && this._selected)
                    return this._theme.colors.secondaryActive;
                return this.getStateColor(this._theme.colors.secondary, this._theme.colors.secondaryHover, this._theme.colors.secondaryActive);
            case 'outline':
            case 'ghost':
                if (this._pressed || (this._toggle && this._selected)) {
                    return this._theme.colors.surface;
                }
                return this._hovered ? this._theme.colors.surfaceHover : 0x000000;
            default:
                return this._theme.colors.primary;
        }
    }
    getBorderColor() {
        if (!this._enabled)
            return this._theme.colors.disabled;
        if (this._toggle && this._selected) {
            return this._variant === 'outline' ?
                this._theme.colors.primaryActive :
                this._theme.colors.border;
        }
        return this.getStateColor(this._theme.colors.border, this._theme.colors.borderHover, this._theme.colors.borderFocus);
    }
    getTextColor() {
        if (!this._enabled)
            return this._theme.colors.textDisabled;
        switch (this._variant) {
            case 'primary':
            case 'secondary':
                return 0xFFFFFF; // Always white on colored backgrounds
            case 'outline':
            case 'ghost':
                if (this._toggle && this._selected) {
                    return this._theme.colors.primary;
                }
                return this._pressed ?
                    this._theme.colors.primary :
                    this._theme.colors.text;
            default:
                return this._theme.colors.text;
        }
    }
    UpdateAnimation(progress) {
        // Easing function (ease-out-cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        // Update scale
        const scaleDiff = this._targetScale - this._currentScale;
        this._currentScale += scaleDiff * eased;
        // Apply scale
        this._container.scale.set(this._currentScale);
    }
    /**
     * Set button text
     */
    setText(text) {
        this._buttonText = text;
        if (this._buttonConfig) {
            this._buttonConfig.text = text;
        }
        if (this._text) {
            this._text.text = text;
        }
    }
    /**
     * Get button text
     */
    getText() {
        var _a;
        return ((_a = this._buttonConfig) === null || _a === void 0 ? void 0 : _a.text) || this._buttonText || '';
    }
    /**
     * Set button font size
     */
    setFontSize(fontSize) {
        this._fontSize = fontSize;
        if (this._buttonConfig) {
            this._buttonConfig.fontSize = fontSize;
        }
        if (this._text) {
            this._text.style.fontSize = fontSize;
        }
    }
    /**
     * Get button font size
     */
    getFontSize() {
        return this._fontSize;
    }
    /**
     * Set selected state (for toggle buttons)
     */
    setSelected(selected) {
        var _a;
        if (!this._toggle)
            return;
        const previousValue = this._selected;
        this._selected = selected;
        if (previousValue !== selected) {
            UIEventBus.emit(UIEventBus.createEvent(selected ? UIEventType.SELECT : UIEventType.DESELECT, this, selected, previousValue));
            // Also emit change event
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.CHANGE, this, selected, previousValue));
            (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this, selected, this);
        }
        this.Render();
    }
    /**
     * Get selected state
     */
    getSelected() {
        return this._selected;
    }
    /**
     * Override getValue for toggle buttons
     */
    getValue() {
        if (this._toggle) {
            return this._selected;
        }
        return this._value;
    }
}
