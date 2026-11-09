import RiveCanvas from "@rive-app/webgl2-advanced";
/**
 * RiveRuntimeManager - Singleton that manages a SHARED Rive runtime
 *
 * Multiple CanvasEngine instances can share the same Rive WASM runtime
 * for memory efficiency. Each instance gets its own renderer.
 */
export declare class RiveRuntimeManager {
    private static _instance;
    static get(): RiveRuntimeManager;
    private _riveInstance;
    private _initPromise;
    private _wasmSource;
    private _wasmLocalBase;
    /**
     * Get or initialize the shared Rive runtime
     */
    GetRiveInstance(): Promise<Awaited<ReturnType<typeof RiveCanvas>>>;
    /**
     * Initialize the Rive runtime
     */
    private InitializeRive;
    /**
     * Set WASM source location
     */
    SetWasmSource(source: "local" | "cdn" | "custom", localBase?: string): void;
    /**
     * Check if Rive runtime is initialized
     */
    get IsInitialized(): boolean;
    /**
     * Dispose the shared Rive runtime (use with caution!)
     * This will affect all instances using it.
     */
    Dispose(): void;
}
