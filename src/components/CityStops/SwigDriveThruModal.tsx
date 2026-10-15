import React, { useState } from 'react'
import {
  RIDERS_LIST,
  type RiderPro
} from '../../data/snowboardGear'
import type { PlayerCarState } from '../../types/game'
import { CanyonAudioEngine } from '../../utils/audioEngine'
import {
  Sparkles,
  Utensils,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props {
  carState: PlayerCarState;
  onFinishSwig: (drinkName: string, prayerBonus: number) => void;
  onClose: () => void;
}

interface TacoStandItem {
  id: string;
  name: string;
  tortilla: string;
  fillings: string;
  bonusPrayers: number;
  speedBuffText: string;
  color: string;
  tag: string;
}

const TACO_STAND_MENU: TacoStandItem[] = [
  {
    id: 'al-pastor-taco',
    name: 'Al Pastor Tacos (Off the Spit)',
    tortilla: 'Handmade Corn Tortillas',
    fillings: 'Rotisserie Pork + Sweet Pineapple + Cilantro + Onion + Cilantro Sauce',
    bonusPrayers: 200,
    speedBuffText: '+25% Paddle & Wave Speed',
    color: '#ea580c',
    tag: 'HOUSE LEGEND 🍍'
  },
  {
    id: 'california-burrito',
    name: 'The California Surf Burrito',
    tortilla: 'Warm Flour Tortilla',
    fillings: 'Flame-Grilled Carne Asada + Crispy Fries + Guac + Cheese + Sour Cream',
    bonusPrayers: 225,
    speedBuffText: '+25% Air-Reverse & Barrel Stamina',
    color: '#0284c7',
    tag: 'SURFER FUEL 🌯'
  },
  {
    id: 'baja-fish-taco',
    name: 'Baja Beer-Battered Fish Tacos',
    tortilla: 'Fresh Pressed Corn Tortillas',
    fillings: 'Crispy Line-Caught Cod + Cabbage + Tomato + Chipotle Crema',
    bonusPrayers: 175,
    speedBuffText: '+20% Tube Glide & Float',
    color: '#0d9488',
    tag: 'LAGUNA CLASSIC 🐟'
  },
  {
    id: 'sonora-carne-asada',
    name: 'Sonora Ribeye Steak Taco',
    tortilla: 'Handmade Flour Tortilla + Melted Cheese Crust',
    fillings: '100% Angus Carne Asada + Pinto Beans + Guacamole + Habanero Salsa',
    bonusPrayers: 190,
    speedBuffText: '+20% Power Carve Torque',
    color: '#be123c',
    tag: 'PRO FAVORITE 🔥'
  }
]

export const SwigDriveThruModal: React.FC<Props> = ({
  carState,
  onFinishSwig,
  onClose
}) => {
  const rider: RiderPro = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0]

  const [selectedItemId, setSelectedItemId] = useState<string>('al-pastor-taco')
  const [includeChurrosHorchata, setIncludeChurrosHorchata] = useState<boolean>(true)
  const [ordered, setOrdered] = useState<boolean>(false)

  const selectedItem = TACO_STAND_MENU.find(d => d.id === selectedItemId) || TACO_STAND_MENU[0]

  const getProTacoComment = () => {
    switch (rider.id) {
      case 'jp-walker':
        return "Get me three Al Pastor tacos straight off the vertical trompo spit and extra habanero mango salsa! Best pre-Trestles meal on Pacific Coast Highway!"
      case 'peter-line':
        return "The handmade corn tortillas pressed right in the window at Laguna Taco Stand are unbeatable. Grab a California Burrito for after our heat!"
      case 'scott-stevens':
        return "I live two blocks from 699 S Coast Hwy! Baja fish taco, Al Pastor, and cinnamon churros dipped in condensed milk—mandatory Laguna Beach ritual!"
      case 'chris-grenier':
        return "Carbs and protein before hitting the 1000 Steps shorebreak! Don't forget an ice-cold Mexican Coke and fresh guac!"
      case 'jeremy-jones':
        return "Carne Asada California Burrito with extra fries inside! That's 2,000 calories of pure San Clemente air-reverse fuel!"
      case 'shaun-white':
        return "Al Pastor with grilled pineapple and cilantro crema! Let's eat on the tailgate and race down to Lower Trestles!"
      case 'milo-shop-groms':
        return "DUDE! Hit the salsa bar and fill six little cups with the black habanero salsa and cilantro sauce!"
      default:
        return "Right next door to Surf & Paddle in Laguna Beach—nobody drives down PCH without stopping at The Taco Stand!"
    }
  }

  const handleOrderTacos = () => {
    CanyonAudioEngine.get().playSodaSlurp()
    setOrdered(true)

    try {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f97316', '#06b6d4', '#10b981', '#fde047']
      })
    } catch {
      // Fallback
    }
  }

  const handleDepartTacoStand = () => {
    const totalBonus = selectedItem.bonusPrayers + (includeChurrosHorchata ? 60 : 0)
    onFinishSwig(selectedItem.name, totalBonus)
  }

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-mono select-none animate-fadeIn">
      <div className="relative max-w-xl w-full bg-slate-900 border-4 border-amber-500/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 overflow-hidden">
        {/* TOP TACO STAND BRANDING */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-300 flex items-center justify-center text-white font-black text-2xl shadow-glow-gold">
              🌮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                  THE TACO STAND &bull; LAGUNA BEACH
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-950 border border-amber-500 text-amber-300 font-bold">
                  699 S COAST HWY
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Next to Surf &amp; Paddle &bull; Handmade Tortillas, Al Pastor Trompo &amp; Salsa Bar
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            &times; Skip Stop
          </button>
        </div>

        {/* ORDER READY CARD */}
        {ordered ? (
          <div className="bg-amber-950/40 border-2 border-amber-500 p-5 rounded-2xl space-y-4 animate-fadeIn text-center">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-black text-sm uppercase">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <span>ORDER UP AT THE COUNTER! SALSA BAR LOADED! 🌮🔥</span>
            </div>

            <div className="space-y-1 text-slate-200 text-xs">
              <p className="font-bold text-sm text-white">
                Fresh off the grill: {selectedItem.name}
              </p>
              {includeChurrosHorchata && (
                <p className="text-amber-300">
                  + Warm Cinnamon Churros, Condensed Milk Dip &amp; 32oz Iced Horchata!
                </p>
              )}
              <p className="text-emerald-400 font-mono text-xs pt-1">
                ⚡ SURF BUFF APPLIED: {selectedItem.speedBuffText}!
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-bold">
              +{selectedItem.bonusPrayers + (includeChurrosHorchata ? 60 : 0)} Ocean Prayers Earned!
            </div>

            <button
              onClick={handleDepartTacoStand}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-gold cursor-pointer transform hover:scale-[1.01] transition-all"
            >
              <span>CRUISE PCH PAST 1000 STEPS &amp; MONTAGE TO TRESTLES!</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Passenger Pro Comment */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold">
                <span>{rider.iconEmoji}</span>
                <span>{rider.name} in The Taco Stand Line:</span>
              </div>
              <p className="text-slate-300 italic pl-5">
                &ldquo;{getProTacoComment()}&rdquo;
              </p>
            </div>

            {/* TACO STAND MENU SELECTION */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Order from the Laguna Beach Taco Stand Menu:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {TACO_STAND_MENU.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      selectedItemId === item.id
                        ? 'bg-amber-950/80 border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item.name}</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 font-bold shrink-0">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {item.tortilla} &bull; {item.fillings}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-800/60">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>{item.speedBuffText}</span>
                      </span>
                      <span className="text-amber-400 font-bold">+{item.bonusPrayers} Pts</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CHURROS & HORCHATA ADD-ON */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-amber-950/40 border border-amber-700/60 cursor-pointer hover:bg-amber-950/60 transition-all">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-xs font-bold text-amber-200 block">
                    Add Fresh Cinnamon Churros + Iced Horchata &amp; Habanero Salsa
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Dipped in sweet condensed milk + full salsa bar tray (+60 Ocean Prayers)
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeChurrosHorchata}
                onChange={e => setIncludeChurrosHorchata(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded cursor-pointer"
              />
            </label>

            {/* ORDER BUTTON */}
            <button
              onClick={handleOrderTacos}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-gold cursor-pointer transform hover:scale-[1.01] transition-all"
            >
              <Utensils className="w-4 h-4" />
              <span>ORDER AT THE TACO STAND &amp; HIT THE SALSA BAR! 🌮🥑</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
