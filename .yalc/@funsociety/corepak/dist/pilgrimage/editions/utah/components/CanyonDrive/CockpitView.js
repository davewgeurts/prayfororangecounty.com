import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { CanyonRoute } from '../../utils/canyonRoute';
import { SNOWBOARDS_LIST, RIDERS_LIST } from '../../data/snowboardGear';
import { drawGpuAlpinePowderAndAlpenglow, drawCelShadedPineTree } from '../../utils/snowShaderEngine';
export const CockpitView = ({ carState }) => {
    const canvasRef = useRef(null);
    const wiperAngleRef = useRef(0);
    const wiperDirectionRef = useRef(1);
    const windshieldFlakesRef = useRef([]);
    useEffect(() => {
        // Generate stuck flakes on windshield
        windshieldFlakesRef.current = Array.from({ length: 60 }, () => ({
            x: Math.random() * 960,
            y: Math.random() * 450,
            size: 2 + Math.random() * 4,
            alpha: 0.6 + Math.random() * 0.4,
            wiped: false
        }));
    }, []);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let animId;
        const render = () => {
            const width = canvas.width;
            const height = canvas.height;
            // 1. Dark Wasatch Night Sky + WebGPU / WebGL2 Night Aurora & Diamond Dust
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, width, height);
            const horizonY = height * 0.42;
            const timeSec = performance.now() / 1000;
            drawGpuAlpinePowderAndAlpenglow(ctx, 0, 0, width, horizonY + 120, timeSec, true);
            // 2. Mountain Ridges (Cel-shaded against alpine glow)
            const ridgeGrad = ctx.createLinearGradient(0, horizonY - 100, 0, horizonY + 80);
            ridgeGrad.addColorStop(0, '#1e293b');
            ridgeGrad.addColorStop(0.5, '#0f172a');
            ridgeGrad.addColorStop(1, '#090d16');
            ctx.beginPath();
            ctx.moveTo(0, horizonY);
            ctx.lineTo(120, horizonY - 45);
            ctx.lineTo(260, horizonY - 20);
            ctx.lineTo(440, horizonY - 80); // Storm Mountain crags
            ctx.lineTo(600, horizonY - 30);
            ctx.lineTo(780, horizonY - 95); // Twin Peaks / O'Sullivan
            ctx.lineTo(width, horizonY - 35);
            ctx.lineTo(width, horizonY + 120);
            ctx.lineTo(0, horizonY + 120);
            ctx.closePath();
            ctx.fillStyle = ridgeGrad;
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // 3. Render 3D Perspective Road Ahead (A-10 Tank Killer retro wire/poly style)
            const currentMile = carState.distanceMiles;
            const curve = CanyonRoute.getRoadCurvature(currentMile);
            const steeringOffset = carState.steering * 80;
            // Road trapezoid vanishing into horizon
            const roadVanishingX = width / 2 + curve * 180 - steeringOffset * 0.5;
            const roadVanishingY = horizonY;
            const roadVanishingWidth = 40;
            const roadBottomLeftX = width * 0.12 - steeringOffset;
            const roadBottomRightX = width * 0.88 - steeringOffset;
            const roadBottomY = height * 0.78;
            // Canyon rock walls / snow slopes flanking road (cel-shaded gradient)
            const bankGrad = ctx.createLinearGradient(0, horizonY, 0, roadBottomY);
            bankGrad.addColorStop(0, '#0f172a');
            bankGrad.addColorStop(0.6, '#1e293b');
            bankGrad.addColorStop(1, '#334155');
            ctx.beginPath();
            ctx.moveTo(0, horizonY);
            ctx.lineTo(roadVanishingX - roadVanishingWidth / 2, roadVanishingY);
            ctx.lineTo(roadBottomLeftX, roadBottomY);
            ctx.lineTo(0, roadBottomY);
            ctx.closePath();
            ctx.fillStyle = bankGrad;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(width, horizonY);
            ctx.lineTo(roadVanishingX + roadVanishingWidth / 2, roadVanishingY);
            ctx.lineTo(roadBottomRightX, roadBottomY);
            ctx.lineTo(width, roadBottomY);
            ctx.closePath();
            ctx.fillStyle = bankGrad;
            ctx.fill();
            // Road surface
            ctx.beginPath();
            ctx.moveTo(roadVanishingX - roadVanishingWidth / 2, roadVanishingY);
            ctx.lineTo(roadVanishingX + roadVanishingWidth / 2, roadVanishingY);
            ctx.lineTo(roadBottomRightX, roadBottomY);
            ctx.lineTo(roadBottomLeftX, roadBottomY);
            ctx.closePath();
            ctx.fillStyle = '#090d16';
            ctx.fill();
            // Headlight illumination cone on road
            if (carState.headlights) {
                const headlightGrad = ctx.createRadialGradient(width / 2, roadBottomY - 40, 20, roadVanishingX, roadVanishingY, 380);
                headlightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
                headlightGrad.addColorStop(0.6, 'rgba(254, 240, 138, 0.15)');
                headlightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
                ctx.beginPath();
                ctx.moveTo(roadVanishingX - roadVanishingWidth / 2, roadVanishingY);
                ctx.lineTo(roadVanishingX + roadVanishingWidth / 2, roadVanishingY);
                ctx.lineTo(roadBottomRightX, roadBottomY);
                ctx.lineTo(roadBottomLeftX, roadBottomY);
                ctx.closePath();
                ctx.fillStyle = headlightGrad;
                ctx.fill();
            }
            // Center dividing stripe in perspective
            const stripeOffset = (Date.now() * 0.05 * (carState.speed / 20)) % 1;
            for (let i = 0; i < 9; i++) {
                const t1 = Math.pow((i + stripeOffset) / 9, 2);
                const t2 = Math.pow((i + stripeOffset + 0.4) / 9, 2);
                if (t1 > 1 || t2 > 1)
                    continue;
                const y1 = roadVanishingY + (roadBottomY - roadVanishingY) * t1;
                const y2 = roadVanishingY + (roadBottomY - roadVanishingY) * t2;
                const x1 = roadVanishingX + ((width / 2 - steeringOffset) - roadVanishingX) * t1;
                const x2 = roadVanishingX + ((width / 2 - steeringOffset) - roadVanishingX) * t2;
                const w = 2 + t1 * 6;
                ctx.beginPath();
                ctx.moveTo(x1 - w / 2, y1);
                ctx.lineTo(x1 + w / 2, y1);
                ctx.lineTo(x2 + w / 2, y2);
                ctx.lineTo(x2 - w / 2, y2);
                ctx.closePath();
                ctx.fillStyle = '#eab308';
                ctx.fill();
            }
            // Cel-shaded subalpine pine trees scrolling past along the canyon shoulders
            const treePhase = (currentMile * 28) % 1;
            for (let i = 0; i < 4; i++) {
                const t = Math.pow((i + treePhase) / 4, 1.8);
                if (t < 0.08 || t > 0.98)
                    continue;
                const ty = roadVanishingY + (roadBottomY - roadVanishingY) * t;
                const leftEdgeX = (roadVanishingX - roadVanishingWidth / 2) + (roadBottomLeftX - (roadVanishingX - roadVanishingWidth / 2)) * t;
                const rightEdgeX = (roadVanishingX + roadVanishingWidth / 2) + (roadBottomRightX - (roadVanishingX + roadVanishingWidth / 2)) * t;
                const treeScale = 0.25 + t * 0.85;
                drawCelShadedPineTree(ctx, leftEdgeX - 28 * treeScale, ty, treeScale, i + 1);
                drawCelShadedPineTree(ctx, rightEdgeX + 28 * treeScale, ty, treeScale, i + 7);
            }
            // SILENT ROCK PROJECTION (If within 0.4 miles)
            const distToSilentRock = CanyonRoute.SILENT_ROCK_CENTER - currentMile;
            if (distToSilentRock >= -0.1 && distToSilentRock <= 0.4) {
                // Appears on left roadside cutting directly into frame
                const rockScale = Math.max(0.2, 1 - (distToSilentRock / 0.4));
                const rockScreenX = roadVanishingX - 80 - rockScale * 220;
                const rockScreenY = roadVanishingY + (roadBottomY - roadVanishingY) * rockScale;
                drawCockpitSilentRock(ctx, rockScreenX, rockScreenY, rockScale);
            }
            // 4. Swirling Snowflakes outside windshield
            drawCockpitBlizzard(ctx, width, horizonY, roadBottomY, carState.speed, curve);
            // 5. Windshield Glass Tint & Wipers
            if (carState.wipersActive) {
                wiperAngleRef.current += 0.06 * wiperDirectionRef.current;
                if (wiperAngleRef.current > 1.2)
                    wiperDirectionRef.current = -1;
                if (wiperAngleRef.current < -0.2)
                    wiperDirectionRef.current = 1;
            }
            drawWiper(ctx, width * 0.35, height * 0.72, wiperAngleRef.current);
            drawWiper(ctx, width * 0.72, height * 0.72, wiperAngleRef.current);
            // 6. RETRO A-10 / 90s COCKPIT DASHBOARD FRAME & INSTRUMENT CLUSTER
            drawRetroDashboard(ctx, width, height, carState);
            animId = requestAnimationFrame(render);
        };
        animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [carState]);
    return (_jsx("div", { className: "relative w-full h-full min-h-[480px] bg-alpine-bg overflow-hidden flex items-center justify-center", children: _jsx("canvas", { ref: canvasRef, width: 960, height: 640, className: "w-full h-full object-cover max-w-full max-h-full" }) }));
};
function drawCockpitSilentRock(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Massive rock cut
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(80, -180);
    ctx.lineTo(160, -220); // crag peak
    ctx.lineTo(240, -140);
    ctx.lineTo(260, 0);
    ctx.closePath();
    const grad = ctx.createLinearGradient(80, -220, 200, 0);
    grad.addColorStop(0, '#78350f');
    grad.addColorStop(0.5, '#451a03');
    grad.addColorStop(1, '#1c1917');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();
    // Snow cap on rock
    ctx.beginPath();
    ctx.moveTo(70, -175);
    ctx.lineTo(160, -218);
    ctx.lineTo(210, -165);
    ctx.lineTo(150, -170);
    ctx.closePath();
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    // Yellow warning curve sign on rock face
    ctx.fillStyle = '#facc15';
    ctx.fillRect(170, -100, 36, 36);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◀', 188, -82);
    ctx.restore();
}
function drawCockpitBlizzard(ctx, width, horizonY, bottomY, speedMph, curve) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const flakeCount = 45;
    for (let i = 0; i < flakeCount; i++) {
        const t = (Date.now() * 0.001 * (1 + speedMph / 30) + i * 0.1) % 1;
        const y = horizonY + (bottomY - horizonY) * t;
        const spread = (t * width) * 0.6;
        const x = width / 2 + (Math.sin(i * 99) * spread) - curve * 120 * t;
        const size = 1 + t * 4;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}
function drawWiper(ctx, pivotX, pivotY, angle) {
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(-angle);
    // Wiper arm
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -170);
    ctx.stroke();
    // Wiper blade
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-18, -120);
    ctx.lineTo(18, -175);
    ctx.stroke();
    ctx.restore();
}
function drawRetroDashboard(ctx, width, height, car) {
    ctx.save();
    // Windshield Pillars / Frame
    ctx.fillStyle = '#0f172a'; // Dark interior plastic / steel
    ctx.fillRect(0, 0, 45, height); // Left A-pillar
    ctx.fillRect(width - 45, 0, 45, height); // Right A-pillar
    ctx.fillRect(0, 0, width, 35); // Top roof lining
    // Rearview Mirror with pine tree air freshener!
    const mirrorX = width / 2;
    const mirrorY = 28;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(mirrorX - 80, mirrorY, 160, 36);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(mirrorX - 80, mirrorY, 160, 36);
    // Mirror reflection
    ctx.fillStyle = '#090d16';
    ctx.fillRect(mirrorX - 76, mirrorY + 4, 152, 28);
    if (car.isPulledOver || car.hasGasDashChase) {
        // Flashing red & blue police strobes filling the rearview mirror!
        const strobeSpeed = car.hasGasDashChase ? 75 : 110;
        const strobe = Math.floor(Date.now() / strobeSpeed) % 2 === 0;
        ctx.fillStyle = strobe ? '#ef4444' : '#3b82f6';
        ctx.fillRect(mirrorX - 74, mirrorY + 6, 72, 24);
        ctx.fillStyle = !strobe ? '#ef4444' : '#3b82f6';
        ctx.fillRect(mirrorX + 2, mirrorY + 6, 72, 24);
        // Center white emergency flasher
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(mirrorX - 4, mirrorY + 12, 8, 12);
        // Ambient police strobe reflection across windshield / cockpit
        const ambientOpacity = car.hasGasDashChase ? 0.14 : 0.08;
        ctx.fillStyle = strobe ? `rgba(239, 68, 68, ${ambientOpacity})` : `rgba(59, 130, 246, ${ambientOpacity})`;
        ctx.fillRect(0, 0, width, height);
    }
    else {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(mirrorX - 10, mirrorY + 14, 20, 8); // Red taillight reflection behind
    }
    // Little green pine tree hanging from mirror
    ctx.beginPath();
    ctx.moveTo(mirrorX, mirrorY + 36);
    ctx.lineTo(mirrorX - 10, mirrorY + 65);
    ctx.lineTo(mirrorX + 10, mirrorY + 65);
    ctx.closePath();
    ctx.fillStyle = '#15803d';
    ctx.fill();
    // Main Dashboard lower console
    const dashTopY = height * 0.72;
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, dashTopY + 20);
    ctx.lineTo(width * 0.2, dashTopY);
    ctx.lineTo(width * 0.8, dashTopY);
    ctx.lineTo(width, dashTopY + 20);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = '#0c1322'; // Retro dark navy dash
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();
    // Gauge Cluster (Speedometer & Elevation Altimeter)
    // 1. Speedometer (Left dial)
    drawAnalogGauge(ctx, width * 0.28, dashTopY + 80, 48, car.speed, 0, 65, 'MPH', '#38bdf8');
    // 2. Altimeter (Center-left dial)
    drawAnalogGauge(ctx, width * 0.42, dashTopY + 80, 48, car.elevationFt, 4900, 8800, 'ELEV FT', '#eab308');
    // 3. Center Retro Cassette Tape Deck / Radio
    const radioX = width * 0.58;
    const radioY = dashTopY + 45;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(radioX - 60, radioY, 120, 68);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(radioX - 60, radioY, 120, 68);
    // Tape slot
    ctx.fillStyle = '#020617';
    ctx.fillRect(radioX - 45, radioY + 12, 90, 24);
    ctx.fillStyle = car.radioMuted ? '#ef4444' : '#10b981';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(car.radioMuted ? '[SILENT ROCK: MUTED]' : `[${car.radioStationLabel || 'WASATCH RADIO 90.1'}]`, radioX, radioY + 28);
    // Scrolling now-playing ticker under the tape slot
    if (!car.radioMuted && car.radioNowPlaying) {
        const tickerLeft = radioX - 52;
        const tickerWidth = 104;
        ctx.save();
        ctx.beginPath();
        ctx.rect(tickerLeft, radioY + 42, tickerWidth, 16);
        ctx.clip();
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'left';
        const ticker = `${car.radioNowPlaying.toUpperCase()}   •   `;
        const loopWidth = ctx.measureText(ticker).width;
        const offset = (performance.now() / 40) % loopWidth;
        ctx.fillText(ticker.repeat(Math.ceil(tickerWidth / loopWidth) + 1), tickerLeft - offset, radioY + 53);
        ctx.restore();
    }
    // 4. Mile Marker Digital Display
    const odoX = width * 0.74;
    const odoY = dashTopY + 55;
    ctx.fillStyle = '#020617';
    ctx.fillRect(odoX - 45, odoY, 90, 48);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(odoX - 45, odoY, 90, 48);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`MI ${car.distanceMiles.toFixed(1)}`, odoX, odoY + 24);
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`BCC SR-190`, odoX, odoY + 40);
    // 5. Passenger Side Glovebox & Milosport / Brand Decals
    const activeBoard = SNOWBOARDS_LIST.find(b => b.id === car.selectedBoardId) || SNOWBOARDS_LIST[0];
    const activeRider = RIDERS_LIST.find(r => r.id === car.selectedRiderId) || RIDERS_LIST[0];
    const gloveX = width * 0.88;
    const gloveY = dashTopY + 50;
    // Milosport Green Heritage Sticker
    ctx.save();
    ctx.translate(gloveX, gloveY - 14);
    ctx.rotate(-0.05);
    ctx.fillStyle = '#065f46';
    ctx.fillRect(-36, -10, 72, 20);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1;
    ctx.strokeRect(-36, -10, 72, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MILOSPORT SLC', 0, 3);
    ctx.restore();
    // Selected Board Brand Sticker
    ctx.save();
    ctx.translate(gloveX, gloveY + 14);
    ctx.rotate(0.04);
    ctx.fillStyle = activeBoard.accentColor;
    ctx.fillRect(-36, -9, 72, 18);
    ctx.fillStyle = '#020617';
    ctx.font = '900 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(activeBoard.brand.toUpperCase(), 0, 3);
    ctx.restore();
    // Passenger Rider Badge on dash
    ctx.save();
    ctx.translate(gloveX, gloveY + 36);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(-45, -7, 90, 15);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(-45, -7, 90, 15);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${activeRider.name.slice(0, 14)}`, 0, 4);
    ctx.restore();
    // Steering wheel top arc in foreground
    ctx.beginPath();
    ctx.arc(width * 0.35, height + 80, 160, Math.PI * 1.15, Math.PI * 1.85);
    ctx.lineWidth = 22;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();
    ctx.restore();
}
function drawAnalogGauge(ctx, x, y, radius, value, minVal, maxVal, label, color) {
    ctx.save();
    ctx.translate(x, y);
    // Dial background
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#030712';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();
    // Tick marks
    for (let a = -Math.PI * 0.75; a <= Math.PI * 0.75; a += Math.PI * 0.15) {
        const tx1 = Math.cos(a) * (radius - 8);
        const ty1 = Math.sin(a) * (radius - 8);
        const tx2 = Math.cos(a) * (radius - 2);
        const ty2 = Math.sin(a) * (radius - 2);
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    // Needle angle
    const normalized = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));
    const needleAngle = -Math.PI * 0.75 + normalized * (Math.PI * 1.5);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(needleAngle) * (radius - 10), Math.sin(needleAngle) * (radius - 10));
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ef4444'; // Red instrument needle
    ctx.stroke();
    // Center pin
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    // Label
    ctx.fillStyle = color;
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, radius * 0.55);
    ctx.restore();
}
