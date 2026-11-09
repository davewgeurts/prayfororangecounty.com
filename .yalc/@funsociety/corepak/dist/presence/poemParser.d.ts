export interface ParsedPoemStanza {
    index: number;
    number: number;
    title: string;
    fullTitle: string;
    lines: string[];
}
export interface ParsedPoemResult {
    stanzas: ParsedPoemStanza[];
    lines: string[];
}
/**
 * Parses a flat poem text file into non-empty, non-comment lines.
 */
export declare function parsePoemTxt(raw: string): string[];
/**
 * Parses a structured markdown poem with `## Chapter` headings into stanzas.
 */
export declare function parseStructuredPoem(markdown: string): ParsedPoemStanza[];
/**
 * Unified poem markdown parser supporting both structured stanza headings (`## `)
 * and flat poem lines.
 */
export declare function parsePoemMarkdown(markdown: string): ParsedPoemResult;
