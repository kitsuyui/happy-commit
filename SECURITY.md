# Security Policy

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues.

Instead, open a [GitHub Security Advisory](https://github.com/kitsuyui/happy-commit/security/advisories/new) or contact the maintainer directly through GitHub.

We aim to acknowledge receipt within 5 business days and to provide a fix or mitigation plan within 30 days, depending on severity.

## Scope

This is a GitHub Action that:

- Accepts `GITHUB_TOKEN` as a required input
- Posts comments and reactions to pull requests

Security concerns in scope include:
- Unintended token scope usage or credential leakage
- Logic that allows unintended write access to repositories
- Vulnerabilities in runtime dependencies (`node_modules`)

Please include the dependency name and version in your report if the issue originates from a dependency.
