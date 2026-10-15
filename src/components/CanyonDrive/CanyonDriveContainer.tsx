import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  CAMERA_VIEW,
  DRIVE_MODE,
  EXPERIENCE_PHASE,
  type PlayerCarState,
  type SurfSpotId,
  SURF_SPOTS,
  CANYON_LANDMARKS
} from '../../types/game'
import { CanyonRoute } from '../../utils/canyonRoute'
import { CanyonAudioEngine, type RadioStatus } from '../../utils/audioEngine'
import { TopDownView } from './TopDownView'
import { CockpitView } from './CockpitView'
import { SilentRockCard } from './SilentRockCard'
import { BrightonArrivalCard } from './BrightonArrivalCard'
import { BrightonSkiFree } from '../SkiFree/BrightonSkiFree'
import { MilosportShopScreen } from '../Milosport/MilosportShopScreen'
import { PassengerDialogue } from './PassengerDialogue'
import { TractionLawCheckpointModal } from './TractionLawCheckpointModal'
import { CopPullOverModal } from './CopPullOverModal'
import { SaltLakeCountyJailModal } from './SaltLakeCountyJailModal'
import { SwigDriveThruModal } from '../CityStops/SwigDriveThruModal'
import { WhaleRoundaboutModal } from '../CityStops/WhaleRoundaboutModal'
import { SevenElevenGasModal } from '../CityStops/SevenElevenGasModal'
import { X96StudioModal } from '../CityStops/X96StudioModal'
import { SNOWBOARDS_LIST, RIDERS_LIST } from '../../data/snowboardGear'
import confetti from 'canvas-confetti'
import {
  Radio,
  Eye,
  Compass,
  Gauge,
  Fuel,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  Store,
  Siren,
  Lock,
  SkipForward,
  Menu,
  X,
  Waves
} from 'lucide-react'

const RANDOM_COP_REASONS = [
  "Clocked 56 MPH in a 35 MPH Coastal Zone past Treasure Island Montage",
  "Excessive Speed & Surfboards Whistling on PCH Roof Rack",
  "Blasting 90s SoCal Punk Rock & Double-Parking by The Taco Stand",
  "Carving Lanes on Pacific Coast Highway to Check the Swell at Salt Creek",
  "Suspected Unlicensed Swell Chasing toward Lower Trestles",
  "Tailgating a Beach Cruiser Tricked Out with Catch Surf Boards",
  "Fresh Sticky Bumps Speed Wax Glistening in the CHP Radar Beam"
]

export const CanyonDriveContainer: React.FC = () => {
  const [phase, setPhase] = useState<EXPERIENCE_PHASE>(EXPERIENCE_PHASE.MILOSPORT_SHOP)
  const [selectedBoardId, setSelectedBoardId] = useState<string>('forum-destroyer')
  const [selectedRiderId, setSelectedRiderId] = useState<string>('jp-walker')
  const [selectedSpotId, setSelectedSpotId] = useState<SurfSpotId>('trestles_wsl')
  const [showSpotSelectorModal, setShowSpotSelectorModal] = useState<boolean>(false)
  const [cameraView, setCameraView] = useState<CAMERA_VIEW>(CAMERA_VIEW.GTA_TOP_DOWN)
  const [driveMode, setDriveMode] = useState<DRIVE_MODE>(DRIVE_MODE.AUTOPILOT)
  const [radioStatus, setRadioStatus] = useState<RadioStatus>(() => CanyonAudioEngine.get().getRadioStatus())
  const [audioStarted, setAudioStarted] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const [carState, setCarState] = useState<PlayerCarState>({
    x: 0,
    y: 0,
    angle: 0,
    speed: 35,
    steering: 0,
    distanceMiles: 0.0,
    elevationFt: 45,
    driveMode: DRIVE_MODE.AUTOPILOT,
    cameraView: CAMERA_VIEW.GTA_TOP_DOWN,
    radioMuted: false,
    wipersActive: false,
    headlights: true,
    silenceObserved: false,
    prayersCount: 1337,
    selectedBoardId: 'forum-destroyer',
    selectedRiderId: 'jp-walker',
    selectedSpotId: 'trestles_wsl',
    tireOptionId: 'snow_tires',
    hasTractionPass: false,
    purchasedPassIds: [],
    waxScore: 0,
    waxFormulaId: 'all_temp_purple',
    waxSpeedMultiplier: 1.0,
    isPulledOver: false,
    pulledOverReason: '',
    copEncounterCount: 0,
    fuelLevel: 25,
    fuelGrade: '87',
    hasGasDashChase: false,
    chaseSecondsLeft: 0
  })

  const keysDownRef = useRef<{ [key: string]: boolean }>({})
  const carStateRef = useRef(carState)
  const lastCopMileRef = useRef<number>(-10)
  const lastCopRollTimeRef = useRef<number>(0)

  useEffect(() => {
    carStateRef.current = carState
  }, [carState])

  useEffect(() => {
    return CanyonAudioEngine.get().subscribeRadio(status => {
      setRadioStatus(status)
      const next = {
        ...carStateRef.current,
        radioStationLabel: status.label,
        radioNowPlaying: status.nowPlaying
      }
      carStateRef.current = next
      setCarState(next)
    })
  }, [])

  const initAudio = useCallback(() => {
    if (!audioStarted) {
      CanyonAudioEngine.get().init()
      setAudioStarted(true)
    }
  }, [audioStarted])

  const triggerCopPullOver = useCallback((customReason?: string) => {
    initAudio()
    CanyonAudioEngine.get().playPoliceSiren()
    const reason = customReason || RANDOM_COP_REASONS[Math.floor(Math.random() * RANDOM_COP_REASONS.length)]
    lastCopMileRef.current = carStateRef.current.distanceMiles
    setCarState(prev => {
      const next = {
        ...prev,
        isPulledOver: true,
        pulledOverReason: reason,
        copEncounterCount: (prev.copEncounterCount || 0) + 1
      }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleResolvePullOver = useCallback((prayerBonusOrCost: number) => {
    initAudio()
    setCarState(prev => {
      const next = {
        ...prev,
        isPulledOver: false,
        prayersCount: Math.max(0, prev.prayersCount + prayerBonusOrCost),
        speed: 42
      }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const triggerArrest = useCallback((customReason?: string) => {
    initAudio()
    CanyonAudioEngine.get().playJailDoorSlam()
    const reason = customReason || "Reckless PCH Speeding & Evading Harbor Patrol"
    setCarState(prev => {
      const next = {
        ...prev,
        isPulledOver: false,
        isArrested: true,
        arrestReason: reason,
        arrestCount: (prev.arrestCount || 0) + 1,
        speed: 0
      }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleReleaseFromJail = useCallback((prayerBonusOrCost: number) => {
    initAudio()
    CanyonAudioEngine.get().playBailBuzzer()
    setCarState(prev => {
      const next = {
        ...prev,
        isArrested: false,
        prayersCount: Math.max(0, prev.prayersCount + prayerBonusOrCost),
        speed: 35
      }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleTriggerSwig = useCallback(() => {
    initAudio()
    setCarState(prev => {
      const next = { ...prev, isAtSwig: true, isAtWhale: false, isAtX96: false, speed: 0 }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleFinishSwig = useCallback((drinkName: string, prayerBonus: number) => {
    initAudio()
    setCarState(prev => {
      const next = {
        ...prev,
        isAtSwig: false,
        hasSwigBuff: true,
        swigDrinkName: drinkName,
        prayersCount: prev.prayersCount + prayerBonus,
        speed: 48
      }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleTriggerWhale = useCallback(() => {
    initAudio()
    setCarState(prev => {
      const next = { ...prev, isAtWhale: true, isAtSwig: false, isAtX96: false, speed: 0 }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleFinishWhale = useCallback((prayerBonus: number) => {
    initAudio()
    setCarState(prev => {
      const next = {
        ...prev,
        isAtWhale: false,
        hasWhaleBlessing: true,
        prayersCount: prev.prayersCount + prayerBonus,
        speed: 45
      }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleTrigger711 = useCallback(() => {
    initAudio()
    setCarState(prev => {
      const next = { ...prev, isAt711: true, isAtSwig: false, isAtWhale: false, isAtX96: false, speed: 0 }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handlePayAndCruise711 = useCallback((fuelPercent: number, fuelGrade: string, _gallons: number, snack: string | undefined, bonusPrayers: number) => {
    initAudio()
    setCarState(prev => {
      const next = {
        ...prev,
        isAt711: false,
        fuelLevel: fuelPercent,
        fuelGrade,
        snackItemName: snack,
        prayersCount: prev.prayersCount + bonusPrayers,
        speed: 38
      }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleGasAndDash711 = useCallback((fuelPercent: number, _gallons: number, snack: string | undefined) => {
    initAudio()
    setCarState(prev => {
      const next = {
        ...prev,
        isAt711: false,
        hasGasDashChase: true,
        chaseSecondsLeft: 25,
        fuelLevel: fuelPercent,
        snackItemName: snack,
        speed: 65
      }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleTriggerX96 = useCallback(() => {
    initAudio()
    setCarState(prev => {
      const next = { ...prev, isAtX96: true, isAtSwig: false, isAtWhale: false, isAt711: false, speed: 0 }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  const handleFinishX96 = useCallback((prayerBonus: number, prizePassId: string | null, claimedPrize: boolean) => {
    initAudio()
    const engine = CanyonAudioEngine.get()
    if (engine.getRadioStatus().station !== 'x96') engine.tuneStation('x96')
    setCarState(prev => {
      const next = {
        ...prev,
        isAtX96: false,
        hasX96Prize: prev.hasX96Prize || claimedPrize,
        purchasedPassIds: prizePassId && !prev.purchasedPassIds.includes(prizePassId)
          ? [...prev.purchasedPassIds, prizePassId]
          : prev.purchasedPassIds,
        prayersCount: prev.prayersCount + prayerBonus,
        speed: 40
      }
      carStateRef.current = next
      return next
    })
  }, [initAudio])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      initAudio()
      keysDownRef.current[e.key] = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.key] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [initAudio])

  useEffect(() => {
    let animId: number
    let lastTime = performance.now()

    const updateLoop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000)
      lastTime = now

      const current = carStateRef.current

      const atCheckpoint = current.distanceMiles >= 1.0 && current.distanceMiles <= 1.4 && !current.hasTractionPass
      const isPulledOver = !!current.isPulledOver
      const isAtStop = !!current.isAtSwig || !!current.isAtWhale || !!current.isAt711 || !!current.isAtX96
      const isChased = !!current.hasGasDashChase
      const swigMultiplier = current.hasSwigBuff ? 1.25 : 1.0
      const whaleMultiplier = current.hasWhaleBlessing ? 1.15 : 1.0
      const waxMultiplier = (current.waxSpeedMultiplier || 1.0) * swigMultiplier * whaleMultiplier

      if (driveMode === DRIVE_MODE.AUTOPILOT) {
        const roadCurvature = CanyonRoute.getRoadCurvature(current.distanceMiles)
        current.steering = roadCurvature * 0.7
        current.angle = CanyonRoute.getRoadPosition(current.distanceMiles).angle

        if (isPulledOver || atCheckpoint || isAtStop) {
          current.speed = Math.max(0, current.speed - dt * 35)
        } else if (isChased) {
          current.speed = Math.min(68, current.speed + dt * 20)
        } else if (CanyonRoute.isSilentRockZone(current.distanceMiles)) {
          current.speed = Math.max(12, current.speed - dt * 20)
        } else {
          current.speed = Math.min(40 * waxMultiplier, current.speed + dt * 10)
        }
      } else {
        if (keysDownRef.current['ArrowLeft'] || keysDownRef.current['a'] || keysDownRef.current['A']) {
          current.steering = Math.max(-1, current.steering - dt * 3)
        } else if (keysDownRef.current['ArrowRight'] || keysDownRef.current['d'] || keysDownRef.current['D']) {
          current.steering = Math.min(1, current.steering + dt * 3)
        } else {
          current.steering *= 0.85
        }

        if (isPulledOver || atCheckpoint || isAtStop) {
          current.speed = Math.max(0, current.speed - dt * 35)
        } else if (keysDownRef.current['ArrowUp'] || keysDownRef.current['w'] || keysDownRef.current['W']) {
          const maxSpeed = isChased ? 72 : 60 * waxMultiplier
          current.speed = Math.min(maxSpeed, current.speed + dt * (isChased ? 30 : 25))
        } else if (keysDownRef.current['ArrowDown'] || keysDownRef.current['s'] || keysDownRef.current['S']) {
          current.speed = Math.max(0, current.speed - dt * 35)
        } else {
          current.speed = Math.max(0, current.speed - dt * 4)
        }

        current.angle += current.steering * dt * (current.speed / 25)
      }

      if (current.hasGasDashChase) {
        current.chaseSecondsLeft = Math.max(0, (current.chaseSecondsLeft || 25) - dt)

        if (current.speed < 24 && !isAtStop && !atCheckpoint) {
          current.hasGasDashChase = false
          triggerArrest('Boxed in by CHP: $52.00 Fuel & Açaí Dash on Pacific Coast Highway')
        } else if (current.chaseSecondsLeft <= 0 || current.distanceMiles >= 9.5) {
          current.hasGasDashChase = false
          current.evadedCopCount = (current.evadedCopCount || 0) + 1
          current.prayersCount += 600
          try {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ef4444', '#3b82f6', '#ffffff', '#38bdf8']
            })
          } catch {
            // fallback
          }
        }
      }

      if (
        !current.isPulledOver &&
        !current.isArrested &&
        !current.isAtSwig &&
        !current.isAtWhale &&
        !current.isAt711 &&
        !current.isAtX96 &&
        !current.hasGasDashChase &&
        !atCheckpoint &&
        current.distanceMiles >= 1.8 &&
        current.distanceMiles <= 15.8 &&
        !CanyonRoute.isSilentRockZone(current.distanceMiles) &&
        current.distanceMiles - lastCopMileRef.current >= 3.5 &&
        now - lastCopRollTimeRef.current >= 4000
      ) {
        lastCopRollTimeRef.current = now
        const isSpeeding = current.speed > 44
        const pullOverChance = isSpeeding ? 0.08 : 0.025
        if (Math.random() < pullOverChance) {
          triggerCopPullOver(isSpeeding ? `Clocked ${Math.round(current.speed)} MPH in a 35 MPH PCH Zone` : undefined)
        }
      }

      const simSpeedMultiplier = 1.9
      const milesDelta = (current.speed / 3600) * dt * simSpeedMultiplier
      current.distanceMiles = Math.min(CanyonRoute.TOTAL_MILES, current.distanceMiles + milesDelta)

      current.elevationFt = CanyonRoute.getElevation(current.distanceMiles)
      const roadPos = CanyonRoute.getRoadPosition(current.distanceMiles)
      current.x = roadPos.x
      current.y = roadPos.y

      // Automatically sync nearest surf spot as player drives past Dana Point, SC Pier, and Trestles
      if (current.distanceMiles >= 8.8 && current.distanceMiles < 12.0 && current.selectedSpotId !== 'dana_point') {
        current.selectedSpotId = 'dana_point'
        setSelectedSpotId('dana_point')
      } else if (current.distanceMiles >= 12.0 && current.distanceMiles < 15.2 && current.selectedSpotId !== 'san_clemente_pier') {
        current.selectedSpotId = 'san_clemente_pier'
        setSelectedSpotId('san_clemente_pier')
      } else if (current.distanceMiles >= 15.2 && current.selectedSpotId !== 'trestles_wsl') {
        current.selectedSpotId = 'trestles_wsl'
        setSelectedSpotId('trestles_wsl')
      }

      const inSilentZone = CanyonRoute.isSilentRockZone(current.distanceMiles)
      if (inSilentZone !== current.radioMuted) {
        current.radioMuted = inSilentZone
        CanyonAudioEngine.get().setSilentRockSilence(inSilentZone)
      }

      CanyonAudioEngine.get().updateCarSpeed(current.speed)

      setCarState({ ...current })
      animId = requestAnimationFrame(updateLoop)
    }

    animId = requestAnimationFrame(updateLoop)
    return () => cancelAnimationFrame(animId)
  }, [driveMode, triggerCopPullOver, triggerArrest])

  const handleOfferPrayer = () => {
    initAudio()
    CanyonAudioEngine.get().playShrineChime()

    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#38bdf8', '#00f0ff', '#fde047', '#2dd4bf']
      })
    } catch {
      // Confetti fallback
    }

    carStateRef.current.prayersCount += 1
    carStateRef.current.silenceObserved = true
    setCarState({ ...carStateRef.current })
  }

  const handleToggleRadio = () => {
    initAudio()
    CanyonAudioEngine.get().toggleRadio()
  }

  const handleTuneRadio = () => {
    initAudio()
    CanyonAudioEngine.get().cycleRadioStation()
  }

  const handleTeleport = (mile: number) => {
    initAudio()
    carStateRef.current.distanceMiles = mile
    carStateRef.current.elevationFt = CanyonRoute.getElevation(mile)
    carStateRef.current.radioMuted = CanyonRoute.isSilentRockZone(mile)
    CanyonAudioEngine.get().setSilentRockSilence(carStateRef.current.radioMuted)
    setCarState({ ...carStateRef.current })
  }

  const handleSelectSpot = (spotId: SurfSpotId) => {
    setSelectedSpotId(spotId)
    const spot = SURF_SPOTS.find(s => s.id === spotId)
    setCarState(prev => {
      const next = {
        ...prev,
        selectedSpotId: spotId,
        distanceMiles: spot ? spot.mile : prev.distanceMiles
      }
      carStateRef.current = next
      return next
    })
  }

  const currentLandmark = CanyonRoute.getCurrentLandmark(carState.distanceMiles)
  const isSilentZone = CanyonRoute.isSilentRockZone(carState.distanceMiles)
  const atBrighton = carState.distanceMiles >= 16.3
  const nearDanaPoint = carState.distanceMiles >= 9.1 && carState.distanceMiles <= 10.2
  const nearScPier = carState.distanceMiles >= 13.1 && carState.distanceMiles <= 14.2

  const activeBoard = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0]
  const activeRider = RIDERS_LIST.find(r => r.id === selectedRiderId) || RIDERS_LIST[0]

  if (phase === EXPERIENCE_PHASE.MILOSPORT_SHOP) {
    return (
      <MilosportShopScreen
        selectedBoardId={selectedBoardId}
        selectedRiderId={selectedRiderId}
        tireOptionId={carState.tireOptionId}
        purchasedPassIds={carState.purchasedPassIds}
        waxScore={carState.waxScore}
        waxFormulaId={carState.waxFormulaId}
        waxSpeedMultiplier={carState.waxSpeedMultiplier}
        prayersCount={carState.prayersCount}
        onSelectBoard={(id) => {
          setSelectedBoardId(id)
          setCarState(c => {
            const next = { ...c, selectedBoardId: id }
            carStateRef.current = next
            return next
          })
        }}
        onSelectRider={(id) => {
          setSelectedRiderId(id)
          setCarState(c => {
            const next = { ...c, selectedRiderId: id }
            carStateRef.current = next
            return next
          })
        }}
        onSelectTire={(tireId) => {
          setCarState(c => {
            const next = { ...c, tireOptionId: tireId, hasTractionPass: false }
            carStateRef.current = next
            return next
          })
        }}
        onBuyPass={(passId) => {
          setCarState(c => {
            const next = {
              ...c,
              purchasedPassIds: c.purchasedPassIds.includes(passId)
                ? c.purchasedPassIds
                : [...c.purchasedPassIds, passId]
            }
            carStateRef.current = next
            return next
          })
        }}
        onApplyWaxTune={(formulaId, speedMultiplier, score) => {
          setCarState(c => {
            const next = {
              ...c,
              waxFormulaId: formulaId,
              waxSpeedMultiplier: speedMultiplier,
              waxScore: score
            }
            carStateRef.current = next
            return next
          })
        }}
        onLaunchDrive={() => {
          initAudio()
          setPhase(EXPERIENCE_PHASE.DRIVE_CANYON)
        }}
        onGoToSwig={() => {
          initAudio()
          setPhase(EXPERIENCE_PHASE.DRIVE_CANYON)
          handleTriggerSwig()
        }}
        onGoToWhale={() => {
          initAudio()
          setPhase(EXPERIENCE_PHASE.DRIVE_CANYON)
          handleTriggerWhale()
        }}
        onGoTo711={() => {
          initAudio()
          setPhase(EXPERIENCE_PHASE.DRIVE_CANYON)
          handleTrigger711()
        }}
        onGoToX96={() => {
          initAudio()
          setPhase(EXPERIENCE_PHASE.DRIVE_CANYON)
          handleTriggerX96()
        }}
      />
    )
  }

  if (phase === EXPERIENCE_PHASE.BRIGHTON_SKIFREE) {
    return (
      <BrightonSkiFree
        onReturnToDrive={() => setPhase(EXPERIENCE_PHASE.DRIVE_CANYON)}
        selectedBoardId={selectedBoardId}
        selectedRiderId={selectedRiderId}
        selectedSpotId={selectedSpotId}
        onSelectSpot={handleSelectSpot}
        waxSpeedMultiplier={carState.waxSpeedMultiplier}
        purchasedPassIds={carState.purchasedPassIds}
      />
    )
  }

  return (
    <div
      onClick={initAudio}
      className="relative w-full h-full min-h-screen bg-alpine-bg text-alpine-text flex flex-col overflow-hidden select-none"
    >
      {/* TOP HUD BAR */}
      <header className="z-20 bg-slate-950/85 border-b border-alpine-border/60 px-3 py-2 lg:px-4 lg:py-3 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 lg:gap-3 text-xs font-mono">
        <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 shrink-0 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-alpine-powder text-sm tracking-wide truncate">
              PCH CA-1 &bull; <span className="sm:hidden">OC COAST</span><span className="hidden sm:inline">LAGUNA TO SAN CLEMENTE &amp; TRESTLES</span>
            </span>
          </div>

          {currentLandmark && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>{currentLandmark.name}</span>
            </span>
          )}

          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className={`lg:hidden ml-auto shrink-0 px-3 py-2 rounded-lg border flex items-center gap-1.5 font-bold cursor-pointer transition-all ${
              mobileMenuOpen
                ? 'bg-cyan-900 border-cyan-400 text-white'
                : 'bg-slate-900 border-slate-700 text-cyan-300'
            }`}
            aria-expanded={mobileMenuOpen}
            aria-controls="drive-hud-actions"
            title="Show stops, surf spots, radio, view and drive controls"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>MENU</span>
          </button>
        </div>

        {/* Telemetry counters */}
        <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>MILE: <strong className="text-cyan-400 font-bold">{carState.distanceMiles.toFixed(1)}</strong> / 16.5</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>SWELL: <strong className="text-amber-400 font-bold">6-8 FT @ 17s</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>SPEED: <strong className="text-emerald-400 font-bold">{Math.round(carState.speed)} MPH</strong></span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <Fuel className="w-3.5 h-3.5 text-emerald-400" />
            <span>FUEL: <strong className={carState.fuelLevel && carState.fuelLevel >= 60 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{carState.fuelLevel ?? 25}%</strong></span>
          </div>

          {carState.hasSwigBuff && (
            <div className="hidden xl:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/80 text-amber-300 shadow-sm animate-pulse">
              <span>🌮</span>
              <span className="font-bold">{carState.swigDrinkName || 'Taco Stand'} (+25% SPD)</span>
            </div>
          )}

          {carState.hasWhaleBlessing && (
            <div className="hidden xl:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/80 text-cyan-200 shadow-sm animate-pulse">
              <span>🐬</span>
              <span className="font-bold">DOLPHIN BLESSED (+SWELL)</span>
            </div>
          )}
        </div>

        {/* Action Toggles */}
        <div
          id="drive-hud-actions"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('[data-closes-menu]')) setMobileMenuOpen(false)
          }}
          className={`${mobileMenuOpen ? 'grid' : 'hidden'} grid-cols-2 sm:grid-cols-3 gap-2 w-full max-h-[60vh] overflow-y-auto pt-2 border-t border-slate-800 max-lg:*:justify-center max-lg:*:py-2.5 lg:flex lg:items-center lg:w-auto lg:max-h-none lg:overflow-visible lg:pt-0 lg:border-0`}
        >
          {/* Surf & Paddle Shop Menu button */}
          <button
            data-closes-menu
            onClick={() => setPhase(EXPERIENCE_PHASE.MILOSPORT_SHOP)}
            className="col-span-full px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-600 hover:border-cyan-400 text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer font-bold shadow-md"
            title="Open Surf & Paddle Laguna Beach to swap surfboard, boogie board, or pro surfer"
          >
            <Store className="w-3.5 h-3.5 text-cyan-400" />
            <span>SURF &amp; PADDLE:</span>
            <span className="truncate max-w-[130px]">{activeBoard.brand} &bull; {activeRider.name.split(' ')[0]}</span>
          </button>

          {/* PADDLE OUT / SURF SPOT SELECTOR BUTTON */}
          <button
            data-closes-menu
            onClick={() => setShowSpotSelectorModal(true)}
            className="col-span-full sm:col-span-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Paddle out & surf Dana Point, San Clemente Pier, or Lower Trestles (WSL)!"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>SURF SPOTS</span>
          </button>

          {/* The Taco Stand Button */}
          <button
            data-closes-menu
            onClick={handleTriggerSwig}
            disabled={carState.isAtSwig || carState.isPulledOver || carState.isArrested}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              carState.isAtSwig
                ? 'bg-amber-900 border-amber-400 text-white animate-pulse'
                : carState.hasSwigBuff
                ? 'bg-amber-950/60 border-amber-700/80 hover:border-amber-400 text-amber-300'
                : 'bg-slate-900 border-slate-700 hover:border-amber-500 text-amber-300'
            }`}
            title="Stop at The Taco Stand in Laguna Beach for Al Pastor Tacos, Carne Asada Burritos & Churros"
          >
            <span>🌮</span>
            <span>TACO STAND</span>
          </button>

          {/* Laguna Dolphin Shrine Button */}
          <button
            data-closes-menu
            onClick={handleTriggerWhale}
            disabled={carState.isAtWhale || carState.isPulledOver || carState.isArrested}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              carState.isAtWhale
                ? 'bg-cyan-900 border-cyan-400 text-white animate-pulse'
                : carState.hasWhaleBlessing
                ? 'bg-cyan-950/60 border-cyan-700/80 hover:border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-700 hover:border-cyan-500 text-cyan-300'
            }`}
            title="Visit the Sacred Laguna Dolphin & Whale Swell Shrine"
          >
            <span>🐬</span>
            <span>SHRINE</span>
          </button>

          {/* PCH 76 Gas & Açaí Stop Button */}
          <button
            data-closes-menu
            onClick={handleTrigger711}
            disabled={carState.isAt711 || carState.isPulledOver || carState.isArrested || carState.hasGasDashChase}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              carState.isAt711
                ? 'bg-emerald-900 border-emerald-400 text-white animate-pulse'
                : carState.fuelLevel && carState.fuelLevel >= 80
                ? 'bg-emerald-950/60 border-emerald-700/80 hover:border-emerald-400 text-emerald-300'
                : 'bg-slate-900 border-slate-700 hover:border-emerald-500 text-emerald-300'
            }`}
            title="Stop at PCH Coastal 76 for Gas, Banzai Açaí Bowls & Neon Zinc"
          >
            <span>⛽</span>
            <span>PCH GAS</span>
          </button>

          {/* KROQ / Surfline Broadcast Booth Button */}
          <button
            data-closes-menu
            onClick={handleTriggerX96}
            disabled={carState.isAtX96 || carState.isPulledOver || carState.isArrested || carState.hasGasDashChase}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              carState.isAtX96
                ? 'bg-yellow-900 border-yellow-400 text-white animate-pulse'
                : carState.hasX96Prize
                ? 'bg-yellow-950/60 border-yellow-700/80 hover:border-yellow-400 text-yellow-200'
                : 'bg-slate-900 border-slate-700 hover:border-yellow-500 text-yellow-300'
            }`}
            title="Stop by the KROQ 106.7 & Surfline Swell Desk for Kook of the Day WSL Passes"
          >
            <span>📻</span>
            <span>KROQ</span>
          </button>

          {/* Camera View Toggle */}
          <button
            onClick={() => setCameraView(v => v === CAMERA_VIEW.GTA_TOP_DOWN ? CAMERA_VIEW.COCKPIT_WINDSHIELD : CAMERA_VIEW.GTA_TOP_DOWN)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500 text-sky-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Toggle between Top-Down Coastal Map and PCH Windshield Cockpit"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>VIEW:</span>
            <span>{cameraView === CAMERA_VIEW.GTA_TOP_DOWN ? 'COAST MAP' : 'WINDSHIELD'}</span>
          </button>

          {/* Drive Mode Toggle */}
          <button
            onClick={() => setDriveMode(m => m === DRIVE_MODE.AUTOPILOT ? DRIVE_MODE.MANUAL : DRIVE_MODE.AUTOPILOT)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              driveMode === DRIVE_MODE.AUTOPILOT
                ? 'bg-sky-950 border-sky-600 text-sky-200'
                : 'bg-emerald-950 border-emerald-600 text-emerald-200'
            }`}
            title="Toggle Cruise / Autopilot vs Manual Keyboard Steering"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{driveMode === DRIVE_MODE.AUTOPILOT ? 'CRUISE: ON' : 'MANUAL'}</span>
          </button>

          {/* Radio Toggle */}
          <button
            onClick={handleToggleRadio}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              carState.radioMuted
                ? 'bg-amber-950 border-amber-800 text-amber-300'
                : radioStatus.playing
                ? 'bg-slate-900 border-slate-700 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={`Radio power: ${radioStatus.label}${radioStatus.nowPlaying ? ` — ${radioStatus.nowPlaying}` : ''}`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">
              {radioStatus.station === 'x96' ? '106.7' : '90.1'}
            </span>
            {carState.radioMuted ? (
              <span className="text-[10px] text-amber-400">WAVES</span>
            ) : radioStatus.playing ? (
              <Volume2 className="w-3 h-3 text-cyan-400" />
            ) : (
              <VolumeX className="w-3 h-3 text-slate-500" />
            )}
          </button>

          {/* Radio Tuner */}
          <button
            onClick={handleTuneRadio}
            className="px-2 py-1.5 rounded-lg border bg-slate-900 border-slate-700 hover:border-yellow-500 text-yellow-300 flex items-center transition-all cursor-pointer"
            title={radioStatus.station === 'x96' ? 'Tune to Pacific Surf Radio 90.1' : 'Tune to KROQ 106.7 FM'}
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="lg:hidden ml-1.5">TUNE</span>
          </button>

          {/* CHP Speed Trap button */}
          <button
            data-closes-menu
            onClick={() => triggerCopPullOver()}
            disabled={carState.isPulledOver || carState.isArrested}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              carState.isPulledOver
                ? 'bg-red-900 border-red-500 text-white animate-pulse'
                : 'bg-red-950/60 border-red-800/80 hover:border-red-500 text-red-300'
            }`}
            title="Trigger CHP Coastal Speed Trap"
          >
            <Siren className="w-3.5 h-3.5 text-red-400" />
            <span>CHP TRAP</span>
          </button>

          {/* OC Holding Tank button */}
          <button
            data-closes-menu
            onClick={() => triggerArrest('Reckless PCH Speeding & Blackball Zone Violation')}
            disabled={carState.isArrested}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              carState.isArrested
                ? 'bg-amber-900 border-amber-500 text-white animate-pulse'
                : 'bg-amber-950/60 border-amber-800/80 hover:border-amber-500 text-amber-300'
            }`}
            title="Visit OC Harbor Patrol & Lifeguard Holding Tank"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>TANK</span>
          </button>

          {/* Quick Landmark Jump Menu */}
          <select
            value={
              carState.distanceMiles < 1.0 ? 0
              : carState.distanceMiles < 2.5 ? 1.4
              : carState.distanceMiles < 4.0 ? 3.2
              : carState.distanceMiles < 6.0 ? 4.5
              : carState.distanceMiles < 8.5 ? 7.2
              : carState.distanceMiles < 11.5 ? 9.5
              : carState.distanceMiles < 15.0 ? 13.5
              : 16.5
            }
            onChange={(e) => {
              handleTeleport(parseFloat(e.target.value))
              setMobileMenuOpen(false)
            }}
            aria-label="Jump to PCH coastal landmark"
            className="col-span-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono cursor-pointer"
          >
            {CANYON_LANDMARKS.map(l => (
              <option key={l.id} value={l.mile}>
                {l.mile.toFixed(1)} mi - {l.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* MAIN VIEWPORT (COASTAL TOP-DOWN OR WINDSHIELD COCKPIT) */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
        {cameraView === CAMERA_VIEW.GTA_TOP_DOWN ? (
          <TopDownView carState={carState} />
        ) : (
          <CockpitView carState={carState} />
        )}

        {/* QUICK PADDLE-OUT BANNER WHEN PASSING DANA POINT OR SAN CLEMENTE PIER */}
        {(nearDanaPoint || nearScPier) && !showSpotSelectorModal && !isSilentZone && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-xl w-[92%] bg-slate-950/90 border border-cyan-400 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-xs font-mono">
              <div className="text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span>
                  {nearDanaPoint
                    ? 'Passing Dana Point & Doheny (Mile 9.5)'
                    : 'Passing San Clemente Pier & T-Street (Mile 13.5)'}
                </span>
              </div>
              <div className="text-slate-300 text-[11px] mt-0.5">
                {nearDanaPoint
                  ? 'Dolphins & Sea Turtles in the lineup! Pull over to surf here or keep cruising south to Pier & Trestles.'
                  : 'Pier pilings barreling with locals! Pull over to shred the Pier or keep cruising 3 miles to the WSL Finals at Trestles.'}
              </div>
            </div>
            <button
              onClick={() => {
                handleSelectSpot(nearDanaPoint ? 'dana_point' : 'san_clemente_pier')
                setPhase(EXPERIENCE_PHASE.BRIGHTON_SKIFREE)
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase whitespace-nowrap cursor-pointer shadow-md"
            >
              Surf {nearDanaPoint ? 'Dana Point' : 'SC Pier'} 🏄
            </button>
          </div>
        )}

        {/* HIGH-SPEED CHP PURSUIT BANNER */}
        {carState.hasGasDashChase && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-950/95 via-rose-900/95 to-red-950/95 border-2 border-red-500 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 animate-pulse max-w-2xl w-full">
            <div className="flex items-center gap-2.5">
              <Siren className="w-5 h-5 text-red-400 animate-spin" />
              <div>
                <div className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  🚨 CHP CODE 3 PURSUIT: GAS &amp; AÇAÍ DASH ON PCH!
                </div>
                <div className="text-[11px] text-red-200 font-mono">
                  Evade countdown: <strong className="text-amber-300 text-sm">{Math.ceil(carState.chaseSecondsLeft || 0)}s</strong> &bull; Don&apos;t drop below 24 MPH or Harbor Patrol boxes you in!
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCarState(c => ({ ...c, hasGasDashChase: false }))
                triggerArrest('Surrendered after High-Speed PCH 76 Fuel & Açaí Dash')
              }}
              className="px-3 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-mono text-xs font-bold border border-red-400 shadow-md cursor-pointer transition-colors"
            >
              PULL OVER &amp; SURRENDER
            </button>
          </div>
        )}

        {/* Floating Shotgun Passenger Dialogue */}
        <PassengerDialogue
          rider={activeRider}
          board={activeBoard}
          carState={carState}
          onOpenMiloShop={() => setPhase(EXPERIENCE_PHASE.MILOSPORT_SHOP)}
        />

        {/* PCH ROOF RACK & SURF STRAP CHECKPOINT (Mile 1.0 - 1.4) */}
        {carState.distanceMiles >= 1.0 && carState.distanceMiles <= 1.4 && !carState.hasTractionPass && (
          <TractionLawCheckpointModal
            carState={carState}
            onPassCheckpoint={(equippedTireId) => {
              setCarState(prev => {
                const next = {
                  ...prev,
                  hasTractionPass: true,
                  tireOptionId: equippedTireId || prev.tireOptionId
                }
                carStateRef.current = next
                return next
              })
            }}
            onReturnToMiloShop={() => {
              setCarState(prev => {
                const next = {
                  ...prev,
                  distanceMiles: 0.0,
                  speed: 0
                }
                carStateRef.current = next
                return next
              })
              setPhase(EXPERIENCE_PHASE.MILOSPORT_SHOP)
            }}
          />
        )}

        {/* RANDOM CHP COP PULL-OVER MODAL */}
        {carState.isPulledOver && (
          <CopPullOverModal
            carState={carState}
            onResolvePullOver={handleResolvePullOver}
            onArrest={triggerArrest}
          />
        )}

        {/* OC HARBOR PATROL HOLDING TANK MODAL */}
        {carState.isArrested && (
          <SaltLakeCountyJailModal
            carState={carState}
            onRelease={handleReleaseFromJail}
          />
        )}

        {/* THE TACO STAND LAGUNA BEACH MODAL */}
        {carState.isAtSwig && (
          <SwigDriveThruModal
            carState={carState}
            onFinishSwig={handleFinishSwig}
            onClose={() => setCarState(c => ({ ...c, isAtSwig: false }))}
          />
        )}

        {/* LAGUNA DOLPHIN & WHALE SWELL SHRINE MODAL */}
        {carState.isAtWhale && (
          <WhaleRoundaboutModal
            carState={carState}
            onFinishWhale={handleFinishWhale}
            onClose={() => setCarState(c => ({ ...c, isAtWhale: false }))}
          />
        )}

        {/* PCH COASTAL 76 GAS & AÇAÍ STOP MODAL */}
        {carState.isAt711 && (
          <SevenElevenGasModal
            carState={carState}
            onPayAndCruise={handlePayAndCruise711}
            onGasAndDash={handleGasAndDash711}
            onClose={() => setCarState(c => ({ ...c, isAt711: false }))}
          />
        )}

        {/* KROQ 106.7 & SURFLINE SWELL BOOTH MODAL */}
        {carState.isAtX96 && (
          <X96StudioModal
            carState={carState}
            onFinishX96={handleFinishX96}
            onClose={() => setCarState(c => ({ ...c, isAtX96: false }))}
          />
        )}

        {/* 1000 STEPS BEACH & TREASURE ISLAND OVERLOOK CARD (Mile 4.25 - 4.75) */}
        {isSilentZone && (
          <SilentRockCard
            onOfferPrayer={handleOfferPrayer}
            prayersCount={carState.prayersCount}
          />
        )}

        {/* SOUTH COAST SURF SPOT ARRIVAL / SELECTOR SCREEN (Mile 16.3+ or manual trigger) */}
        {(atBrighton || showSpotSelectorModal) && (
          <BrightonArrivalCard
            selectedSpotId={selectedSpotId}
            onSelectSpot={handleSelectSpot}
            onClose={showSpotSelectorModal ? () => setShowSpotSelectorModal(false) : undefined}
            onStartSkiFree={() => {
              setShowSpotSelectorModal(false)
              setPhase(EXPERIENCE_PHASE.BRIGHTON_SKIFREE)
            }}
            prayersCount={carState.prayersCount}
          />
        )}

        {/* Manual drive controls reminder at bottom */}
        {driveMode === DRIVE_MODE.MANUAL && (
          <div className="absolute bottom-4 left-6 z-20 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-sm pointer-events-none">
            Controls: W/&uarr; Gas &bull; S/&darr; Brake &bull; A/D or &larr;/&rarr; Steer
          </div>
        )}

        {/* Audio helper prompt */}
        {!audioStarted && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-cyan-950/90 border border-cyan-500 text-cyan-200 text-xs font-mono flex items-center gap-2 shadow-glow-ice pointer-events-none animate-pulse">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click anywhere to start ocean waves &amp; KROQ 106.7 surf radio</span>
          </div>
        )}
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="z-20 bg-slate-950/90 border-t border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-3 whitespace-nowrap text-[11px] font-mono text-slate-500">
        <div className="hidden md:flex items-center gap-2">
          <span className="text-cyan-400 font-bold">prayfortheocean.com</span>
          <span>&bull;</span>
          <span>Laguna Surf &amp; Paddle + Taco Stand &rarr; 1000 Steps &rarr; Dana Point &rarr; SC Pier &rarr; Trestles WSL</span>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <button
            onClick={() => setPhase(EXPERIENCE_PHASE.MILOSPORT_SHOP)}
            className="hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Store className="w-3 h-3 text-cyan-400" />
            <span>Surf &amp; Paddle<span className="hidden sm:inline"> + Taco Stand</span></span>
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setShowSpotSelectorModal(true)}
            className="hover:text-amber-300 text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors font-bold"
          >
            <Waves className="w-3 h-3 text-cyan-400" />
            <span>Surf Spots</span>
          </button>
          <span>&bull;</span>
          <button
            onClick={() => handleTeleport(0)}
            className="hover:text-sky-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart<span className="hidden sm:inline"> PCH</span></span>
          </button>
          <span>&bull;</span>
          <div className="flex items-center gap-1 text-cyan-400">
            <Sparkles className="w-3 h-3" />
            <span>Prayers: {carState.prayersCount.toLocaleString()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
