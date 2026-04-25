---
title: Changelog
eyebrow: What's new
accent: resources
icon: LucideHistory
description: Every change that's shipped to Claudeverse, newest first. Auto-generated from the git history on each build.
estReadTime: 3 min
lastUpdated: 2026-04-25
tocItems:
  - { id: "2026-04", title: April 2026, level: 2 }
seo:
  title: Changelog — Claudeverse
  description: "Every change shipped to Claudeverse, newest first — auto-generated from the git history on each build."
  keywords:
    - claudeverse changelog
    - claude code guide updates
    - what's new
  proficiencyLevel: All Levels
  timeRequired: PT3M
---

Welcome back. This is everything we've shipped to Claudeverse since the site went live, grouped by month, newest first. If you've been away a while, start at the top — anything new since your last visit is here.

::::docs-section{id="2026-04" title="April 2026"}

**Apr 24, 2026**

_New features_

- **Analytics** — Integrate @vercel/analytics nuxt module
- **Home** — Add recently shipped card to the landing page
- **Navbar** — Add what's new pill with unread indicator
- **Changelog** — Emit summary json and drop prev-page link
- Add auto-generated changelog page with commitlint enforcement

_Bug fixes_

- **Og-Image** — Reduce accent orb opacity to prevent contrast bleed on bright accents
- **Analytics** — Swap @vercel/analytics module for direct script injection

_Performance improvements_

- **Docs** — Lazy-load DocsPageNav to defer offscreen nav rendering

_Refactors_

- **Nav** — Move changelog out of sidebar into footer

_Chores_

- Add open source community files

::::
