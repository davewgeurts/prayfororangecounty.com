import React from 'react';
export interface Props {
    selectedBoardId: string;
    selectedRiderId: string;
    onDropInFromSummit: () => void;
    onReturnToDrive: () => void;
    onAddScore: (points: number) => void;
}
export declare const ChairliftRideView: React.FC<Props>;
