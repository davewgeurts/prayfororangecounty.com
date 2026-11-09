/**
 * Canvas Radio Button Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
export interface RadioConfig extends UIComponentConfig {
    label?: string;
    checked?: boolean;
    value?: any;
    size?: 'small' | 'medium' | 'large';
    groupName?: string;
}
export declare class CanvasRadioObj extends BaseUIComponent {
    private _radioConfig;
    private _checked;
    private _size;
    private _labelText;
    private _innerCircle;
    private _circleSize;
    private _groupName;
    private _innerScale;
    private _targetInnerScale;
    constructor(config: RadioConfig);
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
     * Get value
     */
    getValue(): any;
    /**
     * Set value
     */
    setValue(value: any): void;
    /**
     * Get group name
     */
    getGroupName(): string;
    /**
     * Set group name
     */
    setGroupName(groupName: string): void;
    /**
     * Get label text
     */
    getLabel(): string;
    /**
     * Set label text
     */
    setLabel(label: string): void;
}
