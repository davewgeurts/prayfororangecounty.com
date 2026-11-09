import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { config } from '../config.js';
import './Countdown.css';
function getNextMidnightDenver() {
    const now = new Date();
    const denverNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
    const denverMidnight = new Date(denverNow);
    denverMidnight.setHours(24, 0, 0, 0);
    const diffMs = denverMidnight.getTime() - denverNow.getTime();
    return new Date(now.getTime() + diffMs);
}
function getTimeRemaining(target) {
    const diff = Math.max(0, target.getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    return {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
    };
}
function pad(n) {
    return String(n).padStart(2, '0');
}
export const Countdown = ({ onMidnight, label }) => {
    const [target, setTarget] = useState(getNextMidnightDenver);
    const [remaining, setRemaining] = useState(getTimeRemaining(target));
    const midnightFired = useRef(false);
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            if (now >= target.getTime()) {
                const newTarget = getNextMidnightDenver();
                setTarget(newTarget);
                setRemaining(getTimeRemaining(newTarget));
                if (!midnightFired.current && onMidnight) {
                    midnightFired.current = true;
                    onMidnight();
                }
            }
            else {
                midnightFired.current = false;
                setRemaining(getTimeRemaining(target));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [target, onMidnight]);
    const resolvedLabel = label ?? config.countdownLabel ?? 'Next session in';
    return (_jsxs("div", { className: "countdown", children: [_jsx("span", { className: "countdown-label", children: resolvedLabel }), _jsxs("span", { className: "countdown-time", children: [pad(remaining.hours), ":", pad(remaining.minutes), ":", pad(remaining.seconds)] })] }));
};
