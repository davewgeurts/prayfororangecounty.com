export type FigureHair = 'beanie' | 'beanieHair' | 'cap' | 'capBack' | 'longHair' | 'hood' | 'helmet' | 'dreads';
export type FigureFace = 'none' | 'beard' | 'stache' | 'goggles';
export type FigureEyes = 'normal' | 'sleepy' | 'hype';
export type FigureProp = 'none' | 'mic' | 'wax' | 'burrito' | 'energy' | 'backpack' | 'skateboard' | 'gloves' | 'phone' | 'takis' | 'helmetBox' | 'scraper';
export interface FigureLook {
    skin: string;
    hoodie: string;
    pants: string;
    hat: string;
    hairColor: string;
    hair: FigureHair;
    face?: FigureFace;
    eyes?: FigureEyes;
    prop?: FigureProp;
}
export type HoverPose = 'flex' | 'point' | 'shaka' | 'dab' | 'peace' | 'hands-up' | 'crossed';
export interface RiderShopProfile {
    riderId: string;
    spotLabel: string;
    x: number;
    y: number;
    scale: number;
    seated?: boolean;
    looks: FigureLook[];
    hoverPose: HoverPose;
    pickMeLine: string;
    stats: {
        technique: number;
        speed: number;
        balance: number;
        power: number;
        jump: number;
    };
}
export type LocalIdle = 'gloves' | 'sway' | 'kickflip' | 'browse' | 'phone' | 'dig';
export interface ShopLocal {
    id: string;
    name: string;
    role: string;
    scene: 'lounge' | 'wall';
    x: number;
    y: number;
    scale: number;
    idle: LocalIdle;
    wander?: boolean;
    look: FigureLook;
    lines: string[];
}
export declare const FORTNITE_DANCES: readonly [{
    readonly id: "floss";
    readonly label: "The Floss";
}, {
    readonly id: "default";
    readonly label: "Default Dance";
}, {
    readonly id: "take-the-l";
    readonly label: "Take The L";
}, {
    readonly id: "orange-justice";
    readonly label: "Orange Justice";
}, {
    readonly id: "electro-shuffle";
    readonly label: "Electro Shuffle";
}, {
    readonly id: "hype";
    readonly label: "Hype";
}, {
    readonly id: "griddy";
    readonly label: "The Griddy";
}, {
    readonly id: "ride-the-pony";
    readonly label: "Ride The Pony";
}, {
    readonly id: "best-mates";
    readonly label: "Best Mates";
}];
export type FortniteDanceId = typeof FORTNITE_DANCES[number]['id'];
export declare const RIDER_SHOP_PROFILES: RiderShopProfile[];
export declare const SHOP_LOCALS: ShopLocal[];
export declare const BOARD_WALL_TAGS: Record<string, {
    price: string;
    note: string;
    graphic: 'stripes' | 'chevron' | 'dots' | 'stars' | 'waves' | 'checker' | 'flames' | 'retro';
}>;
export declare const WAX_ROOM_LINES: Record<string, string>;
