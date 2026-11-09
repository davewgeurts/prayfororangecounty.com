import { config } from '../config.js';
const SESSION_KEY = 'ftbm_sid';
const VIEWED_PREFIX = 'ftbm_viewed_';
export function getSessionId() {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
}
export function hasViewedDate(date) {
    return sessionStorage.getItem(VIEWED_PREFIX + date) === '1';
}
function markViewed(date) {
    sessionStorage.setItem(VIEWED_PREFIX + date, '1');
}
export function clearSession() {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key === SESSION_KEY || key.startsWith(VIEWED_PREFIX))) {
            keys.push(key);
        }
    }
    keys.forEach(k => sessionStorage.removeItem(k));
}
async function apiCall(path, options) {
    const base = config.viewsApiUrl;
    if (!base)
        throw new Error('Views API URL not configured');
    const url = base.replace(/\/$/, '') + path;
    return fetch(url, options);
}
export async function registerView(date) {
    if (hasViewedDate(date))
        return false;
    if (!config.viewsApiUrl)
        return false;
    const sid = getSessionId();
    try {
        const res = await apiCall('/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, sid }),
        });
        if (res.ok) {
            markViewed(date);
            return true;
        }
        return false;
    }
    catch {
        return false;
    }
}
export async function fetchStats(date) {
    if (!config.viewsApiUrl)
        return null;
    try {
        const res = await apiCall(`/stats?date=${encodeURIComponent(date)}`);
        if (!res.ok)
            return null;
        return res.json();
    }
    catch {
        return null;
    }
}
export async function resetAllData() {
    if (!config.viewsApiUrl)
        return false;
    try {
        const res = await apiCall('/reset', { method: 'DELETE' });
        if (res.ok) {
            clearSession();
            return true;
        }
        return false;
    }
    catch {
        return false;
    }
}
export async function sendHeartbeat(date) {
    if (!config.viewsApiUrl)
        return;
    const sid = getSessionId();
    try {
        await apiCall('/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, sid }),
        });
    }
    catch {
        // Heartbeat failures are silent
    }
}
