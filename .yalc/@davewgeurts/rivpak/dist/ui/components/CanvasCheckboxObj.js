/**
 * Canvas Checkbox Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent } from "../base/BaseUIComponent";
import { UIEventBus } from "../base/UIEventBus";
import { UIEventType } from "../base/UIEventTypes";
export class CanvasCheckboxObj extends BaseUIComponent {
    constructor(config) {
        // Set default dimensions
        const sizes = {
            small: 16,
            medium: 20,
            large: 24
        };
        const size = config.size || 'medium';
        const boxSize = sizes[size];
        if (!config.width) {
            config.width = config.label ? boxSize + 8 + 100 : boxSize + 4;
        }
        if (!config.height) {
            config.height = Math.max(boxSize + 4, 24);
        }
        // Store config temporarily in a static variable for InitComponent
        CanvasCheckboxObj._tempConfig = config;
        super(config);
        this._checked = false;
        this._indeterminate = false;
        this._labelText = null;
        // Animation
        this._checkScale = 0;
        this._targetCheckScale = 0;
        this.HandlePointerDown = (event) => {
            if (!this._enabled)
                return;
            this.BasePointerDown(event);
            // Toggle checked state
            this.setChecked(!this._checked);
        };
        this._checkboxConfig = config;
        this._size = size;
        this._boxSize = boxSize;
        this._checked = config.checked || false;
        this._indeterminate = config.indeterminate || false;
        this._value = config.value !== undefined ? config.value : config.label || true;
        this._checkmark = new PIXI.Graphics();
        this._container.addChild(this._checkmark);
        // Set initial animation state
        this._checkScale = this._checked ? 1 : 0;
        this._targetCheckScale = this._checkScale;
    }
    InitComponent() {
        // Get config from temp storage
        const config = CanvasCheckboxObj._tempConfig || this._checkboxConfig;
        // Clean up temp config
        delete CanvasCheckboxObj._tempConfig;
        // Create label if provided
        if (config && config.label) {
            const fontSize = this._size === 'small' ? this._theme.fonts.sizeSmall :
                this._size === 'large' ? this._theme.fonts.sizeLarge :
                    this._theme.fonts.size;
            this._labelText = new PIXI.Text({
                text: config.label,
                style: {
                    fontFamily: this._theme.fonts.family,
                    fontSize: fontSize,
                    fill: this._theme.colors.text,
                    align: 'left'
                }
            });
            this._labelText.anchor.set(0, 0.5);
            this._labelText.x = this._boxSize + 8;
            this._labelText.y = this.height / 2;
            this._container.addChild(this._labelText);
        }
    }
    Render() {
        // Check if graphics objects are initialized
        if (!this._graphics)
            return;
        this._graphics.clear();
        // Initialize checkmark if not already done
        if (!this._checkmark) {
            this._checkmark = new PIXI.Graphics();
            this._container.addChild(this._checkmark);
        }
        this._checkmark.clear();
        // Calculate box position
        const boxX = 2;
        const boxY = (this.height - this._boxSize) / 2;
        // Get colors
        const bgColor = this._checked || this._indeterminate ?
            this.getStateColor(this._theme.colors.primary, this._theme.colors.primaryHover, this._theme.colors.primaryActive) :
            this._theme.colors.surface;
        const borderColor = this._checked || this._indeterminate ?
            this.getStateColor(this._theme.colors.primary, this._theme.colors.primaryHover, this._theme.colors.primaryActive) :
            this.getStateColor(this._theme.colors.border, this._theme.colors.borderHover, this._theme.colors.borderFocus);
        // Draw checkbox box (using new PIXI v8 API)
        // First draw the shape
        this._graphics.roundRect(boxX, boxY, this._boxSize, this._boxSize, this._theme.borderRadius / 2 || 4);
        // Then fill it
        this._graphics.fill({ color: bgColor });
        // Redraw for stroke
        this._graphics.roundRect(boxX, boxY, this._boxSize, this._boxSize, this._theme.borderRadius / 2 || 4);
        this._graphics.stroke({ width: 2, color: borderColor });
        // Draw checkmark or indeterminate line
        if (this._checkScale > 0) {
            this._checkmark.scale.set(this._checkScale);
            if (this._indeterminate) {
                // Draw horizontal line for indeterminate (using new PIXI v8 API)
                this._checkmark.stroke({ width: 2, color: 0xFFFFFF });
                this._checkmark.moveTo(boxX + this._boxSize * 0.25, boxY + this._boxSize / 2);
                this._checkmark.lineTo(boxX + this._boxSize * 0.75, boxY + this._boxSize / 2);
            }
            else {
                // Draw checkmark (using new PIXI v8 API)
                this._checkmark.stroke({ width: 3, color: 0xFFFFFF });
                this._checkmark.moveTo(boxX + this._boxSize * 0.25, boxY + this._boxSize * 0.5);
                this._checkmark.lineTo(boxX + this._boxSize * 0.45, boxY + this._boxSize * 0.7);
                this._checkmark.lineTo(boxX + this._boxSize * 0.75, boxY + this._boxSize * 0.3);
            }
        }
        // Update label color
        if (this._labelText) {
            this._labelText.style.fill = this._enabled ?
                this._theme.colors.text :
                this._theme.colors.textDisabled;
        }
        // Set interactive area
        this._container.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
        // Set alpha for disabled state
        this._container.alpha = this._enabled ? 1.0 : 0.6;
    }
    UpdateAnimation(progress) {
        // Easing function (ease-out-back for bounce effect)
        const eased = 1 + 2.70158 * Math.pow(progress - 1, 3) + 1.70158 * Math.pow(progress - 1, 2);
        // Update check scale
        const scaleDiff = this._targetCheckScale - this._checkScale;
        this._checkScale += scaleDiff * eased;
        // Re-render to show animation
        this.Render();
    }
    /**
     * Set checked state
     */
    setChecked(checked) {
        var _a;
        if (this._checked !== checked) {
            const previousValue = this._checked;
            this._checked = checked;
            this._indeterminate = false; // Clear indeterminate when setting checked
            // Animate checkmark
            this._targetCheckScale = checked ? 1 : 0;
            this.StartAnimation();
            // Emit events
            UIEventBus.emit(UIEventBus.createEvent(checked ? UIEventType.SELECT : UIEventType.DESELECT, this, checked, previousValue));
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.CHANGE, this, checked, previousValue));
            (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this, checked, this);
            this.Render();
        }
    }
    /**
     * Get checked state
     */
    getChecked() {
        return this._checked;
    }
    /**
     * Set indeterminate state
     */
    setIndeterminate(indeterminate) {
        if (this._indeterminate !== indeterminate) {
            this._indeterminate = indeterminate;
            if (indeterminate) {
                this._checked = false;
                this._targetCheckScale = 1;
            }
            else {
                this._targetCheckScale = this._checked ? 1 : 0;
            }
            this.StartAnimation();
            this.Render();
        }
    }
    /**
     * Get indeterminate state
     */
    getIndeterminate() {
        return this._indeterminate;
    }
    /**
     * Toggle checked state
     */
    toggle() {
        this.setChecked(!this._checked);
    }
    /**
     * Get value
     */
    getValue() {
        return this._checked ? this._value : null;
    }
    /**
     * Set value (sets checked if value matches)
     */
    setValue(value) {
        if (typeof value === 'boolean') {
            this.setChecked(value);
        }
        else {
            this._value = value;
        }
    }
    /**
     * Get label text
     */
    getLabel() {
        return this._checkboxConfig.label || '';
    }
    /**
     * Set label text
     */
    setLabel(label) {
        this._checkboxConfig.label = label;
        if (this._labelText) {
            this._labelText.text = label;
        }
    }
}
