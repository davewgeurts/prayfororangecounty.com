import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { RIDERS_LIST } from '../../data/snowboardGear';
import { CanyonAudioEngine } from '../../utils/audioEngine';
import { Sparkles, CupSoda, Zap, Cookie, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
const SWIG_DRINKS = [
    {
        id: 'dirty-dr-pepper',
        name: 'The Dirty Dr Pepper',
        baseSoda: 'Dr Pepper',
        mixIns: 'Coconut Cream + Fresh Lime Wedge',
        bonusPrayers: 150,
        speedBuffText: '+15% Acceleration Boost',
        color: '#831843',
        tag: 'UTAH ORIGINAL'
    },
    {
        id: 'bcc-blast',
        name: 'The Big Cottonwood Blast',
        baseSoda: 'Mountain Dew',
        mixIns: 'Blue Curaçao Flavor + Passion Fruit + Pure Coconut',
        bonusPrayers: 200,
        speedBuffText: '+25% Hyper Speed Punch',
        color: '#0284c7',
        tag: 'STORM FUEL'
    },
    {
        id: 'blower-pow',
        name: 'Wasatch Blower Powder',
        baseSoda: 'Sprite',
        mixIns: 'Sweet Coconut Cream + French Vanilla Froth',
        bonusPrayers: 175,
        speedBuffText: '+20% Powder Float',
        color: '#0d9488',
        tag: 'LOCAL CORE'
    },
    {
        id: 'texas-tab',
        name: 'Texas Tab',
        baseSoda: 'Dr Pepper',
        mixIns: 'Vanilla + Coconut',
        bonusPrayers: 125,
        speedBuffText: '+10% Smooth Cruising',
        color: '#be123c',
        tag: 'FAN FAVORITE'
    }
];
export const SwigDriveThruModal = ({ carState, onFinishSwig, onClose }) => {
    const rider = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0];
    const [selectedDrinkId, setSelectedDrinkId] = useState('dirty-dr-pepper');
    const [includePinkCookie, setIncludePinkCookie] = useState(true);
    const [ordered, setOrdered] = useState(false);
    const selectedDrink = SWIG_DRINKS.find(d => d.id === selectedDrinkId) || SWIG_DRINKS[0];
    const getProSwigComment = () => {
        switch (rider.id) {
            case 'jp-walker':
                return "Get me a 44oz Dirty Dr Pepper with crushed pebble ice! You can't roll into Big Cottonwood without a Swig cup in the console cup holder.";
            case 'chris-grenier':
                return "YOOOO SWIG STOP! Double the coconut cream, baby! Grendies runs on dirty soda and Bomb Hole episodes!";
            case 'peter-line':
                return "Put extra coconut cream in mine. In '96 we'd grab dirty sodas right before filming rail lines down in the valley.";
            case 'scott-stevens':
                return "The famous pink sugar cookie gives +10 to board balance! Grab two of them, I'm eating one in the car right now!";
            case 'jeremy-jones':
                return "Pure Utah high-octane sugar. Drink up, we're gonna hike Great Western peak today!";
            case 'shaun-white':
                return "Dirty soda is a full-blown Utah phenomenon. Mountain Dew with blue curaçao? Count me in.";
            case 'danny-davis':
                return "Peace, good vibrations, and sweet lime fizz. A soulful beverage before mountain meditation.";
            case 'milo-groms':
                return "DUDE! Order me the Big Cottonwood Blast! I need all 44 ounces of caffeine for the jumps!";
            default:
                return "A 44oz Swig dirty soda with crushed ice is mandatory Utah mountain protocol.";
        }
    };
    const handleOrderDrink = () => {
        CanyonAudioEngine.get().playSodaSlurp();
        setOrdered(true);
        try {
            confetti({
                particleCount: 50,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#ec4899', '#f43f5e', '#38bdf8', '#ffffff']
            });
        }
        catch {
            // Fallback
        }
    };
    const handleDepartDriveThru = () => {
        const totalBonus = selectedDrink.bonusPrayers + (includePinkCookie ? 50 : 0);
        onFinishSwig(selectedDrink.name, totalBonus);
    };
    return (_jsx("div", { className: "absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-mono select-none animate-fadeIn", children: _jsxs("div", { className: "relative max-w-xl w-full bg-slate-900 border-4 border-rose-500/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between border-b-2 border-slate-800 pb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 border border-rose-300 flex items-center justify-center text-white font-black text-2xl shadow-glow-ice", children: "\uD83E\uDD64" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-base sm:text-lg font-black text-white uppercase tracking-wider", children: "SWIG \u2022 DIRTY SODA" }), _jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] bg-rose-950 border border-rose-600 text-rose-300 font-bold", children: "ORIGINAL DIRTY SODA" })] }), _jsx("span", { className: "text-[11px] text-slate-400", children: "3300 South Drive-Thru \u2022 Pebble Ice & Flavor Infusions" })] })] }), _jsx("button", { onClick: onClose, className: "text-xs text-slate-500 hover:text-slate-300 cursor-pointer", children: "\u00D7 Skip Stop" })] }), ordered ? (_jsxs("div", { className: "bg-rose-950/40 border-2 border-rose-500 p-5 rounded-2xl space-y-4 animate-fadeIn text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 text-rose-400 font-black text-sm uppercase", children: [_jsx(Sparkles, { className: "w-5 h-5 text-rose-400 animate-spin" }), _jsx("span", { children: "DRINK HANDED THROUGH DRIVE-THRU WINDOW! \uD83E\uDD64" })] }), _jsxs("div", { className: "space-y-1 text-slate-200 text-xs", children: [_jsxs("p", { className: "font-bold text-sm text-white", children: ["44oz ", selectedDrink.name, " with extra pebble ice!"] }), includePinkCookie && (_jsx("p", { className: "text-pink-300", children: "+ 1x Famous Warm Pink-Frosted Sugar Cookie in wax paper bag!" })), _jsxs("p", { className: "text-emerald-400 font-mono text-xs pt-1", children: ["\u26A1 BUFF APPLIED: ", selectedDrink.speedBuffText, "!"] })] }), _jsxs("div", { className: "p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold", children: ["+", selectedDrink.bonusPrayers + (includePinkCookie ? 50 : 0), " Wasatch Prayers Earned!"] }), _jsxs("button", { onClick: handleDepartDriveThru, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01] transition-all", children: [_jsx("span", { children: "PUT 44oz CUP IN CONSOLE & BLAST UP BIG COTTONWOOD!" }), _jsx(ArrowRight, { className: "w-4 h-4 stroke-[3]" })] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-rose-400 font-bold", children: [_jsx("span", { children: rider.iconEmoji }), _jsxs("span", { children: [rider.name, " at the Swig Speaker:"] })] }), _jsxs("p", { className: "text-slate-300 italic pl-5", children: ["\"", getProSwigComment(), "\""] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-[11px] text-slate-400 uppercase tracking-wider block", children: "Choose your signature 44oz Dirty Soda:" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs", children: SWIG_DRINKS.map(drink => (_jsxs("button", { onClick: () => setSelectedDrinkId(drink.id), className: `p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${selectedDrinkId === drink.id
                                            ? 'bg-rose-950/80 border-rose-500 shadow-md ring-1 ring-rose-400'
                                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 text-slate-300'}`, children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-bold text-white flex items-center gap-1.5", children: [_jsx(CupSoda, { className: "w-3.5 h-3.5 text-rose-400" }), _jsx("span", { children: drink.name })] }), _jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200 font-bold", children: drink.tag })] }), _jsxs("p", { className: "text-[10px] text-slate-400 mt-1", children: [drink.baseSoda, " + ", drink.mixIns] })] }), _jsxs("div", { className: "flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-800/60", children: [_jsxs("span", { className: "text-emerald-400 flex items-center gap-1", children: [_jsx(Zap, { className: "w-3 h-3" }), _jsx("span", { children: drink.speedBuffText })] }), _jsxs("span", { className: "text-amber-400 font-bold", children: ["+", drink.bonusPrayers, " Pts"] })] })] }, drink.id))) })] }), _jsxs("label", { className: "flex items-center justify-between p-3 rounded-2xl bg-pink-950/40 border border-pink-700/60 cursor-pointer hover:bg-pink-950/60 transition-all", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(Cookie, { className: "w-5 h-5 text-pink-400" }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-pink-200 block", children: "Famous Warm Pink-Frosted Sugar Cookie" }), _jsx("span", { className: "text-[10px] text-slate-400", children: "Signature cold almond pink buttercream frosting (+50 Prayers)" })] })] }), _jsx("input", { type: "checkbox", checked: includePinkCookie, onChange: (e) => setIncludePinkCookie(e.target.checked), className: "w-4 h-4 text-pink-500 rounded cursor-pointer" })] }), _jsxs("button", { onClick: handleOrderDrink, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-400 hover:to-red-400 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01] transition-all", children: [_jsx(CupSoda, { className: "w-4 h-4" }), _jsx("span", { children: "ORDER AT SPEAKER & SLURP UP! \uD83E\uDD64\uD83C\uDF6A" })] })] }))] }) }));
};
