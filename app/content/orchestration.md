---
title: Orchestration
eyebrow: Scale beyond one session
accent: orchestration
icon: LucideNetwork
description: Multi-agent patterns, the 3-tier orchestrator landscape, Agent Teams, git worktrees, AGENTS.md, and quality gates.
estReadTime: 25 min
tocItems:
  - { id: when, title: When to Scale Up, level: 2 }
  - { id: tiers, title: The 3 Tiers, level: 2 }
  - { id: graduation, title: Subagents → Teams, level: 2 }
  - { id: worktrees, title: Git Worktrees, level: 2 }
  - { id: models, title: Conductor vs Orchestrator, level: 2 }
  - { id: teams, title: Agent Teams Deep Dive, level: 2 }
  - { id: gates, title: Quality Gates, level: 2 }
  - { id: agents-md, title: AGENTS.md, level: 2 }
  - { id: econ, title: Token Economics, level: 2 }
  - { id: external, title: External Orchestrators, level: 2 }
prev: { title: Token Mastery, path: /tokens }
next: { title: Evals, path: /evals }
seo:
  title: Orchestration — Multi-Agent Claude Code at Scale
  description: "When to scale up from a single session: the 3-tier orchestrator landscape, subagents graduating to Agent Teams, git worktrees, conductor vs orchestrator models, AGENTS.md, quality gates, token economics, and external orchestrators compared."
  keywords:
    - multi-agent orchestration
    - claude code subagents
    - agent teams
    - git worktrees
    - agents md
    - conductor orchestrator
    - quality gates
    - parallel agents
  proficiencyLevel: Advanced
  timeRequired: PT25M
---

Most of this guide assumes one Claude, one session, one working directory. That model works for 90% of what you'll do. Orchestration is about the other 10% — work that's either too big for one context window, too parallel to be sequential, or too repetitive to babysit. The tools here (subagents, worktrees, Agent Teams, AGENTS.md) don't make Claude smarter. They let you run _more of it at once_ without the outputs colliding.

::::docs-section{id="when" title="When to Scale Up"}
Scaling up adds real cost: more tokens, more coordination overhead, more places for state to drift. Don't reach for it until one of these signals shows up.

- **Your context hits 70% before you've written code.** Exploration alone is filling the window. Push exploration into a subagent so only the summary lands in your main session.
- **The task has 2+ independent streams.** "Build the API and the UI in parallel" or "migrate 8 files with the same refactor." Sequential execution leaves real time on the table.
- **You're running the same motion repeatedly.** Five bug fixes this afternoon? That's a team-of-implementers problem, not a single-session problem.
- **You need a second opinion you trust.** A reviewer subagent that can't see your main context will catch things you and your main Claude both missed.

:::docs-callout{variant="warning" title="The anti-signal"}
If the work is inherently sequential — each step needs the previous step's output — parallelism buys you nothing and costs you 2-3× tokens. A database migration that runs schema → data → verification is not an orchestration problem. It's a workflow problem. Solve it in one session with checkpoints.
:::

### The 2-minute test

Before spawning anything, ask: _"Could I describe the sub-task in a self-contained prompt that doesn't reference my current conversation?"_ If yes, a subagent (or a parallel session) works. If you'd need to paste your last 15 turns as preamble, it's not independent enough — stay in one session.
::::

::::docs-section{id="tiers" title="The 3 Tiers"}
Every orchestration setup lands in one of three tiers. Pick the lowest tier that solves your problem — complexity compounds fast above tier 1.

| Tier | Shape | You reach for it when | Cost |
|---|---|---|---|
| **1 — Subagents** | Main Claude delegates to named agents via the `Task` tool. Same session, fresh context per call. | Exploration, review, research, parallel classification tasks. | 1–3× tokens, seconds of latency. |
| **2 — Agent Teams** | Multiple Claude sessions (often in separate worktrees) coordinated by an `AGENTS.md` and shared state on disk. | Parallel feature work, long-running refactors, conductor-style human-in-the-loop. | 3–10× tokens, minutes to hours. |
| **3 — External orchestrator** | A program (Claude Agent SDK, LangGraph, CrewAI, n8n, etc.) spawns and routes Claude calls. No `claude` CLI in the hot path. | Production agent systems, user-facing agents, scheduled pipelines. | Whatever your infra costs; Claude Code is no longer involved. |

The most common mistake is skipping from tier 1 to tier 3 because "proper orchestration means a framework." It almost never does. A well-designed tier-2 team with a good `AGENTS.md` handles 80% of what people build frameworks for.

:::docs-callout{variant="info" title="Where each tier lives in this guide"}
Tier 1 (subagents) is covered in [Extensions → Subagents](/extensions#subagents). Tier 2 (Agent Teams) is this section's main event. Tier 3 lives at the bottom — [External Orchestrators](#external) — because it's a different product category.
:::
::::

::::docs-section{id="graduation" title="Subagents → Teams"}
Tier 1 has a ceiling. You'll know you've hit it when you see these:

- Your main session is spending 30%+ of its turns coordinating subagents instead of thinking about your problem.
- Two subagents need to edit the same file and you're manually sequencing them.
- You want a subagent to run for 20 minutes while you keep working — but subagents block the main session.
- You need different agents to have different git branches open simultaneously.

That's the moment to graduate. Here's the minimum viable migration:

```bash [from subagent to team in 4 commands]
# 1. Give each agent its own worktree
git worktree add ../repo-impl -b feat/auth-impl main
git worktree add ../repo-review -b feat/auth-review main

# 2. Start a Claude session in each, in separate terminals
(cd ../repo-impl && claude)
(cd ../repo-review && claude)

# 3. Create shared state both can read/write
mkdir -p .claude/state/feat-auth

# 4. Point both at the same AGENTS.md (checked in at repo root)
#    — see the AGENTS.md section below for the template
```

The key shift: tier 1 is _one Claude talking to itself_, tier 2 is _multiple Claudes talking through files on disk_. Shared state in `.claude/state/` replaces the implicit shared context of a single session.

### What graduation does NOT mean

- You don't need a framework. Bash, git worktrees, and markdown files are enough.
- You don't need a message bus. The filesystem is your message bus.
- You don't need to abandon the main Claude. It stays as the **conductor** — the one you talk to — and it spawns or instructs the others.
::::

::::docs-section{id="worktrees" title="Git Worktrees"}
Git worktrees let one repo have multiple working directories, each on its own branch, sharing the same `.git` store. They're the load-bearing primitive of tier 2 orchestration — every parallel agent gets its own directory, edits its own files, and commits to its own branch with zero contention.

### The 60-second tour

```bash [essential worktree commands]
# Create a new worktree on a new branch
git worktree add ../myproject-featA -b feat/A main

# Create one on an existing branch
git worktree add ../myproject-hotfix hotfix/login

# List everything
git worktree list
#   /Users/you/myproject          abc123 [main]
#   /Users/you/myproject-featA    def456 [feat/A]
#   /Users/you/myproject-hotfix   ghi789 [hotfix/login]

# Remove when done (deletes the dir, keeps the branch)
git worktree remove ../myproject-featA

# Force-remove if the dir has uncommitted changes
git worktree remove --force ../myproject-featA

# Prune stale entries (after manual rm -rf, etc.)
git worktree prune
```

### Why this matters for Claude

- **No write contention.** Two Claudes editing `src/auth.ts` in the same directory is a race condition. In separate worktrees, it's two branches that merge cleanly at the end.
- **Independent state.** Each directory has its own `node_modules`, its own build output, its own terminal history. A failed migration in worktree A doesn't corrupt worktree B.
- **Cheap branching experiments.** Run three different approaches to the same task, keep the winner, delete the rest. This is the [Best of N](/workflows#best-of-n) pattern.

### A real parallel-work setup

```bash [parallel feature work]
# Main session stays in the primary checkout — this is the conductor
cd ~/code/myapp

# Spawn worker worktrees
git worktree add ../myapp-api      -b feat/billing-api      main
git worktree add ../myapp-ui       -b feat/billing-ui       main
git worktree add ../myapp-migrate  -b feat/billing-migrate  main

# Open one terminal per worker, start Claude in each
# Terminal 1:  cd ../myapp-api     && claude
# Terminal 2:  cd ../myapp-ui      && claude
# Terminal 3:  cd ../myapp-migrate && claude

# When all three branches are green, merge them in the main checkout
cd ~/code/myapp
git merge --no-ff feat/billing-migrate
git merge --no-ff feat/billing-api
git merge --no-ff feat/billing-ui

# Clean up
git worktree remove ../myapp-api
git worktree remove ../myapp-ui
git worktree remove ../myapp-migrate
```

:::docs-callout{variant="tip" title="One CLAUDE.md, many worktrees"}
Every worktree shares the repo's `CLAUDE.md` via the same git objects — edit it once, every agent sees the update next turn. The only per-worktree state you need to think about is `.claude/state/` (if you scope it per-branch) and `.env` files (which aren't checked in).
:::

### Pitfalls

- **Submodules and LFS** can behave oddly across worktrees. Test once before committing to this workflow in a repo that uses them.
- **Tooling that hardcodes paths** (some node scripts, IDE caches) can point back at the main checkout. Prefer relative paths in scripts.
- **Leftover worktrees** accumulate. Run `git worktree list` weekly; delete anything older than a week you don't recognize.
::::

::::docs-section{id="models" title="Conductor vs Orchestrator"}
Two coordination models, picked by _who decides what runs next_.

### Conductor model (human-driven)

You're the conductor. You start agent A, read its output, decide whether to run agent B or repair agent A. The main Claude session is just one of your hands.

```text [a conductor session]
You (to main Claude): Review the plan doc at .claude/state/plans/auth.md
                      and tell me if it's ready for implementation.
Main Claude:          LGTM, but step 3 is ambiguous — should the JWT expire
                      in 15m or 24h?
You:                  15m. Update the plan.
You (switch terminal, in ../repo-impl): Implement step 1 of the plan
                                         at .claude/state/plans/auth.md.
```

**Pick this when:** the work is novel, the stakes are medium-to-high, or your `AGENTS.md` is still evolving. You catch drift in real time.

### Orchestrator model (Claude-driven)

The main Claude is the orchestrator. Given a goal, it reads `AGENTS.md`, spawns the right subagents in the right order, and only comes back to you for approvals or when it's stuck.

```text [an orchestrator prompt]
You: Ship feature "password reset flow" end-to-end. Follow AGENTS.md.
     Stop and ask me only if:
       - a plan step seems wrong
       - a test fails 3 times in a row
       - you need a secret or external access I haven't provided
Main Claude: [spawns planner → reviews plan with you → spawns implementer
              → spawns tester → spawns reviewer → reports]
```

**Pick this when:** you've shipped this shape of feature 5+ times, `AGENTS.md` is stable, and the cost of an extra round-trip is high (e.g. you're AFK for lunch).

:::docs-callout{variant="info" title="You don't pick one forever"}
Same repo, same team — you'll conductor the novel stuff and orchestrate the routine stuff. The `AGENTS.md` you write for orchestrator-mode is what you slowly build up _while_ you're in conductor-mode. That's the compound-learning loop.
:::
::::

::::docs-section{id="teams" title="Agent Teams Deep Dive"}
Extensions introduced the idea. This section shows a complete, minimal team you can copy.

### The four files

```text [team layout]
repo/
├── AGENTS.md                       # the team charter
├── CLAUDE.md                       # the repo's shared context
├── .claude/
│   ├── agents/
│   │   ├── planner.md
│   │   ├── implementer.md
│   │   ├── reviewer.md
│   │   └── tester.md
│   └── state/                      # agents read/write here
│       ├── plans/
│       ├── reviews/
│       └── runs/
```

### The AGENTS.md

```markdown [AGENTS.md]
# Feature-work Agent Team

Four roles coordinate to ship one feature at a time. The main Claude session
is the orchestrator; everyone else is a subagent or a parallel worktree.

## Roles

| Role         | Tools                       | Model  | Can edit source? |
| ------------ | --------------------------- | ------ | ---------------- |
| planner      | Read, Grep, Glob, Write     | opus   | no (plans only)  |
| implementer  | Read, Edit, Write, Bash     | sonnet | yes              |
| tester       | Read, Edit, Write, Bash     | sonnet | only `**/*.test.*` |
| reviewer     | Read, Grep, Glob, Bash(git) | opus   | no               |

## Ordering

planner → implementer → tester → reviewer → orchestrator (ship or repair).

## Shared state

- Plans:   `.claude/state/plans/<feature>.md`
- Reviews: `.claude/state/reviews/<feature>.md`
- Runs:    `.claude/state/runs/<feature>/<iso-timestamp>.md`

Every role ends its turn by writing a summary to the appropriate file.

## Rules of engagement

- The planner NEVER writes code. If it catches itself, stop and write a plan step.
- The reviewer NEVER edits. Verdicts go to `state/reviews/`.
- The tester edits only test files. If a test requires a source change,
  hand back to the orchestrator with a note.
- Any role that spends >5 turns without progress stops and reports blocker.
```

### A single agent file

```markdown [.claude/agents/implementer.md]
---
name: implementer
description: Use this agent to execute ONE step of a plan at `.claude/state/plans/<feature>.md`. It edits source files, runs the test suite, and reports what changed.
tools: Read, Edit, Write, Bash(npm test), Bash(git diff*)
model: sonnet
---

You are the implementer on a feature team. You receive a feature slug and a
step number. You execute exactly that step and no more.

## Workflow

1. Read `.claude/state/plans/<feature>.md`. Find step <N>.
2. Implement it. Do not touch files outside the plan's scope.
3. Run `npm test -- --related` (or the project's equivalent) until green.
4. Append a run log to `.claude/state/runs/<feature>/<iso-timestamp>.md`
   with the step number, files touched, and test results.
5. Return a one-line summary to the orchestrator.

## Rules

- If step <N> is ambiguous, STOP. Do not guess. Hand back with a question.
- If tests fail 3× in a row, STOP. Report the failure and what you tried.
- NEVER modify the plan file. If the plan is wrong, report it; don't fix it.
```

### Running the team

From the main Claude session in the primary worktree:

```text [kicking off a run]
We're adding "soft delete for user accounts." Run the team:

1. Use the planner agent to turn this into a plan at
   .claude/state/plans/soft-delete.md. Stop and show me when done.
2. After I approve the plan, use the implementer agent for each step
   in sequence.
3. After implementation, use the tester agent to extend tests.
4. Finally, use the reviewer agent to file a review.
5. Report back with the review's verdict.
```

:::docs-callout{variant="tip" title="Start with two roles"}
Four roles is the end state. Start with _planner_ + _implementer_. Add _reviewer_ when you trip over the same bug twice. Add _tester_ when coverage starts slipping. Don't build the whole menagerie on day one — you'll spend more time curating it than shipping.
:::
::::

::::docs-section{id="gates" title="Quality Gates"}
A quality gate is a check that blocks progress until it passes. In a single session, _you_ are the gate — you review before merging. With multiple agents running in parallel, you can't be everywhere. Gates move the checking into the loop.

### Three kinds of gate

- **Blocking** — the run stops until the check passes. Typecheck, unit tests, lint with errors.
- **Warning** — the run continues but flags the issue. Lint with warnings, coverage dips, perf budgets.
- **Informational** — the check records data for later. Diff size, file count, token cost.

### Gates as hooks (the automated path)

A `PostToolUse` hook that runs after every `Edit` is the simplest gate you'll write:

```json [.claude/settings.json]
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm run -s typecheck 2>&1 | tail -20",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

If `typecheck` exits non-zero, Claude sees the output and self-corrects on the next turn. Gate cost: one `tsc` per edit. Worth it in most projects.

### Gates as review agents (the semantic path)

Typecheck catches syntax. It doesn't catch "this violates our service-layer convention." That's a review agent:

```text [prompt to main Claude, after implementer finishes]
Use the reviewer agent to audit the diff on feat/billing-api.
The review is blocking: do NOT merge until the reviewer returns LGTM.
```

Pair the review with a simple `bash` check — _"has `.claude/state/reviews/billing-api.md` been written in the last 10 minutes and does its first line say `LGTM`?"_ — and you've got a hard gate without any CI.

### Gates in CI (the last line of defense)

Everything above runs on your machine. For work headed to production, add CI gates that don't trust the local run:

```yaml [.github/workflows/pr.yml (excerpt)]
- run: npm run typecheck
- run: npm test
- run: npm run lint -- --max-warnings=0
- run: npx claude-code-review  # runs an eval-based review agent in CI
```

The combination of local hook + review agent + CI makes it genuinely hard to merge a regression. Each catches a different class of failure.
::::

::::docs-section{id="agents-md" title="AGENTS.md"}
`AGENTS.md` is to a team what `CLAUDE.md` is to a single session: the shared context every agent loads before doing anything. The difference is that `AGENTS.md` is about the _choreography_ — who does what, in what order, with what tools.

### What goes in AGENTS.md

- The roster (with tools + models per role)
- The ordering (the default pipeline, with allowed skips/repairs)
- The shared-state convention (where plans, reviews, run logs live)
- The rules of engagement (who can edit what, when to stop)
- The escalation path (when to hand back to the human)

### What does NOT

- Anything a role-specific `.claude/agents/<role>.md` can say — put the specifics there.
- Domain conventions (those go in `CLAUDE.md`).
- Secrets, environment, or machine-specific paths.

### The compound-learning loop

`AGENTS.md` is where your team's _meta-experience_ lives. Every time you catch a coordination bug — implementer edited a test file, reviewer started proposing fixes, planner started writing code — patch the rules of engagement. After a few weeks, the doc reflects the actual way your team works. New agents you spin up inherit that lessons-learned for free.

:::docs-callout{variant="success" title="The diff test"}
Once a month, `git log -p AGENTS.md` and read the diffs. Every edit should correspond to a specific failure you hit. If you see rules with no story behind them, delete them — they're cargo cult.
:::
::::

::::docs-section{id="econ" title="Token Economics"}
Parallelism costs tokens. Every additional Claude session has its own system prompt, its own tools, its own `CLAUDE.md` — typically 30–50K tokens of overhead before any work starts. Three parallel agents cost roughly 3× the baseline _plus_ whatever each agent consumes on task.

### A rough calculator

For a feature that would take one session ~100K tokens end-to-end:

| Setup | Token cost | Wall time | Good when |
|---|---|---|---|
| Solo session | ~100K | 60 min | Simple features, novel work |
| Solo + 1 review subagent | ~130K | 65 min | Anything you'd ship to prod |
| 3-agent team, sequential | ~200K | 45 min | Clear plan, parallelizable steps |
| 3-agent team, parallel worktrees | ~250K | 20 min | You have deadline pressure |
| Best-of-N (3 attempts) | ~300K | 30 min | High-ambiguity, subjective quality |

### When it pays off

- **Your hourly rate > your token bill.** If parallel work saves you 30 minutes and costs $3 extra, that's a rounding error.
- **The team is well-shaped.** Re-running the same Team on the same type of feature amortizes the `AGENTS.md` investment.
- **You'd have failed the first time anyway.** Review agents catch issues that would cost 10× the tokens to fix after ship.

### When it doesn't

- **One-off exploratory work.** You won't know what shape the solution should take until you've done it once. Parallel attempts at the wrong problem don't help.
- **Sequential features disguised as parallel.** If step B depends on step A's output, running them in parallel means step B starts with stale assumptions and has to be redone.
- **Unstable models/tools.** If you haven't yet verified that the Claude-per-role idea works for your codebase, three failures in parallel is just more failures.

See [Token Mastery → Subagent Economics](/tokens#subagent-econ) for a deeper breakdown of the subagent side of this math.
::::

::::docs-section{id="external" title="External Orchestrators"}
Everything above keeps Claude Code in the driver's seat. At some point, you'll hit a problem that isn't really a Claude Code problem anymore — it's a product, or a pipeline, or a scheduled job. That's when you move to tier 3.

### Claude Agent SDK

Anthropic's official SDK for embedding Claude-Code-style agents in your own programs. Same harness concepts (tools, sub-agents, hooks) exposed as a Python/TypeScript API. Choose this when:

- You're building an agent that lives inside an app, not a terminal.
- You need programmatic control over the loop (retries, timeouts, tool whitelisting).
- You want the Claude Code mental model without the Claude Code CLI.

### Framework orchestrators (LangGraph, CrewAI, n8n, etc.)

Graph-based or flow-based systems that route LLM calls through a state machine. Claude is one node among many; the framework owns the control flow. Choose when:

- Multiple model providers (Claude + OpenAI + local) participate in the same flow.
- The flow is long-lived, event-driven, or needs to survive process restarts.
- You need a visual editor, audit logs, or enterprise-grade observability out of the box.

### When external is the wrong answer

Every team I've watched adopt a framework before tier 2 spent 2–4 weeks fighting it. The failure mode is always the same: the framework's abstractions don't match the team's actual workflow, so people build workarounds that recreate the Claude Code primitives one at a time. By the time they're productive, they've written a worse Agent Teams setup at 10× the complexity.

:::docs-callout{variant="warning" title="The tier-3 escape hatch"}
You earn the right to tier 3 by outgrowing tier 2. If you're at tier 1 and reaching for LangGraph, you're almost certainly solving the wrong problem. Get to a working `AGENTS.md` + worktree setup first. If _that_ starts creaking, frameworks are the next honest step.
:::

### The decision, in one sentence

Stay in tier 2 as long as the agents are helping _you_ ship. Move to tier 3 when the agents are shipping for _someone else_.
::::
