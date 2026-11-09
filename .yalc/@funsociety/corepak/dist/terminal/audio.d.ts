export declare function hasUserInteracted(): boolean;
export declare class SoundEffects {
    private ctx;
    private isMuted;
    constructor();
    private init;
    playKey(): void;
    playSuccess(): void;
    playWin(): void;
    playError(): void;
    playCoin(): void;
    get enabled(): boolean;
    set enabled(value: boolean);
    toggleMute(): boolean;
}
export { SoundEffects as SoundSystem };
export declare const sounds: SoundEffects;
