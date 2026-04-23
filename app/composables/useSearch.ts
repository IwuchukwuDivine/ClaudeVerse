import type {
  SearchGroup,
  SearchItem,
  SearchResult,
} from "~/utils/types/search";
import { getCategoryMeta } from "~/utils/search/categories";
import { listSearchProviders } from "~/utils/search/registry";
import scoreItem from "~/utils/search/scoreMatch";

const MAX_RECENTS = 6;
const MAX_PER_GROUP = 6;
const MAX_TOTAL = 30;
const DEBOUNCE_MS = 80;
const RECENTS_STORAGE_KEY = "claudeverse-search-recents";

/**
 * Global, app-wide search engine state. Any component that calls
 * `useSearch()` gets the same reactive state instance (via `useState`),
 * so the navbar trigger and the mounted dialog stay in sync.
 */
export const useSearch = () => {
  const isOpen = useState<boolean>("search-open", () => false);
  const query = useState<string>("search-query", () => "");
  const debouncedQuery = useState<string>("search-debounced", () => "");
  const staticItems = useState<SearchItem[]>("search-static-items", () => []);
  const dynamicResults = useState<SearchResult[]>(
    "search-dynamic-results",
    () => [],
  );
  const loading = useState<boolean>("search-loading", () => false);
  const activeIndex = useState<number>("search-active-index", () => 0);
  const recents = useState<SearchItem[]>("search-recents", () => []);
  const indexLoaded = useState<boolean>("search-index-loaded", () => false);

  let debounceHandle: ReturnType<typeof setTimeout> | null = null;
  let dynamicRequestId = 0;

  // ---- Index management ---------------------------------------------------

  const loadIndex = async () => {
    if (indexLoaded.value) return;
    const providers = listSearchProviders();
    const collected: SearchItem[] = [];
    await Promise.all(
      providers.map(async (p) => {
        if (!p.items) return;
        try {
          const batch = await p.items();
          for (const item of batch) {
            collected.push({ ...item, category: item.category ?? p.defaultCategory });
          }
        } catch (err) {
          console.warn(`[search] provider ${p.id} items() failed`, err);
        }
      }),
    );
    staticItems.value = collected;
    indexLoaded.value = true;
  };

  // ---- Search execution ---------------------------------------------------

  const runStaticSearch = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    const out: SearchResult[] = [];
    for (const item of staticItems.value) {
      const r = scoreItem(item, q);
      if (r) out.push(r);
    }
    return out;
  };

  const runDynamicSearch = async (q: string) => {
    const providers = listSearchProviders().filter((p) => p.query);
    if (!providers.length) {
      dynamicResults.value = [];
      return;
    }
    const myId = ++dynamicRequestId;
    loading.value = true;
    try {
      const batches = await Promise.all(
        providers.map(async (p) => {
          try {
            return (await p.query!(q)) ?? [];
          } catch (err) {
            console.warn(`[search] provider ${p.id} query() failed`, err);
            return [];
          }
        }),
      );
      // Ignore stale requests
      if (myId !== dynamicRequestId) return;
      dynamicResults.value = batches.flat();
    } finally {
      if (myId === dynamicRequestId) loading.value = false;
    }
  };

  const allResults = computed<SearchResult[]>(() => {
    const merged = [...runStaticSearch(debouncedQuery.value), ...dynamicResults.value];
    // Dedupe by item id, keep highest score
    const byId = new Map<string, SearchResult>();
    for (const r of merged) {
      const existing = byId.get(r.item.id);
      if (!existing || r.score > existing.score) byId.set(r.item.id, r);
    }
    return [...byId.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_TOTAL);
  });

  const groups = computed<SearchGroup[]>(() => {
    const bucket = new Map<string, SearchResult[]>();
    for (const r of allResults.value) {
      const key = r.item.category;
      if (!bucket.has(key)) bucket.set(key, []);
      bucket.get(key)!.push(r);
    }
    return [...bucket.entries()]
      .map(([key, results]) => ({
        category: getCategoryMeta(key as SearchItem["category"]),
        results: results.slice(0, MAX_PER_GROUP),
      }))
      .sort((a, b) => a.category.order - b.category.order);
  });

  /** Flat list used for arrow-key navigation. */
  const flatResults = computed<SearchResult[]>(() =>
    groups.value.flatMap((g) => g.results),
  );

  // ---- Debounced query watcher -------------------------------------------

  watch(query, (q) => {
    if (debounceHandle) clearTimeout(debounceHandle);
    debounceHandle = setTimeout(() => {
      debouncedQuery.value = q;
      runDynamicSearch(q);
    }, DEBOUNCE_MS);
  });

  watch(allResults, () => {
    // Reset highlighted row whenever result set changes
    activeIndex.value = 0;
  });

  // ---- Recents ------------------------------------------------------------

  const loadRecents = () => {
    if (!import.meta.client) return;
    try {
      const raw = localStorage.getItem(RECENTS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SearchItem[];
      if (Array.isArray(parsed)) recents.value = parsed.slice(0, MAX_RECENTS);
    } catch {
      // ignore corrupt payload
    }
  };

  const persistRecents = () => {
    if (!import.meta.client) return;
    try {
      localStorage.setItem(
        RECENTS_STORAGE_KEY,
        JSON.stringify(recents.value.slice(0, MAX_RECENTS)),
      );
    } catch {
      // quota errors etc. — safe to ignore
    }
  };

  const rememberRecent = (item: SearchItem) => {
    const stripped: SearchItem = {
      id: item.id,
      category: item.category,
      title: item.title,
      subtitle: item.subtitle,
      accent: item.accent,
      badge: item.badge,
      breadcrumbs: item.breadcrumbs,
      to: item.to,
      href: item.href,
    };
    const next = [stripped, ...recents.value.filter((r) => r.id !== item.id)];
    recents.value = next.slice(0, MAX_RECENTS);
    persistRecents();
  };

  const clearRecents = () => {
    recents.value = [];
    persistRecents();
  };

  // ---- Navigation --------------------------------------------------------

  const moveActive = (delta: number) => {
    const list = flatResults.value.length
      ? flatResults.value
      : recents.value;
    if (!list.length) return;
    const len = list.length;
    activeIndex.value = (activeIndex.value + delta + len) % len;
  };

  const activate = async () => {
    const list = debouncedQuery.value
      ? flatResults.value.map((r) => r.item)
      : recents.value;
    const item = list[activeIndex.value];
    if (!item) return;
    await select(item);
  };

  const select = async (item: SearchItem) => {
    rememberRecent(item);
    close();
    if (item.href) {
      if (import.meta.client) {
        window.open(item.href, "_blank", "noopener");
      }
      return;
    }
    if (item.to) {
      await navigateTo(item.to);
    }
  };

  // ---- Open/close --------------------------------------------------------

  const open = async () => {
    isOpen.value = true;
    await loadIndex();
    loadRecents();
  };

  const close = () => {
    isOpen.value = false;
    query.value = "";
    debouncedQuery.value = "";
    activeIndex.value = 0;
  };

  const toggle = () => (isOpen.value ? close() : open());

  return {
    // state
    isOpen,
    query,
    debouncedQuery,
    loading,
    activeIndex,
    recents,
    groups,
    flatResults,
    // actions
    open,
    close,
    toggle,
    select,
    moveActive,
    activate,
    clearRecents,
    loadIndex,
  };
};
