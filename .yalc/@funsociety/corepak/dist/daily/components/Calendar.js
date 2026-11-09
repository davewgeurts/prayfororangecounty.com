import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import './Calendar.css';
function getMonthData(year, month) {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { year, month, days, firstDayOfWeek: firstDay.getDay() };
}
function formatMonthYear(year, month) {
    return new Date(year, month, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
}
function dateToString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
export const Calendar = ({ availableDates, currentDate, onSelectDate }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const parsedCurrent = currentDate
        ? { year: parseInt(currentDate.slice(0, 4)), month: parseInt(currentDate.slice(5, 7)) - 1 }
        : { year: new Date().getFullYear(), month: new Date().getMonth() };
    const [viewYear, setViewYear] = useState(parsedCurrent.year);
    const [viewMonth, setViewMonth] = useState(parsedCurrent.month);
    const availableSet = new Set(availableDates);
    const monthData = getMonthData(viewYear, viewMonth);
    const firstAvailable = availableDates[0];
    const lastAvailable = availableDates[availableDates.length - 1];
    const canGoPrev = firstAvailable
        ? (viewYear > parseInt(firstAvailable.slice(0, 4)) ||
            (viewYear === parseInt(firstAvailable.slice(0, 4)) && viewMonth > parseInt(firstAvailable.slice(5, 7)) - 1))
        : false;
    const canGoNext = lastAvailable
        ? (viewYear < parseInt(lastAvailable.slice(0, 4)) ||
            (viewYear === parseInt(lastAvailable.slice(0, 4)) && viewMonth < parseInt(lastAvailable.slice(5, 7)) - 1))
        : false;
    const prevMonth = () => {
        if (!canGoPrev)
            return;
        if (viewMonth === 0) {
            setViewYear(viewYear - 1);
            setViewMonth(11);
        }
        else {
            setViewMonth(viewMonth - 1);
        }
    };
    const nextMonth = () => {
        if (!canGoNext)
            return;
        if (viewMonth === 11) {
            setViewYear(viewYear + 1);
            setViewMonth(0);
        }
        else {
            setViewMonth(viewMonth + 1);
        }
    };
    const handleDayClick = (day) => {
        const dateStr = dateToString(viewYear, viewMonth, day);
        if (availableSet.has(dateStr)) {
            onSelectDate(dateStr);
            setOpen(false);
        }
    };
    useEffect(() => {
        if (!open)
            return;
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const handleEscape = (e) => {
            if (e.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);
    useEffect(() => {
        if (open && currentDate) {
            setViewYear(parseInt(currentDate.slice(0, 4)));
            setViewMonth(parseInt(currentDate.slice(5, 7)) - 1);
        }
    }, [open, currentDate]);
    const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (_jsxs("div", { className: "calendar-wrapper", ref: ref, children: [_jsx("button", { className: "calendar-toggle", onClick: () => setOpen(!open), "aria-label": "Open calendar", title: "Jump to date", children: "\uD83D\uDCC5" }), open && (_jsxs("div", { className: "calendar-popup", role: "dialog", "aria-modal": "true", "aria-label": "Calendar", children: [_jsxs("div", { className: "calendar-header", children: [_jsx("button", { className: "calendar-nav", onClick: prevMonth, disabled: !canGoPrev, "aria-label": "Previous month", children: "\u2039" }), _jsx("span", { className: "calendar-month-label", children: formatMonthYear(viewYear, viewMonth) }), _jsx("button", { className: "calendar-nav", onClick: nextMonth, disabled: !canGoNext, "aria-label": "Next month", children: "\u203A" })] }), _jsxs("div", { className: "calendar-grid", children: [WEEKDAYS.map((day) => (_jsx("div", { className: "calendar-weekday", children: day }, day))), Array.from({ length: monthData.firstDayOfWeek }).map((_, i) => (_jsx("div", { className: "calendar-day empty" }, `empty-${i}`))), monthData.days.map((day) => {
                                const dateStr = dateToString(viewYear, viewMonth, day);
                                const isAvailable = availableSet.has(dateStr);
                                const isCurrent = dateStr === currentDate;
                                const fullDate = new Date(viewYear, viewMonth, day)
                                    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                                const label = isAvailable
                                    ? (isCurrent ? `${fullDate} (current)` : fullDate)
                                    : `${fullDate} (no session)`;
                                return (_jsx("button", { className: 'calendar-day'
                                        + (isAvailable ? ' available' : '')
                                        + (isCurrent ? ' current' : ''), onClick: () => handleDayClick(day), disabled: !isAvailable, "aria-label": label, children: day }, day));
                            })] })] }))] }));
};
