/**
 * Canvas Text Input Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
export interface TextInputConfig extends UIComponentConfig {
    placeholder?: string;
    value?: string;
    type?: 'text' | 'password' | 'email' | 'number';
    maxLength?: number;
    pattern?: RegExp;
    multiline?: boolean;
    rows?: number;
    readOnly?: boolean;
    clearable?: boolean;
    prefix?: string;
    suffix?: string;
    autoFocus?: boolean;
    selectOnFocus?: boolean;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
}
export declare class CanvasTextInputObj extends BaseUIComponent {
    private _inputConfig;
    private _type;
    private _placeholder;
    private _maxLength;
    private _pattern;
    private _multiline;
    private _readOnly;
    private _text;
    private _placeholderText;
    private _prefixText;
    private _suffixText;
    private _cursor;
    private _selection;
    private _clearButton;
    private _cursorPosition;
    private _selectionStart;
    private _selectionEnd;
    private _cursorVisible;
    private _cursorBlinkTimer;
    private _hiddenInput;
    constructor(config: TextInputConfig);
    protected InitComponent(): void;
    private createHiddenInput;
    protected Render(): void;
    private getDisplayValue;
    private getCursorX;
    private getCharacterX;
    protected HandlePointerDown: (event: PIXI.FederatedPointerEvent) => void;
    private setCursorFromPosition;
    private HandleHTMLInput;
    private HandleKeyDown;
    private HandleHTMLBlur;
    private HandleClearClick;
    /**
     * Focus the input
     */
    focus(): void;
    /**
     * Blur the input
     */
    blur(): void;
    /**
     * Update animation
     */
    Update(time: number, frameCount: number, onceSecond: boolean): void;
    /**
     * Validate input
     */
    validate(): boolean;
    /**
     * Set value
     */
    setValue(value: string): void;
    /**
     * Clear input
     */
    clear(): void;
    /**
     * Dispose
     */
    Dispose(): void;
}
