---
title: Evals
eyebrow: Test your agents
accent: evals
icon: LucideFlaskConical
description: Why evals matter, golden datasets, LLM-as-judge, regression suites, Anthropic's eval tooling, CI integration, and the real cost of testing agent output.
estReadTime: 20 min
tocItems:
  - { id: why, title: Why Evals Matter, level: 2 }
  - { id: golden, title: Golden Datasets, level: 2 }
  - { id: judge, title: LLM-as-Judge, level: 2 }
  - { id: regression, title: Regression Suites, level: 2 }
  - { id: sdk, title: Anthropic's Eval Tooling, level: 2 }
  - { id: ci, title: Running in CI, level: 2 }
  - { id: cost, title: The Cost of Evals, level: 2 }
prev: { title: Orchestration, path: /orchestration }
next: { title: Recipes, path: /recipes }
seo:
  title: Evals — Testing Claude Code Agents
  description: "Why evals matter for agentic workflows: golden datasets, LLM-as-judge patterns, regression suites, Anthropic's eval tooling, CI integration, and the real token cost of testing agents in production."
  keywords:
    - claude code evals
    - llm as judge
    - golden dataset
    - agent regression tests
    - anthropic eval sdk
    - eval ci
    - agent testing
  proficiencyLevel: Advanced
  timeRequired: PT20M
---

Every other section of this guide is about making Claude _do_ something. This one is about knowing whether what it did was any good — and catching the moment it stops being good. If you're building anything that customers touch, that runs on a schedule, or that you'd be embarrassed to ship broken, evals stop being optional. They're the difference between "the demo worked once" and "this ships on Fridays."

::::docs-section{id="why" title="Why Evals Matter"}
Traditional tests assume determinism. Same input, same output, pass or fail. Agents don't work like that. Same prompt, same model, same tools — you'll get three slightly different answers across three runs, and _all three can be acceptable_. Unit tests can't express "acceptable." Evals can.

The failure mode evals catch isn't "does it crash." It's "does it still do the thing I hired it for." A refactoring subagent that used to produce clean diffs and now sprinkles console.logs doesn't throw an error. CI is green. Production is quietly getting worse. Only an eval suite notices.

:::docs-callout{variant="warning" title="The silent regression"}
Prompt changes are the most common cause. You edit a system prompt to fix one edge case; three other cases you weren't watching get 5% worse. Without evals, you'll ship the trade and only learn about it from user complaints — at which point you won't remember which prompt change caused it.
:::

### What evals actually measure

Four axes cover most of what you'll care about:

- **Correctness** — did it produce the right answer? (Deterministic check: compare to a known-good output.)
- **Adherence** — did it follow the rules? (Heuristic check: "did it cite sources," "did it stay under 500 tokens," "did it refuse the off-topic prompt.")
- **Quality** — is the output _good_? (Subjective, best handled by [LLM-as-judge](#judge).)
- **Cost & latency** — did it do this efficiently? (Metric check: tokens in/out, wall time.)

A full eval suite touches all four. Most teams start with correctness and adherence, add quality once a judge is trustworthy, and layer cost/latency in last.
::::

::::docs-section{id="golden" title="Golden Datasets"}
A **golden dataset** is a set of inputs paired with outputs (or rubrics) you trust. It's the ground truth your agent gets graded against. The single biggest mistake people make is treating this like a massive research undertaking — "we need 10,000 labelled examples." You don't. You need **50 examples you actually trust**, and you should build them in an afternoon.

### Where the examples come from

- **Real production logs.** Export 200 recent runs, sample 50, hand-label what the right output _should have been_. These are the most valuable examples you'll ever write because they reflect real distribution.
- **Bug reports.** Every time Claude screws up a real task, the input + the correct output goes straight into the golden set. Your eval suite now regression-tests every bug you've ever fixed.
- **Edge cases you invented.** "What if the user types in all caps?" "What if the input is empty?" Useful, but don't let them outnumber production-derived cases.

### The minimum-viable schema

```jsonl [evals/golden/classify-intent.jsonl]
{"id":"001","input":"cancel my subscription","expected":{"intent":"cancel"},"notes":"clean case"}
{"id":"002","input":"change my card","expected":{"intent":"update_payment"},"notes":"from bug #412"}
{"id":"003","input":"i want out","expected":{"intent":"cancel"},"notes":"ambiguous phrasing"}
{"id":"004","input":"UPGRADE ME PLEASE","expected":{"intent":"upgrade"},"notes":"caps edge case"}
```

JSONL (one JSON object per line) is the right format: streamable, diff-friendly, every line is valid on its own. Check it into the repo next to the code it tests.

### When "expected" is a rubric, not a value

For open-ended tasks (code review, summarization, planning), you can't write the literal right answer. Instead, store the criteria:

```jsonl [evals/golden/code-review.jsonl]
{"id":"r01","input":{"diff_file":"fixtures/r01.diff"},"rubric":["must flag the SQL injection","must not flag the unrelated logging change","verdict must be one of LGTM|NeedsChanges"]}
```

The rubric becomes the prompt to your [LLM-as-judge](#judge). Now your golden set is small, high-signal, and grows naturally over time.

:::docs-callout{variant="tip" title="Start with 20 examples, not 200"}
Twenty hand-curated examples catch most regressions. The marginal example above 50 buys you less than the time it takes to label. Grow the set only when you find a failure class the current set doesn't cover.
:::
::::

::::docs-section{id="judge" title="LLM-as-Judge"}
For anything subjective — did the summary capture the key points, did the review catch the real issues, did the refactor stay faithful to intent — you need a judge. The judge is another Claude call whose only job is to grade the output under test against a rubric.

### The minimal judge

```python [evals/judge.py]
import anthropic
client = anthropic.Anthropic()

JUDGE_PROMPT = """You are a strict grader. Given the task, the rubric, and
the candidate output, return a JSON object:

{
  "pass": true | false,
  "score": 0..10,
  "reasoning": "<one-sentence>",
  "failed_criteria": ["<rubric item>", ...]
}

Do not wrap the JSON in prose. Output only the JSON.

TASK:
{task}

RUBRIC:
{rubric}

CANDIDATE OUTPUT:
{output}
"""

def judge(task: str, rubric: list[str], output: str) -> dict:
    msg = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": JUDGE_PROMPT.format(
                task=task,
                rubric="\n".join(f"- {r}" for r in rubric),
                output=output,
            ),
        }],
    )
    import json
    return json.loads(msg.content[0].text)
```

Haiku is plenty for most judging — the judge isn't writing, it's matching output against a rubric. Use Sonnet only when the subject matter is technical enough that Haiku's mistakes dominate your signal.

### Three patterns that actually work

- **Pointwise grading** — "does this output meet the rubric, yes/no, why?" Simple, cheap, noisy on its own. Run each example 3× and vote.
- **Pairwise comparison** — "given two candidate outputs, which is better and why?" Lower variance than pointwise, great for A/B-ing prompt changes. Slightly more expensive.
- **Reference comparison** — "how does the candidate compare to this known-good reference?" Best for cases where you have a golden output and want to measure drift.

### The pitfalls

- **Verbosity bias.** Judges default to preferring longer, more detailed answers even when concise is correct. Mitigate: explicitly tell the judge "prefer concise answers that meet the rubric; do not reward extra detail."
- **Position bias.** In pairwise, the first option wins more often than chance. Mitigate: flip the order on half your runs and average.
- **Same-family blindness.** A Claude judge can be lenient on Claude-flavored mistakes (hedging, preamble). Mitigate: vary judge models across runs, or add explicit rubric items for the failure modes you know.
- **Calibration drift.** A judge's "7/10" in March isn't the same as "7/10" in June — model updates shift the scale. Always re-score the _baseline_ every run; compare deltas, not absolute scores.

:::docs-callout{variant="info" title="Trust the judge only after it agrees with you"}
Before you rely on an LLM-as-judge, hand-grade 20 examples yourself. Run the judge on the same 20. If it agrees with you 90%+, ship it. If it's below 80%, fix the rubric — don't just average over more runs. A bad rubric doesn't improve with scale.
:::
::::

::::docs-section{id="regression" title="Regression Suites"}
A regression suite is a golden dataset + a runner + a baseline. On every prompt change, subagent edit, or model bump, you replay the whole set and compare scores to the baseline. If anything drops past a threshold, the change is blocked.

### The simplest runner that works

```python [evals/run.py]
import json, pathlib, statistics
from judge import judge
from your_agent import run_agent   # the thing you're evaluating

DATASET = pathlib.Path("evals/golden/code-review.jsonl")
BASELINE = pathlib.Path("evals/baseline.json")

def main():
    results = []
    for line in DATASET.read_text().splitlines():
        example = json.loads(line)
        output = run_agent(example["input"])
        verdict = judge(
            task="review the diff and return LGTM or NeedsChanges",
            rubric=example["rubric"],
            output=output,
        )
        results.append({
            "id": example["id"],
            "pass": verdict["pass"],
            "score": verdict["score"],
            "failed_criteria": verdict["failed_criteria"],
        })

    pass_rate = sum(1 for r in results if r["pass"]) / len(results)
    avg_score = statistics.mean(r["score"] for r in results)

    baseline = json.loads(BASELINE.read_text())
    print(f"pass rate: {pass_rate:.2%} (baseline {baseline['pass_rate']:.2%})")
    print(f"avg score: {avg_score:.2f} (baseline {baseline['avg_score']:.2f})")

    # Fail the run if we regressed more than 3pp on pass rate
    if pass_rate < baseline["pass_rate"] - 0.03:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
```

Fewer than 50 lines of Python handles 80% of what a "framework" would give you. Reach for a framework only when you've outgrown this.

### Non-determinism: noise vs signal

Run every example **N** times (N=3 is a reasonable default). Take the majority verdict. A single-run failure on a flaky example isn't a regression — a consistent failure on three of three is. This is the single most important rule in regression suites, and skipping it will make your CI scream at you every week for no reason.

```python [evals/run.py — with N reruns]
def run_with_votes(example, n=3):
    verdicts = [judge(...) for _ in range(n)]
    passes = sum(1 for v in verdicts if v["pass"])
    return passes >= (n // 2 + 1)  # majority
```

### Managing the baseline

The `baseline.json` file is checked into the repo. You regenerate it deliberately — not on every commit, but when you accept a new scoring regime (new rubric, new judge model, intended improvement). The regeneration is a PR of its own, reviewed like any other.

```bash [regenerate the baseline]
python evals/run.py --save-baseline
git add evals/baseline.json
git commit -m "evals: rebaseline after rubric v2"
```

:::docs-callout{variant="warning" title="Don't rebaseline to hide a regression"}
The temptation is real: the eval drops 4pp, the deadline is today, you rebaseline and ship. Do this twice and your suite stops being a regression suite — it's just a rubber stamp. Require a one-paragraph justification in every rebaseline commit. Future-you will thank you.
:::
::::

::::docs-section{id="sdk" title="Anthropic's Eval Tooling"}
Anthropic publishes two things that slot into this workflow, plus one you can build on.

### The Console evaluation feature

The Anthropic Console has a built-in eval workbench — upload a dataset, define a prompt, run variants, compare scores side-by-side. Good for prompt iteration before you've written any code. Less good once your eval is 200 examples and needs to run on every PR: at that point you want the logic in your repo, not a web UI.

Use the Console for: exploring new prompts, showing a PM what a change does, teaching a teammate the eval pattern.

Use your own runner for: CI gates, long-running suites, anything that needs to live next to your code.

### The cookbook patterns

The [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) repo has working examples for LLM-as-judge, pairwise comparison, and multi-criteria rubrics. These are reference implementations, not a library — copy the pattern into your repo and adapt it. Fighting a framework-ified version of this is rarely worth it.

### The Agent SDK for agent-level evals

If what you're evaluating is a full agent (tools, loops, sub-agents), the [Claude Agent SDK](https://docs.claude.com) lets you script end-to-end runs in Python or TypeScript. Your eval runner becomes: spin up an Agent SDK instance, feed it the input, let it run to completion, score the final output (and optionally the trace).

```python [evals/agent_run.py — sketch]
from claude_agent_sdk import Agent

async def run_agent(example):
    agent = Agent(
        system_prompt=open("prompts/reviewer.md").read(),
        tools=["Read", "Grep", "Bash(git diff*)"],
        model="claude-sonnet-4-6",
    )
    async with agent as a:
        result = await a.query(example["input"])
    return result.text
```

This is what you reach for when "run my agent" is more than a single `messages.create` call.

:::docs-callout{variant="info" title="The honest state in 2026"}
Anthropic has not shipped an all-in-one "eval SDK" as a first-class product — what's available is the Console feature, the cookbook patterns, and the Agent SDK. The 50-line Python runner in [Regression Suites](#regression) plus the Agent SDK for agent-level tests is the combo most teams converge on.
:::
::::

::::docs-section{id="ci" title="Running in CI"}
Local eval runs catch obvious regressions. CI eval runs catch the subtle ones — the ones where a teammate's PR looks fine in isolation and quietly drops pass rate by 4pp.

### A minimal GitHub Actions workflow

```yaml [.github/workflows/evals.yml]
name: evals
on:
  pull_request:
    paths:
      - "prompts/**"
      - ".claude/agents/**"
      - "evals/**"
      - "src/agent/**"
  schedule:
    - cron: "0 14 * * 1"  # Mondays, 14:00 UTC — full nightly-style run

jobs:
  run:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r evals/requirements.txt
      - run: python evals/run.py --mode=ci
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: eval-report
          path: evals/report.json
```

### Two modes: PR vs nightly

Run different slices depending on when the job fires:

- **PR mode** — a fast subset (20–30 examples, 1 run each). Blocks merge, needs to finish in under 5 minutes.
- **Nightly mode** — the full golden set (200+ examples, 3 runs each for majority vote). Posts results to a channel, doesn't block anything.

```python [evals/run.py — the mode flag]
if args.mode == "ci":
    examples = random.sample(all_examples, 30)
    reruns = 1
else:  # nightly
    examples = all_examples
    reruns = 3
```

### Handling flakes

Even with majority vote, evals flake. Build a **flake budget**: if a known-flaky example fails three weeks in a row, investigate; fewer than that, tolerate. The worst anti-pattern is making the CI pass by lowering the threshold every time it fails. That's not a passing CI — that's a disabled CI.

### The `evals:` label

Consider gating the full-suite run on a PR label. Day-to-day PRs run the fast subset; PRs that touch prompts or agents get `evals:full` and run everything. Keeps CI time reasonable and focuses tokens where regressions are likely.
::::

::::docs-section{id="cost" title="The Cost of Evals"}
Evals burn tokens. A 50-example suite with 3 reruns and a judge call per run is 50 × 3 × 2 = **300 API calls per eval run**. Multiply by every PR and every nightly, and the bill adds up.

### A concrete estimate

| Setup | Calls/run | Approx cost/run (Sonnet subject + Haiku judge) |
|---|---|---|
| 20 examples × 1 rerun × judge | 40 | ~$0.15 |
| 50 examples × 3 reruns × judge | 300 | ~$1.00 |
| 200 examples × 3 reruns × judge | 1,200 | ~$4.00 |
| 200 examples × 3 reruns × judge + agent (5 tool turns) | ~6,000 | ~$20 |

The agent-level number is what shocks people. End-to-end agent evals aren't cheap — they're sessions, and sessions cost real money. Budget accordingly.

### Six ways to keep the bill sane

- **Haiku for the judge.** Sonnet judges are rarely worth the 4× price. Verify once that Haiku agrees with you on 20 examples and then commit.
- **Prompt caching on the judge.** The rubric and instructions are identical across hundreds of calls. Enable caching on the judge prompt — you'll save 40–60% on judge tokens.
- **Sampling in CI.** Run 30 examples on PRs, 200 on nightly. You catch most regressions in the subset and only pay the full cost once a day.
- **Deterministic checks first.** Filter easy examples through a regex or JSON-schema check before spending a judge call. If the output is _obviously_ wrong, don't ask the judge.
- **Skip passing examples on reruns.** If an example passes on run 1, don't bother with runs 2 and 3. Only rerun the ones near the boundary.
- **Parallelize.** The 50-example suite that runs serially in 10 minutes runs in 1 minute with a `ThreadPoolExecutor(max_workers=20)`. Same tokens, 10× the wall speed.

### The compounding argument

Evals feel expensive until you compare them to the cost of shipping a regression. A single prod regression caught by an eval — versus caught by a customer ticket two days later — pays for months of eval compute. The math rarely favors skipping evals once the thing you're building has users.

:::docs-callout{variant="success" title="The $5 rule"}
If your eval suite costs less than $5 per run and catches one real regression a month, it's the highest-ROI infrastructure you own. Keep it cheap enough that no one argues about running it.
:::
::::
