/**
 * Canvas Joystick Component
 * A simple virtual joystick for touch/mouse input
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent } from "../base/BaseUIComponent";
import { UIEventBus } from "../base/UIEventBus";
import { UIEventType } from "../base/UIEventTypes";
export class CanvasJoystickObj extends BaseUIComponent {
    constructor(config) {
        // Set default size based on outer radius
        const outerRadius = config.outerRadius || 50;
        config.width = config.width || outerRadius * 2;
        config.height = config.height || outerRadius * 2;
        super(config);
        // State
        this._isDragging = false;
        this._thumbX = 0;
        this._thumbY = 0;
        this._normalizedX = 0;
        this._normalizedY = 0;
        this.handleGlobalPointerMove = (event) => {
            if (!this._isDragging || !this._enabled)
                return;
            console.log('%c Joystick global move:', 'color:#00FFFF;', event.clientX, event.clientY);
            this.updateThumbPositionFromGlobal(event.clientX, event.clientY);
        };
        this.handleGlobalPointerUp = (event) => {
            if (!this._isDragging)
                return;
            this.doJoystickRelease();
        };
        // Override base class arrow function handlers
        // These are arrow functions to match the base class pattern
        this.HandlePointerDown = (event) => {
            var _a;
            if (!this._enabled)
                return;
            console.log('%c Joystick HandlePointerDown!', 'color:#00FF00; font-weight:bold;');
            this._isDragging = true;
            this._pressed = true;
            // Update thumb position
            this.updateThumbPosition(event);
            // Emit press event
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.PRESS, this));
            (_a = this._onPress) === null || _a === void 0 ? void 0 : _a.call(this, this);
        };
        this.HandlePointerUp = (event) => {
            if (!this._isDragging)
                return;
            this.doJoystickRelease();
        };
        this.HandlePointerOver = (event) => {
            if (!this._enabled)
                return;
            this._hovered = true;
        };
        this.HandlePointerOut = (event) => {
            if (!this._enabled)
                return;
            this._hovered = false;
            // Don't release on pointer out - we want to track dragging outside bounds
        };
    }
    InitComponent() {
        var _a, _b, _c, _d, _e, _f, _g;
        const config = this._config;
        this._joystickConfig = config;
        // Setup properties
        this._outerRadius = config.outerRadius || 50;
        this._innerRadius = config.innerRadius || 20;
        this._outerColor = (_a = config.outerColor) !== null && _a !== void 0 ? _a : 0x333333;
        this._outerAlpha = (_b = config.outerAlpha) !== null && _b !== void 0 ? _b : 0.5;
        this._innerColor = (_c = config.innerColor) !== null && _c !== void 0 ? _c : 0x666666;
        this._innerAlpha = (_d = config.innerAlpha) !== null && _d !== void 0 ? _d : 0.8;
        this._borderColor = (_e = config.borderColor) !== null && _e !== void 0 ? _e : 0xFFFFFF;
        this._borderWidth = (_f = config.borderWidth) !== null && _f !== void 0 ? _f : 2;
        this._snapBack = config.snapBack !== false;
        this._deadZone = (_g = config.deadZone) !== null && _g !== void 0 ? _g : 0.1;
        // Callbacks
        this._onMove = config.onMove;
        this._onJoystickRelease = config.onRelease;
        // Create graphics
        this._outerCircle = new PIXI.Graphics();
        this._innerCircle = new PIXI.Graphics();
        this._container.addChild(this._outerCircle);
        this._container.addChild(this._innerCircle);
        // Set up hit area for the full joystick area
        this._container.hitArea = new PIXI.Circle(this._outerRadius, this._outerRadius, this._outerRadius);
        // Add global pointer move/up listeners for drag tracking outside bounds
        this.setupGlobalListeners();
        // Defer interaction setup until after constructor chain completes
        // This ensures our arrow function handlers are properly assigned
        // (arrow function class properties aren't assigned until after parent constructor)
        Promise.resolve().then(() => {
            // Remove base class handlers (which point to parent's arrow functions)
            this.RemoveInteraction();
            // Re-add with our correct handlers
            this.SetupInteraction();
        });
    }
    setupGlobalListeners() {
        // Use window-level events for global tracking
        window.addEventListener('pointermove', this.handleGlobalPointerMove);
        window.addEventListener('pointerup', this.handleGlobalPointerUp);
    }
    removeGlobalListeners() {
        window.removeEventListener('pointermove', this.handleGlobalPointerMove);
        window.removeEventListener('pointerup', this.handleGlobalPointerUp);
    }
    doJoystickRelease() {
        var _a, _b;
        console.log('%c Joystick released!', 'color:#FFFF00; font-weight:bold;');
        this._isDragging = false;
        this._pressed = false;
        if (this._snapBack) {
            // Reset thumb to center
            this._thumbX = 0;
            this._thumbY = 0;
            this._normalizedX = 0;
            this._normalizedY = 0;
            this.Render();
            // Emit release with zero values
            (_a = this._onMove) === null || _a === void 0 ? void 0 : _a.call(this, 0, 0);
        }
        // Emit release event
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.RELEASE, this));
        (_b = this._onJoystickRelease) === null || _b === void 0 ? void 0 : _b.call(this);
    }
    updateThumbPositionFromGlobal(clientX, clientY) {
        var _a, _b;
        // Convert client coordinates to local container coordinates
        // Get the container's global position
        const globalPos = this._container.getGlobalPosition();
        console.log('%c Joystick globalPos:', 'color:#AAFFAA;', globalPos.x, globalPos.y);
        // Calculate local position relative to container center
        const localX = clientX - globalPos.x;
        const localY = clientY - globalPos.y;
        // Calculate offset from center
        const centerX = this._outerRadius;
        const centerY = this._outerRadius;
        let deltaX = localX - centerX;
        let deltaY = localY - centerY;
        // Calculate distance from center
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = this._outerRadius - this._innerRadius * 0.5;
        // Clamp to outer radius
        if (distance > maxDistance) {
            const scale = maxDistance / distance;
            deltaX *= scale;
            deltaY *= scale;
        }
        // Update thumb position
        this._thumbX = deltaX;
        this._thumbY = deltaY;
        // Calculate normalized values (-1 to 1)
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        this._normalizedX = deltaX / maxDistance;
        this._normalizedY = deltaY / maxDistance;
        // Apply dead zone
        if (normalizedDistance < this._deadZone) {
            this._normalizedX = 0;
            this._normalizedY = 0;
        }
        // Update value
        const previousValue = this._value;
        this._value = {
            x: this._normalizedX,
            y: this._normalizedY,
            angle: Math.atan2(deltaY, deltaX),
            distance: normalizedDistance
        };
        // Re-render
        this.Render();
        // Emit change event
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.CHANGE, this, this._value, previousValue));
        (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this, this._value, this);
        // Call onMove callback
        (_b = this._onMove) === null || _b === void 0 ? void 0 : _b.call(this, this._normalizedX, this._normalizedY);
    }
    Render() {
        // Clear and draw outer circle
        this._outerCircle.clear();
        this._outerCircle.circle(this._outerRadius, this._outerRadius, this._outerRadius);
        this._outerCircle.fill({ color: this._outerColor, alpha: this._outerAlpha });
        this._outerCircle.stroke({ width: this._borderWidth, color: this._borderColor, alpha: 0.5 });
        // Clear and draw inner circle (thumb) at current position
        this._innerCircle.clear();
        const thumbCenterX = this._outerRadius + this._thumbX;
        const thumbCenterY = this._outerRadius + this._thumbY;
        this._innerCircle.circle(thumbCenterX, thumbCenterY, this._innerRadius);
        this._innerCircle.fill({ color: this._innerColor, alpha: this._innerAlpha });
        this._innerCircle.stroke({ width: this._borderWidth, color: this._borderColor, alpha: 0.8 });
        // Apply disabled state
        this._container.alpha = this._enabled ? 1.0 : 0.4;
    }
    updateThumbPosition(event) {
        var _a, _b;
        // Get local position relative to container
        const localPos = this._container.toLocal(event.global);
        // Calculate offset from center
        const centerX = this._outerRadius;
        const centerY = this._outerRadius;
        let deltaX = localPos.x - centerX;
        let deltaY = localPos.y - centerY;
        // Calculate distance from center
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = this._outerRadius - this._innerRadius * 0.5;
        // Clamp to outer radius
        if (distance > maxDistance) {
            const scale = maxDistance / distance;
            deltaX *= scale;
            deltaY *= scale;
        }
        // Update thumb position
        this._thumbX = deltaX;
        this._thumbY = deltaY;
        // Calculate normalized values (-1 to 1)
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        this._normalizedX = deltaX / maxDistance;
        this._normalizedY = deltaY / maxDistance;
        // Apply dead zone
        if (normalizedDistance < this._deadZone) {
            this._normalizedX = 0;
            this._normalizedY = 0;
        }
        // Update value
        const previousValue = this._value;
        this._value = {
            x: this._normalizedX,
            y: this._normalizedY,
            angle: Math.atan2(deltaY, deltaX),
            distance: normalizedDistance
        };
        // Re-render
        this.Render();
        // Emit change event
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.CHANGE, this, this._value, previousValue));
        (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this, this._value, this);
        // Call onMove callback
        (_b = this._onMove) === null || _b === void 0 ? void 0 : _b.call(this, this._normalizedX, this._normalizedY);
    }
    /**
     * Get current joystick value
     */
    getValue() {
        return this._value || { x: 0, y: 0, angle: 0, distance: 0 };
    }
    /**
     * Get normalized X value (-1 to 1)
     */
    getX() {
        return this._normalizedX;
    }
    /**
     * Get normalized Y value (-1 to 1)
     */
    getY() {
        return this._normalizedY;
    }
    /**
     * Check if joystick is currently being dragged
     */
    isDragging() {
        return this._isDragging;
    }
    /**
     * Reset joystick to center position
     */
    reset() {
        this._thumbX = 0;
        this._thumbY = 0;
        this._normalizedX = 0;
        this._normalizedY = 0;
        this._isDragging = false;
        this.Render();
    }
    /**
     * Set outer circle color
     */
    setOuterColor(color, alpha) {
        this._outerColor = color;
        if (alpha !== undefined)
            this._outerAlpha = alpha;
        this.Render();
    }
    /**
     * Set inner thumb color
     */
    setInnerColor(color, alpha) {
        this._innerColor = color;
        if (alpha !== undefined)
            this._innerAlpha = alpha;
        this.Render();
    }
    Dispose() {
        this.removeGlobalListeners();
        this._outerCircle.destroy();
        this._innerCircle.destroy();
        super.Dispose();
    }
}
