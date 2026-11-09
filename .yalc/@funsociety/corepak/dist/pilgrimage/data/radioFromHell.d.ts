import { X96_STATION as UTAH_X96_STATION, RFH_FALLBACK_EPISODE as UTAH_RFH_FALLBACK_EPISODE, RFH_HOSTS as UTAH_RFH_HOSTS, RFH_PRODUCER as UTAH_RFH_PRODUCER, RFH_SEGMENTS as UTAH_RFH_SEGMENTS, RFH_FACTS as UTAH_RFH_FACTS, BONER_NOMINEES as UTAH_BONER_NOMINEES, PLAYER_BONER_STORY as UTAH_PLAYER_BONER_STORY, BEAT_GINA_QUESTIONS as UTAH_BEAT_GINA_QUESTIONS, pickRandom, type X96NowPlayingEvent, type RfhHost, type BonerNominee, type BeatGinaQuestion } from '../editions/utah/data/radioFromHell';
import { X96_STATION as OC_X96_STATION, RFH_FALLBACK_EPISODE as OC_RFH_FALLBACK_EPISODE, RFH_HOSTS as OC_RFH_HOSTS, RFH_PRODUCER as OC_RFH_PRODUCER, RFH_SEGMENTS as OC_RFH_SEGMENTS, RFH_FACTS as OC_RFH_FACTS, BONER_NOMINEES as OC_BONER_NOMINEES, PLAYER_BONER_STORY as OC_PLAYER_BONER_STORY, BEAT_GINA_QUESTIONS as OC_BEAT_GINA_QUESTIONS } from '../editions/orangecounty/data/radioFromHell';
export { UTAH_X96_STATION, UTAH_RFH_FALLBACK_EPISODE, UTAH_RFH_HOSTS, UTAH_RFH_PRODUCER, UTAH_RFH_SEGMENTS, UTAH_RFH_FACTS, UTAH_BONER_NOMINEES, UTAH_PLAYER_BONER_STORY, UTAH_BEAT_GINA_QUESTIONS, OC_X96_STATION, OC_RFH_FALLBACK_EPISODE, OC_RFH_HOSTS, OC_RFH_PRODUCER, OC_RFH_SEGMENTS, OC_RFH_FACTS, OC_BONER_NOMINEES, OC_PLAYER_BONER_STORY, OC_BEAT_GINA_QUESTIONS, pickRandom, type X96NowPlayingEvent, type RfhHost, type BonerNominee, type BeatGinaQuestion, };
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
export declare const BONER_NOMINEES: BonerNominee[];
export declare const PLAYER_BONER_STORY: {
    headline: string;
    story: string;
    reaction: string;
};
export declare const BEAT_GINA_QUESTIONS: BeatGinaQuestion[];
export declare function isRadioFromHellOnAir(now?: Date): boolean;
export declare function formatX96NowPlaying(event?: X96NowPlayingEvent, now?: Date): string;
