import React, { useRef, useEffect, useState, useCallback } from 'react'
import { ArrowLeft, Trophy, Sparkles, Waves, Eye, HeartHandshake, Zap } from 'lucide-react'
import { SNOWBOARDS_LIST, RIDERS_LIST, type Snowboard, type RiderPro } from '../../data/snowboardGear'
import { SURF_SPOTS, type SurfSpotId } from '../../types/game'
import { ChairliftRideView } from './ChairliftRideView'
import { useOceanBuoyFeed } from '../../utils/oceanBuoyFeed'
import confetti from 'canvas-confetti'

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
    | 'peeling_wall'
    | 'dolphin'
    | 'sea_turtle'
    | 'pelican_flock'
    | 'seashell_reef';
  width: number;
  height: number;
  hit: boolean;
  localQuote?: string;
  peelDirection?: 'left' | 'right';
}

const LOCAL_QUOTES = [
  'RESPECT THE PRIORITY!',
  '2% CREW LINEUP!',
  'GO! THIS SET IS FIRING!',
  'GOT ANY TACO STAND?!',
  'DEEP IN THE GREEN ROOM!',
  'LOCALS ONLY ON THE PEAK!'
]

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
  const buoy = useOceanBuoyFeed()

  const [viewMode, setViewMode] = useState<'shredding' | 'chairlift'>('chairlift')
  const [rideModeOverride, setRideModeOverride] = useState<'surfboard' | 'boogie' | null>(null)
  const effectiveCraftType = rideModeOverride || board.craftType

  const boardRef = useRef(board)
  const riderRef = useRef(rider)
  const craftTypeRef = useRef(effectiveCraftType)
  const spotRef = useRef(activeSpot)
  const waxMultiplierRef = useRef(waxSpeedMultiplier)
  const buoyScaleRef = useRef(buoy.waveScaleMultiplier)

  useEffect(() => {
    boardRef.current = board
    riderRef.current = rider
    craftTypeRef.current = effectiveCraftType
    spotRef.current = activeSpot
    waxMultiplierRef.current = waxSpeedMultiplier
    buoyScaleRef.current = buoy.waveScaleMultiplier
  }, [board, rider, effectiveCraftType, activeSpot, waxSpeedMultiplier, buoy.waveScaleMultiplier])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const hasPassBonus = purchasedPassIds.includes('brighton-day') || purchasedPassIds.includes('wasatch-dual-gold')
  const [score, setScore] = useState(hasPassBonus ? 500 : 0)
  const [distance, setDistance] = useState(0)
  const [isWipedOut, setIsWipedOut] = useState(false)
  const [yetiDistance, setYetiDistance] = useState(999)
  const [activeCheer, setActiveCheer] = useState<string | null>(null)

  // WSL Finals Head-to-Head Heat State
  const rivalName = rider.name.includes('Griffin') ? 'Filipe Toledo' : 'Griffin Colapinto'
  const [rivalTwoWaveTotal] = useState<number>(17.15)
  const [topWaves, setTopWaves] = useState<number[]>([8.65, 8.20])
  const lastWaveJudgeScore = topWaves[0] || 8.65
  const bestTwoWaveTotal = +((topWaves[0] || 0) + (topWaves[1] || 0)).toFixed(2)
  const [hasPriority, setHasPriority] = useState<boolean>(true)
  const [wslChampCrowned, setWslChampCrowned] = useState<boolean>(false)
  const [showPodiumModal, setShowPodiumModal] = useState<boolean>(false)

  // Green Room Tube Meter & Local Respect Meter
  const [inBarrel, setInBarrel] = useState<boolean>(false)
  const [greenRoomMeter, setGreenRoomMeter] = useState<number>(20)
  const [localRespect, setLocalRespect] = useState<number>(hasPassBonus ? 88 : 72)
  const localRespectRef = useRef(localRespect)
  useEffect(() => {
    localRespectRef.current = localRespect
  }, [localRespect])

  const recordWaveScore = useCallback((waveScore: number) => {
    setTopWaves(prev => {
      const next = [waveScore, ...prev].sort((a, b) => b - a).slice(0, 2)
      const total = +((next[0] || 0) + (next[1] || 0)).toFixed(2)
      if (total >= 17.5 && !wslChampCrowned) {
        setWslChampCrowned(true)
        setShowPodiumModal(true)
        try {
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } })
        } catch {
          // ignore confetti errors in headless mode
        }
      }
      return next
    })
  }, [wslChampCrowned])

  // Throw Shaka / Share Taco Stand with Locals (`G` key or HUD button)
  const handleThrowShakaToLocals = useCallback(() => {
    setLocalRespect(r => Math.min(100, r + 18))
    setHasPriority(true)
    setScore(s => s + 250)
    setActiveCheer('🤙 Threw a Shaka & shared Taco Stand Al Pastor with the locals! +18% Respect & Lineup Priority!')
    setTimeout(() => setActiveCheer(null), 2000)
  }, [])

  // Jet-Ski Tow-Back to Peak (`J` key or HUD button)
  const handleJetSkiTowBack = useCallback(() => {
    skierRef.current.x = 420
    skierRef.current.y = 165
    skierRef.current.invincibleTimer = 150
    yetiRef.current.y = -260
    setHasPriority(true)
    setScore(s => s + 150)
    setActiveCheer('🚤 WSL Jet-Ski Assist towed you straight back to the A-Frame Peak with Priority!')
    setTimeout(() => setActiveCheer(null), 2000)
  }, [])

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
      if (e.key === 'g' || e.key === 'G') {
        handleThrowShakaToLocals()
      } else if (e.key === 'j' || e.key === 'J') {
        handleJetSkiTowBack()
      }
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
  }, [handleThrowShakaToLocals, handleJetSkiTowBack])

  function generateObstacle(y: number): SurfObstacle {
    const rand = Math.random()
    let type: SurfObstacle['type'] = 'local_surfer'
    if (rand < 0.20) type = 'local_surfer'
    else if (rand < 0.33) type = 'kelp_rock'
    else if (rand < 0.48) type = 'wave_lip'
    else if (rand < 0.64) type = 'barrel_tube'
    else if (rand < 0.78) type = 'peeling_wall'
    else if (rand < 0.85) type = 'dolphin'
    else if (rand < 0.91) type = 'sea_turtle'
    else if (rand < 0.96) type = 'pelican_flock'
    else type = 'seashell_reef'

    return {
      x: 55 + Math.random() * 650,
      y,
      type,
      width: type === 'peeling_wall' ? 110 : type === 'barrel_tube' ? 54 : type === 'wave_lip' ? 42 : 28,
      height: type === 'peeling_wall' ? 32 : type === 'barrel_tube' ? 28 : 24,
      hit: false,
      localQuote: LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)],
      peelDirection: Math.random() > 0.5 ? 'right' : 'left'
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

      // Animated scrolling A-Frame & Peeling Swell Lines across the ocean
      const swellOffset = (distCounter * 2.2) % 140
      for (let sy = -80 + swellOffset; sy < height + 80; sy += 140) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(0, sy)
        ctx.quadraticCurveTo(width * 0.42, sy - 22, width - 135, sy + 8)
        ctx.stroke()
      }

      // Handle Surfer / Boogie Boarder input
      if (!skier.crashed) {
        if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
          skier.speedX = Math.max(-6.4, skier.speedX - 0.52)
          skier.angle = -0.42
        } else if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
          skier.speedX = Math.min(6.4, skier.speedX + 0.52)
          skier.angle = 0.42
        } else {
          skier.speedX *= 0.92
          skier.angle *= 0.8
        }

        const wMult = (waxMultiplierRef.current || 1.0) * (buoyScaleRef.current || 1.0)
        if (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) {
          skier.speedY = Math.min(11.0 * wMult, skier.speedY + 0.18)
        } else if (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) {
          // Stalling on the wave face builds Green Room Tube Meter!
          skier.speedY = Math.max(2.2, skier.speedY - 0.2)
          if (skier.barrelTimer > 0) {
            setGreenRoomMeter(m => Math.min(100, m + 0.6))
          }
        } else {
          skier.speedY = 5.2 * wMult
        }

        skier.x += skier.speedX
        if (skier.x < 35) skier.x = 35
        if (skier.x > width - 165) skier.x = width - 165

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

        drawOceanObstacle(ctx, obs, spotRef.current.id, localRespectRef.current)

        const hitRadiusX = obs.type === 'peeling_wall' ? 52 : 28
        if (!obs.hit && !skier.inAir && Math.abs(obs.x - skier.x) < hitRadiusX && Math.abs(obs.y - skier.y) < 24) {
          obs.hit = true
          const isBoogie = craftTypeRef.current === 'boogie'

          if (obs.type === 'wave_lip') {
            skier.inAir = true
            skier.airTimer = 38
            skier.spin = 0
            const bonus = Math.round(320 * (boardRef.current.statsBonus.trickBonus || 1))
            setScore(s => s + bonus)
            const judgeWave = +(8.7 + Math.random() * 1.25).toFixed(2)
            recordWaveScore(judgeWave)
            setActiveCheer(
              isBoogie
                ? `BOOSTED A HUGE EL ROLLO / ARS FLIP OFF THE CLOSEOUT LIP! (${judgeWave} pts) 🌊🔥`
                : `STOMPED A FULL-ROTATION AIR REVERSE OFF THE LIP! (${judgeWave} pts) 🏄‍♂️🔥`
            )
            setTimeout(() => setActiveCheer(null), 1900)
          } else if (obs.type === 'barrel_tube' || obs.type === 'peeling_wall') {
            skier.barrelTimer = 48
            setInBarrel(true)
            setGreenRoomMeter(m => {
              const nextM = Math.min(100, m + 34)
              if (nextM >= 100) {
                recordWaveScore(10.0)
                setScore(s => s + 1000)
                setActiveCheer('🏆 10.00 PERFECT GREEN ROOM SPIT BARREL! WSL JUDGES STANDING OVATION! 🏆')
                return 25
              }
              return nextM
            })
            const bonus = Math.round(450 * (boardRef.current.statsBonus.powFloat || 1))
            setScore(s => s + bonus)
            const judgeWave = +(9.25 + Math.random() * 0.74).toFixed(2)
            recordWaveScore(judgeWave)
            setActiveCheer(
              obs.type === 'peeling_wall'
                ? `CARVED THE ${obs.peelDirection?.toUpperCase()} PEELING A-FRAME WALL INTO THE TUBE! (${judgeWave}) 🌊`
                : isBoogie
                  ? `DEEP SHOREBREAK SPIT BARREL ON THE BOOGIE! Judges score: ${judgeWave}! 🌊`
                  : `LOCKED IN THE GREEN ROOM BARREL! WSL Judges throw a ${judgeWave}! 🏆`
            )
            setTimeout(() => setActiveCheer(null), 2000)
          } else if (obs.type === 'dolphin') {
            setScore(s => s + 350)
            setLocalRespect(r => Math.min(100, r + 6))
            setActiveCheer('🐬 A pod of Pacific Dolphins is party-wave gliding right alongside you! (+350 Pts)')
            setTimeout(() => setActiveCheer(null), 1800)
          } else if (obs.type === 'sea_turtle') {
            setScore(s => s + 300)
            setLocalRespect(r => Math.min(100, r + 8))
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
          } else if (obs.type === 'local_surfer') {
            // If OC Local Respect >= 80, locals call you into the wave instead of wiping you out!
            if (localRespectRef.current >= 80 || skier.invincibleTimer > 0 || skier.barrelTimer > 0) {
              setScore(s => s + 220)
              setActiveCheer('🤙 Local Crew called you into the bomb set! "GO BRO, ALL YOURS!" (+220 Pts)')
              setTimeout(() => setActiveCheer(null), 1700)
            } else {
              setLocalRespect(r => Math.max(10, r - 12))
              setHasPriority(false)
              skier.crashed = true
              setIsWipedOut(true)
              setActiveCheer('⚠️ Dropped in on a local without Priority! Press G to throw a Shaka & share Taco Stand!')
              setTimeout(() => {
                skier.crashed = false
                setIsWipedOut(false)
              }, 1500)
            }
          } else if (obs.type === 'kelp_rock') {
            if (skier.invincibleTimer <= 0 && skier.barrelTimer <= 0) {
              skier.crashed = true
              setIsWipedOut(true)
              setTimeout(() => {
                skier.crashed = false
                setIsWipedOut(false)
              }, 1500)
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
  }, [viewMode, recordWaveScore])

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
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            <button
              onClick={onReturnToDrive}
              className="px-3 py-1.5 rounded-lg bg-slate-950/90 hover:bg-slate-900 text-cyan-400 border border-slate-700 font-mono text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>PCH Surf Wagon</span>
            </button>

            <button
              onClick={() => setViewMode('chairlift')}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 border border-cyan-500 font-mono text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all"
              title="Check the Beach, Pier & WSL Lineup Overlook"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Beach Overlook</span>
            </button>

            {/* Live Surfboard vs Boogie Board Toggle */}
            <button
              onClick={() => setRideModeOverride(effectiveCraftType === 'boogie' ? 'surfboard' : 'boogie')}
              className="px-3 py-1.5 rounded-lg bg-amber-950/90 hover:bg-amber-900 text-amber-300 border border-amber-500 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all"
            >
              <span>{effectiveCraftType === 'boogie' ? '🌊 BOOGIE MODE' : '🏄 SURFBOARD MODE'}</span>
              <span className="text-[10px] text-amber-200 underline">(Switch)</span>
            </button>

            {/* Throw Shaka / Share Taco with Locals Button */}
            <button
              onClick={handleThrowShakaToLocals}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-500 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-sm transition-all"
              title="Throw a Shaka & Share Taco Stand Al Pastor with the Lineup Locals (Shortcut: G)"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              <span>🤙 Shaka Locals (G)</span>
            </button>

            {/* WSL Jet-Ski Assist Button */}
            <button
              onClick={handleJetSkiTowBack}
              className="hidden sm:flex px-2.5 py-1.5 rounded-lg bg-sky-950/90 hover:bg-sky-900 text-sky-200 border border-sky-500 font-mono text-xs items-center gap-1 cursor-pointer backdrop-blur-sm transition-all"
              title="Jet-Ski Tow-Back to the Peak with Priority (Shortcut: J)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>🚤 Jet-Ski (J)</span>
            </button>

            {/* Spot Switcher Pills */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-950/90 p-1 rounded-lg border border-slate-700">
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

          {/* WSL Broadcast Head-to-Head Heat Scorebug */}
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/92 border border-amber-500/80 font-mono text-xs text-white backdrop-blur-sm">
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                {hasPriority ? 'PRIORITY' : 'HEAT'}
              </span>
              <span>
                YOU <strong className="text-emerald-400">{bestTwoWaveTotal.toFixed(2)}</strong>
              </span>
              <span className="text-slate-500">vs</span>
              <span className="hidden sm:inline text-slate-300">
                {rivalName} <strong className="text-rose-300">{rivalTwoWaveTotal.toFixed(2)}</strong>
              </span>
              <span className="text-cyan-300 text-[11px]">(Last: {lastWaveJudgeScore.toFixed(2)})</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-700 font-mono text-xs text-white backdrop-blur-sm flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span><span className="text-amber-400 font-bold">{score}</span></span>
            </div>
          </div>
        </div>

        {/* SECOND TELEMETRY BAR: Live NOAA Buoy + Green Room Tube Meter + OC Local Respect Meter */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono pointer-events-auto">
          <div className="px-3 py-1 rounded-lg bg-slate-950/85 border border-cyan-500/40 text-cyan-200 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">🌊 {buoy.stationId}:</span>
            <span>
              {buoy.waveHeightFt}–{buoy.waveMaxFt}ft @ {buoy.swellPeriodSec}s {buoy.swellCompass}
            </span>
            <span className="hidden md:inline">&bull; {buoy.waterTempF}°F &bull; Tide {buoy.tideStage}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              {buoy.surfRating}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Green Room Tube Meter */}
            <div className="px-3 py-1 rounded-lg bg-slate-950/85 border border-cyan-500/40 flex items-center gap-2 text-cyan-200">
              <span>GREEN ROOM TUBE:</span>
              <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/50">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                  style={{ width: `${greenRoomMeter}%` }}
                />
              </div>
              <span className="text-cyan-300 font-bold">{Math.round(greenRoomMeter)}%</span>
            </div>

            {/* OC Local Respect Meter */}
            <div className="px-3 py-1 rounded-lg bg-slate-950/85 border border-emerald-500/40 flex items-center gap-2 text-emerald-200">
              <span>LOCAL RESPECT:</span>
              <div className="w-20 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-emerald-500/50">
                <div
                  className={`h-full transition-all ${
                    localRespect >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${localRespect}%` }}
                />
              </div>
              <span className="font-bold">
                {localRespect}% {localRespect >= 80 ? '🤙 VIP' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Companion / Wildlife / WSL Judge Cheer */}
      {activeCheer && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-slate-950/95 border border-cyan-400 text-cyan-200 font-mono text-xs flex items-center gap-2 shadow-glow-ice animate-bounce max-w-xl text-center">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{activeCheer}</span>
        </div>
      )}

      {inBarrel && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-cyan-500/90 text-slate-950 font-mono font-black text-xs uppercase tracking-widest shadow-lg">
          🌊 DEEP IN THE GREEN ROOM BARREL! HOLD &uarr;/W TO STALL IN THE TUBE! 🌊
        </div>
      )}

      {yetiRef.current.active && (
        <div className="absolute top-24 right-6 z-20 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500 text-rose-200 font-mono text-xs animate-pulse">
          🦈 &quot;THE LANDLORD&quot; SHARK ALERT &bull; {yetiDistance}M BEHIND!
        </div>
      )}

      {isWipedOut && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-6 py-3 rounded-2xl bg-slate-950/95 border border-rose-500 text-white font-mono text-center space-y-1 shadow-2xl animate-bounce">
          <div className="text-rose-400 font-bold text-lg">OVER THE FALLS! WIPEOUT! 🌊💥</div>
          <div className="text-xs text-slate-300">Duck-diving the whitewater and popping back up...</div>
        </div>
      )}

      {/* WSL FINALS COBBLESTONE PODIUM CHAMPION MODAL */}
      {showPodiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="max-w-lg w-full rounded-2xl bg-slate-950 border-2 border-amber-400 p-6 text-center space-y-4 shadow-2xl">
            <div className="text-5xl">🏆🍾🏄‍♂️🌊</div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Lower Trestles Cobblestone Podium &bull; San Clemente, CA
            </div>
            <h2 className="text-2xl font-black text-white">
              WSL FINALS WORLD CHAMPION CROWNED!
            </h2>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              You dropped a massive <strong className="text-emerald-400">{bestTwoWaveTotal.toFixed(2)} / 20.00</strong> two-wave heat total ({topWaves[0]?.toFixed(2)} + {topWaves[1]?.toFixed(2)}) to defeat {rivalName} ({rivalTwoWaveTotal.toFixed(2)}) in front of thousands of roaring fans on the beach!
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowPodiumModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black font-mono text-xs uppercase cursor-pointer shadow-lg"
              >
                Keep Shredding Victory Lap! 🤙
              </button>
            </div>
          </div>
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
        <span>
          Steer: &larr;&rarr;/A-D &bull; Pump: &darr;/S &bull; Stall in Tube: &uarr;/W &bull; Shaka Locals: G &bull; Jet-Ski: J &bull; Dist: {distance}m
        </span>
      </div>
    </div>
  )
}

function drawOceanObstacle(
  ctx: CanvasRenderingContext2D,
  obs: SurfObstacle,
  spotId: SurfSpotId,
  localRespect: number
) {
  ctx.save()
  ctx.translate(obs.x, obs.y)

  if (obs.type === 'local_surfer') {
    const isFriendly = localRespect >= 80
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.beginPath()
    ctx.ellipse(0, 6, 15, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Local's surfboard
    ctx.fillStyle = isFriendly ? '#10b981' : '#f43f5e'
    ctx.beginPath()
    ctx.ellipse(0, 4, 14, 4.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Local in wetsuit
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.arc(0, -4, 6, 0, Math.PI * 2)
    ctx.fill()

    // Speech bubble / Priority badge
    ctx.fillStyle = isFriendly ? 'rgba(6, 78, 59, 0.92)' : 'rgba(127, 29, 29, 0.92)'
    ctx.fillRect(-44, -24, 88, 13)
    ctx.fillStyle = isFriendly ? '#6ee7b7' : '#fca5a5'
    ctx.font = 'bold 7px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(
      isFriendly
        ? '🤙 GO! YOUR WAVE!'
        : obs.localQuote || (spotId === 'trestles_wsl' ? 'WSL PRIORITY' : 'LOCAL!'),
      0,
      -15
    )
  } else if (obs.type === 'peeling_wall') {
    // Lateral Peeling Left/Right Wave Wall with Green Room Curtain!
    const isRight = obs.peelDirection !== 'left'
    const wallGrad = ctx.createLinearGradient(-55, -16, 55, 16)
    wallGrad.addColorStop(0, isRight ? '#ecfeff' : '#0284c7')
    wallGrad.addColorStop(0.5, '#06b6d4')
    wallGrad.addColorStop(1, isRight ? '#0284c7' : '#ecfeff')

    ctx.fillStyle = wallGrad
    ctx.beginPath()
    ctx.roundRect(-55, -14, 110, 28, 10)
    ctx.fill()

    // Foaming Curling Lip Crest
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(-52, -12)
    ctx.lineTo(52, -12)
    ctx.stroke()

    ctx.fillStyle = '#083344'
    ctx.font = 'bold 8px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(isRight ? 'PEELING RIGHT WALL 🌊→' : '←🌊 PEELING LEFT WALL', 0, 4)
  } else if (obs.type === 'kelp_rock') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = spotId === 'san_clemente_pier' ? '#78350f' : '#365314'
    ctx.beginPath()
    ctx.arc(0, 0, 9, 0, Math.PI * 2)
    ctx.fill()
  } else if (obs.type === 'wave_lip') {
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
    ctx.fillStyle = 'rgba(186, 230, 253, 0.6)'
    ctx.beginPath()
    ctx.arc(0, 2, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🐬', 0, 6)
  } else if (obs.type === 'sea_turtle') {
    ctx.fillStyle = 'rgba(167, 243, 208, 0.55)'
    ctx.beginPath()
    ctx.arc(0, 2, 13, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '19px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🐢', 0, 6)
  } else if (obs.type === 'pelican_flock') {
    ctx.font = '18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🐦', -8, 0)
    ctx.fillText('🐦', 10, -6)
  } else if (obs.type === 'seashell_reef') {
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
    ctx.beginPath()
    ctx.roundRect(-9, -18, 18, 34, 4)
    ctx.fillStyle = board.accentColor
    ctx.fill()
    ctx.strokeStyle = '#020617'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = board.topGraphicColor
    ctx.fillRect(-6, -14, 12, 26)

    const kick = Math.sin(Date.now() * 0.025) * 3
    ctx.fillStyle = '#facc15'
    ctx.fillRect(-7, -26 + kick, 5, 9)
    ctx.fillRect(2, -26 - kick, 5, 9)

    ctx.fillStyle = rider.accentColor
    ctx.fillRect(-6, -10, 12, 16)
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.arc(0, 8, 5.5, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.moveTo(0, 24)
    ctx.quadraticCurveTo(9, 6, 7, -20)
    ctx.lineTo(-7, -20)
    ctx.quadraticCurveTo(-9, 6, 0, 24)
    ctx.closePath()
    ctx.fillStyle = board.accentColor
    ctx.fill()
    ctx.strokeStyle = '#020617'
    ctx.lineWidth = 1.2
    ctx.stroke()

    ctx.strokeStyle = 'rgba(120, 53, 15, 0.65)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, -19)
    ctx.lineTo(0, 22)
    ctx.stroke()

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(-4, -17, 8, 7)

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(-4, -7, 8, 14)

    ctx.fillStyle = rider.accentColor
    ctx.beginPath()
    ctx.arc(0, -2, 7, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#fde047'
    ctx.beginPath()
    ctx.arc(0, -6, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = rider.accentColor
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(-5, -2)
    ctx.lineTo(-11, 4)
    ctx.moveTo(5, -2)
    ctx.lineTo(11, -5)
    ctx.stroke()
  }

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

  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
  ctx.beginPath()
  ctx.arc(0, 0, 22, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#475569'
  ctx.beginPath()
  ctx.ellipse(0, 0, 12, 24, 0, 0, Math.PI * 2)
  ctx.fill()

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

  const foamWave = Math.sin(Date.now() * 0.004) * 6
  ctx.fillStyle = '#bae6fd'
  ctx.fillRect(beachX - 14 + foamWave, 0, 18, height)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(beachX - 4 + foamWave, 0, 6, height)

  ctx.fillStyle = '#fde68a'
  ctx.fillRect(beachX, 0, width - beachX, height)

  const itemSpacing = 220
  const scrollOffset = (distCounter * 2.5) % itemSpacing

  for (let by = -140 + scrollOffset; by < height + 140; by += itemSpacing) {
    ctx.font = '15px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🧒', beachX - 6, by + 20)
    ctx.fillText('🏖️', beachX + 18, by + 24)

    ctx.font = '13px sans-serif'
    ctx.fillText('🐚', beachX + 12, by + 65)
    ctx.fillText('⭐', beachX + 26, by + 150)

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
