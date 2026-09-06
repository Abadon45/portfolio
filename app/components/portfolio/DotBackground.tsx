import { alpha, Box } from "@mui/material";

export type DotBackgroundProps = {
  spacing?: number;
  mobileSpacing?: number;
  radius?: number;
  strength?: number;
  dotColors?: { light: string; dark: string };
  fadeEdges?: boolean;
};

function bounded(value: number, fallback: number, min: number, max: number) {
  return Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

/** Mount within an isolated, positioned surface; give content z-index: 1. */
export function DotBackground({
  spacing = 32,
  mobileSpacing = 28,
  radius = 1,
  strength,
  dotColors,
  fadeEdges = false,
}: DotBackgroundProps) {
  const desktopGap = bounded(spacing, 32, 16, 96);
  const mobileGap = bounded(mobileSpacing, 28, 16, 96);
  const dotRadius = bounded(radius, 1, 0.5, 2);
  const mask = "radial-gradient(ellipse at center, #000 30%, transparent 85%)";

  return (
    <Box
      aria-hidden="true"
      sx={(theme) => {
        const mode = theme.palette.mode;
        const defaultStrength = mode === "dark" ? 0.12 : 0.13;
        const opacity = bounded(
          strength ?? defaultStrength,
          defaultStrength,
          0,
          0.3,
        );
        const color = alpha(
          dotColors?.[mode] ?? theme.palette.text.primary,
          opacity,
        );

        return {
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${color} ${dotRadius}px, transparent ${dotRadius + 0.35}px)`,
          backgroundSize: {
            xs: `${mobileGap}px ${mobileGap}px`,
            sm: `${desktopGap}px ${desktopGap}px`,
          },
          backgroundPosition: "center",
          ...(fadeEdges && { maskImage: mask, WebkitMaskImage: mask }),
          "@media (forced-colors: active), (prefers-contrast: more)": {
            display: "none",
          },
        };
      }}
    />
  );
}
