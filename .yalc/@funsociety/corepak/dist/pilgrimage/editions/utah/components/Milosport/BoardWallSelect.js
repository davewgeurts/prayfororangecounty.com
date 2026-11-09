import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { SNOWBOARDS_LIST } from '../../data/snowboardGear';
import { BOARD_WALL_TAGS, SHOP_LOCALS } from '../../data/miloShopFloor';
import { MiloBoardGraphic } from './MiloBoardGraphic';
import { ShopLocalSpot } from './ShopLocalSpot';
import { Zap } from 'lucide-react';
const WALL_SECTIONS = [
    { brand: 'Forum', label: 'FORUM' },
    { brand: 'Burton', label: 'BURTON' },
    { brand: 'ThirtyTwo', label: 'THIRTYTWO' },
    { brand: 'Milosport', label: 'MILO HOUSE' }
];
// statsBonus multipliers run ~1.0–1.45; map them onto the 10-segment 1080 bars
const bonusToBar = (v) => Math.max(1, Math.min(10, Math.round(((v - 0.9) / 0.3) * 10)));
export const SegBar = ({ value, hot }) => (_jsx("div", { className: "milo-seg-bar", children: Array.from({ length: 10 }).map((_, i) => (_jsx("span", { className: i < value ? `on${hot ? ' hot' : ''}` : '' }, i))) }));
export const BoardWallSelect = ({ selectedBoardId, onSelectBoard }) => {
    // Last deck the cursor landed on stays highlighted (1080-style) until you pull one down
    const [hoveredId, setHoveredId] = useState(null);
    const [spinKey, setSpinKey] = useState(0);
    const selectedBoard = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0];
    const shownBoard = SNOWBOARDS_LIST.find(b => b.id === hoveredId) || selectedBoard;
    const isPreview = shownBoard.id !== selectedBoard.id;
    const tag = BOARD_WALL_TAGS[shownBoard.id];
    const wallLocals = SHOP_LOCALS.filter(l => l.scene === 'wall');
    const pullBoard = (id) => {
        onSelectBoard(id);
        setHoveredId(null);
        setSpinKey(k => k + 1);
    };
    const statRows = [
        { label: 'FLEX', value: shownBoard.flex },
        { label: 'POP', value: shownBoard.pop },
        { label: 'POW FLOAT', value: shownBoard.float },
        { label: 'SPEED', value: bonusToBar(shownBoard.statsBonus.speedBoost), hot: true },
        { label: 'EDGE', value: bonusToBar(shownBoard.statsBonus.carveGrip), hot: true },
        { label: 'TRICKS', value: bonusToBar(shownBoard.statsBonus.trickBonus), hot: true }
    ];
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px] gap-4", children: [_jsxs("div", { className: "relative lg:self-start rounded-2xl overflow-hidden border-2 border-amber-950 shadow-2xl", style: {
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55)), repeating-linear-gradient(90deg, #4a3220 0 54px, #3a2718 54px 57px)'
                }, children: [_jsxs("div", { className: "flex items-center justify-between px-4 pt-3", children: [_jsx("div", { className: "milo-1080-banner px-4 py-1", children: _jsx("span", { className: "milo-1080-title text-xl sm:text-2xl", children: "Board Select" }) }), _jsx("div", { className: "milo-neon font-black italic tracking-widest text-sm sm:text-base text-emerald-300 [text-shadow:0_0_6px_#22c55e,0_0_14px_#16a34a]", children: "MILOSPORT \u2022 THE WALL" })] }), _jsx("p", { className: "px-4 pt-1 text-[11px] font-mono text-amber-100/70", children: "Hover a deck to grab it off the hook. Click to pull it down and strap it to the roof rack." }), _jsx("div", { className: "relative overflow-x-auto pb-2", children: _jsx("div", { className: "flex items-end gap-5 px-4 pt-4 min-w-max", children: WALL_SECTIONS.map(section => {
                                const boards = SNOWBOARDS_LIST.filter(b => b.brand === section.brand);
                                if (boards.length === 0)
                                    return null;
                                return (_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "px-3 py-0.5 rounded-sm bg-slate-950/85 border border-amber-200/40 text-[10px] font-black italic tracking-[0.2em] text-amber-100 shadow", children: section.label }), _jsxs("div", { className: "relative flex items-start gap-3 pt-3", children: [_jsx("div", { className: "absolute left-0 right-0 top-1 h-1.5 rounded-full bg-gradient-to-b from-slate-200 to-slate-500 shadow" }), boards.map(board => {
                                                    const isPicked = board.id === selectedBoardId;
                                                    const boardTag = BOARD_WALL_TAGS[board.id];
                                                    return (_jsxs("button", { type: "button", onClick: () => pullBoard(board.id), onPointerEnter: e => { if (e.pointerType === 'mouse')
                                                            setHoveredId(board.id); }, onFocus: () => setHoveredId(board.id), className: `milo-board-hang relative flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer outline-none ${isPicked ? 'is-picked' : ''}`, style: { animationDelay: `${-(board.lengthCm % 5)}s` }, "aria-label": `${board.name}${isPicked ? ' (on your roof rack)' : ''}`, children: [_jsx("span", { className: "w-1 h-3 bg-slate-300 rounded-b" }), _jsx(MiloBoardGraphic, { board: board, className: "w-[54px] sm:w-[66px] h-auto drop-shadow-[0_6px_6px_rgba(0,0,0,0.5)]" }), boardTag && (_jsx("span", { className: "absolute top-6 -right-3 rotate-12 px-1 py-0.5 bg-amber-50 text-[9px] font-black font-mono text-rose-700 border border-amber-300 shadow", children: boardTag.price }))] }, board.id));
                                                })] })] }, section.brand));
                            }) }) }), _jsxs("div", { className: "relative h-32 sm:h-36 mt-1 bg-gradient-to-b from-stone-800 to-stone-950 border-t-4 border-stone-700", children: [_jsx("div", { className: "absolute left-[3%] bottom-2 w-16 h-9 rounded-sm bg-sky-900 border-2 border-sky-700 flex items-center justify-center text-[8px] font-black text-sky-200 tracking-wider", children: "FREE STICKERS" }), _jsx("div", { className: "absolute right-[2%] bottom-2 text-[9px] font-mono text-stone-400 italic", children: "\u201CPlease do not lick the boards\u201D \u2014 mgmt" }), wallLocals.map(local => (_jsx(ShopLocalSpot, { local: local, baseWidthPct: 7 }, local.id)))] })] }), _jsxs("div", { className: "milo-1080-panel p-4 flex flex-col gap-3 text-slate-100", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[10px] font-mono tracking-widest text-sky-200/80", children: isPreview ? 'CHECKING OUT' : 'ON YOUR ROOF RACK' }), _jsx("span", { className: "text-[10px] font-mono text-sky-200/80", children: shownBoard.year })] }), _jsxs("div", { className: "flex gap-4 items-center", children: [_jsx("div", { className: "shrink-0 [perspective:600px]", children: _jsx("div", { className: "milo-board-spin", children: _jsx(MiloBoardGraphic, { board: shownBoard, className: "w-[72px] h-auto drop-shadow-[0_10px_8px_rgba(0,0,0,0.6)]" }) }, `${shownBoard.id}-${spinKey}`) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "milo-1080-title text-lg leading-tight", children: shownBoard.name }), _jsxs("div", { className: "text-[11px] font-mono text-sky-200 mt-1", children: [shownBoard.lengthCm, "cm \u2022 ", shownBoard.type] }), _jsx("div", { className: "text-[11px] font-mono text-sky-300/70", children: shownBoard.camber }), _jsx("div", { className: "mt-2 inline-block px-2 py-0.5 text-[10px] font-black italic tracking-wider text-slate-950 bg-amber-300 -skew-x-12", children: shownBoard.badge })] })] }), _jsx("div", { className: "space-y-1.5 bg-slate-950/50 rounded p-3 border border-sky-900", children: statRows.map(row => (_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-[11px] font-black italic tracking-wider text-sky-100", children: row.label }), _jsx(SegBar, { value: row.value, hot: row.hot })] }, row.label))) }), _jsx("p", { className: "text-xs text-slate-300 leading-snug", children: shownBoard.description }), _jsxs("div", { className: "flex items-start gap-1.5 text-xs text-amber-200 font-mono bg-amber-950/30 border border-amber-700/40 p-2 rounded", children: [_jsx(Zap, { className: "w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" }), _jsx("span", { children: shownBoard.perkDescription })] }), tag && (_jsxs("div", { className: "relative self-start rotate-[-2deg] bg-amber-50 text-stone-800 px-3 py-2 shadow-md border border-amber-200 font-mono text-[11px]", children: [_jsxs("span", { className: "block font-black text-rose-700 text-sm", children: ["MILO PRICE ", tag.price] }), _jsxs("span", { className: "italic", children: ["\u201C", tag.note, "\u201D"] })] })), _jsx("button", { type: "button", onClick: () => pullBoard(shownBoard.id), className: `mt-auto w-full py-2.5 rounded font-black italic tracking-wider text-sm cursor-pointer transition-all ${isPreview
                            ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 hover:brightness-110'
                            : 'bg-emerald-500 text-slate-950'}`, children: isPreview ? 'PULL IT OFF THE WALL' : 'STRAPPED TO THE ROOF RACK ✓' })] })] }));
};
