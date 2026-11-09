export declare enum CAMERA_VIEW {
    GTA_TOP_DOWN = "GTA_TOP_DOWN",
    COCKPIT_WINDSHIELD = "COCKPIT_WINDSHIELD"
}
export declare enum DRIVE_MODE {
    MANUAL = "MANUAL",
    AUTOPILOT = "AUTOPILOT"
}
export declare enum EXPERIENCE_PHASE {
    MILOSPORT_SHOP = "MILOSPORT_SHOP",
    DRIVE_CANYON = "DRIVE_CANYON",
    BRIGHTON_SKIFREE = "BRIGHTON_SKIFREE"
}
export type SurfSpotId = 'dana_point' | 'san_clemente_pier' | 'trestles_wsl';
export interface SurfSpotInfo {
    id: SurfSpotId;
    name: string;
    shortName: string;
    mile: number;
    waveHeight: string;
    swellPeriod: string;
    waterTemp: string;
    vibe: string;
    localCrew: string;
    isWslEvent?: boolean;
    description: string;
    beachHighlights: string[];
}
export declare const SURF_SPOTS: SurfSpotInfo[];
export interface Landmark {
    id: string;
    name: string;
    mile: number;
    elevationFt: number;
    description: string;
    isSilentRock?: boolean;
    isMilosport?: boolean;
    surfSpotId?: SurfSpotId;
}
export declare const CANYON_LANDMARKS: Landmark[];
export interface PlayerCarState {
    x: number;
    y: number;
    angle: number;
    speed: number;
    steering: number;
    distanceMiles: number;
    elevationFt: number;
    driveMode: DRIVE_MODE;
    cameraView: CAMERA_VIEW;
    radioMuted: boolean;
    wipersActive: boolean;
    headlights: boolean;
    silenceObserved: boolean;
    prayersCount: number;
    selectedBoardId: string;
    selectedRiderId: string;
    selectedSpotId?: SurfSpotId;
    tireOptionId: string;
    hasTractionPass: boolean;
    purchasedPassIds: string[];
    waxScore: number;
    waxFormulaId: string;
    waxSpeedMultiplier: number;
    isPulledOver?: boolean;
    pulledOverReason?: string;
    copEncounterCount?: number;
    isArrested?: boolean;
    arrestReason?: string;
    arrestCount?: number;
    hasSwigBuff?: boolean;
    swigDrinkName?: string;
    hasWhaleBlessing?: boolean;
    isAtSwig?: boolean;
    isAtWhale?: boolean;
    isAt711?: boolean;
    isAtX96?: boolean;
    hasX96Prize?: boolean;
    radioStationLabel?: string;
    radioNowPlaying?: string;
    fuelLevel?: number;
    fuelGrade?: string;
    hasGasDashChase?: boolean;
    chaseSecondsLeft?: number;
    evadedCopCount?: number;
    snackItemName?: string;
}
