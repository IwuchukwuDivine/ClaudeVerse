# Agent instructions — Claudeverse

This is the shared instruction file for any AI agent working in this repo (Cursor, Claude Code, Codex, etc.). For the full project context, stack, and patterns see `CLAUDE.md`. The rules below are the ones that matter regardless of which agent is driving.

## Commit conventions

Every commit feeds `app/content/changelog.md` via `scripts/generate-changelog.mjs`, which runs on every `predev` and `prebuild`. Write commits in the Conventional Commits format:
<type>(<optional scope>)<!>: <imperative subject>
**Types with labeled changelog entries**
| Type | Label | Type | Label |
|------|-------|------|-------|
| `feat` / `feature` | New | `docs` | Docs |
| `fix` | Fix | `style` | Style |
| `perf` | Performance | `test` | Tests |
| `refactor` | Refactor | `build` | Build |
| `chore` | Chore | `ci` | CI |
| `revert` | Revert | | |
Anything else passes through with the first letter capitalized.
**Excluded from the changelog**

- Subjects starting with `wip`, `fixup!`, `squash!`, or `merge`
- Any subject containing `[skip changelog]`
  **Breaking changes** — suffix the type with `!` (e.g. `feat!: drop Pinia`). The entry is marked with ⚠.
  **Examples**
