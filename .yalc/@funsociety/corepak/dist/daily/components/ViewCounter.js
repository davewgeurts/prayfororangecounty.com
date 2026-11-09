import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { registerView, fetchStats, sendHeartbeat, clearSession, resetAllData } from '../services/viewCounter.js';
import { config } from '../config.js';
import './ViewCounter.css';
const VIEW_DELAY_MS = 3000;
const POLL_INTERVAL_MS = 30000;
export const ViewCounter = ({ date }) => {
    const [stats, setStats] = useState(null);
    const dateRef = useRef(date);
    useEffect(() => {
        dateRef.current = date;
        if (!config.viewsApiUrl)
            return;
        let cancelled = false;
        fetchStats(date).then((s) => {
            if (!cancelled && s)
                setStats(s);
        });
        const viewTimer = setTimeout(() => {
            if (cancelled)
                return;
            registerView(date).then(() => {
                if (!cancelled) {
                    fetchStats(date).then((s) => {
                        if (!cancelled && s)
                            setStats(s);
                    });
                }
            });
        }, VIEW_DELAY_MS);
        sendHeartbeat(date);
        const pollInterval = setInterval(() => {
            if (cancelled)
                return;
            sendHeartbeat(dateRef.current);
            fetchStats(dateRef.current).then((s) => {
                if (!cancelled && s)
                    setStats(s);
            });
        }, POLL_INTERVAL_MS);
        return () => {
            cancelled = true;
            clearTimeout(viewTimer);
            clearInterval(pollInterval);
        };
    }, [date]);
    const handleClearSession = useCallback(() => {
        clearSession();
        window.location.reload();
    }, []);
    const handleResetAll = useCallback(() => {
        resetAllData().then(() => window.location.reload());
    }, []);
    if (!config.viewsApiUrl || !stats)
        return null;
    const formatNum = (n) => {
        if (n >= 1000)
            return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(n);
    };
    return (_jsxs("div", { className: "view-counter", children: [_jsxs("span", { className: "view-counter-day", children: [formatNum(stats.dayViews), " ", stats.dayViews === 1 ? 'view' : 'views'] }), stats.activeViewers > 0 && (_jsxs(_Fragment, { children: [_jsx("span", { className: "view-counter-dot", children: "\u00B7" }), _jsxs("span", { className: "view-counter-active", children: [stats.activeViewers, " here now"] })] })), _jsx("span", { className: "view-counter-dot", children: "\u00B7" }), _jsxs("span", { className: "view-counter-total", children: [formatNum(stats.totalViews), " total"] }), config.isDev && (_jsxs(_Fragment, { children: [_jsx("button", { className: "view-counter-debug", onClick: handleClearSession, children: "reset session" }), _jsx("button", { className: "view-counter-debug view-counter-debug-danger", onClick: handleResetAll, children: "nuke all data" })] }))] }));
};
