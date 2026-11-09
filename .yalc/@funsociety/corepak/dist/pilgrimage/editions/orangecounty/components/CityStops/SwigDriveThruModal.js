import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { RIDERS_LIST } from '../../data/snowboardGear';
import { CanyonAudioEngine } from '../../utils/audioEngine';
import { Sparkles, Utensils, Zap, Flame, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
const TACO_STAND_MENU = [
    {
        id: 'al-pastor-taco',
        name: 'Al Pastor Tacos (Off the Spit)',
        tortilla: 'Handmade Corn Tortillas',
        fillings: 'Rotisserie Pork + Sweet Pineapple + Cilantro + Onion + Cilantro Sauce',
        bonusPrayers: 200,
        speedBuffText: '+25% Paddle & Wave Speed',
        color: '#ea580c',
        tag: 'HOUSE LEGEND 🍍'
    },
    {
        id: 'california-burrito',
        name: 'The California Surf Burrito',
        tortilla: 'Warm Flour Tortilla',
        fillings: 'Flame-Grilled Carne Asada + Crispy Fries + Guac + Cheese + Sour Cream',
        bonusPrayers: 225,
        speedBuffText: '+25% Air-Reverse & Barrel Stamina',
        color: '#0284c7',
        tag: 'SURFER FUEL 🌯'
    },
    {
        id: 'baja-fish-taco',
        name: 'Baja Beer-Battered Fish Tacos',
        tortilla: 'Fresh Pressed Corn Tortillas',
        fillings: 'Crispy Line-Caught Cod + Cabbage + Tomato + Chipotle Crema',
        bonusPrayers: 175,
        speedBuffText: '+20% Tube Glide & Float',
        color: '#0d9488',
        tag: 'LAGUNA CLASSIC 🐟'
    },
    {
        id: 'sonora-carne-asada',
        name: 'Sonora Ribeye Steak Taco',
        tortilla: 'Handmade Flour Tortilla + Melted Cheese Crust',
        fillings: '100% Angus Carne Asada + Pinto Beans + Guacamole + Habanero Salsa',
        bonusPrayers: 190,
        speedBuffText: '+20% Power Carve Torque',
        color: '#be123c',
        tag: 'PRO FAVORITE 🔥'
    }
];
export const SwigDriveThruModal = ({ carState, onFinishSwig, onClose }) => {
    const rider = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0];
    const [selectedItemId, setSelectedItemId] = useState('al-pastor-taco');
    const [includeChurrosHorchata, setIncludeChurrosHorchata] = useState(true);
    const [ordered, setOrdered] = useState(false);
    const selectedItem = TACO_STAND_MENU.find(d => d.id === selectedItemId) || TACO_STAND_MENU[0];
    const getProTacoComment = () => {
        switch (rider.id) {
            case 'jp-walker':
                return "Get me three Al Pastor tacos straight off the vertical trompo spit and extra habanero mango salsa! Best pre-Trestles meal on Pacific Coast Highway!";
            case 'peter-line':
                return "The handmade corn tortillas pressed right in the window at Laguna Taco Stand are unbeatable. Grab a California Burrito for after our heat!";
            case 'scott-stevens':
                return "I live two blocks from 699 S Coast Hwy! Baja fish taco, Al Pastor, and cinnamon churros dipped in condensed milk—mandatory Laguna Beach ritual!";
            case 'chris-grenier':
                return "Carbs and protein before hitting the 1000 Steps shorebreak! Don't forget an ice-cold Mexican Coke and fresh guac!";
            case 'jeremy-jones':
                return "Carne Asada California Burrito with extra fries inside! That's 2,000 calories of pure San Clemente air-reverse fuel!";
            case 'shaun-white':
                return "Al Pastor with grilled pineapple and cilantro crema! Let's eat on the tailgate and race down to Lower Trestles!";
            case 'milo-shop-groms':
                return "DUDE! Hit the salsa bar and fill six little cups with the black habanero salsa and cilantro sauce!";
            default:
                return "Right next door to Surf & Paddle in Laguna Beach—nobody drives down PCH without stopping at The Taco Stand!";
        }
    };
    const handleOrderTacos = () => {
        CanyonAudioEngine.get().playSodaSlurp();
        setOrdered(true);
        try {
            confetti({
                particleCount: 55,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#f97316', '#06b6d4', '#10b981', '#fde047']
            });
        }
        catch {
            // Fallback
        }
    };
    const handleDepartTacoStand = () => {
        const totalBonus = selectedItem.bonusPrayers + (includeChurrosHorchata ? 60 : 0);
        onFinishSwig(selectedItem.name, totalBonus);
    };
    return (_jsx("div", { className: "absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-mono select-none animate-fadeIn", children: _jsxs("div", { className: "relative max-w-xl w-full bg-slate-900 border-4 border-amber-500/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between border-b-2 border-slate-800 pb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-300 flex items-center justify-center text-white font-black text-2xl shadow-glow-gold", children: "\uD83C\uDF2E" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-base sm:text-lg font-black text-white uppercase tracking-wider", children: "THE TACO STAND \u2022 LAGUNA BEACH" }), _jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] bg-amber-950 border border-amber-500 text-amber-300 font-bold", children: "699 S COAST HWY" })] }), _jsx("span", { className: "text-[11px] text-slate-400", children: "Next to Surf & Paddle \u2022 Handmade Tortillas, Al Pastor Trompo & Salsa Bar" })] })] }), _jsx("button", { onClick: onClose, className: "text-xs text-slate-500 hover:text-slate-300 cursor-pointer", children: "\u00D7 Skip Stop" })] }), ordered ? (_jsxs("div", { className: "bg-amber-950/40 border-2 border-amber-500 p-5 rounded-2xl space-y-4 animate-fadeIn text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 text-amber-400 font-black text-sm uppercase", children: [_jsx(Sparkles, { className: "w-5 h-5 text-amber-400 animate-spin" }), _jsx("span", { children: "ORDER UP AT THE COUNTER! SALSA BAR LOADED! \uD83C\uDF2E\uD83D\uDD25" })] }), _jsxs("div", { className: "space-y-1 text-slate-200 text-xs", children: [_jsxs("p", { className: "font-bold text-sm text-white", children: ["Fresh off the grill: ", selectedItem.name] }), includeChurrosHorchata && (_jsx("p", { className: "text-amber-300", children: "+ Warm Cinnamon Churros, Condensed Milk Dip & 32oz Iced Horchata!" })), _jsxs("p", { className: "text-emerald-400 font-mono text-xs pt-1", children: ["\u26A1 SURF BUFF APPLIED: ", selectedItem.speedBuffText, "!"] })] }), _jsxs("div", { className: "p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-bold", children: ["+", selectedItem.bonusPrayers + (includeChurrosHorchata ? 60 : 0), " Ocean Prayers Earned!"] }), _jsxs("button", { onClick: handleDepartTacoStand, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-gold cursor-pointer transform hover:scale-[1.01] transition-all", children: [_jsx("span", { children: "CRUISE PCH PAST 1000 STEPS & MONTAGE TO TRESTLES!" }), _jsx(ArrowRight, { className: "w-4 h-4 stroke-[3]" })] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-amber-400 font-bold", children: [_jsx("span", { children: rider.iconEmoji }), _jsxs("span", { children: [rider.name, " in The Taco Stand Line:"] })] }), _jsxs("p", { className: "text-slate-300 italic pl-5", children: ["\u201C", getProTacoComment(), "\u201D"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-[11px] text-slate-400 uppercase tracking-wider block", children: "Order from the Laguna Beach Taco Stand Menu:" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs", children: TACO_STAND_MENU.map(item => (_jsxs("button", { onClick: () => setSelectedItemId(item.id), className: `p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${selectedItemId === item.id
                                            ? 'bg-amber-950/80 border-amber-400 shadow-md ring-1 ring-amber-400'
                                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 text-slate-300'}`, children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between gap-1", children: [_jsxs("span", { className: "font-bold text-white flex items-center gap-1.5", children: [_jsx(Utensils, { className: "w-3.5 h-3.5 text-amber-400 shrink-0" }), _jsx("span", { children: item.name })] }), _jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 font-bold shrink-0", children: item.tag })] }), _jsxs("p", { className: "text-[10px] text-slate-400 mt-1", children: [item.tortilla, " \u2022 ", item.fillings] })] }), _jsxs("div", { className: "flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-800/60", children: [_jsxs("span", { className: "text-emerald-400 flex items-center gap-1", children: [_jsx(Zap, { className: "w-3 h-3" }), _jsx("span", { children: item.speedBuffText })] }), _jsxs("span", { className: "text-amber-400 font-bold", children: ["+", item.bonusPrayers, " Pts"] })] })] }, item.id))) })] }), _jsxs("label", { className: "flex items-center justify-between p-3 rounded-2xl bg-amber-950/40 border border-amber-700/60 cursor-pointer hover:bg-amber-950/60 transition-all", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(Flame, { className: "w-5 h-5 text-amber-400" }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-amber-200 block", children: "Add Fresh Cinnamon Churros + Iced Horchata & Habanero Salsa" }), _jsx("span", { className: "text-[10px] text-slate-400", children: "Dipped in sweet condensed milk + full salsa bar tray (+60 Ocean Prayers)" })] })] }), _jsx("input", { type: "checkbox", checked: includeChurrosHorchata, onChange: (e) => setIncludeChurrosHorchata(e.target.checked), className: "w-4 h-4 text-amber-500 rounded cursor-pointer" })] }), _jsxs("button", { onClick: handleOrderTacos, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-gold cursor-pointer transform hover:scale-[1.01] transition-all", children: [_jsx(Utensils, { className: "w-4 h-4" }), _jsx("span", { children: "ORDER AT THE TACO STAND & HIT THE SALSA BAR! \uD83C\uDF2E\uD83E\uDD51" })] })] }))] }) }));
};
