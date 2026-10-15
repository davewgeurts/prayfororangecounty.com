// KROQ 106.7 FM & Surfline Swell Radio — OC Coastal Radio, Kook of the Day, and Surf Trivia!

export const X96_STATION = {
  callSign: 'KROQ / OC-106.7',
  name: 'KROQ SURF',
  frequency: '106.7 FM',
  tagline: 'SoCal Coast & Trestles Swell Radio',
  owner: 'South Coast Surf Broadcast',
  studioAddress: '699 S Coast Hwy / Pier Bowl Broadcast Booth',
  studioCity: 'Laguna Beach & San Clemente, CA',
  studioCrossStreets: 'Pacific Coast Highway between Thalia St & Del Mar Ave',
  phone: '(949) 555-SURF',
  hd2Name: 'Laguna Surf & Reggae HD2',
  // Direct CORS-enabled stream with fallback to built-in Pacific Surf Synth
  streamUrl: 'https://ais-sa1.streamon.fm/7346_48k.aac',
  nowPlayingUrl: 'https://yp.cdnstream1.com/metadata/7346_48k/current.json',
  listenLivePage: 'https://prayfortheocean.com',
  watchLivePage: 'https://worldsurfleague.com'
}

export const RFH_FALLBACK_EPISODE = {
  title: 'OC Dawn Patrol & WSL Trestles Finals Live Swell Report',
  shortLabel: 'OC SWELL REPORT LIVE',
  mp3Url: 'https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/75761696/rfh_podcast_10132026.mp3',
  rundown: 'Live SSW Hurricane Swell buoy telemetry from San Clemente Pier, Taco Stand Laguna line update, Kook of the Day nominations, Beat the Forecaster trivia, and WSL Finals heat draw at Lower Trestles.'
}

export interface X96NowPlayingEvent {
  TPE1?: string;
  TIT2?: string;
  TALB?: string;
  TXXX_category?: string;
}

export interface RfhHost {
  id: 'kerry' | 'bill' | 'gina';
  name: string;
  emoji: string;
  role: string;
  bio: string;
}

export const RFH_HOSTS: RfhHost[] = [
  {
    id: 'kerry',
    name: 'Strider "Rasberry" Wasilewski',
    emoji: '🌊',
    role: 'Water Patrol • Priority & Barrel Analyst',
    bio: 'Broadcasting live from the channel in swimfins with a waterproof mic. Knows every boil on the reef from 1000 Steps to Lower Trestles.'
  },
  {
    id: 'bill',
    name: 'PT (Peter "PT" Townend)',
    emoji: '🏆',
    role: '1976 World Champ • OC Surf Godfather',
    bio: 'First-ever World Surfing Champion and longtime Orange County icon. Roasts kooks dropping in at the Pier and calls the history on every set.'
  },
  {
    id: 'gina',
    name: 'Schuler (Chief Swell Forecaster)',
    emoji: '📡',
    role: 'Buoy Whisperer • Undefeated at Surf Trivia',
    bio: 'Tracks Southern Hemisphere storms from New Zealand to the San Clemente buoy. Can predict a 17-second SSW set wave down to the minute.'
  }
]

export const RFH_PRODUCER = {
  name: 'Kai',
  role: 'Dawn Patrol Producer',
  dogName: 'Finley',
  dogDescription: 'Golden Retriever who tandem-surfs Doheny on a 9\'0" Catch Surf Log'
}

export const RFH_SEGMENTS: { name: string; detail: string }[] = [
  { name: 'Dawn Patrol Buoy Check', detail: 'San Clemente & Dana Point CDIP buoy readings at first light.' },
  { name: 'Kook of the Day', detail: 'Three stories of legendary beach & lineup fails from Laguna to Trestles.' },
  { name: 'Beat the Forecaster', detail: 'Callers go head-to-head on Orange County surf, beach, and WSL trivia.' },
  { name: 'Taco Stand Line Watch', detail: 'Live wait-time telemetry for Al Pastor tacos at 699 S Coast Hwy.' },
  { name: 'Blackball Flag Alert', detail: 'When the lifeguards raise the yellow-and-black circle flag for bodyboarders.' }
]

export const RFH_FACTS: string[] = [
  'Surf & Paddle in Laguna Beach sits right next to The Taco Stand on Pacific Coast Highway.',
  '1000 Steps Beach at 9th Ave in South Laguna actually has around 219 steep coastal stairs to the sand.',
  'Treasure Island Beach sits just below the Montage Laguna Beach resort, famous for its crystal turquoise coves and tidepools.',
  'Dana Point was home to the legendary "Killer Dana" point break before the harbor jetty was built in the late 1960s.',
  'The San Clemente Pier stretches 1,296 feet into the Pacific Ocean, with the Amtrak Pacific Surfliner running right along the sand.',
  'Lower Trestles in San Onofre State Beach hosts the WSL Championship Tour Finals, crowning the men’s and women’s World Champions.',
  'San Clemente’s "2% Crew" (led by Kolohe Andino, Griffin Colapinto, Crosby Colapinto, and Ian Crane) dominates modern freesurfing and the WSL.',
  'Green sea turtles (Honu) and pods of bottlenose dolphins regularly swim right through the surf lineup from Dana Point to Trestles.'
]

export interface BonerNominee {
  id: string;
  headline: string;
  story: string;
  hostId: RfhHost['id'];
  hostReaction: string;
}

// "Kook of the Day" nominees — hilarious PG beach & surf stories!
export const BONER_NOMINEES: BonerNominee[] = [
  {
    id: 'waffle-wax-bottom',
    headline: 'Tourist Waxes the BOTTOM of His Surfboard at Main Beach',
    story: 'Bought three bars of Sticky Bumps at Surf & Paddle, then spent 30 minutes meticulously waxing the slick fiberglass bottom and all three fins so the board would "grip the water better."',
    hostId: 'bill',
    hostReaction: 'Mate, the wax goes where your FEET go, not where the ocean goes! That board has the glide speed of Velcro!'
  },
  {
    id: 'prius-treasure-island',
    headline: 'Rental Convertible Drives Down the Ramp onto Treasure Island Sand',
    story: 'Followed GPS instructions for "beachfront parking" at Treasure Island by the Montage and drove a rental convertible straight into the wet sand at incoming high tide. Two lifeguards and a pelican watched in disbelief.',
    hostId: 'gina',
    hostReaction: 'The Montage valet is good, but they don’t valet park three feet into the shorebreak.'
  },
  {
    id: 'wsl-flamingo-floatie',
    headline: 'Guy Paddles into the WSL Finals Heat on a Giant Pink Flamingo',
    story: 'Drifted right into the Lower Trestles competition zone during the World Title heat on an 8-foot inflatable flamingo while eating a California burrito. Water patrol had to tow him out with a Jet Ski.',
    hostId: 'kerry',
    hostReaction: 'Honestly, he held his line through the inside section! Judges gave the flamingo a 4.5!'
  },
  {
    id: 'thousand-steps-cooler',
    headline: 'Bro Brings a 120-Quart Wheeled Cooler Down 1000 Steps Beach',
    story: 'Ignored the warning sign at 9th Ave and tried rolling a 90-pound ice chest down all 219 stairs at 1000 Steps. By step 40, the cooler caught air and hit a 360 into the bushes. Then he realized he had to carry it back up.',
    hostId: 'gina',
    hostReaction: 'Walking back up 1000 Steps with wet swimfins is hard enough—carrying a cooler back up is a felony leg workout.'
  },
  {
    id: 'seagull-burrito-heist',
    headline: 'San Clemente Pier Seagull Steals Entire Taco Stand Order',
    story: 'Unwrapped two Al Pastor tacos and a churro on his beach towel at San Clemente Pier, walked ten feet to check the surf, and returned to find a squadron of 14 seagulls flying off with the foil bag.',
    hostId: 'bill',
    hostReaction: 'Never leave an Al Pastor taco unguarded within a mile of the San Clemente Pier. Those gulls are tactical professionals.'
  },
  {
    id: 'backwards-wetsuit-doheny',
    headline: 'Inland Valley Surfer Paddles Out at Dana Point With Wetsuit Backwards',
    story: 'Put his chest-zip wetsuit on with the knee pads on the backs of his calves and the zipper choking his throat, then asked a local at Doheny why modern wetsuits are so tight.',
    hostId: 'kerry',
    hostReaction: 'At least his calves were well padded while he was getting ragdolled in the whitewash!'
  }
]

export const PLAYER_BONER_STORY = {
  headline: 'Local Shredder Leaves Taco Stand Salsa Cup on Roof Rack',
  story: 'Balanced a cup of fiery habanero mango salsa on the tail of your Lost surfboard outside Surf & Paddle in Laguna, pulled out onto PCH, and somehow it stayed balanced all the way to Treasure Island!',
  reaction: 'Won Listener Clip of the Week! The station front desk has a free WSL Finals & State Beach VIP Pass waiting for you!'
}

export interface BeatGinaQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export const BEAT_GINA_QUESTIONS: BeatGinaQuestion[] = [
  { question: 'Which legendary taco spot sits right next to the surf shops on PCH in Laguna Beach?', options: ['The Taco Stand', 'Taco Bell Cantina', 'Rubio’s Express'], answerIndex: 0 },
  { question: 'Which luxury resort bluff overlooks Treasure Island Beach in Laguna Beach?', options: ['Hotel del Coronado', 'Montage Laguna Beach', 'The Beverly Hills Hotel'], answerIndex: 1 },
  { question: 'Roughly how many actual stairs are at Laguna’s famous "1000 Steps Beach"?', options: ['Exactly 1,000', '45 steps', 'Around 219 steps'], answerIndex: 2 },
  { question: 'Which cobblestone point break hosts the WSL World Championship Tour Finals?', options: ['Lower Trestles', 'Huntington Pier', 'Malibu First Point'], answerIndex: 0 },
  { question: 'Who founded Lost Surfboards ("Mayhem") in San Clemente?', options: ['Rob Machado', 'Matt Biolos', 'Gerry Lopez'], answerIndex: 1 },
  { question: 'Which train runs right along the sand past the San Clemente Pier and T-Street?', options: ['Napa Wine Train', 'Grand Canyon Railway', 'Pacific Surfliner'], answerIndex: 2 },
  { question: 'What was the name of the legendary big-wave point break at Dana Point before the harbor was built?', options: ['Killer Dana', 'Mavericks South', 'Banzai Point'], answerIndex: 0 },
  { question: 'Which San Clemente surfer won the WSL World Title and Olympic Gold Medal?', options: ['Lisa Andersen', 'Caroline Marks', 'Layne Beachley'], answerIndex: 1 },
  { question: 'Who invented the original Morey Boogie Board?', options: ['Duke Kahanamoku', 'Hobie Alter', 'Tom Morey'], answerIndex: 2 }
]

export function isRadioFromHellOnAir(now: Date = new Date()): boolean {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      weekday: 'short',
      hour: 'numeric',
      hourCycle: 'h23'
    }).formatToParts(now)
    const weekday = parts.find(p => p.type === 'weekday')?.value ?? ''
    const hour = Number(parts.find(p => p.type === 'hour')?.value ?? -1)
    return !['Sat', 'Sun'].includes(weekday) && hour >= 6 && hour < 10
  } catch {
    return false
  }
}

export function formatX96NowPlaying(event?: X96NowPlayingEvent, now: Date = new Date()): string {
  if (isRadioFromHellOnAir(now)) return 'OC DAWN PATROL • SWELL & TACO STAND REPORT'
  if (event?.TXXX_category === 'music' && event.TPE1 && event.TIT2) return `${event.TPE1} – ${event.TIT2}`
  return event?.TIT2 || 'SUBLIME / DICK DALE / PACIFIC SURF SYNTH'
}

export function pickRandom<T>(list: T[], count: number): T[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}
