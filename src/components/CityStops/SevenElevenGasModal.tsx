import React, { useState, useEffect, useRef } from 'react'
import {
  RIDERS_LIST,
  type RiderPro
} from '../../data/snowboardGear'
import type { PlayerCarState } from '../../types/game'
import { CanyonAudioEngine } from '../../utils/audioEngine'
import {
  Fuel,
  Sparkles,
  Siren,
  ShoppingBag,
  CreditCard
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props {
  carState: PlayerCarState;
  onPayAndCruise: (fuelLevel: number, fuelGrade: string, gallons: number, snack: string | undefined, bonusPrayers: number) => void;
  onGasAndDash: (fuelLevel: number, gallons: number, snack: string | undefined) => void;
  onClose: () => void;
}

interface FuelGradeOption {
  octane: string;
  name: string;
  pricePerGal: number;
  description: string;
  color: string;
}

const FUEL_GRADES: FuelGradeOption[] = [
  {
    octane: '87',
    name: 'SoCal Coastal Regular',
    pricePerGal: 4.79,
    description: 'Standard PCH cruiser blend for Laguna to Dana Point',
    color: '#10b981'
  },
  {
    octane: '89',
    name: 'San Clemente Pier Plus',
    pricePerGal: 5.09,
    description: 'Smooth coastal torque with roof racks & surfboards loaded',
    color: '#06b6d4'
  },
  {
    octane: '91',
    name: 'Trestles WSL Finals Supreme',
    pricePerGal: 5.49,
    description: 'High-octane performance for racing swell periods down PCH',
    color: '#f59e0b'
  }
]

interface SnackOption {
  id: string;
  name: string;
  category: string;
  bonusPrayers: number;
  description: string;
  emoji: string;
}

const SNACK_OPTIONS: SnackOption[] = [
  {
    id: 'acai-bowl',
    name: 'Sambazon Peanut Butter Açaí Bowl',
    category: 'Surf Superfood',
    bonusPrayers: 90,
    description: 'Topped with bananas, granola, coconut shavings & honey',
    emoji: '🥣'
  },
  {
    id: 'pink-zinc',
    name: 'Neon Pink Lifeguard Nose Zinc SPF 50',
    category: 'Reef-Safe Sun Care',
    bonusPrayers: 80,
    description: 'Reef-safe mineral zinc so you don’t fry during a 4-hour Trestles session',
    emoji: '☀️'
  },
  {
    id: 'coconut-water',
    name: 'Ice-Cold Harmless Harvest Coconut Water',
    category: 'Hydration Cooler',
    bonusPrayers: 75,
    description: 'Electrolytes for hiking back up the 219 stairs at 1000 Steps Beach',
    emoji: '🥥'
  },
  {
    id: 'red-bull',
    name: 'Watermelon Red Bull (WSL Edition)',
    category: 'Energy Drinks',
    bonusPrayers: 85,
    description: 'Official wings for launching full-rotation alley-oops at Lowers',
    emoji: '⚡'
  }
]

export const SevenElevenGasModal: React.FC<Props> = ({
  carState,
  onPayAndCruise,
  onGasAndDash,
  onClose
}) => {
  const rider: RiderPro = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0]

  const [selectedGrade, setSelectedGrade] = useState<FuelGradeOption>(FUEL_GRADES[0])
  const [gallons, setGallons] = useState<number>(3.5)
  const [isPumping, setIsPumping] = useState<boolean>(false)
  const [selectedSnack, setSelectedSnack] = useState<SnackOption | null>(null)
  const [exactDollarHit, setExactDollarHit] = useState<boolean>(false)

  const pumpingIntervalRef = useRef<number | null>(null)
  const maxGallons = 14.0

  const totalPrice = gallons * selectedGrade.pricePerGal
  const fuelPercent = Math.min(100, Math.round((gallons / maxGallons) * 100))

  const startPumping = () => {
    if (gallons >= maxGallons) return
    setIsPumping(true)
  }

  const stopPumping = () => {
    setIsPumping(false)
    if (pumpingIntervalRef.current) {
      window.clearInterval(pumpingIntervalRef.current)
      pumpingIntervalRef.current = null
    }

    const cents = Math.round((gallons * selectedGrade.pricePerGal * 100) % 100)
    if (cents === 0 && gallons > 4.0) {
      setExactDollarHit(true)
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#10b981', '#06b6d4', '#ffffff']
        })
      } catch {
        // Fallback
      }
    }
  }

  useEffect(() => {
    if (isPumping) {
      pumpingIntervalRef.current = window.setInterval(() => {
        setGallons(prev => {
          if (prev >= maxGallons) {
            setIsPumping(false)
            return maxGallons
          }
          CanyonAudioEngine.get().playGasPumpClick()
          return +(prev + 0.12).toFixed(2)
        })
      }, 75)
    } else {
      if (pumpingIntervalRef.current) {
        window.clearInterval(pumpingIntervalRef.current)
        pumpingIntervalRef.current = null
      }
    }

    return () => {
      if (pumpingIntervalRef.current) {
        window.clearInterval(pumpingIntervalRef.current)
      }
    }
  }, [isPumping, maxGallons])

  const handleFillTankFull = () => {
    setGallons(maxGallons)
    CanyonAudioEngine.get().playGasPumpClick()
  }

  const handlePay = () => {
    CanyonAudioEngine.get().playCashRegister()
    let prayerBonus = 150
    if (exactDollarHit) prayerBonus += 100
    if (fuelPercent === 100) prayerBonus += 75
    if (selectedSnack) prayerBonus += selectedSnack.bonusPrayers

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#fbbf24']
      })
    } catch {
      // Fallback
    }

    onPayAndCruise(fuelPercent, selectedGrade.octane, gallons, selectedSnack?.name, prayerBonus)
  }

  const handleDash = () => {
    CanyonAudioEngine.get().playTireScreech()
    setTimeout(() => {
      CanyonAudioEngine.get().playPoliceSiren()
    }, 400)
    onGasAndDash(fuelPercent, gallons, selectedSnack?.name)
  }

  const getProPassengerQuote = () => {
    switch (rider.id) {
      case 'jp-walker':
        return "Top off the tank and grab a Sambazon Açaí Bowl! We've got 1000 Steps, Dana Point, San Clemente Pier, and Lower Trestles lined up today!"
      case 'scott-stevens':
        return "Put extra hot-pink Zinc on your nose! The sun reflecting off the water at Treasure Island and the Pier is no joke!"
      case 'peter-line':
        return "Grab some coconut water for the walk down the Trestles trail. And don't peel out—CHP motorcycles hide right behind the palm trees!"
      default:
        return "Fill up the tank, grab reef-safe zinc and an açaí bowl, and let's cruise down Pacific Coast Highway!"
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-slate-900 border-2 border-emerald-500/70 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 my-auto">
        {/* Top Branding Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-cyan-600 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center font-black">
                <span className="text-orange-400 text-sm leading-none font-sans">76</span>
                <span className="text-cyan-400 text-[9px] leading-none font-mono">PCH</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  PACIFIC COAST HWY • CROWN VALLEY
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">PUMP #4</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
                PCH Coastal Surf Fuel, Açaí &amp; Zinc Stop
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            &times; Skip Stop
          </button>
        </div>

        {/* Shotgun Passenger Dialogue */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-3">
          <span className="text-2xl mt-0.5">⛽</span>
          <div className="text-xs font-mono">
            <span className="text-emerald-400 font-bold">{rider.name}</span>
            <span className="text-slate-500"> at the PCH fuel island:</span>
            <p className="text-slate-200 italic mt-0.5">&ldquo;{getProPassengerQuote()}&rdquo;</p>
          </div>
        </div>

        {/* GAS PUMP DISPLAY */}
        <div className="bg-emerald-950/30 border-2 border-emerald-600/80 rounded-2xl p-4 sm:p-5 shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Fuel className="w-4 h-4 text-emerald-400" />
              COASTAL PUMP 04 • CALIFORNIA CLEAN FUEL
            </span>
            <span className="text-slate-400">UNLEADED</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 my-3">
            <div className="bg-black/90 border border-emerald-500/50 rounded-xl p-2.5 sm:p-3 text-center">
              <span className="block text-[10px] font-mono text-slate-400 uppercase">Total Sale $</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 tracking-wider">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="bg-black/90 border border-emerald-500/50 rounded-xl p-2.5 sm:p-3 text-center">
              <span className="block text-[10px] font-mono text-slate-400 uppercase">Gallons</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-cyan-400 tracking-wider">
                {gallons.toFixed(2)}
              </span>
            </div>

            <div className="bg-black/90 border border-emerald-500/50 rounded-xl p-2.5 sm:p-3 text-center">
              <span className="block text-[10px] font-mono text-slate-400 uppercase">Price / Gal</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-400 tracking-wider">
                ${selectedGrade.pricePerGal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-1 mt-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Surf Wagon Fuel Level:</span>
              <span className={`font-bold ${fuelPercent >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {fuelPercent}% {fuelPercent === 100 && '(FULL TANK)'}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  fuelPercent >= 80 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-amber-500'
                }`}
                style={{ width: `${fuelPercent}%` }}
              />
            </div>
          </div>

          {exactDollarHit && (
            <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-400 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>EXACT DOLLAR BARREL! Stopped on .00 cents (+100 Ocean Prayers)!</span>
            </div>
          )}

          <div className="mt-4">
            <span className="block text-xs font-mono text-slate-400 mb-2 font-bold uppercase">
              Select Octane Grade:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {FUEL_GRADES.map(grade => {
                const isSelected = grade.octane === selectedGrade.octane
                return (
                  <button
                    key={grade.octane}
                    onClick={() => setSelectedGrade(grade)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-400 shadow-md ring-1 ring-emerald-400'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black font-mono" style={{ color: grade.color }}>
                        {grade.octane} OCTANE
                      </span>
                      <span className="text-xs font-mono text-slate-300 font-bold">
                        ${grade.pricePerGal.toFixed(2)}
                      </span>
                    </div>
                    <span className="block text-[11px] text-slate-200 font-bold mt-0.5">{grade.name}</span>
                    <span className="block text-[10px] text-slate-400 leading-tight mt-0.5">
                      {grade.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-emerald-900/50">
            <button
              onMouseDown={startPumping}
              onMouseUp={stopPumping}
              onMouseLeave={stopPumping}
              onTouchStart={startPumping}
              onTouchEnd={stopPumping}
              className={`flex-1 py-3 px-4 rounded-xl font-black font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg select-none transition-all ${
                isPumping
                  ? 'bg-emerald-400 text-slate-950 scale-[0.98] ring-4 ring-emerald-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
              }`}
            >
              <Fuel className={`w-4 h-4 ${isPumping ? 'animate-spin' : ''}`} />
              <span>{isPumping ? 'PUMPING COASTAL FUEL...' : 'HOLD NOZZLE TO PUMP FUEL'}</span>
            </button>

            <button
              onClick={handleFillTankFull}
              className="py-3 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              FILL TANK (14 GAL)
            </button>
          </div>
        </div>

        {/* BEACH ESSENTIALS SHELF */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              ADD SURF SESSION ESSENTIALS (AÇAÍ, ZINC &amp; COCONUT WATER):
            </span>
            {selectedSnack && (
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Selected: {selectedSnack.name} (+{selectedSnack.bonusPrayers} Pts)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SNACK_OPTIONS.map(snack => {
              const isSelected = selectedSnack?.id === snack.id
              return (
                <button
                  key={snack.id}
                  onClick={() => setSelectedSnack(isSelected ? null : snack)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{snack.emoji}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                      +{snack.bonusPrayers}
                    </span>
                  </div>
                  <span className="block text-xs font-bold text-white truncate">{snack.name}</span>
                  <span className="block text-[10px] text-slate-400 truncate">{snack.category}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* PAY VS GAS & DASH */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handlePay}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
              <div className="text-left">
                <div>PAY ${totalPrice.toFixed(2)} &amp; CRUISE PCH</div>
                <div className="text-[10px] opacity-80 lowercase font-normal">
                  full tank &bull; zinc applied &bull; chill vibes
                </div>
              </div>
            </button>

            <button
              onClick={handleDash}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-rose-500 text-white font-black font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-glow-gold cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse"
            >
              <Siren className="w-4 h-4" />
              <div className="text-left">
                <div>GAS &amp; DASH DOWN PCH! 🚨</div>
                <div className="text-[10px] text-red-200 lowercase font-normal">
                  peel out &bull; CHP pursuits you past Dana Point
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
