import { CANYON_LANDMARKS } from '../types/game';
export class CanyonRoute {
    static TOTAL_MILES = 14.3;
    static SILENT_ROCK_START = 2.75;
    static SILENT_ROCK_END = 3.15;
    static SILENT_ROCK_CENTER = 2.95;
    /**
     * Generates continuous curvature along the canyon based on real-world BCC landmarks.
     */
    static getRoadCurvature(mile) {
        // Canyon mouth: gentle sweeping curves
        if (mile < 1.0) {
            return Math.sin(mile * 4) * 0.15;
        }
        // Around Maxfield / Power plant: tighter winding canyon
        if (mile < 2.5) {
            return Math.sin(mile * 6) * 0.25 + Math.cos(mile * 3) * 0.1;
        }
        // SILENT ROCK & Storm Mountain: Sharp signature S-curve around the rock buttress
        if (mile >= 2.6 && mile <= 3.2) {
            const t = (mile - 2.6) / 0.6; // 0 to 1
            return Math.sin(t * Math.PI * 2) * 0.65; // pronounced bend
        }
        // Mid canyon (Stairs / Reynolds Peak)
        if (mile < 7.5) {
            return Math.sin(mile * 4.5) * 0.2 + Math.cos(mile * 7) * 0.15;
        }
        // THE S-CURVES (Mile 7.6 - 8.4): Intense hairpin switchbacks!
        if (mile >= 7.6 && mile <= 8.5) {
            return Math.sin((mile - 7.6) * 8) * 0.8;
        }
        // Upper canyon approaching Solitude & Brighton
        if (mile < 14.0) {
            return Math.sin(mile * 3) * 0.2 + Math.cos(mile * 5) * 0.15;
        }
        // Brighton loop: Gentle sweeping entrance into the mountain cirque
        return Math.sin(mile * 2) * 0.1;
    }
    /**
     * Returns elevation in feet for a given mile marker up the canyon.
     */
    static getElevation(mile) {
        const startElevation = 4950;
        const endElevation = 8755;
        const progress = Math.min(1, Math.max(0, mile / CanyonRoute.TOTAL_MILES));
        // Non-linear elevation climb (steeper in upper canyon past S-curves)
        return Math.round(startElevation + Math.pow(progress, 1.15) * (endElevation - startElevation));
    }
    /**
     * Checks if car is within the sacred Silent Rock zone.
     */
    static isSilentRockZone(mile) {
        return mile >= CanyonRoute.SILENT_ROCK_START && mile <= CanyonRoute.SILENT_ROCK_END;
    }
    /**
     * Returns the closest landmark for a given mile marker.
     */
    static getCurrentLandmark(mile) {
        return CANYON_LANDMARKS.find(l => Math.abs(l.mile - mile) < 0.25);
    }
    /**
     * Calculates the road center point in world coordinate space for a given mile.
     */
    static getRoadPosition(mile) {
        // Step along the road from mile 0 to current mile to integrate curvature
        const step = 0.05;
        let x = 0;
        let y = 0;
        let currentAngle = 0; // heading up canyon
        for (let m = 0; m <= mile; m += step) {
            const curve = CanyonRoute.getRoadCurvature(m);
            currentAngle += curve * step * 3.5;
            // 1 mile is ~1600 world units
            const distance = step * 1600;
            x += Math.sin(currentAngle) * distance;
            y -= Math.cos(currentAngle) * distance; // negative y is heading north/up
        }
        return { x, y, angle: currentAngle };
    }
}
