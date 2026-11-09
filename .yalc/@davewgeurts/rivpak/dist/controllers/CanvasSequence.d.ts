import { BaseCanvasObj } from "../canvasObjects/_baseCanvasObj";
export declare enum EASING_TYPE {
    LINEAR = "linear",
    EASE_IN = "easeIn",
    EASE_OUT = "easeOut",
    EASE_IN_OUT = "easeInOut",
    BOUNCE_IN = "bounceIn",
    BOUNCE_OUT = "bounceOut",
    BOUNCE_IN_OUT = "bounceInOut",
    BACK_IN = "backIn",
    BACK_OUT = "backOut",
    BACK_IN_OUT = "backInOut",
    CIRC_IN = "circIn",
    CIRC_OUT = "circOut",
    CIRC_IN_OUT = "circInOut",
    ANTICIPATE = "anticipate",
    SPRING = "spring",
    DECAY = "decay"
}
export declare enum ANIMATION_TYPE {
    TWEEN = "tween",
    SPRING = "spring",
    DECAY = "decay"
}
export type AnimatableProperty = "x" | "y" | "z" | "xScale" | "yScale" | "width" | "height";
export interface SequenceAction {
    property: AnimatableProperty;
    targetValue: number;
    duration?: number;
    easing?: EASING_TYPE;
    animationType?: ANIMATION_TYPE;
    delay?: number;
    onStart?: () => void;
    onComplete?: () => void;
    onUpdate?: (progress: number) => void;
    stiffness?: number;
    damping?: number;
    mass?: number;
    velocity?: number;
    power?: number;
    timeConstant?: number;
    modifyTarget?: (target: number) => number;
}
export interface ParallelActions {
    actions: SequenceAction[];
}
export type SequenceItem = SequenceAction | ParallelActions;
export declare class CanvasSequence {
    private _target;
    private _sequence;
    private _currentIndex;
    private _activeAnimations;
    private _isPlaying;
    private _isPaused;
    private _onSequenceComplete;
    private _currentTime;
    private _looping;
    private _debug;
    private _lastDebugTime;
    private _debugTimerName;
    constructor(target: BaseCanvasObj);
    Add(item: SequenceItem): CanvasSequence;
    AddMove(x?: number, y?: number, duration?: number, easing?: EASING_TYPE): CanvasSequence;
    AddScale(xScale?: number, yScale?: number, duration?: number, easing?: EASING_TYPE): CanvasSequence;
    AddDelay(duration: number): CanvasSequence;
    AddCallback(callback: () => void): CanvasSequence;
    AddSpring(property: AnimatableProperty, targetValue: number, stiffness?: number, damping?: number, mass?: number): CanvasSequence;
    AddDecay(property: AnimatableProperty, velocity?: number, power?: number, timeConstant?: number, modifyTarget?: (target: number) => number): CanvasSequence;
    Play(onComplete?: () => void): void;
    Pause(): void;
    Resume(): void;
    Stop(): void;
    SetLooping(loop: boolean): CanvasSequence;
    Clear(): CanvasSequence;
    Update(time: number, deltaTime: number, frameCount: number, oncePerSecond: boolean): void;
    private _startNextItem;
    private _startAction;
    private _startPopmotionAnimation;
    private _onItemComplete;
    getTimeSinceLastCall(timerName?: string): string;
    private _isParallelActions;
    private _getEasingFunction;
}
