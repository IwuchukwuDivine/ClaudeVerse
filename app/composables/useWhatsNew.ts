import summary from "~/utils/changelog-summary.json";

const STORAGE_KEY = "claudeverse:changelog:lastSeen";

/**
 * Tracks whether the current visitor has seen the latest changelog entry.
 *
 * - Reads the latest changelog date from the build-time summary JSON.
 * - Compares against a `lastSeen` date in `localStorage`.
 * - First-time visitors are seeded with the latest date so they don't see a
 *   stale "unread" indicator for history that predates their arrival.
 * - Auto-marks as seen when the user navigates to `/changelog`.
 *
 * SSR-safe: `hasUnread` is always `false` during server render and during the
 * initial client render; it only transitions to `true` after hydration once
 * `localStorage` has been consulted.
 */
export function useWhatsNew() {
  const latestDate: string | null = summary.latestDate ?? null;
  const lastSeen = useState<string | null>(
    "changelog:lastSeen",
    () => null,
  );
  const mounted = useState<boolean>("changelog:mounted", () => false);

  const hasUnread = computed(() => {
    if (!latestDate || !mounted.value) return false;
    if (!lastSeen.value) return false;
    return lastSeen.value < latestDate;
  });

  const markSeen = () => {
    if (!latestDate || !import.meta.client) return;
    localStorage.setItem(STORAGE_KEY, latestDate);
    lastSeen.value = latestDate;
  };

  onMounted(() => {
    if (!import.meta.client) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null && latestDate) {
      localStorage.setItem(STORAGE_KEY, latestDate);
      lastSeen.value = latestDate;
    } else {
      lastSeen.value = stored;
    }
    mounted.value = true;
  });

  const route = useRoute();
  watch(
    () => route.path,
    (path) => {
      if (path === "/changelog") markSeen();
    },
    { immediate: true },
  );

  return {
    hasUnread,
    markSeen,
    latestDate,
    summary,
  };
}
