import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { RIDERS_LIST } from '../../data/snowboardGear';
import { RIDER_SHOP_PROFILES, SHOP_LOCALS, FORTNITE_DANCES } from '../../data/miloShopFloor';
import { MiloFigure } from './MiloFigure';
import { ShopLocalSpot } from './ShopLocalSpot';
import { SegBar } from './BoardWallSelect';
import { MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
const FIGURE_WIDTH_PCT = 6.6;
const DANCE_MS = 4800;
const CHEER_RANGE_PCT = 12;
const SAIYAN_TAPS = 3;
const SAIYAN_WINDOW_MS = 1600;
const RIDERS_LEFT_TO_RIGHT = [...RIDER_SHOP_PROFILES].sort((a, b) => a.x - b.x);
const pickDance = (exclude) => {
    const pool = FORTNITE_DANCES.filter(d => d.id !== exclude);
    return pool[Math.floor(Math.random() * pool.length)];
};
export const RiderLoungeSelect = ({ selectedRiderId, onSelectRider }) => {
    const [hoveredId, setHoveredId] = useState(null);
    const [dance, setDance] = useState(null);
    const [saiyanId, setSaiyanId] = useState(null);
    const danceTimer = useRef(null);
    const lastPointerType = useRef('mouse');
    const tapStreak = useRef({ riderId: '', count: 0, at: 0 });
    const riderButtons = useRef({});
    const sceneScroller = useRef(null);
    useEffect(() => () => {
        if (danceTimer.current)
            window.clearTimeout(danceTimer.current);
    }, []);
    const chooseRider = (riderId) => {
        const now = Date.now();
        const streak = tapStreak.current;
        const sameStreak = streak.riderId === riderId && now - streak.at < SAIYAN_WINDOW_MS;
        tapStreak.current = { riderId, count: sameStreak ? streak.count + 1 : 1, at: now };
        if (tapStreak.current.count >= SAIYAN_TAPS)
            setSaiyanId(riderId);
        else if (saiyanId && saiyanId !== riderId)
            setSaiyanId(null);
        onSelectRider(riderId);
        setHoveredId(null);
        const next = pickDance(dance?.id);
        setDance({ riderId, id: next.id, label: next.label });
        if (danceTimer.current)
            window.clearTimeout(danceTimer.current);
        danceTimer.current = window.setTimeout(() => setDance(null), DANCE_MS);
        const el = riderButtons.current[riderId];
        if (el) {
            const rect = el.getBoundingClientRect();
            try {
                confetti({
                    particleCount: tapStreak.current.count >= SAIYAN_TAPS ? 120 : 45,
                    spread: 70,
                    startVelocity: 28,
                    origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
                    colors: tapStreak.current.count >= SAIYAN_TAPS ? ['#facc15', '#f59e0b', '#ffffff'] : ['#38bdf8', '#22c55e', '#f59e0b', '#ffffff']
                });
            }
            catch {
                // confetti is decoration only
            }
        }
    };
    const focusRider = (riderId) => {
        setHoveredId(riderId);
        // Pan only the shop strip sideways (phones); never scroll the page under a resting mouse
        const el = riderButtons.current[riderId];
        const scroller = sceneScroller.current;
        if (el && scroller) {
            const r = el.getBoundingClientRect();
            const s = scroller.getBoundingClientRect();
            scroller.scrollBy({ left: r.left + r.width / 2 - (s.left + s.width / 2), behavior: 'smooth' });
        }
    };
    // 1080-style cursor: arrow keys walk the shop floor, Enter picks
    useEffect(() => {
        const onKey = (e) => {
            const target = e.target;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'))
                return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const current = hoveredId ?? selectedRiderId;
                const idx = RIDERS_LEFT_TO_RIGHT.findIndex(p => p.riderId === current);
                const step = e.key === 'ArrowRight' ? 1 : -1;
                const next = RIDERS_LEFT_TO_RIGHT[(idx + step + RIDERS_LEFT_TO_RIGHT.length) % RIDERS_LEFT_TO_RIGHT.length];
                focusRider(next.riderId);
            }
            else if (e.key === 'Enter' && hoveredId && target?.tagName !== 'BUTTON') {
                e.preventDefault();
                chooseRider(hoveredId);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });
    const cardRiderId = hoveredId ?? selectedRiderId;
    const cardRider = RIDERS_LIST.find(r => r.id === cardRiderId) || RIDERS_LIST[0];
    const cardProfile = RIDER_SHOP_PROFILES.find(p => p.riderId === cardRider.id);
    const isPreview = cardRider.id !== selectedRiderId;
    const loungeLocals = SHOP_LOCALS.filter(l => l.scene === 'lounge');
    const dancer = dance ? RIDER_SHOP_PROFILES.find(p => p.riderId === dance.riderId) : undefined;
    const statRows = cardProfile
        ? [
            { label: 'TECHNIQUE', value: cardProfile.stats.technique },
            { label: 'SPEED', value: cardProfile.stats.speed },
            { label: 'BALANCE', value: cardProfile.stats.balance },
            { label: 'POWER', value: cardProfile.stats.power },
            { label: 'JUMP', value: cardProfile.stats.jump }
        ]
        : [];
    const renderRider = (profile) => {
        const rider = RIDERS_LIST.find(r => r.id === profile.riderId);
        if (!rider)
            return null;
        const isSelected = rider.id === selectedRiderId;
        const isDancing = dance?.riderId === rider.id;
        const isHovered = hoveredId === rider.id;
        const isCheering = !isDancing && !!dancer && Math.abs(dancer.x - profile.x) <= CHEER_RANGE_PCT;
        const pose = isDancing ? `dance ${dance.id}` : isHovered ? profile.hoverPose : isCheering ? 'hands-up' : undefined;
        const widthPct = FIGURE_WIDTH_PCT * profile.scale * profile.looks.length * (profile.looks.length > 1 ? 0.82 : 1);
        return (_jsxs("button", { ref: el => { riderButtons.current[rider.id] = el; }, type: "button", onPointerDown: e => { lastPointerType.current = e.pointerType; }, onClick: () => {
                // On touch there is no hover: first tap shows the pitch, second tap picks
                if (lastPointerType.current === 'touch' && hoveredId !== rider.id && !isSelected) {
                    setHoveredId(rider.id);
                    return;
                }
                chooseRider(rider.id);
            }, onPointerEnter: e => { if (e.pointerType === 'mouse')
                setHoveredId(rider.id); }, onPointerLeave: e => { if (e.pointerType === 'mouse')
                setHoveredId(h => (h === rider.id ? null : h)); }, onFocus: e => { if (e.currentTarget.matches(':focus-visible'))
                setHoveredId(rider.id); }, className: "group absolute bg-transparent border-0 p-0 cursor-pointer outline-none focus-visible:[filter:drop-shadow(0_0_6px_#7dd3fc)]", style: {
                left: `${profile.x}%`,
                bottom: `${profile.y}%`,
                width: `${widthPct}%`,
                transform: 'translateX(-50%)',
                zIndex: isHovered || isDancing ? 120 : Math.round(100 - profile.y)
            }, "aria-label": `${rider.name}, ${rider.nickname}. ${profile.spotLabel}`, children: [isHovered && !isDancing && _jsx("div", { className: "milo-bubble", children: profile.pickMeLine }), isDancing && (_jsx("div", { className: "milo-bubble", children: saiyanId === rider.id ? 'AAAAAAAAHHHHHH!!! POWER LEVEL: OVER 9000!' : rider.dialogue.atShop })), isSelected && (_jsx("span", { className: "absolute left-1/2 -translate-x-1/2 bottom-[-4%] w-[115%] h-[9%] rounded-[50%] bg-sky-400/40 border-2 border-sky-300 shadow-[0_0_14px_#38bdf8] pointer-events-none" })), _jsx("div", { className: "relative flex items-end", children: profile.looks.map((look, i) => (_jsx("div", { style: { width: `${100 / profile.looks.length}%` }, children: _jsx(MiloFigure, { look: look, pose: pose, saiyan: saiyanId === rider.id, delay: profile.x * 0.13 + i, className: `w-full h-auto ${isHovered || isDancing ? '' : 'brightness-[0.92]'}` }) }, i))) }), _jsxs("span", { className: `absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap px-1.5 py-px text-[9px] font-black italic tracking-wider rounded-sm transition-opacity ${isSelected ? 'bg-sky-400 text-slate-950 opacity-100' : 'bg-slate-950/80 text-slate-200 opacity-0 group-hover:opacity-100'} ${isHovered ? 'opacity-100' : ''}`, children: [isSelected ? '★ ' : '', rider.name.toUpperCase()] })] }, rider.id));
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "milo-1080-banner px-4 py-1", children: _jsx("span", { className: "milo-1080-title text-xl sm:text-2xl", children: "Rider Select" }) }), _jsx("p", { className: "text-[11px] font-mono text-slate-400 mt-2", children: "The whole crew is posted up inside Milo. Hover (or tap) someone to hear their pitch, click again to bring them along. Arrow keys work too. Tap the locals to hear what they have to say." })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [saiyanId && (_jsx("div", { className: "milo-dance-banner milo-1080-banner px-4 py-1.5", style: { background: 'linear-gradient(90deg, #000000, #d97706 60%, #fde047)' }, children: _jsx("span", { className: "text-sm font-black italic tracking-wider text-white [text-shadow:0_0_6px_#facc15]", children: "\u26A1 DEEP DARK SAIYAN MODE \u26A1" }) })), dance && (_jsx("div", { className: "milo-dance-banner milo-1080-banner px-4 py-1.5", style: { background: 'linear-gradient(90deg, #c026d3, #f59e0b)' }, children: _jsxs("span", { className: "text-sm font-black italic tracking-wider text-white", children: ["\u2605 ", dance.label.toUpperCase(), " \u2605"] }) }, `${dance.riderId}-${dance.id}`))] })] }), _jsx("div", { className: "sm:hidden text-center text-[10px] font-black italic tracking-widest text-sky-300", children: "\u2190 SWIPE AROUND THE SHOP \u2192" }), _jsx("div", { ref: sceneScroller, className: "rounded-2xl border-2 border-amber-950 overflow-x-auto overflow-y-hidden shadow-2xl bg-stone-950", children: _jsx("div", { className: "relative w-full min-w-[1000px] aspect-[1200/540] overflow-hidden", children: _jsxs("div", { className: "absolute inset-0 transition-transform duration-700 ease-out", style: {
                            transform: dancer ? 'scale(1.28)' : 'scale(1)',
                            transformOrigin: `${dancer ? dancer.x : 50}% 88%`
                        }, children: [_jsx(LoungeBackdrop, {}), loungeLocals.map(local => (_jsx(ShopLocalSpot, { local: local, baseWidthPct: FIGURE_WIDTH_PCT }, local.id))), _jsx(CounterFront, {}), RIDER_SHOP_PROFILES.map(renderRider), _jsx(CouchFront, {})] }) }) }), _jsxs("div", { className: "milo-1080-panel p-4 grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] gap-4 items-center text-slate-100", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "text-[10px] font-mono tracking-widest text-sky-200/80", children: [isPreview ? 'CHECKING OUT' : 'RIDING SHOTGUN', " \u2022 ", cardRider.categoryLabel.toUpperCase()] }), _jsx("div", { className: "milo-1080-title text-2xl sm:text-3xl leading-tight", children: cardRider.name }), _jsxs("div", { className: "text-sm font-black italic text-amber-300", children: ["\u201C", cardRider.nickname, "\u201D"] }), _jsxs("div", { className: "mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono text-sky-100/90", children: [_jsxs("span", { children: ["SPONSOR: ", _jsx("span", { className: "text-white", children: cardRider.sponsor })] }), _jsxs("span", { children: ["STANCE: ", _jsx("span", { className: "text-cyan-300", children: cardRider.stance })] }), _jsxs("span", { className: "col-span-2 flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3 h-3 text-emerald-400" }), cardRider.hometown] }), _jsxs("span", { className: "col-span-2", children: ["TRICK: ", _jsx("span", { className: "text-white", children: cardRider.favoriteTrick })] })] }), cardProfile && (_jsxs("div", { className: "mt-2 text-[11px] italic text-slate-400", children: ["Right now: ", cardProfile.spotLabel] })), saiyanId === cardRider.id && (_jsx("div", { className: "mt-1 text-[11px] font-black italic text-yellow-300 [text-shadow:0_0_6px_#f59e0b]", children: "POWER LEVEL: OVER 9000" }))] }), _jsx("div", { className: "space-y-1.5 bg-slate-950/50 rounded p-3 border border-sky-900", children: statRows.map(row => (_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-[11px] font-black italic tracking-wider text-sky-100", children: row.label }), _jsx(SegBar, { value: row.value })] }, row.label))) }), _jsx("button", { type: "button", onClick: () => chooseRider(cardRider.id), className: `w-full md:w-44 py-3 rounded font-black italic tracking-wider text-sm cursor-pointer transition-all ${isPreview
                            ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 hover:brightness-110'
                            : 'bg-emerald-500 text-slate-950 hover:brightness-110'}`, children: isPreview ? 'PICK THIS RIDER' : 'ENCORE DANCE ★' })] })] }));
};
// Static shop interior, drawn in the same 1200x540 space the riders are positioned in.
const LoungeBackdrop = () => (_jsxs("svg", { viewBox: "0 0 1200 540", preserveAspectRatio: "none", className: "absolute inset-0 w-full h-full", "aria-hidden": "true", children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "milo-wall", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0", stopColor: "#2b1d13" }), _jsx("stop", { offset: "1", stopColor: "#4a3220" })] }), _jsxs("linearGradient", { id: "milo-floor", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0", stopColor: "#57534e" }), _jsx("stop", { offset: "1", stopColor: "#1c1917" })] }), _jsxs("pattern", { id: "milo-slat", width: "56", height: "400", patternUnits: "userSpaceOnUse", children: [_jsx("rect", { width: "56", height: "400", fill: "url(#milo-wall)" }), _jsx("rect", { x: "54", width: "2", height: "400", fill: "#1c130c", opacity: "0.7" })] })] }), _jsx("rect", { width: "1200", height: "405", fill: "url(#milo-slat)" }), _jsx("rect", { y: "0", width: "1200", height: "22", fill: "#111827" }), [120, 360, 600, 840, 1080].map(x => _jsx("rect", { x: x - 50, y: "22", width: "100", height: "5", fill: "#fef3c7", opacity: "0.8" }, x)), _jsx("rect", { y: "405", width: "1200", height: "135", fill: "url(#milo-floor)" }), [0, 150, 300, 450, 600, 750, 900, 1050, 1200].map(x => (_jsx("line", { x1: x, y1: "405", x2: 600 + (x - 600) * 1.6, y2: "540", stroke: "#0c0a09", strokeWidth: "2", opacity: "0.5" }, x))), _jsx("rect", { y: "402", width: "1200", height: "6", fill: "#292524" }), _jsxs("g", { className: "milo-neon", children: [_jsx("rect", { x: "455", y: "42", width: "290", height: "62", rx: "10", fill: "#052e16", stroke: "#22c55e", strokeWidth: "3" }), _jsx("text", { x: "600", y: "86", textAnchor: "middle", fontSize: "38", fontWeight: "900", fontStyle: "italic", fill: "#86efac", stroke: "#16a34a", strokeWidth: "1.5", fontFamily: "'Arial Black', Impact, sans-serif", letterSpacing: "3", children: "MILOSPORT" })] }), _jsx("text", { x: "600", y: "122", textAnchor: "middle", fontSize: "12", fontWeight: "700", fill: "#d6d3d1", fontFamily: "monospace", letterSpacing: "4", children: "SALT LAKE CITY \u2022 SINCE 1984" }), _jsx("rect", { x: "0", y: "180", width: "160", height: "12", fill: "#78350f" }), ['#a855f7', '#22c55e', '#f59e0b', '#38bdf8', '#ef4444', '#a855f7', '#f59e0b'].map((c, i) => (_jsx("rect", { x: 10 + i * 21, y: "164", width: "16", height: "16", rx: "2", fill: c, stroke: "#0b1020", strokeWidth: "1.5" }, i))), _jsx("text", { x: "80", y: "150", textAnchor: "middle", fontSize: "13", fontWeight: "900", fill: "#fde68a", fontFamily: "'Arial Black', sans-serif", children: "WAX & TUNES" }), _jsx("rect", { x: "125", y: "22", width: "40", height: "383", fill: "#44403c" }), Array.from({ length: 34 }).map((_, i) => (_jsx("rect", { x: 127 + ((i * 13) % 30), y: 30 + ((i * 47) % 360), width: 10 + (i % 3) * 3, height: 6 + (i % 4) * 2, rx: "1.5", fill: ['#ef4444', '#22c55e', '#facc15', '#38bdf8', '#f97316', '#ec4899', '#ffffff', '#a855f7'][i % 8], transform: `rotate(${(i % 5) * 9 - 18} ${132 + ((i * 13) % 30)} ${33 + ((i * 47) % 360)})` }, i))), _jsx("rect", { x: "190", y: "300", width: "175", height: "80", rx: "16", fill: "#7f1d1d", stroke: "#0b1020", strokeWidth: "3" }), _jsx("rect", { x: "198", y: "312", width: "78", height: "56", rx: "10", fill: "#991b1b" }), _jsx("rect", { x: "280", y: "312", width: "78", height: "56", rx: "10", fill: "#991b1b" }), _jsx("rect", { x: "215", y: "230", width: "120", height: "58", fill: "#0f172a", stroke: "#cbd5e1", strokeWidth: "3" }), _jsx("text", { x: "275", y: "255", textAnchor: "middle", fontSize: "11", fontWeight: "900", fill: "#fbbf24", fontFamily: "'Arial Black', sans-serif", children: "PRO SALE" }), _jsx("text", { x: "275", y: "274", textAnchor: "middle", fontSize: "10", fontWeight: "700", fill: "#e2e8f0", fontFamily: "monospace", children: "LINE STARTS 5AM" }), _jsx("rect", { x: "465", y: "300", width: "150", height: "10", fill: "#1f2937" }), _jsx("rect", { x: "475", y: "310", width: "8", height: "95", fill: "#374151" }), _jsx("rect", { x: "597", y: "310", width: "8", height: "95", fill: "#374151" }), _jsx("rect", { x: "470", y: "210", width: "140", height: "92", rx: "10", fill: "#27272a", stroke: "#0b1020", strokeWidth: "3" }), _jsx("rect", { className: "milo-tv-static", x: "482", y: "220", width: "104", height: "72", rx: "8", fill: "#1e3a8a" }), _jsx("text", { x: "534", y: "250", textAnchor: "middle", fontSize: "12", fontWeight: "900", fontStyle: "italic", fill: "#f8fafc", fontFamily: "'Arial Black', sans-serif", children: "THE" }), _jsx("text", { x: "534", y: "267", textAnchor: "middle", fontSize: "12", fontWeight: "900", fontStyle: "italic", fill: "#f8fafc", fontFamily: "'Arial Black', sans-serif", children: "RESISTANCE" }), _jsx("text", { x: "534", y: "284", textAnchor: "middle", fontSize: "9", fontWeight: "700", fill: "#93c5fd", fontFamily: "monospace", children: "FORUM \u2022 2000 \u25B6" }), _jsx("circle", { cx: "597", cy: "236", r: "4", fill: "#71717a" }), _jsx("circle", { cx: "597", cy: "252", r: "4", fill: "#71717a" }), _jsx("rect", { x: "370", y: "140", width: "80", height: "110", fill: "#f8fafc", stroke: "#0b1020", strokeWidth: "2", transform: "rotate(-3 410 195)" }), _jsx("text", { x: "410", y: "185", textAnchor: "middle", fontSize: "20", fontWeight: "900", fontStyle: "italic", fill: "#ea580c", fontFamily: "'Arial Black', sans-serif", transform: "rotate(-3 410 195)", children: "FORUM" }), _jsx("text", { x: "410", y: "222", textAnchor: "middle", fontSize: "34", fontWeight: "900", fill: "#0b1020", fontFamily: "'Arial Black', sans-serif", transform: "rotate(-3 410 195)", children: "8" }), _jsx("rect", { x: "680", y: "160", width: "95", height: "150", fill: "#d6d3d1", stroke: "#57534e", strokeWidth: "3" }), Array.from({ length: 9 }).map((_, i) => (_jsx("path", { transform: `translate(${695 + (i % 3) * 30} ${175 + Math.floor(i / 3) * 45})`, d: "M0 0 Q0 -8 8 -8 Q16 -8 16 0 L16 22 Q8 26 0 22 Z", fill: ['#ef4444', '#0f172a', '#22c55e', '#f59e0b', '#38bdf8', '#a855f7', '#f97316', '#e2e8f0', '#ec4899'][i], stroke: "#0b1020", strokeWidth: "1.5" }, i))), _jsx("text", { x: "727", y: "152", textAnchor: "middle", fontSize: "12", fontWeight: "900", fill: "#fde68a", fontFamily: "'Arial Black', sans-serif", children: "GLOVES" }), _jsx("rect", { x: "800", y: "150", width: "190", height: "6", fill: "#cbd5e1" }), ['#0891b2', '#dc2626', '#f59e0b', '#16a34a', '#7c3aed', '#0f172a', '#ec4899', '#e2e8f0'].map((c, i) => (_jsxs("g", { children: [_jsx("line", { x1: 812 + i * 23, y1: "156", x2: 812 + i * 23, y2: "166", stroke: "#94a3b8", strokeWidth: "2" }), _jsx("path", { d: `M${802 + i * 23} 168 L${822 + i * 23} 168 L${825 + i * 23} 250 L${799 + i * 23} 250 Z`, fill: c, stroke: "#0b1020", strokeWidth: "1.5" })] }, i))), _jsx("text", { x: "895", y: "140", textAnchor: "middle", fontSize: "12", fontWeight: "900", fill: "#fde68a", fontFamily: "'Arial Black', sans-serif", children: "OUTERWEAR" }), [190, 240, 290].map(y => _jsx("rect", { x: "1000", y: y, width: "95", height: "6", fill: "#a8a29e" }, y)), Array.from({ length: 9 }).map((_, i) => (_jsx("path", { transform: `translate(${1006 + (i % 3) * 30} ${168 + Math.floor(i / 3) * 50})`, d: "M0 0 L10 0 L10 14 L22 16 L22 22 L0 22 Z", fill: ['#111827', '#e11d48', '#f8fafc', '#0284c7', '#111827', '#facc15', '#16a34a', '#111827', '#f97316'][i], stroke: "#0b1020", strokeWidth: "1.2" }, i))), _jsx("text", { x: "1047", y: "160", textAnchor: "middle", fontSize: "12", fontWeight: "900", fill: "#fde68a", fontFamily: "'Arial Black', sans-serif", children: "BOOTS" }), _jsx("rect", { x: "1110", y: "110", width: "90", height: "295", fill: "#0c4a6e", stroke: "#94a3b8", strokeWidth: "5" }), _jsx("rect", { x: "1120", y: "122", width: "72", height: "272", fill: "#bae6fd", opacity: "0.35" }), _jsx("clipPath", { id: "milo-door-glass", children: _jsx("rect", { x: "1120", y: "122", width: "72", height: "272" }) }), _jsx("g", { clipPath: "url(#milo-door-glass)", children: Array.from({ length: 22 }).map((_, i) => (_jsx("circle", { className: "milo-flake", cx: 1124 + ((i * 17) % 64), cy: 110 + ((i * 41) % 60), r: 1.4 + (i % 3) * 0.6, fill: "#ffffff", opacity: "0.9", style: { animationDelay: `${-(i * 0.37) % 4}s`, animationDuration: `${3.2 + (i % 4) * 0.5}s` } }, i))) }), _jsx("rect", { x: "1128", y: "140", width: "52", height: "20", rx: "3", fill: "#dc2626" }), _jsx("text", { x: "1154", y: "155", textAnchor: "middle", fontSize: "12", fontWeight: "900", fill: "#ffffff", fontFamily: "'Arial Black', sans-serif", children: "OPEN" })] }));
const CounterFront = () => (_jsxs("svg", { viewBox: "0 0 170 120", preserveAspectRatio: "none", className: "absolute left-0 w-[14%] h-[24%] bottom-[12%] pointer-events-none", style: { zIndex: 86 }, "aria-hidden": "true", children: [_jsx("rect", { x: "0", y: "0", width: "170", height: "14", fill: "#a16207", stroke: "#0b1020", strokeWidth: "2" }), _jsx("rect", { x: "0", y: "14", width: "170", height: "106", fill: "#422006", stroke: "#0b1020", strokeWidth: "2" }), _jsx("rect", { x: "110", y: "-26", width: "44", height: "26", rx: "3", fill: "#334155", stroke: "#0b1020", strokeWidth: "2" }), _jsx("rect", { x: "116", y: "-22", width: "32", height: "10", fill: "#22d3ee" }), _jsx("text", { x: "85", y: "70", textAnchor: "middle", fontSize: "18", fontWeight: "900", fontStyle: "italic", fill: "#fde68a", fontFamily: "'Arial Black', sans-serif", children: "MILO" }), _jsx("text", { x: "85", y: "92", textAnchor: "middle", fontSize: "9", fontWeight: "700", fill: "#d6d3d1", fontFamily: "monospace", children: "PAY HERE \u2022 NO SKATING" })] }));
const CouchFront = () => (_jsxs("svg", { viewBox: "0 0 180 60", preserveAspectRatio: "none", className: "absolute left-[15.5%] w-[15%] h-[13%] bottom-[2%] pointer-events-none", style: { zIndex: 110 }, "aria-hidden": "true", children: [_jsx("rect", { x: "0", y: "6", width: "180", height: "50", rx: "12", fill: "#991b1b", stroke: "#0b1020", strokeWidth: "3" }), _jsx("rect", { x: "-2", y: "0", width: "26", height: "58", rx: "10", fill: "#7f1d1d", stroke: "#0b1020", strokeWidth: "3" }), _jsx("rect", { x: "156", y: "0", width: "26", height: "58", rx: "10", fill: "#7f1d1d", stroke: "#0b1020", strokeWidth: "3" }), _jsx("path", { d: "M60 18 Q70 14 80 20", stroke: "#fca5a5", strokeWidth: "3", fill: "none", opacity: "0.6" })] }));
