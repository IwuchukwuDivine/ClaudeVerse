<template>
  <header class="page-header" :class="`page-header--${accent}`">
    <div class="page-header__breadcrumb">
      <NuxtLink to="/" class="page-header__crumb">Claudeverse</NuxtLink>
      <LucideChevronRight :size="12" aria-hidden="true" />
      <span aria-current="page">{{ title }}</span>
    </div>
    <div class="page-header__top">
      <div v-if="icon" class="page-header__icon" aria-hidden="true">
        <component :is="icon" :size="22" />
      </div>
      <div class="page-header__meta">
        <p v-if="eyebrow" class="page-header__eyebrow">{{ eyebrow }}</p>
        <h1 class="page-header__title">{{ title }}</h1>
      </div>
    </div>
    <p v-if="description" class="page-header__description">{{ description }}</p>
    <div
      v-if="estReadTime || formattedLastUpdated"
      class="page-header__info"
    >
      <span v-if="estReadTime" class="page-header__info-item">
        <LucideClock :size="13" aria-hidden="true" />
        <span>{{ estReadTime }} read</span>
      </span>
      <span
        v-if="formattedLastUpdated"
        class="page-header__info-item"
        :title="`Last updated ${props.lastUpdated}`"
      >
        <LucideHistory :size="13" aria-hidden="true" />
        <span>Updated {{ formattedLastUpdated }}</span>
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { AccentKey } from "~/utils/types/nav";

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    eyebrow?: string;
    icon?: Component | string;
    accent?: AccentKey;
    estReadTime?: string;
    lastUpdated?: string;
  }>(),
  { accent: "home" },
);

const formattedLastUpdated = computed(() => {
  if (!props.lastUpdated) return null;
  const d = new Date(props.lastUpdated);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});
</script>

<style scoped>
.page-header {
  position: relative;
  padding: 2rem 0 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-subtle);
}
.page-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: -2rem;
  right: -2rem;
  height: 60%;
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--accent, var(--primary)) 8%, transparent) 0%,
    transparent 100%
  );
  pointer-events: none;
  z-index: -1;
  border-radius: var(--radius-lg);
}
.page-header--home {
  --accent: var(--accent-home);
}
.page-header--foundations {
  --accent: var(--accent-foundations);
}
.page-header--workflows {
  --accent: var(--accent-workflows);
}
.page-header--extensions {
  --accent: var(--accent-extensions);
}
.page-header--tokens {
  --accent: var(--accent-tokens);
}
.page-header--orchestration {
  --accent: var(--accent-orchestration);
}
.page-header--evals {
  --accent: var(--accent-evals);
}
.page-header--recipes {
  --accent: var(--accent-recipes);
}
.page-header--troubleshooting {
  --accent: var(--accent-troubleshooting);
}
.page-header--resources {
  --accent: var(--accent-resources);
}
.page-header--workshops {
  --accent: var(--accent-workshops);
}
.page-header--cheatsheet {
  --accent: var(--accent-cheatsheet);
}

.page-header__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}
.page-header__crumb {
  color: inherit;
  text-decoration: none;
}
.page-header__crumb:hover {
  color: var(--text-primary);
}
.page-header__top {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.page-header__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  border-radius: var(--radius-lg);
  background: color-mix(in oklab, var(--accent) 14%, var(--surface));
  color: var(--accent);
}
.page-header__eyebrow {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--accent);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.page-header__title {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0;
  color: var(--text-primary);
}
.page-header__description {
  max-width: 55ch;
  font-size: 1.0625rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0.75rem 0 0;
}
.page-header__info {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}
.page-header__info-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
.page-header__info-item + .page-header__info-item {
  padding-left: 1rem;
  border-left: 1px solid var(--border-subtle);
}
</style>
