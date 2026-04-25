<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '80px',
      background: `linear-gradient(135deg, #0f172a 0%, #1e293b 65%, ${accentColor}14 100%)`,
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
    }"
  >
    <div
      :style="{
        display: 'flex',
        position: 'absolute',
        top: '-160px',
        right: '-160px',
        width: '520px',
        height: '520px',
        borderRadius: '260px',
        background: `radial-gradient(circle, ${accentColor}30 0%, transparent 65%)`,
      }"
    />

    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }"
    >
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: `linear-gradient(135deg, ${accentColor}, #db2777)`,
          fontSize: '34px',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }"
      >
        C
      </div>
      <div
        :style="{
          display: 'flex',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: '#f8fafc',
        }"
      >
        Claudeverse
      </div>
    </div>

    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }"
    >
      <div
        v-if="eyebrow"
        :style="{
          display: 'flex',
          fontSize: '24px',
          fontWeight: 600,
          color: accentColor,
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }"
      >
        {{ eyebrow }}
      </div>
      <div
        :style="{
          display: 'flex',
          fontSize: '84px',
          fontWeight: 700,
          letterSpacing: '-3px',
          lineHeight: 1.05,
          color: '#f8fafc',
          maxWidth: '1040px',
        }"
      >
        {{ title }}
      </div>
      <div
        v-if="trimmedDescription"
        :style="{
          display: 'flex',
          fontSize: '28px',
          lineHeight: 1.35,
          color: '#cbd5e1',
          maxWidth: '1000px',
        }"
      >
        {{ trimmedDescription }}
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
      <div :style="{ display: 'flex' }">claude-verse.vercel.app</div>
      <div
        v-if="readTime"
        :style="{
          display: 'flex',
          alignItems: 'center',
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
  reviews: "#2dd4bf",
};

const accentColor = computed(
  () => ACCENT_COLORS[props.accent] ?? ACCENT_COLORS.home,
);

// Satori has no line-clamp; truncate at ~160 chars so long descriptions
// don't overflow the card.
const trimmedDescription = computed(() => {
  const d = (props.description ?? "").trim();
  if (!d) return "";
  if (d.length <= 180) return d;
  return d.slice(0, 177).trimEnd() + "…";
});
</script>
