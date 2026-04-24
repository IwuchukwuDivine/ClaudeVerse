---
title: Resources
eyebrow: Learn deeper, faster
accent: resources
icon: LucideMap
description: Curated reading, official docs, community repos, courses, and tooling to keep leveling up after you've finished this guide.
estReadTime: 10 min
tocItems:
  - { id: official, title: Official & Free, level: 2 }
  - { id: paid, title: Paid Courses, level: 2 }
  - { id: repos, title: Essential GitHub Repos, level: 2 }
  - { id: articles, title: Key Articles, level: 2 }
  - { id: communities, title: Communities, level: 2 }
prev: { title: Troubleshooting, path: /troubleshooting }
next: { title: Workshops, path: /workshops }
seo:
  title: Resources — Curated Claude Code Reading List
  description: "Curated Claude Code resources: official Anthropic docs, community repos, courses, newsletters, and tools to keep leveling up after finishing this guide."
  keywords:
    - claude code resources
    - anthropic docs
    - claude code community
    - claude code courses
    - awesome claude code
    - claude newsletters
    - claude code repos
    - claude code articles
  proficiencyLevel: All Levels
  timeRequired: PT10M
---

Claudeverse is the map; this page is the rest of the city. Every resource here has been filtered for one question: _if I'd hit that wall six months ago, would this have unblocked me?_ If the answer was "no", it isn't listed. That means some well-known links are missing — that's the filter working, not an oversight. Follow the trail that matches what you're trying to do next, not the one with the most stars.

::::docs-section{id="official" title="Official & Free"}
The canon. Everything in this section is maintained by Anthropic or someone on the Claude Code team — start here before anything else. These move fast; bookmark the ones that matter and re-read them every quarter.

| Resource | Where | Why it matters |
|---|---|---|
| **Claude Code Docs** | [docs.claude.com/en/docs/claude-code](https://docs.claude.com/en/docs/claude-code) | The source of truth. Commands, hooks, SDK, MCP, permissions — all updated within days of a release. |
| **Anthropic's "Claude Code in Action" course** | [anthropic.skilljar.com/claude-code-in-action](https://anthropic.skilljar.com/claude-code-in-action) | Free, official, ~2 hours. From the team building the tool. |
| **Frontend Masters — Claude Code Deep Dive** | [frontendmasters.com](https://frontendmasters.com) (Lydia Hallie) | Free 7-hour workshop from an Anthropic engineer. The best intermediate-to-advanced video content anywhere. |
| **CC for Everyone** | [ccforeveryone.com](https://ccforeveryone.com) | Free. Learn Claude Code _in_ Claude Code. No prior coding required. |
| **Prompt Engineering Guide** | [docs.claude.com/en/docs/build-with-claude/prompt-engineering](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview) | The official prompt engineering reference. Bigger than you think. |
| **Agent SDK — TypeScript** | [docs.claude.com/en/docs/agent-sdk/overview](https://docs.claude.com/en/docs/agent-sdk/overview) | Build production agents with Claude Code as a library. Worth reading even if you'll never use the SDK directly — it documents how the CLI really works. |
| **Agent SDK — Python** | [docs.claude.com/en/docs/agent-sdk/python](https://docs.claude.com/en/docs/agent-sdk/python) | Same SDK, Python bindings. |
| **Release notes / changelog** | [github.com/anthropics/claude-code/releases](https://github.com/anthropics/claude-code/releases) | The 30-second check that tells you whether a new feature just landed. Read weekly. |

:::docs-callout{variant="tip" title="If you only click one link"}
Read the [docs top to bottom once](https://docs.claude.com/en/docs/claude-code). It's shorter than you'd guess — maybe 2 hours — and it replaces 80% of the questions you'd otherwise ask in a Discord. Everything after that becomes reference.
:::
::::

::::docs-section{id="paid" title="Paid Courses"}
Paid doesn't mean better. For most people, the free content above will get you 80% of the way. But if you learn best with a cohort, a project to ship, or a structured curriculum, these are the ones people I trust keep recommending.

| Course | Platform | Instructor | Focus |
|---|---|---|---|
| **Claude Code for Real Engineers** | [aihero.dev](https://www.aihero.dev) | Matt Pocock | 2-week cohort. Production-focused, TDD-first, autonomous loops. Probably the best-taught cohort on the topic. |
| **Claude Code: Software Engineering** | [Coursera (Vanderbilt)](https://www.coursera.org) | Dr. Jules White | Best-of-N, parallel orchestration, CLAUDE.md as a first-class artifact. Academic pace, solid fundamentals. |
| **Vibe Coding with Claude Code** | [Scrimba](https://scrimba.com) | Maham Codes | Interactive, browser-based, hands-on. Good for people who bounce off video lectures. |
| **Claude Code Best Practices** | [DataCamp](https://www.datacamp.com) | Bex Tuychiev | Planning, context transfer, TDD, real company case studies. |
| **Developing with AI Tools** | [stevekinney.com](https://stevekinney.com) | Steve Kinney | Cost management deep dive. If Opus is eating your budget, this course is cheaper than one month of unnecessary Opus usage. |
| **Claude Code for .NET Developers** | [codewithmukesh.com](https://codewithmukesh.com) | Mukesh Murugan | Free, 12 lessons, 8+ hrs, .NET-specific. Rare, well-done. |
| **Various Claude Code courses** | [Udemy](https://www.udemy.com) | Frank Kane, others | Range of affordable options. Quality varies — check recent reviews. |

:::docs-callout{variant="info" title="How to evaluate a paid course"}
Three signals, in order: (1) the instructor has shipped non-trivial software _with_ Claude Code (not just demos about it), (2) there's a real project you build end-to-end, not screencasts, (3) the syllabus mentions evals, hooks, or agent teams — anything claiming mastery that ignores the extension points is stopping at the easy part.
:::
::::

::::docs-section{id="repos" title="Essential GitHub Repos"}
Working code you can steal from. Star these, clone the ones that match your stack, and read the CLAUDE.md / AGENTS.md / hooks in each. Reading three production configs teaches faster than reading any blog post.

| Repo | Stars | What it is |
|---|---|---|
| **[anthropics/claude-code](https://github.com/anthropics/claude-code)** | 30K+ | The CLI itself. Issues are a goldmine for learning edge cases. |
| **[wshobson/agents](https://github.com/wshobson/agents)** | 25K+ | 150+ specialized subagent definitions. Progressive disclosure, token-efficient patterns, a plugin marketplace. The template gallery. |
| **[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)** | 45K+ | A full agent harness: skills, language ecosystems, security scanning (AgentShield). Heaviest repo in the ecosystem. |
| **[Claude-Flow](https://github.com/ruvnet/claude-flow)** | 11K+ | Enterprise-grade orchestration platform on top of Claude Code. |
| **[claude-squad](https://github.com/smtg-ai/claude-squad)** | 5K+ | Manage multiple terminal agents (Claude Code, Aider, Codex, OpenCode, Amp) from one TUI. |
| **[claude-plugins-official](https://github.com/anthropics/claude-code-plugins)** | 2.8K+ | Anthropic-managed plugin directory. Read before writing your own plugin. |
| **[claude-context-mode](https://github.com/maj-io/claude-context-mode)** | 2.2K+ | MCP server that compresses context aggressively (315KB → 5.4KB on their benchmark). |
| **[tdd-guard](https://github.com/nizos/tdd-guard)** | 1.7K+ | Automated TDD enforcement for Claude Code — a working hook you can adapt. |
| **[shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)** | Trending | Reference implementation: skills, subagents, hooks, commands all working together. Worth a weekend read. |
| **[FlorianBruniaux/claude-code-ultimate-guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide)** | — | Beginner-to-power-user reference. Production templates, quizzes, security checklist. |
| **[drona23/claude-token-efficient](https://github.com/drona23/claude-token-efficient)** | — | Drop-in CLAUDE.md for 60%+ output-token reduction. |
| **[scriptbyai.com/claude-code-resource-list](https://scriptbyai.com)** | — | A meta-list of tools, repos, orchestrators — when you need to know whether something _exists_. |

:::docs-callout{variant="tip" title="Read the hooks, not the README"}
When evaluating one of these repos, skip the README and open `.claude/settings.json` directly. The hooks, permissions, and commands are where the actual craft lives. Five minutes of reading real configs beats an hour of reading marketing.
:::
::::

::::docs-section{id="articles" title="Key Articles"}
One-offs worth a specific afternoon, each tied to a concrete problem you've probably hit. Ordered roughly by when they'd help you in your journey — top of the list for beginners, bottom for people already shipping multi-agent systems.

| Article | Author | Why read it |
|---|---|---|
| **[Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)** | Anthropic | The original "how to use this thing" post. Dated in details, still correct on principles. |
| **[50 Claude Code Tips and Best Practices](https://www.builder.io/blog/claude-code)** | builder.io | Practical daily-use tips. The one to send a new teammate on day one. |
| **[How I Use Claude Code](https://www.builder.io/blog/claude-code-how-i-use)** | builder.io | Real workflow evolution. PR-review setup, GitHub app, what stuck and what didn't. |
| **[Claude Best Practices 2026: Power User Guide](https://the-ai-corner.com/claude-code-best-practices-2026)** | the-ai-corner.com | Context architecture, skills, dispatch patterns, the 5 files to build first. |
| **[Claude Code Extensions Explained](https://medium.com/@muneebahmadtech)** | Muneeb Ahmad | Clean breakdown of the 6 extension layers, with a timeline showing when to reach for each. |
| **[The Code Agent Orchestra](https://addyosmani.com)** | Addy Osmani | Multi-agent patterns, subagents vs teams, 3-tier orchestration. Read before you reach for Agent Teams. |
| **[Multi-agent orchestration for Claude Code](https://shipyard.build/blog)** | Shipyard | Honest comparison of Agent Teams vs Gas Town vs Multiclaude. Saves a weekend of evaluation. |
| **[Stop Wasting Tokens](https://medium.com/@jpranav)** | Jpranav | Tiered CLAUDE.md, 60% context optimization, session hooks. The best practical writeup on token discipline. |
| **[7 Ways to Cut Token Usage](https://dev.to)** | DEV Community | Short, actionable. `.claudeignore`, chunked prompts, and more. |
| **[Claude Code CLI Guide 2026](https://blakecrosley.com)** | Blake Crosley | Massive CLI reference, updated weekly. When the docs don't have the flag you need, it's probably here. |
| **[Claude Code Best Practices (tutorial)](https://www.datacamp.com/tutorial/claude-code)** | DataCamp | Planning, context transfer, TDD — covered through real case studies. |

:::docs-callout{variant="info" title="Article hygiene"}
The Claude Code world changes fast. Anything older than ~6 months should be read for _principles_, not _commands_. If an article tells you exactly which flag to use, verify against [the docs](https://docs.claude.com/en/docs/claude-code) before pasting.
:::
::::

::::docs-section{id="communities" title="Communities"}
Where to go when the docs don't have the answer. Different communities are good at different things — match the vibe to the question.

### Real-time (Discord, Slack)

- **[Anthropic Discord](https://www.anthropic.com/discord)** — the official community. #claude-code is active, well-moderated, fast turnaround from Anthropic engineers. Your first-stop for "is this a bug or am I holding it wrong?" questions.
- **MCP Community Discord** — linked from the MCP spec site. Good for server-building questions specifically.

### Asynchronous (forums, subreddits, discussions)

- **[GitHub Discussions — anthropics/claude-code](https://github.com/anthropics/claude-code/discussions)** — best for feature requests and reproducible bugs. Anthropic engineers triage here.
- **[r/ClaudeAI](https://www.reddit.com/r/ClaudeAI)** — mixed signal-to-noise, but "has anyone else seen this?" posts land here first.
- **[r/Anthropic](https://www.reddit.com/r/Anthropic)** — less Claude-Code-specific, more Anthropic ecosystem.

### People worth following

On Twitter/X and LinkedIn — the shortest path to seeing new patterns as they emerge:

- **[@AnthropicAI](https://twitter.com/AnthropicAI)** — official release news.
- **[Boris Cherny](https://twitter.com/bcherny)** — Claude Code creator. Follows up on gotchas publicly.
- **[Lydia Hallie](https://twitter.com/lydiahallie)** — Anthropic DevRel, best teacher of advanced patterns.
- **[Cat Wu](https://twitter.com/catwu)** — PM on Claude Code. Context on _why_ features land the way they do.
- **[Addy Osmani](https://twitter.com/addyosmani)** — orchestration patterns, agent teams, the broader AI-tooling landscape.
- **[Matt Pocock](https://twitter.com/mattpocockuk)** — practical Claude Code workflows with production TypeScript.

### Newsletters

- **[the-ai-corner.com](https://the-ai-corner.com)** — weekly. Skews practical and tool-focused.
- **[codewithmukesh.com](https://codewithmukesh.com)** — monthly-ish. .NET-leaning but broadly applicable.
- **[Anthropic's own newsletter](https://www.anthropic.com/newsletter)** — low volume, high signal. Announcement-driven.

:::docs-callout{variant="tip" title="How to ask a good question"}
Before posting, have: (1) the exact command or prompt, (2) `/status` output, (3) relevant `CLAUDE.md` / `.claude/settings.json` sections, (4) what you expected vs what happened. That shape gets answers in minutes. Questions without it sit for days. Troubleshooting is in [the troubleshooting chapter](/troubleshooting) — try there first.
:::
::::
