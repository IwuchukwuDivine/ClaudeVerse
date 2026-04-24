<template>
  <div class="callout" :class="`callout--${variant}`">
    <span class="callout__icon">
      <ClientOnly>
        <LucideLightbulb v-if="variant === 'tip'" :size="16" />
        <LucideInfo v-else-if="variant === 'info'" :size="16" />
        <LucideTriangleAlert v-else-if="variant === 'warning'" :size="16" />
        <LucideOctagonAlert v-else-if="variant === 'danger'" :size="16" />
        <LucideCircleCheck v-else :size="16" />
        <template #fallback>
          <span class="h-4 w-4" />
        </template>
      </ClientOnly>
    </span>
    <div class="callout__body">
      <p v-if="title" class="callout__title">{{ title }}</p>
      <div class="callout__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Variant = "tip" | "info" | "warning" | "danger" | "success";

withDefaults(
  defineProps<{
    variant?: Variant;
    title?: string;
  }>(),
  { variant: "tip" },
);
</script>

<style scoped>
.callout {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  border: 1px solid var(--border);
  border-left-width: 3px;
  border-radius: var(--radius-md);
  background: var(--surface-elevated);
  margin: 1.25rem 0;
}
.callout__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 0.5rem;
}
.callout__body {
  flex: 1;
  min-width: 0;
}
.callout__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9375rem;
  margin: 0 0 0.25rem;
  color: var(--text-primary);
}
.callout__content {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
}
.callout__content :deep(p) {
  margin: 0.5rem 0;
}
.callout__content :deep(p:first-child) {
  margin-top: 0;
}
.callout__content :deep(p:last-child) {
  margin-bottom: 0;
}
.callout__content :deep(code) {
  font-size: 0.875em;
  padding: 0.125rem 0.375rem;
  background: var(--code-inline-bg);
  color: var(--code-inline-text);
  border-radius: 0.25rem;
}

.callout--tip {
  border-left-color: var(--primary);
}
.callout--tip .callout__icon {
  background: var(--primary-subtle);
  color: var(--primary-active);
}
.dark .callout--tip .callout__icon {
  color: var(--primary);
}
.callout--info {
  border-left-color: var(--info);
}
.callout--info .callout__icon {
  background: var(--accent-extensions-wash);
  color: var(--info);
}
.callout--warning {
  border-left-color: var(--warning);
}
.callout--warning .callout__icon {
  background: var(--accent-tokens-wash);
  color: var(--warning);
}
.callout--danger {
  border-left-color: var(--danger);
}
.callout--danger .callout__icon {
  background: var(--accent-workshops-wash);
  color: var(--danger);
}
.callout--success {
  border-left-color: var(--success);
}
.callout--success .callout__icon {
  background: var(--accent-resources-wash);
  color: var(--success);
}
</style>
