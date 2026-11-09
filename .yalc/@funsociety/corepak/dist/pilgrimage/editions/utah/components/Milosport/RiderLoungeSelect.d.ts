import React from 'react';
export interface Props {
    selectedRiderId: string;
    onSelectRider: (riderId: string) => void;
}
export declare const RiderLoungeSelect: React.FC<Props>;
