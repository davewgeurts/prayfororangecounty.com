import './FavoriteButton.css';
export interface FavoriteButtonProps {
    date: string;
    onToggle?: () => void;
}
export declare const FavoriteButton: ({ date, onToggle }: FavoriteButtonProps) => import("react").JSX.Element;
