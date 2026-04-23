# Claudeverse

**The developer’s universe for Claude Code mastery** — a structured guide covering mental models, workflows, extension points, token strategy, orchestration, and resources, in one place instead of scattered blog posts.

Live site: [claude-verse.vercel.app](https://claude-verse.vercel.app)

## Stack

- [Nuxt 4](https://nuxt.com/) · Vue 3 · TypeScript (strict type-checking in dev/build)
- [Tailwind CSS 4](https://tailwindcss.com/) (Vite plugin)
- [Pinia](https://pinia.vuejs.org/) with persisted state
- [@nuxt/fonts](https://fonts.nuxt.com/) · [@nuxt/eslint](https://eslint.nuxt.com/) · [@nuxt/hints](https://hints.nuxt.com/) · [nuxt-lucide-icons](https://github.com/sandros94/nuxt-lucide-icons) · [@nuxtjs/sitemap](https://sitemap.nuxtjs.org/) · [@vueuse/core](https://vueuse.org/)

## Prerequisites

- **Node.js** — use an LTS version compatible with Nuxt 4 (see [Nuxt requirements](https://nuxt.com/docs/getting-started/installation)).

## Setup

```bash
npm install
```

You can use `pnpm install`, `yarn install`, or `bun install` instead if you prefer.

## Development

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000) by default.

## Production

Build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Static generation (prerender):

```bash
npm run generate
```

For hosting and platform-specific steps, see the [Nuxt deployment guide](https://nuxt.com/docs/getting-started/deployment).

## Project layout

The app uses Nuxt’s `app/` directory: pages, components, composables, and utilities live under `app/`. Main guide sections and navigation are driven by `app/utils/sections.ts` (routes such as `/foundations`, `/workflows`, `/extensions`, `/tokens`, `/orchestration`, `/resources`, `/teach`, and `/cheatsheet`).

## Documentation

- [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction)
