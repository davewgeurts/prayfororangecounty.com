import React from 'react';
import type { OceanBuoyTelemetry } from '../../utils/oceanBuoyFeed';
export interface Props {
    onOfferPrayer: () => void;
    onOpenShorebreakSession?: (spot: 'thousand_steps' | 'treasure_island') => void;
    prayersCount: number;
    buoy?: OceanBuoyTelemetry;
}
export declare const SilentRockCard: React.FC<Props>;
