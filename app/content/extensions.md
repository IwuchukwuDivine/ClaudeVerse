---
title: Extensions
eyebrow: The 6 layers
accent: extensions
icon: LucidePuzzle
description: Skills, Commands, Hooks, Subagents, Agent Teams, MCP, Plugins, and LSP — when to reach for each, with a paste-ready example for every layer.
estReadTime: 35 min
tocItems:
  - { id: decision, title: Decision Framework, level: 2 }
  - { id: skills, title: Skills, level: 2 }
  - { id: commands, title: Commands, level: 2 }
  - { id: hooks, title: Hooks, level: 2 }
  - { id: subagents, title: Subagents, level: 2 }
  - { id: agent-teams, title: Agent Teams, level: 2 }
  - { id: mcp, title: MCP, level: 2 }
  - { id: plugins, title: Plugins, level: 2 }
  - { id: lsp, title: LSP, level: 2 }
prev: { title: Workflows, path: /workflows }
next: { title: Token Mastery, path: /tokens }
seo:
  title: Extensions — Skills, Hooks, Subagents, MCP & More
  description: The nine extension layers of Claude Code explained with paste-ready examples: Skills, Commands, Hooks, Subagents, Agent Teams, MCP, Plugins, and LSP — with a decision framework for which to reach for when.
  keywords:
    - claude code extensions
    - skills
    - slash commands
    - hooks
    - subagents
    - agent teams
    - mcp
    - model context protocol
    - plugins
    - lsp
    - AGENTS.md
  proficiencyLevel: Intermediate
  timeRequired: PT35M
---

The base Claude Code loop — read, edit, run, respond — is already useful. But every shop that's running Claude at scale has layered _extensions_ on top: little configuration files that give Claude new capabilities, new guardrails, and new collaborators. This chapter walks each of the nine layers, from the simplest (a slash command in a markdown file) to the most elaborate (a multi-agent team with its own AGENTS.md). By the end you should be able to read any Claude Code repo on GitHub and recognize what each file is doing.

Every section ships with a working example. Copy it, change a name, and commit — that's the whole onboarding.

::::docs-section{id="decision" title="Decision Framework"}
There's a tempting anti-pattern early on: "I'll solve this with a hook!" for anything that involves Claude doing something wrong. Sometimes a hook is right. Often a `CLAUDE.md` line is right. Sometimes it's a subagent. Before reaching for any layer, ask the question below and match it to the row.

| If you want…                                          | Reach for            | Why                                                    |
| ----------------------------------------------------- | -------------------- | ------------------------------------------------------ |
| Claude to follow a rule every session                 | `CLAUDE.md`          | Cheap, always-on, no config                            |
| Expertise Claude loads _only when relevant_           | **Skill**            | Triggered by context, costs nothing otherwise          |
| A repeatable prompt you re-type a lot                 | **Slash command**    | One file, one-liner to invoke                          |
| A deterministic action on every file write            | **Hook**             | Not Claude's choice — the harness guarantees it        |
| A big investigation that would blow context           | **Subagent**         | Fresh window, returns a summary                        |
| Multiple specialists collaborating                    | **Agent Team**       | Coordinated, parallel, shared state                    |
| Claude to read/write an external service              | **MCP server**       | Structured tools, not scraped terminal output          |
| A bundle of the above, distributable                  | **Plugin**           | One install command for your team                      |
| Real-time language diagnostics                        | **LSP integration**  | Claude sees errors as you edit                         |

:::docs-callout{variant="tip" title="The smallest thing that works"}
When in doubt, pick the row higher in the table. A well-written `CLAUDE.md` rule prevents more mistakes than a clever hook. Hooks that duplicate rules already in CLAUDE.md are noise. Save hooks for things Claude can't refuse to do — not things you'd _like_ it to do.
:::

### Mental model: where does each layer live?

Think of Claude Code as a stack, from closest to the model outward:

- **Model** — Opus / Sonnet / Haiku. You don't extend this; you pick it.
- **System prompt + CLAUDE.md** — always present. Personality, project rules.
- **Skills** — on-demand knowledge, injected when Claude judges them relevant.
- **Commands** — user-invoked prompt templates.
- **Tools** — Read, Edit, Bash, plus MCP-supplied ones.
- **Hooks** — the harness intercepting tool calls.
- **Subagents / Teams** — additional Claude instances spawned by the main one.

Extensions aren't competing with each other — they compose. A mature project uses five or six of them, each doing the job it's best at.
::::

::::docs-section{id="skills" title="Skills"}
A **Skill** is a folder with a `SKILL.md` inside. When Claude's current context matches the skill's description, the harness automatically injects the file's contents — giving Claude just-in-time expertise without paying the token cost when it's not needed. This is the single most underused extension in the whole platform.

Skills live in three places, scanned in order:

- `~/.claude/skills/` — your personal skills across every project.
- `.claude/skills/` — project skills the whole team gets.
- Bundled with plugins you install — covered later.

```markdown [.claude/skills/postgres-migrations/SKILL.md]
---
name: postgres-migrations
description: Use this skill whenever the user wants to create, modify, roll back, or review a Postgres migration in this project. Triggers include any mention of 'migration', a new file under `db/migrations/`, or ALTER/CREATE TABLE changes. Do NOT trigger on unrelated SQL queries inside application code.
---

# Writing safe Postgres migrations

## House conventions

- Every migration is a pair: `NNN_name.up.sql` and `NNN_name.down.sql`.
- `NNN` is a zero-padded 4-digit number, one higher than the highest on disk.
- All DDL is wrapped in `BEGIN; ... COMMIT;` — no exceptions.
- `CREATE INDEX` must use `CONCURRENTLY` in production, which means it cannot be inside the transaction. Emit a second migration for the index.

## Before you write

1. Run `ls db/migrations | tail -n 5` and pick the next number.
2. Read the most recent 2 migrations for naming style.
3. Confirm the target table's current shape with `psql -c '\d tablename'`.

## Rollback rule

Every `up.sql` must have a reversible `down.sql`. If the change isn't reversible (data loss, irreversible type change), refuse and ask for a plan from the user.

## Example

up: add a nullable column, backfill in a follow-up, then NOT NULL in a third migration.
```

### The two rules of a great skill description

The `description` field in the YAML frontmatter is the _only_ thing the model sees when deciding whether to load the skill. Treat it like a trigger specification, not a sales pitch.

1. **Start with "Use this skill when…"** and name concrete nouns the user would type.
2. **Include a "do NOT trigger" clause** to suppress false positives on neighboring topics.

:::docs-callout{variant="info" title="Anatomy of a skill folder"}
A skill can be just a single `SKILL.md`, but it can also ship scripts, reference docs, and templates. Put them alongside the markdown and reference them with paths like `scripts/backfill.sh` — Claude resolves those relative to the skill's folder.

Keep `SKILL.md` under 500 lines. If the knowledge is longer, split it into a short SKILL.md that _points_ to sibling files Claude loads on demand.
:::

### Skills vs CLAUDE.md — when to use which

`CLAUDE.md` is for rules that apply to every turn. Skills are for rules that apply to _some_ turns. A convention like "use pnpm, not npm" belongs in CLAUDE.md. A 200-line walkthrough of your OAuth flow belongs in a skill — it's useless token spend on the 80% of sessions that don't touch auth.
::::

::::docs-section{id="commands" title="Commands"}
A **slash command** is a saved prompt. You put a markdown file in `.claude/commands/`, and typing `/name` expands it into Claude's input. Variables, tool restrictions, even model selection — all configurable.

Commands are the cheapest extension on the stack: one file, no code, no install. If you catch yourself typing the same paragraph twice, make a command.

```markdown [.claude/commands/review-pr.md]
---
description: Review the current branch against main as if you were a staff engineer
argument-hint: [focus-area]
allowed-tools: Read, Grep, Glob, Bash(git diff*), Bash(git log*)
model: opus
---

You are a staff-level engineer doing a code review. The user wants your honest opinion, not a rubber stamp.

Inspect the diff vs main:

    !`git diff --stat origin/main...HEAD`
    !`git log --oneline origin/main..HEAD`

For the full diff, run `git diff origin/main...HEAD` as needed.

$ARGUMENTS

Produce a review with:

1. **Summary** — one paragraph on what this PR does and whether it's ready.
2. **Blocking** — issues that must be fixed before merge. Cite file:line.
3. **Non-blocking** — style, naming, or follow-up suggestions. Cite file:line.
4. **Missing tests** — cases not covered that matter.
5. **Verdict** — `LGTM`, `LGTM with suggestions`, or `Needs changes`.

Be specific. 'Consider refactoring' is not a comment.
```

### How commands differ from skills

- **You invoke commands.** Claude decides when to load skills.
- **Commands expand once.** Skills stay in context for the turn.
- **Commands can restrict tools.** `allowed-tools` in frontmatter scopes what Claude can do inside that invocation.

### Dynamic commands with shell substitution

Prefixing a line with `!` runs a shell command and inlines its stdout into the prompt. It's how a review command can show Claude the diff without you pasting it. Prefix with `@` to inline a file path.

```markdown [.claude/commands/debug-last.md]
---
description: Debug the last failing test
allowed-tools: Read, Edit, Bash(npm test*)
---

The last test run failed. Here's the output:

!`npm test 2>&1 | tail -n 60`

Relevant test file:

@$ARGUMENTS

Phase 1: Read the failing file and the module under test. Do NOT edit yet.
Phase 2: Explain what's breaking. One paragraph.
Phase 3: Propose a fix. Wait for approval before editing.
```

:::docs-callout{variant="tip" title="Personal vs team commands"}
Personal commands go in `~/.claude/commands/`. Team commands go in `.claude/commands/` and are committed. Namespacing: a file at `.claude/commands/db/migrate.md` is invoked as `/db:migrate`.
:::
::::

::::docs-section{id="hooks" title="Hooks"}
Hooks are the harness intercepting tool calls. They fire on fixed events: before a tool runs, after a tool runs, when Claude is about to respond, when a session starts, when it ends. Each hook is a shell command that reads JSON on stdin and exits with a status code.

Hooks are for _deterministic_ policy. "Format every file you save" is a hook — formatting shouldn't depend on whether Claude remembered. "Block pushes to main" is a hook — the cost of getting that wrong is too high to trust to a rule.

### The event surface

| Event                                         | Fires when…                                   | Typical use                              |
| --------------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| `PreToolUse`                                  | Before a tool runs — can block it             | Deny dangerous bash, require approval    |
| `PostToolUse`                                 | After a tool returns                          | Format on save, lint, commit nudges      |
| `UserPromptSubmit`                            | Before Claude sees your message               | Inject current git branch, redact secrets |
| `Stop`                                        | Claude finishes a turn                        | Run tests, send notification, checkpoint |
| `SessionStart` / `SessionEnd`                 | Session lifecycle                             | Bootstrap env, log session summary       |

```json [.claude/settings.json]
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/format-on-save.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/deny-destructive.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/run-tests.sh"
          }
        ]
      }
    ]
  }
}
```

```bash [.claude/hooks/format-on-save.sh]
#!/usr/bin/env bash
# PostToolUse hook: format files Claude just wrote.
# Reads JSON on stdin, extracts file paths, runs prettier.

set -euo pipefail

# Input looks like: { "tool": "Edit", "tool_input": { "file_path": "..." } }
PATHS=$(jq -r ".tool_input.file_path // empty" <<< "$(cat)")

[ -z "$PATHS" ] && exit 0

for f in $PATHS; do
  case "$f" in
    *.ts|*.tsx|*.js|*.jsx|*.vue|*.json|*.md)
      npx --yes prettier --write "$f" >/dev/null 2>&1 || true
      ;;
  esac
done

exit 0
```

```bash [.claude/hooks/deny-destructive.sh]
#!/usr/bin/env bash
# PreToolUse hook: block obviously destructive shell commands.
# Exit 2 = block + return message to Claude.

set -euo pipefail

CMD=$(jq -r ".tool_input.command // empty" <<< "$(cat)")

deny() {
  echo "Blocked by policy: $1" >&2
  exit 2
}

case "$CMD" in
  *"rm -rf /"*|*"rm -rf ~"*) deny "recursive delete of system paths" ;;
  *"git push --force"*)       deny "force-push requires a human" ;;
  *"git reset --hard origin"*) deny "hard reset to remote — confirm with a human" ;;
esac

exit 0
```

:::docs-callout{variant="warning" title="Exit codes matter"}
**0** — continue silently. **2** — block the tool call and return stderr to Claude (it will read the message and adjust). Anything else — error, the harness surfaces it to you.
:::

### Hooks vs CLAUDE.md rules

A CLAUDE.md rule is a suggestion Claude can forget. A hook is policy the machine enforces. Rule of thumb: if the cost of non-compliance is "minor annoyance," use CLAUDE.md. If the cost is "production outage," use a hook. Use both when it matters — CLAUDE.md explains why, the hook guarantees it.
::::

::::docs-section{id="subagents" title="Subagents"}
A **subagent** is a Claude instance spawned by your main Claude, with a fresh context window and a specific job. The main Claude hands off the task via the `Task` tool, the subagent does its work, and only the final summary comes back. Your main context stays clean.

The pattern unlocks two things: parallelism (spawn three subagents at once, wait for all three) and context isolation (a subagent can read 500 files without polluting the main conversation).

```markdown [.claude/agents/codebase-explorer.md]
---
name: codebase-explorer
description: Use this agent when you need to quickly understand how something works across many files. Specify thoroughness: 'quick' for 2-3 files, 'medium' for a feature, 'thorough' for cross-cutting concerns. Returns a structured answer — does not edit.
tools: Read, Grep, Glob, Bash(git log*), Bash(git blame*)
model: haiku
---

You are a code explorer. Your job is to answer a focused question about an unfamiliar codebase with surgical precision.

## Your rules

- You do NOT edit files. Ever. Your tool set reflects that.
- Start broad (Glob), narrow (Grep), then confirm (Read).
- If you read more than 30 files without answers, stop and report what you found.
- Always cite file:line when you make a claim.

## Output format

Return one of these, nothing else:

**Answer:** <the direct answer>
**Evidence:**
- `src/foo.ts:42` — <what it shows>
- `src/bar.ts:108` — <what it shows>
**Confidence:** high | medium | low
**Follow-ups:** <only if the main Claude should investigate further>
```

### How the main Claude invokes a subagent

From the main session, you describe the task and Claude chooses the agent by name. The delegation looks like this in your transcript:

```text [prompt]
Use the codebase-explorer agent with "medium" thoroughness to find every place we cache user profiles. I want the caching key format, the TTL, and which service writes vs reads. Do not change any code.
```

:::docs-callout{variant="info" title="Subagents and token economics"}
Subagents pay their own context cost. A fresh 50K-token exploration in a subagent costs the same as doing it inline — except only a 2K summary lands in your main conversation. For one-off questions, inline is cheaper. For questions you'll re-ask over the session, delegation is.
:::

### When NOT to use a subagent

- Short, fast questions — spinning up a fresh context adds latency.
- Tasks that require back-and-forth with the user — subagents can't pause for clarification.
- Anything that needs the main session's existing context — subagents start blank, they don't inherit your scratchpad.
::::

::::docs-section{id="agent-teams" title="Agent Teams"}
An **agent team** is the next step up: multiple subagents working in parallel, coordinated by an orchestrator, with shared state on disk. You get this when you structure your repo around `AGENTS.md` — a sibling to `CLAUDE.md` that names the roles and the rules of engagement.

```markdown [AGENTS.md]
# Agent Team

This repo runs a four-agent team for feature work. The orchestrator (the main Claude session) delegates to three specialists.

## Roles

- **planner** — turns a feature request into a written plan. Read-only. Model: opus.
- **implementer** — executes one plan step end-to-end. Model: sonnet.
- **reviewer** — reads the diff and files a PR review. Read-only. Model: opus.
- **tester** — writes or extends tests for the change. Model: sonnet.

## Shared state

- Plans live at `.claude/state/plans/<feature>.md`.
- Reviews live at `.claude/state/reviews/<feature>.md`.
- Every agent reads and writes here; the orchestrator is the traffic cop.

## Rules of engagement

- Only the implementer edits source files.
- The reviewer NEVER edits. If it finds issues, it writes a review doc and hands back to the orchestrator.
- The planner never implements. If it catches itself writing code, stop and write plan steps instead.
- The tester can edit only files matching `**/*.test.*`.

## Ordering

planner → implementer → tester → reviewer → (orchestrator decides ship vs repair).
```

```markdown [.claude/agents/reviewer.md]
---
name: reviewer
description: Use this agent to review a diff for correctness, style, and missing tests. It reads but never edits. It writes its verdict to .claude/state/reviews/.
tools: Read, Grep, Glob, Bash(git diff*), Write
model: opus
---

You are the reviewer on a three-agent feature team. You receive a branch name and write a structured review.

## Workflow

1. Run `git diff main...HEAD` and read every changed file in full.
2. For each change, answer: does this do what the plan said? Is it correct? Is it tested?
3. Write your review to `.claude/state/reviews/<branch>.md` using the format below.
4. Return a one-line summary to the orchestrator.

## Review format

    # Review: <branch>

    ## Verdict
    LGTM | LGTM with suggestions | Needs changes

    ## Blocking
    - file:line — <issue>

    ## Non-blocking
    - file:line — <suggestion>

    ## Missing tests
    - <case>
```

### Conductor vs orchestrator

Two patterns dominate team setups. **Conductor** — a human drives, kicking off agents one at a time and reading results before moving on. Higher-trust, lower-risk, suitable for small teams and novel work. **Orchestrator** — the main Claude drives, calling subagents autonomously according to the AGENTS.md. Higher-throughput, best for well-shaped tasks the team has done many times.

Start with conductor. Graduate to orchestrator once your AGENTS.md is battle-tested.

:::docs-callout{variant="tip" title="Worktrees pair beautifully with teams"}
Give each concurrent agent its own git worktree. Isolated branches, no write contention on the working directory, and the reviewer can run side-by-side with the implementer. See [Orchestration → Git Worktrees](/orchestration#worktrees).
:::
::::

::::docs-section{id="mcp" title="MCP"}
**MCP** — the Model Context Protocol — is the standard for plugging external services into Claude as first-class tools. Where hooks intercept tool calls and subagents spawn new Claudes, MCP adds _new tools_ — a Linear "create issue" tool, a Postgres "run query" tool, a Sentry "fetch error" tool — that Claude calls the same way it calls `Read` or `Bash`.

An MCP server is any process that speaks the protocol. It can run locally (stdio transport) or remotely (HTTP/SSE). Anthropic and third parties publish hundreds; Claude Code discovers them from `.mcp.json` in your project or `~/.claude/mcp.json` personally.

```json [.mcp.json]
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost:5432/dev"
      ]
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-linear"],
      "env": {
        "LINEAR_API_KEY": "${env:LINEAR_API_KEY}"
      }
    },
    "filesystem-docs": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/company-docs"
      ]
    }
  }
}
```

### Choosing MCP over a shell command

You could let Claude call `psql` via Bash and scrape the output. It'll work — for a while. MCP beats it on three axes:

- **Structured returns** — rows come back as JSON, not terminal formatting Claude re-parses every time.
- **Discoverability** — MCP advertises the tools it provides; Claude knows what's available without trial and error.
- **Permissions** — you can allowlist MCP tools individually in `settings.json`, finer-grained than "allow all bash."

```json [.claude/settings.json (MCP permissions)]
{
  "permissions": {
    "allow": [
      "mcp__postgres__query",
      "mcp__linear__list_issues",
      "mcp__linear__get_issue"
    ],
    "ask": [
      "mcp__linear__create_issue",
      "mcp__linear__update_issue"
    ],
    "deny": [
      "mcp__linear__delete_issue"
    ]
  }
}
```

:::docs-callout{variant="info" title="Writing your own MCP server"}
The SDK is a few hundred lines to get running. If your team has an internal tool Claude keeps needing — a feature flag system, an audit log, an internal search engine — wrapping it in MCP is a day's work and pays back every session. See [modelcontextprotocol.io](https://modelcontextprotocol.io).
:::
::::

::::docs-section{id="plugins" title="Plugins"}
A **plugin** is a bundle: one or more skills, commands, hooks, subagents, and MCP servers, shipped as a single unit with a `plugin.json` manifest. Plugins solve the "how do I share my setup with the team" problem without asking everyone to paste eight files into the right folders.

```json [plugin.json]
{
  "name": "company-workflows",
  "version": "1.2.0",
  "description": "Internal engineering workflows: PR reviews, migrations, feature flag checks.",
  "author": "Platform Team <platform@example.com>",
  "homepage": "https://github.com/example/company-workflows",
  "commands": [
    "commands/review-pr.md",
    "commands/migrate.md",
    "commands/flag-status.md"
  ],
  "skills": [
    "skills/postgres-migrations/",
    "skills/feature-flags/"
  ],
  "agents": [
    "agents/reviewer.md"
  ],
  "hooks": "hooks.json",
  "mcpServers": {
    "flags": {
      "command": "node",
      "args": ["./mcp/flag-server.js"]
    }
  }
}
```

### Installing a plugin

```bash
# From the marketplace
claude plugin install company-workflows

# From a git repo
claude plugin install https://github.com/example/company-workflows

# Local development
claude plugin install ./path/to/plugin
```

:::docs-callout{variant="tip" title="Plugin vs copy-paste"}
Copy-paste is fine for one-off projects. The moment two engineers have the same skill in their `~/.claude/skills/`, you've got a plugin waiting to happen — one source of truth, version-pinned, one command to upgrade everyone. Future-you will thank past-you.
:::

### Marketplaces

Plugins can be grouped into _marketplaces_: a directory with a `marketplace.json` listing multiple plugins. This is how Anthropic's official plugin catalog is structured, and how companies publish internal catalogs. Your team's marketplace can live on a private GitHub repo; Claude Code honors SSH auth.
::::

::::docs-section{id="lsp" title="LSP"}
**LSP** — Language Server Protocol — is the same thing your editor uses to show red squiggles. When Claude Code is plugged into an LSP (directly in the VS Code extension, or via an MCP bridge in the terminal), it sees _live diagnostics_ as it edits. Type errors, missing imports, unresolved symbols — all before a single test runs.

For typed languages this is a step-change. The typical "edit, `npm run tsc`, see error, edit again" loop collapses to one turn.

### How the plumbing looks

- **VS Code extension** — LSP comes free, the extension brokers it to Claude.
- **Terminal CLI** — run an LSP-over-MCP bridge (several exist on npm and PyPI). The bridge spawns your project's language server and exposes diagnostics as MCP tools.
- **JetBrains plugin** — LSP built in.

```json [.mcp.json (typescript-language-server bridge)]
{
  "mcpServers": {
    "tsserver": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-lsp",
        "--",
        "typescript-language-server",
        "--stdio"
      ]
    }
  }
}
```

:::docs-callout{variant="tip" title="Pair LSP with a Stop hook"}
The strongest feedback loop in 2026: LSP for compile-time, a `Stop` hook that runs your unit tests, and a `PostToolUse` hook that runs your formatter. Claude now has three automatic verdicts on every turn: "does it type?", "does it format?", "does it pass?" The agent learns from the answers and fixes its own mistakes without you intervening.
:::

### What LSP isn't

LSP gives Claude diagnostics for the language server's own checks — type errors, lint rules your IDE knows about, unresolved imports. It doesn't replace running your tests, and it doesn't replace a good `CLAUDE.md`. Think of it as a fourth sense, not a replacement for planning.
::::
