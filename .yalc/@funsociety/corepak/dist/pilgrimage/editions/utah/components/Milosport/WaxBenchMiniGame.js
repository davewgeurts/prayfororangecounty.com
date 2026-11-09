import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { WAX_FORMULAS_LIST, SNOWBOARDS_LIST } from '../../data/snowboardGear';
import { RIDER_SHOP_PROFILES, WAX_ROOM_LINES } from '../../data/miloShopFloor';
import { Flame, Check, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MiloFigure } from './MiloFigure';
import { useLiveConditions, recommendedWaxId } from '../../utils/liveConditions';
const TREVOR = RIDER_SHOP_PROFILES.find(p => p.riderId === 'milo-wax-tech');
export const WaxBenchMiniGame = ({ selectedBoardId, onApplyWaxTune, onClose }) => {
    const board = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0];
    const [selectedFormula, setSelectedFormula] = useState(WAX_FORMULAS_LIST[0]);
    const [step, setStep] = useState('choose_wax');
    const [drops, setDrops] = useState([]);
    const [meltProgress, setMeltProgress] = useState(0);
    const [scrapeProgress, setScrapeProgress] = useState(0);
    const [brushProgress, setBrushProgress] = useState(0);
    const [finalScore, setFinalScore] = useState(100);
    const boardAreaRef = useRef(null);
    // Step 2: Drip wax on click
    const handleBoardClick = (e) => {
        if (step !== 'drip_wax')
            return;
        if (!boardAreaRef.current)
            return;
        const rect = boardAreaRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        const newDrops = [...drops, { x, y, melted: false, scraped: false }];
        setDrops(newDrops);
        if (newDrops.length >= 14) {
            setStep('iron_smooth');
        }
    };
    // Step 3: Melt with Iron
    const handleIronMove = (e) => {
        if (step !== 'iron_smooth')
            return;
        if (e.buttons !== 1)
            return; // only while mouse button is pressed
        setMeltProgress(p => {
            const next = Math.min(100, p + 1.8);
            if (next >= 100) {
                setStep('scrape_base');
            }
            return next;
        });
    };
    // Step 4: Scrape excess wax
    const handleScrapeMove = (e) => {
        if (step !== 'scrape_base')
            return;
        if (e.buttons !== 1)
            return;
        setScrapeProgress(p => {
            const next = Math.min(100, p + 2.2);
            if (next >= 100) {
                setStep('brush_polish');
            }
            return next;
        });
    };
    // Step 5: Horsehair brush polish
    const handleBrushMove = (e) => {
        if (step !== 'brush_polish')
            return;
        if (e.buttons !== 1)
            return;
        setBrushProgress(p => {
            const next = Math.min(100, p + 2.5);
            if (next >= 100) {
                finishTuning();
            }
            return next;
        });
    };
    const finishTuning = () => {
        setStep('complete');
        const score = Math.round(92 + Math.random() * 8);
        setFinalScore(score);
        try {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: [selectedFormula.hex, '#10b981', '#38bdf8', '#ffffff']
            });
        }
        catch {
            // fallback
        }
    };
    const handleSaveTune = () => {
        onApplyWaxTune(selectedFormula.id, selectedFormula.speedBonus, finalScore);
        onClose();
    };
    const handleReset = () => {
        setStep('choose_wax');
        setDrops([]);
        setMeltProgress(0);
        setScrapeProgress(0);
        setBrushProgress(0);
    };
    const live = useLiveConditions();
    const summitTemp = live?.snow?.summitTempF ?? null;
    const trevorPickId = recommendedWaxId(summitTemp);
    const trevorPick = WAX_FORMULAS_LIST.find(w => w.id === trevorPickId);
    const trevorLine = step === 'choose_wax' && trevorPick && summitTemp != null
        ? `It's ${Math.round(summitTemp)}°F up at the Brighton SNOTEL right now. Run the ${trevorPick.name}. Trust me.`
        : WAX_ROOM_LINES[step];
    const trevorPose = step === 'complete' ? 'flex'
        : step === 'iron_smooth' || step === 'brush_polish' ? 'point'
            : step === 'scrape_base' ? 'crossed'
                : undefined;
    return (_jsxs("div", { className: "relative border-2 border-amber-950 rounded-3xl shadow-2xl max-w-5xl mx-auto w-full select-none font-mono overflow-hidden", style: {
            background: 'radial-gradient(circle, rgba(0,0,0,0.35) 1.6px, transparent 2px) 0 0 / 18px 18px, linear-gradient(180deg, #a8896a, #7a5c3f 70%, #4a3220)'
        }, children: [_jsxs("div", { className: "relative h-20 sm:h-24 px-6 flex items-end gap-4 sm:gap-6 border-b-4 border-amber-950/70", "aria-hidden": "true", children: [_jsxs("div", { className: "w-14 h-9 rounded-t-xl rounded-b-sm bg-slate-700 border-2 border-slate-900 relative", children: [_jsx("span", { className: "absolute -top-3 left-3 w-8 h-3 rounded-t bg-slate-900" }), _jsx("span", { className: "absolute bottom-1 left-1 right-1 h-1.5 bg-orange-500/80 rounded" })] }), _jsx("div", { className: "w-10 h-7 bg-sky-300/70 border-2 border-sky-900 rounded-sm" }), _jsx("div", { className: "w-12 h-8 bg-amber-800 border-2 border-amber-950 rounded-sm [background-image:repeating-linear-gradient(90deg,#0000_0_3px,#00000055_3px_4px)]" }), _jsx("div", { className: "hidden sm:block w-16 h-10 bg-zinc-500 border-2 border-zinc-900 rounded-sm relative", children: _jsx("span", { className: "absolute -bottom-2 left-6 w-3 h-3 bg-zinc-800" }) }), _jsx("div", { className: "hidden sm:flex gap-1 mb-1", children: ['#a855f7', '#22c55e', '#f59e0b', '#38bdf8'].map(c => (_jsx("span", { className: "w-5 h-5 rounded-sm border-2 border-slate-900", style: { backgroundColor: c } }, c))) }), _jsx("div", { className: "ml-auto mb-2 px-3 py-1 rotate-[-3deg] bg-amber-50 border border-amber-300 text-[10px] font-black text-rose-700 shadow", children: "EMPLOYEES ONLY \u2022 (AND YOU, TODAY)" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_150px] gap-4 p-4 sm:p-6 bg-slate-950/80", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6", children: [_jsxs("div", { children: [_jsx("div", { className: "milo-1080-banner px-4 py-1", children: _jsx("span", { className: "milo-1080-title text-lg sm:text-xl", children: "Milo Wax Room" }) }), _jsxs("p", { className: "text-xs text-slate-400 mt-2", children: ["Back of the shop, on Trevor\u2019s bench. Hand-tune your ", _jsx("strong", { className: "text-sky-300", children: board.name }), " before the canyon."] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("button", { onClick: handleReset, className: "px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer", children: [_jsx(RotateCcw, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Reset Bench" })] }) })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 text-[10px] uppercase font-bold", children: [
                                    { id: 'choose_wax', label: '1. Wax Formula' },
                                    { id: 'drip_wax', label: '2. Iron Drip' },
                                    { id: 'iron_smooth', label: '3. Heat Spread' },
                                    { id: 'scrape_base', label: '4. Scraping' },
                                    { id: 'brush_polish', label: '5. Nylon Polish' }
                                ].map(s => {
                                    const isActive = step === s.id;
                                    return (_jsx("div", { className: `p-2 rounded-xl text-center border transition-all ${isActive
                                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                                            : 'bg-slate-950/60 border-slate-800 text-slate-500'}`, children: s.label }, s.id));
                                }) }), step === 'choose_wax' && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-bold text-white uppercase", children: "Select Today's Wasatch Wax Temp:" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: WAX_FORMULAS_LIST.map(f => {
                                            const isSelected = selectedFormula.id === f.id;
                                            return (_jsxs("div", { onClick: () => setSelectedFormula(f), className: `p-4 rounded-2xl border transition-all cursor-pointer bg-slate-950/80 ${isSelected
                                                    ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-glow-ice'
                                                    : 'border-slate-800 hover:border-slate-700'}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold uppercase", style: { backgroundColor: `${f.hex}30`, color: f.hex }, children: f.tempRange }), _jsxs("span", { className: "text-[10px] text-emerald-400 font-bold", children: [f.id === trevorPickId && _jsx("span", { className: "mr-1.5 px-1.5 py-px rounded-sm bg-sky-400 text-slate-950 not-italic", children: "TREVOR'S PICK" }), "+", Math.round((f.speedBonus - 1) * 100), "% GLIDE"] })] }), _jsx("h4", { className: "text-base font-bold text-white mb-1", children: f.name }), _jsx("p", { className: "text-xs text-slate-400 mb-3", children: f.description }), _jsx("button", { onClick: () => {
                                                            setSelectedFormula(f);
                                                            setStep('drip_wax');
                                                        }, className: `w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected
                                                            ? 'bg-amber-500 text-slate-950'
                                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`, children: "HEAT UP IRON WITH THIS WAX \u2192" })] }, f.id));
                                        }) })] })), step !== 'choose_wax' && step !== 'complete' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-amber-950/30 border border-amber-500/50 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Flame, { className: "w-4 h-4 text-amber-400 shrink-0" }), _jsxs("span", { children: [step === 'drip_wax' && `CLICK ON THE BASE TO DRIP MOLTEN WAX (${drops.length}/14 drops)`, step === 'iron_smooth' && `CLICK & DRAG IRON TO SPREAD WAX EVENLY (${Math.round(meltProgress)}%)`, step === 'scrape_base' && `CLICK & DRAG ACRYLIC SCRAPER NOSE-TO-TAIL (${Math.round(scrapeProgress)}%)`, step === 'brush_polish' && `CLICK & SCRUB NYLON BRUSH FOR STRUCTURE (${Math.round(brushProgress)}%)`] })] }), _jsx("button", { onClick: finishTuning, className: "text-[10px] text-slate-400 hover:text-white underline cursor-pointer", children: "Skip to Complete \u2192" })] }), _jsxs("div", { ref: boardAreaRef, onClick: handleBoardClick, onPointerMove: (e) => {
                                            if (step === 'iron_smooth')
                                                handleIronMove(e);
                                            if (step === 'scrape_base')
                                                handleScrapeMove(e);
                                            if (step === 'brush_polish')
                                                handleBrushMove(e);
                                        }, className: "relative w-full h-44 sm:h-52 border-2 border-amber-950 rounded-xl overflow-hidden cursor-crosshair touch-none flex items-center justify-center p-4 shadow-inner", style: {
                                            background: 'repeating-linear-gradient(0deg, #00000014 0 2px, transparent 2px 9px), linear-gradient(180deg, #b07a45, #8a5a2e)'
                                        }, children: [_jsx("div", { className: "absolute left-1 top-1/2 -translate-y-1/2 w-5 h-16 bg-zinc-600 border-2 border-zinc-900 rounded-sm z-10" }), _jsx("div", { className: "absolute right-1 top-1/2 -translate-y-1/2 w-5 h-16 bg-zinc-600 border-2 border-zinc-900 rounded-sm z-10" }), _jsxs("div", { className: "relative w-11/12 h-3/5 rounded-full border-2 border-slate-600 transition-all flex items-center justify-between px-6 overflow-hidden shadow-2xl", style: {
                                                    backgroundColor: board.baseGraphicColor,
                                                    filter: brushProgress > 50 ? 'brightness(1.2)' : 'none'
                                                }, children: [_jsx("span", { className: "font-black text-2xl tracking-widest text-white/20 select-none uppercase mx-auto", children: board.name }), meltProgress > 0 && (_jsx("div", { className: "absolute inset-0 transition-all pointer-events-none", style: {
                                                            backgroundColor: selectedFormula.hex,
                                                            opacity: (meltProgress / 100) * 0.45
                                                        } })), scrapeProgress > 0 && (_jsx("div", { className: "absolute inset-0 bg-white/10 transition-all pointer-events-none", style: {
                                                            opacity: scrapeProgress / 100
                                                        } })), drops.map((d, i) => (_jsx("div", { className: "absolute w-3.5 h-3.5 rounded-full border border-white/60 shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300", style: {
                                                            left: `${d.x}%`,
                                                            top: `${d.y}%`,
                                                            backgroundColor: selectedFormula.hex,
                                                            transform: meltProgress > 40 ? 'scale(2.5)' : 'scale(1)',
                                                            opacity: scrapeProgress > 60 ? 0 : 1
                                                        } }, i)))] }), _jsxs("div", { className: "absolute bottom-2 text-[10px] text-amber-950/80 font-mono font-bold", children: ["Bench: Grip clamp locked \u2022 Base temp: 130\u00B0C \u2022 Formula: ", selectedFormula.name] })] })] })), step === 'complete' && (_jsxs("div", { className: "bg-slate-950 p-6 rounded-3xl border border-emerald-500/50 space-y-5 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center text-emerald-300 shadow-glow-ice", children: _jsx(Trophy, { className: "w-8 h-8" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-white uppercase tracking-wider", children: "HOT WAX RACE TUNE APPLIED!" }), _jsxs("div", { className: "text-sm text-emerald-400 font-bold mt-1", children: [finalScore, "% GLIDE SCORE \u2022 MILOSPORT SHOP APPROVED"] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-xs font-mono", children: [_jsxs("div", { className: "p-3 bg-slate-900 rounded-xl border border-slate-800", children: [_jsx("span", { className: "text-slate-400 block text-[10px]", children: "BASE GLIDE" }), _jsxs("strong", { className: "text-emerald-400 text-sm", children: ["+", Math.round((selectedFormula.speedBonus - 1) * 100), "% FASTER"] })] }), _jsxs("div", { className: "p-3 bg-slate-900 rounded-xl border border-slate-800", children: [_jsx("span", { className: "text-slate-400 block text-[10px]", children: "COLD FRICTION" }), _jsx("strong", { className: "text-cyan-400 text-sm", children: "ZERO SUCTION" })] }), _jsxs("div", { className: "p-3 bg-slate-900 rounded-xl border border-slate-800", children: [_jsx("span", { className: "text-slate-400 block text-[10px]", children: "CANYON TOP SPEED" }), _jsx("strong", { className: "text-amber-400 text-sm", children: "+10 MPH BUFF" })] })] }), _jsxs("div", { className: "p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl max-w-lg mx-auto text-xs text-emerald-200 italic", children: ["\"Bro, look at that mirror shine on the base. You're gonna haul down Crest and leave everyone in the dust!\"", _jsx("div", { className: "text-[10px] text-emerald-400 font-bold not-italic mt-1", children: "\u2014 Trevor, Milosport Head Tuning Tech" })] }), _jsxs("button", { onClick: handleSaveTune, className: "px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wider uppercase inline-flex items-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.02] transition-all", children: [_jsx(Check, { className: "w-4 h-4 stroke-[3]" }), _jsx("span", { children: "MOUNT FRESHLY WAXED BOARD & RETURN TO SHOP" })] })] }))] }), TREVOR && (_jsxs("div", { className: "order-first md:order-none flex md:flex-col items-end md:items-center justify-end gap-3", children: [_jsx("div", { className: "relative md:mt-10 flex-1 md:flex-none", children: _jsxs("div", { className: "relative bg-white text-[#061a4a] border-2 border-[#061a4a] rounded-xl px-3 py-2 text-[11px] font-black italic leading-snug [font-family:'Arial_Black','Helvetica_Neue',sans-serif] shadow-[3px_3px_0_#1d6fe0]", children: [trevorLine, _jsx("span", { className: "hidden md:block absolute left-1/2 -bottom-[12px] -ml-1.5 border-[6px] border-transparent border-t-[#061a4a]" })] }) }), _jsxs("div", { className: "w-16 md:w-28 shrink-0 text-center", children: [_jsx(MiloFigure, { look: TREVOR.looks[0], pose: trevorPose, className: "w-full h-auto" }), _jsx("div", { className: "text-[9px] font-black italic tracking-wider text-sky-300", children: "TREVOR \u2022 WAX TECH" })] })] }))] })] }));
};
