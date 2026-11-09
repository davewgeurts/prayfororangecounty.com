export declare const X96_STATION: {
    callSign: string;
    name: string;
    frequency: string;
    tagline: string;
    owner: string;
    studioAddress: string;
    studioCity: string;
    studioCrossStreets: string;
    phone: string;
    hd2Name: string;
    streamUrl: string;
    nowPlayingUrl: string;
    listenLivePage: string;
    watchLivePage: string;
};
export declare const RFH_FALLBACK_EPISODE: {
    title: string;
    shortLabel: string;
    mp3Url: string;
    rundown: string;
};
export interface X96NowPlayingEvent {
    TPE1?: string;
    TIT2?: string;
    TALB?: string;
    TXXX_category?: string;
}
export interface RfhHost {
    id: 'kerry' | 'bill' | 'gina';
    name: string;
    emoji: string;
    role: string;
    bio: string;
}
export declare const RFH_HOSTS: RfhHost[];
export declare const RFH_PRODUCER: {
    name: string;
    role: string;
    dogName: string;
    dogDescription: string;
};
export declare const RFH_SEGMENTS: {
    name: string;
    detail: string;
}[];
export declare const RFH_FACTS: string[];
export interface BonerNominee {
    id: string;
    headline: string;
    story: string;
    hostId: RfhHost['id'];
    hostReaction: string;
}
export declare const BONER_NOMINEES: BonerNominee[];
export declare const PLAYER_BONER_STORY: {
    headline: string;
    story: string;
    reaction: string;
};
export interface BeatGinaQuestion {
    question: string;
    options: string[];
    answerIndex: number;
}
export declare const BEAT_GINA_QUESTIONS: BeatGinaQuestion[];
export declare function isRadioFromHellOnAir(now?: Date): boolean;
export declare function formatX96NowPlaying(event?: X96NowPlayingEvent, now?: Date): string;
export declare function pickRandom<T>(list: T[], count: number): T[];
