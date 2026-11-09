/**
 * Canvas Modal Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent } from "../base/BaseUIComponent";
import { CanvasButtonObj } from "./CanvasButtonObj";
import { CanvasFlexContainer } from "../containers/CanvasFlexContainer";
import { UIEventBus } from "../base/UIEventBus";
import { UIEventType } from "../base/UIEventTypes";
// Simple wrapper component for text content
class TextWrapperComponent extends BaseUIComponent {
    constructor(config) {
        super(config);
        this._textObject = config.textObject;
    }
    InitComponent() {
        this._container.addChild(this._textObject);
    }
    Render() {
        // No additional rendering needed for text wrapper
    }
}
export class CanvasModalObj extends BaseUIComponent {
    constructor(config) {
        // Modal takes full screen by default
        if (!config.width)
            config.width = 800;
        if (!config.height)
            config.height = 600;
        super(config);
        this._isOpen = false;
        this._titleText = null;
        this._closeButton = null;
        this._buttonContainer = null;
        this._buttons = [];
        // Animation
        this._overlayAlpha = 0;
        this._targetOverlayAlpha = 0;
        this._modalScale = 0.9;
        this._targetModalScale = 0.9;
        this._modalAlpha = 0;
        this._targetModalAlpha = 0;
        this.handleOverlayClick = () => {
            if (this._modalConfig.closeOnOverlayClick !== false) {
                this.close();
            }
        };
        this.handleCloseClick = () => {
            var _a, _b;
            this.close();
            (_b = (_a = this._modalConfig).onCancel) === null || _b === void 0 ? void 0 : _b.call(_a);
        };
        this.handleKeyDown = (event) => {
            if (event.key === 'Escape' && this._isOpen) {
                this.close();
            }
        };
        this._modalConfig = config;
        // Create overlay
        this._overlay = new PIXI.Graphics();
        if (config.showOverlay !== false) {
            this._container.addChild(this._overlay);
        }
        // Create modal container
        this._modalContainer = new PIXI.Container();
        this._modalBg = new PIXI.Graphics();
        this._titleBar = new PIXI.Container();
        this._modalContainer.addChild(this._modalBg);
        this._modalContainer.addChild(this._titleBar);
        // Create content container
        this._contentContainer = new CanvasFlexContainer({
            x: this._theme.spacing.medium,
            y: config.title ? 60 : this._theme.spacing.medium,
            width: (config.modalWidth || 400) - (this._theme.spacing.medium * 2),
            height: (config.modalHeight || 300) -
                (config.title ? 60 : this._theme.spacing.medium) -
                (config.buttons ? 60 : this._theme.spacing.medium),
            direction: 'column',
            gap: this._theme.spacing.small
        });
        this._modalContainer.addChild(this._contentContainer.getContainer());
        this._container.addChild(this._modalContainer);
        // Initially hidden
        this._container.visible = false;
    }
    InitComponent() {
        const modalWidth = this._modalConfig.modalWidth || 400;
        const modalHeight = this._modalConfig.modalHeight || 300;
        // Setup overlay interaction
        if (this._modalConfig.showOverlay !== false) {
            this._overlay.eventMode = 'static';
            if (this._modalConfig.closeOnOverlayClick !== false) {
                this._overlay.cursor = 'pointer';
                this._overlay.on('pointerdown', this.handleOverlayClick, this);
            }
        }
        // Create title if provided
        if (this._modalConfig.title) {
            this._titleText = new PIXI.Text({
                text: this._modalConfig.title,
                style: {
                    fontFamily: this._theme.fonts.family,
                    fontSize: this._theme.fonts.sizeLarge,
                    fill: this._theme.colors.text,
                    fontWeight: 'bold'
                }
            });
            this._titleText.x = this._theme.spacing.medium;
            this._titleText.y = this._theme.spacing.medium;
            this._titleBar.addChild(this._titleText);
        }
        // Create close button
        if (this._modalConfig.showCloseButton !== false) {
            this._closeButton = new PIXI.Container();
            const closeGraphics = new PIXI.Graphics();
            // Draw X icon
            closeGraphics.lineStyle(2, this._theme.colors.text);
            closeGraphics.moveTo(-6, -6);
            closeGraphics.lineTo(6, 6);
            closeGraphics.moveTo(6, -6);
            closeGraphics.lineTo(-6, 6);
            // Draw circle background
            const bg = new PIXI.Graphics();
            bg.beginFill(this._theme.colors.surface, 0.01);
            bg.drawCircle(0, 0, 12);
            bg.endFill();
            this._closeButton.addChild(bg);
            this._closeButton.addChild(closeGraphics);
            this._closeButton.x = modalWidth - 30;
            this._closeButton.y = 30;
            this._closeButton.eventMode = 'static';
            this._closeButton.cursor = 'pointer';
            this._closeButton.on('pointerdown', this.handleCloseClick, this);
            this._closeButton.on('pointerover', () => {
                closeGraphics.clear();
                closeGraphics.lineStyle(2, this._theme.colors.error);
                closeGraphics.moveTo(-6, -6);
                closeGraphics.lineTo(6, 6);
                closeGraphics.moveTo(6, -6);
                closeGraphics.lineTo(-6, 6);
            });
            this._closeButton.on('pointerout', () => {
                closeGraphics.clear();
                closeGraphics.lineStyle(2, this._theme.colors.text);
                closeGraphics.moveTo(-6, -6);
                closeGraphics.lineTo(6, 6);
                closeGraphics.moveTo(6, -6);
                closeGraphics.lineTo(-6, 6);
            });
            this._modalContainer.addChild(this._closeButton);
        }
        // Add content
        if (typeof this._modalConfig.content === 'string') {
            const contentText = new PIXI.Text({
                text: this._modalConfig.content,
                style: {
                    fontFamily: this._theme.fonts.family,
                    fontSize: this._theme.fonts.size,
                    fill: this._theme.colors.text,
                    wordWrap: true,
                    wordWrapWidth: modalWidth - (this._theme.spacing.medium * 2)
                }
            });
            const wrapper = new TextWrapperComponent({
                x: 0,
                y: 0,
                width: modalWidth - (this._theme.spacing.medium * 2),
                height: contentText.height,
                textObject: contentText
            });
            this._contentContainer.addChildren(wrapper);
        }
        else if (Array.isArray(this._modalConfig.content)) {
            this._contentContainer.addChildren(...this._modalConfig.content);
        }
        else if (this._modalConfig.content) {
            this._contentContainer.addChildren(this._modalConfig.content);
        }
        // Create buttons if provided
        if (this._modalConfig.buttons && this._modalConfig.buttons.length > 0) {
            this._buttonContainer = new CanvasFlexContainer({
                x: this._theme.spacing.medium,
                y: modalHeight - 60,
                width: modalWidth - (this._theme.spacing.medium * 2),
                height: 40,
                direction: 'row',
                justify: 'end',
                gap: this._theme.spacing.small
            });
            for (const buttonConfig of this._modalConfig.buttons) {
                const button = new CanvasButtonObj(Object.assign(Object.assign({}, buttonConfig), { width: buttonConfig.width || 80, height: buttonConfig.height || 32 }));
                this._buttons.push(button);
                this._buttonContainer.addChildren(button);
            }
            this._modalContainer.addChild(this._buttonContainer.getContainer());
        }
        // Position modal
        if (this._modalConfig.centered !== false) {
            this.centerModal();
        }
        // Setup keyboard listeners
        if (this._modalConfig.closeOnEscape !== false && typeof document !== 'undefined') {
            document.addEventListener('keydown', this.handleKeyDown);
        }
    }
    centerModal() {
        const modalWidth = this._modalConfig.modalWidth || 400;
        const modalHeight = this._modalConfig.modalHeight || 300;
        // Get stage dimensions
        const stageWidth = this.width;
        const stageHeight = this.height;
        // Center the modal
        this._modalContainer.x = (stageWidth - modalWidth) / 2;
        this._modalContainer.y = (stageHeight - modalHeight) / 2;
        // Set pivot for scaling animation
        this._modalContainer.pivot.set(modalWidth / 2, modalHeight / 2);
        this._modalContainer.x += modalWidth / 2;
        this._modalContainer.y += modalHeight / 2;
    }
    Render() {
        const modalWidth = this._modalConfig.modalWidth || 400;
        const modalHeight = this._modalConfig.modalHeight || 300;
        // Draw overlay
        if (this._modalConfig.showOverlay !== false) {
            this._overlay.clear();
            this._overlay.beginFill(0x000000, 0.5);
            this._overlay.drawRect(0, 0, this.width, this.height);
            this._overlay.endFill();
            this._overlay.alpha = this._overlayAlpha;
        }
        // Draw modal background
        this._modalBg.clear();
        // Shadow
        this._modalBg.beginFill(0x000000, 0.3);
        this._modalBg.drawRoundedRect(4, 4, modalWidth, modalHeight, this._theme.borderRadius);
        this._modalBg.endFill();
        // Main background
        this._modalBg.beginFill(this._theme.colors.surface);
        this._modalBg.lineStyle(2, this._theme.colors.border);
        this._modalBg.drawRoundedRect(0, 0, modalWidth, modalHeight, this._theme.borderRadius);
        this._modalBg.endFill();
        // Draw title bar separator
        if (this._modalConfig.title) {
            this._modalBg.lineStyle(1, this._theme.colors.border);
            this._modalBg.moveTo(0, 50);
            this._modalBg.lineTo(modalWidth, 50);
        }
        // Draw button bar separator
        if (this._modalConfig.buttons && this._modalConfig.buttons.length > 0) {
            this._modalBg.lineStyle(1, this._theme.colors.border);
            this._modalBg.moveTo(0, modalHeight - 60);
            this._modalBg.lineTo(modalWidth, modalHeight - 60);
        }
        // Apply animation values
        this._modalContainer.alpha = this._modalAlpha;
        this._modalContainer.scale.set(this._modalScale);
    }
    UpdateAnimation(progress) {
        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3);
        // Update overlay alpha
        const overlayDiff = this._targetOverlayAlpha - this._overlayAlpha;
        this._overlayAlpha += overlayDiff * eased;
        // Update modal alpha
        const alphaDiff = this._targetModalAlpha - this._modalAlpha;
        this._modalAlpha += alphaDiff * eased;
        // Update modal scale
        const scaleDiff = this._targetModalScale - this._modalScale;
        this._modalScale += scaleDiff * eased;
        // Update visibility
        this._container.visible = this._modalAlpha > 0.01 || this._overlayAlpha > 0.01;
        this.Render();
    }
    /**
     * Open modal
     */
    open() {
        var _a, _b;
        if (this._isOpen)
            return;
        this._isOpen = true;
        this._container.visible = true;
        // Set animation targets
        if (this._modalConfig.animateIn !== false) {
            this._targetOverlayAlpha = 1;
            this._targetModalAlpha = 1;
            this._targetModalScale = 1;
            this.StartAnimation();
        }
        else {
            this._overlayAlpha = 1;
            this._modalAlpha = 1;
            this._modalScale = 1;
            this.Render();
        }
        // Make sure modal is on top
        if (this._container.parent) {
            this._container.parent.setChildIndex(this._container, this._container.parent.children.length - 1);
        }
        // Emit events
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.OPEN, this));
        (_b = (_a = this._modalConfig).onOpen) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    /**
     * Close modal
     */
    close() {
        var _a, _b;
        if (!this._isOpen)
            return;
        this._isOpen = false;
        // Set animation targets
        if (this._modalConfig.animateOut !== false) {
            this._targetOverlayAlpha = 0;
            this._targetModalAlpha = 0;
            this._targetModalScale = 0.9;
            this.StartAnimation();
        }
        else {
            this._overlayAlpha = 0;
            this._modalAlpha = 0;
            this._modalScale = 0.9;
            this._container.visible = false;
            this.Render();
        }
        // Emit events
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.CLOSE, this));
        (_b = (_a = this._modalConfig).onClose) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    /**
     * Toggle modal
     */
    toggle() {
        if (this._isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Confirm and close
     */
    confirm() {
        var _a, _b;
        (_b = (_a = this._modalConfig).onConfirm) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.close();
    }
    /**
     * Cancel and close
     */
    cancel() {
        var _a, _b;
        (_b = (_a = this._modalConfig).onCancel) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.close();
    }
    /**
     * Set title
     */
    setTitle(title) {
        if (this._titleText) {
            this._titleText.text = title;
        }
    }
    /**
     * Set content
     */
    setContent(content) {
        // Clear existing content
        this._contentContainer.removeAllChildren();
        // Add new content
        if (typeof content === 'string') {
            const contentText = new PIXI.Text({
                text: content,
                style: {
                    fontFamily: this._theme.fonts.family,
                    fontSize: this._theme.fonts.size,
                    fill: this._theme.colors.text,
                    wordWrap: true,
                    wordWrapWidth: (this._modalConfig.modalWidth || 400) - (this._theme.spacing.medium * 2)
                }
            });
            const wrapper = new TextWrapperComponent({
                x: 0,
                y: 0,
                width: (this._modalConfig.modalWidth || 400) - (this._theme.spacing.medium * 2),
                height: contentText.height,
                textObject: contentText
            });
            this._contentContainer.addChildren(wrapper);
        }
        else if (Array.isArray(content)) {
            this._contentContainer.addChildren(...content);
        }
        else {
            this._contentContainer.addChildren(content);
        }
    }
    /**
     * Get button by index
     */
    getButton(index) {
        return this._buttons[index] || null;
    }
    /**
     * Dispose
     */
    Dispose() {
        // Remove keyboard listener
        if (typeof document !== 'undefined') {
            document.removeEventListener('keydown', this.handleKeyDown);
        }
        // Remove event listeners
        if (this._overlay) {
            this._overlay.off('pointerdown', this.handleOverlayClick, this);
        }
        if (this._closeButton) {
            this._closeButton.off('pointerdown', this.handleCloseClick, this);
        }
        // Dispose buttons
        for (const button of this._buttons) {
            button.Dispose();
        }
        // Dispose containers
        if (this._buttonContainer) {
            this._buttonContainer.Dispose();
        }
        this._contentContainer.Dispose();
        super.Dispose();
    }
}
