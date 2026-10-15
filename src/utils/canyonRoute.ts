import { CANYON_LANDMARKS, type Landmark } from '../types/game'

export interface RoadSegment {
  mile: number;
  curve: number; // Curvature: positive = right turn, negative = left turn
  elevation: number;
  landmark?: Landmark;
  hasCreek: boolean;
  snowDepthInches: number;
}

export class CanyonRoute {
  public static readonly TOTAL_MILES = 16.5;
  public static readonly SILENT_ROCK_START = 4.25;
  public static readonly SILENT_ROCK_END = 4.75;
  public static readonly SILENT_ROCK_CENTER = 4.50;

  /**
   * Generates continuous curvature along Pacific Coast Highway (CA-1) from Laguna Beach
   * past Treasure Island Montage, 1000 Steps, Dana Point, San Clemente Pier, to Trestles.
   */
  public static getRoadCurvature(mile: number): number {
    // Downtown Laguna & Main Beach: sweeping coastal curves
    if (mile < 2.0) {
      return Math.sin(mile * 3.5) * 0.18;
    }
    // Treasure Island by the Montage (Mile 2.8 - 3.6): Scenic coastal headland curve
    if (mile < 4.1) {
      return Math.sin(mile * 5) * 0.28 + Math.cos(mile * 2.5) * 0.12;
    }
    // 1000 STEPS BEACH CLIFF OVERLOOK (Mile 4.2 - 4.8): Dramatic cliffside bend above the cove
    if (mile >= 4.2 && mile <= 4.85) {
      const t = (mile - 4.2) / 0.65;
      return Math.sin(t * Math.PI * 2) * 0.62;
    }
    // Three Arch Bay to Salt Creek & Monarch Bay (Mile 4.85 - 8.5)
    if (mile < 8.5) {
      return Math.sin(mile * 4.0) * 0.22 + Math.cos(mile * 6) * 0.14;
    }
    // DANA POINT HEADLANDS & HARBOR SWITCHBACK (Mile 8.5 - 10.2)
    if (mile >= 8.5 && mile <= 10.2) {
      return Math.sin((mile - 8.5) * 6.5) * 0.68;
    }
    // Capistrano Beach Coast Hwy to San Clemente Pier Bowl (Mile 10.2 - 14.5)
    if (mile < 14.5) {
      return Math.sin(mile * 2.8) * 0.2 + Math.cos(mile * 4.2) * 0.12;
    }
    // Cristianitos / Basilone stretch into Lower Trestles Trailhead
    return Math.sin(mile * 2.2) * 0.14;
  }

  /**
   * Returns coastal bluff elevation in feet for a given mile marker down PCH.
   * Rises over Treasure Island Montage, 1000 Steps bluffs (145ft), and Dana Point Headlands,
   * dropping down to sea level at Dana Point Harbor, San Clemente Pier, and Trestles.
   */
  public static getElevation(mile: number): number {
    const landmark = CanyonRoute.getCurrentLandmark(mile);
    if (landmark) return landmark.elevationFt;

    // Smooth coastal bluff contour wave between 15 ft and 145 ft above sea level
    const base = 42 + Math.sin(mile * 0.75) * 35 + Math.cos(mile * 1.4) * 28;
    return Math.max(12, Math.round(base));
  }

  /**
   * Checks if car is within the sacred 1000 Steps Beach Swell Overlook zone.
   */
  public static isSilentRockZone(mile: number): boolean {
    return mile >= CanyonRoute.SILENT_ROCK_START && mile <= CanyonRoute.SILENT_ROCK_END;
  }

  /**
   * Returns the closest PCH landmark for a given mile marker.
   */
  public static getCurrentLandmark(mile: number): Landmark | undefined {
    return CANYON_LANDMARKS.find(l => Math.abs(l.mile - mile) < 0.35);
  }

  /**
   * Calculates the road center point in world coordinate space for a given mile.
   */
  public static getRoadPosition(mile: number): { x: number; y: number; angle: number } {
    const step = 0.05;
    let x = 0;
    let y = 0;
    let currentAngle = 0;

    for (let m = 0; m <= mile; m += step) {
      const curve = CanyonRoute.getRoadCurvature(m);
      currentAngle += curve * step * 3.5;
      const distance = step * 1600;
      x += Math.sin(currentAngle) * distance;
      y -= Math.cos(currentAngle) * distance;
    }

    return { x, y, angle: currentAngle };
  }
}
