<template>
  <aside v-if="items.length" class="toc" aria-label="On this page">
    <p class="toc__label">On this page</p>
    <ul class="toc__list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="{ 'toc__item--h3': item.level === 3 }"
      >
        <a
          :href="`#${item.id}`"
          class="toc__link"
          :class="{ 'toc__link--active': activeId === item.id }"
          @click="setActive(item.id)"
        >
          {{ item.title }}
        </a>
      </li>
    </ul>

    <div class="toc__divider" />

    <div class="toc__actions">
      <button type="button" class="toc__action" @click="scrollTop">
        <LucideArrowUp :size="13" />
        <span>Back to top</span>
      </button>
      <a
        href="https://github.com/IwuchukwuDivine/ClaudeVerse"
        target="_blank"
        rel="noopener"
        class="toc__action"
      >
        <IconGithub :size="13" />
        <span>Edit on GitHub</span>
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";

const { items, activeId, setActive } = useToc();

const observer = ref<(() => void) | null>(null);

const setupObserver = () => {
  if (observer.value) observer.value();

  const targets: HTMLElement[] = [];
  items.value.forEach((i) => {
    const el = document.getElementById(i.id);
    if (el) targets.push(el);
  });

  if (!targets.length) return;

  const { stop } = useIntersectionObserver(
    targets,
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length && visible[0]?.target.id) {
        activeId.value = visible[0].target.id;
      }
    },
    { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
  );

  observer.value = stop;
};

watch(
  () => items.value.map((i) => i.id).join("|"),
  async () => {
    await nextTick();
    setupObserver();
  },
  { immediate: true },
);

onUnmounted(() => {
  if (observer.value) observer.value();
});

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style scoped>
.toc {
  position: sticky;
  top: 4rem;
  align-self: start;
  max-height: calc(100dvh - 5rem);
  overflow-y: auto;
  width: 14rem;
  padding: 1rem 0.75rem;
  font-size: 0.8125rem;
}
.toc::-webkit-scrollbar {
  display: none;
}
.toc__label {
  font-family: var(--font-display);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
}
.toc__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-subtle);
}
.toc__item--h3 {
  padding-left: 0.75rem;
}
.toc__link {
  display: block;
  padding: 0.3125rem 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  line-height: 1.4;
  margin-left: -1px;
  border-left: 1px solid transparent;
  transition: color 160ms ease;
}
.toc__link:hover {
  color: var(--text-primary);
}
.toc__link--active {
  color: var(--primary);
  border-left-color: var(--primary);
  font-weight: 500;
}
.toc__divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 1rem 0.75rem;
}
.toc__actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.25rem;
}
.toc__action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-family: inherit;
  text-decoration: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.toc__action:hover {
  color: var(--text-primary);
  background: var(--surface-elevated);
}

@media (max-width: 1200px) {
  .toc {
    display: none;
  }
}
</style>
