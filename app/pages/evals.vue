<template>
  <article>
    <DocsPageHeader
      title="Evals"
      eyebrow="Test your agents"
      accent="evals"
      :icon="FlaskConical"
      description="Why evals matter, golden datasets, LLM-as-judge, regression suites, Anthropic's eval SDK, CI integration, and the real cost of testing agent output."
      est-read-time="20 min"
    />
    <DocsComingSoon
      :topics="[
        'Why evals matter',
        'Golden datasets',
        'LLM-as-judge',
        'Regression suites',
        `Anthropic's eval SDK`,
        'Running evals in CI',
        'The cost of evals',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Orchestration', path: '/orchestration' }"
      :next="{ title: 'Recipes', path: '/recipes' }"
    />
  </article>
</template>

<script setup lang="ts">
import { FlaskConical } from "@lucide/vue";

const seoTitle = "Evals — Testing Claude Code Agents";
const seoDescription =
  "How to build trustworthy Claude Code agents with evaluations: golden datasets, LLM-as-judge scoring, regression suites, CI integration, and the cost of testing.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/evals",
  type: "article",
  keywords: [
    "claude code evals",
    "llm evaluations",
    "llm-as-judge",
    "golden dataset",
    "regression testing agents",
    "anthropic eval sdk",
    "ai testing",
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
            timeRequired: "PT20M",
            about: [
              "LLM evaluations",
              "Agent testing",
              "LLM-as-judge",
              "CI/CD for AI",
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
                name: "Evals",
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
