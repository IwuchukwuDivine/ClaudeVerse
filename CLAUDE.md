# Claudeverse

Nuxt 4 + Vue 3 + TypeScript guide site covering Claude Code mastery. Content lives in Markdown under `app/content/` via `@nuxt/content`.

## Stack

- Nuxt 4, Vue 3, TypeScript (strict type-checking in dev/build)
- Tailwind CSS 4 (Vite plugin)
- `@nuxt/content` v3 for Markdown pages (`app/content/**/*.md`)
- `@nuxt/fonts`, `@nuxtjs/sitemap`, `nuxt-og-image`, `nuxt-lucide-icons`
- `@vueuse/core` for composables, `@vueuse/integrations` for focus trap

## Commands

```bash
npm run dev        # dev server on :3000 (0.0.0.0)
npm run build      # production build
npm run generate   # static prerender (used for deploy)
npm run preview    # preview built output
```

`postinstall` runs `nuxt prepare`. Type-checking is enabled in `nuxt.config.ts` (`typescript.typeCheck: true`), so `build` and `generate` will fail on type errors.

## Layout

- `app/pages/` — `index.vue` (home) and `[section].vue` (catch-all that resolves a `@nuxt/content` doc)
- `app/content/*.md` — guide pages, one per section; frontmatter is validated by `content.config.ts`
- `app/components/App/` — chrome (Navbar, Sidebar, Toc, SearchDialog, ThemeToggle)
- `app/components/Docs/` — page chrome for doc pages (PageHeader, Section, Callout, PageNav, Prose)
- `app/components/content/ProsePre.vue` — overrides `@nuxt/content`'s default `<pre>` renderer; syntax highlighting configured via `content.build.markdown.highlight` in `nuxt.config.ts`
- `app/components/OgImage/Default.satori.vue` — template for per-route OG images (`.satori.vue` suffix required by `nuxt-og-image` v6 scanner)
- `app/composables/` — `useSearch`, `useSeo`, `useTheme`, `useToc`
- `app/utils/search/` — search providers + registry; `contentProvider` emits records per page AND per heading
- `app/utils/sections.ts` — sidebar/nav source of truth (route list)

## Content conventions

- Schema is in `content.config.ts`. Frontmatter fields: `title`, `description`, `accent` (one of the section keys), `eyebrow`, `icon`, `estReadTime`, `lastUpdated` (`YYYY-MM-DD`), `intro`, `tocItems`, `prev`/`next`, and optional `seo` block.
- `accent` drives section colors across Sidebar, search rows, OG images, and PageHeader.
- To add a new section: create `app/content/<slug>.md`, add the route to `app/utils/sections.ts`, extend the `accent` enum in `content.config.ts`, and add matching `--accent-<slug>` CSS vars in `assets/css/main.css`.
- OG images are generated per-route by `nuxt-og-image` at build; `seo.ogImage` in frontmatter overrides with a hand-authored PNG.

## Patterns to know

- **Icons**: frontmatter `icon` strings are resolved via `app/utils/resolveLucideIcon.ts`, which uses an explicit allow-list (do not reintroduce `import * as LucideIcons` — it breaks tree-shaking). If a content page references a new icon, add it to the allow-list.
- **Search**: providers in `app/utils/search/providers/` are registered in `registry.ts` with a priority. Higher priority wins ties. `sections` (nav) has the highest priority; `content` (body) is below it so exact nav matches still win.
- **Theme**: dark mode is default. A critical inline script in `nuxt.config.ts` reads `localStorage["claudeverse-theme"]` pre-hydration to avoid FOUC.
- **Sidebar links**: in-page navigation uses `<NuxtLink>`, not `<a>`, so IntersectionObserver-driven active state keeps working.
- **Accessibility**: decorative Lucide icons get `aria-hidden="true"`; active nav gets `aria-current="page"` or `aria-current="location"`.

## Don'ts

- Don't use `import * as LucideIcons` — it pulls the whole icon set into the client bundle. Use the allow-list in `resolveLucideIcon.ts`.
- Don't duplicate `ProsePre.vue` into a separate `CodeBlock.vue` — `@nuxt/content` only wires `ProsePre`.
- Don't add Pinia. It was removed; no store exists.
- Don't hard-code section colors — go through the `--accent-<key>` CSS vars so themes stay consistent.

## Commit conventions

Commits feed `app/content/changelog.md` via `scripts/generate-changelog.mjs` on every `predev` / `prebuild`. Follow Conventional Commits:

    <type>(<optional scope>)<!>: <imperative subject>

**Types with labeled changelog entries**

| Type | Label | Type | Label |
|------|-------|------|-------|
| `feat` / `feature` | New | `docs` | Docs |
| `fix` | Fix | `style` | Style |
| `perf` | Performance | `test` | Tests |
| `refactor` | Refactor | `build` | Build |
| `chore` | Chore | `ci` | CI |
| `revert` | Revert | | |

Anything else passes through with the first letter capitalized.

**Excluded from the changelog**

- Subjects starting with `wip`, `fixup!`, `squash!`, or `merge`
- Any subject containing `[skip changelog]`

**Breaking changes** — suffix the type with `!` (e.g. `feat!: drop Pinia`). The entry is marked with ⚠.

**Examples**

- `feat(og): dynamic OG images per route`
- `fix(sidebar): restore active state on client nav`
- `docs: rewrite tokens chapter`
- `chore: bump deps [skip changelog]`

Rules are enforced programmatically by `commitlint` via a `commit-msg` git hook (see `commitlint.config.js`). Don't bypass with `--no-verify` unless you also add `[skip changelog]` to the subject.

## Improvements backlog

See `IMPROVEMENTS.md` for the running checklist. Tag commits that close items with the item number (e.g. `feat: changelog page (closes #14)`).
