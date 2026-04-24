# CLAUDEVERSE — Vision & Context Document

## Project Overview

**ClaudeVerse** is a comprehensive, interactive, single-page web encyclopedia for mastering Claude Code. It's designed as both a personal learning tool and a teaching resource — the creator intends to host workshops/classes for developers on how to best maximize Claude Code in their workflows while using tokens efficiently.

**Target audience:** Developers (junior to senior) who want to go from "I use Claude Code sometimes" to "I architect systems around Claude Code that compound my productivity."

**Core value proposition:** Everything about Claude Code — concepts, workflows, extension points, orchestration, token optimization, resources — organized in one vibrant, interactive, easily navigable place. No hunting through 50 blog posts.

---

## Brand & Name

**Name:** ClaudeVerse  
**Tagline:** "The Developer's Universe for Claude Code Mastery"  
**Personality:** Playful, vibrant, energetic, approachable — but technically rigorous underneath. Think "Duolingo meets a senior engineer's notebook." Fun doesn't mean shallow.

---

## Typography

**Primary/Display Font:** Fredoka (Google Fonts)

- Used for: Logo/brand name, section titles, navigation labels, callout headings
- Weight range: 400–700
- Why: Rounded, bubbly, instantly communicates "this is fun and approachable" without being childish. Strong personality. Works at large and medium sizes.
- Import: `https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap`

**Body Font:** DM Sans (Google Fonts)

- Used for: Paragraph text, list items, descriptions, cards, code descriptions
- Weight range: 400–600
- Why: Geometric but warm. Clean and readable at small sizes. Pairs beautifully with Fredoka — professional foundation under the playful surface.
- Import: `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap`

**Monospace (for code/commands):** JetBrains Mono or Fira Code

- Used for: Code snippets, CLI commands, file paths, configuration examples
- Import: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap`

---

## Color System

The palette should feel vibrant and energetic — like a creative coding playground. Each major section gets its own accent color for instant visual wayfinding.

**Base colors:**

- Background: Deep navy/charcoal `#0F1021` (dark mode primary)
- Surface: `#181A2E` (cards, panels)
- Surface elevated: `#1E2038` (hover states, active items)
- Border: `#2A2D4A`
- Text primary: `#F0EEE9`
- Text secondary: `#9B98AE`

**Light mode alternative:**

- Background: `#F8F6F1`
- Surface: `#FFFFFF`
- Surface elevated: `#F0EDE6`
- Border: `#E0DCD4`
- Text primary: `#1A1A2E`
- Text secondary: `#6B6880`

**Section accent colors (vibrant, saturated):**
| Section | Color | Hex |
|---------|-------|-----|
| Home/Welcome | Cyan/Teal | `#00D4AA` |
| Foundations | Purple | `#7B2FBE` |
| Workflows | Orange | `#FF6B35` |
| Extensions | Blue | `#4361EE` |
| Token Mastery | Yellow/Gold | `#FFD23F` |
| Orchestration | Pink/Magenta | `#FF3CAC` |
| Resources | Lime/Green | `#A3E635` |
| Teach It | Red/Coral | `#EF4444` |
| Cheatsheet | Cyan | `#06B6D4` |

Each accent is used for: section icon backgrounds, active nav indicators, heading underlines, callout borders, tag pills, and subtle gradient washes on section headers.

---

## Design Direction

### Overall Aesthetic

- **Vibrant & playful** — not corporate, not "another docs site"
- **Card-based layout** — content organized in digestible cards, not endless scroll
- **Micro-interactions** — hover effects on cards, smooth transitions between sections, subtle animations on load
- **Emoji as visual anchors** — each section and subsection uses emoji for instant recognition
- **Color-coded navigation** — sidebar/nav items color-matched to their sections
- **Rounded corners everywhere** — matches Fredoka's rounded personality (border-radius: 12–16px)
- **Gradient accents** — subtle gradient washes on section headers, not flat blocks
- **Depth with shadows** — soft layered shadows for cards, not flat design

### Layout

- Left sidebar navigation (collapsible on mobile → bottom nav or hamburger)
- Main content area with section title + cards
- Cards can contain: text blocks, ordered/unordered lists, code snippets, callout boxes, comparison tables, tip boxes, warning boxes, link collections
- Sticky section header at top of content area
- Search/filter functionality if possible
- Progress indicator (how much of the guide you've explored)

### Interactive Elements

- Expandable/collapsible cards for dense content
- Tab groups within sections (e.g., "Beginner | Intermediate | Advanced")
- Copy-to-clipboard on code blocks and commands
- "Bookmark" or "Mark as learned" on sections
- Interactive decision tree for "which extension point should I use?"
- Quick quiz/self-check questions at end of each module (for workshop use)

---

## Content Structure

### 1. 🏠 Home / Welcome

- What is Claudepedia + who it's for
- Quick-start navigation cards for each section
- "Start here" path for beginners vs "Jump to" for experienced users
- Key stats: 40.8% developer adoption, avg $13/dev/day cost, 33% unguided success rate

### 2. 📖 Foundations

- **The Mental Model Shift** — infrastructure vs chatbot, context architecture > prompt cleverness
- **How Claude Code Works** — harness vs model, what runs locally vs what's AI, the agentic loop
- **The Context Window** — why it's your #1 resource, 200K tokens, how it fills, performance degradation
- **Setup & Installation** — terminal CLI, VS Code extension, desktop app, browser (claude.ai/code), JetBrains
- **CLAUDE.md Deep Dive** — what to include, what NOT to include, keep under 5K tokens, tiered architecture (core → referenced docs), the WHAT-WHY-HOW framework
- **Hiding Files from Claude** — `.gitignore` respect (the default for Glob/Grep) + `permissions.deny` for secrets/PII. Note: `.claudeignore` is NOT an official Claude Code feature; community workarounds exist but `permissions.deny` is the documented path.
- **Configuration Layers** — project (.claude/settings.json), user (~/.claude/), CLI flags, env vars
- **Models** — Opus (complex reasoning, architecture), Sonnet (general work, token efficient), Haiku (fast exploration). Default behavior on different plans.
- **Permissions & Safety** — sandboxing, --dangerously-skip-permissions, when to use it, risk tolerance

### 3. ⚡ Workflows

- **The 4-Phase Workflow** — Plan Mode research → create plan → review/edit plan (Ctrl+G) → implement. The guard phrase: "don't implement yet"
- **Plan Mode** — Shift+Tab×2, read-only architect mode, when to use vs skip, plans persist across context resets
- **When to Skip Planning** — "if you can describe the diff in one sentence, skip the plan"
- **Feedback Loops** — wire tests/linters/LSP into the workflow. 2–3x quality improvement. Playwright MCP for UI verification
- **Prompt Precision** — vague vs specific prompts with token cost comparison examples. Use @ for file references, paste screenshots/images, pipe data
- **Session Management** — /clear, /rename, /resume, --continue, Esc+Esc (/rewind) for checkpoints
- **The "Big Prompt" Pattern** — writing prompts that get Claude building entire features, not single functions
- **Best of N Pattern** — generate 3–5 versions, cherry-pick the best parts
- **Context Handoff Between Sessions** — leaving breadcrumbs, progress.md, using /compact with custom instructions

### 4. 🔧 Extension Points (The 6 Layers)

For each extension point: What it is → When to use it → How to set it up → Example → Token cost implications

- **Decision Framework Flowchart:**
  - Repeatable workflow? → Skill
  - Needs isolated context? → One task: Subagent / Many parallel: Agent Team
  - Must ALWAYS happen? → Hook (deterministic)
  - Needs external data/services? → MCP
  - One-off task? → Just prompt directly

- **Skills** — auto-triggering markdown expertise files. YAML frontmatter. ~100 tokens/skill at startup. Project (.claude/skills/) vs personal (~/.claude/skills/). Skills watch conversation and activate on match. Can bundle supporting files. Progressive disclosure.
- **Commands** — slash-invoked prompt templates in .claude/commands/. Review commands that pull git diffs. Bug-fix commands that fetch GitHub issues. User-invoked, not auto-triggered.
- **Hooks** — deterministic shell scripts on lifecycle events. PreToolUse, PostToolUse, SessionStart, SessionEnd, SubagentStart, SubagentStop, Notification, Stop, etc. CLAUDE.md is advisory (~80% compliance), hooks are 100%. Configure in .claude/settings.json. Examples: auto-lint on edit, block dangerous commands, Slack notifications, truncate command output.
- **Subagents** — isolated workers with clean context, defined in .claude/agents/ with YAML frontmatter (tools, model, permissions, hooks). Report back summaries only. Can't talk to each other. Can't spawn sub-subagents. Use /agents to create interactively. Route to cheaper models for exploration.
- **Agent Teams** — multiple independent sessions that coordinate. Team lead + teammates. Own context windows. Shared task list with dependency tracking. Peer-to-peer messaging. File locking. Enable with CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. v2.1.32+. ~7x tokens vs standard. Best for cross-layer work (frontend + backend + tests).
- **MCP (Model Context Protocol)** — connects databases, GitHub, Sentry, Playwright, etc. Dynamic tool loading. Disable unused servers to save context. /context to check consumption. @server-name disable.
- **Plugins** — packaged bundles of skills, subagents, hooks, MCP servers. /plugin marketplace add. The plugin ecosystem. claude-plugins-official directory. Progressive disclosure and token efficiency.
- **LSP Plugins** — automatic diagnostics after every edit. Type errors, unused imports. Single highest-impact plugin. Available for TypeScript, Python, Rust, Go, C#, Java, Kotlin, Swift, PHP, Lua, C/C++.

### 5. 💰 Token Mastery

- **Why Tokens Matter** — context fills → performance degrades → Claude forgets instructions → more mistakes → more rework → more tokens wasted. Vicious cycle.
- **The 3 Fixes That Cut Usage in Half** — (1) specific prompts, not vague ones (2) /clear between tasks (3) control command output size
- **Monitor Your Usage** — /cost, /context breakdown, StatusLine for continuous monitoring, token % in status bar. 80% = time to start fresh.
- **CLAUDE.md Token Diet** — keep under 5K tokens, reference separate files for domain docs, never embed large documentation inline
- **Tiered Context Architecture** — core CLAUDE.md → referenced docs loaded on demand → skills that load only when matched
- **Compact Strategies** — /compact with custom instructions, auto-compaction at 95%, manual compaction recommended before limit
- **Model Routing** — Opus for planning/architecture, Sonnet for implementation, Haiku for exploration. Hybrid approach saves 60–80%
- **Subagent Economics** — subagent exploration doesn't bloat main context, route to cheaper models, only summaries return
- **Agent Team Costs** — ~7x tokens vs standard, use Sonnet for teammates, keep teams small, clean up when done
- **Hook-Based Output Control** — truncate command output via hooks, head/tail piping, output formatting rules
- **Team Cost Management** — avg $13/dev/active day, $150–250/dev/month, <$30/day for 90% of users. Tracking tools, spend limits, pilot rollout strategy
- **The Token-Efficient Session Template:**
  ```
  Context: [2–3 sentences on project]
  Goal: [1 sentence for this session]
  Files: [relevant files only]
  Constraints: [patterns/rules]
  Task: [specific ask]
  ```

### 6. 🎭 Multi-Agent Orchestration

- **When to Scale Beyond Single Session** — git conflicts, context depletion, no specialization
- **The 3 Tiers:**
  - Tier 1: Claude Code subagents + Agent Teams (start here, no extra tooling)
  - Tier 2: Local orchestrators — Conductor, claude-squad (5.6K⭐), Multiclaude, Gas Town, Vibe Kanban (your machine, 3–10 agents, isolated worktrees)
  - Tier 3: Cloud orchestrators — Claude Code Web, GitHub Copilot Agent, Jules, Codex Web (assign task → close laptop → return to PR)
- **Subagents → Agent Teams Graduation Path** — start with subagents for focused parallel work, graduate to Agent Teams when teammates need to coordinate
- **Git Worktrees for Isolation** — each agent gets own worktree, no merge conflicts, tools like Conductor automate this
- **The Conductor Model vs Orchestrator Model** — pair programming (sync, sequential, one context) vs managing a team (async, parallel, decomposed specs)
- **Agent Teams Deep Dive** — spawn with subagent definitions, shared task list, dependency tracking, file locking, tmux split panes
- **Quality Gates** — require plan approval for risky changes, hooks that run tests on task completion, never trust agent output without verification
- **AGENTS.md for Compound Learning** — document patterns, gotchas, style preferences. Every session reads it, every session updates it. Knowledge compounds.
- **Token Economics Comparison** — single session vs subagent vs Agent Team cost analysis with realistic scenarios
- **External Orchestrators Comparison** — Gas Town (solo devs, hobby projects) vs Multiclaude (team usage, PR review) vs Claude Squad (manage multiple terminal agents)

### 7. 🗺️ Resources & Links

#### Official & Free

| Resource                  | URL                                                                   | Notes                                                      |
| ------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| Claude Code Docs          | code.claude.com/docs                                                  | Always start here. Official, updated frequently            |
| Anthropic Official Course | anthropic.skilljar.com/claude-code-in-action                          | Free, from the team that builds the tool                   |
| Frontend Masters Workshop | frontendmasters.com (Claude Code Deep Dive)                           | Lydia Hallie (Anthropic team), free, 7hrs, advanced        |
| CC for Everyone           | ccforeveryone.com                                                     | Free, learn Claude Code IN Claude Code, no coding required |
| Prompt Engineering Docs   | docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview | Official prompt engineering guide                          |
| Agent SDK (TypeScript)    | docs.anthropic.com/en/docs/claude-code/sdk/sdk-typescript             | Build production agents with Claude Code as a library      |
| Agent SDK (Python)        | docs.anthropic.com/en/docs/claude-code/sdk/sdk-python                 | Python SDK for programmatic Claude Code                    |

#### Paid Courses

| Course                            | Platform              | Instructor         | Focus                                                    |
| --------------------------------- | --------------------- | ------------------ | -------------------------------------------------------- |
| Claude Code for Real Engineers    | aihero.dev            | Matt Pocock        | 2-week cohort, production-focused, TDD, autonomous loops |
| Claude Code: Software Engineering | Coursera (Vanderbilt) | Dr. Jules White    | Best-of-N pattern, parallel orchestration, CLAUDE.md     |
| Vibe Coding with Claude Code      | Scrimba               | Maham Codes        | Interactive browser-based coding, hands-on               |
| Claude Code Best Practices        | DataCamp              | Bex Tuychiev       | Planning, context transfer, TDD, production case studies |
| Developing with AI Tools          | stevekinney.com       | Steve Kinney       | Cost management deep dive, workflow patterns             |
| Claude Code for .NET Developers   | codewithmukesh.com    | Mukesh Murugan     | Free, 12 lessons, 8+ hours, .NET-specific                |
| Various Claude Code courses       | Udemy                 | Frank Kane, others | Range of affordable options, see Udemy marketplace       |

#### Essential GitHub Repos

| Repo                                       | Stars    | What It Is                                                                                                        |
| ------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------- |
| shanraisshan/claude-code-best-practice     | Trending | Reference implementation: skills, subagents, hooks, commands orchestration. Working weather orchestrator example. |
| FlorianBruniaux/claude-code-ultimate-guide | —        | Beginner to power user. Production templates, quizzes, cheatsheet, security coverage.                             |
| affaan-m/everything-claude-code            | 45K+     | Agent harness: 150 skills, 12 language ecosystems, security scanning, ECC AgentShield.                            |
| wshobson/agents                            | 25K+     | 150 specialized skills, progressive disclosure, token efficiency patterns, plugin marketplace.                    |
| claude-plugins-official                    | 2.8K+    | Anthropic-managed plugin directory.                                                                               |
| scriptbyai.com/claude-code-resource-list   | —        | Comprehensive curated list of ALL tools, repos, orchestrators.                                                    |
| drona23/claude-token-efficient             | —        | CLAUDE.md file for reducing output verbosity. 63% output token reduction.                                         |
| Claude-Flow                                | 11.4K+   | Enterprise-grade AI orchestration platform.                                                                       |
| claude-squad                               | 5.6K+    | Manage multiple AI terminal agents (Claude Code, Aider, Codex, OpenCode, Amp).                                    |
| claude-context-mode                        | 2.2K+    | MCP server that compresses context: 315KB → 5.4KB (98% reduction).                                                |
| tdd-guard                                  | 1.7K+    | Automated TDD enforcement for Claude Code.                                                                        |

#### Key Blog Posts & Articles

| Article                                        | Author/Source         | Why Read It                                                    |
| ---------------------------------------------- | --------------------- | -------------------------------------------------------------- |
| "The Code Agent Orchestra"                     | Addy Osmani           | Multi-agent patterns, subagents vs teams, 3-tier orchestration |
| "50 Claude Code Tips and Best Practices"       | builder.io            | Practical daily-use tips, hooks, LSP, session management       |
| "How I Use Claude Code"                        | builder.io            | Workflow evolution, PR review setup, GitHub app                |
| "Claude Best Practices 2026: Power User Guide" | the-ai-corner.com     | Context architecture, skills, dispatch, 5 files to build first |
| "Multi-agent orchestration for Claude Code"    | Shipyard              | Agent Teams vs Gas Town vs Multiclaude comparison              |
| "Claude Code Extensions Explained"             | Muneeb Ahmad (Medium) | Clear breakdown of all 6 extension points with timeline        |
| "Claude Code CLI Guide 2026"                   | blakecrosley.com      | 45K+ word comprehensive CLI reference, updated weekly          |
| "Stop Wasting Tokens"                          | Jpranav (Medium)      | Tiered CLAUDE.md, 60% context optimization, session hooks      |
| "7 Ways to Cut Token Usage"                    | DEV Community         | Practical token reduction techniques, .claudeignore            |
| "Claude Code Best Practices"                   | DataCamp tutorial     | Planning, context transfer, TDD with company case studies      |

#### Communities & Newsletters

- Anthropic Discord — official community
- Claude Code GitHub Discussions
- r/ClaudeAI subreddit
- Twitter/X — follow @AnthropicAI, Boris Cherny (Claude Code creator), Lydia Hallie
- the-ai-corner.com newsletter
- codewithmukesh.com newsletter (for .NET devs)

### 8. 🎓 Teach It — Workshop Curriculum

**Module 1: Foundations (2 hours)**

- Mental model: harness vs model — what runs locally vs what's AI
- Install + first session walkthrough (live demo)
- CLAUDE.md: writing effective project memory (hands-on exercise)
- Context window mechanics: why performance degrades, how to monitor
- File-hiding setup (`.gitignore` + `permissions.deny`), /cost, /clear, /compact
- Exercise: Participants write CLAUDE.md for a real project

**Module 2: The Plan→Execute Workflow (2 hours)**

- Plan Mode (Shift+Tab×2): research without changes
- Live demo: building a feature with the 4-phase approach
- Feedback loops: wiring tests, linters, LSP into the workflow
- Prompt precision: vague vs specific, with token cost comparison
- Checkpoint & rewind: fearless experimentation with Esc+Esc
- Exercise: Participants plan and implement a feature with the workflow

**Module 3: Extension Points (3 hours)**

- Skills: building a code review skill (hands-on)
- Commands: creating slash commands for common workflows
- Hooks: PostToolUse auto-formatting, PreToolUse security gates
- Subagents: defining roles, model selection, frontmatter config
- MCP servers: connecting GitHub, databases, Playwright
- Decision framework exercise: given 10 scenarios, choose the right extension point
- Exercise: Participants build a custom skill + hook for their project

**Module 4: Multi-Agent & Orchestration (2 hours)**

- Subagents for focused parallel work
- Agent Teams: lead + teammates coordination pattern
- Git worktrees for branch isolation
- Token economics: comparing single session vs subagent vs team costs
- Live demo: 3 agents building frontend + backend + tests in parallel
- Exercise: Participants set up a 2-agent team for a decomposed task

**Module 5: Token Mastery & Production (1 hour)**

- Token audit: /context breakdown exercise
- Tiered CLAUDE.md architecture (core → referenced docs)
- Hybrid model routing (Opus for planning, Sonnet for implementation)
- Hooks for output truncation and cost control
- Team cost management: spend limits, tracking, pilot rollout
- Final exercise: Participants optimize their CLAUDE.md and measure token savings
- Q&A + open discussion

**Workshop Exercises (ready-to-use):**

1. "Write a CLAUDE.md for your project in under 5K tokens"
2. "Plan a feature using 4-phase workflow, measure tokens used vs direct approach"
3. "Build a /review slash command that pulls git diff"
4. "Create a PostToolUse hook that auto-runs prettier on file edits"
5. "Define a subagent for security review with restricted tools"
6. "Set up an Agent Team with 2 teammates for a fullstack feature"
7. "Run /context before and after optimizing your CLAUDE.md — compare token usage"
8. "Decision tree quiz: 10 scenarios, pick the right extension point for each"

### 9. ⌨️ Cheatsheet / Quick Reference

**Essential Commands:**
| Command | What It Does |
|---------|-------------|
| /clear | Reset context, keep CLAUDE.md |
| /compact [instructions] | Summarize conversation, reduce tokens |
| /cost | Check current token usage |
| /context | Breakdown of where tokens are going |
| /model | Switch between Opus/Sonnet/Haiku |
| /config | Settings: style, output format |
| /rename [name] | Name current session |
| /resume | Return to a previous session |
| /agents | Create/manage subagents interactively |
| /hooks | Configure hooks interactively |
| /mcp | Manage MCP server connections |
| /plugin marketplace add [repo] | Install a plugin from GitHub |
| /rewind | Restore from checkpoint |
| /install-github-app | Auto-review PRs with Claude |

**Keyboard Shortcuts:**
| Shortcut | Action |
|----------|--------|
| Shift+Tab×2 | Enter Plan Mode |
| Shift+Tab×1 | Return to Normal Mode |
| Esc | Stop Claude immediately |
| Esc+Esc | Open checkpoint/rewind menu |
| Ctrl+G | Open plan in text editor |
| Ctrl+C | Cancel current action |
| ! prefix | Run shell command inline (!git status) |
| @ prefix | Reference a file (@src/auth.ts) |

**CLI Flags:**
| Flag | What It Does |
|------|-------------|
| --continue | Resume most recent conversation |
| --resume | Session picker |
| --dangerously-skip-permissions | Skip all permission prompts |
| --model [model] | Set model for session |
| --print | Non-interactive, print response and exit |

**File Structure:**

```
project/
├── CLAUDE.md                    # Project memory (keep <5K tokens)
├── .gitignore                   # Claude respects this for searches; keep it tight
├── .claude/
│   ├── settings.json            # Project settings, hooks, permissions
│   ├── commands/                # Slash command templates (.md files)
│   ├── skills/                  # Project-level skills (SKILL.md + assets)
│   ├── agents/                  # Subagent definitions (.md with frontmatter)
│   └── tasks/                   # Agent team task lists (auto-generated)
~/.claude/
├── settings.json                # User-level settings
├── skills/                      # Personal skills (available in all projects)
├── commands/                    # Personal commands
└── output-styles/               # Custom output styles
```

---

## Technical Implementation Notes

- **Framework:** Nuxt 3 (Vue 3 + SSR) — full project, not a single-file artifact
- **Styling:** Tailwind CSS v4 via @tailwindcss/vite plugin. CSS custom properties in @theme block for colors/spacing/radii. Scoped styles for component-specific overrides. Reusable classes extracted to main.css.
- **Fonts:** @nuxt/fonts module — Fredoka (display/headings, 400–700), DM Sans (body, 400–600), JetBrains Mono (code, 400–500). All via Google provider.
- **Icons:** nuxt-lucide-icons module
- **State:** Pinia stores with composition API (setup syntax) + pinia-plugin-persistedstate for bookmarks/progress
- **Routing:** File-based routing via pages/ directory
- **Components:** Auto-imported, PascalCase, grouped in folders. Pages stay lean — delegate to components. Use <script setup lang="ts"> everywhere.
- **Composables:** useX pattern for reactive logic (useSearch, useBookmarks, useProgress, useTheme)
- **Utils:** Pure functions in utils/, types in utils/types/, constants in utils/constants/
- **Responsive:** Mobile-first with Tailwind breakpoints
- **Theme:** Dark mode default (#0F1021 base), CSS custom properties for light mode toggle
- **Interactions:** Vue transitions, VueUse for scroll/intersection observers, smooth section navigation
- **SEO:** SSR enabled, useSeoMeta per page, sitemap module, OG/Twitter cards configured
- **Deployment:** SSR with Nitro, prerender static routes

---

## What Success Looks Like

A developer opens ClaudeVerse and within 30 seconds:

1. Knows exactly where to go based on their experience level
2. Finds the specific concept/workflow/resource they need
3. Gets actionable instructions they can apply immediately
4. Can bookmark sections for their own learning or for building workshop slides

A workshop instructor opens ClaudeVerse and can:

1. Walk through modules in order for a 10-hour workshop
2. Pull up specific sections for live demos
3. Reference the cheatsheet during exercises
4. Point students to the Resources section for continued learning
