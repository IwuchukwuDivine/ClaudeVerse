import * as LucideIcons from "@lucide/vue";
import type { Component } from "vue";

/**
 * Resolve a Lucide icon component by name.
 *
 * Accepts either the raw Pascal name ("Zap") or the "Lucide"-prefixed
 * form used in content frontmatter ("LucideZap"). Returns `undefined`
 * if no matching icon exists — callers should provide their own fallback.
 *
 * This exists because `nuxt-lucide-icons` only auto-registers icons
 * that appear as literal <LucideXxx /> tags in templates; icons referenced
 * only by string in content/frontmatter aren't picked up by the scanner,
 * so `resolveComponent(name)` fails at runtime. Importing from @lucide/vue
 * directly side-steps the registry entirely.
 */
export function resolveLucideIcon(name?: string | null): Component | undefined {
  if (!name) return undefined;
  const registry = LucideIcons as unknown as Record<string, Component>;
  if (registry[name]) return registry[name];
  if (name.startsWith("Lucide")) {
    const stripped = name.slice("Lucide".length);
    if (registry[stripped]) return registry[stripped];
  }
  return undefined;
}
