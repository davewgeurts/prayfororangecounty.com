import React from 'react';
export interface Props {
    onReturnToDrive: () => void;
    selectedBoardId?: string;
    selectedRiderId?: string;
    waxSpeedMultiplier?: number;
    purchasedPassIds?: string[];
}
export declare const BrightonSkiFree: React.FC<Props>;
