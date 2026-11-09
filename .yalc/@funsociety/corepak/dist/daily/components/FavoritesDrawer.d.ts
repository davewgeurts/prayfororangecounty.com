import './FavoritesDrawer.css';
export interface FavoritesDrawerProps {
    onSelectDate: (date: string) => void;
    refreshKey: number;
}
export declare const FavoritesDrawer: ({ onSelectDate, refreshKey }: FavoritesDrawerProps) => import("react").JSX.Element;
