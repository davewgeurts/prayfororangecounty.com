export enum CAMERA_VIEW {
  GTA_TOP_DOWN = 'GTA_TOP_DOWN',
  COCKPIT_WINDSHIELD = 'COCKPIT_WINDSHIELD'
}

export enum DRIVE_MODE {
  MANUAL = 'MANUAL',
  AUTOPILOT = 'AUTOPILOT'
}

export enum EXPERIENCE_PHASE {
  MILOSPORT_SHOP = 'MILOSPORT_SHOP',
  DRIVE_CANYON = 'DRIVE_CANYON',
  BRIGHTON_SKIFREE = 'BRIGHTON_SKIFREE'
}

export type SurfSpotId = 'dana_point' | 'san_clemente_pier' | 'trestles_wsl';

export interface SurfSpotInfo {
  id: SurfSpotId;
  name: string;
  shortName: string;
  mile: number;
  waveHeight: string;
  swellPeriod: string;
  waterTemp: string;
  vibe: string;
  localCrew: string;
  isWslEvent?: boolean;
  description: string;
  beachHighlights: string[];
}

export const SURF_SPOTS: SurfSpotInfo[] = [
  {
    id: 'dana_point',
    name: 'Dana Point • Doheny & Salt Creek ("Killer Dana")',
    shortName: 'Dana Point',
    mile: 9.5,
    waveHeight: '4–6 FT+',
    swellPeriod: '15s SSW',
    waterTemp: '68°F',
    vibe: 'Longboard Point Rollers, Salt Creek Lefts & Sea Turtles',
    localCrew: 'Dana Point Harbor Patrol & Creek Locals',
    description: 'Home of the Hobie heritage, Doheny State Beach point rollers, Salt Creek hollow gravel lefts, and green sea turtles cruising the kelp beds.',
    beachHighlights: [
      'Sea turtles (Honu) & dolphin pods swimming past the harbor jetty',
      'Families sunbathing on striped towels & kids building sandcastles in the cove',
      'Pelican squadrons gliding inches above the glassy peelers',
      'State Beach Lifeguard Tower #3 watching the inside reform'
    ]
  },
  {
    id: 'san_clemente_pier',
    name: 'San Clemente Pier & T-Street Reef',
    shortName: 'San Clemente Pier',
    mile: 13.5,
    waveHeight: '5–7 FT',
    swellPeriod: '16s SSW',
    waterTemp: '69°F',
    vibe: 'Punchy Pier Bowl Barrels, Boogie Slabs & Amtrak Horn',
    localCrew: 'San Clemente Pier Bowl & T-Street Enforcers',
    description: 'The historic 1,296-foot wooden San Clemente Pier! Punchy sandbar barrels on the north side, T-Street reef rights to the south, and the Pacific Surfliner train rumbling right along the sand.',
    beachHighlights: [
      'Iconic wooden pier pilings with fishermen & spectators cheering from the rails',
      'Boogie boarders & surfers pulling into hollow Pier Bowl shorebreak tubes',
      'Sunbathers, beach umbrellas, kids splashing, and Tidepool seashells along T-Street',
      'San Clemente Marine Safety Lifeguard Tower with blackball flag patrol'
    ]
  },
  {
    id: 'trestles_wsl',
    name: 'Lower Trestles • WSL World Championship Finals',
    shortName: 'Trestles (WSL Finals)',
    mile: 16.5,
    waveHeight: '6–8 FT+ PERFECT',
    swellPeriod: '17s SSW',
    waterTemp: '70°F',
    vibe: 'Cobblestone A-Frame Perfection • WSL Finals Live Broadcast',
    localCrew: 'WSL Top 5 Pros & 2% San Clemente Underground',
    isWslEvent: true,
    description: 'The high-performance surfing capital of North America! After walking down the sacred trail under I-5, paddle out into the World Surf League Championship Finals in front of thousands of roaring fans on the cobblestones!',
    beachHighlights: [
      'Massive WSL Finals beach arena packed with thousands of cheering fans & flags',
      '3-story WSL Broadcast & Judges Tower scoring every air-reverse & barrel (0.00–10.00)',
      'Dolphins leaping straight through the Championship Tour contest lineup',
      'Sunbathers, groms playing in the shorebreak, sea turtles, pelicans & seashells'
    ]
  }
];

export interface Landmark {
  id: string;
  name: string;
  mile: number;
  elevationFt: number;
  description: string;
  isSilentRock?: boolean;
  isMilosport?: boolean;
  surfSpotId?: SurfSpotId;
}

export const CANYON_LANDMARKS: Landmark[] = [
  {
    id: 'surf-and-paddle',
    name: 'Surf & Paddle Laguna + The Taco Stand (699 S Coast Hwy)',
    mile: 0.0,
    elevationFt: 28,
    description: 'Laguna Beach’s core surf & boogie board shop right next door to The Taco Stand on Pacific Coast Highway. Grab your board, pro buddy, and Al Pastor tacos here!',
    isMilosport: true
  },
  {
    id: 'main-beach',
    name: 'Laguna Main Beach & Wyland Whaling Wall',
    mile: 1.4,
    elevationFt: 18,
    description: 'Iconic white wooden lifeguard tower, beachfront basketball courts, and tidepools teeming with anemones and seashells.'
  },
  {
    id: 'treasure-island',
    name: 'Treasure Island Beach by Montage Laguna Beach',
    mile: 3.2,
    elevationFt: 65,
    description: 'Crystal-clear turquoise coves, natural stone keyhole arch, manicured Montage coastal bluffs, and shorebreak barrels.'
  },
  {
    id: 'thousand-steps',
    name: '1000 Steps Beach (Sacred Swell Overlook • 9th Ave)',
    mile: 4.5,
    elevationFt: 145,
    description: 'The sacred steep cliff stairs of South Laguna! Turn down the radio, gaze out at the SSW corduroy lines & sea caves, and offer an Ocean Prayer.',
    isSilentRock: true
  },
  {
    id: 'salt-creek',
    name: 'Salt Creek Beach & Monarch Bay Headlands',
    mile: 7.2,
    elevationFt: 110,
    description: 'Sweeping ocean bluff below the Ritz-Carlton overlooking Gravels and Middles hollow lefts.'
  },
  {
    id: 'dana-point',
    name: 'Dana Point Harbor & Doheny State Beach',
    mile: 9.5,
    elevationFt: 24,
    description: 'Destination #1: "Killer Dana" headland, harbor jetty, Doheny longboard peelers, pelicans, and friendly sea turtles!',
    surfSpotId: 'dana_point'
  },
  {
    id: 'san-clemente-pier',
    name: 'San Clemente Pier & T-Street Reef',
    mile: 13.5,
    elevationFt: 35,
    description: 'Destination #2: Historic wooden pier, Amtrak train tracks on the sand, T-Street reef, and hollow Pier Bowl wedges!',
    surfSpotId: 'san_clemente_pier'
  },
  {
    id: 'trestles',
    name: 'Lower Trestles • San Onofre (WSL Championship Finals)',
    mile: 16.5,
    elevationFt: 15,
    description: 'Destination #3: The sacred cobblestone A-frame point break! Home of the WSL Finals, roaring beach fans, dolphins, and world titles!',
    surfSpotId: 'trestles_wsl'
  }
];

export interface PlayerCarState {
  x: number;
  y: number;
  angle: number; // in radians
  speed: number; // in MPH (0 - 65)
  steering: number; // -1 to 1
  distanceMiles: number; // 0.0 to 16.5
  elevationFt: number;
  driveMode: DRIVE_MODE;
  cameraView: CAMERA_VIEW;
  radioMuted: boolean;
  wipersActive: boolean;
  headlights: boolean;
  silenceObserved: boolean;
  prayersCount: number;
  selectedBoardId: string;
  selectedRiderId: string;
  selectedSpotId?: SurfSpotId;
  tireOptionId: string;
  hasTractionPass: boolean;
  purchasedPassIds: string[];
  waxScore: number;
  waxFormulaId: string;
  waxSpeedMultiplier: number;
  isPulledOver?: boolean;
  pulledOverReason?: string;
  copEncounterCount?: number;
  isArrested?: boolean;
  arrestReason?: string;
  arrestCount?: number;
  hasSwigBuff?: boolean;
  swigDrinkName?: string;
  hasWhaleBlessing?: boolean;
  isAtSwig?: boolean;
  isAtWhale?: boolean;
  isAt711?: boolean;
  isAtX96?: boolean;
  hasX96Prize?: boolean;
  radioStationLabel?: string;
  radioNowPlaying?: string;
  fuelLevel?: number;
  fuelGrade?: string;
  hasGasDashChase?: boolean;
  chaseSecondsLeft?: number;
  evadedCopCount?: number;
  snackItemName?: string;
}
