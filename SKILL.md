# Portfolio Project Skill

This file is the project-specific instruction source for the portfolio repository.

## Before generating code

1. Find and read the most relevant project skill or local instruction file before writing code.
2. Prefer the route-local skill for a feature. Use the root guidance when no more specific skill exists.
3. Inspect the existing route, theme/provider, shared components, and package scripts before creating new abstractions.
4. Preserve existing conventions unless the task explicitly asks for a visual or architectural change.
5. Verify changes with the narrowest relevant type check, lint, test, or build command before reporting completion.

## Current project conventions

- This is a Next.js App Router project using TypeScript and MUI.
- Use MUI components, the configured theme, and `sx`; do not add Tailwind or page-level CSS modules.
- Keep route-specific UI beside the route in a private `_components` folder when a route grows beyond a small page entry.
- Keep standalone template pages out of the home page until explicitly requested.
- Every standalone template page must use the shared `FloatingHomeButton` as its home navigation. Do not add redundant inline “Back to portfolio”, “Home”, or equivalent links unless explicitly requested.
- Define light and dark palette values explicitly and check inherited text, muted text, borders, controls, cards, and empty states in both modes.
- Keep the theme layout in two layers: platform chrome uses MUI theme tokens (`background.paper`, `background.default`, `divider`, `text.primary`, `text.secondary`, and semantic palette colors); storefront content may use the active storefront theme tokens but must remain readable in both modes. Do not let page-local content colors leak into the shared shell.
- Preserve the storefront page structure when adapting source designs: page header/breadcrumbs, primary content panel, detail/info sections, related content, and the page-level floating home button.
- Use a shared application alert system for interactive projects. Prefer the reusable provider pattern in `app/components/portfolio/TwcAlertSystem.tsx`: stacked toast notifications, typed success/error/warning/info helpers, promise-based confirmation modals, loading-safe actions, and a top-right close control. Do not create one-off alert implementations for each button or page.
- For cart experiences, derive product-card state from the shared cart source of truth. An item already in the cart must show a disabled “Added to cart” state; quantity and removal changes belong in the cart drawer and should automatically update the cards.

## Agent workflow rule

The base coding skill/agent must look for `SKILL.md`, `AGENTS.md`, or other project-local instructions at the start of every project task and read the applicable file before generating code. This prevents repeating project conventions in every prompt.

## Reusable project features

When starting a new portfolio demo, check whether these features should be included from the beginning:

- Shared MUI alert/toast/modal provider with typed helpers and confirmation/loading behavior.
- Shared cart/drawer state when the project is commerce-related.
- Explicit button states for optimistic actions, especially `Add to cart` → `Added to cart`.
