import { getPilgrimageEdition } from '../edition';
import { CAMERA_VIEW, DRIVE_MODE, EXPERIENCE_PHASE, SURF_SPOTS, CANYON_LANDMARKS as UTAH_CANYON_LANDMARKS, } from '../editions/utah/types/game';
import { CANYON_LANDMARKS as OC_CANYON_LANDMARKS, } from '../editions/orangecounty/types/game';
export { CAMERA_VIEW, DRIVE_MODE, EXPERIENCE_PHASE, SURF_SPOTS, UTAH_CANYON_LANDMARKS, OC_CANYON_LANDMARKS, };
export function getCanyonLandmarks(edition = getPilgrimageEdition()) {
    return edition === 'orangecounty' ? OC_CANYON_LANDMARKS : UTAH_CANYON_LANDMARKS;
}
export const CANYON_LANDMARKS = getCanyonLandmarks();
