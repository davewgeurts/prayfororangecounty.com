import { config } from '../config.js';
import { getSessionId } from './viewCounter.js';
function apiCall(path, options) {
    const base = config.viewsApiUrl;
    if (!base)
        throw new Error('Views API URL not configured');
    const url = base.replace(/\/$/, '') + path;
    return fetch(url, options);
}
export async function fetchReactions(date) {
    if (!config.viewsApiUrl)
        return null;
    const sid = getSessionId();
    try {
        const res = await apiCall(`/reactions?date=${encodeURIComponent(date)}&sid=${encodeURIComponent(sid)}`);
        if (!res.ok)
            return null;
        return res.json();
    }
    catch {
        return null;
    }
}
export async function submitReaction(date, reaction) {
    if (!config.viewsApiUrl)
        return null;
    const sid = getSessionId();
    try {
        const res = await apiCall('/react', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, sid, reaction }),
        });
        if (!res.ok)
            return null;
        return res.json();
    }
    catch {
        return null;
    }
}
