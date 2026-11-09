import { NETWORK_COMMANDS, NETWORK_ENDPOINTS, NETWORK_STATUS_CODES, PubSubChannel, createErrorPayload, createSuccessPayload, } from "./SharedNetworking.js";
export const PresenceStatePubSub = new PubSubChannel();
export const PresenceGongRipplePubSub = new PubSubChannel();
export const PresenceHugPubSub = new PubSubChannel();
const BASE_LAMBDA_URL = "https://64nyizvtcs7b7qwjjcpgumre7i0zweoe.lambda-url.us-west-2.on.aws";
export const PLEDGES_API_URL = import.meta.env?.VITE_PLEDGES_API_URL || BASE_LAMBDA_URL;
export const LONELIEST_PRESENCE_API_URL = import.meta.env?.VITE_PRESENCE_API_URL ||
    `${BASE_LAMBDA_URL}/loneliest-presence`;
export const DEFAULT_PRESENCE_API_URL = import.meta.env?.VITE_PRESENCE_API_URL ||
    `${PLEDGES_API_URL}/presence`;
const HEARTBEAT_INTERVAL_MS = 45_000;
const SYNC_POLL_INTERVAL_MS = 4_500;
const IDLE_PAUSE_THRESHOLD_MS = 5 * 60 * 1000;
const GONG_THROTTLE_MS = 8_000;
const HUG_THROTTLE_MS = 400;
const DEFAULT_HUG_PINS = [
    {
        id: "pin-mountain-west",
        region: "Mountain West",
        lat: 39.7392,
        lon: -104.9903,
        color: "#fbbf24",
        count: 14,
        lastHugTs: 1760500000000,
    },
    {
        id: "pin-pacific-coast",
        region: "Pacific Coast",
        lat: 36.7783,
        lon: -119.4179,
        color: "#38bdf8",
        count: 11,
        lastHugTs: 1760500000000,
    },
    {
        id: "pin-tokyo",
        region: "Tokyo",
        lat: 35.6762,
        lon: 139.6503,
        color: "#f472b6",
        count: 9,
        lastHugTs: 1760500000000,
    },
    {
        id: "pin-london",
        region: "London",
        lat: 51.5074,
        lon: -0.1278,
        color: "#4ade80",
        count: 8,
        lastHugTs: 1760500000000,
    },
];
const SOUL_PALETTE = [
    "#ffd166", // Warm Gold
    "#00f0ff", // Celestial Cyan
    "#f472b6", // Rose Heart
    "#4ade80", // Healing Emerald
    "#a78bfa", // Twilight Violet
    "#38bdf8", // Sky Blue
];
const AMBIENT_SOULS_TEMPLATE = [
    {
        sid: "ambient-kyoto-sanctuary",
        region: "Sacred Sanctuary • Kyoto",
        lat: 35.0116,
        lon: 135.7681,
        color: "#ffd166",
        chapter: "Ch. VI",
        isAmbient: true,
    },
    {
        sid: "ambient-zurich-harmonic",
        region: "Harmonic Node • Zurich",
        lat: 47.3769,
        lon: 8.5417,
        color: "#00f0ff",
        chapter: "Ch. XI",
        isAmbient: true,
    },
];
let loveChimeAudioCtx = null;
export function playLoveHugChime() {
    if (typeof window === "undefined")
        return;
    try {
        const AudioCtx = window.AudioContext ||
            window
                .webkitAudioContext;
        if (!AudioCtx)
            return;
        if (!loveChimeAudioCtx) {
            loveChimeAudioCtx = new AudioCtx();
        }
        const ctx = loveChimeAudioCtx;
        if (ctx.state === "suspended") {
            void ctx.resume();
        }
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.0004, now);
        masterGain.gain.exponentialRampToValueAtTime(0.08, now + 0.14);
        masterGain.gain.exponentialRampToValueAtTime(0.0003, now + 3.2);
        masterGain.connect(ctx.destination);
        // 528Hz Miracle Love Harmonic Chord
        const chord = [
            { freq: 264.0, amp: 0.35, decay: 3.0, delay: 0.0, type: "sine" },
            { freq: 528.0, amp: 0.45, decay: 2.8, delay: 0.04, type: "sine" },
            { freq: 660.0, amp: 0.28, decay: 2.5, delay: 0.11, type: "triangle" },
            { freq: 792.0, amp: 0.22, decay: 2.2, delay: 0.18, type: "sine" },
            { freq: 1056.0, amp: 0.1, decay: 1.8, delay: 0.25, type: "sine" },
        ];
        for (const note of chord) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startAt = now + note.delay;
            osc.type = note.type;
            osc.frequency.setValueAtTime(note.freq * 0.996, startAt);
            osc.frequency.exponentialRampToValueAtTime(note.freq, startAt + 0.18);
            gain.gain.setValueAtTime(0.0004, startAt);
            gain.gain.linearRampToValueAtTime(note.amp, startAt + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0003, startAt + note.decay);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(startAt);
            osc.stop(startAt + note.decay + 0.05);
        }
    }
    catch {
        // Ignore audio context restrictions
    }
}
export function resolveBrowserLocation() {
    let tz = "";
    try {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    }
    catch {
        tz = "";
    }
    if (tz === "America/Denver" ||
        tz === "America/Phoenix" ||
        tz === "America/Boise" ||
        tz === "US/Mountain") {
        return { region: "Mountain West", lat: 39.7392, lon: -104.9903 };
    }
    if (tz === "America/Los_Angeles" ||
        tz === "America/Vancouver" ||
        tz === "America/Tijuana" ||
        tz === "US/Pacific") {
        return { region: "Pacific Coast", lat: 36.7783, lon: -119.4179 };
    }
    if (tz === "America/Chicago" ||
        tz === "America/Winnipeg" ||
        tz === "America/Mexico_City" ||
        tz === "US/Central") {
        return { region: "Midwest", lat: 41.8781, lon: -87.6298 };
    }
    if (tz === "America/New_York" ||
        tz === "America/Toronto" ||
        tz === "America/Detroit" ||
        tz === "US/Eastern") {
        return { region: "East Coast", lat: 40.7128, lon: -74.006 };
    }
    if (tz === "Pacific/Honolulu") {
        return { region: "Hawaii", lat: 21.3069, lon: -157.8583 };
    }
    if (tz === "America/Sao_Paulo" ||
        tz.startsWith("America/Argentina") ||
        tz === "America/Santiago" ||
        tz === "America/Bogota") {
        return { region: "South America", lat: -23.5505, lon: -46.6333 };
    }
    if (tz.startsWith("America/")) {
        return { region: "Americas", lat: 38.5, lon: -98.0 };
    }
    if (tz === "Europe/London" || tz === "Europe/Dublin") {
        return { region: "London", lat: 51.5074, lon: -0.1278 };
    }
    if (tz.startsWith("Europe/")) {
        return { region: "Europe", lat: 47.3769, lon: 8.5417 };
    }
    if (tz === "Asia/Tokyo") {
        return { region: "Tokyo", lat: 35.6762, lon: 139.6503 };
    }
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") {
        return { region: "India", lat: 20.5937, lon: 78.9629 };
    }
    if (tz === "Asia/Seoul") {
        return { region: "Seoul", lat: 37.5665, lon: 126.978 };
    }
    if (tz === "Asia/Singapore") {
        return { region: "Singapore", lat: 1.3521, lon: 103.8198 };
    }
    if (tz.startsWith("Asia/")) {
        return { region: "Asia", lat: 34.2658, lon: 108.9541 };
    }
    if (tz.startsWith("Australia/")) {
        return { region: "Sydney", lat: -33.8688, lon: 151.2093 };
    }
    if (tz.startsWith("Pacific/")) {
        return { region: "Oceania", lat: -36.8485, lon: 174.7633 };
    }
    if (tz.startsWith("Africa/")) {
        return { region: "Africa", lat: -1.2921, lon: 36.8219 };
    }
    return { region: "Earth", lat: 20.0, lon: 0.0 };
}
/**
 * Converts (lat, lon) in degrees into 2D SVG globe coordinates within `radius` (default 118)
 * so souls and gong ripples land cleanly on the HealthyPlanetEarth sphere (r=158).
 */
export function latLonToGlobeXY(lat, lon, radius = 118) {
    const safeRadius = Number.isFinite(radius) && radius > 0 ? radius : 118;
    const clampedLat = Math.max(-85, Math.min(85, Number.isFinite(lat) ? lat : 0));
    const normalizedLon = Number.isFinite(lon)
        ? ((((lon + 180) % 360) + 360) % 360) - 180
        : 0;
    const latRad = (clampedLat * Math.PI) / 180;
    const nx = (normalizedLon / 180) * Math.cos(latRad * 0.65);
    const ny = -Math.sin(latRad);
    const rawX = nx * safeRadius;
    const rawY = ny * (safeRadius * 0.88);
    const dist = Math.hypot(rawX, rawY);
    const maxR = safeRadius * 0.96;
    if (dist > maxR && dist > 0) {
        const scale = maxR / dist;
        return {
            x: Math.round(rawX * scale * 10) / 10,
            y: Math.round(rawY * scale * 10) / 10,
        };
    }
    return {
        x: Math.round(rawX * 10) / 10,
        y: Math.round(rawY * 10) / 10,
    };
}
function hashSidColor(sid) {
    let hash = 0;
    for (let i = 0; i < sid.length; i += 1) {
        hash = (hash * 31 + sid.charCodeAt(i)) >>> 0;
    }
    return SOUL_PALETTE[hash % SOUL_PALETTE.length];
}
function getOrCreateSessionSid(storageKey) {
    try {
        if (typeof window !== "undefined" && window.sessionStorage) {
            const existing = window.sessionStorage.getItem(storageKey);
            if (existing && existing.length >= 6) {
                return existing;
            }
            const created = `soul-${Date.now().toString(36)}-${Math.random()
                .toString(36)
                .slice(2, 8)}`;
            window.sessionStorage.setItem(storageKey, created);
            return created;
        }
    }
    catch {
        // Ignore storage restrictions
    }
    return `soul-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}
function readCachedCount(key, fallback) {
    try {
        if (typeof window !== "undefined" && window.localStorage) {
            const raw = window.localStorage.getItem(key);
            if (raw !== null) {
                const parsed = Number.parseInt(raw, 10);
                if (Number.isFinite(parsed) && parsed >= fallback) {
                    return parsed;
                }
            }
        }
    }
    catch {
        // Ignore storage errors
    }
    return fallback;
}
function writeCachedCount(key, value) {
    try {
        if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.setItem(key, String(Math.floor(value)));
        }
    }
    catch {
        // Ignore storage errors
    }
}
function mergeHugPinLists(basePins, incomingPins) {
    const byId = new Map();
    for (const p of [...DEFAULT_HUG_PINS, ...basePins, ...incomingPins]) {
        if (!p || typeof p.region !== "string")
            continue;
        const id = typeof p.id === "string" && p.id
            ? p.id
            : `pin-${p.region
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")}`;
        const existing = byId.get(id);
        const count = typeof p.count === "number" && Number.isFinite(p.count)
            ? Math.max(1, Math.floor(p.count))
            : 1;
        const lastHugTs = typeof p.lastHugTs === "number" && Number.isFinite(p.lastHugTs)
            ? p.lastHugTs
            : Date.now();
        byId.set(id, {
            id,
            region: p.region,
            lat: typeof p.lat === "number" && Number.isFinite(p.lat)
                ? p.lat
                : existing?.lat ?? 20,
            lon: typeof p.lon === "number" && Number.isFinite(p.lon)
                ? p.lon
                : existing?.lon ?? 0,
            color: typeof p.color === "string" && p.color
                ? p.color
                : existing?.color ?? "#f472b6",
            count: existing ? Math.max(existing.count, count) : count,
            lastHugTs: existing ? Math.max(existing.lastHugTs, lastHugTs) : lastHugTs,
        });
    }
    return Array.from(byId.values()).slice(0, 64);
}
function readCachedHugPins(storageKey) {
    try {
        if (typeof window !== "undefined" && window.localStorage) {
            const raw = window.localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    return mergeHugPinLists([], parsed);
                }
            }
        }
    }
    catch {
        // Ignore storage access errors
    }
    return [...DEFAULT_HUG_PINS];
}
function writeCachedHugPins(storageKey, pins) {
    try {
        if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.setItem(storageKey, JSON.stringify(pins.slice(0, 64)));
        }
    }
    catch {
        // Ignore storage access errors
    }
}
export class PresenceController {
    static instance = null;
    static defaultConfig = {};
    static configure(config) {
        PresenceController.defaultConfig = {
            ...PresenceController.defaultConfig,
            ...config,
        };
        if (PresenceController.instance) {
            PresenceController.instance.applyConfig(config);
        }
    }
    static get(config) {
        if (!PresenceController.instance) {
            PresenceController.instance = new PresenceController({
                ...PresenceController.defaultConfig,
                ...config,
            });
        }
        else if (config) {
            PresenceController.instance.applyConfig(config);
        }
        return PresenceController.instance;
    }
    static getInstance(config) {
        return PresenceController.get(config);
    }
    storageKeyPrefix;
    apiUrl;
    site;
    localSoul;
    snapshot;
    isRunning = false;
    initialPostSentInMemory = false;
    heartbeatTimer = null;
    syncPollTimer = null;
    lastInteractionTs = Date.now();
    lastGongNetworkTs = 0;
    lastHugNetworkTs = 0;
    seenRippleIds = new Set();
    seenHugIds = new Set();
    boundHandleActivity;
    boundHandleVisibility;
    constructor(config = {}) {
        this.storageKeyPrefix = config.storageKeyPrefix || "ebm";
        this.site = config.site;
        this.apiUrl =
            config.apiUrl ||
                (config.site === "theloneliestday"
                    ? `${LONELIEST_PRESENCE_API_URL}?site=theloneliestday`
                    : DEFAULT_PRESENCE_API_URL);
        const sid = getOrCreateSessionSid(`${this.storageKeyPrefix}_presence_sid`);
        const loc = resolveBrowserLocation();
        const now = Date.now();
        this.localSoul = {
            sid,
            region: loc.region,
            lat: loc.lat,
            lon: loc.lon,
            color: hashSidColor(sid),
            chapter: config.defaultChapter,
            lastSeen: now,
            isAmbient: false,
        };
        const initialTotalVisits = readCachedCount(`${this.storageKeyPrefix}_cached_total_visits`, 108) + 1;
        const initialTotalHugs = readCachedCount(`${this.storageKeyPrefix}_cached_total_hugs`, 42);
        const initialHugPins = readCachedHugPins(`${this.storageKeyPrefix}_cached_hug_pins`);
        writeCachedCount(`${this.storageKeyPrefix}_cached_total_visits`, initialTotalVisits);
        this.snapshot = {
            activeCount: 1,
            activeSouls: this.mergeSoulsWithAmbient([this.localSoul]),
            totalVisits: initialTotalVisits,
            dayVisits: 14,
            totalHugs: initialTotalHugs,
            recentRipples: [],
            recentHugs: [],
            hugPins: initialHugPins,
        };
        this.boundHandleActivity = () => {
            this.lastInteractionTs = Date.now();
        };
        this.boundHandleVisibility = () => {
            if (typeof document !== "undefined" &&
                document.visibilityState === "visible") {
                this.lastInteractionTs = Date.now();
            }
        };
    }
    applyConfig(config) {
        if (config.storageKeyPrefix) {
            this.storageKeyPrefix = config.storageKeyPrefix;
        }
        if (config.site) {
            this.site = config.site;
        }
        if (config.apiUrl) {
            this.apiUrl = config.apiUrl;
        }
        else if (config.site === "theloneliestday") {
            this.apiUrl = `${LONELIEST_PRESENCE_API_URL}?site=theloneliestday`;
        }
        if (config.defaultChapter && !this.localSoul.chapter) {
            this.localSoul.chapter = config.defaultChapter;
        }
    }
    getLocalSoul() {
        return { ...this.localSoul };
    }
    getSnapshot() {
        return this.snapshot;
    }
    getState() {
        return this.snapshot;
    }
    setCurrentChapterInfo(chapter, persona) {
        if (this.localSoul.chapter === chapter &&
            this.localSoul.persona === persona) {
            return;
        }
        this.localSoul.chapter = chapter;
        this.localSoul.persona = persona;
        this.localSoul.lastSeen = Date.now();
        this.snapshot = {
            ...this.snapshot,
            activeSouls: this.mergeSoulsWithAmbient(this.snapshot.activeSouls),
        };
        PresenceStatePubSub.publish(this.snapshot);
    }
    mergeSoulsWithAmbient(serverSouls) {
        const now = Date.now();
        const bySid = new Map();
        this.localSoul.lastSeen = now;
        bySid.set(this.localSoul.sid, { ...this.localSoul, isAmbient: false });
        for (const s of serverSouls) {
            if (!s || typeof s.sid !== "string" || s.isAmbient)
                continue;
            if (s.sid === this.localSoul.sid)
                continue;
            bySid.set(s.sid, {
                sid: s.sid,
                region: typeof s.region === "string" && s.region ? s.region : "Earth",
                lat: typeof s.lat === "number" && Number.isFinite(s.lat) ? s.lat : 0,
                lon: typeof s.lon === "number" && Number.isFinite(s.lon) ? s.lon : 0,
                color: typeof s.color === "string" && s.color ? s.color : "#ffd166",
                chapter: typeof s.chapter === "string" ? s.chapter : undefined,
                persona: typeof s.persona === "string" ? s.persona : undefined,
                lastSeen: typeof s.lastSeen === "number" && Number.isFinite(s.lastSeen)
                    ? s.lastSeen
                    : now,
                isAmbient: false,
            });
        }
        const merged = Array.from(bySid.values());
        for (const amb of AMBIENT_SOULS_TEMPLATE) {
            merged.push({
                ...amb,
                lastSeen: now,
                isAmbient: true,
            });
        }
        return merged;
    }
    start() {
        PresenceStatePubSub.publish(this.snapshot);
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.lastInteractionTs = Date.now();
        if (typeof window !== "undefined") {
            window.addEventListener("pointerdown", this.boundHandleActivity, {
                passive: true,
            });
            window.addEventListener("keydown", this.boundHandleActivity, {
                passive: true,
            });
            window.addEventListener("scroll", this.boundHandleActivity, {
                passive: true,
            });
            window.addEventListener("touchstart", this.boundHandleActivity, {
                passive: true,
            });
        }
        if (typeof document !== "undefined") {
            document.addEventListener("visibilitychange", this.boundHandleVisibility);
        }
        if (!this.initialPostSentInMemory) {
            this.initialPostSentInMemory = true;
            void this.sendPresencePost({
                isInitialView: true,
                gong: false,
                command: NETWORK_COMMANDS.PRESENCE_HEARTBEAT,
            });
        }
        this.heartbeatTimer = setInterval(() => {
            if (!this.isRunning)
                return;
            if (typeof document !== "undefined" &&
                document.visibilityState !== "visible") {
                return;
            }
            if (Date.now() - this.lastInteractionTs > IDLE_PAUSE_THRESHOLD_MS) {
                return;
            }
            void this.sendPresencePost({
                isInitialView: false,
                gong: false,
                command: NETWORK_COMMANDS.PRESENCE_HEARTBEAT,
            });
        }, HEARTBEAT_INTERVAL_MS);
        this.syncPollTimer = setInterval(() => {
            if (!this.isRunning)
                return;
            if (typeof document !== "undefined" &&
                document.visibilityState !== "visible") {
                return;
            }
            if (Date.now() - this.lastInteractionTs > IDLE_PAUSE_THRESHOLD_MS) {
                return;
            }
            void this.fetchPresenceState();
        }, SYNC_POLL_INTERVAL_MS);
    }
    stop() {
        this.isRunning = false;
        if (this.heartbeatTimer !== null) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        if (this.syncPollTimer !== null) {
            clearInterval(this.syncPollTimer);
            this.syncPollTimer = null;
        }
        if (typeof window !== "undefined") {
            window.removeEventListener("pointerdown", this.boundHandleActivity);
            window.removeEventListener("keydown", this.boundHandleActivity);
            window.removeEventListener("scroll", this.boundHandleActivity);
            window.removeEventListener("touchstart", this.boundHandleActivity);
        }
        if (typeof document !== "undefined") {
            document.removeEventListener("visibilitychange", this.boundHandleVisibility);
        }
    }
    async emitGongRipple() {
        const now = Date.now();
        this.lastInteractionTs = now;
        const localRipple = {
            id: `local-${now}-${this.localSoul.sid.slice(0, 6)}`,
            region: this.localSoul.region,
            lat: this.localSoul.lat,
            lon: this.localSoul.lon,
            color: this.localSoul.color,
            ts: now,
        };
        this.seenRippleIds.add(localRipple.id);
        this.snapshot = {
            ...this.snapshot,
            recentRipples: [localRipple, ...this.snapshot.recentRipples].slice(0, 12),
        };
        PresenceGongRipplePubSub.publish(localRipple);
        PresenceStatePubSub.publish(this.snapshot);
        if (now - this.lastGongNetworkTs >= GONG_THROTTLE_MS) {
            this.lastGongNetworkTs = now;
            await this.sendPresencePost({
                isInitialView: false,
                gong: true,
                command: NETWORK_COMMANDS.PRESENCE_GONG_RIPPLE,
            });
        }
        return localRipple;
    }
    async triggerGongRipple() {
        return this.emitGongRipple();
    }
    async sendHug(targetSoul) {
        const now = Date.now();
        this.lastInteractionTs = now;
        const otherRealDiffRegion = this.snapshot.activeSouls.filter((s) => s.sid !== this.localSoul.sid &&
            !s.isAmbient &&
            s.region !== this.localSoul.region);
        const otherRealSouls = this.snapshot.activeSouls.filter((s) => s.sid !== this.localSoul.sid && !s.isAmbient);
        const ambientCandidates = this.snapshot.activeSouls.filter((s) => s.sid !== this.localSoul.sid && s.isAmbient);
        const fallbackPool = otherRealDiffRegion.length > 0
            ? otherRealDiffRegion
            : otherRealSouls.length > 0
                ? otherRealSouls
                : ambientCandidates.length > 0
                    ? ambientCandidates
                    : [this.localSoul];
        const effectiveTarget = targetSoul && targetSoul.sid !== this.localSoul.sid
            ? targetSoul
            : undefined;
        const chosen = effectiveTarget ??
            fallbackPool[Math.abs(this.snapshot.totalHugs) % fallbackPool.length];
        playLoveHugChime();
        const cleanToRegion = chosen.region.includes("•")
            ? chosen.region.split("•").pop()?.trim() || chosen.region
            : chosen.region;
        const localHug = {
            id: `local-hug-${now}-${this.localSoul.sid.slice(0, 5)}`,
            fromSid: this.localSoul.sid,
            fromRegion: this.localSoul.region,
            fromLat: this.localSoul.lat,
            fromLon: this.localSoul.lon,
            toSid: chosen.sid,
            toRegion: cleanToRegion,
            toLat: chosen.lat,
            toLon: chosen.lon,
            color: "#f472b6",
            ts: now,
        };
        this.seenHugIds.add(localHug.id);
        const nextTotalHugs = (this.snapshot.totalHugs || 42) + 1;
        writeCachedCount(`${this.storageKeyPrefix}_cached_total_hugs`, nextTotalHugs);
        const pinId = `pin-${this.localSoul.region
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}`;
        const existingPin = this.snapshot.hugPins.find((p) => p.id === pinId);
        const updatedSenderPin = {
            id: pinId,
            region: this.localSoul.region,
            lat: this.localSoul.lat,
            lon: this.localSoul.lon,
            color: this.localSoul.color || "#f472b6",
            count: (existingPin?.count || 0) + 1,
            lastHugTs: now,
        };
        const nextHugPins = mergeHugPinLists(this.snapshot.hugPins, [
            updatedSenderPin,
        ]);
        writeCachedHugPins(`${this.storageKeyPrefix}_cached_hug_pins`, nextHugPins);
        this.snapshot = {
            ...this.snapshot,
            totalHugs: nextTotalHugs,
            recentHugs: [localHug, ...this.snapshot.recentHugs].slice(0, 12),
            hugPins: nextHugPins,
        };
        PresenceHugPubSub.publish(localHug);
        PresenceStatePubSub.publish(this.snapshot);
        if (now - this.lastHugNetworkTs >= HUG_THROTTLE_MS) {
            this.lastHugNetworkTs = now;
            await this.sendPresencePost({
                isInitialView: false,
                gong: false,
                hug: localHug,
                command: NETWORK_COMMANDS.PRESENCE_SEND_HUG,
            });
        }
        return localHug;
    }
    applyServerPayload(raw, command) {
        const body = raw.data && typeof raw.data === "object" ? raw.data : raw;
        const serverSouls = Array.isArray(body.activeSouls) ? body.activeSouls : [];
        const mergedSouls = this.mergeSoulsWithAmbient(serverSouls);
        const realSoulsCount = mergedSouls.filter((s) => !s.isAmbient).length;
        const serverActiveCount = typeof body.activeCount === "number" && Number.isFinite(body.activeCount)
            ? body.activeCount
            : 1;
        const activeCount = Math.max(1, serverActiveCount, realSoulsCount);
        const totalVisits = typeof body.totalVisits === "number" && Number.isFinite(body.totalVisits)
            ? Math.max(this.snapshot.totalVisits, body.totalVisits)
            : Math.max(1, this.snapshot.totalVisits);
        writeCachedCount(`${this.storageKeyPrefix}_cached_total_visits`, totalVisits);
        const dayVisits = typeof body.dayVisits === "number" && Number.isFinite(body.dayVisits)
            ? Math.max(1, body.dayVisits)
            : Math.max(1, this.snapshot.dayVisits);
        const totalHugs = typeof body.totalHugs === "number" && Number.isFinite(body.totalHugs)
            ? Math.max(this.snapshot.totalHugs, body.totalHugs)
            : Math.max(1, this.snapshot.totalHugs);
        writeCachedCount(`${this.storageKeyPrefix}_cached_total_hugs`, totalHugs);
        const serverRipples = Array.isArray(body.recentRipples)
            ? body.recentRipples
            : [];
        const now = Date.now();
        const localSidSuffix = `-${this.localSoul.sid.slice(0, 4)}`;
        for (const r of serverRipples) {
            if (!r || typeof r.id !== "string")
                continue;
            if (!this.seenRippleIds.has(r.id)) {
                this.seenRippleIds.add(r.id);
                if (!r.id.endsWith(localSidSuffix) && now - r.ts < 65_000) {
                    PresenceGongRipplePubSub.publish(r);
                }
            }
        }
        const combinedRipples = serverRipples.length > 0
            ? serverRipples.slice(-12).reverse()
            : this.snapshot.recentRipples;
        const serverHugs = Array.isArray(body.recentHugs) ? body.recentHugs : [];
        const unseenRemoteHugs = [];
        for (const h of serverHugs) {
            if (!h || typeof h.id !== "string")
                continue;
            if (!this.seenHugIds.has(h.id)) {
                this.seenHugIds.add(h.id);
                if (h.fromSid !== this.localSoul.sid && now - h.ts < 65_000) {
                    unseenRemoteHugs.push(h);
                }
            }
        }
        unseenRemoteHugs.forEach((h, idx) => {
            if (idx === 0) {
                playLoveHugChime();
                PresenceHugPubSub.publish(h);
            }
            else if (typeof window !== "undefined") {
                window.setTimeout(() => {
                    playLoveHugChime();
                    PresenceHugPubSub.publish(h);
                }, idx * 260);
            }
        });
        const combinedHugs = serverHugs.length > 0
            ? serverHugs.slice(-12).reverse()
            : this.snapshot.recentHugs;
        const serverHugPins = Array.isArray(body.hugPins) ? body.hugPins : [];
        const mergedHugPins = mergeHugPinLists(this.snapshot.hugPins, serverHugPins);
        writeCachedHugPins(`${this.storageKeyPrefix}_cached_hug_pins`, mergedHugPins);
        const nextSnapshot = {
            activeCount,
            activeSouls: mergedSouls,
            totalVisits,
            dayVisits,
            totalHugs,
            recentRipples: combinedRipples,
            recentHugs: combinedHugs,
            hugPins: mergedHugPins,
        };
        const successPayload = createSuccessPayload(nextSnapshot, NETWORK_ENDPOINTS.PRESENCE, command, NETWORK_STATUS_CODES._200_OK);
        this.snapshot = successPayload.data;
        PresenceStatePubSub.publish(this.snapshot);
    }
    async fetchPresenceState() {
        try {
            const res = await fetch(this.apiUrl, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });
            if (!res.ok)
                return;
            const raw = (await res.json());
            this.applyServerPayload(raw, NETWORK_COMMANDS.PRESENCE_FETCH);
        }
        catch {
            // Ignore transient poll errors
        }
    }
    async sendPresencePost(options) {
        try {
            const res = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    endpoint: NETWORK_ENDPOINTS.PRESENCE,
                    command: options.command,
                    site: this.site,
                    sid: this.localSoul.sid,
                    region: this.localSoul.region,
                    lat: this.localSoul.lat,
                    lon: this.localSoul.lon,
                    color: this.localSoul.color,
                    chapter: this.localSoul.chapter,
                    persona: this.localSoul.persona,
                    isInitialView: options.isInitialView,
                    gong: options.gong,
                    hug: options.hug
                        ? {
                            toSid: options.hug.toSid,
                            toRegion: options.hug.toRegion,
                            toLat: options.hug.toLat,
                            toLon: options.hug.toLon,
                            color: options.hug.color,
                        }
                        : undefined,
                }),
            });
            if (!res.ok) {
                createErrorPayload(`Presence request failed with HTTP ${res.status}`, res.status === 400
                    ? NETWORK_STATUS_CODES._400_BAD_REQUEST
                    : NETWORK_STATUS_CODES._500_INTERNAL_SERVER_ERROR, NETWORK_ENDPOINTS.PRESENCE, options.command);
                return;
            }
            const raw = (await res.json());
            this.applyServerPayload(raw, options.command);
        }
        catch {
            PresenceStatePubSub.publish(this.snapshot);
        }
    }
}
export default PresenceController;
