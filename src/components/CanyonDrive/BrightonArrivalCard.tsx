import React from 'react'
import { Waves, Trophy, Play, Compass, X } from 'lucide-react'
import { SURF_SPOTS, type SurfSpotId } from '../../types/game'

interface Props {
  onStartSkiFree: () => void;
  prayersCount: number;
  selectedSpotId?: SurfSpotId;
  onSelectSpot?: (spotId: SurfSpotId) => void;
  onClose?: () => void;
}

export const BrightonArrivalCard: React.FC<Props> = ({
  onStartSkiFree,
  prayersCount,
  selectedSpotId = 'trestles_wsl',
  onSelectSpot,
  onClose
}) => {
  const activeSpot = SURF_SPOTS.find(s => s.id === selectedSpotId) || SURF_SPOTS[2]

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 border border-cyan-500/50 rounded-2xl p-5 sm:p-7 text-center space-y-5 shadow-2xl relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title="Keep Driving PCH"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700 text-xs font-mono text-cyan-300">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>South Orange County Lineup Check &bull; Mile {activeSpot.mile}</span>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
            <Waves className="w-7 h-7 text-cyan-400" />
            <span>{activeSpot.name.toUpperCase()}</span>
          </h2>
          <p className="text-cyan-300 font-mono text-xs sm:text-sm">
            {activeSpot.vibe} &bull; {activeSpot.waveHeight} ({activeSpot.swellPeriod}) &bull; {activeSpot.waterTemp}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            {activeSpot.description}
          </p>
        </div>

        {/* Spot Selector Cards: Dana Point, San Clemente Pier, Lower Trestles WSL */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
          {SURF_SPOTS.map((spot) => {
            const isSelected = spot.id === activeSpot.id
            return (
              <button
                key={spot.id}
                onClick={() => onSelectSpot?.(spot.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-lg shadow-cyan-500/15'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono text-amber-300">
                      MILE {spot.mile}
                    </span>
                    {spot.isWslEvent && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-[9px] font-mono text-amber-300 flex items-center gap-0.5">
                        <Trophy className="w-2.5 h-2.5" /> WSL
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm mt-1">
                    {spot.name}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 mt-0.5">
                    {spot.waveHeight} &bull; {spot.swellPeriod}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-800/80 truncate">
                  {spot.localCrew}
                </div>
              </button>
            )
          })}
        </div>

        {/* Beach & Wildlife Conditions Summary */}
        <div className="rounded-xl border border-slate-700 bg-gradient-to-r from-sky-950 via-cyan-950 to-amber-950/60 p-3.5 text-left font-mono text-xs text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="text-cyan-300 font-bold">
              CURRENT LINEUP: OFFSHORE GLASS 🌊 &bull; FANS, SUNBATHERS, LIFEGUARDS &amp; WILDLIFE ACTIVE
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              🐬 Dolphins &bull; 🐢 Sea Turtles &bull; 🐦 Pelicans &bull; 🐚 Seashells &bull; 🏖️ Kids &amp; Sunbathers on the Sand
            </div>
          </div>
          <div className="text-[11px] text-amber-300 shrink-0">
            Ocean Prayers: <strong>{prayersCount}</strong>
          </div>
        </div>

        <button
          onClick={onStartSkiFree}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-300 hover:from-cyan-300 hover:to-amber-200 text-slate-950 font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-glow-ice transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Grab Your Board &amp; Paddle Out at {activeSpot.shortName}</span>
        </button>
      </div>
    </div>
  )
}
