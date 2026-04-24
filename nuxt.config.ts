import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/fonts",
    "@nuxt/hints",
    "@nuxt/eslint",
    "nuxt-lucide-icons",
    "@nuxtjs/sitemap",
    "@nuxt/content",
    "nuxt-og-image",
    "@vercel/analytics",
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@vueuse/core",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "@lucide/vue",
      ],
    },
  },
  content: {
    build: {
      markdown: {
        // Syntax highlighting for code blocks (ProsePre / ProseCode)
        highlight: {
          theme: "github-light",
          langs: [
            "bash",
            "shell",
            "json",
            "yaml",
            "markdown",
            "javascript",
            "typescript",
            "vue",
            "html",
            "css",
          ],
        },
      },
    },
  },
  typescript: {
    typeCheck: true,
  },
  site: {
    url: "https://claude-verse.vercel.app",
    name: "Claudeverse",
  },
  sitemap: {
    defaults: {
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    },
    sitemaps: false,
  },
  app: {
    head: {
      title: "Claudeverse",
      titleTemplate: "%s | Claudeverse",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "description",
          content: "The Developer's Universe for Claude Code Mastery",
        },
        { name: "theme-color", content: "#d96a3f" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Claudeverse" },
        {
          property: "og:title",
          content:
            "Claudeverse — The Developer's Universe for Claude Code Mastery",
        },
        {
          property: "og:description",
          content: "The Developer's Universe for Claude Code Mastery",
        },
        {
          property: "og:url",
          content: "https://claude-verse.vercel.app",
        },

        // Twitter / X Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@_DeeVyn" },
        {
          name: "twitter:title",
          content:
            "Claudeverse — The Developer's Universe for Claude Code Mastery",
        },
        {
          name: "twitter:description",
          content: "The Developer's Universe for Claude Code Mastery",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
      script: [
        {
          tagPriority: "critical",
          innerHTML: `(function(){try{var t=localStorage.getItem("claudeverse-theme");if(t!=="light")document.documentElement.classList.add("dark");}catch(e){document.documentElement.classList.add("dark");}})();`,
        },
      ],
    },
  },
  fonts: {
    families: [
      {
        name: "DM Sans",
        src: "~/assets/fonts/DMSans-Regular.ttf",
        weight: 400,
      },
      {
        name: "DM Sans",
        src: "~/assets/fonts/DMSans-Italic.ttf",
        weight: 400,
        style: "italic",
      },
      { name: "DM Sans", src: "~/assets/fonts/DMSans-Medium.ttf", weight: 500 },
      {
        name: "DM Sans",
        src: "~/assets/fonts/DMSans-MediumItalic.ttf",
        weight: 500,
        style: "italic",
      },
      {
        name: "DM Sans",
        src: "~/assets/fonts/DMSans-SemiBold.ttf",
        weight: 600,
      },
      {
        name: "DM Sans",
        src: "~/assets/fonts/DMSans-SemiBoldItalic.ttf",
        weight: 600,
        style: "italic",
      },
      { name: "DM Sans", src: "~/assets/fonts/DMSans-Bold.ttf", weight: 700 },
      {
        name: "DM Sans",
        src: "~/assets/fonts/DMSans-BoldItalic.ttf",
        weight: 700,
        style: "italic",
      },
      {
        name: "Fredoka",
        src: "~/assets/fonts/Fredoka-Regular.ttf",
        weight: 400,
      },
      {
        name: "Fredoka",
        src: "~/assets/fonts/Fredoka-Medium.ttf",
        weight: 500,
      },
      {
        name: "Fredoka",
        src: "~/assets/fonts/Fredoka-SemiBold.ttf",
        weight: 600,
      },
      { name: "Fredoka", src: "~/assets/fonts/Fredoka-Bold.ttf", weight: 700 },
    ],
  },
  ogImage: {
    zeroRuntime: true,
  },
  css: ["~/assets/css/main.css", "~/assets/css/prose.css"],
  components: true,
  ssr: true,
  devServer: {
    host: "0.0.0.0",
  },
  nitro: {
    prerender: {
      routes: ["/", "/sitemap.xml"],
      crawlLinks: true,
    },
  },
});
