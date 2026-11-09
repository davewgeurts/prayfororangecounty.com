import * as PIXI from "pixi.js";
import { CanvasObjectDef } from "../canvasObjects/_baseCanvasObj";
import { RiveController } from "./RiveController";
export declare enum PIXI_OBJECT_TYPE {
    GRAPHICS = "GRAPHICS",
    TEXTURE = "TEXTURE"
}
export declare enum PIXI_LAYER {
    ABOVE = "ABOVE",
    BELOW = "BELOW"
}
export interface PixiObjectDef extends CanvasObjectDef {
    type: PIXI_OBJECT_TYPE;
}
export declare class PixiController {
    static myInstance: PixiController;
    static get(): PixiController;
    private _pixiInstanceAbove;
    get PixiAbove(): PIXI.Application<PIXI.Renderer>;
    private _pixiInstanceBelow;
    get PixiBelow(): PIXI.Application<PIXI.Renderer>;
    GetPixiInstance(layer?: PIXI_LAYER): PIXI.Application;
    GetStageOrNull(layer?: PIXI_LAYER): PIXI.Container | null;
    private _CanvasAbove;
    private _CanvasBelow;
    private _canvasContainer;
    private _pairedRiveController;
    private _initialized;
    private _disposed;
    Init(width?: number, height?: number, canvasContainer?: HTMLDivElement, riveController?: RiveController): Promise<void>;
    Update(time: number, frameCount: number, onceSecond: boolean, onceMinute: boolean): void;
    SetSize(width: number, height: number, dprIn?: number): void;
    Dispose(): void;
    Debug(opts?: {
        layer?: PIXI_LAYER | "BOTH";
        maxDepth?: number;
        includeBounds?: boolean;
        includeWorldTransform?: boolean;
        includeEventMode?: boolean;
        includeHitArea?: boolean;
        includeVisibility?: boolean;
        includeZIndex?: boolean;
        includeTextureInfo?: boolean;
        filter?: (d: any) => boolean;
    }): void;
}
