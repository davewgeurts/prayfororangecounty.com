import { CanvasObj } from "@sims11tz/rivpak";
export declare class ExampleSequences {
    static BounceIn(target: CanvasObj, finalScale?: number, duration?: number): void;
    static SpringIn(target: CanvasObj, finalScale?: number, stiffness?: number, damping?: number): void;
    static ElasticPop(target: CanvasObj, overshoot?: number, finalScale?: number): void;
    static StaggeredAppear(targets: CanvasObj[], staggerDelay?: number, finalScale?: number): void;
}
