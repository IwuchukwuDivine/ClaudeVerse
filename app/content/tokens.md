---
title: Token Mastery
eyebrow: Cut usage in half
accent: tokens
icon: LucideCoins
description: Why tokens matter, the three highest-impact fixes, monitoring, the CLAUDE.md diet, tiered architecture, compacting, model routing, subagent economics, hook-based output control, and team cost management.
estReadTime: 20 min
tocItems:
  - { id: why, title: Why Tokens Matter, level: 2 }
  - { id: three-fixes, title: The 3 Fixes, level: 2 }
  - { id: monitor, title: Monitor Your Usage, level: 2 }
  - { id: diet, title: CLAUDE.md Diet, level: 2 }
  - { id: tiered, title: Tiered Architecture, level: 2 }
  - { id: compact, title: Compact Strategies, level: 2 }
  - { id: routing, title: Model Routing, level: 2 }
  - { id: subagent-econ, title: Subagent Economics, level: 2 }
  - { id: hook-output, title: Hook-Based Output Control, level: 2 }
  - { id: team-cost, title: Team Cost Management, level: 2 }
  - { id: template, title: Session Template, level: 2 }
prev: { title: Extensions, path: /extensions }
next: { title: Orchestration, path: /orchestration }
seo:
  title: Token Mastery — Cut Claude Code Usage in Half
  description: Why tokens matter, the three highest-impact fixes, usage monitoring, CLAUDE.md diet, tiered architecture, compact strategies, model routing, subagent economics, hook-based output control, and team cost management for Claude Code.
  keywords:
    - claude code tokens
    - token optimization
    - llm costs
    - claude md diet
    - model routing
    - subagent economics
    - token monitoring
    - ccusage
    - team cost management
    - statusline
    - compact
  proficiencyLevel: Intermediate
  timeRequired: PT20M
---

Every token Claude reads costs money and eats into the window you have for actual work. The difference between a $40/day habit and a $400/day habit is almost never the number of features shipped — it's the amount of waste. This chapter is the whole playbook for getting more done with fewer tokens. Every number in here comes from real sessions; every fix can be applied in under five minutes.

::::docs-section{id="why" title="Why Tokens Matter"}
Tokens are both a **unit of charge** and a **unit of cognition**. You pay per million of them, and Claude's judgment degrades as they accumulate. The economics and the quality problem collapse into one: the leanest session is usually also the sharpest one.

### 2026 pricing at a glance

| Model          | Input (per 1M tok) | Output (per 1M tok) | Cached read |
| -------------- | ------------------ | ------------------- | ----------- |
| **Opus 4.7**   | $15                | $75                 | $1.50       |
| **Sonnet 4.6** | $3                 | $15                 | $0.30       |
| **Haiku 4.5**  | $0.80              | $4                  | $0.08       |

One hour of Opus work on a dense codebase can easily touch 2M input tokens — that's $30 before you count output. The same hour on Sonnet with a disciplined `.gitignore` and a small `permissions.deny` list is under $6. The rules below close that gap without sacrificing capability.

:::docs-callout{variant="warning" title="The compounding tax"}
A bloated context doesn't just cost more per turn — it makes Claude worse. A worse Claude writes a bug. The bug triggers rework. The rework burns another 40K tokens. Over the course of a day, a 2× token multiplier from context bloat typically becomes a 3–4× cost multiplier once the rework is counted. Every fix in this chapter compounds.
:::

### The 70% ceiling

The context window is 200K, but in practice performance flattens once you cross ~140K (70%) and falls off a cliff near ~160K (80%). Treat 140K as your budget, not 200K. Designing for 140K also leaves headroom when Claude needs to read an unexpected file mid-task.
::::

::::docs-section{id="three-fixes" title="The 3 Fixes That Cut Usage in Half"}
Before any clever tuning, get these three right. They are responsible for 80% of the savings on a typical project. Expect 40–60% bill drop on day one.

### Fix #1 — A tight `.gitignore` (plus `permissions.deny` for secrets)

Without the noise excluded, Claude's first `ls` or `Glob` may pull 100K tokens of `node_modules`, lockfiles, and build artifacts. The good news: Claude Code respects your `.gitignore` for search-style operations, so if your gitignore is sane, this is already mostly done for free. Five minutes auditing it is the highest-leverage thing you'll do this week.

```plaintext [.gitignore — the token-saving entries]
node_modules/
vendor/
.venv/
dist/
build/
.next/
.nuxt/
.output/
.cache/
*.log
*.min.js
*.min.css
**/generated/
**/*.snap
```

For secrets and sensitive paths that _shouldn't_ be gitignored (because they're files you want tracked, or because you want stricter enforcement than gitignore provides), add a `permissions.deny` block to `.claude/settings.json`:

```json [.claude/settings.json]
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Bash(cat .env*)",
      "Read(./fixtures/customer-data/**)"
    ]
  }
}
```

See [Foundations → Hiding Files from Claude](/foundations#hiding-files) for the full breakdown — including why `.claudeignore` isn't the right answer despite what you'll see in community posts.

### Fix #2 — CLAUDE.md under 3K tokens

`CLAUDE.md` loads on every turn. A 10K file costs $0.03 per turn on Sonnet and eats window you need. If you can't say what you want in 3K, point Claude to sibling files it can load on demand (see the Tiered Architecture section below).

### Fix #3 — Right-size the model

Opus is 5× the price of Sonnet and 18× the price of Haiku. Default to Sonnet. Switch to Opus only for architecture, security, and multi-file reasoning. Let Haiku handle subagent grunt work. A simple reroute of "exploration subagents" from Sonnet to Haiku typically saves 30% on the bill with no visible loss in quality.

:::docs-callout{variant="success" title="The 24-hour test"}
Do these three on a Monday. Look at your `/cost` output on Friday. You will have saved at least 40%. This is not an aspirational claim — it's a universal outcome. If your bill didn't drop, check your `.gitignore` actually covers your stack's build outputs.
:::
::::

::::docs-section{id="monitor" title="Monitor Your Usage"}
You can't fix what you can't see. Claude Code ships three lenses on your usage: `/cost` (session total), `/context` (what's in the window right now), and the StatusLine (a live display at the bottom of your terminal).

```bash
# In any Claude Code session:
/cost       # cumulative tokens and $ for the session
/context    # per-bucket breakdown: system, tools, CLAUDE.md, conversation, files
```

### Always-on visibility: the StatusLine

Add a statusline script to your settings and you get continuous feedback without typing a command. The version below shows model, session cost, and context percentage.

```json [~/.claude/settings.json]
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/scripts/statusline.sh"
  }
}
```

```bash [~/.claude/scripts/statusline.sh]
#!/usr/bin/env bash
# Reads JSON on stdin from Claude Code and prints a one-line status.
# Fields available: .model.display_name, .session.cost_usd, .session.context_used, .session.context_limit

input=$(cat)
model=$(jq -r ".model.display_name" <<< "$input")
cost=$(jq -r ".session.cost_usd // 0" <<< "$input")
used=$(jq -r ".session.context_used // 0" <<< "$input")
limit=$(jq -r ".session.context_limit // 200000" <<< "$input")
pct=$(( used * 100 / limit ))

color=32   # green
[ "$pct" -ge 70 ] && color=33   # yellow
[ "$pct" -ge 80 ] && color=31   # red

printf "\033[2m%s\033[0m  \033[1;%dm%d%% ctx\033[0m  $%.2f" "$model" "$color" "$pct" "$cost"
```

### Historical analysis with ccusage

For week-over-week trends, the community tool [ccusage](https://github.com/ryoppippi/ccusage) reads the transcript logs Claude Code writes on disk and produces a per-session breakdown. Run it as a Friday ritual and you'll quickly find the one session that ate 40% of your week.

```bash
npx ccusage@latest weekly   # last 7 days, per day
npx ccusage@latest session   # current session breakdown
npx ccusage@latest project   # per-project roll-up
```

:::docs-callout{variant="tip" title="The 70/80 heuristic"}
If the StatusLine is showing yellow (70%), wrap up the current task and save any state you need. If it's red (80%), stop immediately — `/compact` or `/clear`. Continuing past red is always more expensive than restarting.
:::
::::

::::docs-section{id="diet" title="CLAUDE.md Diet"}
Every token in `CLAUDE.md` is consumed at the start of every turn, forever. A fat CLAUDE.md is the gift that keeps on taking. The goal is a tight, load-bearing file under 3K tokens (~500 lines of prose, much less if you're dense).

### What to delete today

- **Examples Claude can derive by reading code.** If `src/auth/login.ts` has a good pattern, a one-liner _"see `src/auth/login.ts` for the canonical auth flow"_ is worth 30 lines of inlined example.
- **Architecture diagrams in ASCII.** Keep a one sentence summary, then point to a real doc.
- **Onboarding fluff.** "This project is fun and welcoming to contributors" doesn't help Claude write code.
- **Sprint state.** "Currently working on feature X" stale within a week and misleads Claude for months.
- **Boilerplate pleasantries.** "Please be helpful and careful" — Claude already is.

```markdown [CLAUDE.md — before (11K tokens)]
# My Project

## Welcome

Thank you for contributing to MyProject! We are an open, friendly team that values collaboration and clean code. Please read these guidelines carefully before making any changes...

## Architecture

[40-line ASCII diagram]

## Authentication flow

Step 1: The user sends a POST request to /login with email and password.
The server verifies the password hash using bcrypt. If valid, we issue a JWT.
[200 more lines of narrative]

## Tests

[Every test convention explained with inline example]
...
```

```markdown [CLAUDE.md — after (1.8K tokens)]
# MyProject

Node + Fastify + Postgres. Strict TypeScript. pnpm, not npm.

## Conventions

- Errors throw, never return. See `docs/errors.md` when touching error handling.
- Auth is JWT in `src/auth/`. Read `src/auth/login.ts` for the canonical pattern.
- Payments is sensitive. Read `docs/payments.md` before `src/payments/`.
- Tests colocated: `foo.ts` + `foo.test.ts`. Snapshot tests are forbidden outside `src/render/`.

## Commands

- `pnpm dev` — local server
- `pnpm test` — unit + integration
- `pnpm db:migrate` — apply new migrations
- `pnpm typecheck` — strict, required before every commit

## Hard rules

- Never import from `internal/*` outside `src/internal/`.
- Never disable a test to make CI pass. Mark it skip with a TODO and open an issue.
```

:::docs-callout{variant="tip" title="Test the diet"}
After trimming, start a fresh session and run `/context` immediately. Your CLAUDE.md bucket should be under 2% of the window. If it's not, trim again.
:::
::::

::::docs-section{id="tiered" title="Tiered Architecture"}
Past about 3K, you can't stay in a single `CLAUDE.md` without pain. The answer isn't a bigger file — it's _tiered_ context. A thin root file points to deeper docs that load only when relevant. The frontend engineer never pays for payments docs; the payments engineer never pays for design tokens.

```plaintext [Tiered layout]
project/
├── CLAUDE.md             # ~2K tokens — rules and pointers
├── docs/
│   ├── errors.md         # loaded when touching error handling
│   ├── payments.md       # loaded when touching payments
│   ├── auth.md           # loaded when touching auth
│   └── db-schema.md      # loaded when writing migrations
├── .claude/
│   └── skills/
│       ├── migrations/   # auto-loaded when user mentions migration
│       └── feature-flags/
└── src/...
```

### Pointer style that works

Claude will not read a linked doc unless the link is obviously relevant. Vague references ("see docs/ for more info") fail. Write triggers in the _same sentence_ as the reference:

```plaintext
GOOD: Payments logic is sensitive — read `docs/payments.md` before touching any file in `src/payments/`.

BAD: We have some docs in the `docs/` folder.
```

:::docs-callout{variant="info" title="Skills are tier 3"}
Skills are the auto-triggered version of this pattern. Where a doc pointer relies on Claude noticing the link, a skill's `description` tells the harness exactly when to inject it — zero cost until it triggers. Big domain knowledge (OAuth, CRDT logic, a billing model) belongs in a skill, not a doc.
:::
::::

::::docs-section{id="compact" title="Compact Strategies"}
Eventually every session fills up. You have three moves: `/compact`, `/clear`, and handoff via file. Picking the right one is worth 30% on long sessions.

| Command      | What it does                                           | Use when                            |
| ------------ | ------------------------------------------------------ | ----------------------------------- |
| `/compact`   | Summarizes history to ~10K and keeps the session going | Mid-task, you still need the thread |
| `/clear`     | Wipes context, restarts fresh (CLAUDE.md still loads)  | Between unrelated tasks             |
| File handoff | Claude writes `handoff.md`; next session reads it      | Crossing sessions or agents         |

### When `/compact` beats `/clear`

`/compact` keeps the goal and the decisions you made. `/clear` throws both away. If you're halfway through a feature and you've agreed on a plan, compact. If the last thing was shipped and the next thing is unrelated, clear.

```markdown [handoff.md (written by Claude at end of session)]
# Feature: rate-limit /login

## Decisions made

- Per-IP rate limit at edge middleware (src/middleware/rate-limit.ts).
- 100 requests/minute bucket, leaky-bucket algorithm.
- Backed by Redis; key = `rl:login:<ip>`; TTL 60s.

## Done

- [x] Created rate-limit.ts with the bucket implementation.
- [x] Wired into src/app.ts before auth middleware.
- [x] Unit tests green for happy path + burst.

## Not done

- [ ] Integration test against real Redis (requires CI container update).
- [ ] Metrics hook into `metrics/counters.ts` — left a TODO at line 42.
- [ ] Error message could be more helpful; currently just returns 429.

## Traps

- Middleware order matters: rate-limit must be BEFORE auth so unauthed bursts are blocked cheaply.
- Redis key MUST be IP-scoped, not session-scoped, or a logged-out attacker bypasses it.
```

:::docs-callout{variant="tip" title="Ask Claude to write the handoff"}
The prompt: _"Before I close this session, write a handoff.md with decisions made, what's done, what's not, and any traps the next session should know about. Be specific — cite file:line."_ Ten seconds, permanent continuity.
:::
::::

::::docs-section{id="routing" title="Model Routing"}
Picking the right model is the cheapest optimization you'll ever do. Knowing when to reach for each tier is worth about 40% on your bill.

| Model      | Best for                                                                       | Don't use for                                       |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------------------------- |
| **Opus**   | Architecture decisions, security review, tough multi-file refactors, ambiguity | Anything a junior could do — Sonnet handles it fine |
| **Sonnet** | Daily implementation, bug fixes, tests, feature work                           | Novel architecture calls where judgment matters     |
| **Haiku**  | Fast exploration, lint fixups, simple transformations, subagent grunt work     | Anything requiring judgment on tradeoffs            |

### The hybrid pattern

Plan on Opus, implement on Sonnet. The plan is a few thousand tokens of dense reasoning — Opus is worth it. Implementation is bulk work — Sonnet is five times cheaper and just as capable with a good plan in hand.

```plaintext
# Flow
/model opus        # Plan Mode on
[plan the feature with Opus]
/model sonnet      # exit Plan Mode; implement
[execute with Sonnet]
/model opus        # if a review is warranted
[review with Opus]
```

### Pinning model per command

Slash commands can pin a model in their frontmatter. Put the model you want per job directly in the command file, and you never remember to switch:

```markdown [.claude/commands/plan.md]
---
description: Plan a feature in Plan Mode using Opus
model: opus
---

Enter plan mode. I want a detailed plan before any edits. $ARGUMENTS
```

```markdown [.claude/commands/fix-lint.md]
---
description: Fix lint errors quickly — Haiku is plenty
model: haiku
allowed-tools: Read, Edit, Bash(npm run lint*)
---

Run the linter, read the errors, and fix them. Do not refactor.
```

:::docs-callout{variant="tip" title="Haiku for subagents"}
A read-only exploration subagent almost always does fine on Haiku. Set `model: haiku` in the agent's frontmatter. Save Sonnet for the main session and Opus for architectural calls. This single change often cuts a third off agent-heavy workflows.
:::
::::

::::docs-section{id="subagent-econ" title="Subagent Economics"}
Subagents feel free — delegation! — but they aren't. Each spawned subagent carries its own system prompt, its own tool definitions, and its own conversation. What's free is **main-session** context, not total tokens.

### When a subagent saves tokens

- The task needs **many** file reads Claude will discard after answering.
- The task is repeatable (exploring the same codebase twice is cheaper when a subagent returns a small summary both times).
- Multiple subagents can run in parallel, compressing wall-clock time without paying for them sequentially.

### When a subagent costs more

- One-off questions — the overhead of a new context outweighs the benefit.
- Small searches (< 5 file reads) — just do it inline.
- Tasks needing back-and-forth with the user — subagents can't pause to clarify.

```yaml [Agent frontmatter — pick the cheapest model that works]
---
name: codebase-explorer
description: Use for broad codebase questions. Cites file:line, never edits.
tools: Read, Grep, Glob
model: haiku
---
```

:::docs-callout{variant="info" title="The parallel fan-out pattern"}
Need three things investigated? Launch three Haiku subagents in one message. They run concurrently — total wall time ≈ the slowest one, total spend ≈ three Haiku sessions (still cheaper than a single Sonnet doing it serially). This is the power move for large codebase audits.
:::
::::

::::docs-section{id="hook-output" title="Hook-Based Output Control"}
Some tools produce monstrous output. `npm install` can dump 2K lines. A full test suite on failure can exceed 10K. Claude will read every token of it and then think with it sitting in the window. A small hook can trim the output to the useful bits.

```json [.claude/settings.json]
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/trim-output.sh"
          }
        ]
      }
    ]
  }
}
```

```bash [.claude/hooks/trim-output.sh]
#!/usr/bin/env bash
# PostToolUse hook: trim overlong Bash output before Claude re-reads it.
# Reads the tool result on stdin, re-emits a trimmed version on stdout.

set -euo pipefail

input=$(cat)
output=$(jq -r ".tool_output // empty" <<< "$input")
cmd=$(jq -r ".tool_input.command // empty" <<< "$input")

# Commands we intentionally never trim
case "$cmd" in
  *"git diff"*|*"git log"*) echo "$input"; exit 0 ;;
esac

# Over 200 lines? keep first 40 + last 40, summarize the middle
lines=$(echo "$output" | wc -l)
if [ "$lines" -gt 200 ]; then
  trimmed=$(
    (echo "$output" | head -n 40;
     echo "... [$((lines - 80)) lines trimmed by hook] ...";
     echo "$output" | tail -n 40)
  )
  jq --arg out "$trimmed" ".tool_output = \$out" <<< "$input"
else
  echo "$input"
fi
```

### Silencing noisy commands entirely

`npm install` progress bars, `prettier` output, `docker pull` layer lists — you never need Claude to see any of it. A `PreToolUse` hook can rewrite such commands to pipe to `/dev/null` transparently, saving tens of thousands of tokens a week.

:::docs-callout{variant="tip" title="Measure before and after"}
Before installing a trim hook, record a week of `/cost`. After, another week. On a busy project a well-tuned trim hook saves more than the CLAUDE.md diet — quietly, without you thinking about it.
:::
::::

::::docs-section{id="team-cost" title="Team Cost Management"}
Individual discipline scales to about five engineers. Past that you need instrumentation: per-user dashboards, budget alerts, and a shared set of defaults that ships the best practices by default.

### The shared defaults pattern

Commit a team `settings.json` (with a sensible `permissions.deny` list), a tight `.gitignore`, a short `CLAUDE.md`, and the trim hook above. Every engineer on the team inherits the savings without reading this page. Put personal preferences in `~/.claude/settings.json` — never in the project file.

```json [.claude/settings.json (team defaults)]
{
  "model": "sonnet",
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Bash(pnpm test*)", "Bash(git status)"],
    "deny": ["Bash(rm -rf*)", "Bash(git push --force*)"]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/trim-output.sh" }
        ]
      },
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/format.sh" }
        ]
      }
    ]
  }
}
```

### Budget alerts at the org level

Team and Enterprise plans expose per-seat usage to admins. Set weekly email alerts at 70% of budget and a hard cap at 100%. Have the one engineer who blew past 70% walk you through their session — nine times out of ten you'll find a gap in `.gitignore` coverage or a runaway subagent loop that the team can learn from.

### The monthly audit

Once a month, run `ccusage project` across every repo and look at the top 10% of sessions by cost. Tag each with a root cause — bloated CLAUDE.md, wrong model, missing ignore, infinite subagent loop. Fix the top three. Bill compounds down like interest.

:::docs-callout{variant="info" title="Cost per shipped feature"}
The real metric isn't "cost per session" — it's _cost per shipped feature_. A team that uses $1,000 in Claude to ship a feature that would have taken a week of engineer salary is winning. Track outcomes, not raw spend, and resist the urge to squeeze the last 5% out of individual sessions if it costs a day of throughput.
:::
::::

::::docs-section{id="template" title="The Token-Efficient Session Template"}
Put this together and a single session looks roughly like the flow below. Not every step every time — but the shape holds across thousands of hours of real work.

```plaintext [session flow]
1. START
   - Open the repo. CLAUDE.md is thin (<3K), .gitignore covers the noise.
   - StatusLine is visible. Green ctx, $0.

2. ORIENT (Opus, plan mode)
   /model opus
   Enter plan mode, give the task, wait for a written plan.

3. EXECUTE (Sonnet)
   /model sonnet
   Follow the plan. Small diffs. Let hooks format and trim.

4. DELEGATE HEAVY READS (Haiku subagent)
   Fan out read-only explorations to Haiku subagents.
   Main session gets back 2K summaries, not 50K reads.

5. WATCH THE LINE
   StatusLine turns yellow at 70%. Wrap up task.
   Turns red at 80%. STOP.

6. COMPACT OR CLEAR
   Mid-task? /compact
   Between tasks? /clear
   Cross-session? Ask for handoff.md, then /clear.

7. CLOSE
   /cost to log the spend. If surprising, open ccusage and see why.
```

:::docs-callout{variant="success" title="If you do only three things"}
Tighten your `.gitignore`. Put `CLAUDE.md` on a diet. Show a StatusLine. Everything else in this chapter is refinement on top of those three moves — and those three alone typically drop spend by 50–60% in the first week.
:::
::::
