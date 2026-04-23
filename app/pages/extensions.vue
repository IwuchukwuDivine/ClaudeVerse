<template>
  <article>
    <DocsPageHeader
      title="Extensions"
      eyebrow="The 6 layers"
      accent="extensions"
      :icon="Puzzle"
      description="Skills, Commands, Hooks, Subagents, Agent Teams, MCP, Plugins, and LSP — when to reach for each and how they fit together."
      est-read-time="35 min"
    />
    <DocsComingSoon
      :topics="[
        'Decision framework: which extension, when',
        'Skills — auto-triggering expertise',
        'Commands — slash templates',
        'Hooks — deterministic guardrails',
        'Subagents — isolated workers',
        'Agent Teams — collaborative squads',
        'MCP — external service integration',
        'Plugins — bundled extensions',
        'LSP — automatic diagnostics',
      ]"
    />
    <DocsPageNav
      :prev="{ title: 'Workflows', path: '/workflows' }"
      :next="{ title: 'Token Mastery', path: '/tokens' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Puzzle } from "@lucide/vue";

useSeoMeta({
  title: "Extensions",
  description:
    "The 6 extension points of Claude Code: Skills, Commands, Hooks, Subagents, Agent Teams, MCP, Plugins, and LSP.",
});
const { clear } = useToc();
clear();
</script>
