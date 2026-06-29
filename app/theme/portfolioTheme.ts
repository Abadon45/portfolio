import { createTheme, type PaletteMode } from "@mui/material";

export type PortfolioThemeName = "executive" | "modern" | "classic" | "bold" | "minimalist" | "vibrant" | "custom";

type ThemePalette = {
  name: string;
  description: string;
  light: {
    primary: string;
    secondary: string;
    background: string;
    paper: string;
    textPrimary: string;
    textSecondary: string;
  };
  dark: {
    primary: string;
    secondary: string;
    background: string;
    paper: string;
    textPrimary: string;
    textSecondary: string;
  };
};

export const portfolioThemePalettes: Record<Exclude<PortfolioThemeName, "custom">, ThemePalette> = {
  executive: {
    name: "Executive",
    description: "Navy and gold platform polish",
    light: {
      primary: "#1a237e",
      secondary: "#e1c340",
      background: "#f5f7fb",
      paper: "#ffffff",
      textPrimary: "#172033",
      textSecondary: "#667085",
    },
    dark: {
      primary: "#e1c340",
      secondary: "#62d5d0",
      background: "#0b1120",
      paper: "#111827",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1",
    },
  },
  modern: {
    name: "Modern",
    description: "Cool SaaS blue",
    light: {
      primary: "#2457c5",
      secondary: "#0f9f9a",
      background: "#f5f7fb",
      paper: "#ffffff",
      textPrimary: "#172033",
      textSecondary: "#667085",
    },
    dark: {
      primary: "#8fb4ff",
      secondary: "#62d5d0",
      background: "#0b1120",
      paper: "#111827",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1",
    },
  },
  classic: {
    name: "Classic",
    description: "Refined green and gold",
    light: {
      primary: "#166534",
      secondary: "#b7791f",
      background: "#f7faf7",
      paper: "#ffffff",
      textPrimary: "#172033",
      textSecondary: "#667085",
    },
    dark: {
      primary: "#8ad8a0",
      secondary: "#e1c340",
      background: "#09140f",
      paper: "#111b16",
      textPrimary: "#f4fbf6",
      textSecondary: "#c5d6cb",
    },
  },
  bold: {
    name: "Bold",
    description: "High-contrast commerce red",
    light: {
      primary: "#be123c",
      secondary: "#2563eb",
      background: "#fff7f8",
      paper: "#ffffff",
      textPrimary: "#1f1720",
      textSecondary: "#6f5c65",
    },
    dark: {
      primary: "#fb7185",
      secondary: "#93c5fd",
      background: "#17090d",
      paper: "#211116",
      textPrimary: "#fff7f8",
      textSecondary: "#e7c7cf",
    },
  },
  minimalist: {
    name: "Minimalist",
    description: "Neutral editorial graphite",
    light: {
      primary: "#334155",
      secondary: "#64748b",
      background: "#f8fafc",
      paper: "#ffffff",
      textPrimary: "#111827",
      textSecondary: "#64748b",
    },
    dark: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
      background: "#09090b",
      paper: "#18181b",
      textPrimary: "#fafafa",
      textSecondary: "#cbd5e1",
    },
  },
  vibrant: {
    name: "Vibrant",
    description: "Energetic teal and magenta",
    light: {
      primary: "#0f766e",
      secondary: "#c026d3",
      background: "#f0fdfa",
      paper: "#ffffff",
      textPrimary: "#13201f",
      textSecondary: "#5f7472",
    },
    dark: {
      primary: "#5eead4",
      secondary: "#f0abfc",
      background: "#061514",
      paper: "#0f2422",
      textPrimary: "#ecfeff",
      textSecondary: "#b7d6d2",
    },
  },
};

const getReadableText = (hex: string) => {
  const clean = hex.replace("#", "");
  const value = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.58 ? "#111827" : "#ffffff";
};

export const createPortfolioTheme = (
  mode: PaletteMode,
  activeTheme: PortfolioThemeName = "executive",
  customPrimary = "#1a237e",
) => {
  const isDark = mode === "dark";
  const palette = portfolioThemePalettes[activeTheme === "custom" ? "executive" : activeTheme];
  const variant = isDark ? palette.dark : palette.light;
  const primaryMain = activeTheme === "custom" ? customPrimary : variant.primary;

  return createTheme({
    palette: {
      mode,
      background: {
        default: variant.background,
        paper: variant.paper,
      },
      primary: {
        main: primaryMain,
        dark: isDark ? primaryMain : primaryMain,
        contrastText: getReadableText(primaryMain),
      },
      secondary: {
        main: variant.secondary,
      },
      warning: {
        main: isDark ? "#f2c94c" : "#d49a20",
      },
      text: {
        primary: variant.textPrimary,
        secondary: variant.textSecondary,
      },
      divider: isDark ? "rgba(148, 163, 184, 0.22)" : "#d8e0ea",
      action: {
        hover: isDark ? "rgba(226, 232, 240, 0.08)" : "rgba(36, 87, 197, 0.08)",
        selected: isDark ? "rgba(226, 195, 64, 0.14)" : "rgba(36, 87, 197, 0.12)",
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: {
        fontWeight: 850,
        letterSpacing: 0,
        lineHeight: 0.98,
      },
      h2: {
        fontWeight: 850,
        letterSpacing: 0,
        lineHeight: 1.08,
      },
      h3: {
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: 1.25,
      },
      button: {
        fontWeight: 800,
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            minHeight: 46,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundImage: "none",
          },
        },
      },
    },
  });
};
