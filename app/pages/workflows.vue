<template>
  <article>
    <DocsPageHeader
      title="Workflows"
      eyebrow="Plan → execute"
      accent="workflows"
      :icon="Zap"
      description="The 4-phase workflow, Plan Mode, feedback loops, prompt precision, session management, and context handoff between sessions."
      est-read-time="20 min"
    />
    <DocsComingSoon
      :topics="[
        'The 4-phase workflow',
        'Plan Mode (Shift+Tab×2)',
        'When to skip planning',
        'Feedback loops with tests & LSP',
        'Prompt precision patterns',
        'Session management',
        'The Big Prompt pattern',
        'Best of N',
        'Context handoff between sessions',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Foundations', path: '/foundations' }"
      :next="{ title: 'Extensions', path: '/extensions' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Zap } from "@lucide/vue";

useSeoMeta({
  title: "Workflows",
  description:
    "The 4-phase plan → execute workflow, feedback loops, prompt precision, session management, and context handoff patterns for Claude Code.",
});
const { clear } = useToc();
clear();
</script>
