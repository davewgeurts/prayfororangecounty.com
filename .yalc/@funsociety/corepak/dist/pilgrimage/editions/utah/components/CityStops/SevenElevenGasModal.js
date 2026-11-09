import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { RIDERS_LIST } from '../../data/snowboardGear';
import { CanyonAudioEngine } from '../../utils/audioEngine';
import { Fuel, Sparkles, Siren, ShoppingBag, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
const FUEL_GRADES = [
    {
        octane: '85',
        name: 'Utah Mountain Regular',
        pricePerGal: 3.49,
        description: 'Classic high-altitude 4,500ft+ thin air formula',
        color: '#10b981'
    },
    {
        octane: '87',
        name: 'Wasatch Plus',
        pricePerGal: 3.79,
        description: 'Balanced torque for snowstorms and canyon grades',
        color: '#06b6d4'
    },
    {
        octane: '91',
        name: 'Canyon Rocket Premium',
        pricePerGal: 4.19,
        description: 'Ethanol-free power booster for pulling the S-Curves',
        color: '#f59e0b'
    }
];
const SNACK_OPTIONS = [
    {
        id: 'taquito',
        name: 'Jalapeño Cream Cheese Taquito',
        category: 'Roller Grill',
        bonusPrayers: 75,
        description: 'Hot and crispy from the legendary roller grill',
        emoji: '🌯'
    },
    {
        id: 'double-gulp',
        name: '64oz Double Gulp Mtn Dew',
        category: 'Fountain Drink',
        bonusPrayers: 100,
        description: 'The ultimate Utah canyon hydration jug',
        emoji: '🥤'
    },
    {
        id: 'big-bite',
        name: 'Big Bite 1/4 lb Hot Dog',
        category: 'Roller Grill',
        bonusPrayers: 60,
        description: 'Loaded with yellow mustard and jalapeños',
        emoji: '🌭'
    },
    {
        id: 'red-bull',
        name: 'Ice-Cold Utah Red Bull',
        category: 'Energy Drinks',
        bonusPrayers: 80,
        description: 'Wings for sending canyon roadside kickers',
        emoji: '⚡'
    }
];
export const SevenElevenGasModal = ({ carState, onPayAndCruise, onGasAndDash, onClose }) => {
    const rider = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0];
    const [selectedGrade, setSelectedGrade] = useState(FUEL_GRADES[0]);
    const [gallons, setGallons] = useState(3.5);
    const [isPumping, setIsPumping] = useState(false);
    const [selectedSnack, setSelectedSnack] = useState(null);
    const [exactDollarHit, setExactDollarHit] = useState(false);
    const pumpingIntervalRef = useRef(null);
    const maxGallons = 14.0;
    const totalPrice = gallons * selectedGrade.pricePerGal;
    const fuelPercent = Math.min(100, Math.round((gallons / maxGallons) * 100));
    const startPumping = () => {
        if (gallons >= maxGallons)
            return;
        setIsPumping(true);
    };
    const stopPumping = () => {
        setIsPumping(false);
        if (pumpingIntervalRef.current) {
            window.clearInterval(pumpingIntervalRef.current);
            pumpingIntervalRef.current = null;
        }
        // Check if stopped on exact dollar (cents === 0)
        const cents = Math.round((gallons * selectedGrade.pricePerGal * 100) % 100);
        if (cents === 0 && gallons > 4.0) {
            setExactDollarHit(true);
            try {
                confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { y: 0.7 },
                    colors: ['#10b981', '#34d399', '#ffffff']
                });
            }
            catch {
                // Fallback
            }
        }
    };
    useEffect(() => {
        if (isPumping) {
            pumpingIntervalRef.current = window.setInterval(() => {
                setGallons(prev => {
                    if (prev >= maxGallons) {
                        setIsPumping(false);
                        return maxGallons;
                    }
                    CanyonAudioEngine.get().playGasPumpClick();
                    return +(prev + 0.12).toFixed(2);
                });
            }, 75);
        }
        else {
            if (pumpingIntervalRef.current) {
                window.clearInterval(pumpingIntervalRef.current);
                pumpingIntervalRef.current = null;
            }
        }
        return () => {
            if (pumpingIntervalRef.current) {
                window.clearInterval(pumpingIntervalRef.current);
            }
        };
    }, [isPumping, maxGallons]);
    const handleFillTankFull = () => {
        setGallons(maxGallons);
        CanyonAudioEngine.get().playGasPumpClick();
    };
    const handlePay = () => {
        CanyonAudioEngine.get().playCashRegister();
        let prayerBonus = 150;
        if (exactDollarHit)
            prayerBonus += 100;
        if (fuelPercent === 100)
            prayerBonus += 75;
        if (selectedSnack)
            prayerBonus += selectedSnack.bonusPrayers;
        try {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#10b981', '#38bdf8', '#fbbf24']
            });
        }
        catch {
            // Fallback
        }
        onPayAndCruise(fuelPercent, selectedGrade.octane, gallons, selectedSnack?.name, prayerBonus);
    };
    const handleDash = () => {
        CanyonAudioEngine.get().playTireScreech();
        setTimeout(() => {
            CanyonAudioEngine.get().playPoliceSiren();
        }, 400);
        onGasAndDash(fuelPercent, gallons, selectedSnack?.name);
    };
    const getProPassengerQuote = () => {
        switch (rider.id) {
            case 'jp-walker':
                return "Pump 4 at the Fort Union 7-11 is legendary! Grab two jalapeño taquitos from the roller grill while the tank fills. Make sure we're topped off before the S-Curves!";
            case 'chris-grenier':
                return "YOOOO! Fort Union 7-Eleven! We grab snacks here before every Brighton dawn patrol on The Bomb Hole! Look at that roller grill glistening!";
            case 'peter-line':
                return "85 octane is genuine Utah heritage. Lower air pressure means less octane needed! But whatever you do, don't get boxed in by UHP at the park-and-ride!";
            case 'jeremy-jones':
                return "Always keep a full tank in the Wasatch. If UDOT closes the canyon for avalanche artillery control, you might be idling on SR-190 for hours.";
            default:
                return "Fill up the tank and grab some road snacks! We've got 14 miles of snowy mountain switchbacks ahead of us.";
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto", children: _jsxs("div", { className: "relative max-w-2xl w-full bg-slate-900 border-2 border-emerald-500/70 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 my-auto", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-800 pb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-orange-500 to-red-600 p-0.5 shadow-lg flex items-center justify-center", children: _jsxs("div", { className: "w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center font-black", children: [_jsx("span", { className: "text-orange-400 text-sm leading-none font-sans", children: "7" }), _jsx("span", { className: "text-emerald-400 text-[10px] leading-none font-mono", children: "11" })] }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700", children: "FORT UNION & WASATCH BLVD" }), _jsx("span", { className: "text-xs text-slate-400 font-mono hidden sm:inline", children: "PUMP #4" })] }), _jsx("h2", { className: "text-lg sm:text-xl font-black text-white uppercase tracking-wide", children: "7-Eleven Canyon Fuel & Snacks" })] })] }), _jsx("button", { onClick: onClose, className: "text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer", children: "\u00D7 Skip Stop" })] }), _jsxs("div", { className: "bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-3", children: [_jsx("span", { className: "text-2xl mt-0.5", children: "\u26FD" }), _jsxs("div", { className: "text-xs font-mono", children: [_jsx("span", { className: "text-emerald-400 font-bold", children: rider.name }), _jsx("span", { className: "text-slate-500", children: " on the 7-Eleven lot:" }), _jsxs("p", { className: "text-slate-200 italic mt-0.5", children: ["\u201C", getProPassengerQuote(), "\u201D"] })] })] }), _jsxs("div", { className: "bg-emerald-950/30 border-2 border-emerald-600/80 rounded-2xl p-4 sm:p-5 shadow-inner", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-mono text-emerald-400 mb-2", children: [_jsxs("span", { className: "flex items-center gap-1.5 font-bold", children: [_jsx(Fuel, { className: "w-4 h-4 text-emerald-400" }), "WAYNE VINTAGE DISPENSER \u2022 PUMP 04"] }), _jsx("span", { className: "text-slate-400", children: "UNLEADED GASOLINE" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2.5 sm:gap-4 my-3", children: [_jsxs("div", { className: "bg-black/90 border border-emerald-500/50 rounded-xl p-2.5 sm:p-3 text-center", children: [_jsx("span", { className: "block text-[10px] font-mono text-slate-400 uppercase", children: "Total Sale $" }), _jsxs("span", { className: "text-xl sm:text-2xl font-black font-mono text-emerald-400 tracking-wider", children: ["$", totalPrice.toFixed(2)] })] }), _jsxs("div", { className: "bg-black/90 border border-emerald-500/50 rounded-xl p-2.5 sm:p-3 text-center", children: [_jsx("span", { className: "block text-[10px] font-mono text-slate-400 uppercase", children: "Gallons" }), _jsx("span", { className: "text-xl sm:text-2xl font-black font-mono text-cyan-400 tracking-wider", children: gallons.toFixed(2) })] }), _jsxs("div", { className: "bg-black/90 border border-emerald-500/50 rounded-xl p-2.5 sm:p-3 text-center", children: [_jsx("span", { className: "block text-[10px] font-mono text-slate-400 uppercase", children: "Price / Gal" }), _jsxs("span", { className: "text-xl sm:text-2xl font-black font-mono text-amber-400 tracking-wider", children: ["$", selectedGrade.pricePerGal.toFixed(2)] })] })] }), _jsxs("div", { className: "space-y-1 mt-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-mono", children: [_jsx("span", { className: "text-slate-300", children: "Vehicle Fuel Level:" }), _jsxs("span", { className: `font-bold ${fuelPercent >= 90 ? 'text-emerald-400' : 'text-amber-400'}`, children: [fuelPercent, "% ", fuelPercent === 100 && '(FULL TANK)'] })] }), _jsx("div", { className: "w-full h-3 bg-slate-950 rounded-full border border-slate-700 overflow-hidden", children: _jsx("div", { className: `h-full transition-all duration-150 ${fuelPercent >= 80 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-amber-500'}`, style: { width: `${fuelPercent}%` } }) })] }), exactDollarHit && (_jsxs("div", { className: "mt-2.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-400 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-bounce", children: [_jsx(Sparkles, { className: "w-4 h-4 text-emerald-300" }), _jsx("span", { children: "EAGLE EYE PUMP MASTER! Stopped on an exact dollar amount (+100 Prayers)!" })] })), _jsxs("div", { className: "mt-4", children: [_jsx("span", { className: "block text-xs font-mono text-slate-400 mb-2 font-bold uppercase", children: "Select Octane Grade:" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: FUEL_GRADES.map(grade => {
                                        const isSelected = grade.octane === selectedGrade.octane;
                                        return (_jsxs("button", { onClick: () => setSelectedGrade(grade), className: `p-2.5 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                                                ? 'bg-slate-800 border-emerald-400 shadow-md ring-1 ring-emerald-400'
                                                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-400'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm font-black font-mono", style: { color: grade.color }, children: [grade.octane, " OCTANE"] }), _jsxs("span", { className: "text-xs font-mono text-slate-300 font-bold", children: ["$", grade.pricePerGal.toFixed(2)] })] }), _jsx("span", { className: "block text-[11px] text-slate-200 font-bold mt-0.5", children: grade.name }), _jsx("span", { className: "block text-[10px] text-slate-400 leading-tight mt-0.5", children: grade.description })] }, grade.octane));
                                    }) })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-emerald-900/50", children: [_jsxs("button", { onMouseDown: startPumping, onMouseUp: stopPumping, onMouseLeave: stopPumping, onTouchStart: startPumping, onTouchEnd: stopPumping, className: `flex-1 py-3 px-4 rounded-xl font-black font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg select-none transition-all ${isPumping
                                        ? 'bg-emerald-400 text-slate-950 scale-[0.98] ring-4 ring-emerald-500/40'
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'}`, children: [_jsx(Fuel, { className: `w-4 h-4 ${isPumping ? 'animate-spin' : ''}` }), _jsx("span", { children: isPumping ? 'PUMPING FUEL (REACH TARGET)...' : 'HOLD NOZZLE TO PUMP FUEL' })] }), _jsx("button", { onClick: handleFillTankFull, className: "py-3 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer", title: "Instantly fill tank to 100% capacity", children: "FILL TO FULL (14 GAL)" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("span", { className: "text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5", children: [_jsx(ShoppingBag, { className: "w-3.5 h-3.5 text-orange-400" }), "ADD ROAD SNACKS FROM THE ROLLER GRILL & COOLER:"] }), selectedSnack && (_jsxs("span", { className: "text-xs font-mono text-emerald-400 font-bold", children: ["Selected: ", selectedSnack.name, " (+", selectedSnack.bonusPrayers, " Pts)"] }))] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: SNACK_OPTIONS.map(snack => {
                                const isSelected = selectedSnack?.id === snack.id;
                                return (_jsxs("button", { onClick: () => setSelectedSnack(isSelected ? null : snack), className: `p-2.5 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                                        ? 'bg-orange-950/60 border-orange-400 ring-1 ring-orange-400'
                                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-lg", children: snack.emoji }), _jsxs("span", { className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold", children: ["+", snack.bonusPrayers] })] }), _jsx("span", { className: "block text-xs font-bold text-white truncate", children: snack.name }), _jsx("span", { className: "block text-[10px] text-slate-400 truncate", children: snack.category })] }, snack.id));
                            }) })] }), _jsxs("div", { className: "pt-2 border-t border-slate-800 space-y-3", children: [_jsx("div", { className: "text-center text-xs font-mono text-slate-400", children: "Pumping complete! Choose how you leave the 7-Eleven lot:" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("button", { onClick: handlePay, className: "py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all", children: [_jsx(CreditCard, { className: "w-4 h-4 stroke-[2.5]" }), _jsxs("div", { className: "text-left", children: [_jsxs("div", { children: ["PAY $", totalPrice.toFixed(2), " & CRUISE PEACEFULLY"] }), _jsx("div", { className: "text-[10px] opacity-80 lowercase font-normal", children: "receipt printed \u2022 full tank buff \u2022 no cops" })] })] }), _jsxs("button", { onClick: handleDash, className: "py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-rose-500 text-white font-black font-mono text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-glow-amber cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse", children: [_jsx(Siren, { className: "w-4 h-4" }), _jsxs("div", { className: "text-left", children: [_jsx("div", { children: "GAS & DASH! PEEL OUT! \uD83D\uDEA8" }), _jsx("div", { className: "text-[10px] text-red-200 lowercase font-normal", children: "don't pay \u2022 cops chase you up canyon" })] })] })] })] })] }) }));
};
