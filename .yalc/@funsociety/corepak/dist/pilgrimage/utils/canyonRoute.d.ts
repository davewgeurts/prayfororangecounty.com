import type { Landmark } from '../types/game';
import { CanyonRoute as UtahCanyonRoute, type RoadSegment } from '../editions/utah/utils/canyonRoute';
import { CanyonRoute as OrangeCountyCanyonRoute } from '../editions/orangecounty/utils/canyonRoute';
export { UtahCanyonRoute, OrangeCountyCanyonRoute, type RoadSegment };
export declare class CanyonRoute {
    static get TOTAL_MILES(): number;
    static get SILENT_ROCK_START(): number;
    static get SILENT_ROCK_END(): number;
    static get SILENT_ROCK_CENTER(): number;
    static getRoadCurvature(mile: number): number;
    static getElevation(mile: number): number;
    static isSilentRockZone(mile: number): boolean;
    static getCurrentLandmark(mile: number): Landmark | undefined;
    static getRoadPosition(mile: number): {
        x: number;
        y: number;
        angle: number;
    };
}
