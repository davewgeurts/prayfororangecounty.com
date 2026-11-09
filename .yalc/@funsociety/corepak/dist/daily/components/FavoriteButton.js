import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { isFavorite, toggleFavorite } from '../services/favorites.js';
import './FavoriteButton.css';
export const FavoriteButton = ({ date, onToggle }) => {
    const [favorited, setFavorited] = useState(() => isFavorite(date));
    const [animating, setAnimating] = useState(false);
    const handleClick = () => {
        const nowFavorited = toggleFavorite(date);
        setFavorited(nowFavorited);
        if (nowFavorited) {
            setAnimating(true);
            setTimeout(() => setAnimating(false), 400);
        }
        onToggle?.();
    };
    return (_jsx("button", { className: 'favorite-btn' + (favorited ? ' favorited' : '') + (animating ? ' pop' : ''), onClick: handleClick, "aria-label": favorited ? 'Remove from favorites' : 'Add to favorites', children: _jsx("span", { className: "favorite-icon", children: favorited ? '\u2764\uFE0F' : '\u{1F90D}' }) }));
};
