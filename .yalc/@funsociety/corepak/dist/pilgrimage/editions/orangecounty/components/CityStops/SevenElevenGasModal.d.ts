import React from 'react';
import type { PlayerCarState } from '../../types/game';
export interface Props {
    carState: PlayerCarState;
    onPayAndCruise: (fuelLevel: number, fuelGrade: string, gallons: number, snack: string | undefined, bonusPrayers: number) => void;
    onGasAndDash: (fuelLevel: number, gallons: number, snack: string | undefined) => void;
    onClose: () => void;
}
export declare const SevenElevenGasModal: React.FC<Props>;
