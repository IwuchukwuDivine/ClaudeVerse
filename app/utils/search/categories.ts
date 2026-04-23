import {
  BookOpen,
  Clock,
  FileText,
  Hash,
  Heading,
  LifeBuoy,
  Link as LinkIcon,
  Terminal,
} from "@lucide/vue";
import type {
  SearchCategoryKey,
  SearchCategoryMeta,
} from "~/utils/types/search";

/**
 * Ordered list of categories the UI groups results by.
 * Add new entries here when introducing new providers.
 */
export const categories: Record<SearchCategoryKey, SearchCategoryMeta> = {
  section: { key: "section", label: "Sections", order: 10, icon: BookOpen },
  topic: { key: "topic", label: "Topics", order: 20, icon: Hash },
  page: { key: "page", label: "Pages", order: 30, icon: FileText },
  heading: { key: "heading", label: "Headings", order: 40, icon: Heading },
  command: { key: "command", label: "Commands", order: 50, icon: Terminal },
  external: { key: "external", label: "External", order: 60, icon: LinkIcon },
  recent: { key: "recent", label: "Recent", order: 0, icon: Clock },
};

export const fallbackCategory: SearchCategoryMeta = {
  key: "topic",
  label: "Results",
  order: 100,
  icon: LifeBuoy,
};

export const getCategoryMeta = (
  key: SearchCategoryKey,
): SearchCategoryMeta => categories[key] ?? fallbackCategory;
