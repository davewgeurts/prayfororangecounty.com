import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { CAMERA_VIEW, DRIVE_MODE, EXPERIENCE_PHASE, CANYON_LANDMARKS } from '../../types/game';
import { CanyonRoute } from '../../utils/canyonRoute';
import { CanyonAudioEngine } from '../../utils/audioEngine';
import { TopDownView } from './TopDownView';
import { CockpitView } from './CockpitView';
import { SilentRockCard } from './SilentRockCard';
import { BrightonArrivalCard } from './BrightonArrivalCard';
import { BrightonSkiFree } from '../SkiFree/BrightonSkiFree';
import { MilosportShopScreen } from '../Milosport/MilosportShopScreen';
import { PassengerDialogue } from './PassengerDialogue';
import { TractionLawCheckpointModal } from './TractionLawCheckpointModal';
import { CopPullOverModal } from './CopPullOverModal';
import { SaltLakeCountyJailModal } from './SaltLakeCountyJailModal';
import { SwigDriveThruModal } from '../CityStops/SwigDriveThruModal';
import { WhaleRoundaboutModal } from '../CityStops/WhaleRoundaboutModal';
import { SevenElevenGasModal } from '../CityStops/SevenElevenGasModal';
import { X96StudioModal } from '../CityStops/X96StudioModal';
import { SNOWBOARDS_LIST, RIDERS_LIST } from '../../data/snowboardGear';
import confetti from 'canvas-confetti';
import { Radio, Eye, Compass, Gauge, Fuel, Volume2, VolumeX, Play, RotateCcw, Sparkles, Store, Siren, Lock, SkipForward, Menu, X } from 'lucide-react';
const RANDOM_COP_REASONS = [
    "Clocked 54 MPH in a 35 MPH Canyon Zone near Maxfield Hydro",
    "Excessive Speed & Snowboard Rattling on Yakima Roof Rack",
    "Blasting 90s Mountain Hip-Hop & Shaking Powder off Pine Needles",
    "Aggressive Slalom Carving Across Double Yellow Lines",
    "Suspected Unlicensed Powder Chasing on SR-190",
    "Tailgating a Tourist Rental Car with Florida Plates in Snowstorm",
    "Suspiciously Fresh Fluorocarbon Wax Glistening on Roof Deck"
];
export const CanyonDriveContainer = () => {
    const [phase, setPhase] = useState(EXPERIENCE_PHASE.MILOSPORT_SHOP);
    const [selectedBoardId, setSelectedBoardId] = useState('forum-destroyer');
    const [selectedRiderId, setSelectedRiderId] = useState('jp-walker');
    const [cameraView, setCameraView] = useState(CAMERA_VIEW.GTA_TOP_DOWN);
    const [driveMode, setDriveMode] = useState(DRIVE_MODE.AUTOPILOT);
    const [radioStatus, setRadioStatus] = useState(() => CanyonAudioEngine.get().getRadioStatus());
    const [audioStarted, setAudioStarted] = useState(false);
    // Mobile-only: collapses the header action buttons behind a hamburger below the lg breakpoint
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [carState, setCarState] = useState({
        x: 0,
        y: 0,
        angle: 0,
        speed: 35,
        steering: 0,
        distanceMiles: 0.0,
        elevationFt: 4620,
        driveMode: DRIVE_MODE.AUTOPILOT,
        cameraView: CAMERA_VIEW.GTA_TOP_DOWN,
        radioMuted: false,
        wipersActive: true,
        headlights: true,
        silenceObserved: false,
        prayersCount: 1337,
        selectedBoardId: 'forum-destroyer',
        selectedRiderId: 'jp-walker',
        tireOptionId: 'snow_tires',
        hasTractionPass: false,
        purchasedPassIds: [],
        waxScore: 0,
        waxFormulaId: 'all_temp_purple',
        waxSpeedMultiplier: 1.0,
        isPulledOver: false,
        pulledOverReason: '',
        copEncounterCount: 0,
        fuelLevel: 25,
        fuelGrade: '85',
        hasGasDashChase: false,
        chaseSecondsLeft: 0
    });
    const keysDownRef = useRef({});
    const carStateRef = useRef(carState);
    const lastCopMileRef = useRef(-10);
    const lastCopRollTimeRef = useRef(0);
    useEffect(() => {
        carStateRef.current = carState;
    }, [carState]);
    // Keep the HUD and dashboard tape deck in sync with X96 / Wasatch Radio
    useEffect(() => {
        return CanyonAudioEngine.get().subscribeRadio(status => {
            setRadioStatus(status);
            const next = {
                ...carStateRef.current,
                radioStationLabel: status.label,
                radioNowPlaying: status.nowPlaying
            };
            carStateRef.current = next;
            setCarState(next);
        });
    }, []);
    // Start audio on first user interaction
    const initAudio = useCallback(() => {
        if (!audioStarted) {
            CanyonAudioEngine.get().init();
            setAudioStarted(true);
        }
    }, [audioStarted]);
    const triggerCopPullOver = useCallback((customReason) => {
        initAudio();
        CanyonAudioEngine.get().playPoliceSiren();
        const reason = customReason || RANDOM_COP_REASONS[Math.floor(Math.random() * RANDOM_COP_REASONS.length)];
        lastCopMileRef.current = carStateRef.current.distanceMiles;
        setCarState(prev => {
            const next = {
                ...prev,
                isPulledOver: true,
                pulledOverReason: reason,
                copEncounterCount: (prev.copEncounterCount || 0) + 1
            };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleResolvePullOver = useCallback((prayerBonusOrCost) => {
        initAudio();
        setCarState(prev => {
            const next = {
                ...prev,
                isPulledOver: false,
                prayersCount: Math.max(0, prev.prayersCount + prayerBonusOrCost),
                speed: 42
            };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const triggerArrest = useCallback((customReason) => {
        initAudio();
        CanyonAudioEngine.get().playJailDoorSlam();
        const reason = customReason || "Reckless Canyon Speeding & Evading State Patrol";
        setCarState(prev => {
            const next = {
                ...prev,
                isPulledOver: false,
                isArrested: true,
                arrestReason: reason,
                arrestCount: (prev.arrestCount || 0) + 1,
                speed: 0
            };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleReleaseFromJail = useCallback((prayerBonusOrCost) => {
        initAudio();
        CanyonAudioEngine.get().playBailBuzzer();
        setCarState(prev => {
            const next = {
                ...prev,
                isArrested: false,
                prayersCount: Math.max(0, prev.prayersCount + prayerBonusOrCost),
                speed: 35
            };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleTriggerSwig = useCallback(() => {
        initAudio();
        setCarState(prev => {
            const next = { ...prev, isAtSwig: true, isAtWhale: false, isAtX96: false, speed: 0 };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleFinishSwig = useCallback((drinkName, prayerBonus) => {
        initAudio();
        setCarState(prev => {
            const next = {
                ...prev,
                isAtSwig: false,
                hasSwigBuff: true,
                swigDrinkName: drinkName,
                prayersCount: prev.prayersCount + prayerBonus,
                speed: 48
            };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleTriggerWhale = useCallback(() => {
        initAudio();
        setCarState(prev => {
            const next = { ...prev, isAtWhale: true, isAtSwig: false, isAtX96: false, speed: 0 };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleFinishWhale = useCallback((prayerBonus) => {
        initAudio();
        setCarState(prev => {
            const next = {
                ...prev,
                isAtWhale: false,
                hasWhaleBlessing: true,
                prayersCount: prev.prayersCount + prayerBonus,
                speed: 45
            };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleTrigger711 = useCallback(() => {
        initAudio();
        setCarState(prev => {
            const next = { ...prev, isAt711: true, isAtSwig: false, isAtWhale: false, isAtX96: false, speed: 0 };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handlePayAndCruise711 = useCallback((fuelPercent, fuelGrade, _gallons, snack, bonusPrayers) => {
        initAudio();
        setCarState(prev => {
            const next = {
                ...prev,
                isAt711: false,
                fuelLevel: fuelPercent,
                fuelGrade,
                snackItemName: snack,
                prayersCount: prev.prayersCount + bonusPrayers,
                speed: 38
            };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleGasAndDash711 = useCallback((fuelPercent, _gallons, snack) => {
        initAudio();
        setCarState(prev => {
            const next = {
                ...prev,
                isAt711: false,
                hasGasDashChase: true,
                chaseSecondsLeft: 25,
                fuelLevel: fuelPercent,
                snackItemName: snack,
                speed: 65
            };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleTriggerX96 = useCallback(() => {
        initAudio();
        setCarState(prev => {
            const next = { ...prev, isAtX96: true, isAtSwig: false, isAtWhale: false, isAt711: false, speed: 0 };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    const handleFinishX96 = useCallback((prayerBonus, prizePassId, claimedPrize) => {
        initAudio();
        const engine = CanyonAudioEngine.get();
        if (engine.getRadioStatus().station !== 'x96')
            engine.tuneStation('x96');
        setCarState(prev => {
            const next = {
                ...prev,
                isAtX96: false,
                hasX96Prize: prev.hasX96Prize || claimedPrize,
                purchasedPassIds: prizePassId && !prev.purchasedPassIds.includes(prizePassId)
                    ? [...prev.purchasedPassIds, prizePassId]
                    : prev.purchasedPassIds,
                prayersCount: prev.prayersCount + prayerBonus,
                speed: 40
            };
            carStateRef.current = next;
            return next;
        });
    }, [initAudio]);
    // Key listeners for manual driving
    useEffect(() => {
        const onKeyDown = (e) => {
            initAudio();
            keysDownRef.current[e.key] = true;
        };
        const onKeyUp = (e) => {
            keysDownRef.current[e.key] = false;
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [initAudio]);
    // Main vehicle physics & drive loop (60 FPS). Only runs on the road: the car stays
    // parked (no movement, no random UHP stops) while you're in Milo or riding Brighton.
    useEffect(() => {
        if (phase !== EXPERIENCE_PHASE.DRIVE_CANYON)
            return;
        let animId;
        let lastTime = performance.now();
        const updateLoop = (now) => {
            const dt = Math.min(0.1, (now - lastTime) / 1000);
            lastTime = now;
            const current = carStateRef.current;
            const atCheckpoint = current.distanceMiles >= 1.0 && current.distanceMiles <= 1.4 && !current.hasTractionPass;
            const isPulledOver = !!current.isPulledOver;
            const isAtStop = !!current.isAtSwig || !!current.isAtWhale || !!current.isAt711 || !!current.isAtX96;
            const isChased = !!current.hasGasDashChase;
            const swigMultiplier = current.hasSwigBuff ? 1.25 : 1.0;
            const whaleMultiplier = current.hasWhaleBlessing ? 1.15 : 1.0;
            const waxMultiplier = (current.waxSpeedMultiplier || 1.0) * swigMultiplier * whaleMultiplier;
            // 1. Process Steering & Acceleration
            if (driveMode === DRIVE_MODE.AUTOPILOT) {
                // Autopilot cruise mode: follows road curvature smoothly
                const roadCurvature = CanyonRoute.getRoadCurvature(current.distanceMiles);
                current.steering = roadCurvature * 0.7;
                current.angle = CanyonRoute.getRoadPosition(current.distanceMiles).angle;
                if (isPulledOver || atCheckpoint || isAtStop) {
                    // Bring car to a complete stop for UHP pullover / inspection / stops
                    current.speed = Math.max(0, current.speed - dt * 35);
                }
                else if (isChased) {
                    // Floor it during high-speed police chase!
                    current.speed = Math.min(68, current.speed + dt * 20);
                }
                else if (CanyonRoute.isSilentRockZone(current.distanceMiles)) {
                    // In Silent Rock zone, slow down to a respectful 10 MPH crawl
                    current.speed = Math.max(10, current.speed - dt * 20);
                }
                else {
                    current.speed = Math.min(38 * waxMultiplier, current.speed + dt * 10);
                }
            }
            else {
                // Manual steering mode
                if (keysDownRef.current['ArrowLeft'] || keysDownRef.current['a'] || keysDownRef.current['A']) {
                    current.steering = Math.max(-1, current.steering - dt * 3);
                }
                else if (keysDownRef.current['ArrowRight'] || keysDownRef.current['d'] || keysDownRef.current['D']) {
                    current.steering = Math.min(1, current.steering + dt * 3);
                }
                else {
                    current.steering *= 0.85; // return to center
                }
                if (isPulledOver || atCheckpoint || isAtStop) {
                    // Bring car to a complete stop for UHP pullover / inspection / stops
                    current.speed = Math.max(0, current.speed - dt * 35);
                }
                else if (keysDownRef.current['ArrowUp'] || keysDownRef.current['w'] || keysDownRef.current['W']) {
                    const maxSpeed = isChased ? 72 : 60 * waxMultiplier;
                    current.speed = Math.min(maxSpeed, current.speed + dt * (isChased ? 30 : 25));
                }
                else if (keysDownRef.current['ArrowDown'] || keysDownRef.current['s'] || keysDownRef.current['S']) {
                    current.speed = Math.max(0, current.speed - dt * 35);
                }
                else {
                    current.speed = Math.max(0, current.speed - dt * 4); // coasting friction
                }
                // Steer car angle
                current.angle += current.steering * dt * (current.speed / 25);
            }
            // High-speed Gas & Dash pursuit timer & capture / evasion logic
            if (current.hasGasDashChase) {
                current.chaseSecondsLeft = Math.max(0, (current.chaseSecondsLeft || 25) - dt);
                // If player slows down below 24 MPH, cops box them in!
                if (current.speed < 24 && !isAtStop && !atCheckpoint) {
                    current.hasGasDashChase = false;
                    triggerArrest('Boxed in by UHP: $48.50 Fuel Theft at 7-Eleven & Felony High-Speed Evading');
                }
                else if (current.chaseSecondsLeft <= 0 || current.distanceMiles >= 7.8) {
                    // Player escaped into the blizzard / S-Curves!
                    current.hasGasDashChase = false;
                    current.evadedCopCount = (current.evadedCopCount || 0) + 1;
                    current.prayersCount += 600;
                    try {
                        confetti({
                            particleCount: 60,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#ef4444', '#3b82f6', '#ffffff', '#38bdf8']
                        });
                    }
                    catch {
                        // fallback
                    }
                }
            }
            // Check for random cop pull-over encounter (between Mile 1.8 and 13.8)
            if (!current.isPulledOver &&
                !current.isArrested &&
                !current.isAtSwig &&
                !current.isAtWhale &&
                !current.isAt711 &&
                !current.isAtX96 &&
                !current.hasGasDashChase &&
                !atCheckpoint &&
                current.distanceMiles >= 1.8 &&
                current.distanceMiles <= 13.8 &&
                !CanyonRoute.isSilentRockZone(current.distanceMiles) &&
                current.distanceMiles - lastCopMileRef.current >= 3.0 &&
                now - lastCopRollTimeRef.current >= 4000) {
                lastCopRollTimeRef.current = now;
                const isSpeeding = current.speed > 42;
                const pullOverChance = isSpeeding ? 0.08 : 0.025;
                if (Math.random() < pullOverChance) {
                    triggerCopPullOver(isSpeeding ? `Clocked ${Math.round(current.speed)} MPH in a 35 MPH Canyon Zone` : undefined);
                }
            }
            // 2. Advance miles up canyon based on speed
            const simSpeedMultiplier = 1.8;
            const milesDelta = (current.speed / 3600) * dt * simSpeedMultiplier;
            current.distanceMiles = Math.min(CanyonRoute.TOTAL_MILES, current.distanceMiles + milesDelta);
            // 3. Elevation & Road Position
            current.elevationFt = CanyonRoute.getElevation(current.distanceMiles);
            const roadPos = CanyonRoute.getRoadPosition(current.distanceMiles);
            current.x = roadPos.x;
            current.y = roadPos.y;
            // 4. Silent Rock zone check & radio muting
            const inSilentZone = CanyonRoute.isSilentRockZone(current.distanceMiles);
            if (inSilentZone !== current.radioMuted) {
                current.radioMuted = inSilentZone;
                CanyonAudioEngine.get().setSilentRockSilence(inSilentZone);
            }
            // Audio engine speed modulation
            CanyonAudioEngine.get().updateCarSpeed(current.speed);
            setCarState({ ...current });
            animId = requestAnimationFrame(updateLoop);
        };
        animId = requestAnimationFrame(updateLoop);
        return () => cancelAnimationFrame(animId);
    }, [phase, driveMode, triggerCopPullOver, triggerArrest]);
    const handleOfferPrayer = () => {
        initAudio();
        CanyonAudioEngine.get().playShrineChime();
        // Trigger glowing snowflake confetti
        try {
            confetti({
                particleCount: 45,
                spread: 70,
                origin: { y: 0.8 },
                colors: ['#38bdf8', '#00f0ff', '#ffffff', '#e0f2fe']
            });
        }
        catch {
            // Confetti fallback
        }
        carStateRef.current.prayersCount += 1;
        carStateRef.current.silenceObserved = true;
        setCarState({ ...carStateRef.current });
    };
    const handleToggleRadio = () => {
        initAudio();
        CanyonAudioEngine.get().toggleRadio();
    };
    const handleTuneRadio = () => {
        initAudio();
        CanyonAudioEngine.get().cycleRadioStation();
    };
    const handleTeleport = (mile) => {
        initAudio();
        carStateRef.current.distanceMiles = mile;
        carStateRef.current.elevationFt = CanyonRoute.getElevation(mile);
        carStateRef.current.radioMuted = CanyonRoute.isSilentRockZone(mile);
        CanyonAudioEngine.get().setSilentRockSilence(carStateRef.current.radioMuted);
        setCarState({ ...carStateRef.current });
    };
    const currentLandmark = CanyonRoute.getCurrentLandmark(carState.distanceMiles);
    const isSilentZone = CanyonRoute.isSilentRockZone(carState.distanceMiles);
    const atBrighton = carState.distanceMiles >= 14.2;
    const activeBoard = SNOWBOARDS_LIST.find(b => b.id === selectedBoardId) || SNOWBOARDS_LIST[0];
    const activeRider = RIDERS_LIST.find(r => r.id === selectedRiderId) || RIDERS_LIST[0];
    if (phase === EXPERIENCE_PHASE.MILOSPORT_SHOP) {
        return (_jsx(MilosportShopScreen, { selectedBoardId: selectedBoardId, selectedRiderId: selectedRiderId, tireOptionId: carState.tireOptionId, purchasedPassIds: carState.purchasedPassIds, waxScore: carState.waxScore, waxFormulaId: carState.waxFormulaId, waxSpeedMultiplier: carState.waxSpeedMultiplier, prayersCount: carState.prayersCount, onSelectBoard: (id) => {
                setSelectedBoardId(id);
                setCarState(c => {
                    const next = { ...c, selectedBoardId: id };
                    carStateRef.current = next;
                    return next;
                });
            }, onSelectRider: (id) => {
                setSelectedRiderId(id);
                setCarState(c => {
                    const next = { ...c, selectedRiderId: id };
                    carStateRef.current = next;
                    return next;
                });
            }, onSelectTire: (tireId) => {
                setCarState(c => {
                    const next = { ...c, tireOptionId: tireId, hasTractionPass: false };
                    carStateRef.current = next;
                    return next;
                });
            }, onBuyPass: (passId) => {
                setCarState(c => {
                    const next = {
                        ...c,
                        purchasedPassIds: c.purchasedPassIds.includes(passId)
                            ? c.purchasedPassIds
                            : [...c.purchasedPassIds, passId]
                    };
                    carStateRef.current = next;
                    return next;
                });
            }, onApplyWaxTune: (formulaId, speedMultiplier, score) => {
                setCarState(c => {
                    const next = {
                        ...c,
                        waxFormulaId: formulaId,
                        waxSpeedMultiplier: speedMultiplier,
                        waxScore: score
                    };
                    carStateRef.current = next;
                    return next;
                });
            }, onLaunchDrive: () => {
                initAudio();
                setPhase(EXPERIENCE_PHASE.DRIVE_CANYON);
            }, onGoToSwig: () => {
                initAudio();
                setPhase(EXPERIENCE_PHASE.DRIVE_CANYON);
                handleTriggerSwig();
            }, onGoToWhale: () => {
                initAudio();
                setPhase(EXPERIENCE_PHASE.DRIVE_CANYON);
                handleTriggerWhale();
            }, onGoTo711: () => {
                initAudio();
                setPhase(EXPERIENCE_PHASE.DRIVE_CANYON);
                handleTrigger711();
            }, onGoToX96: () => {
                initAudio();
                setPhase(EXPERIENCE_PHASE.DRIVE_CANYON);
                handleTriggerX96();
            } }));
    }
    if (phase === EXPERIENCE_PHASE.BRIGHTON_SKIFREE) {
        return (_jsx(BrightonSkiFree, { onReturnToDrive: () => setPhase(EXPERIENCE_PHASE.DRIVE_CANYON), selectedBoardId: selectedBoardId, selectedRiderId: selectedRiderId, waxSpeedMultiplier: carState.waxSpeedMultiplier, purchasedPassIds: carState.purchasedPassIds }));
    }
    return (_jsxs("div", { onClick: initAudio, className: "relative w-full h-full min-h-screen bg-alpine-bg text-alpine-text flex flex-col overflow-hidden select-none", children: [_jsxs("header", { className: "z-20 bg-slate-950/85 border-b border-alpine-border/60 px-3 py-2 lg:px-4 lg:py-3 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 lg:gap-3 text-xs font-mono", children: [_jsxs("div", { className: "flex items-center gap-3 lg:gap-4 w-full lg:w-auto min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("span", { className: "w-2.5 h-2.5 shrink-0 rounded-full bg-cyan-400 animate-ping" }), _jsxs("span", { className: "font-bold text-alpine-powder text-sm tracking-wide truncate", children: ["SR-190 \u2022 ", _jsx("span", { className: "sm:hidden", children: "BCC" }), _jsx("span", { className: "hidden sm:inline", children: "BIG COTTONWOOD CANYON" })] })] }), currentLandmark && (_jsxs("span", { className: "hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-sky-300", children: [_jsx(Compass, { className: "w-3 h-3 text-sky-400" }), _jsx("span", { children: currentLandmark.name })] })), _jsxs("button", { onClick: () => setMobileMenuOpen(o => !o), className: `lg:hidden ml-auto shrink-0 px-3 py-2 rounded-lg border flex items-center gap-1.5 font-bold cursor-pointer transition-all ${mobileMenuOpen
                                    ? 'bg-sky-900 border-sky-400 text-white'
                                    : 'bg-slate-900 border-slate-700 text-sky-300'}`, "aria-expanded": mobileMenuOpen, "aria-controls": "drive-hud-actions", title: "Show stops, radio, view and drive controls", children: [mobileMenuOpen ? _jsx(X, { className: "w-4 h-4" }) : _jsx(Menu, { className: "w-4 h-4" }), _jsx("span", { children: "MENU" })] })] }), _jsxs("div", { className: "flex items-center gap-3 lg:gap-4 w-full lg:w-auto overflow-x-auto whitespace-nowrap", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-slate-300", children: [_jsx(Gauge, { className: "w-3.5 h-3.5 text-sky-400" }), _jsxs("span", { children: ["MILE: ", _jsx("strong", { className: "text-cyan-400 font-bold", children: carState.distanceMiles.toFixed(1) }), " / 14.3"] })] }), _jsx("div", { className: "flex items-center gap-1.5 text-slate-300", children: _jsxs("span", { children: ["ELEV: ", _jsxs("strong", { className: "text-amber-400 font-bold", children: [carState.elevationFt.toLocaleString(), " FT"] })] }) }), _jsx("div", { className: "flex items-center gap-1.5 text-slate-300", children: _jsxs("span", { children: ["SPEED: ", _jsxs("strong", { className: "text-emerald-400 font-bold", children: [Math.round(carState.speed), " MPH"] })] }) }), _jsxs("div", { className: "hidden md:flex items-center gap-1.5 text-slate-300", children: [_jsx(Fuel, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsxs("span", { children: ["FUEL: ", _jsxs("strong", { className: carState.fuelLevel && carState.fuelLevel >= 60 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold', children: [carState.fuelLevel ?? 25, "%"] })] })] }), carState.hasSwigBuff && (_jsxs("div", { className: "hidden xl:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/80 text-pink-300 shadow-sm animate-pulse", children: [_jsx("span", { children: "\uD83E\uDD64" }), _jsxs("span", { className: "font-bold", children: [carState.swigDrinkName || 'Dirty Soda', " (+25% SPD)"] })] })), carState.hasWhaleBlessing && (_jsxs("div", { className: "hidden xl:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/80 text-cyan-200 shadow-sm animate-pulse", children: [_jsx("span", { children: "\uD83D\uDC0B" }), _jsx("span", { className: "font-bold", children: "WHALE BLESSED (+903\")" })] })), radioStatus.playing && !carState.radioMuted && radioStatus.source !== 'wasatch-synth' && (_jsxs("div", { className: "hidden 2xl:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-yellow-950/80 border border-yellow-500/80 text-yellow-200 shadow-sm max-w-[280px]", title: `${radioStatus.label}: ${radioStatus.nowPlaying}`, children: [_jsx("span", { children: "\uD83D\uDCFB" }), _jsx("span", { className: "font-bold shrink-0", children: radioStatus.source === 'x96-live' ? 'X96:' : 'RFH:' }), _jsx("span", { className: "truncate", children: radioStatus.nowPlaying })] }))] }), _jsxs("div", { id: "drive-hud-actions", onClick: (e) => {
                            if (e.target.closest('[data-closes-menu]'))
                                setMobileMenuOpen(false);
                        }, className: `${mobileMenuOpen ? 'grid' : 'hidden'} grid-cols-2 sm:grid-cols-3 gap-2 w-full max-h-[60vh] overflow-y-auto pt-2 border-t border-slate-800 max-lg:*:justify-center max-lg:*:py-2.5 lg:flex lg:items-center lg:w-auto lg:max-h-none lg:overflow-visible lg:pt-0 lg:border-0`, children: [_jsxs("button", { "data-closes-menu": true, onClick: () => setPhase(EXPERIENCE_PHASE.MILOSPORT_SHOP), className: "col-span-full px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-600 hover:border-emerald-400 text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer font-bold shadow-md", title: "Open Milosport Shop to swap snowboard or buddy", children: [_jsx(Store, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { children: "MILOSPORT:" }), _jsxs("span", { className: "truncate max-w-[130px]", children: [activeBoard.name.split(' ')[1] || 'Board', " \u2022 ", activeRider.name.split(' ')[0]] })] }), _jsxs("button", { "data-closes-menu": true, onClick: handleTriggerSwig, disabled: carState.isAtSwig || carState.isPulledOver || carState.isArrested, className: `px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${carState.isAtSwig
                                    ? 'bg-pink-900 border-pink-400 text-white animate-pulse'
                                    : carState.hasSwigBuff
                                        ? 'bg-pink-950/60 border-pink-700/80 hover:border-pink-400 text-pink-300'
                                        : 'bg-slate-900 border-slate-700 hover:border-pink-500 text-pink-300'}`, title: "Stop at Swig on 3300 South for a 44oz Dirty Soda & Pink Frosted Cookie", children: [_jsx("span", { children: "\uD83E\uDD64" }), _jsx("span", { children: "SWIG" })] }), _jsxs("button", { "data-closes-menu": true, onClick: handleTriggerWhale, disabled: carState.isAtWhale || carState.isPulledOver || carState.isArrested, className: `px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${carState.isAtWhale
                                    ? 'bg-cyan-900 border-cyan-400 text-white animate-pulse'
                                    : carState.hasWhaleBlessing
                                        ? 'bg-cyan-950/60 border-cyan-700/80 hover:border-cyan-400 text-cyan-200'
                                        : 'bg-slate-900 border-slate-700 hover:border-cyan-500 text-cyan-300'}`, title: "Visit the Sacred 9th & 9th Whale Roundabout Monument", children: [_jsx("span", { children: "\uD83D\uDC0B" }), _jsx("span", { children: "WHALE" })] }), _jsxs("button", { "data-closes-menu": true, onClick: handleTrigger711, disabled: carState.isAt711 || carState.isPulledOver || carState.isArrested || carState.hasGasDashChase, className: `px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${carState.isAt711
                                    ? 'bg-emerald-900 border-emerald-400 text-white animate-pulse'
                                    : carState.fuelLevel && carState.fuelLevel >= 80
                                        ? 'bg-emerald-950/60 border-emerald-700/80 hover:border-emerald-400 text-emerald-300'
                                        : 'bg-slate-900 border-slate-700 hover:border-emerald-500 text-emerald-300'}`, title: "Stop at 7-Eleven on Fort Union & Wasatch Blvd for Gas & Taquitos", children: [_jsx("span", { children: "\u26FD" }), _jsx("span", { children: "7-11 GAS" })] }), _jsxs("button", { "data-closes-menu": true, onClick: handleTriggerX96, disabled: carState.isAtX96 || carState.isPulledOver || carState.isArrested || carState.hasGasDashChase, className: `px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${carState.isAtX96
                                    ? 'bg-yellow-900 border-yellow-400 text-white animate-pulse'
                                    : carState.hasX96Prize
                                        ? 'bg-yellow-950/60 border-yellow-700/80 hover:border-yellow-400 text-yellow-200'
                                        : 'bg-slate-900 border-slate-700 hover:border-yellow-500 text-yellow-300'}`, title: "Swing by the X96 studio at 50 W Broadway to pick up your Boner of the Day lift ticket", children: [_jsx("span", { children: "\uD83D\uDCFB" }), _jsx("span", { children: "X96" })] }), _jsxs("button", { onClick: () => setCameraView(v => v === CAMERA_VIEW.GTA_TOP_DOWN ? CAMERA_VIEW.COCKPIT_WINDSHIELD : CAMERA_VIEW.GTA_TOP_DOWN), className: "px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500 text-sky-300 flex items-center gap-1.5 transition-all cursor-pointer", title: "Toggle between GTA 2 Top-Down and A-10 Windshield Cockpit", children: [_jsx(Eye, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "VIEW:" }), _jsx("span", { children: cameraView === CAMERA_VIEW.GTA_TOP_DOWN ? 'GTA2 MAP' : 'WINDSHIELD' })] }), _jsxs("button", { onClick: () => setDriveMode(m => m === DRIVE_MODE.AUTOPILOT ? DRIVE_MODE.MANUAL : DRIVE_MODE.AUTOPILOT), className: `px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${driveMode === DRIVE_MODE.AUTOPILOT
                                    ? 'bg-sky-950 border-sky-600 text-sky-200'
                                    : 'bg-emerald-950 border-emerald-600 text-emerald-200'}`, title: "Toggle Cruise / Autopilot vs Manual Keyboard Steering", children: [_jsx(Play, { className: "w-3.5 h-3.5" }), _jsx("span", { children: driveMode === DRIVE_MODE.AUTOPILOT ? 'AUTOPILOT: ON' : 'MANUAL DRIVE' })] }), _jsxs("button", { onClick: handleToggleRadio, className: `px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${carState.radioMuted
                                    ? 'bg-rose-950 border-rose-800 text-rose-300'
                                    : radioStatus.playing
                                        ? 'bg-slate-900 border-slate-700 text-cyan-300'
                                        : 'bg-slate-900 border-slate-800 text-slate-500'}`, title: `Radio power: ${radioStatus.label}${radioStatus.nowPlaying ? ` — ${radioStatus.nowPlaying}` : ''}`, children: [_jsx(Radio, { className: "w-3.5 h-3.5" }), _jsx("span", { className: "text-[10px] font-bold", children: radioStatus.station === 'x96' ? 'X96' : '90.1' }), carState.radioMuted ? (_jsx("span", { className: "text-[10px] text-rose-400", children: "SILENT" })) : radioStatus.playing ? (_jsx(Volume2, { className: "w-3 h-3 text-cyan-400" })) : (_jsx(VolumeX, { className: "w-3 h-3 text-slate-500" }))] }), _jsxs("button", { onClick: handleTuneRadio, className: "px-2 py-1.5 rounded-lg border bg-slate-900 border-slate-700 hover:border-yellow-500 text-yellow-300 flex items-center transition-all cursor-pointer", title: radioStatus.station === 'x96' ? 'Tune to Wasatch Radio 90.1' : 'Tune to X96 96.3 FM (Radio From Hell)', children: [_jsx(SkipForward, { className: "w-3.5 h-3.5" }), _jsx("span", { className: "lg:hidden ml-1.5", children: "TUNE" })] }), _jsxs("button", { "data-closes-menu": true, onClick: () => triggerCopPullOver(), disabled: carState.isPulledOver || carState.isArrested, className: `px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${carState.isPulledOver
                                    ? 'bg-red-900 border-red-500 text-white animate-pulse'
                                    : 'bg-red-950/60 border-red-800/80 hover:border-red-500 text-red-300'}`, title: "Trigger Utah Highway Patrol Speed Trap", children: [_jsx(Siren, { className: "w-3.5 h-3.5 text-red-400" }), _jsx("span", { children: "UHP TRAP" })] }), _jsxs("button", { "data-closes-menu": true, onClick: () => triggerArrest('Reckless Canyon Speeding & Street Racing to Brighton'), disabled: carState.isArrested, className: `px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${carState.isArrested
                                    ? 'bg-amber-900 border-amber-500 text-white animate-pulse'
                                    : 'bg-amber-950/60 border-amber-800/80 hover:border-amber-500 text-amber-300'}`, title: "Get Arrested & Go to Salt Lake County Jail", children: [_jsx(Lock, { className: "w-3.5 h-3.5 text-amber-400" }), _jsx("span", { children: "JAIL" })] }), _jsx("select", { value: carState.distanceMiles < 1.0 ? 0 : carState.distanceMiles < 2.5 ? 1.2 : carState.distanceMiles < 5 ? 2.9 : carState.distanceMiles < 10 ? 7.8 : carState.distanceMiles < 13 ? 11.5 : 14.3, onChange: (e) => {
                                    handleTeleport(parseFloat(e.target.value));
                                    setMobileMenuOpen(false);
                                }, "aria-label": "Jump to canyon landmark", className: "col-span-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono cursor-pointer", children: CANYON_LANDMARKS.map(l => (_jsxs("option", { value: l.mile, children: [l.mile.toFixed(1), " mi - ", l.name] }, l.id))) })] })] }), _jsxs("main", { className: "relative flex-1 w-full h-full overflow-hidden flex items-center justify-center", children: [cameraView === CAMERA_VIEW.GTA_TOP_DOWN ? (_jsx(TopDownView, { carState: carState })) : (_jsx(CockpitView, { carState: carState })), carState.hasGasDashChase && (_jsxs("div", { className: "absolute top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-950/95 via-rose-900/95 to-red-950/95 border-2 border-red-500 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 animate-pulse max-w-2xl w-full", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(Siren, { className: "w-5 h-5 text-red-400 animate-spin" }), _jsxs("div", { children: [_jsx("div", { className: "text-xs font-black text-white uppercase tracking-wider font-mono", children: "\uD83D\uDEA8 UHP CODE 3 PURSUIT: GAS & DASH AT 7-ELEVEN!" }), _jsxs("div", { className: "text-[11px] text-red-200 font-mono", children: ["Evade countdown: ", _jsxs("strong", { className: "text-amber-300 text-sm", children: [Math.ceil(carState.chaseSecondsLeft || 0), "s"] }), " \u2022 Don't drop below 24 MPH or UHP boxes you in!"] })] })] }), _jsx("button", { onClick: () => {
                                    setCarState(c => ({ ...c, hasGasDashChase: false }));
                                    triggerArrest('Surrendered after High-Speed 7-Eleven Fuel Theft Pursuit on SR-190');
                                }, className: "px-3 py-1.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-mono text-xs font-bold border border-red-400 shadow-md cursor-pointer transition-colors", children: "PULL OVER & SURRENDER" })] })), _jsx(PassengerDialogue, { rider: activeRider, board: activeBoard, carState: carState, onOpenMiloShop: () => setPhase(EXPERIENCE_PHASE.MILOSPORT_SHOP) }), carState.distanceMiles >= 1.0 && carState.distanceMiles <= 1.4 && !carState.hasTractionPass && (_jsx(TractionLawCheckpointModal, { carState: carState, onPassCheckpoint: (equippedTireId) => {
                            setCarState(prev => {
                                const next = {
                                    ...prev,
                                    hasTractionPass: true,
                                    tireOptionId: equippedTireId || prev.tireOptionId
                                };
                                carStateRef.current = next;
                                return next;
                            });
                        }, onReturnToMiloShop: () => {
                            setCarState(prev => {
                                const next = {
                                    ...prev,
                                    distanceMiles: 0.0,
                                    speed: 0
                                };
                                carStateRef.current = next;
                                return next;
                            });
                            setPhase(EXPERIENCE_PHASE.MILOSPORT_SHOP);
                        } })), carState.isPulledOver && (_jsx(CopPullOverModal, { carState: carState, onResolvePullOver: handleResolvePullOver, onArrest: triggerArrest })), carState.isArrested && (_jsx(SaltLakeCountyJailModal, { carState: carState, onRelease: handleReleaseFromJail })), carState.isAtSwig && (_jsx(SwigDriveThruModal, { carState: carState, onFinishSwig: handleFinishSwig, onClose: () => setCarState(c => ({ ...c, isAtSwig: false })) })), carState.isAtWhale && (_jsx(WhaleRoundaboutModal, { carState: carState, onFinishWhale: handleFinishWhale, onClose: () => setCarState(c => ({ ...c, isAtWhale: false })) })), carState.isAt711 && (_jsx(SevenElevenGasModal, { carState: carState, onPayAndCruise: handlePayAndCruise711, onGasAndDash: handleGasAndDash711, onClose: () => setCarState(c => ({ ...c, isAt711: false })) })), carState.isAtX96 && (_jsx(X96StudioModal, { carState: carState, onFinishX96: handleFinishX96, onClose: () => setCarState(c => ({ ...c, isAtX96: false })) })), isSilentZone && (_jsx(SilentRockCard, { onOfferPrayer: handleOfferPrayer, prayersCount: carState.prayersCount })), atBrighton && (_jsx(BrightonArrivalCard, { onStartSkiFree: () => setPhase(EXPERIENCE_PHASE.BRIGHTON_SKIFREE), prayersCount: carState.prayersCount })), driveMode === DRIVE_MODE.MANUAL && (_jsx("div", { className: "absolute bottom-4 left-6 z-20 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-sm pointer-events-none", children: "Controls: W/\u2191 Gas \u2022 S/\u2193 Brake \u2022 A/D or \u2190/\u2192 Steer" })), !audioStarted && (_jsxs("div", { className: "absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-sky-950/90 border border-sky-500 text-sky-200 text-xs font-mono flex items-center gap-2 shadow-glow-ice pointer-events-none animate-pulse", children: [_jsx(Volume2, { className: "w-3.5 h-3.5 text-cyan-400" }), _jsx("span", { children: "Click anywhere to start canyon audio & X96 radio" })] }))] }), _jsxs("footer", { className: "z-20 bg-slate-950/90 border-t border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-3 whitespace-nowrap text-[11px] font-mono text-slate-500", children: [_jsxs("div", { className: "hidden md:flex items-center gap-2", children: [_jsx("span", { children: "prayforsnowutah.com" }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "Wasatch Powder Pilgrimage & SkiFree" })] }), _jsxs("div", { className: "flex items-center justify-between md:justify-end gap-3 w-full md:w-auto", children: [_jsxs("button", { onClick: () => setPhase(EXPERIENCE_PHASE.MILOSPORT_SHOP), className: "hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors", children: [_jsx(Store, { className: "w-3 h-3 text-emerald-400" }), _jsxs("span", { children: ["Milosport", _jsx("span", { className: "hidden sm:inline", children: " Lot & Gear" })] })] }), _jsx("span", { children: "\u2022" }), _jsxs("button", { onClick: () => handleTeleport(0), className: "hover:text-sky-400 flex items-center gap-1 cursor-pointer transition-colors", children: [_jsx(RotateCcw, { className: "w-3 h-3" }), _jsxs("span", { children: ["Restart", _jsx("span", { className: "hidden sm:inline", children: " Canyon" })] })] }), _jsx("span", { children: "\u2022" }), _jsxs("div", { className: "flex items-center gap-1 text-cyan-400", children: [_jsx(Sparkles, { className: "w-3 h-3" }), _jsxs("span", { children: ["Prayers: ", carState.prayersCount.toLocaleString()] })] })] })] })] }));
};
