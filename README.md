# happy-commit

![Coverage](https://raw.githubusercontent.com/kitsuyui/octocov-central/main/badges/kitsuyui/happy-commit/coverage.svg)
[![TODO/FIXME](https://raw.githubusercontent.com/kitsuyui/happy-commit/gh-counter-assets/badges/maintenance-comments.svg)](https://github.com/kitsuyui/happy-commit/search?q=%28TODO+OR+FIXME%29+path%3Asrc&type=code)

- GitHub Action to celebrate your commits on PR.
- The repository tracks `TODO` and `FIXME` markers with [`gh-counter`](https://github.com/kitsuyui/gh-counter).

## Example

<img width="809" alt="happy-commit" src="https://user-images.githubusercontent.com/2596972/209441390-83e0665e-3c65-4cb5-8c2e-b815448b0e2e.png">

## Conditions

- Celebrate when issue number reaches 10, 100, 1000, ... etc.
- Celebrate when issue number is lucky number (e.g. 7, 77, 777, ... etc.)
- Celebrate when commit id contains lucky number (e.g. 7, 77, 777, ... etc.)
- Celebrate when commit id is a sequence of digits (e.g. 123, 1234, ... etc.)
- Celebrate when commit id is a hexspeaking number (e.g. deadbeef, cafe, c0ffee, ... etc.)
- Notify when issue number is unlucky number (e.g. 666, ... etc.)

c.f. https://github.com/kitsuyui/happy-commit/blob/main/src/rules.ts

## Recommended usage

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

This action only needs pull-request metadata and commit ids from the GitHub API,
so the published action can run without `actions/checkout`. `pull_request_target`
is the safer default when you want to comment on pull requests from forks.
`max_expected_occurrences` is optional. When you set it, built-in rules are
celebrated only if they are still rare enough at the current repository size.
For pull request numbers this uses the current PR number as the search range,
and for commit hashes it uses the total number of commits on the default branch.

## Dogfooding example

This repository keeps a local example workflow in `.github/workflows/main.yml`.
It uses `pull_request` and `uses: ./` so changes in the current branch are tested
before release. That pattern should stay limited to the action repository itself,
because a local action from an untrusted fork must not run with
`pull_request_target`. The dogfooding workflow also uses always-matching rules
for both the pull request number and commit SHA so the managed comment path is
exercised on every same-repository PR.

## Additional patterns

custom patterns can be added by `additional_rules`.
For example, you can celebrate when commit id contains `1`.

```yaml
      - name: happy-commit
        uses: kitsuyui/happy-commit@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          additional_rules: |
            [
              {
                "kind": "commit",
                "rule": "(?:1)",
                "message": "custom message! `{{commitId}}` is lucky! It contains **{{matched}}"
              }
            ]
```

## License

MIT
