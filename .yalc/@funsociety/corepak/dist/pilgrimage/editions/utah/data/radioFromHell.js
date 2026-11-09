// X96 (KXRK 96.3 FM) & Radio From Hell — station facts, live stream, and show bits.
// Sources: x96.com, FCC public file (KXRK), Salt Lake Tribune 40th-anniversary feature (May 2026),
// Wikipedia "Radio from Hell", and the show's podcast feed (spreaker.com/show/393209).
export const X96_STATION = {
    callSign: 'KXRK',
    name: 'X96',
    frequency: '96.3 FM',
    tagline: "Utah's Alternative",
    owner: 'Broadway Media',
    studioAddress: '50 West Broadway, Suite 200',
    studioCity: 'Salt Lake City, UT 84101',
    studioCrossStreets: 'Broadway (300 South) between Main & West Temple, Downtown SLC',
    phone: '(801) 524-2600',
    hd2Name: 'X96 Classic (KXRK-HD2)',
    // Direct Icecast AAC mount behind the listen.streamon.fm/kxrk web player (CORS-enabled)
    streamUrl: 'https://ais-sa1.streamon.fm/7346_48k.aac',
    // Now-playing metadata for the same mount (Access-Control-Allow-Origin: *)
    nowPlayingUrl: 'https://yp.cdnstream1.com/metadata/7346_48k/current.json',
    listenLivePage: 'https://listen.streamon.fm/kxrk',
    watchLivePage: 'https://x96.com/live/'
};
// Played when the live stream won't load (blocked codec, network, etc.)
export const RFH_FALLBACK_EPISODE = {
    title: 'Radio From Hell — October 13th, 2026',
    shortLabel: 'RFH PODCAST 10.13',
    mp3Url: 'https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/75761696/rfh_podcast_10132026.mp3',
    rundown: "Frank Crist presents They're Fine, Just Fine, Sam Gillis's SNL monologue, Boner of the Day, Guinn from the Humane Society with a pup in studio, Beat Gina, the Donut Critic with bagels, then the Boner Recap and news."
};
export const RFH_HOSTS = [
    {
        id: 'kerry',
        name: 'Kerry Jackson',
        emoji: '🤓',
        role: 'Co-creator (1986) • Geek News',
        bio: 'Started the show with Bill at KJQ in Ogden in 1986. Brings the leveled opinions, the Geek News, and has hosted the Geekshow Podcast since 2008.'
    },
    {
        id: 'bill',
        name: 'Bill Allred',
        emoji: '😈',
        role: 'Co-creator (1986) • Lord of Morning Radio',
        bio: 'The joyful antagonist. Used to buy the Tribune, the Deseret News, and USA Today every morning and cut out stories with scissors and highlighters.'
    },
    {
        id: 'gina',
        name: 'Gina Barberi',
        emoji: '👑',
        role: 'Joined May 20, 1996 • Undefeated(ish) at Beat Gina',
        bio: "Came over from KUTQ's \"Woody and Barberi\" in 1996 and completed the trio. Her personal stories (like her dog being allowed on tile but never carpet) can run for days."
    }
];
export const RFH_PRODUCER = {
    name: 'Caity',
    role: 'Executive Producer',
    dogName: 'Vax',
    dogDescription: 'chocolate Lab with his own sponsored studio cam'
};
export const RFH_SEGMENTS = [
    { name: "They're Fine, Just Fine", detail: 'Frank Crist presents. Usually the first bit of the morning.' },
    { name: 'Boner of the Day', detail: 'Three stories of truly dumb human behavior. Listeners vote for the "winner" of the award nobody wants.' },
    { name: 'Beat Gina', detail: 'A listener goes head-to-head with Gina on trivia. Gina usually wins.' },
    { name: 'Hello Yeah What', detail: 'Open phones. You call, they answer, chaos follows.' },
    { name: 'Utah Word of the Day', detail: 'Oh my heck. Fetch. Scone (the fried kind).' },
    { name: 'Things That Must Go', detail: 'Listener lists of things that need to be banished from society.' },
    { name: 'Geek News', detail: "Kerry's nerd news roundup." },
    { name: 'The Donut Critic', detail: 'Pastries reviewed live on air.' },
    { name: 'Have Another Drink', detail: 'Jimmy the Wine Guy pours something lovely on Thursdays.' },
    { name: 'Boner of the Week', detail: 'Dave the Flower Guy crowns the worst of the week\'s worst.' },
    { name: 'Boner Recap & News', detail: 'How every show wraps up.' }
];
export const RFH_FACTS = [
    'Radio From Hell started in 1986 on KJQ in Ogden as "The Fun Pigs."',
    'It\'s "the radio show for people who feel like hell in the morning."',
    'Kerry reunited with Bill at X96 on October 18, 1993 and the Radio From Hell name came back.',
    'Gina Barberi joined on May 20, 1996, completing the trio that is still on the air.',
    'The show aired its 5,000th episode in August 2008.',
    '2026 marks 40 years, making it Utah\'s longest-running radio show.',
    'Listeners are known as "friends of the program."',
    'The hosts wake up around 3 a.m. They say that is the worst part of the job.',
    'City Weekly readers have voted it Best Radio Show every year since the category started in 2002.',
    'Lucky Boner voters win the "Can\'t Buy It, Got to Win It" Radio From Hell Boner t-shirt.'
];
// "Boner" = a dumb mistake. Fictional game nominees, all PG.
export const BONER_NOMINEES = [
    {
        id: 'crest-glove-chain',
        headline: 'Holladay Woman vs. The Crest 6',
        story: 'Dropped her phone off the Crest 6. Dropped a glove trying to film where the phone landed. Then dropped the other glove pointing at the first glove.',
        hostId: 'gina',
        hostReaction: "I respect that she committed. That's a three-item yard sale and she never even got off the chair."
    },
    {
        id: 'silent-rock-honker',
        headline: 'Cottonwood Heights Man Honks Through Silent Rock',
        story: 'Leaned on his horn for the entire length of Silent Rock because he "thought that\'s how you summon the snow." Every car behind him on SR-190 would like a word.',
        hostId: 'bill',
        hostReaction: 'Sir. SIR. It is called SILENT Rock. The instructions are in the name!'
    },
    {
        id: 'flip-flop-checkpoint',
        headline: 'Tourist Hits the Traction Checkpoint in a Convertible',
        story: 'Rolled up to the UDOT traction law checkpoint in a rented Mustang convertible, top down, in flip-flops, and asked the trooper which way to "the beach part of Utah."',
        hostId: 'kerry',
        hostReaction: 'To be fair, there IS a beach at the Great Salt Lake. It smells like eggs and you do not want to go there in January.'
    },
    {
        id: 'whale-lap-forty',
        headline: 'Sugar House Driver Laps the Whale 39 Times',
        story: 'Circled the 9th & 9th Whale roundabout 39 times "for maximum powder," ran out of gas on lap 40, and had to be pushed out by people waiting in the Swig line.',
        hostId: 'gina',
        hostReaction: 'The Swig line pushing a car is the most Utah sentence I have ever heard.'
    },
    {
        id: 'waffle-iron-wax',
        headline: 'West Valley Dad Waxes Board With Waffle Iron',
        story: "Borrowed his wife's waffle iron to wax his kid's snowboard. The base now has a perfect grid pattern and smells like syrup. The waffles also taste like fluoro wax.",
        hostId: 'kerry',
        hostReaction: 'Honestly the grid might help it hold syrup... I mean, wax. This man is an innovator.'
    },
    {
        id: 'sick-day-backflip',
        headline: 'Murray Man Calls In Sick, Lands on the 10 O\'Clock News',
        story: 'Called in sick for a powder day, then got interviewed on the evening news doing a backflip off a kicker at Brighton. His boss was watching. His boss was also at Brighton.',
        hostId: 'bill',
        hostReaction: 'The backflip was clean though. Put that on the resume.'
    },
    {
        id: 'laundry-season-pass',
        headline: 'Midvale Rider on Fourth Replacement Season Pass',
        story: 'Has run his season pass through the wash in his snow pants three times this month. The ticket window staff now greet him by name and a slow clap.',
        hostId: 'gina',
        hostReaction: 'My dog is not allowed on carpet and this man is not allowed near a washing machine.'
    },
    {
        id: 'roof-shovel-blower',
        headline: 'Kaysville Man Snowblows His Roof',
        story: 'Hauled his brand-new snowblower up a ladder to "get ahead of the storm." The snowblower is now in the neighbor\'s hot tub. The neighbor was not.',
        hostId: 'bill',
        hostReaction: 'Nobody was hurt, so I am legally allowed to laugh at this for the rest of the hour.'
    },
    {
        id: 'wrong-car-chains',
        headline: 'Draper Driver Puts Chains on the Wrong Car',
        story: 'Spent 45 minutes in a blizzard at the canyon mouth chaining up tires in the dark. They were on the car parked next to his. That car was a rental. Nobody knows where it went.',
        hostId: 'kerry',
        hostReaction: 'Somewhere a tourist is wondering why their Kia is suddenly the best car in the canyon.'
    }
];
// Your own winning Boner — the reason there's a lift ticket waiting at the X96 front desk.
export const PLAYER_BONER_STORY = {
    headline: 'Local Shredder Drives Off With Board on the Roof',
    story: 'Set a freshly waxed board on the roof of the car in the Milosport lot "for one second," then pulled out onto 3300 South. A Swig employee chased it down and held it over her head like the Stanley Cup.',
    reaction: "It won by a landslide. Dave the Flower Guy says it's already the front-runner for Boner of the Week."
};
export const BEAT_GINA_QUESTIONS = [
    { question: 'What year did Radio From Hell first hit the air on KJQ in Ogden?', options: ['1986', '1993', '1999'], answerIndex: 0 },
    { question: 'What did Kerry and Bill originally call the show in 1986?', options: ['Project X', 'The Fun Pigs', 'The Morning Zoo'], answerIndex: 1 },
    { question: 'What year did Gina Barberi join the show?', options: ['1991', '2001', '1996'], answerIndex: 2 },
    { question: 'Who crowns the Boner of the Week?', options: ['Dave the Flower Guy', 'Jimmy the Wine Guy', 'The Donut Critic'], answerIndex: 0 },
    { question: "What's the name of producer Caity's chocolate Lab with his own studio cam?", options: ['Max', 'Vax', 'Brighton'], answerIndex: 1 },
    { question: 'X96 broadcasts from which downtown street?', options: ['900 East', '3300 South', 'Broadway (300 South)'], answerIndex: 2 },
    { question: 'Silent Rock sits along which canyon highway?', options: ['Big Cottonwood (SR-190)', 'Little Cottonwood (SR-210)', 'Parleys (I-80)'], answerIndex: 0 },
    { question: 'Which resort sits at the very top of Big Cottonwood Canyon?', options: ['Solitude', 'Brighton', 'Alta'], answerIndex: 1 },
    { question: 'Roughly how many inches did Alta record in the monster 2022-23 season?', options: ['503"', '703"', '903"'], answerIndex: 2 },
    { question: 'X96 is what frequency on the FM dial?', options: ['96.3', '96.9', '90.1'], answerIndex: 0 }
];
/** Radio From Hell airs weekdays 6–10 a.m. Mountain Time. */
export function isRadioFromHellOnAir(now = new Date()) {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Denver',
            weekday: 'short',
            hour: 'numeric',
            hourCycle: 'h23'
        }).formatToParts(now);
        const weekday = parts.find(p => p.type === 'weekday')?.value ?? '';
        const hour = Number(parts.find(p => p.type === 'hour')?.value ?? -1);
        return !['Sat', 'Sun'].includes(weekday) && hour >= 6 && hour < 10;
    }
    catch {
        return false;
    }
}
export function formatX96NowPlaying(event, now = new Date()) {
    if (isRadioFromHellOnAir(now))
        return 'RADIO FROM HELL • KERRY, BILL & GINA';
    if (event?.TXXX_category === 'music' && event.TPE1 && event.TIT2)
        return `${event.TPE1} – ${event.TIT2}`;
    return event?.TIT2 || X96_STATION.tagline.toUpperCase();
}
export function pickRandom(list, count) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
}
