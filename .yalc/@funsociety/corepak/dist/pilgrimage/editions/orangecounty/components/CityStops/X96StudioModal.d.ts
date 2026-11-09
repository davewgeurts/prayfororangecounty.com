import React from 'react';
import type { PlayerCarState } from '../../types/game';
export interface Props {
    carState: PlayerCarState;
    onFinishX96: (prayerBonus: number, prizePassId: string | null, claimedPrize: boolean) => void;
    onClose: () => void;
}
export declare const X96StudioModal: React.FC<Props>;
