<template>
  <article>
    <DocsPageHeader
      title="Resources"
      eyebrow="Courses, repos, articles"
      accent="resources"
      :icon="Map"
      description="Curated official docs, free and paid courses, essential GitHub repos, key blog posts, and active communities."
      est-read-time="10 min"
    />
    <DocsComingSoon
      :topics="[
        'Official & free resources',
        'Paid courses',
        'Essential GitHub repos',
        'Key blog posts & articles',
        'Communities & newsletters',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Troubleshooting', path: '/troubleshooting' }"
      :next="{ title: 'Teach It', path: '/teach' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Map } from "@lucide/vue";

const seoTitle = "Resources — The Claude Code Reading List";
const seoDescription =
  "A curated reading list for Claude Code: official Anthropic docs, free and paid courses, essential GitHub repositories, must-read articles, active communities, and newsletters worth subscribing to.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/resources",
  type: "article",
  keywords: [
    "claude code resources",
    "claude code courses",
    "claude code github repos",
    "anthropic docs",
    "ai coding communities",
    "claude code newsletter",
    "claude code in action",
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
                name: "Resources",
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
