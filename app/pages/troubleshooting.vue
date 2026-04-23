<template>
  <article>
    <DocsPageHeader
      title="Troubleshooting"
      eyebrow="When things break"
      accent="troubleshooting"
      :icon="LifeBuoy"
      description="Common Claude Code failure modes and how to fix them: context issues, hooks that don't fire, MCP connection errors, runaway tokens, rate limits, and auth problems."
      est-read-time="10 min"
    />
    <DocsComingSoon
      :topics="[
        `Claude can't see my file`,
        'Out-of-context errors',
        `Hook didn't fire`,
        `MCP won't connect`,
        'Tokens exploding',
        'Rate limit errors',
        'Auth & login issues',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Recipes', path: '/recipes' }"
      :next="{ title: 'Resources', path: '/resources' }"
    />
  </article>
</template>

<script setup lang="ts">
import { LifeBuoy } from "@lucide/vue";

const seoTitle = "Troubleshooting — Fixing Claude Code When It Breaks";
const seoDescription =
  "A field guide to Claude Code's most common failure modes: missing context, broken hooks, MCP connection errors, token blow-ups, rate limits, and login issues — with fixes.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/troubleshooting",
  type: "article",
  keywords: [
    "claude code troubleshooting",
    "claude code errors",
    "mcp connection error",
    "claude code context issues",
    "claude code rate limits",
    "fix claude code hooks",
    "ai agent debugging",
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
            timeRequired: "PT10M",
            about: [
              "Claude Code troubleshooting",
              "MCP errors",
              "Agent debugging",
              "Rate limits",
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
                name: "Troubleshooting",
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
