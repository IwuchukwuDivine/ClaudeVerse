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
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@vueuse/core"],
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
          property: "og:image",
          content: "/og-image.png",
        },
        {
          property: "og:image:alt",
          content:
            "Claudeverse — The Developer's Universe for Claude Code Mastery",
        },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },

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
        {
          name: "twitter:image",
          content: "/og-image.png",
        },
        {
          name: "twitter:image:alt",
          content:
            "Claudeverse — The Developer's Universe for Claude Code Mastery",
        },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/favicon.png" },
      ],
      script: [
        {
          tagPriority: "critical",
          innerHTML: `(function(){try{var t=localStorage.getItem("claudeverse-theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`,
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
  css: ["~/assets/css/main.css"],
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
