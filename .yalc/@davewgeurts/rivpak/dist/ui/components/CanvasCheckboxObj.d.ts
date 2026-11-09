/**
 * Canvas Checkbox Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
export interface CheckboxConfig extends UIComponentConfig {
    label?: string;
    checked?: boolean;
    value?: any;
    indeterminate?: boolean;
    size?: 'small' | 'medium' | 'large';
}
export declare class CanvasCheckboxObj extends BaseUIComponent {
    private _checkboxConfig;
    private _checked;
    private _indeterminate;
    private _size;
    private _labelText;
    private _checkmark;
    private _boxSize;
    private _checkScale;
    private _targetCheckScale;
    constructor(config: CheckboxConfig);
    protected InitComponent(): void;
    protected Render(): void;
    protected HandlePointerDown: (event: PIXI.FederatedPointerEvent) => void;
    protected UpdateAnimation(progress: number): void;
    /**
     * Set checked state
     */
    setChecked(checked: boolean): void;
    /**
     * Get checked state
     */
    getChecked(): boolean;
    /**
     * Set indeterminate state
     */
    setIndeterminate(indeterminate: boolean): void;
    /**
     * Get indeterminate state
     */
    getIndeterminate(): boolean;
    /**
     * Toggle checked state
     */
    toggle(): void;
    /**
     * Get value
     */
    getValue(): any;
    /**
     * Set value (sets checked if value matches)
     */
    setValue(value: any): void;
    /**
     * Get label text
     */
    getLabel(): string;
    /**
     * Set label text
     */
    setLabel(label: string): void;
}
