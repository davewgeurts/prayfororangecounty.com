import React from 'react';
import type { PlayerCarState } from '../../types/game';
export interface Props {
    carState: PlayerCarState;
    onFinishSwig: (drinkName: string, prayerBonus: number) => void;
    onClose: () => void;
}
export declare const SwigDriveThruModal: React.FC<Props>;
