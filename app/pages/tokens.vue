<template>
  <article>
    <DocsPageHeader
      title="Token Mastery"
      eyebrow="Cut usage in half"
      accent="tokens"
      :icon="Coins"
      description="Why tokens matter, the three highest-impact fixes, monitoring, CLAUDE.md diet, model routing, and team cost control."
      est-read-time="20 min"
    />
    <DocsComingSoon
      :topics="[
        'Why tokens matter',
        'The 3 fixes that cut usage in half',
        'Monitor your usage',
        'CLAUDE.md token diet',
        'Tiered context architecture',
        'Compact strategies',
        'Model routing (Opus/Sonnet/Haiku)',
        'Subagent economics',
        'Hook-based output control',
        'Team cost management',
        'The token-efficient session template',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Extensions', path: '/extensions' }"
      :next="{ title: 'Orchestration', path: '/orchestration' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Coins } from "@lucide/vue";

useSeoMeta({
  title: "Token Mastery",
  description:
    "Cut Claude Code token usage in half — monitoring, CLAUDE.md diet, model routing, and team cost control.",
});
const { clear } = useToc();
clear();
</script>
