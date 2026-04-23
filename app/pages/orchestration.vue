<template>
  <article>
    <DocsPageHeader
      title="Orchestration"
      eyebrow="Scale beyond one session"
      accent="orchestration"
      :icon="Network"
      description="Multi-agent patterns, the 3-tier orchestrator landscape, Agent Teams, git worktrees, AGENTS.md, and quality gates."
      est-read-time="25 min"
    />
    <DocsComingSoon
      :topics="[
        'When to scale beyond a single session',
        'The 3 tiers of orchestration',
        'Subagents → Agent Teams graduation path',
        'Git worktrees for isolation',
        'Conductor model vs orchestrator model',
        'Agent Teams deep dive',
        'Quality gates',
        'AGENTS.md for compound learning',
        'Token economics comparison',
        'External orchestrator comparison',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Token Mastery', path: '/tokens' }"
      :next="{ title: 'Resources', path: '/resources' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Network } from "@lucide/vue";

const seoTitle = "Orchestration — Multi-Agent Claude Code at Scale";
const seoDescription =
  "When to scale up from a single session: the 3-tier orchestrator landscape, subagents graduating to Agent Teams, git worktrees, conductor vs orchestrator models, AGENTS.md, quality gates, token economics, and external orchestrators compared.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/orchestration",
  type: "article",
  keywords: [
    "multi-agent orchestration",
    "claude code subagents",
    "agent teams",
    "git worktrees",
    "agents md",
    "conductor orchestrator",
    "quality gates",
    "parallel agents",
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
            proficiencyLevel: "Advanced",
            timeRequired: "PT25M",
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
                name: "Orchestration",
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
