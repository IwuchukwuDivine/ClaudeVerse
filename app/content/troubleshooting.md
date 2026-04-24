---
title: Troubleshooting
eyebrow: When things break
accent: troubleshooting
icon: LucideLifeBuoy
description: The seven failures you'll hit most — invisible files, out-of-context errors, silent hooks, MCP servers that won't start, runaway tokens, rate limits, and auth loops — with the exact fix for each.
estReadTime: 10 min
tocItems:
  - { id: missing-file, title: Claude Can't See My File, level: 2 }
  - { id: out-of-context, title: Out of Context Errors, level: 2 }
  - { id: hook, title: Hook Didn't Fire, level: 2 }
  - { id: mcp, title: MCP Won't Connect, level: 2 }
  - { id: tokens, title: Tokens Exploding, level: 2 }
  - { id: rate-limits, title: Rate Limits, level: 2 }
  - { id: auth, title: Auth & Login Issues, level: 2 }
prev: { title: Recipes, path: /recipes }
next: { title: Resources, path: /resources }
seo:
  title: Troubleshooting — Fixing Claude Code When It Breaks
  description: "Concrete fixes for the most common Claude Code failures: invisible files, context blow-ups, hooks that don't fire, MCP server failures, runaway token bills, rate limits, and authentication issues."
  keywords:
    - claude code troubleshooting
    - claude code errors
    - mcp server debug
    - claudeignore
    - hook didnt fire
    - rate limit
    - token spike
    - claude code login
  proficiencyLevel: Intermediate
  timeRequired: PT10M
---

This chapter is organized by symptom, not by cause. You landed here because something is broken — find the heading that matches what you're seeing, read the "likely cause" list in order (most common first), and apply the fix. Most of these take under two minutes once you know where to look.

::::docs-section{id="missing-file" title="Claude Can't See My File"}
**Symptom** — Claude says a file doesn't exist, or reads an old version, or claims a folder is empty when you can see files in your editor.

### Likely causes (check in this order)

1. **Claude's cwd isn't where you think it is.** Subagents especially start with their own cwd. This is the #1 cause.
2. **`.claudeignore` is hiding the file.** Same behavior as `.gitignore` — if it matches, Claude can't see it.
3. **Wrong path or case mismatch.** `components/Button.tsx` vs `components/button.tsx` — macOS forgives, Linux doesn't.
4. **Git worktree confusion.** You opened Claude from `../repo-feat` but keep giving it paths from `../repo`.
5. **File type excluded.** Very large files, binaries, and some lock files are skipped silently.

### Fix

```text [diagnostic prompt]
Before you look for the file, run:
  1. pwd
  2. ls -la
  3. cat .claudeignore 2>/dev/null | head -40
  4. git worktree list

Then tell me where you think the file is and where you actually are.
```

If `.claudeignore` is the culprit, either remove the pattern or point Claude to the absolute path (ignore rules still apply to globs, but an explicit `Read` of an absolute path works in most setups).

### Prevention

Keep `.claudeignore` as the first thing you set up per [Foundations → .claudeignore](/foundations#claudeignore) — the 30-second investment prevents a full category of "it's missing" confusion.
::::

::::docs-section{id="out-of-context" title="Out of Context Errors"}
**Symptom** — "conversation too long" error, sudden refusals that feel off, Claude forgets instructions from earlier, or `/context` shows 80%+.

### Likely causes

1. **You've crossed the 200K ceiling.** Hard limit. The request can't be sent.
2. **You're above 80% and performance is degrading.** Not yet an error — but the next prompt might be.
3. **A tool dumped a huge blob into context.** A file read, a `curl` output, a log that streamed thousands of lines.
4. **A subagent returned a massive summary.** Subagents should summarize to ~2K. Sometimes they don't.

### Fix (in order of escalation)

```text [fix 1 — free up headroom immediately]
/context       # see the breakdown
/compact       # compresses conversation history (see the warning below)
```

```text [fix 2 — hand off to a fresh session]
Before I /clear, write .claude/handoff.md with:
  - Current status (done / not done)
  - The next concrete step
  - Open questions
  - Exact commands to resume
Keep it under 40 lines.
```

Then `/clear`, start a new session, and open the handoff. See [Workflows → Context Handoff](/workflows#handoff) for the full pattern.

```text [fix 3 — prevent the next one]
# Set the StatusLine to show your context percentage
# See Foundations → The Context Window for the settings.json snippet.
```

:::docs-callout{variant="warning" title="/compact is not a free lunch"}
`/compact` rewrites your history into a summary. Useful, but Claude loses the literal turns — the exact prompt wording, the exact tool outputs. For anything where detail matters (bugfix traces, mid-review conversations), a handoff doc beats `/compact`. See [Workflows → Session Management](/workflows#sessions).
:::
::::

::::docs-section{id="hook" title="Hook Didn't Fire"}
**Symptom** — You wrote a hook in `.claude/settings.json`. Claude does the trigger action. Nothing happens. No error, no log, nothing.

### Likely causes

1. **Settings file isn't loaded.** Wrong path (`.claude/settings.local.json` vs `settings.json`), or JSON syntax error that silently invalidates the file.
2. **Matcher doesn't match.** `"Edit|Write"` matches literally — if you meant to catch `MultiEdit`, add it explicitly.
3. **Wrong event name.** `PostToolUse` ≠ `postToolUse`. Case-sensitive.
4. **Command fails silently.** Hook command exits non-zero before doing anything visible.
5. **Timeout too short.** Hook takes 15 seconds, default timeout kills it at 10.

### Fix — the two-line diagnostic hook

Add this to `.claude/settings.json` first. It proves the hook plumbing works, separate from whatever your real hook is trying to do.

```json [.claude/settings.json]
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[hook] $(date) fired on $(echo \\\"$CLAUDE_TOOL_NAME\\\")\" >> /tmp/claude-hook.log",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Trigger an edit. Then:

```bash
tail -f /tmp/claude-hook.log
```

- **Log appears with every edit** → plumbing works, your real hook has a bug inside it.
- **Log is empty** → the settings aren't being loaded. Validate JSON: `jq . .claude/settings.json`. Confirm the file path.

### Prevention

Always end real hook commands with an explicit exit code and an `echo` you can grep for. A hook that fails silently is worse than no hook — you'll trust a gate that isn't there. See [Extensions → Hooks](/extensions#hooks).
::::

::::docs-section{id="mcp" title="MCP Won't Connect"}
**Symptom** — MCP tools don't appear in Claude's tool list. Or `claude mcp list` shows the server as failed. Or you get a timeout when Claude tries to call an MCP tool.

### Likely causes

1. **The command can't be found.** `npx -y …` is usually fine, but `python -m something` fails if you're in the wrong venv.
2. **Env var interpolation wrong.** `"${env:API_KEY}"` requires the env var to be set in the parent shell before `claude` starts.
3. **Package not installed yet.** First `npx -y` run downloads; it can exceed the startup timeout.
4. **STDIO vs HTTP confusion.** Server is built for one transport, you configured the other.
5. **Working directory mismatch.** Server uses relative paths; Claude starts it from a different cwd than you tested.

### Fix — run the server manually first

```bash [reproduce outside claude]
# Grab the exact command from .mcp.json
cat .mcp.json | jq '.mcpServers["<server-name>"]'

# Run it yourself, in the same shell you start `claude` from
npx -y @modelcontextprotocol/server-postgres postgresql://localhost:5432/dev
```

If the manual run prints errors, fix those — Claude was swallowing them. If the manual run works but Claude still fails:

```bash [ask claude to test it]
claude mcp list         # see status
claude mcp test <name>  # invoke a no-op call (if supported in your version)
```

### Common env-var fix

```json [.mcp.json — explicit env]
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-linear"],
      "env": {
        "LINEAR_API_KEY": "${env:LINEAR_API_KEY}"
      }
    }
  }
}
```

Make sure `LINEAR_API_KEY` is exported in your shell before running `claude`. `.env` files loaded by your app are _not_ automatically visible to Claude.

### Prevention

When you add a new MCP server, always test it in a scratch shell before wiring it in. The 10 seconds of `npx -y <server>` saves 20 minutes of "why isn't this working."
::::

::::docs-section{id="tokens" title="Tokens Exploding"}
**Symptom** — `/cost` shows a number that makes you wince. Your monthly bill is 3× what you expected. A single feature cost more than a whole week should.

### Likely causes

1. **No `.claudeignore`.** Claude is reading `node_modules/`, `dist/`, `.next/`, build outputs — tens of thousands of tokens per session of pure noise.
2. **`CLAUDE.md` is 15K tokens.** It loads _every session_, so every session pays the tax before you've typed anything.
3. **Tool loop.** Claude called the same thing 40 times because each result pointed back to the same missing dependency.
4. **Huge file reads.** A single `Read` on a 5K-line file is 15K tokens. Multiply by 10 reads.
5. **Runaway subagents.** Subagents doing deep exploration with no budget.
6. **Sonnet/Opus for work Haiku could do.** Routing decisions compound — see [Tokens → Model Routing](/tokens#routing).

### Fix — the 5-minute audit

```text [diagnostic]
/context   # see the breakdown — system prompt, CLAUDE.md, tools, files, convo
/cost      # total tokens used this session + $ spent
```

Look at `/context`:

- **System + tools > 50K** → you have too many MCP servers loaded or too many hooks.
- **CLAUDE.md > 5K** → put it on a diet. See [Tokens → CLAUDE.md Diet](/tokens#diet).
- **Conversation > 100K** → you're in a marathon session; hand off per [Workflows → Context Handoff](/workflows#handoff).
- **Files > 30K and you didn't ask for that** → missing `.claudeignore`.

### The three highest-leverage fixes

1. Add a `.claudeignore` with `node_modules/`, `dist/`, build artifacts, `.git/` contents, `.cache/`. Recovers 20–40K tokens in most repos.
2. Halve your `CLAUDE.md`. Every token there pays interest on every session.
3. Route routine tasks to Haiku. Subagents especially.

See [Tokens → The 3 Fixes](/tokens#three-fixes) for the full version.

:::docs-callout{variant="tip" title="The 24-hour rule"}
If a CLAUDE.md entry hasn't saved you from a mistake in the last 24 hours of work, it's probably not worth its tokens. Audit quarterly.
:::
::::

::::docs-section{id="rate-limits" title="Rate Limits"}
**Symptom** — `429` errors, "please slow down" messages, or requests hanging and then failing. Happens most often when multiple parallel agents fire at once.

### Likely causes

1. **Your plan's per-minute or daily limit.** Pro / Team / Enterprise all have different caps. Team accounts are pooled.
2. **Burst parallelism.** Three worktrees firing Best-of-N simultaneously → nine concurrent Claude calls → 429.
3. **An MCP or hook is hammering the API.** Not you directly — a hook that calls Claude on every file edit.
4. **Model tier.** Opus has stricter per-minute caps than Sonnet or Haiku.

### Fix — in order

```bash [check your plan]
# The dashboard is the source of truth
open https://console.anthropic.com/usage
```

Then, depending on cause:

- **Parallel agents burst** → serialize them. Run three agents in sequence via a shell loop instead of three terminals at once.
- **One Opus agent** → drop it to Sonnet. Most work doesn't need Opus.
- **Recurring hook** → check if the hook is calling Claude. If so, either disable it during intensive sessions or give it its own lower-tier model.

### Programmatic backoff

If you're driving Claude via the SDK or a script, implement exponential backoff — not a tight retry loop, which just makes the 429 worse.

```python [backoff sketch]
import time, random
for attempt in range(5):
    try:
        return client.messages.create(...)
    except anthropic.RateLimitError:
        wait = (2 ** attempt) + random.random()
        time.sleep(wait)
raise RuntimeError("rate limited 5× in a row")
```

### Prevention

If you're running agent teams, put a concurrency cap on the orchestrator: no more than N parallel agents at once, where N is the sustainable limit for your plan. Two is fine for most plans; five is where things get tight; ten and you'll burn through limits inside an hour.
::::

::::docs-section{id="auth" title="Auth & Login Issues"}
**Symptom** — `401 unauthorized`, "token expired," login redirect loop in the browser, or `claude` starts but can't call the model.

### Likely causes

1. **OAuth token expired.** Most common for users on the Pro/Team plans.
2. **Stale API key.** Rotated on the dashboard, `.env` or shell not updated.
3. **Two auth sources conflicting.** `ANTHROPIC_API_KEY` in your env _and_ an OAuth session — Claude picks one, and it might be the wrong one.
4. **Wrong account.** You logged into the personal account; the repo expects the work account.
5. **Corporate VPN / proxy.** Blocks the OAuth redirect or the API calls.

### Fix — the reset sequence

```bash [nuclear option, usually works]
claude /logout       # clears the cached OAuth token
# clear any stale env vars in the current shell
unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN
claude /login        # fresh browser auth
```

If you're using an API key (not OAuth):

```bash [verify the key works]
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-haiku-4-5-20251001","max_tokens":10,"messages":[{"role":"user","content":"ping"}]}'
```

- **200 OK** → key works. The problem is in your `claude` config, not the key.
- **401** → key is wrong or rotated. Generate a fresh one in the console.
- **403** → key is right, but your account/plan doesn't allow that model.

### When two auth sources conflict

Check what's set:

```bash
env | grep -i anthropic
```

If both `ANTHROPIC_API_KEY` and an OAuth session exist, `claude` typically prefers the API key. If you want OAuth to win, `unset ANTHROPIC_API_KEY` — or explicitly tell Claude which auth mode to use via its config.

### Corporate networks

If the browser-based login never redirects back, you're likely behind a proxy stripping the OAuth callback. Workarounds:

- Use an API key instead of OAuth (bypasses the redirect entirely).
- Add `api.anthropic.com` and `claude.ai` to your proxy allowlist.
- Authenticate from a non-corporate network once, then move back — tokens persist locally.

:::docs-callout{variant="info" title="If none of the above fixes it"}
`claude doctor` dumps the full diagnostic: which auth source is active, which config files are loaded, which env vars are set, what version of Claude Code you're on. Run it first when in doubt — it's faster than guessing.
:::
::::
