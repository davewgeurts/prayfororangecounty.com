import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Trophy, Sparkles, Waves, Eye, HeartHandshake, Zap } from 'lucide-react';
import { SNOWBOARDS_LIST, RIDERS_LIST } from '../../data/snowboardGear';
import { SURF_SPOTS } from '../../types/game';
import { ChairliftRideView } from './ChairliftRideView';
import { useOceanBuoyFeed } from '../../utils/oceanBuoyFeed';
import { drawGpuOceanCausticsAndSunbeams, getShaderBackendLabel, drawFoamLaceStrip, drawCelShadedDolphin, drawCelShadedSeaTurtle, drawCelShadedPelican, drawCelShadedLifeguardTower, drawCelShadedUmbrellaAndSunbather } from '../../utils/oceanShaderEngine';
import confetti from 'canvas-confetti';
const LOCAL_QUOTES = [
    'RESPECT THE PRIORITY!',
    '2% CREW LINEUP!',
    'GO! THIS SET IS FIRING!',
    'GOT ANY TACO STAND?!',
    'DEEP IN THE GREEN ROOM!',
    'LOCALS ONLY ON THE PEAK!'
];
export const BrightonSkiFree = ({ onReturnToDrive, selectedBoardId, selectedRiderId, selectedSpotId = 'trestles_wsl', onSelectSpot, waxSpeedMultiplier = 1.0, purchasedPassIds = [] }) => {
    const board = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0];
    const rider = RIDERS_LIST.find(r => r.id === selectedRiderId) || RIDERS_LIST[0];
    const activeSpot = SURF_SPOTS.find(s => s.id === selectedSpotId) || SURF_SPOTS[2];
    const buoy = useOceanBuoyFeed();
    const [viewMode, setViewMode] = useState('chairlift');
    const [rideModeOverride, setRideModeOverride] = useState(null);
    const effectiveCraftType = rideModeOverride || board.craftType || 'surfboard';
    const boardRef = useRef(board);
    const riderRef = useRef(rider);
    const craftTypeRef = useRef(effectiveCraftType);
    const spotRef = useRef(activeSpot);
    const waxMultiplierRef = useRef(waxSpeedMultiplier);
    const buoyScaleRef = useRef(buoy.waveScaleMultiplier);
    useEffect(() => {
        boardRef.current = board;
        riderRef.current = rider;
        craftTypeRef.current = effectiveCraftType;
        spotRef.current = activeSpot;
        waxMultiplierRef.current = waxSpeedMultiplier;
        buoyScaleRef.current = buoy.waveScaleMultiplier;
    }, [board, rider, effectiveCraftType, activeSpot, waxSpeedMultiplier, buoy.waveScaleMultiplier]);
    const canvasRef = useRef(null);
    const hasPassBonus = purchasedPassIds.includes('brighton-day') || purchasedPassIds.includes('wasatch-dual-gold');
    const [score, setScore] = useState(hasPassBonus ? 500 : 0);
    const [distance, setDistance] = useState(0);
    const [isWipedOut, setIsWipedOut] = useState(false);
    const [yetiDistance, setYetiDistance] = useState(999);
    const [activeCheer, setActiveCheer] = useState(null);
    // WSL Finals Head-to-Head Heat State
    const rivalName = rider.name.includes('Griffin') ? 'Filipe Toledo' : 'Griffin Colapinto';
    const [rivalTwoWaveTotal] = useState(17.15);
    const [topWaves, setTopWaves] = useState([8.65, 8.20]);
    const lastWaveJudgeScore = topWaves[0] || 8.65;
    const bestTwoWaveTotal = +((topWaves[0] || 0) + (topWaves[1] || 0)).toFixed(2);
    const [hasPriority, setHasPriority] = useState(true);
    const [wslChampCrowned, setWslChampCrowned] = useState(false);
    const [showPodiumModal, setShowPodiumModal] = useState(false);
    // Green Room Tube Meter & Local Respect Meter
    const [inBarrel, setInBarrel] = useState(false);
    const [greenRoomMeter, setGreenRoomMeter] = useState(20);
    const [localRespect, setLocalRespect] = useState(hasPassBonus ? 88 : 72);
    const localRespectRef = useRef(localRespect);
    useEffect(() => {
        localRespectRef.current = localRespect;
    }, [localRespect]);
    const recordWaveScore = useCallback((waveScore) => {
        setTopWaves(prev => {
            const next = [waveScore, ...prev].sort((a, b) => b - a).slice(0, 2);
            const total = +((next[0] || 0) + (next[1] || 0)).toFixed(2);
            if (total >= 17.5 && !wslChampCrowned) {
                setWslChampCrowned(true);
                setShowPodiumModal(true);
                try {
                    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
                }
                catch {
                    // ignore confetti errors in headless mode
                }
            }
            return next;
        });
    }, [wslChampCrowned]);
    // Throw Shaka / Share Taco Stand with Locals (`G` key or HUD button)
    const handleThrowShakaToLocals = useCallback(() => {
        setLocalRespect(r => Math.min(100, r + 18));
        setHasPriority(true);
        setScore(s => s + 250);
        setActiveCheer('🤙 Threw a Shaka & shared Taco Stand Al Pastor with the locals! +18% Respect & Lineup Priority!');
        setTimeout(() => setActiveCheer(null), 2000);
    }, []);
    // Jet-Ski Tow-Back to Peak (`J` key or HUD button)
    const handleJetSkiTowBack = useCallback(() => {
        skierRef.current.x = 420;
        skierRef.current.y = 165;
        skierRef.current.invincibleTimer = 150;
        yetiRef.current.y = -260;
        setHasPriority(true);
        setScore(s => s + 150);
        setActiveCheer('🚤 WSL Jet-Ski Assist towed you straight back to the A-Frame Peak with Priority!');
        setTimeout(() => setActiveCheer(null), 2000);
    }, []);
    const skierRef = useRef({
        x: 420,
        y: 170,
        speedX: 0,
        speedY: 4.5,
        angle: 0,
        inAir: false,
        airTimer: 0,
        barrelTimer: 0,
        spin: 0,
        crashed: false,
        invincibleTimer: 0
    });
    const obstaclesRef = useRef([]);
    const yetiRef = useRef({
        active: false,
        x: 420,
        y: -200,
        speed: 7.2
    });
    const keysRef = useRef({});
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.key] = true;
            if (e.key === 'g' || e.key === 'G') {
                handleThrowShakaToLocals();
            }
            else if (e.key === 'j' || e.key === 'J') {
                handleJetSkiTowBack();
            }
        };
        const handleKeyUp = (e) => {
            keysRef.current[e.key] = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        const initialObs = [];
        for (let y = 300; y < 3000; y += 85) {
            initialObs.push(generateObstacle(y));
        }
        obstaclesRef.current = initialObs;
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleThrowShakaToLocals, handleJetSkiTowBack]);
    function generateObstacle(y) {
        const rand = Math.random();
        let type = 'local_surfer';
        if (rand < 0.20)
            type = 'local_surfer';
        else if (rand < 0.33)
            type = 'kelp_rock';
        else if (rand < 0.48)
            type = 'wave_lip';
        else if (rand < 0.64)
            type = 'barrel_tube';
        else if (rand < 0.78)
            type = 'peeling_wall';
        else if (rand < 0.85)
            type = 'dolphin';
        else if (rand < 0.91)
            type = 'sea_turtle';
        else if (rand < 0.96)
            type = 'pelican_flock';
        else
            type = 'seashell_reef';
        return {
            x: 55 + Math.random() * 650,
            y,
            type,
            width: type === 'peeling_wall' ? 110 : type === 'barrel_tube' ? 54 : type === 'wave_lip' ? 42 : 28,
            height: type === 'peeling_wall' ? 32 : type === 'barrel_tube' ? 28 : 24,
            hit: false,
            localQuote: LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)],
            peelDirection: Math.random() > 0.5 ? 'right' : 'left'
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
            // 1. MULTI-STOP DEEP PACIFIC TO TURQUOISE REEF OCEAN GRADIENT
            const oceanGrad = ctx.createLinearGradient(0, 0, width - 135, 0);
            oceanGrad.addColorStop(0, '#082f49');
            oceanGrad.addColorStop(0.28, '#0369a1');
            oceanGrad.addColorStop(0.62, '#0891b2');
            oceanGrad.addColorStop(0.88, '#06b6d4');
            oceanGrad.addColorStop(1, '#67e8f9');
            ctx.fillStyle = oceanGrad;
            ctx.fillRect(0, 0, width, height);
            // Real-time GPU GLSL Voronoi Ocean Caustics & Golden-Hour Sunbeams
            drawGpuOceanCausticsAndSunbeams(ctx, 0, 0, width - 135, height, timeSec);
            // Animated Cel-Shaded A-Frame & Peeling Swell Lines with Subsurface Glow & Lacy Foam
            const swellOffset = (distCounter * 2.2) % 140;
            for (let sy = -80 + swellOffset; sy < height + 80; sy += 140) {
                // Dark trough shadow band
                ctx.strokeStyle = 'rgba(8, 47, 73, 0.35)';
                ctx.lineWidth = 12;
                ctx.beginPath();
                ctx.moveTo(0, sy + 6);
                ctx.quadraticCurveTo(width * 0.42, sy - 16, width - 135, sy + 14);
                ctx.stroke();
                // Subsurface turquoise glow band
                ctx.strokeStyle = 'rgba(103, 232, 249, 0.45)';
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.moveTo(0, sy);
                ctx.quadraticCurveTo(width * 0.42, sy - 22, width - 135, sy + 8);
                ctx.stroke();
                // Lacy whitewater crest
                drawFoamLaceStrip(ctx, 0, sy - 4, width - 135, sy + 4, timeSec + sy * 0.01);
            }
            // Handle Surfer / Boogie Boarder input
            if (!skier.crashed) {
                if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
                    skier.speedX = Math.max(-6.4, skier.speedX - 0.52);
                    skier.angle = -0.42;
                }
                else if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
                    skier.speedX = Math.min(6.4, skier.speedX + 0.52);
                    skier.angle = 0.42;
                }
                else {
                    skier.speedX *= 0.92;
                    skier.angle *= 0.8;
                }
                const wMult = (waxMultiplierRef.current || 1.0) * (buoyScaleRef.current || 1.0);
                if (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) {
                    skier.speedY = Math.min(11.0 * wMult, skier.speedY + 0.18);
                }
                else if (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) {
                    // Stalling on the wave face builds Green Room Tube Meter!
                    skier.speedY = Math.max(2.2, skier.speedY - 0.2);
                    if (skier.barrelTimer > 0) {
                        setGreenRoomMeter(m => Math.min(100, m + 0.6));
                    }
                }
                else {
                    skier.speedY = 5.2 * wMult;
                }
                skier.x += skier.speedX;
                if (skier.x < 35)
                    skier.x = 35;
                if (skier.x > width - 165)
                    skier.x = width - 165;
                distCounter += skier.speedY * 0.4;
                setDistance(Math.round(distCounter));
            }
            else {
                skier.speedX = 0;
                skier.speedY = 0;
            }
            // Air time physics
            if (skier.inAir) {
                skier.airTimer--;
                skier.spin += 0.35;
                if (skier.airTimer <= 0) {
                    skier.inAir = false;
                    setScore(s => s + 250);
                }
            }
            // Barrel / Tube timer
            if (skier.barrelTimer > 0) {
                skier.barrelTimer--;
                if (skier.barrelTimer === 1) {
                    setInBarrel(false);
                }
            }
            if (skier.invincibleTimer > 0) {
                skier.invincibleTimer--;
            }
            // Scroll ocean features & wildlife
            const scrollSpeed = skier.speedY;
            for (let i = 0; i < obstaclesRef.current.length; i++) {
                const obs = obstaclesRef.current[i];
                obs.y -= scrollSpeed;
                drawOceanObstacle(ctx, obs, spotRef.current.id, localRespectRef.current);
                const hitRadiusX = obs.type === 'peeling_wall' ? 52 : 28;
                if (!obs.hit && !skier.inAir && Math.abs(obs.x - skier.x) < hitRadiusX && Math.abs(obs.y - skier.y) < 24) {
                    obs.hit = true;
                    const isBoogie = craftTypeRef.current === 'boogie';
                    if (obs.type === 'wave_lip') {
                        skier.inAir = true;
                        skier.airTimer = 38;
                        skier.spin = 0;
                        const bonus = Math.round(320 * (boardRef.current.statsBonus.trickBonus || 1));
                        setScore(s => s + bonus);
                        const judgeWave = +(8.7 + Math.random() * 1.25).toFixed(2);
                        recordWaveScore(judgeWave);
                        setActiveCheer(isBoogie
                            ? `BOOSTED A HUGE EL ROLLO / ARS FLIP OFF THE CLOSEOUT LIP! (${judgeWave} pts) 🌊🔥`
                            : `STOMPED A FULL-ROTATION AIR REVERSE OFF THE LIP! (${judgeWave} pts) 🏄‍♂️🔥`);
                        setTimeout(() => setActiveCheer(null), 1900);
                    }
                    else if (obs.type === 'barrel_tube' || obs.type === 'peeling_wall') {
                        skier.barrelTimer = 48;
                        setInBarrel(true);
                        setGreenRoomMeter(m => {
                            const nextM = Math.min(100, m + 34);
                            if (nextM >= 100) {
                                recordWaveScore(10.0);
                                setScore(s => s + 1000);
                                setActiveCheer('🏆 10.00 PERFECT GREEN ROOM SPIT BARREL! WSL JUDGES STANDING OVATION! 🏆');
                                return 25;
                            }
                            return nextM;
                        });
                        const bonus = Math.round(450 * (boardRef.current.statsBonus.powFloat || 1));
                        setScore(s => s + bonus);
                        const judgeWave = +(9.25 + Math.random() * 0.74).toFixed(2);
                        recordWaveScore(judgeWave);
                        setActiveCheer(obs.type === 'peeling_wall'
                            ? `CARVED THE ${obs.peelDirection?.toUpperCase()} PEELING A-FRAME WALL INTO THE TUBE! (${judgeWave}) 🌊`
                            : isBoogie
                                ? `DEEP SHOREBREAK SPIT BARREL ON THE BOOGIE! Judges score: ${judgeWave}! 🌊`
                                : `LOCKED IN THE GREEN ROOM BARREL! WSL Judges throw a ${judgeWave}! 🏆`);
                        setTimeout(() => setActiveCheer(null), 2000);
                    }
                    else if (obs.type === 'dolphin') {
                        setScore(s => s + 350);
                        setLocalRespect(r => Math.min(100, r + 6));
                        setActiveCheer('🐬 A pod of Pacific Dolphins is party-wave gliding right alongside you! (+350 Pts)');
                        setTimeout(() => setActiveCheer(null), 1800);
                    }
                    else if (obs.type === 'sea_turtle') {
                        setScore(s => s + 300);
                        setLocalRespect(r => Math.min(100, r + 8));
                        setActiveCheer('🐢 Ancient Sea Turtle (Honu) blessed your line in the reef shallows! (+300 Pts)');
                        setTimeout(() => setActiveCheer(null), 1800);
                    }
                    else if (obs.type === 'pelican_flock') {
                        setScore(s => s + 200);
                        setActiveCheer('🐦 Pelican squadron skimmed the wave crest right over your head! (+200 Pts)');
                        setTimeout(() => setActiveCheer(null), 1800);
                    }
                    else if (obs.type === 'seashell_reef') {
                        skier.invincibleTimer = 180;
                        setScore(s => s + 400);
                        setActiveCheer('🐚 Collected a Golden Pacific Seashell! 3 Seconds Reef & Local Immunity! (+400 Pts)');
                        setTimeout(() => setActiveCheer(null), 1800);
                    }
                    else if (obs.type === 'local_surfer') {
                        // If OC Local Respect >= 80, locals call you into the wave instead of wiping you out!
                        if (localRespectRef.current >= 80 || skier.invincibleTimer > 0 || skier.barrelTimer > 0) {
                            setScore(s => s + 220);
                            setActiveCheer('🤙 Local Crew called you into the bomb set! "GO BRO, ALL YOURS!" (+220 Pts)');
                            setTimeout(() => setActiveCheer(null), 1700);
                        }
                        else {
                            setLocalRespect(r => Math.max(10, r - 12));
                            setHasPriority(false);
                            skier.crashed = true;
                            setIsWipedOut(true);
                            setActiveCheer('⚠️ Dropped in on a local without Priority! Press G to throw a Shaka & share Taco Stand!');
                            setTimeout(() => {
                                skier.crashed = false;
                                setIsWipedOut(false);
                            }, 1500);
                        }
                    }
                    else if (obs.type === 'kelp_rock') {
                        if (skier.invincibleTimer <= 0 && skier.barrelTimer <= 0) {
                            skier.crashed = true;
                            setIsWipedOut(true);
                            setTimeout(() => {
                                skier.crashed = false;
                                setIsWipedOut(false);
                            }, 1500);
                        }
                    }
                }
                if (obs.y < -60) {
                    obstaclesRef.current[i] = generateObstacle(height + Math.random() * 220);
                }
            }
            // Draw Living Beach Shoreline, WSL Fans, Sunbathers, Kids, Lifeguard Tower & Pier on the Right!
            drawBeachAndPierShoreline(ctx, width, height, distCounter, spotRef.current.id);
            // GREAT WHITE SHARK ("THE LANDLORD") CHASE (Triggers past 1,200m)
            if (distCounter > 1200) {
                yeti.active = true;
            }
            if (yeti.active) {
                yeti.y += (yeti.speed - skier.speedY * 0.7);
                if (yeti.x < skier.x)
                    yeti.x += 1.8;
                if (yeti.x > skier.x)
                    yeti.x -= 1.8;
                setYetiDistance(Math.max(0, Math.round(skier.y - yeti.y)));
                drawLandlordShark(ctx, yeti.x, yeti.y);
                if (Math.abs(yeti.x - skier.x) < 30 && Math.abs(yeti.y - skier.y) < 30) {
                    skier.crashed = true;
                    setIsWipedOut(true);
                }
            }
            // Draw Surfer or Boogie Boarder!
            drawSurferOrBoogieBoarder(ctx, skier.x, skier.y, skier.angle, skier.inAir, skier.barrelTimer > 0, skier.spin, skier.crashed, skier.invincibleTimer > 0, boardRef.current, riderRef.current, craftTypeRef.current);
            animId = requestAnimationFrame(loop);
        };
        animId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animId);
    }, [viewMode, recordWaveScore]);
    if (viewMode === 'chairlift') {
        return (_jsx(ChairliftRideView, { selectedBoardId: selectedBoardId || 'forum-destroyer', selectedRiderId: selectedRiderId || 'jp-walker', selectedSpotId: selectedSpotId, onSelectSpot: onSelectSpot, onDropInFromSummit: () => {
                setViewMode('shredding');
                skierRef.current.x = 420;
                skierRef.current.y = 170;
                skierRef.current.speedY = 5.2;
                skierRef.current.crashed = false;
            }, onReturnToDrive: onReturnToDrive, onAddScore: (pts) => setScore(s => s + pts) }));
    }
    return (_jsxs("div", { className: "relative w-full h-full min-h-[560px] bg-sky-950 flex flex-col items-center justify-center overflow-hidden select-none", children: [_jsxs("div", { className: "absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 pointer-events-auto", children: [_jsxs("button", { onClick: onReturnToDrive, className: "px-3 py-1.5 rounded-lg bg-slate-950/90 hover:bg-slate-900 text-cyan-400 border border-slate-700 font-mono text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all", children: [_jsx(ArrowLeft, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "PCH Surf Wagon" })] }), _jsxs("button", { onClick: () => setViewMode('chairlift'), className: "px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 border border-cyan-500 font-mono text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all", title: "Check the Beach, Pier & WSL Lineup Overlook", children: [_jsx(Eye, { className: "w-3.5 h-3.5 text-cyan-400" }), _jsx("span", { children: "Beach Overlook" })] }), _jsxs("button", { onClick: () => setRideModeOverride(effectiveCraftType === 'boogie' ? 'surfboard' : 'boogie'), className: "px-3 py-1.5 rounded-lg bg-amber-950/90 hover:bg-amber-900 text-amber-300 border border-amber-500 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all", children: [_jsx("span", { children: effectiveCraftType === 'boogie' ? '🌊 BOOGIE MODE' : '🏄 SURFBOARD MODE' }), _jsx("span", { className: "text-[10px] text-amber-200 underline", children: "(Switch)" })] }), _jsxs("button", { onClick: handleThrowShakaToLocals, className: "px-3 py-1.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-500 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all", title: "Throw a Shaka & Share Taco Stand Al Pastor with the Lineup Locals (Shortcut: G)", children: [_jsx(HeartHandshake, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { children: "\uD83E\uDD19 Shaka Locals (G)" })] }), _jsxs("button", { onClick: handleJetSkiTowBack, className: "hidden sm:flex px-2.5 py-1.5 rounded-lg bg-sky-950/90 hover:bg-sky-900 text-sky-200 border border-sky-500 font-mono text-xs items-center gap-1 cursor-pointer backdrop-blur-sm transition-all", title: "Jet-Ski Tow-Back to the Peak with Priority (Shortcut: J)", children: [_jsx(Zap, { className: "w-3.5 h-3.5 text-amber-400" }), _jsx("span", { children: "\uD83D\uDEA4 Jet-Ski (J)" })] }), _jsx("div", { className: "hidden xl:flex items-center gap-1 bg-slate-950/90 p-1 rounded-lg border border-slate-700", children: SURF_SPOTS.map((spot) => (_jsx("button", { onClick: () => onSelectSpot?.(spot.id), className: `px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${spot.id === activeSpot.id
                                                ? 'bg-cyan-400 text-slate-950'
                                                : 'text-slate-400 hover:text-white'}`, children: spot.shortName }, spot.id))) })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 pointer-events-auto", children: [_jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/92 border border-amber-500/80 font-mono text-xs text-white backdrop-blur-sm", children: [_jsx("span", { className: "px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]", children: hasPriority ? 'PRIORITY' : 'HEAT' }), _jsxs("span", { children: ["YOU ", _jsx("strong", { className: "text-emerald-400", children: bestTwoWaveTotal.toFixed(2) })] }), _jsx("span", { className: "text-slate-500", children: "vs" }), _jsxs("span", { className: "hidden sm:inline text-slate-300", children: [rivalName, " ", _jsx("strong", { className: "text-rose-300", children: rivalTwoWaveTotal.toFixed(2) })] }), _jsxs("span", { className: "text-cyan-300 text-[11px]", children: ["(Last: ", lastWaveJudgeScore.toFixed(2), ")"] })] }), _jsxs("div", { className: "px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-700 font-mono text-xs text-white backdrop-blur-sm flex items-center gap-1.5", children: [_jsx(Trophy, { className: "w-3.5 h-3.5 text-amber-400" }), _jsx("span", { children: _jsx("span", { className: "text-amber-400 font-bold", children: score }) })] })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono pointer-events-auto", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("div", { className: "px-3 py-1 rounded-lg bg-slate-950/85 border border-cyan-500/40 text-cyan-200 flex items-center gap-2", children: [_jsxs("span", { className: "text-cyan-400 font-bold", children: ["\uD83C\uDF0A ", buoy.stationId, ":"] }), _jsxs("span", { children: [buoy.waveHeightFt, "\u2013", buoy.waveMaxFt, "ft @ ", buoy.swellPeriodSec, "s ", buoy.swellCompass] }), _jsxs("span", { className: "hidden md:inline", children: ["\u2022 ", buoy.waterTempF, "\u00B0F \u2022 Tide ", buoy.tideStage] }), _jsx("span", { className: "px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold", children: buoy.surfRating })] }), _jsxs("div", { className: "hidden lg:flex px-2.5 py-1 rounded-lg bg-indigo-950/85 border border-indigo-400/50 text-indigo-200 items-center gap-1.5", children: [_jsx(Sparkles, { className: "w-3 h-3 text-amber-300" }), _jsx("span", { children: getShaderBackendLabel() })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "px-3 py-1 rounded-lg bg-slate-950/85 border border-cyan-500/40 flex items-center gap-2 text-cyan-200", children: [_jsx("span", { children: "GREEN ROOM TUBE:" }), _jsx("div", { className: "w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/50", children: _jsx("div", { className: "h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all", style: { width: `${greenRoomMeter}%` } }) }), _jsxs("span", { className: "text-cyan-300 font-bold", children: [Math.round(greenRoomMeter), "%"] })] }), _jsxs("div", { className: "px-3 py-1 rounded-lg bg-slate-950/85 border border-emerald-500/40 flex items-center gap-2 text-emerald-200", children: [_jsx("span", { children: "LOCAL RESPECT:" }), _jsx("div", { className: "w-20 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-emerald-500/50", children: _jsx("div", { className: `h-full transition-all ${localRespect >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`, style: { width: `${localRespect}%` } }) }), _jsxs("span", { className: "font-bold", children: [localRespect, "% ", localRespect >= 80 ? '🤙 VIP' : ''] })] })] })] })] }), activeCheer && (_jsxs("div", { className: "absolute top-24 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-slate-950/95 border border-cyan-400 text-cyan-200 font-mono text-xs flex items-center gap-2 shadow-glow-ice animate-bounce max-w-xl text-center", children: [_jsx(Sparkles, { className: "w-4 h-4 text-amber-400 flex-shrink-0" }), _jsx("span", { children: activeCheer })] })), inBarrel && (_jsx("div", { className: "absolute top-36 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-cyan-500/90 text-slate-950 font-mono font-black text-xs uppercase tracking-widest shadow-lg", children: "\uD83C\uDF0A DEEP IN THE GREEN ROOM BARREL! HOLD \u2191/W TO STALL IN THE TUBE! \uD83C\uDF0A" })), yetiRef.current.active && (_jsxs("div", { className: "absolute top-24 right-6 z-20 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500 text-rose-200 font-mono text-xs animate-pulse", children: ["\uD83E\uDD88 \"THE LANDLORD\" SHARK ALERT \u2022 ", yetiDistance, "M BEHIND!"] })), isWipedOut && (_jsxs("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-6 py-3 rounded-2xl bg-slate-950/95 border border-rose-500 text-white font-mono text-center space-y-1 shadow-2xl animate-bounce", children: [_jsx("div", { className: "text-rose-400 font-bold text-lg", children: "OVER THE FALLS! WIPEOUT! \uD83C\uDF0A\uD83D\uDCA5" }), _jsx("div", { className: "text-xs text-slate-300", children: "Duck-diving the whitewater and popping back up..." })] })), showPodiumModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4", children: _jsxs("div", { className: "max-w-lg w-full rounded-2xl bg-slate-950 border-2 border-amber-400 p-6 text-center space-y-4 shadow-2xl", children: [_jsx("div", { className: "text-5xl", children: "\uD83C\uDFC6\uD83C\uDF7E\uD83C\uDFC4\u200D\u2642\uFE0F\uD83C\uDF0A" }), _jsx("div", { className: "text-xs font-mono uppercase tracking-widest text-amber-400 font-bold", children: "Lower Trestles Cobblestone Podium \u2022 San Clemente, CA" }), _jsx("h2", { className: "text-2xl font-black text-white", children: "WSL FINALS WORLD CHAMPION CROWNED!" }), _jsxs("p", { className: "text-xs text-slate-300 font-mono leading-relaxed", children: ["You dropped a massive ", _jsxs("strong", { className: "text-emerald-400", children: [bestTwoWaveTotal.toFixed(2), " / 20.00"] }), " two-wave heat total (", topWaves[0]?.toFixed(2), " + ", topWaves[1]?.toFixed(2), ") to defeat ", rivalName, " (", rivalTwoWaveTotal.toFixed(2), ") in front of thousands of roaring fans on the beach!"] }), _jsx("div", { className: "flex items-center justify-center gap-3 pt-2", children: _jsx("button", { onClick: () => setShowPodiumModal(false), className: "px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black font-mono text-xs uppercase cursor-pointer shadow-lg", children: "Keep Shredding Victory Lap! \uD83E\uDD19" }) })] }) })), _jsx("canvas", { ref: canvasRef, width: 960, height: 640, className: "w-full h-full object-cover max-w-full max-h-full border border-cyan-800 shadow-xl" }), _jsxs("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-[11px] font-mono text-cyan-100 bg-slate-950/85 border border-slate-700 px-4 py-1 rounded-full backdrop-blur-xs flex items-center gap-2 whitespace-nowrap", children: [_jsx(Waves, { className: "w-3.5 h-3.5 text-cyan-400" }), _jsxs("span", { children: ["Steer: \u2190\u2192/A-D \u2022 Pump: \u2193/S \u2022 Stall in Tube: \u2191/W \u2022 Shaka Locals: G \u2022 Jet-Ski: J \u2022 Dist: ", distance, "m"] })] })] }));
};
function drawOceanObstacle(ctx, obs, spotId, localRespect) {
    const timeSec = Date.now() * 0.001;
    if (obs.type === 'dolphin') {
        drawCelShadedDolphin(ctx, obs.x, obs.y, timeSec, obs.x * 0.05);
        return;
    }
    if (obs.type === 'sea_turtle') {
        drawCelShadedSeaTurtle(ctx, obs.x, obs.y, timeSec, obs.x * 0.05);
        return;
    }
    if (obs.type === 'pelican_flock') {
        drawCelShadedPelican(ctx, obs.x - 10, obs.y, timeSec, 0);
        drawCelShadedPelican(ctx, obs.x + 12, obs.y - 7, timeSec, 1.4);
        return;
    }
    ctx.save();
    ctx.translate(obs.x, obs.y);
    if (obs.type === 'local_surfer') {
        const isFriendly = localRespect >= 80;
        // Foaming Wake Ring with Cel Outline
        ctx.fillStyle = 'rgba(236, 254, 255, 0.72)';
        ctx.beginPath();
        ctx.ellipse(0, 7, 17, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0891b2';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        // Cel-Shaded Local Surfboard with Gradient & Stringer
        const bGrad = ctx.createLinearGradient(-15, 0, 15, 8);
        bGrad.addColorStop(0, isFriendly ? '#34d399' : '#fb7185');
        bGrad.addColorStop(1, isFriendly ? '#059669' : '#e11d48');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.ellipse(0, 4, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        // Local Surfer Wetsuit & Sunlit Hair
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, -4, 6.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(-1.5, -6.5, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Cel-Shaded Speech Bubble / Priority Badge
        ctx.fillStyle = isFriendly ? 'rgba(6, 78, 59, 0.95)' : 'rgba(127, 29, 29, 0.95)';
        ctx.beginPath();
        ctx.roundRect(-46, -26, 92, 14, 4);
        ctx.fill();
        ctx.strokeStyle = isFriendly ? '#34d399' : '#f87171';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = isFriendly ? '#a7f3d0' : '#fecaca';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isFriendly
            ? '🤙 GO! YOUR WAVE!'
            : obs.localQuote || (spotId === 'trestles_wsl' ? 'WSL PRIORITY' : 'LOCAL!'), 0, -16.5);
    }
    else if (obs.type === 'peeling_wall') {
        // Cel-Shaded Lateral Peeling A-Frame Wave Wall with Subsurface Glow & Curling Lip
        const isRight = obs.peelDirection !== 'left';
        // Deep trough drop shadow
        ctx.fillStyle = 'rgba(8, 47, 73, 0.45)';
        ctx.beginPath();
        ctx.roundRect(-56, -11, 114, 30, 12);
        ctx.fill();
        const wallGrad = ctx.createLinearGradient(-55, -16, 55, 16);
        wallGrad.addColorStop(0, isRight ? '#ecfeff' : '#0369a1');
        wallGrad.addColorStop(0.45, '#22d3ee');
        wallGrad.addColorStop(0.8, '#0891b2');
        wallGrad.addColorStop(1, isRight ? '#0369a1' : '#ecfeff');
        ctx.fillStyle = wallGrad;
        ctx.beginPath();
        ctx.roundRect(-55, -15, 110, 29, 11);
        ctx.fill();
        ctx.strokeStyle = '#083344';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Specular Toon Rib Lines Inside the Wave Face
        ctx.strokeStyle = 'rgba(236, 254, 255, 0.48)';
        ctx.lineWidth = 1.5;
        for (let rx = -38; rx <= 38; rx += 19) {
            ctx.beginPath();
            ctx.moveTo(rx, -11);
            ctx.quadraticCurveTo(rx + (isRight ? 6 : -6), 0, rx, 11);
            ctx.stroke();
        }
        // Foaming Curling Lip Crest
        drawFoamLaceStrip(ctx, -52, -13, 52, -13, timeSec);
        ctx.fillStyle = '#082f49';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isRight ? 'PEELING RIGHT WALL 🌊→' : '←🌊 PEELING LEFT WALL', 0, 5);
    }
    else if (obs.type === 'kelp_rock') {
        // Swirling Foam Ring + Cel-Shaded Reef Rock & Kelp Fronds
        ctx.fillStyle = 'rgba(236, 254, 255, 0.75)';
        ctx.beginPath();
        ctx.ellipse(0, 2, 16, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        const rockGrad = ctx.createRadialGradient(-3, -4, 1, 0, 0, 11);
        rockGrad.addColorStop(0, spotId === 'san_clemente_pier' ? '#b45309' : '#65a30d');
        rockGrad.addColorStop(1, spotId === 'san_clemente_pier' ? '#451a03' : '#1a2e05');
        ctx.fillStyle = rockGrad;
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-10, 4);
        ctx.quadraticCurveTo(-8, -9, 0, -10);
        ctx.quadraticCurveTo(9, -8, 10, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    else if (obs.type === 'wave_lip') {
        // Cel-Shaded Closeout Ramp Lip
        const lipGrad = ctx.createLinearGradient(0, -10, 0, 10);
        lipGrad.addColorStop(0, '#ecfeff');
        lipGrad.addColorStop(0.4, '#22d3ee');
        lipGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = lipGrad;
        ctx.strokeStyle = '#082f49';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-24, -10, 48, 20, 7);
        ctx.fill();
        ctx.stroke();
        drawFoamLaceStrip(ctx, -20, -9, 20, -9, timeSec);
        ctx.fillStyle = '#082f49';
        ctx.font = 'bold 7.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AIR LIP 🚀', 0, 6);
    }
    else if (obs.type === 'barrel_tube') {
        // Cel-Shaded Hollow Curling Green Room Vortex
        const tubeGrad = ctx.createRadialGradient(-4, -2, 3, 0, 2, 26);
        tubeGrad.addColorStop(0, '#082f49');
        tubeGrad.addColorStop(0.45, '#0891b2');
        tubeGrad.addColorStop(0.8, '#22d3ee');
        tubeGrad.addColorStop(1, '#ecfeff');
        ctx.fillStyle = tubeGrad;
        ctx.beginPath();
        ctx.arc(0, 5, 25, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#082f49';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Thick Whitewater Throwing Lip
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(0, 5, 25, Math.PI * 1.05, Math.PI * 1.95);
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('TUBE 🌊', 0, 2);
    }
    else if (obs.type === 'seashell_reef') {
        // Golden Shimmering Scallop Seashell with Cel-Shaded Ribs
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
        glow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        glow.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();
        const shellGrad = ctx.createLinearGradient(-9, -8, 9, 8);
        shellGrad.addColorStop(0, '#fef08a');
        shellGrad.addColorStop(0.5, '#f59e0b');
        shellGrad.addColorStop(1, '#b45309');
        ctx.fillStyle = shellGrad;
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 2, 9, Math.PI, 0);
        ctx.lineTo(4, 9);
        ctx.lineTo(-4, 9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}
function drawSurferOrBoogieBoarder(ctx, x, y, angle, inAir, inBarrel, spin, crashed, invincible, board, rider, craftType) {
    ctx.save();
    ctx.translate(x, y);
    if (crashed) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.arc((Math.random() - 0.5) * 28, (Math.random() - 0.5) * 28, 3 + Math.random() * 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.save();
        ctx.rotate(0.75);
        ctx.fillStyle = board.accentColor;
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-7, -18, 14, 36, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.restore();
        return;
    }
    if (inAir) {
        ctx.rotate(spin);
        ctx.scale(1.35, 1.35);
    }
    else {
        ctx.rotate(angle);
    }
    // Cel-Shaded Twin Rooster-Tail Spray Wake Behind Board
    const wakeGrad = ctx.createLinearGradient(0, -14, 0, -42);
    wakeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
    wakeGrad.addColorStop(0.6, 'rgba(165, 243, 252, 0.55)');
    wakeGrad.addColorStop(1, 'rgba(103, 232, 249, 0)');
    ctx.fillStyle = wakeGrad;
    ctx.beginPath();
    ctx.moveTo(-7, -15);
    ctx.lineTo(-18, -42);
    ctx.lineTo(18, -42);
    ctx.lineTo(7, -15);
    ctx.closePath();
    ctx.fill();
    if (invincible) {
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    if (craftType === 'boogie') {
        // Cel-Shaded Boogie Board with Glossy Deck & Crescent Tail
        const bgGrad = ctx.createLinearGradient(-10, -18, 10, 18);
        bgGrad.addColorStop(0, board.accentColor);
        bgGrad.addColorStop(1, board.topGraphicColor);
        ctx.beginPath();
        ctx.roundRect(-9.5, -18, 19, 35, 4);
        ctx.fillStyle = bgGrad;
        ctx.fill();
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 2;
        ctx.stroke();
        const kick = Math.sin(Date.now() * 0.025) * 3;
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.2;
        ctx.fillRect(-7, -26 + kick, 5, 9);
        ctx.strokeRect(-7, -26 + kick, 5, 9);
        ctx.fillRect(2, -26 - kick, 5, 9);
        ctx.strokeRect(2, -26 - kick, 5, 9);
        ctx.fillStyle = rider.accentColor;
        ctx.beginPath();
        ctx.roundRect(-6.5, -10, 13, 16, 3);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, 8, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    else {
        // Cel-Shaded Surfboard with Glossy Epoxy Gradient, Stringer & Specular Rim
        const sbGrad = ctx.createLinearGradient(-9, -20, 9, 24);
        sbGrad.addColorStop(0, '#ffffff');
        sbGrad.addColorStop(0.35, board.accentColor);
        sbGrad.addColorStop(1, board.topGraphicColor);
        ctx.beginPath();
        ctx.moveTo(0, 25);
        ctx.quadraticCurveTo(10, 6, 7.5, -20);
        ctx.lineTo(-7.5, -20);
        ctx.quadraticCurveTo(-10, 6, 0, 25);
        ctx.closePath();
        ctx.fillStyle = sbGrad;
        ctx.fill();
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.8;
        ctx.stroke();
        // Cedar stringer
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -19);
        ctx.lineTo(0, 23);
        ctx.stroke();
        // Tail traction pad
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4.5, -18, 9, 7);
        // Cel-Shaded Surfer Crouching in Stance
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4.5, -7, 9, 14);
        ctx.fillStyle = rider.accentColor;
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, -2, 7.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Sun-bleached surfer hair with highlight
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, -6, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Outstretched balance arms
        ctx.strokeStyle = rider.accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-5, -2);
        ctx.lineTo(-12, 4);
        ctx.moveTo(5, -2);
        ctx.lineTo(12, -5);
        ctx.stroke();
    }
    if (inBarrel) {
        // Translucent Cel-Shaded Green Room Barrel Curtain Arching Over Player
        const curtainGrad = ctx.createRadialGradient(0, 0, 12, 0, 0, 28);
        curtainGrad.addColorStop(0, 'rgba(34, 211, 238, 0.1)');
        curtainGrad.addColorStop(0.75, 'rgba(6, 182, 212, 0.75)');
        curtainGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
        ctx.strokeStyle = curtainGrad;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 24, Math.PI * 0.82, Math.PI * 0.18);
        ctx.stroke();
    }
    ctx.restore();
}
function drawLandlordShark(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Churning Whitewater Vortex
    ctx.fillStyle = 'rgba(236, 254, 255, 0.82)';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    // Cel-Shaded Great White Body & Dorsal Fin
    const sharkGrad = ctx.createLinearGradient(-12, -24, 12, 24);
    sharkGrad.addColorStop(0, '#1e293b');
    sharkGrad.addColorStop(0.5, '#475569');
    sharkGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = sharkGrad;
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 13, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Iconic Triangular Dorsal Fin slicing the water
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(-11, 7);
    ctx.lineTo(11, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
function drawBeachAndPierShoreline(ctx, width, height, distCounter, spotId) {
    const beachX = width - 135;
    const timeSec = Date.now() * 0.001;
    ctx.save();
    const foamWave = Math.sin(timeSec * 3.5) * 6;
    // Wet Mirror-Sand Reflection Band
    const wetGrad = ctx.createLinearGradient(beachX - 18 + foamWave, 0, beachX + 18, 0);
    wetGrad.addColorStop(0, '#67e8f9');
    wetGrad.addColorStop(0.45, '#bae6fd');
    wetGrad.addColorStop(0.75, '#d97706');
    wetGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = wetGrad;
    ctx.fillRect(beachX - 18 + foamWave, 0, 36, height);
    // Warm Golden Dry Sand Gradient
    const sandGrad = ctx.createLinearGradient(beachX + 14, 0, width, 0);
    sandGrad.addColorStop(0, '#fde68a');
    sandGrad.addColorStop(0.5, '#fef08a');
    sandGrad.addColorStop(1, '#fcd34d');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(beachX + 14, 0, width - (beachX + 14), height);
    // Scalloped Shorebreak Foam Lace Line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(beachX - 6 + foamWave, 0);
    for (let y = 0; y <= height; y += 32) {
        ctx.quadraticCurveTo(beachX - 12 + foamWave + Math.sin(timeSec * 2 + y * 0.05) * 5, y + 16, beachX - 6 + foamWave, y + 32);
    }
    ctx.stroke();
    const itemSpacing = 220;
    const scrollOffset = (distCounter * 2.5) % itemSpacing;
    for (let by = -140 + scrollOffset; by < height + 140; by += itemSpacing) {
        const seed = Math.abs(Math.round((by - scrollOffset) / itemSpacing));
        // Cel-Shaded Beach Umbrella, Striped Towel & Sunbather
        drawCelShadedUmbrellaAndSunbather(ctx, beachX + 48, by + 42, seed);
        // Cel-Shaded 3D California Lifeguard Tower
        drawCelShadedLifeguardTower(ctx, beachX + 62, by + 112);
        // Cel-Shaded WSL / Beach Fan Pavilion
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = spotId === 'trestles_wsl' ? '#facc15' : '#22d3ee';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(beachX + 22, by + 162, 102, 30, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = spotId === 'trestles_wsl' ? '#facc15' : '#67e8f9';
        ctx.font = 'bold 7.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(spotId === 'trestles_wsl' ? '🏆 WSL FINALS VIP' : '🏖️ OC BEACH FANS', beachX + 73, by + 174);
        ctx.fillStyle = '#e0f2fe';
        ctx.font = 'bold 7px monospace';
        ctx.fillText('CHEERING LINEUP 🤙', beachX + 73, by + 186);
    }
    ctx.restore();
}
