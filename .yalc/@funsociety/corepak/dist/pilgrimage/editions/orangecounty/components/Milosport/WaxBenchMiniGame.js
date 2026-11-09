import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { WAX_FORMULAS_LIST, SNOWBOARDS_LIST } from '../../data/snowboardGear';
import { Flame, Check, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
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
    // Step 2: Rub Basecoat Bumps on click
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
        if (newDrops.length >= 12) {
            setStep('iron_smooth');
        }
    };
    // Step 3: Crosshatch Topcoat Rub
    const handleIronMove = (e) => {
        if (step !== 'iron_smooth')
            return;
        if (e.buttons !== 1)
            return;
        setMeltProgress(p => {
            const next = Math.min(100, p + 2.0);
            if (next >= 100) {
                setStep('scrape_base');
            }
            return next;
        });
    };
    // Step 4: Comb Diagonal Grip Channels
    const handleScrapeMove = (e) => {
        if (step !== 'scrape_base')
            return;
        if (e.buttons !== 1)
            return;
        setScrapeProgress(p => {
            const next = Math.min(100, p + 2.4);
            if (next >= 100) {
                setStep('brush_polish');
            }
            return next;
        });
    };
    // Step 5: Click in FCS II Fins / Leash Plug
    const handleBrushMove = (e) => {
        if (step !== 'brush_polish')
            return;
        if (e.buttons !== 1)
            return;
        setBrushProgress(p => {
            const next = Math.min(100, p + 2.8);
            if (next >= 100) {
                finishTuning();
            }
            return next;
        });
    };
    const finishTuning = () => {
        setStep('complete');
        const score = Math.round(94 + Math.random() * 6);
        setFinalScore(score);
        try {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: [selectedFormula.hex, '#06b6d4', '#f59e0b', '#ffffff']
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
    return (_jsxs("div", { className: "bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl max-w-4xl mx-auto w-full select-none font-mono", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" }), _jsx("h2", { className: "text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2", children: "SURF & PADDLE LAGUNA \u2022 STICKY BUMPS & FU WAX BENCH" })] }), _jsxs("p", { className: "text-xs text-slate-400 mt-1", children: ["Wax up your ", _jsx("strong", { className: "text-cyan-300", children: board.name }), " (", board.craftType === 'boogie' ? 'Boogie Deck & Rails' : 'Surfboard Deck & FCS II Fins', ") before paddling out!"] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("button", { onClick: handleReset, className: "px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer", children: [_jsx(RotateCcw, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Strip Old Wax" })] }) })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 text-[10px] uppercase font-bold", children: [
                    { id: 'choose_wax', label: '1. Water Temp Wax' },
                    { id: 'drip_wax', label: '2. Basecoat Bumps' },
                    { id: 'iron_smooth', label: '3. Crosshatch Rub' },
                    { id: 'scrape_base', label: '4. Wax Comb Lines' },
                    { id: 'brush_polish', label: '5. Fins & Leash' }
                ].map(s => {
                    const isActive = step === s.id;
                    return (_jsx("div", { className: `p-2 rounded-xl text-center border transition-all ${isActive
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-500'}`, children: s.label }, s.id));
                }) }), step === 'choose_wax' && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-bold text-white uppercase", children: "Select Today\u2019s Orange County Ocean Temp Wax Bar:" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: WAX_FORMULAS_LIST.map(f => {
                            const isSelected = selectedFormula.id === f.id;
                            return (_jsxs("div", { onClick: () => setSelectedFormula(f), className: `p-4 rounded-2xl border transition-all cursor-pointer bg-slate-950/80 ${isSelected
                                    ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-glow-ice'
                                    : 'border-slate-800 hover:border-slate-700'}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold uppercase", style: { backgroundColor: `${f.hex}30`, color: f.hex }, children: f.tempRange }), _jsxs("span", { className: "text-[10px] text-emerald-400 font-bold", children: ["+", Math.round((f.speedBonus - 1) * 100), "% GRIP & SPEED"] })] }), _jsx("h4", { className: "text-base font-bold text-white mb-1", children: f.name }), _jsx("p", { className: "text-xs text-slate-400 mb-3", children: f.description }), _jsx("button", { onClick: () => {
                                            setSelectedFormula(f);
                                            setStep('drip_wax');
                                        }, className: `w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected
                                            ? 'bg-cyan-400 text-slate-950'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`, children: "UNWRAP WAX BAR & RUB DECK \u2192" })] }, f.id));
                        }) })] })), step !== 'choose_wax' && step !== 'complete' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-cyan-950/30 border border-cyan-500/50 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Flame, { className: "w-4 h-4 text-amber-400 shrink-0" }), _jsxs("span", { children: [step === 'drip_wax' && `CLICK ACROSS THE DECK TO RUB STICKY BASECOAT CLUSTERS (${drops.length}/12 spots)`, step === 'iron_smooth' && `HOLD CLICK & RUB IN CIRCLES TO BUILD STICKY BUMPS (${Math.round(meltProgress)}%)`, step === 'scrape_base' && `HOLD CLICK & DRAG WAX COMB FOR DIAGONAL TRACTION GROOVES (${Math.round(scrapeProgress)}%)`, step === 'brush_polish' && `HOLD CLICK & LOCK IN CARBON FCS II FINS & COMP LEASH (${Math.round(brushProgress)}%)`] })] }), _jsx("button", { onClick: finishTuning, className: "text-[10px] text-slate-400 hover:text-white underline cursor-pointer", children: "Quick Wax & Go \u2192" })] }), _jsxs("div", { ref: boardAreaRef, onClick: handleBoardClick, onMouseMove: (e) => {
                            if (step === 'iron_smooth')
                                handleIronMove(e);
                            if (step === 'scrape_base')
                                handleScrapeMove(e);
                            if (step === 'brush_polish')
                                handleBrushMove(e);
                        }, className: "relative w-full h-44 sm:h-52 bg-slate-950 border-2 border-slate-700 rounded-3xl overflow-hidden cursor-crosshair flex items-center justify-center p-4 shadow-inner", children: [_jsxs("div", { className: "relative w-11/12 h-3/5 rounded-l-full rounded-r-2xl border-2 border-slate-500 transition-all flex items-center justify-between px-6 overflow-hidden shadow-2xl", style: {
                                    backgroundColor: board.topGraphicColor,
                                    filter: brushProgress > 50 ? 'brightness(1.2)' : 'none'
                                }, children: [_jsx("div", { className: "absolute inset-x-0 top-1/2 h-[2px] bg-amber-200/40 pointer-events-none" }), _jsx("span", { className: "font-black text-xl sm:text-2xl tracking-widest text-white/25 select-none uppercase mx-auto", children: board.name }), meltProgress > 0 && (_jsx("div", { className: "absolute inset-0 transition-all pointer-events-none", style: {
                                            backgroundColor: selectedFormula.hex,
                                            opacity: (meltProgress / 100) * 0.4
                                        } })), scrapeProgress > 0 && (_jsx("div", { className: "absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.18)_8px,rgba(255,255,255,0.18)_10px)] transition-all pointer-events-none", style: {
                                            opacity: scrapeProgress / 100
                                        } })), drops.map((d, i) => (_jsx("div", { className: "absolute w-4 h-4 rounded-full border border-white/70 shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300", style: {
                                            left: `${d.x}%`,
                                            top: `${d.y}%`,
                                            backgroundColor: selectedFormula.hex,
                                            transform: meltProgress > 40 ? 'scale(2.2)' : 'scale(1)'
                                        } }, i)))] }), _jsxs("div", { className: "absolute bottom-2 text-[10px] text-slate-500 font-mono", children: ["Surf & Paddle Shaping Bay \u2022 Scent: Coconut & Blueberry \u2022 Bar: ", selectedFormula.name] })] })] })), step === 'complete' && (_jsxs("div", { className: "bg-slate-950 p-6 rounded-3xl border border-emerald-500/50 space-y-5 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center text-emerald-300 shadow-glow-ice", children: _jsx(Trophy, { className: "w-8 h-8" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-white uppercase tracking-wider", children: "STICKY BUMPS & FU WAX COAT DIALED! \uD83E\uDD65\uD83E\uDD19" }), _jsxs("div", { className: "text-sm text-emerald-400 font-bold mt-1", children: [finalScore, "% TACKY BEAD SCORE \u2022 READY FOR TRESTLES & 1000 STEPS"] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-xs font-mono", children: [_jsxs("div", { className: "p-3 bg-slate-900 rounded-xl border border-slate-800", children: [_jsx("span", { className: "text-slate-400 block text-[10px]", children: "WAVE SPEED & POP" }), _jsxs("strong", { className: "text-emerald-400 text-sm", children: ["+", Math.round((selectedFormula.speedBonus - 1) * 100), "% BOOST"] })] }), _jsxs("div", { className: "p-3 bg-slate-900 rounded-xl border border-slate-800", children: [_jsx("span", { className: "text-slate-400 block text-[10px]", children: "AIR-REVERSE GRIP" }), _jsx("strong", { className: "text-cyan-400 text-sm", children: "ZERO FOOT SLIP" })] }), _jsxs("div", { className: "p-3 bg-slate-900 rounded-xl border border-slate-800", children: [_jsx("span", { className: "text-slate-400 block text-[10px]", children: "PCH CRUISE BUFF" }), _jsx("strong", { className: "text-amber-400 text-sm", children: "+10 MPH STOKE" })] })] }), _jsxs("div", { className: "p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl max-w-lg mx-auto text-xs text-emerald-200 italic", children: ["\u201CBro, those wax bumps are so tacky you could do a no-hand rodeo flip at Lower Trestles and land bolts! Go grab a Taco Stand burrito and hit PCH!\u201D", _jsx("div", { className: "text-[10px] text-emerald-400 font-bold not-italic mt-1", children: "\u2014 Mateo, Surf & Paddle Laguna Shaping Tech" })] }), _jsxs("button", { onClick: handleSaveTune, className: "px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wider uppercase inline-flex items-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.02] transition-all", children: [_jsx(Check, { className: "w-4 h-4 stroke-[3]" }), _jsx("span", { children: "STRAP WAXED BOARD TO ROOF RACK & RETURN TO SHOP" })] })] }))] }));
};
