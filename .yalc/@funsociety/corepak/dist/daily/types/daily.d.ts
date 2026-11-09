export interface DailyDialogue {
    speaker?: string;
    response?: string;
    therapist?: string;
    patient?: string;
    punchline: string;
}
export interface DailyContent {
    date: string;
    dialogue: DailyDialogue;
    imageUrl: string;
}
export interface DailyManifest {
    dates: string[];
}
export interface DailyReflection extends Partial<DailyContent> {
    date: string;
    title?: string;
    quote?: string;
    quoteAuthor?: string;
    reflection?: string;
    thoughtForTheDay?: string;
    meditation?: string;
    affirmation?: string;
    topic?: string;
    dialogue: DailyDialogue;
    imageUrl: string;
}
export type Reaction = 'up' | 'down';
export type ReactionType = Reaction;
export interface ReactionData {
    thumbsUp: number;
    thumbsDown: number;
    userReaction: Reaction | null;
}
export type ReactionCounts = ReactionData;
export interface ViewStats {
    dayViews: number;
    totalViews: number;
    activeViewers: number;
}
export interface TopicEntry {
    date: string;
    topic: string;
}
export interface TopicCategory {
    name: string;
    topics: string[];
}
export interface DailyConfig {
    siteUrl: string;
    viewsApiUrl: string;
    imagePrompt: string;
    buildId: string;
    debug: boolean;
    isProd: boolean;
    isDev: boolean;
    countdownLabel?: string;
}
export interface ShareButtonsConfig {
    siteUrl?: string;
    siteName?: string;
    quoteAuthorFallback?: string;
    sharePrefix?: string;
    shareText?: string;
    emailSubject?: string;
}
export interface SpeakerBadgeConfig {
    label: string;
    emoji?: string;
    logoSrc?: string;
    className?: string;
}
export interface DailyContentConfig {
    imageAltPrefix?: string;
    imageAltBuilder?: (formattedDate: string, dialogue: DailyDialogue) => string;
    firstSpeaker?: SpeakerBadgeConfig;
    secondSpeaker?: SpeakerBadgeConfig;
    punchlineSpeaker?: SpeakerBadgeConfig;
    shareConfig?: ShareButtonsConfig;
}
export interface DailyContentOptions {
    dailyBase?: string;
    buildId?: string;
    isDev?: boolean;
    filterFutureDates?: boolean;
    allowFutureDates?: boolean;
    timeZone?: string;
    fallbackReflection?: DailyReflection;
}
