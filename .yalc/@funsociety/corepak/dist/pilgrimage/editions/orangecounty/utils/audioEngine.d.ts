export type RadioStation = 'x96' | 'wasatch';
export type RadioSource = 'x96-live' | 'rfh-podcast' | 'wasatch-synth' | 'custom-track';
export interface RadioStatus {
    station: RadioStation;
    source: RadioSource;
    label: string;
    nowPlaying: string;
    playing: boolean;
}
export declare class CanyonAudioEngine {
    private static instance;
    private ctx;
    private engineOsc;
    private engineGain;
    private windGain;
    private radioGain;
    private radioMelodyTimer;
    private radioPlaying;
    private customAudio;
    private customAudioIsLive;
    private radioStation;
    private radioSource;
    private radioStarted;
    private inSilentRock;
    private nowPlaying;
    private nowPlayingTimer;
    private nowPlayingGeneration;
    private radioListeners;
    private constructor();
    static get(): CanyonAudioEngine;
    init(): void;
    private setupEngineSound;
    private setupWindSound;
    private setupRadioSynthesizer;
    updateCarSpeed(speedMph: number): void;
    setSilentRockSilence(inSilence: boolean): void;
    toggleRadio(): boolean;
    /** Flip the dial between KROQ 106.7 and the built-in Pacific Surf Synth. */
    cycleRadioStation(): RadioStation;
    tuneStation(station: RadioStation): void;
    getRadioStatus(): RadioStatus;
    /** Listener is called immediately with the current status, then on every change. */
    subscribeRadio(listener: (status: RadioStatus) => void): () => void;
    private emitRadioStatus;
    private playX96Live;
    private playRfhPodcast;
    private playExternalAudio;
    private stopExternalAudio;
    private resumeExternalAudio;
    private applyRadioLevels;
    private startNowPlayingPolling;
    playShrineChime(): void;
    playPoliceSiren(): void;
    playJailDoorSlam(): void;
    playBailBuzzer(): void;
    playCarHorn(): void;
    playSodaSlurp(): void;
    playGasPumpClick(): void;
    playCashRegister(): void;
    playTireScreech(): void;
    /**
     * Slot for external MP3 / MP4 voiceover or soundtrack playback.
     */
    setCustomAudioTrack(url: string): void;
    dispose(): void;
}
