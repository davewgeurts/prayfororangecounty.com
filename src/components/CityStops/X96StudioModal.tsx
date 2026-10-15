import React, { useEffect, useRef, useState } from 'react'
import {
  RIDERS_LIST,
  LIFT_PASSES_LIST,
  type RiderPro
} from '../../data/snowboardGear'
import {
  X96_STATION,
  RFH_HOSTS,
  RFH_PRODUCER,
  RFH_FACTS,
  BONER_NOMINEES,
  BEAT_GINA_QUESTIONS,
  PLAYER_BONER_STORY,
  pickRandom,
  type BonerNominee,
  type BeatGinaQuestion
} from '../../data/radioFromHell'
import type { PlayerCarState } from '../../types/game'
import { CanyonAudioEngine } from '../../utils/audioEngine'
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  Ticket,
  Trophy,
  Vote
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props {
  carState: PlayerCarState;
  onFinishX96: (prayerBonus: number, prizePassId: string | null, claimedPrize: boolean) => void;
  onClose: () => void;
}

type StudioTab = 'boner' | 'gina' | 'desk'

const GINA_ACCURACY = 0.7
const PRIZE_PASS_PRIORITY = ['wasatch-dual-gold', 'brighton-day']
const PRIZE_FALLBACK_PRAYERS = 350

function pickGinaAnswer(question: BeatGinaQuestion): number {
  if (Math.random() < GINA_ACCURACY) return question.answerIndex
  const wrongOptions = question.options.map((_, i) => i).filter(i => i !== question.answerIndex)
  return wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
}

export const X96StudioModal: React.FC<Props> = ({
  carState,
  onFinishX96,
  onClose
}) => {
  const rider: RiderPro = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0]

  const [activeTab, setActiveTab] = useState<StudioTab>('boner')
  const [fact] = useState<string>(() => pickRandom(RFH_FACTS, 1)[0])

  const [nominees] = useState<BonerNominee[]>(() => pickRandom(BONER_NOMINEES, 3))
  const [votedId, setVotedId] = useState<string | null>(null)
  const [tally, setTally] = useState<Record<string, number> | null>(null)
  const bonerResultRef = useRef<HTMLDivElement | null>(null)

  const [questions] = useState(() => pickRandom(BEAT_GINA_QUESTIONS, 3))
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [playerPick, setPlayerPick] = useState<number | null>(null)
  const [ginaPick, setGinaPick] = useState<number | null>(null)
  const [playerScore, setPlayerScore] = useState<number>(0)
  const [ginaScore, setGinaScore] = useState<number>(0)

  const alreadyClaimed = !!carState.hasX96Prize
  const prizePassId = PRIZE_PASS_PRIORITY.find(id => !carState.purchasedPassIds.includes(id)) ?? null
  const prizePass = LIFT_PASSES_LIST.find(p => p.id === prizePassId)
  const [prizeClaimed, setPrizeClaimed] = useState<boolean>(false)

  const winnerId = tally
    ? Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
    : null
  const winner = nominees.find(n => n.id === winnerId)
  const wonShirt = !!votedId && votedId === winnerId
  const ginaDone = questionIndex >= questions.length
  const beatGina = ginaDone && playerScore > ginaScore

  useEffect(() => {
    if (winnerId) bonerResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [winnerId])

  const getProX96Quote = () => {
    switch (rider.id) {
      case 'jp-walker':
        return "Calling in to the Dawn Patrol Swell Desk! Let's vote on Kook of the Day and grab our WSL Finals Athlete Pass!"
      case 'peter-line':
        return "PT and Strider are live on the mic! If we beat the Chief Swell Forecaster at OC trivia, we get front-row priority at Trestles!"
      case 'scott-stevens':
        return "The guy who waxed the bottom of his surfboard at Main Beach HAS to win Kook of the Day!"
      default:
        return "Free WSL Trestles Finals VIP pass waiting at the broadcast booth? Grab it before the next set rolls in!"
    }
  }

  const fireConfetti = (colors: string[], particleCount = 50) => {
    try {
      confetti({ particleCount, spread: 75, origin: { y: 0.55 }, colors })
    } catch {
      // Fallback
    }
  }

  const handleVote = (nomineeId: string) => {
    if (votedId) return
    CanyonAudioEngine.get().playCashRegister()
    const weights = nominees.map(() => 20 + Math.random() * 60)
    const total = weights.reduce((sum, w) => sum + w, 0)
    const results: Record<string, number> = {}
    let assigned = 0
    nominees.forEach((n, i) => {
      const pct = i === nominees.length - 1 ? 100 - assigned : Math.round((weights[i] / total) * 100)
      results[n.id] = pct
      assigned += pct
    })
    setVotedId(nomineeId)
    setTally(results)
    const topId = Object.entries(results).sort((a, b) => b[1] - a[1])[0][0]
    if (topId === nomineeId) fireConfetti(['#06b6d4', '#facc15', '#ffffff'])
  }

  const handleAnswer = (optionIndex: number) => {
    if (playerPick !== null || ginaDone) return
    const question = questions[questionIndex]
    const ginaAnswer = pickGinaAnswer(question)

    setPlayerPick(optionIndex)
    setGinaPick(ginaAnswer)
    if (optionIndex === question.answerIndex) setPlayerScore(s => s + 1)
    if (ginaAnswer === question.answerIndex) setGinaScore(s => s + 1)
  }

  const handleNextQuestion = () => {
    const next = questionIndex + 1
    setQuestionIndex(next)
    setPlayerPick(null)
    setGinaPick(null)
    if (next >= questions.length) {
      if (playerScore > ginaScore) {
        CanyonAudioEngine.get().playShrineChime()
        fireConfetti(['#06b6d4', '#facc15', '#ffffff'], 70)
      } else {
        CanyonAudioEngine.get().playBailBuzzer()
      }
    }
  }

  const handleClaimPrize = () => {
    if (prizeClaimed || alreadyClaimed) return
    CanyonAudioEngine.get().playShrineChime()
    setPrizeClaimed(true)
    fireConfetti(['#38bdf8', '#facc15', '#ffffff'], 80)
  }

  const handleDepartStudio = () => {
    let bonus = 250
    if (wonShirt) bonus += 150
    if (beatGina) bonus += 200
    if (prizeClaimed && !prizePassId) bonus += PRIZE_FALLBACK_PRAYERS
    onFinishX96(bonus, prizeClaimed ? prizePassId : null, prizeClaimed)
  }

  const tabDone: Record<StudioTab, boolean> = {
    boner: !!votedId,
    gina: ginaDone,
    desk: prizeClaimed || alreadyClaimed
  }
  const tabLabels: Record<StudioTab, string> = {
    boner: 'Kook of the Day',
    gina: 'Beat the Forecaster',
    desk: 'WSL VIP Pass Pickup'
  }

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-mono select-none animate-fadeIn">
      <div className="relative max-w-2xl w-full max-h-full overflow-y-auto bg-slate-900 border-4 border-yellow-400/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
        {/* TOP RADIO BADGE */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black border-2 border-yellow-400 flex items-center justify-center text-yellow-400 text-xs font-black italic shadow-md text-center leading-tight">
              KROQ<br />106.7
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                  SURFLINE &amp; KROQ SWELL DESK
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-950 border border-red-500 text-red-300 font-bold animate-pulse">
                  ● LIVE SWELL REPORT
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {X96_STATION.callSign} &bull; {X96_STATION.studioAddress}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer shrink-0"
          >
            &times; Skip Stop
          </button>
        </div>

        {/* STUDIO VISUAL */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 overflow-hidden p-4 space-y-3">
          <div className="flex items-center justify-center">
            <div className="px-4 py-1 rounded-md bg-cyan-500 text-slate-950 text-xs font-black tracking-[0.25em] shadow-glow-ice">
              LIVE FROM THE SOUTH COAST
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {RFH_HOSTS.map(host => (
              <div
                key={host.id}
                className="rounded-xl bg-slate-900/90 border border-yellow-600/50 p-2 text-center"
                title={host.bio}
              >
                <div className="text-2xl">{host.emoji}</div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-black text-yellow-300 uppercase">
                  <Mic className="w-3 h-3" />
                  <span>{host.name.split(' ')[0]}</span>
                </div>
                <div className="text-[9px] text-slate-400 leading-tight">{host.role}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <span className="text-slate-400">
              🎛️ Producer {RFH_PRODUCER.name} &bull; 🐕 {RFH_PRODUCER.dogName}, {RFH_PRODUCER.dogDescription}
            </span>
          </div>
        </div>

        {/* PASSENGER BANTER */}
        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-yellow-400 font-bold">
            <span>{rider.iconEmoji}</span>
            <span>{rider.name} at the Broadcast Booth:</span>
          </div>
          <p className="text-slate-300 italic pl-5">
            &ldquo;{getProX96Quote()}&rdquo;
          </p>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          {(Object.keys(tabLabels) as StudioTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-2 rounded-xl border font-bold uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-yellow-400 border-yellow-300 text-slate-950'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-yellow-500'
              }`}
            >
              {tabDone[tab] && <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{tabLabels[tab]}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: KOOK OF THE DAY */}
        {activeTab === 'boner' && (
          <div className="space-y-2.5 text-xs">
            <p className="text-[11px] text-slate-400">
              Three legendary Orange County beach &amp; lineup fails. Vote for today’s <span className="text-yellow-300 font-bold">Kook of the Day</span> to score +150 Ocean Prayers!
            </p>

            {nominees.map((nominee, i) => {
              const pct = tally?.[nominee.id]
              const isWinner = nominee.id === winnerId
              return (
                <button
                  key={nominee.id}
                  onClick={() => handleVote(nominee.id)}
                  disabled={!!votedId}
                  className={`relative w-full text-left p-3 rounded-2xl border transition-all overflow-hidden ${
                    votedId
                      ? isWinner
                        ? 'bg-yellow-950/70 border-yellow-400'
                        : 'bg-slate-900/60 border-slate-800 opacity-80'
                      : 'bg-slate-800/80 border-slate-700 hover:border-yellow-400 cursor-pointer'
                  }`}
                >
                  {pct !== undefined && (
                    <div
                      className="absolute inset-y-0 left-0 bg-yellow-500/15 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  <div className="relative space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white">
                        #{i + 1} {nominee.headline}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-yellow-300 font-bold shrink-0">
                        {pct !== undefined
                          ? `${pct}%${isWinner ? ' 🏆' : ''}${votedId === nominee.id ? ' • YOUR VOTE' : ''}`
                          : 'VOTE'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{nominee.story}</p>
                  </div>
                </button>
              )
            })}

            {winner && (
              <div ref={bonerResultRef} className="bg-slate-950/80 border border-yellow-600/60 p-3 rounded-2xl space-y-1 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-yellow-300">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>TODAY’S KOOK OF THE DAY: {winner.headline}</span>
                </div>
                <p className="text-[11px] text-slate-300 italic">
                  {RFH_HOSTS.find(h => h.id === winner.hostId)?.name.split(' ')[0]}: &ldquo;{winner.hostReaction}&rdquo;
                </p>
                <p className={`text-[11px] font-bold ${wonShirt ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {wonShirt
                    ? '👕 You picked the winning Kook! Limited-edition Surf & Paddle + KROQ Tee unlocked! (+150 prayers)'
                    : 'The beach listeners have spoken!'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BEAT THE FORECASTER TRIVIA */}
        {activeTab === 'gina' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Three OC Coast &amp; WSL questions against Chief Forecaster Schuler!</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 font-bold">
                <span className="text-cyan-300">YOU {playerScore}</span>
                <span className="text-slate-500"> – </span>
                <span className="text-pink-300">{ginaScore} FORECASTER</span>
              </span>
            </div>

            {!ginaDone ? (
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-2.5">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Question {questionIndex + 1} of {questions.length}
                </div>
                <p className="text-white font-bold">{questions[questionIndex].question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {questions[questionIndex].options.map((option, i) => {
                    const answered = playerPick !== null
                    const isAnswer = i === questions[questionIndex].answerIndex
                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(i)}
                        disabled={answered}
                        className={`px-2 py-2 rounded-xl border text-left transition-all ${
                          !answered
                            ? 'bg-slate-800 border-slate-700 hover:border-yellow-400 text-slate-200 cursor-pointer'
                            : isAnswer
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                            : playerPick === i
                            ? 'bg-rose-950/70 border-rose-600 text-rose-200'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="font-bold">{option}</span>
                        {answered && (
                          <span className="block text-[9px] mt-0.5">
                            {playerPick === i && '← YOU '}
                            {ginaPick === i && '← FORECASTER'}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {playerPick !== null && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black uppercase text-[11px] cursor-pointer"
                  >
                    {questionIndex + 1 < questions.length ? 'Next Question' : 'Final Score'}
                  </button>
                )}
              </div>
            ) : (
              <div className={`p-3 rounded-2xl border-2 text-center space-y-1 animate-fadeIn ${
                beatGina ? 'bg-emerald-950/60 border-emerald-400' : 'bg-pink-950/50 border-pink-500'
              }`}>
                <div className={`font-black uppercase ${beatGina ? 'text-emerald-300' : 'text-pink-300'}`}>
                  {beatGina ? '🎉 YOU BEAT THE FORECASTER! (+200 prayers)' : '📡 THE BUOY WHISPERER WINS'}
                </div>
                <p className="text-[11px] text-slate-300">
                  {beatGina
                    ? 'You know Orange County surf lore better than the Surfline buoy desk!'
                    : `Final: You ${playerScore}, Forecaster ${ginaScore}. Still stoked for Trestles!`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WSL VIP PASS PICKUP */}
        {activeTab === 'desk' && (
          <div className="space-y-3 text-xs">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Your Listener Clip of the Week</div>
              <p className="text-white font-bold">&ldquo;{PLAYER_BONER_STORY.headline}&rdquo;</p>
              <p className="text-[11px] text-slate-300 leading-snug">{PLAYER_BONER_STORY.story}</p>
              <p className="text-[11px] text-yellow-300 italic">{PLAYER_BONER_STORY.reaction}</p>
            </div>

            {alreadyClaimed ? (
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
                You already picked up your VIP pass! See you on the cobblestones at Lower Trestles!
              </div>
            ) : (
              <button
                onClick={handleClaimPrize}
                disabled={prizeClaimed}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  prizeClaimed
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                    : 'bg-sky-950/60 border-sky-600 hover:border-sky-300 text-sky-100 cursor-pointer'
                }`}
              >
                <Ticket className={`w-8 h-8 shrink-0 ${prizeClaimed ? 'text-emerald-300' : 'text-sky-300'}`} />
                <div className="space-y-0.5">
                  <div className="font-black uppercase">
                    {prizeClaimed ? 'VIP PASS CLAIMED!' : 'CLAIM FREE WSL FINALS & BEACH VIP PASS'}
                  </div>
                  <div className="text-[11px]">
                    {prizePass
                      ? `${prizePass.name} — unlocked free courtesy of KROQ & Surfline!`
                      : `You already own every Beach Pass, so here is +${PRIZE_FALLBACK_PRAYERS} Ocean Prayers!`}
                  </div>
                </div>
              </button>
            )}
          </div>
        )}

        {/* FACT TICKER */}
        <div className="flex items-start gap-2 text-[10px] text-slate-400 border-t border-slate-800 pt-3">
          <Vote className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
          <span>OC COAST FACT: {fact}</span>
        </div>

        {/* DEPART BUTTON */}
        <button
          onClick={handleDepartStudio}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-cyan-400 hover:from-yellow-300 hover:to-cyan-300 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transform hover:scale-[1.01] transition-all"
        >
          <span>CRANK SURF RADIO &amp; HEAD DOWN PCH! 📻🌊</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  )
}
