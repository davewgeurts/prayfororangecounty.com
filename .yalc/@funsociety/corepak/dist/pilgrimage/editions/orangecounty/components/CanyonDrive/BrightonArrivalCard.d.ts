import React from 'react';
import { type SurfSpotId } from '../../types/game';
export interface Props {
    onStartSkiFree: () => void;
    prayersCount: number;
    selectedSpotId?: SurfSpotId;
    onSelectSpot?: (spotId: SurfSpotId) => void;
    onClose?: () => void;
}
export declare const BrightonArrivalCard: React.FC<Props>;
