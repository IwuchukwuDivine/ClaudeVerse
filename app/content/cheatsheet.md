---
title: Cheatsheet
eyebrow: The whole guide, on one page
accent: cheatsheet
icon: LucideKeyboard
description: Slash commands, keyboard shortcuts, CLI flags, file structure, and battle-tested patterns — the one-page reference you'll actually paste above your monitor.
estReadTime: 8 min
lastUpdated: 2026-04-24
tocItems:
  - { id: commands, title: Slash Commands, level: 2 }
  - { id: shortcuts, title: Keyboard Shortcuts, level: 2 }
  - { id: flags, title: CLI Flags, level: 2 }
  - { id: files, title: File Structure, level: 2 }
  - { id: patterns, title: Patterns, level: 2 }
prev: { title: Workshops, path: /workshops }
seo:
  title: Cheatsheet — One-Page Claude Code Reference
  description: "The one-page Claude Code reference: slash commands, keyboard shortcuts, CLI flags, file locations, model routing rules, token budgets, and the patterns you want within arm's reach."
  keywords:
    - claude code cheatsheet
    - claude code shortcuts
    - slash commands
    - claude code cli flags
    - claude code reference
    - claude code quick start
    - model routing
    - claude code patterns
  proficiencyLevel: All Levels
  timeRequired: PT8M
---

Everything from the rest of the guide, condensed to what you'll actually look up in a running session. Skim it once end to end, then treat it as a map: you'll know where to jump for the exact flag, command, or ratio you need.

:::docs-callout{variant="tip" title="Print this page"}
This page is designed to print cleanly. `Cmd+P` → single column → fits on two sides of A4. The first side covers commands, shortcuts, and flags; the second side covers file layout and patterns. Most teams I've seen get real value out of taping side one above their monitor for the first month.
:::

::::docs-section{id="commands" title="Slash Commands"}
Type `/` in any session to get autocomplete. Everything below is built in — custom commands live in `.claude/commands/` (project) or `~/.claude/commands/` (personal).

### Session control

| Command | What it does |
|---|---|
| `/help` | List every command available, built-in and custom |
| `/clear` | Reset the conversation. Context window → empty. Use before a new task. |
| `/compact [instruction]` | Summarize conversation so far, keep the summary, drop the detail. Optional instruction steers what gets preserved. |
| `/context` | Breakdown of what's loaded: system prompt, CLAUDE.md, tools, conversation. |
| `/cost` | Tokens spent and dollars burned in the current session. |
| `/status` | Model in use, permission mode, connected MCP servers, active hooks. |
| `/resume` | Pick a past session from a list and pick up where it ended. |
| `/exit` (or `/quit`) | End the session cleanly. |

### Configuration

| Command | What it does |
|---|---|
| `/init` | Scaffold a `CLAUDE.md` in the current repo. Claude reads the codebase and writes a first draft. |
| `/memory` | Open any `CLAUDE.md` (project, personal, parent) in your editor. |
| `/config` | Open the settings UI — model, theme, notifications, telemetry. |
| `/permissions` | View/edit the allow, ask, deny lists. Cheaper than opening settings.json by hand. |
| `/model` | Swap models mid-session (Opus ↔ Sonnet ↔ Haiku). |
| `/agents` | Manage subagent definitions at `.claude/agents/` and `~/.claude/agents/`. |
| `/mcp` | List every connected MCP server, with status and exposed tools. |
| `/hooks` | List every registered hook with matcher and command. |

### Operational

| Command | What it does |
|---|---|
| `/review` | Code review pass on the current diff. |
| `/doctor` | Diagnose setup issues — auth, network, MCP, installer location. |
| `/migrate-installer` | Move a global npm install to the local-managed installer. |
| `/bug` | Open a GitHub issue pre-filled with session metadata. |
| `/login` / `/logout` | Re-auth or sign out. |

:::docs-callout{variant="info" title="The inline prefixes"}
Three characters change the _meaning_ of what you type, not just the tool:

- `@` — reference a file or folder. `@src/auth.ts` pastes the path and loads it into context.
- `#` — add to memory. `# never use any as a type` appends to `CLAUDE.md`.
- `!` — shell mode. `!git status` runs the command inline; Claude sees the output but doesn't re-enter it.
:::
::::

::::docs-section{id="shortcuts" title="Keyboard Shortcuts"}
Inside the Claude CLI — not your terminal emulator's shortcuts. These are muscle memory worth building.

### Modes and interruption

| Keys | What it does |
|---|---|
| `Shift + Tab` | Cycle: normal → auto-accept edits → plan mode → normal |
| `Esc` | Interrupt Claude's current action (stop streaming, cancel tool call) |
| `Esc` × 2 | Jump back to a previous turn and edit from there |
| `Ctrl + C` × 2 | Hard exit the session |
| `Ctrl + D` | Exit when the input buffer is empty |

### Input

| Keys | What it does |
|---|---|
| `↑` / `↓` | Cycle through your recent prompts |
| `Ctrl + R` | Reverse-search your prompt history |
| `\` + `Enter` | Insert a newline mid-prompt (so Enter sends) |
| `Option + Enter` (mac) / `Alt + Enter` (linux) | Alternative newline |
| `Tab` | Autocomplete commands, file paths, and `@`-mentions |
| `Cmd + V` / `Ctrl + V` | Paste; images paste inline on macOS terminals that support it |

### Useful to remember

| Combo | Context |
|---|---|
| `!` → `Enter` | Drop into shell mode for a single command |
| `#` → free text | Append that text to `CLAUDE.md` |
| `/` → autocomplete | Fastest way to discover commands you haven't used |
| `Shift + Tab` × 2 | The one to remember: activates Plan Mode |

:::docs-callout{variant="tip" title="If nothing works"}
If shortcuts misbehave, it's almost always your terminal eating the key. iTerm2, Warp, and Alacritty all work out of the box. VS Code's integrated terminal sometimes swallows `Shift + Tab` — use an external terminal for heavy work.
:::
::::

::::docs-section{id="flags" title="CLI Flags"}
Everything you can pass to `claude` on the command line. The headless and scripted usages live here.

### Starting a session

```bash
claude                           # interactive, fresh session
claude -c                        # continue the last session
claude -r                        # resume — pick from a list
claude --resume <session-id>     # resume a specific session
claude "review my latest diff"   # interactive, with a first prompt already set
```

### Headless / one-shot (`-p`)

```bash
claude -p "summarize README.md"                       # one-shot, prints result, exits
claude -p "..." --output-format json                  # structured output for scripts
claude -p "..." --output-format stream-json           # streaming events (assistant/tool)
claude -p "..." --input-format stream-json            # accept streamed JSON on stdin
claude -p "..." --include-partial-messages            # include partial chunks in stream
claude -p "..." --max-turns 3                         # hard cap on agentic loops
echo "prompt" | claude -p                             # stdin works too
```

### Model and context

| Flag | Effect |
|---|---|
| `--model opus\|sonnet\|haiku` | Pick the model for this run |
| `--fallback-model sonnet` | Fallback if the primary is overloaded |
| `--add-dir <path>` | Add another working directory Claude can read/edit |
| `--append-system-prompt "..."` | Glue extra instructions onto the system prompt |
| `--setting-sources user,project,local` | Choose which settings layers load |
| `--session-id <uuid>` | Use/create a session with a specific UUID |
| `--agents '{"reviewer":{...}}'` | Inject agent definitions as JSON inline |

### Permissions and safety

| Flag | Effect |
|---|---|
| `--permission-mode default\|acceptEdits\|plan\|bypassPermissions` | Start the session in a given mode |
| `--allowed-tools "Read,Grep,Bash(npm test*)"` | Allow only these tools |
| `--disallowed-tools "Bash(git push*)"` | Block these tools outright |
| `--permission-prompt-tool <mcpTool>` | Route permission prompts through an MCP tool |
| `--dangerously-skip-permissions` | No prompts at all. Sandbox-only. Do not use on your main machine. |

### MCP and plugins

```bash
claude --mcp-config ./.mcp.json               # load MCP servers from a file
claude --strict-mcp-config                    # ignore all other MCP sources
claude --plugin <name>                        # load a plugin
```

### Subcommands

```bash
claude config get <key>                       # read a setting
claude config set <key> <value>               # write a setting
claude config set -g theme dark               # global setting
claude mcp add <name> -- <cmd>                # register an MCP server
claude mcp list                               # list registered servers
claude mcp remove <name>                      # deregister
claude update                                 # self-update the CLI
claude migrate-installer                      # move from global npm to managed installer
claude doctor                                 # diagnose the install
claude --version                              # print version
claude --help                                 # full flag reference
```

:::docs-callout{variant="warning" title="The two flags to be careful with"}
- `--dangerously-skip-permissions` — exactly what it says. Use it only inside a disposable container or sandbox. On a real developer box, something is eventually going to run that you didn't want to.
- `--output-format stream-json` + shell pipes — parse the JSON. Do not grep for words inside tool-call results. The schema changes; strings don't.
:::
::::

::::docs-section{id="files" title="File Structure"}
Everywhere Claude Code reads from and writes to. If something is misbehaving, the fix is almost always in one of these files.

### Personal (follows you across repos)

```text [~/.claude/]
~/.claude/
├── CLAUDE.md              # your cross-project preferences (style, verbosity, habits)
├── settings.json          # personal defaults: model, theme, telemetry, hooks
├── commands/              # personal slash commands, available everywhere
│   └── *.md
├── agents/                # personal subagent definitions
│   └── *.md
├── plugins/               # installed plugins
├── projects/              # one folder per repo you've used; sessions live here
├── todos/                 # in-flight task state
├── statsig/               # feature-flag cache
└── shell-snapshots/       # per-session shell env capture
```

### Project (committed or .gitignored per team preference)

```text [project root]
<repo>/
├── CLAUDE.md                    # the project's shared context (commit this)
├── AGENTS.md                    # multi-agent team charter (commit this)
├── .mcp.json                    # project-scoped MCP servers (commit this)
├── .claude/
│   ├── settings.json            # committed team defaults: model, hooks, permissions
│   ├── settings.local.json      # per-dev overrides (.gitignore this)
│   ├── commands/                # shared slash commands (commit)
│   │   └── <name>.md
│   ├── agents/                  # shared subagent specs (commit)
│   │   └── <name>.md
│   ├── hooks/                   # hook scripts referenced by settings.json
│   └── plan.md / impl-done.md   # ephemeral agent handoffs (.gitignore these)
└── src/
    └── <any subdir>/CLAUDE.md   # subtree-scoped context, loaded when Claude works here
```

### Settings precedence (last wins)

1. Enterprise managed policy (if any)
2. `~/.claude/settings.json`
3. `<repo>/.claude/settings.json`
4. `<repo>/.claude/settings.local.json`
5. Inline CLI flags (`--model`, `--allowed-tools`, etc.)

### Memory precedence (all loaded, merged top-to-bottom)

1. `~/.claude/CLAUDE.md` — your personal memory
2. Parent directory `CLAUDE.md` files — walked upward from CWD
3. `<repo>/CLAUDE.md` — the project memory
4. `<repo>/<subdir>/CLAUDE.md` — loaded when Claude works inside that subtree

:::docs-callout{variant="info" title=".claude/ and .gitignore"}
Never blanket-ignore `.claude/`. Commit `settings.json`, `commands/`, `agents/`, and `hooks/` — those are team artifacts. Ignore `settings.local.json`, `plan.md`, `impl-done.md`, `review.md`, and anything else generated mid-session. The split is worth setting up once:

```text [.gitignore]
.claude/settings.local.json
.claude/plan.md
.claude/impl-done.md
.claude/review.md
.claude/handoffs/
```
:::
::::

::::docs-section{id="patterns" title="Patterns"}
The shapes worth having in muscle memory — each one links back to the chapter that covers it in full.

### Workflow rhythms

| Pattern | When to reach for it | Full chapter |
|---|---|---|
| **Explore → Plan → Execute → Verify** | Every non-trivial change | [Workflows](/workflows#four-phase) |
| **Plan Mode** | Anything touching more than one file | [Workflows](/workflows#plan-mode) |
| **The Big Prompt** | One shot at a large, well-shaped task | [Workflows](/workflows#big-prompt) |
| **Best of N** | High-stakes work where a second opinion is cheap | [Workflows](/workflows#best-of-n) |
| **Context Handoff** | End of day, switching tasks, hitting 70% context | [Workflows](/workflows#handoff) |

### Extension decisions — when to reach for each

| Layer | Use when |
|---|---|
| **CLAUDE.md** | The rule applies every session in this repo |
| **Slash command** | You re-type the same prompt shape more than 3× |
| **Skill** | Claude needs procedural know-how to do a recurring task |
| **Hook** | You want deterministic side effects (lint, audit, block) |
| **Subagent** | A task is self-contained and pollutes main context |
| **Agent team** | Different roles, persistent handoff files, human gates |
| **MCP** | Claude needs live data or actions outside this repo |

### Model routing — starting heuristic

| Model | Use for | Don't use for |
|---|---|---|
| **Haiku** | Classification, extraction, commit messages, log triage | Anything requiring a plan |
| **Sonnet** | Default. Feature work, reviews, single-file edits, most prompts | Multi-file architectural work |
| **Opus** | Architecture planning, debugging genuinely unknown territory, `AGENTS.md` authoring | Rote edits, anything you could have batched with a hook |

### Context budget traffic lights

| `/context` shows | State | Do |
|---|---|---|
| 0–50% | Green | Keep going |
| 50–70% | Yellow | Finish the logical unit, then consider `/compact` |
| 70–85% | Orange | Write a handoff, `/clear`, resume with the handoff |
| 85%+ | Red | Stop. Anything you do here is expensive and unreliable. |

### Permission shapes worth copying

```json [.claude/settings.json — baseline]
{
  "model": "sonnet",
  "permissions": {
    "allow": [
      "Read", "Glob", "Grep",
      "Bash(npm run lint)", "Bash(npm test*)",
      "Bash(git status)", "Bash(git diff*)", "Bash(git log*)"
    ],
    "ask": [
      "Write", "Edit",
      "Bash(git push*)", "Bash(git checkout*)"
    ],
    "deny": [
      "Read(./.env)", "Read(./.env.*)",
      "Bash(cat .env*)",
      "Bash(rm -rf*)",
      "Bash(git push --force*)",
      "Bash(curl* | bash)", "Bash(wget* | bash)"
    ]
  }
}
```

### Hook shapes worth copying

```json [PostToolUse lint fixer]
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

```json [PreToolUse shell audit]
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$(date -u +%FT%TZ) | $CLAUDE_TOOL_INPUT\" >> ~/.claude/bash-audit.log"
          }
        ]
      }
    ]
  }
}
```

### Prompt stems worth reusing

```text [explore-only]
Explore only — do not edit any files.
Read [paths]. Report: what exists, what surprised you, what's missing.
```

```text [plan phase]
Plan Mode. Produce a plan: files touched, functions changed, tests,
risks, ambiguities. Save to .claude/plan.md. Do not write any code.
```

```text [verify phase]
Run lint, typecheck, and tests. Then `git diff`. Tell me: does the diff
match the plan? List any divergence.
```

```text [handoff]
Write a handoff to .claude/handoff-[name].md:
1. What we were doing and why
2. What's done (with paths)
3. What's not done and why
4. The exact prompt to resume, ready to paste
5. Anything non-obvious that isn't in the files
```

:::docs-callout{variant="tip" title="The one rule"}
If something keeps breaking the same way twice, it belongs in a hook, a skill, a slash command, or `CLAUDE.md` — not in your next prompt. Every time you solve a recurring problem by retyping, you're losing the leverage the extension layers exist to give you.
:::
::::
