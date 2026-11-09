/**
 * Canvas Button Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
import { InteractionCallback } from "../base/UIEventTypes";
export interface ButtonConfig extends UIComponentConfig {
    text: string;
    value?: any;
    icon?: string;
    iconPosition?: 'left' | 'right';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    fontSize?: number;
    toggle?: boolean;
    selected?: boolean;
    onClick?: InteractionCallback;
    onPress?: InteractionCallback;
    onRelease?: InteractionCallback;
}
export declare class CanvasButtonObj extends BaseUIComponent {
    private _text;
    private _buttonConfig;
    private _toggle;
    private _selected;
    private _variant;
    private _size;
    private _fontSize;
    private _buttonText;
    private _currentScale;
    private _targetScale;
    private _parentHandlePointerDown?;
    private _parentHandlePointerUp?;
    private _parentHandlePointerOver?;
    private _parentHandlePointerOut?;
    constructor(config: ButtonConfig);
    protected InitComponent(): void;
    protected Render(): void;
    private getBackgroundColor;
    private getBorderColor;
    private getTextColor;
    protected HandlePointerDown: (event: PIXI.FederatedPointerEvent) => void;
    protected HandlePointerUp: (event: PIXI.FederatedPointerEvent) => void;
    protected HandlePointerOver: (event: PIXI.FederatedPointerEvent) => void;
    protected HandlePointerOut: (event: PIXI.FederatedPointerEvent) => void;
    protected UpdateAnimation(progress: number): void;
    /**
     * Set button text
     */
    setText(text: string): void;
    /**
     * Get button text
     */
    getText(): string;
    /**
     * Set button font size
     */
    setFontSize(fontSize: number): void;
    /**
     * Get button font size
     */
    getFontSize(): number | undefined;
    /**
     * Set selected state (for toggle buttons)
     */
    setSelected(selected: boolean): void;
    /**
     * Get selected state
     */
    getSelected(): boolean;
    /**
     * Override getValue for toggle buttons
     */
    getValue(): any;
}
