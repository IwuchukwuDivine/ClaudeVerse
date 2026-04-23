import type { SearchProvider } from "~/utils/types/search";
import sectionsProvider from "./providers/sectionsProvider";

/**
 * Global, mutable provider registry.
 *
 * Usage:
 *   import { registerSearchProvider } from "~/utils/search/registry"
 *   registerSearchProvider({ id: "glossary", ... })
 *
 * Providers registered at runtime (e.g. from a plugin or a page) become
 * available to every open instance of the search dialog.
 */
const providers = new Map<string, SearchProvider>();

/** Register (or replace) a provider by id. */
export const registerSearchProvider = (provider: SearchProvider): void => {
  providers.set(provider.id, { enabled: true, priority: 50, ...provider });
};

/** Remove a provider by id. */
export const unregisterSearchProvider = (id: string): void => {
  providers.delete(id);
};

/** Read-only view of all enabled providers, sorted by descending priority. */
export const listSearchProviders = (): SearchProvider[] =>
  [...providers.values()]
    .filter((p) => p.enabled !== false)
    .sort((a, b) => (b.priority ?? 50) - (a.priority ?? 50));

// -----------------------------------------------------------------------------
// Default registrations. Adding a new source later = one extra line here.
// -----------------------------------------------------------------------------
registerSearchProvider(sectionsProvider);
