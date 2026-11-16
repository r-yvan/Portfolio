/**
 * Tiny headline markup used across the site and editable from the admin:
 *
 *   *words*  → the red accent
 *   _words_  → muted grey (the two-tone "lead-in" look)
 *
 * e.g. "I build *digital experiences* for _ambitious ideas._"
 */
export type Tone = "base" | "accent" | "muted";
export type Token = { text: string; tone: Tone };

const PATTERN = /\*([^*]+)\*|_([^_]+)_/g;

export function parseMarkup(source: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of source.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ text: source.slice(last, index), tone: "base" });
    if (match[1] !== undefined) tokens.push({ text: match[1], tone: "accent" });
    else tokens.push({ text: match[2] ?? "", tone: "muted" });
    last = index + match[0].length;
  }
  if (last < source.length) tokens.push({ text: source.slice(last), tone: "base" });
  return tokens;
}

export function stripMarkup(source: string) {
  return source.replace(PATTERN, (_, a, b) => a ?? b ?? "");
}

export const toneClass: Record<Tone, string> = {
  base: "",
  accent: "tone-accent",
  muted: "tone-muted",
};
