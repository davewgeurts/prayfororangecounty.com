export { CAMERA_VIEW, DRIVE_MODE, EXPERIENCE_PHASE, SURF_SPOTS, } from '../../utah/types/game';
export const CANYON_LANDMARKS = [
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
