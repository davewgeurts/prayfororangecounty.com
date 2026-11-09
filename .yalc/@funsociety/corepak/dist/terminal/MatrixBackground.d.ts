import React from "react";
export interface MatrixProps {
    active?: boolean;
    color?: string;
    fontSize?: number;
    opacity?: number;
    showWatermark?: boolean;
    characters?: string;
}
export declare const FlowerOfLifeWatermark: React.FC<{
    className?: string;
}>;
export declare const MatrixBackground: React.FC<MatrixProps>;
export default MatrixBackground;
