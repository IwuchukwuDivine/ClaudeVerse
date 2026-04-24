interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "book";
  keywords?: string[];
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
}

const DEFAULT_AUTHOR = "Claudeverse";
const TWITTER_HANDLE = "@_DeeVyn";
const SITE_NAME = "Claudeverse";

export const useSeo = (opts: SeoOptions) => {
  const url = getAbsoluteUrl(opts.path);
  // Images are generated per-page by `nuxt-og-image` via `defineOgImage`.
  // Only emit explicit og/twitter image meta when a caller hand-provides one
  // (e.g. an authored PNG via `seo.ogImage` frontmatter).
  const image = opts.image ? getAbsoluteUrl(opts.image) : undefined;
  const type = opts.type ?? "website";

  useSeoMeta({
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords?.join(", "),
    author: opts.author ?? DEFAULT_AUTHOR,

    ogTitle: opts.title,
    ogDescription: opts.description,
    ogUrl: url,
    ogType: type,
    ogSiteName: SITE_NAME,
    ogLocale: "en_US",
    ...(image
      ? {
          ogImage: image,
          ogImageAlt: opts.title,
          ogImageWidth: 1200,
          ogImageHeight: 630,
          ogImageType: "image/png",
        }
      : {}),

    twitterCard: "summary_large_image",
    twitterTitle: opts.title,
    twitterDescription: opts.description,
    twitterSite: TWITTER_HANDLE,
    twitterCreator: TWITTER_HANDLE,
    ...(image ? { twitterImage: image, twitterImageAlt: opts.title } : {}),

    ...(type === "article" && opts.publishedAt
      ? { articlePublishedTime: opts.publishedAt }
      : {}),
    ...(type === "article" && opts.modifiedAt
      ? { articleModifiedTime: opts.modifiedAt }
      : {}),
    ...(type === "article" && opts.author
      ? { articleAuthor: [opts.author] }
      : {}),
  });

  useHead({
    link: [{ rel: "canonical", href: url }],
  });

  return { url, image };
};
