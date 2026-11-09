import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { MiloFigure } from './MiloFigure';
// A non-playable shop local. Tap or click to make them talk; they cycle through their lines.
export const ShopLocalSpot = ({ local, baseWidthPct = 6.2 }) => {
    const [lineIndex, setLineIndex] = useState(null);
    const hideTimer = useRef(null);
    useEffect(() => () => {
        if (hideTimer.current)
            window.clearTimeout(hideTimer.current);
    }, []);
    const talk = () => {
        setLineIndex(i => (i === null ? Math.floor(Math.random() * local.lines.length) : (i + 1) % local.lines.length));
        if (hideTimer.current)
            window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setLineIndex(null), 4200);
    };
    return (_jsxs("button", { type: "button", onClick: talk, className: "group absolute cursor-pointer bg-transparent border-0 p-0", style: {
            left: `${local.x}%`,
            bottom: `${local.y}%`,
            width: `${baseWidthPct * local.scale}%`,
            transform: 'translateX(-50%)',
            zIndex: Math.round(100 - local.y)
        }, title: `${local.name} — ${local.role}`, children: [lineIndex !== null && _jsx("div", { className: "milo-bubble", children: local.lines[lineIndex] }), _jsx("div", { className: local.wander ? 'milo-wander' : undefined, children: _jsx(MiloFigure, { look: local.look, pose: `idle-${local.idle}`, delay: (local.x % 7) * 0.4, className: "w-full h-auto brightness-90 saturate-[0.85]" }) }), _jsxs("span", { className: "absolute left-1/2 -translate-x-1/2 -bottom-4 whitespace-nowrap text-[9px] font-mono text-slate-300/0 group-hover:text-slate-200 transition-colors", children: [local.name, " \u2022 ", local.role] })] }));
};
