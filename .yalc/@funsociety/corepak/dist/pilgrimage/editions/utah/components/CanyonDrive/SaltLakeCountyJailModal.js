import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { RIDERS_LIST, SNOWBOARDS_LIST } from '../../data/snowboardGear';
import { Lock, Phone, Flame, Award, CheckCircle2, ArrowRight, Coins, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
export const SaltLakeCountyJailModal = ({ carState, onRelease }) => {
    const rider = RIDERS_LIST.find(r => r.id === carState.selectedRiderId) || RIDERS_LIST[0];
    const board = SNOWBOARDS_LIST.find(b => b.id === carState.selectedBoardId) || SNOWBOARDS_LIST[0];
    const [jailTab, setJailTab] = useState('booking');
    const [squatCount, setSquatCount] = useState(0);
    const [isSquatting, setIsSquatting] = useState(false);
    const [miloCallStep, setMiloCallStep] = useState(null);
    const [lawyerStep, setLawyerStep] = useState(null);
    const [released, setReleased] = useState(false);
    const [releaseNote, setReleaseNote] = useState('');
    const [pendingPrayersDelta, setPendingPrayersDelta] = useState(0);
    // Passenger pro quotes while locked in Salt Lake County Jail
    const getProJailQuote = () => {
        switch (rider.id) {
            case 'jp-walker':
                return "Trooper Dave literally hit us with 'Go directly to jail, do not pass GO, do not collect $200'! But The Don knows people on 3300 South—Trevor at Milosport is gonna bail us out before Great Western gets tracked!";
            case 'jeremy-jones':
                return "It's dumping 3 inches an hour in Big Cottonwood right now and we're staring at cinderblock cell walls! Call the shop, we've gotta make the afternoon storm session!";
            case 'peter-line':
                return "Hey guard, can I get a Sharpie to sketch a new Forum top sheet on these jail bars? Don't worry kid, Forum riders always find a way out.";
            case 'eddie-wall':
                return "I worked night park maintenance for years, I know every cop in Salt Lake Valley. Just give me one phone call to the shop!";
            case 'terje-hakonsen':
                return "The mountain teaches patience, but this concrete cell tests the soul. Breathe, focus, and let's get our boards back.";
            case 'shaun-white':
                return "My legal team is already in contact with the Salt Lake County District Attorney. We'll have VIP clearance back to Brighton in no time.";
            case 'danny-davis':
                return "Peace, brother. Even behind bars, the vibe is positive. Do some breathing exercises and think about soulful powder carves.";
            case 'scott-stevens':
                return "If you hoist me up, I can do a wall-ride 180 off the top bunk bed. Who needs freedom when you have creative cell park lines?!";
            case 'chris-grenier':
                return "YO WARDEN! Where is the podcast microphone?! The Bomb Hole episode 300: LIVE FROM SALT LAKE COUNTY METRO JAIL with Grendies!";
            case 'zeb-powell':
                return "Soon as that buzzer sounds, we're sprinting straight to the Subaru and sending 60-foot knuckle presses off the highway snowbanks!";
            case 'milo-groms':
                return "Dude he told us 'Do not pass GO, do not collect 200 dollars'! My mom is tracking my phone at 3365 S 900 W! Please call Trevor!";
            case 'milo-trevor':
                return "I run the Milosport bench, I know the bail commissioner personally! He rides a Custom 158! One call and we're free!";
            case 'bone-zone-kip':
                return "They impounded our wax irons and snow shovels! Brighton Bone Zone is waiting for us, let's break out!";
            default:
                return "Keep your chin up. We'll post bail and get back up Big Cottonwood Canyon in no time.";
        }
    };
    // 1. Post Bail with Prayers
    const handlePostCashBail = () => {
        const cost = Math.min(100, carState.prayersCount);
        setPendingPrayersDelta(-cost);
        setReleaseNote(`Bail of ${cost} Prayers posted with the County Clerk! Property returned: 1x ${board.name} snowboard, 1x roof rack, 1x ignition keys. Released back to SR-190!`);
        triggerRelease();
    };
    // 2. Call Milosport
    const handleStartMiloCall = () => {
        setJailTab('call_milo');
        setMiloCallStep('ringing');
        setTimeout(() => {
            setMiloCallStep('talking');
        }, 1800);
    };
    const handleFinishMiloBail = () => {
        setMiloCallStep('bailed');
        setPendingPrayersDelta(50);
        setReleaseNote(`Trevor & the Milosport crew arrived at the 900 West sally port in the shop van with cash and a fresh batch of wax! Charges dismissed on local shop karma!`);
        triggerRelease();
    };
    // 3. Squats mini-game
    const handleDoSquat = () => {
        if (isSquatting || squatCount >= 10)
            return;
        setIsSquatting(true);
        const next = squatCount + 1;
        setSquatCount(next);
        setTimeout(() => {
            setIsSquatting(false);
        }, 200);
        if (next >= 10) {
            setTimeout(() => {
                setPendingPrayersDelta(75);
                setReleaseNote(`Guard opens the heavy steel cell door: "Impressive quad stamina, inmate. 10 deep snowboard squats logged on security cams. Sentence commuted for good behavior and extreme stoke!"`);
                triggerRelease();
            }, 500);
        }
    };
    // 4. Pro Lawyer Call
    const handleCallLawyer = () => {
        setJailTab('lawyer');
        setLawyerStep('calling');
        setTimeout(() => {
            setLawyerStep('dismissed');
            setPendingPrayersDelta(100);
            setReleaseNote(`${rider.name}'s action-sports attorney petitioned the 3rd District Court: "My clients were performing an essential cultural powder pilgrimage!" Judge dismissed all charges with immediate release!`);
            triggerRelease();
        }, 2200);
    };
    // 5. Monopoly Get Out of Jail Free Card
    const handlePlayGetOutOfJailCard = () => {
        setPendingPrayersDelta(200);
        setReleaseNote('🎲 OFFICIAL MONOPOLY "GET OUT OF JAIL FREE" CARD PLAYED! You whipped out a vintage Parker Brothers Chance Card from your snowboard bib: "This card may be kept until needed or sold." The county judge honors the classic board game rules: charges dropped, sally port opened, and here is your $200 (200 Prayers) for passing GO!');
        triggerRelease();
    };
    const triggerRelease = () => {
        setReleased(true);
        try {
            confetti({
                particleCount: 50,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#38bdf8', '#34d399', '#facc15', '#f87171']
            });
        }
        catch {
            // Fallback
        }
    };
    const handleReturnToCanyon = () => {
        onRelease(pendingPrayersDelta);
    };
    return (_jsx("div", { className: "absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-mono select-none animate-fadeIn", children: _jsxs("div", { className: "relative max-w-2xl w-full bg-slate-900 border-4 border-amber-600/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-10 pointer-events-none", style: {
                        backgroundImage: 'repeating-linear-gradient(90deg, #94a3b8, #94a3b8 10px, transparent 10px, transparent 48px)'
                    } }), _jsxs("div", { className: "flex items-center justify-between border-b-2 border-slate-800 pb-3 relative z-10", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2.5 rounded-2xl bg-amber-950 border border-amber-500 text-amber-400 shadow-md", children: _jsx(Lock, { className: "w-6 h-6 animate-pulse" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs sm:text-sm font-black text-amber-400 uppercase tracking-widest", children: "SALT LAKE COUNTY METRO JAIL" }), _jsx("span", { className: "px-2 py-0.5 rounded bg-red-950 border border-red-600 text-[10px] font-bold text-red-300", children: "BOOKING CELL 4B" })] }), _jsx("span", { className: "text-[11px] text-slate-400", children: "3365 South 900 West, Salt Lake City \u2022 Inmate Holding Division" })] })] }), _jsxs("div", { className: "hidden sm:flex flex-col items-end", children: [_jsx("span", { className: "text-[10px] text-slate-500 uppercase", children: "CASE FILE:" }), _jsx("span", { className: "text-xs font-bold text-slate-300 font-mono", children: "#SLCO-BCC-417" })] })] }), _jsxs("div", { className: "relative z-10 p-3 rounded-2xl bg-amber-950/80 border-2 border-amber-500/90 flex items-center justify-between gap-3 shadow-md", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: "text-2xl animate-bounce", children: "\uD83C\uDFB2" }), _jsxs("div", { children: [_jsx("span", { className: "text-xs sm:text-sm font-black text-amber-300 block tracking-wide", children: "GO DIRECTLY TO JAIL \u2022 DO NOT PASS GO \u2022 DO NOT COLLECT $200!" }), _jsx("span", { className: "text-[10px] text-amber-200/80 font-mono", children: "Official Wasatch Board Rule: Inmate forfeited $200 / 200 Prayers for speeding towards Brighton." })] })] }), _jsx("span", { className: "hidden sm:inline-block px-2.5 py-1 rounded-lg bg-amber-900 border border-amber-400 text-amber-200 text-[10px] font-black uppercase whitespace-nowrap", children: "JUST VISITING? NOPE." })] }), _jsxs("div", { className: "relative z-10 bg-slate-950 rounded-2xl border-2 border-slate-800 p-4 flex flex-col sm:flex-row items-center gap-4", children: [_jsxs("div", { className: "relative w-36 h-40 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col items-center justify-end shrink-0 shadow-inner", children: [_jsxs("div", { className: "absolute top-2 left-2 text-[9px] text-slate-600 font-mono leading-3 select-none", children: [_jsx("div", { children: "- 6'4\"" }), _jsx("div", { children: "- 6'2\"" }), _jsx("div", { children: "- 6'0\"" }), _jsx("div", { children: "- 5'10\"" }), _jsx("div", { children: "- 5'8\"" }), _jsx("div", { children: "- 5'6\"" })] }), _jsxs("div", { className: "relative z-10 flex flex-col items-center", children: [_jsx("div", { className: "text-3xl mb-1", children: rider.iconEmoji }), _jsx("div", { className: "w-16 h-12 bg-amber-700/80 rounded-t-xl border border-amber-500/50 flex items-center justify-center", children: _jsx("span", { className: "text-[9px] font-black text-slate-950 uppercase tracking-tighter", children: "SLCO INMATE" }) })] }), _jsxs("div", { className: "w-full bg-slate-950 border-t border-slate-700 py-1 text-center font-mono text-[8px] text-slate-300", children: [_jsxs("div", { className: "font-bold text-amber-400 truncate px-1", children: [rider.name.toUpperCase(), " & DRIVER"] }), _jsx("div", { className: "text-slate-500", children: "ID: 84119-POWDER" })] })] }), _jsxs("div", { className: "flex-1 space-y-2 text-xs text-left w-full", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-800/80 pb-1.5", children: [_jsx("span", { className: "text-slate-400 font-bold uppercase text-[10px]", children: "CHARGES FILED:" }), _jsx("span", { className: "text-red-400 font-bold truncate max-w-[240px]", children: carState.arrestReason || 'Reckless Canyon Speeding & Evading UHP' })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-[11px]", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-500 block text-[9px] uppercase", children: "IMPOUNDED RIG:" }), _jsx("span", { className: "text-slate-300 font-semibold", children: "Subaru Wagon & Yakima Rack" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 block text-[9px] uppercase", children: "CONFISCATED GEAR:" }), _jsxs("span", { className: "text-cyan-400 font-semibold truncate block", children: [board.name, " (154cm)"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 block text-[9px] uppercase", children: "ARRESTING OFFICER:" }), _jsx("span", { className: "text-slate-300", children: "Trooper Dave Miller (UHP)" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 block text-[9px] uppercase", children: "BAIL BOND:" }), _jsx("span", { className: "text-amber-400 font-bold", children: "100 Prayers (or Shop Bail)" })] })] }), _jsxs("div", { className: "bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl text-[11px] text-slate-300 italic", children: [_jsxs("span", { className: "text-emerald-400 font-bold not-italic block mb-0.5", children: [rider.name, " (", rider.nickname, ") in holding cell:"] }), "\"", getProJailQuote(), "\""] })] })] }), released ? (_jsxs("div", { className: "relative z-10 bg-emerald-950/80 border-2 border-emerald-500 p-4 rounded-2xl space-y-3 animate-fadeIn text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 text-emerald-400 font-black text-sm uppercase", children: [_jsx(CheckCircle2, { className: "w-5 h-5" }), _jsx("span", { children: "OFFICIAL BAIL GRANTED \u2022 SALLY PORT OPEN!" })] }), _jsx("p", { className: "text-xs text-slate-200 leading-relaxed font-mono max-w-lg mx-auto", children: releaseNote }), pendingPrayersDelta !== 0 && (_jsx("div", { className: `text-xs font-bold ${pendingPrayersDelta > 0 ? 'text-cyan-300' : 'text-amber-300'}`, children: pendingPrayersDelta > 0
                                ? `+${pendingPrayersDelta} Wasatch Prayers Bonus (Shop Loyalty)!`
                                : `${pendingPrayersDelta} Prayers bail bond processed.` })), _jsxs("button", { onClick: handleReturnToCanyon, className: "w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-ice cursor-pointer transform hover:scale-[1.01] transition-all", children: [_jsx("span", { children: "GRAB SNOWBOARD, KEYS & SPEED BACK UP SR-190!" }), _jsx(ArrowRight, { className: "w-4 h-4 stroke-[3]" })] })] })) : (
                /* JAIL RELEASE CHOICES / MINI-GAMES */
                _jsxs("div", { className: "relative z-10 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[11px] text-slate-400 uppercase tracking-wider", children: "Select your bail or release strategy:" }), _jsxs("span", { className: "text-xs text-amber-400 font-bold", children: ["Your Prayers: ", carState.prayersCount] })] }), jailTab === 'call_milo' ? (_jsxs("div", { className: "bg-slate-950 p-4 rounded-2xl border border-sky-600/60 space-y-3 text-xs animate-fadeIn", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-sky-400 font-bold", children: [_jsx(Phone, { className: "w-4 h-4" }), _jsx("span", { children: "COLLECT CALL: MILOSPORT (3119 E 3300 S)" })] }), _jsx("button", { onClick: () => setJailTab('booking'), className: "text-[11px] text-slate-400 hover:text-white cursor-pointer underline", children: "\u2190 Other options" })] }), miloCallStep === 'ringing' && (_jsxs("div", { className: "py-4 text-center space-y-2", children: [_jsx("div", { className: "text-sky-300 text-sm animate-pulse", children: "\uD83D\uDCDE *Dialing 801-487-8600... Ring... Ring...*" }), _jsx("div", { className: "text-slate-400 text-xs", children: "\"Connecting collect call from inmate at SL County Jail...\"" })] })), miloCallStep === 'talking' && (_jsxs("div", { className: "bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-2", children: [_jsxs("p", { className: "text-slate-200 leading-relaxed italic", children: ["\"Yo, Milosport! Trevor on the counter... Wait, what?! You and ", rider.name, " got locked up in Salt Lake County for speed-running the S-Curves?! Don't worry, Peter Line and I just grabbed cash from the register and the shop van is rolling over right now. We got your bail covered!\""] }), _jsx("button", { onClick: handleFinishMiloBail, className: "w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase cursor-pointer transition-all shadow-glow-ice", children: "ACCEPT MILOSPORT SHOP BAIL BOND & RELEASE!" })] }))] })) : jailTab === 'squats' ? (_jsxs("div", { className: "bg-slate-950 p-4 rounded-2xl border border-amber-600/60 space-y-3 text-xs animate-fadeIn", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-amber-400 font-bold", children: [_jsx(Flame, { className: "w-4 h-4 text-amber-400" }), _jsx("span", { children: "GOOD BEHAVIOR: 10 CELL SNOWBOARD SQUATS" })] }), _jsx("button", { onClick: () => setJailTab('booking'), className: "text-[11px] text-slate-400 hover:text-white cursor-pointer underline", children: "\u2190 Other options" })] }), _jsx("div", { className: "text-slate-300 text-xs", children: "Train your quads for bottomless powder while passing inspection! Tap the workout button 10 times to complete your physical fitness sentence." }), _jsx("div", { className: "w-full bg-slate-900 rounded-full h-3 border border-slate-700 overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-200", style: { width: `${(squatCount / 10) * 100}%` } }) }), _jsxs("div", { className: "flex items-center justify-between text-xs font-mono", children: [_jsxs("span", { children: ["SQUATS COMPLETED: ", _jsxs("strong", { className: "text-amber-400", children: [squatCount, " / 10"] })] }), _jsx("span", { className: "text-slate-400", children: squatCount >= 10 ? 'GOAL REACHED! 🎉' : `${10 - squatCount} remaining` })] }), _jsxs("button", { onClick: handleDoSquat, disabled: squatCount >= 10, className: `w-full py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all transform ${isSquatting
                                        ? 'scale-95 bg-amber-500 text-slate-950'
                                        : 'bg-amber-600 hover:bg-amber-500 text-slate-950'}`, children: [_jsx(Flame, { className: "w-4 h-4" }), _jsxs("span", { children: ["DO CELL SQUAT #", squatCount + 1, " \uD83D\uDCAA"] })] })] })) : jailTab === 'lawyer' ? (_jsxs("div", { className: "bg-slate-950 p-4 rounded-2xl border border-emerald-600/60 space-y-3 text-xs animate-fadeIn", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-emerald-400 font-bold", children: [_jsx(Award, { className: "w-4 h-4" }), _jsxs("span", { children: [rider.name.toUpperCase(), "'S ACTION-SPORTS ATTORNEY"] })] }), _jsx("button", { onClick: () => setJailTab('booking'), className: "text-[11px] text-slate-400 hover:text-white cursor-pointer underline", children: "\u2190 Other options" })] }), _jsxs("div", { className: "py-4 text-center space-y-2", children: [_jsxs("div", { className: "text-emerald-300 text-sm animate-pulse", children: ["\u2696\uFE0F ", lawyerStep === 'calling' ? 'Filing emergency motion for Wasatch powder dispensation...' : 'Motion granted by 3rd District Court!'] }), _jsx("div", { className: "text-slate-400 text-xs", children: "\"Judge is a lifelong Brighton season passholder reviewing the petition...\"" })] })] })) : (
                        /* DEFAULT 4 ACTION CARDS */
                        _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5", children: [_jsxs("button", { onClick: handlePostCashBail, disabled: carState.prayersCount < 50, className: "p-3.5 rounded-2xl bg-amber-950/60 border border-amber-600/60 hover:border-amber-400 text-left transition-all hover:bg-amber-900/60 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex flex-col justify-between gap-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-bold text-amber-200 flex items-center gap-1.5", children: [_jsx(Coins, { className: "w-4 h-4 text-amber-400" }), _jsx("span", { children: "Post Prayers Bail" })] }), _jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 font-bold", children: "-100 PRAYERS" })] }), _jsx("p", { className: "text-[11px] text-slate-300 leading-snug", children: "Pay official cash bail to the county desk for immediate release back to your car." })] }), _jsxs("button", { onClick: handleStartMiloCall, className: "p-3.5 rounded-2xl bg-sky-950/60 border border-sky-600/60 hover:border-sky-400 text-left transition-all hover:bg-sky-900/60 cursor-pointer flex flex-col justify-between gap-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-bold text-sky-200 flex items-center gap-1.5", children: [_jsx(Phone, { className: "w-4 h-4 text-sky-400" }), _jsx("span", { children: "Collect Call to Milo" })] }), _jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-sky-900/80 text-sky-300 font-bold", children: "FREE BOND" })] }), _jsx("p", { className: "text-[11px] text-slate-300 leading-snug", children: "Call 3119 E 3300 S! Trevor & Peter Line will drive the shop van over to bail you out." })] }), _jsxs("button", { onClick: () => setJailTab('squats'), className: "p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-400 text-left transition-all hover:bg-slate-800 cursor-pointer flex flex-col justify-between gap-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-bold text-slate-200 flex items-center gap-1.5", children: [_jsx(Flame, { className: "w-4 h-4 text-emerald-400" }), _jsx("span", { children: "10 Cell Squats" })] }), _jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold", children: "MINI-GAME" })] }), _jsx("p", { className: "text-[11px] text-slate-400 leading-snug", children: "Earn release through physical fitness! Do 10 rapid snowboard squats to impress the guards." })] }), _jsxs("button", { onClick: handleCallLawyer, className: "p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 hover:border-emerald-400 text-left transition-all hover:bg-emerald-900/60 cursor-pointer flex flex-col justify-between gap-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-bold text-emerald-200 flex items-center gap-1.5", children: [_jsx(Award, { className: "w-4 h-4 text-emerald-400" }), _jsxs("span", { children: [rider.name.split(' ')[0], "'s Lawyer"] })] }), _jsx("span", { className: "text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-bold", children: "LEGAL CLOUT" })] }), _jsx("p", { className: "text-[11px] text-slate-300 leading-snug", children: "Have your pro passenger call their snow industry sports agent to get charges dropped!" })] }), _jsxs("button", { onClick: handlePlayGetOutOfJailCard, className: "sm:col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950 via-yellow-950/80 to-amber-950 border-2 border-amber-400 hover:border-amber-300 text-left transition-all hover:scale-[1.01] cursor-pointer shadow-lg flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-2xl p-2 rounded-xl bg-amber-900/90 border border-amber-500", children: "\uD83C\uDFB2" }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-black text-amber-300 uppercase tracking-wide text-xs sm:text-sm", children: "PLAY \"GET OUT OF JAIL FREE\" CARD" }), _jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black", children: "+COLLECT $200!" })] }), _jsx("p", { className: "text-[11px] text-slate-300 leading-snug", children: "\"This card may be kept until needed or sold.\" Pull the vintage Parker Brothers Chance card from your jacket pocket!" })] })] }), _jsx(Sparkles, { className: "w-5 h-5 text-amber-400 shrink-0 animate-spin", style: { animationDuration: '6s' } })] })] }))] }))] }) }));
};
