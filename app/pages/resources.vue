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
      :prev="{ title: 'Orchestration', path: '/orchestration' }"
      :next="{ title: 'Teach It', path: '/teach' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Map } from "@lucide/vue";

useSeoMeta({
  title: "Resources",
  description:
    "Curated Claude Code resources — official docs, courses, GitHub repos, articles, and communities.",
});
const { clear } = useToc();
clear();
</script>
