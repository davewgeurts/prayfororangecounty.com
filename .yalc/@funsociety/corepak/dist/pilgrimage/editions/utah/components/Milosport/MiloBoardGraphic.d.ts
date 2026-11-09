import React from 'react';
import type { Snowboard } from '../../data/snowboardGear';
export interface Props {
    board: Snowboard;
    side?: 'top' | 'base';
    className?: string;
}
export declare const MiloBoardGraphic: React.FC<Props>;
