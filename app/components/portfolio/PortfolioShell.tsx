"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import {
  Box,
  Container,
  CssBaseline,
  GlobalStyles,
  Link,
  ThemeProvider,
} from "@mui/material";
import { createPortfolioTheme } from "../../theme/portfolioTheme";
import { PortfolioAppBar } from "./PortfolioAppBar";
import { dottedBackgroundSx } from "./dottedBackground";
import { usePortfolioMode } from "./usePortfolioMode";
import ScrollToTopButton from "../ScrollToTopButton";
import type { PortfolioUser } from "../../../lib/portfolioAuth";

export function PortfolioShell({
  initialUser,
  children,
}: {
  initialUser?: PortfolioUser | null;
  children: ReactNode;
}) {
  const { mode, toggleMode } = usePortfolioMode();
  const theme = useMemo(
    () =>
      createPortfolioTheme(
        mode,
        "modern",
        undefined,
        'var(--font-poppins), "Segoe UI", sans-serif',
      ),
    [mode],
  );

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: dottedBackgroundSx(theme),
          html: { scrollBehavior: "smooth" },
          "@media (prefers-reduced-motion: reduce)": {
            html: { scrollBehavior: "auto" },
          },
        }}
      />
      <Link
        href="#main"
        sx={{
          position: "fixed",
          left: 16,
          top: -80,
          zIndex: 1600,
          bgcolor: "background.paper",
          p: 2,
          "&:focus": { top: 8 },
        }}
      >
        Skip to content
      </Link>
      <PortfolioAppBar
        initialUser={initialUser}
        isDark={mode === "dark"}
        onToggleMode={toggleMode}
      />
      <Container component="main" id="main" maxWidth="lg" tabIndex={-1}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{ borderTop: 1, borderColor: "divider", py: 3 }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box component="span" sx={{ color: "text.secondary", fontSize: 13 }}>
            Emmanuel Noy Pangan · Built with care.
          </Box>
          <Link
            href="https://github.com/Abadon45"
            color="text.secondary"
            sx={{ fontSize: 13 }}
          >
            GitHub
          </Link>
        </Container>
      </Box>
      <ScrollToTopButton />
    </ThemeProvider>
  );
}
