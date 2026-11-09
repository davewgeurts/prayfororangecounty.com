import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { config } from '../config.js';
import { getToday } from '../services/dailyContent.js';
import './ShowTopics.css';
export const ShowTopics = ({ categories, title = 'Topic History', subtitle, buttonLabel = '\u2190 Back to sessions', filterFutureDates = true, emptyErrorMessage = 'No topics yet \u2014 they will appear after the next daily generation.', onBack, }) => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch(`/daily/topics.json?v=${config.buildId}`, { cache: 'no-cache' })
            .then((res) => {
            if (!res.ok)
                throw new Error('Not found');
            return res.json();
        })
            .then((data) => {
            if (filterFutureDates) {
                const today = getToday();
                setTopics(data.filter((t) => t.date <= today));
            }
            else {
                setTopics(data);
            }
            setLoading(false);
        })
            .catch(() => {
            setError(emptyErrorMessage);
            setLoading(false);
        });
    }, [filterFutureDates, emptyErrorMessage]);
    const goBack = () => {
        if (onBack) {
            onBack();
            return;
        }
        window.location.href = '/';
    };
    return (_jsxs("div", { className: "topics-page", children: [_jsx("button", { className: "topics-back", onClick: goBack, children: buttonLabel }), _jsx("h2", { children: title }), subtitle && _jsx("p", { className: "topics-status", children: subtitle }), categories && categories.length > 0 && (_jsx("div", { className: "topics-categories", children: categories.map((cat) => (_jsxs("div", { className: "topics-category", children: [_jsx("h3", { children: cat.name }), _jsx("ul", { children: cat.topics.map((item) => (_jsx("li", { children: item }, item))) })] }, cat.name))) })), loading && _jsx("p", { className: "topics-status", children: "Loading..." }), error && _jsx("p", { className: "topics-status", children: error }), !loading && !error && (_jsxs("table", { className: "topics-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Date" }), _jsx("th", { children: "Topic" })] }) }), _jsx("tbody", { children: [...topics].reverse().map((t) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("a", { href: `/${t.date}`, children: t.date }) }), _jsx("td", { children: t.topic })] }, t.date))) })] })), !loading && !error && topics.length === 0 && (_jsx("p", { className: "topics-status", children: "No topics recorded yet." }))] }));
};
