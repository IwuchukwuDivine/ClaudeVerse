<template>
  <section :id="id" class="docs-section">
    <component :is="headingTag" class="docs-section__heading">
      <a :href="`#${id}`" class="docs-section__anchor" :aria-label="`Link to ${title}`">
        <span>{{ title }}</span>
        <LucideLink :size="16" class="docs-section__link-icon" />
      </a>
    </component>
    <p v-if="eyebrow" class="docs-section__eyebrow">{{ eyebrow }}</p>
    <div class="docs-section__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string;
    title: string;
    level?: 2 | 3;
    eyebrow?: string;
  }>(),
  { level: 2 },
);

const headingTag = computed(() => `h${props.level}`);
</script>

<style scoped>
.docs-section {
  scroll-margin-top: 5rem;
  margin-top: 3rem;
}
.docs-section:first-child {
  margin-top: 0;
}
.docs-section__heading {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0 0 0.25rem;
  color: var(--text-primary);
}
h2.docs-section__heading {
  font-size: 1.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 1rem;
}
h3.docs-section__heading {
  font-size: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.docs-section__anchor {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
  text-decoration: none;
}
.docs-section__link-icon {
  opacity: 0;
  color: var(--primary);
  transition: opacity 160ms ease;
}
.docs-section__anchor:hover .docs-section__link-icon {
  opacity: 1;
}
.docs-section__eyebrow {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: -0.25rem 0 1rem;
}
.docs-section__body {
  color: var(--text-primary);
}
</style>
