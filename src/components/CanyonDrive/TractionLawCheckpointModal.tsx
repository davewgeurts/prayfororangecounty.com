import React, { useState } from 'react'
import {
  TIRE_OPTIONS_LIST,
  RIDERS_LIST,
  type VehicleTireOption,
  type RiderPro
} from '../../data/snowboardGear'
import type { PlayerCarState } from '../../types/game'
import { ShieldAlert, Check, Car, AlertTriangle, Sparkles } from 'lucide-react'

interface Props {
  carState: PlayerCarState;
  onPassCheckpoint: (equippedTireId?: string) => void;
  onReturnToMiloShop: () => void;
}

export const TractionLawCheckpointModal: React.FC<Props> = ({
  carState,
  onPassCheckpoint,
  onReturnToMiloShop
}) => {
  const currentTire: VehicleTireOption = TIRE_OPTIONS_LIST.find(t => t.id === carState.tireOptionId) || TIRE_OPTIONS_LIST[1]
  const rider: RiderPro = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0]

  const [equippedTire, setEquippedTire] = useState<VehicleTireOption>(currentTire)
  const [resolved, setResolved] = useState<boolean>(false)
  const [resolutionMessage, setResolutionMessage] = useState<string>('')

  const isApproved = equippedTire.udotApproved

  const handleInstallChains = () => {
    const chainOption = TIRE_OPTIONS_LIST.find(t => t.id === 'chains') || TIRE_OPTIONS_LIST[3]
    setEquippedTire(chainOption)
    setResolved(true)
    setResolutionMessage("You ratcheted down the heavy-duty FCS Cam-Lock Tie-Down Straps! Straps humming tight in the ocean breeze, Officer Brody gives the shaka!")
  }

  const handleBribeWithBurritos = () => {
    setResolved(true)
    setResolutionMessage("Officer Brody laughs: 'Alright, since you're rolling with " + rider.name + " and have a warm Taco Stand Al Pastor taco in the console, I'll let you pass. Keep your boards strapped down to Trestles!'")
  }

  const handleProceed = () => {
    onPassCheckpoint(equippedTire.id)
  }

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none">
      <div className="relative max-w-xl w-full bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* LIFEGUARD & CHP FLASHING LIGHTS */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping" />
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
            </div>
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                LAGUNA BEACH PD &bull; CHP COASTAL SAFETY
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                PCH ROOF RACK &amp; SURF STRAP CHECKPOINT
              </h2>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500 text-amber-300 text-[10px] font-bold">
            MILE 1.0 &bull; SOUTH LAGUNA
          </span>
        </div>

        {/* ORANGE VMS HIGHWAY SIGN */}
        <div className="bg-black border border-amber-500/80 p-3 rounded-2xl text-center space-y-0.5 shadow-inner">
          <div className="text-amber-500 font-black text-xs sm:text-sm tracking-widest animate-pulse">
            ⚠️ HIGH SURF &amp; CROSSWIND ROOF RACK ADVISORY ⚠️
          </div>
          <div className="text-amber-400 text-[11px] font-bold">
            LOCKING SURF RACKS OR CAM-LOCK TIE-DOWN STRAPS REQUIRED ON PCH CA-1
          </div>
        </div>

        {/* OFFICER INSPECTION VIEW */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Officer Brody (CHP South Coast Patrol)</span>
                <span className="text-[10px] text-slate-400 font-normal">&bull; Inspecting Roof Rack</span>
              </div>
              <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
                "{equippedTire.officerReaction}"
              </p>
            </div>
          </div>

          {/* Current Vehicle Rack Telemetry */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">EQUIPPED RIG SETUP:</span>
            <span className={`font-bold flex items-center gap-1 ${
              isApproved ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isApproved ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{equippedTire.name}</span>
            </span>
          </div>
        </div>

        {/* PASSENGER SHOTGUN DIALOGUE */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase mb-1">
            <span>{rider.iconEmoji}</span>
            <span>{rider.name} ({rider.nickname}) Shotgun Whisper:</span>
          </div>
          <p className="text-cyan-300 italic">
            "{rider.id === 'milo-groms'
              ? 'Dude, don\'t let him see our boards held down by a single bungee cord! Give him a Taco Stand churro!'
              : rider.id === 'jp-walker'
              ? 'Tell him Griffin Colapinto is in the passenger seat and our WSL heat at Lowers starts in 20 minutes!'
              : rider.id === 'peter-line'
              ? 'Tell him Mayhem shaped this board in San Clemente this morning—we have to get down to the Pier!'
              : 'Keep it mellow, show him our Surf & Paddle straps and let\'s cruise past 1000 Steps!'}"
          </p>
        </div>

        {/* RESOLUTION MESSAGE */}
        {resolved && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs flex items-center gap-2 shadow-glow-ice">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{resolutionMessage}</span>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          {isApproved || resolved ? (
            <button
              onClick={handleProceed}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>PASSED CHECKPOINT &bull; CRUISE SOUTH DOWN PCH</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleInstallChains}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Car className="w-4 h-4" />
                <span>Ratchet Down FCS Straps</span>
              </button>

              <button
                onClick={handleBribeWithBurritos}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Offer Taco Stand Al Pastor</span>
              </button>
            </>
          )}
        </div>

        {!isApproved && !resolved && (
          <div className="text-center">
            <button
              onClick={onReturnToMiloShop}
              className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
            >
              Turn back to Surf &amp; Paddle Laguna to get locking surf racks &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
