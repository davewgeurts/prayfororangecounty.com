export interface LiveSnow {
    baseDepthIn: number | null;
    newSnow24hIn: number | null;
    summitTempF: number | null;
    observedAt: string | null;
    forecast72hIn: number | null;
    forecastDays: {
        date: string;
        snowIn: number;
        hiF: number;
        loF: number;
    }[];
    windMph: number | null;
    nwsPeriod: string | null;
    nwsShort: string | null;
}
export interface CanyonRoadSegment {
    id: number;
    roadway: string;
    roadCondition: string | null;
    weatherCondition: string | null;
    restriction: string | null;
    updatedAt: string | null;
}
export interface LiveConditions {
    snow: LiveSnow | null;
    roads: CanyonRoadSegment[] | null;
    fetchedAt: number;
}
export declare const fetchLiveConditions: () => Promise<LiveConditions>;
export declare const useLiveConditions: () => LiveConditions | null;
export declare const NO_RESTRICTION: RegExp;
export declare const canyonStatus: (roads: CanyonRoadSegment[] | null) => {
    restricted: boolean;
    restriction: string | null;
    roadCondition: string;
    weatherCondition: string | null;
    updatedAt: string | null;
} | null;
export type PrayerVerdict = 'answered' | 'incoming' | 'dry';
export declare const prayerVerdict: (snow: LiveSnow | null) => PrayerVerdict;
export declare const recommendedWaxId: (tempF: number | null) => string | null;
