export var CAMERA_VIEW;
(function (CAMERA_VIEW) {
    CAMERA_VIEW["GTA_TOP_DOWN"] = "GTA_TOP_DOWN";
    CAMERA_VIEW["COCKPIT_WINDSHIELD"] = "COCKPIT_WINDSHIELD";
})(CAMERA_VIEW || (CAMERA_VIEW = {}));
export var DRIVE_MODE;
(function (DRIVE_MODE) {
    DRIVE_MODE["MANUAL"] = "MANUAL";
    DRIVE_MODE["AUTOPILOT"] = "AUTOPILOT";
})(DRIVE_MODE || (DRIVE_MODE = {}));
export var EXPERIENCE_PHASE;
(function (EXPERIENCE_PHASE) {
    EXPERIENCE_PHASE["MILOSPORT_SHOP"] = "MILOSPORT_SHOP";
    EXPERIENCE_PHASE["DRIVE_CANYON"] = "DRIVE_CANYON";
    EXPERIENCE_PHASE["BRIGHTON_SKIFREE"] = "BRIGHTON_SKIFREE";
})(EXPERIENCE_PHASE || (EXPERIENCE_PHASE = {}));
export const SURF_SPOTS = [
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
export const CANYON_LANDMARKS = [
    {
        id: 'milosport',
        name: 'Milosport Lot (3119 E 3300 S)',
        mile: 0.0,
        elevationFt: 4620,
        description: "Salt Lake City's original core snow & skate shop since 1984. The pilgrimage begins here in the legendary lot.",
        isMilosport: true
    },
    {
        id: 'mouth',
        name: 'Canyon Mouth / Wasatch Blvd',
        mile: 1.2,
        elevationFt: 4950,
        description: 'Entering State Route 190. The gateway to the Central Wasatch.'
    },
    {
        id: 'maxfield',
        name: 'Maxfield / Hydro Ruins',
        mile: 2.2,
        elevationFt: 5200,
        description: 'Old stone masonry and rushing Big Cottonwood Creek.'
    },
    {
        id: 'silent-rock',
        name: 'Silent Rock (Storm Mountain)',
        mile: 2.9,
        elevationFt: 5580,
        description: 'The sacred cut. Radios off. Total silence to honor the mountain.',
        isSilentRock: true
    },
    {
        id: 'scurves',
        name: 'The S-Curves',
        mile: 7.8,
        elevationFt: 6980,
        description: 'Steep switchbacks cutting through towering quartzite cliffs.'
    },
    {
        id: 'solitude',
        name: 'Solitude Mountain Resort',
        mile: 11.5,
        elevationFt: 7988,
        description: 'Honeycomb Canyon access and village lights in the snow.'
    },
    {
        id: 'brighton',
        name: 'Brighton Resort (Top of Canyon)',
        mile: 14.3,
        elevationFt: 8755,
        description: 'The end of SR 190. Home of legendary Utah powder.'
    }
];
