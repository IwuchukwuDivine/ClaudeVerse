import type { Component } from "vue";

/**
 * Stable category keys. Add new keys as providers are introduced.
 * The UI renders groups in the order defined here.
 */
export type SearchCategoryKey =
  | "section"
  | "topic"
  | "page"
  | "heading"
  | "command"
  | "external"
  | "recent";

export interface SearchCategoryMeta {
  key: SearchCategoryKey;
  label: string;
  /** Display order: lower = higher up in results. */
  order: number;
  icon?: Component;
}

/**
 * A single indexed record fed into the search engine.
 * Providers produce these; scorers/renderers consume them.
 */
export interface SearchItem {
  /** Stable id across sessions – used for recents + dedupe. */
  id: string;
  /** Category bucket the item belongs to. */
  category: SearchCategoryKey;
  /** Primary display text (bolded, used for title match scoring). */
  title: string;
  /** Secondary text (lighter, used for subtitle-match scoring). */
  subtitle?: string;
  /** Long-form searchable body (not displayed in full, but indexed). */
  body?: string;
  /** Comma-separated or array of alternate search terms / aliases. */
  keywords?: string[];
  /** Icon component rendered beside the title. */
  icon?: Component;
  /** Small colored accent tag derived from the source (e.g. section accent). */
  accent?: string;
  /** Badge / label shown at the right (e.g. "Section", "Guide"). */
  badge?: string;
  /** Breadcrumb path shown below the title ("Foundations › Setup"). */
  breadcrumbs?: string[];
  /** Internal route path. */
  to?: string;
  /** External href — takes precedence over `to` when set. */
  href?: string;
  /** Provider-supplied score boost. Higher = ranks higher. */
  boost?: number;
  /** Arbitrary metadata a provider may want to hand back on click. */
  meta?: Record<string, unknown>;
}

/**
 * A search result: a SearchItem with scoring + match info attached.
 */
export interface SearchResult {
  item: SearchItem;
  score: number;
  /** Field where the strongest match occurred. */
  matchedField: "title" | "subtitle" | "body" | "keywords" | "breadcrumb";
  /** [start, end) char ranges in the title to highlight. */
  titleHighlights: [number, number][];
  /** [start, end) char ranges in the subtitle to highlight. */
  subtitleHighlights: [number, number][];
}

/**
 * Plugin contract. A provider exposes a list of searchable items.
 *
 * Two delivery models are supported so future providers can be sync
 * (static data) or async (remote/Algolia/full-text). The engine calls
 * exactly one of `items` or `query`:
 *
 *  - Static providers implement `items()` → indexed once, queried in-memory.
 *  - Dynamic providers implement `query(q)` → called per keystroke, results
 *    are merged with static results.
 */
export interface SearchProvider {
  /** Unique id – also used to namespace / dedupe items. */
  id: string;
  /** Human label (shown in debug UIs). */
  label: string;
  /** Default category key for items that don't specify their own. */
  defaultCategory: SearchCategoryKey;
  /** Relative priority 0-100. Higher = earlier in merged scoring. */
  priority?: number;
  /** Whether the provider is enabled at runtime. */
  enabled?: boolean;
  /** Static: return every indexed item (sync or promise). */
  items?: () => SearchItem[] | Promise<SearchItem[]>;
  /** Dynamic: return results for a query string. */
  query?: (q: string) => SearchResult[] | Promise<SearchResult[]>;
}

export interface SearchGroup {
  category: SearchCategoryMeta;
  results: SearchResult[];
}
