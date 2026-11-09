import React from 'react';
import type { FigureLook } from '../../data/miloShopFloor';
export interface Props {
    look: FigureLook;
    pose?: string;
    delay?: number;
    saiyan?: boolean;
    className?: string;
}
export declare const MiloFigure: React.FC<Props>;
