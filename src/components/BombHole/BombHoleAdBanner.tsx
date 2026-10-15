import React, { useState } from 'react'
import { Waves, ExternalLink, Sparkles, Radio } from 'lucide-react'

export const BombHoleAdBanner: React.FC = () => {
  const [isPlayingShoutout, setIsPlayingShoutout] = useState(false)

  const triggerShoutout = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlayingShoutout(true)
    setTimeout(() => setIsPlayingShoutout(false), 3500)
  }

  return (
    <aside
      aria-label="WSL Finals at Lower Trestles & Taco Stand Swell Ticker"
      className="relative z-40 bg-slate-950 border-y border-cyan-500/80 px-3 py-1.5 text-white flex items-center justify-between gap-3 text-xs font-mono select-none overflow-hidden shadow-lg"
    >
      {/* Background ocean wave stripe pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#041824_25%,#072235_25%,#072235_50%,#041824_50%,#041824_75%,#072235_75%,#072235_100%)] bg-[length:24px_24px] opacity-50 pointer-events-none" />

      {/* LEFT: Live Swell & WSL Finals Badge */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-sm">
          <Waves className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>PRAY FOR THE OCEAN</span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-black text-[10px] tracking-widest uppercase">
            WSL FINALS @ TRESTLES: GREEN ALERT
          </span>
          <span className="text-cyan-300 font-bold hidden md:inline">
            &bull; SSW 6–8 FT+ @ 17s &bull; 70°F WATER &bull; OFFSHORE
          </span>
        </div>
      </div>

      {/* CENTER: Laguna to Trestles banter ticker */}
      <div className="relative z-10 flex-1 text-center hidden lg:block overflow-hidden px-4">
        <p className="text-[11px] text-slate-200 truncate">
          {isPlayingShoutout ? (
            <span className="text-emerald-300 font-bold animate-pulse">
              🤙 LIVE CALL: "YEWWW! Sets are 8-foot A-frames at Lowers! Grab your board & Taco Stand Al Pastor and get down PCH!"
            </span>
          ) : (
            <span>
              Surf & Paddle Laguna + The Taco Stand &rarr; Treasure Island Montage &rarr; 1000 Steps &rarr; Dana Point &bull; San Clemente Pier &bull; Lower Trestles WSL
            </span>
          )}
        </p>
      </div>

      {/* RIGHT: Actions */}
      <div className="relative z-10 flex items-center gap-2 shrink-0">
        <button
          onClick={triggerShoutout}
          className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500 hover:bg-cyan-900 text-cyan-200 font-bold text-[10px] flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          title="Play Live Lineup Swell Shoutout"
        >
          {isPlayingShoutout ? (
            <>
              <Radio className="w-3 h-3 text-emerald-400 animate-spin" />
              <span className="text-emerald-300">SET INCOMING!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Lineup Cam Alert</span>
            </>
          )}
        </button>

        <a
          href="https://www.worldsurfleague.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] tracking-wider uppercase flex items-center gap-1 transition-all shadow-md transform hover:scale-[1.02]"
        >
          <span>WSL LIVE</span>
          <ExternalLink className="w-2.5 h-2.5 stroke-[3]" />
        </a>
      </div>
    </aside>
  )
}
