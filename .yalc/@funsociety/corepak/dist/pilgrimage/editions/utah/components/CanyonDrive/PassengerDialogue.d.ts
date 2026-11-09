import React from 'react';
import type { RiderPro, Snowboard } from '../../data/snowboardGear';
import type { PlayerCarState } from '../../types/game';
export interface Props {
    rider: RiderPro;
    board: Snowboard;
    carState: PlayerCarState;
    onOpenMiloShop: () => void;
}
export declare const PassengerDialogue: React.FC<Props>;
