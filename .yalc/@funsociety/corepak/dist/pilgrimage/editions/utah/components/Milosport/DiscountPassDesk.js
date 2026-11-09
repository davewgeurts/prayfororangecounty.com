import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { LIFT_PASSES_LIST } from '../../data/snowboardGear';
import { Ticket, Sparkles, Check, DollarSign, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
export const DiscountPassDesk = ({ purchasedPassIds, prayersCount, onBuyPass }) => {
    const [successPassName, setSuccessPassName] = useState(null);
    const handlePurchase = (pass) => {
        onBuyPass(pass.id);
        setSuccessPassName(pass.name);
        try {
            confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.6 },
                colors: [pass.accentColor, '#22c55e', '#ffffff']
            });
        }
        catch {
            // fallback
        }
        setTimeout(() => setSuccessPassName(null), 3000);
    };
    return (_jsxs("div", { className: "space-y-6 select-none font-mono", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Ticket, { className: "w-5 h-5 text-emerald-400" }), _jsx("h2", { className: "text-xl sm:text-2xl font-black text-white uppercase tracking-wider", children: "MILOSPORT DISCOUNT PASS & TICKET DESK" })] }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 mt-1", children: "Skip the resort ticket windows! Score local shop-bro discounts on Brighton and Solitude lift tickets directly from the Milosport counter." })] }), _jsxs("div", { className: "flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-2 rounded-2xl text-xs", children: [_jsx(Sparkles, { className: "w-4 h-4 text-cyan-400" }), _jsxs("span", { children: ["Your Wasatch Prayers: ", _jsx("strong", { className: "text-cyan-400", children: prayersCount.toLocaleString() })] })] })] }), successPassName && (_jsxs("div", { className: "p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between shadow-glow-ice animate-bounce", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Check, { className: "w-4 h-4 text-emerald-400 stroke-[3]" }), _jsxs("span", { children: ["Ticket printed! ", _jsx("strong", { children: successPassName }), " is hanging from your jacket wire wicket!"] })] }), _jsx("span", { className: "text-[10px] text-emerald-400 font-bold uppercase", children: "READY FOR CREST CHAIR" })] })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: LIFT_PASSES_LIST.map(pass => {
                    const isPurchased = purchasedPassIds.includes(pass.id);
                    const discountPct = Math.round(((pass.priceWindow - pass.priceMilo) / pass.priceWindow) * 100);
                    return (_jsxs("div", { className: `relative rounded-3xl border p-5 flex flex-col justify-between transition-all bg-slate-900/80 backdrop-blur-sm ${isPurchased
                            ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-glow-ice'
                            : 'border-slate-800 hover:border-slate-700'}`, children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-3", children: [_jsxs("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", style: {
                                            backgroundColor: `${pass.badgeColor}35`,
                                            color: pass.accentColor,
                                            border: `1px solid ${pass.accentColor}50`
                                        }, children: [pass.resort, " \u2022 ", discountPct, "% OFF"] }), isPurchased ? (_jsxs("span", { className: "px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center gap-1", children: [_jsx(Check, { className: "w-3 h-3 stroke-[3]" }), _jsx("span", { children: "PURCHASED" })] })) : (_jsxs("span", { className: "text-[10px] text-slate-400 line-through", children: ["Resort Window: $", pass.priceWindow] }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-1", children: pass.name }), _jsx("p", { className: "text-xs text-slate-300 mb-4", children: pass.description }), _jsxs("div", { className: "flex items-baseline gap-2 mb-4 bg-slate-950 p-3 rounded-2xl border border-slate-800", children: [_jsxs("span", { className: "text-2xl font-black text-emerald-400 flex items-center", children: [_jsx(DollarSign, { className: "w-5 h-5 -mr-1" }), pass.priceMilo] }), _jsx("span", { className: "text-xs text-slate-400", children: "Milo Shop Bro Rate" }), _jsxs("span", { className: "text-xs text-slate-500 ml-auto", children: ["or ", pass.prayersPrice, " Prayers"] })] }), _jsx("div", { className: "space-y-1.5 mb-5 text-xs text-slate-300", children: pass.perks.map((perk, i) => (_jsxs("div", { className: "flex items-center gap-2 text-[11px]", children: [_jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0" }), _jsx("span", { children: perk })] }, i))) })] }), _jsx("button", { onClick: () => handlePurchase(pass), disabled: isPurchased, className: `w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${isPurchased
                                    ? 'bg-emerald-950 border border-emerald-600 text-emerald-300 cursor-default'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md transform hover:scale-[1.01]'}`, children: isPurchased ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4 stroke-[3]" }), _jsx("span", { children: "LIFT PASS ATTACHED TO JACKET" })] })) : (_jsxs(_Fragment, { children: [_jsx(Ticket, { className: "w-4 h-4" }), _jsxs("span", { children: ["BUY AT MILO COUNTER ($", pass.priceMilo, ")"] })] })) })] }, pass.id));
                }) })] }));
};
