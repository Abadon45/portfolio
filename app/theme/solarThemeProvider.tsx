"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";

type Mode = "light" | "dark";
type ColorModeContextValue = { mode: Mode; toggleMode: () => void };

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: "light",
  toggleMode: () => undefined,
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(
      "cotabato-solar-theme",
    ) as Mode | null;
    setMode(
      saved === "dark" || saved === "light"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
    );
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#b9f66a" : "#2f7d32",
            light: mode === "dark" ? "#d7ffa1" : "#a9d978",
            dark: mode === "dark" ? "#8fcf5b" : "#1b5e20",
            contrastText: mode === "dark" ? "#102b1d" : "#ffffff",
          },
          background: {
            default: mode === "dark" ? "#0e1813" : "#f7faf5",
            paper: mode === "dark" ? "#17261d" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f1f8ef" : "#17241e",
            secondary: mode === "dark" ? "#c2d2c6" : "#476157",
          },
          divider: mode === "dark" ? "#33503d" : "#d6e1d8",
        },
        typography: {
          fontFamily: "var(--font-poppins), Arial, Helvetica, sans-serif",
          h1: { fontWeight: 800, letterSpacing: "-0.075em", lineHeight: 0.96 },
          h2: { fontWeight: 800, letterSpacing: "-0.075em", lineHeight: 0.98 },
          h3: { fontWeight: 800, letterSpacing: "-0.045em" },
          button: { textTransform: "none", fontWeight: 700 },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                color: mode === "dark" ? "#f1f8ef" : "#17241e",
                backgroundColor: mode === "dark" ? "#0e1813" : "#f7faf5",
              },
              "body, body *": {
                transition:
                  "background-color 280ms ease, border-color 280ms ease, color 220ms ease, box-shadow 280ms ease",
              },
            },
          },
          MuiAppBar: { styleOverrides: { root: { color: "inherit" } } },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 12, minHeight: 42, boxShadow: "none" },
            },
          },
          MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
          MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
        },
      }),
    [mode],
  );

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () =>
        setMode((current) => {
          const next = current === "dark" ? "light" : "dark";
          window.localStorage.setItem("cotabato-solar-theme", next);
          return next;
        }),
    }),
    [mode],
  );
  return (
    <ColorModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
