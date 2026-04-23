<template>
  <div class="error">
    <div class="error__orb error__orb--one" aria-hidden="true" />
    <div class="error__orb error__orb--two" aria-hidden="true" />

    <main class="error__card">
      <NuxtLink to="/" class="error__brand" aria-label="Claudeverse home">
        <span class="error__logo">
          <LucideSparkles :size="16" />
        </span>
        <span class="error__brand-name">Claudeverse</span>
      </NuxtLink>

      <p class="error__eyebrow">{{ eyebrow }}</p>

      <h1 class="error__code">{{ statusCode }}</h1>

      <h2 class="error__title">{{ title }}</h2>

      <p class="error__description">{{ description }}</p>

      <div class="error__actions">
        <button
          type="button"
          class="error__cta error__cta--primary"
          @click="goHome"
        >
          <LucideHouse :size="16" />
          Take me home
        </button>
        <NuxtLink to="/foundations" class="error__cta error__cta--ghost">
          Start with Foundations
          <LucideArrowRight :size="14" />
        </NuxtLink>
      </div>

      <ul class="error__links">
        <li v-for="link in suggestedLinks" :key="link.path">
          <NuxtLink :to="link.path" @click="() => clearError()">
            <component :is="link.icon" :size="14" />
            <span>{{ link.title }}</span>
            <LucideArrowUpRight :size="12" class="error__link-arrow" />
          </NuxtLink>
        </li>
      </ul>

      <details v-if="showDetails && error?.stack" class="error__details">
        <summary>Technical details</summary>
        <pre class="error__stack">{{ error.message }}

{{ cleanedStack }}</pre>
      </details>
    </main>

    <p class="error__footnote">
      <LucideLifeBuoy :size="12" />
      Still stuck? The <a
        href="https://docs.claude.com"
        target="_blank"
        rel="noopener"
      >official docs</a> are the best place to confirm behavior.
    </p>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Keyboard, Map } from "@lucide/vue";

interface NuxtErrorLike {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  stack?: string;
}

const props = defineProps<{
  error?: NuxtErrorLike;
}>();

const statusCode = computed(() => props.error?.statusCode ?? 500);
const isNotFound = computed(() => statusCode.value === 404);
const showDetails = computed(() => import.meta.dev && !isNotFound.value);

const eyebrow = computed(() =>
  isNotFound.value ? "Lost in the universe" : "Something broke",
);

const title = computed(() =>
  isNotFound.value ? "This page isn't on the map" : "That didn't work",
);

const description = computed(() => {
  if (isNotFound.value) {
    return "The link you followed may be out of date, mistyped, or pointing at a section that hasn't landed yet. Every section of the guide is reachable from the home page.";
  }
  if (statusCode.value === 500) {
    return "The server hit an error rendering this page. Try going home — if it keeps happening on a specific route, that's worth reporting.";
  }
  return (
    props.error?.message ||
    "An unexpected error interrupted the request. Try again, or head home."
  );
});

const suggestedLinks = [
  { title: "Foundations", path: "/foundations", icon: BookOpen },
  { title: "Cheatsheet", path: "/cheatsheet", icon: Keyboard },
  { title: "Resources", path: "/resources", icon: Map },
];

const cleanedStack = computed(() => {
  if (!props.error?.stack) return "";
  return props.error.stack
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .slice(0, 8)
    .join("\n");
});

const goHome = () => {
  clearError({ redirect: "/" });
};

useSeoMeta({
  title: isNotFound.value ? "Page not found" : "Something went wrong",
  description: description.value,
  robots: "noindex",
});
</script>

<style scoped>
.error {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background: var(--bg);
  overflow: hidden;
}
.error__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}
.error__orb--one {
  top: -8rem;
  left: -8rem;
  width: 24rem;
  height: 24rem;
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
}
.error__orb--two {
  bottom: -10rem;
  right: -10rem;
  width: 28rem;
  height: 28rem;
  background: radial-gradient(
    circle,
    var(--accent-orchestration) 0%,
    transparent 70%
  );
}
.dark .error__orb {
  opacity: 0.25;
}

.error__card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 32rem;
  padding: 2.5rem 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.error__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9375rem;
  transition: color 160ms ease;
}
.error__brand:hover {
  color: var(--text-primary);
}
.error__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--accent-orchestration));
  color: #fff;
  border-radius: 0.375rem;
  box-shadow: var(--shadow-sm);
}

.error__eyebrow {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--primary);
  margin: 0 0 0.5rem;
}
.error__code {
  font-family: var(--font-display);
  font-size: clamp(4.5rem, 14vw, 7rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  margin: 0;
  background: linear-gradient(135deg, var(--primary), var(--accent-orchestration));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.error__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0.5rem 0 0.75rem;
  letter-spacing: -0.015em;
}
.error__description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 auto 1.75rem;
  max-width: 28rem;
}

.error__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.625rem;
  margin-bottom: 2rem;
}
.error__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-body);
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    transform 160ms ease,
    background 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}
.error__cta--primary {
  background: var(--primary);
  color: var(--text-on-primary);
  box-shadow: var(--shadow-sm);
}
.error__cta--primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.error__cta--ghost {
  background: var(--surface-elevated);
  color: var(--text-primary);
  border-color: var(--border);
}
.error__cta--ghost:hover {
  border-color: var(--primary);
  background: var(--primary-subtle);
  color: var(--primary-active);
}
.dark .error__cta--ghost:hover {
  color: var(--primary);
}

.error__links {
  list-style: none;
  margin: 0;
  padding: 1.25rem 0 0;
  border-top: 1px dashed var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.error__links li :deep(a) {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition:
    background 160ms ease,
    color 160ms ease;
}
.error__links li :deep(a span) {
  flex: 1;
  text-align: left;
}
.error__links li :deep(a:hover) {
  background: var(--surface-elevated);
  color: var(--text-primary);
}
.error__link-arrow {
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 160ms ease;
}
.error__links li :deep(a:hover .error__link-arrow) {
  opacity: 1;
  color: var(--primary);
}

.error__details {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px dashed var(--border-subtle);
  text-align: left;
  font-size: 0.8125rem;
}
.error__details summary {
  cursor: pointer;
  color: var(--text-muted);
  font-weight: 500;
  user-select: none;
}
.error__details summary:hover {
  color: var(--text-primary);
}
.error__stack {
  margin: 0.75rem 0 0;
  padding: 0.875rem 1rem;
  background: var(--code-bg);
  color: var(--code-text);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.55;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.error__footnote {
  position: relative;
  z-index: 1;
  margin-top: 1.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
.error__footnote a {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed;
}
.error__footnote a:hover {
  color: var(--primary-hover);
}

@media (max-width: 480px) {
  .error__card {
    padding: 2rem 1.25rem;
  }
}
</style>
