import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchReactions, submitReaction } from '../services/reactions.js';
import { config } from '../config.js';
import './ReactionButtons.css';
export const ReactionButtons = ({ date }) => {
    const [data, setData] = useState(null);
    const [animating, setAnimating] = useState(null);
    const submitting = useRef(false);
    useEffect(() => {
        if (!config.viewsApiUrl)
            return;
        let cancelled = false;
        fetchReactions(date).then((d) => {
            if (!cancelled && d)
                setData(d);
        });
        return () => { cancelled = true; };
    }, [date]);
    const handleClick = useCallback((clicked) => {
        if (submitting.current || !data)
            return;
        submitting.current = true;
        const oldData = data;
        const newReaction = data.userReaction === clicked ? null : clicked;
        const optimistic = {
            thumbsUp: oldData.thumbsUp
                + (newReaction === 'up' ? 1 : 0)
                - (oldData.userReaction === 'up' ? 1 : 0),
            thumbsDown: oldData.thumbsDown
                + (newReaction === 'down' ? 1 : 0)
                - (oldData.userReaction === 'down' ? 1 : 0),
            userReaction: newReaction,
        };
        setData(optimistic);
        if (newReaction) {
            setAnimating(newReaction);
            setTimeout(() => setAnimating(null), 400);
        }
        submitReaction(date, newReaction).then((serverData) => {
            if (serverData)
                setData(serverData);
            submitting.current = false;
        }).catch(() => {
            setData(oldData);
            submitting.current = false;
        });
    }, [data, date]);
    if (!config.viewsApiUrl || !data)
        return null;
    return (_jsxs(_Fragment, { children: [_jsxs("button", { className: 'reaction-btn'
                    + (data.userReaction === 'up' ? ' active-up' : '')
                    + (animating === 'up' ? ' pop' : ''), onClick: () => handleClick('up'), "aria-label": "Thumbs up", children: [_jsx("span", { className: "reaction-icon", children: '\uD83D\uDC4D' }), data.thumbsUp > 0 && _jsx("span", { className: "reaction-count", children: data.thumbsUp })] }), _jsxs("button", { className: 'reaction-btn'
                    + (data.userReaction === 'down' ? ' active-down' : '')
                    + (animating === 'down' ? ' pop' : ''), onClick: () => handleClick('down'), "aria-label": "Thumbs down", children: [_jsx("span", { className: "reaction-icon", children: '\uD83D\uDC4E' }), data.thumbsDown > 0 && _jsx("span", { className: "reaction-count", children: data.thumbsDown })] })] }));
};
