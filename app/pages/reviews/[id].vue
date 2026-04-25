<template>
  <article>
    <DocsPageHeader
      v-if="page"
      :title="page.title"
      :eyebrow="page.eyebrow ?? 'Field review'"
      :accent="page.accent ?? 'reviews'"
      :icon="iconComponent"
      :description="page.description"
      :est-read-time="page.estReadTime"
      :last-updated="page.lastUpdated"
    />

    <aside v-if="page?.review" class="review-hero">
      <div class="review-hero__row">
        <span
          class="review-hero__tone"
          :data-tone="page.review.verdictTone ?? 'mixed'"
        >
          <LucideCircleCheck
            v-if="page.review.verdictTone === 'positive'"
            :size="13"
            aria-hidden="true"
          />
          <LucideTriangleAlert
            v-else-if="page.review.verdictTone === 'negative'"
            :size="13"
            aria-hidden="true"
          />
          <LucideCircleDot v-else :size="13" aria-hidden="true" />
          {{ toneLabel(page.review.verdictTone) }}
        </span>
        <span v-if="page.review.category" class="review-hero__category">
          {{ page.review.category }}
        </span>
        <a
          v-if="page.review.subjectLink"
          :href="page.review.subjectLink"
          class="review-hero__link"
          target="_blank"
          rel="noopener"
        >
          <LucideExternalLink :size="13" aria-hidden="true" />
          {{ page.review.subject ?? "Project" }}
        </a>
      </div>

      <p v-if="page.review.verdict" class="review-hero__verdict">
        {{ page.review.verdict }}
      </p>

      <dl class="review-hero__meta">
        <div v-if="page.review.lastTested">
          <dt>Last tested</dt>
          <dd>{{ formatDate(page.review.lastTested) }}</dd>
        </div>
        <div v-if="page.review.version">
          <dt>Version</dt>
          <dd>{{ page.review.version }}</dd>
        </div>
        <div v-if="page.review.tags?.length">
          <dt>Tags</dt>
          <dd>
            <ul class="review-hero__tags">
              <li v-for="tag in page.review.tags" :key="tag">{{ tag }}</li>
            </ul>
          </dd>
        </div>
      </dl>
    </aside>

    <div v-if="page" class="docs-content">
      <ContentRenderer :value="page" />
    </div>

    <LazyDocsPageNav
      v-if="page?.prev || page?.next"
      :prev="page.prev"
      :next="page.next"
    />
  </article>
</template>

<script setup lang="ts">
import { Microscope } from "@lucide/vue";
import { resolveLucideIcon } from "~/utils/resolveLucideIcon";
import type { TocItem } from "~/utils/types/nav";

const route = useRoute();

const { data: page } = await useAsyncData(`reviews:${route.path}`, () =>
  queryCollection("docs").path(route.path).first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Review not found",
    fatal: true,
  });
}

const iconComponent = computed(
  () => resolveLucideIcon(page.value?.icon) ?? Microscope,
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

const seoTitle = computed(
  () => page.value?.seo?.title ?? page.value?.title ?? "",
);
const seoDescription = computed(
  () => page.value?.seo?.description ?? page.value?.description ?? "",
);

const { url, image } = useSeo({
  title: seoTitle.value,
  description: seoDescription.value,
  path: route.path,
  type: "article",
  keywords: page.value?.seo?.keywords,
  image: page.value?.seo?.ogImage,
});

if (page.value) {
  defineOgImage("Default", {
    title: page.value.title,
    eyebrow: page.value.eyebrow ?? "Field review",
    description: page.value.review?.verdict ?? page.value.description,
    accent: page.value.accent ?? "reviews",
    readTime: page.value.estReadTime,
  });
}

const ratingForTone = (tone?: string): number | undefined => {
  if (tone === "positive") return 4.5;
  if (tone === "negative") return 2;
  if (tone === "mixed") return 3;
  return undefined;
};

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TechArticle",
            headline: seoTitle.value,
            description: seoDescription.value,
            url,
            image,
            inLanguage: "en-US",
            author: { "@type": "Organization", name: "Claudeverse" },
            publisher: {
              "@type": "Organization",
              name: "Claudeverse",
              logo: {
                "@type": "ImageObject",
                url: getAbsoluteUrl("/logo.png"),
              },
            },
            mainEntityOfPage: url,
            ...(page.value?.lastUpdated
              ? { dateModified: page.value.lastUpdated }
              : {}),
            ...(page.value?.seo?.proficiencyLevel
              ? { proficiencyLevel: page.value.seo.proficiencyLevel }
              : {}),
            ...(page.value?.seo?.timeRequired
              ? { timeRequired: page.value.seo.timeRequired }
              : {}),
          },
          ...(page.value?.review
            ? [
                {
                  "@type": "Review",
                  itemReviewed: {
                    "@type": "SoftwareApplication",
                    name: page.value.review.subject ?? page.value.title,
                    ...(page.value.review.subjectLink
                      ? { url: page.value.review.subjectLink }
                      : {}),
                    ...(page.value.review.category
                      ? { applicationCategory: page.value.review.category }
                      : {}),
                  },
                  reviewBody: page.value.review.verdict,
                  author: { "@type": "Organization", name: "Claudeverse" },
                  ...(page.value.review.lastTested
                    ? { datePublished: page.value.review.lastTested }
                    : {}),
                  ...(ratingForTone(page.value.review.verdictTone) !== undefined
                    ? {
                        reviewRating: {
                          "@type": "Rating",
                          ratingValue: ratingForTone(
                            page.value.review.verdictTone,
                          ),
                          bestRating: 5,
                          worstRating: 1,
                        },
                      }
                    : {}),
                },
              ]
            : []),
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: getAbsoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Reviews",
                item: getAbsoluteUrl("/reviews"),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: page.value?.title ?? "",
                item: url,
              },
            ],
          },
        ],
      }),
    },
  ],
});

const { setItems } = useToc();

const tocItems = computed<TocItem[]>(() =>
  (page.value?.tocItems ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    level: (item.level ?? 2) as 2 | 3,
  })),
);

onMounted(() => setItems(tocItems.value));
onBeforeUnmount(() => setItems([]));
</script>

<style scoped>
.review-hero {
  margin: 0 0 2rem;
  padding: 1.25rem 1.375rem;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent-reviews);
  border-radius: var(--radius-lg);
  background: var(--surface);
}
.review-hero__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
}
.review-hero__tone {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.25rem 0.625rem;
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
.review-hero__tone[data-tone="positive"] {
  background: var(--accent-resources-wash);
  color: var(--accent-resources);
  border-color: color-mix(in oklab, var(--accent-resources) 30%, transparent);
}
.review-hero__tone[data-tone="mixed"] {
  background: var(--accent-tokens-wash);
  color: var(--accent-tokens);
  border-color: color-mix(in oklab, var(--accent-tokens) 30%, transparent);
}
.review-hero__tone[data-tone="negative"] {
  background: var(--accent-troubleshooting-wash);
  color: var(--accent-troubleshooting);
  border-color: color-mix(
    in oklab,
    var(--accent-troubleshooting) 30%,
    transparent
  );
}
.review-hero__category {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.review-hero__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  margin-left: auto;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-bottom: 1px dashed var(--border);
  padding-bottom: 0.0625rem;
  transition:
    color 160ms ease,
    border-color 160ms ease;
}
.review-hero__link:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.review-hero__verdict {
  font-size: 1.0625rem;
  line-height: 1.55;
  color: var(--text-primary);
  margin: 0;
}

.review-hero__meta {
  margin: 1rem 0 0;
  padding: 0.875rem 0 0;
  border-top: 1px dashed var(--border-subtle);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 0.875rem 1.5rem;
}
.review-hero__meta div {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.review-hero__meta dt {
  font-family: var(--font-display);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}
.review-hero__meta dd {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-primary);
}
.review-hero__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.review-hero__tags li {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  color: var(--text-secondary);
}
</style>
