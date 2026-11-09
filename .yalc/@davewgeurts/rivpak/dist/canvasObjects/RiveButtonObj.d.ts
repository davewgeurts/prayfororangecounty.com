import { Artboard } from "@rive-app/webgl2-advanced";
import { RiveObjectDef } from "../controllers/RiveController";
import { RiveAnimationObject } from "./RiveAnimationObj";
import * as PIXI from "pixi.js";
export declare enum RIVE_BUTTON_STATES {
    UP = "UP",
    OVER = "OVER",
    OUT = "OUT",
    UNSELECTED = "UNSELECTED",
    SELECTED = "SELECTED",
    DISABLED = "DISABLED",
    DISABLED_OVER = "DISABLED_OVER",
    DISABLED_OVER_OUT = "DISABLED_OVER_OUT"
}
export declare enum RIVE_BUTTON_MODES {
    DISABLED = "DISABLED",
    BUTTON = "BUTTON",
    TOGGLE = "TOGGLE"
}
export type RiveColorARGB = [number, number, number, number];
export interface RiveButtonColors {
    BUTTON_COLOR?: RiveColorARGB;
    BUTTON_HOVER_COLOR?: RiveColorARGB;
    BUTTON_SELECTED_COLOR?: RiveColorARGB;
    BUTTON_DISABLED_COLOR?: RiveColorARGB;
    BUTTON_BORDER_COLOR?: RiveColorARGB;
    BUTTON_BORDER_HOVER_COLOR?: RiveColorARGB;
    BUTTON_CLICK_FX_COLOR?: RiveColorARGB;
    BACKDROP_COLOR?: RiveColorARGB;
    BACKDROP_BORDER_COLOR?: RiveColorARGB;
    BACKDROP_BORDER_HOVER_COLOR?: RiveColorARGB;
    BACKDROP_HOVER_COLOR?: RiveColorARGB;
    BACKDROP_SELECTED_COLOR?: RiveColorARGB;
    BACKDROP_DISABLED_COLOR?: RiveColorARGB;
}
export declare class RiveButtonObject extends RiveAnimationObject {
    private _debugButton;
    private _buttonMode;
    get RiveButtonMode(): RIVE_BUTTON_MODES;
    constructor(riveDef: RiveObjectDef, artboard: Artboard);
    Update(time: number, frameCount: number, onceSecond: boolean, onceMinute: boolean): void;
    InitRiveObject(): void;
    private _buttonInitialized;
    InitRiveButton(buttonMode?: RIVE_BUTTON_MODES, colorsObj?: RiveButtonColors): void;
    protected _riveButtonEnabled: boolean;
    DisableButton(): void;
    private static readonly IS_HIDDEN_PROP;
    protected _riveButtonHidden: boolean;
    get RiveButtonHidden(): boolean;
    HideButton(): void;
    ShowButton(): void;
    EnableButton(): void;
    private setButtonState;
    protected onClick(event: MouseEvent | PointerEvent | PIXI.PixiTouch): void;
    protected onHover(): void;
    protected onHoverOut(): void;
    Dispose(): void;
}
