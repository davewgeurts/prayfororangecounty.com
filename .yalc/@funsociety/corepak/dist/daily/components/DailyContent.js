import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { ShareButtons } from './ShareButtons.js';
import { FavoriteButton } from './FavoriteButton.js';
import { ReactionButtons } from './ReactionButtons.js';
import { Calendar } from './Calendar.js';
import { PromptReveal } from './PromptReveal.js';
import { ViewCounter } from './ViewCounter.js';
import './DailyContent.css';
function renderSpeakerBadge(badge) {
    return (_jsxs("span", { className: "speaker", children: [badge.logoSrc ? (_jsx("img", { src: badge.logoSrc, alt: "", className: "speaker-logo", width: 18, height: 18 })) : badge.emoji ? (_jsx("span", { className: "speaker-emoji", children: badge.emoji })) : null, ` ${badge.label}:`] }));
}
export const DailyContent = ({ content, onPrev, onNext, availableDates, onSelectDate, onFavoriteToggle, config: contentConfig, imageAltPrefix, imageAltBuilder, firstSpeaker, secondSpeaker, punchlineSpeaker, shareConfig, }) => {
    const touchStart = useRef(null);
    const [swipeDir, setSwipeDir] = useState(null);
    const handleTouchStart = (e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = (e) => {
        if (!touchStart.current)
            return;
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        touchStart.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx > 0 && onPrev) {
                setSwipeDir('right');
                setTimeout(() => { onPrev(); setSwipeDir(null); }, 200);
            }
            else if (dx < 0 && onNext) {
                setSwipeDir('left');
                setTimeout(() => { onNext(); setSwipeDir(null); }, 200);
            }
        }
    };
    const formatDate = (dateStr) => {
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    const sceneClass = 'daily-scene'
        + (swipeDir === 'left' ? ' swipe-left' : '')
        + (swipeDir === 'right' ? ' swipe-right' : '');
    const resolvedFirstSpeaker = firstSpeaker ?? contentConfig?.firstSpeaker ?? {
        label: 'Therapist',
        logoSrc: '/logo_64.png',
        className: 'therapist',
    };
    const resolvedSecondSpeaker = secondSpeaker ?? contentConfig?.secondSpeaker ?? {
        label: 'Patient',
        emoji: '👨‍🦲',
        className: 'patient',
    };
    const resolvedPunchlineSpeaker = punchlineSpeaker ?? contentConfig?.punchlineSpeaker ?? {
        label: 'Therapist',
        logoSrc: '/logo_64.png',
        className: 'punchline',
    };
    const firstLineText = content.dialogue.speaker || content.dialogue.therapist || '';
    const secondLineText = content.dialogue.response || content.dialogue.patient || '';
    const formattedDate = formatDate(content.date);
    const resolvedAltBuilder = imageAltBuilder ?? contentConfig?.imageAltBuilder;
    const resolvedAltPrefix = imageAltPrefix ?? contentConfig?.imageAltPrefix
        ?? 'A bald Sphynx cat therapist in an armchair with glasses and notepad counsels a bald man on a couch';
    const imgAlt = resolvedAltBuilder
        ? resolvedAltBuilder(formattedDate, content.dialogue)
        : `${resolvedAltPrefix} \u2014 ${formattedDate}: "${firstLineText}"`;
    const resolvedShareConfig = shareConfig ?? contentConfig?.shareConfig;
    return (_jsxs("div", { className: "daily-content", onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd, children: [_jsxs("div", { className: "daily-nav", children: [_jsx("button", { className: "nav-arrow", onClick: onPrev ?? undefined, disabled: !onPrev, "aria-label": "Previous day", children: "\u2190" }), _jsx("h2", { className: "daily-date", children: formattedDate }), _jsx("button", { className: "nav-arrow", onClick: onNext ?? undefined, disabled: !onNext, "aria-label": "Next day", children: "\u2192" }), _jsx(Calendar, { availableDates: availableDates, currentDate: content.date, onSelectDate: onSelectDate })] }), _jsxs("div", { className: sceneClass, children: [_jsx("div", { className: "daily-image-wrap", children: _jsx("img", { className: "daily-image", src: content.imageUrl, alt: imgAlt, width: 1024, height: 1024 }) }), _jsxs("div", { className: "daily-text", children: [_jsxs("div", { className: "daily-dialogue", children: [_jsxs("div", { className: `dialogue-line ${resolvedFirstSpeaker.className || 'speaker'}`, children: [renderSpeakerBadge(resolvedFirstSpeaker), _jsx("p", { children: firstLineText })] }), _jsxs("div", { className: `dialogue-line ${resolvedSecondSpeaker.className || 'response'}`, children: [renderSpeakerBadge(resolvedSecondSpeaker), _jsx("p", { children: secondLineText })] }), _jsxs("div", { className: `dialogue-line ${resolvedPunchlineSpeaker.className || 'punchline'}`, children: [renderSpeakerBadge(resolvedPunchlineSpeaker), _jsx("p", { children: content.dialogue.punchline })] })] }), _jsxs("div", { className: "daily-actions", children: [_jsx(ShareButtons, { date: content.date, punchline: content.dialogue.punchline, ...resolvedShareConfig }), _jsx(FavoriteButton, { date: content.date, onToggle: onFavoriteToggle }), _jsx(ReactionButtons, { date: content.date })] }), _jsx(ViewCounter, { date: content.date })] })] }), _jsx(PromptReveal, {})] }));
};
