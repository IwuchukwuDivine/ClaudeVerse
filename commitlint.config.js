/**
 * commitlint rules for Claudeverse.
 *
 * Commits drive `app/content/changelog.md` via
 * `scripts/generate-changelog.mjs`, so the subject format is load-bearing.
 * See `CLAUDE.md` / `AGENTS.md` → "Commit conventions" for the human-facing
 * summary.
 *
 * Escapes below mirror the SKIP patterns in `scripts/generate-changelog.mjs`
 * so anything the generator already filters out also bypasses the linter.
 */
export default {
  extends: ["@commitlint/config-conventional"],
  ignores: [
    (message) => /^(wip|fixup!|squash!|merge)\b/i.test(message),
    (message) => /\[skip changelog\]/i.test(message),
  ],
  rules: {
    "subject-case": [
      2,
      "never",
      ["upper-case", "pascal-case", "start-case"],
    ],
    "body-max-line-length": [0, "always"],
    "footer-max-line-length": [0, "always"],
  },
};
