import { FileText, Heading } from "@lucide/vue";
import type { SearchItem, SearchProvider } from "~/utils/types/search";
import { sections } from "~/utils/sections";
import type { AccentKey, NavSection } from "~/utils/types/nav";

/**
 * Indexes the actual content body — one entry per H1 (page) plus one entry
 * per H2/H3 heading with its surrounding prose.
 *
 * Uses @nuxt/content's `queryCollectionSearchSections`, which walks every
 * markdown doc's AST, splits it by heading, and returns `{ id, title, titles,
 * content, level }`. That's exactly the shape we want for heading-level hits
 * (so searching for a word buried inside `workshops.md` jumps right to the
 * anchor instead of just the section root).
 */
const buildItems = async (): Promise<SearchItem[]> => {
  // `queryCollectionSearchSections` is auto-imported by @nuxt/content.
  const rawSections = await queryCollectionSearchSections("docs", {
    ignoredTags: ["style", "script"],
  });

  const sectionByPath = new Map<string, NavSection>();
  for (const s of sections) sectionByPath.set(s.path, s);

  const accentForPath = (path: string): AccentKey | undefined => {
    const base = path.split("#")[0] ?? path;
    return sectionByPath.get(base)?.accent;
  };

  const labelForPath = (path: string): string | undefined => {
    const base = path.split("#")[0] ?? path;
    return sectionByPath.get(base)?.title;
  };

  return rawSections.map((sec) => {
    const isPageRoot = sec.level === 1 || !sec.id.includes("#");
    const [base] = sec.id.split("#");
    const sectionLabel = labelForPath(sec.id) ?? sec.titles?.[0] ?? "Guide";

    return {
      id: `content:${sec.id}`,
      category: isPageRoot ? "page" : "heading",
      title: sec.title,
      subtitle: isPageRoot
        ? sectionLabel
        : (sec.titles ?? []).filter(Boolean).join(" › ") || sectionLabel,
      body: sec.content ?? "",
      icon: isPageRoot ? FileText : Heading,
      accent: accentForPath(base ?? ""),
      badge: isPageRoot ? "Page" : "Heading",
      breadcrumbs:
        !isPageRoot && sec.titles?.length
          ? sec.titles.filter(Boolean)
          : undefined,
      to: sec.id,
      boost: isPageRoot ? 15 : 5,
    } satisfies SearchItem;
  });
};

const contentProvider: SearchProvider = {
  id: "content",
  label: "Guide content",
  defaultCategory: "page",
  priority: 80,
  enabled: true,
  items: buildItems,
};

export default contentProvider;
