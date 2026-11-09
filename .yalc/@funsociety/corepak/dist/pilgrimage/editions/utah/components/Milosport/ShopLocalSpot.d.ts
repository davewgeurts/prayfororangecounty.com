import React from 'react';
import type { ShopLocal } from '../../data/miloShopFloor';
export interface Props {
    local: ShopLocal;
    baseWidthPct?: number;
}
export declare const ShopLocalSpot: React.FC<Props>;
