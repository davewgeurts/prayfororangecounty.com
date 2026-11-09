import React from 'react';
import type { PlayerCarState } from '../../types/game';
export interface Props {
    carState: PlayerCarState;
    onFinishWhale: (prayerBonus: number) => void;
    onClose: () => void;
}
export declare const WhaleRoundaboutModal: React.FC<Props>;
