import React from 'react';
import { type SurfSpotId } from '../../types/game';
export interface Props {
    selectedBoardId: string;
    selectedRiderId: string;
    selectedSpotId?: SurfSpotId;
    onSelectSpot?: (spotId: SurfSpotId) => void;
    onDropInFromSummit: () => void;
    onReturnToDrive: () => void;
    onAddScore: (points: number) => void;
}
export declare const ChairliftRideView: React.FC<Props>;
