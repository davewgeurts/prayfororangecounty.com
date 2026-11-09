import React from 'react';
export interface Props {
    selectedBoardId: string;
    onSelectBoard: (boardId: string) => void;
}
export declare const SegBar: React.FC<{
    value: number;
    hot?: boolean;
}>;
export declare const BoardWallSelect: React.FC<Props>;
