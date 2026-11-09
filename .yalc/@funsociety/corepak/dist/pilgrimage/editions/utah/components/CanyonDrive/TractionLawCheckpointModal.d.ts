import React from 'react';
import type { PlayerCarState } from '../../types/game';
export interface Props {
    carState: PlayerCarState;
    onPassCheckpoint: (equippedTireId?: string) => void;
    onReturnToMiloShop: () => void;
}
export declare const TractionLawCheckpointModal: React.FC<Props>;
