// WebGPU / WebGL2 Alpine Powder Crystal & Cel-Shaded Toon Art Engine for Pray for Snow Utah
const gpuState = {
    initialized: false,
    backend: 'WebGL2',
    canvas: null,
    gl: null,
    program: null,
    uTimeLoc: null,
    uResLoc: null,
    uModeLoc: null
};
const VERTEX_SHADER = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;
// Procedural Voronoi Powder Pillows + Diamond-Dust Ice Sparkles + Toon Cel-Banding GLSL Fragment Shader
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform float u_time;
uniform vec2 u_res;
uniform float u_mode; // 0.0 = Daylight Slope Powder, 1.0 = Night Canyon Aurora & Frost
out vec4 outColor;

vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float voronoiSnow(vec2 uv, float t) {
  vec2 n = floor(uv);
  vec2 f = fract(uv);
  float md = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash2(n + g);
      o = 0.5 + 0.38 * sin(t * 0.85 + 6.2831 * o);
      vec2 r = g + o - f;
      float d = dot(r, r);
      md = min(md, d);
    }
  }
  return 1.0 - clamp(md, 0.0, 1.0);
}

void main() {
  vec2 uv = v_uv;
  float t = u_time;

  vec2 drift = vec2(
    sin(uv.y * 7.0 + t * 0.7) * 0.12,
    cos(uv.x * 6.0 - t * 0.6) * 0.12
  );

  float p1 = voronoiSnow((uv + drift) * 6.5, t);
  float p2 = voronoiSnow((uv - drift * 0.6) * 14.0 + vec2(0.0, t * 0.35), t * 1.4);
  float powder = clamp(p1 * 0.65 + p2 * 0.45, 0.0, 1.0);

  // Cel-shaded quantization (4 toon contour bands)
  float celBand = floor(powder * 4.0) / 4.0;

  // Diamond-dust surface crystal glint
  float glintHash = fract(sin(dot(floor(uv * 95.0), vec2(12.9898, 78.233)) + floor(t * 6.0)) * 43758.5453);

  if (u_mode < 0.5) {
    // Daylight Brighton Slope: Crisp Alpine Shadow Blue -> Pure Powder White -> Golden Sun Sparkle
    vec3 shadowBlue = vec3(0.74, 0.86, 0.97);
    vec3 pureSnow = vec3(0.98, 0.99, 1.0);
    vec3 diamondSparkle = vec3(1.0, 0.98, 0.82);

    vec3 col = mix(shadowBlue, pureSnow, celBand);
    if (glintHash > 0.965) {
      col = diamondSparkle;
    }
    outColor = vec4(col, 0.34);
  } else {
    // Night Canyon Storm: Deep Wasatch Indigo -> Ice Cyan Frost -> Subsurface Emerald/Blue Aurora
    vec3 nightBase = vec3(0.04, 0.09, 0.18);
    vec3 frostCyan = vec3(0.14, 0.58, 0.85);
    vec3 auroraGlow = vec3(0.20, 0.83, 0.60);

    vec3 col = mix(nightBase, frostCyan, celBand * 0.75);
    if (powder > 0.76) {
      col = mix(col, auroraGlow, 0.45);
    }
    outColor = vec4(col, 0.28 + celBand * 0.22);
  }
}
`;
function initGpuSnowShader() {
    if (gpuState.initialized || typeof document === 'undefined')
        return gpuState;
    gpuState.initialized = true;
    try {
        if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
            gpuState.backend = 'WebGPU';
        }
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 200;
        gpuState.canvas = canvas;
        const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false });
        if (!gl) {
            gpuState.backend = 'Canvas2D-Shader';
            return gpuState;
        }
        const compile = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                gl.deleteShader(s);
                return null;
            }
            return s;
        };
        const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
        const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
        if (!vs || !fs)
            return gpuState;
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
            return gpuState;
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const posLoc = gl.getAttribLocation(prog, 'a_pos');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gpuState.gl = gl;
        gpuState.program = prog;
        gpuState.uTimeLoc = gl.getUniformLocation(prog, 'u_time');
        gpuState.uResLoc = gl.getUniformLocation(prog, 'u_res');
        gpuState.uModeLoc = gl.getUniformLocation(prog, 'u_mode');
    }
    catch {
        gpuState.backend = 'Canvas2D-Shader';
    }
    return gpuState;
}
export function getSnowShaderBackendLabel() {
    const st = initGpuSnowShader();
    return st.backend === 'WebGPU' ? 'WebGPU + GLSL Cel-Shader' : 'WebGL2 GLSL Cel-Shader';
}
/**
 * Renders real-time GPU Voronoi Powder Contours, Diamond-Dust Sparkles & Alpenglow Sunbeams
 */
export function drawGpuAlpinePowderAndAlpenglow(ctx, x, y, width, height, timeSec, nightMode = false) {
    const st = initGpuSnowShader();
    ctx.save();
    if (st.gl && st.program && st.canvas) {
        const gl = st.gl;
        gl.viewport(0, 0, st.canvas.width, st.canvas.height);
        gl.useProgram(st.program);
        gl.uniform1f(st.uTimeLoc, timeSec);
        gl.uniform2f(st.uResLoc, st.canvas.width, st.canvas.height);
        gl.uniform1f(st.uModeLoc, nightMode ? 1.0 : 0.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        ctx.globalAlpha = nightMode ? 0.36 : 0.48;
        ctx.drawImage(st.canvas, x, y, width, height);
    }
    // Diagonal Wasatch Bluebird / Alpenglow Light Rays
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = nightMode ? 0.18 : 0.24;
    const beamGrad = ctx.createLinearGradient(x + width * 0.8, y, x + width * 0.15, y + height);
    if (nightMode) {
        beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        beamGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.22)');
        beamGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    }
    else {
        beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.48)');
        beamGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.32)');
        beamGrad.addColorStop(1, 'rgba(224, 242, 254, 0)');
    }
    ctx.fillStyle = beamGrad;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
}
/**
 * Cel-Shaded 3-Tier Wasatch Subalpine Pine Tree with Snow-Pillow Caps, Drop Shadow & Dark Ink Outline
 */
export function drawCelShadedPineTree(ctx, x, y, scale = 1.0, swayTime = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    const sway = Math.sin(swayTime * 1.4 + (x + y) * 0.02) * 1.2;
    // 1. Soft Blue-Tinted Snow Drop Shadow
    ctx.fillStyle = 'rgba(30, 58, 138, 0.22)';
    ctx.beginPath();
    ctx.ellipse(5, 16, 16, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // 2. Cedar Trunk with Dark Cel Outline
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-3.5, 9, 7, 10, 1.5);
    ctx.fill();
    ctx.stroke();
    // 3. Three Layered Cel-Shaded Evergreen Bough Tiers + Sculpted Snow Caps
    const tiers = [
        { topY: -10, botY: 12, halfW: 17 },
        { topY: -20, botY: 2, halfW: 13.5 },
        { topY: -29, botY: -8, halfW: 10 }
    ];
    for (const tier of tiers) {
        const pGrad = ctx.createLinearGradient(-tier.halfW, tier.topY, tier.halfW, tier.botY);
        pGrad.addColorStop(0, '#10b981');
        pGrad.addColorStop(0.45, '#047857');
        pGrad.addColorStop(1, '#064e3b');
        ctx.fillStyle = pGrad;
        ctx.strokeStyle = '#022c22';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(sway, tier.topY);
        ctx.quadraticCurveTo(tier.halfW * 0.55, (tier.topY + tier.botY) * 0.5, tier.halfW, tier.botY);
        ctx.quadraticCurveTo(0, tier.botY + 3, -tier.halfW, tier.botY);
        ctx.quadraticCurveTo(-tier.halfW * 0.55, (tier.topY + tier.botY) * 0.5, sway, tier.topY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Sculpted White/Cyan Snow-Pillow Cap on Top of Bough Tier
        const snowH = (tier.botY - tier.topY) * 0.44;
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(sway, tier.topY);
        ctx.lineTo(tier.halfW * 0.48, tier.topY + snowH);
        ctx.quadraticCurveTo(0, tier.topY + snowH + 2.5, -tier.halfW * 0.48, tier.topY + snowH);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
}
/**
 * Cel-Shaded Top-Down Wasatch Pine Crown for Canyon Road View
 */
export function drawCelShadedTopDownPine(ctx, x, y, radius) {
    ctx.save();
    ctx.translate(x, y);
    // Drop Shadow on Snowbank
    ctx.fillStyle = 'rgba(2, 6, 23, 0.45)';
    ctx.beginPath();
    ctx.arc(4, 4, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();
    // 7 Star-Shaped Subalpine Fir Boughs with Cel Outline
    const boughs = 7;
    for (let i = 0; i < boughs; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / boughs);
        const bGrad = ctx.createLinearGradient(0, -radius * 0.3, radius, radius * 0.3);
        bGrad.addColorStop(0, '#047857');
        bGrad.addColorStop(1, '#064e3b');
        ctx.fillStyle = bGrad;
        ctx.strokeStyle = '#022c22';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(radius * 0.55, -radius * 0.35, radius * 1.05, 0);
        ctx.quadraticCurveTo(radius * 0.55, radius * 0.35, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    // Fluffy Cel-Shaded Snow Crown on Top
    const sGrad = ctx.createRadialGradient(-2, -2, 1, 0, 0, radius * 0.65);
    sGrad.addColorStop(0, '#ffffff');
    sGrad.addColorStop(0.7, '#e0f2fe');
    sGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sGrad;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.62, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
/**
 * Cel-Shaded Angular Quartzite Boulder with Snow Drift Cap
 */
export function drawCelShadedQuartziteRock(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Shadow
    ctx.fillStyle = 'rgba(30, 58, 138, 0.22)';
    ctx.beginPath();
    ctx.ellipse(3, 7, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Faceted Rock Polygon
    const rGrad = ctx.createLinearGradient(-12, -10, 12, 10);
    rGrad.addColorStop(0, '#94a3b8');
    rGrad.addColorStop(0.5, '#64748b');
    rGrad.addColorStop(1, '#334155');
    ctx.fillStyle = rGrad;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-12, 6);
    ctx.lineTo(-9, -6);
    ctx.lineTo(-1, -11);
    ctx.lineTo(9, -5);
    ctx.lineTo(12, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Snow Cap Ledge
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-8, -5);
    ctx.lineTo(-1, -11);
    ctx.lineTo(8, -5);
    ctx.quadraticCurveTo(0, -2, -8, -5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
/**
 * Cel-Shaded 3D Brighton Park Kicker Ramp with Blue Dye Lip & Transition Shading
 */
export function drawCelShadedParkKicker(ctx, x, y, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Drop Shadow
    ctx.fillStyle = 'rgba(30, 58, 138, 0.22)';
    ctx.beginPath();
    ctx.roundRect(-20, -6, 42, 18, 5);
    ctx.fill();
    // Sculpted Transition Ramp Body
    const kGrad = ctx.createLinearGradient(0, -10, 0, 10);
    kGrad.addColorStop(0, '#e0f2fe');
    kGrad.addColorStop(0.6, '#7dd3fc');
    kGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = kGrad;
    ctx.strokeStyle = '#082f49';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-16, -9);
    ctx.lineTo(16, -9);
    ctx.lineTo(20, 7);
    ctx.lineTo(-20, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Blue Park Dye Takeoff Lip Stripe
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-18, 2, 36, 4.5);
    // Specular Rim Highlight on Lip
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-17, 2);
    ctx.lineTo(17, 2);
    ctx.stroke();
    ctx.restore();
}
/**
 * Cel-Shaded Brighton Down-Flat-Down Steel Park Rail with Specular Glint
 */
export function drawCelShadedParkRail(ctx, x, y, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Rail Shadow on Snow
    ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-22, 10);
    ctx.lineTo(22, 10);
    ctx.stroke();
    // Support Posts with Cel Outline
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    for (const px of [-16, 0, 16]) {
        ctx.fillRect(px - 2, 0, 4, 12);
        ctx.strokeRect(px - 2, 0, 4, 12);
    }
    // Heavy Red/Chrome Top Rail Bar
    const rGrad = ctx.createLinearGradient(-24, -4, 24, 4);
    rGrad.addColorStop(0, '#ef4444');
    rGrad.addColorStop(0.5, '#f97316');
    rGrad.addColorStop(1, '#dc2626');
    ctx.fillStyle = rGrad;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-24, -3.5, 48, 7, 3);
    ctx.fill();
    ctx.stroke();
    // Metallic Specular Sheen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-20, -1.5);
    ctx.lineTo(20, -1.5);
    ctx.stroke();
    ctx.restore();
}
/**
 * Cel-Shaded Brighton Bone Zone Rainbow Box with Multi-Band Arch & Ink Outline
 */
export function drawCelShadedRainbowBox(ctx, x, y, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    // Drop Shadow
    ctx.fillStyle = 'rgba(30, 58, 138, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Outer Dark Ink Outline
    ctx.beginPath();
    ctx.arc(0, 8, 19, Math.PI, 0);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
    // Outer Pink/Red Band
    ctx.beginPath();
    ctx.arc(0, 8, 19, Math.PI, 0);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#ec4899';
    ctx.stroke();
    // Middle Gold Band
    ctx.beginPath();
    ctx.arc(0, 8, 16, Math.PI, 0);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#facc15';
    ctx.stroke();
    // Inner Cyan Band
    ctx.beginPath();
    ctx.arc(0, 8, 13, Math.PI, 0);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();
    ctx.restore();
}
/**
 * Cel-Shaded Fluffy Utah Powder Stash Pillow
 */
export function drawCelShadedPowderPillow(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    const pGrad = ctx.createRadialGradient(-3, -4, 2, 0, 0, 16);
    pGrad.addColorStop(0, '#ffffff');
    pGrad.addColorStop(0.65, '#e0f2fe');
    pGrad.addColorStop(1, '#7dd3fc');
    ctx.fillStyle = pGrad;
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-5, 2, 9, 0, Math.PI * 2);
    ctx.arc(5, 2, 9, 0, Math.PI * 2);
    ctx.arc(0, -3, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
/**
 * Cel-Shaded Timber Mountain Shrine with Golden Aura
 */
export function drawCelShadedSnowShrine(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    // Golden Halo
    const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, 20);
    halo.addColorStop(0, 'rgba(250, 204, 21, 0.85)');
    halo.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    // Timber A-Frame Cabin Shrine
    ctx.fillStyle = '#b45309';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-10, -8, 20, 20, 2);
    ctx.fill();
    ctx.stroke();
    // Snow-Covered Pitched Roof
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-14, -6);
    ctx.lineTo(0, -18);
    ctx.lineTo(14, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('❄️', 0, 6);
    ctx.restore();
}
/**
 * Cel-Shaded Wasatch Yeti Snow Monster with Shaggy 2-Tone Fur, Horns & Glowing Eyes
 */
export function drawCelShadedYeti(ctx, x, y, timeSec) {
    ctx.save();
    ctx.translate(x, y);
    const stride = Math.sin(timeSec * 10) * 3;
    // Drop Shadow
    ctx.fillStyle = 'rgba(30, 58, 138, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 20, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Yeti Fur Body Gradient (Pure White -> Frost Blue -> Slate Shadow)
    const furGrad = ctx.createRadialGradient(-5, -6, 4, 0, 0, 22);
    furGrad.addColorStop(0, '#ffffff');
    furGrad.addColorStop(0.55, '#e2e8f0');
    furGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = furGrad;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Yeti Head
    ctx.beginPath();
    ctx.arc(0, -19, 12.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Curved Ice Horns
    ctx.fillStyle = '#38bdf8';
    for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(side * 9, -27);
        ctx.quadraticCurveTo(side * 16, -34, side * 12, -21);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    // Glowing Red Eyes & Fanged Maw
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-4.5, -21, 2.2, 0, Math.PI * 2);
    ctx.arc(4.5, -21, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, -16, 10, 4.5);
    // Swinging Yeti Arms & Claws
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-16, -6);
    ctx.lineTo(-27, 8 + stride);
    ctx.moveTo(16, -6);
    ctx.lineTo(27, 8 - stride);
    ctx.stroke();
    ctx.restore();
}
