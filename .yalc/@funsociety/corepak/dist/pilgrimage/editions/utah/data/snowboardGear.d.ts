export interface Snowboard {
    id: string;
    brand: 'Forum' | 'Burton' | 'ThirtyTwo' | 'Milosport' | 'Lost Mayhem' | 'Channel Islands' | 'Catch Surf' | 'Boogie Board' | 'Surf & Paddle';
    craftType?: 'surfboard' | 'boogie';
    name: string;
    series: string;
    year: string;
    type: 'Park / Street' | 'All-Mountain' | 'Deep Powder' | 'Freestyle Jib' | 'WSL High-Performance' | 'Twin Fin Fish' | 'Soft-Top Shredder' | 'Pro Boogie / Bodyboard' | 'Laguna Custom Glass';
    flex: number;
    pop: number;
    float: number;
    camber: 'Traditional Camber' | 'Flying V / Rocker' | 'Flat-Out Jib' | 'Directional S-Rocker' | 'Squash Tail Thruster' | 'Swallow Tail Twin+1' | 'Crescent Tail Surlyn Slick' | 'Bat Tail PP Core' | 'Triple Stringer Foamie';
    lengthCm: number;
    dimensionsLabel?: string;
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
    categoryLabel: 'Forum Legend' | 'Burton Icon' | 'ThirtyTwo Heavyweight' | 'Milo Local Kid' | 'San Clemente 2% Crew' | 'WSL World Champ' | 'Laguna & Boogie Legend' | 'OC Local Grom';
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
export interface LiftPass {
    id: string;
    name: string;
    resort: 'Brighton' | 'Solitude' | 'Wasatch Dual' | 'Dana Point' | 'San Clemente Pier' | 'Lower Trestles WSL';
    priceMilo: number;
    priceWindow: number;
    prayersPrice: number;
    description: string;
    badgeColor: string;
    accentColor: string;
    perks: string[];
}
export interface VehicleTireOption {
    id: string;
    name: string;
    category: 'bald_slicks' | 'all_season' | 'snow_tires' | 'chains';
    tractionRating: number;
    udotApproved: boolean;
    description: string;
    officerReaction: string;
}
export interface WaxFormula {
    id: string;
    name: string;
    tempRange: string;
    color: string;
    hex: string;
    speedBonus: number;
    description: string;
}
export declare const MILOSPORT_PHOTOS: MilosportPhoto[];
export declare const SNOWBOARDS_LIST: Snowboard[];
export declare const RIDERS_LIST: RiderPro[];
export declare const LIFT_PASSES_LIST: LiftPass[];
export declare const TIRE_OPTIONS_LIST: VehicleTireOption[];
export declare const WAX_FORMULAS_LIST: WaxFormula[];
