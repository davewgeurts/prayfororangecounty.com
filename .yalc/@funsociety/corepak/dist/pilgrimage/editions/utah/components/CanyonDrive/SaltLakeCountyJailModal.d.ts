import React from 'react';
import type { PlayerCarState } from '../../types/game';
export interface Props {
    carState: PlayerCarState;
    onRelease: (prayerBonusOrCost: number) => void;
}
export declare const SaltLakeCountyJailModal: React.FC<Props>;
