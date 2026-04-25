import type { Component } from "vue";
import {
  BookOpen,
  ChefHat,
  Coins,
  FlaskConical,
  GraduationCap,
  History,
  Keyboard,
  LifeBuoy,
  Map,
  Microscope,
  Network,
  Puzzle,
  Zap,
} from "@lucide/vue";

/**
 * Resolve a Lucide icon component by name.
 *
 * Accepts either the raw Pascal name ("Zap") or the "Lucide"-prefixed
 * form used in content frontmatter ("LucideZap"). Returns `undefined`
 * if no matching icon exists — callers should provide their own fallback.
 *
 * We maintain an explicit allow-list (rather than `import * as LucideIcons`)
 * so tree-shaking actually works — the namespace import would pull the entire
 * Lucide catalog into the client bundle. When adding a new `icon:` to any
 * content frontmatter, add it here too.
 */
const ICON_REGISTRY: Record<string, Component> = {
  BookOpen,
  ChefHat,
  Coins,
  FlaskConical,
  GraduationCap,
  History,
  Keyboard,
  LifeBuoy,
  Map,
  Microscope,
  Network,
  Puzzle,
  Zap,
};

export function resolveLucideIcon(name?: string | null): Component | undefined {
  if (!name) return undefined;
  if (ICON_REGISTRY[name]) return ICON_REGISTRY[name];
  if (name.startsWith("Lucide")) {
    const stripped = name.slice("Lucide".length);
    if (ICON_REGISTRY[stripped]) return ICON_REGISTRY[stripped];
  }
  return undefined;
}
