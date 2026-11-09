// Shared Soul Presence, Ripples, Hugs, Globe Pins & Manifesto Pledges Lambda Handler
// Used by TheLoneliestDay and exponentialblissmanifesto.com
// @ts-nocheck
let ddb = null;
let GetCommand = null;
let PutCommand = null;
let UpdateCommand = null;
let QueryCommand = null;
try {
    const clientMod = await import('@aws-sdk/client-dynamodb');
    const libMod = await import('@aws-sdk/lib-dynamodb');
    GetCommand = libMod.GetCommand;
    PutCommand = libMod.PutCommand;
    UpdateCommand = libMod.UpdateCommand;
    QueryCommand = libMod.QueryCommand;
    ddb = libMod.DynamoDBDocumentClient.from(new clientMod.DynamoDBClient({}));
}
catch {
    // Running in local/offline mode without @aws-sdk installed
}
const TABLE = process.env.TABLE_NAME || 'exponentialbliss-pledges';
function createInitialPins() {
    return new Map([
        [
            'pin-mountain-west',
            {
                id: 'pin-mountain-west',
                region: 'Mountain West',
                lat: 39.74,
                lon: -104.99,
                color: '#fbbf24',
                count: 14,
                lastHugTs: 1792100000000,
            },
        ],
        [
            'pin-pacific-coast',
            {
                id: 'pin-pacific-coast',
                region: 'Pacific Coast',
                lat: 36.78,
                lon: -119.42,
                color: '#38bdf8',
                count: 19,
                lastHugTs: 1792100000000,
            },
        ],
        [
            'pin-tokyo',
            {
                id: 'pin-tokyo',
                region: 'Tokyo',
                lat: 35.68,
                lon: 139.65,
                color: '#f472b6',
                count: 11,
                lastHugTs: 1792100000000,
            },
        ],
        [
            'pin-london',
            {
                id: 'pin-london',
                region: 'London',
                lat: 51.51,
                lon: -0.13,
                color: '#4ade80',
                count: 9,
                lastHugTs: 1792100000000,
            },
        ],
    ]);
}
function createPresenceRoom(pkName, initialVisits = 108, initialHugs = 42) {
    return {
        pk: pkName,
        activeSouls: new Map(),
        recentRipples: [],
        recentHugs: [],
        hugPins: createInitialPins(),
        cachedTotalVisits: initialVisits,
        cachedDayVisits: 14,
        cachedTotalHugs: initialHugs,
        cachedDayKey: '',
        lastDdbSyncMs: 0,
    };
}
const ROOMS = {
    default: createPresenceRoom('META', 108, 42),
    theloneliestday: createPresenceRoom('META_LONELIEST', 142, 64),
};
const fallbackMeta = {
    signatures: 0,
    wealthPledges: 0,
    totalPledgedMillions: 0,
    beneficiaries: 0,
    bitesTaken: 0,
    totalVisits: 108,
    totalHugs: 42,
};
const fallbackEntries = [];
const SEED_ENTRIES = [
    {
        id: 'seed-1',
        type: 'wealth_pledge',
        handle: 'The First Spark',
        location: 'Salt Lake Valley, UT',
        pledgeMillions: 10,
        pledgeTier: 'Once at $10M+ Bliss Baseline → 100% Overflow to the Base',
        message: 'The Massive 1% Fires Must Spread Some Flames to Ignite The World. Just take the first bite.',
        createdAt: '2026-10-14T06:00:00.000Z',
    },
    {
        id: 'seed-2',
        type: 'signature',
        handle: 'Stadium Vibration',
        location: 'Pacific Coast',
        message: 'Imagine going to see your favorite band where everyone in the crowd got in for free and is debt free. It will feel like your very first concert again.',
        createdAt: '2026-10-14T06:15:00.000Z',
    },
    {
        id: 'seed-3',
        type: 'beneficiary',
        handle: 'Present Parent',
        location: 'Mountain West',
        needCategory: 'Time Abundance & Debt Liberation',
        message: 'Seeking freedom from mortgage/medical debt so both parents can be home daily with our young kids while they are still little.',
        createdAt: '2026-10-14T06:30:00.000Z',
    },
];
function respond(statusCode, body) {
    return {
        statusCode,
        headers: {
            'content-type': 'application/json',
            'cache-control': 'no-store',
        },
        body: JSON.stringify(body),
    };
}
function sanitize(str, maxLen = 280) {
    if (typeof str !== 'string')
        return '';
    return str.trim().replace(/[<>]/g, '').slice(0, maxLen);
}
function mergeRemoteState(room, item, nowMs) {
    if (!item || typeof item !== 'object')
        return;
    if (typeof item.totalVisits === 'number') {
        room.cachedTotalVisits = Math.max(room.cachedTotalVisits, item.totalVisits);
    }
    if (typeof item.totalHugs === 'number') {
        room.cachedTotalHugs = Math.max(room.cachedTotalHugs, item.totalHugs);
    }
    if (Array.isArray(item.activeSouls)) {
        for (const s of item.activeSouls) {
            if (!s || typeof s.sid !== 'string')
                continue;
            if (nowMs - (s.lastSeen || 0) <= 110_000) {
                const existing = room.activeSouls.get(s.sid);
                if (!existing || s.lastSeen > existing.lastSeen) {
                    room.activeSouls.set(s.sid, s);
                }
            }
        }
    }
    if (Array.isArray(item.recentRipples)) {
        const existingIds = new Set(room.recentRipples.map((r) => r.id));
        for (const r of item.recentRipples) {
            if (!r || typeof r.id !== 'string')
                continue;
            if (nowMs - (r.ts || 0) < 90_000 && !existingIds.has(r.id)) {
                room.recentRipples.push(r);
                existingIds.add(r.id);
            }
        }
        room.recentRipples.sort((a, b) => a.ts - b.ts);
        if (room.recentRipples.length > 12) {
            room.recentRipples.splice(0, room.recentRipples.length - 12);
        }
    }
    if (Array.isArray(item.recentHugs)) {
        const existingHugIds = new Set(room.recentHugs.map((h) => h.id));
        for (const h of item.recentHugs) {
            if (!h || typeof h.id !== 'string')
                continue;
            if (nowMs - (h.ts || 0) < 90_000 && !existingHugIds.has(h.id)) {
                room.recentHugs.push(h);
                existingHugIds.add(h.id);
            }
        }
        room.recentHugs.sort((a, b) => a.ts - b.ts);
        if (room.recentHugs.length > 12) {
            room.recentHugs.splice(0, room.recentHugs.length - 12);
        }
    }
    if (Array.isArray(item.hugPins)) {
        for (const p of item.hugPins) {
            if (!p || typeof p.id !== 'string')
                continue;
            const existing = room.hugPins.get(p.id);
            if (!existing) {
                room.hugPins.set(p.id, {
                    id: p.id,
                    region: sanitize(p.region, 64) || 'Earth',
                    lat: typeof p.lat === 'number' && Number.isFinite(p.lat) ? p.lat : 0,
                    lon: typeof p.lon === 'number' && Number.isFinite(p.lon) ? p.lon : 0,
                    color: sanitize(p.color, 32) || '#f472b6',
                    count: typeof p.count === 'number' && Number.isFinite(p.count)
                        ? Math.max(1, p.count)
                        : 1,
                    lastHugTs: typeof p.lastHugTs === 'number' && Number.isFinite(p.lastHugTs)
                        ? p.lastHugTs
                        : nowMs,
                });
            }
            else {
                room.hugPins.set(p.id, {
                    ...existing,
                    count: Math.max(existing.count || 1, p.count || 1),
                    lastHugTs: Math.max(existing.lastHugTs || 0, p.lastHugTs || 0),
                });
            }
        }
    }
}
export async function handler(event) {
    const method = event.requestContext?.http?.method || 'GET';
    const path = event.rawPath || event.requestContext?.http?.path || '/';
    const querySite = event.queryStringParameters?.site || '';
    if (method === 'OPTIONS') {
        return { statusCode: 204, headers: {}, body: '' };
    }
    try {
        if ((method === 'GET' || method === 'POST') &&
            (path === '/presence' || path === '/loneliest-presence')) {
            const body = method === 'POST' ? JSON.parse(event.body || '{}') : {};
            const isLoneliest = path === '/loneliest-presence' ||
                querySite === 'theloneliestday' ||
                body.site === 'theloneliestday';
            const room = isLoneliest ? ROOMS.theloneliestday : ROOMS.default;
            const nowMs = Date.now();
            const todayKey = new Date(nowMs).toISOString().slice(0, 10);
            if (room.cachedDayKey && room.cachedDayKey !== todayKey) {
                room.cachedDayVisits = 1;
            }
            room.cachedDayKey = todayKey;
            for (const [k, s] of room.activeSouls.entries()) {
                if (nowMs - s.lastSeen > 110_000) {
                    room.activeSouls.delete(k);
                }
            }
            const hasHug = Boolean(body.hug && typeof body.hug === 'object');
            const shouldSyncDdb = Boolean(ddb) &&
                (body.isInitialView === true ||
                    body.gong === true ||
                    hasHug ||
                    nowMs - room.lastDdbSyncMs > 1500);
            if (shouldSyncDdb) {
                room.lastDdbSyncMs = nowMs;
                try {
                    const metaRes = await ddb.send(new GetCommand({
                        TableName: TABLE,
                        Key: { pk: room.pk, sk: 'COUNTS' },
                    }));
                    mergeRemoteState(room, metaRes.Item, nowMs);
                }
                catch {
                    // Offline / local Docker fallback
                }
            }
            if (method === 'POST') {
                const sid = sanitize(body.sid, 64) ||
                    `anon-${Math.random().toString(36).slice(2, 8)}`;
                const region = sanitize(body.region, 64) || 'Earth';
                const lat = typeof body.lat === 'number' && Number.isFinite(body.lat)
                    ? Math.max(-90, Math.min(90, body.lat))
                    : 0;
                const lon = typeof body.lon === 'number' && Number.isFinite(body.lon)
                    ? Math.max(-180, Math.min(180, body.lon))
                    : 0;
                const color = sanitize(body.color, 32) || '#fbbf24';
                const chapter = sanitize(body.chapter, 48) || undefined;
                const persona = sanitize(body.persona, 64) || undefined;
                room.activeSouls.set(sid, {
                    sid,
                    region,
                    lat,
                    lon,
                    color,
                    chapter,
                    persona,
                    lastSeen: nowMs,
                });
                if (body.gong === true) {
                    room.recentRipples.push({
                        id: `${nowMs}-${sid.slice(0, 4)}`,
                        region,
                        lat,
                        lon,
                        color,
                        ts: nowMs,
                    });
                    while (room.recentRipples.length > 0 &&
                        nowMs - room.recentRipples[0].ts >= 90_000) {
                        room.recentRipples.shift();
                    }
                    if (room.recentRipples.length > 12) {
                        room.recentRipples.splice(0, room.recentRipples.length - 12);
                    }
                }
                if (hasHug) {
                    room.cachedTotalHugs += 1;
                    const h = body.hug;
                    room.recentHugs.push({
                        id: `${nowMs}-hug-${sid.slice(0, 4)}-${Math.random()
                            .toString(36)
                            .slice(2, 5)}`,
                        fromSid: sid,
                        fromRegion: region,
                        fromLat: lat,
                        fromLon: lon,
                        toSid: sanitize(h.toSid, 64) || 'planet-earth',
                        toRegion: sanitize(h.toRegion, 64) || 'Earth',
                        toLat: typeof h.toLat === 'number' && Number.isFinite(h.toLat)
                            ? Math.max(-90, Math.min(90, h.toLat))
                            : 0,
                        toLon: typeof h.toLon === 'number' && Number.isFinite(h.toLon)
                            ? Math.max(-180, Math.min(180, h.toLon))
                            : 0,
                        color: sanitize(h.color, 32) || '#f472b6',
                        ts: nowMs,
                    });
                    while (room.recentHugs.length > 0 &&
                        nowMs - room.recentHugs[0].ts >= 90_000) {
                        room.recentHugs.shift();
                    }
                    if (room.recentHugs.length > 12) {
                        room.recentHugs.splice(0, room.recentHugs.length - 12);
                    }
                    const pinKey = sanitize(h.pinId, 64) ||
                        `pin-${region
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, '')}`;
                    const existingPin = room.hugPins.get(pinKey);
                    room.hugPins.set(pinKey, {
                        id: pinKey,
                        region,
                        lat,
                        lon,
                        color: color || '#f472b6',
                        count: (existingPin?.count || 0) + 1,
                        lastHugTs: nowMs,
                    });
                }
                if (body.isInitialView === true) {
                    room.cachedTotalVisits += 1;
                    room.cachedDayVisits += 1;
                }
                if (shouldSyncDdb) {
                    const prunedSouls = Array.from(room.activeSouls.values())
                        .filter((s) => nowMs - s.lastSeen <= 110_000)
                        .slice(-24);
                    const prunedRipples = room.recentRipples
                        .filter((r) => nowMs - r.ts < 90_000)
                        .slice(-12);
                    const prunedHugs = room.recentHugs
                        .filter((h) => nowMs - h.ts < 90_000)
                        .slice(-12);
                    const persistentHugPins = Array.from(room.hugPins.values())
                        .sort((a, b) => (b.lastHugTs || 0) - (a.lastHugTs || 0))
                        .slice(0, 64);
                    try {
                        const res = await ddb.send(new UpdateCommand({
                            TableName: TABLE,
                            Key: { pk: room.pk, sk: 'COUNTS' },
                            UpdateExpression: 'SET activeSouls = :souls, recentRipples = :ripples, recentHugs = :hugs, hugPins = :hugPins, totalVisits = :visits, totalHugs = :totalHugs',
                            ExpressionAttributeValues: {
                                ':souls': prunedSouls,
                                ':ripples': prunedRipples,
                                ':hugs': prunedHugs,
                                ':hugPins': persistentHugPins,
                                ':visits': room.cachedTotalVisits,
                                ':totalHugs': room.cachedTotalHugs,
                            },
                            ReturnValues: 'ALL_NEW',
                        }));
                        if (typeof res.Attributes?.totalVisits === 'number') {
                            room.cachedTotalVisits = Math.max(room.cachedTotalVisits, res.Attributes.totalVisits);
                        }
                        if (typeof res.Attributes?.totalHugs === 'number') {
                            room.cachedTotalHugs = Math.max(room.cachedTotalHugs, res.Attributes.totalHugs);
                        }
                    }
                    catch {
                        // Offline / local Docker fallback
                    }
                }
            }
            const recentRipples = room.recentRipples
                .filter((r) => nowMs - r.ts < 90_000)
                .slice(-12);
            const recentHugs = room.recentHugs
                .filter((h) => nowMs - h.ts < 90_000)
                .slice(-12);
            const hugPins = Array.from(room.hugPins.values())
                .sort((a, b) => (b.lastHugTs || 0) - (a.lastHugTs || 0))
                .slice(0, 64);
            return respond(200, {
                ok: true,
                activeCount: room.activeSouls.size,
                activeSouls: Array.from(room.activeSouls.values()).slice(0, 24),
                totalVisits: room.cachedTotalVisits,
                dayVisits: room.cachedDayVisits,
                totalHugs: room.cachedTotalHugs,
                recentRipples,
                recentHugs,
                hugPins,
            });
        }
        if (method === 'GET' && (path === '/' || path === '/pledges')) {
            let item = fallbackMeta;
            let dbEntries = fallbackEntries;
            if (ddb) {
                try {
                    const [statsRes, entriesRes] = await Promise.all([
                        ddb.send(new GetCommand({
                            TableName: TABLE,
                            Key: { pk: 'META', sk: 'COUNTS' },
                        })),
                        ddb.send(new QueryCommand({
                            TableName: TABLE,
                            KeyConditionExpression: 'pk = :pk',
                            ExpressionAttributeValues: { ':pk': 'ENTRY' },
                            ScanIndexForward: false,
                            Limit: 50,
                        })),
                    ]);
                    item = statsRes.Item || {};
                    mergeRemoteState(ROOMS.default, item, Date.now());
                    dbEntries = (entriesRes.Items || []).map((e) => ({
                        id: e.sk,
                        type: e.type,
                        handle: e.handle,
                        location: e.location,
                        pledgeMillions: e.pledgeMillions,
                        pledgeTier: e.pledgeTier,
                        needCategory: e.needCategory,
                        message: e.message,
                        createdAt: e.createdAt,
                    }));
                }
                catch {
                    item = fallbackMeta;
                    dbEntries = fallbackEntries;
                }
            }
            const recent = [...dbEntries, ...SEED_ENTRIES].slice(0, 50);
            return respond(200, {
                counts: {
                    signatures: (item.signatures || 0) + 1,
                    wealthPledges: (item.wealthPledges || 0) + 1,
                    totalPledgedMillions: (item.totalPledgedMillions || 0) + 10,
                    beneficiaries: (item.beneficiaries || 0) + 1,
                    bitesTaken: (item.bitesTaken || 0) + 3,
                },
                recent,
            });
        }
        if (method === 'POST' && path === '/bite') {
            fallbackMeta.bitesTaken += 1;
            let item = fallbackMeta;
            if (ddb) {
                try {
                    const res = await ddb.send(new UpdateCommand({
                        TableName: TABLE,
                        Key: { pk: 'META', sk: 'COUNTS' },
                        UpdateExpression: 'ADD bitesTaken :inc',
                        ExpressionAttributeValues: { ':inc': 1 },
                        ReturnValues: 'ALL_NEW',
                    }));
                    item = res.Attributes || fallbackMeta;
                }
                catch {
                    item = fallbackMeta;
                }
            }
            return respond(200, {
                ok: true,
                bitesTaken: (item.bitesTaken || 0) + 3,
            });
        }
        if (method === 'POST' && path === '/pledge') {
            const body = JSON.parse(event.body || '{}');
            const type = body.type;
            if (!['signature', 'wealth_pledge', 'beneficiary'].includes(type)) {
                return respond(400, { error: 'Invalid pledge type' });
            }
            const defaultHandles = {
                signature: 'Anonymous Signer',
                wealth_pledge: 'Anonymous 1% Spark',
                beneficiary: 'Anonymous Beneficiary',
            };
            const handle = sanitize(body.handle, 48) || defaultHandles[type];
            const location = sanitize(body.location, 48) || 'Earth';
            const message = sanitize(body.message, 360) ||
                'All humans deserve to experience bliss and freedom from suffering.';
            const pledgeTier = sanitize(body.pledgeTier, 90);
            const needCategory = sanitize(body.needCategory, 90);
            const rawMillions = Number(body.pledgeMillions) || 0;
            const pledgeMillions = type === 'wealth_pledge' ? Math.max(0, Math.min(10000, rawMillions)) : 0;
            const nowIso = new Date().toISOString();
            const sk = `${nowIso}#${Math.random().toString(36).slice(2, 8)}`;
            const entry = {
                pk: 'ENTRY',
                sk,
                type,
                handle,
                location,
                pledgeMillions,
                pledgeTier,
                needCategory,
                message,
                createdAt: nowIso,
            };
            const counterField = type === 'signature'
                ? 'signatures'
                : type === 'wealth_pledge'
                    ? 'wealthPledges'
                    : 'beneficiaries';
            fallbackMeta[counterField] = (fallbackMeta[counterField] || 0) + 1;
            fallbackMeta.totalPledgedMillions =
                (fallbackMeta.totalPledgedMillions || 0) + pledgeMillions;
            fallbackMeta.bitesTaken = (fallbackMeta.bitesTaken || 0) + 1;
            fallbackEntries.unshift({
                id: sk,
                type,
                handle,
                location,
                pledgeMillions,
                pledgeTier,
                needCategory,
                message,
                createdAt: nowIso,
            });
            if (ddb) {
                try {
                    await Promise.all([
                        ddb.send(new PutCommand({
                            TableName: TABLE,
                            Item: entry,
                        })),
                        ddb.send(new UpdateCommand({
                            TableName: TABLE,
                            Key: { pk: 'META', sk: 'COUNTS' },
                            UpdateExpression: 'ADD #cf :inc, totalPledgedMillions :pm, bitesTaken :inc',
                            ExpressionAttributeNames: { '#cf': counterField },
                            ExpressionAttributeValues: {
                                ':inc': 1,
                                ':pm': pledgeMillions,
                            },
                        })),
                    ]);
                }
                catch {
                    // Offline / local Docker fallback
                }
            }
            return respond(200, {
                ok: true,
                entry: {
                    id: sk,
                    type,
                    handle,
                    location,
                    pledgeMillions,
                    pledgeTier,
                    needCategory,
                    message,
                    createdAt: nowIso,
                },
            });
        }
        return respond(404, { error: 'Not found' });
    }
    catch (err) {
        console.error('Presence/Pledges handler error:', err);
        return respond(500, { error: 'Internal server error' });
    }
}
