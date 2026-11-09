import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Mountain, Snowflake, Play } from 'lucide-react';
import { useLiveConditions, prayerVerdict } from '../../utils/liveConditions';
export const BrightonArrivalCard = ({ onStartSkiFree, prayersCount }) => {
    const live = useLiveConditions();
    const snow = live?.snow ?? null;
    const verdict = prayerVerdict(snow);
    const blurb = !snow
        ? 'You made the pilgrimage past Silent Rock. The mountain is listening.'
        : verdict === 'answered'
            ? `You made the pilgrimage past Silent Rock. Your prayers have been answered: ${snow.newSnow24hIn}" of fresh Wasatch snow in the last 24 hours.`
            : verdict === 'incoming'
                ? `You made the pilgrimage past Silent Rock. Nothing new yet, but ${snow.forecast72hIn}" is on the way. Keep praying.`
                : 'You made the pilgrimage past Silent Rock. No new snow, none in the forecast. The prayers continue.';
    const condition = !snow
        ? 'CURRENT CONDITION: CHECKING THE SNOTEL…'
        : `LIVE: ${snow.baseDepthIn ?? '—'}" BASE • ${snow.newSnow24hIn ?? 0}" NEW • ${snow.summitTempF != null ? Math.round(snow.summitTempF) + '°F' : '—'}${verdict === 'answered' ? ' ❄️' : ''}`;
    return (_jsx("div", { className: "absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex items-center justify-center p-6 animate-in fade-in duration-500", children: _jsxs("div", { className: "max-w-lg w-full bg-slate-900 border border-sky-500/50 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950 border border-sky-700 text-xs font-mono text-sky-300", children: [_jsx(Snowflake, { className: "w-3.5 h-3.5 text-cyan-400 animate-spin", style: { animationDuration: '8s' } }), _jsx("span", { children: "Big Cottonwood Canyon \u2022 Mile 14.3" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("h2", { className: "text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-2", children: [_jsx(Mountain, { className: "w-8 h-8 text-sky-400" }), _jsx("span", { children: "BRIGHTON RESORT" })] }), _jsx("p", { className: "text-sky-300 font-mono text-sm", children: "ELEVATION: 8,755 FT \u2022 CREST / MILLY BASIN" }), _jsx("p", { className: "text-slate-400 text-xs sm:text-sm", children: blurb })] }), _jsxs("div", { className: "rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative h-36", children: [_jsx("img", { src: "/assets/canyon/brighton_trail_map.png", alt: "Brighton Trail Map", className: "w-full h-full object-cover opacity-80" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" }), _jsxs("div", { className: "absolute bottom-2 left-3 text-left font-mono text-xs text-white", children: [_jsx("div", { children: condition }), _jsxs("div", { className: "text-[10px] text-sky-400", children: ["Total Prayers Offered: ", prayersCount] })] })] }), _jsxs("button", { onClick: onStartSkiFree, className: "w-full py-4 px-6 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 hover:from-sky-300 hover:to-teal-300 text-slate-950 font-bold text-base tracking-wider uppercase shadow-glow-ice transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer", children: [_jsx(Play, { className: "w-5 h-5 fill-slate-950" }), _jsx("span", { children: "Hop Out of Car & Shred Brighton" })] })] }) }));
};
