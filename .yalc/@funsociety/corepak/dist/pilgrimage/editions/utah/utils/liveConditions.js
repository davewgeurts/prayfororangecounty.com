import { useEffect, useState } from 'react';
// Live Brighton / Big Cottonwood conditions, pulled straight from public CORS-friendly feeds:
//  - NRCS SNOTEL "Brighton" (366:UT:SNTL, 8,790 ft): measured snow depth + air temp, hourly
//  - Open-Meteo: model forecast snowfall for the next 3 days at Brighton
//  - NWS SLC gridpoint forecast: the human-readable "Tonight: Snow likely" line
//  - UDOT road conditions for SR-190/SR-210 via our prayforsnow-canyon-roads Lambda proxy
// Every source is optional; the UI renders whatever arrived.
const BRIGHTON = { lat: 40.598, lon: -111.583, elevationM: 2670 };
const SNOTEL_STATION = '366:UT:SNTL';
const NWS_FORECAST_URL = 'https://api.weather.gov/gridpoints/SLC/110,167/forecast';
const CANYON_ROADS_URL = 'https://pdh2iow6low5ghi3bdwpiugp7e0kjyoq.lambda-url.us-west-2.on.aws/';
const REFRESH_MS = 10 * 60 * 1000;
const getJson = async (url) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok)
        throw new Error(`${url} -> ${res.status}`);
    return res.json();
};
// SNOTEL timestamps are station-local standard time; we only need relative hours.
const snotelStamp = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:00`;
};
const fetchSnotel = async () => {
    const end = new Date();
    const begin = new Date(end.getTime() - 30 * 3600 * 1000);
    const url = 'https://wcc.sc.egov.usda.gov/awdbRestApi/services/v1/data' +
        `?stationTriplets=${SNOTEL_STATION}&elements=SNWD,TOBS&duration=HOURLY` +
        `&beginDate=${encodeURIComponent(snotelStamp(begin))}&endDate=${encodeURIComponent(snotelStamp(end))}`;
    const body = await getJson(url);
    const series = (code) => (body[0]?.data.find(d => d.stationElement.elementCode === code)?.values ?? []).filter(v => typeof v.value === 'number');
    const depth = series('SNWD');
    const temp = series('TOBS');
    const latestDepth = depth[depth.length - 1];
    // Depth ~24h ago: first reading at least 24h older than the latest one
    let newSnow = null;
    if (latestDepth) {
        const latestT = new Date(latestDepth.date.replace(' ', 'T')).getTime();
        const prior = depth.find(v => latestT - new Date(v.date.replace(' ', 'T')).getTime() <= 24 * 3600 * 1000);
        if (prior)
            newSnow = Math.max(0, latestDepth.value - prior.value);
    }
    const latestTemp = temp[temp.length - 1];
    return {
        baseDepthIn: latestDepth ? latestDepth.value : null,
        newSnow24hIn: newSnow,
        summitTempF: latestTemp ? latestTemp.value : null,
        observedAt: latestTemp?.date ?? latestDepth?.date ?? null
    };
};
const fetchOpenMeteo = async () => {
    const url = 'https://api.open-meteo.com/v1/forecast' +
        `?latitude=${BRIGHTON.lat}&longitude=${BRIGHTON.lon}&elevation=${BRIGHTON.elevationM}` +
        '&current=temperature_2m,wind_speed_10m&daily=snowfall_sum,temperature_2m_max,temperature_2m_min' +
        '&forecast_days=4&temperature_unit=fahrenheit&precipitation_unit=inch&wind_speed_unit=mph&timezone=America%2FDenver';
    const body = await getJson(url);
    const daily = body.daily;
    const forecastDays = daily
        ? daily.time.map((date, i) => ({
            date,
            snowIn: Math.round((daily.snowfall_sum[i] ?? 0) * 10) / 10,
            hiF: Math.round(daily.temperature_2m_max[i]),
            loF: Math.round(daily.temperature_2m_min[i])
        }))
        : [];
    // today + next two days ≈ the next 72h of snow
    const forecast72hIn = forecastDays.length
        ? Math.round(forecastDays.slice(0, 3).reduce((sum, d) => sum + d.snowIn, 0) * 10) / 10
        : null;
    return {
        forecastDays,
        forecast72hIn,
        modelTempF: body.current ? Math.round(body.current.temperature_2m) : null,
        windMph: body.current ? Math.round(body.current.wind_speed_10m) : null
    };
};
const fetchNws = async () => {
    const body = await getJson(NWS_FORECAST_URL);
    const first = body.properties.periods[0];
    return { nwsPeriod: first?.name ?? null, nwsShort: first?.shortForecast ?? null };
};
const fetchRoads = async () => {
    const body = await getJson(CANYON_ROADS_URL);
    return body.segments;
};
export const fetchLiveConditions = async () => {
    const [snotel, meteo, nws, roads] = await Promise.allSettled([fetchSnotel(), fetchOpenMeteo(), fetchNws(), fetchRoads()]);
    const s = snotel.status === 'fulfilled' ? snotel.value : null;
    const m = meteo.status === 'fulfilled' ? meteo.value : null;
    const n = nws.status === 'fulfilled' ? nws.value : null;
    const snow = s || m || n
        ? {
            baseDepthIn: s?.baseDepthIn ?? null,
            newSnow24hIn: s?.newSnow24hIn ?? null,
            summitTempF: s?.summitTempF ?? m?.modelTempF ?? null,
            observedAt: s?.observedAt ?? null,
            forecast72hIn: m?.forecast72hIn ?? null,
            forecastDays: m?.forecastDays ?? [],
            windMph: m?.windMph ?? null,
            nwsPeriod: n?.nwsPeriod ?? null,
            nwsShort: n?.nwsShort ?? null
        }
        : null;
    return { snow, roads: roads.status === 'fulfilled' ? roads.value : null, fetchedAt: Date.now() };
};
// One shared fetch per page, refreshed every 10 minutes for every component using the hook
let shared = { data: null, promise: null };
const listeners = new Set();
let refreshTimer = null;
const load = () => {
    if (!shared.promise) {
        shared.promise = fetchLiveConditions().then(data => {
            shared = { data, promise: null };
            listeners.forEach(fn => fn(data));
            return data;
        });
    }
    return shared.promise;
};
export const useLiveConditions = () => {
    const [data, setData] = useState(shared.data);
    useEffect(() => {
        listeners.add(setData);
        if (!shared.data || Date.now() - shared.data.fetchedAt > REFRESH_MS)
            void load();
        if (refreshTimer === null)
            refreshTimer = window.setInterval(() => void load(), REFRESH_MS);
        return () => {
            listeners.delete(setData);
            if (listeners.size === 0 && refreshTimer !== null) {
                window.clearInterval(refreshTimer);
                refreshTimer = null;
            }
        };
    }, []);
    return data;
};
// ---- interpretation helpers shared by the UI ----
export const NO_RESTRICTION = /^(none|no restrictions?)?$/i;
export const canyonStatus = (roads) => {
    const bcc = (roads ?? []).filter(r => r.roadway.startsWith('SR-190'));
    if (bcc.length === 0)
        return null;
    const restricted = bcc.find(r => r.restriction && !NO_RESTRICTION.test(r.restriction.trim()));
    const worstRoad = bcc.find(r => r.roadCondition && !/dry/i.test(r.roadCondition))?.roadCondition ?? bcc[0].roadCondition;
    return {
        restricted: !!restricted,
        restriction: restricted?.restriction ?? null,
        roadCondition: worstRoad ?? 'unknown',
        weatherCondition: bcc[0].weatherCondition ?? null,
        updatedAt: bcc.map(r => r.updatedAt).filter(Boolean).sort().pop() ?? null
    };
};
export const prayerVerdict = (snow) => {
    if (snow?.newSnow24hIn != null && snow.newSnow24hIn >= 1)
        return 'answered';
    if (snow?.forecast72hIn != null && snow.forecast72hIn >= 1)
        return 'incoming';
    return 'dry';
};
// Match Trevor's wax formulas to the live summit temperature
export const recommendedWaxId = (tempF) => {
    if (tempF == null)
        return null;
    if (tempF <= 18)
        return 'milo_cold_pow';
    if (tempF <= 32)
        return 'all_temp_purple';
    return 'spring_butter';
};
