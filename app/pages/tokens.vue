<template>
  <article>
    <DocsPageHeader
      title="Token Mastery"
      eyebrow="Cut usage in half"
      accent="tokens"
      :icon="Coins"
      description="Why tokens matter, the three highest-impact fixes, monitoring, CLAUDE.md diet, model routing, and team cost control."
      est-read-time="20 min"
    />
    <DocsComingSoon
      :topics="[
        'Why tokens matter',
        'The 3 fixes that cut usage in half',
        'Monitor your usage',
        'CLAUDE.md token diet',
        'Tiered context architecture',
        'Compact strategies',
        'Model routing (Opus/Sonnet/Haiku)',
        'Subagent economics',
        'Hook-based output control',
        'Team cost management',
        'The token-efficient session template',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Extensions', path: '/extensions' }"
      :next="{ title: 'Orchestration', path: '/orchestration' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Coins } from "@lucide/vue";

const seoTitle = "Token Mastery — Cut Claude Code Usage in Half";
const seoDescription =
  "Why tokens matter, the three highest-impact fixes, usage monitoring, CLAUDE.md diet, tiered architecture, compact strategies, model routing, subagent economics, hook-based output control, and team cost management for Claude Code.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/tokens",
  type: "article",
  keywords: [
    "claude code tokens",
    "token optimization",
    "llm costs",
    "claude md diet",
    "model routing",
    "subagent economics",
    "token monitoring",
    "ccusage",
    "team cost management",
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
                name: "Token Mastery",
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
