import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { BOARD_WALL_TAGS } from '../../data/miloShopFloor';
const TWIN_PATH = 'M10 26 Q10 4 30 4 Q50 4 50 26 Q45 120 50 214 Q50 236 30 236 Q10 236 10 214 Q15 120 10 26 Z';
const SWALLOW_PATH = 'M10 30 Q10 4 30 4 Q50 4 50 30 Q45 120 49 206 L49 236 L30 216 L11 236 L11 206 Q15 120 10 30 Z';
// Vertical snowboard as it hangs on the Milo wall (nose up), drawn in a 60x240 viewBox.
export const MiloBoardGraphic = ({ board, side = 'top', className = '' }) => {
    const clipId = useId().replace(/:/g, '');
    const outline = board.id === 'burton-fish' ? SWALLOW_PATH : TWIN_PATH;
    const graphic = BOARD_WALL_TAGS[board.id]?.graphic ?? 'stripes';
    const fill = side === 'top' ? board.topGraphicColor : board.baseGraphicColor;
    const accent = board.accentColor;
    return (_jsxs("svg", { viewBox: "0 0 60 240", className: className, "aria-hidden": "true", children: [_jsxs("defs", { children: [_jsx("clipPath", { id: `clip-${clipId}`, children: _jsx("path", { d: outline }) }), _jsxs("linearGradient", { id: `sheen-${clipId}`, x1: "0", y1: "0", x2: "1", y2: "0", children: [_jsx("stop", { offset: "0", stopColor: "#ffffff", stopOpacity: "0.28" }), _jsx("stop", { offset: "0.35", stopColor: "#ffffff", stopOpacity: "0" }), _jsx("stop", { offset: "0.8", stopColor: "#000000", stopOpacity: "0" }), _jsx("stop", { offset: "1", stopColor: "#000000", stopOpacity: "0.35" })] })] }), _jsxs("g", { clipPath: `url(#clip-${clipId})`, children: [_jsx("rect", { width: "60", height: "240", fill: fill }), side === 'top' && _jsx(BoardPattern, { kind: graphic, accent: accent }), side === 'base' && (_jsx("text", { x: "30", y: "120", fill: "#ffffff", opacity: "0.85", fontSize: "15", fontWeight: "900", fontStyle: "italic", textAnchor: "middle", transform: "rotate(-90 30 120)", fontFamily: "'Arial Black', Impact, sans-serif", children: board.brand.toUpperCase() })), _jsx("rect", { width: "60", height: "240", fill: `url(#sheen-${clipId})` })] }), side === 'top' && (_jsxs("g", { children: [_jsx("text", { x: "30", y: "122", fill: "#ffffff", stroke: "#0b1020", strokeWidth: "0.8", paintOrder: "stroke", fontSize: "11", fontWeight: "900", fontStyle: "italic", textAnchor: "middle", transform: "rotate(-90 30 122)", fontFamily: "'Arial Black', Impact, sans-serif", letterSpacing: "1", children: board.brand.toUpperCase() }), [86, 94, 146, 154].map(y => (_jsxs("g", { children: [_jsx("circle", { cx: "24", cy: y, r: "1.3", fill: "#0b1020", opacity: "0.55" }), _jsx("circle", { cx: "36", cy: y, r: "1.3", fill: "#0b1020", opacity: "0.55" })] }, y)))] })), _jsx("path", { d: outline, fill: "none", stroke: "#e2e8f0", strokeWidth: "2" }), _jsx("path", { d: outline, fill: "none", stroke: "#0b1020", strokeWidth: "0.8" })] }));
};
const BoardPattern = ({ kind, accent }) => {
    switch (kind) {
        case 'flames':
            return (_jsxs("g", { fill: accent, children: [_jsx("path", { d: "M0 240 L0 170 Q8 190 12 160 Q18 185 24 150 Q30 182 36 155 Q42 188 48 162 Q53 186 60 168 L60 240 Z" }), _jsx("path", { d: "M0 0 L0 60 Q8 44 14 70 Q20 48 28 76 Q36 50 44 74 Q52 46 60 64 L60 0 Z", opacity: "0.7" })] }));
        case 'stars':
            return (_jsx("g", { fill: accent, children: [[18, 40], [42, 64], [22, 172], [40, 200], [30, 18], [16, 214]].map(([x, y], i) => (_jsx("path", { transform: `translate(${x} ${y})`, d: "M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z" }, i))) }));
        case 'checker':
            return (_jsx("g", { fill: accent, opacity: "0.85", children: Array.from({ length: 6 }).map((_, row) => Array.from({ length: 6 }).map((__, col) => ((row + col) % 2 === 0 ? (_jsx("rect", { x: col * 10, y: row * 10 + 180, width: "10", height: "10" }, `${row}-${col}`)) : null))) }));
        case 'waves':
            return (_jsx("g", { fill: "none", stroke: accent, strokeWidth: "3.5", opacity: "0.9", children: [30, 50, 180, 200, 220].map(y => (_jsx("path", { d: `M0 ${y} Q10 ${y - 8} 20 ${y} T40 ${y} T60 ${y}` }, y))) }));
        case 'dots':
            return (_jsx("g", { fill: accent, children: Array.from({ length: 26 }).map((_, i) => (_jsx("circle", { cx: (i * 23) % 60, cy: (i * 37) % 240, r: 2 + (i % 3) }, i))) }));
        case 'chevron':
            return (_jsx("g", { fill: "none", stroke: accent, strokeWidth: "5", children: [40, 60, 180, 200].map(y => _jsx("path", { d: `M0 ${y} L30 ${y - 16} L60 ${y}` }, y)) }));
        case 'retro':
            return (_jsxs("g", { children: [_jsx("rect", { x: "0", y: "34", width: "60", height: "9", fill: accent }), _jsx("rect", { x: "0", y: "47", width: "60", height: "5", fill: "#fbbf24" }), _jsx("rect", { x: "0", y: "56", width: "60", height: "3", fill: "#f8fafc" }), _jsx("rect", { x: "0", y: "186", width: "60", height: "9", fill: accent }), _jsx("rect", { x: "0", y: "199", width: "60", height: "5", fill: "#fbbf24" })] }));
        default:
            return (_jsxs("g", { fill: accent, children: [_jsx("rect", { x: "8", y: "0", width: "5", height: "240" }), _jsx("rect", { x: "47", y: "0", width: "5", height: "240" }), _jsx("rect", { x: "18", y: "0", width: "2", height: "240", opacity: "0.6" })] }));
    }
};
