<template>
  <div class="coming-soon">
    <div class="coming-soon__icon">
      <LucideHardHat :size="28" />
    </div>
    <h3 class="coming-soon__title">This section is being built</h3>
    <p class="coming-soon__body">
      The shell and structure are in place. Content for this section is next up.
      Peek at <NuxtLink to="/foundations">Foundations</NuxtLink> to see the
      format the rest of Claudeverse will follow.
    </p>
    <div v-if="topics?.length" class="coming-soon__topics">
      <span class="coming-soon__label">Coming in this section</span>
      <ul>
        <li v-for="t in topics" :key="t">
          <LucideCircle :size="8" />
          <span>{{ t }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ topics?: string[] }>();
</script>

<style scoped>
.coming-soon {
  padding: 2rem 1.5rem;
  background: var(--surface);
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-lg);
  text-align: center;
  max-width: 40rem;
  margin: 2rem auto 0;
}
.coming-soon__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3.5rem;
  width: 3.5rem;
  border-radius: var(--radius-lg);
  background: var(--primary-subtle);
  color: var(--primary-active);
  margin-bottom: 1rem;
}
.dark .coming-soon__icon {
  color: var(--primary);
}
.coming-soon__title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}
.coming-soon__body {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.55;
  margin: 0 0 1.5rem;
}
.coming-soon__body :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed;
}
.coming-soon__topics {
  text-align: left;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-subtle);
}
.coming-soon__label {
  display: block;
  font-family: var(--font-display);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}
.coming-soon__topics ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 0.375rem;
}
.coming-soon__topics li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
.coming-soon__topics li :deep(svg) {
  color: var(--primary);
  flex-shrink: 0;
}
</style>
