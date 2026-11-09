/**
 * Canvas Progress Bar Component
 */
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
export type ProgressBarType = 'linear' | 'circular';
export type ProgressBarVariant = 'determinate' | 'indeterminate' | 'buffer';
export interface ProgressBarConfig extends UIComponentConfig {
    type?: ProgressBarType;
    variant?: ProgressBarVariant;
    value?: number;
    bufferValue?: number;
    min?: number;
    max?: number;
    showLabel?: boolean;
    labelFormat?: (value: number, min: number, max: number) => string;
    color?: number | string;
    backgroundColor?: number | string;
    striped?: boolean;
    animated?: boolean;
    thickness?: number;
    rounded?: boolean;
}
export declare class CanvasProgressBarObj extends BaseUIComponent {
    private _progressConfig;
    private _type;
    private _variant;
    private _min;
    private _max;
    private _bufferValue;
    private _showLabel;
    private _thickness;
    private _rounded;
    private _striped;
    private _animatedStripes;
    private _progressFill;
    private _bufferFill;
    private _labelText;
    private _stripesContainer;
    private _circularProgress;
    private _displayValue;
    private _targetValue;
    private _indeterminateOffset;
    private _stripeOffset;
    constructor(config: ProgressBarConfig);
    protected InitComponent(): void;
    private createStripes;
    protected Render(): void;
    private renderLinearProgress;
    private renderCircularProgress;
    private formatLabel;
    protected UpdateAnimation(progress: number): void;
    /**
     * Update animation frame
     */
    Update(time: number, frameCount: number, onceSecond: boolean): void;
    /**
     * Set progress value
     */
    setValue(value: number): void;
    /**
     * Set buffer value
     */
    setBufferValue(value: number): void;
    /**
     * Get percentage
     */
    getPercentage(): number;
    /**
     * Set percentage
     */
    setPercentage(percentage: number): void;
    /**
     * Increment value
     */
    increment(amount?: number): void;
    /**
     * Decrement value
     */
    decrement(amount?: number): void;
    /**
     * Reset to minimum
     */
    reset(): void;
    /**
     * Set to maximum (complete)
     */
    complete(): void;
    /**
     * Set variant
     */
    setVariant(variant: ProgressBarVariant): void;
    /**
     * Toggle animation
     */
    setAnimated(animated: boolean): void;
    /**
     * Set color
     */
    setColor(color: number | string): void;
    /**
     * Show/hide label
     */
    setShowLabel(show: boolean): void;
}
