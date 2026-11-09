import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import { SNOWBOARDS_LIST, RIDERS_LIST } from '../../data/snowboardGear';
import { ChairliftRideView } from './ChairliftRideView';
import { drawGpuAlpinePowderAndAlpenglow, getSnowShaderBackendLabel, drawCelShadedPineTree, drawCelShadedQuartziteRock, drawCelShadedParkKicker, drawCelShadedParkRail, drawCelShadedRainbowBox, drawCelShadedPowderPillow, drawCelShadedSnowShrine, drawCelShadedYeti } from '../../utils/snowShaderEngine';
export const BrightonSkiFree = ({ onReturnToDrive, selectedBoardId, selectedRiderId, waxSpeedMultiplier = 1.0, purchasedPassIds = [] }) => {
    const board = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0];
    const rider = RIDERS_LIST.find(r => r.id === selectedRiderId) || RIDERS_LIST[0];
    const [viewMode, setViewMode] = useState('chairlift');
    const boardRef = useRef(board);
    const riderRef = useRef(rider);
    const waxMultiplierRef = useRef(waxSpeedMultiplier);
    useEffect(() => {
        boardRef.current = board;
        riderRef.current = rider;
        waxMultiplierRef.current = waxSpeedMultiplier;
    }, [board, rider, waxSpeedMultiplier]);
    const canvasRef = useRef(null);
    const hasPassBonus = purchasedPassIds.includes('brighton-day') || purchasedPassIds.includes('wasatch-dual-gold');
    const [score, setScore] = useState(hasPassBonus ? 500 : 0);
    const [distance, setDistance] = useState(0);
    const [isWipedOut, setIsWipedOut] = useState(false);
    const [yetiDistance, setYetiDistance] = useState(999);
    const [activeCheer, setActiveCheer] = useState(null);
    const skierRef = useRef({
        x: 480,
        y: 160,
        speedX: 0,
        speedY: 4,
        angle: 0,
        inAir: false,
        airTimer: 0,
        spin: 0,
        crashed: false,
        invincibleTimer: 0
    });
    const obstaclesRef = useRef([]);
    const yetiRef = useRef({
        active: false,
        x: 480,
        y: -200,
        speed: 7
    });
    const keysRef = useRef({});
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.key] = true;
        };
        const handleKeyUp = (e) => {
            keysRef.current[e.key] = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        // Generate initial obstacles
        const initialObs = [];
        for (let y = 300; y < 3000; y += 80) {
            initialObs.push(generateObstacle(y));
        }
        obstaclesRef.current = initialObs;
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    function generateObstacle(y) {
        const rand = Math.random();
        let type = 'tree';
        if (rand < 0.40)
            type = 'tree';
        else if (rand < 0.58)
            type = 'rock';
        else if (rand < 0.70)
            type = 'kicker';
        else if (rand < 0.80)
            type = 'rail'; // Brighton steel rail
        else if (rand < 0.88)
            type = 'rainbow'; // Rainbow box
        else if (rand < 0.94)
            type = 'powder';
        else if (rand < 0.98)
            type = 'bone_zone_sign'; // Brighton Bone Zone sign
        else
            type = 'shrine';
        return {
            x: 60 + Math.random() * 720, // Keep left of the Crest chairlift corridor
            y,
            type,
            width: type === 'kicker' ? 36 : type === 'rail' ? 44 : type === 'rainbow' ? 40 : type === 'bone_zone_sign' ? 36 : type === 'shrine' ? 30 : 24,
            height: type === 'kicker' ? 20 : type === 'rail' ? 14 : type === 'rainbow' ? 16 : 28,
            hit: false
        };
    }
    useEffect(() => {
        if (viewMode !== 'shredding')
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let animId;
        let distCounter = 0;
        const loop = () => {
            const width = canvas.width;
            const height = canvas.height;
            const skier = skierRef.current;
            const yeti = yetiRef.current;
            const timeSec = Date.now() * 0.001;
            // 1. MULTI-STOP ALPINE POWDER SLOPE GRADIENT + WEBGPU/GLSL DIAMOND-DUST SHADER
            const slopeGrad = ctx.createLinearGradient(0, 0, width - 95, height);
            slopeGrad.addColorStop(0, '#e0f2fe');
            slopeGrad.addColorStop(0.45, '#f8fafc');
            slopeGrad.addColorStop(0.8, '#f1f5f9');
            slopeGrad.addColorStop(1, '#dbeafe');
            ctx.fillStyle = slopeGrad;
            ctx.fillRect(0, 0, width, height);
            drawGpuAlpinePowderAndAlpenglow(ctx, 0, 0, width, height, timeSec, false);
            // Subtle Cel-Shaded Groomed Corduroy & Powder Drift Contours
            const driftOffset = (distCounter * 2.2) % 150;
            for (let sy = -80 + driftOffset; sy < height + 80; sy += 150) {
                ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(0, sy);
                ctx.quadraticCurveTo(width * 0.45, sy + 18, width - 100, sy - 8);
                ctx.stroke();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(0, sy - 3);
                ctx.quadraticCurveTo(width * 0.45, sy + 15, width - 100, sy - 11);
                ctx.stroke();
            }
            // Handle Skier input
            if (!skier.crashed) {
                if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
                    skier.speedX = Math.max(-6, skier.speedX - 0.5);
                    skier.angle = -0.4;
                }
                else if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
                    skier.speedX = Math.min(6, skier.speedX + 0.5);
                    skier.angle = 0.4;
                }
                else {
                    skier.speedX *= 0.92;
                    skier.angle *= 0.8;
                }
                // Tuck for speed (Down) or snowplow brake (Up)
                const wMult = waxMultiplierRef.current || 1.0;
                if (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) {
                    skier.speedY = Math.min(10 * wMult, skier.speedY + 0.15);
                }
                else if (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) {
                    skier.speedY = Math.max(2, skier.speedY - 0.2);
                }
                else {
                    skier.speedY = 5 * wMult;
                }
                skier.x += skier.speedX;
                if (skier.x < 30)
                    skier.x = 30;
                if (skier.x > width - 110)
                    skier.x = width - 110; // Keep inside terrain park run (left of chairlift)
                distCounter += skier.speedY * 0.4;
                setDistance(Math.round(distCounter));
            }
            else {
                // Crash recovery after 2 seconds
                skier.speedX = 0;
                skier.speedY = 0;
            }
            // Air time physics
            if (skier.inAir) {
                skier.airTimer--;
                skier.spin += 0.35;
                if (skier.airTimer <= 0) {
                    skier.inAir = false;
                    setScore(s => s + 250); // Landed trick bonus!
                }
            }
            if (skier.invincibleTimer > 0) {
                skier.invincibleTimer--;
            }
            // Scroll obstacles up relative to skier speed
            const scrollSpeed = skier.speedY;
            for (let i = 0; i < obstaclesRef.current.length; i++) {
                const obs = obstaclesRef.current[i];
                obs.y -= scrollSpeed;
                // Draw obstacle
                drawObstacle(ctx, obs);
                // Collision detection
                if (!obs.hit && !skier.inAir && Math.abs(obs.x - skier.x) < 22 && Math.abs(obs.y - skier.y) < 20) {
                    obs.hit = true;
                    if (obs.type === 'kicker') {
                        skier.inAir = true;
                        skier.airTimer = 38;
                        skier.spin = 0;
                        const bonus = Math.round(250 * (boardRef.current.statsBonus.trickBonus || 1));
                        setScore(s => s + bonus);
                        const cheers = riderRef.current.dialogue.cheers;
                        const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
                        setActiveCheer(randomCheer);
                        setTimeout(() => setActiveCheer(null), 1800);
                    }
                    else if (obs.type === 'rail') {
                        // Frontside boardslide or 50-50 on steel rail
                        skier.inAir = true;
                        skier.airTimer = 32;
                        skier.spin = Math.PI / 2;
                        const bonus = Math.round(350 * (boardRef.current.statsBonus.trickBonus || 1));
                        setScore(s => s + bonus);
                        const railCheers = [
                            'Frontside Boardslide locked on the steel rail! 🛹',
                            'Smooth 50-50 across the down-rail!',
                            'Milosport rail slide approved! ❄️'
                        ];
                        setActiveCheer(railCheers[Math.floor(Math.random() * railCheers.length)]);
                        setTimeout(() => setActiveCheer(null), 1800);
                    }
                    else if (obs.type === 'rainbow') {
                        // Rainbow box jib
                        skier.inAir = true;
                        skier.airTimer = 34;
                        skier.spin = Math.PI;
                        const bonus = Math.round(450 * (boardRef.current.statsBonus.trickBonus || 1));
                        setScore(s => s + bonus);
                        const rainbowCheers = [
                            'Rainbow box bonk! 🌈',
                            'Stomped the Bone Zone rainbow!',
                            'Clean 180 off the rainbow rail arch!'
                        ];
                        setActiveCheer(rainbowCheers[Math.floor(Math.random() * rainbowCheers.length)]);
                        setTimeout(() => setActiveCheer(null), 1800);
                    }
                    else if (obs.type === 'bone_zone_sign') {
                        setScore(s => s + 200);
                        setActiveCheer('☠️ BONE ZONE BRIGHTON! Best rail garden in Utah!');
                        setTimeout(() => setActiveCheer(null), 1800);
                    }
                    else if (obs.type === 'powder') {
                        const powBonus = Math.round(100 * (boardRef.current.statsBonus.powFloat || 1));
                        setScore(s => s + powBonus);
                    }
                    else if (obs.type === 'shrine') {
                        skier.invincibleTimer = 180; // 3 seconds invincibility
                        setScore(s => s + 500);
                    }
                    else if (obs.type === 'tree' || obs.type === 'rock') {
                        if (skier.invincibleTimer <= 0) {
                            skier.crashed = true;
                            setIsWipedOut(true);
                            setTimeout(() => {
                                skier.crashed = false;
                                setIsWipedOut(false);
                            }, 1800);
                        }
                    }
                }
                // Recycle obstacles below view
                if (obs.y < -50) {
                    obstaclesRef.current[i] = generateObstacle(height + Math.random() * 200);
                }
            }
            // Draw Crest 6 Chairlift running along the right side of the terrain park
            drawSlopeChairlift(ctx, width, height, distCounter);
            // YETI CHASE (Triggers past 1,200m)
            if (distCounter > 1200) {
                yeti.active = true;
            }
            if (yeti.active) {
                // Yeti pursues player from top of screen
                yeti.y += (yeti.speed - skier.speedY * 0.7);
                if (yeti.x < skier.x)
                    yeti.x += 1.8;
                if (yeti.x > skier.x)
                    yeti.x -= 1.8;
                setYetiDistance(Math.max(0, Math.round(skier.y - yeti.y)));
                drawYeti(ctx, yeti.x, yeti.y);
                // Yeti catches skier!
                if (Math.abs(yeti.x - skier.x) < 30 && Math.abs(yeti.y - skier.y) < 30) {
                    skier.crashed = true;
                    setIsWipedOut(true);
                }
            }
            // Draw Snowboarder
            drawSnowboarder(ctx, skier.x, skier.y, skier.angle, skier.inAir, skier.spin, skier.crashed, skier.invincibleTimer > 0, boardRef.current, riderRef.current);
            animId = requestAnimationFrame(loop);
        };
        animId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animId);
    }, [viewMode]);
    if (viewMode === 'chairlift') {
        return (_jsx(ChairliftRideView, { selectedBoardId: selectedBoardId || 'forum-destroyer', selectedRiderId: selectedRiderId || 'jp-walker', onDropInFromSummit: () => {
                setViewMode('shredding');
                skierRef.current.x = 480;
                skierRef.current.y = 160;
                skierRef.current.speedY = 5;
                skierRef.current.crashed = false;
            }, onReturnToDrive: onReturnToDrive, onAddScore: (pts) => setScore(s => s + pts) }));
    }
    return (_jsxs("div", { className: "relative w-full h-full min-h-[560px] bg-slate-100 flex flex-col items-center justify-center overflow-hidden select-none", children: [_jsxs("div", { className: "absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none", children: [_jsxs("div", { className: "flex items-center gap-2 pointer-events-auto", children: [_jsxs("button", { onClick: onReturnToDrive, className: "px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-sky-400 border border-slate-700 font-mono text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all", children: [_jsx(ArrowLeft, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Back to Canyon Car" })] }), _jsx("button", { onClick: () => setViewMode('chairlift'), className: "px-3 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-500 font-mono text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all", title: "Ride the Crest 6 Chairlift over Brighton Terrain Park", children: _jsx("span", { children: "\uD83D\uDEA1 Ride Crest Lift" }) })] }), _jsxs("div", { className: "hidden sm:flex items-center gap-2", children: [_jsxs("div", { className: "px-2.5 py-1 rounded-lg border font-mono text-xs font-bold text-white backdrop-blur-sm", style: {
                                    backgroundColor: `${board.accentColor}30`,
                                    borderColor: board.accentColor
                                }, children: ["\uD83C\uDFC2 ", board.name] }), _jsxs("div", { className: "px-2.5 py-1 rounded-lg border font-mono text-xs font-bold text-white backdrop-blur-sm flex items-center gap-1.5", style: {
                                    backgroundColor: `${rider.accentColor}30`,
                                    borderColor: rider.accentColor
                                }, children: [_jsx("span", { children: rider.iconEmoji }), _jsx("span", { children: rider.name })] }), waxSpeedMultiplier > 1 && (_jsxs("div", { className: "px-2 py-1 rounded-lg bg-amber-950/80 border border-amber-500 font-mono text-xs font-bold text-amber-300 backdrop-blur-sm", children: ["\uD83D\uDD25 +", Math.round((waxSpeedMultiplier - 1) * 100), "% Glide"] })), hasPassBonus && (_jsx("div", { className: "px-2 py-1 rounded-lg bg-sky-950/80 border border-sky-500 font-mono text-xs font-bold text-sky-300 backdrop-blur-sm", children: "\uD83C\uDFAB Milo Pass" })), _jsxs("div", { className: "hidden lg:flex px-2.5 py-1 rounded-lg bg-indigo-950/85 border border-indigo-400/60 font-mono text-xs text-indigo-200 items-center gap-1.5 backdrop-blur-sm", children: [_jsx(Sparkles, { className: "w-3 h-3 text-amber-300" }), _jsx("span", { children: getSnowShaderBackendLabel() })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 font-mono text-xs text-white backdrop-blur-sm", children: ["DISTANCE: ", _jsxs("span", { className: "text-cyan-400 font-bold", children: [distance, "M"] })] }), _jsxs("div", { className: "px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 font-mono text-xs text-white backdrop-blur-sm flex items-center gap-1.5", children: [_jsx(Trophy, { className: "w-3.5 h-3.5 text-amber-400" }), _jsxs("span", { children: ["SCORE: ", _jsx("span", { className: "text-amber-400 font-bold", children: score })] })] })] })] }), activeCheer && (_jsxs("div", { className: "absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-slate-950/90 border border-emerald-400 text-emerald-300 font-mono text-xs flex items-center gap-2 shadow-glow-ice animate-bounce", children: [_jsx(Sparkles, { className: "w-4 h-4 text-emerald-400" }), _jsxs("span", { children: [rider.name, ": \"", activeCheer, "\""] })] })), yetiRef.current.active && (_jsxs("div", { className: "absolute top-16 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600 text-rose-300 font-mono text-xs animate-pulse", children: ["\u26A0\uFE0F WASATCH YETI PURSUIT \u2022 ", yetiDistance, "M BEHIND!"] })), isWipedOut && (_jsxs("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-6 py-3 rounded-2xl bg-slate-950/90 border border-rose-500 text-white font-mono text-center space-y-1 shadow-2xl animate-bounce", children: [_jsx("div", { className: "text-rose-400 font-bold text-lg", children: "YARD SALE! WIPEOUT! \uD83D\uDCA5" }), _jsx("div", { className: "text-xs text-slate-400", children: "Dusting off fresh Brighton powder..." })] })), _jsx("canvas", { ref: canvasRef, width: 960, height: 640, className: "w-full h-full object-cover max-w-full max-h-full border border-slate-300 shadow-xl" }), _jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-[11px] font-mono text-slate-500 bg-white/70 px-3 py-1 rounded-full backdrop-blur-xs", children: "Steer: \u2190 \u2192 / A-D \u2022 Tuck Speed: \u2193 / S \u2022 Brake: \u2191 / W \u2022 Launch kickers for trick bonus!" })] }));
};
function drawObstacle(ctx, obs) {
    const timeSec = Date.now() * 0.001;
    if (obs.type === 'tree') {
        drawCelShadedPineTree(ctx, obs.x, obs.y, 1.0, timeSec);
        return;
    }
    if (obs.type === 'rock') {
        drawCelShadedQuartziteRock(ctx, obs.x, obs.y);
        return;
    }
    if (obs.type === 'kicker') {
        drawCelShadedParkKicker(ctx, obs.x, obs.y, 1.0);
        return;
    }
    if (obs.type === 'rail') {
        drawCelShadedParkRail(ctx, obs.x, obs.y);
        return;
    }
    if (obs.type === 'rainbow') {
        drawCelShadedRainbowBox(ctx, obs.x, obs.y, 1.0);
        return;
    }
    if (obs.type === 'powder') {
        drawCelShadedPowderPillow(ctx, obs.x, obs.y);
        return;
    }
    if (obs.type === 'shrine') {
        drawCelShadedSnowShrine(ctx, obs.x, obs.y);
        return;
    }
    ctx.save();
    ctx.translate(obs.x, obs.y);
    if (obs.type === 'bone_zone_sign') {
        // Cel-Shaded Bone Zone Signpost with Snow Cap
        ctx.fillStyle = '#78350f';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.6;
        ctx.fillRect(-2.5, 4, 5, 13);
        ctx.strokeRect(-2.5, 4, 5, 13);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(-20, -15, 40, 20, 4);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BONE ZONE', 0, -5);
        ctx.fillStyle = '#f87171';
        ctx.fillText('☠️ PARK', 0, 2);
    }
    ctx.restore();
}
function drawSnowboarder(ctx, x, y, angle, inAir, spin, crashed, invincible, board, rider) {
    ctx.save();
    ctx.translate(x, y);
    if (crashed) {
        // Tumbled snowboarder in deep Brighton powder!
        ctx.fillStyle = rider.accentColor;
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Loose snowboard tossed into snowbank
        ctx.save();
        ctx.rotate(0.65);
        ctx.beginPath();
        ctx.roundRect(-7, -20, 14, 40, 5);
        ctx.fillStyle = board.accentColor;
        ctx.fill();
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
        // Snow spray particles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.arc((Math.random() - 0.5) * 24, (Math.random() - 0.5) * 24, 2 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        return;
    }
    const isGoofy = rider.stance === 'Goofy';
    if (inAir) {
        ctx.rotate(spin);
        ctx.scale(1.35, 1.35);
    }
    else {
        ctx.rotate(angle);
    }
    // Cel-Shaded Powder Rooster-Tail Spray Plume Behind Board
    const plumeGrad = ctx.createLinearGradient(0, -14, 0, -40);
    plumeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    plumeGrad.addColorStop(0.6, 'rgba(224, 242, 254, 0.65)');
    plumeGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');
    ctx.fillStyle = plumeGrad;
    ctx.beginPath();
    ctx.moveTo(-6, -15);
    ctx.lineTo(-17, -40);
    ctx.lineTo(17, -40);
    ctx.lineTo(6, -15);
    ctx.closePath();
    ctx.fill();
    // Invincibility aura
    if (invincible) {
        ctx.beginPath();
        ctx.arc(0, 0, 23, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.8;
        ctx.stroke();
    }
    // 1. CEL-SHADED SNOWBOARD WITH GLOSSY TOPSHEET GRADIENT & INK OUTLINE
    ctx.save();
    const deckGrad = ctx.createLinearGradient(-7, -20, 7, 20);
    deckGrad.addColorStop(0, '#ffffff');
    deckGrad.addColorStop(0.3, board.accentColor);
    deckGrad.addColorStop(1, board.topGraphicColor);
    ctx.beginPath();
    ctx.roundRect(-7.5, -20, 15, 40, 5.5);
    ctx.fillStyle = deckGrad;
    ctx.fill();
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    // Top sheet center graphics stripe
    ctx.fillStyle = board.topGraphicColor;
    ctx.fillRect(-4, -12, 8, 24);
    // Bindings (sideways stance)
    ctx.fillStyle = '#0f172a';
    ctx.save();
    ctx.translate(0, -9);
    ctx.rotate(isGoofy ? 0.25 : -0.25);
    ctx.fillRect(-5, -3, 10, 6);
    ctx.restore();
    ctx.save();
    ctx.translate(0, 9);
    ctx.rotate(isGoofy ? -0.25 : 0.25);
    ctx.fillRect(-5, -3, 10, 6);
    ctx.restore();
    ctx.restore();
    // 2. SNOWBOARDER PANTS & CEL-SHADED PUFFER JACKET
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-4.5, -7, 9, 14);
    ctx.fillStyle = rider.accentColor;
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, -2, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // 3. BEANIE & IRIDESCENT CHROME GOGGLES
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -6, 5.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    const gogGrad = ctx.createLinearGradient(-4, -6, 4, -3);
    gogGrad.addColorStop(0, '#fde047');
    gogGrad.addColorStop(0.5, '#f97316');
    gogGrad.addColorStop(1, '#ec4899');
    ctx.fillStyle = gogGrad;
    ctx.fillRect(-4.5, -6.5, 9, 3.5);
    // 4. ARMS & TRICK GRAB ANIMATION
    ctx.strokeStyle = rider.accentColor;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    if (inAir) {
        ctx.moveTo(-4, -2);
        ctx.lineTo(-8, 8);
        ctx.moveTo(4, -2);
        ctx.lineTo(8, -8);
    }
    else {
        ctx.moveTo(-5, -2);
        ctx.lineTo(-11, 4);
        ctx.moveTo(5, -2);
        ctx.lineTo(11, 4);
    }
    ctx.stroke();
    ctx.restore();
}
function drawYeti(ctx, x, y) {
    drawCelShadedYeti(ctx, x, y, Date.now() * 0.001);
}
function drawSlopeChairlift(ctx, width, height, distCounter) {
    const liftX = width - 65;
    ctx.save();
    // Terrain park boundary rope line separating run from chairlift tower corridor
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(liftX - 35, 0);
    ctx.lineTo(liftX - 35, height);
    ctx.stroke();
    ctx.setLineDash([]);
    // Lift haul cable line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(liftX, 0);
    ctx.lineTo(liftX, height);
    ctx.stroke();
    // Lift Towers along the right ridge
    const towerSpacing = 280;
    const towerOffset = (distCounter * 0.9) % towerSpacing;
    for (let ty = -120 + towerOffset; ty < height + 120; ty += towerSpacing) {
        // Ground snow mound & shadow
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.beginPath();
        ctx.ellipse(liftX, ty + 20, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tubular steel tower mast
        ctx.fillStyle = '#64748b';
        ctx.fillRect(liftX - 4, ty - 24, 8, 44);
        // Steel crossarm
        ctx.fillStyle = '#334155';
        ctx.fillRect(liftX - 22, ty - 24, 44, 6);
        // Sheave wheel trains
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(liftX - 16, ty - 21, 4, 0, Math.PI * 2);
        ctx.arc(liftX + 16, ty - 21, 4, 0, Math.PI * 2);
        ctx.fill();
        // Yellow tower number sign
        ctx.fillStyle = '#facc15';
        ctx.fillRect(liftX - 6, ty - 8, 12, 10);
        ctx.fillStyle = '#020617';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('5', liftX, ty);
    }
    // Moving Quad Chairs ascending up the mountain
    // Because skier goes down, chairs move upward at higher relative rate
    const chairSpacing = 160;
    const chairOffset = (distCounter * 1.6) % chairSpacing;
    for (let cy = height + 60 - chairOffset; cy > -100; cy -= chairSpacing) {
        // Grip & Hanger Arm
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(liftX, cy);
        ctx.lineTo(liftX - 8, cy + 18);
        ctx.lineTo(liftX - 8, cy + 24);
        ctx.stroke();
        // 4-Person Chair Bench (Brighton Crest Blue)
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(liftX - 20, cy + 24, 24, 4);
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(liftX - 20, cy + 18, 24, 6);
        // 3 or 4 riders on the chair with colorful beanies
        const riderColors = ['#f43f5e', '#10b981', '#a855f7', '#f59e0b'];
        for (let r = 0; r < 3; r++) {
            ctx.fillStyle = riderColors[(Math.floor(cy * 0.1) + r) % riderColors.length];
            ctx.beginPath();
            ctx.arc(liftX - 16 + r * 7, cy + 16, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        // Snowboards dangling underneath
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(liftX - 18, cy + 28, 4, 11);
        ctx.fillRect(liftX - 9, cy + 28, 4, 11);
    }
    ctx.restore();
}
