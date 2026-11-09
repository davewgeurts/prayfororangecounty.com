/**
 * Canvas Slider Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
export interface SliderConfig extends UIComponentConfig {
    min: number;
    max: number;
    value?: number;
    step?: number;
    orientation?: 'horizontal' | 'vertical';
    showValue?: boolean;
    showTicks?: boolean;
    tickInterval?: number;
    valueFormatter?: (value: number) => string;
    onSlideStart?: () => void;
    onSlideEnd?: () => void;
}
export declare class CanvasSliderObj extends BaseUIComponent {
    private _sliderConfig;
    private _min;
    private _max;
    private _step;
    private _orientation;
    private _showValue;
    private _valueText;
    private _track;
    private _fill;
    private _thumb;
    private _isDragging;
    private _dragStartX;
    private _dragStartY;
    private _dragStartValue;
    private _thumbScale;
    private _targetThumbScale;
    constructor(config: SliderConfig);
    protected InitComponent(): void;
    protected Render(): void;
    private HandleThumbDown;
    private HandlePointerMove;
    protected HandlePointerUpGlobal: (event: PIXI.FederatedPointerEvent) => void;
    protected HandlePointerDown: (event: PIXI.FederatedPointerEvent) => void;
    protected UpdateAnimation(progress: number): void;
    private formatValue;
    /**
     * Override setValue to handle slider-specific logic
     */
    setValue(value: number): void;
    /**
     * Get slider percentage (0-1)
     */
    getPercentage(): number;
    /**
     * Set slider by percentage (0-1)
     */
    setPercentage(percentage: number): void;
    /**
     * Dispose
     */
    Dispose(): void;
}
