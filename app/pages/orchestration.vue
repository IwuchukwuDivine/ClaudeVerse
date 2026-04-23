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

useSeoMeta({
  title: "Orchestration",
  description:
    "Multi-agent orchestration for Claude Code — subagents, Agent Teams, git worktrees, and external orchestrators compared.",
});
const { clear } = useToc();
clear();
</script>
