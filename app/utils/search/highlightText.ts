/**
 * Turn a string + match ranges into an array of {text, match} tokens
 * so templates can render <mark> around matches without v-html.
 */
export interface HighlightToken {
  text: string;
  match: boolean;
}

const highlightText = (
  text: string,
  ranges: [number, number][],
): HighlightToken[] => {
  if (!ranges.length || !text) return [{ text, match: false }];

  // Merge overlapping ranges, sort by start
  const sorted = [...ranges]
    .filter(([s, e]) => s < e && s < text.length)
    .sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [s, e] of sorted) {
    const last = merged[merged.length - 1];
    if (last && s <= last[1]) {
      last[1] = Math.max(last[1], e);
    } else {
      merged.push([s, Math.min(e, text.length)]);
    }
  }

  const tokens: HighlightToken[] = [];
  let cursor = 0;
  for (const [s, e] of merged) {
    if (cursor < s) tokens.push({ text: text.slice(cursor, s), match: false });
    tokens.push({ text: text.slice(s, e), match: true });
    cursor = e;
  }
  if (cursor < text.length) {
    tokens.push({ text: text.slice(cursor), match: false });
  }
  return tokens;
};

export default highlightText;
