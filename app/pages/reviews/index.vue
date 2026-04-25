<template>
  <article>
    <DocsPageHeader
      title="Reviews"
      eyebrow="Field-tested takes"
      accent="reviews"
      :icon="Microscope"
      description="Honest, repeatable benchmarks of plugins, MCPs, orchestrators, and add-ons. Each review ships with methodology, raw numbers, and an explicit when-it-helps / when-it-hurts call so you can decide based on your workflow — not someone's README."
    />

    <div class="reviews-intro">
      <p>
        Reviews go stale. Every entry below carries a
        <strong>last tested</strong> date and the version it was tested against
        — if it's older than a few months, treat the verdict as a starting
        point, not the answer.
      </p>
    </div>

    <ul v-if="reviews.length" class="reviews-grid">
      <li v-for="review in reviews" :key="review.path" class="reviews-card">
        <NuxtLink :to="review.path" class="reviews-card__link">
          <div class="reviews-card__head">
            <span
              class="reviews-card__tone"
              :data-tone="review.review?.verdictTone ?? 'mixed'"
            >
              <LucideCircleCheck
                v-if="review.review?.verdictTone === 'positive'"
                :size="12"
                aria-hidden="true"
              />
              <LucideTriangleAlert
                v-else-if="review.review?.verdictTone === 'negative'"
                :size="12"
                aria-hidden="true"
              />
              <LucideCircleDot v-else :size="12" aria-hidden="true" />
              {{ toneLabel(review.review?.verdictTone) }}
            </span>
            <span v-if="review.review?.category" class="reviews-card__category">
              {{ review.review.category }}
            </span>
          </div>

          <h2 class="reviews-card__title">{{ review.title }}</h2>
          <p v-if="review.review?.verdict" class="reviews-card__verdict">
            {{ review.review.verdict }}
          </p>

          <ul
            v-if="review.review?.tags?.length"
            class="reviews-card__tags"
            aria-label="Tags"
          >
            <li v-for="tag in review.review.tags" :key="tag">{{ tag }}</li>
          </ul>

          <div class="reviews-card__meta">
            <span v-if="review.review?.lastTested">
              <LucideHistory :size="12" aria-hidden="true" />
              Tested {{ formatDate(review.review.lastTested) }}
            </span>
            <span v-if="review.review?.version">
              <LucideTag :size="12" aria-hidden="true" />
              {{ review.review.version }}
            </span>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <DocsComingSoon v-else label="More reviews coming">
      We're rolling out the first reviews now. Check back soon, or
      <a href="https://github.com/Dee-Vyn/Claudeverse/issues/new" rel="noopener"
        >suggest one to test</a
      >.
    </DocsComingSoon>
  </article>
</template>

<script setup lang="ts">
import { Microscope } from "@lucide/vue";

interface ReviewDoc {
  path: string;
  title: string;
  description?: string;
  review?: {
    subject?: string;
    subjectLink?: string;
    category?: string;
    version?: string;
    lastTested?: string;
    verdict?: string;
    verdictTone?: "positive" | "mixed" | "negative";
    tags?: string[];
  };
}

const { data: reviews } = await useAsyncData<ReviewDoc[]>("reviews:list", () =>
  queryCollection("docs")
    .where("path", "LIKE", "/reviews/%")
    .order("lastUpdated", "DESC")
    .all() as unknown as Promise<ReviewDoc[]>,
  { default: () => [] as ReviewDoc[] },
);

const toneLabel = (tone?: string) => {
  if (tone === "positive") return "Recommended";
  if (tone === "negative") return "Skip";
  return "Mixed";
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const title = "Reviews — field-tested benchmarks of Claude Code add-ons";
const description =
  "Honest reviews of Claude Code plugins, MCPs, and orchestrators. Methodology, real numbers, and explicit trade-offs so you can decide based on your workflow.";

const { url } = useSeo({
  title,
  description,
  path: "/reviews",
  type: "website",
  keywords: [
    "claude code reviews",
    "claude code plugins",
    "claude code mcp",
    "field notes",
    "benchmarks",
  ],
});

defineOgImage("Default", {
  title: "Reviews",
  eyebrow: "Field-tested takes",
  description:
    "Honest benchmarks of Claude Code plugins, MCPs, orchestrators, and add-ons.",
  accent: "reviews",
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: title,
        description,
        url,
      }),
    },
  ],
});

const { clear } = useToc();
clear();
</script>

<style scoped>
.reviews-intro {
  margin: 0 0 1.5rem;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
  max-width: 44rem;
}
.reviews-intro strong {
  color: var(--text-primary);
}

.reviews-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1rem;
}

.reviews-card {
  display: flex;
}
.reviews-card__link {
  --accent: var(--accent-reviews);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.25rem;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-primary);
  overflow: hidden;
  transition:
    border-color 200ms ease,
    transform 200ms ease,
    box-shadow 200ms ease;
}
.reviews-card__link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
  opacity: 0.5;
  transition: opacity 200ms ease;
}
.reviews-card__link:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
}
.reviews-card__link:hover::before {
  opacity: 1;
}

.reviews-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.reviews-card__tone {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1875rem 0.5rem;
  font-family: var(--font-display);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: var(--radius-pill);
  background: var(--surface-elevated);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}
.reviews-card__tone[data-tone="positive"] {
  background: var(--accent-resources-wash);
  color: var(--accent-resources);
  border-color: color-mix(in oklab, var(--accent-resources) 30%, transparent);
}
.reviews-card__tone[data-tone="mixed"] {
  background: var(--accent-tokens-wash);
  color: var(--accent-tokens);
  border-color: color-mix(in oklab, var(--accent-tokens) 30%, transparent);
}
.reviews-card__tone[data-tone="negative"] {
  background: var(--accent-troubleshooting-wash);
  color: var(--accent-troubleshooting);
  border-color: color-mix(
    in oklab,
    var(--accent-troubleshooting) 30%,
    transparent
  );
}
.reviews-card__category {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.reviews-card__title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.125rem 0 0;
  letter-spacing: -0.01em;
}
.reviews-card__verdict {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
  flex: 1;
}

.reviews-card__tags {
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.reviews-card__tags li {
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--surface-sunken);
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-subtle);
}

.reviews-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border-subtle);
  font-size: 0.75rem;
  color: var(--text-muted);
}
.reviews-card__meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
