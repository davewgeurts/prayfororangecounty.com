import React, { useState } from 'react'
import {
  RIDERS_LIST,
  SNOWBOARDS_LIST,
  type RiderPro,
  type Snowboard
} from '../../data/snowboardGear'
import type { PlayerCarState } from '../../types/game'
import {
  Siren,
  ShieldAlert,
  Sparkles,
  Zap,
  Check,
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react'

interface Props {
  carState: PlayerCarState;
  onResolvePullOver: (prayerBonusOrCost: number) => void;
  onArrest: (reason: string) => void;
}

export const CopPullOverModal: React.FC<Props> = ({
  carState,
  onResolvePullOver,
  onArrest
}) => {
  const rider: RiderPro = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0]
  const board: Snowboard = SNOWBOARDS_LIST.find(b => b.id === carState.selectedBoardId) || SNOWBOARDS_LIST[0]

  const [resolved, setResolved] = useState<boolean>(false)
  const [resolutionMessage, setResolutionMessage] = useState<string>('')
  const [pendingBonus, setPendingBonus] = useState<number>(0)
  const [arrestTriggered, setArrestTriggered] = useState<boolean>(false)
  const [arrestReasonText, setArrestReasonText] = useState<string>('')

  // Passenger pro customized banter during PCH pullover
  const getPassengerCopWhisper = () => {
    switch (rider.id) {
      case 'jp-walker':
        return "Stay calm! Let Griffin handle this—Officer Brody surfs T-Street every morning before his shift and knows the Colapinto family."
      case 'jeremy-jones':
        return "Tell him the WSL Finals horn at Lower Trestles is about to blow and I have the #1 seed jersey in the trunk!"
      case 'peter-line':
        return "Hand him a Lost Mayhem sticker pack and tell him I'm shaping him a custom Puddle Jumper in San Clemente!"
      case 'eddie-wall':
        return "Tell him 2% Swim Team is filming at the San Clemente Pier and we'll put his patrol cruiser in the vlog intro!"
      case 'terje-hakonsen':
        return "Tell him Kelly Slater says aloha. Respect the ocean, respect the coastal speed limit."
      case 'shaun-white':
        return "Don't sweat it, bro. As soon as I roll down the window, he's gonna ask about my 10-point air at Lowers!"
      case 'danny-davis':
        return "All aloha and good vibrations, officer. Just cruising down the coast looking for a clean pointbreak."
      case 'scott-stevens':
        return "Quick, show him our Catch Surf Womper and pink Beater finless setup! Nobody tickets a pure fun hog!"
      case 'chris-grenier':
        return "YOOOO OFFICER! Mike Stewart in the house! Show him the viper swimfins and tell him 1000 Steps shorebreak is firing!"
      case 'zeb-powell':
        return "Tell him we're headed to Victoria Beach and the Pier to pull into dry-sand shorebreak barrels!"
      case 'milo-groms':
        return "Dude, please don't ticket us, my mom is tracking my Life360 and thinks we're still in line at The Taco Stand!"
      case 'milo-trevor':
        return "Show him those Sticky Bumps Tour Series speed bumps on the deck! Freshly hand-waxed at Surf & Paddle Laguna!"
      case 'bone-zone-kip':
        return "Tell him we're the San Clemente Pier Rat Crew and the west side of the pilings is tubing off its head!"
      default:
        return "Keep cool! Let's show him our Surf & Paddle wax job and WSL Trestles passes!"
    }
  }

  const handleProTalk = () => {
    if (Math.random() < 0.15 && (rider.id === 'peter-line' || rider.id === 'chris-grenier' || rider.id === 'milo-groms')) {
      setArrestTriggered(true)
      setArrestReasonText(
        `Officer Brody gasps: "Wait a second... ${rider.name}?! Dispatch, we have the notorious PCH swell bandit with an outstanding blackball surfing citation! Step out of the vehicle!"`
      )
      return
    }

    setResolved(true)
    setPendingBonus(150)
    setResolutionMessage(
      `Officer Brody glances into the passenger window and gasps: "Wait... is that ${rider.name}?! Dude, I watched your heat at Lower Trestles last year! You guys are good to go—go get barreled!"`
    )
  }

  const handleMiloWaxShow = () => {
    setResolved(true)
    setPendingBonus(75)
    setResolutionMessage(
      `Officer Brody inspects the roof rack: "Surf & Paddle Laguna hand-waxed ${board.name}? I respect that. Right next door to The Taco Stand. Keep it under 45 MPH past Dana Point!"`
    )
  }

  const handleBurritoBribe = () => {
    if (Math.random() < 0.15) {
      setArrestTriggered(true)
      setArrestReasonText(
        'Officer Brody unwraps the foil: "Wait, you ate half this California Burrito and spilled habanero salsa on my citation book?! Bribery of a coastal patrol officer! Hands behind your back!"'
      )
      return
    }

    setResolved(true)
    setPendingBonus(50)
    setResolutionMessage(
      `Officer Brody takes a deep breath: "Is that a warm Carne Asada California Burrito and fresh churros from The Taco Stand in Laguna?! ... Look, the line there was 40 people deep when I drove by. Hand that over and drive safe!"`
    )
  }

  const handlePayFine = () => {
    setResolved(true)
    setPendingBonus(-50)
    setResolutionMessage(
      `You pay a 50 Prayer PCH Coastal Speeding Citation. Officer Brody stamps your receipt: "Slow down through South Laguna. 1000 Steps Beach is sacred, grom. Carry on."`
    )
  }

  // Risky: Try to Outrun CHP on PCH (80% arrest chance)
  const handleFloorIt = () => {
    if (Math.random() < 0.8) {
      setArrestTriggered(true)
      setArrestReasonText(
        'You punch the throttle down PCH, but OC Harbor Patrol & CHP box you in by Dana Point Harbor! "GO DIRECTLY TO BEACH HOLDING TANK! Do NOT pass GO, do not collect $200 (or 200 Prayers)! Hands behind your back!"'
      )
    } else {
      setResolved(true)
      setPendingBonus(250)
      setResolutionMessage(
        'INSANE PCH GETAWAY! You downshifted around the Dana Point Headlands, ducked into the Coast Highway beach lot, and vanished behind a wall of surf vans! +250 Prayers!'
      )
    }
  }

  // Risky: Argue with the Officer (70% arrest chance)
  const handleArgue = () => {
    if (Math.random() < 0.7) {
      setArrestTriggered(true)
      setArrestReasonText(
        `Officer Brody's face turns red: "Official Monopoly Coastal Citation: GO DIRECTLY TO JAIL! Do not pass GO, do not collect $200, and your boards are impounded at the Lifeguard HQ!"`
      )
    } else {
      setResolved(true)
      setPendingBonus(-100)
      setResolutionMessage(
        'Officer Brody writes you a 100 Prayers fine: "Next time you back-talk on Pacific Coast Highway, I\'m blackballing your whole crew until sundown. Slow down!"'
      )
    }
  }

  const handleSurrenderToJail = () => {
    onArrest(arrestReasonText || 'Reckless PCH Speeding & Blackball Zone Violation')
  }

  const handleMergeBack = () => {
    onResolvePullOver(pendingBonus)
  }

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none animate-fadeIn">
      <div className="relative max-w-xl w-full bg-slate-900 border-2 border-red-500 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* POLICE FLASHING STROBES */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping" />
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black text-red-400 uppercase tracking-widest block flex items-center gap-1.5">
                <Siren className="w-4 h-4 text-red-400 animate-bounce" />
                <span>CALIFORNIA HIGHWAY PATROL &bull; PCH INTERCEPTION</span>
              </span>
              <span className="text-[11px] text-slate-400">
                PCH CA-1 Mile {carState.distanceMiles.toFixed(1)} &bull; Orange County Coast Sector
              </span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-red-950/80 border border-red-600 text-red-300 text-xs font-bold animate-pulse">
            🚨 PULLED OVER
          </div>
        </div>

        {/* SPEED RADAR CITATION BANNER */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-red-900/60 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] block">
              LASER RADAR CLOCK:
            </span>
            <span className="text-red-400 font-black text-sm">
              {Math.max(52, Math.round(carState.speed || 56))} MPH &bull; 35 MPH COASTAL ZONE
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] block">
              CITATION REASON:
            </span>
            <span className="text-amber-300 font-bold text-xs truncate max-w-[200px] block">
              {carState.pulledOverReason || 'Excessive Swell-Chasing Speed on PCH'}
            </span>
          </div>
        </div>

        {/* OFFICER DIALOGUE */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Officer Brody (CHP Orange County Coast Division):</span>
          </div>

          <p className="text-xs text-slate-200 italic leading-relaxed pl-6 border-l-2 border-amber-500/50">
            "License, registration, and State Beach parking pass. Grom, I clocked your surf wagon flying down Pacific Coast Highway like a 10-foot south swell just hit Trestles. What's the rush?"
          </p>
        </div>

        {/* PASSENGER SHOTGUN BANTER */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-bold">
            <span>{rider.iconEmoji}</span>
            <span>{rider.name} ({rider.nickname}) Shotgun Whisper:</span>
          </div>
          <p className="text-slate-300 italic pl-5">
            "{getPassengerCopWhisper()}"
          </p>
        </div>

        {/* RESOLUTION MESSAGE, ARREST SCREEN, OR ACTION CHOICES */}
        {arrestTriggered ? (
          <div className="bg-red-950/80 border-2 border-red-500 p-4 rounded-2xl space-y-3 animate-fadeIn text-center">
            <div className="flex items-center justify-center gap-2 text-red-400 font-black text-sm uppercase">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
              <span>GO DIRECTLY TO JAIL! 🎲</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              {arrestReasonText}
            </p>
            <div className="p-2.5 rounded-xl bg-amber-950/90 border-2 border-amber-400 text-amber-300 text-xs font-mono font-black flex items-center justify-center gap-2 shadow-md">
              <span className="text-base">🎲</span>
              <span>MONOPOLY RULE: "DO NOT PASS GO &bull; DO NOT COLLECT $200!"</span>
            </div>
            <div className="text-[11px] text-slate-400 font-bold">
              Destination: OC Harbor Patrol &amp; Lifeguard Detention Tank (Dana Point)
            </div>
            <button
              onClick={handleSurrenderToJail}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl cursor-pointer transform hover:scale-[1.01] transition-all"
            >
              <span>GO DIRECTLY TO HOLDING TANK (DO NOT COLLECT $200) ⛓️</span>
            </button>
          </div>
        ) : resolved ? (
          <div className="bg-emerald-950/40 border border-emerald-500/60 p-4 rounded-2xl space-y-3 animate-fadeIn">
            <div className="flex items-start gap-2.5 text-xs text-emerald-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="leading-relaxed font-bold">{resolutionMessage}</p>
                {pendingBonus !== 0 && (
                  <span className={`text-[11px] font-mono mt-1 block ${pendingBonus > 0 ? 'text-cyan-300' : 'text-amber-400'}`}>
                    {pendingBonus > 0 ? `+${pendingBonus} Ocean Prayers Bonus!` : `${pendingBonus} Prayers fine paid.`}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleMergeBack}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01] transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>PUNCH THE GAS &amp; MERGE BACK ONTO PCH CA-1</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              How do you handle Officer Brody?
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Option 1: Pro passenger charm */}
              <button
                onClick={handleProTalk}
                className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/60 hover:border-emerald-400 text-emerald-200 text-left cursor-pointer transition-all hover:bg-emerald-900/60 flex flex-col justify-between gap-1"
              >
                <div className="font-bold flex items-center gap-1.5 text-white">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Let {rider.name.split(' ')[0]} Talk</span>
                </div>
                <span className="text-[10px] text-emerald-300/80">
                  Starstruck officer &bull; +150 Prayers
                </span>
              </button>

              {/* Option 2: Surf & Paddle wax cred */}
              <button
                onClick={handleMiloWaxShow}
                className="p-3 rounded-xl bg-sky-950/60 border border-sky-600/60 hover:border-sky-400 text-sky-200 text-left cursor-pointer transition-all hover:bg-sky-900/60 flex flex-col justify-between gap-1"
              >
                <div className="font-bold flex items-center gap-1.5 text-white">
                  <Flame className="w-3.5 h-3.5 text-sky-400" />
                  <span>Show Surf &amp; Paddle Wax</span>
                </div>
                <span className="text-[10px] text-sky-300/80">
                  Laguna shop respect &bull; +75 Prayers
                </span>
              </button>

              {/* Option 3: The Taco Stand Burrito */}
              <button
                onClick={handleBurritoBribe}
                className="p-3 rounded-xl bg-amber-950/60 border border-amber-600/60 hover:border-amber-400 text-amber-200 text-left cursor-pointer transition-all hover:bg-amber-900/60 flex flex-col justify-between gap-1"
              >
                <div className="font-bold flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Taco Stand Burrito</span>
                </div>
                <span className="text-[10px] text-amber-300/80">
                  Carne Asada bribe &bull; 15% Jail Risk
                </span>
              </button>

              {/* Option 4: Pay fine & take warning */}
              <button
                onClick={handlePayFine}
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-300 text-left cursor-pointer transition-all hover:bg-slate-800 flex flex-col justify-between gap-1"
              >
                <div className="font-bold flex items-center gap-1.5 text-white">
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Accept Warning</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Pay 50 Prayers fine &amp; cruise easy
                </span>
              </button>

              {/* Option 5: Floor It (80% Jail Risk) */}
              <button
                onClick={handleFloorIt}
                className="p-3 rounded-xl bg-red-950/60 border border-red-600/60 hover:border-red-400 text-red-200 text-left cursor-pointer transition-all hover:bg-red-900/60 flex flex-col justify-between gap-1"
              >
                <div className="font-bold flex items-center gap-1.5 text-red-300">
                  <Zap className="w-3.5 h-3.5 text-red-400" />
                  <span>Floor It Down PCH</span>
                </div>
                <span className="text-[10px] text-red-400/80 font-mono">
                  80% Jail Risk &bull; +250 Prayers escape
                </span>
              </button>

              {/* Option 6: Argue with Officer */}
              <button
                onClick={handleArgue}
                className="p-3 rounded-xl bg-amber-950/60 border border-amber-600/60 hover:border-amber-400 text-amber-200 text-left cursor-pointer transition-all hover:bg-amber-900/60 flex flex-col justify-between gap-1"
              >
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Argue: "The Tide Is Dropping!"</span>
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  70% Jail Risk &bull; Blackball citation
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
