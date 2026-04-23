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

useSeoMeta({
  title: "Teach It",
  description:
    "A 10-hour, 5-module workshop curriculum for teaching Claude Code mastery, with ready-to-run exercises.",
});
const { clear } = useToc();
clear();
</script>
