/**
 * Parses a flat poem text file into non-empty, non-comment lines.
 */
export function parsePoemTxt(raw) {
    return raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"));
}
/**
 * Parses a structured markdown poem with `## Chapter` headings into stanzas.
 */
export function parseStructuredPoem(markdown) {
    const stanzas = [];
    let currentStanza = null;
    for (const rawLine of markdown.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("# ") || line.startsWith("#==="))
            continue;
        if (line.startsWith("## ")) {
            const rawTitle = line.slice(3).trim();
            const cleanedTitle = rawTitle.replace(/^\d+\.\s*/, "");
            currentStanza = {
                index: stanzas.length,
                number: stanzas.length + 1,
                title: cleanedTitle,
                fullTitle: rawTitle,
                lines: [],
            };
            stanzas.push(currentStanza);
            continue;
        }
        if (line.startsWith("#"))
            continue;
        if (currentStanza) {
            currentStanza.lines.push(line);
        }
    }
    return stanzas;
}
/**
 * Unified poem markdown parser supporting both structured stanza headings (`## `)
 * and flat poem lines.
 */
export function parsePoemMarkdown(markdown) {
    const stanzas = parseStructuredPoem(markdown);
    const lines = stanzas.length > 0
        ? stanzas.flatMap((s) => s.lines)
        : parsePoemTxt(markdown);
    if (stanzas.length === 0 && lines.length > 0) {
        return {
            stanzas: [
                {
                    index: 0,
                    number: 1,
                    title: "Poem",
                    fullTitle: "Poem",
                    lines,
                },
            ],
            lines,
        };
    }
    return { stanzas, lines };
}
