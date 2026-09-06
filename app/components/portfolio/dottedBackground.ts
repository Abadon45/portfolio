import { alpha, type Theme } from "@mui/material";

/** Static texture for page surfaces; cards and controls keep their own fills. */
export function dottedBackgroundSx(theme: Theme) {
  const strength = theme.palette.mode === "dark" ? 0.12 : 0.13;
  const color = alpha(theme.palette.text.primary, strength);

  return {
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1.35px)`,
    backgroundSize: "32px 32px",
    backgroundPosition: "center top",
    "@media (max-width: 599px)": {
      backgroundSize: "28px 28px",
    },
    "@media (forced-colors: active), (prefers-contrast: more)": {
      backgroundImage: "none",
    },
  };
}
