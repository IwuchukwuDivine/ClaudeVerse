<template>
  <div class="code-block">
    <div v-if="title || language" class="code-block__header">
      <span class="code-block__title">{{ title || language }}</span>
      <button
        type="button"
        class="code-block__copy"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="handleCopy"
      >
        <ClientOnly>
          <LucideCheck v-if="copied" :size="14" />
          <LucideCopy v-else :size="14" />
          <template #fallback>
            <span class="h-[14px] w-[14px]" />
          </template>
        </ClientOnly>
        <span>{{ copied ? "Copied" : "Copy" }}</span>
      </button>
    </div>
    <pre class="code-block__pre"><code ref="codeRef" class="code-block__code"><slot>{{ code }}</slot></code></pre>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const props = defineProps<{
  code?: string;
  title?: string;
  language?: string;
}>();

const codeRef = ref<HTMLElement | null>(null);
const { copy, copied } = useClipboard({ legacy: true });

const handleCopy = () => {
  const text = props.code ?? codeRef.value?.textContent ?? "";
  copy(text);
};
</script>

<style scoped>
.code-block {
  margin: 1.25rem 0;
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.875rem;
  background: color-mix(in oklab, var(--code-bg) 85%, white 15%);
  border-bottom: 1px solid var(--code-border);
}
.code-block__title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: lowercase;
}
.code-block__copy {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    color 160ms ease,
    background 160ms ease;
}
.code-block__copy:hover {
  color: #f5f0e8;
  background: rgba(255, 255, 255, 0.05);
}
.code-block__pre {
  margin: 0;
  padding: 1rem 1.125rem;
  overflow-x: auto;
  line-height: 1.6;
}
.code-block__code {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--code-text);
  white-space: pre;
}
</style>
