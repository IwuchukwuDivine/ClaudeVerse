<template>
  <div class="home">
    <section class="hero">
      <span class="hero__eyebrow">
        <LucideSparkles :size="13" />
        The Developer's Universe for Claude Code Mastery
      </span>
      <h1 class="hero__title">
        From <span class="hero__strike">"I use Claude sometimes"</span> <br />to
        systems that
        <span class="hero__accent">compound your productivity</span>.
      </h1>
      <p class="hero__lead">
        Everything about Claude Code — mental models, workflows, extension
        points, orchestration, token optimization, and resources — organized in
        one place. No hunting through 50 blog posts.
      </p>
      <div class="hero__actions">
        <NuxtLink to="/foundations" class="hero__cta hero__cta--primary">
          Start with the foundations
          <LucideArrowRight :size="16" />
        </NuxtLink>
        <NuxtLink to="/cheatsheet" class="hero__cta hero__cta--ghost">
          <LucideKeyboard :size="16" />
          Jump to cheatsheet
        </NuxtLink>
      </div>
    </section>

    <section id="state-of-the-art" class="anchored">
      <header class="section-heading">
        <h2 class="section-heading__title">The state of Claude Code</h2>
        <p class="section-heading__subtitle">
          Where the industry is, what it costs, and why the 200K-token window is
          your #1 constraint.
        </p>
      </header>
      <div class="stats">
        <div class="stat">
          <span class="stat__value">40.8%</span>
          <span class="stat__label"
            >of pro developers use AI coding tools daily</span
          >
        </div>
        <div class="stat">
          <span class="stat__value">~$13</span>
          <span class="stat__label"
            >average spend per developer per active day</span
          >
        </div>
        <div class="stat">
          <span class="stat__value">33%</span>
          <span class="stat__label"
            >unguided success rate — planning closes the gap</span
          >
        </div>
        <div class="stat">
          <span class="stat__value">200K</span>
          <span class="stat__label"
            >tokens of context — your #1 scarce resource</span
          >
        </div>
      </div>
    </section>

    <section id="how-to-use" class="anchored">
      <header class="section-heading">
        <h2 class="section-heading__title">How to use this guide</h2>
        <p class="section-heading__subtitle">
          Pick the path that matches where you are today.
        </p>
      </header>
      <div class="paths">
        <div class="path">
          <span class="path__badge path__badge--beginner">New here</span>
          <h3 class="path__title">Start at the top</h3>
          <p class="path__body">
            Read Foundations → Workflows → Extensions in order. Each section
            builds on the last and ends with exercises you can run in your own
            project.
          </p>
          <NuxtLink to="/foundations" class="path__link">
            Begin with Foundations
            <LucideArrowRight :size="14" />
          </NuxtLink>
        </div>
        <div class="path">
          <span class="path__badge path__badge--advanced"
            >Already shipping with it</span
          >
          <h3 class="path__title">Jump to what's costing you</h3>
          <p class="path__body">
            If tokens are out of control, head to Token Mastery. If you're
            coordinating work across multiple sessions, Orchestration. If you
            just want the shortcuts, the Cheatsheet.
          </p>
          <div class="path__chips">
            <NuxtLink to="/tokens" class="path__chip">Token Mastery</NuxtLink>
            <NuxtLink to="/orchestration" class="path__chip"
              >Orchestration</NuxtLink
            >
            <NuxtLink to="/extensions" class="path__chip">Extensions</NuxtLink>
            <NuxtLink to="/cheatsheet" class="path__chip">Cheatsheet</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section id="what-is-claudeverse" class="anchored">
      <header class="section-heading">
        <h2 class="section-heading__title">What is Claudeverse</h2>
        <p class="section-heading__subtitle">
          {{ nonHomeSections.length }} sections covering every layer of Claude
          Code — built for both self-paced learning and workshop delivery.
        </p>
      </header>
      <div class="grid">
        <HomeSectionCard
          v-for="section in nonHomeSections"
          :key="section.slug"
          :section="section"
        />
      </div>
    </section>

    <section id="audience" class="audience">
      <div class="audience__inner">
        <h2 class="audience__title">Who it's for</h2>
        <ul class="audience__list">
          <li>
            <span class="audience__icon">
              <LucideUserRound :size="14" />
            </span>
            <div>
              <strong>Junior devs</strong> learning how to collaborate with an
              AI that has judgment — not just an autocomplete that guesses.
            </div>
          </li>
          <li>
            <span class="audience__icon">
              <LucideUsers :size="14" />
            </span>
            <div>
              <strong>Senior engineers</strong> architecting hooks, skills, and
              subagent workflows their whole team can adopt.
            </div>
          </li>
          <li>
            <span class="audience__icon">
              <LucideGraduationCap :size="14" />
            </span>
            <div>
              <strong>Instructors and team leads</strong> running internal
              workshops. The <NuxtLink to="/workshops">Workshops</NuxtLink>
              section is a set of hands-on practicals teams can run together.
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const title = "Claudeverse — The Developer's Universe for Claude Code Mastery";
const description =
  "A comprehensive, interactive guide to mastering Claude Code — mental models, workflows, extension points, orchestration, token optimization, and a workshop curriculum. No hunting through 50 blog posts.";

const { url } = useSeo({
  title,
  description,
  path: "/",
  type: "website",
  keywords: [
    "claude code",
    "claude",
    "anthropic",
    "ai coding",
    "agentic workflows",
    "llm development",
    "prompt engineering",
    "mcp",
    "subagents",
    "claude code tutorial",
    "developer guide",
  ],
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${url}/#website`,
            url,
            name: "Claudeverse",
            description,
            inLanguage: "en-US",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${url}/?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@type": "Organization",
            "@id": `${url}/#organization`,
            name: "Claudeverse",
            url,
            logo: {
              "@type": "ImageObject",
              url: getAbsoluteUrl("/logo.png"),
            },
            sameAs: ["https://twitter.com/_DeeVyn"],
          },
          {
            "@type": "WebPage",
            "@id": `${url}/#webpage`,
            url,
            name: title,
            description,
            isPartOf: { "@id": `${url}/#website` },
            inLanguage: "en-US",
          },
          {
            "@type": "ItemList",
            name: "Claudeverse Guide Sections",
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: sections.length,
            itemListElement: sections.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title,
              description: s.description,
              url: getAbsoluteUrl(s.path),
            })),
          },
        ],
      }),
    },
  ],
});

const { clear } = useToc();
clear();

const nonHomeSections = computed(() =>
  sections.filter((s) => s.slug !== "welcome"),
);
</script>

<style scoped>
.home {
  padding-bottom: 2rem;
}
.hero {
  padding: 3rem 0 2.5rem;
  text-align: left;
  max-width: 52rem;
}
.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: var(--primary-subtle);
  color: var(--primary-active);
  border: 1px solid var(--primary-border);
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}
.dark .hero__eyebrow {
  color: var(--primary);
}
.hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0 0 1rem;
  color: var(--text-primary);
}
.hero__strike {
  color: var(--text-muted);
  text-decoration: line-through;
  text-decoration-color: color-mix(
    in oklab,
    var(--text-muted) 60%,
    transparent
  );
  font-weight: 500;
}
.hero__accent {
  background: linear-gradient(
    135deg,
    var(--primary),
    var(--accent-orchestration)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero__lead {
  font-size: 1.125rem;
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 44rem;
  margin: 0 0 2rem;
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.125rem;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
}
.hero__cta--primary {
  background: var(--primary);
  color: var(--text-on-primary);
  box-shadow: var(--shadow-md);
}
.hero__cta--primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}
.hero__cta--ghost {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
.hero__cta--ghost:hover {
  background: var(--surface-elevated);
  border-color: var(--border-strong);
}

.anchored {
  margin-bottom: 3rem;
  scroll-margin-top: 5rem;
}
.section-heading {
  margin-bottom: 1.25rem;
}
.section-heading__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--text-primary);
}
.section-heading__subtitle {
  font-size: 0.9375rem;
  color: var(--text-muted);
  margin: 0.25rem 0 0;
  line-height: 1.55;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0;
  padding: 1.5rem 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1.25rem;
  border-right: 1px solid var(--border-subtle);
}
.stat:last-child {
  border-right: none;
}
.stat__value {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.02em;
}
.stat__label {
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.4;
}
@media (max-width: 640px) {
  .hero {
    padding: 1.5rem 0 1.5rem;
  }
  .stat {
    border-right: none;
    border-bottom: 1px solid var(--border-subtle);
  }
  .stat:last-child {
    border-bottom: none;
  }
}

.paths {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1rem;
}
.path {
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.path__badge {
  align-self: flex-start;
  padding: 0.25rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: var(--radius-pill);
}
.path__badge--beginner {
  background: var(--accent-home-wash);
  color: var(--accent-home);
}
.path__badge--advanced {
  background: var(--accent-orchestration-wash);
  color: var(--accent-orchestration);
}
.path__title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}
.path__body {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
}
.path__link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  margin-top: 0.25rem;
}
.path__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.path__chip {
  padding: 0.375rem 0.75rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  color: var(--text-primary);
  text-decoration: none;
  transition:
    border-color 160ms ease,
    background 160ms ease;
}
.path__chip:hover {
  border-color: var(--primary);
  background: var(--primary-subtle);
  color: var(--primary-active);
}
.dark .path__chip:hover {
  color: var(--primary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1rem;
}

.audience {
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 1px solid var(--border-subtle);
  scroll-margin-top: 5rem;
}
.audience__inner {
  max-width: 44rem;
}
.audience__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem;
}
.audience__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.audience__list li {
  display: flex;
  gap: 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--text-secondary);
}
.audience__list strong {
  color: var(--text-primary);
  font-weight: 600;
}
.audience__list a {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed;
}
.audience__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.625rem;
  width: 1.625rem;
  border-radius: var(--radius-sm);
  background: var(--surface-elevated);
  color: var(--primary);
  flex-shrink: 0;
  margin-top: 0.125rem;
}
</style>
