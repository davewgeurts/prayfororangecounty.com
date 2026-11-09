import type { File as RiveFile, Artboard, Renderer, RiveCanvas } from "@rive-app/webgl2-advanced";
import { CanvasRiveObj } from "../canvasObjects/CanvasRiveObj";
import { CanvasObjectDef, CanvasObjectEntity } from "../canvasObjects/_baseCanvasObj";
import * as PIXI from "pixi.js";
import { ArtboardInfo } from "../RivePakUtils";
import { RendererType } from "../utils/RendererFactory";
export declare enum RIVE_OBJECT_TYPE {
    ANIMATION = "ANIMATION",
    PHYSICS = "PHYSICS"
}
export interface RiveObjectDef extends CanvasObjectDef {
    filePath: string;
    objectType: RIVE_OBJECT_TYPE;
    artboardName: string;
    id?: string;
    primaryVMName?: string;
    startTransparent?: boolean;
    layoutFit?: any;
    layoutAlignment?: any;
    onClickCallback?: (event: MouseEvent | PointerEvent | PIXI.PixiTouch, sourceObj: CanvasRiveObj) => void;
    onHoverCallback?: (sourceObj: CanvasRiveObj) => void;
    onHoverOutCallback?: (sourceObj: CanvasRiveObj) => void;
    classType?: new (def: RiveObjectDef, artboard: Artboard) => CanvasRiveObj;
}
export declare class RiveObjectsSet {
    objects: CanvasRiveObj[];
    constructor({ objects }: {
        objects: CanvasRiveObj[];
    });
    GetObjectByIdx(idx: number): CanvasRiveObj | null;
    GetObjectById(id: string): CanvasRiveObj | null;
    GetObjectByArtboardName(artboardByName: string): CanvasRiveObj | null;
    GetObjectByFilePath(filePath: string): CanvasRiveObj | null;
    GetObjectByLabel(label: string): CanvasRiveObj | null;
}
type WasmSource = "local" | "cdn" | "custom";
export declare class RiveController {
    static myInstance: RiveController;
    static get(): RiveController;
    private _riveInstance;
    get Rive(): RiveCanvas;
    private _riveRenderer;
    get Renderer(): Renderer;
    private _canvas;
    get Canvas(): HTMLCanvasElement;
    private _canvasBounds;
    get CanvasBounds(): DOMRect;
    private _canvasGlobalBounds;
    get CanvasGlobalBounds(): DOMRect;
    private _riveObjectsSet;
    get RiveObjectsSet(): RiveObjectsSet;
    private _riveFileCache;
    private _initCalled;
    private _cache;
    private _loadingPromises;
    private _disposed;
    private _activeRendererType;
    get ActiveRendererType(): RendererType;
    get RendererInfo(): import("../utils/RendererFactory").RendererInfo;
    private _wasmSource;
    private _wasmLocalBase;
    private _wasmCdnVersion;
    private get _wasmCdnBase();
    private _wasmCustomBase;
    /**
     * Configure where to load the Rive WASM from.
     * Call before Init().
     *  - source: "local" | "cdn" | "custom"
     *  - customBase: required if source === "custom" (e.g. "https://cdn.example.com/rive/")
     */
    ConfigureWasm(source: WasmSource, customBase?: string): void;
    private _getWasmUrl;
    private fetchAndHash;
    private _debug;
    private _unsubscribeResize;
    Init(canvas: HTMLCanvasElement): Promise<void>;
    private _pendingCursor;
    private _cursorFlushScheduled;
    SetCanvasCursor(cursor: string, force?: boolean): void;
    private _mergeCursor;
    SetSize(width: number, height: number, dprIn?: number): void;
    CreateRiveObj(riveObjDefs: RiveObjectDef | RiveObjectDef[]): Promise<RiveObjectsSet>;
    private fetchWithRetry;
    private loadRiveFiles;
    private _mousePos;
    private _mouseGlobalPos;
    private _mouseDown;
    SetMousePos(x: number, y: number): void;
    SetMouseGlobalPos: (e: MouseEvent) => void;
    get MousePos(): {
        x: number;
        y: number;
    };
    SetMouseDown(down: boolean): void;
    get MouseDown(): boolean;
    CanvasToArtboard(entity: CanvasObjectEntity, interactiveCheck?: boolean): {
        x: number;
        y: number;
    };
    WindowToArtboard(entity: CanvasObjectEntity, interactiveCheck?: boolean): {
        x: number;
        y: number;
    };
    /**
     * Load a Rive file and return info about all its artboards.
     * Useful for exploring what artboards exist in a file.
     * @param filePath - Path to the .riv file
     * @param dumpToConsole - If true, also logs the info to console
     * @returns Array of ArtboardInfo objects
     */
    /**
     * Load (and cache) a raw Rive File handle by path. Unlike CreateRiveObj this does
     * not create a CanvasRiveObj — it just returns the advanced-runtime File so callers
     * can use data-binding features such as bindableArtboardByName() or viewModelByName().
     * The File is cached per path and reused on subsequent calls.
     * @param filePath - Path to the .riv file
     * @returns The loaded File, or null if loading failed / not initialized.
     */
    GetRiveFile(filePath: string): Promise<RiveFile | null>;
    GetArtboardsFromFile(filePath: string, dumpToConsole?: boolean): Promise<ArtboardInfo[]>;
    /**
     * Get info about a specific artboard by name from a file.
     * Also attempts to enumerate any nested artboards/components.
     * @param filePath - Path to the .riv file
     * @param artboardName - Name of the artboard to inspect
     */
    InspectArtboard(filePath: string, artboardName: string): Promise<void>;
    Dispose(): void;
}
export {};
