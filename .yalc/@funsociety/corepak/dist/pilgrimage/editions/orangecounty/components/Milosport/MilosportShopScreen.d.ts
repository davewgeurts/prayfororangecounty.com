import React from 'react';
export interface Props {
    selectedBoardId: string;
    selectedRiderId: string;
    tireOptionId: string;
    purchasedPassIds: string[];
    waxScore: number;
    waxFormulaId: string;
    waxSpeedMultiplier: number;
    prayersCount: number;
    onSelectBoard: (boardId: string) => void;
    onSelectRider: (riderId: string) => void;
    onSelectTire: (tireId: string) => void;
    onBuyPass: (passId: string) => void;
    onApplyWaxTune: (formulaId: string, speedMultiplier: number, score: number) => void;
    onLaunchDrive: () => void;
    onGoToSwig?: () => void;
    onGoToWhale?: () => void;
    onGoTo711?: () => void;
    onGoToX96?: () => void;
}
export declare const MilosportShopScreen: React.FC<Props>;
