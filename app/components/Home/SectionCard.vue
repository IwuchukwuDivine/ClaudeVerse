<template>
  <NuxtLink :to="section.path" class="card" :class="`card--${section.accent}`">
    <div class="card__header">
      <span class="card__icon">
        <ClientOnly>
          <component :is="section.icon" :size="20" />
          <template #fallback>
            <span class="h-5 w-5" />
          </template>
        </ClientOnly>
      </span>
      <span class="card__meta">
        <span class="card__eyebrow">{{ section.tagline }}</span>
        <span v-if="section.estReadTime" class="card__time">
          <LucideClock :size="11" />
          {{ section.estReadTime }}
        </span>
      </span>
    </div>

    <h3 class="card__title">{{ section.title }}</h3>
    <p class="card__description">{{ section.description }}</p>

    <div class="card__footer">
      <span class="card__cta">
        <span>Explore</span>
        <LucideArrowRight :size="14" />
      </span>
      <span v-if="section.children" class="card__count">
        {{ section.children.length }} topics
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NavSection } from "~/utils/types/nav";

defineProps<{ section: NavSection }>();
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--border);
  text-decoration: none;
  color: var(--text-primary);
  overflow: hidden;
  transition:
    border-color 200ms ease,
    transform 200ms ease,
    box-shadow 200ms ease;
}
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent, var(--primary));
  opacity: 0.5;
  transition: opacity 200ms ease;
}
.card::after {
  content: "";
  position: absolute;
  top: -40%;
  right: -40%;
  height: 12rem;
  width: 12rem;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--accent, var(--primary)) 14%, transparent) 0%,
    transparent 70%
  );
  pointer-events: none;
  opacity: 0.6;
  transition: opacity 200ms ease;
}
.card:hover {
  transform: translateY(-2px);
  border-color: var(--accent, var(--primary));
  box-shadow: var(--shadow-md);
}
.card:hover::before,
.card:hover::after {
  opacity: 1;
}

.card--home {
  --accent: var(--accent-home);
}
.card--foundations {
  --accent: var(--accent-foundations);
}
.card--workflows {
  --accent: var(--accent-workflows);
}
.card--extensions {
  --accent: var(--accent-extensions);
}
.card--tokens {
  --accent: var(--accent-tokens);
}
.card--orchestration {
  --accent: var(--accent-orchestration);
}
.card--resources {
  --accent: var(--accent-resources);
}
.card--teach {
  --accent: var(--accent-teach);
}
.card--cheatsheet {
  --accent: var(--accent-cheatsheet);
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}
.card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.25rem;
  width: 2.25rem;
  border-radius: var(--radius-md);
  background: color-mix(in oklab, var(--accent) 16%, var(--surface));
  color: var(--accent);
}
.card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}
.card__eyebrow {
  font-family: var(--font-display);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
}
.card__time {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  color: var(--text-muted);
}
.card__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
  position: relative;
  z-index: 1;
}
.card__description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  flex: 1;
  position: relative;
  z-index: 1;
}
.card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border-subtle);
  position: relative;
  z-index: 1;
}
.card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--accent);
  font-size: 0.875rem;
  font-weight: 500;
  transition: gap 160ms ease;
}
.card:hover .card__cta {
  gap: 0.625rem;
}
.card__count {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
