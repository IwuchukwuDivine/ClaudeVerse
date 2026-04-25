<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar--open': open }"
    :inert="!open && isMobile"
  >
    <nav class="sidebar__nav" aria-label="Guide sections">
      <div class="sidebar__group">
        <p class="sidebar__label">Guide</p>
        <ul class="sidebar__list">
          <li v-for="section in sections" :key="section.slug">
            <NuxtLink
              :to="section.path"
              class="sidebar__section"
              :class="[
                `sidebar__section--${section.accent}`,
                { 'sidebar__section--active': isActiveSection(section.path) },
              ]"
              :aria-current="
                isActiveSection(section.path) ? 'page' : undefined
              "
              @click="$emit('close')"
            >
              <span class="sidebar__icon" aria-hidden="true">
                <component :is="section.icon" :size="16" />
              </span>
              <span class="sidebar__section-title">{{ section.title }}</span>
              <span class="sidebar__dot" aria-hidden="true" />
            </NuxtLink>

            <ul
              v-if="section.children && isActiveSection(section.path)"
              class="sidebar__children"
            >
              <li v-for="child in section.children" :key="child.path">
                <NuxtLink
                  :to="child.path"
                  class="sidebar__child"
                  :class="{
                    'sidebar__child--active': isActiveAnchor(child.path),
                  }"
                  :aria-current="
                    isActiveAnchor(child.path) ? 'location' : undefined
                  "
                  @click="$emit('close')"
                >
                  {{ child.title }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="sidebar__group">
        <p class="sidebar__label">External</p>
        <ul class="sidebar__list">
          <li>
            <a
              href="https://docs.claude.com"
              target="_blank"
              rel="noopener"
              class="sidebar__external"
            >
              <LucideExternalLink :size="14" aria-hidden="true" />
              <span>Official Docs</span>
            </a>
          </li>
          <li>
            <a
              href="https://anthropic.skilljar.com/claude-code-in-action"
              target="_blank"
              rel="noopener"
              class="sidebar__external"
            >
              <LucideExternalLink :size="14" aria-hidden="true" />
              <span>Claude Code in Action</span>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/anthropics/claude-code"
              target="_blank"
              rel="noopener"
              class="sidebar__external"
            >
              <IconGithub :size="14" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();

const route = useRoute();
const { activeId } = useToc();

const isMobile = ref(false);
onMounted(() => {
  const mq = window.matchMedia("(max-width: 900px)");
  isMobile.value = mq.matches;
  mq.addEventListener("change", (e) => (isMobile.value = e.matches));
});

const isActiveSection = (path: string) => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};

const isActiveAnchor = (path: string) => {
  const [base, hash] = path.split("#");
  if (base !== route.path) return false;
  if (!hash) return false;
  return activeId.value === hash;
};
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 3.5rem;
  align-self: start;
  height: calc(100dvh - 3.5rem);
  width: 16rem;
  flex-shrink: 0;
  border-right: 1px solid var(--border-subtle);
  background: var(--bg);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.25rem 0.75rem;
}
.sidebar::-webkit-scrollbar {
  display: none;
}
.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.sidebar__group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.sidebar__label {
  padding: 0 0.75rem;
  font-family: var(--font-display);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}
.sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.sidebar__section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  transition:
    background 160ms ease,
    color 160ms ease;
}
.sidebar__section:hover {
  background: var(--surface-elevated);
  color: var(--text-primary);
}
.sidebar__section--active {
  color: var(--text-primary);
  background: var(--surface-elevated);
}
.sidebar__section--active .sidebar__dot {
  opacity: 1;
}
.sidebar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 0.375rem;
  background: var(--surface-sunken);
  color: var(--text-muted);
  flex-shrink: 0;
}
.sidebar__section--home .sidebar__icon {
  background: var(--accent-home-wash);
  color: var(--accent-home);
}
.sidebar__section--foundations .sidebar__icon {
  background: var(--accent-foundations-wash);
  color: var(--accent-foundations);
}
.sidebar__section--workflows .sidebar__icon {
  background: var(--accent-workflows-wash);
  color: var(--accent-workflows);
}
.sidebar__section--extensions .sidebar__icon {
  background: var(--accent-extensions-wash);
  color: var(--accent-extensions);
}
.sidebar__section--tokens .sidebar__icon {
  background: var(--accent-tokens-wash);
  color: var(--accent-tokens);
}
.sidebar__section--orchestration .sidebar__icon {
  background: var(--accent-orchestration-wash);
  color: var(--accent-orchestration);
}
.sidebar__section--evals .sidebar__icon {
  background: var(--accent-evals-wash);
  color: var(--accent-evals);
}
.sidebar__section--recipes .sidebar__icon {
  background: var(--accent-recipes-wash);
  color: var(--accent-recipes);
}
.sidebar__section--troubleshooting .sidebar__icon {
  background: var(--accent-troubleshooting-wash);
  color: var(--accent-troubleshooting);
}
.sidebar__section--resources .sidebar__icon {
  background: var(--accent-resources-wash);
  color: var(--accent-resources);
}
.sidebar__section--workshops .sidebar__icon {
  background: var(--accent-workshops-wash);
  color: var(--accent-workshops);
}
.sidebar__section--cheatsheet .sidebar__icon {
  background: var(--accent-cheatsheet-wash);
  color: var(--accent-cheatsheet);
}
.sidebar__section--reviews .sidebar__icon {
  background: var(--accent-reviews-wash);
  color: var(--accent-reviews);
}
.sidebar__section-title {
  flex: 1;
}
.sidebar__dot {
  height: 0.375rem;
  width: 0.375rem;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0;
}
.sidebar__children {
  list-style: none;
  margin: 0.25rem 0 0.25rem 1.5rem;
  padding: 0 0 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-left: 1px solid var(--border-subtle);
}
.sidebar__child {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition:
    color 160ms ease,
    background 160ms ease;
}
.sidebar__child:hover {
  color: var(--text-primary);
  background: var(--surface-elevated);
}
.sidebar__child--active {
  color: var(--primary);
  font-weight: 500;
}
.sidebar__external {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
}
.sidebar__external:hover {
  color: var(--text-primary);
  background: var(--surface-elevated);
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    inset: 3.5rem 0 0 0;
    width: 18rem;
    max-width: 85vw;
    transform: translateX(-100%);
    transition: transform 200ms ease;
    z-index: 30;
    box-shadow: var(--shadow-lg);
  }
  .sidebar--open {
    transform: translateX(0);
  }
}
@media (max-width: 768px) {
  .sidebar {
    inset: 4rem 0 0 0;
  }
}
</style>
