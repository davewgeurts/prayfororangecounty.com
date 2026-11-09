import { CanvasObj } from "@sims11tz/rivpak";
import { CanvasSequencer, SequenceItem, EASING_TYPE } from "./canvasSequencer";
export declare class CanvasSequenceManager {
    private static _instance;
    static get(): CanvasSequenceManager;
    private _sequencers;
    private _activeSequencers;
    private constructor();
    CreateSequence(target: CanvasObj, id?: string): CanvasSequencer;
    GetSequence(id: string): CanvasSequencer | undefined;
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
