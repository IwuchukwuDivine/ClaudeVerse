<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="label"
    :title="label"
    @click="toggle"
  >
    <LucideSun v-if="mounted && isDark" :size="18" />
    <LucideMoon v-else :size="18" />
  </button>
</template>

<script setup lang="ts">
import { useMounted } from "@vueuse/core";

const { toggle, isDark } = useTheme();
const mounted = useMounted();

const label = computed(() =>
  mounted.value
    ? isDark.value
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle theme",
);
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.25rem;
  width: 2.25rem;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease,
    border-color 160ms ease;
}
.theme-toggle:hover {
  background: var(--surface-elevated);
  color: var(--text-primary);
  border-color: var(--border);
}
</style>
