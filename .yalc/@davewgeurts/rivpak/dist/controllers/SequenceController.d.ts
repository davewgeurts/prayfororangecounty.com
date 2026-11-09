import { CanvasObj } from "../canvasObjects/CanvasObj";
import { CanvasSequence, SequenceItem, EASING_TYPE } from "./CanvasSequence";
export declare class CanvasSequenceController {
    private static _instance;
    static get(): CanvasSequenceController;
    private _sequencers;
    private _activeSequencers;
    private constructor();
    CreateSequence(target: CanvasObj, id?: string): CanvasSequence;
    GetSequence(id: string): CanvasSequence | undefined;
    PlaySequence(id: string, onComplete?: () => void): void;
    StopSequence(id: string): void;
    PauseSequence(id: string): void;
    ResumeSequence(id: string): void;
    RemoveSequence(id: string): void;
    Update(time: number, deltaTime: number, frameCount: number, oncePerSecond: boolean): void;
    StopAll(): void;
    Clear(): void;
    QuickMove(target: CanvasObj, x: number, y: number, duration?: number, easing?: EASING_TYPE, onComplete?: () => void): void;
    QuickScale(target: CanvasObj, xScale: number, yScale: number, duration?: number, easing?: EASING_TYPE, onComplete?: () => void): void;
    QuickSequence(target: CanvasObj, items: SequenceItem[], onComplete?: () => void): void;
    QuickSpring(target: CanvasObj, property: "x" | "y" | "xScale" | "yScale", targetValue: number, stiffness?: number, damping?: number, onComplete?: () => void): void;
    QuickBounce(target: CanvasObj, x: number, y: number, duration?: number, onComplete?: () => void): void;
    QuickElastic(target: CanvasObj, xScale: number, yScale: number, onComplete?: () => void): void;
}
