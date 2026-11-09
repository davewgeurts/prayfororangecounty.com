// Shop-floor staging for the Milosport select screens: where every rider hangs out
// inside the shop, how they look, what they shout when you hover them, and the
// non-playable locals loitering around the racks. Layout coordinates are % of the
// lounge scene (x from the left wall, y from the floor line).
export const FORTNITE_DANCES = [
    { id: 'floss', label: 'The Floss' },
    { id: 'default', label: 'Default Dance' },
    { id: 'take-the-l', label: 'Take The L' },
    { id: 'orange-justice', label: 'Orange Justice' },
    { id: 'electro-shuffle', label: 'Electro Shuffle' },
    { id: 'hype', label: 'Hype' },
    { id: 'griddy', label: 'The Griddy' },
    { id: 'ride-the-pony', label: 'Ride The Pony' },
    { id: 'best-mates', label: 'Best Mates' }
];
const SKIN = {
    fair: '#f3cfb1',
    light: '#e8b48a',
    tan: '#c98d60',
    brown: '#8d5a3b',
    deep: '#5e3a24'
};
export const RIDER_SHOP_PROFILES = [
    // Forum crew posted up around the VHS TV playing The Resistance
    {
        riderId: 'peter-line',
        spotLabel: 'Watching The Resistance on VHS',
        x: 34, y: 6, scale: 1,
        looks: [{ skin: SKIN.fair, hoodie: '#f97316', pants: '#334155', hat: '#0f172a', hairColor: '#6b4423', hair: 'beanie' }],
        hoverPose: 'point',
        pickMeLine: "I literally started Forum. Pick me and I'll design your whole personality.",
        stats: { technique: 9, speed: 7, balance: 8, power: 7, jump: 9 }
    },
    {
        riderId: 'jp-walker',
        spotLabel: 'Leaning on the TV cart',
        x: 41, y: 4, scale: 1.04,
        looks: [{ skin: SKIN.fair, hoodie: '#0284c7', pants: '#1e293b', hat: '#e2e8f0', hairColor: '#3f2a1a', hair: 'hood' }],
        hoverPose: 'crossed',
        pickMeLine: "Pick The Don. I've slid every handrail between here and Farmington.",
        stats: { technique: 9, speed: 8, balance: 8, power: 9, jump: 9 }
    },
    {
        riderId: 'jeremy-jones',
        spotLabel: 'Rewinding the VHS',
        x: 48, y: 6, scale: 1,
        looks: [{ skin: SKIN.light, hoodie: '#ca8a04', pants: '#3f3f46', hat: '#7c2d12', hairColor: '#2d1b0e', hair: 'beanie' }],
        hoverPose: 'shaka',
        pickMeLine: 'I know a kinked rail at a junior high off 9th. Just saying. Pick me.',
        stats: { technique: 10, speed: 7, balance: 9, power: 7, jump: 8 }
    },
    {
        riderId: 'eddie-wall',
        spotLabel: 'Half asleep on the TV cart',
        x: 55, y: 5, scale: 0.98,
        looks: [{ skin: SKIN.fair, hoodie: '#7e22ce', pants: '#111827', hat: '#111827', hairColor: '#a16207', hair: 'beanieHair', face: 'stache' }],
        hoverPose: 'peace',
        pickMeLine: "Night crew, baby. I'll get you on the lift before the lights even kick on.",
        stats: { technique: 8, speed: 7, balance: 7, power: 8, jump: 8 }
    },
    // Outerwear wall / Burton corner
    {
        riderId: 'terje-hakonsen',
        spotLabel: 'Judging the outerwear rack',
        x: 64, y: 8, scale: 1,
        looks: [{ skin: SKIN.fair, hoodie: '#0891b2', pants: '#e2e8f0', hat: '#991b1b', hairColor: '#e8c872', hair: 'beanieHair' }],
        hoverPose: 'crossed',
        pickMeLine: 'I was riding before this shop had a snowboard wall. Choose wisely.',
        stats: { technique: 9, speed: 9, balance: 10, power: 9, jump: 10 }
    },
    {
        riderId: 'shaun-white',
        spotLabel: 'Signing a kid’s helmet box',
        x: 71, y: 5, scale: 1.02,
        looks: [{ skin: SKIN.fair, hoodie: '#dc2626', pants: '#f8fafc', hat: '#dc2626', hairColor: '#c2410c', hair: 'longHair' }],
        hoverPose: 'hands-up',
        pickMeLine: "Pick me and I'll tell you about the halfpipe. Again. In detail.",
        stats: { technique: 9, speed: 9, balance: 8, power: 9, jump: 10 }
    },
    {
        riderId: 'danny-davis',
        spotLabel: 'Vibing by the beanie table',
        x: 78, y: 7, scale: 1,
        looks: [{ skin: SKIN.light, hoodie: '#059669', pants: '#78350f', hat: '#fde68a', hairColor: '#92400e', hair: 'beanieHair', face: 'stache' }],
        hoverPose: 'peace',
        pickMeLine: 'Peace, love, and a three-hour Brighton lunch. Pick Danny, man.',
        stats: { technique: 8, speed: 8, balance: 9, power: 7, jump: 8 }
    },
    // ThirtyTwo boot wall + front door
    {
        riderId: 'scott-stevens',
        spotLabel: 'Balancing on the boot bench',
        x: 85, y: 10, scale: 0.98,
        looks: [{ skin: SKIN.fair, hoodie: '#db2777', pants: '#1f2937', hat: '#fbbf24', hairColor: '#422006', hair: 'capBack' }],
        hoverPose: 'dab',
        pickMeLine: "I'll turn every picnic table in the Brighton lot into a feature.",
        stats: { technique: 10, speed: 6, balance: 8, power: 6, jump: 7 }
    },
    {
        riderId: 'chris-grenier',
        spotLabel: 'Recording a Bomb Hole promo',
        x: 92, y: 6, scale: 1.02,
        looks: [{ skin: SKIN.light, hoodie: '#18181b', pants: '#57534e', hat: '#e11d48', hairColor: '#3f2a1a', hair: 'beanie', face: 'beard', prop: 'mic' }],
        hoverPose: 'point',
        pickMeLine: "Pick me and you're on The Bomb Hole. Episode drops Wednesday.",
        stats: { technique: 8, speed: 8, balance: 7, power: 8, jump: 8 }
    },
    {
        riderId: 'zeb-powell',
        spotLabel: 'Doing a handstand by the sticker pillar',
        x: 12, y: 6, scale: 1,
        looks: [{ skin: SKIN.deep, hoodie: '#f59e0b', pants: '#4c1d95', hat: '#22d3ee', hairColor: '#1c1917', hair: 'dreads', eyes: 'hype' }],
        hoverPose: 'hands-up',
        pickMeLine: "I'll backflip off the roof box. Please pick me. PLEASE.",
        stats: { technique: 10, speed: 7, balance: 7, power: 8, jump: 9 }
    },
    // Milo locals
    {
        riderId: 'milo-shop-groms',
        spotLabel: 'Hogging the shop couch',
        x: 21, y: 3, scale: 0.84, seated: true,
        looks: [
            { skin: SKIN.fair, hoodie: '#16a34a', pants: '#1e3a8a', hat: '#f97316', hairColor: '#facc15', hair: 'beanie', eyes: 'hype', prop: 'energy' },
            { skin: SKIN.tan, hoodie: '#e11d48', pants: '#3f3f46', hat: '#0ea5e9', hairColor: '#1c1917', hair: 'capBack', eyes: 'hype', prop: 'burrito' }
        ],
        hoverPose: 'hands-up',
        pickMeLine: 'WE HAVE A SUBARU. WE HAVE GAS. WE HAVE HALF A BURRITO.',
        stats: { technique: 4, speed: 10, balance: 3, power: 5, jump: 6 }
    },
    {
        riderId: 'milo-wax-tech',
        spotLabel: 'Holding a bar of wax at the counter',
        x: 4, y: 12, scale: 0.98,
        looks: [{ skin: SKIN.light, hoodie: '#0ea5e9', pants: '#292524', hat: '#14532d', hairColor: '#57534e', hair: 'cap', face: 'beard', prop: 'wax' }],
        hoverPose: 'flex',
        pickMeLine: "I waxed your board while you weren't looking. You're welcome. Pick me.",
        stats: { technique: 6, speed: 9, balance: 7, power: 6, jump: 5 }
    },
    {
        riderId: 'bone-zone-local',
        spotLabel: 'Fully strapped in for a hike',
        x: 98, y: 9, scale: 0.96,
        looks: [{ skin: SKIN.tan, hoodie: '#7c3aed', pants: '#365314', hat: '#a3e635', hairColor: '#292524', hair: 'helmet', face: 'goggles', prop: 'backpack' }],
        hoverPose: 'point',
        pickMeLine: "I know a line in the Bone Zone nobody's touched since Tuesday.",
        stats: { technique: 7, speed: 6, balance: 8, power: 9, jump: 7 }
    }
];
export const SHOP_LOCALS = [
    {
        id: 'counter-skyler',
        name: 'Skyler',
        role: 'Counter Kid',
        scene: 'lounge',
        x: 1.5, y: 22, scale: 0.78,
        idle: 'sway',
        look: { skin: SKIN.fair, hoodie: '#65a30d', pants: '#44403c', hat: '#a855f7', hairColor: '#fde047', hair: 'beanieHair', eyes: 'sleepy' },
        lines: [
            'Welcome to Milo. Or did you already come in? Time is weird today.',
            "We're out of the purple wax but we have, like, so many stickers.",
            "I've been folding this one hoodie for forty minutes. It's perfect now.",
            "Smells like the wax room in here. Definitely the wax room."
        ]
    },
    {
        id: 'counter-jace',
        name: 'Jace',
        role: 'Counter Kid',
        scene: 'lounge',
        x: 8, y: 23, scale: 0.76,
        idle: 'sway',
        look: { skin: SKIN.tan, hoodie: '#b91c1c', pants: '#1c1917', hat: '#1c1917', hairColor: '#1c1917', hair: 'capBack', eyes: 'sleepy', prop: 'takis' },
        lines: [
            "Dude the Pro Sale is in like... wait, what month is it?",
            "Bro, do you ever think the S-Curves are just... curves?",
            "I'm not hungry. I just like the crunch.",
            "Ring you up? Yeah. Totally. Where's the... the beeper thing."
        ]
    },
    {
        id: 'glove-dallin',
        name: 'Dallin',
        role: 'Trying On Every Glove',
        scene: 'lounge',
        x: 60, y: 14, scale: 0.8,
        idle: 'gloves',
        look: { skin: SKIN.fair, hoodie: '#334155', pants: '#0f766e', hat: '#f43f5e', hairColor: '#b45309', hair: 'beanie', prop: 'gloves' },
        lines: [
            'Do these come in XL? Like... spiritually?',
            "Bro, these are mittens. I'm a mitten guy now.",
            'Trying on every glove in the shop until my mom gets here.',
            'Gore-Tex? More like Gore-FLEX. Get it? No? OK.'
        ]
    },
    {
        id: 'skate-kaden',
        name: 'Kaden',
        role: 'Kickflipping In The Aisle',
        scene: 'lounge',
        x: 27, y: 15, scale: 0.72,
        idle: 'kickflip',
        wander: true,
        look: { skin: SKIN.light, hoodie: '#facc15', pants: '#1e40af', hat: '#0f172a', hairColor: '#422006', hair: 'cap', prop: 'skateboard' },
        lines: [
            "Trevor said no skating in the shop. Trevor's in the back.",
            "Landed it! ...you didn't see? Watch. Watch. WATCH.",
            'Rail Gardens after this. You coming or what?',
            'This deck has 41 days on it and zero kickflips. We are close.'
        ]
    },
    {
        id: 'draper-mom',
        name: 'Kimberly',
        role: 'Draper Mom On A Mission',
        scene: 'lounge',
        x: 68, y: 16, scale: 0.8,
        idle: 'phone',
        look: { skin: SKIN.fair, hoodie: '#f0abfc', pants: '#1e293b', hat: '#fafafa', hairColor: '#fcd34d', hair: 'longHair', prop: 'helmetBox' },
        lines: [
            'Does this helmet have Bluetooth? Brexley needs his podcasts on the lift.',
            "Is the Pro Sale the one people camp out for? We'll be here at four.",
            "I just need something cute that matches the Telluride. Is that a lot to ask?",
            'Sorry, do you work here? You look like you work here.'
        ]
    },
    {
        id: 'sticker-ty',
        name: 'Ty',
        role: 'Sticker Bin Archaeologist',
        scene: 'wall',
        x: 7, y: 2, scale: 0.7,
        idle: 'dig',
        look: { skin: SKIN.brown, hoodie: '#06b6d4', pants: '#3f3f46', hat: '#ef4444', hairColor: '#1c1917', hair: 'beanie' },
        lines: [
            'Free stickers are the only thing in here I can afford.',
            'I have four thousand Milo stickers and zero snowboards.',
            'Found a Forum sticker from like 1999. This is a museum piece.'
        ]
    },
    {
        id: 'wall-brody',
        name: 'Brody',
        role: 'Staring At The Board Wall',
        scene: 'wall',
        x: 92, y: 2, scale: 0.74,
        idle: 'browse',
        look: { skin: SKIN.light, hoodie: '#57534e', pants: '#1e3a8a', hat: '#d97706', hairColor: '#78350f', hair: 'beanieHair', eyes: 'sleepy' },
        lines: [
            "I've been on the fence about this board since 2019.",
            "My dad rode a Forum in '99. He won't stop bringing it up.",
            'Is camber a personality trait? Asking for me.'
        ]
    }
];
// Hang tags on the board wall: Milo price + a handwritten note from the shop rats.
export const BOARD_WALL_TAGS = {
    'forum-destroyer': { price: '$479', note: "JP's pick. Don't ask, just buy it.", graphic: 'flames' },
    'forum-peter-line': { price: '$529', note: 'Signed by the Architect (we think)', graphic: 'stars' },
    'forum-youngblood': { price: '$419', note: 'Bends like a noodle on handrails', graphic: 'checker' },
    'burton-custom': { price: '$649', note: 'Your dad had one. So will you.', graphic: 'stripes' },
    'burton-deep-thinker': { price: '$699', note: 'For carving, and also feelings', graphic: 'waves' },
    'burton-fish': { price: '$629', note: 'Hold out for a powder day', graphic: 'retro' },
    'thirtytwo-scott-stevens': { price: '$499', note: 'Pre-bent for picnic tables', graphic: 'dots' },
    'thirtytwo-chris-grenier': { price: '$549', note: 'Comes with a free podcast plug', graphic: 'chevron' },
    'milosport-1984': { price: '$384', note: 'Shop deck. Since ’84. Respect it.', graphic: 'retro' }
};
// Trevor's commentary while you work his bench.
export const WAX_ROOM_LINES = {
    choose_wax: "Pick a wax for today's temp. Don't touch the purple, that's my personal stash.",
    drip_wax: "Drip it nose to tail. Don't drip it on my shoes, they're brand new.",
    iron_smooth: 'Keep that iron moving. Leave it in one spot and you’ll cook the base like a quesadilla.',
    scrape_base: "Scrape it all off. The wax goes INTO the base, not ON it. That's the whole secret.",
    brush_polish: 'Nylon brush for structure. Long strokes. You got this.',
    complete: "Bro, look at that shine. You're gonna haul down Crest and leave everyone in the dust!"
};
