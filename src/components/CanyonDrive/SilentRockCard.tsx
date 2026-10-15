import React from 'react'
import { VolumeX, Waves, Sparkles, Wind, Footprints } from 'lucide-react'
import type { OceanBuoyTelemetry } from '../../utils/oceanBuoyFeed'

interface Props {
  onOfferPrayer: () => void;
  onOpenShorebreakSession?: (spot: 'thousand_steps' | 'treasure_island') => void;
  prayersCount: number;
  buoy?: OceanBuoyTelemetry;
}

export const SilentRockCard: React.FC<Props> = ({
  onOfferPrayer,
  onOpenShorebreakSession,
  prayersCount,
  buoy
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl z-30 pointer-events-auto">
      <div className="rounded-2xl bg-slate-950/92 border border-cyan-500/50 p-5 shadow-2xl backdrop-blur-md text-alpine-powder space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <VolumeX className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Sacred Overlook: 1000 Steps Beach &amp; Treasure Island &bull; Mile 4.5</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-[11px] font-mono text-cyan-300">
            <Waves className="w-3 h-3 text-cyan-400" />
            <span>
              {buoy
                ? `Live Buoy: ${buoy.waveHeightFt}ft @ ${buoy.swellPeriodSec}s ${buoy.swellCompass} • ${buoy.tideStage}`
                : 'Swell 8 FT @ 17s SSW'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden border border-cyan-700/60 flex-shrink-0 bg-gradient-to-br from-sky-900 via-cyan-800 to-teal-900 relative flex flex-col items-center justify-center">
            <div className="text-3xl">🌊🐚🐬</div>
            <div className="text-[9px] font-mono text-cyan-200 mt-1 font-bold">
              1000 STEPS CLIFF
            </div>
            <div className="text-[8px] font-mono text-amber-300">
              219 STAIRS &bull; CA-1
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
            <p className="font-medium text-slate-100">
              Roll down the windows. Turn down the radio. Listen to the South Laguna shorebreak.
            </p>
            <p className="text-slate-400">
              Just past Treasure Island at the Montage, generations of Orange County surfers and bodyboarders pause at 1000 Steps Beach to read the corduroy swell lines, watch the sea turtles &amp; dolphins, or sprint down the 219 stairs to pull into a shorebreak tube.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            Ocean Blessings: <span className="text-cyan-400 font-bold">{prayersCount.toLocaleString()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenShorebreakSession && (
              <button
                onClick={() => onOpenShorebreakSession('thousand_steps')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs tracking-wide shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Footprints className="w-3.5 h-3.5 text-slate-950" />
                <span>Drop Down 219 Stairs &amp; Boogie/Surf Shorebreak!</span>
              </button>
            )}

            <button
              onClick={onOfferPrayer}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-semibold text-xs tracking-wide shadow-glow-ice transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Pray for the Ocean</span>
              <Wind className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
