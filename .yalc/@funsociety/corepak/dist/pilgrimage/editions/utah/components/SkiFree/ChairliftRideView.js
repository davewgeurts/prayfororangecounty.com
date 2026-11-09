import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { SNOWBOARDS_LIST, RIDERS_LIST } from '../../data/snowboardGear';
import { Sparkles, Volume2, Mountain, ArrowRight, Flame, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { drawGpuAlpinePowderAndAlpenglow, drawCelShadedPineTree, drawCelShadedParkKicker, drawCelShadedParkRail, drawCelShadedRainbowBox } from '../../utils/snowShaderEngine';
export const ChairliftRideView = ({ selectedBoardId, selectedRiderId, onDropInFromSummit, onReturnToDrive, onAddScore }) => {
    const board = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0];
    const rider = RIDERS_LIST.find(r => r.id === selectedRiderId) || RIDERS_LIST[0];
    const canvasRef = useRef(null);
    const [elevation, setElevation] = useState(7950);
    const [liftProgress, setLiftProgress] = useState(10); // 0 to 100%
    const [shoutText, setShoutText] = useState(null);
    const [activeCheerResponse, setActiveCheerResponse] = useState(null);
    // Passenger chairlift comments
    const getChairliftComment = () => {
        switch (rider.id) {
            case 'jp-walker':
                return "Look at that down-flat-down steel rail below us... We filmed legendary video parts right on that feature in the late 90s.";
            case 'jeremy-jones':
                return "Terrain park is looking heavy today! But soon as we hit the summit, we're hiking Great Western for fresh lines.";
            case 'peter-line':
                return "Milosport crew shaped this park with pure love. Look at that rainbow rail transition!";
            case 'scott-stevens':
                return "I see a tree bonk, two snowbanks, and a culvert pipe below! I'm doing a one-footer off that lip!";
            case 'chris-grenier':
                return "THE BOMB HOLE PARK LAP! Yewww! That kid below just stomped a cab 540 on the third booter!";
            case 'shaun-white':
                return "Good transition on the big jump below. You can get 15 feet of air if you carry your speed.";
            case 'danny-davis':
                return "Nothing better than riding the chair with fresh snow in the pines and soul turns ahead.";
            case 'eddie-wall':
                return "I used to ride this Crest chair 15 times a day when I was a night-park ranger here.";
            case 'zeb-powell':
                return "Watch me knuckle-press that whole landing when we drop in!";
            case 'milo-groms':
                return "Tanner look at that massive booter! We gotta hit the rainbow box on the way down!";
            case 'bone-zone-kip':
                return "Bone Zone Brighton! Best rail garden in North America right beneath our boots!";
            default:
                return "Chairlift view of Brighton park is unmatched. Ready to drop in!";
        }
    };
    // Simulated park riders throwing tricks below
    const parkRidersRef = useRef([
        { id: 1, x: 260, y: 320, trick: 'Frontside Boardslide', boardColor: '#a855f7', jacketColor: '#ec4899', feature: 'rail', state: 'on_feature', timer: 0 },
        { id: 2, x: 440, y: 180, trick: 'Method Air 12ft High', boardColor: '#38bdf8', jacketColor: '#10b981', feature: 'kicker', state: 'on_feature', timer: 15 },
        { id: 3, x: 620, y: 410, trick: 'Rainbow 50-50 to Fakie', boardColor: '#facc15', jacketColor: '#f97316', feature: 'rainbow', state: 'approaching', timer: 30 }
    ]);
    // Handle calling down to park riders
    const handleShoutDown = () => {
        const shouts = ['YEWWWWWWW!', 'STOMP IT, KID!', 'SEND IT TO THE FLATS!', 'MILOSPORT APPROVED!'];
        const picked = shouts[Math.floor(Math.random() * shouts.length)];
        setShoutText(picked);
        onAddScore(100);
        try {
            confetti({
                particleCount: 30,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#38bdf8', '#a855f7', '#facc15', '#ffffff']
            });
        }
        catch {
            // Confetti fallback
        }
        const responses = [
            'Grom below yells back: "YEAH BUDDY!"',
            'Park shredder below throws a shaka! 🤙',
            'Milo bench tech below taps his board tail!',
            'Crowd at the jump lip cheers! ❄️'
        ];
        const resp = responses[Math.floor(Math.random() * responses.length)];
        setActiveCheerResponse(resp);
        setTimeout(() => {
            setShoutText(null);
            setActiveCheerResponse(null);
        }, 2500);
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let animId;
        let worldY = 0;
        const render = () => {
            const width = canvas.width;
            const height = canvas.height;
            // Ascent speed
            worldY += 1.8;
            const progress = Math.min(100, Math.floor((worldY / 1800) * 100));
            setLiftProgress(progress);
            setElevation(Math.round(7950 + (progress / 100) * 1550));
            // If at summit, offer drop in
            if (progress >= 100) {
                // At top terminal!
            }
            // 1. SNOW BACKGROUND (Canyon slope below + WebGPU / WebGL2 Alpine Powder Shader)
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, '#dbeafe');
            grad.addColorStop(0.5, '#f8fafc');
            grad.addColorStop(1, '#e0f2fe');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
            const timeSec = performance.now() / 1000;
            drawGpuAlpinePowderAndAlpenglow(ctx, 0, 0, width, height, timeSec, false);
            // Pine trees along park boundaries (scrolling down beneath lift)
            const treeOffset = (worldY * 0.8) % 180;
            for (let y = -100 + treeOffset; y < height + 100; y += 140) {
                // Left tree line
                drawParkPine(ctx, 60 + Math.sin(y * 0.05) * 20, y, 22);
                drawParkPine(ctx, 110 + Math.cos(y * 0.05) * 15, y + 40, 18);
                // Right tree line
                drawParkPine(ctx, width - 80 + Math.sin(y * 0.03) * 20, y, 24);
                drawParkPine(ctx, width - 130 + Math.cos(y * 0.04) * 15, y + 60, 20);
            }
            // 2. TERRAIN PARK FEATURES BELOW (Beneath the chair)
            drawTerrainParkBelow(ctx, width, height, worldY, parkRidersRef.current);
            // 3. CHAIRLIFT STEEL TOWER (passes by periodically)
            const towerY = ((worldY * 1.2) % 650) - 150;
            drawLiftTower(ctx, width / 2, towerY);
            // 4. OPPOSITE DOWN-BOUND CHAIR (Going down on parallel cable)
            const downChairY = ((height - (worldY * 1.5) % (height + 200)));
            drawDownhillChair(ctx, width / 2 - 140, downChairY);
            // 5. CHAIRLIFT HAUL CABLES OVERHEAD
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 3;
            ctx.beginPath();
            // Uphill cable (above our chair)
            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width / 2, height);
            // Downhill cable (parallel on left)
            ctx.moveTo(width / 2 - 140, 0);
            ctx.lineTo(width / 2 - 140, height);
            ctx.stroke();
            // 6. OUR CHAIRLIFT CHAIR & PASSENGERS (Top-down / 3D perspective foreground)
            drawOurChairlift(ctx, width / 2, height * 0.68, board, rider);
            animId = requestAnimationFrame(render);
        };
        animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [board, rider]);
    return (_jsxs("div", { className: "relative w-full h-full min-h-[580px] bg-slate-900 flex flex-col font-mono select-none overflow-hidden", children: [_jsxs("header", { className: "z-20 bg-slate-950/85 border-b border-sky-900/60 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0 max-w-full", children: [_jsxs("button", { onClick: onReturnToDrive, className: "px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 flex items-center gap-1 shrink-0 cursor-pointer transition-colors", children: [_jsx(ArrowLeft, { className: "w-3.5 h-3.5" }), _jsxs("span", { children: ["Back", _jsx("span", { className: "hidden sm:inline", children: " to Car" })] })] }), _jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("span", { className: "w-2.5 h-2.5 shrink-0 rounded-full bg-emerald-400 animate-ping" }), _jsxs("span", { className: "font-bold text-white text-sm truncate", children: ["CREST 6", _jsx("span", { className: "hidden sm:inline", children: " \u2022 BRIGHTON RESORT" })] }), _jsx("span", { className: "hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-sky-950 border border-sky-600 text-sky-300 font-bold", children: "HIGH-SPEED QUAD" })] })] }), _jsxs("div", { className: "flex items-center gap-4 text-slate-300", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Mountain, { className: "w-3.5 h-3.5 text-amber-400" }), _jsxs("span", { children: ["ELEV: ", _jsxs("strong", { className: "text-amber-400 font-bold", children: [elevation.toLocaleString(), " FT"] })] })] }), _jsx("div", { className: "flex items-center gap-1.5", children: _jsxs("span", { children: ["ASCENT: ", _jsxs("strong", { className: "text-cyan-400 font-bold", children: [liftProgress, "%"] })] }) })] }), _jsxs("div", { className: "grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto max-sm:*:justify-center max-sm:*:py-2.5", children: [_jsxs("button", { onClick: handleShoutDown, className: "px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all transform hover:scale-[1.02]", title: "Yell down at park shredders", children: [_jsx(Volume2, { className: "w-3.5 h-3.5 text-amber-400" }), _jsxs("span", { children: ["YELL DOWN", _jsx("span", { className: "hidden sm:inline", children: " TO PARK" })] })] }), _jsxs("button", { onClick: onDropInFromSummit, className: "px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow-glow-ice transition-all transform hover:scale-[1.02]", children: [_jsxs("span", { children: ["DROP IN", _jsx("span", { className: "hidden sm:inline", children: " FROM SUMMIT" })] }), _jsx(ArrowRight, { className: "w-3.5 h-3.5 stroke-[3]" })] })] })] }), _jsxs("main", { className: "relative flex-1 w-full h-full flex items-center justify-center overflow-hidden", children: [_jsx("canvas", { ref: canvasRef, width: 960, height: 600, className: "w-full h-full object-cover max-w-full max-h-full shadow-2xl" }), _jsxs("div", { className: "absolute top-4 right-4 z-20 max-w-md bg-slate-950/90 border border-slate-700 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2 text-emerald-400 font-bold", children: [_jsx("span", { children: rider.iconEmoji }), _jsxs("span", { children: [rider.name, " on the Chairlift:"] })] }), _jsxs("p", { className: "text-slate-200 italic leading-relaxed", children: ["\"", getChairliftComment(), "\""] })] }), shoutText && (_jsxs("div", { className: "absolute top-20 left-1/2 -translate-x-1/2 z-30 px-6 py-2.5 rounded-full bg-amber-950/95 border-2 border-amber-400 text-amber-300 font-black text-sm shadow-2xl animate-bounce flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-4 h-4 text-amber-400" }), _jsxs("span", { children: ["YOU YELL DOWN: \"", shoutText, "\""] })] })), activeCheerResponse && (_jsxs("div", { className: "absolute top-32 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-2xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-mono text-xs shadow-glow-ice animate-fadeIn", children: [activeCheerResponse, " (+100 Pts)"] })), liftProgress >= 90 && (_jsxs("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-6 py-3 rounded-2xl bg-slate-950/90 border-2 border-cyan-400 text-white font-mono text-center space-y-2 shadow-2xl animate-pulse", children: [_jsxs("div", { className: "text-cyan-300 font-black text-sm flex items-center justify-center gap-2", children: [_jsx(Flame, { className: "w-4 h-4 text-cyan-400" }), _jsx("span", { children: "APPROACHING CREST SUMMIT UNLOAD TERMINAL (9,500 FT)" })] }), _jsx("button", { onClick: onDropInFromSummit, className: "px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-glow-ice transition-all", children: "STAND UP, UNLOAD & DROP INTO PARK! \uD83C\uDFC2" })] })), _jsxs("div", { className: "absolute bottom-3 left-4 z-20 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400", children: ["Flying over: ", _jsx("strong", { children: "Milosport Bone Zone & Brighton Main Park" })] })] })] }));
};
function drawParkPine(ctx, x, y, size) {
    drawCelShadedPineTree(ctx, x, y, size / 24, Math.floor(x + y));
}
function drawTerrainParkBelow(ctx, width, height, worldY, riders) {
    ctx.save();
    // Park features repeat down the slope
    const parkRepeat = 800;
    const parkY = (worldY % parkRepeat);
    // 1. "MILOSPORT BONE ZONE" LOGO BANNER OVER SNOW
    const signY = parkY - 200;
    if (signY > -100 && signY < height + 100) {
        ctx.save();
        ctx.translate(width / 2, signY);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(-144, -18, 288, 36, 8);
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡ MILOSPORT BONE ZONE PARK ⚡', 0, 0);
        ctx.restore();
    }
    // 2. DOWN-FLAT-DOWN STEEL STREET RAIL (Left side of park)
    const railY = parkY + 120;
    if (railY > -150 && railY < height + 150) {
        drawCelShadedParkRail(ctx, width / 2 - 100, railY, 1.05);
    }
    // 3. RAINBOW JIB BOX (Right side of park)
    const rainbowY = parkY + 360;
    if (rainbowY > -150 && rainbowY < height + 150) {
        drawCelShadedRainbowBox(ctx, width / 2 + 110, rainbowY, 1.05);
    }
    // 4. PROGRESSION BIG KICKER BOOTER (Center of park)
    const booterY = parkY + 540;
    if (booterY > -150 && booterY < height + 150) {
        drawCelShadedParkKicker(ctx, width / 2, booterY, 1.15);
    }
    // 5. ANIMATED PARK RIDERS SHREDDING BELOW
    for (const pr of riders) {
        drawMiniParkRider(ctx, pr, worldY);
    }
    ctx.restore();
}
function drawMiniParkRider(ctx, pr, worldY) {
    ctx.save();
    const screenY = (pr.y + worldY * 0.9) % 650;
    ctx.translate(pr.x, screenY);
    // Snowboard shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.arc(2, 4, 9, 0, Math.PI * 2);
    ctx.fill();
    // Snowboard deck (cel-shaded)
    ctx.save();
    ctx.rotate(0.3);
    ctx.beginPath();
    ctx.roundRect(-4.5, -13, 9, 26, 4);
    ctx.fillStyle = pr.boardColor;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();
    // Rider jacket & helmet
    ctx.fillStyle = pr.jacketColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(0, -3, 3.8, 0, Math.PI * 2);
    ctx.fill();
    // Speech bubble trick label
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(-36, -25, 72, 15, 4);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(pr.trick.split(' ')[0] + '!', 0, -14);
    ctx.restore();
}
function drawLiftTower(ctx, x, y) {
    if (y < -80 || y > 700)
        return;
    ctx.save();
    ctx.translate(x, y);
    // Tower shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.arc(15, 20, 26, 0, Math.PI * 2);
    ctx.fill();
    // Steel lattice crossarm (cel-shaded metallic gradient)
    const crossGrad = ctx.createLinearGradient(0, -10, 0, 10);
    crossGrad.addColorStop(0, '#64748b');
    crossGrad.addColorStop(0.5, '#475569');
    crossGrad.addColorStop(1, '#334155');
    ctx.fillStyle = crossGrad;
    ctx.beginPath();
    ctx.roundRect(-170, -10, 340, 20, 4);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.4;
    ctx.stroke();
    // Center tubular column
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Sheave assembly (spinning wheels where cable rides)
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.arc(-140, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    // Tower number sign
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-12, -8, 24, 16);
    ctx.strokeRect(-12, -8, 24, 16);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('T-12', 0, 4);
    ctx.restore();
}
function drawDownhillChair(ctx, x, y) {
    if (y < -80 || y > 700)
        return;
    ctx.save();
    ctx.translate(x, y);
    // Downhill empty chair shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
    ctx.beginPath();
    ctx.roundRect(-25, 15, 50, 20, 4);
    ctx.fill();
    // Quad chair frame
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 25);
    ctx.stroke();
    // Green bench seat
    const seatGrad = ctx.createLinearGradient(0, 20, 0, 38);
    seatGrad.addColorStop(0, '#22c55e');
    seatGrad.addColorStop(1, '#15803d');
    ctx.fillStyle = seatGrad;
    ctx.beginPath();
    ctx.roundRect(-30, 20, 60, 18, 4);
    ctx.fill();
    ctx.strokeStyle = '#022c22';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}
function drawOurChairlift(ctx, x, y, board, rider) {
    ctx.save();
    ctx.translate(x, y);
    // 1. CHAIR SHADOW ON SNOW BELOW
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.roundRect(-90, 80, 180, 50, 10);
    ctx.fill();
    // 2. OVERHEAD CABLE GRIP & STEEL HANGER ARM
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, -180);
    ctx.lineTo(0, -60);
    ctx.stroke();
    // Steel pivot joint
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, -60, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // 3. CHAIRLIFT BENCH SEAT (BRIGHTON EMERALD GREEN, CEL-SHADED)
    const benchGrad = ctx.createLinearGradient(-85, -20, 85, 25);
    benchGrad.addColorStop(0, '#10b981');
    benchGrad.addColorStop(0.45, '#059669');
    benchGrad.addColorStop(1, '#065f46');
    ctx.fillStyle = benchGrad;
    ctx.beginPath();
    ctx.roundRect(-85, -20, 170, 45, 8);
    ctx.fill();
    ctx.strokeStyle = '#022c22';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Specular rim on top of bench backrest
    ctx.strokeStyle = 'rgba(167, 243, 208, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-76, -16);
    ctx.lineTo(76, -16);
    ctx.stroke();
    // Safety bar down (with padded lap rest)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-82, 10);
    ctx.lineTo(82, 10);
    ctx.stroke();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-82, 10);
    ctx.lineTo(82, 10);
    ctx.stroke();
    // 4. PLAYER RIDER (Driver side / Left seat)
    const pGrad = ctx.createRadialGradient(-39, -14, 2, -35, -10, 16);
    pGrad.addColorStop(0, '#38bdf8');
    pGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = pGrad;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(-35, -10, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Beanie & iridescent goggles
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-35, -20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-42, -22, 14, 5);
    // 5. PRO BUDDY RIDER (Passenger side / Right seat)
    ctx.fillStyle = rider.accentColor;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(35, -10, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = rider.avatarColor;
    ctx.beginPath();
    ctx.arc(35, -20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // 6. DANGLING SNOWBOARDS BELOW CHAIR
    // Player's selected board
    ctx.save();
    ctx.translate(-35, 60);
    ctx.rotate(0.12);
    ctx.beginPath();
    ctx.roundRect(-8, -42, 16, 84, 5);
    ctx.fillStyle = board.accentColor;
    ctx.fill();
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    // Bindings
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -20, 12, 8);
    ctx.fillRect(-6, 12, 12, 8);
    ctx.restore();
    // Pro buddy's board
    const buddyBoard = SNOWBOARDS_LIST.find(b => b.id === rider.defaultBoardId) || SNOWBOARDS_LIST[1];
    ctx.save();
    ctx.translate(35, 60);
    ctx.rotate(-0.08);
    ctx.beginPath();
    ctx.roundRect(-8, -42, 16, 84, 5);
    ctx.fillStyle = buddyBoard.accentColor;
    ctx.fill();
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    // Bindings
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -20, 12, 8);
    ctx.fillRect(-6, 12, 12, 8);
    ctx.restore();
    ctx.restore();
}
