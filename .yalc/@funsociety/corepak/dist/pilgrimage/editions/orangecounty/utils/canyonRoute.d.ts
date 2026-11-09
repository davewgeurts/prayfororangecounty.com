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
    static readonly TOTAL_MILES = 16.5;
    static readonly SILENT_ROCK_START = 4.25;
    static readonly SILENT_ROCK_END = 4.75;
    static readonly SILENT_ROCK_CENTER = 4.5;
    /**
     * Generates continuous curvature along Pacific Coast Highway (CA-1) from Laguna Beach
     * past Treasure Island Montage, 1000 Steps, Dana Point, San Clemente Pier, to Trestles.
     */
    static getRoadCurvature(mile: number): number;
    /**
     * Returns coastal bluff elevation in feet for a given mile marker down PCH.
     * Rises over Treasure Island Montage, 1000 Steps bluffs (145ft), and Dana Point Headlands,
     * dropping down to sea level at Dana Point Harbor, San Clemente Pier, and Trestles.
     */
    static getElevation(mile: number): number;
    /**
     * Checks if car is within the sacred 1000 Steps Beach Swell Overlook zone.
     */
    static isSilentRockZone(mile: number): boolean;
    /**
     * Returns the closest PCH landmark for a given mile marker.
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
