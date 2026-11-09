import { PubSubChannel } from "./SharedNetworking.js";
export interface PresenceSoul {
    sid: string;
    region: string;
    lat: number;
    lon: number;
    color: string;
    chapter?: string;
    persona?: string;
    lastSeen: number;
    isAmbient?: boolean;
}
export interface PresenceRipple {
    id: string;
    region: string;
    lat: number;
    lon: number;
    color: string;
    ts: number;
}
export interface PresenceHug {
    id: string;
    fromSid: string;
    fromRegion: string;
    fromLat: number;
    fromLon: number;
    toSid: string;
    toRegion: string;
    toLat: number;
    toLon: number;
    color: string;
    ts: number;
}
export interface PresenceHugPin {
    id: string;
    region: string;
    lat: number;
    lon: number;
    color: string;
    count: number;
    lastHugTs: number;
}
export interface PresenceSnapshot {
    activeCount: number;
    activeSouls: PresenceSoul[];
    totalVisits: number;
    dayVisits: number;
    totalHugs: number;
    recentRipples: PresenceRipple[];
    recentHugs: PresenceHug[];
    hugPins: PresenceHugPin[];
}
export interface PresenceControllerConfig {
    storageKeyPrefix?: string;
    apiUrl?: string;
    site?: string;
    defaultChapter?: string;
}
export declare const PresenceStatePubSub: PubSubChannel<PresenceSnapshot>;
export declare const PresenceGongRipplePubSub: PubSubChannel<PresenceRipple>;
export declare const PresenceHugPubSub: PubSubChannel<PresenceHug>;
export declare const PLEDGES_API_URL: string;
export declare const LONELIEST_PRESENCE_API_URL: string;
export declare const DEFAULT_PRESENCE_API_URL: string;
export declare function playLoveHugChime(): void;
export declare function resolveBrowserLocation(): {
    region: string;
    lat: number;
    lon: number;
};
/**
 * Converts (lat, lon) in degrees into 2D SVG globe coordinates within `radius` (default 118)
 * so souls and gong ripples land cleanly on the HealthyPlanetEarth sphere (r=158).
 */
export declare function latLonToGlobeXY(lat: number, lon: number, radius?: number): {
    x: number;
    y: number;
};
export declare class PresenceController {
    private static instance;
    private static defaultConfig;
    static configure(config: PresenceControllerConfig): void;
    static get(config?: PresenceControllerConfig): PresenceController;
    static getInstance(config?: PresenceControllerConfig): PresenceController;
    private storageKeyPrefix;
    private apiUrl;
    private site?;
    private readonly localSoul;
    private snapshot;
    private isRunning;
    private initialPostSentInMemory;
    private heartbeatTimer;
    private syncPollTimer;
    private lastInteractionTs;
    private lastGongNetworkTs;
    private lastHugNetworkTs;
    private seenRippleIds;
    private seenHugIds;
    private readonly boundHandleActivity;
    private readonly boundHandleVisibility;
    constructor(config?: PresenceControllerConfig);
    applyConfig(config: PresenceControllerConfig): void;
    getLocalSoul(): PresenceSoul;
    getSnapshot(): PresenceSnapshot;
    getState(): PresenceSnapshot;
    setCurrentChapterInfo(chapter: string, persona?: string): void;
    private mergeSoulsWithAmbient;
    start(): void;
    stop(): void;
    emitGongRipple(): Promise<PresenceRipple>;
    triggerGongRipple(): Promise<PresenceRipple>;
    sendHug(targetSoul?: PresenceSoul): Promise<PresenceHug>;
    private applyServerPayload;
    private fetchPresenceState;
    private sendPresencePost;
}
export default PresenceController;
