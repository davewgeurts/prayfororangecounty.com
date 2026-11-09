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
    // Passenger pro customized banter during PCH pullover
    const getPassengerCopWhisper = () => {
        switch (rider.id) {
            case 'jp-walker':
                return "Stay calm! Let Griffin handle this—Officer Brody surfs T-Street every morning before his shift and knows the Colapinto family.";
            case 'jeremy-jones':
                return "Tell him the WSL Finals horn at Lower Trestles is about to blow and I have the #1 seed jersey in the trunk!";
            case 'peter-line':
                return "Hand him a Lost Mayhem sticker pack and tell him I'm shaping him a custom Puddle Jumper in San Clemente!";
            case 'eddie-wall':
                return "Tell him 2% Swim Team is filming at the San Clemente Pier and we'll put his patrol cruiser in the vlog intro!";
            case 'terje-hakonsen':
                return "Tell him Kelly Slater says aloha. Respect the ocean, respect the coastal speed limit.";
            case 'shaun-white':
                return "Don't sweat it, bro. As soon as I roll down the window, he's gonna ask about my 10-point air at Lowers!";
            case 'danny-davis':
                return "All aloha and good vibrations, officer. Just cruising down the coast looking for a clean pointbreak.";
            case 'scott-stevens':
                return "Quick, show him our Catch Surf Womper and pink Beater finless setup! Nobody tickets a pure fun hog!";
            case 'chris-grenier':
                return "YOOOO OFFICER! Mike Stewart in the house! Show him the viper swimfins and tell him 1000 Steps shorebreak is firing!";
            case 'zeb-powell':
                return "Tell him we're headed to Victoria Beach and the Pier to pull into dry-sand shorebreak barrels!";
            case 'milo-groms':
                return "Dude, please don't ticket us, my mom is tracking my Life360 and thinks we're still in line at The Taco Stand!";
            case 'milo-trevor':
                return "Show him those Sticky Bumps Tour Series speed bumps on the deck! Freshly hand-waxed at Surf & Paddle Laguna!";
            case 'bone-zone-kip':
                return "Tell him we're the San Clemente Pier Rat Crew and the west side of the pilings is tubing off its head!";
            default:
                return "Keep cool! Let's show him our Surf & Paddle wax job and WSL Trestles passes!";
        }
    };
    const handleProTalk = () => {
        if (Math.random() < 0.15 && (rider.id === 'peter-line' || rider.id === 'chris-grenier' || rider.id === 'milo-groms')) {
            setArrestTriggered(true);
            setArrestReasonText(`Officer Brody gasps: "Wait a second... ${rider.name}?! Dispatch, we have the notorious PCH swell bandit with an outstanding blackball surfing citation! Step out of the vehicle!"`);
            return;
        }
        setResolved(true);
        setPendingBonus(150);
        setResolutionMessage(`Officer Brody glances into the passenger window and gasps: "Wait... is that ${rider.name}?! Dude, I watched your heat at Lower Trestles last year! You guys are good to go—go get barreled!"`);
    };
    const handleMiloWaxShow = () => {
        setResolved(true);
        setPendingBonus(75);
        setResolutionMessage(`Officer Brody inspects the roof rack: "Surf & Paddle Laguna hand-waxed ${board.name}? I respect that. Right next door to The Taco Stand. Keep it under 45 MPH past Dana Point!"`);
    };
    const handleBurritoBribe = () => {
        if (Math.random() < 0.15) {
            setArrestTriggered(true);
            setArrestReasonText('Officer Brody unwraps the foil: "Wait, you ate half this California Burrito and spilled habanero salsa on my citation book?! Bribery of a coastal patrol officer! Hands behind your back!"');
            return;
        }
        setResolved(true);
        setPendingBonus(50);
        setResolutionMessage(`Officer Brody takes a deep breath: "Is that a warm Carne Asada California Burrito and fresh churros from The Taco Stand in Laguna?! ... Look, the line there was 40 people deep when I drove by. Hand that over and drive safe!"`);
    };
    const handlePayFine = () => {
        setResolved(true);
        setPendingBonus(-50);
        setResolutionMessage(`You pay a 50 Prayer PCH Coastal Speeding Citation. Officer Brody stamps your receipt: "Slow down through South Laguna. 1000 Steps Beach is sacred, grom. Carry on."`);
    };
    // Risky: Try to Outrun CHP on PCH (80% arrest chance)
    const handleFloorIt = () => {
        if (Math.random() < 0.8) {
            setArrestTriggered(true);
            setArrestReasonText('You punch the throttle down PCH, but OC Harbor Patrol & CHP box you in by Dana Point Harbor! "GO DIRECTLY TO BEACH HOLDING TANK! Do NOT pass GO, do not collect $200 (or 200 Prayers)! Hands behind your back!"');
        }
        else {
            setResolved(true);
            setPendingBonus(250);
            setResolutionMessage('INSANE PCH GETAWAY! You downshifted around the Dana Point Headlands, ducked into the Coast Highway beach lot, and vanished behind a wall of surf vans! +250 Prayers!');
        }
    };
    // Risky: Argue with the Officer (70% arrest chance)
    const handleArgue = () => {
        if (Math.random() < 0.7) {
            setArrestTriggered(true);
            setArrestReasonText(`Officer Brody's face turns red: "Official Monopoly Coastal Citation: GO DIRECTLY TO JAIL! Do not pass GO, do not collect $200, and your boards are impounded at the Lifeguard HQ!"`);
        }
        else {
            setResolved(true);
            setPendingBonus(-100);
            setResolutionMessage('Officer Brody writes you a 100 Prayers fine: "Next time you back-talk on Pacific Coast Highway, I\'m blackballing your whole crew until sundown. Slow down!"');
        }
    };
    const handleSurrenderToJail = () => {
        onArrest(arrestReasonText || 'Reckless PCH Speeding & Blackball Zone Violation');
    };
    const handleMergeBack = () => {
        onResolvePullOver(pendingBonus);
    };
    return (_jsx("div", { className: "absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none animate-fadeIn", children: _jsxs("div", { className: "relative max-w-xl w-full bg-slate-900 border-2 border-red-500 rounded-3xl p-6 shadow-2xl space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-800 pb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" }), _jsx("span", { className: "w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping" }), _jsx("span", { className: "w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse" })] }), _jsxs("div", { children: [_jsxs("span", { className: "text-xs font-black text-red-400 uppercase tracking-widest block flex items-center gap-1.5", children: [_jsx(Siren, { className: "w-4 h-4 text-red-400 animate-bounce" }), _jsx("span", { children: "CALIFORNIA HIGHWAY PATROL \u2022 PCH INTERCEPTION" })] }), _jsxs("span", { className: "text-[11px] text-slate-400", children: ["PCH CA-1 Mile ", carState.distanceMiles.toFixed(1), " \u2022 Orange County Coast Sector"] })] })] }), _jsx("div", { className: "px-3 py-1 rounded-full bg-red-950/80 border border-red-600 text-red-300 text-xs font-bold animate-pulse", children: "\uD83D\uDEA8 PULLED OVER" })] }), _jsxs("div", { className: "bg-slate-950 p-3.5 rounded-2xl border border-red-900/60 flex items-center justify-between gap-3 text-xs", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx("span", { className: "text-slate-500 uppercase tracking-wider text-[10px] block", children: "LASER RADAR CLOCK:" }), _jsxs("span", { className: "text-red-400 font-black text-sm", children: [Math.max(52, Math.round(carState.speed || 56)), " MPH \u2022 35 MPH COASTAL ZONE"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-slate-500 uppercase tracking-wider text-[10px] block", children: "CITATION REASON:" }), _jsx("span", { className: "text-amber-300 font-bold text-xs truncate max-w-[200px] block", children: carState.pulledOverReason || 'Excessive Swell-Chasing Speed on PCH' })] })] }), _jsxs("div", { className: "bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-slate-300", children: [_jsx(ShieldAlert, { className: "w-4 h-4 text-amber-400" }), _jsx("span", { children: "Officer Brody (CHP Orange County Coast Division):" })] }), _jsx("p", { className: "text-xs text-slate-200 italic leading-relaxed pl-6 border-l-2 border-amber-500/50", children: "\"License, registration, and State Beach parking pass. Grom, I clocked your surf wagon flying down Pacific Coast Highway like a 10-foot south swell just hit Trestles. What's the rush?\"" })] }), _jsxs("div", { className: "bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-cyan-400 font-bold", children: [_jsx("span", { children: rider.iconEmoji }), _jsxs("span", { children: [rider.name, " (", rider.nickname, ") Shotgun Whisper:"] })] }), _jsxs("p", { className: "text-slate-300 italic pl-5", children: ["\"", getPassengerCopWhisper(), "\""] })] }), arrestTriggered ? (_jsxs("div", { className: "bg-red-950/80 border-2 border-red-500 p-4 rounded-2xl space-y-3 animate-fadeIn text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 text-red-400 font-black text-sm uppercase", children: [_jsx(ShieldAlert, { className: "w-5 h-5 text-red-500 animate-bounce" }), _jsx("span", { children: "GO DIRECTLY TO JAIL! \uD83C\uDFB2" })] }), _jsx("p", { className: "text-xs text-slate-200 leading-relaxed font-mono", children: arrestReasonText }), _jsxs("div", { className: "p-2.5 rounded-xl bg-amber-950/90 border-2 border-amber-400 text-amber-300 text-xs font-mono font-black flex items-center justify-center gap-2 shadow-md", children: [_jsx("span", { className: "text-base", children: "\uD83C\uDFB2" }), _jsx("span", { children: "MONOPOLY RULE: \"DO NOT PASS GO \u2022 DO NOT COLLECT $200!\"" })] }), _jsx("div", { className: "text-[11px] text-slate-400 font-bold", children: "Destination: OC Harbor Patrol & Lifeguard Detention Tank (Dana Point)" }), _jsx("button", { onClick: handleSurrenderToJail, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-2xl cursor-pointer transform hover:scale-[1.01] transition-all", children: _jsx("span", { children: "GO DIRECTLY TO HOLDING TANK (DO NOT COLLECT $200) \u26D3\uFE0F" }) })] })) : resolved ? (_jsxs("div", { className: "bg-emerald-950/40 border border-emerald-500/60 p-4 rounded-2xl space-y-3 animate-fadeIn", children: [_jsxs("div", { className: "flex items-start gap-2.5 text-xs text-emerald-300", children: [_jsx(Check, { className: "w-4 h-4 text-emerald-400 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "leading-relaxed font-bold", children: resolutionMessage }), pendingBonus !== 0 && (_jsx("span", { className: `text-[11px] font-mono mt-1 block ${pendingBonus > 0 ? 'text-cyan-300' : 'text-amber-400'}`, children: pendingBonus > 0 ? `+${pendingBonus} Ocean Prayers Bonus!` : `${pendingBonus} Prayers fine paid.` }))] })] }), _jsxs("button", { onClick: handleMergeBack, className: "w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01] transition-all", children: [_jsx(Zap, { className: "w-4 h-4" }), _jsx("span", { children: "PUNCH THE GAS & MERGE BACK ONTO PCH CA-1" })] })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-[11px] text-slate-400 uppercase tracking-wider block", children: "How do you handle Officer Brody?" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs", children: [_jsxs("button", { onClick: handleProTalk, className: "p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/60 hover:border-emerald-400 text-emerald-200 text-left cursor-pointer transition-all hover:bg-emerald-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-white", children: [_jsx(Award, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsxs("span", { children: ["Let ", rider.name.split(' ')[0], " Talk"] })] }), _jsx("span", { className: "text-[10px] text-emerald-300/80", children: "Starstruck officer \u2022 +150 Prayers" })] }), _jsxs("button", { onClick: handleMiloWaxShow, className: "p-3 rounded-xl bg-sky-950/60 border border-sky-600/60 hover:border-sky-400 text-sky-200 text-left cursor-pointer transition-all hover:bg-sky-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-white", children: [_jsx(Flame, { className: "w-3.5 h-3.5 text-sky-400" }), _jsx("span", { children: "Show Surf & Paddle Wax" })] }), _jsx("span", { className: "text-[10px] text-sky-300/80", children: "Laguna shop respect \u2022 +75 Prayers" })] }), _jsxs("button", { onClick: handleBurritoBribe, className: "p-3 rounded-xl bg-amber-950/60 border border-amber-600/60 hover:border-amber-400 text-amber-200 text-left cursor-pointer transition-all hover:bg-amber-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-white", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-400" }), _jsx("span", { children: "Taco Stand Burrito" })] }), _jsx("span", { className: "text-[10px] text-amber-300/80", children: "Carne Asada bribe \u2022 15% Jail Risk" })] }), _jsxs("button", { onClick: handlePayFine, className: "p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-300 text-left cursor-pointer transition-all hover:bg-slate-800 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-white", children: [_jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-slate-400" }), _jsx("span", { children: "Accept Warning" })] }), _jsx("span", { className: "text-[10px] text-slate-400", children: "Pay 50 Prayers fine & cruise easy" })] }), _jsxs("button", { onClick: handleFloorIt, className: "p-3 rounded-xl bg-red-950/60 border border-red-600/60 hover:border-red-400 text-red-200 text-left cursor-pointer transition-all hover:bg-red-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-red-300", children: [_jsx(Zap, { className: "w-3.5 h-3.5 text-red-400" }), _jsx("span", { children: "Floor It Down PCH" })] }), _jsx("span", { className: "text-[10px] text-red-400/80 font-mono", children: "80% Jail Risk \u2022 +250 Prayers escape" })] }), _jsxs("button", { onClick: handleArgue, className: "p-3 rounded-xl bg-amber-950/60 border border-amber-600/60 hover:border-amber-400 text-amber-200 text-left cursor-pointer transition-all hover:bg-amber-900/60 flex flex-col justify-between gap-1", children: [_jsxs("div", { className: "font-bold flex items-center gap-1.5 text-amber-300", children: [_jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-amber-400" }), _jsx("span", { children: "Argue: \"The Tide Is Dropping!\"" })] }), _jsx("span", { className: "text-[10px] text-amber-400/80 font-mono", children: "70% Jail Risk \u2022 Blackball citation" })] })] })] }))] }) }));
};
