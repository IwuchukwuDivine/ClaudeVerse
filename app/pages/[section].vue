<template>
  <article>
    <DocsPageHeader
      v-if="page"
      :title="page.title"
      :eyebrow="page.eyebrow"
      :accent="page.accent"
      :icon="iconComponent"
      :description="page.description"
      :est-read-time="page.estReadTime"
      :last-updated="page.lastUpdated"
    />

    <div v-if="page" class="docs-content">
      <ContentRenderer :value="page" />
    </div>

    <DocsPageNav
      v-if="page?.prev || page?.next"
      :prev="page.prev"
      :next="page.next"
    />
  </article>
</template>

<script setup lang="ts">
import { BookOpen } from "@lucide/vue";
import { resolveLucideIcon } from "~/utils/resolveLucideIcon";
import type { TocItem } from "~/utils/types/nav";

const route = useRoute();

const { data: page } = await useAsyncData(`docs:${route.path}`, () =>
  queryCollection("docs").path(route.path).first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const iconComponent = computed(
  () => resolveLucideIcon(page.value?.icon) ?? BookOpen,
);

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
    eyebrow: page.value.eyebrow,
    description: page.value.description,
    accent: page.value.accent,
    readTime: page.value.estReadTime,
  });
}

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
