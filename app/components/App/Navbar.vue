<template>
  <header class="navbar">
    <div class="navbar__inner">
      <div class="navbar__left">
        <button
          type="button"
          class="navbar__menu"
          aria-label="Toggle sidebar"
          @click="$emit('toggleSidebar')"
        >
          <LucideMenu :size="20" aria-hidden="true" />
        </button>

        <NuxtLink to="/" class="navbar__brand" aria-label="Claudeverse home">
          <span class="navbar__logo" aria-hidden="true">
            <LucideSparkles :size="18" />
          </span>
          <span class="navbar__name">Claudeverse</span>
        </NuxtLink>

        <span class="navbar__tag"
          >The Developer's Universe for Claude Code Mastery</span
        >
      </div>

      <button
        type="button"
        class="navbar__search"
        aria-label="Open search"
        @click="openSearch"
      >
        <LucideSearch
          :size="16"
          class="navbar__search-icon"
          aria-hidden="true"
        />
        <span class="navbar__search-label">Search guide…</span>
        <kbd class="navbar__kbd" aria-hidden="true">{{ shortcutHint }}</kbd>
      </button>

      <div class="navbar__right">
        <button
          type="button"
          class="navbar__icon-btn navbar__search-trigger"
          aria-label="Search"
          @click="openSearch"
        >
          <LucideSearch :size="20" aria-hidden="true" />
        </button>
        <NuxtLink
          to="/changelog"
          class="navbar__link navbar__whats-new"
          :aria-label="
            hasUnread ? 'What\'s new (unread updates)' : 'What\'s new'
          "
          @click="markSeen"
        >
          <LucideHistory :size="18" aria-hidden="true" />
          <span>What's new</span>
          <span
            v-if="hasUnread"
            class="navbar__whats-new-dot"
            aria-hidden="true"
          />
        </NuxtLink>
        <a
          href="https://docs.claude.com"
          target="_blank"
          rel="noopener"
          class="navbar__link"
          aria-label="Docs"
        >
          <LucideExternalLink :size="18" aria-hidden="true" />
          <span>Docs</span>
        </a>
        <a
          href="https://github.com/IwuchukwuDivine/ClaudeVerse"
          target="_blank"
          rel="noopener"
          class="navbar__link"
          aria-label="GitHub"
        >
          <IconGithub :size="18" aria-hidden="true" />
        </a>
        <AppThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{ toggleSidebar: [] }>();

const { open, toggle } = useSearch();
const { hasUnread, markSeen } = useWhatsNew();

const isMac = ref(false);
const shortcutHint = computed(() => (isMac.value ? "⌘K" : "Ctrl K"));

const openSearch = () => {
  open();
};

const onKeydown = (e: KeyboardEvent) => {
  const key = e.key?.toLowerCase();
  if ((e.metaKey || e.ctrlKey) && key === "k") {
    e.preventDefault();
    toggle();
  } else if (key === "/" && !isEditable(e.target)) {
    e.preventDefault();
    open();
  }
};

const isEditable = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    target.isContentEditable === true
  );
};

onMounted(() => {
  if (import.meta.client) {
    isMac.value = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
    window.addEventListener("keydown", onKeydown);
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener("keydown", onKeydown);
  }
});
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background: color-mix(in oklab, var(--bg) 85%, transparent);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--border-subtle);
}
.navbar__inner {
  display: grid;
  grid-template-columns: 1fr minmax(0, 420px) auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  max-width: 100%;
}
.navbar__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}
.navbar__menu {
  display: none;
  height: 2.25rem;
  width: 2.25rem;
  border-radius: var(--radius-md);
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}
.navbar__menu:hover {
  background: var(--surface-elevated);
  border-color: var(--border);
}
.navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
}
.navbar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  width: 1.75rem;
  background: linear-gradient(
    135deg,
    var(--primary),
    var(--accent-orchestration)
  );
  color: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
.navbar__name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
}
.navbar__tag {
  margin-left: 0.75rem;
  padding-left: 0.75rem;
  border-left: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.8125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.navbar__search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
  height: 2.25rem;
  width: 100%;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: border-color 160ms ease, background 160ms ease;
}
.navbar__search:hover {
  border-color: var(--border-strong, var(--border));
  background: color-mix(in oklab, var(--surface-elevated) 80%, var(--surface));
}
.navbar__search:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: var(--shadow-glow);
}
.navbar__search-icon {
  flex-shrink: 0;
}
.navbar__search-label {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.navbar__icon-btn {
  display: none;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
}
.navbar__icon-btn:hover {
  background: var(--surface-elevated);
  color: var(--text-primary);
  border-color: var(--border);
}
.navbar__kbd {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.125rem 0.375rem;
  background: var(--surface);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 0.25rem;
}
.navbar__right {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}
.navbar__link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0 0.75rem;
  height: 2.25rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition:
    background 160ms ease,
    color 160ms ease,
    border-color 160ms ease;
}
.navbar__link:hover {
  background: var(--surface-elevated);
  color: var(--text-primary);
  border-color: var(--border);
}
.navbar__whats-new {
  position: relative;
}
.navbar__whats-new-dot {
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 0 2px var(--bg);
  animation: navbar-whats-new-pulse 2s ease-in-out infinite;
}
@keyframes navbar-whats-new-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.85;
  }
}
@media (prefers-reduced-motion: reduce) {
  .navbar__whats-new-dot {
    animation: none;
  }
}
.router-link-active.navbar__whats-new .navbar__whats-new-dot {
  display: none;
}

@media (max-width: 1024px) {
  .navbar__tag {
    display: none;
  }
}
@media (max-width: 768px) {
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
  .navbar__inner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
  }
  .navbar__left {
    flex: 1;
    min-width: 0;
  }
  .navbar__menu {
    display: inline-flex;
    height: 2.75rem;
    width: 2.75rem;
  }
  .navbar__search {
    display: none;
  }
  .navbar__search-trigger {
    display: inline-flex;
    height: 2.75rem;
    width: 2.75rem;
  }
  .navbar__right {
    margin-left: auto;
    gap: 0;
  }
  .navbar__link {
    height: 2.75rem;
    width: 2.75rem;
    padding: 0;
    justify-content: center;
    gap: 0;
  }
  .navbar__link :deep(svg) {
    width: 22px;
    height: 22px;
  }
  .navbar__link span:not(.navbar__whats-new-dot) {
    display: none;
  }
  .navbar__whats-new-dot {
    top: 0.5rem;
    right: 0.5rem;
  }
  .navbar__right :deep(.theme-toggle) {
    height: 2.75rem;
    width: 2.75rem;
  }
  .navbar__right :deep(.theme-toggle svg) {
    width: 22px;
    height: 22px;
  }
}
</style>
