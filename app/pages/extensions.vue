<template>
  <article>
    <DocsPageHeader
      title="Extensions"
      eyebrow="The 6 layers"
      accent="extensions"
      :icon="Puzzle"
      description="Skills, Commands, Hooks, Subagents, Agent Teams, MCP, Plugins, and LSP — when to reach for each, with a paste-ready example for every layer."
      est-read-time="35 min"
    />

    <DocsProse>
      <p>
        The base Claude Code loop — read, edit, run, respond — is already useful.
        But every shop that's running Claude at scale has layered
        <em>extensions</em> on top: little configuration files that give Claude
        new capabilities, new guardrails, and new collaborators. This chapter
        walks each of the nine layers, from the simplest (a slash command in a
        markdown file) to the most elaborate (a multi-agent team with its own
        AGENTS.md). By the end you should be able to read any Claude Code repo
        on GitHub and recognize what each file is doing.
      </p>
      <p>
        Every section ships with a working example. Copy it, change a name, and
        commit — that's the whole onboarding.
      </p>
    </DocsProse>

    <DocsSection id="decision" title="Decision Framework">
      <DocsProse>
        <p>
          There's a tempting anti-pattern early on: "I'll solve this with a hook!"
          for anything that involves Claude doing something wrong. Sometimes a
          hook is right. Often a <code>CLAUDE.md</code> line is right. Sometimes
          it's a subagent. Before reaching for any layer, ask the question below
          and match it to the row.
        </p>
        <table>
          <thead>
            <tr>
              <th>If you want…</th>
              <th>Reach for</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Claude to follow a rule every session</td>
              <td><code>CLAUDE.md</code></td>
              <td>Cheap, always-on, no config</td>
            </tr>
            <tr>
              <td>Expertise Claude loads <em>only when relevant</em></td>
              <td><strong>Skill</strong></td>
              <td>Triggered by context, costs nothing otherwise</td>
            </tr>
            <tr>
              <td>A repeatable prompt you re-type a lot</td>
              <td><strong>Slash command</strong></td>
              <td>One file, one-liner to invoke</td>
            </tr>
            <tr>
              <td>A deterministic action on every file write</td>
              <td><strong>Hook</strong></td>
              <td>Not Claude's choice — the harness guarantees it</td>
            </tr>
            <tr>
              <td>A big investigation that would blow context</td>
              <td><strong>Subagent</strong></td>
              <td>Fresh window, returns a summary</td>
            </tr>
            <tr>
              <td>Multiple specialists collaborating</td>
              <td><strong>Agent Team</strong></td>
              <td>Coordinated, parallel, shared state</td>
            </tr>
            <tr>
              <td>Claude to read/write an external service</td>
              <td><strong>MCP server</strong></td>
              <td>Structured tools, not scraped terminal output</td>
            </tr>
            <tr>
              <td>A bundle of the above, distributable</td>
              <td><strong>Plugin</strong></td>
              <td>One install command for your team</td>
            </tr>
            <tr>
              <td>Real-time language diagnostics</td>
              <td><strong>LSP integration</strong></td>
              <td>Claude sees errors as you edit</td>
            </tr>
          </tbody>
        </table>
      </DocsProse>

      <DocsCallout variant="tip" title="The smallest thing that works">
        When in doubt, pick the row higher in the table. A well-written
        <code>CLAUDE.md</code> rule prevents more mistakes than a clever hook.
        Hooks that duplicate rules already in CLAUDE.md are noise. Save hooks
        for things Claude can't refuse to do — not things you'd <em>like</em> it
        to do.
      </DocsCallout>

      <DocsProse>
        <h3>Mental model: where does each layer live?</h3>
        <p>
          Think of Claude Code as a stack, from closest to the model outward:
        </p>
        <ul>
          <li>
            <strong>Model</strong> — Opus / Sonnet / Haiku. You don't extend
            this; you pick it.
          </li>
          <li>
            <strong>System prompt + CLAUDE.md</strong> — always present.
            Personality, project rules.
          </li>
          <li>
            <strong>Skills</strong> — on-demand knowledge, injected when Claude
            judges them relevant.
          </li>
          <li>
            <strong>Commands</strong> — user-invoked prompt templates.
          </li>
          <li>
            <strong>Tools</strong> — Read, Edit, Bash, plus MCP-supplied ones.
          </li>
          <li>
            <strong>Hooks</strong> — the harness intercepting tool calls.
          </li>
          <li>
            <strong>Subagents / Teams</strong> — additional Claude instances
            spawned by the main one.
          </li>
        </ul>
        <p>
          Extensions aren't competing with each other — they compose. A mature
          project uses five or six of them, each doing the job it's best at.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="skills" title="Skills">
      <DocsProse>
        <p>
          A <strong>Skill</strong> is a folder with a <code>SKILL.md</code>
          inside. When Claude's current context matches the skill's description,
          the harness automatically injects the file's contents — giving Claude
          just-in-time expertise without paying the token cost when it's not
          needed. This is the single most underused extension in the whole
          platform.
        </p>
        <p>
          Skills live in three places, scanned in order:
        </p>
        <ul>
          <li>
            <code>~/.claude/skills/</code> — your personal skills across every
            project.
          </li>
          <li>
            <code>.claude/skills/</code> — project skills the whole team gets.
          </li>
          <li>
            Bundled with plugins you install — covered later.
          </li>
        </ul>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/skills/postgres-migrations/SKILL.md"
        code="---
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
up: add a nullable column, backfill in a follow-up, then NOT NULL in a third migration."
      />

      <DocsProse>
        <h3>The two rules of a great skill description</h3>
        <p>
          The <code>description</code> field in the YAML frontmatter is the
          <em>only</em> thing the model sees when deciding whether to load the
          skill. Treat it like a trigger specification, not a sales pitch.
        </p>
        <ol>
          <li>
            <strong>Start with "Use this skill when…"</strong> and name concrete
            nouns the user would type.
          </li>
          <li>
            <strong>Include a "do NOT trigger" clause</strong> to suppress false
            positives on neighboring topics.
          </li>
        </ol>
      </DocsProse>

      <DocsCallout variant="info" title="Anatomy of a skill folder">
        <p>
          A skill can be just a single <code>SKILL.md</code>, but it can also
          ship scripts, reference docs, and templates. Put them alongside the
          markdown and reference them with paths like
          <code>scripts/backfill.sh</code> — Claude resolves those relative to
          the skill's folder.
        </p>
        <p>
          Keep <code>SKILL.md</code> under 500 lines. If the knowledge is longer,
          split it into a short SKILL.md that <em>points</em> to sibling files
          Claude loads on demand.
        </p>
      </DocsCallout>

      <DocsProse>
        <h3>Skills vs CLAUDE.md — when to use which</h3>
        <p>
          <code>CLAUDE.md</code> is for rules that apply to every turn. Skills
          are for rules that apply to <em>some</em> turns. A convention like
          "use pnpm, not npm" belongs in CLAUDE.md. A 200-line walkthrough of
          your OAuth flow belongs in a skill — it's useless token spend on the
          80% of sessions that don't touch auth.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="commands" title="Commands">
      <DocsProse>
        <p>
          A <strong>slash command</strong> is a saved prompt. You put a markdown
          file in <code>.claude/commands/</code>, and typing
          <code>/name</code> expands it into Claude's input. Variables, tool
          restrictions, even model selection — all configurable.
        </p>
        <p>
          Commands are the cheapest extension on the stack: one file, no code,
          no install. If you catch yourself typing the same paragraph twice,
          make a command.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/commands/review-pr.md"
        code="---
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

Be specific. 'Consider refactoring' is not a comment."
      />

      <DocsProse>
        <h3>How commands differ from skills</h3>
        <ul>
          <li>
            <strong>You invoke commands.</strong> Claude decides when to load
            skills.
          </li>
          <li>
            <strong>Commands expand once.</strong> Skills stay in context for
            the turn.
          </li>
          <li>
            <strong>Commands can restrict tools.</strong> <code>allowed-tools</code>
            in frontmatter scopes what Claude can do inside that invocation.
          </li>
        </ul>
        <h3>Dynamic commands with shell substitution</h3>
        <p>
          Prefixing a line with <code>!</code> runs a shell command and inlines
          its stdout into the prompt. It's how a review command can show Claude
          the diff without you pasting it. Prefix with <code>@</code> to inline
          a file path.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/commands/debug-last.md"
        code="---
description: Debug the last failing test
allowed-tools: Read, Edit, Bash(npm test*)
---

The last test run failed. Here's the output:

!`npm test 2>&1 | tail -n 60`

Relevant test file:

@$ARGUMENTS

Phase 1: Read the failing file and the module under test. Do NOT edit yet.
Phase 2: Explain what's breaking. One paragraph.
Phase 3: Propose a fix. Wait for approval before editing."
      />

      <DocsCallout variant="tip" title="Personal vs team commands">
        Personal commands go in <code>~/.claude/commands/</code>. Team commands
        go in <code>.claude/commands/</code> and are committed. Namespacing: a
        file at <code>.claude/commands/db/migrate.md</code> is invoked as
        <code>/db:migrate</code>.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="hooks" title="Hooks">
      <DocsProse>
        <p>
          Hooks are the harness intercepting tool calls. They fire on fixed
          events: before a tool runs, after a tool runs, when Claude is about to
          respond, when a session starts, when it ends. Each hook is a shell
          command that reads JSON on stdin and exits with a status code.
        </p>
        <p>
          Hooks are for <em>deterministic</em> policy. "Format every file you
          save" is a hook — formatting shouldn't depend on whether Claude
          remembered. "Block pushes to main" is a hook — the cost of getting
          that wrong is too high to trust to a rule.
        </p>
      </DocsProse>

      <DocsProse>
        <h3>The event surface</h3>
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Fires when…</th>
              <th>Typical use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>PreToolUse</code></td>
              <td>Before a tool runs — can block it</td>
              <td>Deny dangerous bash, require approval</td>
            </tr>
            <tr>
              <td><code>PostToolUse</code></td>
              <td>After a tool returns</td>
              <td>Format on save, lint, commit nudges</td>
            </tr>
            <tr>
              <td><code>UserPromptSubmit</code></td>
              <td>Before Claude sees your message</td>
              <td>Inject current git branch, redact secrets</td>
            </tr>
            <tr>
              <td><code>Stop</code></td>
              <td>Claude finishes a turn</td>
              <td>Run tests, send notification, checkpoint</td>
            </tr>
            <tr>
              <td><code>SessionStart</code> / <code>SessionEnd</code></td>
              <td>Session lifecycle</td>
              <td>Bootstrap env, log session summary</td>
            </tr>
          </tbody>
        </table>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/settings.json"
        code='{
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
}'
      />

      <DocsCodeBlock
        title=".claude/hooks/format-on-save.sh"
        code='#!/usr/bin/env bash
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

exit 0'
      />

      <DocsCodeBlock
        title=".claude/hooks/deny-destructive.sh"
        code='#!/usr/bin/env bash
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

exit 0'
      />

      <DocsCallout variant="warning" title="Exit codes matter">
        <p>
          <strong>0</strong> — continue silently.
          <strong>2</strong> — block the tool call and return stderr to Claude
          (it will read the message and adjust).
          Anything else — error, the harness surfaces it to you.
        </p>
      </DocsCallout>

      <DocsProse>
        <h3>Hooks vs CLAUDE.md rules</h3>
        <p>
          A CLAUDE.md rule is a suggestion Claude can forget. A hook is policy
          the machine enforces. Rule of thumb: if the cost of non-compliance is
          "minor annoyance," use CLAUDE.md. If the cost is "production outage,"
          use a hook. Use both when it matters — CLAUDE.md explains why, the
          hook guarantees it.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="subagents" title="Subagents">
      <DocsProse>
        <p>
          A <strong>subagent</strong> is a Claude instance spawned by your main
          Claude, with a fresh context window and a specific job. The main
          Claude hands off the task via the <code>Task</code> tool, the
          subagent does its work, and only the final summary comes back. Your
          main context stays clean.
        </p>
        <p>
          The pattern unlocks two things: parallelism (spawn three subagents at
          once, wait for all three) and context isolation (a subagent can read
          500 files without polluting the main conversation).
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/agents/codebase-explorer.md"
        code="---
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
**Follow-ups:** <only if the main Claude should investigate further>"
      />

      <DocsProse>
        <h3>How the main Claude invokes a subagent</h3>
        <p>
          From the main session, you describe the task and Claude chooses the
          agent by name. The delegation looks like this in your transcript:
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="prompt"
        language="text"
        code='Use the codebase-explorer agent with "medium" thoroughness to find every place we cache user profiles. I want the caching key format, the TTL, and which service writes vs reads. Do not change any code.'
      />

      <DocsCallout variant="info" title="Subagents and token economics">
        Subagents pay their own context cost. A fresh 50K-token exploration in a
        subagent costs the same as doing it inline — except only a 2K summary
        lands in your main conversation. For one-off questions, inline is
        cheaper. For questions you'll re-ask over the session, delegation is.
      </DocsCallout>

      <DocsProse>
        <h3>When NOT to use a subagent</h3>
        <ul>
          <li>
            Short, fast questions — spinning up a fresh context adds latency.
          </li>
          <li>
            Tasks that require back-and-forth with the user — subagents can't
            pause for clarification.
          </li>
          <li>
            Anything that needs the main session's existing context — subagents
            start blank, they don't inherit your scratchpad.
          </li>
        </ul>
      </DocsProse>
    </DocsSection>

    <DocsSection id="agent-teams" title="Agent Teams">
      <DocsProse>
        <p>
          An <strong>agent team</strong> is the next step up: multiple subagents
          working in parallel, coordinated by an orchestrator, with shared
          state on disk. You get this when you structure your repo around
          <code>AGENTS.md</code> — a sibling to <code>CLAUDE.md</code> that
          names the roles and the rules of engagement.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="AGENTS.md"
        code="# Agent Team

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
planner → implementer → tester → reviewer → (orchestrator decides ship vs repair)."
      />

      <DocsCodeBlock
        title=".claude/agents/reviewer.md"
        code="---
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
    - <case>"
      />

      <DocsProse>
        <h3>Conductor vs orchestrator</h3>
        <p>
          Two patterns dominate team setups.
          <strong>Conductor</strong> — a human drives, kicking off agents one at
          a time and reading results before moving on. Higher-trust, lower-risk,
          suitable for small teams and novel work.
          <strong>Orchestrator</strong> — the main Claude drives, calling
          subagents autonomously according to the AGENTS.md. Higher-throughput,
          best for well-shaped tasks the team has done many times.
        </p>
        <p>
          Start with conductor. Graduate to orchestrator once your AGENTS.md is
          battle-tested.
        </p>
      </DocsProse>

      <DocsCallout variant="tip" title="Worktrees pair beautifully with teams">
        Give each concurrent agent its own git worktree. Isolated branches, no
        write contention on the working directory, and the reviewer can run
        side-by-side with the implementer. See
        <a href="/orchestration#worktrees">Orchestration → Git Worktrees</a>.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="mcp" title="MCP">
      <DocsProse>
        <p>
          <strong>MCP</strong> — the Model Context Protocol — is the standard for
          plugging external services into Claude as first-class tools. Where
          hooks intercept tool calls and subagents spawn new Claudes, MCP adds
          <em>new tools</em> — a Linear "create issue" tool, a Postgres "run
          query" tool, a Sentry "fetch error" tool — that Claude calls the same
          way it calls <code>Read</code> or <code>Bash</code>.
        </p>
        <p>
          An MCP server is any process that speaks the protocol. It can run
          locally (stdio transport) or remotely (HTTP/SSE). Anthropic and
          third parties publish hundreds; Claude Code discovers them from
          <code>.mcp.json</code> in your project or
          <code>~/.claude/mcp.json</code> personally.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".mcp.json"
        code='{
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
}'
      />

      <DocsProse>
        <h3>Choosing MCP over a shell command</h3>
        <p>
          You could let Claude call <code>psql</code> via Bash and scrape the
          output. It'll work — for a while. MCP beats it on three axes:
        </p>
        <ul>
          <li>
            <strong>Structured returns</strong> — rows come back as JSON, not
            terminal formatting Claude re-parses every time.
          </li>
          <li>
            <strong>Discoverability</strong> — MCP advertises the tools it
            provides; Claude knows what's available without trial and error.
          </li>
          <li>
            <strong>Permissions</strong> — you can allowlist MCP tools
            individually in <code>settings.json</code>, finer-grained than
            "allow all bash."
          </li>
        </ul>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/settings.json (MCP permissions)"
        code='{
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
}'
      />

      <DocsCallout variant="info" title="Writing your own MCP server">
        The SDK is a few hundred lines to get running. If your team has an
        internal tool Claude keeps needing — a feature flag system, an audit
        log, an internal search engine — wrapping it in MCP is a day's work and
        pays back every session. See
        <a
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener"
          >modelcontextprotocol.io</a
        >.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="plugins" title="Plugins">
      <DocsProse>
        <p>
          A <strong>plugin</strong> is a bundle: one or more skills, commands,
          hooks, subagents, and MCP servers, shipped as a single unit with a
          <code>plugin.json</code> manifest. Plugins solve the "how do I share
          my setup with the team" problem without asking everyone to paste
          eight files into the right folders.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="plugin.json"
        code='{
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
}'
      />

      <DocsProse>
        <h3>Installing a plugin</h3>
      </DocsProse>

      <DocsCodeBlock
        language="bash"
        code="# From the marketplace
claude plugin install company-workflows

# From a git repo
claude plugin install https://github.com/example/company-workflows

# Local development
claude plugin install ./path/to/plugin"
      />

      <DocsCallout variant="tip" title="Plugin vs copy-paste">
        Copy-paste is fine for one-off projects. The moment two engineers have
        the same skill in their <code>~/.claude/skills/</code>, you've got a
        plugin waiting to happen — one source of truth, version-pinned, one
        command to upgrade everyone. Future-you will thank past-you.
      </DocsCallout>

      <DocsProse>
        <h3>Marketplaces</h3>
        <p>
          Plugins can be grouped into <em>marketplaces</em>: a directory with a
          <code>marketplace.json</code> listing multiple plugins. This is how
          Anthropic's official plugin catalog is structured, and how companies
          publish internal catalogs. Your team's marketplace can live on a
          private GitHub repo; Claude Code honors SSH auth.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="lsp" title="LSP">
      <DocsProse>
        <p>
          <strong>LSP</strong> — Language Server Protocol — is the same thing
          your editor uses to show red squiggles. When Claude Code is plugged
          into an LSP (directly in the VS Code extension, or via an MCP bridge
          in the terminal), it sees <em>live diagnostics</em> as it edits.
          Type errors, missing imports, unresolved symbols — all before a single
          test runs.
        </p>
        <p>
          For typed languages this is a step-change. The typical "edit,
          <code>npm run tsc</code>, see error, edit again" loop collapses to
          one turn.
        </p>
      </DocsProse>

      <DocsProse>
        <h3>How the plumbing looks</h3>
        <ul>
          <li>
            <strong>VS Code extension</strong> — LSP comes free, the extension
            brokers it to Claude.
          </li>
          <li>
            <strong>Terminal CLI</strong> — run an LSP-over-MCP bridge (several
            exist on npm and PyPI). The bridge spawns your project's language
            server and exposes diagnostics as MCP tools.
          </li>
          <li>
            <strong>JetBrains plugin</strong> — LSP built in.
          </li>
        </ul>
      </DocsProse>

      <DocsCodeBlock
        title=".mcp.json (typescript-language-server bridge)"
        code='{
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
}'
      />

      <DocsCallout variant="tip" title="Pair LSP with a Stop hook">
        The strongest feedback loop in 2026: LSP for compile-time, a
        <code>Stop</code> hook that runs your unit tests, and a
        <code>PostToolUse</code> hook that runs your formatter. Claude now has
        three automatic verdicts on every turn: "does it type?", "does it
        format?", "does it pass?" The agent learns from the answers and fixes
        its own mistakes without you intervening.
      </DocsCallout>

      <DocsProse>
        <h3>What LSP isn't</h3>
        <p>
          LSP gives Claude diagnostics for the language server's own checks —
          type errors, lint rules your IDE knows about, unresolved imports. It
          doesn't replace running your tests, and it doesn't replace a good
          <code>CLAUDE.md</code>. Think of it as a fourth sense, not a
          replacement for planning.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsPageNav
      :prev="{ title: 'Workflows', path: '/workflows' }"
      :next="{ title: 'Token Mastery', path: '/tokens' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Puzzle } from "@lucide/vue";
import type { TocItem } from "~/utils/types/nav";

const seoTitle = "Extensions — Skills, Hooks, Subagents, MCP & More";
const seoDescription =
  "The nine extension layers of Claude Code explained with paste-ready examples: Skills, Commands, Hooks, Subagents, Agent Teams, MCP, Plugins, and LSP — with a decision framework for which to reach for when.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/extensions",
  type: "article",
  keywords: [
    "claude code extensions",
    "skills",
    "slash commands",
    "hooks",
    "subagents",
    "agent teams",
    "mcp",
    "model context protocol",
    "plugins",
    "lsp",
    "AGENTS.md",
  ],
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TechArticle",
            headline: seoTitle,
            description: seoDescription,
            url,
            image,
            inLanguage: "en-US",
            author: { "@type": "Organization", name: "Claudeverse" },
            publisher: {
              "@type": "Organization",
              name: "Claudeverse",
              logo: {
                "@type": "ImageObject",
                url: getAbsoluteUrl("/logo.png"),
              },
            },
            mainEntityOfPage: url,
            proficiencyLevel: "Intermediate",
            timeRequired: "PT35M",
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: getAbsoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Extensions",
                item: url,
              },
            ],
          },
        ],
      }),
    },
  ],
});

const { setItems } = useToc();

const tocItems: TocItem[] = [
  { id: "decision", title: "Decision Framework", level: 2 },
  { id: "skills", title: "Skills", level: 2 },
  { id: "commands", title: "Commands", level: 2 },
  { id: "hooks", title: "Hooks", level: 2 },
  { id: "subagents", title: "Subagents", level: 2 },
  { id: "agent-teams", title: "Agent Teams", level: 2 },
  { id: "mcp", title: "MCP", level: 2 },
  { id: "plugins", title: "Plugins", level: 2 },
  { id: "lsp", title: "LSP", level: 2 },
];

onMounted(() => setItems(tocItems));
onBeforeUnmount(() => setItems([]));
</script>
