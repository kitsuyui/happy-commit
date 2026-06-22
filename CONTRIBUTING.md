# Contributing

Thank you for considering contributing to happy-commit.

## Development setup

```console
bun install --frozen-lockfile
```

## Making changes

1. Fork the repository and create a feature branch from `main`.
2. Make your changes and add tests where applicable.
3. Run the checks before opening a PR:

   ```console
   bun run lint
   bun run test
   bun run build
   ```

4. Open a pull request against `main` and fill out the PR template.

## Code style

This project uses [Biome](https://biomejs.dev/) for formatting and linting.
Run `bun run format` to auto-format your changes.

## Reporting issues

Use the GitHub issue tracker. For security vulnerabilities, see [SECURITY.md](SECURITY.md).
