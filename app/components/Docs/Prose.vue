<template>
  <div class="prose">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.prose {
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.7;
}
.prose :deep(p) {
  margin: 1rem 0;
  color: var(--text-secondary);
}
.prose :deep(p:first-child) {
  margin-top: 0;
}
.prose :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}
.prose :deep(em) {
  font-style: italic;
}
.prose :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed color-mix(in oklab, var(--primary) 50%, transparent);
  transition:
    color 160ms ease,
    border-color 160ms ease;
}
.prose :deep(a:hover) {
  color: var(--primary-hover);
  border-bottom-style: solid;
}
.prose :deep(ul),
.prose :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
}
.prose :deep(li) {
  margin: 0.375rem 0;
}
.prose :deep(li::marker) {
  color: var(--primary);
}
.prose :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  padding: 0.125rem 0.375rem;
  background: var(--code-inline-bg);
  color: var(--code-inline-text);
  border-radius: 0.25rem;
  font-weight: 500;
}
.prose :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin: 2rem 0;
}
.prose :deep(blockquote) {
  margin: 1.25rem 0;
  padding: 0.5rem 1rem;
  border-left: 3px solid var(--border);
  color: var(--text-muted);
  font-style: italic;
}
.prose :deep(table) {
  display: block;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-collapse: collapse;
  margin: 1.25rem 0;
  font-size: 0.9375rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.prose :deep(th),
.prose :deep(td) {
  padding: 0.625rem 0.875rem;
  text-align: left;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: top;
  overflow-wrap: anywhere;
}
.prose :deep(td code),
.prose :deep(th code) {
  word-break: break-word;
}
.prose :deep(th) {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.8125rem;
  color: var(--text-muted);
  background: var(--surface-sunken);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.prose :deep(tr:last-child td) {
  border-bottom: none;
}
.prose :deep(tbody tr:hover) {
  background: var(--surface-elevated);
}
.prose :deep(kbd) {
  font-family: var(--font-mono);
  font-size: 0.75em;
  padding: 0.125rem 0.375rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-bottom-width: 2px;
  border-radius: 0.25rem;
  color: var(--text-primary);
}
</style>
