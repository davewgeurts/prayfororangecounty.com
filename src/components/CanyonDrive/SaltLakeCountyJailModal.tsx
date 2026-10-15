import React, { useState } from 'react'
import {
  RIDERS_LIST,
  SNOWBOARDS_LIST,
  type RiderPro,
  type Snowboard
} from '../../data/snowboardGear'
import type { PlayerCarState } from '../../types/game'
import {
  Lock,
  Phone,
  Flame,
  Award,
  CheckCircle2,
  ArrowRight,
  Coins,
  Sparkles
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props {
  carState: PlayerCarState;
  onRelease: (prayerBonusOrCost: number) => void;
}

export const SaltLakeCountyJailModal: React.FC<Props> = ({
  carState,
  onRelease
}) => {
  const rider: RiderPro = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0]
  const board: Snowboard = SNOWBOARDS_LIST.find(b => b.id === carState.selectedBoardId) || SNOWBOARDS_LIST[0]

  const [jailTab, setJailTab] = useState<'booking' | 'call_milo' | 'squats' | 'lawyer'>('booking')
  const [squatCount, setSquatCount] = useState<number>(0)
  const [isSquatting, setIsSquatting] = useState<boolean>(false)
  const [miloCallStep, setMiloCallStep] = useState<'ringing' | 'talking' | 'bailed' | null>(null)
  const [lawyerStep, setLawyerStep] = useState<'calling' | 'dismissed' | null>(null)
  const [released, setReleased] = useState<boolean>(false)
  const [releaseNote, setReleaseNote] = useState<string>('')
  const [pendingPrayersDelta, setPendingPrayersDelta] = useState<number>(0)

  const getProJailQuote = () => {
    switch (rider.id) {
      case 'jp-walker':
        return "Officer Brody literally hit us with 'Go directly to the Holding Tank, do not pass GO, do not collect $200'! Call Mateo at Surf & Paddle in Laguna—he'll bail us out before the WSL Finals heat starts!"
      case 'jeremy-jones':
        return "It's 6-to-8 foot and glassy at Lower Trestles right now and we're locked in the Harbor Patrol holding cell! Call the shop, we have to make the afternoon glass-off!"
      case 'peter-line':
        return "Hey lifeguard, can I get a Posca pen to draw a new Mayhem logo on these cell bars? Don't worry grom, San Clemente shapers always find a way out."
      case 'eddie-wall':
        return "I know every Harbor Patrol officer from Newport to Dana Point. Give me one phone call to Surf & Paddle!"
      case 'terje-hakonsen':
        return "The tides teach patience, but this holding tank tests the soul. Breathe deep, visualize the barrel, and let's get our boards back."
      case 'shaun-white':
        return "My WSL agent is already on the line with the Orange County Harbor Commissioner. We'll have VIP clearance back to Trestles in 60 seconds."
      case 'danny-davis':
        return "All aloha, brother. Even in the blackball holding tank, the rhythm is mellow. Practice your pop-ups and visualize a clean right-hander."
      case 'scott-stevens':
        return "If they don't let us out soon, I'm body-whomping the holding tank bench! Call Surf & Paddle!"
      case 'chris-grenier':
        return "YO LIFEGUARD! Do you know how heavy the shorebreak at 1000 Steps is right now?! Let the boogie crew out!"
      case 'zeb-powell':
        return "As soon as that buzzer sounds, we're sprinting straight to the surf wagon and pulling into a San Clemente Pier barrel!"
      case 'milo-groms':
        return "Dude he told us 'Do not pass GO, do not collect 200 dollars'! My Super73 battery is dying and my mom is tracking my phone at Dana Point Harbor! Call Mateo!"
      case 'milo-trevor':
        return "I run the wax bench at Surf & Paddle Laguna, and the Harbor Captain gets his boards ding-repaired by me! One phone call and we're free!"
      case 'bone-zone-kip':
        return "They impounded our Sticky Bumps wax and fins! San Clemente Pier is firing, let's bust out!"
      default:
        return "Keep your head up. We'll post bail and get back down Pacific Coast Highway in no time."
    }
  }

  // 1. Post Bail with Prayers
  const handlePostCashBail = () => {
    const cost = Math.min(100, carState.prayersCount)
    setPendingPrayersDelta(-cost)
    setReleaseNote(
      `Bail of ${cost} Ocean Prayers posted with the Harbor Clerk! Property returned: 1x ${board.name}, 1x roof straps, 1x surf wagon keys. Released back to PCH CA-1!`
    )
    triggerRelease()
  }

  // 2. Call Surf & Paddle Laguna
  const handleStartMiloCall = () => {
    setJailTab('call_milo')
    setMiloCallStep('ringing')
    setTimeout(() => {
      setMiloCallStep('talking')
    }, 1800)
  }

  const handleFinishMiloBail = () => {
    setMiloCallStep('bailed')
    setPendingPrayersDelta(50)
    setReleaseNote(
      `Mateo from Surf & Paddle Laguna pulled up to the Dana Point Harbor sally port in the shop Woody wagon with cash and a bag of Taco Stand burritos! Charges dismissed on local surf karma!`
    )
    triggerRelease()
  }

  // 3. Pop-Up & Duck-Dive mini-game
  const handleDoSquat = () => {
    if (isSquatting || squatCount >= 10) return
    setIsSquatting(true)
    const next = squatCount + 1
    setSquatCount(next)

    setTimeout(() => {
      setIsSquatting(false)
    }, 200)

    if (next >= 10) {
      setTimeout(() => {
        setPendingPrayersDelta(75)
        setReleaseNote(
          `Lifeguard Captain opens the cell door: "Clean pop-up form and deep duck-dive stamina, grom. 10 surf pop-ups logged. Blackball lifted for good behavior and maximum stoke!"`
        )
        triggerRelease()
      }, 500)
    }
  }

  // 4. WSL / Surf Lawyer Call
  const handleCallLawyer = () => {
    setJailTab('lawyer')
    setLawyerStep('calling')
    setTimeout(() => {
      setLawyerStep('dismissed')
      setPendingPrayersDelta(100)
      setReleaseNote(
        `${rider.name}'s WSL tour attorney petitioned the Orange County Coastal Commission: "My clients were on an essential south-swell pilgrimage to Trestles!" Commissioner dismissed all charges with immediate release!`
      )
      triggerRelease()
    }, 2200)
  }

  // 5. Monopoly Get Out of Jail Free Card
  const handlePlayGetOutOfJailCard = () => {
    setPendingPrayersDelta(200)
    setReleaseNote(
      '🎲 OFFICIAL MONOPOLY "GET OUT OF JAIL FREE" CARD PLAYED! You pulled a laminated vintage Chance Card out of your wetsuit chest-zip pocket: "This card may be kept until needed or sold." The Harbor Captain honors the classic board game rules: charges dropped, gate opened, and here is your $200 (200 Ocean Prayers) for passing GO!'
    )
    triggerRelease()
  }

  const triggerRelease = () => {
    setReleased(true)
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#34d399', '#facc15', '#f87171']
      })
    } catch {
      // Fallback
    }
  }

  const handleReturnToCanyon = () => {
    onRelease(pendingPrayersDelta)
  }

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-mono select-none animate-fadeIn">
      <div className="relative max-w-2xl w-full bg-slate-900 border-4 border-amber-600/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #94a3b8, #94a3b8 10px, transparent 10px, transparent 48px)'
          }}
        />

        {/* TOP HEADER */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-950 border border-amber-500 text-amber-400 shadow-md">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-widest">
                  OC HARBOR PATROL &amp; LIFEGUARD HOLDING TANK
                </span>
                <span className="px-2 py-0.5 rounded bg-red-950 border border-red-600 text-[10px] font-bold text-red-300">
                  BLACKBALL TANK 4B
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Dana Point Harbor &bull; Orange County Coastal Enforcement Division
              </span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase">CASE FILE:</span>
            <span className="text-xs font-bold text-slate-300 font-mono">#OC-PCH-949</span>
          </div>
        </div>

        {/* MONOPOLY JAIL CITATION BANNER */}
        <div className="relative z-10 p-3 rounded-2xl bg-amber-950/80 border-2 border-amber-500/90 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">🎲</span>
            <div>
              <span className="text-xs sm:text-sm font-black text-amber-300 block tracking-wide">
                GO DIRECTLY TO JAIL &bull; DO NOT PASS GO &bull; DO NOT COLLECT $200!
              </span>
              <span className="text-[10px] text-amber-200/80 font-mono">
                Official PCH Rule: Surfer forfeited $200 / 200 Prayers for speeding toward San Clemente &amp; Trestles.
              </span>
            </div>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-amber-900 border border-amber-400 text-amber-200 text-[10px] font-black uppercase whitespace-nowrap">
            BLACKBALLED!
          </span>
        </div>

        {/* BOOKING MUGSHOT CARD BANNER */}
        <div className="relative z-10 bg-slate-950 rounded-2xl border-2 border-slate-800 p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-36 h-40 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col items-center justify-end shrink-0 shadow-inner">
            <div className="absolute top-2 left-2 text-[9px] text-slate-600 font-mono leading-3 select-none">
              <div>- 6'4"</div>
              <div>- 6'2"</div>
              <div>- 6'0"</div>
              <div>- 5'10"</div>
              <div>- 5'8"</div>
              <div>- 5'6"</div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="text-3xl mb-1">{rider.iconEmoji}</div>
              <div className="w-16 h-12 bg-amber-700/80 rounded-t-xl border border-amber-500/50 flex items-center justify-center">
                <span className="text-[9px] font-black text-slate-950 uppercase tracking-tighter">
                  OC DETAINEE
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-950 border-t border-slate-700 py-1 text-center font-mono text-[8px] text-slate-300">
              <div className="font-bold text-amber-400 truncate px-1">
                {rider.name.toUpperCase()} &amp; DRIVER
              </div>
              <div className="text-slate-500">ID: 92651-SWELL</div>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-xs text-left w-full">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400 font-bold uppercase text-[10px]">CHARGES FILED:</span>
              <span className="text-red-400 font-bold truncate max-w-[240px]">
                {carState.arrestReason || 'Reckless PCH Speeding & Evading Harbor Patrol'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">IMPOUNDED RIG:</span>
                <span className="text-slate-300 font-semibold">PCH Surf Wagon &amp; Roof Racks</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">CONFISCATED QUIVER:</span>
                <span className="text-cyan-400 font-semibold truncate block">
                  {board.name}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">ARRESTING OFFICER:</span>
                <span className="text-slate-300">Officer Brody (CHP / Harbor)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">BAIL BOND:</span>
                <span className="text-amber-400 font-bold">100 Prayers (or Shop Bail)</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl text-[11px] text-slate-300 italic">
              <span className="text-cyan-400 font-bold not-italic block mb-0.5">
                {rider.name} ({rider.nickname}) in holding tank:
              </span>
              "{getProJailQuote()}"
            </div>
          </div>
        </div>

        {/* RELEASED BANNER */}
        {released ? (
          <div className="relative z-10 bg-emerald-950/80 border-2 border-emerald-500 p-4 rounded-2xl space-y-3 animate-fadeIn text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-sm uppercase">
              <CheckCircle2 className="w-5 h-5" />
              <span>BLACKBALL LIFTED &bull; HARBOR GATE OPEN!</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono max-w-lg mx-auto">
              {releaseNote}
            </p>
            {pendingPrayersDelta !== 0 && (
              <div
                className={`text-xs font-bold ${pendingPrayersDelta > 0 ? 'text-cyan-300' : 'text-amber-300'}`}
              >
                {pendingPrayersDelta > 0
                  ? `+${pendingPrayersDelta} Ocean Prayers Bonus (Local Shop Karma)!`
                  : `${pendingPrayersDelta} Prayers bail bond processed.`}
              </div>
            )}
            <button
              onClick={handleReturnToCanyon}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01] transition-all"
            >
              <span>GRAB BOARDS, KEYS &amp; CRUISE BACK DOWN PCH CA-1!</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        ) : (
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                Select your bail or release strategy:
              </span>
              <span className="text-xs text-amber-400 font-bold">
                Your Prayers: {carState.prayersCount}
              </span>
            </div>

            {jailTab === 'call_milo' ? (
              <div className="bg-slate-950 p-4 rounded-2xl border border-sky-600/60 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <Phone className="w-4 h-4" />
                    <span>COLLECT CALL: SURF &amp; PADDLE LAGUNA (BY THE TACO STAND)</span>
                  </div>
                  <button
                    onClick={() => setJailTab('booking')}
                    className="text-[11px] text-slate-400 hover:text-white cursor-pointer underline"
                  >
                    &larr; Other options
                  </button>
                </div>

                {miloCallStep === 'ringing' && (
                  <div className="py-4 text-center space-y-2">
                    <div className="text-sky-300 text-sm animate-pulse">
                      📞 *Dialing 949-494-SURF... Ring... Ring...*
                    </div>
                    <div className="text-slate-400 text-xs">
                      "Connecting collect call from Dana Point Harbor Holding Tank..."
                    </div>
                  </div>
                )}

                {miloCallStep === 'talking' && (
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-2">
                    <p className="text-slate-200 leading-relaxed italic">
                      "Yo, Surf &amp; Paddle Laguna! Mateo on the counter... Wait, what?! You and {rider.name} got
                      detained by Harbor Patrol on the way to Trestles?! Don't trip—I just grabbed a bag of Carne Asada
                      burritos from The Taco Stand next door and the shop Woody wagon is heading down PCH right now!"
                    </p>
                    <button
                      onClick={handleFinishMiloBail}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase cursor-pointer transition-all shadow-glow-ice"
                    >
                      ACCEPT SURF &amp; PADDLE BAIL BOND &amp; RELEASE!
                    </button>
                  </div>
                )}
              </div>
            ) : jailTab === 'squats' ? (
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-600/60 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>LIFEGUARD DRILL: 10 RAPID SURF POP-UPS</span>
                  </div>
                  <button
                    onClick={() => setJailTab('booking')}
                    className="text-[11px] text-slate-400 hover:text-white cursor-pointer underline"
                  >
                    &larr; Other options
                  </button>
                </div>

                <div className="text-slate-300 text-xs">
                  Prove to the California State Lifeguard Captain you can handle heavy 8-foot surf! Tap 10 times to complete 10 explosive surf pop-ups.
                </div>

                <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-200"
                    style={{ width: `${(squatCount / 10) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span>
                    POP-UPS COMPLETED: <strong className="text-amber-400">{squatCount} / 10</strong>
                  </span>
                  <span className="text-slate-400">
                    {squatCount >= 10 ? 'GOAL REACHED! 🤙' : `${10 - squatCount} remaining`}
                  </span>
                </div>

                <button
                  onClick={handleDoSquat}
                  disabled={squatCount >= 10}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all transform ${
                    isSquatting
                      ? 'scale-95 bg-amber-500 text-slate-950'
                      : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>DO SURF POP-UP #{squatCount + 1} 🏄</span>
                </button>
              </div>
            ) : jailTab === 'lawyer' ? (
              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-600/60 space-y-3 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Award className="w-4 h-4" />
                    <span>{rider.name.toUpperCase()}'S WSL TOUR ATTORNEY</span>
                  </div>
                  <button
                    onClick={() => setJailTab('booking')}
                    className="text-[11px] text-slate-400 hover:text-white cursor-pointer underline"
                  >
                    &larr; Other options
                  </button>
                </div>

                <div className="py-4 text-center space-y-2">
                  <div className="text-emerald-300 text-sm animate-pulse">
                    ⚖️ {lawyerStep === 'calling' ? 'Filing emergency WSL priority heat dispensation...' : 'Motion granted by OC Coastal Commissioner!'}
                  </div>
                  <div className="text-slate-400 text-xs">
                    "The Commissioner surfs San Onofre Old Man's every weekend and is reviewing the petition..."
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Cash Bail */}
                <button
                  onClick={handlePostCashBail}
                  disabled={carState.prayersCount < 50}
                  className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-600/60 hover:border-amber-400 text-left transition-all hover:bg-amber-900/60 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-200 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>Post Prayers Bail</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 font-bold">
                      -100 PRAYERS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Pay official Harbor Patrol bail for immediate release back to PCH.
                  </p>
                </button>

                {/* 2. Call Surf & Paddle */}
                <button
                  onClick={handleStartMiloCall}
                  className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-600/60 hover:border-sky-400 text-left transition-all hover:bg-sky-900/60 cursor-pointer flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-200 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-sky-400" />
                      <span>Call Surf &amp; Paddle</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-900/80 text-sky-300 font-bold">
                      FREE BOND
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Call Laguna Beach! Mateo will bring Taco Stand burritos and bail you out.
                  </p>
                </button>

                {/* 3. 10 Surf Pop-Ups Mini-Game */}
                <button
                  onClick={() => setJailTab('squats')}
                  className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-400 text-left transition-all hover:bg-slate-800 cursor-pointer flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-emerald-400" />
                      <span>10 Surf Pop-Ups</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                      MINI-GAME
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Earn release through surf fitness! Do 10 rapid pop-ups to impress the Lifeguard Captain.
                  </p>
                </button>

                {/* 4. Pro Lawyer */}
                <button
                  onClick={handleCallLawyer}
                  className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 hover:border-emerald-400 text-left transition-all hover:bg-emerald-900/60 cursor-pointer flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>{rider.name.split(' ')[0]}'s WSL Agent</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-bold">
                      WSL CLOUT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Have your pro passenger call the World Surf League commissioner to drop all charges!
                  </p>
                </button>

                {/* 5. Get Out of Jail Free Card */}
                <button
                  onClick={handlePlayGetOutOfJailCard}
                  className="sm:col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950 via-yellow-950/80 to-amber-950 border-2 border-amber-400 hover:border-amber-300 text-left transition-all hover:scale-[1.01] cursor-pointer shadow-lg flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl p-2 rounded-xl bg-amber-900/90 border border-amber-500">
                      🎲
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-300 uppercase tracking-wide text-xs sm:text-sm">
                          PLAY "GET OUT OF JAIL FREE" CARD
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                          +COLLECT $200!
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        "This card may be kept until needed or sold." Pull the laminated Monopoly Chance card from your wetsuit key pocket!
                      </p>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
