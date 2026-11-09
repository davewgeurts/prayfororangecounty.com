import React from 'react';
export interface Props {
    purchasedPassIds: string[];
    prayersCount: number;
    onBuyPass: (passId: string) => void;
}
export declare const DiscountPassDesk: React.FC<Props>;
