import { resolve } from "node:path";
import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const contentDir = resolve(__dirname, "app/content");

const tocItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.union([z.literal(2), z.literal(3)]).default(2),
});

const navLinkSchema = z.object({
  title: z.string(),
  path: z.string(),
});

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: "page",
      source: {
        include: "**/*.md",
        cwd: contentDir,
        prefix: "",
      },
      schema: z.object({
        title: z.string(),
        eyebrow: z.string().optional(),
        description: z.string(),
        icon: z.string().optional(),
        accent: z
          .enum([
            "home",
            "foundations",
            "workflows",
            "extensions",
            "tokens",
            "orchestration",
            "evals",
            "recipes",
            "troubleshooting",
            "resources",
            "workshops",
            "cheatsheet",
          ])
          .default("home"),
        estReadTime: z.string().optional(),
        lastUpdated: z.string().optional(),
        intro: z.string().optional(),
        tocItems: z.array(tocItemSchema).default([]),
        prev: navLinkSchema.optional(),
        next: navLinkSchema.optional(),
        seo: z
          .object({
            title: z.string(),
            description: z.string(),
            keywords: z.array(z.string()).default([]),
            proficiencyLevel: z.string().optional(),
            timeRequired: z.string().optional(),
            ogImage: z.string().optional(),
          })
          .optional(),
      }),
    }),
  },
});
