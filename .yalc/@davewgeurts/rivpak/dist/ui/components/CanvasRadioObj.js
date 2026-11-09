/**
 * Canvas Radio Button Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent } from "../base/BaseUIComponent";
import { UIEventBus } from "../base/UIEventBus";
import { UIEventType } from "../base/UIEventTypes";
export class CanvasRadioObj extends BaseUIComponent {
    constructor(config) {
        // Set default dimensions
        const sizes = {
            small: 16,
            medium: 20,
            large: 24
        };
        const size = config.size || 'medium';
        const circleSize = sizes[size];
        if (!config.width) {
            config.width = config.label ? circleSize + 8 + 100 : circleSize + 4;
        }
        if (!config.height) {
            config.height = Math.max(circleSize + 4, 24);
        }
        // Store config temporarily for InitComponent
        CanvasRadioObj._tempConfig = config;
        super(config);
        this._checked = false;
        this._labelText = null;
        // Animation
        this._innerScale = 0;
        this._targetInnerScale = 0;
        this.HandlePointerDown = (event) => {
            if (!this._enabled)
                return;
            this.BasePointerDown(event);
            // Set checked (radio buttons don't toggle off on click)
            if (!this._checked) {
                this.setChecked(true);
            }
        };
        this._radioConfig = config;
        this._size = size;
        this._circleSize = circleSize;
        this._checked = config.checked || false;
        this._value = config.value !== undefined ? config.value : config.label || true;
        this._groupName = config.groupName || '';
        this._innerCircle = new PIXI.Graphics();
        this._container.addChild(this._innerCircle);
        // Set initial animation state
        this._innerScale = this._checked ? 1 : 0;
        this._targetInnerScale = this._innerScale;
    }
    InitComponent() {
        // Get config from temp storage
        const config = CanvasRadioObj._tempConfig || this._radioConfig;
        // Clean up temp config
        delete CanvasRadioObj._tempConfig;
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
            this._labelText.x = this._circleSize + 8;
            this._labelText.y = this.height / 2;
            this._container.addChild(this._labelText);
        }
    }
    Render() {
        // Check if graphics objects are initialized
        if (!this._graphics)
            return;
        this._graphics.clear();
        // Initialize inner circle if not already done
        if (!this._innerCircle) {
            this._innerCircle = new PIXI.Graphics();
            this._container.addChild(this._innerCircle);
        }
        this._innerCircle.clear();
        // Calculate circle position
        const centerX = 2 + this._circleSize / 2;
        const centerY = this.height / 2;
        const radius = this._circleSize / 2;
        // Get colors
        const bgColor = this._checked ?
            this.getStateColor(this._theme.colors.primary, this._theme.colors.primaryHover, this._theme.colors.primaryActive) :
            this._theme.colors.surface;
        const borderColor = this._checked ?
            this.getStateColor(this._theme.colors.primary, this._theme.colors.primaryHover, this._theme.colors.primaryActive) :
            this.getStateColor(this._theme.colors.border, this._theme.colors.borderHover, this._theme.colors.borderFocus);
        // Draw outer circle (using new PIXI v8 API)
        // First draw the shape
        this._graphics.circle(centerX, centerY, radius);
        // Then fill it
        this._graphics.fill({ color: bgColor });
        // Redraw for stroke
        this._graphics.circle(centerX, centerY, radius);
        this._graphics.stroke({ width: 2, color: borderColor });
        // Draw inner circle (checked indicator) (using new PIXI v8 API)
        if (this._innerScale > 0) {
            this._innerCircle.circle(centerX, centerY, radius * 0.35 * this._innerScale);
            this._innerCircle.fill({ color: 0xFFFFFF });
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
        // Easing function (ease-out-elastic for bounce effect)
        const c4 = (2 * Math.PI) / 3;
        const eased = progress === 0 ? 0 :
            progress === 1 ? 1 :
                Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;
        // Update inner scale
        const scaleDiff = this._targetInnerScale - this._innerScale;
        this._innerScale += scaleDiff * eased;
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
            // Animate inner circle
            this._targetInnerScale = checked ? 1 : 0;
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
     * Get value
     */
    getValue() {
        return this._value;
    }
    /**
     * Set value
     */
    setValue(value) {
        this._value = value;
    }
    /**
     * Get group name
     */
    getGroupName() {
        return this._groupName;
    }
    /**
     * Set group name
     */
    setGroupName(groupName) {
        this._groupName = groupName;
    }
    /**
     * Get label text
     */
    getLabel() {
        return this._radioConfig.label || '';
    }
    /**
     * Set label text
     */
    setLabel(label) {
        this._radioConfig.label = label;
        if (this._labelText) {
            this._labelText.text = label;
        }
    }
}
