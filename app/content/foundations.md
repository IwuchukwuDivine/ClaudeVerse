---
title: Foundations
eyebrow: Start here
accent: foundations
icon: LucideBookOpen
description: The mental model, how the harness actually works, and the configuration layers you'll touch in your first week. Every other section assumes the ideas here.
estReadTime: 25 min
tocItems:
  - { id: mental-model, title: The Mental Model Shift, level: 2 }
  - { id: how-it-works, title: How Claude Code Works, level: 2 }
  - { id: context-window, title: The Context Window, level: 2 }
  - { id: setup, title: Setup & Installation, level: 2 }
  - { id: claude-md, title: CLAUDE.md Deep Dive, level: 2 }
  - { id: claudeignore, title: .claudeignore, level: 2 }
  - { id: config, title: Configuration Layers, level: 2 }
  - { id: models, title: Models, level: 2 }
  - { id: safety, title: Permissions & Safety, level: 2 }
next: { title: Workflows, path: /workflows }
seo:
  title: Foundations — Mental Model & Setup for Claude Code
  description: The mindset shift, how the Claude Code harness works, the context window, setup, CLAUDE.md, .claudeignore, configuration layers, models, and permissions — everything you need before writing your first prompt.
  keywords:
    - claude code foundations
    - claude md
    - claudeignore
    - context window
    - claude code setup
    - claude models
    - permissions
    - mental model
  proficiencyLevel: Beginner
  timeRequired: PT25M
---

There's a cliff between people who "use Claude Code sometimes" and people who ship real systems with it every day. The cliff isn't about prompt-writing talent. It's about **context architecture** — knowing what Claude sees, when it sees it, and how the harness around the model decides what to do next. This section is about getting you on the right side of that cliff.

::::docs-section{id="mental-model" title="The Mental Model Shift"}
The single biggest gap in 2026 isn't prompt quality — it's thinking about Claude Code as a **chatbot** instead of as **infrastructure**. A chatbot is a thing you type at. A piece of infrastructure is a thing you configure, shape, and build guardrails around. Claude Code is the latter.

Treat it like software you're setting up for your team. The outputs you get out are bounded by the context you put in — the `CLAUDE.md`, the `.claudeignore`, the hooks you wire into file-write events, the skills and subagents you've defined, the MCP servers you've connected. None of those exist by default. Setting them up is the job.

:::docs-callout{variant="tip" title="The 80%²⁰ math"}
If Claude makes the right call 80% of the time on any single decision, and a typical feature has 20 decisions, the odds of it getting all of them right are 0.8²⁰ ≈ 1%. Anthropic's internal testing found that unguided attempts succeed about 33% of the time. Planning collapses those ambiguous decisions into a spec you've reviewed — each one lands near 100%.
:::

### Context architecture > prompt cleverness

People obsess over prompt phrasing when the real leverage is further upstream:

- Is Claude reading a 400-line `CLAUDE.md` on every turn when only 50 lines are load-bearing? That's wasted context.
- Is it loading `node_modules` tree output because `.claudeignore` is missing? That's wasted context.
- Is it re-reading `package.json` on every message because there's no tool memory between calls? That's wasted context.

Fix those three and the prompts you were worried about start working.
::::

::::docs-section{id="how-it-works" title="How Claude Code Works"}
Claude Code is two things fused together: a **harness** that runs on your machine, and the **Claude model** that runs in Anthropic's data centers. Everything you think of as "intelligence" lives in the model. Everything you think of as "capability" — reading files, running shells, editing code, executing hooks — lives in the harness.

When you type a message, the harness packages up a request: your message, the conversation history, the system prompt, the `CLAUDE.md`, the list of available tools, and ships it to the model. The model replies with either text for you or a tool call. If it's a tool call, the harness executes it locally, captures the result, and sends that back to the model for the next turn. This loop continues until the model produces a final answer. That loop is the **agentic loop**, and it's where most of the interesting behavior comes from.

:::docs-callout{variant="info" title="What runs where"}
**Your machine:** the CLI, the file reads/writes, hooks, shell commands, MCP servers, sandboxing, permission prompts. Your code never leaves your machine unless a tool specifically sends it (e.g. the model sees a file you `cat` out).

**Anthropic's servers:** the model inference. Prompts and tool results travel there for reasoning. Nothing writes to your disk from there — the harness is what writes.
:::

### Tools: read-only vs write

The harness exposes tools in two flavors. Read-only tools (`Read`, `Glob`, `Grep`, `WebFetch`) never modify your system — they just return information. Write tools (`Edit`, `Write`, `Bash`) change state. In **Plan Mode** (covered in Workflows), only read-only tools are available, which is why it's safe to let Claude explore without supervision.
::::

::::docs-section{id="context-window" title="The Context Window"}
Claude's context window is 200K tokens. Sounds huge. It fills faster than you'd think, and it's the single most important resource you manage.

The system prompt plus tool definitions take ~30–50K tokens before you've typed anything. Add a 5K CLAUDE.md, a few file reads, a couple of command outputs, and you're at 80K before the real work begins. Once the window crosses ~70–80% full, performance degrades visibly: Claude forgets earlier instructions, ignores CLAUDE.md rules, repeats itself, and makes more mistakes. More mistakes mean more rework, more rework means more tokens burned — a vicious cycle.

:::docs-callout{variant="warning" title="The 80% threshold"}
When `/context` shows you're past 80%, stop adding. Finish the current task, save any breadcrumbs you need in a file, and `/clear` before starting the next one. Continuing past 80% is almost always more expensive than a clean restart.
:::

### Monitor what's actually in there

Two commands tell you where your tokens went:

```bash
/cost       # total tokens used this session, in dollars
/context    # breakdown: system prompt, CLAUDE.md, tools, conversation, files
```

For continuous visibility, configure the **StatusLine** to show the current token percentage as you work. Most people discover after one week of watching it that half their "Claude is being weird" complaints were really "my context was at 90% full."
::::

::::docs-section{id="setup" title="Setup & Installation"}
Claude Code ships in five surfaces. They share the same underlying engine — pick based on where you already live.

### Terminal (the primary one)

```bash
# macOS / Linux
curl -fsSL https://claude.ai/install.sh | sh

# npm (any platform)
npm install -g @anthropic-ai/claude-code

# First run — will walk you through auth
claude
```

On first run you'll be prompted to authenticate (browser OAuth or API key depending on your plan). The terminal CLI is the one every other surface is built on — features land here first.

### VS Code extension

Install "Claude Code" from the Extensions marketplace. Opens a Claude panel inside VS Code with the same engine and settings as the CLI. The editor surface adds in-file diffs, inline diagnostics, and IDE-native approvals. Your `CLAUDE.md`, settings, and skills apply identically.

### Desktop app

A native Mac/Windows app at [claude.ai/download](https://claude.ai/download). Same engine, but designed for people who don't live in a terminal. Useful for sharing Claude Code with non-CLI folks on your team.

### Web

[claude.ai/code](https://claude.ai/code) runs Claude Code in a cloud sandbox — no local install, spawns VM-isolated environments. Good for one-off tasks, reviewing PRs, and "I'm on a Chromebook" scenarios.

### JetBrains

Plugin available for IntelliJ, WebStorm, PyCharm, GoLand, and the rest of the JetBrains family. Install from the Plugin Marketplace.

:::docs-callout{variant="tip" title="Start in the terminal"}
Even if you prefer VS Code, spend your first few days in the terminal. The CLI's feedback is more honest — you see exactly what commands it runs, what files it touches, and where context goes. Once you trust the loop, graduate to whichever surface suits your flow.
:::
::::

::::docs-section{id="claude-md" title="CLAUDE.md Deep Dive"}
`CLAUDE.md` is your project's memory — a markdown file at the repo root that Claude loads into every session as system context. It's the difference between "Claude who learned your codebase the hard way" and "Claude who already knows your conventions."

:::docs-callout{variant="warning" title="Keep it under 5,000 tokens"}
Every token in `CLAUDE.md` is consumed at the start of _every_ session. A 15K CLAUDE.md burns ~$0.05/session before you've typed anything, and it eats context you need for actual work. Under 5K is the target. Under 3K is better.
:::

### The WHAT–WHY–HOW framework

Good CLAUDE.md entries answer three questions in order:

- **WHAT** — the rule. _"All API errors are thrown as typed exceptions from `errors.ts`."_
- **WHY** — the reason. _"So callers don't have to check status codes; the router catches and formats at the edge."_
- **HOW** — the concrete application. _"Use `throw new ApiError(...)`; don't return error objects from service functions."_

Without the **WHY**, Claude follows the rule rigidly and fails on edge cases. Without the **HOW**, Claude agrees and does it wrong anyway. The combination gives it enough to judge unfamiliar situations.

### What belongs in CLAUDE.md

- The stack (languages, frameworks, major libraries)
- How the repo is laid out (one-line per top-level folder)
- Non-obvious conventions (error handling, state management, tests)
- Hard rules (_"never call X directly; always go through Y"_)
- Where to look for domain docs (referenced, not inlined)
- The commands you'd run: `npm run dev`, `npm test`, etc.

### What does NOT belong

- Full API references — link to the file instead
- Examples Claude can derive by reading code
- Anything that changes often (current sprint goals, in-progress work)
- Full architecture diagrams in ASCII — one-sentence summaries, then link
- Boilerplate like "please be helpful" — Claude already is

### Tiered architecture

When your project is big enough that 5K isn't enough, go tiered. Keep `CLAUDE.md` small and point to deeper docs that load only when relevant:

```markdown [CLAUDE.md (abridged)]
# Project: Shipping Platform

Node.js + Fastify + Postgres. Strict TypeScript.

## Conventions

- All errors throw, never return. See `docs/errors.md` when working with error handling.
- Payments logic is sensitive — read `docs/payments-architecture.md` before touching `src/payments/`.
- Tests colocated with code: `foo.ts` and `foo.test.ts`.

## Commands

- `npm run dev` — local server
- `npm test` — unit + integration
- `npm run db:migrate` — apply new migrations
```

Claude reads the referenced files only when it needs to. A developer working on the frontend never pays the token cost of payment docs.

:::docs-callout{variant="tip" title="Personal vs project CLAUDE.md"}
There are two of these. Project `CLAUDE.md` lives in the repo root and applies only there. Personal `~/.claude/CLAUDE.md` applies across every project. Put preferences there (commit style, how you like to be addressed, verbosity preference) — don't pollute the project file with those.
:::
::::

::::docs-section{id="claudeignore" title=".claudeignore"}
Exactly what it sounds like: `.gitignore` for Claude. Files and directories listed here are invisible to file-reading and searching tools. Without one, Claude happily reads 400MB of `node_modules` tree when you ask "what does this project use" — consuming context and slowing every command.

```plaintext [.claudeignore]
# Dependencies
node_modules/
vendor/
.venv/

# Build artifacts
dist/
build/
.next/
.nuxt/
.output/

# Lock files (large, rarely relevant)
package-lock.json
yarn.lock
pnpm-lock.yaml

# Logs and caches
*.log
.cache/

# Environment / secrets
.env
.env.*
*.pem
*.key

# Minified / generated
*.min.js
*.min.css
**/generated/
```

:::docs-callout{variant="success" title="This is the single highest-leverage setup step"}
For most projects, adding a thoughtful `.claudeignore` produces more context savings than any CLAUDE.md optimization. Do this on day one.
:::
::::

::::docs-section{id="config" title="Configuration Layers"}
Claude Code reads configuration from four places. Each overrides the one above it, so the most specific wins.

| Layer            | Location                          | What goes here                                                                          |
| ---------------- | --------------------------------- | --------------------------------------------------------------------------------------- |
| User defaults    | `~/.claude/settings.json`         | Your preferences across all projects — theme, default model, personal hooks, personal MCP servers |
| Project settings | `.claude/settings.json`           | Project rules the whole team shares — permissions, project-specific hooks, MCP servers  |
| Project local    | `.claude/settings.local.json`     | Your local overrides for this project — gitignored, not shared                          |
| CLI flags / env  | on the command line               | One-off overrides: `--model opus`, `DEBUG=true claude`                                  |

```json [.claude/settings.json]
{
  "model": "sonnet",
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(npm run lint)", "Read"],
    "deny": ["Bash(rm -rf *)", "Bash(git push --force*)"],
    "ask": ["Bash(git push*)"]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx prettier --write $CLAUDE_FILE_PATHS" }]
      }
    ]
  }
}
```

:::docs-callout{variant="info" title="Check it in"}
`.claude/settings.json` should be committed. It encodes how your team agrees Claude should behave on this project. Put personal adjustments in `settings.local.json` (gitignored).
:::
::::

::::docs-section{id="models" title="Models"}
Claude Code supports three model tiers. Knowing when to reach for each is worth 40% on your bill.

| Model          | Sweet spot                                                                              | Avoid for                                                  |
| -------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Opus 4.7**   | Architecture decisions, security reviews, multi-file refactors, ambiguous problems      | Rote work — it's expensive, and Sonnet handles it fine     |
| **Sonnet 4.6** | Day-to-day implementation, bug fixes, feature work, test writing                        | Novel architectural calls where judgment matters           |
| **Haiku 4.5**  | Fast exploration, linting, simple transformations, subagent tasks                       | Anything requiring judgment on tradeoffs                   |

:::docs-callout{variant="tip" title="The hybrid pattern"}
Use Opus for the **plan** and Sonnet for the **implementation**. Opus makes the architectural calls in Plan Mode (cheap — just text), then you switch to Sonnet with `/model sonnet` for the execution phase. You get Opus-level judgment at Sonnet-level cost.
:::

Default model depends on your plan. Free users get Haiku. Pro gets Sonnet. Max gets Opus by default. You can always switch mid-session with `/model`.
::::

::::docs-section{id="safety" title="Permissions & Safety"}
Claude Code ships with sandboxing enabled. By default, every tool call that could modify your system (shell commands, file writes) requires approval the first time Claude tries it in a session. This is slow but safe. As you gain confidence, tune the permissions.

### The three permission modes

- **Ask** (default) — Claude pauses and asks before running anything it hasn't run before
- **Allowlist** — you pre-approve patterns in `settings.json`; Claude proceeds without asking for those
- **Skip all** — `--dangerously-skip-permissions`; Claude never asks. Use only in isolated environments

:::docs-callout{variant="danger" title="--dangerously-skip-permissions is named that for a reason"}
Never run it against your main development machine. Use it in containers, VMs, or dedicated worktrees — anywhere a bad `rm` wouldn't ruin your day. The Docker image and cloud sandbox surfaces enable it safely because blast radius is contained.
:::

### The allow / deny / ask lists

In `.claude/settings.json` you can pre-approve or pre-block patterns. A good starting set for most projects:

```json [settings.json permissions]
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm run lint)",
      "Bash(npm test*)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)"
    ],
    "ask": [
      "Bash(git push*)",
      "Bash(git checkout*)",
      "Write"
    ],
    "deny": [
      "Bash(rm -rf*)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)"
    ]
  }
}
```

:::docs-callout{variant="tip" title="Let experience shape it"}
Start strict — only pre-approve read-only tools. Each time a safe command gets prompted and you approve it, consider whether it belongs in `allow`. After a week, your permissions are shaped to how you actually work, and you almost never see prompts.
:::
::::
