import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { getAllFavorites, getFavoriteCount, toggleFavorite } from '../services/favorites.js';
import './FavoritesDrawer.css';
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
export const FavoritesDrawer = ({ onSelectDate, refreshKey }) => {
    const [open, setOpen] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [count, setCount] = useState(() => getFavoriteCount());
    const drawerRef = useRef(null);
    useEffect(() => {
        setCount(getFavoriteCount());
        if (open) {
            setFavorites(getAllFavorites());
        }
    }, [open, refreshKey]);
    useEffect(() => {
        if (!open)
            return;
        const handleClickOutside = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const handleEsc = (e) => {
            if (e.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [open]);
    const handleSelect = (date) => {
        onSelectDate(date);
        setOpen(false);
    };
    const handleRemove = (date, e) => {
        e.stopPropagation();
        toggleFavorite(date);
        const updated = getAllFavorites();
        setFavorites(updated);
        setCount(updated.length);
    };
    return (_jsxs("div", { className: "favorites-drawer-wrap", ref: drawerRef, children: [_jsxs("button", { className: 'favorites-toggle' + (count > 0 ? ' has-favs' : ''), onClick: () => setOpen(!open), "aria-label": `Favorites (${count})`, children: [_jsx("span", { className: "favorites-toggle-icon", children: '\u2764\uFE0F' }), count > 0 && _jsx("span", { className: "favorites-badge", children: count })] }), open && (_jsxs("div", { className: "favorites-panel", role: "dialog", "aria-modal": "true", "aria-label": "Favorites", children: [_jsx("div", { className: "favorites-header", children: _jsx("span", { children: "Favorites" }) }), favorites.length === 0 ? (_jsx("div", { className: "favorites-empty", children: "No favorites yet. Tap the heart on sessions you love!" })) : (_jsx("div", { className: "favorites-list", children: favorites.map((date) => (_jsxs("button", { className: "favorites-item", onClick: () => handleSelect(date), children: [_jsx("span", { className: "favorites-item-date", children: formatDate(date) }), _jsx("span", { className: "favorites-item-remove", onClick: (e) => handleRemove(date, e), role: "button", "aria-label": `Remove ${date} from favorites`, children: "\u00D7" })] }, date))) }))] }))] }));
};
