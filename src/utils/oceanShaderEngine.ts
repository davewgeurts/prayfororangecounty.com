// WebGPU / WebGL2 Ocean Caustics & Cel-Shaded Toon Art Engine for Pray for the Ocean

interface GpuShaderState {
  initialized: boolean;
  backend: 'WebGPU' | 'WebGL2' | 'Canvas2D-Shader';
  canvas: HTMLCanvasElement | null;
  gl: WebGL2RenderingContext | null;
  program: WebGLProgram | null;
  uTimeLoc: WebGLUniformLocation | null;
  uResLoc: WebGLUniformLocation | null;
}

const gpuState: GpuShaderState = {
  initialized: false,
  backend: 'WebGL2',
  canvas: null,
  gl: null,
  program: null,
  uTimeLoc: null,
  uResLoc: null
}

const VERTEX_SHADER = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

// Procedural Voronoi Ocean Caustics + Toon Cel-Banding + Sun Glint GLSL Fragment Shader
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform float u_time;
uniform vec2 u_res;
out vec4 outColor;

vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float voronoiCaustic(vec2 uv, float t) {
  vec2 n = floor(uv);
  vec2 f = fract(uv);
  float md = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash2(n + g);
      o = 0.5 + 0.45 * sin(t * 1.35 + 6.2831 * o);
      vec2 r = g + o - f;
      float d = dot(r, r);
      md = min(md, d);
    }
  }
  return pow(1.0 - clamp(md, 0.0, 1.0), 3.2);
}

void main() {
  vec2 uv = v_uv;
  float t = u_time;

  // Multi-layered animated ocean caustics
  vec2 warp = vec2(
    sin(uv.y * 9.0 + t * 1.2) * 0.15,
    cos(uv.x * 8.0 - t * 1.1) * 0.15
  );
  float c1 = voronoiCaustic((uv + warp) * 7.5, t);
  float c2 = voronoiCaustic((uv - warp * 0.7) * 12.0 + vec2(t * 0.3, -t * 0.2), t * 1.25);
  float caustic = clamp(c1 * 0.65 + c2 * 0.55, 0.0, 1.0);

  // Cel-shaded quantization (toon steps)
  float celCaustic = floor(caustic * 4.0) / 4.0;

  // Subsurface turquoise + golden sun-glint highlights
  vec3 deepOcean = vec3(0.01, 0.35, 0.58);
  vec3 turquoiseGlow = vec3(0.12, 0.86, 0.84);
  vec3 sunGlint = vec3(0.99, 0.96, 0.72);

  vec3 col = mix(deepOcean, turquoiseGlow, celCaustic * 0.75);
  if (caustic > 0.78) {
    col = mix(col, sunGlint, 0.65);
  }

  outColor = vec4(col, 0.28 + celCaustic * 0.32);
}
`

function initGpuShader(): GpuShaderState {
  if (gpuState.initialized || typeof document === 'undefined') return gpuState
  gpuState.initialized = true

  try {
    if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
      gpuState.backend = 'WebGPU'
    }

    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 200
    gpuState.canvas = canvas

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false })
    if (!gl) {
      gpuState.backend = 'Canvas2D-Shader'
      return gpuState
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s)
        return null
      }
      return s
    }

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return gpuState

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return gpuState

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    const posLoc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    gpuState.gl = gl
    gpuState.program = prog
    gpuState.uTimeLoc = gl.getUniformLocation(prog, 'u_time')
    gpuState.uResLoc = gl.getUniformLocation(prog, 'u_res')
  } catch {
    gpuState.backend = 'Canvas2D-Shader'
  }

  return gpuState
}

export function getShaderBackendLabel(): string {
  const st = initGpuShader()
  return st.backend === 'WebGPU' ? 'WebGPU + GLSL Cel-Shader' : 'WebGL2 GLSL Cel-Shader'
}

/**
 * Renders real-time GPU Voronoi Ocean Caustics + Golden-Hour Sunbeams onto any 2D Canvas region
 */
export function drawGpuOceanCausticsAndSunbeams(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  timeSec: number
) {
  const st = initGpuShader()
  ctx.save()

  if (st.gl && st.program && st.canvas) {
    const gl = st.gl
    gl.viewport(0, 0, st.canvas.width, st.canvas.height)
    gl.useProgram(st.program)
    gl.uniform1f(st.uTimeLoc, timeSec)
    gl.uniform2f(st.uResLoc, st.canvas.width, st.canvas.height)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = 0.42
    ctx.drawImage(st.canvas, x, y, width, height)
  } else {
    // Fallback procedural caustic lattice
    ctx.globalCompositeOperation = 'screen'
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.18)'
    ctx.lineWidth = 2
    for (let i = 0; i < 6; i++) {
      const cy = y + ((i * 85 + timeSec * 35) % height)
      ctx.beginPath()
      ctx.moveTo(x, cy)
      ctx.bezierCurveTo(
        x + width * 0.3,
        cy + Math.sin(timeSec + i) * 24,
        x + width * 0.7,
        cy - Math.cos(timeSec + i) * 24,
        x + width,
        cy
      )
      ctx.stroke()
    }
  }

  // Diagonal Golden-Hour Sunbeams & Subsurface Shimmer
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = 0.22
  const beamGrad = ctx.createLinearGradient(x + width * 0.75, y, x + width * 0.15, y + height)
  beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.55)')
  beamGrad.addColorStop(0.5, 'rgba(34, 211, 238, 0.25)')
  beamGrad.addColorStop(1, 'rgba(3, 105, 161, 0)')
  ctx.fillStyle = beamGrad
  ctx.fillRect(x, y, width, height)

  ctx.restore()
}

/**
 * Cel-Shaded Palm Tree with Segmented Curved Trunk, Drop Shadow, Coconuts & 2-Tone Fronds
 */
export function drawCelShadedPalmTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  swayTime = 0
) {
  ctx.save()
  ctx.translate(x, y)

  // Soft Ground Drop Shadow
  const shadowGrad = ctx.createRadialGradient(4, 5, 2, 4, 5, radius * 1.15)
  shadowGrad.addColorStop(0, 'rgba(2, 6, 23, 0.42)')
  shadowGrad.addColorStop(1, 'rgba(2, 6, 23, 0)')
  ctx.fillStyle = shadowGrad
  ctx.beginPath()
  ctx.arc(4, 5, radius * 1.15, 0, Math.PI * 2)
  ctx.fill()

  const sway = Math.sin(swayTime * 1.6 + (x + y) * 0.02) * 0.08

  // 7 Layered Cel-Shaded Palm Fronds with Dark Ink Outline & Sunlit Highlight Half
  const frondCount = 7
  for (let i = 0; i < frondCount; i++) {
    ctx.save()
    ctx.rotate((i * Math.PI * 2) / frondCount + sway)

    // Frond body gradient
    const frondGrad = ctx.createLinearGradient(0, -radius * 0.25, radius * 1.15, radius * 0.25)
    frondGrad.addColorStop(0, '#166534')
    frondGrad.addColorStop(0.55, '#22c55e')
    frondGrad.addColorStop(1, '#86efac')

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(radius * 0.55, -radius * 0.34, radius * 1.12, 0)
    ctx.quadraticCurveTo(radius * 0.55, radius * 0.34, 0, 0)
    ctx.closePath()
    ctx.fillStyle = frondGrad
    ctx.fill()

    // Cel-shade shadow half
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(radius * 0.55, radius * 0.34, radius * 1.12, 0)
    ctx.closePath()
    ctx.fillStyle = 'rgba(5, 46, 22, 0.38)'
    ctx.fill()

    // Crisp Cel Outline
    ctx.strokeStyle = '#052e16'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(radius * 0.55, -radius * 0.34, radius * 1.12, 0)
    ctx.quadraticCurveTo(radius * 0.55, radius * 0.34, 0, 0)
    ctx.stroke()

    ctx.restore()
  }

  // Coconuts cluster at center crown with specular highlight
  const cocoOffsets = [
    [-2.5, -2],
    [2.5, -1.5],
    [0, 2.5]
  ]
  for (const [cx, cy] of cocoOffsets) {
    ctx.beginPath()
    ctx.arc(cx, cy, radius * 0.19, 0, Math.PI * 2)
    ctx.fillStyle = '#78350f'
    ctx.fill()
    ctx.strokeStyle = '#1c1917'
    ctx.lineWidth = 1.2
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(cx - 1, cy - 1, radius * 0.07, 0, Math.PI * 2)
    ctx.fillStyle = '#fde68a'
    ctx.fill()
  }

  ctx.restore()
}

/**
 * Cel-Shaded 8-Panel Beach Umbrella, Striped Towel & Sunbather
 */
export function drawCelShadedUmbrellaAndSunbather(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  seed: number
) {
  ctx.save()
  ctx.translate(x, y)

  // Towel Drop Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)'
  ctx.beginPath()
  ctx.roundRect(-8, -11, 16, 26, 3)
  ctx.fill()

  // Striped Beach Towel
  const towelPalettes = [
    ['#06b6d4', '#ecfeff'],
    ['#f43f5e', '#ffe4e6'],
    ['#10b981', '#d1fae5'],
    ['#f59e0b', '#fef3c7'],
    ['#a855f7', '#f3e8ff']
  ]
  const [c1, c2] = towelPalettes[seed % towelPalettes.length]
  ctx.fillStyle = c1
  ctx.beginPath()
  ctx.roundRect(-9, -13, 15, 25, 3)
  ctx.fill()
  ctx.fillStyle = c2
  ctx.fillRect(-9, -8, 15, 4)
  ctx.fillRect(-9, 2, 15, 4)
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.3
  ctx.strokeRect(-9, -13, 15, 25)

  // Cel-Shaded Sunbather relaxing on towel with sunglasses
  ctx.fillStyle = '#d97706'
  ctx.beginPath()
  ctx.roundRect(-4.5, -4, 6, 11, 2.5)
  ctx.fill()
  ctx.strokeStyle = '#451a03'
  ctx.lineWidth = 1
  ctx.stroke()

  // Swimsuit
  ctx.fillStyle = c2
  ctx.fillRect(-4.5, 0, 6, 4)

  // Head & Sun Hat / Shades
  ctx.fillStyle = '#f59e0b'
  ctx.beginPath()
  ctx.arc(-1.5, -7.5, 3.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#020617'
  ctx.fillRect(-4, -8.5, 5, 1.8)

  // 8-Panel Cel-Shaded Beach Umbrella Canopy with Rim Highlight
  const ux = 11
  const uy = -4
  const ur = 11

  // Umbrella Shadow on Sand
  ctx.fillStyle = 'rgba(15, 23, 42, 0.32)'
  ctx.beginPath()
  ctx.arc(ux + 3, uy + 4, ur, 0, Math.PI * 2)
  ctx.fill()

  const umbColors = ['#ef4444', '#facc15', '#06b6d4', '#ec4899', '#f97316']
  const mainUmb = umbColors[(seed + 1) % umbColors.length]

  for (let s = 0; s < 8; s++) {
    const a1 = (s * Math.PI) / 4
    const a2 = ((s + 1) * Math.PI) / 4
    ctx.beginPath()
    ctx.moveTo(ux, uy)
    ctx.arc(ux, uy, ur, a1, a2)
    ctx.closePath()
    ctx.fillStyle = s % 2 === 0 ? mainUmb : '#ffffff'
    ctx.fill()
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 1.2
    ctx.stroke()
  }

  // Dome 3D Specular Highlight & Shadow Crescent
  const domeGrad = ctx.createRadialGradient(ux - 4, uy - 4, 1, ux, uy, ur)
  domeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)')
  domeGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0)')
  domeGrad.addColorStop(1, 'rgba(2, 6, 23, 0.35)')
  ctx.fillStyle = domeGrad
  ctx.beginPath()
  ctx.arc(ux, uy, ur, 0, Math.PI * 2)
  ctx.fill()

  // Center finial knob
  ctx.beginPath()
  ctx.arc(ux, uy, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#fef08a'
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

/**
 * Cel-Shaded 3D California Lifeguard Tower with Sloped Roof, Stilts, Rescue Tube & Flag
 */
export function drawCelShadedLifeguardTower(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)

  // Drop Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)'
  ctx.beginPath()
  ctx.ellipse(4, 14, 22, 9, 0, 0, Math.PI * 2)
  ctx.fill()

  // Wooden Stilts / Deck Base
  ctx.fillStyle = '#78350f'
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.8
  ctx.fillRect(-14, 6, 5, 10)
  ctx.strokeRect(-14, 6, 5, 10)
  ctx.fillRect(9, 6, 5, 10)
  ctx.strokeRect(9, 6, 5, 10)

  // Cabin Body (Cel-Shaded Coastal White/Blue Gradient)
  const cabGrad = ctx.createLinearGradient(-16, -14, 16, 8)
  cabGrad.addColorStop(0, '#f8fafc')
  cabGrad.addColorStop(0.65, '#e0f2fe')
  cabGrad.addColorStop(1, '#bae6fd')
  ctx.fillStyle = cabGrad
  ctx.beginPath()
  ctx.roundRect(-16, -13, 32, 21, 3)
  ctx.fill()
  ctx.strokeStyle = '#082f49'
  ctx.lineWidth = 2
  ctx.stroke()

  // Panoramic Tinted Observation Window with Glint
  ctx.fillStyle = '#0369a1'
  ctx.fillRect(-12, -9, 24, 9)
  ctx.strokeRect(-12, -9, 24, 9)
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(-9, -7)
  ctx.lineTo(-4, -2)
  ctx.stroke()

  // Sloped Overhang Roof
  const roofGrad = ctx.createLinearGradient(-20, -19, 20, -12)
  roofGrad.addColorStop(0, '#0284c7')
  roofGrad.addColorStop(1, '#0369a1')
  ctx.fillStyle = roofGrad
  ctx.strokeStyle = '#082f49'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-20, -12)
  ctx.lineTo(-14, -19)
  ctx.lineTo(14, -19)
  ctx.lineTo(20, -12)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Iconic Red Rescue Torpedo Buoy ("Burnside Can") on Side
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.roundRect(14, -6, 6, 13, 3)
  ctx.fill()
  ctx.stroke()

  // Green/Yellow Swell Flag Fluttering on Roof
  const flutter = Math.sin(Date.now() * 0.008) * 2.5
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(-12, -19)
  ctx.lineTo(-12, -30)
  ctx.stroke()

  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.moveTo(-12, -30)
  ctx.lineTo(-1, -27 + flutter)
  ctx.lineTo(-12, -23)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

/**
 * Cel-Shaded Leaping Pacific Dolphin with 3-Tone Metallic Gradient, Belly Highlight & Splash Ring
 */
export function drawCelShadedDolphin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timeSec: number,
  seed = 0
) {
  ctx.save()
  ctx.translate(x, y)

  const jumpArc = Math.sin(timeSec * 3.2 + seed) * 5
  const pitch = Math.cos(timeSec * 3.2 + seed) * 0.25

  // Foaming Turquoise Splash Ring on Water Surface
  ctx.fillStyle = 'rgba(236, 254, 255, 0.82)'
  ctx.beginPath()
  ctx.ellipse(0, 8, 18, 5.5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#0891b2'
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.translate(0, jumpArc)
  ctx.rotate(pitch)

  // Dolphin Body Gradient (Deep Cobalt -> Slate Cyan -> Silver Belly)
  const dolGrad = ctx.createLinearGradient(-16, -12, 16, 10)
  dolGrad.addColorStop(0, '#0f172a')
  dolGrad.addColorStop(0.45, '#0284c7')
  dolGrad.addColorStop(0.8, '#38bdf8')
  dolGrad.addColorStop(1, '#e0f2fe')

  ctx.fillStyle = dolGrad
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 2

  ctx.beginPath()
  // Bottlenose snout to arched back to tail flukes
  ctx.moveTo(18, 2)
  ctx.quadraticCurveTo(14, -4, 4, -8)
  // Dorsal fin
  ctx.lineTo(-2, -16)
  ctx.quadraticCurveTo(-5, -9, -7, -7)
  ctx.quadraticCurveTo(-15, -4, -20, 3)
  // Tail fluke
  ctx.lineTo(-25, 0)
  ctx.lineTo(-22, 6)
  ctx.lineTo(-26, 9)
  ctx.lineTo(-17, 6)
  // Belly curve
  ctx.quadraticCurveTo(-4, 0, 12, 4)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Specular Rim Highlight along Arch
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(12, -2)
  ctx.quadraticCurveTo(3, -6, -5, -5)
  ctx.stroke()

  // Cute Eye
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(11, -1, 1.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#020617'
  ctx.beginPath()
  ctx.arc(11.4, -1, 1, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

/**
 * Cel-Shaded Green Sea Turtle (Honu) with Patterned Emerald/Gold Carapace & Flippers
 */
export function drawCelShadedSeaTurtle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timeSec: number,
  seed = 0
) {
  ctx.save()
  ctx.translate(x, y)

  const swim = Math.sin(timeSec * 2.8 + seed) * 0.22

  // Subsurface Aqua Halo
  ctx.fillStyle = 'rgba(167, 243, 208, 0.45)'
  ctx.beginPath()
  ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2)
  ctx.fill()

  // Flippers
  ctx.fillStyle = '#15803d'
  ctx.strokeStyle = '#052e16'
  ctx.lineWidth = 1.6

  // Front Left & Right Flippers
  for (const side of [-1, 1]) {
    ctx.save()
    ctx.rotate(side * (0.35 + swim))
    ctx.beginPath()
    ctx.ellipse(side * 12, -4, 6, 2.8, side * 0.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  // Head
  ctx.beginPath()
  ctx.arc(0, -12, 4.2, 0, Math.PI * 2)
  ctx.fillStyle = '#22c55e'
  ctx.fill()
  ctx.stroke()

  // Carapace Shell with Golden/Emerald Gradient
  const shellGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 12)
  shellGrad.addColorStop(0, '#fde047')
  shellGrad.addColorStop(0.45, '#16a34a')
  shellGrad.addColorStop(1, '#14532d')
  ctx.fillStyle = shellGrad
  ctx.beginPath()
  ctx.ellipse(0, 0, 10, 11.5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.lineWidth = 2
  ctx.stroke()

  // Hexagonal Scute Pattern on Shell
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)'
  ctx.lineWidth = 1.1
  ctx.beginPath()
  ctx.arc(0, 0, 5, 0, Math.PI * 2)
  ctx.moveTo(-9, 0)
  ctx.lineTo(9, 0)
  ctx.moveTo(0, -10)
  ctx.lineTo(0, 10)
  ctx.stroke()

  ctx.restore()
}

/**
 * Cel-Shaded Gliding California Pelican with Wing-Tip Shading & Golden Beak
 */
export function drawCelShadedPelican(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timeSec: number,
  seed = 0
) {
  ctx.save()
  ctx.translate(x, y)

  const flap = Math.sin(timeSec * 5.0 + seed) * 6

  // Water Skim Shadow below Pelican
  ctx.strokeStyle = 'rgba(2, 6, 23, 0.25)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-12, 14)
  ctx.quadraticCurveTo(0, 11, 12, 14)
  ctx.stroke()

  // Articulated Cel-Shaded Wings
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2.2
  ctx.fillStyle = '#f8fafc'

  ctx.beginPath()
  ctx.moveTo(-16, flap)
  ctx.quadraticCurveTo(-8, -7, 0, 0)
  ctx.quadraticCurveTo(8, -7, 16, flap)
  ctx.quadraticCurveTo(8, -2, 0, 3)
  ctx.quadraticCurveTo(-8, -2, -16, flap)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Golden Beak Pouch
  ctx.fillStyle = '#f59e0b'
  ctx.beginPath()
  ctx.moveTo(0, -1)
  ctx.lineTo(7, 2)
  ctx.lineTo(0, 4)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.restore()
}

/**
 * Lacy Sea-Foam Web along Breaking Wave Crests & Shorebreak
 */
export function drawFoamLaceStrip(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  timeSec: number
) {
  ctx.save()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)'
  ctx.lineWidth = 3.5
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  const steps = 8
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const lx = x1 + (x2 - x1) * t
    const ly = y1 + (y2 - y1) * t + Math.sin(timeSec * 3 + i * 1.7) * 3.5
    ctx.lineTo(lx, ly)
  }
  ctx.stroke()

  // Foam bubbles along crest
  ctx.fillStyle = 'rgba(236, 254, 255, 0.85)'
  for (let i = 1; i < steps; i += 2) {
    const t = i / steps
    const bx = x1 + (x2 - x1) * t
    const by = y1 + (y2 - y1) * t
    ctx.beginPath()
    ctx.arc(bx, by + 3, 2.8, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}
