import { BookOpen, Hash } from "@lucide/vue";
import type { SearchItem, SearchProvider } from "~/utils/types/search";
import { sections } from "~/utils/sections";

/**
 * Flattens the nav tree into searchable records.
 * Emits two kinds of items:
 *   - Top-level "section" entries (one per nav section)
 *   - Nested "topic" entries (one per child anchor)
 *
 * Section title + tagline + description + children titles feed the body
 * so searches like "context window" still surface the parent section
 * even if you never hit the exact child title.
 */
const buildItems = (): SearchItem[] => {
  const items: SearchItem[] = [];

  for (const section of sections) {
    const childTitles = (section.children ?? [])
      .map((c) => c.title)
      .join(" ");

    items.push({
      id: `section:${section.slug}`,
      category: "section",
      title: section.title,
      subtitle: section.tagline,
      body: `${section.description} ${childTitles}`,
      keywords: [section.slug, section.accent],
      icon: typeof section.icon === "string" ? BookOpen : section.icon,
      accent: section.accent,
      badge: "Section",
      to: section.path,
      // Surface top-level sections above their children by default.
      boost: 25,
      meta: {
        estReadTime: section.estReadTime,
      },
    });

    for (const child of section.children ?? []) {
      items.push({
        id: `topic:${section.slug}:${child.path}`,
        category: "topic",
        title: child.title,
        subtitle: section.title,
        body: section.description,
        icon: Hash,
        accent: section.accent,
        badge: section.title,
        breadcrumbs: [section.title],
        to: child.path,
      });
    }
  }

  return items;
};

const sectionsProvider: SearchProvider = {
  id: "sections",
  label: "Guide sections",
  defaultCategory: "section",
  priority: 100,
  enabled: true,
  items: buildItems,
};

export default sectionsProvider;

// Re-export for consumers that want the icon fallback
export const sectionsFallbackIcon = BookOpen;
