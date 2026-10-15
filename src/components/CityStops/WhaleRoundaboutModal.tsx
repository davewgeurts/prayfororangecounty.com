import React, { useState } from 'react'
import {
  RIDERS_LIST,
  type RiderPro
} from '../../data/snowboardGear'
import type { PlayerCarState } from '../../types/game'
import { CanyonAudioEngine } from '../../utils/audioEngine'
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Flame,
  RotateCw
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props {
  carState: PlayerCarState;
  onFinishWhale: (prayerBonus: number) => void;
  onClose: () => void;
}

export const WhaleRoundaboutModal: React.FC<Props> = ({
  carState,
  onFinishWhale,
  onClose
}) => {
  const rider: RiderPro = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0]

  const [whaleLaps, setWhaleLaps] = useState<number>(0)
  const [hasPrayed, setHasPrayed] = useState<boolean>(false)
  const [hasStickered, setHasStickered] = useState<boolean>(false)
  const [blessingGranted, setBlessingGranted] = useState<boolean>(false)

  const getProWhaleQuote = () => {
    switch (rider.id) {
      case 'jp-walker':
        return "ALL HAIL THE PACIFIC DOLPHIN & WHALE SHRINE! Every time we honk 3 times in Laguna, a 17-second SSW Hurricane Swell lights up San Clemente Pier and Lower Trestles!"
      case 'peter-line':
        return "Look at the dolphins and sea turtles painted on the Laguna Wyland Wall! Let's offer an Ocean Prayer for overhead A-frames at Lowers!"
      case 'scott-stevens':
        return "Laguna Beach heritage right here! Honk the horn, throw a shaka to the Main Beach lifeguard tower, and summon the barrels!"
      case 'chris-grenier':
        return "When the Southern Hemisphere storm track locks in, 1000 Steps and Pier Bowl turn into pure pipeline slabs!"
      default:
        return "All hail the Laguna Dolphin & Whale Swell Shrine! Protector of clean offshore breezes, sea turtles, and 8-foot Trestles sets."
    }
  }

  const handleCircleRoundabout = () => {
    CanyonAudioEngine.get().playCarHorn()
    const next = whaleLaps + 1
    setWhaleLaps(next)

    try {
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#f59e0b', '#ffffff']
      })
    } catch {
      // Fallback
    }

    if (next >= 3) {
      setBlessingGranted(true)
    }
  }

  const handleOfferPrayer = () => {
    setHasPrayed(true)
    try {
      confetti({
        particleCount: 60,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#06b6d4', '#38bdf8', '#fde047']
      })
    } catch {
      // Fallback
    }
  }

  const handleSlapSticker = () => {
    setHasStickered(true)
  }

  const handleDepartRoundabout = () => {
    let bonus = 300
    if (whaleLaps >= 3) bonus += 200
    if (hasPrayed) bonus += 150
    if (hasStickered) bonus += 50
    onFinishWhale(bonus)
  }

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-mono select-none animate-fadeIn">
      <div className="relative max-w-2xl w-full bg-slate-900 border-4 border-cyan-500/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 overflow-hidden">
        {/* TOP SHRINE BADGE */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 border border-cyan-300 flex items-center justify-center text-white text-2xl shadow-glow-ice">
              🐬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                  LAGUNA DOLPHIN &amp; WHALE SWELL SHRINE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold">
                  SSW 17s SWELL DEITY
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Laguna Main Beach &amp; Wyland Wall &bull; Pray for the Ocean Sanctuary
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

        {/* ILLUSTRATED OCEAN SHRINE VISUAL */}
        <div className="relative h-44 rounded-2xl bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-950 border-2 border-cyan-800/70 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-50 pointer-events-none text-cyan-200 text-sm flex justify-around items-center animate-pulse">
            <span>🌊</span>
            <span>🐢</span>
            <span>🐚</span>
            <span>🐬</span>
            <span>🐦</span>
          </div>

          <div className="absolute w-64 h-32 rounded-full border-4 border-dashed border-cyan-500/50 opacity-60" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="text-6xl animate-bounce" style={{ animationDuration: '3s' }}>
              🐬🐢
            </div>
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-950 via-teal-950 to-cyan-950 border border-cyan-400 text-[10px] font-black text-cyan-300 uppercase tracking-widest shadow-md mt-1">
              PRAY FOR THE OCEAN &bull; 8FT OFFSHORE
            </div>
          </div>

          {hasStickered && (
            <div className="absolute bottom-3 right-6 px-2 py-1 rounded bg-emerald-600 text-white text-[9px] font-black shadow-md rotate-[-6deg]">
              SURF &amp; PADDLE LAGUNA • LOST MAYHEM
            </div>
          )}

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-cyan-500/80 text-[10px] text-cyan-300 font-bold">
            SHAKA HONKS: {whaleLaps} / 3
          </div>
        </div>

        {/* PASSENGER SHOTGUN BANTER */}
        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-bold">
            <span>{rider.iconEmoji}</span>
            <span>{rider.name} at Main Beach Laguna:</span>
          </div>
          <p className="text-slate-300 italic pl-5">
            &ldquo;{getProWhaleQuote()}&rdquo;
          </p>
        </div>

        {/* BLESSING BANNER */}
        {blessingGranted && (
          <div className="bg-cyan-950/70 border-2 border-cyan-400 p-3 rounded-2xl text-center space-y-1 animate-fadeIn">
            <div className="text-cyan-300 font-black text-xs uppercase flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
              <span>THE OCEAN HEARD YOUR SHAKA! SSW SWELL PUMPING! 🐬🌊</span>
            </div>
            <p className="text-[11px] text-slate-200">
              A 6–8ft @ 17s Southern Hemisphere swell just hit Dana Point, San Clemente Pier, and Lower Trestles! +15% Wave Speed &amp; Dolphin Glide unlocked!
            </p>
          </div>
        )}

        {/* THREE SACRED OCEAN RITUALS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <button
            onClick={handleCircleRoundabout}
            className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-600/60 hover:border-cyan-400 text-left transition-all hover:bg-cyan-900/60 cursor-pointer flex flex-col justify-between gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-200 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Honk &amp; Throw Shaka</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300 font-bold">
                HONK 3X
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Honk the horn to salute the dolphins, turtles, and Main Beach lifeguards ({whaleLaps}/3 complete)!
            </p>
          </button>

          <button
            onClick={handleOfferPrayer}
            disabled={hasPrayed}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              hasPrayed
                ? 'bg-emerald-950/50 border-emerald-600 text-emerald-300 opacity-80'
                : 'bg-amber-950/60 border-amber-600/60 hover:border-amber-400 text-amber-200 hover:bg-amber-900/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Pray for the Ocean</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-300 font-bold">
                {hasPrayed ? 'BLESSED' : '+150 PTS'}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              {hasPrayed
                ? 'Your ocean prayer has been blessed by the dolphins & sea turtles!'
                : 'Offer a prayer for clean water, healthy reefs, and overhead barrels.'}
            </p>
          </button>

          <button
            onClick={handleSlapSticker}
            disabled={hasStickered}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              hasStickered
                ? 'bg-emerald-950/50 border-emerald-600 text-emerald-300 opacity-80'
                : 'bg-slate-800/80 border-slate-700 hover:border-emerald-400 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Slap Surf Sticker</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                {hasStickered ? 'STICKERED' : '+50 PTS'}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              {hasStickered
                ? 'Surf & Paddle Laguna crest slapped on the boardwalk post!'
                : 'Slap a Surf & Paddle Laguna + Lost Mayhem sticker on the post.'}
            </p>
          </button>
        </div>

        {/* DEPART BUTTON */}
        <button
          onClick={handleDepartRoundabout}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01] transition-all"
        >
          <span>RECEIVE OCEAN SWELL BLESSING &amp; CRUISE SOUTH ON PCH! 🐬🌊</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  )
}
