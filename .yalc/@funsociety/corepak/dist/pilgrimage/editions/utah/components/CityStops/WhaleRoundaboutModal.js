import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { RIDERS_LIST } from '../../data/snowboardGear';
import { CanyonAudioEngine } from '../../utils/audioEngine';
import { Sparkles, CheckCircle2, ArrowRight, Flame, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';
export const WhaleRoundaboutModal = ({ carState, onFinishWhale, onClose }) => {
    const rider = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0];
    const [whaleLaps, setWhaleLaps] = useState(0);
    const [hasPrayed, setHasPrayed] = useState(false);
    const [hasStickered, setHasStickered] = useState(false);
    const [blessingGranted, setBlessingGranted] = useState(false);
    const getProWhaleQuote = () => {
        switch (rider.id) {
            case 'jp-walker':
                return "ALL HAIL THE WHALE! In 2023 we got 903 inches of blower powder right after they built this glorious beast. Circle the roundabout one more time for good measure!";
            case 'chris-grenier':
                return "YOOOO THE 9TH & 9TH WHALE! We debated on The Bomb Hole if this whale is the greatest snow summoning deity in human history. The answer is YES!";
            case 'peter-line':
                return "Now this is real art. A neon humpback whale standing in a snowy Salt Lake roundabout. Peter Line 100% approves!";
            case 'jeremy-jones':
                return "The Whale redirects Pacific storm tracks right over Mount Superior and Great Western. Bow your head and pray for cold smoke!";
            case 'scott-stevens':
                return "I want to do a blunt-slide on the whale's pectoral fin into the roundabout bushes so badly!";
            case 'shaun-white':
                return "I've traveled the world, but Salt Lake City having an official snow deity whale in a neighborhood roundabout is legendary.";
            case 'danny-davis':
                return "Peace and cosmic whale energy. Let the cosmic frequencies bring 2 feet of untracked snow to Brighton.";
            case 'milo-groms':
                return "HONK THE HORN AGAIN! If we circle 3 times, Brighton opens Milly Basin early today!";
            default:
                return "All hail the 9th & 9th Whale! The sacred protector of Wasatch snowstorms.";
        }
    };
    // Circle the roundabout + Honk Horn
    const handleCircleRoundabout = () => {
        CanyonAudioEngine.get().playCarHorn();
        const next = whaleLaps + 1;
        setWhaleLaps(next);
        try {
            confetti({
                particleCount: 35,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#06b6d4', '#a855f7', '#ec4899', '#ffffff']
            });
        }
        catch {
            // Fallback
        }
        if (next >= 3) {
            setBlessingGranted(true);
        }
    };
    // Offer prayer to the Whale
    const handleOfferPrayer = () => {
        setHasPrayed(true);
        try {
            confetti({
                particleCount: 60,
                spread: 90,
                origin: { y: 0.5 },
                colors: ['#38bdf8', '#fbbf24', '#ffffff']
            });
        }
        catch {
            // Fallback
        }
    };
    // Slap Milosport Sticker
    const handleSlapSticker = () => {
        setHasStickered(true);
    };
    const handleDepartRoundabout = () => {
        let bonus = 300;
        if (whaleLaps >= 3)
            bonus += 200;
        if (hasPrayed)
            bonus += 150;
        if (hasStickered)
            bonus += 50;
        onFinishWhale(bonus);
    };
    return (_jsx("div", { className: "absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-mono select-none animate-fadeIn", children: _jsxs("div", { className: "relative max-w-2xl w-full bg-slate-900 border-4 border-cyan-500/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between border-b-2 border-slate-800 pb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 border border-cyan-300 flex items-center justify-center text-white text-2xl shadow-glow-ice", children: "\uD83D\uDC0B" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-base sm:text-lg font-black text-white uppercase tracking-wider", children: "THE 9TH & 9TH WHALE" }), _jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold", children: "903\" POWDER DEITY" })] }), _jsx("span", { className: "text-[11px] text-slate-400", children: "900 South & 900 East Roundabout \u2022 \"Out of the Blue\" Monument" })] })] }), _jsx("button", { onClick: onClose, className: "text-xs text-slate-500 hover:text-slate-300 cursor-pointer", children: "\u00D7 Skip Stop" })] }), _jsxs("div", { className: "relative h-44 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center", children: [_jsxs("div", { className: "absolute inset-0 opacity-40 pointer-events-none text-cyan-200 text-xs flex justify-around animate-pulse", children: [_jsx("span", { children: "\u2744\uFE0F" }), _jsx("span", { children: "\u2744\uFE0F" }), _jsx("span", { children: "\u2744\uFE0F" }), _jsx("span", { children: "\u2744\uFE0F" }), _jsx("span", { children: "\u2744\uFE0F" })] }), _jsx("div", { className: "absolute w-64 h-32 rounded-full border-4 border-dashed border-slate-600/70 opacity-60" }), _jsxs("div", { className: "relative z-10 flex flex-col items-center", children: [_jsx("div", { className: "text-6xl animate-bounce", style: { animationDuration: '3s' }, children: "\uD83D\uDC0B" }), _jsx("div", { className: "px-3 py-1 rounded-full bg-gradient-to-r from-cyan-950 via-fuchsia-950 to-cyan-950 border border-cyan-400 text-[10px] font-black text-cyan-300 uppercase tracking-widest shadow-md", children: "ALL HAIL THE WHALE" })] }), hasStickered && (_jsx("div", { className: "absolute bottom-3 right-6 px-2 py-1 rounded bg-emerald-600 text-white text-[9px] font-black shadow-md rotate-[-6deg]", children: "MILOSPORT SLC 1984" })), _jsxs("div", { className: "absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-cyan-500/80 text-[10px] text-cyan-300 font-bold", children: ["ROUNDABOUT LAPS: ", whaleLaps, " / 3"] })] }), _jsxs("div", { className: "bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-cyan-400 font-bold", children: [_jsx("span", { children: rider.iconEmoji }), _jsxs("span", { children: [rider.name, " at 9th & 9th:"] })] }), _jsxs("p", { className: "text-slate-300 italic pl-5", children: ["\"", getProWhaleQuote(), "\""] })] }), blessingGranted && (_jsxs("div", { className: "bg-cyan-950/70 border-2 border-cyan-400 p-3 rounded-2xl text-center space-y-1 animate-fadeIn", children: [_jsxs("div", { className: "text-cyan-300 font-black text-xs uppercase flex items-center justify-center gap-2", children: [_jsx(Sparkles, { className: "w-4 h-4 text-cyan-300 animate-spin" }), _jsx("span", { children: "THE 9TH & 9TH WHALE HEARD YOUR HORN! \uD83D\uDC0B\u26A1" })] }), _jsx("p", { className: "text-[11px] text-slate-200", children: "The Pacific storm track has locked onto Big Cottonwood! +25% Powder Float & Trick Magnetism unlocked!" })] })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs", children: [_jsxs("button", { onClick: handleCircleRoundabout, className: "p-3 rounded-2xl bg-cyan-950/60 border border-cyan-600/60 hover:border-cyan-400 text-left transition-all hover:bg-cyan-900/60 cursor-pointer flex flex-col justify-between gap-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-bold text-cyan-200 flex items-center gap-1.5", children: [_jsx(RotateCw, { className: "w-3.5 h-3.5 text-cyan-400" }), _jsx("span", { children: "Circle Roundabout" })] }), _jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300 font-bold", children: "HONK HORN" })] }), _jsxs("p", { className: "text-[10px] text-slate-300 leading-snug", children: ["Drive in a circle around the whale and honk the horn (", whaleLaps, "/3 complete)!"] })] }), _jsxs("button", { onClick: handleOfferPrayer, disabled: hasPrayed, className: `p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${hasPrayed
                                ? 'bg-emerald-950/50 border-emerald-600 text-emerald-300 opacity-80'
                                : 'bg-amber-950/60 border-amber-600/60 hover:border-amber-400 text-amber-200 hover:bg-amber-900/60'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-bold text-white flex items-center gap-1.5", children: [_jsx(Flame, { className: "w-3.5 h-3.5 text-amber-400" }), _jsx("span", { children: "Offer Snow Prayer" })] }), _jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-300 font-bold", children: hasPrayed ? 'BLESSED' : '+150 PTS' })] }), _jsx("p", { className: "text-[10px] text-slate-300 leading-snug", children: hasPrayed
                                        ? 'Your prayer has been accepted by The Whale!'
                                        : 'Place a prayer at the whale base for bottomless cold smoke.' })] }), _jsxs("button", { onClick: handleSlapSticker, disabled: hasStickered, className: `p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${hasStickered
                                ? 'bg-emerald-950/50 border-emerald-600 text-emerald-300 opacity-80'
                                : 'bg-slate-800/80 border-slate-700 hover:border-emerald-400 text-slate-300 hover:bg-slate-800'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-bold text-white flex items-center gap-1.5", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { children: "Slap Milo Sticker" })] }), _jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold", children: hasStickered ? 'STICKERED' : '+50 PTS' })] }), _jsx("p", { className: "text-[10px] text-slate-300 leading-snug", children: hasStickered
                                        ? 'Iconic Milo crest slapped on the curb!'
                                        : 'Leave a green 1984 Milosport shop sticker on the stone base.' })] })] }), _jsxs("button", { onClick: handleDepartRoundabout, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01] transition-all", children: [_jsx("span", { children: "RECEIVE WHALE BLESSING & SPEED TOWARDS BRIGHTON! \uD83D\uDC0B\u2744\uFE0F" }), _jsx(ArrowRight, { className: "w-4 h-4 stroke-[3]" })] })] }) }));
};
