<template>
  <article>
    <DocsPageHeader
      title="Workflows"
      eyebrow="Plan → execute"
      accent="workflows"
      :icon="Zap"
      description="The 4-phase workflow, Plan Mode, feedback loops, prompt precision, session management, checkpointing, the Big Prompt pattern, Best of N, and context handoff — the day-to-day motions that separate shipping from spinning."
      est-read-time="22 min"
    />

    <DocsProse>
      <p>
        Foundations is about what Claude Code <em>is</em>. Workflows is about
        what you <em>do</em> with it, every hour of every day. The difference
        between people who ship five features a week and people who re-prompt
        the same broken edit ten times is almost entirely in this chapter. Every
        pattern here is paired with the exact command, prompt, or snippet you
        can paste in today.
      </p>
    </DocsProse>

    <DocsSection id="four-phase" title="The 4-Phase Workflow">
      <DocsProse>
        <p>
          Anthropic's internal teams — and every power user you can find on
          YouTube — converge on the same four-beat rhythm:
          <strong>Explore → Plan → Execute → Verify</strong>. Each phase answers
          a different question, and skipping any of them is the root cause of
          most "Claude went off the rails" stories.
        </p>
        <ol>
          <li>
            <strong>Explore</strong> — answer "what exists today?" Read the
            relevant files, map dependencies, identify constraints. No edits
            yet.
          </li>
          <li>
            <strong>Plan</strong> — answer "what will we change?" Produce a
            written plan: files touched, functions added, risks. You review
            before any code moves.
          </li>
          <li>
            <strong>Execute</strong> — answer "do the plan". Small, checkpointed
            diffs, one logical unit at a time.
          </li>
          <li>
            <strong>Verify</strong> — answer "did it work?" Run tests, type
            check, lint, eyeball the diff. Repair gaps before moving on.
          </li>
        </ol>
      </DocsProse>

      <DocsCodeBlock
        title="prompt"
        language="text"
        code="I want to add rate limiting to the /login endpoint.

Phase 1 — Explore only:
  - Read src/server/auth/**, src/middleware/**, and the Express setup in src/app.ts
  - Tell me what auth middleware exists today and where request-level middleware is registered
  - DO NOT edit any files

When you're done, stop and wait for me to approve a plan."
      />

      <DocsCallout variant="tip" title="Phase boundaries are literal">
        Tell Claude, out loud, which phase it's in. &quot;Explore only, no
        edits&quot; is the magic incantation that keeps it from speed-running to
        a broken diff. Entering plan mode is even better — see the next
        subsection.
      </DocsCallout>

      <DocsProse>
        <h3>The skip → regret loop</h3>
        <p>
          The most common failure mode isn't bad prompting — it's skipping
          Explore. You ask for a change, Claude guesses at the current shape of
          the code, and the plan it produces reflects that guess. The edit then
          fights with the file that actually exists. Giving Claude 30 seconds to
          read the relevant files first removes this entire class of errors.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="plan-mode" title="Plan Mode">
      <DocsProse>
        <p>
          Plan Mode is a built-in safety rail that <em>forces</em> the model
          into read-only exploration and plan production. It cannot call write
          tools while in Plan Mode — no <code>Edit</code>, no
          <code>Write</code>, no shell commands with side effects. You exit Plan
          Mode only after approving a plan, and the approved plan is pinned into
          context so execution stays on track.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="activating plan mode"
        language="text"
        code="# In the terminal — hit Shift+Tab twice to cycle into Plan Mode
# You'll see a “plan mode” indicator in the StatusLine.

# Prompt while in plan mode:
Refactor src/billing/invoice.ts to extract the tax calculation into its
own module. Read the current file and anything that imports it, then
propose:
  1. New file layout
  2. Exact functions to move
  3. Files that need import updates
  4. Risks / places I should pay attention to"
      />

      <DocsCallout variant="info" title="The Shift+Tab cycle">
        <p>
          Shift+Tab cycles through three permission modes in the CLI:
        </p>
        <p>
          <code>normal → auto-accept edits → plan mode → normal</code>
        </p>
        <p>
          Use plan mode for anything non-trivial; use auto-accept only in
          throwaway sandboxes.
        </p>
      </DocsCallout>

      <DocsProse>
        <h3>A good plan you can approve</h3>
        <p>
          A plan worth approving has four properties: it names files, it names
          functions, it names tests you can run to verify, and it calls out
          anything ambiguous. If the plan is vague — "I'll refactor the billing
          module and add tests" — reject it and ask for specifics. The cost of
          a second plan round is tiny; the cost of re-doing a bad execution is
          massive.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="skip-plan" title="When to Skip Planning">
      <DocsProse>
        <p>
          Planning has a cost — it burns tokens and your attention. For some
          tasks the cost exceeds the payoff.
        </p>
        <p><strong>Skip planning when:</strong></p>
        <ul>
          <li>
            The ask is one file, one function, and you already know the change.
            Example: "rename <code>getCwd</code> to
            <code>getCurrentWorkingDirectory</code>".
          </li>
          <li>
            You're exploring, not shipping — "show me what happens when I
            <code>console.log(user)</code>&nbsp;here". Throwaway edits in a
            throwaway branch.
          </li>
          <li>
            The task is self-verifying in under 10 seconds (e.g. a small style
            tweak you'll eyeball, or fixing a typo a linter already flagged).
          </li>
        </ul>
        <p><strong>Always plan when:</strong></p>
        <ul>
          <li>Touching &gt; 3 files or crossing module boundaries.</li>
          <li>Changing anything with tests — the plan names the tests to run.</li>
          <li>Adding or modifying a public API surface.</li>
          <li>You can't describe success in one sentence.</li>
        </ul>
      </DocsProse>

      <DocsCallout variant="warning" title="The 10-second rule">
        If a task's verification takes longer than the edit itself, plan. You're
        not saving time by skipping — you're deferring the thinking to a worse
        time.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="feedback" title="Feedback Loops">
      <DocsProse>
        <p>
          The agentic loop only gets better with signal. A feedback loop is
          anything that lets Claude know, programmatically, whether its last
          change worked — tests, a type checker, a linter, a build, a running
          server. The shorter the loop, the faster Claude converges.
        </p>
        <p>
          You want signals that are <strong>fast</strong> (seconds, not
          minutes), <strong>specific</strong> (which line, which error), and
          <strong>automatic</strong> (no human in the middle for the happy path).
        </p>
      </DocsProse>

      <DocsProse>
        <h3>Wire tests into the loop</h3>
        <p>
          Tell Claude, up front, which command validates the change. Put it in
          <code>CLAUDE.md</code> so you don't repeat yourself:
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="CLAUDE.md"
        language="markdown"
        code="## Verification

Run these after any code change, in order:

1. `pnpm typecheck`   — must exit 0
2. `pnpm lint`        — must exit 0, warnings OK
3. `pnpm test -- --run <affected>` — only tests in the files you touched
4. For UI work: `pnpm dev` and note any console errors

If any step fails, fix the root cause. Do not disable tests or add
`any` types to silence errors."
      />

      <DocsProse>
        <h3>Hook-based auto-verification</h3>
        <p>
          Add a <code>PostToolUse</code> hook that runs the type checker
          whenever Claude edits a file. Claude sees the result on the next turn
          and can fix errors before you ever see them.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/settings.json"
        language="json"
        code='{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm typecheck --pretty false 2>&1 | tail -30"
          }
        ]
      }
    ]
  }
}'
      />

      <DocsCallout variant="tip" title="Keep loops under 10 seconds">
        A 60-second test suite is a bad feedback loop — Claude will start
        speculating instead of waiting. Scope your automatic verification to the
        touched files, and save the full suite for the Verify phase.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="prompts" title="Prompt Precision">
      <DocsProse>
        <p>
          Most "bad prompts" aren't wrong — they're under-specified. Claude
          answers the prompt you wrote, and you wanted it to answer the prompt
          you meant. A precise prompt has four slots:
        </p>
        <ol>
          <li><strong>Context</strong> — what files, what situation.</li>
          <li><strong>Task</strong> — the verb, on the noun, with the outcome.</li>
          <li><strong>Constraints</strong> — what you don't want, and why.</li>
          <li><strong>Output</strong> — the shape of a done answer.</li>
        </ol>
      </DocsProse>

      <DocsCodeBlock
        title="before (under-specified)"
        language="text"
        code="fix the login bug"
      />

      <DocsCodeBlock
        title="after (precise)"
        language="text"
        code="Context: src/server/auth/login.ts. Users on Safari report being
logged out after refresh, but Chrome works. I suspect the session
cookie's SameSite attribute.

Task: find the root cause and propose a fix. Don't apply it yet.

Constraints:
  - Don't switch cookie libraries; we're pinned to `cookie-parser`.
  - Keep auth flow backward compatible with our mobile app's token.
  - Touch only files under src/server/auth/.

Output:
  1. A 2-3 sentence explanation of the root cause.
  2. A unified diff of the minimum change.
  3. A one-line curl I can run to verify locally."
      />

      <DocsCallout variant="tip" title="The 'don't' list is load-bearing">
        Constraints aren't politeness — they're how you prevent
        scope creep. &quot;Don't touch the database layer&quot; saves you from
        reviewing a 400-line diff that accidentally refactored your ORM.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="sessions" title="Session Management">
      <DocsProse>
        <p>
          A session is a conversation with its own growing context window.
          Treat sessions like branches — cheap, disposable, and scoped to one
          piece of work. The commands below are the ones you'll use ten times a
          day.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="essential slash commands"
        language="bash"
        code="/context     # show token breakdown (system, CLAUDE.md, files, conversation)
/cost        # session cost in dollars, by model
/compact     # summarize old turns, keep the gist, free up tokens
/clear       # reset the conversation, keep CLAUDE.md / settings
/resume      # reattach to a previous session by id
/model       # switch models mid-session (sonnet ↔ opus ↔ haiku)
/init        # scaffold CLAUDE.md for the current repo
/memorize    # ask Claude to add a lesson learned to CLAUDE.md"
      />

      <DocsProse>
        <h3>The three signals to start a new session</h3>
        <ol>
          <li>
            <code>/context</code> shows you're above 70% — the model starts
            forgetting early turns silently.
          </li>
          <li>
            You've switched tasks (from "fix login bug" to "write release notes").
            Old context is now tax.
          </li>
          <li>
            You compacted twice already. The summaries are getting summarised.
            Start fresh with a clean goal and a handoff doc (see
            <a href="#handoff">Context Handoff</a>).
          </li>
        </ol>
      </DocsProse>

      <DocsCallout variant="info" title="/compact is not free">
        Compaction is itself a model call — it reads your whole conversation,
        writes a summary, and replaces the turns. It's cheaper than a full
        reset but not free. Use it when you want to keep working; use
        <code>/clear</code> when you've actually changed topics.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="checkpoints" title="Checkpointing">
      <DocsProse>
        <p>
          A checkpoint is a point you can cheaply rewind to when something goes
          sideways. Claude Code doesn't have a built-in time machine — your
          repo is the time machine, and <code>git</code> is the API. The
          discipline is simple: before any risky step, commit; after any clean
          milestone, commit again. Never rely on undo.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="the checkpoint rhythm"
        language="bash"
        code="# Before execution: checkpoint current state
git add -A && git commit -m 'checkpoint: before rate-limit refactor' --allow-empty

# After each coherent milestone
git add -A && git commit -m 'rate-limit: extract middleware'

# If something goes wrong:
git reset --hard HEAD~1      # nuke last step
# or
git reflog                    # find a known-good SHA
git reset --hard <sha>"
      />

      <DocsProse>
        <h3>Let Claude own the checkpoints</h3>
        <p>
          Bake the rhythm into <code>CLAUDE.md</code> so you don't have to
          remind the model:
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="CLAUDE.md"
        language="markdown"
        code='## Checkpoint policy

- Before applying a multi-file change, run:
  `git add -A && git commit -m "checkpoint: <what we are about to do>" --allow-empty`
- After each milestone in the plan completes and tests pass, commit with a
  conventional-commits message (feat:, fix:, refactor:, test:, docs:).
- Never rewrite history on the user&apos;s branch without asking.'
      />

      <DocsCallout variant="warning" title="Squash at the end, not during">
        The temptation to &quot;keep history clean&quot; by amending as you go
        destroys your rewind safety. Ugly incremental commits are the point.
        Squash once, at the end, when the whole feature is green.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="big-prompt" title="The Big Prompt Pattern">
      <DocsProse>
        <p>
          The Big Prompt pattern front-loads every scrap of context the model
          might need into a single, long, well-structured message. It looks
          wasteful next to short prompts — and it is, on easy tasks. On hard
          tasks, it's the difference between one clean run and five confused
          ones.
        </p>
        <p>
          The shape is always the same: <em>goal, context, constraints,
          non-goals, output format, examples</em>. Treat it like a product spec.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="big prompt template"
        language="text"
        code="# Goal
Add server-side rate limiting to /api/login so brute-force attempts
are capped at 5 attempts per IP per 10 minutes.

# Current state (what exists today)
- Express server at src/app.ts, middleware registered at line 42.
- Auth routes in src/server/auth/*. No existing rate limiting.
- Redis is available via src/lib/redis.ts (client exported as `redis`).
- We run tests with Vitest: `pnpm test`. Auth tests live in
  src/server/auth/__tests__/*.

# Constraints
- Use a sliding-window algorithm, not fixed-window (we had an incident
  where users got locked out exactly at minute boundaries).
- Must be unit-testable without a live Redis instance — inject the client.
- Return 429 with a JSON body `{ error, retryAfterSeconds }`.
- Don't introduce new npm deps. Write the window logic ourselves.

# Non-goals
- Don't touch /api/signup or /api/password-reset in this PR.
- Don't change the auth cookie contract.
- Don't add global rate limiting — only this endpoint for now.

# Output
1. A plan with files to change / create.
2. After I approve, the diff in small commits.
3. New tests in src/server/auth/__tests__/rateLimit.test.ts.
4. An updated README section under ## Rate limiting.

# Examples
- The retry header we return is modeled on GitHub's:
  `Retry-After: 42` (seconds as integer)."
      />

      <DocsCallout variant="tip" title="Write the prompt once, reuse it twice">
        Good Big Prompts become <code>.claude/commands/*.md</code> slash
        commands the next time you need them. If you wrote <em>this</em> one
        today, save it as <code>/new-endpoint</code> with placeholders.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="best-of-n" title="Best of N">
      <DocsProse>
        <p>
          For tasks with real ambiguity — new UI designs, algorithm picks,
          naming, API shape — run the same prompt <strong>N</strong> times in
          parallel worktrees and pick the best result. Claude is non-deterministic
          enough that three attempts beat one almost every time, and git
          worktrees make parallelism cheap.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="spawn 3 parallel attempts"
        language="bash"
        code='# From the repo root
TASK=&quot;design a react component for a pricing page with 3 tiers&quot;

for i in 1 2 3; do
  git worktree add ../repo-try-$i -b try/$i HEAD
  (cd ../repo-try-$i && \
    claude --print &quot;$TASK. Output only the final component file.&quot; \
      > ../try-$i.tsx) &
done
wait

# Compare the three outputs side-by-side
diff -u ../try-1.tsx ../try-2.tsx | less
code ../try-1.tsx ../try-2.tsx ../try-3.tsx'
      />

      <DocsProse>
        <h3>When Best of N is worth it</h3>
        <ul>
          <li><strong>High variance in outputs:</strong> UI, copy, naming, arch.</li>
          <li>
            <strong>Cheap evaluation:</strong> you can eyeball three diffs in
            two minutes.
          </li>
          <li>
            <strong>No clear "right answer":</strong> you're choosing a
            preference, not a correctness target.
          </li>
        </ul>
        <p>
          Don't Best-of-N when a compiler, test suite, or type checker could
          pick the winner for you — in that world, one attempt plus feedback
          loops wins.
        </p>
      </DocsProse>

      <DocsCallout variant="info" title="Clean up your worktrees">
        <p>Worktrees are cheap but not free — old ones accumulate and confuse tools.</p>
        <p><code>git worktree list</code> to audit, <code>git worktree remove ../repo-try-2</code> when done.</p>
      </DocsCallout>
    </DocsSection>

    <DocsSection id="handoff" title="Context Handoff">
      <DocsProse>
        <p>
          Sometimes you run out of context mid-task, switch to a fresh session,
          or hand the work to a teammate (or a different agent). A context
          handoff is a short document that captures <em>exactly enough</em> for
          the next session to pick up without losing signal. Done well, it
          feels like save-and-resume.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/handoff.md"
        language="markdown"
        code='# Handoff — rate limiting on /api/login

## Status
- Plan approved on 2026-04-22.
- Completed: src/server/auth/rateLimit.ts + unit tests.
- Checkpoint SHA: `a1b2c3d` (branch `feat/login-rate-limit`).

## Next step
Wire the middleware into src/server/auth/router.ts line ~48, right
after `cors()` and before `authRoutes`.

## Open questions
- Should we emit a metrics event on 429? (Ask Dayo.)
- Redis key TTL is 600s — confirm matches product spec.

## Gotchas
- Our Redis mock in `test/utils/redis.ts` does not implement `EXPIRE`.
  The middleware uses SET with PX, so tests should still pass, but add
  a direct test for expiry if you extend the logic.

## Commands
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Tests: `pnpm test -- src/server/auth`'
      />

      <DocsProse>
        <h3>Ask Claude to write its own handoff</h3>
      </DocsProse>

      <DocsCodeBlock
        title="end-of-session prompt"
        language="text"
        code="We're out of context. Before I /clear, write .claude/handoff.md with:
  - Current status (what's done, what isn't)
  - The next concrete step
  - Any open questions I should ask
  - Gotchas / non-obvious traps you hit
  - The exact commands needed to resume
Keep it under 40 lines."
      />

      <DocsCallout variant="success" title="Handoffs compound">
        Every handoff you keep in <code>.claude/handoffs/</code> is a small
        knowledge base of how your codebase actually behaves under agentic
        work. After a few weeks, pointing new sessions at the folder gives
        Claude a head start a fresh <code>CLAUDE.md</code> never could.
      </DocsCallout>
    </DocsSection>

    <DocsPageNav
      :prev="{ title: 'Foundations', path: '/foundations' }"
      :next="{ title: 'Extensions', path: '/extensions' }"
    />
  </article>
</template>

<script setup lang="ts">
import { Zap } from "@lucide/vue";
import type { TocItem } from "~/utils/types/nav";

const seoTitle = "Workflows — Plan → Execute with Claude Code";
const seoDescription =
  "The 4-phase plan → execute workflow, Plan Mode, feedback loops, prompt precision, session management, checkpointing, the Big Prompt pattern, Best of N, and context handoff patterns for Claude Code.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/workflows",
  type: "article",
  keywords: [
    "claude code workflow",
    "plan mode",
    "prompt engineering",
    "feedback loops",
    "session management",
    "checkpointing",
    "big prompt pattern",
    "best of n",
    "context handoff",
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
            timeRequired: "PT22M",
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
                name: "Workflows",
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
  { id: "four-phase", title: "The 4-Phase Workflow", level: 2 },
  { id: "plan-mode", title: "Plan Mode", level: 2 },
  { id: "skip-plan", title: "When to Skip Planning", level: 2 },
  { id: "feedback", title: "Feedback Loops", level: 2 },
  { id: "prompts", title: "Prompt Precision", level: 2 },
  { id: "sessions", title: "Session Management", level: 2 },
  { id: "checkpoints", title: "Checkpointing", level: 2 },
  { id: "big-prompt", title: "The Big Prompt Pattern", level: 2 },
  { id: "best-of-n", title: "Best of N", level: 2 },
  { id: "handoff", title: "Context Handoff", level: 2 },
];

onMounted(() => setItems(tocItems));
onBeforeUnmount(() => setItems([]));
</script>
