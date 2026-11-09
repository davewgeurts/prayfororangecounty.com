import * as PIXI from "pixi.js";
import { CanvasPixiShapeObj } from "./CanvasPixiShapeObj";
import { CanvasObjectDef } from "./_baseCanvasObj";
export interface TextAreaBackgroundOptions {
    enabled: boolean;
    fill?: number | string | number[] | string[];
    alpha?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: number | string;
    borderAlpha?: number;
    padding?: number;
    gradientType?: 'linear' | 'radial';
    gradientStops?: Array<{
        offset: number;
        color: number | string;
    }>;
    shadowBlur?: number;
    shadowColor?: number | string;
    shadowDistance?: number;
    shadowAngle?: number;
    shadowAlpha?: number;
    autoSize?: boolean;
}
export interface CanvasTextAreaDef extends CanvasObjectDef {
    lines?: string[];
    lineHeight?: number;
    maxLines?: number;
    background?: TextAreaBackgroundOptions;
    textStyle?: Partial<PIXI.TextStyleOptions>;
    lineSpacing?: number;
}
export declare class CanvasTextAreaObj extends CanvasPixiShapeObj {
    private _textLines;
    private _backgroundGraphics;
    private _shadowGraphics;
    private _lines;
    private _lineHeight;
    private _maxLines;
    private _lineSpacing;
    private _background;
    private _textStyle;
    private _lastLinesHash;
    private _scrollToBottom;
    constructor(canvasDef: CanvasTextAreaDef);
    private get canvasTextAreaDef();
    InitVisuals(): void;
    getMaxTextWidth(): number;
    private createBackground;
    private createTextLines;
    private clearTextLines;
    SetLines(lines: string[]): void;
    AddLine(line: string): void;
    /**
     * Set whether to scroll to bottom when adding new lines
     */
    SetScrollToBottom(scroll: boolean): void;
    ClearLines(): void;
    private updateTextLines;
    SetTextStyle(style: Partial<PIXI.TextStyleOptions>): void;
    SetBackground(options: TextAreaBackgroundOptions): void;
    /**
     * Get the number of lines with actual content
     */
    GetVisibleLinesCount(): number;
    /**
     * Get all current lines
     */
    GetLines(): string[];
    ToggleVisibility(): void;
    Update(time: number, frameCount: number, onceSecond: boolean): void;
    Dispose(): void;
}
