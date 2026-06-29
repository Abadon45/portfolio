# Commit Conventions

Reference: `CONTRIBUTING.md` → Commit Messages.

## Format

```text
type(scope): short description
```

One line only. No body required.

## Good Examples

```text
feat(theme): add lower-left theme settings picker
fix(layout): wrap MUI styles with App Router cache provider
docs(portfolio): clarify GameBox and Vendics experience
refactor(page): move portfolio content into data module
chore(makefile): add local dev shortcuts
```

## Bad Examples

```text
update
fix
wip
changes
final
portfolio updates
```

## Description Checklist

- Does it say what changed?
- Is it honest about the scope?
- Is the type correct?
- Is the description specific enough to understand later?

The local `commit-msg` hook rejects messages that do not follow this format.
