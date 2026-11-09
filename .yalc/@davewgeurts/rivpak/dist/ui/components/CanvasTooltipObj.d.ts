/**
 * Canvas Tooltip Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';
export interface TooltipConfig extends UIComponentConfig {
    content: string | PIXI.Container;
    target?: BaseUIComponent | PIXI.Container;
    placement?: TooltipPlacement;
    trigger?: TooltipTrigger;
    delay?: number;
    offset?: number;
    maxWidth?: number;
    showArrow?: boolean;
    autoHide?: boolean;
    hideDelay?: number;
}
export declare class CanvasTooltipObj extends BaseUIComponent {
    private _tooltipConfig;
    private _content;
    private _target;
    private _pixiTarget;
    private _placement;
    private _trigger;
    private _delay;
    private _offset;
    private _maxWidth;
    private _showArrow;
    private _tooltipContainer;
    private _tooltipBg;
    private _tooltipArrow;
    private _tooltipContent;
    private _isShowing;
    private _showTimer;
    private _hideTimer;
    private _tooltipAlpha;
    private _targetAlpha;
    private _tooltipScale;
    private _targetScale;
    constructor(config: TooltipConfig);
    protected InitComponent(): void;
    private findStage;
    private attachToTarget;
    private handleTargetOver;
    private handleTargetOut;
    private handleTargetClick;
    private handleTargetFocus;
    private handleTargetBlur;
    private scheduleShow;
    private scheduleHide;
    protected Render(): void;
    private positionTooltip;
    protected UpdateAnimation(progress: number): void;
    /**
     * Show tooltip
     */
    show(): void;
    /**
     * Hide tooltip
     */
    hide(): void;
    /**
     * Toggle tooltip
     */
    toggle(): void;
    /**
     * Update content
     */
    setContent(content: string | PIXI.Container): void;
    /**
     * Set placement
     */
    setPlacement(placement: TooltipPlacement): void;
    /**
     * Attach to target
     */
    attachTo(target: BaseUIComponent | PIXI.Container): void;
    /**
     * Dispose
     */
    Dispose(): void;
}
