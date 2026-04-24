---
title: Workshops
eyebrow: Learn by doing
accent: workshops
icon: LucideGraduationCap
description: Hands-on practicals — guided build-alongs for every major Claude Code concept, plus timed challenges to sharpen your instincts.
estReadTime: "Pick one, ~45 min each"
lastUpdated: 2026-04-24
tocItems:
  - { id: how-to-use, title: How to use this page, level: 2 }
  - { id: build-alongs, title: Build-alongs, level: 2 }
  - { id: challenges, title: Challenges, level: 2 }
  - { id: tracks, title: Workshop tracks, level: 2 }
prev: { title: Resources, path: /resources }
next: { title: Cheatsheet, path: /cheatsheet }
seo:
  title: Workshops — Hands-On Claude Code Practicals
  description: "Hands-on Claude Code workshops: seven guided build-alongs (CLAUDE.md, Plan Mode, hooks, commands, MCP, agent teams, evals) and five timed challenges. Learn by shipping, not by reading."
  keywords:
    - claude code workshop
    - claude code exercises
    - claude code practicals
    - hands-on claude code
    - claude code build along
    - claude code challenges
    - claude code tutorial
  proficiencyLevel: Intermediate
  timeRequired: PT45M
---

Reading about Claude Code gets you nowhere on its own. The people who actually get fast at it are the ones who sit down, open a terminal, and _do the thing_ — with a clear goal, a deadline, and something to show at the end. This page is that. Seven build-alongs, five challenges, a few suggested tracks. Every workshop has a start state, a target artifact, and a stop condition. Pick one, give yourself the stated time, and ship.

::::docs-section{id="how-to-use" title="How to use this page"}
Every workshop follows the same shape so you can jump in without reading the whole chapter first.

- **Time** — a budget, not a target. If you're done in half the time, the goal was too small.
- **You'll need** — the setup required before you start. Don't skip this; it's the difference between a workshop and a debugging session.
- **The goal** — one sentence describing the artifact you should have at the end.
- **Steps** — the happy path. Paste, prompt, observe. Deviate when you have a reason.
- **Stop when** — the definition of done. Close Claude, commit, move on.
- **Stretch** — one or two optional extensions if you want to push further.

The build-alongs teach one concept each. They're safe, scripted, and designed so nothing in your repo breaks if you follow them literally. Do these first.

The challenges give you a constraint and a target — no scripted steps. They're harder on purpose. Do them after the build-alongs, or when you want to prove a concept has stuck.

:::docs-callout{variant="tip" title="Work on a real repo, but protect it"}
Run workshops inside a scratch worktree or a branch you can throw away:

```bash
git worktree add ../workshops -b workshops/$(date +%Y-%m-%d)
cd ../workshops
claude
```

That way every exercise lives in isolation. Finish, review the diff, cherry-pick what's worth keeping, delete the worktree.
:::

Pair where you can. Two engineers running the same build-along and comparing outputs is worth roughly four engineers reading the docs solo.
::::

::::docs-section{id="build-alongs" title="Build-alongs"}
Seven guided practicals, one for each skill that separates a hobbyist from someone who ships with Claude Code every day. Do them in order if you're new; cherry-pick if you've already got the basics.

| # | Build | You'll practice | Time |
|---|---|---|---|
| 1 | CLAUDE.md from scratch | Context architecture | 45 min |
| 2 | Your first Plan Mode feature | Plan → execute discipline | 45 min |
| 3 | Your first hook | Deterministic guardrails | 40 min |
| 4 | A custom slash command | Prompt reuse | 30 min |
| 5 | Wire up an MCP server | External context | 45 min |
| 6 | A 3-agent team | Orchestration mechanics | 60 min |
| 7 | An eval suite | Regression safety | 60 min |
::::

::::docs-section{id="ba-claude-md" title="Build 1 — CLAUDE.md from scratch"}
**Time:** 45 minutes · **Level:** Beginner · **Artifact:** a tested `CLAUDE.md` committed to your repo.

**You'll need:**

- A repo you know well (or a fresh worktree off `main`).
- Claude Code installed and authenticated (`claude --version`).
- No existing `CLAUDE.md` in the repo root. If one exists, rename it to `CLAUDE.md.bak` for this exercise.

**The goal.** Write a `CLAUDE.md` that a teammate (or a cold Claude session) could use to onboard in ten minutes. You'll validate it with Claude itself.

### Steps

1. Open Claude in the repo root. Start with the cold test — no context yet:

```text [prompt — cold read]
Do not look at any config files yet. Read only the top-level directory
and pick the three files you think are most central to what this project does.

Then answer:
1. What does this project do, in one sentence?
2. What stack is it built on?
3. What command runs the tests?
4. What's one rule about this codebase you can't guess from the files?

Mark each answer "certain / guessing / unknown".
```

Save that output. Anything marked "guessing" or "unknown" is what `CLAUDE.md` exists to cover.

2. Draft `CLAUDE.md` from that list. Keep it under 100 lines. Use this skeleton:

```markdown [CLAUDE.md]
# [Project name]

## What this is
[One sentence. Who uses it, what it does.]

## Stack
- Language: [e.g. TypeScript 5.x]
- Framework: [e.g. Nuxt 4]
- Database: [e.g. Postgres 16 via Prisma]
- Package manager: [npm / pnpm / bun]

## Commands
- `npm run dev` — local server at :3000
- `npm test` — vitest, watch mode off
- `npm run lint` — eslint + typecheck
- `npm run build` — production build

## Repo layout
- `app/` — source. See sub-READMEs for component rules.
- `content/` — markdown pages consumed by the app.
- `scripts/` — one-off utilities, not part of the runtime.

## Hard rules
- [e.g. "All errors throw — never return. See docs/errors.md"]
- [e.g. "Never import from internal/; use the public index."]

## Before touching [sensitive area]
Read [docs/x.md] first.
```

3. Validate with a cold session. Run `/clear`, then:

```text [prompt — validation]
Read CLAUDE.md. Then read the actual top-level directory.

Tell me:
1. Anything CLAUDE.md claims that the repo doesn't reflect.
2. Anything you still have to guess at.
3. One rule that belongs in CLAUDE.md that isn't there yet.

Do not edit anything.
```

4. Fix what Claude caught. Commit.

**Stop when** you can hand `CLAUDE.md` to a teammate and say "read this and the code will make sense" — and they can, within 10 minutes, answer the four questions from step 1 correctly.

**Stretch.**

- Add a "Before touching [sensitive area]" pointer for your most dangerous subsystem.
- Run `/context` and verify `CLAUDE.md` is under 3,000 tokens. If it isn't, cut it.
::::

::::docs-section{id="ba-plan-mode" title="Build 2 — Your first Plan Mode feature"}
**Time:** 45 minutes · **Level:** Beginner · **Artifact:** one feature shipped start-to-finish through Plan Mode, with the plan committed as a `.claude/plan.md` artifact.

**You'll need:**

- A small, real feature request (rename a field, add a log, expose a new flag — something you could do yourself in 20 minutes).
- A `CLAUDE.md` in the repo root (use Build 1 if you haven't got one).

**The goal.** Experience the full plan → review → execute → verify loop _deliberately_, with the plan as a reviewable artifact. Most people skip to execute. You won't.

### Steps

1. Open Claude at the repo root. Activate Plan Mode: press **Shift+Tab** twice. The StatusLine indicator will flip to `plan mode`.

2. State the task. Be specific about scope:

```text [prompt — plan phase]
Feature: [one sentence — exactly what changes].

Produce a plan:
1. Files you'll touch (path + why)
2. Functions you'll add, change, or delete
3. Tests to add or update
4. Any ambiguity that needs my decision before you start
5. Rollback strategy if this goes wrong

Do not write any code. When done, save the plan to .claude/plan.md
as a markdown document I can diff later.
```

3. Read the plan. Not skim — _read_. Look for:
   - Files you didn't expect to see touched.
   - Missing tests.
   - Any step that uses the word "probably" or "should".

4. Send it back for revision if anything is off:

```text [prompt — plan revision]
Revisions:
- [specific thing to fix in the plan]
- [another thing]

Update .claude/plan.md and re-report only what changed.
```

5. Exit Plan Mode (Shift+Tab once more). Kick off execution with the plan pinned:

```text [prompt — execute phase]
Execute the plan in .claude/plan.md exactly. One logical change at a time.
After each step, run the lint/typecheck command and show me the output
before moving to the next step. If anything diverges from the plan,
stop and ask.
```

6. When execution is done, verify:

```text [prompt — verify phase]
Run the full test suite and lint. Report pass/fail counts and any
diagnostic that looks new since the feature started. Then run git diff
and tell me: does the final diff match the plan? List any divergence.
```

7. Commit. Include `.claude/plan.md` in the commit so the reviewer can read the plan alongside the diff.

**Stop when** the feature is merged _and_ you can show the plan file next to the diff.

**Stretch.**

- Redo the same feature without Plan Mode on a different worktree. Compare: lines of diff, number of prompt iterations, total `/cost`.
- Add `.claude/plan.md` to your team's PR template so every non-trivial change ships with a plan.
::::

::::docs-section{id="ba-hook" title="Build 3 — Your first hook"}
**Time:** 40 minutes · **Level:** Intermediate · **Artifact:** a working `PostToolUse` lint hook committed to `.claude/settings.json`, plus one audit hook in your personal config.

**You'll need:**

- A project with a linter command (`npm run lint`, `ruff`, whatever).
- A terminal open next to Claude so you can tail logs.

**The goal.** Wire up a deterministic guardrail that runs after Claude edits a file, then see what breaks when you push on it.

### Steps

1. Add the hook to your project's `.claude/settings.json`. Create the file if it doesn't exist:

```json [.claude/settings.json]
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint -- --fix $CLAUDE_FILE_PATHS 2>&1 | tail -20"
          }
        ]
      }
    ]
  }
}
```

Adapt the command for your linter. The `2>&1 | tail -20` keeps Claude's context from filling up with lint output on big changes.

2. Restart your Claude session so the hook loads (`/exit`, then `claude` again). Confirm it's registered:

```text [prompt]
Run /hooks and list every hook currently active, with matcher and command.
```

3. Make a deliberate lint violation. Pick a file that already exists and ask Claude to add one bad line:

```text [prompt]
Add a single unused import at the top of src/foo.ts.
Do not fix the lint error — just add the import.
```

Watch the hook fire in the terminal output. Expect one of three outcomes: the lint auto-fixes it, the lint reports the error and Claude responds to the report, or the hook fails silently. All three teach you something.

4. Add an audit hook in your personal config (so it follows you across repos):

```json [~/.claude/settings.json]
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$(date -u +%Y-%m-%dT%H:%M:%SZ) | $CLAUDE_TOOL_INPUT\" >> ~/.claude/bash-audit.log"
          }
        ]
      }
    ]
  }
}
```

5. Run any task that involves shell commands. Then `tail ~/.claude/bash-audit.log` in another terminal. You should see every Bash call logged with a timestamp. This is the foundation of team-wide observability.

**Stop when** both hooks run automatically, and you can point to a line in `bash-audit.log` that corresponds to a command Claude ran a minute ago.

**Stretch.**

- Add a `PreToolUse` hook with matcher `Edit|Write` that blocks edits to any path matching `**/*.env*` (exit code 2 to deny).
- Write a `SessionStart` hook that prints `git log --oneline -5` into context so Claude always knows the last five commits.
::::

::::docs-section{id="ba-command" title="Build 4 — A custom slash command"}
**Time:** 30 minutes · **Level:** Beginner · **Artifact:** a reusable `/review-diff` slash command committed to `.claude/commands/`.

**You'll need:**

- A repo with some in-flight changes to review (uncommitted diff, or a branch diff vs `main`).

**The goal.** Turn a prompt you find yourself retyping into a one-word command that does the right thing every time.

### Steps

1. Create the command file:

```markdown [.claude/commands/review-diff.md]
---
description: Review the current diff as a skeptical senior engineer
---

# Review diff

Run `git diff $ARG` (default: `main`) and review the output as a
skeptical senior engineer.

Flag:
- Logic errors or edge cases not covered by the tests
- Divergence from CLAUDE.md conventions
- Missing error handling
- Anything that would make a reviewer pause

Do not flag:
- Pure style issues the linter handles
- Whitespace
- Personal preference

Output:
- Top 3 concerns, each with a file:line reference
- Top 3 things that look right
- One question for the author

$ARGUMENTS
```

2. Restart Claude. List commands to confirm it loaded:

```text [prompt]
Run /help and list all available slash commands that came from this repo.
```

3. Try it on the current working tree:

```text
/review-diff
```

Then try it against a specific ref:

```text
/review-diff main~3
```

4. Iterate on the command based on what comes back. If Claude flagged ten things you don't care about, tighten the "do not flag" list. If it missed a class of issues, add it to the flag list. The command file is a prompt you can refine — edit, save, re-run.

**Stop when** `/review-diff` gives you output you'd actually use in a PR review, without reshaping it.

**Stretch.**

- Build `/ship` that runs lint, typecheck, tests, and writes a PR description in one shot.
- Add a `/handoff [name]` command that writes a structured handoff note to `.claude/handoffs/[name].md` for picking up later.
::::

::::docs-section{id="ba-mcp" title="Build 5 — Wire up an MCP server"}
**Time:** 45 minutes · **Level:** Intermediate · **Artifact:** one MCP server connected and used in a real task, plus a note in `CLAUDE.md` documenting when to reach for it.

**You'll need:**

- An MCP server to connect. Start with the official [filesystem server](https://github.com/modelcontextprotocol/servers) if you don't have one in mind — it works everywhere and has no credentials.
- 20 minutes of patience for the first-time setup; it gets fast after.

**The goal.** Experience the shift from "Claude knows what's in the repo" to "Claude can query a live system." You only have to feel it once.

### Steps

1. Register the server. For the filesystem server:

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /Users/you/projects
```

Adjust the directory to one you actually want Claude to browse.

2. Verify it connected:

```text [prompt]
Run /mcp. List every connected MCP server, its status, and what tools
each one exposes.
```

If the server is red or missing, check `claude mcp list` in the shell and re-register. First-time connection errors are almost always a bad path or a missing dependency.

3. Use it for something real. Example for the filesystem server:

```text [prompt]
Using the filesystem MCP tools (not your built-in Read), find every
package.json under ~/projects, and tell me which ones depend on Nuxt
and at what version.
```

Watch which tools Claude calls. This is the actual mental model shift: built-in tools read the _current_ repo, MCP tools read _outside_ it.

4. Document it in `CLAUDE.md`:

```markdown
## MCP servers wired up
- filesystem (~/projects) — for cross-repo queries. Use when the task
  spans more than this repo.
```

**Stop when** Claude has answered a question using MCP that it couldn't have answered without it, and `CLAUDE.md` tells the next session when to reach for it.

**Stretch.**

- Connect a second MCP server from something you actually use day-to-day — Linear, Sentry, Datadog, Postman, Figma, whatever. The wiring is the same shape; the value jumps dramatically once it's tied to your real work.
- Write a `/whats-on-fire` command that asks Claude to check Sentry (or your monitoring MCP) and summarize anything new in the last 24h.
::::

::::docs-section{id="ba-agents" title="Build 6 — A 3-agent team"}
**Time:** 60 minutes · **Level:** Advanced · **Artifact:** an `AGENTS.md` describing a Planner → Implementer → Reviewer team, plus one real feature shipped through it in conductor mode.

**You'll need:**

- A working `CLAUDE.md` (Build 1) and at least one hook (Build 3) — this exercise assumes the basics are already in place.
- A small, well-scoped feature task.

**The goal.** Ship something with three coordinated Claude roles. Not for the efficiency — for the reps. Multi-agent workflows are unforgiving to teams that skip this practical.

### Steps

1. Create `AGENTS.md` in the repo root. Start with this template and edit the bracketed parts:

```markdown [AGENTS.md]
# Agent team charter

## Roles

### Planner
Model: opus
Workdir: repo root (read-only)
Tools: Read, Glob, Grep, WebFetch

Responsibilities:
- Explore the relevant code for the task
- Produce a plan: files touched, functions changed, tests, risks
- Save plan to .claude/plan.md

Rules:
- Never edit code
- Ambiguity → list it, stop, do not guess

### Implementer
Model: sonnet
Workdir: feature worktree
Tools: Read, Edit, Write, Bash(npm test*), Bash(npm run lint*)

Responsibilities:
- Read .claude/plan.md first
- Implement exactly the plan — do not expand scope
- Save completion note to .claude/impl-done.md

Rules:
- No test edits (Reviewer owns those)
- Ambiguity → note in impl-done.md, best-effort, keep going

### Reviewer
Model: sonnet
Workdir: feature worktree (read-only)
Tools: Read, Glob, Grep, Bash(npm test*), Bash(git diff*)

Responsibilities:
- Read plan.md, read impl-done.md, run git diff main
- Report: what's right, what's wrong, what's missing
- Save to .claude/review.md

Rules:
- Report findings only — do not propose fixes
- If tests fail, list which; do not try to fix

## Ordering
Planner → Implementer → Reviewer → human

## Shared state
All handoffs live in .claude/ (gitignored). No state through conversation.
```

2. Create a feature worktree:

```bash
git worktree add ../workshop-agents -b workshop/agents
cd ../workshop-agents
```

3. Run in conductor mode — you drive each role manually. Start the Planner:

```text [prompt — planner session]
You are the Planner role from AGENTS.md. Read AGENTS.md first, then:

Task: [your small feature].

Produce the plan exactly as the role specifies. Save to .claude/plan.md.
Stop when done — do not implement.
```

4. Read `.claude/plan.md`. If it's bad, send it back. If it's good, `/clear` and start the Implementer:

```text [prompt — implementer session]
You are the Implementer role from AGENTS.md. Read AGENTS.md, then
read .claude/plan.md, then execute.

Save your completion note to .claude/impl-done.md when finished.
```

5. `/clear` and start the Reviewer:

```text [prompt — reviewer session]
You are the Reviewer role from AGENTS.md. Read AGENTS.md, then
.claude/plan.md, then .claude/impl-done.md, then run git diff main.

Write your review to .claude/review.md.
```

6. Read the review. Fix, retry, or ship. Commit.

**Stop when** you have three files in `.claude/` (`plan.md`, `impl-done.md`, `review.md`) and the feature is shipped.

**Stretch.**

- Add a fourth role: Documenter. Reads the diff, updates `CLAUDE.md` if any convention shifted.
- Convert conductor mode to orchestrator mode: one main Claude reads `AGENTS.md` and spawns all three roles as subagents without you in between. Only try this after you've done conductor mode twice — the `AGENTS.md` needs to be battle-tested first.
::::

::::docs-section{id="ba-evals" title="Build 7 — An eval suite"}
**Time:** 60 minutes · **Level:** Advanced · **Artifact:** a minimal eval suite with 5 golden examples and one LLM-as-judge check, runnable locally.

**You'll need:**

- A part of your system where Claude is producing user-facing output (a slash command, a subagent that writes summaries, an MCP-assisted Q&A flow — anything with a repeatable "input → Claude-generated output" shape).
- Node installed.

**The goal.** Build a tiny regression suite. Five examples, one scorer. From scratch. Once you've done it once, you'll never ship unscored LLM features again.

### Steps

1. Make a directory and capture five examples. Pick five real inputs to your flow, run them, and save the outputs you consider "correct enough":

```bash
mkdir -p evals
cd evals
```

```json [evals/goldens.json]
[
  {
    "id": "ex-1",
    "input": "[real input #1]",
    "expected_contains": ["[key phrase Claude must produce]"],
    "expected_not_contains": ["[phrase that would mean it hallucinated]"],
    "notes": "[why this example matters]"
  }
  /* 4 more */
]
```

2. Write the runner. Keep it under 60 lines:

```js [evals/run.js]
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const goldens = JSON.parse(fs.readFileSync("./goldens.json", "utf8"));

function run(input) {
  // Adapt this: call your slash command / subagent / MCP flow.
  // The simplest version: shell out to claude with the input as a
  // one-shot prompt.
  const res = spawnSync(
    "claude",
    ["-p", input, "--output-format", "text"],
    { encoding: "utf8" }
  );
  return res.stdout ?? "";
}

let pass = 0;
let fail = 0;
for (const g of goldens) {
  const out = run(g.input);
  const hits = (g.expected_contains ?? []).every((p) => out.includes(p));
  const misses = (g.expected_not_contains ?? []).every(
    (p) => !out.includes(p),
  );
  const ok = hits && misses;
  console.log(`${ok ? "PASS" : "FAIL"}  ${g.id}`);
  if (!ok) console.log("  output:", out.slice(0, 400));
  ok ? pass++ : fail++;
}

console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
```

3. Run it:

```bash
node run.js
```

Expect 4/5 or 5/5 on first run — you picked these examples. The suite starts catching things when you refactor and something quietly regresses.

4. Add a judge. For each example, have a separate Claude session grade it against a rubric:

```js [evals/judge.js]
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const goldens = JSON.parse(fs.readFileSync("./goldens.json", "utf8"));

const rubric = `
Grade from 1-5:
- 5: answers the question fully, no extra info, no hallucination
- 4: correct but slightly verbose or tangential
- 3: partial answer, or minor factual drift
- 2: misses the point, or introduces a wrong claim
- 1: wrong / unsafe / empty

Output only a single digit.
`;

for (const g of goldens) {
  const out = spawnSync("claude", ["-p", g.input, "--output-format", "text"], {
    encoding: "utf8",
  }).stdout;
  const prompt = `Input:\n${g.input}\n\nOutput:\n${out}\n\nRubric:${rubric}`;
  const grade = spawnSync("claude", ["-p", prompt, "--output-format", "text"], {
    encoding: "utf8",
  }).stdout.trim();
  console.log(`${g.id} → ${grade}`);
}
```

5. Commit `evals/` into your repo. Add a CI step (GitHub Action, pre-push hook, whatever you've got) that runs `node run.js` on main. When it fails, something drifted.

**Stop when** `node run.js` exits 0 against your current system, and you've deliberately broken one of the underlying prompts to watch a test go red.

**Stretch.**

- Cache outputs by input so you're not re-running Claude for every CI run.
- Add a third dimension: latency. Fail the suite if median response time exceeds N seconds.
::::

::::docs-section{id="challenges" title="Challenges"}
Build-alongs teach a concept. Challenges test whether it stuck. Each one has a target and a time limit — no scripted steps. You figure out the path.

These are meant to feel slightly uncomfortable. If you're sailing through, pick a harder version.

| # | Challenge | Goal | Time |
|---|---|---|---|
| 1 | Cost-cut 50% | Halve `/cost` on a repeatable task | 60 min |
| 2 | CLAUDE.md diet | 30% fewer tokens, same behavior | 45 min |
| 3 | Prompt precision | Kill 5 prompt iterations | 45 min |
| 4 | Debug a broken hook | Silent hook → firing hook | 30 min |
| 5 | Model routing | Stop defaulting to Opus | 30 min |
::::

::::docs-section{id="ch-cost" title="Challenge 1 — Cost-cut 50%"}
**Time:** 60 minutes · **Level:** Intermediate.

**The setup.** Pick a task you've done multiple times with Claude — a weekly triage, a report generation, a refactor template, a review pass. Something you could run five times a week and the shape is the same.

**The target.** Run it once, baseline the cost with `/cost`. Then get that number down by at least 50% without degrading the output.

**Constraints.**

- The output must still pass the smell test — a colleague reading the two results shouldn't prefer the expensive one.
- You can change anything: CLAUDE.md, the prompt, the model, Plan Mode on/off, the ordering, adding a hook to strip output, caching context, using a subagent for the retrieval phase.
- You cannot skip the work. If the baseline task produced a diff, the cheap version produces an equivalent diff.

**What you're actually learning.** Where the tokens were going. Most people discover one of four culprits: bloated `CLAUDE.md`, Opus where Sonnet was enough, unnecessary file re-reads, or chatty "explain yourself" behavior that could be hook-trimmed.

**Stop when** the two `/cost` readings differ by 50% or more and you can explain why in one sentence.
::::

::::docs-section{id="ch-diet" title="Challenge 2 — CLAUDE.md diet"}
**Time:** 45 minutes · **Level:** Intermediate.

**The setup.** Your existing `CLAUDE.md`. Measure it first:

```bash
# Roughly — wc -w is a decent proxy for tokens; 1 token ≈ 0.75 words
wc -w CLAUDE.md
```

**The target.** Get it 30% smaller, same or better task outcomes.

**Constraints.**

- Remove only. Don't rewrite wholesale; delete what's dead.
- For every section you cut, be able to answer: "what would break without this?" If nothing would, it was cargo cult.
- After the cut, run a known task and confirm the output didn't regress.

**What you're actually learning.** `CLAUDE.md` rots. Rules get added because someone got burned once, then live forever. A 30% cut is almost always available because much of what's there is answering a question that never gets asked.

**Stop when** the file is 30% lighter _and_ a known task still produces the same output.
::::

::::docs-section{id="ch-prompt" title="Challenge 3 — Prompt precision"}
**Time:** 45 minutes · **Level:** Beginner.

**The setup.** Pick a task you've fumbled recently — a change Claude got wrong twice before getting right. Replay the exchange mentally (or look at `/status` / session history).

**The target.** Produce one single prompt that would have gotten the same correct final result on the first try. One prompt — no follow-ups.

**Constraints.**

- The prompt can be long. Multi-paragraph is fine.
- You can reference files Claude should read, constraints it should respect, output format it should produce.
- When you have it, start a fresh session (`/clear`) and run it. If you need a second prompt, you haven't solved the challenge. Rewrite and try again.

**What you're actually learning.** The gap between "what I meant" and "what I said." Every extra turn in the original exchange is a piece of context you failed to include up-front. The precision-prompt exercise is the fastest way to internalize what up-front context is worth.

**Stop when** a cold session produces the right final result on prompt #1.
::::

::::docs-section{id="ch-hook" title="Challenge 4 — Debug a broken hook"}
**Time:** 30 minutes · **Level:** Intermediate.

**The setup.** Add this to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "grep -r 'TODO' $CLAUDE_FILE_PATHS > /tmp/claude-todos.log 2>&1"
          }
        ]
      }
    ]
  }
}
```

Intended behavior: every time Claude edits or writes a file, log any TODOs in it to `/tmp/claude-todos.log`.

**The target.** Make Claude edit a file containing a TODO. Verify the hook fired. If it didn't, figure out why, and fix it without looking at documentation.

**Constraints.**

- Only tools: `/hooks`, `cat /tmp/claude-todos.log`, `echo $CLAUDE_FILE_PATHS` style debugging, the Claude session itself.
- No Googling, no asking another Claude, no reading the hooks docs page.
- When the hook works reliably for three edits in a row, you win.

**What you're actually learning.** Hooks fail silently by design. Debugging them is a recurring tax if you can't hold the mental model — what variables the hook sees, what shell it runs in, what the matcher actually matches. Fix one broken hook from scratch and that tax drops by half.

**Stop when** three consecutive edits each append a line to `/tmp/claude-todos.log`.
::::

::::docs-section{id="ch-routing" title="Challenge 5 — Model routing"}
**Time:** 30 minutes · **Level:** Intermediate.

**The setup.** Your current default model is probably Sonnet or Opus across the board. It shouldn't be. Different tasks want different models; picking per-task is the single easiest cost lever after `CLAUDE.md` weight.

**The target.** Establish a working routing policy for your next week — concrete rules for when you use Opus, when Sonnet, when Haiku — and commit it somewhere the whole team can see.

**Constraints.**

- The policy must be specific. "Use Opus for hard things" is not a policy. "Use Opus for multi-file refactors across 5+ files _or_ novel architecture decisions; Sonnet otherwise" is.
- It must fit on a sticky note.
- You must be able to point to three past tasks and categorize each one under the policy unambiguously.

**A starting template — edit, don't adopt:**

```markdown
## Model routing

- **Haiku** — classification, simple transforms, generating commit messages,
  grepping through logs, any task where I know the answer shape in advance.
- **Sonnet** — default. Feature work, code review, single-file edits,
  most prompts.
- **Opus** — architecture planning, debugging something I genuinely don't
  understand, writing AGENTS.md / multi-agent choreography, the
  irreducibly-hard 5% of work.
```

**What you're actually learning.** Model selection is a skill. The wrong model is either lighting money on fire (Opus on rote work) or burning time on rework (Sonnet on a task it can't plan). Getting this right compounds across every future session.

**Stop when** your policy is written down, shared, and you can route three sample tasks through it without hesitation.
::::

::::docs-section{id="tracks" title="Workshop tracks"}
The build-alongs and challenges can combine into longer programs when you want a structured day (or weekend) of work. Three tracks worth running.

### Track 1 — The "solo up-skill" afternoon (3–4 hrs)

For the individual engineer who's been using Claude Code casually and wants to get serious without committing a whole week.

1. **Build 1 — CLAUDE.md from scratch** (45 min) — the foundation everything else sits on.
2. **Build 2 — Your first Plan Mode feature** (45 min) — the workflow discipline.
3. **Build 3 — Your first hook** (40 min) — the guardrail layer.
4. **Challenge 3 — Prompt precision** (45 min) — the self-correction drill.

**Outcome.** A repo that's been tuned, a workflow you've used deliberately, and one hard prompt you rewrote. You'll ship faster the next day.

### Track 2 — The "team kickoff" day (6–7 hrs)

For a team rolling out Claude Code together. Pairs, whole-group debrief at the end of each block.

1. **Morning (group)** — Build 1 on the shared repo. One CLAUDE.md, co-authored. Review and merge before lunch.
2. **Early afternoon (pairs)** — Build 2. Everyone plans the _same_ feature in parallel, then pairs compare plans. The differences are your CLAUDE.md's next draft.
3. **Mid-afternoon (group)** — Build 3. One hook for the team, one personal audit hook each.
4. **End of day (group)** — Challenge 1. Pick a task the whole team does weekly; run the cost-cut as a group exercise. The discussion is the value — who noticed what, what worked.

**Outcome.** A shared `CLAUDE.md`, a committed `.claude/settings.json` with hooks, and a team-wide cost baseline you'll measure against next month.

### Track 3 — The "advanced retreat" weekend (12–15 hrs)

For engineers who've done the basics and want multi-agent, evals, and cost discipline in their bones. Two days.

**Day 1 — extensions and orchestration.**

1. Build 4 — Custom slash command (30 min).
2. Build 5 — MCP server (45 min).
3. Build 6 — 3-agent team (60 min).
4. Challenge 4 — Debug a broken hook (30 min).
5. Free time to extend the 3-agent team into an orchestrator-mode run.

**Day 2 — measurement and discipline.**

1. Build 7 — Eval suite (60 min).
2. Challenge 1 — Cost-cut 50% (60 min).
3. Challenge 2 — CLAUDE.md diet (45 min).
4. Challenge 5 — Model routing policy (30 min).
5. Retro: what changed, what's now your default, what's your next CLAUDE.md edit.

**Outcome.** An `AGENTS.md` you've actually run features through, an eval suite wired into CI, a routing policy, and roughly 40% lower token spend on repeat tasks. Two days well spent.

:::docs-callout{variant="info" title="Tell us how the workshops go"}
These workshops evolve. If a build-along was too vague, a challenge was trivially easy, or a track didn't survive contact with real teams, that's the feedback loop this page lives on. File an issue on the repo, or rewrite the section yourself — pull requests are welcome.
:::
::::
