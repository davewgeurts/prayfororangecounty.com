import type { Reaction, ReactionData, ReactionType, ReactionCounts } from '../types/daily.js';
export type { Reaction, ReactionData, ReactionType, ReactionCounts };
export declare function fetchReactions(date: string): Promise<ReactionData | null>;
export declare function submitReaction(date: string, reaction: Reaction | null): Promise<ReactionData | null>;
