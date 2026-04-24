#!/usr/bin/env node
/**
 * Generates app/content/changelog.md from `git log`.
 * Run via the `predev` / `prebuild` npm hooks — do not edit the output by hand.
 *
 * Filters out merge commits, WIPs, and commits tagged `[skip changelog]`.
 * Conventional-commit prefixes (feat, fix, perf, ...) are mapped to user-facing
 * labels; anything else is passed through with the first letter capitalized.
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "../app/content/changelog.md");

const SKIP = [
  /^wip\b/i,
  /^fixup!/i,
  /^squash!/i,
  /\[skip changelog\]/i,
  /^merge /i,
];

const LABELS = {
  feat: "New",
  feature: "New",
  fix: "Fix",
  perf: "Performance",
  refactor: "Refactor",
  docs: "Docs",
  style: "Style",
  test: "Tests",
  build: "Build",
  ci: "CI",
  chore: "Chore",
  revert: "Revert",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const monthTitle = (ym) => {
  const [y, m] = ym.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
};

const formatDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1].slice(0, 3)} ${parseInt(d, 10)}, ${y}`;
};

const formatSubject = (subject) => {
  const match = subject.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/);
  if (match) {
    const [, type, scope, breaking, rest] = match;
    const label = LABELS[type.toLowerCase()] ?? capitalize(type);
    const scopePart = scope ? ` (${scope})` : "";
    const breakPart = breaking ? " ⚠" : "";
    return `**${label}${breakPart}**${scopePart} — ${capitalize(rest)}`;
  }
  return capitalize(subject);
};

const readCommits = () => {
  const raw = execSync(
    "git log --no-merges --pretty=format:%H%x09%ad%x09%s --date=short",
    { encoding: "utf8" },
  );
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, date, ...rest] = line.split("\t");
      return { hash, date, subject: rest.join("\t") };
    })
    .filter((c) => c.subject && c.subject.length >= 5)
    .filter((c) => !SKIP.some((re) => re.test(c.subject)));
};

const buildMarkdown = (commits) => {
  const byMonth = new Map();
  for (const c of commits) {
    const ym = c.date.slice(0, 7);
    if (!byMonth.has(ym)) byMonth.set(ym, []);
    byMonth.get(ym).push(c);
  }
  const months = [...byMonth.keys()].sort().reverse();

  const today = new Date().toISOString().slice(0, 10);
  const tocItems = months
    .map((ym) => `  - { id: "${ym}", title: ${monthTitle(ym)}, level: 2 }`)
    .join("\n");

  const frontmatter = `---
title: Changelog
eyebrow: What's new
accent: resources
icon: LucideHistory
description: Every change that's shipped to Claudeverse, newest first. Auto-generated from the git history on each build.
estReadTime: 3 min
lastUpdated: ${today}
tocItems:
${tocItems}
prev: { title: Cheatsheet, path: /cheatsheet }
seo:
  title: Changelog — Claudeverse
  description: "Every change shipped to Claudeverse, newest first — auto-generated from the git history on each build."
  keywords:
    - claudeverse changelog
    - claude code guide updates
    - what's new
  proficiencyLevel: All Levels
  timeRequired: PT3M
---
`;

  const intro = `
Welcome back. This is everything we've shipped to Claudeverse since the site went live, grouped by month, newest first. If you've been away a while, start at the top — anything new since your last visit is here.

`;

  const body = months
    .map((ym) => {
      const entries = byMonth.get(ym);
      const byDate = new Map();
      for (const c of entries) {
        if (!byDate.has(c.date)) byDate.set(c.date, []);
        byDate.get(c.date).push(c);
      }
      const dates = [...byDate.keys()].sort().reverse();
      const dateBlocks = dates
        .map((d) => {
          const lines = byDate
            .get(d)
            .map((c) => `- ${formatSubject(c.subject)}`)
            .join("\n");
          return `**${formatDate(d)}**\n\n${lines}`;
        })
        .join("\n\n");
      return `::::docs-section{id="${ym}" title="${monthTitle(ym)}"}\n\n${dateBlocks}\n\n::::`;
    })
    .join("\n\n");

  return `${frontmatter}${intro}${body}\n`;
};

const main = () => {
  try {
    const commits = readCommits();
    if (commits.length === 0) {
      console.warn("[changelog] no commits found — writing placeholder");
      writeFileSync(
        OUTPUT,
        `---
title: Changelog
eyebrow: What's new
accent: resources
icon: LucideHistory
description: Every change that's shipped to Claudeverse, newest first.
estReadTime: 1 min
lastUpdated: ${new Date().toISOString().slice(0, 10)}
prev: { title: Cheatsheet, path: /cheatsheet }
---

Nothing to show yet.
`,
      );
      return;
    }
    const md = buildMarkdown(commits);
    mkdirSync(dirname(OUTPUT), { recursive: true });
    writeFileSync(OUTPUT, md);
    const months = new Set(commits.map((c) => c.date.slice(0, 7))).size;
    console.log(
      `[changelog] wrote ${commits.length} commits across ${months} month(s) to ${OUTPUT}`,
    );
  } catch (err) {
    console.error("[changelog] generation failed:", err.message);
    process.exit(1);
  }
};

main();
