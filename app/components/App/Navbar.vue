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
          <LucideMenu :size="20" />
        </button>

        <NuxtLink to="/" class="navbar__brand" aria-label="Claudeverse home">
          <span class="navbar__logo">
            <LucideSparkles :size="18" />
          </span>
          <span class="navbar__name">Claudeverse</span>
        </NuxtLink>

        <span class="navbar__tag"
          >The Developer's Universe for Claude Code Mastery</span
        >
      </div>

      <div class="navbar__search">
        <LucideSearch :size="16" class="navbar__search-icon" />
        <input
          type="search"
          placeholder="Search guide…"
          class="navbar__search-input"
          aria-label="Search"
        />
        <kbd class="navbar__kbd">⌘K</kbd>
      </div>

      <div class="navbar__right">
        <a
          href="https://docs.claude.com"
          target="_blank"
          rel="noopener"
          class="navbar__link"
        >
          <LucideExternalLink :size="18" />
          <span>Docs</span>
        </a>
        <a
          href="https://github.com/IwuchukwuDivine/ClaudeVerse"
          target="_blank"
          rel="noopener"
          class="navbar__link"
          aria-label="GitHub"
        >
          <IconGithub :size="18" />
        </a>
        <AppThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{ toggleSidebar: [] }>();
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
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  transition: border-color 160ms ease;
}
.navbar__search:focus-within {
  border-color: var(--primary);
  box-shadow: var(--shadow-glow);
}
.navbar__search-icon {
  flex-shrink: 0;
}
.navbar__search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  font-family: var(--font-body);
  color: var(--text-primary);
  min-width: 0;
}
.navbar__search-input::placeholder {
  color: var(--text-muted);
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

@media (max-width: 1024px) {
  .navbar__tag {
    display: none;
  }
}
@media (max-width: 768px) {
  .navbar__inner {
    grid-template-columns: auto 1fr auto;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
  }
  .navbar__menu {
    display: inline-flex;
    height: 2.5rem;
    width: 2.5rem;
  }
  .navbar__search {
    display: none;
  }
  .navbar__right {
    gap: 0.125rem;
    justify-self: end;
  }
  .navbar__link {
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
    justify-content: center;
    gap: 0;
  }
  .navbar__link span {
    display: none;
  }
  .navbar__right :deep(.theme-toggle) {
    height: 2.5rem;
    width: 2.5rem;
  }
}
</style>
