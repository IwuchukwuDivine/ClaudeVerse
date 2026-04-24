# Contributing to Claudeverse

Thanks for your interest in contributing. Claudeverse is a community guide for Claude Code mastery — contributions that improve accuracy, add missing content, or sharpen existing explanations are very welcome.

## Ways to contribute

- **Fix a typo or factual error** — open a PR directly
- **Improve an existing section** — edit the relevant `app/content/<slug>.md` file
- **Add a new section** — see [Adding a new section](#adding-a-new-section) below
- **Report a broken link, outdated screenshot, or bug** — open an issue using the Bug Report template
- **Suggest new content or a feature** — open an issue using the Feature Request template

## Getting started

```bash
# 1. Fork and clone
git clone https://github.com/<your-handle>/claudeverse.git
cd claudeverse

# 2. Install dependencies (Node 20+)
npm install

# 3. Start the dev server
npm run dev
# → http://localhost:3000
```

> **Note:** `postinstall` runs `nuxt prepare` automatically. TypeScript type-checking runs during `build` and `generate` — the build will fail on type errors.

## Project layout

| Path | What lives here |
|---|---|
| `app/content/*.md` | Guide pages (one file per section) |
| `app/components/` | Vue components |
| `app/composables/` | `useSearch`, `useSeo`, `useTheme`, `useToc` |
| `app/utils/sections.ts` | Sidebar / nav source of truth |
| `content.config.ts` | Frontmatter schema (validated by `@nuxt/content`) |
| `scripts/generate-changelog.mjs` | Auto-generates `app/content/changelog.md` from git history |

## Editing content

All guide pages live in `app/content/`. Each file is a Markdown document with frontmatter validated by `content.config.ts`. Required fields:

```yaml
---
title: "Your Section Title"
description: "One-sentence description for SEO and OG images"
accent: foundations        # one of the AccentKey values in content.config.ts
eyebrow: "OPTIONAL LABEL"
icon: BookOpen             # Lucide icon name; must be in resolveLucideIcon.ts allow-list
estReadTime: "8 min"
lastUpdated: "2026-04-24"
---
```

Keep prose concise. Aim for scannable structure — headings, short paragraphs, code blocks.

## Adding a new section

1. Create `app/content/<slug>.md` with valid frontmatter
2. Add the route entry to `app/utils/sections.ts`
3. Add the accent key to `content.config.ts` and extend `AccentKey` in `app/utils/types/nav.ts`
4. Add `--accent-<slug>` CSS vars in `assets/css/main.css` (light + dark values)
5. Map the accent color in `app/components/OgImage/Default.satori.vue`

> Don't hard-code colors anywhere else — go through the CSS vars.

## Commit conventions

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). The `commit-msg` git hook enforces the format, and every commit feeds the auto-generated changelog.

```
<type>(<optional scope>): <imperative subject>
```

Common types: `feat`, `fix`, `docs`, `perf`, `refactor`, `chore`, `style`

```bash
# Good examples
feat(workflows): add parallel task batching section
fix(sidebar): restore active state after client nav
docs: correct token budget numbers in tokens chapter
chore: bump deps [skip changelog]
```

Add `[skip changelog]` to skip the commit in the generated changelog. Use a `!` suffix for breaking changes (e.g. `feat!: rename accent keys`).

## Pull request checklist

- [ ] `npm run build` passes locally (no type errors)
- [ ] Commits follow Conventional Commits format
- [ ] New content files have all required frontmatter fields
- [ ] New Lucide icons are added to the allow-list in `app/utils/resolveLucideIcon.ts`
- [ ] No hard-coded colors (use CSS vars)

## Code style

- TypeScript strict mode — no `any` without a comment explaining why
- Vue 3 `<script setup>` with `defineProps` / `defineEmits`
- Tailwind utility classes only — no inline `style` in components (`.satori.vue` files are the exception since Satori requires inline styles)
- No Pinia — it was removed; don't add it back

## Licensing

By submitting a contribution you agree that your changes will be licensed under the [MIT License](./LICENSE) that covers this project.
