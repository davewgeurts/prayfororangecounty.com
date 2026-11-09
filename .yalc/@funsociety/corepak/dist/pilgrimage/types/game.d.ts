import { type PilgrimageEdition } from '../edition';
import { CAMERA_VIEW, DRIVE_MODE, EXPERIENCE_PHASE, SURF_SPOTS, CANYON_LANDMARKS as UTAH_CANYON_LANDMARKS, type SurfSpotId, type SurfSpotInfo, type Landmark, type PlayerCarState } from '../editions/utah/types/game';
import { CANYON_LANDMARKS as OC_CANYON_LANDMARKS } from '../editions/orangecounty/types/game';
export { CAMERA_VIEW, DRIVE_MODE, EXPERIENCE_PHASE, SURF_SPOTS, UTAH_CANYON_LANDMARKS, OC_CANYON_LANDMARKS, type SurfSpotId, type SurfSpotInfo, type Landmark, type PlayerCarState, };
export declare function getCanyonLandmarks(edition?: PilgrimageEdition): Landmark[];
export declare const CANYON_LANDMARKS: Landmark[];
