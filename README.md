# happy-commit

[![codecov](https://codecov.io/gh/kitsuyui/happy-commit/branch/main/graph/badge.svg?token=FM7RYWGV0P)](https://codecov.io/gh/kitsuyui/happy-commit)

- GitHub Action to celebrate your commits on PR.

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

## Example usage

```yaml
      - name: happy-commit
        uses: kitsuyui/happy-commit
        continue-on-error: true
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Additional patterns

custom patterns can be added by `additional_rules`.
For example, you can celebrate when commit id contains `1`.

```yaml
      - name: happy-commit
        uses: kitsuyui/happy-commit
        continue-on-error: true
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
