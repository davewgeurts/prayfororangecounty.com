import React from 'react';
export interface Props {
    selectedBoardId: string;
    onApplyWaxTune: (waxFormulaId: string, speedMultiplier: number, waxScore: number) => void;
    onClose: () => void;
}
export declare const WaxBenchMiniGame: React.FC<Props>;
