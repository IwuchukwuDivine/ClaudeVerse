import type { SearchItem, SearchResult } from "~/utils/types/search";
import normalizeQuery from "./normalizeQuery";

/**
 * Score a single candidate string against a query.
 *
 * Ranking priorities:
 *   1. Exact case-insensitive equality         → 1000
 *   2. Starts-with match                        →  500
 *   3. Whole-word match                         →  350
 *   4. Substring match (the earlier, the better)→ 100..300
 *   5. Per-character subsequence (fuzzy)        →   1..50
 *   6. No match                                 →    0
 *
 * Also returns the character ranges of the match so the UI can
 * highlight them.
 */
const scoreText = (
  rawText: string,
  rawQuery: string,
): { score: number; ranges: [number, number][] } => {
  if (!rawText || !rawQuery) return { score: 0, ranges: [] };

  const text = rawText.toLowerCase();
  const query = normalizeQuery(rawQuery);

  if (text === query) {
    return { score: 1000, ranges: [[0, rawText.length]] };
  }

  if (text.startsWith(query)) {
    return { score: 500, ranges: [[0, query.length]] };
  }

  // Whole-word match (preceded by space or start)
  const wordBoundary = new RegExp(
    `(?:^|\\s)(${escapeRegExp(query)})`,
    "i",
  );
  const wb = wordBoundary.exec(rawText);
  if (wb && wb.index !== undefined) {
    const start = wb.index + (wb[0].length - wb[1]!.length);
    return { score: 350, ranges: [[start, start + query.length]] };
  }

  // Plain substring
  const sub = text.indexOf(query);
  if (sub !== -1) {
    // earlier = better
    const positionPenalty = Math.min(sub, 40);
    return {
      score: 300 - positionPenalty * 5,
      ranges: [[sub, sub + query.length]],
    };
  }

  // Character subsequence (fuzzy): does every char of query appear in order?
  const ranges: [number, number][] = [];
  let ti = 0;
  let qi = 0;
  let lastMatched = -2;
  let run = 0;
  let rangeStart = -1;
  let score = 0;
  while (ti < text.length && qi < query.length) {
    if (text[ti] === query[qi]) {
      if (ti === lastMatched + 1) {
        run++;
      } else {
        if (rangeStart !== -1) ranges.push([rangeStart, lastMatched + 1]);
        rangeStart = ti;
        run = 1;
      }
      // tighter runs score more
      score += 1 + run * 2;
      lastMatched = ti;
      qi++;
    }
    ti++;
  }
  if (qi !== query.length) return { score: 0, ranges: [] };
  if (rangeStart !== -1) ranges.push([rangeStart, lastMatched + 1]);
  return { score: Math.min(50, score), ranges };
};

/**
 * Score an item against a query across all its searchable fields.
 * Returns null if the item does not match.
 */
export const scoreItem = (
  item: SearchItem,
  rawQuery: string,
): SearchResult | null => {
  if (!rawQuery.trim()) return null;

  const titleHit = scoreText(item.title, rawQuery);
  const subtitleHit = item.subtitle ? scoreText(item.subtitle, rawQuery) : null;
  const bodyHit = item.body ? scoreText(item.body, rawQuery) : null;
  const keywordsHit = item.keywords?.length
    ? scoreText(item.keywords.join(" "), rawQuery)
    : null;
  const breadcrumbHit = item.breadcrumbs?.length
    ? scoreText(item.breadcrumbs.join(" "), rawQuery)
    : null;

  const candidates: {
    field: SearchResult["matchedField"];
    score: number;
    ranges: [number, number][];
    weight: number;
  }[] = [
    { field: "title", score: titleHit.score, ranges: titleHit.ranges, weight: 1.0 },
    { field: "subtitle", score: subtitleHit?.score ?? 0, ranges: subtitleHit?.ranges ?? [], weight: 0.7 },
    { field: "body", score: bodyHit?.score ?? 0, ranges: bodyHit?.ranges ?? [], weight: 0.5 },
    { field: "keywords", score: keywordsHit?.score ?? 0, ranges: keywordsHit?.ranges ?? [], weight: 0.6 },
    { field: "breadcrumb", score: breadcrumbHit?.score ?? 0, ranges: breadcrumbHit?.ranges ?? [], weight: 0.4 },
  ];

  const best = candidates.reduce(
    (acc, c) => (c.score * c.weight > acc.score * acc.weight ? c : acc),
    candidates[0]!,
  );

  const finalScore = best.score * best.weight;
  if (finalScore <= 0) return null;

  const boost = item.boost ?? 0;

  return {
    item,
    score: finalScore + boost,
    matchedField: best.field,
    titleHighlights: best.field === "title" ? best.ranges : titleHit.ranges,
    subtitleHighlights:
      best.field === "subtitle"
        ? best.ranges
        : subtitleHit?.ranges ?? [],
  };
};

const escapeRegExp = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default scoreItem;
