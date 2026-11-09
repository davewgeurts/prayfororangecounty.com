import Matter from "matter-js";
import type { TextStyleOptions } from "pixi.js";
import { PIXI_LAYER } from "../controllers/PixiController";
export declare enum OBJECT_SCALE_MODE {
    MANUAL = "MANUAL",// Explicit xScale/yScale values (current default behavior)
    FIT = "FIT",// Scale to fit inside bounds, maintain aspect ratio
    FILL = "FILL",// Scale to fill bounds completely, maintain aspect ratio (may crop)
    STRETCH = "STRETCH",// Scale to fill bounds exactly, break aspect ratio if needed
    LAYOUT = "LAYOUT"
}
export declare enum OBJECT_SCALE_ALIGN {
    DEFAULT = "default",
    TOP = "top",
    BOTTOM = "bottom",
    BOTTOM_CENTER = "bottom-center",
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center",
    TOP_CENTER = "top-center",
    TOP_LEFT = "top-left",
    TOP_RIGHT = "top-right",
    BOTTOM_LEFT = "bottom-left",
    BOTTOM_RIGHT = "bottom-right"
}
export declare class GlobalUIDGenerator {
    private static currentId;
    static generateUID(): string;
    private static uniqueIds;
    static generateUniqueString(baseString: string): string;
    static clear(): void;
}
export interface CanvasObjectEntity {
    width?: number;
    height?: number;
    xScale?: number;
    yScale?: number;
    xSpeed?: number;
    x?: number;
    y?: number;
    z?: number;
    resolutionScale?: number;
    riveInteractiveLocalOnly?: boolean;
}
export interface CanvasObjectDef {
    uuid?: string;
    label?: string;
    text?: string;
    visible?: boolean;
    render?: boolean;
    textStyle?: Partial<TextStyleOptions>;
    textStyleOver?: Partial<TextStyleOptions>;
    textStyleDown?: Partial<TextStyleOptions>;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    debugMode?: boolean;
    debugLogs?: boolean;
    drawFunction?: (pixiGraphics: any, defObj: CanvasObjectDef) => void;
    clickFunction?: (canvasObj: BaseCanvasObj) => void;
    bgColor?: string | number;
    bgAlpha?: number;
    borderColor?: string | number;
    borderWidth?: number;
    borderAlpha?: number;
    borderRadius?: number;
    cornerRadius?: number;
    diameter?: number;
    radius?: number;
    starPoints?: number;
    starInnerRadiusRatio?: number;
    polygonSides?: number;
    arrowHeadSize?: number;
    crossThickness?: number;
    gradientFrom?: number;
    gradientTo?: number;
    burstSpikes?: number;
    burstInnerRadiusRatio?: number;
    tailSize?: number;
    gearTeeth?: number;
    wordWrap?: boolean;
    wordWrapWidth?: number;
    breakWords?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    textShadow?: boolean;
    textShadowColor?: string | number;
    textShadowBlur?: number;
    textShadowAngle?: number;
    textShadowDistance?: number;
    textShadowAlpha?: number;
    typewriterEffect?: boolean;
    typewriterSpeed?: number;
    fadeInDuration?: number;
    pulseText?: boolean;
    pulseSpeed?: number;
    letterSpacing?: number;
    lineHeight?: number;
    padding?: number;
    trimText?: boolean;
    resolution?: number;
    textUnderline?: boolean;
    underlineColor?: string | number;
    underlineThickness?: number;
    underlineOffset?: number;
    underlineAlpha?: number;
    count?: number;
    width?: number;
    height?: number;
    constrainProportions?: boolean;
    xScale?: number;
    yScale?: number;
    scaleMode?: OBJECT_SCALE_MODE;
    scaleAlign?: OBJECT_SCALE_ALIGN;
    scaleBounds?: {
        width: number;
        height: number;
    };
    x?: number;
    y?: number;
    z?: number;
    centerLocally?: boolean;
    centerGlobally?: boolean;
    baseX?: number;
    baseY?: number;
    baseXScale?: number;
    baseYScale?: number;
    group?: string;
    randomSpeed?: boolean;
    xSpeed?: number;
    ySpeed?: number;
    collisionWidthRatio?: number;
    collisionHeightRatio?: number;
    collisionXOffset?: number;
    collisionYOffset?: number;
    visualXOffset?: number;
    visualYOffset?: number;
    pixiLayer?: PIXI_LAYER;
    interactive?: boolean;
    riveInteractive?: boolean;
    riveInteractiveLocalOnly?: boolean;
}
export declare abstract class BaseCanvasObj {
    _uuid: string;
    get uuid(): string;
    _id: string;
    get id(): string;
    _label: string;
    get label(): string;
    _defObj: CanvasObjectDef | null;
    get defObj(): CanvasObjectDef;
    enabled: boolean;
    _state: {
        x: number;
        y: number;
        z: number;
        xScale: number;
        yScale: number;
        visible: boolean;
        render: boolean;
    };
    centerLocally: boolean;
    centerGlobally: boolean;
    /**
     * When true, this object manages its own visibility independently from its parent.
     * Parent visibility changes will not affect this object's visibility.
     */
    independentVisibility: boolean;
    group: string;
    width: number;
    height: number;
    _parent: BaseCanvasObj | null;
    SetParent(parent: BaseCanvasObj | null): void;
    get parent(): BaseCanvasObj | null;
    _worldX: number;
    _worldY: number;
    _worldXScale: number;
    _worldYScale: number;
    constrainProportions: boolean;
    get resolutionScale(): number;
    _resolutionScale: number;
    get transformedWidth(): number;
    _transformedWidth: number;
    _transformedWidthlast: number;
    get transformedHeight(): number;
    _transformedHeight: number;
    _transformedHeightlast: number;
    get transformedX(): number;
    _transformedX: number;
    _transformedXlast: number;
    get transformedY(): number;
    _transformedY: number;
    _transformedYlast: number;
    _objBoundsReuse: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    };
    _visualXOffset: number;
    _visualYOffset: number;
    get visualXOffset(): number;
    set visualXOffset(value: number);
    get visualYOffset(): number;
    set visualYOffset(value: number);
    /**
     * Set both visual offsets at once
     * @param xOffset Horizontal offset (positive = right)
     * @param yOffset Vertical offset (positive = down)
     */
    SetVisualOffset(xOffset: number, yOffset: number): void;
    _body: Matter.Body | null;
    _disposed: boolean;
    _debugRive: boolean;
    _debugLogs: boolean;
    _propertyChangeListeners: Map<"x" | "y" | "z" | "xScale" | "yScale" | "visible" | "render", (oldValue: number | boolean, newValue: number | boolean) => void>;
    constructor(defObj: CanvasObjectDef);
    get visible(): boolean;
    set visible(value: boolean);
    get render(): boolean;
    set render(value: boolean);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get xScale(): number;
    set xScale(value: number);
    get yScale(): number;
    set yScale(value: number);
    get renderX(): number;
    get renderY(): number;
    get renderXScale(): number;
    get renderYScale(): number;
    InitVisuals(): void;
    OnCanvasResize(_canvasWidth: number, _canvasHeight: number, _scale: number): void;
    ApplyResolutionScale(scale: number, property?: string): void;
    Update(time: number, frameCount: number, onceSecond: boolean, onceMinute: boolean, centerWidth?: number, centerHeight?: number): void;
    SwapDepths(other: BaseCanvasObj): void;
    BindPropertyChange(property: "x" | "y" | "z" | "xScale" | "yScale" | "visible", callback: (oldValue: number | boolean, newValue: number | boolean) => void): void;
    UnbindPropertyChange(property: "x" | "y" | "z" | "xScale" | "yScale" | "visible"): void;
    set OnZIndexChanged(func: ((canvasObj: BaseCanvasObj, oldZIndex: number, newZIndex: number) => void) | null);
    _OnZIndexChanged: ((canvasObj: BaseCanvasObj, oldZIndex: number, newZIndex: number) => void) | null;
    set OnDispose(func: ((canvasObj: BaseCanvasObj) => void) | null);
    _OnDispose: ((canvasObj: BaseCanvasObj) => void) | null;
    /**
     * Hook method called when object gets a parent (added to engine/container)
     * Subclasses can override to handle initialization that requires parent context
     */
    OnParentAdded(): void;
    /**
     * Hook method called when object loses its parent (removed from engine/container)
     * Subclasses can override to handle cleanup that requires parent context
     */
    OnParentRemoved(): void;
    Dispose(): void;
}
