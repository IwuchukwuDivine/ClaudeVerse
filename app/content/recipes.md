---
title: Recipes
eyebrow: Scenario cookbook
accent: recipes
icon: LucideChefHat
description: Six end-to-end scenarios solved with the exact prompts, commands, and files — adding auth, refactoring a monolith, onboarding an engineer, migrating a codebase, automating reviews, and shipping a feature in a worktree.
estReadTime: 30 min
tocItems:
  - { id: auth, title: Add Auth to a Web App, level: 2 }
  - { id: refactor, title: Refactor a Monolith, level: 2 }
  - { id: onboard, title: Onboard a New Engineer, level: 2 }
  - { id: migrate, title: Migrate a Codebase, level: 2 }
  - { id: reviews, title: Automate Code Reviews, level: 2 }
  - { id: feature, title: Ship a Feature in a Worktree, level: 2 }
prev: { title: Evals, path: /evals }
next: { title: Troubleshooting, path: /troubleshooting }
seo:
  title: Recipes — Real Claude Code Scenarios Solved End-to-End
  description: "Six real-world Claude Code recipes: adding auth to a web app, refactoring a monolith, onboarding a new engineer, migrating a codebase, automating code reviews, and shipping a feature in a git worktree. Every recipe includes the exact prompts, commands, and files."
  keywords:
    - claude code recipes
    - add auth claude code
    - refactor monolith
    - onboard engineer
    - codebase migration
    - automate code reviews
    - ship feature worktree
  proficiencyLevel: Intermediate
  timeRequired: PT30M
---

Every recipe in this chapter is a scenario you'll probably hit this quarter, worked end-to-end with the exact prompts and commands. They don't re-teach the concepts — [Foundations](/foundations), [Workflows](/workflows), [Extensions](/extensions), [Tokens](/tokens), [Orchestration](/orchestration), and [Evals](/evals) already do that. They show what using those ideas together actually looks like on a real afternoon.

If you've read the rest of the guide, you've got everything you need to adapt these. If you haven't — run the recipes anyway. They'll teach you what the concept chapters were for.

::::docs-section{id="auth" title="Add Auth to a Web App"}
The recipe that forces you to use Plan Mode whether you want to or not. Auth is the most regretted Claude Code task when you skip planning — one lazy edit to the login route and your session bleeds secrets for three weeks before anyone notices.

**Start with:** An Express or Next.js app with no auth. Routes serve logged-out traffic. Users have an email column in Postgres but no password.

**End with:** Session-based auth (email + password → JWT cookie), protected middleware, a full test suite, and a `docs/auth.md` that future-you can trust.

### Phase 1 — Explore (read-only)

Don't let Claude guess the shape of your app. Make it look.

```text [prompt — no edits]
Phase 1 — Explore only. Do NOT edit any file.

Read and summarize:
  - src/server/**  — routing, middleware, error handling
  - src/db/**       — existing user table + migration patterns
  - src/types/**    — any existing User / Session types
  - package.json    — what auth libs (if any) are already installed

Return:
  1. Where request-level middleware is registered
  2. The current User type and migration conventions
  3. Any auth-related deps already installed (even partial)
  4. Three concrete risks you'd flag before we design the auth flow

Stop and wait for me to approve a plan.
```

You're looking for Claude to surface something surprising — a hand-rolled session middleware nobody documented, a `bcrypt` already in `package.json`, a `users.password_hash` column someone added and forgot. This is the 30 seconds that saves 3 hours.

### Phase 2 — Plan (Plan Mode on)

Shift+Tab twice to enter Plan Mode. Now the model can't write even if it wanted to.

```text [prompt — in Plan Mode]
Design session-based auth for this app. Constraints:
  - Session stored as an httpOnly, SameSite=Lax, Secure cookie
  - JWT signed with HS256; secret from process.env.AUTH_SECRET
  - 15-minute access token, 7-day refresh token
  - Passwords hashed with argon2id (cost params from OWASP 2025 defaults)
  - Login rate-limited (5 attempts / 15 min / IP)
  - ALL new routes under /api/auth/*
  - Middleware: src/server/middleware/requireAuth.ts

Deliver a plan with:
  1. New files (full path + one-line purpose each)
  2. Modified files (one-line diff summary each)
  3. Migration SQL (full text)
  4. Test plan: unit tests to add, integration flows to cover
  5. Open questions for me BEFORE we implement

Do not write code. Plan only.
```

Read the plan. Push back on anything that smells off — _"why argon2id instead of bcrypt when we already have bcrypt installed?"_ Claude will either have a good answer or rewrite the plan. Either outcome is fine; catching it here is the whole point.

### Phase 3 — Execute (with a security reviewer)

Exit Plan Mode. Implement **one slice at a time**, not the whole plan in one go.

```text [prompt — slice 1 of 4]
Execute plan step 1: the migration + User type changes.

Rules:
  - One commit at the end, message: "feat(auth): user credential columns"
  - Run `pnpm typecheck` and `pnpm test -- --related` before committing
  - Do NOT touch any route files yet — that's step 2
```

After each slice, run the security reviewer subagent before you move to the next:

```text [prompt — between slices]
Use the reviewer agent to audit the diff since HEAD~1.

Rubric:
  - Any secret, key, or credential leaked into logs / responses?
  - Any user input interpolated into SQL without parameterization?
  - Any path that accepts user input and writes to the filesystem?
  - Any response that leaks whether an email exists ("user not found" vs
    "invalid credentials")?

If LGTM, write .claude/state/reviews/auth-step1.md and return OK.
If not, write the review doc and STOP. Do not proceed to step 2.
```

See [Orchestration → Agent Teams Deep Dive](/orchestration#teams) for the full reviewer agent file.

### Phase 4 — Verify

```bash [end-of-feature checks]
pnpm typecheck
pnpm lint
pnpm test                         # unit
pnpm test:integration auth        # integration flow
pnpm audit --audit-level=high     # fresh CVEs in the new deps

# Manual smoke — the one thing tests miss
curl -i -X POST localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"wrong"}'
# Should return 401, Set-Cookie absent, body generic.
```

Ask Claude to update `docs/auth.md` with the final flow, token lifetimes, and rotation procedure. That doc is what next-quarter-you will be grateful for.

### What goes wrong

- **Claude invents a session store.** Catch it in the plan — specifically list the store you want (in-memory for dev, Redis for prod) or it'll guess.
- **The rate limit works locally, not in prod.** You're behind a reverse proxy and `req.ip` is the proxy's IP. Add `trust proxy` to the app and re-test.
- **Tests pass but logout doesn't actually clear the cookie.** Always add an integration test that logs in, logs out, and asserts the `Set-Cookie: session=; Max-Age=0` header on the second call.

:::docs-callout{variant="tip" title="Checkpoint before every slice"}
`git commit -am "checkpoint"` before each slice. Auth is the one task where "undo the last hour" is worth the 10 seconds of discipline. See [Workflows → Checkpointing](/workflows#checkpoints).
:::
::::

::::docs-section{id="refactor" title="Refactor a Monolith"}
The recipe you reach for when a codebase has outgrown its shape but nobody has a week to rewrite it. The goal isn't a big-bang rewrite — it's a sustained, checkpointable refactor that ships in every PR and never blocks a feature.

**Start with:** A `src/` tree where 80% of the code is in three files, circular imports are normal, and changing one thing breaks four others.

**End with:** A domain-oriented layout, tests that actually pass on main, and a `docs/architecture.md` describing the new shape.

### Phase 1 — Map before you cut

Refactoring without a map is how you end up with a half-rewritten system that nobody can finish. Spend an afternoon producing one.

```text [prompt — exploration only, possibly a subagent]
Use the codebase-explorer agent. Thoroughness: very thorough.

I want a refactoring map. Read every file under src/ and produce:

1. A module dependency graph. For each top-level folder, list the folders
   it imports from. Flag circular imports.
2. A "hotness" list: the 10 files edited most often in the last 90 days
   (use `git log --since=...`).
3. A "hairiness" list: files over 400 lines, files with >15 functions, files
   with cyclomatic complexity spikes.
4. A proposed target structure: 5-8 top-level domains, what lives in each,
   which current files map where. Don't move anything yet.

Write it to `docs/refactor-map.md`. Keep under 300 lines.
```

The map is the contract for the rest of the refactor. Review it with whoever else is going to touch this code. You're choosing the shape of the next two years of the codebase — the 30 minutes of committee time here pays off forever.

### Phase 2 — Slice small, ship daily

The shipping unit is one module migration per day, not one per week. Claude moves faster than you expect at this; the bottleneck is code review and regressions, not implementation.

```text [prompt — single-slice refactor]
Migrate the "billing" domain from its current scattered state into
src/domains/billing/ per docs/refactor-map.md.

Rules:
  - Do NOT change any behavior. Pure move + rename.
  - Keep every public import path working via a re-export shim from the
    old location. We'll delete the shims in a later pass.
  - Update imports across the codebase. Run `pnpm typecheck` until clean.
  - Run `pnpm test -- billing` and `pnpm test:integration billing`. All
    must pass.
  - One commit: "refactor(billing): move to src/domains/billing/"

Do NOT touch other domains. If you find coupling that needs breaking,
write it to `docs/refactor-followups.md` and keep going.
```

The shim pattern matters. Old imports keep working; your teammates merging feature branches don't get pummeled by import errors. The shims are deleted in a follow-up once everyone's rebased.

### Phase 3 — The handoff doc (this refactor outlives your context window)

Big refactors span sessions. At the end of each working session, capture enough state that the next session — yours or a teammate's — picks up cleanly.

```text [end-of-session prompt]
Write .claude/handoffs/refactor-billing-$(date +%Y%m%d).md with:
  - Which modules have been moved (with SHAs)
  - Which modules are next, per the map
  - Any shim that's still in place (file + what it re-exports)
  - Known regressions or skipped tests
  - Exact commands to resume: typecheck, test, lint
Keep under 50 lines.
```

See [Workflows → Context Handoff](/workflows#handoff) for the pattern. For a long refactor, the `.claude/handoffs/` folder becomes a mini-wiki of how the migration is actually proceeding — and it's exactly the context a fresh session needs.

### Phase 4 — The cleanup pass

Once every domain is in its new home:

```text [cleanup prompt]
All domains from docs/refactor-map.md are migrated.

Now: delete every shim file (they should all be one-line re-exports).
For each, grep the codebase first — if anything still imports from the
old path, update the import instead of leaving the shim.

Commit per domain: "refactor(<domain>): remove import shim".

Finally, update docs/architecture.md to reflect the new shape. Replace
docs/refactor-map.md with a link to docs/architecture.md.
```

### What goes wrong

- **Behavior changes sneak in.** Claude sees a "clearly better" pattern while moving a file and quietly adopts it. Hard rule: pure moves only in the migration PR; behavior changes are separate PRs on top.
- **Tests lag.** Imports are updated, tests still reference old paths. Run `pnpm test -- --listFilesOnly` and diff before vs after; any test that stopped being discovered is a missed import update.
- **Circular imports reappear.** The map identified the circulars; the migration has to actually break them. If you find yourself adding `import type` workarounds to silence TS errors, stop and break the cycle properly.

:::docs-callout{variant="warning" title="Never refactor in the same PR as a feature"}
Every time you mix refactor commits with feature commits, the review takes 3× as long and regressions get harder to bisect. Even if Claude can ship both in an afternoon, split the PRs. Reviewers will thank you.
:::
::::

::::docs-section{id="onboard" title="Onboard a New Engineer"}
The recipe that changes what "onboarding" even means. Instead of handing a new hire a Confluence page from 2023, you hand them a `CLAUDE.md` that's currently accurate and a set of slash commands that let them explore on their own. Their ramp time drops from weeks to days.

**Start with:** A new engineer joined yesterday. You want them shipping their first PR by Friday.

**End with:** They've toured the codebase, paired with Claude on a starter ticket, merged a small change, and contributed back to the onboarding docs.

### Step 1 — Make `CLAUDE.md` the source of truth

Before the engineer arrives, audit your `CLAUDE.md`. If it's stale, fix it. If it's missing, this is the forcing function to write it. See [Foundations → CLAUDE.md Deep Dive](/foundations#claude-md) for the WHAT–WHY–HOW framework.

The question to ask of every line: _"if a smart new hire read this on day one, would it help them or confuse them?"_ If the answer is "confuse," cut it.

### Step 2 — Ship a `/tour` slash command

A single slash command lets the new engineer explore without needing to know where to look.

```markdown [.claude/commands/tour.md]
---
description: A guided tour of this codebase for a new engineer.
---

You are giving a new engineer a 15-minute tour of this codebase.

1. Read CLAUDE.md.
2. Walk them through the repo top-down:
   - What the product does (one paragraph)
   - The five most important top-level folders and what lives in each
   - The three commands they'll run the most (and what they do)
   - The one folder they should avoid touching in their first week, and why
3. Offer three starter tickets — small, safe, well-scoped changes they
   could ship this week. For each, note the files they'd touch and the
   tests they'd run.
4. End with: "Questions? Ask me anything about this codebase."

Write only what's useful. No fluff. No preamble. Be concrete about files
and paths.
```

The new engineer runs `/tour` on day one and gets a personalized orientation. They can follow up with "explain how billing flows end-to-end" or "show me where we handle webhooks" — Claude has the full codebase context and they don't need to interrupt a senior engineer to get unstuck.

### Step 3 — Pair on the first PR

Instead of watching a senior engineer code, the new hire pairs with Claude on a starter ticket. The senior engineer reviews the PR. Ramp time collapses.

```text [prompt — new engineer on their first ticket]
Ticket: "Add a 'copied!' toast when the user clicks the share button
in the invoice view."

I'm new to this codebase. Before we write anything:
  1. Read CLAUDE.md
  2. Find where the invoice view lives and where share button is rendered
  3. Find how toasts are done elsewhere in this app (there has to be a
     pattern — don't invent a new one)
  4. Show me the plan
Then wait for me to approve before writing code.
```

The new hire reviews Claude's plan — they're learning the codebase by reading Claude's exploration. Then they approve execution, run tests, open the PR. Total time: an afternoon. Total senior-engineer-hours consumed: 15 minutes of review.

### Step 4 — Contribute back to onboarding

The feedback loop that makes this compound:

```text [end of first week prompt]
Read docs/onboarding.md and CLAUDE.md.

Based on my actual first week, what was missing or wrong? Specifically:
  - Anything you had to tell me that wasn't in there
  - Anything in there that turned out to be stale
  - Any pattern I tripped over that should be called out

Write the suggested edits to docs/onboarding-followups.md. Don't edit the
live docs yet — I'll review your suggestions first.
```

Every new hire improves the onboarding for the next one. Over a year, you end up with documentation that's been battle-tested by every person who's joined — and the person maintaining it isn't a tech writer, it's every new hire in turn.

:::docs-callout{variant="success" title="The compounding onboarding"}
The first new hire goes from 2 weeks to 1 week. The second goes from 1 week to 3 days. The fifth doesn't need a mentor at all for the first week — the docs and the tour command carry them. This is the biggest team-level ROI in the guide.
:::

### What goes wrong

- **The senior engineer stops reading PRs.** Claude wrote most of the code, so the reviewer skims. Now the new hire learns nothing about code review. Fix: treat Claude's code review on the PR as a _supplement_ to human review, not a replacement.
- **`CLAUDE.md` becomes a wishlist, not a reality.** "We use hexagonal architecture" — do we? Rules that aren't followed are worse than no rules. Audit quarterly.
- **New hire over-relies on Claude.** If they never open a file directly in week one, they don't build a mental model. Require one PR a week where they don't use Claude at all for the code — just for rubber-ducking.
::::

::::docs-section{id="migrate" title="Migrate a Codebase"}
The recipe for the dreaded cross-cutting change: JS → TS, Webpack → Vite, Redux → Zustand, a deprecated lib to its successor. 200 files, the same transformation, and no one wants to babysit it.

**Start with:** A concrete migration target ("all .js files in src/ → .ts," or "every @old/ui-kit import → @new/ui-kit equivalent").

**End with:** The migration merged, tests green, a `docs/migration-<thing>.md` documenting the patterns and exceptions.

### Phase 1 — Spike three approaches (Best-of-N)

Migrations look straightforward until you hit the one file where the "obvious" approach breaks. Before doing 200 files, do 5 files three different ways and pick the one that generalizes.

```bash [three parallel worktrees, three approaches]
git worktree add ../app-mig-A -b mig/js-to-ts-A main
git worktree add ../app-mig-B -b mig/js-to-ts-B main
git worktree add ../app-mig-C -b mig/js-to-ts-C main

# Pick 5 representative files — simple, medium, one with gnarly dynamic
# imports, one with mixed require/import, one with heavy third-party types.
REPS="src/utils/format.js src/api/client.js src/components/Chart.js \
      src/legacy/payments.js src/hooks/useForm.js"
```

Terminal 1 (approach A — strict):

```text [prompt]
Convert these 5 files from .js to .ts: $REPS

Rules:
  - Strict TS config (no any, no implicit any, strict null checks)
  - Add explicit return types on every exported function
  - Fail fast: if a file needs major restructuring, STOP and list why

Report: for each file, did it convert cleanly, and if not what blocked you.
```

Terminal 2 (approach B — lenient): same 5 files, but allow `any` as a transitional escape hatch, with `// TODO: tighten` comments.

Terminal 3 (approach C — codemod + manual): use `jscodeshift` or `ts-migrate` to do the bulk, then hand-clean what the codemod misses.

After an hour, read all three branches. One will have converted 5/5 cleanly, one will have 2/5, one will have 4/5 but with ugly workarounds. You've learned which approach generalizes — and you've paid for the answer with an hour of parallel tokens instead of a day of committed work down the wrong path.

See [Workflows → Best of N](/workflows#best-of-n) and [Orchestration → Git Worktrees](/orchestration#worktrees).

### Phase 2 — Batch the rest

Once you've chosen the approach, batch the remaining files with explicit chunking to avoid blowing context.

```text [prompt — batch of 10]
Using the approach documented in docs/migration-js-to-ts.md, convert
these 10 files. Do them ONE AT A TIME. After each:
  1. Run `pnpm typecheck`
  2. Run `pnpm test -- --related`
  3. Commit: "chore(migration): convert <path>"
  4. Move to the next

If any file fails step 1 or 2 after 2 attempts, STOP. Append the file
and the error to docs/migration-exceptions.md and move on to the next.

Files: [paste 10 file paths]
```

"One at a time, commit each" is load-bearing. Without it, Claude batches edits, one file breaks the build, and now you have 10 broken conversions to untangle. With it, every commit is a known-good point you can `git bisect` to.

### Phase 3 — The exceptions list

There will be files that don't convert cleanly. That's fine — it's why you're keeping `docs/migration-exceptions.md`. When the batch finishes, that file is your punch list.

```text [prompt — exception triage]
Read docs/migration-exceptions.md. For each entry, propose one of:
  - "simple fix" — the specific change that would unblock
  - "needs refactor" — what refactor and roughly how big
  - "leave for now" — why it's fine to ship without

Don't make the fixes yet. Just triage and order by rough effort.
```

### Phase 4 — Verify the migration didn't break anything

Migrations are the single biggest source of silent regressions. Your [eval suite](/evals) earns its keep here.

```bash [pre-merge gates]
pnpm typecheck
pnpm lint
pnpm test
pnpm test:integration
python evals/run.py --mode=ci
# And if you don't have evals yet — this is the recipe that convinces
# you to build them.
```

### What goes wrong

- **The codemod corrupts dynamic imports.** `require(variable)` doesn't always have a clean ESM equivalent. Expect a short exception list and don't fight the codemod to force-convert them.
- **Types look correct but are subtly wrong.** `any` disguised as `unknown`, `Record<string, any>` where the real shape is tight. Budget a week of type-tightening PRs after the mechanical migration lands.
- **CI slows to a crawl.** 200 new .ts files = a lot more for `tsc` to do. If CI times double, add incremental tsc (`"incremental": true` + caching the `.tsbuildinfo`) before anyone gets annoyed.

:::docs-callout{variant="tip" title="Land it behind a flag if you're nervous"}
Migrations that touch the build pipeline can be put behind a build-time flag (`USE_NEW_BUNDLER=1`). Merge both paths, ship with the old one, and flip the flag after a week of parallel verification. Rollback is a one-line env change instead of a revert PR.
:::
::::

::::docs-section{id="reviews" title="Automate Code Reviews"}
The recipe that turns Claude from something you run into something that runs. Every PR gets a thoughtful, codebase-aware review before a human even opens it. Senior engineers stop reviewing boilerplate; junior engineers get instant feedback instead of waiting for someone to be free.

**Start with:** Manual review on every PR, 2–4 hour turnaround, reviewers burning out.

**End with:** A `@claude-reviewer` on every PR within 90 seconds, humans confirming on the subset that matter.

### Step 1 — The reviewer as a subagent

```markdown [.claude/agents/reviewer.md]
---
name: reviewer
description: Review a pull request diff. Produces a structured verdict. Reads only.
tools: Read, Grep, Glob, Bash(git diff*), Bash(git log*), Write
model: opus
---

You are a senior reviewer on this codebase. You review diffs against the
conventions in CLAUDE.md and the history of this repo. You do not edit code.

## Workflow

1. Run `git diff main...HEAD` and read every changed file in full.
2. Read CLAUDE.md and any relevant docs/*.md.
3. For each change, answer these questions silently:
   - Does this follow the conventions in CLAUDE.md?
   - Is error handling consistent with the rest of the codebase?
   - Are there tests for the new behavior? Are they meaningful?
   - Would this break any existing caller? (Grep for usages.)
   - Are there secrets, PII, or credentials in the diff?
4. Write the review to `.claude/state/reviews/<branch>.md`.

## Review format

    # Review: <branch>

    **Verdict:** LGTM | LGTM with suggestions | Needs changes

    ## Blocking (if any)
    - file:line — <issue>

    ## Non-blocking
    - file:line — <suggestion>

    ## Missing tests
    - <case>

    ## Nice touches
    - <thing the author got right, specifically>

Keep each bullet one sentence. No preamble. No repetition. If a
specific file:line reference doesn't apply, use "general" or omit.
```

### Step 2 — A `/review` slash command

```markdown [.claude/commands/review.md]
---
description: Run the reviewer agent on the current branch.
---

Invoke the reviewer agent on the current branch.

After it writes the review doc, print the verdict and the blocking
items inline. Then link to the full review file path.

Do not edit any source code. This is a read-only command.
```

### Step 3 — Hook it into GitHub

Two paths, pick based on your stack.

**Path A — GitHub Actions (no MCP needed):**

```yaml [.github/workflows/claude-review.yml]
name: claude-review
on:
  pull_request:
    types: [opened, synchronize, ready_for_review]

jobs:
  review:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          command: "/review"
          post_comment: true   # post the verdict as a PR comment
```

**Path B — GitHub MCP server (review from your terminal):**

Wire the GitHub MCP server into `.mcp.json`, then from a local session:

```text [prompt — pre-push review]
Use the GitHub MCP tools to list my open PRs. For each PR I authored:
  1. Check out the branch locally
  2. Run /review
  3. Post the verdict as a PR comment via the GitHub MCP
  4. Move on to the next

Skip any PR marked draft.
```

### Step 4 — Measure it (this is where [Evals](/evals) save you)

A review agent that passes everything is useless. One that blocks everything is worse. Before you let it gate merges, eval it against a dataset of real PRs you've already reviewed.

```jsonl [evals/golden/reviews.jsonl]
{"id":"pr-412","diff":"fixtures/pr-412.diff","expected":{"verdict":"NeedsChanges","must_flag":["sql injection at src/search.ts:88"]}}
{"id":"pr-421","diff":"fixtures/pr-421.diff","expected":{"verdict":"LGTM"}}
{"id":"pr-433","diff":"fixtures/pr-433.diff","expected":{"verdict":"LGTM with suggestions","must_not_flag":["unrelated logging change in src/log.ts"]}}
```

Run the suite weekly. If the reviewer's pass rate drops, retune the prompt before production PRs notice. See [Evals → Regression Suites](/evals#regression).

### What goes wrong

- **The reviewer becomes background noise.** Every PR has 12 non-blocking suggestions and nobody reads them. Fix: be ruthless about what counts as "blocking" vs "non-blocking" — and make "non-blocking" rare enough that people trust it.
- **It flags safe changes as risky.** Usually a CLAUDE.md problem: the convention isn't written down, so the reviewer guesses. Every false positive is a prompt to tighten CLAUDE.md.
- **It misses the one thing that would've mattered.** Expected. Humans still have the last call. The reviewer's job is to catch the first 80% so humans can focus on the 20% that's actually subtle.

:::docs-callout{variant="tip" title="Don't make it blocking on day one"}
Ship the reviewer as advisory-only for a month. Let it post comments; don't require approval. After a month of false-positive rate data, decide whether to make its blocking verdict a required check. Forcing merge-blocking on week one is how teams rage-disable reviewers.
:::
::::

::::docs-section{id="feature" title="Ship a Feature in a Worktree"}
The capstone recipe. This is what it looks like when you put everything together: worktrees, Plan Mode, an agent team, quality gates, the reviewer. A feature ticket becomes a merged PR by lunch.

**Start with:** A ticket. "Users can bulk-archive invoices from the invoice list."

**End with:** A merged PR with a plan doc, implementation, tests, and a reviewer's LGTM — and your main branch untouched during the whole ride.

### Step 1 — Spin up the worktree

```bash [one command, one home]
cd ~/code/myapp
TICKET="bulk-archive-invoices"
git worktree add ../myapp-$TICKET -b feat/$TICKET main
cd ../myapp-$TICKET
claude
```

Your main checkout is still on `main`, untouched. Whatever you do in this session can't stomp on your actual work.

### Step 2 — Plan, with the planner agent

```text [prompt in the worktree]
Ticket: "Users can bulk-archive invoices from the invoice list."

Use the planner agent. Read CLAUDE.md and the current invoice list
feature before planning.

I want a plan that covers:
  - UI (checkbox + bulk-action dropdown, selection state model)
  - API (new /api/invoices/bulk endpoint, auth scope, rate limit)
  - DB (archived_at timestamp, index strategy)
  - Tests (unit + integration + one happy-path E2E)
  - Feature flag (this ships behind `ff.bulk_archive`)

Write it to .claude/state/plans/$TICKET.md. Stop when done.
```

Read the plan. Push on anything that smells off. Approve it out loud to Claude (_"the plan looks good, proceed to implementation"_) — the spoken approval is part of the session's context.

### Step 3 — Implement, slice by slice

```text [prompt — slice 1]
Use the implementer agent on plan step 1 (the DB migration + archived_at).

One commit. Run pnpm test + pnpm typecheck before committing.
When done, return a one-line summary.
```

Repeat for each step. Between steps, eyeball the diff. If a slice feels too big, ask the planner to split it.

### Step 4 — Test, review, gate

```text [prompt — end of implementation]
We've shipped the plan. Now:
  1. Use the tester agent to extend tests for the bulk endpoint
     (concurrency, partial-failure, permission denied cases).
  2. Use the reviewer agent on the full branch diff.
  3. Report the reviewer verdict.

If the reviewer says "Needs changes", STOP. Do not try to fix.
Hand back to me with the review doc path.
```

This is the gate. If the reviewer blocks, you look at the review, decide what's real, and prompt for fixes deliberately. Don't let Claude auto-repair on the reviewer's word — that's how you end up in an agent-vs-agent loop that neither wins.

### Step 5 — PR and merge

```bash [open the PR]
git push -u origin feat/$TICKET
gh pr create \
  --title "Bulk archive invoices" \
  --body "$(cat .claude/state/plans/$TICKET.md)" \
  --draft

# CI runs. If everything's green and the @claude-reviewer LGTMs,
# mark ready for review and merge.
gh pr ready
gh pr merge --squash --delete-branch
```

### Step 6 — Clean up

```bash [back in main]
cd ~/code/myapp
git pull
git worktree remove ../myapp-$TICKET
git worktree list   # sanity check
```

### Why this flow is worth internalizing

Every pattern in the rest of the guide appears here:

- **Plan Mode / 4-phase workflow** → [Workflows](/workflows)
- **CLAUDE.md + agent files** → [Foundations](/foundations), [Extensions](/extensions)
- **Subagents (planner / implementer / tester / reviewer)** → [Orchestration → Agent Teams](/orchestration#teams)
- **Worktree isolation** → [Orchestration → Git Worktrees](/orchestration#worktrees)
- **Quality gates** → [Orchestration → Quality Gates](/orchestration#gates)
- **The reviewer eval set** → [Evals](/evals)
- **Checkpointing, handoffs** → [Workflows → Checkpointing](/workflows#checkpoints), [Context Handoff](/workflows#handoff)

The first time you run this flow it'll take two hours and feel like overkill. The fifth time, it'll be 30 minutes and feel like the most efficient thing you've ever done on software. That's the whole point of the guide.

:::docs-callout{variant="success" title="The answer to 'is Claude Code worth it?'"}
After this recipe, the question stops being hypothetical. Either the loop works for your team and you compound on it, or something specific is breaking — and now you know enough to diagnose exactly which layer. That's the graduation from user to operator.
:::
::::
