import React from 'react';
import { type SurfSpotId } from '../../types/game';
export interface Props {
    onReturnToDrive: () => void;
    selectedBoardId?: string;
    selectedRiderId?: string;
    selectedSpotId?: SurfSpotId;
    onSelectSpot?: (spotId: SurfSpotId) => void;
    waxSpeedMultiplier?: number;
    purchasedPassIds?: string[];
}
export declare const BrightonSkiFree: React.FC<Props>;
