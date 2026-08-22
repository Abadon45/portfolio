# Custom Backgrounds Skill

Use this skill when adapting an animated or layered background from a source project into the
portfolio.

## Implementation pattern

- Inspect the source implementation and identify its visual layers, animation library, colors,
  density, speed, and interaction behavior before adapting it.
- Keep the background in a reusable client component. Browser-only animation initialization must
  stay out of Server Components.
- Render the visual layer absolutely with `pointerEvents: "none"`, keep content in a higher
  stacking context, and ensure the page still has a solid fallback color before animation loads.
- Use the existing MUI theme and `sx` styling. Do not add Tailwind or page-level CSS modules.
- Respect `prefers-reduced-motion`: reduce particle count and stop movement when requested.
- Keep decorative animation subtle enough that it does not compete with readable content or
  interactive controls. Never rely on moving particles for contrast.
- Keep props typed and expose only the visual controls a route needs, such as colors, density, and
  speed. Avoid copying source-project routes, assets, or credentials.

## Verification

Check the background at narrow and wide widths, confirm foreground content remains keyboard and
pointer accessible, and run TypeScript plus the affected route smoke check. Confirm the page remains
readable with motion reduced and when the animation library has not initialized.
