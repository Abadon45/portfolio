# Contributing Guide

This portfolio is a personal site, but commit history still matters. Use clear, accurate commit descriptions so future-you can understand what changed without opening every diff.

## Quick Start

```bash
make install
make setup
make dev
```

`make setup` configures local git hooks, including commit message validation.

## Commit Messages

Use Conventional Commits:

```text
type(scope): short description
```

Examples:

```text
feat(theme): add portfolio color picker
fix(contact): open Gmail compose from email buttons
docs(commits): add commit message rules
refactor(portfolio): split page into section components
```

## Allowed Types

- `feat` - new feature or visible capability
- `fix` - bug fix
- `docs` - documentation changes
- `style` - formatting only, no logic change
- `refactor` - code restructuring without behavior change
- `perf` - performance improvement
- `test` - test additions or updates
- `chore` - maintenance, dependencies, config, setup
- `ci` - CI/CD changes

## Rules

- Keep the first line under 100 characters.
- Use lowercase type and optional lowercase scope.
- Describe the real change, not the intention.
- Do not use vague messages like `update`, `changes`, `fix`, `wip`, `stuff`, or `final`.
- Do not claim work you did not do. Be specific when work is maintenance, copy updates, or styling.

## Before Committing

```bash
make build
```

Read your diff before committing:

```bash
git diff
```
