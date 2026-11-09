export interface OceanBuoyTelemetry {
    stationId: string;
    stationName: string;
    waveHeightFt: number;
    waveMaxFt: number;
    swellPeriodSec: number;
    swellDirectionDeg: number;
    swellCompass: string;
    waterTempF: number;
    windSummary: string;
    tideHeightFt: number;
    tideStage: string;
    surfRating: 'EPIC 🔥' | 'FIRING ⚡' | 'GOOD-TO-EPIC 🌊' | 'CLEAN PEELERS 🤙';
    waveScaleMultiplier: number;
    isLiveApi: boolean;
    updatedAtLabel: string;
}
export declare function useOceanBuoyFeed(): OceanBuoyTelemetry;
