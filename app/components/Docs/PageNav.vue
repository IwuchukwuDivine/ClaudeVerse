<template>
  <nav class="page-nav" aria-label="Previous and next page">
    <NuxtLink v-if="prev" :to="prev.path" class="page-nav__link page-nav__link--prev">
      <span class="page-nav__dir">
        <LucideArrowLeft :size="14" />
        <span>Previous</span>
      </span>
      <span class="page-nav__title">{{ prev.title }}</span>
    </NuxtLink>
    <span v-else />
    <NuxtLink v-if="next" :to="next.path" class="page-nav__link page-nav__link--next">
      <span class="page-nav__dir">
        <span>Next</span>
        <LucideArrowRight :size="14" />
      </span>
      <span class="page-nav__title">{{ next.title }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  prev?: { title: string; path: string };
  next?: { title: string; path: string };
}>();
</script>

<style scoped>
.page-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
}
.page-nav__link {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1rem 1.25rem;
  text-decoration: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition:
    border-color 160ms ease,
    background 160ms ease;
}
.page-nav__link:hover {
  border-color: var(--primary);
  background: var(--surface-elevated);
}
.page-nav__link--next {
  text-align: right;
  align-items: flex-end;
}
.page-nav__dir {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.page-nav__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
}
@media (max-width: 640px) {
  .page-nav {
    grid-template-columns: 1fr;
  }
}
</style>
