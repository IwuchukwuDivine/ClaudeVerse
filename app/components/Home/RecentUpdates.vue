<template>
  <section v-if="entries.length" id="recently-shipped" class="recent anchored">
    <header class="section-heading recent__heading">
      <div>
        <h2 class="section-heading__title">Recently shipped</h2>
        <p class="section-heading__subtitle">
          What's changed on Claudeverse lately — the last
          {{ entries.length }} updates, straight from git.
        </p>
      </div>
      <NuxtLink to="/changelog" class="recent__all">
        Full changelog
        <LucideArrowRight :size="14" aria-hidden="true" />
      </NuxtLink>
    </header>

    <ul class="recent__list">
      <li v-for="entry in entries" :key="entry.hash" class="recent__item">
        <NuxtLink
          :to="`/changelog#${entry.date.slice(0, 7)}`"
          class="recent__link"
        >
          <span
            class="recent__label"
            :data-variant="variantFor(entry.label)"
            >{{ entry.label ?? "Update" }}</span
          >
          <span class="recent__summary">
            <template v-if="entry.scope"
              ><em class="recent__scope">{{ entry.scope }}</em>
              —
            </template>
            {{ entry.summary
            }}<span v-if="entry.breaking" class="recent__breaking">⚠</span>
          </span>
          <time class="recent__date" :datetime="entry.date">{{
            formatDate(entry.date)
          }}</time>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import summary from "~/utils/changelog-summary.json";

const MAX_ENTRIES = 5;

type Entry = (typeof summary.recent)[number];

const entries = computed<Entry[]>(() => summary.recent.slice(0, MAX_ENTRIES));

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${MONTHS_SHORT[Number(m) - 1]} ${Number(d)}, ${y}`;
};

const VARIANTS: Record<string, string> = {
  New: "new",
  Fix: "fix",
  Performance: "perf",
  Refactor: "refactor",
  Docs: "docs",
  Style: "style",
  Tests: "test",
  Build: "build",
  CI: "ci",
  Chore: "chore",
  Revert: "revert",
};

const variantFor = (label: string | null) =>
  (label && VARIANTS[label]) ?? "default";
</script>

<style scoped>
.recent {
  margin-bottom: 3rem;
}
.recent__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.recent__all {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--surface);
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
  white-space: nowrap;
}
.recent__all:hover {
  background: var(--surface-elevated);
  color: var(--text-primary);
  border-color: var(--border-strong, var(--border));
}
.recent__list {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  overflow: hidden;
}
.recent__item + .recent__item {
  border-top: 1px solid var(--border-subtle);
}
.recent__link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.125rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: background 160ms ease;
}
.recent__link:hover {
  background: var(--surface-elevated);
}
.recent__label {
  display: inline-flex;
  align-items: center;
  min-width: 5.5rem;
  justify-content: center;
  padding: 0.1875rem 0.5rem;
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--surface-elevated);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}
.recent__label[data-variant="new"] {
  background: color-mix(in oklab, var(--primary) 12%, transparent);
  color: var(--primary-active);
  border-color: var(--primary-border);
}
.dark .recent__label[data-variant="new"] {
  color: var(--primary);
}
.recent__label[data-variant="fix"] {
  background: color-mix(in oklab, var(--accent-extensions, #f59e0b) 12%, transparent);
  color: var(--accent-extensions, #b45309);
  border-color: color-mix(in oklab, var(--accent-extensions, #f59e0b) 30%, transparent);
}
.recent__label[data-variant="perf"] {
  background: color-mix(in oklab, var(--accent-tokens, #8b5cf6) 12%, transparent);
  color: var(--accent-tokens, #6d28d9);
  border-color: color-mix(in oklab, var(--accent-tokens, #8b5cf6) 30%, transparent);
}
.recent__label[data-variant="docs"] {
  background: color-mix(in oklab, var(--accent-foundations, #06b6d4) 12%, transparent);
  color: var(--accent-foundations, #0e7490);
  border-color: color-mix(in oklab, var(--accent-foundations, #06b6d4) 30%, transparent);
}
.recent__summary {
  color: var(--text-primary);
  font-size: 0.9375rem;
  line-height: 1.4;
  min-width: 0;
}
.recent__scope {
  color: var(--text-muted);
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}
.recent__breaking {
  margin-left: 0.25rem;
  color: var(--accent-extensions, #dc2626);
}
.recent__date {
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .recent__link {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    row-gap: 0.375rem;
    column-gap: 0.625rem;
  }
  .recent__date {
    grid-column: 2;
    grid-row: 2;
    font-size: 0.75rem;
  }
  .recent__summary {
    grid-column: 2;
    grid-row: 1;
    font-size: 0.875rem;
  }
  .recent__label {
    grid-row: 1 / span 2;
    align-self: start;
    min-width: 4.5rem;
  }
}
</style>
