import { BaseCanvasObj } from "../canvasObjects/_baseCanvasObj";
import { CanvasSequence, SequenceItem, EASING_TYPE } from "./CanvasSequence";
export declare class CanvasSequenceController {
    private static _instance;
    static get(): CanvasSequenceController;
    private _sequencers;
    private _activeSequencers;
    private constructor();
    CreateSequence(target: BaseCanvasObj, id?: string): CanvasSequence;
    GetSequence(id: string): CanvasSequence | undefined;
    PlaySequence(id: string, onComplete?: () => void): void;
    StopSequence(id: string): void;
    PauseSequence(id: string): void;
    ResumeSequence(id: string): void;
    RemoveSequence(id: string): void;
    Update(time: number, deltaTime: number, frameCount: number, oncePerSecond: boolean): void;
    StopAll(): void;
    Clear(): void;
    QuickMove(target: BaseCanvasObj, x: number, y: number, duration?: number, easing?: EASING_TYPE, onComplete?: () => void): void;
    QuickScale(target: BaseCanvasObj, xScale: number, yScale: number, duration?: number, easing?: EASING_TYPE, onComplete?: () => void): void;
    QuickSequence(target: BaseCanvasObj, items: SequenceItem[], onComplete?: () => void): void;
    QuickSpring(target: BaseCanvasObj, property: "x" | "y" | "xScale" | "yScale", targetValue: number, stiffness?: number, damping?: number, onComplete?: () => void): void;
    QuickBounce(target: BaseCanvasObj, x: number, y: number, duration?: number, onComplete?: () => void): void;
    QuickElastic(target: BaseCanvasObj, xScale: number, yScale: number, onComplete?: () => void): void;
}
