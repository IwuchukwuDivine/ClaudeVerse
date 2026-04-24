<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '80px',
      background: `linear-gradient(135deg, #0f172a 0%, #1e293b 55%, ${accentColor}22 100%)`,
      color: '#f8fafc',
      fontFamily: 'DM Sans, Inter, system-ui, sans-serif',
      position: 'relative',
    }"
  >
    <div
      :style="{
        position: 'absolute',
        top: '-160px',
        right: '-160px',
        width: '520px',
        height: '520px',
        borderRadius: '9999px',
        background: `radial-gradient(circle, ${accentColor}55 0%, transparent 70%)`,
      }"
    />

    <div :style="{ display: 'flex', alignItems: 'center', gap: '16px' }">
      <div
        :style="{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: `linear-gradient(135deg, ${accentColor}, #db2777)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
        }"
      >
        ✦
      </div>
      <div
        :style="{
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.01em',
        }"
      >
        Claudeverse
      </div>
    </div>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '24px' }">
      <div
        v-if="eyebrow"
        :style="{
          fontSize: '24px',
          fontWeight: 600,
          color: accentColor,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }"
      >
        {{ eyebrow }}
      </div>
      <div
        :style="{
          fontSize: '88px',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          maxWidth: '1000px',
        }"
      >
        {{ title }}
      </div>
      <div
        v-if="description"
        :style="{
          fontSize: '28px',
          color: '#cbd5e1',
          lineHeight: 1.35,
          maxWidth: '960px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }"
      >
        {{ description }}
      </div>
    </div>

    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '22px',
        color: '#94a3b8',
      }"
    >
      <div>claude-verse.vercel.app</div>
      <div
        v-if="readTime"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 20px',
          borderRadius: '9999px',
          background: `${accentColor}20`,
          color: accentColor,
          fontWeight: 500,
        }"
      >
        {{ readTime }} read
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccentKey } from "~/utils/types/nav";

const props = withDefaults(
  defineProps<{
    title: string;
    eyebrow?: string;
    description?: string;
    accent?: AccentKey;
    readTime?: string;
  }>(),
  {
    eyebrow: "",
    description: "",
    accent: "home",
    readTime: "",
  },
);

const ACCENT_COLORS: Record<AccentKey, string> = {
  home: "#2dd4bf",
  foundations: "#a78bfa",
  workflows: "#fb923c",
  extensions: "#60a5fa",
  tokens: "#fcd34d",
  orchestration: "#f472b6",
  evals: "#34d399",
  recipes: "#e879f9",
  troubleshooting: "#fb7185",
  resources: "#a3e635",
  workshops: "#f87171",
  cheatsheet: "#22d3ee",
};

const accentColor = computed(
  () => ACCENT_COLORS[props.accent] ?? ACCENT_COLORS.home,
);
</script>
