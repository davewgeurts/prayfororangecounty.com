import { getPilgrimageEdition } from '../edition';
import { X96_STATION as UTAH_X96_STATION, RFH_FALLBACK_EPISODE as UTAH_RFH_FALLBACK_EPISODE, RFH_HOSTS as UTAH_RFH_HOSTS, RFH_PRODUCER as UTAH_RFH_PRODUCER, RFH_SEGMENTS as UTAH_RFH_SEGMENTS, RFH_FACTS as UTAH_RFH_FACTS, BONER_NOMINEES as UTAH_BONER_NOMINEES, PLAYER_BONER_STORY as UTAH_PLAYER_BONER_STORY, BEAT_GINA_QUESTIONS as UTAH_BEAT_GINA_QUESTIONS, isRadioFromHellOnAir as utahIsRadioFromHellOnAir, formatX96NowPlaying as utahFormatX96NowPlaying, pickRandom, } from '../editions/utah/data/radioFromHell';
import { X96_STATION as OC_X96_STATION, RFH_FALLBACK_EPISODE as OC_RFH_FALLBACK_EPISODE, RFH_HOSTS as OC_RFH_HOSTS, RFH_PRODUCER as OC_RFH_PRODUCER, RFH_SEGMENTS as OC_RFH_SEGMENTS, RFH_FACTS as OC_RFH_FACTS, BONER_NOMINEES as OC_BONER_NOMINEES, PLAYER_BONER_STORY as OC_PLAYER_BONER_STORY, BEAT_GINA_QUESTIONS as OC_BEAT_GINA_QUESTIONS, isRadioFromHellOnAir as ocIsRadioFromHellOnAir, formatX96NowPlaying as ocFormatX96NowPlaying, } from '../editions/orangecounty/data/radioFromHell';
export { UTAH_X96_STATION, UTAH_RFH_FALLBACK_EPISODE, UTAH_RFH_HOSTS, UTAH_RFH_PRODUCER, UTAH_RFH_SEGMENTS, UTAH_RFH_FACTS, UTAH_BONER_NOMINEES, UTAH_PLAYER_BONER_STORY, UTAH_BEAT_GINA_QUESTIONS, OC_X96_STATION, OC_RFH_FALLBACK_EPISODE, OC_RFH_HOSTS, OC_RFH_PRODUCER, OC_RFH_SEGMENTS, OC_RFH_FACTS, OC_BONER_NOMINEES, OC_PLAYER_BONER_STORY, OC_BEAT_GINA_QUESTIONS, pickRandom, };
const isOc = getPilgrimageEdition() === 'orangecounty';
export const X96_STATION = isOc ? OC_X96_STATION : UTAH_X96_STATION;
export const RFH_FALLBACK_EPISODE = isOc ? OC_RFH_FALLBACK_EPISODE : UTAH_RFH_FALLBACK_EPISODE;
export const RFH_HOSTS = isOc ? OC_RFH_HOSTS : UTAH_RFH_HOSTS;
export const RFH_PRODUCER = isOc ? OC_RFH_PRODUCER : UTAH_RFH_PRODUCER;
export const RFH_SEGMENTS = isOc ? OC_RFH_SEGMENTS : UTAH_RFH_SEGMENTS;
export const RFH_FACTS = isOc ? OC_RFH_FACTS : UTAH_RFH_FACTS;
export const BONER_NOMINEES = isOc ? OC_BONER_NOMINEES : UTAH_BONER_NOMINEES;
export const PLAYER_BONER_STORY = isOc ? OC_PLAYER_BONER_STORY : UTAH_PLAYER_BONER_STORY;
export const BEAT_GINA_QUESTIONS = isOc ? OC_BEAT_GINA_QUESTIONS : UTAH_BEAT_GINA_QUESTIONS;
export function isRadioFromHellOnAir(now = new Date()) {
    return getPilgrimageEdition() === 'orangecounty'
        ? ocIsRadioFromHellOnAir(now)
        : utahIsRadioFromHellOnAir(now);
}
export function formatX96NowPlaying(event, now = new Date()) {
    return getPilgrimageEdition() === 'orangecounty'
        ? ocFormatX96NowPlaying(event, now)
        : utahFormatX96NowPlaying(event, now);
}
