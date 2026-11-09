import React from 'react';
import type { PlayerCarState } from '../../types/game';
export interface Props {
    carState: PlayerCarState;
    onResolvePullOver: (prayerBonusOrCost: number) => void;
    onArrest: (reason: string) => void;
}
export declare const CopPullOverModal: React.FC<Props>;
