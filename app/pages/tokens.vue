<template>
  <article>
    <DocsPageHeader
      title="Token Mastery"
      eyebrow="Cut usage in half"
      accent="tokens"
      :icon="Coins"
      description="Why tokens matter, the three highest-impact fixes, monitoring, the CLAUDE.md diet, tiered architecture, compacting, model routing, subagent economics, hook-based output control, and team cost management."
      est-read-time="20 min"
    />

    <DocsProse>
      <p>
        Every token Claude reads costs money and eats into the window you have
        for actual work. The difference between a $40/day habit and a
        $400/day habit is almost never the number of features shipped — it's
        the amount of waste. This chapter is the whole playbook for getting
        more done with fewer tokens. Every number in here comes from real
        sessions; every fix can be applied in under five minutes.
      </p>
    </DocsProse>

    <DocsSection id="why" title="Why Tokens Matter">
      <DocsProse>
        <p>
          Tokens are both a <strong>unit of charge</strong> and a
          <strong>unit of cognition</strong>. You pay per million of them, and
          Claude's judgment degrades as they accumulate. The economics and the
          quality problem collapse into one: the leanest session is usually
          also the sharpest one.
        </p>
        <h3>2026 pricing at a glance</h3>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Input (per 1M tok)</th>
              <th>Output (per 1M tok)</th>
              <th>Cached read</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Opus 4.7</strong></td>
              <td>$15</td>
              <td>$75</td>
              <td>$1.50</td>
            </tr>
            <tr>
              <td><strong>Sonnet 4.6</strong></td>
              <td>$3</td>
              <td>$15</td>
              <td>$0.30</td>
            </tr>
            <tr>
              <td><strong>Haiku 4.5</strong></td>
              <td>$0.80</td>
              <td>$4</td>
              <td>$0.08</td>
            </tr>
          </tbody>
        </table>
        <p>
          One hour of Opus work on a dense codebase can easily touch 2M input
          tokens — that's $30 before you count output. The same hour on Sonnet
          with a disciplined <code>.claudeignore</code> is under $6. The rules
          below close that gap without sacrificing capability.
        </p>
      </DocsProse>

      <DocsCallout variant="warning" title="The compounding tax">
        A bloated context doesn't just cost more per turn — it makes Claude
        worse. A worse Claude writes a bug. The bug triggers rework. The rework
        burns another 40K tokens. Over the course of a day, a 2× token
        multiplier from context bloat typically becomes a 3–4× cost multiplier
        once the rework is counted. Every fix in this chapter compounds.
      </DocsCallout>

      <DocsProse>
        <h3>The 70% ceiling</h3>
        <p>
          The context window is 200K, but in practice performance flattens once
          you cross ~140K (70%) and falls off a cliff near ~160K (80%). Treat
          140K as your budget, not 200K. Designing for 140K also leaves
          headroom when Claude needs to read an unexpected file mid-task.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="three-fixes" title="The 3 Fixes That Cut Usage in Half">
      <DocsProse>
        <p>
          Before any clever tuning, get these three right. They are responsible
          for 80% of the savings on a typical project. Expect 40–60% bill drop
          on day one.
        </p>
      </DocsProse>

      <DocsProse>
        <h3>Fix #1 — A real <code>.claudeignore</code></h3>
        <p>
          Without one, Claude's first <code>ls</code> may pull 100K tokens of
          <code>node_modules</code>, lockfiles, and build artifacts. A
          10-minute <code>.claudeignore</code> prevents this for every session
          forever.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claudeignore"
        code="node_modules/
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
package-lock.json
pnpm-lock.yaml
yarn.lock
.env
.env.*
*.pem
*.key
**/generated/
**/*.snap"
      />

      <DocsProse>
        <h3>Fix #2 — CLAUDE.md under 3K tokens</h3>
        <p>
          <code>CLAUDE.md</code> loads on every turn. A 10K file costs $0.03
          per turn on Sonnet and eats window you need. If you can't say what
          you want in 3K, point Claude to sibling files it can load on demand
          (see the Tiered Architecture section below).
        </p>
        <h3>Fix #3 — Right-size the model</h3>
        <p>
          Opus is 5× the price of Sonnet and 18× the price of Haiku. Default
          to Sonnet. Switch to Opus only for architecture, security, and
          multi-file reasoning. Let Haiku handle subagent grunt work. A simple
          reroute of "exploration subagents" from Sonnet to Haiku typically
          saves 30% on the bill with no visible loss in quality.
        </p>
      </DocsProse>

      <DocsCallout variant="success" title="The 24-hour test">
        Do these three on a Monday. Look at your <code>/cost</code> output on
        Friday. You will have saved at least 40%. This is not an aspirational
        claim — it's a universal outcome. If your bill didn't drop, you didn't
        commit the <code>.claudeignore</code>.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="monitor" title="Monitor Your Usage">
      <DocsProse>
        <p>
          You can't fix what you can't see. Claude Code ships three lenses on
          your usage: <code>/cost</code> (session total),
          <code>/context</code> (what's in the window right now), and the
          StatusLine (a live display at the bottom of your terminal).
        </p>
      </DocsProse>

      <DocsCodeBlock
        language="bash"
        code="# In any Claude Code session:
/cost       # cumulative tokens and $ for the session
/context    # per-bucket breakdown: system, tools, CLAUDE.md, conversation, files"
      />

      <DocsProse>
        <h3>Always-on visibility: the StatusLine</h3>
        <p>
          Add a statusline script to your settings and you get continuous
          feedback without typing a command. The version below shows model,
          session cost, and context percentage.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="~/.claude/settings.json"
        code='{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/scripts/statusline.sh"
  }
}'
      />

      <DocsCodeBlock
        title="~/.claude/scripts/statusline.sh"
        code='#!/usr/bin/env bash
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

printf "\033[2m%s\033[0m  \033[1;%dm%d%% ctx\033[0m  $%.2f" "$model" "$color" "$pct" "$cost"'
      />

      <DocsProse>
        <h3>Historical analysis with ccusage</h3>
        <p>
          For week-over-week trends, the community tool
          <a
            href="https://github.com/ryoppippi/ccusage"
            target="_blank"
            rel="noopener"
            >ccusage</a
          >
          reads the transcript logs Claude Code writes on disk and produces a
          per-session breakdown. Run it as a Friday ritual and you'll quickly
          find the one session that ate 40% of your week.
        </p>
      </DocsProse>

      <DocsCodeBlock
        language="bash"
        code="npx ccusage@latest weekly   # last 7 days, per day
npx ccusage@latest session   # current session breakdown
npx ccusage@latest project   # per-project roll-up"
      />

      <DocsCallout variant="tip" title="The 70/80 heuristic">
        If the StatusLine is showing yellow (70%), wrap up the current task and
        save any state you need. If it's red (80%), stop immediately —
        <code>/compact</code> or <code>/clear</code>. Continuing past red is
        always more expensive than restarting.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="diet" title="CLAUDE.md Diet">
      <DocsProse>
        <p>
          Every token in <code>CLAUDE.md</code> is consumed at the start of
          every turn, forever. A fat CLAUDE.md is the gift that keeps on
          taking. The goal is a tight, load-bearing file under 3K tokens (~500
          lines of prose, much less if you're dense).
        </p>
        <h3>What to delete today</h3>
        <ul>
          <li>
            <strong>Examples Claude can derive by reading code.</strong> If
            <code>src/auth/login.ts</code> has a good pattern, a one-liner
            <em>"see <code>src/auth/login.ts</code> for the canonical auth
            flow"</em> is worth 30 lines of inlined example.
          </li>
          <li>
            <strong>Architecture diagrams in ASCII.</strong> Keep a one
            sentence summary, then point to a real doc.
          </li>
          <li>
            <strong>Onboarding fluff.</strong> "This project is fun and
            welcoming to contributors" doesn't help Claude write code.
          </li>
          <li>
            <strong>Sprint state.</strong> "Currently working on feature X"
            stale within a week and misleads Claude for months.
          </li>
          <li>
            <strong>Boilerplate pleasantries.</strong> "Please be helpful and
            careful" — Claude already is.
          </li>
        </ul>
      </DocsProse>

      <DocsCodeBlock
        title="CLAUDE.md — before (11K tokens)"
        code="# My Project

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
..."
      />

      <DocsCodeBlock
        title="CLAUDE.md — after (1.8K tokens)"
        code="# MyProject

Node + Fastify + Postgres. Strict TypeScript. pnpm, not npm.

## Conventions
- Errors throw, never return. See `docs/errors.md` when touching error handling.
- Auth is JWT in `src/auth/`. Read `src/auth/login.ts` for the canonical pattern.
- Payments is sensitive. Read `docs/payments.md` before `src/payments/`.
- Tests colocated: `foo.ts` + `foo.test.ts`. Snapshot tests are forbidden outside `src/render/`.

## Commands
- `pnpm dev`    — local server
- `pnpm test`   — unit + integration
- `pnpm db:migrate` — apply new migrations
- `pnpm typecheck`  — strict, required before every commit

## Hard rules
- Never import from `internal/*` outside `src/internal/`.
- Never disable a test to make CI pass. Mark it skip with a TODO and open an issue."
      />

      <DocsCallout variant="tip" title="Test the diet">
        After trimming, start a fresh session and run <code>/context</code>
        immediately. Your CLAUDE.md bucket should be under 2% of the window.
        If it's not, trim again.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="tiered" title="Tiered Architecture">
      <DocsProse>
        <p>
          Past about 3K, you can't stay in a single <code>CLAUDE.md</code>
          without pain. The answer isn't a bigger file — it's <em>tiered</em>
          context. A thin root file points to deeper docs that load only when
          relevant. The frontend engineer never pays for payments docs; the
          payments engineer never pays for design tokens.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="Tiered layout"
        code="project/
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
└── src/..."
      />

      <DocsProse>
        <h3>Pointer style that works</h3>
        <p>
          Claude will not read a linked doc unless the link is obviously
          relevant. Vague references ("see docs/ for more info") fail. Write
          triggers in the <em>same sentence</em> as the reference:
        </p>
      </DocsProse>

      <DocsCodeBlock
        language="text"
        code="GOOD: Payments logic is sensitive — read `docs/payments.md` before touching any file in `src/payments/`.

BAD: We have some docs in the `docs/` folder."
      />

      <DocsCallout variant="info" title="Skills are tier 3">
        Skills are the auto-triggered version of this pattern. Where a doc
        pointer relies on Claude noticing the link, a skill's
        <code>description</code> tells the harness exactly when to inject
        it — zero cost until it triggers. Big domain knowledge (OAuth, CRDT
        logic, a billing model) belongs in a skill, not a doc.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="compact" title="Compact Strategies">
      <DocsProse>
        <p>
          Eventually every session fills up. You have three moves:
          <code>/compact</code>, <code>/clear</code>, and handoff via file.
          Picking the right one is worth 30% on long sessions.
        </p>
        <table>
          <thead>
            <tr>
              <th>Command</th>
              <th>What it does</th>
              <th>Use when</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/compact</code></td>
              <td>
                Summarizes history to ~10K and keeps the session going
              </td>
              <td>Mid-task, you still need the thread</td>
            </tr>
            <tr>
              <td><code>/clear</code></td>
              <td>Wipes context, restarts fresh (CLAUDE.md still loads)</td>
              <td>Between unrelated tasks</td>
            </tr>
            <tr>
              <td>File handoff</td>
              <td>
                Claude writes <code>handoff.md</code>; next session reads it
              </td>
              <td>Crossing sessions or agents</td>
            </tr>
          </tbody>
        </table>
      </DocsProse>

      <DocsProse>
        <h3>When <code>/compact</code> beats <code>/clear</code></h3>
        <p>
          <code>/compact</code> keeps the goal and the decisions you made.
          <code>/clear</code> throws both away. If you're halfway through a
          feature and you've agreed on a plan, compact. If the last thing was
          shipped and the next thing is unrelated, clear.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="handoff.md (written by Claude at end of session)"
        code="# Feature: rate-limit /login

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
- Redis key MUST be IP-scoped, not session-scoped, or a logged-out attacker bypasses it."
      />

      <DocsCallout variant="tip" title="Ask Claude to write the handoff">
        The prompt: <em>"Before I close this session, write a handoff.md with
        decisions made, what's done, what's not, and any traps the next
        session should know about. Be specific — cite file:line."</em> Ten
        seconds, permanent continuity.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="routing" title="Model Routing">
      <DocsProse>
        <p>
          Picking the right model is the cheapest optimization you'll ever do.
          Knowing when to reach for each tier is worth about 40% on your bill.
        </p>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Best for</th>
              <th>Don't use for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Opus</strong></td>
              <td>
                Architecture decisions, security review, tough multi-file
                refactors, ambiguity
              </td>
              <td>Anything a junior could do — Sonnet handles it fine</td>
            </tr>
            <tr>
              <td><strong>Sonnet</strong></td>
              <td>
                Daily implementation, bug fixes, tests, feature work
              </td>
              <td>Novel architecture calls where judgment matters</td>
            </tr>
            <tr>
              <td><strong>Haiku</strong></td>
              <td>
                Fast exploration, lint fixups, simple transformations, subagent
                grunt work
              </td>
              <td>Anything requiring judgment on tradeoffs</td>
            </tr>
          </tbody>
        </table>
      </DocsProse>

      <DocsProse>
        <h3>The hybrid pattern</h3>
        <p>
          Plan on Opus, implement on Sonnet. The plan is a few thousand tokens
          of dense reasoning — Opus is worth it. Implementation is bulk
          work — Sonnet is five times cheaper and just as capable with a good
          plan in hand.
        </p>
      </DocsProse>

      <DocsCodeBlock
        language="text"
        code="# Flow
/model opus        # Plan Mode on
[plan the feature with Opus]
/model sonnet      # exit Plan Mode; implement
[execute with Sonnet]
/model opus        # if a review is warranted
[review with Opus]"
      />

      <DocsProse>
        <h3>Pinning model per command</h3>
        <p>
          Slash commands can pin a model in their frontmatter. Put the model
          you want per job directly in the command file, and you never
          remember to switch:
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/commands/plan.md"
        code="---
description: Plan a feature in Plan Mode using Opus
model: opus
---
Enter plan mode. I want a detailed plan before any edits. $ARGUMENTS"
      />

      <DocsCodeBlock
        title=".claude/commands/fix-lint.md"
        code="---
description: Fix lint errors quickly — Haiku is plenty
model: haiku
allowed-tools: Read, Edit, Bash(npm run lint*)
---
Run the linter, read the errors, and fix them. Do not refactor."
      />

      <DocsCallout variant="tip" title="Haiku for subagents">
        A read-only exploration subagent almost always does fine on Haiku. Set
        <code>model: haiku</code> in the agent's frontmatter. Save Sonnet for
        the main session and Opus for architectural calls. This single change
        often cuts a third off agent-heavy workflows.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="subagent-econ" title="Subagent Economics">
      <DocsProse>
        <p>
          Subagents feel free — delegation! — but they aren't. Each spawned
          subagent carries its own system prompt, its own tool definitions, and
          its own conversation. What's free is <strong>main-session</strong>
          context, not total tokens.
        </p>
        <h3>When a subagent saves tokens</h3>
        <ul>
          <li>
            The task needs <strong>many</strong> file reads Claude will discard
            after answering.
          </li>
          <li>
            The task is repeatable (exploring the same codebase twice is
            cheaper when a subagent returns a small summary both times).
          </li>
          <li>
            Multiple subagents can run in parallel, compressing wall-clock time
            without paying for them sequentially.
          </li>
        </ul>
        <h3>When a subagent costs more</h3>
        <ul>
          <li>
            One-off questions — the overhead of a new context outweighs the
            benefit.
          </li>
          <li>
            Small searches (&lt; 5 file reads) — just do it inline.
          </li>
          <li>
            Tasks needing back-and-forth with the user — subagents can't
            pause to clarify.
          </li>
        </ul>
      </DocsProse>

      <DocsCodeBlock
        title="Agent frontmatter — pick the cheapest model that works"
        code="---
name: codebase-explorer
description: Use for broad codebase questions. Cites file:line, never edits.
tools: Read, Grep, Glob
model: haiku
---"
      />

      <DocsCallout variant="info" title="The parallel fan-out pattern">
        Need three things investigated? Launch three Haiku subagents in one
        message. They run concurrently — total wall time ≈ the slowest one,
        total spend ≈ three Haiku sessions (still cheaper than a single Sonnet
        doing it serially). This is the power move for large codebase audits.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="hook-output" title="Hook-Based Output Control">
      <DocsProse>
        <p>
          Some tools produce monstrous output. <code>npm install</code> can
          dump 2K lines. A full test suite on failure can exceed 10K. Claude
          will read every token of it and then think with it sitting in the
          window. A small hook can trim the output to the useful bits.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/settings.json"
        code='{
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
}'
      />

      <DocsCodeBlock
        title=".claude/hooks/trim-output.sh"
        code='#!/usr/bin/env bash
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
fi'
      />

      <DocsProse>
        <h3>Silencing noisy commands entirely</h3>
        <p>
          <code>npm install</code> progress bars, <code>prettier</code> output,
          <code>docker pull</code> layer lists — you never need Claude to see
          any of it. A <code>PreToolUse</code> hook can rewrite such commands
          to pipe to <code>/dev/null</code> transparently, saving tens of
          thousands of tokens a week.
        </p>
      </DocsProse>

      <DocsCallout variant="tip" title="Measure before and after">
        Before installing a trim hook, record a week of <code>/cost</code>.
        After, another week. On a busy project a well-tuned trim hook saves
        more than the CLAUDE.md diet — quietly, without you thinking about it.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="team-cost" title="Team Cost Management">
      <DocsProse>
        <p>
          Individual discipline scales to about five engineers. Past that you
          need instrumentation: per-user dashboards, budget alerts, and a
          shared set of defaults that ships the best practices by default.
        </p>
        <h3>The shared defaults pattern</h3>
        <p>
          Commit a team <code>settings.json</code>, a thorough
          <code>.claudeignore</code>, a short <code>CLAUDE.md</code>, and the
          trim hook above. Every engineer on the team inherits the savings
          without reading this page. Put personal preferences in
          <code>~/.claude/settings.json</code> — never in the project file.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/settings.json (team defaults)"
        code='{
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
}'
      />

      <DocsProse>
        <h3>Budget alerts at the org level</h3>
        <p>
          Team and Enterprise plans expose per-seat usage to admins. Set
          weekly email alerts at 70% of budget and a hard cap at 100%. Have
          the one engineer who blew past 70% walk you through their session —
          nine times out of ten you'll find a missing
          <code>.claudeignore</code> or a runaway subagent loop that the team
          can learn from.
        </p>
        <h3>The monthly audit</h3>
        <p>
          Once a month, run <code>ccusage project</code> across every repo and
          look at the top 10% of sessions by cost. Tag each with a root
          cause — bloated CLAUDE.md, wrong model, missing ignore, infinite
          subagent loop. Fix the top three. Bill compounds down like
          interest.
        </p>
      </DocsProse>

      <DocsCallout variant="info" title="Cost per shipped feature">
        The real metric isn't "cost per session" — it's <em>cost per shipped
        feature</em>. A team that uses $1,000 in Claude to ship a feature that
        would have taken a week of engineer salary is winning. Track outcomes,
        not raw spend, and resist the urge to squeeze the last 5% out of
        individual sessions if it costs a day of throughput.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="template" title="The Token-Efficient Session Template">
      <DocsProse>
        <p>
          Put this together and a single session looks roughly like the flow
          below. Not every step every time — but the shape holds across
          thousands of hours of real work.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="session flow"
        language="text"
        code="1. START
   - Open the repo. CLAUDE.md is thin (<3K), .claudeignore is real.
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
   /cost to log the spend. If surprising, open ccusage and see why."
      />

      <DocsCallout variant="success" title="If you do only three things">
        Commit a <code>.claudeignore</code>. Put <code>CLAUDE.md</code> on a
        diet. Show a StatusLine. Everything else in this chapter is refinement
        on top of those three moves — and those three alone typically drop
        spend by 50–60% in the first week.
      </DocsCallout>
    </DocsSection>

    <DocsPageNav
      :prev="{ title: 'Extensions', path: '/extensions' }"
      :next="{ title: 'Orchestration', path: '/orchestration' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Coins } from "@lucide/vue";
import type { TocItem } from "~/utils/types/nav";

const seoTitle = "Token Mastery — Cut Claude Code Usage in Half";
const seoDescription =
  "Why tokens matter, the three highest-impact fixes, usage monitoring, CLAUDE.md diet, tiered architecture, compact strategies, model routing, subagent economics, hook-based output control, and team cost management for Claude Code.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/tokens",
  type: "article",
  keywords: [
    "claude code tokens",
    "token optimization",
    "llm costs",
    "claude md diet",
    "model routing",
    "subagent economics",
    "token monitoring",
    "ccusage",
    "team cost management",
    "statusline",
    "compact",
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
            timeRequired: "PT20M",
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
                name: "Token Mastery",
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
  { id: "why", title: "Why Tokens Matter", level: 2 },
  { id: "three-fixes", title: "The 3 Fixes", level: 2 },
  { id: "monitor", title: "Monitor Your Usage", level: 2 },
  { id: "diet", title: "CLAUDE.md Diet", level: 2 },
  { id: "tiered", title: "Tiered Architecture", level: 2 },
  { id: "compact", title: "Compact Strategies", level: 2 },
  { id: "routing", title: "Model Routing", level: 2 },
  { id: "subagent-econ", title: "Subagent Economics", level: 2 },
  { id: "hook-output", title: "Hook-Based Output Control", level: 2 },
  { id: "team-cost", title: "Team Cost Management", level: 2 },
  { id: "template", title: "Session Template", level: 2 },
];

onMounted(() => setItems(tocItems));
onBeforeUnmount(() => setItems([]));
</script>
