<template>
  <article>
    <DocsPageHeader
      title="Cheatsheet"
      eyebrow="Quick reference"
      accent="cheatsheet"
      :icon="Keyboard"
      description="Commands, keyboard shortcuts, CLI flags, file structure, and common patterns — designed to be printable."
      est-read-time="5 min"
    />
    <DocsComingSoon
      :topics="[
        'Slash commands',
        'Keyboard shortcuts',
        'CLI flags',
        'File structure',
        'Common patterns',
      ]"
    />
    <DocsPageNav :prev="{ title: 'Teach It', path: '/teach' }" />
  </article>
</template>

<script setup lang="ts">
import { Keyboard } from "@lucide/vue";

const seoTitle = "Cheatsheet — Claude Code Quick Reference";
const seoDescription =
  "The printable Claude Code cheatsheet: slash commands, keyboard shortcuts, CLI flags, file structure, and the patterns you reach for every day.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/cheatsheet",
  type: "article",
  keywords: [
    "claude code cheatsheet",
    "slash commands",
    "keyboard shortcuts",
    "cli flags",
    "quick reference",
    "claude code patterns",
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
            timeRequired: "PT5M",
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
                name: "Cheatsheet",
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
