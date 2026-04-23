<template>
  <article>
    <DocsPageHeader
      title="Extensions"
      eyebrow="The 6 layers"
      accent="extensions"
      :icon="Puzzle"
      description="Skills, Commands, Hooks, Subagents, Agent Teams, MCP, Plugins, and LSP — when to reach for each and how they fit together."
      est-read-time="35 min"
    />
    <DocsComingSoon
      :topics="[
        'Decision framework: which extension, when',
        'Skills — auto-triggering expertise',
        'Commands — slash templates',
        'Hooks — deterministic guardrails',
        'Subagents — isolated workers',
        'Agent Teams — collaborative squads',
        'MCP — external service integration',
        'Plugins — bundled extensions',
        'LSP — automatic diagnostics',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Workflows', path: '/workflows' }"
      :next="{ title: 'Token Mastery', path: '/tokens' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Puzzle } from "@lucide/vue";

const seoTitle = "Extensions — Skills, Hooks, Subagents, MCP & More";
const seoDescription =
  "The 6 extension layers of Claude Code explained: Skills, Commands, Hooks, Subagents, Agent Teams, MCP, Plugins, and LSP — with a decision framework for when to reach for each.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/extensions",
  type: "article",
  keywords: [
    "claude code extensions",
    "skills",
    "slash commands",
    "hooks",
    "subagents",
    "agent teams",
    "mcp",
    "model context protocol",
    "plugins",
    "lsp",
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
            timeRequired: "PT35M",
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
                name: "Extensions",
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
