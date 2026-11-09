import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { RIDERS_LIST, SNOWBOARDS_LIST } from '../../data/snowboardGear';
import { Siren, ShieldAlert, Sparkles, Zap, Check, AlertTriangle, Flame, Award } from 'lucide-react';
export const CopPullOverModal = ({ carState, onResolvePullOver, onArrest }) => {
    const rider = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0];
    const board = SNOWBOARDS_LIST.find(b => b.id === carState.selectedBoardId) || SNOWBOARDS_LIST[0];
    const [resolved, setResolved] = useState(false);
    const [resolutionMessage, setResolutionMessage] = useState('');
    const [pendingBonus, setPendingBonus] = useState(0);
    const [arrestTriggered, setArrestTriggered] = useState(false);
    const [arrestReasonText, setArrestReasonText] = useState('');
    // Passenger pro customized banter during pullover
    const getPassengerCopWhisper = () => {
        switch (rider.id) {
            case 'jp-walker':
                return "Stay calm, kid. Put your hands on the wheel and let The Don handle this. Officer Miller's brother bought a Forum board from me at Milosport in '98.";
            case 'jeremy-jones':
                return "Tell him Brighton got 18 inches of blower cold-smoke pow overnight and the lifts spin in 20 minutes! He's a Utah local, he understands the sickness!";
            case 'peter-line':
                return "Give him a vintage Forum sticker pack and tell him you're with Peter Line. Nobody tickets the Forum crew.";
            case 'eddie-wall':
                return "Tell him we're scouting rail spots for a new video part and we'll put his patrol cruiser in the intro credits.";
            case 'terje-hakonsen':
                return "Tell him Terje says peace and love. Respect the mountain, respect the snow.";
            case 'shaun-white':
                return "Don't sweat it, man. As soon as I roll down the window, he's gonna want a selfie and an autograph for his kids.";
            case 'danny-davis':
                return "All peace and good vibes, officer. Just trying to get some soulful turns in the Great Western trees.";
            case 'scott-stevens':
                return "Quick, show him my Instagram one-foot kickflip on the snowbank! Nobody gives a ticket to a creative wizard!";
            case 'chris-grenier':
                return "YOOOO OFFICER! The Bomb Hole podcast in the house! You listen to Wednesday drops or what?!";
            case 'zeb-powell':
                return "Tell him we're headed to Brighton to do 60-foot knuckle presses and he can come watch!";
            case 'milo-groms':
                return "Dude, please don't ticket us, my mom is tracking my Life360 and I'm supposed to be doing homework!";
            case 'milo-trevor':
                return "Show him that fresh fluorocarbon wax shine on the base! It's so smooth it practically sets off police radar guns on its own!";
            case 'bone-zone-kip':
                return "Tell him we're building a massive snow kicker at the top and we'll name the landing after him!";
            default:
                return "Keep cool! Let's show him our Milosport tune and Brighton passes!";
        }
    };
    const handleProTalk = () => {
        // 15% random arrest chance if pro has notorious reputation
        if (Math.random() < 0.15 && (rider.id === 'peter-line' || rider.id === 'chris-grenier' || rider.id === 'milo-groms')) {
            setArrestTriggered(true);
            setArrestReasonText(`Trooper Miller gasps: "Wait a second... ${rider.name}?! I know you! Dispatch, we have the legendary Wasatch powder bandit with an active Brighton rail garden trespassing warrant! Step out of the car!"`);
            return;
        }
        setResolved(true);
        setPendingBonus(150);
        setResolutionMessage(`Officer Miller glances into the passenger window and gasps: "Wait... is that ${rider.name}?! Man, I've had your poster on my garage wall since 2002! You guys are good to go—catch first chair on Crest 6!"`);
    };
    const handleMiloWaxShow = () => {
        setResolved(true);
        setPendingBonus(75);
        setResolutionMessage(`Officer Miller inspects the Yakima rack: "Milosport hand-tuned ${board.name}? I respect that. Salt Lake core since 1984. Keep it under 35 MPH in the S-Curves and watch for moose!"`);
    };
    const handleBurritoBribe = () => {
        if (Math.random() < 0.15) {
            // Cold burrito arrest!
            setArrestTriggered(true);
            setArrestReasonText('Trooper Miller unwraps the foil: "Cold chorizo?! And salsa dripped on my official citation book?! Bribery of a state trooper! Turn around and put your hands behind your back!"');
            return;
        }
        setResolved(true);
        setPendingBonus(50);
        setResolutionMessage(`Officer Miller takes a deep breath: "Is that a warm Silver Fork green-chile chorizo breakfast burrito?! ... Look, I've been on patrol since 4:30 AM. Hand that over and consider this an official warning. Drive safe!"`);
    };
    const handlePayFine = () => {
        setResolved(true);
        setPendingBonus(-50);
        setResolutionMessage(`You pay a 50 Prayer Wasatch Speeding Citation. Officer Miller stamps your receipt: "Slow down through Storm Mountain. Silent Rock is sacred, son. Carry on."`);
    };
    // Risky: Try to Outrun the UHP Trooper (80% arrest chance)
    const handleFloorIt = () => {
        if (Math.random() < 0.8) {
            setArrestTriggered(true);
            setArrestReasonText('You dump the clutch, but Trooper Miller deploys spike strips! "GO DIRECTLY TO JAIL! Do NOT pass GO, do not collect $200 (or 200 Prayers), and do not pass Wasatch Blvd! Hands behind your back!"');
        }
        else {
            setResolved(true);
            setPendingBonus(250);
            setResolutionMessage('INSANE GETAWAY! You dropped into second gear, drifted around the Storm Mountain guardrail, and lost the cruiser in a storm of fresh Wasatch powder spray! +250 Prayers!');
        }
    };
    // Risky: Argue with the Trooper (70% arrest chance)
    const handleArgue = () => {
        if (Math.random() < 0.7) {
            setArrestTriggered(true);
            setArrestReasonText(`Trooper Miller's face turns red: "Official Monopoly Community Chest Citation: GO DIRECTLY TO JAIL! Do not pass GO, do not collect $200, and your powder pass is confiscated!"`);
        }
        else {
            setResolved(true);
            setPendingBonus(-100);
            setResolutionMessage('Officer Miller writes you a massive 100 Prayers fine: "Next time you open your mouth on SR-190, I\'m calling the tow truck. Slow down!"');
        }
    };
    const handleSurrenderToJail = () => {
        onArrest(arrestReasonText || 'Reckless Canyon Speeding & Disorderly Conduct');
    };
    const handleMergeBack = () => {
        onResolvePullOver(pendingBonus);
    };
    return (_jsx("div", { className: "absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none animate-fadeIn", children: _jsxs("div", { className: "relative max-w-xl w-full bg-slate-900 border-2 border-red-500 rounded-3xl p-6 shadow-2xl space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-800 pb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" }), _jsx("span", { className: "w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping" }), _jsx("span", { className: "w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse" })] }), _jsxs("div", { children: [_jsxs("span", { className: "text-xs font-black text-red-400 uppercase tracking-widest block flex items-center gap-1.5", children: [_jsx(Siren, { className: "w-4 h-4 text-red-400 animate-bounce" }), _jsx("span", { children: "UTAH HIGHWAY PATROL \u2022 CANYON INTERCEPTION" })] }), _jsxs("span", { className: "text-[11px] text-slate-400", children: ["SR-190 Mile ", carState.distanceMiles.toFixed(1), " \u2022 Storm Mountain Sector"] })] })] }), _jsx("div", { className: "px-3 py-1 rounded-full bg-red-950/80 border border-red-600 text-red-300 text-xs font-bold animate-pulse", children: "\uD83D\uDEA8 PULLED OVER" })] }), _jsxs("div", { className: "bg-slate-950 p-3.5 rounded-2xl border border-red-900/60 flex items-center justify-between gap-3 text-xs", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx("span", { className: "text-slate-500 uppercase tracking-wider text-[10px] block", children: "LASER RADAR CLOCK:" }), _jsxs("span", { className: "text-red-400 font-black text-sm", children: [Math.max(48, Math.round(carState.speed || 52)), " MPH \u2022 35 MPH CANYON ZONE"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-slate-500 uppercase tracking-wider text-[10px] block", children: "CITATION REASON:" }), _jsx("span", { className: "text-amber-300 font-bold text-xs truncate max-w-[200px] block", children: carState.pulledOverReason || 'Excessive Wasatch Powder Speed' })] })] }), _jsxs("div", { className: "bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-slate-300", children: [_jsx(ShieldAlert, { className: "w-4 h-4 text-amber-400" }), _jsx("span", { children: "Trooper Dave Miller (UHP Wasatch Highway Patrol):" })] }), _jsx("p", { className: "text-xs text-slate-200 italic leading-relaxed pl-6 border-l-2 border-amber-500/50", children: "\"License, registration, and proof of Wasatch prayers. Son, I clocked your Subaru booking it up Big Cottonwood like first chair is already spinning. Where's the fire?\"" })] }), _jsxs("div", { className: "bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold", children: [_jsx("span", { children: rider.iconEmoji }), _jsxs("span", { children: [rider.name, " (", rider.nickname, ") Shotgun Whisper:"] })] }), _jsxs("p", { className: "text-slate-300 italic pl-5", children: ["\"", getPassengerCopWhisper(), "\""] })] }), arrestTriggered ? (_jsxs("div", { className: "bg-red-950/80 border-2 border-red-500 p-4 rounded-2xl space-y-3 animate-fadeIn text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 text-red-400 font-black text-sm uppercase", children: [_jsx(ShieldAlert, { className: "w-5 h-5 text-red-500 animate-bounce" }), _jsx("span", { children: "GO DIRECTLY TO JAIL! \uD83C\uDFB2" })] }), _jsx("p", { className: "text-xs text-slate-200 leading-relaxed font-mono", children: arrestReasonText }), _jsxs("div", { className: "p-2.5 rounded-xl bg-amber-950/90 border-2 border-amber-400 text-amber-300 text-xs font-mono font-black flex items-center justify-center gap-2 shadow-md", children: [_jsx("span", { className: "text-base", children: "\uD83C\uDFB2" }), _jsx("span", { children: "MONOPOLY RULE: \"DO NOT PASS GO \u2022 DO NOT COLLECT $200!\"" })] }), _jsx("div", { className: "text-[11px] text-slate-400 font-bold", children: "Destination: Salt Lake County Metro Jail (3365 S 900 W)" }), _jsx("button", { onClick: handleSurrenderToJail, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl cursor-pointer transform hover:scale-[1.01] transition-all", children: _jsx("span", { children: "GO DIRECTLY TO JAIL (DO NOT COLLECT $200) \u26D3\uFE0F" }) })] })) : resolved ? (_jsxs("div", { className: "bg-emerald-950/40 border border-emerald-500/60 p-4 rounded-2xl space-y-3 animate-fadeIn", children: [_jsxs("div", { className: "flex items-start gap-2.5 text-xs text-emerald-300", children: [_jsx(Check, { className: "w-4 h-4 text-emerald-400 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "leading-relaxed font-bold", children: resolutionMessage }), pendingBonus !== 0 && (_jsx("span", { className: `text-[11px] font-mono mt-1 block ${pendingBonus > 0 ? 'text-cyan-300' : 'text-amber-400'}`, children: pendingBonus > 0 ? `+${pendingBonus} Wasatch Prayers Bonus!` : `${pendingBonus} Prayers fine paid.` }))] })] }), _jsxs("button", { onClick: handleMergeBack, className: "w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01] transition-all", children: [_jsx(Zap, { className: "w-4 h-4" }), _jsx("span", { children: "PUNCH THE GAS & MERGE BACK ONTO SR-190" })] })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-[11px] text-slate-400 uppercase tracking-wider block", children: "How do you handle Trooper Miller?" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs", children: [_jsxs("button", { onClick: handleProTalk, className: "p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/60 hover:border-emerald-400 text-emerald-200 text-left cursor-pointer transition-all hover:bg-emerald-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-white", children: [_jsx(Award, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsxs("span", { children: ["Let ", rider.name.split(' ')[0], " Talk"] })] }), _jsx("span", { className: "text-[10px] text-emerald-300/80", children: "Starstruck trooper \u2022 +150 Prayers" })] }), _jsxs("button", { onClick: handleMiloWaxShow, className: "p-3 rounded-xl bg-sky-950/60 border border-sky-600/60 hover:border-sky-400 text-sky-200 text-left cursor-pointer transition-all hover:bg-sky-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-white", children: [_jsx(Flame, { className: "w-3.5 h-3.5 text-sky-400" }), _jsx("span", { children: "Show Milosport Tune" })] }), _jsx("span", { className: "text-[10px] text-sky-300/80", children: "Core SLC shop respect \u2022 +75 Prayers" })] }), _jsxs("button", { onClick: handleBurritoBribe, className: "p-3 rounded-xl bg-amber-950/60 border border-amber-600/60 hover:border-amber-400 text-amber-200 text-left cursor-pointer transition-all hover:bg-amber-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-white", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-400" }), _jsx("span", { children: "Silver Fork Burrito" })] }), _jsx("span", { className: "text-[10px] text-amber-300/80", children: "Trooper breakfast bribe \u2022 15% Jail Risk" })] }), _jsxs("button", { onClick: handlePayFine, className: "p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-300 text-left cursor-pointer transition-all hover:bg-slate-800 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-white", children: [_jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-slate-400" }), _jsx("span", { children: "Accept Warning" })] }), _jsx("span", { className: "text-[10px] text-slate-400", children: "Pay 50 Prayers fine & slow down" })] }), _jsxs("button", { onClick: handleFloorIt, className: "p-3 rounded-xl bg-red-950/60 border border-red-600/60 hover:border-red-400 text-red-200 text-left cursor-pointer transition-all hover:bg-red-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-red-300", children: [_jsx(Zap, { className: "w-3.5 h-3.5 text-red-400" }), _jsx("span", { children: "Floor It & Outrun" })] }), _jsx("span", { className: "text-[10px] text-red-400/80 font-mono", children: "80% Jail Risk \u2022 +250 Prayers escape" })] }), _jsxs("button", { onClick: handleArgue, className: "p-3 rounded-xl bg-amber-950/60 border border-amber-600/60 hover:border-amber-400 text-amber-200 text-left cursor-pointer transition-all hover:bg-amber-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-amber-300", children: [_jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-amber-400" }), _jsx("span", { children: "Argue: \"Powder Won't Wait!\"" })] }), _jsx("span", { className: "text-[10px] text-amber-400/80 font-mono", children: "70% Jail Risk \u2022 Contempt citation" })] })] })] }))] }) }));
};
