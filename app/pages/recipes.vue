<template>
  <article>
    <DocsPageHeader
      title="Recipes"
      eyebrow="Scenario cookbook"
      accent="recipes"
      :icon="ChefHat"
      description="Real-world scenarios solved end-to-end: adding auth, refactoring monoliths, onboarding engineers, migrating codebases, and shipping features in worktrees."
      est-read-time="30 min"
    />
    <DocsComingSoon
      :topics="[
        'Add auth to a web app',
        'Refactor a monolith',
        'Onboard a new engineer',
        'Migrate a codebase',
        'Automate code reviews',
        'Ship a feature in a worktree',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Evals', path: '/evals' }"
      :next="{ title: 'Troubleshooting', path: '/troubleshooting' }"
    />
  </article>
</template>

<script setup lang="ts">
import { ChefHat } from "@lucide/vue";

const seoTitle = "Recipes — Real-World Claude Code Scenarios";
const seoDescription =
  "A cookbook of end-to-end Claude Code scenarios: adding authentication, refactoring legacy code, onboarding engineers, migrating codebases, and automating reviews.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/recipes",
  type: "article",
  keywords: [
    "claude code recipes",
    "ai coding scenarios",
    "claude code examples",
    "refactor with claude",
    "claude code onboarding",
    "agent workflows",
    "ai cookbook",
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
            "@type": "TechArticle",
            headline: seoTitle,
            description: seoDescription,
            url,
            image,
            inLanguage: "en-US",
            author: { "@type": "Organization", name: "Claudeverse" },
            publisher: {
              "@type": "Organization",
              name: "Claudeverse",
              logo: {
                "@type": "ImageObject",
                url: getAbsoluteUrl("/logo.png"),
              },
            },
            mainEntityOfPage: url,
            timeRequired: "PT30M",
            about: [
              "Claude Code scenarios",
              "AI coding recipes",
              "Agent workflows",
              "Refactoring with AI",
            ],
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: getAbsoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Recipes",
                item: url,
              },
            ],
          },
        ],
      }),
    },
  ],
});
const { clear } = useToc();
clear();
</script>
