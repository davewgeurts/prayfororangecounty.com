export interface Snowboard {
  id: string;
  brand: 'Lost Mayhem' | 'Channel Islands' | 'Catch Surf' | 'Boogie Board' | 'Surf & Paddle';
  craftType: 'surfboard' | 'boogie';
  name: string;
  series: string;
  year: string;
  type: 'WSL High-Performance' | 'Twin Fin Fish' | 'Soft-Top Shredder' | 'Pro Boogie / Bodyboard' | 'Laguna Custom Glass';
  flex: number; // 1 to 10 (Drive / Speed)
  pop: number; // 1 to 10 (Air & Lip Pop)
  float: number; // 1 to 10 (Paddle & Tube Float)
  camber: 'Squash Tail Thruster' | 'Swallow Tail Twin+1' | 'Crescent Tail Surlyn Slick' | 'Bat Tail PP Core' | 'Triple Stringer Foamie';
  lengthCm: number; // e.g. 510 for 5'10" or 42 for 42" boogie
  dimensionsLabel: string;
  description: string;
  accentColor: string;
  topGraphicColor: string;
  baseGraphicColor: string;
  logoUrl?: string;
  badge: string;
  perkDescription: string;
  statsBonus: {
    speedBoost: number;
    carveGrip: number;
    trickBonus: number;
    powFloat: number;
  };
}

export interface RiderPro {
  id: string;
  name: string;
  nickname: string;
  category: 'forum' | 'burton' | 'thirtytwo' | 'local_kids';
  categoryLabel: 'San Clemente 2% Crew' | 'WSL World Champ' | 'Laguna & Boogie Legend' | 'OC Local Grom';
  sponsor: string;
  sponsorLogoUrl?: string;
  stance: 'Regular' | 'Goofy';
  hometown: string;
  favoriteTrick: string;
  bio: string;
  defaultBoardId: string;
  avatarColor: string;
  accentColor: string;
  iconEmoji: string;
  dialogue: {
    atShop: string;
    leavingShop: string;
    approachingSilentRock: string;
    atSilentRock: string;
    speeding: string;
    approachingBrighton: string;
    atBrighton: string;
    cheers: string[];
  };
}

export interface MilosportPhoto {
  id: string;
  title: string;
  category: 'parking_lot' | 'inside_shop' | 'pro_sale' | 'crew';
  categoryLabel: string;
  imageUrl: string;
  caption: string;
  lore: string;
}

export const MILOSPORT_PHOTOS: MilosportPhoto[] = [
  {
    id: 'storefront',
    title: 'Surf & Paddle Laguna Beach + The Taco Stand (699 S Coast Hwy)',
    category: 'parking_lot',
    categoryLabel: 'PCH Storefront (Laguna Beach)',
    imageUrl: '/assets/milosport/storefront.jpg',
    caption: '699 South Coast Highway in Laguna Beach — Rack of custom surfboards & boogie boards right next to The Taco Stand line.',
    lore: 'Every South Coast dawn patrol starts right here: grab Sticky Bumps wax and a Lost RNF or Morey Boogie at Surf & Paddle, then score two Al Pastor tacos next door.'
  },
  {
    id: 'taco_stand',
    title: 'The Taco Stand Laguna Beach — Al Pastor Trompo & Salsa Bar',
    category: 'pro_sale',
    categoryLabel: 'Next Door Fuel Stop',
    imageUrl: '/assets/milosport/pro_sale.jpg',
    caption: 'Handmade corn tortillas pressed live in the window, sizzling Al Pastor off the spit, and California burritos before hitting PCH.',
    lore: 'Locals know the move: order the Al Pastor and a Baja fish taco, load up on habanero mango salsa, and eat on the tailgate while checking the Thalia Street surf cam.'
  },
  {
    id: 'treasure_island',
    title: 'Treasure Island Beach by Montage Laguna Beach',
    category: 'inside_shop',
    categoryLabel: 'Mile 3.2 • Montage Reef & Arch',
    imageUrl: '/assets/milosport/inside_shop.jpg',
    caption: 'Turquoise water, natural stone keyhole arches, tidepools filled with starfish & seashells, and crystal-clear shorebreak.',
    lore: 'Just south of Goff Island and the Montage resort lawns, Treasure Island lights up on south swells with dolphins swimming right through the crystal cove.'
  },
  {
    id: 'thousand_steps',
    title: '1000 Steps Beach (9th Ave Cliff Stairs, South Laguna)',
    category: 'inside_shop',
    categoryLabel: 'Mile 4.5 • Sacred Swell Overlook',
    imageUrl: '/assets/milosport/shop_interior_boards.jpg',
    caption: '219 steep coastal concrete steps plunging down through sea-grape tunnels to hollow shorebreak barrels and sea caves.',
    lore: 'Laguna bodyboarders, skimboarders, and tube hounds treat 1000 Steps like sacred ground. Pause at the cliff top to read the SSW swell intervals before dropping down.'
  },
  {
    id: 'san_clemente_pier',
    title: 'San Clemente Pier Bowl & T-Street Reef',
    category: 'crew',
    categoryLabel: 'Mile 13.5 • Pier & Amtrak Tracks',
    imageUrl: '/assets/milosport/milo_crew.jpg',
    caption: 'The 1,296-foot wooden San Clemente Pier with the Pacific Surfliner train rolling right along the sand.',
    lore: 'Home of the 2% Crew, T-Street reef rights, and punchy Pier Bowl barrels where groms, sea turtles, pelicans, and lifeguards share the sunny lineup.'
  },
  {
    id: 'trestles_wsl',
    title: 'Lower Trestles — WSL Championship Tour Finals Arena',
    category: 'crew',
    categoryLabel: 'Mile 16.5 • WSL Finals @ Lowers',
    imageUrl: '/assets/milosport/first_look.jpg',
    caption: 'Cobblestone A-frame perfection at San Onofre State Beach packed with thousands of cheering WSL Finals fans on the beach!',
    lore: 'After walking or e-biking down the wetlands trail under I-5, you step onto the sacred cobblestones of Lowers—where World Champions are crowned in front of a roaring beach crowd.'
  }
];

export const SNOWBOARDS_LIST: Snowboard[] = [
  // LOST SURFBOARDS (SAN CLEMENTE)
  {
    id: 'forum-destroyer',
    brand: 'Lost Mayhem',
    craftType: 'surfboard',
    name: 'Lost Driver 3.0 WSL Pro',
    series: 'Mayhem Championship Tour',
    year: '2026 WSL Finals',
    type: 'WSL High-Performance',
    flex: 9,
    pop: 10,
    float: 8,
    camber: 'Squash Tail Thruster',
    lengthCm: 511,
    dimensionsLabel: '5\'11" x 19.0" x 2.42" (28.5L)',
    description: 'Shaped in San Clemente by Matt "Mayhem" Biolos for Griffin Colapinto and Caroline Marks. Built to tear Lower Trestles cobblestones to pieces and punt full-rotation airs.',
    accentColor: '#06b6d4',
    topGraphicColor: '#0f172a',
    baseGraphicColor: '#0891b2',
    badge: 'WSL FINALS WEAPON',
    perkDescription: '+30% WSL Judge Score & Air-Reverse Pop at Trestles & Pier.',
    statsBonus: {
      speedBoost: 1.15,
      carveGrip: 1.25,
      trickBonus: 1.35,
      powFloat: 1.1
    }
  },
  {
    id: 'forum-peter-line',
    brand: 'Lost Mayhem',
    craftType: 'surfboard',
    name: 'Lost RNF \'96 (Round Nose Fish)',
    series: 'San Clemente Heritage',
    year: '1996 / 2026',
    type: 'Twin Fin Fish',
    flex: 8,
    pop: 9,
    float: 9,
    camber: 'Swallow Tail Twin+1',
    lengthCm: 507,
    dimensionsLabel: '5\'7" x 20.0" x 2.44" (31.0L)',
    description: 'The most famous fish in surfing history, born in San Clemente in 1996. Flies down the line at Dana Point, T-Street, and Lowers with effortless speed.',
    accentColor: '#f97316',
    topGraphicColor: '#1e293b',
    baseGraphicColor: '#ea580c',
    badge: 'MAYHEM CLASSIC',
    perkDescription: 'Blistering down-the-line speed & effortless tube entry.',
    statsBonus: {
      speedBoost: 1.22,
      carveGrip: 1.18,
      trickBonus: 1.25,
      powFloat: 1.25
    }
  },
  {
    id: 'forum-youngblood',
    brand: 'Lost Mayhem',
    craftType: 'surfboard',
    name: 'Lost Puddle Jumper HP',
    series: 'Small-to-Head-High Rocket',
    year: '2026',
    type: 'Twin Fin Fish',
    flex: 7,
    pop: 9,
    float: 10,
    camber: 'Squash Tail Thruster',
    lengthCm: 506,
    dimensionsLabel: '5\'6" x 20.5" x 2.52" (33.0L)',
    description: 'Concave-bottom wave magnet that catches everything from Doheny rollers to San Clemente Pier bowls.',
    accentColor: '#a855f7',
    topGraphicColor: '#3b0764',
    baseGraphicColor: '#9333ea',
    badge: 'WAVE MAGNET',
    perkDescription: 'Catches every wave set + forgiving landings on air drops.',
    statsBonus: {
      speedBoost: 1.12,
      carveGrip: 1.15,
      trickBonus: 1.2,
      powFloat: 1.35
    }
  },

  // CHANNEL ISLANDS & CATCH SURF
  {
    id: 'burton-custom',
    brand: 'Channel Islands',
    craftType: 'surfboard',
    name: 'Channel Islands CI Pro 6\'0"',
    series: 'Al Merrick Trestles Blade',
    year: '2026',
    type: 'WSL High-Performance',
    flex: 9,
    pop: 9,
    float: 8,
    camber: 'Squash Tail Thruster',
    lengthCm: 600,
    dimensionsLabel: '6\'0" x 18.88" x 2.44" (29.9L)',
    description: 'Continuous rocker and single-to-double concave tuned for vertical pocket surfing on steep Trestles rights and Salt Creek lefts.',
    accentColor: '#38bdf8',
    topGraphicColor: '#0f172a',
    baseGraphicColor: '#0284c7',
    badge: 'CARVE MASTER',
    perkDescription: 'Maximum rail-to-rail carving power & critical lip snaps.',
    statsBonus: {
      speedBoost: 1.18,
      carveGrip: 1.3,
      trickBonus: 1.2,
      powFloat: 1.1
    }
  },
  {
    id: 'burton-deep-thinker',
    brand: 'Catch Surf',
    craftType: 'surfboard',
    name: 'Catch Surf Odysea 7\'0" Log (Taco Stand Ed.)',
    series: 'Laguna Beach Hometown Hero',
    year: '2026',
    type: 'Soft-Top Shredder',
    flex: 5,
    pop: 8,
    float: 10,
    camber: 'Triple Stringer Foamie',
    lengthCm: 700,
    dimensionsLabel: '7\'0" x 22.0" x 3.12" (72.0L)',
    description: 'Designed right here in Laguna Beach! Hot-pink and turquoise Odysea foamie with Taco Stand salsa splatters. Pulls into suicidal shorebreak barrels without snapping.',
    accentColor: '#ec4899',
    topGraphicColor: '#831843',
    baseGraphicColor: '#db2777',
    badge: 'LAGUNA FOAMIE KING',
    perkDescription: 'Shorebreak armor + +40% Wave Float & Party Wave Bonus.',
    statsBonus: {
      speedBoost: 1.14,
      carveGrip: 1.1,
      trickBonus: 1.25,
      powFloat: 1.5
    }
  },
  {
    id: 'burton-fish',
    brand: 'Channel Islands',
    craftType: 'surfboard',
    name: 'Channel Islands Neck Beard 2',
    series: 'Dane Reynolds Free-Surf',
    year: '2026',
    type: 'Twin Fin Fish',
    flex: 7,
    pop: 10,
    float: 9,
    camber: 'Squash Tail Thruster',
    lengthCm: 508,
    dimensionsLabel: '5\'8" x 19.6" x 2.45" (29.7L)',
    description: 'Wide chopped square tail that generates explosive speed off the bottom and launches sky-high slob airs over the San Clemente Pier.',
    accentColor: '#10b981',
    topGraphicColor: '#064e3b',
    baseGraphicColor: '#059669',
    badge: 'AIR LAUNCHER',
    perkDescription: '+30% Boost height on steep wave ramps & lip sections.',
    statsBonus: {
      speedBoost: 1.16,
      carveGrip: 1.15,
      trickBonus: 1.35,
      powFloat: 1.25
    }
  },

  // BOOGIE BOARDS / BODYBOARDS (1000 STEPS, TREASURE ISLAND & PIER SLABS!)
  {
    id: 'thirtytwo-scott-stevens',
    brand: 'Boogie Board',
    craftType: 'boogie',
    name: 'Morey Mach 7-7 Original Boogie Board',
    series: 'Tom Morey OC Heritage',
    year: '1977 / 2026',
    type: 'Pro Boogie / Bodyboard',
    flex: 8,
    pop: 10,
    float: 10,
    camber: 'Crescent Tail Surlyn Slick',
    lengthCm: 42,
    dimensionsLabel: '42.0" • Prone & Drop-Knee Legend',
    description: 'The iconic yellow-and-black Morey Boogie Board! Built for tucking deep inside 1000 Steps caves, Treasure Island reefs, and launching huge El Rollos with churchill swimfins.',
    accentColor: '#eab308',
    topGraphicColor: '#451a03',
    baseGraphicColor: '#ca8a04',
    badge: 'BOOGIE ICON 🌊',
    perkDescription: 'Unlock Boogie Boarding Mode: El Rollos, Drop-Knee & Deep Shorebreak Tubes!',
    statsBonus: {
      speedBoost: 1.2,
      carveGrip: 1.22,
      trickBonus: 1.4,
      powFloat: 1.4
    }
  },
  {
    id: 'thirtytwo-chris-grenier',
    brand: 'Boogie Board',
    craftType: 'boogie',
    name: 'Mike Stewart Science Pipe Stringer Pro',
    series: '9x World Champ Bodyboard',
    year: '2026',
    type: 'Pro Boogie / Bodyboard',
    flex: 9,
    pop: 10,
    float: 9,
    camber: 'Bat Tail PP Core',
    lengthCm: 41,
    dimensionsLabel: '41.5" • High-Velocity Carbon Stringer',
    description: 'Engineered by 9x World Champion Mike Stewart. Polypropylene kinetic core with graduated channels that slingshots out of hollow barrels and boosts Air Roll Spins (ARS).',
    accentColor: '#f43f5e',
    topGraphicColor: '#18181b',
    baseGraphicColor: '#e11d48',
    badge: '9X CHAMP BOOGIE',
    perkDescription: 'Boogie Mode: +45% Barrel Spit Speed & Air Roll Spin Multiplier!',
    statsBonus: {
      speedBoost: 1.25,
      carveGrip: 1.25,
      trickBonus: 1.45,
      powFloat: 1.3
    }
  },
  {
    id: 'catch-surf-womper-boogie',
    brand: 'Boogie Board',
    craftType: 'boogie',
    name: 'Catch Surf Womper & Boogie Pro 41"',
    series: '1000 Steps Shorebreak Weapon',
    year: '2026',
    type: 'Pro Boogie / Bodyboard',
    flex: 7,
    pop: 9,
    float: 10,
    camber: 'Crescent Tail Surlyn Slick',
    lengthCm: 41,
    dimensionsLabel: '41.0" • Laguna Shorebreak Edition',
    description: 'Born in the heavy sand-bottom tubes of 1000 Steps and Treasure Island in Laguna Beach. High-density slick bottom that skips across shallow reefs and launches backflips.',
    accentColor: '#00f5d4',
    topGraphicColor: '#042f2e',
    baseGraphicColor: '#0d9488',
    badge: '1000 STEPS SLAB',
    perkDescription: 'Boogie Mode: Immunity to shallow reef wipeouts & +35% Tube Score!',
    statsBonus: {
      speedBoost: 1.18,
      carveGrip: 1.2,
      trickBonus: 1.38,
      powFloat: 1.45
    }
  },

  // SURF & PADDLE LAGUNA HERITAGE
  {
    id: 'milosport-1984',
    brand: 'Surf & Paddle',
    craftType: 'surfboard',
    name: 'Surf & Paddle Laguna Custom Twin-Pin',
    series: '699 S Coast Hwy Shop Special',
    year: '2026',
    type: 'Laguna Custom Glass',
    flex: 8,
    pop: 9,
    float: 9,
    camber: 'Swallow Tail Twin+1',
    lengthCm: 510,
    dimensionsLabel: '5\'10" x 19.75" x 2.5" (31.5L)',
    description: 'Hand-glassed in seafoam resin tint with the iconic Surf & Paddle Laguna Beach crest. Smells like coconut Sticky Bumps and Taco Stand lime.',
    accentColor: '#22c55e',
    topGraphicColor: '#14532d',
    baseGraphicColor: '#16a34a',
    badge: 'LAGUNA LOCAL RESPECT',
    perkDescription: 'Laguna Local Karma: +500 Ocean Prayers & Lineup Priority.',
    statsBonus: {
      speedBoost: 1.2,
      carveGrip: 1.22,
      trickBonus: 1.25,
      powFloat: 1.3
    }
  }
];

export const RIDERS_LIST: RiderPro[] = [
  // SAN CLEMENTE 2% CREW & LOST LEGENDS
  {
    id: 'jp-walker',
    name: 'Griffin Colapinto',
    nickname: 'Griffo',
    category: 'forum',
    categoryLabel: 'San Clemente 2% Crew',
    sponsor: 'Lost Surfboards / Quiksilver / Red Bull',
    sponsorLogoUrl: '/assets/logos/forum.png',
    stance: 'Regular',
    hometown: 'San Clemente, CA',
    favoriteTrick: 'Full-Rotation Alley-Oop & Deep Lowers Barrel',
    bio: 'San Clemente’s homegrown WSL World Title contender! Grew up surfing T-Street, San Clemente Pier, and Lower Trestles every single day with the 2% Crew.',
    defaultBoardId: 'forum-destroyer',
    avatarColor: '#06b6d4',
    accentColor: '#0284c7',
    iconEmoji: '🏄‍♂️',
    dialogue: {
      atShop: "Surf & Paddle in Laguna is firing! Let's grab two Al Pastor tacos next door at The Taco Stand and cruise PCH down to San Clemente & Lowers!",
      leavingShop: "Rolling south on PCH! Look at the turquoise water at Main Beach—south swell is already pulsing!",
      approachingSilentRock: "Passing Treasure Island by the Montage... 1000 Steps Beach cliff overlook coming up at Mile 4.5!",
      atSilentRock: "Turn down the stereo at 1000 Steps! Look at those SSW corduroy lines wrapping into the cove... Pray for the ocean!",
      speeding: "Careful around the Dana Point headlands curve! Keep the boards strapped tight on the roof rack!",
      approachingBrighton: "Look at the San Clemente Pier and the Trestles trail! Thousands of fans are already on the beach for the WSL Finals!",
      atBrighton: "We made it! Grab your board—dolphins are jumping in the lineup and the sets are 6 to 8 feet and glass!",
      cheers: ['9.87 WSL EXCELLENT!', '2% Crew style!', 'Full-rotation stomp!']
    }
  },
  {
    id: 'peter-line',
    name: 'Caroline Marks',
    nickname: 'C-Marks',
    category: 'forum',
    categoryLabel: 'San Clemente 2% Crew',
    sponsor: 'Lost Mayhem / Red Bull',
    sponsorLogoUrl: '/assets/logos/forum.png',
    stance: 'Goofy',
    hometown: 'San Clemente, CA',
    favoriteTrick: 'Vertical Backside Blow-Tail at Lower Trestles',
    bio: 'WSL World Champion (crowned right on the cobblestones at Lower Trestles!) and Olympic Gold Medalist calling San Clemente home.',
    defaultBoardId: 'forum-destroyer',
    avatarColor: '#f97316',
    accentColor: '#ea580c',
    iconEmoji: '🥇',
    dialogue: {
      atShop: "Nothing beats starting a surf trip at Surf & Paddle and grabbing The Taco Stand in Laguna! My Lost Driver 3.0 is waxed and ready.",
      leavingShop: "Cruising past Brooks Street and Bluebird Canyon! The offshore Santa Ana breeze is grooming every wave face!",
      approachingSilentRock: "Look at Montage Treasure Island sparkling below us... 1000 Steps overlook is right ahead!",
      atSilentRock: "Quiet on the bluff at 1000 Steps. Watch the pelicans glide over the kelp beds and send gratitude to the Pacific.",
      speeding: "Cruising fast through Dana Point! Watch out for groms on Super73 e-bikes in the bike lane!",
      approachingBrighton: "Hear that roar from the beach?! The WSL Finals crowd at Lower Trestles is going mental!",
      atBrighton: "Zip up the wetsuit or trunk it! Let's go drop a 10-point ride in front of the beach fans!",
      cheers: ['WORLD CHAMP CARVE!', 'Backside thunder!', '10.00 Perfection!']
    }
  },
  {
    id: 'jeremy-jones',
    name: 'Kolohe Andino',
    nickname: 'Brother',
    category: 'forum',
    categoryLabel: 'San Clemente 2% Crew',
    sponsor: 'Lost Surfboards / 2% Surf',
    sponsorLogoUrl: '/assets/logos/forum.png',
    stance: 'Regular',
    hometown: 'San Clemente, CA',
    favoriteTrick: 'Kerrupt Flip over the T-Street Closeout',
    bio: 'The godfather of the modern San Clemente 2% surf movement, Olympian, and lifelong T-Street, Pier Bowl, and Trestles charger.',
    defaultBoardId: 'forum-peter-line',
    avatarColor: '#eab308',
    accentColor: '#ca8a04',
    iconEmoji: '⚡',
    dialogue: {
      atShop: "Strap the Mayhem quiver onto the roof! The Taco Stand carne asada fries are fueling today's session!",
      leavingShop: "Southbound on Coast Highway! Look at the sunbathers and umbrellas packing Laguna Main Beach!",
      approachingSilentRock: "Coming up on 1000 Steps Beach right past Treasure Island. Time to check the swell period.",
      atSilentRock: "17-second SSW groundswell. Tap the roof rack and give thanks to the ocean.",
      speeding: "Easy around Salt Creek and Dana Point Harbor! CHP loves clocking surfers heading to Trestles.",
      approachingBrighton: "San Clemente Pier looks firing, and Lowers is an absolute skatepark today!",
      atBrighton: "First one down the Trestles trail gets priority on the first bomb set! Watch for the locals!",
      cheers: ['2% Underground!', 'Huge slob air!', 'Pier Bowl hammer!']
    }
  },
  {
    id: 'eddie-wall',
    name: 'Matt "Mayhem" Biolos',
    nickname: 'Mayhem',
    category: 'forum',
    categoryLabel: 'San Clemente 2% Crew',
    sponsor: 'Lost Enterprises • San Clemente',
    sponsorLogoUrl: '/assets/logos/forum.png',
    stance: 'Regular',
    hometown: 'San Clemente, CA',
    favoriteTrick: 'Layback Slash on a 5\'7" Round Nose Fish',
    bio: 'Legendary founder and shaper of Lost Surfboards in San Clemente. Won multiple WSL Shaper of the Year titles dominating Lower Trestles.',
    defaultBoardId: 'forum-peter-line',
    avatarColor: '#a855f7',
    accentColor: '#9333ea',
    iconEmoji: '🦈',
    dialogue: {
      atShop: "Checking out the racks at Surf & Paddle in Laguna! Grab me a Baja fish taco from The Taco Stand and let's test this fresh RNF '96.",
      leavingShop: "Driving south through Laguna! The water clarity at Treasure Island by the Montage is 40 feet today.",
      approachingSilentRock: "1000 Steps bluff ahead... look at how that south swell wraps around the point.",
      atSilentRock: "Respect the ocean. Listen to the shorebreak thumping down at the bottom of the 1000 Steps.",
      speeding: "Hold the wheel steady through Dana Point! Don't let the resin tint bake in the traffic!",
      approachingBrighton: "Every surfer on the WSL Finals podium at Trestles is riding a San Clemente shape today!",
      atBrighton: "Let's paddle out! Watch the sea turtles by the kelp bed and put that board on rail!",
      cheers: ['Mayhem approved!', 'Pure twin-fin speed!', 'Shaper’s perfection!']
    }
  },

  // WSL WORLD CHAMPIONS
  {
    id: 'terje-hakonsen',
    name: 'Kelly Slater',
    nickname: 'The GOAT (11x Champ)',
    category: 'burton',
    categoryLabel: 'WSL World Champ',
    sponsor: 'Slater Designs / Outerknown',
    sponsorLogoUrl: '/assets/logos/burton.svg',
    stance: 'Regular',
    hometown: 'Cocoa Beach / San Clemente',
    favoriteTrick: 'No-Hand Foam-Ball Tube to Rodeo Flip at Lowers',
    bio: '11-time World Surfing Champion who has won more events on the cobblestones of Lower Trestles than any human in history.',
    defaultBoardId: 'burton-custom',
    avatarColor: '#06b6d4',
    accentColor: '#0891b2',
    iconEmoji: '👑',
    dialogue: {
      atShop: "Surf & Paddle has great energy. Grab some fresh guacamole at The Taco Stand and let's take the scenic PCH drive to Trestles.",
      leavingShop: "Look at the pelicans skimming the wave crests along Laguna... the ocean is alive today.",
      approachingSilentRock: "Treasure Island and 1000 Steps ahead. Look at the geometry of the reef below the Montage.",
      atSilentRock: "Pause and breathe at 1000 Steps. Feel the rhythm of the Pacific sets before we even paddle out.",
      speeding: "Flow with the coast highway curves. Dana Point used to have a 15-foot point wave before the harbor!",
      approachingBrighton: "Lower Trestles with a 6-foot south swell and a beach full of fans... there is no better arena on Earth.",
      atBrighton: "Look at the dolphins in the lineup and the kids playing on the shore. Let's go thread some barrels!",
      cheers: ['11x GOAT Style!', 'Deep in the green room!', 'Timeless soul arch!']
    }
  },
  {
    id: 'shaun-white',
    name: 'Filipe Toledo',
    nickname: 'Filipinho (2x WSL Champ)',
    category: 'burton',
    categoryLabel: 'WSL World Champ',
    sponsor: 'Hurley / Sharp Eye',
    sponsorLogoUrl: '/assets/logos/burton.svg',
    stance: 'Regular',
    hometown: 'Ubatuba, Brazil / San Clemente, CA',
    favoriteTrick: 'Mach-10 Alley-Oop & Full Rotation Air Reverse',
    bio: 'Moved his family to San Clemente and won back-to-back WSL World Titles right on the cobblestones at Lower Trestles in front of roaring OC crowds.',
    defaultBoardId: 'burton-custom',
    avatarColor: '#ef4444',
    accentColor: '#dc2626',
    iconEmoji: '🚀',
    dialogue: {
      atShop: "Bro! The Taco Stand Al Pastor in Laguna is insane! Let's wax up with Fu Wax at Surf & Paddle and fly down to Trestles!",
      leavingShop: "Sun is shining, beaches are packed with umbrellas, and the ramps at San Clemente Pier and Lowers are calling!",
      approachingSilentRock: "1000 Steps Beach coming up! Look at how hollow that inside shorebreak is!",
      atSilentRock: "Respect the ocean at 1000 Steps. Say a prayer for clean offshore winds and 10-point ramps!",
      speeding: "Vamos! Step on it past Dana Point—my WSL Finals heat horn blows in 15 minutes!",
      approachingBrighton: "Look at the Brazilian and California flags waving on the beach at Lowers! The fans are going crazy!",
      atBrighton: "Paddle out fast! Soon as you see a steep section, launch an air-reverse into the flats!",
      cheers: ['VAMOS FILIPINHO!', '10-Point Air Reverse!', 'WSL Finals Champion!']
    }
  },
  {
    id: 'danny-davis',
    name: 'Stephanie Gilmore',
    nickname: '8x World Champ',
    category: 'burton',
    categoryLabel: 'WSL World Champ',
    sponsor: 'Rip Curl / DHD',
    sponsorLogoUrl: '/assets/logos/burton.svg',
    stance: 'Regular',
    hometown: 'Coolangatta / Laguna & Malibu',
    favoriteTrick: 'Effortless High-Line Soul Carve & Layback Wrap',
    bio: '8-time World Surfing Champion who clinched her historic 8th world title at Lower Trestles by winning five consecutive heats from the #5 seed.',
    defaultBoardId: 'milosport-1984',
    avatarColor: '#10b981',
    accentColor: '#059669',
    iconEmoji: '🌺',
    dialogue: {
      atShop: "Good morning from Surf & Paddle Laguna! A twin-fin, acoustic tunes on the stereo, and Taco Stand tacos—pure California dream.",
      leavingShop: "Look at the crystal water at Treasure Island by the Montage... you can see sea turtles from the highway!",
      approachingSilentRock: "1000 Steps overlook ahead. Let's turn down the music and soak in the ocean vista.",
      atSilentRock: "Peaceful ocean prayer. May the waves peel forever from Dana Point to Trestles.",
      speeding: "No rush, mate—the tide is just starting to push on the San Clemente reefs.",
      approachingBrighton: "Winning five heats in a row at Lower Trestles was the best day of my life. Look at that crowd on the sand!",
      atBrighton: "Dance with the wave! Smile at the dolphins and draw smooth lines all the way to the beach!",
      cheers: ['Pure 8x Grace!', 'Silk rail turn!', 'Champagne spray!']
    }
  },

  // LAGUNA & BOOGIE BOARD LEGENDS
  {
    id: 'scott-stevens',
    name: 'Kalani Robb',
    nickname: 'Laguna Legend',
    category: 'thirtytwo',
    categoryLabel: 'Laguna & Boogie Legend',
    sponsor: 'Catch Surf Odysea • Laguna Beach',
    sponsorLogoUrl: '/assets/logos/thirtytwo.svg',
    stance: 'Regular',
    hometown: 'Laguna Beach, CA',
    favoriteTrick: 'Finless 360 Spin into a 1000 Steps Shorebreak Barrel',
    bio: 'Laguna Beach resident, former WSL CT standout, and face of Catch Surf! Nobody has more fun on a surfboard, soft-top, or boogie board between Taco Stand and Trestles.',
    defaultBoardId: 'burton-deep-thinker',
    avatarColor: '#ec4899',
    accentColor: '#db2777',
    iconEmoji: '🤙',
    dialogue: {
      atShop: "WELCOME TO LAGUNA BEACH BABY! Surf & Paddle and The Taco Stand is my daily office! Grab a hot-pink Catch Surf or a Boogie Board!",
      leavingShop: "We're passing Thalia Street and Brooks Street right now! Wave to the lifeguards in the white towers!",
      approachingSilentRock: "Check out Treasure Island by the Montage! And right past it is 1000 Steps—the heaviest shorebreak in town!",
      atSilentRock: "Silent shaka at 1000 Steps! Pray for warm water, zero blackball flags, and double-overhead wedges!",
      speeding: "Yeeeew! Look at the dolphins racing our car along Dana Point Strands!",
      approachingBrighton: "Whether we stop at Dana Point, San Clemente Pier, or crash the WSL Finals at Trestles, we're getting barreled!",
      atBrighton: "Let's gooo! Watch the kids playing in the shorebreak, high-five the fans on the beach, and pull into every closeout!",
      cheers: ['CATCH SURF PARTY!', 'Laguna style!', 'Deep in the shorebreak!']
    }
  },
  {
    id: 'chris-grenier',
    name: 'Mike Stewart',
    nickname: 'The Boogie GOAT (9x Champ)',
    category: 'thirtytwo',
    categoryLabel: 'Laguna & Boogie Legend',
    sponsor: 'Science Bodyboards / Viper Fins',
    sponsorLogoUrl: '/assets/logos/thirtytwo.svg',
    stance: 'Regular',
    hometown: 'Hawaii / Laguna & San Clemente',
    favoriteTrick: 'Deep Tube Spit into an Air Roll Spin (ARS)',
    bio: '9-time World Bodyboarding Champion and pioneer of heavy slab riding. Can ride a Boogie Board through barrels no stand-up surfer could ever make.',
    defaultBoardId: 'thirtytwo-chris-grenier',
    avatarColor: '#f43f5e',
    accentColor: '#e11d48',
    iconEmoji: '🌊',
    dialogue: {
      atShop: "Picking up a fresh Science Pipe Boogie Board and swimfins at Surf & Paddle! Fuel up at The Taco Stand and let's go hunt wedges!",
      leavingShop: "Look at how the swell refracts off the Laguna reefs... 1000 Steps and San Clemente Pier Bowl are going to be wedging hard!",
      approachingSilentRock: "Treasure Island cove is crystal clear, and 1000 Steps is right around the bend!",
      atSilentRock: "Observe the wave harmonics at 1000 Steps. Every set has a sacred rhythm.",
      speeding: "Keep your eyes on the coast road! Those shorebreak slabs at Salt Creek and Pier Bowl are waiting!",
      approachingBrighton: "Look at the lip throwing at the Pier and Lowers! Strap on your swimfins, it's Boogie time!",
      atBrighton: "Hit the oncoming lip at full speed on your boogie board for a massive El Rollo or barrel roll!",
      cheers: ['EL ROLLO STOMPED!', '9x Boogie GOAT!', 'Spit out of the slab!']
    }
  },
  {
    id: 'zeb-powell',
    name: 'Blair Conklin',
    nickname: '1000 Steps Tube King',
    category: 'thirtytwo',
    categoryLabel: 'Laguna & Boogie Legend',
    sponsor: 'Victoria / Catch Surf Womper',
    sponsorLogoUrl: '/assets/logos/thirtytwo.svg',
    stance: 'Regular',
    hometown: 'Laguna Beach, CA',
    favoriteTrick: 'Shorebreak Barrel Transfer from Sand to Deep Reef',
    bio: 'Born and raised in Laguna Beach! World Champion shorebreak wizard who grew up living at 1000 Steps Beach, Treasure Island Montage, and Aliso Creek.',
    defaultBoardId: 'catch-surf-womper-boogie',
    avatarColor: '#f59e0b',
    accentColor: '#d97706',
    iconEmoji: '🐚',
    dialogue: {
      atShop: "YOOO! You're in my hometown! Surf & Paddle + The Taco Stand is the ultimate Laguna Beach combo!",
      leavingShop: "Wait till you see Treasure Island by the Montage and 1000 Steps—the water looks like the Bahamas today!",
      approachingSilentRock: "1000 Steps Beach! I've walked up and down those 219 cliff stairs ten thousand times!",
      atSilentRock: "Respect the 1000 Steps cliff! Look down at the sea cave, the turtles in the kelp, and the shorebreak barrels!",
      speeding: "WOOOO! Cruising past Monarch Bay and Dana Point! Look at the pelicans diving!",
      approachingBrighton: "Dana Point, San Clemente Pier, and Trestles are all firing! Look at the beach fans and lifeguards!",
      atBrighton: "Run across the wet sand, dodge the kids building sandcastles, and launch straight into a shorebreak barrel!",
      cheers: ['1000 STEPS TUBE!', 'Laguna shorebreak king!', 'Crystal cove barrel!']
    }
  },

  // OC LOCAL GROMS & SHOP CREW
  {
    id: 'milo-shop-groms',
    name: 'Taj & Brody',
    nickname: 'Super73 E-Bike Grom Squad',
    category: 'local_kids',
    categoryLabel: 'OC Local Grom',
    sponsor: 'Surf & Paddle Laguna Shop Team',
    sponsorLogoUrl: '/assets/milosport/storefront.jpg',
    stance: 'Regular',
    hometown: 'Laguna Beach / San Clemente, CA',
    favoriteTrick: 'Tandem Party Wave Shaka & Pier Piling Shoot',
    bio: '15-year-old sun-bleached OC groms with hot-pink zinc on their noses, riding two-up on a Super73 e-bike with surfboards in the side rack and Taco Stand California burritos in their hoodies.',
    defaultBoardId: 'surf-paddle-laguna',
    avatarColor: '#22c55e',
    accentColor: '#16a34a',
    iconEmoji: '🌮',
    dialogue: {
      atShop: "Dude! We met at Surf & Paddle at 6:00 AM, got two California Burritos and churros from The Taco Stand, and our e-bike battery is at 100%!",
      leavingShop: "Look at all the people sunbathing and lifeguards putting up the flags in Laguna! Summer south swell is PUMPING!",
      approachingSilentRock: "Yo, we're passing Treasure Island by the Montage! Get ready to bow at 1000 Steps Beach!",
      atSilentRock: "Shhh! Tap the roof rack at 1000 Steps so we don't get blackballed by the lifeguards today!",
      speeding: "Bro slow down! My Taco Stand habanero salsa cup almost spilled on the dashboard!",
      approachingBrighton: "LOOK AT THE DOLPHINS AND TURTLES! And the WSL Finals bleachers at Trestles are packed!",
      atBrighton: "Last one in the water is a kook! Watch out for the grumpy locals in the lineup and collect seashells on the inside!",
      cheers: ['TACO STAND POWER!', 'Grom squad yewww!', 'No kooks allowed!']
    }
  },
  {
    id: 'milo-wax-tech',
    name: 'Mateo (Surf & Paddle Tech)',
    nickname: 'The Sticky Bumps Guru',
    category: 'local_kids',
    categoryLabel: 'OC Local Grom',
    sponsor: 'Surf & Paddle Shaping Bay',
    sponsorLogoUrl: '/assets/milosport/storefront.jpg',
    stance: 'Goofy',
    hometown: 'Laguna Beach, CA',
    favoriteTrick: 'Soul Arch Tube Ride with Perfect Bead Wax Grip',
    bio: 'Works the back room at Surf & Paddle right next to The Taco Stand. Can tell you the exact water temp at San Clemente Pier and whether you need Fu Wax or Warm Sticky Bumps.',
    defaultBoardId: 'milosport-1984',
    avatarColor: '#0ea5e9',
    accentColor: '#0284c7',
    iconEmoji: '🥥',
    dialogue: {
      atShop: "Just put a fresh cold basecoat and tropical coconut Sticky Bumps crosshatch on your deck! Your feet are glued on today.",
      leavingShop: "Water temp is 69°F in Laguna and 70°F down at San Clemente Pier and Trestles. Trunkable!",
      approachingSilentRock: "Mile 4.4... coming up on 1000 Steps Beach right past the Montage.",
      atSilentRock: "Radio muted at 1000 Steps. Honor the Pacific swell and the sea life.",
      speeding: "Keep it smooth on PCH! You don't want the sun melting the fresh wax beads on the roof rack!",
      approachingBrighton: "Swell buoy at San Clemente says 7 feet at 17 seconds from 205 degrees! Absolute perfection!",
      atBrighton: "Feel those wax bumps? Zero slip on the air-reverses today. Go tear the bag out of it!",
      cheers: ['Sticky Bumps grip!', 'Fins humming!', 'Glassed in Laguna!']
    }
  },
  {
    id: 'bone-zone-local',
    name: 'T-Street Local ("Sunny")',
    nickname: 'The Pier Enforcer',
    category: 'local_kids',
    categoryLabel: 'OC Local Grom',
    sponsor: 'T-Street & Pier Bowl Underground',
    sponsorLogoUrl: '/assets/milosport/storefront.jpg',
    stance: 'Regular',
    hometown: 'San Clemente, CA',
    favoriteTrick: 'Shooting the San Clemente Pier Pilings Backdoor',
    bio: 'Surfs T-Street and the San Clemente Pier before sunrise every day, knows every sea turtle and dolphin by name, and makes sure nobody drops in on the locals.',
    defaultBoardId: 'forum-destroyer',
    avatarColor: '#8b5cf6',
    accentColor: '#7c3aed',
    iconEmoji: '🐬',
    dialogue: {
      atShop: "Came up to Laguna to grab a fresh leash at Surf & Paddle and three Al Pastor tacos at The Taco Stand!",
      leavingShop: "Let's cruise back down PCH! Treasure Island and 1000 Steps look fun, but San Clemente and Trestles are calling.",
      approachingSilentRock: "1000 Steps overlook. Always show respect to the South Laguna cliffs.",
      atSilentRock: "Silent salute to the ocean gods.",
      speeding: "Cruising past Dana Point Harbor! Look at the sailboats and sea lions on the jetty!",
      approachingBrighton: "The Amtrak train is whistling by the San Clemente Pier and the WSL crowd at Trestles is huge!",
      atBrighton: "Stick with me in the lineup and the locals will give you priority on the best set waves!",
      cheers: ['Pier Bowl local!', 'Shot the pilings!', 'Respect the priority!']
    }
  }
];

export interface LiftPass {
  id: string;
  name: string;
  resort: 'Dana Point' | 'San Clemente Pier' | 'Lower Trestles WSL';
  priceMilo: number;
  priceWindow: number;
  prayersPrice: number;
  description: string;
  badgeColor: string;
  accentColor: string;
  perks: string[];
}

export const LIFT_PASSES_LIST: LiftPass[] = [
  {
    id: 'brighton-day',
    name: 'California State Parks "Golden Poppy" Beach Pass',
    resort: 'Lower Trestles WSL',
    priceMilo: 45,
    priceWindow: 195,
    prayersPrice: 300,
    description: 'Hang this mirror tag from your rearview! Unlimited all-day parking at San Onofre / Lower Trestles Trailhead, Doheny State Beach, and Crystal Cove.',
    badgeColor: '#0369a1',
    accentColor: '#38bdf8',
    perks: ['San Onofre / Trestles Lot VIP Entry', '+500 Surf & Boogie Starting Bonus', 'Surf & Paddle Local Discount (-77% off)']
  },
  {
    id: 'brighton-night',
    name: 'San Clemente Pier Bowl & T-Street Meter Pass',
    resort: 'San Clemente Pier',
    priceMilo: 25,
    priceWindow: 65,
    prayersPrice: 180,
    description: 'Front-row beachfront parking right at the base of the San Clemente Pier and T-Street pedestrian overpass. Zero parking tickets while you barrel ride!',
    badgeColor: '#7e22ce',
    accentColor: '#c084fc',
    perks: ['Pier Bowl Front-Row Stall', 'Immune to Blackball Flag Warnings', 'Free Fish Taco Coupon for Fisherman’s']
  },
  {
    id: 'solitude-honeycomb',
    name: 'Dana Point Doheny & Salt Creek Headlands Pass',
    resort: 'Dana Point',
    priceMilo: 35,
    priceWindow: 85,
    prayersPrice: 250,
    description: 'Direct beachfront access to Doheny State Beach ("Killer Dana") and Salt Creek Bluff Park. Swim with sea turtles and catch longboard peelers.',
    badgeColor: '#b45309',
    accentColor: '#fbbf24',
    perks: ['Doheny Day-Use Gate Access', 'Sea Turtle & Dolphin Reef Priority', 'Salt Creek Golf Cart Shuttle Pass']
  },
  {
    id: 'wasatch-dual-gold',
    name: 'WSL Finals Lower Trestles VIP Athlete & Beach Pass',
    resort: 'Lower Trestles WSL',
    priceMilo: 99,
    priceWindow: 350,
    prayersPrice: 650,
    description: 'The ultimate Orange County surf credential! Walk straight into the WSL Championship Tour Competitors Area at Lower Trestles, surf the Finals heat, and get scored by WSL judges!',
    badgeColor: '#047857',
    accentColor: '#34d399',
    perks: ['Official WSL Finals Priority Singlet', 'All 3 Breaks Unlocked (Dana Point, Pier & Trestles)', 'Free Sticky Bumps Case from Surf & Paddle']
  }
];

export interface VehicleTireOption {
  id: string;
  name: string;
  category: 'bald_slicks' | 'all_season' | 'snow_tires' | 'chains';
  tractionRating: number; // 1 to 10
  udotApproved: boolean;
  description: string;
  officerReaction: string;
}

export const TIRE_OPTIONS_LIST: VehicleTireOption[] = [
  {
    id: 'bald_slicks',
    name: 'One Frayed Bungee Cord & Beach Towel on Roof',
    category: 'bald_slicks',
    tractionRating: 2,
    udotApproved: false,
    description: 'Four surfboards stacked directly on the bare roof held down by a single sun-rotted bungee cord and Taj’s arm out the window holding the nose.',
    officerReaction: 'Bro, your Lost surfboard is literally flapping 2 feet in the air at 45 MPH on PCH! One gust off Treasure Island and that board is flying into the Taco Stand patio!'
  },
  {
    id: 'all_season',
    name: 'FCS Premium Cam-Lock Soft Racks',
    category: 'all_season',
    tractionRating: 7,
    udotApproved: true,
    description: 'Heavy-duty padded neoprene roof straps wrapped through the cabin doors with 1,000-lb cam buckles. The staple of every Laguna and San Clemente surf car.',
    officerReaction: 'FCS Soft Racks strapped tight, fins forward, no twist in the webbing. Keep your speed down past 1000 Steps and have a great session!'
  },
  {
    id: 'snow_tires',
    name: 'Thule Locking Surf Pads + Super73 E-Bike Hitch Rack',
    category: 'snow_tires',
    tractionRating: 9,
    udotApproved: true,
    description: 'Aerodynamic roof crossbars with locking board clamps up top AND two Super73 electric surf bikes on the rear hitch for flying down the Trestles trail.',
    officerReaction: 'Now that is a proper South Orange County setup! Roof locks engaged and e-bikes ready for the San Onofre trail. Roll on through to Trestles!'
  },
  {
    id: 'chains',
    name: '1996 Woody Wagon Teak Timber Racks + BFG Sand Tires',
    category: 'chains',
    tractionRating: 10,
    udotApproved: true,
    description: 'Hand-varnished mahogany and teak wood roof racks with leather cinch straps and BFGoodrich All-Terrain KO2 tires ready for San Onofre bluffs.',
    officerReaction: 'Classic California Woody setup! That belongs in the Surfing Heritage Museum in San Clemente.Shaka brah, go get barreled! 🤙'
  }
];

export interface WaxFormula {
  id: string;
  name: string;
  tempRange: string;
  color: string;
  hex: string;
  speedBonus: number;
  description: string;
}

export const WAX_FORMULAS_LIST: WaxFormula[] = [
  {
    id: 'milo_cold_pow',
    name: 'Fu Wax Brazil WSL Pro Grip (Trestles Secret)',
    tempRange: '64°F to 72°F Water',
    color: 'WSL Gold',
    hex: '#f59e0b',
    speedBonus: 1.25,
    description: 'The ultra-tacky Brazilian secret weapon used by Griffin Colapinto, Filipe Toledo, and Kelly Slater at the WSL Finals. Locks your feet in on huge air-reverses!'
  },
  {
    id: 'all_temp_purple',
    name: 'Sticky Bumps Original Warm/Cool Coconut',
    tempRange: '60°F to 70°F Water',
    color: 'Ocean Turquoise',
    hex: '#06b6d4',
    speedBonus: 1.18,
    description: 'Hand-poured in Southern California! Builds tall, grippy bumps on surfboards and boogie boards with an unmistakable blueberry-coconut beach aroma.'
  },
  {
    id: 'spring_butter',
    name: 'Mr. Zog’s Sex Wax Purple "Quick Humps"',
    tempRange: '58°F to 68°F Water',
    color: 'Sunset Magenta',
    hex: '#ec4899',
    speedBonus: 1.15,
    description: 'The Best for Your Stick since 1972! Classic coconut scent that every Laguna Beach, Dana Point, and San Clemente surfer grew up rubbing on their deck.'
  }
];
