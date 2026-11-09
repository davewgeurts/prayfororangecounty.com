import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { CanyonRoute } from '../../utils/canyonRoute';
import { SNOWBOARDS_LIST, RIDERS_LIST } from '../../data/snowboardGear';
import { drawGpuAlpinePowderAndAlpenglow, drawCelShadedTopDownPine } from '../../utils/snowShaderEngine';
export const TopDownView = ({ carState }) => {
    const canvasRef = useRef(null);
    const snowflakesRef = useRef([]);
    useEffect(() => {
        // Generate flakes
        snowflakesRef.current = Array.from({ length: 180 }, () => ({
            x: Math.random() * 1200,
            y: Math.random() * 800,
            z: Math.random(),
            speed: 2 + Math.random() * 4,
            size: 1 + Math.random() * 3,
            drift: (Math.random() - 0.5) * 1.5
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
            // Clear with dark canyon background + WebGPU / WebGL2 Night Powder Shader
            ctx.fillStyle = '#060b14';
            ctx.fillRect(0, 0, width, height);
            const timeSec = performance.now() / 1000;
            drawGpuAlpinePowderAndAlpenglow(ctx, 0, 0, width, height, timeSec, true);
            ctx.save();
            // Center camera on car
            const centerX = width / 2;
            const centerY = height * 0.65;
            ctx.translate(centerX, centerY);
            // Rotate world inverse to car angle so car heads "up" screen GTA2 style
            ctx.rotate(-carState.angle);
            // Draw canyon environment for +/- 1.2 miles around current car position
            const currentMile = carState.distanceMiles;
            const currentPos = CanyonRoute.getRoadPosition(currentMile);
            // Draw canyon floor & cliffs
            const roadHalfWidth = 55;
            const shoulderWidth = 85;
            // Sample road segments
            const samplePoints = [];
            const lookBehind = 0.5;
            const lookAhead = 0.9;
            const step = 0.02;
            for (let m = Math.max(0, currentMile - lookBehind); m <= Math.min(CanyonRoute.TOTAL_MILES, currentMile + lookAhead); m += step) {
                const p = CanyonRoute.getRoadPosition(m);
                // Transform relative to car's world pos
                samplePoints.push({
                    x: p.x - currentPos.x,
                    y: p.y - currentPos.y,
                    mile: m
                });
            }
            if (samplePoints.length > 2) {
                // 1. Draw snowbanks / canyon terrain
                ctx.beginPath();
                for (let i = 0; i < samplePoints.length; i++) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    const sx = pt.x + Math.sin(normAngle) * (shoulderWidth + 120);
                    const sy = pt.y - Math.cos(normAngle) * (shoulderWidth + 120);
                    if (i === 0)
                        ctx.moveTo(sx, sy);
                    else
                        ctx.lineTo(sx, sy);
                }
                for (let i = samplePoints.length - 1; i >= 0; i--) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    const sx = pt.x - Math.sin(normAngle) * (shoulderWidth + 120);
                    const sy = pt.y + Math.cos(normAngle) * (shoulderWidth + 120);
                    ctx.lineTo(sx, sy);
                }
                ctx.closePath();
                ctx.fillStyle = '#111a2e'; // Dark granite / alpine slate
                ctx.fill();
                // 2. Big Cottonwood Creek running along the road
                ctx.beginPath();
                for (let i = 0; i < samplePoints.length; i++) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    const cx = pt.x + Math.sin(normAngle) * (shoulderWidth + 50);
                    const cy = pt.y - Math.cos(normAngle) * (shoulderWidth + 50);
                    if (i === 0)
                        ctx.moveTo(cx, cy);
                    else
                        ctx.lineTo(cx, cy);
                }
                ctx.lineWidth = 22;
                ctx.strokeStyle = '#0284c7'; // Rushing creek water
                ctx.stroke();
                // Creek ice edges
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#e0f2fe';
                ctx.stroke();
                // 3. Snow shoulders
                ctx.beginPath();
                for (let i = 0; i < samplePoints.length; i++) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    const sx = pt.x + Math.sin(normAngle) * shoulderWidth;
                    const sy = pt.y - Math.cos(normAngle) * shoulderWidth;
                    if (i === 0)
                        ctx.moveTo(sx, sy);
                    else
                        ctx.lineTo(sx, sy);
                }
                for (let i = samplePoints.length - 1; i >= 0; i--) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    const sx = pt.x - Math.sin(normAngle) * shoulderWidth;
                    const sy = pt.y + Math.cos(normAngle) * shoulderWidth;
                    ctx.lineTo(sx, sy);
                }
                ctx.closePath();
                ctx.fillStyle = '#334155';
                ctx.fill();
                // 4. Asphalt Road
                ctx.beginPath();
                for (let i = 0; i < samplePoints.length; i++) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    const rx = pt.x + Math.sin(normAngle) * roadHalfWidth;
                    const ry = pt.y - Math.cos(normAngle) * roadHalfWidth;
                    if (i === 0)
                        ctx.moveTo(rx, ry);
                    else
                        ctx.lineTo(rx, ry);
                }
                for (let i = samplePoints.length - 1; i >= 0; i--) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    const rx = pt.x - Math.sin(normAngle) * roadHalfWidth;
                    const ry = pt.y + Math.cos(normAngle) * roadHalfWidth;
                    ctx.lineTo(rx, ry);
                }
                ctx.closePath();
                ctx.fillStyle = '#1e293b'; // Wet dark winter asphalt
                ctx.fill();
                // Road center double-yellow lines
                ctx.beginPath();
                for (let i = 0; i < samplePoints.length; i++) {
                    const pt = samplePoints[i];
                    if (i === 0)
                        ctx.moveTo(pt.x, pt.y);
                    else
                        ctx.lineTo(pt.x, pt.y);
                }
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#eab308'; // Utah highway yellow
                ctx.setLineDash([12, 10]);
                ctx.stroke();
                ctx.setLineDash([]);
                // White shoulder lines
                ctx.beginPath();
                for (let i = 0; i < samplePoints.length; i++) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    const rx = pt.x + Math.sin(normAngle) * (roadHalfWidth - 3);
                    const ry = pt.y - Math.cos(normAngle) * (roadHalfWidth - 3);
                    if (i === 0)
                        ctx.moveTo(rx, ry);
                    else
                        ctx.lineTo(rx, ry);
                }
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#f8fafc';
                ctx.stroke();
                ctx.beginPath();
                for (let i = 0; i < samplePoints.length; i++) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    const rx = pt.x - Math.sin(normAngle) * (roadHalfWidth - 3);
                    const ry = pt.y + Math.cos(normAngle) * (roadHalfWidth - 3);
                    if (i === 0)
                        ctx.moveTo(rx, ry);
                    else
                        ctx.lineTo(rx, ry);
                }
                ctx.stroke();
                // 5. Render roadside pine trees & rocks
                for (let i = 0; i < samplePoints.length; i += 3) {
                    const pt = samplePoints[i];
                    const normAngle = CanyonRoute.getRoadPosition(pt.mile).angle + Math.PI / 2;
                    // Tree on right side
                    const tx = pt.x + Math.sin(normAngle) * (shoulderWidth + 25);
                    const ty = pt.y - Math.cos(normAngle) * (shoulderWidth + 25);
                    drawPineTree(ctx, tx, ty, 16);
                    // Tree on left side
                    const lx = pt.x - Math.sin(normAngle) * (shoulderWidth + 28);
                    const ly = pt.y + Math.cos(normAngle) * (shoulderWidth + 28);
                    drawPineTree(ctx, lx, ly, 18);
                }
                // 6. RENDER MILOSPORT PARKING LOT (Mile 0.0)
                if (currentMile < 0.6) {
                    const lotPos = CanyonRoute.getRoadPosition(0.0);
                    const lx = lotPos.x - currentPos.x;
                    const ly = lotPos.y - currentPos.y;
                    const lotNorm = lotPos.angle + Math.PI / 2;
                    const lotX = lx + Math.sin(lotNorm) * (roadHalfWidth + 90);
                    const lotY = ly - Math.cos(lotNorm) * (roadHalfWidth + 90);
                    drawMilosportLot(ctx, lotX, lotY);
                }
                // 7. RENDER SILENT ROCK LANDMARK (around Mile 2.95)
                if (Math.abs(currentMile - CanyonRoute.SILENT_ROCK_CENTER) < 1.0) {
                    const rockPos = CanyonRoute.getRoadPosition(CanyonRoute.SILENT_ROCK_CENTER);
                    const rx = rockPos.x - currentPos.x;
                    const ry = rockPos.y - currentPos.y;
                    const rockNorm = rockPos.angle + Math.PI / 2;
                    // Silent Rock sits tightly on the left rock-cut curve
                    const rockX = rx - Math.sin(rockNorm) * (roadHalfWidth + 40);
                    const rockY = ry + Math.cos(rockNorm) * (roadHalfWidth + 40);
                    drawSilentRock(ctx, rockX, rockY);
                }
            }
            // 8. RENDER PLAYER'S CAR (At center of view, heading UP in car space)
            drawCar(ctx, 0, 0, carState);
            // 9. IF PULLED OVER OR HIGH-SPEED PURSUIT: RENDER UTAH HIGHWAY PATROL CRUISER BEHIND
            if (carState.isPulledOver) {
                drawPoliceCruiser(ctx, 0, 82);
            }
            else if (carState.hasGasDashChase) {
                // In high speed pursuit, cruiser weaves aggressively right behind player!
                const wobble = Math.sin(Date.now() / 140) * 16;
                drawPoliceCruiser(ctx, wobble, 96);
            }
            ctx.restore();
            // 8. Foreground blizzard flakes (Screen space)
            renderBlizzard(ctx, width, height, snowflakesRef.current, carState.speed);
            animId = requestAnimationFrame(render);
        };
        animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [carState]);
    return (_jsx("div", { className: "relative w-full h-full min-h-[480px] bg-alpine-bg overflow-hidden flex items-center justify-center", children: _jsx("canvas", { ref: canvasRef, width: 960, height: 640, className: "w-full h-full object-cover max-w-full max-h-full" }) }));
};
function drawPineTree(ctx, x, y, radius) {
    drawCelShadedTopDownPine(ctx, x, y, radius);
}
function drawSilentRock(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Massive angled quartzite rock buttress (matching inspiration image 1)
    ctx.beginPath();
    ctx.moveTo(-60, 40);
    ctx.lineTo(-40, -50);
    ctx.lineTo(20, -75); // peak
    ctx.lineTo(65, -30);
    ctx.lineTo(55, 45);
    ctx.lineTo(-20, 60);
    ctx.closePath();
    // Ochre / rusty quartzite tones
    const rockGrad = ctx.createLinearGradient(-40, -75, 40, 60);
    rockGrad.addColorStop(0, '#92400e');
    rockGrad.addColorStop(0.5, '#78350f');
    rockGrad.addColorStop(1, '#451a03');
    ctx.fillStyle = rockGrad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();
    // Snow mantling on jagged rock ledges
    ctx.beginPath();
    ctx.moveTo(-35, -48);
    ctx.lineTo(15, -72);
    ctx.lineTo(35, -60);
    ctx.lineTo(15, -55);
    ctx.closePath();
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    // Yellow road curve warning chevron sign
    ctx.save();
    ctx.translate(50, 20);
    ctx.rotate(0.2);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-12, -12, 24, 24);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◀', 0, 0);
    ctx.restore();
    // Landmark label banner
    ctx.fillStyle = 'rgba(6, 11, 20, 0.85)';
    ctx.fillRect(-70, 70, 140, 26);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(-70, 70, 140, 26);
    ctx.fillStyle = '#7dd3fc';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SILENT ROCK (3.0 MI)', 0, 86);
    ctx.restore();
}
function drawCar(ctx, x, y, car) {
    ctx.save();
    ctx.translate(x, y);
    // Car is heading UP (angle 0 in local space)
    // 1. Headlight beams illuminating the snowy road ahead
    if (car.headlights) {
        const beamGrad = ctx.createRadialGradient(0, -30, 10, 0, -220, 140);
        beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
        beamGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.2)');
        beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.beginPath();
        ctx.moveTo(-16, -25);
        ctx.lineTo(-80, -240);
        ctx.lineTo(80, -240);
        ctx.lineTo(16, -25);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.fill();
    }
    // 2. Car shadow
    ctx.beginPath();
    ctx.roundRect(-23, -38, 46, 78, 9);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.55)';
    ctx.fill();
    // 3. Wagon / 4Runner car body (Cel-Shaded Metallic Wasatch Winter Blue)
    const carGrad = ctx.createLinearGradient(-20, -36, 20, 36);
    carGrad.addColorStop(0, '#38bdf8');
    carGrad.addColorStop(0.45, '#0284c7');
    carGrad.addColorStop(1, '#075985');
    ctx.beginPath();
    ctx.roundRect(-20, -36, 40, 72, 7);
    ctx.fillStyle = carGrad;
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
    // Specular hood highlight
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-13, -32);
    ctx.lineTo(13, -32);
    ctx.stroke();
    // 4. Roof Snowboard Rack with player's selected board & passenger's board!
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-18, -18, 36, 4); // front crossbar
    ctx.fillRect(-18, 12, 36, 4); // rear crossbar
    const activeBoard = SNOWBOARDS_LIST.find(b => b.id === car.selectedBoardId) || SNOWBOARDS_LIST[0];
    const activeRider = RIDERS_LIST.find(r => r.id === car.selectedRiderId) || RIDERS_LIST[0];
    const riderBoard = SNOWBOARDS_LIST.find(b => b.id === activeRider.defaultBoardId) || SNOWBOARDS_LIST[1];
    // Player's board (driver side)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-15, -31, 11, 62, 5);
    ctx.fillStyle = activeBoard.accentColor;
    ctx.fill();
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Bindings on player's board
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-14, -15, 9, 5);
    ctx.fillRect(-14, 8, 9, 5);
    ctx.restore();
    // Shotgun rider's board (passenger side)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(4, -31, 11, 62, 5);
    ctx.fillStyle = riderBoard.accentColor;
    ctx.fill();
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Bindings on passenger board
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5, -15, 9, 5);
    ctx.fillRect(5, 8, 9, 5);
    ctx.restore();
    // 5. Windshield & rear glass (with cel-shaded reflection slash)
    const glassGrad = ctx.createLinearGradient(-15, -24, 15, -14);
    glassGrad.addColorStop(0, '#38bdf8');
    glassGrad.addColorStop(0.5, '#1e293b');
    glassGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(-15, -24, 30, 10); // front windshield
    ctx.fillRect(-14, 20, 28, 8); // rear windshield
    // 6. Headlights & Taillights
    ctx.fillStyle = '#fef08a'; // Yellow headlights
    ctx.fillRect(-18, -37, 8, 4);
    ctx.fillRect(10, -37, 8, 4);
    ctx.fillStyle = '#ef4444'; // Red taillights
    ctx.fillRect(-18, 33, 8, 4);
    ctx.fillRect(10, 33, 8, 4);
    // 7. Exhaust steam
    if (car.speed > 0) {
        ctx.beginPath();
        ctx.arc(12, 42 + Math.random() * 4, 4 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(241, 245, 249, 0.4)';
        ctx.fill();
    }
    ctx.restore();
}
function drawMilosportLot(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // 1. Asphalt Parking Lot
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-100, -70, 200, 140, 8);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Parking stall lines (yellow)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.lineWidth = 2;
    for (let i = -75; i <= 65; i += 35) {
        ctx.beginPath();
        ctx.moveTo(i, -60);
        ctx.lineTo(i, -20);
        ctx.stroke();
    }
    // Parked cars in the lot
    drawParkedCar(ctx, -55, -40, '#047857'); // green Outback
    drawParkedCar(ctx, 15, -40, '#b91c1c'); // red 4Runner
    // 2. Milosport Store Building
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-80, 20, 160, 50, 4);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Milo Sign
    ctx.fillStyle = '#065f46';
    ctx.fillRect(-70, 25, 140, 18);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MILOSPORT SLC', 0, 38);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('EST. 1984 • 3119 E 3300 S', 0, 58);
    // Landmark banner
    ctx.fillStyle = 'rgba(6, 11, 20, 0.9)';
    ctx.fillRect(-90, -85, 180, 22);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.strokeRect(-90, -85, 180, 22);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MILOSPORT PARKING LOT', 0, -70);
    ctx.restore();
}
function drawParkedCar(ctx, x, y, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-10, -18, 20, 36, 4);
    ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.fillRect(-8, -8, 16, 14); // windshield
    ctx.restore();
}
function renderBlizzard(ctx, width, height, flakes, speedMph) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    const speedBonus = (speedMph / 60) * 8;
    for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.speed + speedBonus;
        f.x += f.drift;
        if (f.y > height) {
            f.y = -5;
            f.x = Math.random() * width;
        }
        if (f.x < 0)
            f.x = width;
        if (f.x > width)
            f.x = 0;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
function drawPoliceCruiser(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Strobe animation
    const strobe = Math.floor(Date.now() / 100) % 2 === 0;
    // Flashing red & blue light halos cast on the snow
    const redHalo = ctx.createRadialGradient(-15, 0, 5, -15, 0, 90);
    redHalo.addColorStop(0, strobe ? 'rgba(239, 68, 68, 0.45)' : 'rgba(239, 68, 68, 0.05)');
    redHalo.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = redHalo;
    ctx.fillRect(-100, -90, 180, 180);
    const blueHalo = ctx.createRadialGradient(15, 0, 5, 15, 0, 90);
    blueHalo.addColorStop(0, !strobe ? 'rgba(59, 130, 246, 0.45)' : 'rgba(59, 130, 246, 0.05)');
    blueHalo.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = blueHalo;
    ctx.fillRect(-80, -90, 180, 180);
    // Cruiser shadow
    ctx.beginPath();
    ctx.roundRect(-22, -40, 44, 80, 8);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fill();
    // Cruiser body (white Utah Highway Patrol sedan)
    ctx.beginPath();
    ctx.roundRect(-20, -38, 40, 76, 7);
    ctx.fillStyle = '#f8fafc'; // White body
    ctx.fill();
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Black hood & trunk
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-18, -36, 36, 16); // black hood
    ctx.fillRect(-18, 22, 36, 14); // black trunk
    // Windshield & rear window
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-15, -20, 30, 12);
    ctx.fillRect(-14, 12, 28, 9);
    // Headlights (wig-wag flashing)
    ctx.fillStyle = strobe ? '#fef08a' : '#ffffff';
    ctx.fillRect(-18, -39, 7, 4);
    ctx.fillStyle = !strobe ? '#fef08a' : '#ffffff';
    ctx.fillRect(11, -39, 7, 4);
    // Emergency Lightbar on roof
    ctx.fillStyle = '#020617';
    ctx.fillRect(-18, -4, 36, 8); // lightbar base
    // Red strobe (left)
    ctx.fillStyle = strobe ? '#ef4444' : '#7f1d1d';
    ctx.fillRect(-17, -3, 16, 6);
    // Blue strobe (right)
    ctx.fillStyle = !strobe ? '#3b82f6' : '#1e3a8a';
    ctx.fillRect(1, -3, 16, 6);
    // Center white flasher
    ctx.fillStyle = strobe ? '#ffffff' : '#94a3b8';
    ctx.fillRect(-2, -3, 4, 6);
    // Gold Star Badge on roof
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('UHP', 0, 20);
    ctx.restore();
}
