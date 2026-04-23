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

useSeoMeta({
  title: "Cheatsheet",
  description:
    "Claude Code cheatsheet — slash commands, keyboard shortcuts, CLI flags, file structure, and common patterns.",
});
const { clear } = useToc();
clear();
</script>
