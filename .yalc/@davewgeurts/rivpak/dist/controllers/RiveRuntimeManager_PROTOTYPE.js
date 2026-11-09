var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import RiveCanvas from "@rive-app/webgl2-advanced";
/**
 * RiveRuntimeManager - Singleton that manages a SHARED Rive runtime
 *
 * Multiple CanvasEngine instances can share the same Rive WASM runtime
 * for memory efficiency. Each instance gets its own renderer.
 */
export class RiveRuntimeManager {
    constructor() {
        this._riveInstance = null;
        this._initPromise = null;
        this._wasmSource = "local";
        this._wasmLocalBase = "/rive/";
    }
    static get() {
        if (!RiveRuntimeManager._instance) {
            RiveRuntimeManager._instance = new RiveRuntimeManager();
        }
        return RiveRuntimeManager._instance;
    }
    /**
     * Get or initialize the shared Rive runtime
     */
    GetRiveInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            const debug = false;
            // If already initialized, return it
            if (this._riveInstance) {
                if (debug)
                    console.log('%c RiveRuntimeManager: Returning existing Rive instance', 'color:#00ff00');
                return this._riveInstance;
            }
            // If initialization in progress, wait for it
            if (this._initPromise) {
                if (debug)
                    console.log('%c RiveRuntimeManager: Waiting for Rive initialization in progress', 'color:#ffaa00');
                return this._initPromise;
            }
            // Start initialization
            if (debug)
                console.log('%c RiveRuntimeManager: Initializing NEW Rive instance', 'color:#00ffff');
            this._initPromise = this.InitializeRive();
            this._riveInstance = yield this._initPromise;
            this._initPromise = null;
            return this._riveInstance;
        });
    }
    /**
     * Initialize the Rive runtime
     */
    InitializeRive() {
        return __awaiter(this, void 0, void 0, function* () {
            const debug = false;
            let locateFileConfig;
            if (this._wasmSource === "local") {
                locateFileConfig = {
                    locateFile: (file) => {
                        if (debug)
                            console.log('%c RiveRuntimeManager: Loading WASM from local path:', 'color:#00ffff', this._wasmLocalBase + file);
                        return this._wasmLocalBase + file;
                    }
                };
            }
            else if (this._wasmSource === "cdn") {
                // Use default CDN (don't pass locateFile)
                locateFileConfig = undefined;
            }
            const riveInstance = yield RiveCanvas(locateFileConfig);
            if (debug)
                console.log('%c RiveRuntimeManager: Rive runtime initialized successfully', 'color:#00ff00');
            return riveInstance;
        });
    }
    /**
     * Set WASM source location
     */
    SetWasmSource(source, localBase) {
        this._wasmSource = source;
        if (localBase)
            this._wasmLocalBase = localBase;
    }
    /**
     * Check if Rive runtime is initialized
     */
    get IsInitialized() {
        return this._riveInstance !== null;
    }
    /**
     * Dispose the shared Rive runtime (use with caution!)
     * This will affect all instances using it.
     */
    Dispose() {
        const debug = false;
        if (debug)
            console.log('%c RiveRuntimeManager: Disposing shared Rive runtime', 'color:#ff0000');
        // Note: We don't actually delete the Rive instance here
        // because it may still be in use by other canvas instances
        this._riveInstance = null;
        this._initPromise = null;
    }
}
