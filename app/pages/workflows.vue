<template>
  <article>
    <DocsPageHeader
      title="Workflows"
      eyebrow="Plan → execute"
      accent="workflows"
      :icon="Zap"
      description="The 4-phase workflow, Plan Mode, feedback loops, prompt precision, session management, and context handoff between sessions."
      est-read-time="20 min"
    />
    <DocsComingSoon
      :topics="[
        'The 4-phase workflow',
        'Plan Mode (Shift+Tab×2)',
        'When to skip planning',
        'Feedback loops with tests & LSP',
        'Prompt precision patterns',
        'Session management',
        'The Big Prompt pattern',
        'Best of N',
        'Context handoff between sessions',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Foundations', path: '/foundations' }"
      :next="{ title: 'Extensions', path: '/extensions' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Zap } from "@lucide/vue";

const seoTitle = "Workflows — Plan → Execute with Claude Code";
const seoDescription =
  "The 4-phase plan → execute workflow, Plan Mode, feedback loops, prompt precision, session management, checkpointing, Big Prompt pattern, Best of N, and context handoff patterns for Claude Code.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/workflows",
  type: "article",
  keywords: [
    "claude code workflow",
    "plan mode",
    "prompt engineering",
    "feedback loops",
    "session management",
    "big prompt pattern",
    "best of n",
    "context handoff",
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
            proficiencyLevel: "Intermediate",
            timeRequired: "PT20M",
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
                name: "Workflows",
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
