import React, { useEffect, useRef, useState } from 'react'
import { Waves, Sparkles, Trophy, ArrowRight, Footprints, ShieldCheck } from 'lucide-react'
import type { OceanBuoyTelemetry } from '../../utils/oceanBuoyFeed'
import {
  drawGpuOceanCausticsAndSunbeams,
  drawCelShadedDolphin,
  drawCelShadedSeaTurtle,
  drawCelShadedPelican,
  drawCelShadedUmbrellaAndSunbather,
  drawCelShadedPalmTree
} from '../../utils/oceanShaderEngine'

interface Props {
  initialSpot: 'thousand_steps' | 'treasure_island';
  craftType: 'surfboard' | 'boogie';
  riderName: string;
  boardName: string;
  buoy: OceanBuoyTelemetry;
  onFinishSession: (earnedPrayers: number, tubesRidden: number) => void;
  onClose: () => void;
}

export const ShorebreakSessionModal: React.FC<Props> = ({
  initialSpot,
  craftType,
  riderName,
  boardName,
  buoy,
  onFinishSession,
  onClose
}) => {
  const [spot, setSpot] = useState<'thousand_steps' | 'treasure_island'>(initialSpot)
  const [mode, setMode] = useState<'boogie' | 'surfboard'>(craftType)
  const [tubesMade, setTubesMade] = useState<number>(0)
  const [earnedPrayers, setEarnedPrayers] = useState<number>(0)
  const [statusBanner, setStatusBanner] = useState<string>(
    'Walked down the 219 cliff stairs! Time your drop into the incoming shorebreak wedge!'
  )
  const [tubeMeter, setTubeMeter] = useState<number>(0)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef({
    waveX: 620,
    waveSpeed: 3.4,
    wavePhase: 'incoming' as 'incoming' | 'barreling' | 'spit',
    playerX: 150,
    playerY: 205,
    playerState: 'sand' as 'sand' | 'charging' | 'in_tube' | 'air_rollo',
    timer: 0,
    shellsCollected: 0
  })

  const triggerDropIn = () => {
    const g = gameRef.current
    if (g.playerState === 'sand') {
      g.playerState = 'charging'
      g.timer = 0
      setStatusBanner(
        mode === 'boogie'
          ? '🌊 Sprinting into the shorebreak with Viper swimfins—tucking under the lip!'
          : '🏄‍♂️ Charging across the wet sand & pulling straight into the shorebreak barrel!'
      )
    } else if (g.playerState === 'in_tube') {
      g.playerState = 'air_rollo'
      g.timer = 32
      const bonus = mode === 'boogie' ? 280 : 250
      setEarnedPrayers(p => p + bonus)
      setTubesMade(t => t + 1)
      setStatusBanner(
        mode === 'boogie'
          ? `🔥 SPIT OUT OF THE CAVE INTO A HUGE EL ROLLO! (+${bonus} Ocean Prayers)`
          : `🔥 BLOWN OUT OF THE SHOREBREAK GREEN ROOM! (+${bonus} Ocean Prayers)`
      )
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowRight' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        triggerDropIn()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let frame = 0

    const loop = () => {
      frame++
      const w = canvas.width
      const h = canvas.height
      const g = gameRef.current
      const timeSec = Date.now() * 0.001

      // 1. Sky & South Laguna Cliff Backdrop
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55)
      if (spot === 'thousand_steps') {
        sky.addColorStop(0, '#082f49')
        sky.addColorStop(0.65, '#0284c7')
        sky.addColorStop(1, '#fde047')
      } else {
        sky.addColorStop(0, '#134e4a')
        sky.addColorStop(0.65, '#0d9488')
        sky.addColorStop(1, '#fef08a')
      }
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)

      // Glowing Cel-Shaded California Sun
      ctx.fillStyle = '#fef08a'
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(w - 90, 52, 26, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Cel-Shaded Pelicans gliding across the horizon
      const birdX = ((frame * 1.4) % (w + 80)) - 40
      drawCelShadedPelican(ctx, birdX, 52, timeSec, 0)
      drawCelShadedPelican(ctx, birdX - 28, 62, timeSec, 1.4)

      // 2. Turquoise Cove Water + WebGPU/GLSL Ocean Caustics & Sunbeams
      const ocean = ctx.createLinearGradient(140, h * 0.45, w, h)
      ocean.addColorStop(0, '#67e8f9')
      ocean.addColorStop(0.45, '#06b6d4')
      ocean.addColorStop(1, '#082f49')
      ctx.fillStyle = ocean
      ctx.fillRect(140, h * 0.46, w - 140, h * 0.54)

      drawGpuOceanCausticsAndSunbeams(ctx, 140, h * 0.46, w - 140, h * 0.54, timeSec)

      // Cel-Shaded Dolphins & Sea Turtles in the background cove
      const dolphinY = h * 0.54 + Math.sin(frame * 0.06) * 8
      drawCelShadedDolphin(ctx, w - 135, dolphinY, timeSec, 1)
      drawCelShadedSeaTurtle(ctx, w - 235, h * 0.62 + Math.cos(frame * 0.05) * 5, timeSec, 2)

      // 3. Wet Golden Sand & Cliff Stairs / Keyhole Arch on Left
      const sandGrad = ctx.createLinearGradient(0, h * 0.38, 240, h)
      sandGrad.addColorStop(0, '#fef08a')
      sandGrad.addColorStop(0.6, '#fde68a')
      sandGrad.addColorStop(1, '#f59e0b')
      ctx.fillStyle = sandGrad
      ctx.beginPath()
      ctx.moveTo(0, h * 0.38)
      ctx.lineTo(235, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      if (spot === 'thousand_steps') {
        // 219 Steep Cliff Stairs + Sea Cave with Cel Outline
        ctx.fillStyle = '#365314'
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(0, 30)
        ctx.lineTo(135, 95)
        ctx.lineTo(165, 225)
        ctx.lineTo(0, 225)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 7
        ctx.setLineDash([5, 4])
        ctx.beginPath()
        ctx.moveTo(18, 45)
        ctx.lineTo(142, 215)
        ctx.stroke()
        ctx.setLineDash([])

        drawCelShadedPalmTree(ctx, 32, 46, 18, timeSec)

        ctx.fillStyle = '#0f172a'
        ctx.font = 'bold 10px monospace'
        ctx.fillText('219 CLIFF STAIRS', 14, 240)
      } else {
        // Treasure Island Montage Keyhole Rock Arch with Cel Outline
        ctx.fillStyle = '#92400e'
        ctx.strokeStyle = '#0f172a'
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(20, 225)
        ctx.lineTo(40, 95)
        ctx.quadraticCurveTo(85, 70, 125, 95)
        ctx.lineTo(145, 225)
        ctx.lineTo(105, 225)
        ctx.lineTo(98, 150)
        ctx.quadraticCurveTo(82, 132, 66, 150)
        ctx.lineTo(58, 225)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        drawCelShadedPalmTree(ctx, 26, 82, 18, timeSec)

        ctx.fillStyle = '#0f172a'
        ctx.font = 'bold 10px monospace'
        ctx.fillText('MONTAGE ARCH', 24, 240)
      }

      // Cel-Shaded Beach Umbrella & Sunbather on the sand
      drawCelShadedUmbrellaAndSunbather(ctx, 62, 264, 1)

      // 4. Incoming Heavy Shorebreak Barrel Wave!
      g.waveX -= g.waveSpeed
      if (g.waveX < 185) {
        g.waveX = w - 40
        if (g.playerState === 'in_tube') {
          const bonus = 320
          setEarnedPrayers(p => p + bonus)
          setTubesMade(t => t + 1)
          setStatusBanner(`🏆 COMPLETED FULL SHOREBREAK BARREL! (+${bonus} Ocean Prayers)`)
        }
        g.playerState = 'sand'
        g.playerX = 150
        g.playerY = 205
        setTubeMeter(0)
      }

      // Draw Cel-Shaded Hollow Curling Shorebreak Wave
      const wx = g.waveX
      const wy = 195
      const waveGrad = ctx.createLinearGradient(wx - 65, wy - 55, wx + 45, wy + 35)
      waveGrad.addColorStop(0, '#ecfeff')
      waveGrad.addColorStop(0.4, '#22d3ee')
      waveGrad.addColorStop(1, '#0284c7')

      ctx.fillStyle = waveGrad
      ctx.strokeStyle = '#082f49'
      ctx.lineWidth = 2.2
      ctx.beginPath()
      ctx.moveTo(wx - 55, wy + 38)
      ctx.quadraticCurveTo(wx - 10, wy - 68, wx + 55, wy + 38)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Hollow Green Room Tube Pocket inside the wave
      ctx.fillStyle = '#083344'
      ctx.beginPath()
      ctx.ellipse(wx - 8, wy + 12, 28, 20, 0, 0, Math.PI * 2)
      ctx.fill()

      // Foaming White Lip Curtain
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.arc(wx - 8, wy + 10, 30, Math.PI * 0.95, Math.PI * 1.95)
      ctx.stroke()

      ctx.fillStyle = '#fef08a'
      ctx.font = 'bold 10px monospace'
      ctx.fillText('SHOREBREAK TUBE 🌊', wx - 48, wy - 42)

      // 5. Update & Draw Player (Boogie Boarder or Stand-Up Surfer)
      if (g.playerState === 'charging') {
        g.playerX += 4.2
        if (Math.abs(g.playerX - (wx - 8)) < 38) {
          g.playerState = 'in_tube'
        } else if (g.playerX > w - 60) {
          g.playerState = 'sand'
          g.playerX = 150
        }
      } else if (g.playerState === 'in_tube') {
        g.playerX = wx - 8
        g.playerY = wy + 14
        setTubeMeter(m => Math.min(100, m + 2))
      } else if (g.playerState === 'air_rollo') {
        g.timer--
        g.playerY = wy - 42 - Math.sin((g.timer / 32) * Math.PI) * 35
        g.playerX = wx - 15
        if (g.timer <= 0) {
          g.playerState = 'sand'
          g.playerX = 150
          g.playerY = 205
          setTubeMeter(0)
        }
      }

      ctx.save()
      ctx.translate(g.playerX, g.playerY)
      if (g.playerState === 'air_rollo') {
        ctx.rotate(frame * 0.35)
      }
      // Board
      ctx.fillStyle = mode === 'boogie' ? '#eab308' : '#06b6d4'
      ctx.beginPath()
      ctx.roundRect(-16, -5, 32, 10, 4)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Surfer / Boogie Rider
      ctx.font = '20px sans-serif'
      ctx.fillText(mode === 'boogie' ? '🌊' : '🏄‍♂️', -10, -6)
      ctx.restore()

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [spot, mode])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-950 border-2 border-cyan-400/70 shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-950 via-cyan-950 to-teal-950 px-5 py-3.5 border-b border-cyan-500/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs uppercase font-bold">
              <Footprints className="w-4 h-4 text-amber-400" />
              <span>Mid-Drive PCH Pull-Over &bull; South Laguna Shorebreak Session</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {spot === 'thousand_steps'
                ? '1000 Steps Beach (Mile 4.5 • 219 Cliff Stairs & Sea Cave)'
                : 'Treasure Island Beach by Montage (Mile 3.2 • Keyhole Arch)'}
            </h2>
          </div>

          {/* Spot & Craft Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSpot('treasure_island')}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold cursor-pointer border transition-all ${
                spot === 'treasure_island'
                  ? 'bg-teal-400 text-slate-950 border-teal-300'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-teal-400'
              }`}
            >
              🏖️ Treasure Island (Mi 3.2)
            </button>
            <button
              onClick={() => setSpot('thousand_steps')}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold cursor-pointer border transition-all ${
                spot === 'thousand_steps'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-400'
              }`}
            >
              🪜 1000 Steps (Mi 4.5)
            </button>
            <button
              onClick={() => setMode(m => (m === 'boogie' ? 'surfboard' : 'boogie'))}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-bold cursor-pointer hover:bg-amber-500/30"
            >
              {mode === 'boogie' ? '🌊 Boogie Mode' : '🏄 Surfboard Mode'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Live NOAA Buoy & Tube Meter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
              <span className="text-slate-400">LIVE SWELL BUOY:</span>
              <span className="text-cyan-300 font-bold">
                {buoy.waveHeightFt}ft @ {buoy.swellPeriodSec}s {buoy.swellCompass}
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
              <span className="text-slate-400">GREEN ROOM METER:</span>
              <div className="w-28 h-3 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/40">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                  style={{ width: `${tubeMeter}%` }}
                />
              </div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
              <span className="text-slate-400">SESSION BONUS:</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> +{earnedPrayers} Prayers ({tubesMade} Tubes)
              </span>
            </div>
          </div>

          {/* Interactive Shorebreak Canvas */}
          <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/50 shadow-xl bg-sky-950">
            <canvas
              ref={canvasRef}
              width={720}
              height={290}
              onClick={triggerDropIn}
              className="w-full h-[240px] sm:h-[280px] object-cover cursor-pointer"
            />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-slate-950/85 border border-cyan-500/50 text-[11px] font-mono text-cyan-200">
                {riderName} &bull; {boardName}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-950/90 border border-amber-400/60 text-[11px] font-mono text-amber-300 font-bold">
                Click Canvas or Press SPACE to Charge / Boost El Rollo!
              </span>
            </div>
          </div>

          {/* Status Banner + Action Buttons */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-200">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{statusBanner}</span>
            </div>

            <button
              onClick={triggerDropIn}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 whitespace-nowrap"
            >
              🌊 Charge Shorebreak / Boost Lip!
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900/95 px-5 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Lifeguard Tower Flag: Green/Yellow &bull; Sea Turtles &amp; Dolphins Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onFinishSession(Math.max(150, earnedPrayers), Math.max(1, tubesMade))}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Climb 219 Stairs &amp; Keep Driving PCH (+{Math.max(150, earnedPrayers)} Prayers)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
