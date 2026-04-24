<template>
  <section :id="id" class="docs-section">
    <component :is="headingTag" class="docs-section__heading">
      <a :href="`#${id}`" class="docs-section__anchor" :aria-label="`Link to ${title}`">
        <span>{{ title }}</span>
      </a>
      <button
        type="button"
        class="docs-section__copy"
        :aria-label="copied ? 'Link copied' : 'Copy link to section'"
        @click="handleCopy"
      >
        <ClientOnly>
          <LucideCheck v-if="copied" :size="16" aria-hidden="true" />
          <LucideLink v-else :size="16" aria-hidden="true" />
          <template #fallback>
            <span class="docs-section__copy-placeholder" aria-hidden="true" />
          </template>
        </ClientOnly>
        <Transition name="docs-section__toast">
          <span v-if="copied" class="docs-section__toast" role="status">
            Link copied
          </span>
        </Transition>
      </button>
    </component>
    <p v-if="eyebrow" class="docs-section__eyebrow">{{ eyebrow }}</p>
    <div class="docs-section__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    id: string;
    title: string;
    level?: 2 | 3;
    eyebrow?: string;
  }>(),
  { level: 2, eyebrow: undefined },
);

const headingTag = computed(() => `h${props.level}`);

const { copy, copied } = useClipboard({ legacy: true, copiedDuring: 1600 });

const handleCopy = () => {
  if (!import.meta.client) return;
  const url = `${window.location.origin}${window.location.pathname}#${props.id}`;
  copy(url);
};
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
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
.docs-section__copy {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  width: 1.75rem;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm, 0.375rem);
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 160ms ease,
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}
.docs-section:hover .docs-section__copy,
.docs-section__copy:focus-visible,
.docs-section__copy[aria-label="Link copied"] {
  opacity: 1;
}
.docs-section__copy:hover {
  color: var(--primary);
  background: color-mix(in oklab, var(--primary) 10%, transparent);
  border-color: var(--border);
}
.docs-section__copy:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: var(--shadow-glow);
}
.docs-section__copy-placeholder {
  display: inline-block;
  height: 16px;
  width: 16px;
}
.docs-section__toast {
  position: absolute;
  top: calc(100% + 0.375rem);
  right: 0;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  padding: 0.25rem 0.5rem;
  background: var(--surface-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm, 0.375rem);
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
  pointer-events: none;
  z-index: 5;
}
.docs-section__toast-enter-active,
.docs-section__toast-leave-active {
  transition: opacity 140ms ease, transform 140ms ease;
}
.docs-section__toast-enter-from,
.docs-section__toast-leave-to {
  opacity: 0;
  transform: translateY(-2px);
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
