import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export const FlowerOfLifeWatermark = ({ className = "w-[760px] h-[760px] opacity-[0.07]", }) => {
    const R = 52;
    const circles = [{ cx: 0, cy: 0 }];
    // Ring 1 (6 circles)
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        circles.push({
            cx: R * Math.cos(angle),
            cy: R * Math.sin(angle),
        });
    }
    // Ring 2 (12 circles)
    for (let i = 0; i < 6; i++) {
        const angle1 = (i * Math.PI) / 3;
        const angle2 = ((i + 1) * Math.PI) / 3;
        circles.push({
            cx: 2 * R * Math.cos(angle1),
            cy: 2 * R * Math.sin(angle1),
        });
        circles.push({
            cx: R * (Math.cos(angle1) + Math.cos(angle2)),
            cy: R * (Math.sin(angle1) + Math.sin(angle2)),
        });
    }
    // Ring 3 (18 circles)
    for (let i = 0; i < 6; i++) {
        const angle1 = (i * Math.PI) / 3;
        const angle2 = ((i + 1) * Math.PI) / 3;
        for (let step = 0; step < 3; step++) {
            const t = step / 3;
            const x1 = 3 * R * Math.cos(angle1);
            const y1 = 3 * R * Math.sin(angle1);
            const x2 = 3 * R * Math.cos(angle2);
            const y2 = 3 * R * Math.sin(angle2);
            circles.push({
                cx: x1 * (1 - t) + x2 * t,
                cy: y1 * (1 - t) + y2 * t,
            });
        }
    }
    return (_jsxs("svg", { viewBox: "-240 -240 480 480", className: className, fill: "none", "aria-hidden": "true", children: [_jsx("defs", { children: _jsx("clipPath", { id: "fol-clip", children: _jsx("circle", { cx: "0", cy: "0", r: 3 * R + 2 }) }) }), _jsx("circle", { cx: "0", cy: "0", r: 3 * R + 12, stroke: "currentColor", strokeWidth: "2.5" }), _jsx("circle", { cx: "0", cy: "0", r: 3 * R + 3, stroke: "currentColor", strokeWidth: "2" }), _jsx("g", { clipPath: "url(#fol-clip)", children: circles.map((c, idx) => (_jsx("circle", { cx: c.cx, cy: c.cy, r: R, stroke: "currentColor", strokeWidth: "1.75" }, idx))) })] }));
};
const DEFAULT_CHARACTERS = "ॐ∞✦✧1%BLISSSHIVAFIRESTORMSPARKDOCTRINELOVEPEACE01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンDEVGEURTS";
export const MatrixBackground = ({ active = true, color, fontSize = 14, opacity = 0.2, showWatermark = true, characters = DEFAULT_CHARACTERS, }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!active)
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        let animationFrameId;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);
        const safeFontSize = fontSize > 0 ? fontSize : 14;
        const columns = Math.floor(canvas.width / safeFontSize);
        const drops = new Array(columns)
            .fill(1)
            .map(() => Math.floor(Math.random() * -50));
        let lastTime = 0;
        const interval = 46;
        const render = (currentTime) => {
            animationFrameId = requestAnimationFrame(render);
            if (currentTime - lastTime < interval)
                return;
            lastTime = currentTime;
            ctx.fillStyle = "rgba(8, 11, 16, 0.12)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${safeFontSize}px monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                const x = i * safeFontSize;
                const y = drops[i] * safeFontSize;
                const palette = color ?? (i % 7 === 0 ? "#ffb000" : i % 3 === 0 ? "#00f0ff" : "#00ff66");
                ctx.fillStyle = palette;
                ctx.shadowBlur = 6;
                ctx.shadowColor = palette;
                ctx.fillText(text, x, y);
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            ctx.shadowBlur = 0;
        };
        animationFrameId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
        };
    }, [active, color, fontSize, characters]);
    return (_jsxs(_Fragment, { children: [showWatermark && (_jsx("div", { className: "fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden", children: _jsx(FlowerOfLifeWatermark, { className: "w-[88vw] max-w-[780px] h-[88vw] max-h-[780px] text-arcade-cyan opacity-[0.06]" }) })), active && (_jsx("canvas", { ref: canvasRef, className: "fixed inset-0 pointer-events-none z-0 opacity-20", style: { opacity }, "aria-hidden": "true" }))] }));
};
export default MatrixBackground;
