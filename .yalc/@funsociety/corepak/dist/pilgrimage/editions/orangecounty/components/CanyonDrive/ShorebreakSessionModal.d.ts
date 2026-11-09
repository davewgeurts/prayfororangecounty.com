import React from 'react';
import type { OceanBuoyTelemetry } from '../../utils/oceanBuoyFeed';
export interface Props {
    initialSpot: 'thousand_steps' | 'treasure_island';
    craftType: 'surfboard' | 'boogie';
    riderName: string;
    boardName: string;
    buoy: OceanBuoyTelemetry;
    onFinishSession: (earnedPrayers: number, tubesRidden: number) => void;
    onClose: () => void;
}
export declare const ShorebreakSessionModal: React.FC<Props>;
