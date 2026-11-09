const STORAGE_KEY = 'ftbm_favorites';
function getFavorites() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((d) => typeof d === 'string');
    }
    catch {
        return [];
    }
}
function saveFavorites(dates) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dates));
}
export function isFavorite(date) {
    return getFavorites().includes(date);
}
export function toggleFavorite(date) {
    const favs = getFavorites();
    const idx = favs.indexOf(date);
    if (idx >= 0) {
        favs.splice(idx, 1);
        saveFavorites(favs);
        return false;
    }
    else {
        favs.push(date);
        favs.sort();
        saveFavorites(favs);
        return true;
    }
}
export function getAllFavorites() {
    return getFavorites().sort();
}
export function getFavoriteCount() {
    return getFavorites().length;
}
