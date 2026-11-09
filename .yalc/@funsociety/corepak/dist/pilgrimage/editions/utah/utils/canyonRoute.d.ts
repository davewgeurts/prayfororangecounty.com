import { type Landmark } from '../types/game';
export interface RoadSegment {
    mile: number;
    curve: number;
    elevation: number;
    landmark?: Landmark;
    hasCreek: boolean;
    snowDepthInches: number;
}
export declare class CanyonRoute {
    static readonly TOTAL_MILES = 14.3;
    static readonly SILENT_ROCK_START = 2.75;
    static readonly SILENT_ROCK_END = 3.15;
    static readonly SILENT_ROCK_CENTER = 2.95;
    /**
     * Generates continuous curvature along the canyon based on real-world BCC landmarks.
     */
    static getRoadCurvature(mile: number): number;
    /**
     * Returns elevation in feet for a given mile marker up the canyon.
     */
    static getElevation(mile: number): number;
    /**
     * Checks if car is within the sacred Silent Rock zone.
     */
    static isSilentRockZone(mile: number): boolean;
    /**
     * Returns the closest landmark for a given mile marker.
     */
    static getCurrentLandmark(mile: number): Landmark | undefined;
    /**
     * Calculates the road center point in world coordinate space for a given mile.
     */
    static getRoadPosition(mile: number): {
        x: number;
        y: number;
        angle: number;
    };
}
