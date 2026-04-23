<template>
  <article>
    <DocsPageHeader
      title="Foundations"
      eyebrow="Start here"
      accent="foundations"
      :icon="BookOpen"
      description="The mental model, how the harness actually works, and the configuration layers you'll touch in your first week. Every other section assumes the ideas here."
      est-read-time="25 min"
    />

    <DocsProse>
      <p>
        There's a cliff between people who "use Claude Code sometimes" and
        people who ship real systems with it every day. The cliff isn't about
        prompt-writing talent. It's about <strong>context architecture</strong>
        — knowing what Claude sees, when it sees it, and how the harness around
        the model decides what to do next. This section is about getting you on
        the right side of that cliff.
      </p>
    </DocsProse>

    <DocsSection id="mental-model" title="The Mental Model Shift">
      <DocsProse>
        <p>
          The single biggest gap in 2026 isn't prompt quality — it's thinking
          about Claude Code as a <strong>chatbot</strong> instead of as
          <strong>infrastructure</strong>. A chatbot is a thing you type at. A
          piece of infrastructure is a thing you configure, shape, and build
          guardrails around. Claude Code is the latter.
        </p>
        <p>
          Treat it like software you're setting up for your team. The outputs
          you get out are bounded by the context you put in — the
          <code>CLAUDE.md</code>, the <code>.claudeignore</code>, the hooks you
          wire into file-write events, the skills and subagents you've defined,
          the MCP servers you've connected. None of those exist by default.
          Setting them up is the job.
        </p>
      </DocsProse>

      <DocsCallout variant="tip" title="The 80%²⁰ math">
        If Claude makes the right call 80% of the time on any single decision,
        and a typical feature has 20 decisions, the odds of it getting all of
        them right are 0.8²⁰ ≈ 1%. Anthropic's internal testing found that
        unguided attempts succeed about 33% of the time. Planning collapses
        those ambiguous decisions into a spec you've reviewed — each one lands
        near 100%.
      </DocsCallout>

      <DocsProse>
        <h3>Context architecture &gt; prompt cleverness</h3>
        <p>
          People obsess over prompt phrasing when the real leverage is further
          upstream:
        </p>
        <ul>
          <li>
            Is Claude reading a 400-line <code>CLAUDE.md</code> on every turn
            when only 50 lines are load-bearing? That's wasted context.
          </li>
          <li>
            Is it loading <code>node_modules</code> tree output because
            <code>.claudeignore</code> is missing? That's wasted context.
          </li>
          <li>
            Is it re-reading <code>package.json</code> on every message because
            there's no tool memory between calls? That's wasted context.
          </li>
        </ul>
        <p>
          Fix those three and the prompts you were worried about start working.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="how-it-works" title="How Claude Code Works">
      <DocsProse>
        <p>
          Claude Code is two things fused together: a
          <strong>harness</strong> that runs on your machine, and the
          <strong>Claude model</strong> that runs in Anthropic's data centers.
          Everything you think of as "intelligence" lives in the model.
          Everything you think of as "capability" — reading files, running
          shells, editing code, executing hooks — lives in the harness.
        </p>
        <p>
          When you type a message, the harness packages up a request: your
          message, the conversation history, the system prompt, the
          <code>CLAUDE.md</code>, the list of available tools, and ships it to
          the model. The model replies with either text for you or a tool call.
          If it's a tool call, the harness executes it locally, captures the
          result, and sends that back to the model for the next turn. This loop
          continues until the model produces a final answer. That loop is the
          <strong>agentic loop</strong>, and it's where most of the interesting
          behavior comes from.
        </p>
      </DocsProse>

      <DocsCallout variant="info" title="What runs where">
        <p>
          <strong>Your machine:</strong> the CLI, the file reads/writes, hooks,
          shell commands, MCP servers, sandboxing, permission prompts. Your code
          never leaves your machine unless a tool specifically sends it (e.g.
          the model sees a file you <code>cat</code> out).
        </p>
        <p>
          <strong>Anthropic's servers:</strong> the model inference. Prompts and
          tool results travel there for reasoning. Nothing writes to your disk
          from there — the harness is what writes.
        </p>
      </DocsCallout>

      <DocsProse>
        <h3>Tools: read-only vs write</h3>
        <p>
          The harness exposes tools in two flavors. Read-only tools
          (<code>Read</code>, <code>Glob</code>, <code>Grep</code>,
          <code>WebFetch</code>) never modify your system — they just return
          information. Write tools (<code>Edit</code>, <code>Write</code>,
          <code>Bash</code>) change state. In <strong>Plan Mode</strong>
          (covered in Workflows), only read-only tools are available, which is
          why it's safe to let Claude explore without supervision.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="context-window" title="The Context Window">
      <DocsProse>
        <p>
          Claude's context window is 200K tokens. Sounds huge. It fills faster
          than you'd think, and it's the single most important resource you
          manage.
        </p>
        <p>
          The system prompt plus tool definitions take ~30–50K tokens before
          you've typed anything. Add a 5K CLAUDE.md, a few file reads, a couple
          of command outputs, and you're at 80K before the real work begins.
          Once the window crosses ~70–80% full, performance degrades visibly:
          Claude forgets earlier instructions, ignores CLAUDE.md rules, repeats
          itself, and makes more mistakes. More mistakes mean more rework, more
          rework means more tokens burned — a vicious cycle.
        </p>
      </DocsProse>

      <DocsCallout variant="warning" title="The 80% threshold">
        When <code>/context</code> shows you're past 80%, stop adding. Finish
        the current task, save any breadcrumbs you need in a file, and
        <code>/clear</code> before starting the next one. Continuing past 80% is
        almost always more expensive than a clean restart.
      </DocsCallout>

      <DocsProse>
        <h3>Monitor what's actually in there</h3>
        <p>Two commands tell you where your tokens went:</p>
      </DocsProse>

      <DocsCodeBlock
        language="bash"
        code="/cost       # total tokens used this session, in dollars
/context    # breakdown: system prompt, CLAUDE.md, tools, conversation, files"
      />

      <DocsProse>
        <p>
          For continuous visibility, configure the <strong>StatusLine</strong>
          to show the current token percentage as you work. Most people discover
          after one week of watching it that half their "Claude is being weird"
          complaints were really "my context was at 90% full."
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="setup" title="Setup & Installation">
      <DocsProse>
        <p>
          Claude Code ships in five surfaces. They share the same underlying
          engine — pick based on where you already live.
        </p>
      </DocsProse>

      <DocsProse>
        <h3>Terminal (the primary one)</h3>
      </DocsProse>

      <DocsCodeBlock
        language="bash"
        code="# macOS / Linux
curl -fsSL https://claude.ai/install.sh | sh

# npm (any platform)
npm install -g @anthropic-ai/claude-code

# First run — will walk you through auth
claude"
      />

      <DocsProse>
        <p>
          On first run you'll be prompted to authenticate (browser OAuth or API
          key depending on your plan). The terminal CLI is the one every other
          surface is built on — features land here first.
        </p>
        <h3>VS Code extension</h3>
        <p>
          Install "Claude Code" from the Extensions marketplace. Opens a Claude
          panel inside VS Code with the same engine and settings as the CLI. The
          editor surface adds in-file diffs, inline diagnostics, and IDE-native
          approvals. Your <code>CLAUDE.md</code>, settings, and skills apply
          identically.
        </p>
        <h3>Desktop app</h3>
        <p>
          A native Mac/Windows app at
          <a href="https://claude.ai/download" target="_blank" rel="noopener"
            >claude.ai/download</a
          >. Same engine, but designed for people who don't live in a terminal.
          Useful for sharing Claude Code with non-CLI folks on your team.
        </p>
        <h3>Web</h3>
        <p>
          <a href="https://claude.ai/code" target="_blank" rel="noopener"
            >claude.ai/code</a
          >
          runs Claude Code in a cloud sandbox — no local install, spawns
          VM-isolated environments. Good for one-off tasks, reviewing PRs, and
          "I'm on a Chromebook" scenarios.
        </p>
        <h3>JetBrains</h3>
        <p>
          Plugin available for IntelliJ, WebStorm, PyCharm, GoLand, and the rest
          of the JetBrains family. Install from the Plugin Marketplace.
        </p>
      </DocsProse>

      <DocsCallout variant="tip" title="Start in the terminal">
        Even if you prefer VS Code, spend your first few days in the terminal.
        The CLI's feedback is more honest — you see exactly what commands it
        runs, what files it touches, and where context goes. Once you trust the
        loop, graduate to whichever surface suits your flow.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="claude-md" title="CLAUDE.md Deep Dive">
      <DocsProse>
        <p>
          <code>CLAUDE.md</code> is your project's memory — a markdown file at
          the repo root that Claude loads into every session as system context.
          It's the difference between "Claude who learned your codebase the hard
          way" and "Claude who already knows your conventions."
        </p>
      </DocsProse>

      <DocsCallout variant="warning" title="Keep it under 5,000 tokens">
        Every token in <code>CLAUDE.md</code> is consumed at the start of
        <em>every</em> session. A 15K CLAUDE.md burns ~$0.05/session before
        you've typed anything, and it eats context you need for actual work.
        Under 5K is the target. Under 3K is better.
      </DocsCallout>

      <DocsProse>
        <h3>The WHAT–WHY–HOW framework</h3>
        <p>Good CLAUDE.md entries answer three questions in order:</p>
        <ul>
          <li>
            <strong>WHAT</strong> — the rule.
            <em
              >"All API errors are thrown as typed exceptions from
              <code>errors.ts</code>."</em
            >
          </li>
          <li>
            <strong>WHY</strong> — the reason.
            <em
              >"So callers don't have to check status codes; the router catches
              and formats at the edge."</em
            >
          </li>
          <li>
            <strong>HOW</strong> — the concrete application.
            <em
              >"Use <code>throw new ApiError(...)</code>; don't return error
              objects from service functions."</em
            >
          </li>
        </ul>
        <p>
          Without the <strong>WHY</strong>, Claude follows the rule rigidly and
          fails on edge cases. Without the <strong>HOW</strong>, Claude agrees
          and does it wrong anyway. The combination gives it enough to judge
          unfamiliar situations.
        </p>
      </DocsProse>

      <DocsProse>
        <h3>What belongs in CLAUDE.md</h3>
        <ul>
          <li>The stack (languages, frameworks, major libraries)</li>
          <li>How the repo is laid out (one-line per top-level folder)</li>
          <li>
            Non-obvious conventions (error handling, state management, tests)
          </li>
          <li>
            Hard rules (<em>"never call X directly; always go through Y"</em>)
          </li>
          <li>Where to look for domain docs (referenced, not inlined)</li>
          <li>
            The commands you'd run: <code>npm run dev</code>,
            <code>npm test</code>, etc.
          </li>
        </ul>
        <h3>What does NOT belong</h3>
        <ul>
          <li>Full API references — link to the file instead</li>
          <li>Examples Claude can derive by reading code</li>
          <li>
            Anything that changes often (current sprint goals, in-progress work)
          </li>
          <li>
            Full architecture diagrams in ASCII — one-sentence summaries, then
            link
          </li>
          <li>Boilerplate like "please be helpful" — Claude already is</li>
        </ul>
      </DocsProse>

      <DocsProse>
        <h3>Tiered architecture</h3>
        <p>
          When your project is big enough that 5K isn't enough, go tiered. Keep
          <code>CLAUDE.md</code> small and point to deeper docs that load only
          when relevant:
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="CLAUDE.md (abridged)"
        code="# Project: Shipping Platform

Node.js + Fastify + Postgres. Strict TypeScript.

## Conventions
- All errors throw, never return. See `docs/errors.md` when working with error handling.
- Payments logic is sensitive — read `docs/payments-architecture.md` before touching `src/payments/`.
- Tests colocated with code: `foo.ts` and `foo.test.ts`.

## Commands
- `npm run dev` — local server
- `npm test` — unit + integration
- `npm run db:migrate` — apply new migrations"
      />

      <DocsProse>
        <p>
          Claude reads the referenced files only when it needs to. A developer
          working on the frontend never pays the token cost of payment docs.
        </p>
      </DocsProse>

      <DocsCallout variant="tip" title="Personal vs project CLAUDE.md">
        There are two of these. Project <code>CLAUDE.md</code> lives in the repo
        root and applies only there. Personal <code>~/.claude/CLAUDE.md</code>
        applies across every project. Put preferences there (commit style, how
        you like to be addressed, verbosity preference) — don't pollute the
        project file with those.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="claudeignore" title=".claudeignore">
      <DocsProse>
        <p>
          Exactly what it sounds like: <code>.gitignore</code> for Claude. Files
          and directories listed here are invisible to file-reading and
          searching tools. Without one, Claude happily reads 400MB of
          <code>node_modules</code> tree when you ask "what does this project
          use" — consuming context and slowing every command.
        </p>
      </DocsProse>

      <DocsCodeBlock
        title=".claudeignore"
        code="# Dependencies
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
**/generated/"
      />

      <DocsCallout
        variant="success"
        title="This is the single highest-leverage setup step"
      >
        For most projects, adding a thoughtful <code>.claudeignore</code>
        produces more context savings than any CLAUDE.md optimization. Do this
        on day one.
      </DocsCallout>
    </DocsSection>

    <DocsSection id="config" title="Configuration Layers">
      <DocsProse>
        <p>
          Claude Code reads configuration from four places. Each overrides the
          one above it, so the most specific wins.
        </p>
      </DocsProse>

      <DocsProse>
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Location</th>
              <th>What goes here</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>User defaults</td>
              <td><code>~/.claude/settings.json</code></td>
              <td>
                Your preferences across all projects — theme, default model,
                personal hooks, personal MCP servers
              </td>
            </tr>
            <tr>
              <td>Project settings</td>
              <td><code>.claude/settings.json</code></td>
              <td>
                Project rules the whole team shares — permissions,
                project-specific hooks, MCP servers
              </td>
            </tr>
            <tr>
              <td>Project local</td>
              <td><code>.claude/settings.local.json</code></td>
              <td>
                Your local overrides for this project — gitignored, not shared
              </td>
            </tr>
            <tr>
              <td>CLI flags / env vars</td>
              <td>on the command line</td>
              <td>
                One-off overrides: <code>--model opus</code>,
                <code>DEBUG=true claude</code>
              </td>
            </tr>
          </tbody>
        </table>
      </DocsProse>

      <DocsCodeBlock
        title=".claude/settings.json"
        code='{
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
}'
      />

      <DocsCallout variant="info" title="Check it in">
        <code>.claude/settings.json</code> should be committed. It encodes how
        your team agrees Claude should behave on this project. Put personal
        adjustments in <code>settings.local.json</code> (gitignored).
      </DocsCallout>
    </DocsSection>

    <DocsSection id="models" title="Models">
      <DocsProse>
        <p>
          Claude Code supports three model tiers. Knowing when to reach for each
          is worth 40% on your bill.
        </p>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Sweet spot</th>
              <th>Avoid for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Opus 4.7</strong></td>
              <td>
                Architecture decisions, security reviews, multi-file refactors,
                ambiguous problems
              </td>
              <td>Rote work — it's expensive, and Sonnet handles it fine</td>
            </tr>
            <tr>
              <td><strong>Sonnet 4.6</strong></td>
              <td>
                Day-to-day implementation, bug fixes, feature work, test writing
              </td>
              <td>Novel architectural calls where judgment matters</td>
            </tr>
            <tr>
              <td><strong>Haiku 4.5</strong></td>
              <td>
                Fast exploration, linting, simple transformations, subagent
                tasks
              </td>
              <td>Anything requiring judgment on tradeoffs</td>
            </tr>
          </tbody>
        </table>
      </DocsProse>

      <DocsCallout variant="tip" title="The hybrid pattern">
        Use Opus for the <strong>plan</strong> and Sonnet for the
        <strong>implementation</strong>. Opus makes the architectural calls in
        Plan Mode (cheap — just text), then you switch to Sonnet with
        <code>/model sonnet</code> for the execution phase. You get Opus-level
        judgment at Sonnet-level cost.
      </DocsCallout>

      <DocsProse>
        <p>
          Default model depends on your plan. Free users get Haiku. Pro gets
          Sonnet. Max gets Opus by default. You can always switch mid-session
          with <code>/model</code>.
        </p>
      </DocsProse>
    </DocsSection>

    <DocsSection id="safety" title="Permissions & Safety">
      <DocsProse>
        <p>
          Claude Code ships with sandboxing enabled. By default, every tool call
          that could modify your system (shell commands, file writes) requires
          approval the first time Claude tries it in a session. This is slow but
          safe. As you gain confidence, tune the permissions.
        </p>
        <h3>The three permission modes</h3>
        <ul>
          <li>
            <strong>Ask</strong> (default) — Claude pauses and asks before
            running anything it hasn't run before
          </li>
          <li>
            <strong>Allowlist</strong> — you pre-approve patterns in
            <code>settings.json</code>; Claude proceeds without asking for those
          </li>
          <li>
            <strong>Skip all</strong> —
            <code>--dangerously-skip-permissions</code>; Claude never asks. Use
            only in isolated environments
          </li>
        </ul>
      </DocsProse>

      <DocsCallout
        variant="danger"
        title="--dangerously-skip-permissions is named that for a reason"
      >
        Never run it against your main development machine. Use it in
        containers, VMs, or dedicated worktrees — anywhere a bad
        <code>rm</code> wouldn't ruin your day. The Docker image and cloud
        sandbox surfaces enable it safely because blast radius is contained.
      </DocsCallout>

      <DocsProse>
        <h3>The allow / deny / ask lists</h3>
        <p>
          In <code>.claude/settings.json</code> you can pre-approve or pre-block
          patterns. A good starting set for most projects:
        </p>
      </DocsProse>

      <DocsCodeBlock
        title="settings.json permissions"
        code='{
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
}'
      />

      <DocsCallout variant="tip" title="Let experience shape it">
        Start strict — only pre-approve read-only tools. Each time a safe
        command gets prompted and you approve it, consider whether it belongs in
        <code>allow</code>. After a week, your permissions are shaped to how you
        actually work, and you almost never see prompts.
      </DocsCallout>
    </DocsSection>

    <DocsPageNav :next="{ title: 'Workflows', path: '/workflows' }" />
  </article>
</template>

<script setup lang="ts">
import { BookOpen } from "@lucide/vue";
import type { TocItem } from "~/utils/types/nav";

const seoTitle = "Foundations — Mental Model & Setup for Claude Code";
const seoDescription =
  "The mindset shift, how the Claude Code harness works, the context window, setup, CLAUDE.md, .claudeignore, configuration layers, models, and permissions — everything you need before writing your first prompt.";

const { url, image } = useSeo({
  title: seoTitle,
  description: seoDescription,
  path: "/foundations",
  type: "article",
  keywords: [
    "claude code foundations",
    "claude md",
    "claudeignore",
    "context window",
    "claude code setup",
    "claude models",
    "permissions",
    "mental model",
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
            proficiencyLevel: "Beginner",
            timeRequired: "PT25M",
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
                name: "Foundations",
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
  { id: "mental-model", title: "The Mental Model Shift", level: 2 },
  { id: "how-it-works", title: "How Claude Code Works", level: 2 },
  { id: "context-window", title: "The Context Window", level: 2 },
  { id: "setup", title: "Setup & Installation", level: 2 },
  { id: "claude-md", title: "CLAUDE.md Deep Dive", level: 2 },
  { id: "claudeignore", title: ".claudeignore", level: 2 },
  { id: "config", title: "Configuration Layers", level: 2 },
  { id: "models", title: "Models", level: 2 },
  { id: "safety", title: "Permissions & Safety", level: 2 },
];

onMounted(() => setItems(tocItems));
onBeforeUnmount(() => setItems([]));
</script>
