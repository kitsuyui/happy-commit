# happy-commit

![Coverage](https://raw.githubusercontent.com/kitsuyui/octocov-central/main/badges/kitsuyui/happy-commit/coverage.svg)
[![TODO/FIXME](https://raw.githubusercontent.com/kitsuyui/happy-commit/gh-counter-assets/badges/maintenance-comments.svg)](https://github.com/kitsuyui/happy-commit/search?q=%28TODO+OR+FIXME%29+path%3Asrc&type=code)

Celebrate pull requests when their number or commit SHA matches a fun pattern.
The repository also tracks `TODO` and `FIXME` markers with [`gh-counter`](https://github.com/kitsuyui/gh-counter).

## What it does

<img width="809" alt="happy-commit" src="https://user-images.githubusercontent.com/2596972/209441390-83e0665e-3c65-4cb5-8c2e-b815448b0e2e.png">

By default, happy-commit posts a managed PR comment when it finds one of these built-in patterns:

- Celebrate when issue number reaches 10, 100, 1000, ... etc.
- Celebrate when issue number is all sevens (e.g. 777, 7777, ... etc.)
- Celebrate when commit id contains lucky number (e.g. 7, 77, 777, ... etc.)
- Celebrate when commit id is a sequence of digits (e.g. 123, 1234, ... etc.)
- Celebrate when commit id is a hexspeaking number (e.g. deadbeef, cafe, c0ffee, ... etc.)
- Notify when issue number is unlucky number (e.g. 666, ... etc.)

The exact built-in rules live in [`src/rules.ts`](https://github.com/kitsuyui/happy-commit/blob/main/src/rules.ts).

## Quick start

```yaml
name: happy-commit
on:
  pull_request_target:

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  happy:
    runs-on: ubuntu-latest
    steps:
      - uses: kitsuyui/happy-commit@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          max_expected_occurrences: 1
```

This action only needs pull-request metadata and commit ids from the GitHub API, so the published action can run without `actions/checkout`. `pull_request_target` is the safer default when you want to comment on pull requests from forks.

## Inputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | Yes | none | Token used to read pull request metadata and create or update the managed comment |
| `additional_rules` | No | none | JSON array of extra `pr` or `commit` rules to evaluate in addition to the built-in set |
| `max_expected_occurrences` | No | none | Optional rarity ceiling for built-in rules. Lower values celebrate only rarer events |

## Rarity control

`max_expected_occurrences` is optional. If you leave it unset, happy-commit behaves exactly like the classic version and evaluates the built-in rules without any rarity filter.

If you set it, built-in rules are celebrated only when they are still rare enough at the current repository size. For pull request numbers, happy-commit uses the current PR number as the search range. For commit hashes, it uses the total number of commits on the default branch to estimate how often a pattern should have appeared by now.

In practice, `1` is a reasonable starting point if you want to celebrate only events that should happen about once or less at the current repository scale. Smaller values make the action stricter. `additional_rules` are treated as explicit user intent and are not filtered by this rarity threshold.

## Custom rules

You can add your own rules with `additional_rules`. The value is a JSON array, and each rule must contain:

| Field | Required | Description |
| --- | --- | --- |
| `kind` | Yes | Either `pr` or `commit` |
| `rule` | Yes | Regular expression pattern evaluated against the PR number or commit SHA |
| `message` | Yes | Mustache template rendered into the comment when the rule matches |

For example, this rule celebrates any commit SHA containing `1`.

```yaml
jobs:
  happy:
    runs-on: ubuntu-latest
    steps:
      - uses: kitsuyui/happy-commit@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          additional_rules: |
            [
              {
                "kind": "commit",
                "rule": "(?:1)",
                "message": "custom message! `{{commitId}}` is lucky! It contains **{{matched}}**"
              }
            ]
```

## Dogfooding

This repository keeps a local example workflow in `.github/workflows/main.yml`. It uses `pull_request` and `uses: ./` so changes in the current branch are tested before release. That pattern should stay limited to the action repository itself, because a local action from an untrusted fork must not run with `pull_request_target`.

## License

MIT
