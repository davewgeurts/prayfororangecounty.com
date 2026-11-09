import { getPilgrimageEdition } from '../edition';
import { CanyonRoute as UtahCanyonRoute, } from '../editions/utah/utils/canyonRoute';
import { CanyonRoute as OrangeCountyCanyonRoute, } from '../editions/orangecounty/utils/canyonRoute';
export { UtahCanyonRoute, OrangeCountyCanyonRoute };
function activeRoute() {
    return getPilgrimageEdition() === 'orangecounty' ? OrangeCountyCanyonRoute : UtahCanyonRoute;
}
export class CanyonRoute {
    static get TOTAL_MILES() {
        return activeRoute().TOTAL_MILES;
    }
    static get SILENT_ROCK_START() {
        return activeRoute().SILENT_ROCK_START;
    }
    static get SILENT_ROCK_END() {
        return activeRoute().SILENT_ROCK_END;
    }
    static get SILENT_ROCK_CENTER() {
        return activeRoute().SILENT_ROCK_CENTER;
    }
    static getRoadCurvature(mile) {
        return activeRoute().getRoadCurvature(mile);
    }
    static getElevation(mile) {
        return activeRoute().getElevation(mile);
    }
    static isSilentRockZone(mile) {
        return activeRoute().isSilentRockZone(mile);
    }
    static getCurrentLandmark(mile) {
        return activeRoute().getCurrentLandmark(mile);
    }
    static getRoadPosition(mile) {
        return activeRoute().getRoadPosition(mile);
    }
}
