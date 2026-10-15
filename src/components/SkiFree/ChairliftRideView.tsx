import React, { useState, useEffect, useRef } from 'react'
import {
  SNOWBOARDS_LIST,
  RIDERS_LIST,
  type Snowboard,
  type RiderPro
} from '../../data/snowboardGear'
import { SURF_SPOTS, type SurfSpotId } from '../../types/game'
import {
  Sparkles,
  Volume2,
  Waves,
  ArrowRight,
  Flame,
  ArrowLeft,
  Trophy
} from 'lucide-react'
import confetti from 'canvas-confetti'
import {
  drawGpuOceanCausticsAndSunbeams,
  drawFoamLaceStrip,
  drawCelShadedDolphin,
  drawCelShadedSeaTurtle,
  drawCelShadedPelican,
  drawCelShadedUmbrellaAndSunbather,
  drawCelShadedLifeguardTower,
  drawCelShadedPalmTree
} from '../../utils/oceanShaderEngine'

interface Props {
  selectedBoardId: string;
  selectedRiderId: string;
  selectedSpotId?: SurfSpotId;
  onSelectSpot?: (spotId: SurfSpotId) => void;
  onDropInFromSummit: () => void;
  onReturnToDrive: () => void;
  onAddScore: (points: number) => void;
}

interface LineupSurfer {
  id: number;
  x: number;
  y: number;
  trick: string;
  boardColor: string;
  wetsuitColor: string;
  isLocal: boolean;
}

export const ChairliftRideView: React.FC<Props> = ({
  selectedBoardId,
  selectedRiderId,
  selectedSpotId = 'trestles_wsl',
  onSelectSpot,
  onDropInFromSummit,
  onReturnToDrive,
  onAddScore
}) => {
  const board: Snowboard = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0]
  const rider: RiderPro = RIDERS_LIST.find(r => r.id === selectedRiderId) || RIDERS_LIST[0]
  const activeSpot = SURF_SPOTS.find(s => s.id === selectedSpotId) || SURF_SPOTS[2]

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [swellSetProgress, setSwellSetProgress] = useState<number>(15)
  const [shellsCollected, setShellsCollected] = useState<number>(3)
  const [shoutText, setShoutText] = useState<string | null>(null)
  const [activeCheerResponse, setActiveCheerResponse] = useState<string | null>(null)

  const getLineupComment = () => {
    if (activeSpot.id === 'dana_point') {
      return "Look at the dolphins and sea turtles cruising right through the Dana Point lineup! Smooth, long walls—perfect for styling out or pulling into an inside shorebreak tube."
    }
    if (activeSpot.id === 'san_clemente_pier') {
      return "San Clemente Pier is firing right against the pilings! Watch the Pier Rat locals on the north side, Wave to the lifeguard on Tower 1, and boost off the closeout ramp!"
    }
    return "WSL Finals Day at Lower Trestles! The beach is packed with cheering fans, sunbathers, kids playing in the shorebreak, and the judges tower is throwing 9s and 10s!"
  }

  const lineupSurfersRef = useRef<LineupSurfer[]>([
    { id: 1, x: 240, y: 210, trick: 'Deep Tube 9.6!', boardColor: '#22d3ee', wetsuitColor: '#0f172a', isLocal: false },
    { id: 2, x: 470, y: 155, trick: 'Full Rotation Air!', boardColor: '#facc15', wetsuitColor: '#ef4444', isLocal: false },
    { id: 3, x: 670, y: 250, trick: 'LOCAL: MY WAVE!', boardColor: '#a855f7', wetsuitColor: '#1e293b', isLocal: true }
  ])

  const handleShoutDown = () => {
    const shouts = ['YEWWWWWWW! 🤙', 'GET BARRELED!', '10 POINT RIDE!', 'PRAY FOR THE OCEAN! 🌊']
    const picked = shouts[Math.floor(Math.random() * shouts.length)]
    setShoutText(picked)
    onAddScore(100)

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22d3ee', '#facc15', '#34d399', '#ffffff']
      })
    } catch {
      // Confetti fallback
    }

    const responses = [
      'WSL Crowd on the beach erupts with airhorns! 📣',
      'California Lifeguard on the tower throws a huge shaka! 🛟🤙',
      'Pod of Dolphins leaps out of the set wave! 🐬',
      'Groms playing in the shorebreak cheer back: "YEWWW!" 🏖️'
    ]
    const resp = responses[Math.floor(Math.random() * responses.length)]
    setActiveCheerResponse(resp)

    setTimeout(() => {
      setShoutText(null)
      setActiveCheerResponse(null)
    }, 2500)
  }

  const handleCollectSeashell = () => {
    setShellsCollected(c => c + 1)
    onAddScore(150)
    setActiveCheerResponse('🐚 Found a sparkling Pacific Cowrie Seashell & Sand Dollar by the tidepools! (+150 Pts)')
    setTimeout(() => {
      setActiveCheerResponse(null)
    }, 2400)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let waveTime = 0

    const render = () => {
      const width = canvas.width
      const height = canvas.height
      const timeSec = Date.now() * 0.001

      waveTime += 1.5
      const progress = Math.min(100, Math.floor((waveTime / 1400) * 100))
      setSwellSetProgress(progress)

      // 1. GOLDEN-HOUR ORANGE COUNTY SKY & HORIZON (Top 18%)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.2)
      skyGrad.addColorStop(0, '#0369a1')
      skyGrad.addColorStop(0.55, '#38bdf8')
      skyGrad.addColorStop(1, '#fef08a')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, width, height * 0.2)

      // Glowing Cel-Shaded Sun & Halo
      const sunX = width * 0.82
      const sunY = 48
      const sunHalo = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 68)
      sunHalo.addColorStop(0, 'rgba(254, 240, 138, 0.9)')
      sunHalo.addColorStop(0.5, 'rgba(251, 146, 60, 0.35)')
      sunHalo.addColorStop(1, 'rgba(251, 146, 60, 0)')
      ctx.fillStyle = sunHalo
      ctx.beginPath()
      ctx.arc(sunX, sunY, 68, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fef08a'
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(sunX, sunY, 24, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Cel-Shaded Pelicans flying in formation across the sky
      for (let b = 0; b < 5; b++) {
        const bx = ((waveTime * 0.9 + b * 175) % (width + 60)) - 30
        const by = 32 + (b % 3) * 18 + Math.sin(waveTime * 0.04 + b) * 5
        drawCelShadedPelican(ctx, bx, by, timeSec, b)
      }

      // 2. TURQUOISE PACIFIC OCEAN + WEBGPU/GLSL CAUSTICS & SUNBEAMS (Middle 18% to 66%)
      const oceanGrad = ctx.createLinearGradient(0, height * 0.18, 0, height * 0.68)
      oceanGrad.addColorStop(0, '#082f49')
      oceanGrad.addColorStop(0.35, '#0369a1')
      oceanGrad.addColorStop(0.7, '#0891b2')
      oceanGrad.addColorStop(1, '#67e8f9')
      ctx.fillStyle = oceanGrad
      ctx.fillRect(0, height * 0.18, width, height * 0.5)

      drawGpuOceanCausticsAndSunbeams(ctx, 0, height * 0.18, width, height * 0.48, timeSec)

      // Rolling Cel-Shaded Corduroy Swell Sets & Hollow Whitewater Tubes
      for (let w = 0; w < 4; w++) {
        const wy = height * 0.22 + ((waveTime * 0.7 + w * 72) % (height * 0.42))
        // Trough shadow
        ctx.strokeStyle = 'rgba(8, 47, 73, 0.45)'
        ctx.lineWidth = 11
        ctx.beginPath()
        ctx.moveTo(0, wy + 5)
        ctx.quadraticCurveTo(width * 0.5, wy + 17, width, wy + 1)
        ctx.stroke()

        // Subsurface turquoise wave cylinder
        ctx.strokeStyle = '#22d3ee'
        ctx.lineWidth = 7
        ctx.beginPath()
        ctx.moveTo(0, wy)
        ctx.quadraticCurveTo(width * 0.5, wy + 12, width, wy - 4)
        ctx.stroke()

        // Lacy foaming whitewater lip
        drawFoamLaceStrip(ctx, 0, wy - 4, width, wy - 7, timeSec + w)
      }

      // Spot-specific Ocean Structure (San Clemente Pier Pilings or Dana Point Breakwater)
      if (activeSpot.id === 'san_clemente_pier') {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.35)'
        ctx.fillRect(92, height * 0.16, 48, height * 0.58)

        const pierGrad = ctx.createLinearGradient(85, 0, 131, 0)
        pierGrad.addColorStop(0, '#78350f')
        pierGrad.addColorStop(0.5, '#b45309')
        pierGrad.addColorStop(1, '#451a03')
        ctx.fillStyle = pierGrad
        ctx.fillRect(85, height * 0.16, 46, height * 0.58)
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 2.5
        ctx.strokeRect(85, height * 0.16, 46, height * 0.58)
        ctx.fillStyle = '#fde047'
        ctx.font = 'bold 9px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('SC PIER', 108, height * 0.22)
      }

      // 3. CEL-SHADED DOLPHINS & SEA TURTLES SWIMMING IN THE LINEUP!
      for (let d = 0; d < 3; d++) {
        const dx = ((waveTime * 1.1 + d * 290) % (width - 140)) + 70
        const dy = height * 0.27 + d * 55 + Math.sin(waveTime * 0.05 + d) * 10
        drawCelShadedDolphin(ctx, dx, dy, timeSec, d)
      }

      for (let t = 0; t < 3; t++) {
        const tx = width - ((waveTime * 0.6 + t * 260) % (width - 120))
        const ty = height * 0.42 + (t % 2) * 52 + Math.cos(waveTime * 0.04 + t) * 6
        drawCelShadedSeaTurtle(ctx, tx, ty, timeSec, t)
      }

      // 4. LINEUP SURFERS & LOCALS SHREDDING WAVES
      for (const ls of lineupSurfersRef.current) {
        drawLineupSurfer(ctx, ls, waveTime)
      }

      // 5. GOLDEN SANDY BEACH, SHOREBREAK FOAM, CEL-SHADED UMBRELLAS, PALMS & LIFEGUARD TOWER
      const beachY = height * 0.64
      const wetGrad = ctx.createLinearGradient(0, beachY - 14, 0, beachY + 18)
      wetGrad.addColorStop(0, '#67e8f9')
      wetGrad.addColorStop(0.5, '#bae6fd')
      wetGrad.addColorStop(1, '#d97706')
      ctx.fillStyle = wetGrad
      ctx.fillRect(0, beachY - 14, width, 32)

      const sandGrad = ctx.createLinearGradient(0, beachY + 12, 0, height)
      sandGrad.addColorStop(0, '#fde68a')
      sandGrad.addColorStop(0.5, '#fef08a')
      sandGrad.addColorStop(1, '#fcd34d')
      ctx.fillStyle = sandGrad
      ctx.fillRect(0, beachY + 12, width, height - beachY)

      drawFoamLaceStrip(ctx, 0, beachY - 6, width, beachY - 4, timeSec)

      // Swaying Cel-Shaded Coastal Palm Trees framing the beach
      drawCelShadedPalmTree(ctx, 56, beachY + 58, 28, timeSec)
      drawCelShadedPalmTree(ctx, width - 58, beachY + 54, 28, timeSec + 1.2)

      // Cel-Shaded Sunbathers on Striped Beach Towels under 8-Panel Umbrellas!
      const umbrellaPositions = [135, 305, 655, 825]
      umbrellaPositions.forEach((ux, idx) => {
        drawCelShadedUmbrellaAndSunbather(ctx, ux, beachY + 76 + (idx % 2) * 10, idx)
      })

      // Cel-Shaded 3D California Lifeguard Tower
      drawBeachLifeguardTower(ctx, 745, beachY + 42)

      // WSL Finals Judges Tower & Cheering Beach Fans Crowd!
      drawWslFansAndJudgesBooth(ctx, 210, beachY + 42, !!activeSpot.isWslEvent, waveTime)

      // 6. FOREGROUND: PLAYER & PRO BUDDY WITH THEIR SURFBOARD / BOOGIE BOARD READY TO PADDLE OUT
      drawPlayerAndProOnBeach(ctx, width / 2, height * 0.82, board, rider)

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [board, rider, activeSpot])

  return (
    <div className="relative w-full h-full min-h-[580px] bg-slate-900 flex flex-col font-mono select-none overflow-hidden">
      {/* TOP HEADER HUD */}
      <header className="z-20 bg-slate-950/90 border-b border-cyan-900/60 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0 max-w-full">
          <button
            onClick={onReturnToDrive}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back<span className="hidden sm:inline"> to PCH</span></span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 shrink-0 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-white text-sm truncate">
              {activeSpot.name.toUpperCase()}
            </span>
            {activeSpot.isWslEvent && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/20 border border-amber-400 text-amber-300 font-bold">
                <Trophy className="w-3 h-3" /> WSL FINALS
              </span>
            )}
          </div>
        </div>

        {/* Spot Switcher Pills: Dana Point | San Clemente Pier | Lower Trestles WSL */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {SURF_SPOTS.map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSelectSpot?.(spot.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                spot.id === activeSpot.id
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spot.shortName}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto max-sm:*:justify-center max-sm:*:py-2">
          <button
            onClick={handleCollectSeashell}
            className="px-2.5 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 border border-teal-500 text-teal-200 font-bold flex items-center gap-1 cursor-pointer shadow-md transition-all"
            title="Collect seashells along the shoreline"
          >
            <span>🐚</span>
            <span>SHELLS ({shellsCollected})</span>
          </button>

          <button
            onClick={handleShoutDown}
            className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            title="Cheer with the beach fans & lifeguards"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>CHEER LINEUP</span>
          </button>

          <button
            onClick={onDropInFromSummit}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-300 hover:from-cyan-300 hover:to-amber-200 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow-glow-ice transition-all transform hover:scale-[1.02]"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>PADDLE OUT!</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </header>

      {/* MAIN BEACH & LINEUP OVERLOOK CANVAS */}
      <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={960}
          height={600}
          className="w-full h-full object-cover max-w-full max-h-full shadow-2xl"
        />

        {/* Floating Pro Buddy Lineup Check */}
        <div className="absolute top-4 right-4 z-20 max-w-md bg-slate-950/90 border border-cyan-500/40 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span>{rider.iconEmoji}</span>
              <span>{rider.name} Checking the Lineup:</span>
            </div>
            <span className="text-[10px] text-amber-300 font-mono">
              {activeSpot.waveHeight} &bull; {activeSpot.swellPeriod}
            </span>
          </div>
          <p className="text-slate-200 italic leading-relaxed">
            "{getLineupComment()}"
          </p>
        </div>

        {/* Yell / Seashell Response Banner */}
        {shoutText && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-6 py-2.5 rounded-full bg-amber-950/95 border-2 border-amber-400 text-amber-300 font-black text-sm shadow-2xl animate-bounce flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>YOU YELL TO THE LINEUP: "{shoutText}"</span>
          </div>
        )}

        {activeCheerResponse && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-2xl bg-cyan-950/95 border border-cyan-400 text-cyan-200 font-mono text-xs shadow-glow-ice animate-fadeIn">
            {activeCheerResponse}
          </div>
        )}

        {/* Outside Set Horizon Alert */}
        {swellSetProgress >= 85 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 px-6 py-3 rounded-2xl bg-slate-950/95 border-2 border-cyan-400 text-white font-mono text-center space-y-2 shadow-2xl animate-pulse">
            <div className="text-cyan-300 font-black text-sm flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>OUTSIDE 8-FOOT SET STACKING ON THE HORIZON AT {activeSpot.shortName.toUpperCase()}!</span>
            </div>
            <button
              onClick={onDropInFromSummit}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-amber-300 hover:from-cyan-300 hover:to-amber-200 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-glow-ice transition-all"
            >
              PADDLE OUT &amp; DROP INTO THE SET WAVE! 🏄🌊
            </button>
          </div>
        )}

        {/* Bottom ecosystem indicator */}
        <div className="absolute bottom-3 left-4 z-20 px-3 py-1 rounded-full bg-slate-950/85 border border-slate-800 text-[11px] text-cyan-300">
          Beach &amp; Lineup: <strong>WSL Fans &bull; Sunbathers &bull; Kids in Ocean &bull; Lifeguard Tower &bull; Dolphins 🐬 &bull; Turtles 🐢 &bull; Seashells 🐚</strong>
        </div>
      </main>
    </div>
  )
}

function drawLineupSurfer(ctx: CanvasRenderingContext2D, ls: LineupSurfer, waveTime: number) {
  ctx.save()
  const sx = ((ls.x + Math.sin(waveTime * 0.02 + ls.id) * 65))
  const sy = ls.y + Math.cos(waveTime * 0.03 + ls.id) * 14

  ctx.translate(sx, sy)

  // Whitewater spray trail behind board
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.beginPath()
  ctx.ellipse(-14, 4, 14, 5, -0.2, 0, Math.PI * 2)
  ctx.fill()

  // Surfboard
  ctx.save()
  ctx.rotate(-0.2)
  ctx.beginPath()
  ctx.ellipse(0, 4, 16, 5, 0, 0, Math.PI * 2)
  ctx.fillStyle = ls.boardColor
  ctx.fill()
  ctx.strokeStyle = '#020617'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()

  // Surfer body
  ctx.fillStyle = ls.wetsuitColor
  ctx.beginPath()
  ctx.arc(0, -4, 5, 0, Math.PI * 2)
  ctx.fill()

  // Callout tag
  ctx.fillStyle = ls.isLocal ? 'rgba(127, 29, 29, 0.9)' : 'rgba(15, 23, 42, 0.88)'
  ctx.fillRect(-42, -26, 84, 14)
  ctx.strokeStyle = ls.isLocal ? '#ef4444' : '#22d3ee'
  ctx.lineWidth = 1
  ctx.strokeRect(-42, -26, 84, 14)

  ctx.fillStyle = ls.isLocal ? '#fca5a5' : '#67e8f9'
  ctx.font = 'bold 8px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(ls.trick, 0, -16)

  ctx.restore()
}

function drawBeachLifeguardTower(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(1.25, 1.25)
  drawCelShadedLifeguardTower(ctx, 0, 0)
  ctx.restore()
}

function drawWslFansAndJudgesBooth(ctx: CanvasRenderingContext2D, x: number, y: number, isWsl: boolean, waveTime: number) {
  ctx.save()
  ctx.translate(x, y)

  // WSL / Beach Pavilion Banner
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(-68, -28, 136, 36)
  ctx.strokeStyle = isWsl ? '#facc15' : '#22d3ee'
  ctx.lineWidth = 2
  ctx.strokeRect(-68, -28, 136, 36)

  ctx.fillStyle = isWsl ? '#facc15' : '#67e8f9'
  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(isWsl ? '🏆 WSL JUDGES & VIP FANS' : '🏖️ OC BEACH FANS & LOCALS', 0, -14)

  // Cheering fans bouncing along the sand
  const fanEmojis = ['🙌', '🎉', '🏄‍♀️', '📣', '🤙']
  fanEmojis.forEach((em, idx) => {
    const fy = Math.sin(waveTime * 0.1 + idx) * 2
    ctx.font = '13px sans-serif'
    ctx.fillText(em, -44 + idx * 22, 2 + fy)
  })

  ctx.restore()
}

function drawPlayerAndProOnBeach(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  board: Snowboard,
  rider: RiderPro
) {
  ctx.save()
  ctx.translate(x, y)

  // Wood boardwalk / beach mat platform
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
  ctx.beginPath()
  ctx.roundRect(-130, -28, 260, 74, 14)
  ctx.fill()
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 2
  ctx.stroke()

  // Player's Surfboard or Boogie Board
  ctx.save()
  ctx.translate(-75, 8)
  if (board.craftType === 'boogie') {
    ctx.beginPath()
    ctx.roundRect(-12, -24, 24, 48, 4)
    ctx.fillStyle = board.accentColor
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.moveTo(0, -34)
    ctx.quadraticCurveTo(11, -10, 9, 28)
    ctx.lineTo(-9, 28)
    ctx.quadraticCurveTo(-11, -10, 0, -34)
    ctx.closePath()
    ctx.fillStyle = board.accentColor
    ctx.fill()
  }
  ctx.restore()

  // Text summary
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 11px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`YOU & ${rider.name.toUpperCase()}`, 15, -6)

  ctx.fillStyle = '#67e8f9'
  ctx.font = 'bold 9px monospace'
  ctx.fillText(`${board.craftType === 'boogie' ? 'BOOGIE BOARD:' : 'SURFBOARD:'} ${board.name}`, 15, 12)

  ctx.fillStyle = '#fde047'
  ctx.font = 'bold 9px monospace'
  ctx.fillText('READY TO PADDLE OUT & SHRED! 🤙', 15, 28)

  ctx.restore()
}
