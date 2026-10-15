import React, { useRef, useEffect, useState } from 'react'
import { ArrowLeft, Trophy, Sparkles, Waves, Eye } from 'lucide-react'
import { SNOWBOARDS_LIST, RIDERS_LIST, type Snowboard, type RiderPro } from '../../data/snowboardGear'
import { SURF_SPOTS, type SurfSpotId } from '../../types/game'
import { ChairliftRideView } from './ChairliftRideView'

interface Props {
  onReturnToDrive: () => void;
  selectedBoardId?: string;
  selectedRiderId?: string;
  selectedSpotId?: SurfSpotId;
  onSelectSpot?: (spotId: SurfSpotId) => void;
  waxSpeedMultiplier?: number;
  purchasedPassIds?: string[];
}

interface SurfObstacle {
  x: number;
  y: number;
  type:
    | 'local_surfer'
    | 'kelp_rock'
    | 'wave_lip'
    | 'barrel_tube'
    | 'dolphin'
    | 'sea_turtle'
    | 'pelican_flock'
    | 'seashell_reef';
  width: number;
  height: number;
  hit: boolean;
}

export const BrightonSkiFree: React.FC<Props> = ({
  onReturnToDrive,
  selectedBoardId,
  selectedRiderId,
  selectedSpotId = 'trestles_wsl',
  onSelectSpot,
  waxSpeedMultiplier = 1.0,
  purchasedPassIds = []
}) => {
  const board = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0]
  const rider = RIDERS_LIST.find(r => r.id === selectedRiderId) || RIDERS_LIST[0]
  const activeSpot = SURF_SPOTS.find(s => s.id === selectedSpotId) || SURF_SPOTS[2]

  const [viewMode, setViewMode] = useState<'shredding' | 'chairlift'>('chairlift')
  const [rideModeOverride, setRideModeOverride] = useState<'surfboard' | 'boogie' | null>(null)
  const effectiveCraftType = rideModeOverride || board.craftType

  const boardRef = useRef(board)
  const riderRef = useRef(rider)
  const craftTypeRef = useRef(effectiveCraftType)
  const spotRef = useRef(activeSpot)
  const waxMultiplierRef = useRef(waxSpeedMultiplier)

  useEffect(() => {
    boardRef.current = board
    riderRef.current = rider
    craftTypeRef.current = effectiveCraftType
    spotRef.current = activeSpot
    waxMultiplierRef.current = waxSpeedMultiplier
  }, [board, rider, effectiveCraftType, activeSpot, waxSpeedMultiplier])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const hasPassBonus = purchasedPassIds.includes('brighton-day') || purchasedPassIds.includes('wasatch-dual-gold')
  const [score, setScore] = useState(hasPassBonus ? 500 : 0)
  const [distance, setDistance] = useState(0)
  const [isWipedOut, setIsWipedOut] = useState(false)
  const [yetiDistance, setYetiDistance] = useState(999)
  const [activeCheer, setActiveCheer] = useState<string | null>(null)
  const [lastWaveJudgeScore, setLastWaveJudgeScore] = useState<number>(8.65)
  const [bestTwoWaveTotal, setBestTwoWaveTotal] = useState<number>(16.85)
  const [inBarrel, setInBarrel] = useState<boolean>(false)

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
  })

  const obstaclesRef = useRef<SurfObstacle[]>([])
  const yetiRef = useRef({
    active: false,
    x: 420,
    y: -200,
    speed: 7.2
  })

  const keysRef = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const initialObs: SurfObstacle[] = []
    for (let y = 300; y < 3000; y += 85) {
      initialObs.push(generateObstacle(y))
    }
    obstaclesRef.current = initialObs

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  function generateObstacle(y: number): SurfObstacle {
    const rand = Math.random()
    let type: SurfObstacle['type'] = 'local_surfer'
    if (rand < 0.24) type = 'local_surfer'
    else if (rand < 0.42) type = 'kelp_rock'
    else if (rand < 0.58) type = 'wave_lip'
    else if (rand < 0.72) type = 'barrel_tube'
    else if (rand < 0.81) type = 'dolphin'
    else if (rand < 0.89) type = 'sea_turtle'
    else if (rand < 0.95) type = 'pelican_flock'
    else type = 'seashell_reef'

    return {
      x: 55 + Math.random() * 650, // Keep left of the sandy beach shoreline
      y,
      type,
      width: type === 'barrel_tube' ? 54 : type === 'wave_lip' ? 42 : 28,
      height: type === 'barrel_tube' ? 28 : 24,
      hit: false
    }
  }

  useEffect(() => {
    if (viewMode !== 'shredding') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let distCounter = 0

    const loop = () => {
      const width = canvas.width
      const height = canvas.height
      const skier = skierRef.current
      const yeti = yetiRef.current

      // 1. TURQUOISE PACIFIC OCEAN SWELL CANVAS
      const oceanGrad = ctx.createLinearGradient(0, 0, width - 140, 0)
      oceanGrad.addColorStop(0, '#0369a1')
      oceanGrad.addColorStop(0.5, '#0891b2')
      oceanGrad.addColorStop(0.85, '#06b6d4')
      oceanGrad.addColorStop(1, '#67e8f9')
      ctx.fillStyle = oceanGrad
      ctx.fillRect(0, 0, width, height)

      // Animated scrolling swell lines across the ocean
      const swellOffset = (distCounter * 2.2) % 140
      for (let sy = -80 + swellOffset; sy < height + 80; sy += 140) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(0, sy)
        ctx.quadraticCurveTo(width * 0.4, sy + 18, width - 135, sy - 6)
        ctx.stroke()
      }

      // Handle Surfer / Boogie Boarder input
      if (!skier.crashed) {
        if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
          skier.speedX = Math.max(-6.2, skier.speedX - 0.5)
          skier.angle = -0.4
        } else if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
          skier.speedX = Math.min(6.2, skier.speedX + 0.5)
          skier.angle = 0.4
        } else {
          skier.speedX *= 0.92
          skier.angle *= 0.8
        }

        const wMult = waxMultiplierRef.current || 1.0
        if (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) {
          skier.speedY = Math.min(10.5 * wMult, skier.speedY + 0.16)
        } else if (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) {
          skier.speedY = Math.max(2.2, skier.speedY - 0.2)
        } else {
          skier.speedY = 5.2 * wMult
        }

        skier.x += skier.speedX
        if (skier.x < 35) skier.x = 35
        if (skier.x > width - 165) skier.x = width - 165 // Stay in ocean left of beach shoreline

        distCounter += skier.speedY * 0.4
        setDistance(Math.round(distCounter))
      } else {
        skier.speedX = 0
        skier.speedY = 0
      }

      // Air time physics
      if (skier.inAir) {
        skier.airTimer--
        skier.spin += 0.35
        if (skier.airTimer <= 0) {
          skier.inAir = false
          setScore(s => s + 250)
        }
      }

      // Barrel / Tube timer
      if (skier.barrelTimer > 0) {
        skier.barrelTimer--
        if (skier.barrelTimer === 1) {
          setInBarrel(false)
        }
      }

      if (skier.invincibleTimer > 0) {
        skier.invincibleTimer--
      }

      // Scroll ocean features & wildlife
      const scrollSpeed = skier.speedY
      for (let i = 0; i < obstaclesRef.current.length; i++) {
        const obs = obstaclesRef.current[i]
        obs.y -= scrollSpeed

        drawOceanObstacle(ctx, obs, spotRef.current.id)

        // Collision detection
        if (!obs.hit && !skier.inAir && Math.abs(obs.x - skier.x) < 26 && Math.abs(obs.y - skier.y) < 22) {
          obs.hit = true
          const isBoogie = craftTypeRef.current === 'boogie'

          if (obs.type === 'wave_lip') {
            skier.inAir = true
            skier.airTimer = 38
            skier.spin = 0
            const bonus = Math.round(320 * (boardRef.current.statsBonus.trickBonus || 1))
            setScore(s => s + bonus)
            const judgeWave = +(8.5 + Math.random() * 1.4).toFixed(2)
            setLastWaveJudgeScore(judgeWave)
            setBestTwoWaveTotal(prev => Math.min(20, +(Math.max(prev, judgeWave + 8.8)).toFixed(2)))
            setActiveCheer(
              isBoogie
                ? 'BOOSTED A HUGE EL ROLLO / ARS FLIP OFF THE CLOSEOUT LIP! 🌊🔥'
                : 'STOMPED A FULL-ROTATION AIR REVERSE OFF THE LIP! 🏄‍♂️🔥'
            )
            setTimeout(() => setActiveCheer(null), 1900)
          } else if (obs.type === 'barrel_tube') {
            skier.barrelTimer = 42
            setInBarrel(true)
            const bonus = Math.round(450 * (boardRef.current.statsBonus.powFloat || 1))
            setScore(s => s + bonus)
            const judgeWave = +(9.2 + Math.random() * 0.8).toFixed(2)
            setLastWaveJudgeScore(judgeWave)
            setBestTwoWaveTotal(prev => Math.min(20, +(Math.max(prev, judgeWave + 9.1)).toFixed(2)))
            setActiveCheer(
              isBoogie
                ? `DEEP SHOREBREAK SPIT BARREL ON THE BOOGIE! Judges score: ${judgeWave}! 🌊`
                : `LOCKED IN THE GREEN ROOM BARREL! WSL Judges throw a ${judgeWave}! 🏆`
            )
            setTimeout(() => setActiveCheer(null), 2000)
          } else if (obs.type === 'dolphin') {
            setScore(s => s + 350)
            setActiveCheer('🐬 A pod of Pacific Dolphins isparty-wave gliding right alongside you! (+350 Pts)')
            setTimeout(() => setActiveCheer(null), 1800)
          } else if (obs.type === 'sea_turtle') {
            setScore(s => s + 300)
            setActiveCheer('🐢 Ancient Sea Turtle (Honu) blessed your line in the reef shallows! (+300 Pts)')
            setTimeout(() => setActiveCheer(null), 1800)
          } else if (obs.type === 'pelican_flock') {
            setScore(s => s + 200)
            setActiveCheer('🐦 Pelican squadron skimmed the wave crest right over your head! (+200 Pts)')
            setTimeout(() => setActiveCheer(null), 1800)
          } else if (obs.type === 'seashell_reef') {
            skier.invincibleTimer = 180
            setScore(s => s + 400)
            setActiveCheer('🐚 Collected a Golden Pacific Seashell! 3 Seconds Reef & Local Immunity! (+400 Pts)')
            setTimeout(() => setActiveCheer(null), 1800)
          } else if (obs.type === 'local_surfer' || obs.type === 'kelp_rock') {
            if (skier.invincibleTimer <= 0 && skier.barrelTimer <= 0) {
              skier.crashed = true
              setIsWipedOut(true)
              setTimeout(() => {
                skier.crashed = false
                setIsWipedOut(false)
              }, 1600)
            }
          }
        }

        if (obs.y < -60) {
          obstaclesRef.current[i] = generateObstacle(height + Math.random() * 220)
        }
      }

      // Draw Living Beach Shoreline, WSL Fans, Sunbathers, Kids, Lifeguard Tower & Pier on the Right!
      drawBeachAndPierShoreline(ctx, width, height, distCounter, spotRef.current.id)

      // GREAT WHITE SHARK ("THE LANDLORD") CHASE (Triggers past 1,200m)
      if (distCounter > 1200) {
        yeti.active = true
      }

      if (yeti.active) {
        yeti.y += (yeti.speed - skier.speedY * 0.7)
        if (yeti.x < skier.x) yeti.x += 1.8
        if (yeti.x > skier.x) yeti.x -= 1.8

        setYetiDistance(Math.max(0, Math.round(skier.y - yeti.y)))

        drawLandlordShark(ctx, yeti.x, yeti.y)

        if (Math.abs(yeti.x - skier.x) < 30 && Math.abs(yeti.y - skier.y) < 30) {
          skier.crashed = true
          setIsWipedOut(true)
        }
      }

      // Draw Surfer or Boogie Boarder!
      drawSurferOrBoogieBoarder(
        ctx,
        skier.x,
        skier.y,
        skier.angle,
        skier.inAir,
        skier.barrelTimer > 0,
        skier.spin,
        skier.crashed,
        skier.invincibleTimer > 0,
        boardRef.current,
        riderRef.current,
        craftTypeRef.current
      )

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [viewMode])

  if (viewMode === 'chairlift') {
    return (
      <ChairliftRideView
        selectedBoardId={selectedBoardId || 'forum-destroyer'}
        selectedRiderId={selectedRiderId || 'jp-walker'}
        selectedSpotId={selectedSpotId}
        onSelectSpot={onSelectSpot}
        onDropInFromSummit={() => {
          setViewMode('shredding')
          skierRef.current.x = 420
          skierRef.current.y = 170
          skierRef.current.speedY = 5.2
          skierRef.current.crashed = false
        }}
        onReturnToDrive={onReturnToDrive}
        onAddScore={(pts) => setScore(s => s + pts)}
      />
    )
  }

  return (
    <div className="relative w-full h-full min-h-[560px] bg-sky-950 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* TOP HUD OVERLAY */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <button
            onClick={onReturnToDrive}
            className="px-3 py-1.5 rounded-lg bg-slate-950/90 hover:bg-slate-900 text-cyan-400 border border-slate-700 font-mono text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to PCH Surf Wagon</span>
          </button>

          <button
            onClick={() => setViewMode('chairlift')}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 border border-cyan-500 font-mono text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all"
            title="Check the Beach, Pier & WSL Lineup Overlook"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Beach &amp; Pier Overlook</span>
          </button>

          {/* Live Surfboard vs Boogie Board Toggle */}
          <button
            onClick={() => setRideModeOverride(effectiveCraftType === 'boogie' ? 'surfboard' : 'boogie')}
            className="px-3 py-1.5 rounded-lg bg-amber-950/90 hover:bg-amber-900 text-amber-300 border border-amber-500 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all"
            title="Switch between Stand-Up Surfing and Prone/Drop-Knee Boogie Boarding!"
          >
            <span>{effectiveCraftType === 'boogie' ? '🌊 BOOGIE BOARDING' : '🏄 STAND-UP SURFING'}</span>
            <span className="text-[10px] text-amber-200 underline">(Switch)</span>
          </button>

          {/* Spot Switcher Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-950/90 p-1 rounded-lg border border-slate-700">
            {SURF_SPOTS.map((spot) => (
              <button
                key={spot.id}
                onClick={() => onSelectSpot?.(spot.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                  spot.id === activeSpot.id
                    ? 'bg-cyan-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spot.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* WSL Broadcast Scorebug & Telemetry */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-amber-500/70 font-mono text-xs text-white backdrop-blur-sm">
            <span className="text-amber-400 font-black">WSL HEAT:</span>
            <span>LAST WAVE <strong className="text-cyan-300">{lastWaveJudgeScore.toFixed(2)}</strong></span>
            <span>&bull;</span>
            <span>TOTAL <strong className="text-emerald-400">{bestTwoWaveTotal.toFixed(2)}</strong>/20.0</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-700 font-mono text-xs text-white backdrop-blur-sm">
            WAVE DIST: <span className="text-cyan-400 font-bold">{distance}M</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-700 font-mono text-xs text-white backdrop-blur-sm flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>SCORE: <span className="text-amber-400 font-bold">{score}</span></span>
          </div>
        </div>
      </div>

      {/* Pro Companion / Wildlife / WSL Judge Cheer */}
      {activeCheer && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-slate-950/95 border border-cyan-400 text-cyan-200 font-mono text-xs flex items-center gap-2 shadow-glow-ice animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{activeCheer}</span>
        </div>
      )}

      {inBarrel && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-cyan-500/90 text-slate-950 font-mono font-black text-xs uppercase tracking-widest shadow-lg">
          🌊 DEEP IN THE GREEN ROOM BARREL! +TUBE BONUS! 🌊
        </div>
      )}

      {yetiRef.current.active && (
        <div className="absolute top-16 right-6 z-20 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500 text-rose-200 font-mono text-xs animate-pulse">
          🦈 &quot;THE LANDLORD&quot; SHARK ALERT &bull; {yetiDistance}M BEHIND!
        </div>
      )}

      {isWipedOut && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-6 py-3 rounded-2xl bg-slate-950/95 border border-rose-500 text-white font-mono text-center space-y-1 shadow-2xl animate-bounce">
          <div className="text-rose-400 font-bold text-lg">OVER THE FALLS! WIPEOUT! 🌊💥</div>
          <div className="text-xs text-slate-300">Duck-diving the whitewater and popping back up...</div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={960}
        height={640}
        className="w-full h-full object-cover max-w-full max-h-full border border-cyan-800 shadow-xl"
      />

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-[11px] font-mono text-cyan-100 bg-slate-950/85 border border-slate-700 px-4 py-1 rounded-full backdrop-blur-xs flex items-center gap-2 whitespace-nowrap">
        <Waves className="w-3.5 h-3.5 text-cyan-400" />
        <span>Steer: &larr; &rarr; / A-D &bull; Pump Down-the-Line: &darr; / S &bull; Stall for Tube: &uarr; / W &bull; Hit Barrels, Lips, Dolphins 🐬, Turtles 🐢 &amp; Shells 🐚!</span>
      </div>
    </div>
  )
}

function drawOceanObstacle(ctx: CanvasRenderingContext2D, obs: SurfObstacle, spotId: SurfSpotId) {
  ctx.save()
  ctx.translate(obs.x, obs.y)

  if (obs.type === 'local_surfer') {
    // Salty Local Surfer in the Lineup!
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.beginPath()
    ctx.ellipse(0, 6, 15, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Local's surfboard
    ctx.fillStyle = '#f43f5e'
    ctx.beginPath()
    ctx.ellipse(0, 4, 14, 4.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Local in black wetsuit
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.arc(0, -4, 6, 0, Math.PI * 2)
    ctx.fill()

    // Warning badge
    ctx.fillStyle = 'rgba(127, 29, 29, 0.9)'
    ctx.fillRect(-30, -22, 60, 12)
    ctx.fillStyle = '#fca5a5'
    ctx.font = 'bold 7px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(spotId === 'trestles_wsl' ? 'WSL PRIORITY' : 'LOCAL!', 0, -13)
  } else if (obs.type === 'kelp_rock') {
    // Boil Rock / Kelp Paddy / Pier Piling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = spotId === 'san_clemente_pier' ? '#78350f' : '#365314'
    ctx.beginPath()
    ctx.arc(0, 0, 9, 0, Math.PI * 2)
    ctx.fill()
  } else if (obs.type === 'wave_lip') {
    // Foaming Closeout Wave Lip Ramp to Boost Airs & El Rollos!
    ctx.fillStyle = '#0284c7'
    ctx.beginPath()
    ctx.roundRect(-22, -8, 44, 16, 6)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(-20, -8, 40, 5)

    ctx.fillStyle = '#fef08a'
    ctx.font = 'bold 7px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('AIR LIP 🚀', 0, 5)
  } else if (obs.type === 'barrel_tube') {
    // Hollow Turquoise Barrel / Tube Section!
    const tubeGrad = ctx.createLinearGradient(-28, -14, 28, 14)
    tubeGrad.addColorStop(0, '#0891b2')
    tubeGrad.addColorStop(0.5, '#22d3ee')
    tubeGrad.addColorStop(1, '#ecfeff')
    ctx.fillStyle = tubeGrad
    ctx.beginPath()
    ctx.arc(0, 4, 24, Math.PI, 0)
    ctx.fill()

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(0, 4, 24, Math.PI, 0)
    ctx.stroke()

    ctx.fillStyle = '#083344'
    ctx.font = 'bold 8px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('TUBE 🌊', 0, 2)
  } else if (obs.type === 'dolphin') {
    // Jumping Pacific Dolphin!
    ctx.fillStyle = 'rgba(186, 230, 253, 0.6)'
    ctx.beginPath()
    ctx.arc(0, 2, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🐬', 0, 6)
  } else if (obs.type === 'sea_turtle') {
    // Sea Turtle (Honu)!
    ctx.fillStyle = 'rgba(167, 243, 208, 0.55)'
    ctx.beginPath()
    ctx.arc(0, 2, 13, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '19px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🐢', 0, 6)
  } else if (obs.type === 'pelican_flock') {
    // Swooping California Pelican / Seabird!
    ctx.font = '18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🐦', -8, 0)
    ctx.fillText('🐦', 10, -6)
  } else if (obs.type === 'seashell_reef') {
    // Sparkling Seashell Treasure!
    ctx.fillStyle = 'rgba(254, 240, 138, 0.75)'
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🐚', 0, 6)
  }

  ctx.restore()
}

function drawSurferOrBoogieBoarder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  inAir: boolean,
  inBarrel: boolean,
  spin: number,
  crashed: boolean,
  invincible: boolean,
  board: Snowboard,
  rider: RiderPro,
  craftType: 'surfboard' | 'boogie'
) {
  ctx.save()
  ctx.translate(x, y)

  if (crashed) {
    // Whitewater wipeout foam explosion
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.arc((Math.random() - 0.5) * 28, (Math.random() - 0.5) * 28, 3 + Math.random() * 4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.save()
    ctx.rotate(0.75)
    ctx.fillStyle = board.accentColor
    ctx.fillRect(-7, -18, 14, 36)
    ctx.restore()
    ctx.restore()
    return
  }

  if (inAir) {
    ctx.rotate(spin)
    ctx.scale(1.35, 1.35)
  } else {
    ctx.rotate(angle)
  }

  // Wake spray behind board
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'
  ctx.beginPath()
  ctx.moveTo(-6, -16)
  ctx.lineTo(-15, -36)
  ctx.lineTo(15, -36)
  ctx.lineTo(6, -16)
  ctx.closePath()
  ctx.fill()

  if (invincible) {
    ctx.beginPath()
    ctx.arc(0, 0, 24, 0, Math.PI * 2)
    ctx.strokeStyle = '#fde047'
    ctx.lineWidth = 2.5
    ctx.stroke()
  }

  if (craftType === 'boogie') {
    // 1. PRONE / DROP-KNEE BOOGIE BOARD (Bodyboard + Viper Swimfins!)
    ctx.beginPath()
    ctx.roundRect(-9, -18, 18, 34, 4)
    ctx.fillStyle = board.accentColor
    ctx.fill()
    ctx.strokeStyle = '#020617'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Slick rail stripe
    ctx.fillStyle = board.topGraphicColor
    ctx.fillRect(-6, -14, 12, 26)

    // Viper Swimfins kicking in the water behind the tail!
    const kick = Math.sin(Date.now() * 0.025) * 3
    ctx.fillStyle = '#facc15'
    ctx.fillRect(-7, -26 + kick, 5, 9)
    ctx.fillRect(2, -26 - kick, 5, 9)

    // Bodyboarder torso & head gripping the nose
    ctx.fillStyle = rider.accentColor
    ctx.fillRect(-6, -10, 12, 16)
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.arc(0, 8, 5.5, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // 2. STAND-UP SURFBOARD (Pointed nose, stringer, thruster fins)
    ctx.beginPath()
    ctx.moveTo(0, 24) // Pointed surfboard nose heading down screen
    ctx.quadraticCurveTo(9, 6, 7, -20)
    ctx.lineTo(-7, -20)
    ctx.quadraticCurveTo(-9, 6, 0, 24)
    ctx.closePath()
    ctx.fillStyle = board.accentColor
    ctx.fill()
    ctx.strokeStyle = '#020617'
    ctx.lineWidth = 1.2
    ctx.stroke()

    // Center wood stringer & tail traction pad
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.65)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, -19)
    ctx.lineTo(0, 22)
    ctx.stroke()

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(-4, -17, 8, 7)

    // Surfer in wetsuit / WSL jersey carving the wave
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(-4, -7, 8, 14)

    ctx.fillStyle = rider.accentColor
    ctx.beginPath()
    ctx.arc(0, -2, 7, 0, Math.PI * 2)
    ctx.fill()

    // Sun-bleached hair / surf hat
    ctx.fillStyle = '#fde047'
    ctx.beginPath()
    ctx.arc(0, -6, 5, 0, Math.PI * 2)
    ctx.fill()

    // Arms styling out
    ctx.strokeStyle = rider.accentColor
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(-5, -2)
    ctx.lineTo(-11, 4)
    ctx.moveTo(5, -2)
    ctx.lineTo(11, -5)
    ctx.stroke()
  }

  // Hollow water curtain arch if currently inside a barrel!
  if (inBarrel) {
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.85)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(0, 0, 22, Math.PI * 0.85, Math.PI * 0.15)
    ctx.stroke()
  }

  ctx.restore()
}

function drawLandlordShark(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)

  // Whitewater wake around dorsal fin
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
  ctx.beginPath()
  ctx.arc(0, 0, 22, 0, Math.PI * 2)
  ctx.fill()

  // Great White Shark silhouette ("The Landlord")
  ctx.fillStyle = '#475569'
  ctx.beginPath()
  ctx.ellipse(0, 0, 12, 24, 0, 0, Math.PI * 2)
  ctx.fill()

  // Dorsal fin
  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  ctx.moveTo(0, -10)
  ctx.lineTo(-10, 6)
  ctx.lineTo(10, 6)
  ctx.closePath()
  ctx.fill()

  ctx.font = '18px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('🦈', 0, -14)

  ctx.restore()
}

function drawBeachAndPierShoreline(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  distCounter: number,
  spotId: SurfSpotId
) {
  const beachX = width - 135

  ctx.save()

  // Foaming whitewater shorebreak edge
  const foamWave = Math.sin(Date.now() * 0.004) * 6
  ctx.fillStyle = '#bae6fd'
  ctx.fillRect(beachX - 14 + foamWave, 0, 18, height)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(beachX - 4 + foamWave, 0, 6, height)

  // Golden Sandy Beach (and Trestles Cobblestones)
  ctx.fillStyle = '#fde68a'
  ctx.fillRect(beachX, 0, width - beachX, height)

  // Scrolling Beach Elements: Sunbathers on Towels, Beach Umbrellas, Kids in Ocean, Seashells, Lifeguard Towers & WSL Fans!
  const itemSpacing = 220
  const scrollOffset = (distCounter * 2.5) % itemSpacing

  for (let by = -140 + scrollOffset; by < height + 140; by += itemSpacing) {
    // 1. Kids playing in the shallow shorebreak & building sandcastles
    ctx.font = '15px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🧒', beachX - 6, by + 20)
    ctx.fillText('🏖️', beachX + 18, by + 24)

    // 2. Seashells & Starfish on the wet sand
    ctx.font = '13px sans-serif'
    ctx.fillText('🐚', beachX + 12, by + 65)
    ctx.fillText('⭐', beachX + 26, by + 150)

    // 3. Sunbathers on Colorful Towels under Beach Umbrellas
    ctx.fillStyle = '#38bdf8'
    ctx.fillRect(beachX + 38, by + 40, 24, 12)
    ctx.font = '13px sans-serif'
    ctx.fillText('🕶️', beachX + 50, by + 50)

    ctx.beginPath()
    ctx.arc(beachX + 66, by + 38, 13, 0, Math.PI * 2)
    ctx.fillStyle = '#ef4444'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // 4. California Lifeguard Tower
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(beachX + 42, by + 95, 34, 24)
    ctx.strokeStyle = '#0284c7'
    ctx.lineWidth = 2
    ctx.strokeRect(beachX + 42, by + 95, 34, 24)
    ctx.fillStyle = '#ef4444'
    ctx.font = 'bold 6px monospace'
    ctx.fillText('LIFEGUARD', beachX + 59, by + 115)
    ctx.font = '12px sans-serif'
    ctx.fillText('🛟', beachX + 59, by + 106)

    // 5. Cheering WSL Fans / Pier Crowd
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(beachX + 24, by + 165, 96, 26)
    ctx.strokeStyle = spotId === 'trestles_wsl' ? '#facc15' : '#22d3ee'
    ctx.lineWidth = 1.5
    ctx.strokeRect(beachX + 24, by + 165, 96, 26)
    ctx.fillStyle = '#facc15'
    ctx.font = 'bold 7px monospace'
    ctx.fillText(spotId === 'trestles_wsl' ? '🏆 WSL FANS' : '🏖️ BEACH FANS', beachX + 72, by + 175)
    ctx.font = '11px sans-serif'
    ctx.fillText('🙌 🎉 📣 🤙', beachX + 72, by + 187)
  }

  ctx.restore()
}
