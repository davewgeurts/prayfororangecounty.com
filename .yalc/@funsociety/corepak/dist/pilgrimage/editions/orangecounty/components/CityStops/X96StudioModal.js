import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { RIDERS_LIST, LIFT_PASSES_LIST } from '../../data/snowboardGear';
import { X96_STATION, RFH_HOSTS, RFH_PRODUCER, RFH_FACTS, BONER_NOMINEES, BEAT_GINA_QUESTIONS, PLAYER_BONER_STORY, pickRandom } from '../../data/radioFromHell';
import { CanyonAudioEngine } from '../../utils/audioEngine';
import { ArrowRight, CheckCircle2, Mic, Ticket, Trophy, Vote } from 'lucide-react';
import confetti from 'canvas-confetti';
const GINA_ACCURACY = 0.7;
const PRIZE_PASS_PRIORITY = ['wasatch-dual-gold', 'brighton-day'];
const PRIZE_FALLBACK_PRAYERS = 350;
function pickGinaAnswer(question) {
    if (Math.random() < GINA_ACCURACY)
        return question.answerIndex;
    const wrongOptions = question.options.map((_, i) => i).filter(i => i !== question.answerIndex);
    return wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
}
export const X96StudioModal = ({ carState, onFinishX96, onClose }) => {
    const rider = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0];
    const [activeTab, setActiveTab] = useState('boner');
    const [fact] = useState(() => pickRandom(RFH_FACTS, 1)[0]);
    const [nominees] = useState(() => pickRandom(BONER_NOMINEES, 3));
    const [votedId, setVotedId] = useState(null);
    const [tally, setTally] = useState(null);
    const bonerResultRef = useRef(null);
    const [questions] = useState(() => pickRandom(BEAT_GINA_QUESTIONS, 3));
    const [questionIndex, setQuestionIndex] = useState(0);
    const [playerPick, setPlayerPick] = useState(null);
    const [ginaPick, setGinaPick] = useState(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [ginaScore, setGinaScore] = useState(0);
    const alreadyClaimed = !!carState.hasX96Prize;
    const prizePassId = PRIZE_PASS_PRIORITY.find(id => !carState.purchasedPassIds.includes(id)) ?? null;
    const prizePass = LIFT_PASSES_LIST.find(p => p.id === prizePassId);
    const [prizeClaimed, setPrizeClaimed] = useState(false);
    const winnerId = tally
        ? Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
        : null;
    const winner = nominees.find(n => n.id === winnerId);
    const wonShirt = !!votedId && votedId === winnerId;
    const ginaDone = questionIndex >= questions.length;
    const beatGina = ginaDone && playerScore > ginaScore;
    useEffect(() => {
        if (winnerId)
            bonerResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [winnerId]);
    const getProX96Quote = () => {
        switch (rider.id) {
            case 'jp-walker':
                return "Calling in to the Dawn Patrol Swell Desk! Let's vote on Kook of the Day and grab our WSL Finals Athlete Pass!";
            case 'peter-line':
                return "PT and Strider are live on the mic! If we beat the Chief Swell Forecaster at OC trivia, we get front-row priority at Trestles!";
            case 'scott-stevens':
                return "The guy who waxed the bottom of his surfboard at Main Beach HAS to win Kook of the Day!";
            default:
                return "Free WSL Trestles Finals VIP pass waiting at the broadcast booth? Grab it before the next set rolls in!";
        }
    };
    const fireConfetti = (colors, particleCount = 50) => {
        try {
            confetti({ particleCount, spread: 75, origin: { y: 0.55 }, colors });
        }
        catch {
            // Fallback
        }
    };
    const handleVote = (nomineeId) => {
        if (votedId)
            return;
        CanyonAudioEngine.get().playCashRegister();
        const weights = nominees.map(() => 20 + Math.random() * 60);
        const total = weights.reduce((sum, w) => sum + w, 0);
        const results = {};
        let assigned = 0;
        nominees.forEach((n, i) => {
            const pct = i === nominees.length - 1 ? 100 - assigned : Math.round((weights[i] / total) * 100);
            results[n.id] = pct;
            assigned += pct;
        });
        setVotedId(nomineeId);
        setTally(results);
        const topId = Object.entries(results).sort((a, b) => b[1] - a[1])[0][0];
        if (topId === nomineeId)
            fireConfetti(['#06b6d4', '#facc15', '#ffffff']);
    };
    const handleAnswer = (optionIndex) => {
        if (playerPick !== null || ginaDone)
            return;
        const question = questions[questionIndex];
        const ginaAnswer = pickGinaAnswer(question);
        setPlayerPick(optionIndex);
        setGinaPick(ginaAnswer);
        if (optionIndex === question.answerIndex)
            setPlayerScore(s => s + 1);
        if (ginaAnswer === question.answerIndex)
            setGinaScore(s => s + 1);
    };
    const handleNextQuestion = () => {
        const next = questionIndex + 1;
        setQuestionIndex(next);
        setPlayerPick(null);
        setGinaPick(null);
        if (next >= questions.length) {
            if (playerScore > ginaScore) {
                CanyonAudioEngine.get().playShrineChime();
                fireConfetti(['#06b6d4', '#facc15', '#ffffff'], 70);
            }
            else {
                CanyonAudioEngine.get().playBailBuzzer();
            }
        }
    };
    const handleClaimPrize = () => {
        if (prizeClaimed || alreadyClaimed)
            return;
        CanyonAudioEngine.get().playShrineChime();
        setPrizeClaimed(true);
        fireConfetti(['#38bdf8', '#facc15', '#ffffff'], 80);
    };
    const handleDepartStudio = () => {
        let bonus = 250;
        if (wonShirt)
            bonus += 150;
        if (beatGina)
            bonus += 200;
        if (prizeClaimed && !prizePassId)
            bonus += PRIZE_FALLBACK_PRAYERS;
        onFinishX96(bonus, prizeClaimed ? prizePassId : null, prizeClaimed);
    };
    const tabDone = {
        boner: !!votedId,
        gina: ginaDone,
        desk: prizeClaimed || alreadyClaimed
    };
    const tabLabels = {
        boner: 'Kook of the Day',
        gina: 'Beat the Forecaster',
        desk: 'WSL VIP Pass Pickup'
    };
    return (_jsx("div", { className: "absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-mono select-none animate-fadeIn", children: _jsxs("div", { className: "relative max-w-2xl w-full max-h-full overflow-y-auto bg-slate-900 border-4 border-yellow-400/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between border-b-2 border-slate-800 pb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "w-12 h-12 rounded-2xl bg-black border-2 border-yellow-400 flex items-center justify-center text-yellow-400 text-xs font-black italic shadow-md text-center leading-tight", children: ["KROQ", _jsx("br", {}), "106.7"] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-base sm:text-lg font-black text-white uppercase tracking-wider", children: "SURFLINE & KROQ SWELL DESK" }), _jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] bg-red-950 border border-red-500 text-red-300 font-bold animate-pulse", children: "\u25CF LIVE SWELL REPORT" })] }), _jsxs("span", { className: "text-[11px] text-slate-400", children: [X96_STATION.callSign, " \u2022 ", X96_STATION.studioAddress] })] })] }), _jsx("button", { onClick: onClose, className: "text-xs text-slate-500 hover:text-slate-300 cursor-pointer shrink-0", children: "\u00D7 Skip Stop" })] }), _jsxs("div", { className: "relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 overflow-hidden p-4 space-y-3", children: [_jsx("div", { className: "flex items-center justify-center", children: _jsx("div", { className: "px-4 py-1 rounded-md bg-cyan-500 text-slate-950 text-xs font-black tracking-[0.25em] shadow-glow-ice", children: "LIVE FROM THE SOUTH COAST" }) }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: RFH_HOSTS.map(host => (_jsxs("div", { className: "rounded-xl bg-slate-900/90 border border-yellow-600/50 p-2 text-center", title: host.bio, children: [_jsx("div", { className: "text-2xl", children: host.emoji }), _jsxs("div", { className: "flex items-center justify-center gap-1 text-[11px] font-black text-yellow-300 uppercase", children: [_jsx(Mic, { className: "w-3 h-3" }), _jsx("span", { children: host.name.split(' ')[0] })] }), _jsx("div", { className: "text-[9px] text-slate-400 leading-tight", children: host.role })] }, host.id))) }), _jsx("div", { className: "flex flex-wrap items-center justify-between gap-2 text-[10px]", children: _jsxs("span", { className: "text-slate-400", children: ["\uD83C\uDF9B\uFE0F Producer ", RFH_PRODUCER.name, " \u2022 \uD83D\uDC15 ", RFH_PRODUCER.dogName, ", ", RFH_PRODUCER.dogDescription] }) })] }), _jsxs("div", { className: "bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-yellow-400 font-bold", children: [_jsx("span", { children: rider.iconEmoji }), _jsxs("span", { children: [rider.name, " at the Broadcast Booth:"] })] }), _jsxs("p", { className: "text-slate-300 italic pl-5", children: ["\u201C", getProX96Quote(), "\u201D"] })] }), _jsx("div", { className: "grid grid-cols-3 gap-2 text-[11px]", children: Object.keys(tabLabels).map(tab => (_jsxs("button", { onClick: () => setActiveTab(tab), className: `px-2 py-2 rounded-xl border font-bold uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === tab
                            ? 'bg-yellow-400 border-yellow-300 text-slate-950'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-yellow-500'}`, children: [tabDone[tab] && _jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: tabLabels[tab] })] }, tab))) }), activeTab === 'boner' && (_jsxs("div", { className: "space-y-2.5 text-xs", children: [_jsxs("p", { className: "text-[11px] text-slate-400", children: ["Three legendary Orange County beach & lineup fails. Vote for today\u2019s ", _jsx("span", { className: "text-yellow-300 font-bold", children: "Kook of the Day" }), " to score +150 Ocean Prayers!"] }), nominees.map((nominee, i) => {
                            const pct = tally?.[nominee.id];
                            const isWinner = nominee.id === winnerId;
                            return (_jsxs("button", { onClick: () => handleVote(nominee.id), disabled: !!votedId, className: `relative w-full text-left p-3 rounded-2xl border transition-all overflow-hidden ${votedId
                                    ? isWinner
                                        ? 'bg-yellow-950/70 border-yellow-400'
                                        : 'bg-slate-900/60 border-slate-800 opacity-80'
                                    : 'bg-slate-800/80 border-slate-700 hover:border-yellow-400 cursor-pointer'}`, children: [pct !== undefined && (_jsx("div", { className: "absolute inset-y-0 left-0 bg-yellow-500/15 transition-all duration-700", style: { width: `${pct}%` } })), _jsxs("div", { className: "relative space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("span", { className: "font-bold text-white", children: ["#", i + 1, " ", nominee.headline] }), _jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-yellow-300 font-bold shrink-0", children: pct !== undefined
                                                            ? `${pct}%${isWinner ? ' 🏆' : ''}${votedId === nominee.id ? ' • YOUR VOTE' : ''}`
                                                            : 'VOTE' })] }), _jsx("p", { className: "text-[11px] text-slate-300 leading-snug", children: nominee.story })] })] }, nominee.id));
                        }), winner && (_jsxs("div", { ref: bonerResultRef, className: "bg-slate-950/80 border border-yellow-600/60 p-3 rounded-2xl space-y-1 animate-fadeIn", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] font-bold text-yellow-300", children: [_jsx(Trophy, { className: "w-3.5 h-3.5" }), _jsxs("span", { children: ["TODAY\u2019S KOOK OF THE DAY: ", winner.headline] })] }), _jsxs("p", { className: "text-[11px] text-slate-300 italic", children: [RFH_HOSTS.find(h => h.id === winner.hostId)?.name.split(' ')[0], ": \u201C", winner.hostReaction, "\u201D"] }), _jsx("p", { className: `text-[11px] font-bold ${wonShirt ? 'text-emerald-300' : 'text-slate-500'}`, children: wonShirt
                                        ? '👕 You picked the winning Kook! Limited-edition Surf & Paddle + KROQ Tee unlocked! (+150 prayers)'
                                        : 'The beach listeners have spoken!' })] }))] })), activeTab === 'gina' && (_jsxs("div", { className: "space-y-3 text-xs", children: [_jsxs("div", { className: "flex items-center justify-between text-[11px]", children: [_jsx("span", { className: "text-slate-400", children: "Three OC Coast & WSL questions against Chief Forecaster Schuler!" }), _jsxs("span", { className: "px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 font-bold", children: [_jsxs("span", { className: "text-cyan-300", children: ["YOU ", playerScore] }), _jsx("span", { className: "text-slate-500", children: " \u2013 " }), _jsxs("span", { className: "text-pink-300", children: [ginaScore, " FORECASTER"] })] })] }), !ginaDone ? (_jsxs("div", { className: "bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-2.5", children: [_jsxs("div", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: ["Question ", questionIndex + 1, " of ", questions.length] }), _jsx("p", { className: "text-white font-bold", children: questions[questionIndex].question }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: questions[questionIndex].options.map((option, i) => {
                                        const answered = playerPick !== null;
                                        const isAnswer = i === questions[questionIndex].answerIndex;
                                        return (_jsxs("button", { onClick: () => handleAnswer(i), disabled: answered, className: `px-2 py-2 rounded-xl border text-left transition-all ${!answered
                                                ? 'bg-slate-800 border-slate-700 hover:border-yellow-400 text-slate-200 cursor-pointer'
                                                : isAnswer
                                                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                                                    : playerPick === i
                                                        ? 'bg-rose-950/70 border-rose-600 text-rose-200'
                                                        : 'bg-slate-900 border-slate-800 text-slate-500'}`, children: [_jsx("span", { className: "font-bold", children: option }), answered && (_jsxs("span", { className: "block text-[9px] mt-0.5", children: [playerPick === i && '← YOU ', ginaPick === i && '← FORECASTER'] }))] }, option));
                                    }) }), playerPick !== null && (_jsx("button", { onClick: handleNextQuestion, className: "w-full py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black uppercase text-[11px] cursor-pointer", children: questionIndex + 1 < questions.length ? 'Next Question' : 'Final Score' }))] })) : (_jsxs("div", { className: `p-3 rounded-2xl border-2 text-center space-y-1 animate-fadeIn ${beatGina ? 'bg-emerald-950/60 border-emerald-400' : 'bg-pink-950/50 border-pink-500'}`, children: [_jsx("div", { className: `font-black uppercase ${beatGina ? 'text-emerald-300' : 'text-pink-300'}`, children: beatGina ? '🎉 YOU BEAT THE FORECASTER! (+200 prayers)' : '📡 THE BUOY WHISPERER WINS' }), _jsx("p", { className: "text-[11px] text-slate-300", children: beatGina
                                        ? 'You know Orange County surf lore better than the Surfline buoy desk!'
                                        : `Final: You ${playerScore}, Forecaster ${ginaScore}. Still stoked for Trestles!` })] }))] })), activeTab === 'desk' && (_jsxs("div", { className: "space-y-3 text-xs", children: [_jsxs("div", { className: "bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1.5", children: [_jsx("div", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: "Your Listener Clip of the Week" }), _jsxs("p", { className: "text-white font-bold", children: ["\u201C", PLAYER_BONER_STORY.headline, "\u201D"] }), _jsx("p", { className: "text-[11px] text-slate-300 leading-snug", children: PLAYER_BONER_STORY.story }), _jsx("p", { className: "text-[11px] text-yellow-300 italic", children: PLAYER_BONER_STORY.reaction })] }), alreadyClaimed ? (_jsx("div", { className: "p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300", children: "You already picked up your VIP pass! See you on the cobblestones at Lower Trestles!" })) : (_jsxs("button", { onClick: handleClaimPrize, disabled: prizeClaimed, className: `w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${prizeClaimed
                                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                                : 'bg-sky-950/60 border-sky-600 hover:border-sky-300 text-sky-100 cursor-pointer'}`, children: [_jsx(Ticket, { className: `w-8 h-8 shrink-0 ${prizeClaimed ? 'text-emerald-300' : 'text-sky-300'}` }), _jsxs("div", { className: "space-y-0.5", children: [_jsx("div", { className: "font-black uppercase", children: prizeClaimed ? 'VIP PASS CLAIMED!' : 'CLAIM FREE WSL FINALS & BEACH VIP PASS' }), _jsx("div", { className: "text-[11px]", children: prizePass
                                                ? `${prizePass.name} — unlocked free courtesy of KROQ & Surfline!`
                                                : `You already own every Beach Pass, so here is +${PRIZE_FALLBACK_PRAYERS} Ocean Prayers!` })] })] }))] })), _jsxs("div", { className: "flex items-start gap-2 text-[10px] text-slate-400 border-t border-slate-800 pt-3", children: [_jsx(Vote, { className: "w-3.5 h-3.5 text-yellow-500 shrink-0" }), _jsxs("span", { children: ["OC COAST FACT: ", fact] })] }), _jsxs("button", { onClick: handleDepartStudio, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-cyan-400 hover:from-yellow-300 hover:to-cyan-300 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transform hover:scale-[1.01] transition-all", children: [_jsx("span", { children: "CRANK SURF RADIO & HEAD DOWN PCH! \uD83D\uDCFB\uD83C\uDF0A" }), _jsx(ArrowRight, { className: "w-4 h-4 stroke-[3]" })] })] }) }));
};
