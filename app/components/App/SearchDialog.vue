<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="search-fade">
        <div
          v-if="isOpen"
          class="search-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Search Claudeverse"
          @mousedown.self="close"
        >
          <div class="search-dialog__panel" @mousedown.stop>
            <div class="search-dialog__header">
              <LucideSearch :size="18" class="search-dialog__header-icon" />
              <input
                ref="inputRef"
                v-model="query"
                class="search-dialog__input"
                type="search"
                placeholder="Search sections, topics…"
                autocomplete="off"
                spellcheck="false"
                aria-label="Search query"
                @keydown.down.prevent="moveActive(1)"
                @keydown.up.prevent="moveActive(-1)"
                @keydown.enter.prevent="activate"
                @keydown.esc.prevent="close"
              >
              <span v-if="loading" class="search-dialog__spinner" aria-hidden="true" />
              <kbd class="search-dialog__esc">Esc</kbd>
            </div>

            <div class="search-dialog__body" role="listbox">
              <!-- Results when user is typing -->
              <template v-if="debouncedQuery.trim()">
                <div
                  v-if="!flatResults.length"
                  class="search-dialog__empty"
                >
                  <LucideSearchX :size="28" />
                  <p class="search-dialog__empty-title">No results for "{{ debouncedQuery }}"</p>
                  <p class="search-dialog__empty-sub">Try a different term or browse the sidebar.</p>
                </div>

                <section
                  v-for="group in groups"
                  :key="group.category.key"
                  class="search-dialog__group"
                >
                  <header class="search-dialog__group-header">
                    <component
                      :is="group.category.icon"
                      v-if="group.category.icon"
                      :size="13"
                    />
                    <span>{{ group.category.label }}</span>
                    <span class="search-dialog__group-count">{{ group.results.length }}</span>
                  </header>
                  <ul class="search-dialog__list">
                    <li v-for="result in group.results" :key="result.item.id">
                      <button
                        type="button"
                        class="search-dialog__row"
                        :class="[
                          result.item.accent
                            ? `search-dialog__row--${result.item.accent}`
                            : '',
                          { 'search-dialog__row--active': isActive(result.item.id) },
                        ]"
                        @mousemove="setActiveById(result.item.id)"
                        @click="select(result.item)"
                      >
                        <span class="search-dialog__row-icon">
                          <component
                            :is="result.item.icon ?? group.category.icon"
                            v-if="result.item.icon ?? group.category.icon"
                            :size="16"
                          />
                        </span>
                        <span class="search-dialog__row-main">
                          <span class="search-dialog__row-title">
                            <template
                              v-for="(tok, idx) in highlight(result.item.title, result.titleHighlights)"
                              :key="idx"
                            >
                              <mark v-if="tok.match">{{ tok.text }}</mark>
                              <template v-else>{{ tok.text }}</template>
                            </template>
                          </span>
                          <span
                            v-if="result.item.subtitle"
                            class="search-dialog__row-subtitle"
                          >
                            <template
                              v-for="(tok, idx) in highlight(result.item.subtitle, result.subtitleHighlights)"
                              :key="idx"
                            >
                              <mark v-if="tok.match">{{ tok.text }}</mark>
                              <template v-else>{{ tok.text }}</template>
                            </template>
                          </span>
                        </span>
                        <span
                          v-if="result.item.badge"
                          class="search-dialog__row-badge"
                        >{{ result.item.badge }}</span>
                        <LucideCornerDownLeft
                          v-if="isActive(result.item.id)"
                          :size="14"
                          class="search-dialog__row-enter"
                        />
                      </button>
                    </li>
                  </ul>
                </section>
              </template>

              <!-- Empty state: recents + prompt -->
              <template v-else>
                <section v-if="recents.length" class="search-dialog__group">
                  <header class="search-dialog__group-header">
                    <LucideClock :size="13" />
                    <span>Recent</span>
                    <button
                      type="button"
                      class="search-dialog__group-action"
                      @click="clearRecents"
                    >Clear</button>
                  </header>
                  <ul class="search-dialog__list">
                    <li v-for="(item, i) in recents" :key="item.id">
                      <button
                        type="button"
                        class="search-dialog__row"
                        :class="{ 'search-dialog__row--active': activeIndex === i }"
                        @mousemove="activeIndex = i"
                        @click="select(item)"
                      >
                        <span class="search-dialog__row-icon">
                          <LucideClock :size="16" />
                        </span>
                        <span class="search-dialog__row-main">
                          <span class="search-dialog__row-title">{{ item.title }}</span>
                          <span
                            v-if="item.subtitle"
                            class="search-dialog__row-subtitle"
                          >{{ item.subtitle }}</span>
                        </span>
                        <span
                          v-if="item.badge"
                          class="search-dialog__row-badge"
                        >{{ item.badge }}</span>
                      </button>
                    </li>
                  </ul>
                </section>

                <div class="search-dialog__placeholder">
                  <LucideSparkles :size="22" />
                  <p>Start typing to search the guide</p>
                  <p class="search-dialog__placeholder-sub">
                    Sections, topics, and anchors — all in one place.
                  </p>
                </div>
              </template>
            </div>

            <footer class="search-dialog__footer">
              <span class="search-dialog__hint">
                <kbd>↑</kbd><kbd>↓</kbd>
                <span>navigate</span>
              </span>
              <span class="search-dialog__hint">
                <kbd>↵</kbd>
                <span>open</span>
              </span>
              <span class="search-dialog__hint">
                <kbd>esc</kbd>
                <span>close</span>
              </span>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { SearchItem } from "~/utils/types/search";
import highlightText from "~/utils/search/highlightText";

const {
  isOpen,
  query,
  debouncedQuery,
  loading,
  activeIndex,
  recents,
  groups,
  flatResults,
  close,
  select,
  moveActive,
  activate,
  clearRecents,
} = useSearch();

const inputRef = ref<HTMLInputElement | null>(null);

const highlight = highlightText;

const isActive = (id: string) => {
  const current = flatResults.value[activeIndex.value];
  return current?.item.id === id;
};

const setActiveById = (id: string) => {
  const idx = flatResults.value.findIndex((r) => r.item.id === id);
  if (idx >= 0) activeIndex.value = idx;
};

// Focus input on open
watch(isOpen, async (v) => {
  if (v) {
    await nextTick();
    inputRef.value?.focus();
  }
});

// Scroll active row into view
watch(activeIndex, async () => {
  await nextTick();
  const el = document.querySelector<HTMLElement>(".search-dialog__row--active");
  el?.scrollIntoView({ block: "nearest" });
});

// Prevent body scroll while open
watch(isOpen, (v) => {
  if (!import.meta.client) return;
  document.body.style.overflow = v ? "hidden" : "";
});

// Shared typing for clarity
defineExpose<{ close: () => void; select: (item: SearchItem) => void }>({
  close,
  select,
});
</script>

<style scoped>
.search-dialog {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: clamp(2rem, 8vh, 6rem) 1rem 1rem;
  background: color-mix(in oklab, var(--bg) 60%, rgba(0, 0, 0, 0.5));
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.search-dialog__panel {
  width: 100%;
  max-width: 40rem;
  max-height: min(70vh, 38rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.search-dialog__header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border-subtle);
}
.search-dialog__header-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}
.search-dialog__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  font-family: var(--font-body);
  color: var(--text-primary);
  min-width: 0;
}
.search-dialog__input::placeholder {
  color: var(--text-muted);
}
.search-dialog__esc {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.125rem 0.375rem;
  background: var(--surface-elevated);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 0.25rem;
}
.search-dialog__spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  animation: search-spin 0.8s linear infinite;
}
@keyframes search-spin {
  to { transform: rotate(360deg); }
}

.search-dialog__body {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0.5rem 0.75rem;
}
.search-dialog__group + .search-dialog__group {
  margin-top: 0.5rem;
}
.search-dialog__group-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}
.search-dialog__group-count {
  margin-left: auto;
  font-weight: 500;
  opacity: 0.7;
  text-transform: none;
  letter-spacing: 0;
}
.search-dialog__group-action {
  margin-left: auto;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: inherit;
}
.search-dialog__group-action:hover {
  color: var(--text-primary);
  background: var(--surface-elevated);
}
.search-dialog__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.search-dialog__row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  transition: background 120ms ease, border-color 120ms ease;
}
.search-dialog__row--active {
  background: var(--surface-elevated);
  border-color: var(--border);
}
.search-dialog__row-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  width: 1.75rem;
  border-radius: var(--radius-sm, 0.375rem);
  background: var(--surface-elevated);
  color: var(--text-secondary);
  flex-shrink: 0;
}
.search-dialog__row--active .search-dialog__row-icon {
  background: color-mix(in oklab, var(--primary) 14%, transparent);
  color: var(--primary);
}
.search-dialog__row-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.search-dialog__row-title {
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-dialog__row-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-dialog__row mark {
  background: color-mix(in oklab, var(--primary) 28%, transparent);
  color: var(--text-primary);
  padding: 0 1px;
  border-radius: 2px;
}
.search-dialog__row-badge {
  font-size: 0.6875rem;
  padding: 0.125rem 0.5rem;
  background: var(--surface-elevated);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}
.search-dialog__row-enter {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-dialog__placeholder,
.search-dialog__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
}
.search-dialog__placeholder p,
.search-dialog__empty-title {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}
.search-dialog__placeholder-sub,
.search-dialog__empty-sub {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.search-dialog__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 0.625rem 1rem;
  border-top: 1px solid var(--border-subtle);
  background: var(--surface-elevated);
  font-size: 0.75rem;
  color: var(--text-muted);
}
.search-dialog__hint {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
.search-dialog__footer kbd {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.0625rem 0.375rem;
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 0.25rem;
}

/* Accent-tinted icon squares per section */
.search-dialog__row--home .search-dialog__row-icon,
.search-dialog__row--foundations .search-dialog__row-icon,
.search-dialog__row--workflows .search-dialog__row-icon,
.search-dialog__row--extensions .search-dialog__row-icon,
.search-dialog__row--tokens .search-dialog__row-icon,
.search-dialog__row--orchestration .search-dialog__row-icon,
.search-dialog__row--evals .search-dialog__row-icon,
.search-dialog__row--recipes .search-dialog__row-icon,
.search-dialog__row--troubleshooting .search-dialog__row-icon,
.search-dialog__row--resources .search-dialog__row-icon,
.search-dialog__row--workshops .search-dialog__row-icon,
.search-dialog__row--cheatsheet .search-dialog__row-icon {
  color: var(--accent, var(--primary));
  background: color-mix(in oklab, var(--accent, var(--primary)) 14%, transparent);
}
.search-dialog__row--home { --accent: var(--primary); }
.search-dialog__row--foundations { --accent: var(--accent-foundations, var(--primary)); }
.search-dialog__row--workflows { --accent: var(--accent-workflows, var(--primary)); }
.search-dialog__row--extensions { --accent: var(--accent-extensions, var(--primary)); }
.search-dialog__row--tokens { --accent: var(--accent-tokens, var(--primary)); }
.search-dialog__row--orchestration { --accent: var(--accent-orchestration, var(--primary)); }
.search-dialog__row--evals { --accent: var(--accent-evals, var(--primary)); }
.search-dialog__row--recipes { --accent: var(--accent-recipes, var(--primary)); }
.search-dialog__row--troubleshooting { --accent: var(--accent-troubleshooting, var(--primary)); }
.search-dialog__row--resources { --accent: var(--accent-resources, var(--primary)); }
.search-dialog__row--workshops { --accent: var(--accent-workshops, var(--primary)); }
.search-dialog__row--cheatsheet { --accent: var(--accent-cheatsheet, var(--primary)); }

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 140ms ease;
}
.search-fade-enter-active .search-dialog__panel,
.search-fade-leave-active .search-dialog__panel {
  transition: transform 160ms ease, opacity 160ms ease;
}
.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
.search-fade-enter-from .search-dialog__panel,
.search-fade-leave-to .search-dialog__panel {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

@media (max-width: 640px) {
  .search-dialog {
    padding: 3.5rem 0.75rem 0.75rem;
  }
  .search-dialog__panel {
    max-height: calc(100dvh - 4.5rem);
  }
  .search-dialog__footer {
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>
