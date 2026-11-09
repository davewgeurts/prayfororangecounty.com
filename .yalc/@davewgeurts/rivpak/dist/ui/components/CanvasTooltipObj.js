/**
 * Canvas Tooltip Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent } from "../base/BaseUIComponent";
export class CanvasTooltipObj extends BaseUIComponent {
    constructor(config) {
        // Tooltips don't have fixed dimensions initially
        if (!config.width)
            config.width = 0;
        if (!config.height)
            config.height = 0;
        super(config);
        this._pixiTarget = null;
        this._tooltipContent = null;
        // State
        this._isShowing = false;
        this._showTimer = null;
        this._hideTimer = null;
        // Animation
        this._tooltipAlpha = 0;
        this._targetAlpha = 0;
        this._tooltipScale = 0.9;
        this._targetScale = 0.9;
        this.handleTargetOver = () => {
            this.scheduleShow();
        };
        this.handleTargetOut = () => {
            this.scheduleHide();
        };
        this.handleTargetClick = () => {
            if (this._isShowing) {
                this.hide();
            }
            else {
                this.show();
            }
        };
        this.handleTargetFocus = () => {
            this.show();
        };
        this.handleTargetBlur = () => {
            this.hide();
        };
        this._tooltipConfig = config;
        this._content = config.content;
        this._target = config.target || null;
        this._placement = config.placement || 'top';
        this._trigger = config.trigger || 'hover';
        this._delay = config.delay || 500;
        this._offset = config.offset || 8;
        this._maxWidth = config.maxWidth || 300;
        this._showArrow = config.showArrow !== false;
        // Create tooltip container
        this._tooltipContainer = new PIXI.Container();
        this._tooltipBg = new PIXI.Graphics();
        this._tooltipArrow = new PIXI.Graphics();
        this._tooltipContainer.addChild(this._tooltipBg);
        if (this._showArrow) {
            this._tooltipContainer.addChild(this._tooltipArrow);
        }
        // Initially hidden
        this._tooltipContainer.visible = false;
        this._tooltipContainer.alpha = 0;
        // Don't add to regular container, will be added to stage
        this._container.visible = false;
    }
    InitComponent() {
        // Create content
        if (typeof this._content === 'string') {
            this._tooltipContent = new PIXI.Text({
                text: this._content,
                style: {
                    fontFamily: this._theme.fonts.family,
                    fontSize: this._theme.fonts.sizeSmall,
                    fill: 0xFFFFFF,
                    align: 'left',
                    wordWrap: true,
                    wordWrapWidth: this._maxWidth - (this._theme.spacing.small * 2)
                }
            });
            this._tooltipContent.x = this._theme.spacing.small;
            this._tooltipContent.y = this._theme.spacing.small;
        }
        else {
            this._tooltipContent = this._content;
        }
        if (this._tooltipContent) {
            this._tooltipContainer.addChild(this._tooltipContent);
        }
        // Setup target listeners if provided
        if (this._target) {
            this.attachToTarget(this._target);
        }
        // Add tooltip to stage when ready
        if (this._container.parent) {
            const stage = this.findStage(this._container.parent);
            if (stage) {
                stage.addChild(this._tooltipContainer);
            }
        }
    }
    findStage(container) {
        let current = container;
        while (current.parent) {
            current = current.parent;
        }
        return current;
    }
    attachToTarget(target) {
        this._target = target;
        // Get the actual PIXI container to attach events to
        this._pixiTarget = target instanceof BaseUIComponent ? target.getContainer() : target;
        // Setup event listeners based on trigger
        switch (this._trigger) {
            case 'hover':
                this._pixiTarget.eventMode = 'static';
                this._pixiTarget.on('pointerover', this.handleTargetOver, this);
                this._pixiTarget.on('pointerout', this.handleTargetOut, this);
                break;
            case 'click':
                this._pixiTarget.eventMode = 'static';
                this._pixiTarget.cursor = 'pointer';
                this._pixiTarget.on('pointerdown', this.handleTargetClick, this);
                break;
            case 'focus':
                if ('on' in this._pixiTarget) {
                    this._pixiTarget.on('focus', this.handleTargetFocus, this);
                    this._pixiTarget.on('blur', this.handleTargetBlur, this);
                }
                break;
        }
    }
    scheduleShow() {
        // Clear any hide timer
        if (this._hideTimer !== null) {
            clearTimeout(this._hideTimer);
            this._hideTimer = null;
        }
        // Schedule show with delay
        if (!this._isShowing && this._showTimer === null) {
            this._showTimer = setTimeout(() => {
                this.show();
                this._showTimer = null;
            }, this._delay);
        }
    }
    scheduleHide() {
        // Clear any show timer
        if (this._showTimer !== null) {
            clearTimeout(this._showTimer);
            this._showTimer = null;
        }
        // Schedule hide with delay
        if (this._isShowing && this._hideTimer === null) {
            const hideDelay = this._tooltipConfig.hideDelay || 200;
            this._hideTimer = setTimeout(() => {
                this.hide();
                this._hideTimer = null;
            }, hideDelay);
        }
    }
    Render() {
        if (!this._tooltipContent)
            return;
        // Calculate tooltip dimensions
        const contentBounds = this._tooltipContent.getBounds();
        const tooltipWidth = contentBounds.width + (this._theme.spacing.small * 2);
        const tooltipHeight = contentBounds.height + (this._theme.spacing.small * 2);
        // Draw background
        this._tooltipBg.clear();
        this._tooltipBg.beginFill(0x2C2C2C);
        this._tooltipBg.drawRoundedRect(0, 0, tooltipWidth, tooltipHeight, 4);
        this._tooltipBg.endFill();
        // Draw arrow if enabled
        if (this._showArrow) {
            this._tooltipArrow.clear();
            this._tooltipArrow.beginFill(0x2C2C2C);
            const arrowSize = 6;
            switch (this._placement) {
                case 'top':
                    this._tooltipArrow.moveTo(tooltipWidth / 2 - arrowSize, tooltipHeight);
                    this._tooltipArrow.lineTo(tooltipWidth / 2, tooltipHeight + arrowSize);
                    this._tooltipArrow.lineTo(tooltipWidth / 2 + arrowSize, tooltipHeight);
                    break;
                case 'bottom':
                    this._tooltipArrow.moveTo(tooltipWidth / 2 - arrowSize, 0);
                    this._tooltipArrow.lineTo(tooltipWidth / 2, -arrowSize);
                    this._tooltipArrow.lineTo(tooltipWidth / 2 + arrowSize, 0);
                    break;
                case 'left':
                    this._tooltipArrow.moveTo(tooltipWidth, tooltipHeight / 2 - arrowSize);
                    this._tooltipArrow.lineTo(tooltipWidth + arrowSize, tooltipHeight / 2);
                    this._tooltipArrow.lineTo(tooltipWidth, tooltipHeight / 2 + arrowSize);
                    break;
                case 'right':
                    this._tooltipArrow.moveTo(0, tooltipHeight / 2 - arrowSize);
                    this._tooltipArrow.lineTo(-arrowSize, tooltipHeight / 2);
                    this._tooltipArrow.lineTo(0, tooltipHeight / 2 + arrowSize);
                    break;
            }
            this._tooltipArrow.endFill();
        }
        // Position tooltip relative to target
        if (this._target && this._isShowing) {
            this.positionTooltip(tooltipWidth, tooltipHeight);
        }
        // Apply animation values
        this._tooltipContainer.alpha = this._tooltipAlpha;
        this._tooltipContainer.scale.set(this._tooltipScale);
    }
    positionTooltip(tooltipWidth, tooltipHeight) {
        if (!this._target || !this._pixiTarget)
            return;
        const targetBounds = this._pixiTarget.getBounds();
        const arrowOffset = this._showArrow ? 6 : 0;
        let x = 0;
        let y = 0;
        // Calculate position based on placement
        switch (this._placement) {
            case 'top':
                x = targetBounds.x + (targetBounds.width - tooltipWidth) / 2;
                y = targetBounds.y - tooltipHeight - this._offset - arrowOffset;
                break;
            case 'bottom':
                x = targetBounds.x + (targetBounds.width - tooltipWidth) / 2;
                y = targetBounds.y + targetBounds.height + this._offset + arrowOffset;
                break;
            case 'left':
                x = targetBounds.x - tooltipWidth - this._offset - arrowOffset;
                y = targetBounds.y + (targetBounds.height - tooltipHeight) / 2;
                break;
            case 'right':
                x = targetBounds.x + targetBounds.width + this._offset + arrowOffset;
                y = targetBounds.y + (targetBounds.height - tooltipHeight) / 2;
                break;
            case 'auto':
                // Choose best placement based on available space
                // For now, default to top
                x = targetBounds.x + (targetBounds.width - tooltipWidth) / 2;
                y = targetBounds.y - tooltipHeight - this._offset - arrowOffset;
                break;
        }
        // Apply position
        this._tooltipContainer.x = x;
        this._tooltipContainer.y = y;
        // Set pivot for scaling animation
        this._tooltipContainer.pivot.set(tooltipWidth / 2, tooltipHeight / 2);
        this._tooltipContainer.x += tooltipWidth / 2;
        this._tooltipContainer.y += tooltipHeight / 2;
    }
    UpdateAnimation(progress) {
        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3);
        // Update alpha
        const alphaDiff = this._targetAlpha - this._tooltipAlpha;
        this._tooltipAlpha += alphaDiff * eased;
        // Update scale
        const scaleDiff = this._targetScale - this._tooltipScale;
        this._tooltipScale += scaleDiff * eased;
        // Update visibility
        this._tooltipContainer.visible = this._tooltipAlpha > 0.01;
        this.Render();
    }
    /**
     * Show tooltip
     */
    show() {
        if (this._isShowing)
            return;
        this._isShowing = true;
        this._targetAlpha = 1;
        this._targetScale = 1;
        // Make sure tooltip is on top
        if (this._tooltipContainer.parent) {
            this._tooltipContainer.parent.setChildIndex(this._tooltipContainer, this._tooltipContainer.parent.children.length - 1);
        }
        this.StartAnimation();
        this.Render();
    }
    /**
     * Hide tooltip
     */
    hide() {
        if (!this._isShowing)
            return;
        this._isShowing = false;
        this._targetAlpha = 0;
        this._targetScale = 0.9;
        this.StartAnimation();
    }
    /**
     * Toggle tooltip
     */
    toggle() {
        if (this._isShowing) {
            this.hide();
        }
        else {
            this.show();
        }
    }
    /**
     * Update content
     */
    setContent(content) {
        // Remove old content
        if (this._tooltipContent) {
            this._tooltipContainer.removeChild(this._tooltipContent);
            if (this._tooltipContent instanceof PIXI.Text) {
                this._tooltipContent.destroy();
            }
        }
        this._content = content;
        // Create new content
        if (typeof content === 'string') {
            this._tooltipContent = new PIXI.Text({
                text: content,
                style: {
                    fontFamily: this._theme.fonts.family,
                    fontSize: this._theme.fonts.sizeSmall,
                    fill: 0xFFFFFF,
                    align: 'left',
                    wordWrap: true,
                    wordWrapWidth: this._maxWidth - (this._theme.spacing.small * 2)
                }
            });
            this._tooltipContent.x = this._theme.spacing.small;
            this._tooltipContent.y = this._theme.spacing.small;
        }
        else {
            this._tooltipContent = content;
        }
        if (this._tooltipContent) {
            this._tooltipContainer.addChild(this._tooltipContent);
        }
        this.Render();
    }
    /**
     * Set placement
     */
    setPlacement(placement) {
        this._placement = placement;
        if (this._isShowing) {
            this.Render();
        }
    }
    /**
     * Attach to target
     */
    attachTo(target) {
        // Remove old listeners
        if (this._pixiTarget) {
            this._pixiTarget.off('pointerover', this.handleTargetOver, this);
            this._pixiTarget.off('pointerout', this.handleTargetOut, this);
            this._pixiTarget.off('pointerdown', this.handleTargetClick, this);
            if ('off' in this._pixiTarget) {
                this._pixiTarget.off('focus', this.handleTargetFocus, this);
                this._pixiTarget.off('blur', this.handleTargetBlur, this);
            }
        }
        // Attach to new target
        this.attachToTarget(target);
    }
    /**
     * Dispose
     */
    Dispose() {
        // Clear timers
        if (this._showTimer !== null) {
            clearTimeout(this._showTimer);
            this._showTimer = null;
        }
        if (this._hideTimer !== null) {
            clearTimeout(this._hideTimer);
            this._hideTimer = null;
        }
        // Remove target listeners
        if (this._pixiTarget) {
            this._pixiTarget.off('pointerover', this.handleTargetOver, this);
            this._pixiTarget.off('pointerout', this.handleTargetOut, this);
            this._pixiTarget.off('pointerdown', this.handleTargetClick, this);
            if ('off' in this._pixiTarget) {
                this._pixiTarget.off('focus', this.handleTargetFocus, this);
                this._pixiTarget.off('blur', this.handleTargetBlur, this);
            }
        }
        // Remove tooltip from stage
        if (this._tooltipContainer.parent) {
            this._tooltipContainer.parent.removeChild(this._tooltipContainer);
        }
        // Destroy tooltip container
        this._tooltipContainer.destroy();
        super.Dispose();
    }
}
