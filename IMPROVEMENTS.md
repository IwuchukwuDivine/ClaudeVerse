# Claudeverse — Improvements Checklist

A living list of codebase improvements identified during the Apr 24 review.
Check items off as they land. Add context in the notes.

## High-impact, quick wins

- [x] **1. Fix `resolveLucideIcon` bundle bloat.** Replaced `import * as LucideIcons` with an explicit allow-list of the 11 icons used in content frontmatter. Tree-shaking now works. _File: `app/utils/resolveLucideIcon.ts`_
- [x] **2. `robots.txt` should reference the sitemap.** Added `Allow: /` and `Sitemap: https://claude-verse.vercel.app/sitemap.xml`. _File: `public/robots.txt`_
- [x] **3. Sidebar child anchors should be `<NuxtLink>`, not `<a>`.** Converted to `<NuxtLink>` so in-page navigation doesn't full-page-reload and scroll state / IntersectionObserver keep working. _File: `app/components/App/Sidebar.vue`_
- [x] **4. Accessibility pass — `aria-hidden` on decorative icons, `aria-current` on active nav.** Added `aria-hidden="true"` to decorative Lucide icons in Sidebar, Navbar, PageHeader, SectionCard, Toc. Added `aria-current="page"` on active section link, `aria-current="location"` on active child / TOC link, and on the breadcrumb tail. _Files: Sidebar, Navbar, Toc, PageHeader, SectionCard._

## Content & SEO

- [x] **5. Per-page OG images.** Installed and wired `nuxt-og-image` v6. Every content page and the homepage call `defineOgImage("Default", …)` with its own title, eyebrow, description, accent, and read time — the module generates a unique 1200×630 PNG per route via Satori.
  - Template: `app/components/OgImage/Default.satori.vue` (`.satori.vue` suffix required by v6 scanner).
  - Frontmatter override: `seo.ogImage` still supported for pages that want a hand-authored PNG instead of the generated one (`content.config.ts` + `useSeo`).
  - Module registered in `nuxt.config.ts`; dev-time preview available in Nuxt DevTools → OG Image tab.
- [x] **6. `lastUpdated` frontmatter + display in `DocsPageHeader`.** Added `lastUpdated` to the docs schema (`content.config.ts`), wired it through `[section].vue` into a new `PageHeader` prop, and formatted it as `Updated Apr 24, 2026` next to the read time with a divider. Also exposed as `dateModified` in the TechArticle JSON-LD. Seeded `workshops.md`, `cheatsheet.md`, `resources.md`; other pages can opt in as they're edited.
- [x] **7. Content-body search provider.** New `app/utils/search/providers/contentProvider.ts` uses `queryCollectionSearchSections('docs')` — emits one search record per page AND per heading, each with the prose beneath it as `body`. Registered in `registry.ts` with priority 80 (below `sections` so nav still wins exact matches). Searching a word that only appears inside a workshop or cheatsheet table now jumps directly to the correct `#anchor`.
- [x] **8. Print stylesheet.** Added a global `@media print` block in `main.css` that hides navbar/sidebar/TOC/search/page-nav, forces light colors (even in dark mode via variable overrides), collapses to a single column, expands external link URLs inline, and adds `page-break-inside: avoid` to sections and code blocks. Applies site-wide but most impactful on `/cheatsheet`.

## Architectural polish

- [x] **9. Empty / unused folder cleanup + Pinia removal.** Deleted empty `app/store/` and `app/utils/constants/`. Removed `@pinia/nuxt` and `pinia-plugin-persistedstate/nuxt` from `nuxt.config.ts` modules — nothing in the codebase used `defineStore` or `useStore`. Package entries in `package.json` can be dropped with `npm uninstall pinia @pinia/nuxt pinia-plugin-persistedstate` when you're ready.
- [x] **10. Audit tiny utilities.** Confirmed `app/utils/goBack.ts` and `app/utils/scrollToTop.ts` had zero references; deleted both. The scroll-to-top behavior in the TOC already lives inline in `Toc.vue`.
- [ ] **11. Focus trap in `SearchDialog`.** Teleported modal with no focus trap; Tab can leak onto elements behind the scrim. Use `useFocusTrap` from `@vueuse/core`. _File: `app/components/App/SearchDialog.vue`_
- [ ] **12. Dogfood: add `CLAUDE.md` + `.claude/settings.json` for this repo.** A guide _about_ Claude Code with no CLAUDE.md of its own is missing an easy wins. Also improves your own dev loop. _Files: `CLAUDE.md` (new), `.claude/settings.json` (new)_

## Nice-to-have

- [ ] **13. Anchor-copy affordance on `::docs-section` headings.** Currently shows a link icon on hover (easy to miss). Add a "copy link" button that writes `window.location.origin + pathname + #id` via `useClipboard`, with a tiny toast. _File: `app/components/Docs/Section.vue`_
- [ ] **14. `/changelog` or "What's new" page.** Dated list of what changed — gives return visitors a reason to come back. Could auto-generate from git history on docs files.
- [ ] **15. Dedupe `CodeBlock.vue` vs `ProsePre.vue`.** Two near-identical components. Only `ProsePre` is wired into `@nuxt/content`. Delete the other or extract a shared base. _Files: `app/components/Docs/CodeBlock.vue`, `app/components/content/ProsePre.vue`_

---

## Notes

- Keep this file up-to-date as items land. Use `git log IMPROVEMENTS.md` as the changelog of changes.
- Tag the commit that closes an item with the item number in the commit message, e.g. `perf: icon allow-list (closes #1)`.
