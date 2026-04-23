<template>
  <article>
    <DocsPageHeader
      title="Teach It"
      eyebrow="Workshop curriculum"
      accent="teach"
      :icon="GraduationCap"
      description="A 10-hour, 5-module curriculum with exercises and talking points — ready to deliver as a workshop or internal training."
      est-read-time="15 min"
    />
    <DocsComingSoon
      :topics="[
        'Module 1 — Foundations (2 hours)',
        'Module 2 — Plan → Execute (2 hours)',
        'Module 3 — Extension Points (3 hours)',
        'Module 4 — Multi-Agent & Orchestration (2 hours)',
        'Module 5 — Token Mastery & Production (1 hour)',
        'Ready-to-run exercises pack',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Resources', path: '/resources' }"
      :next="{ title: 'Cheatsheet', path: '/cheatsheet' }"
    />
  </article>
</template>

<script setup lang="ts">
import { GraduationCap } from "@lucide/vue";

const seoTitle = "Teach It — A 10-Hour Claude Code Workshop Curriculum";
const seoDescription =
  "A ready-made 10-hour, 5-module curriculum for teaching Claude Code mastery: Foundations, Plan → Execute, Extensions, Multi-Agent, and Token Mastery — with exercises, talking points, and a printable exercises pack.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/teach",
  type: "article",
  keywords: [
    "claude code workshop",
    "claude code curriculum",
    "ai coding training",
    "developer workshop",
    "claude code exercises",
    "teach ai coding",
    "internal training",
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
            "@type": "Course",
            name: seoTitle,
            description: seoDescription,
            url,
            image,
            inLanguage: "en-US",
            provider: {
              "@type": "Organization",
              name: "Claudeverse",
              url: getAbsoluteUrl("/"),
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "self-paced",
              courseWorkload: "PT10H",
            },
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
                name: "Teach It",
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
