import React, { useState } from 'react'
import type { RiderPro, Snowboard } from '../../data/snowboardGear'
import type { PlayerCarState } from '../../types/game'
import { CanyonRoute } from '../../utils/canyonRoute'
import { MessageSquare, Sparkles } from 'lucide-react'

interface Props {
  rider: RiderPro;
  board: Snowboard;
  carState: PlayerCarState;
  onOpenMiloShop: () => void;
}

export const PassengerDialogue: React.FC<Props> = ({
  rider,
  board,
  carState,
  onOpenMiloShop
}) => {
  const [customCheer, setCustomCheer] = useState<string | null>(null)
  const [cheerIndex, setCheerIndex] = useState<number>(0)

  // Compute situational dialogue based on PCH mile marker / telemetry
  const mile = carState.distanceMiles
  const speed = carState.speed

  let situationalLine = rider.dialogue.leavingShop
  if (mile < 1.2) {
    situationalLine = rider.dialogue.leavingShop
  } else if (mile >= 3.0 && mile < CanyonRoute.SILENT_ROCK_START) {
    situationalLine = rider.dialogue.approachingSilentRock
  } else if (CanyonRoute.isSilentRockZone(mile)) {
    situationalLine = rider.dialogue.atSilentRock
  } else if (speed > 48) {
    situationalLine = rider.dialogue.speeding
  } else if (mile >= 9.0 && mile < 16.0) {
    situationalLine = rider.dialogue.approachingBrighton
  } else if (mile >= 16.0) {
    situationalLine = rider.dialogue.atBrighton
  }

  const currentLine = customCheer || situationalLine

  const handleTriggerCheer = () => {
    const nextCheer = rider.dialogue.cheers[cheerIndex % rider.dialogue.cheers.length]
    setCheerIndex(i => i + 1)
    setCustomCheer(nextCheer)
    setTimeout(() => setCustomCheer(null), 3500)
  }

  return (
    <div className="absolute top-16 right-4 z-30 max-w-sm w-full pointer-events-auto">
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono space-y-2">
        {/* Rider Header Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-base border"
              style={{
                backgroundColor: `${rider.avatarColor}20`,
                borderColor: rider.accentColor
              }}
            >
              {rider.iconEmoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white leading-tight">
                  {rider.name}
                </span>
                <span className="text-[10px] text-cyan-400 font-normal">
                  ({rider.nickname})
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                SHOTGUN CREW &bull; {rider.categoryLabel}
              </div>
            </div>
          </div>

          <button
            onClick={onOpenMiloShop}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-400 border border-slate-700 cursor-pointer transition-colors"
            title="Swap Surfboard / Boogie Board or Pro Surfer at Surf & Paddle Laguna"
          >
            SWAP
          </button>
        </div>

        {/* Board & Craft Status */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-900/60 px-2 py-1 rounded-lg">
          <div className="flex items-center gap-1 truncate">
            <span>{board.craftType === 'boogie' ? 'BOOGIE:' : 'SURFBOARD:'}</span>
            <strong className="text-white truncate">{board.name}</strong>
          </div>
          <span
            className="px-1.5 rounded text-[9px] font-bold"
            style={{ color: board.accentColor }}
          >
            {board.craftType === 'boogie' ? `${board.lengthCm}"` : `${Math.floor(board.lengthCm / 30.48)}'${Math.round((board.lengthCm % 30.48) / 2.54)}"`}
          </span>
        </div>

        {/* Passenger Speech Bubble */}
        <div className="relative bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-slate-200">
          <div className="flex items-start gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-cyan-200 italic">
              "{currentLine}"
            </p>
          </div>
        </div>

        {/* Quick Hype Action */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[10px] text-slate-500">
            {CanyonRoute.isSilentRockZone(carState.distanceMiles)
              ? '🌊 1000 STEPS SWELL CHECK'
              : 'OC Swell Stoke Active'}
          </span>

          <button
            onClick={handleTriggerCheer}
            disabled={CanyonRoute.isSilentRockZone(carState.distanceMiles)}
            className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 text-[10px] hover:bg-cyan-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-all"
          >
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>Stoke Check</span>
          </button>
        </div>
      </div>
    </div>
  )
}
