import { AnimatePresence, motion } from "framer-motion";
import CheckIcon from "@mui/icons-material/Check";
import PaletteIcon from "@mui/icons-material/Palette";
import { Box, Fab, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { PortfolioThemeName } from "../../theme/portfolioTheme";
import { portfolioThemePalettes } from "../../theme/portfolioTheme";

type ThemeSettingsButtonProps = {
  activeTheme: PortfolioThemeName;
  customPrimary: string;
  onCustomPrimaryChange: (color: string) => void;
  onThemeChange: (theme: PortfolioThemeName) => void;
};

const MotionPaper = motion.create(Paper);

export function ThemeSettingsButton({
  activeTheme,
  customPrimary,
  onCustomPrimaryChange,
  onThemeChange,
}: ThemeSettingsButtonProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    setOpen((current) => !current);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <Box
      ref={rootRef}
      sx={{
        bottom: { xs: 18, md: 28 },
        left: { xs: 18, md: 28 },
        position: "fixed",
        zIndex: (theme) => theme.zIndex.tooltip,
      }}
    >
      <AnimatePresence>
        {open && (
          <MotionPaper
            animate={{ opacity: 1, scale: 1, y: 0 }}
            elevation={0}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            sx={{
              border: 1,
              borderColor: "divider",
              bottom: 64,
              boxShadow: "0 18px 60px rgba(23, 32, 51, 0.14)",
              left: 0,
              p: 1.5,
              position: "absolute",
              width: { xs: 278, sm: 320 },
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Stack spacing={1.25}>
              <Box>
                <Typography sx={{ fontWeight: 850, lineHeight: 1.2 }}>Theme</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "0.84rem", lineHeight: 1.45, mt: 0.25 }}>
                  Platform shell colors use MUI tokens.
                </Typography>
              </Box>

              <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                {Object.entries(portfolioThemePalettes).map(([slug, palette]) => {
                  const themeSlug = slug as PortfolioThemeName;
                  const selected = activeTheme === themeSlug;

                  return (
                    <Tooltip key={slug} title={palette.description}>
                      <IconButton
                        aria-label={`Use ${palette.name} theme`}
                        onClick={() => onThemeChange(themeSlug)}
                        sx={{
                          alignItems: "stretch",
                          border: 1,
                          borderColor: selected ? "primary.main" : "divider",
                          borderRadius: 2,
                          flexDirection: "column",
                          gap: 0.75,
                          height: 68,
                          p: 0.75,
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 0.5, width: "100%" }}>
                          <Box sx={{ bgcolor: palette.light.primary, borderRadius: 999, height: 14, flex: 1 }} />
                          <Box sx={{ bgcolor: palette.light.secondary, borderRadius: 999, height: 14, flex: 1 }} />
                        </Box>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", justifyContent: "center", minWidth: 0 }}>
                          {selected && <CheckIcon color="primary" sx={{ fontSize: 15 }} />}
                          <Typography noWrap sx={{ color: "text.primary", fontSize: "0.72rem", fontWeight: 850 }}>
                            {palette.name}
                          </Typography>
                        </Stack>
                      </IconButton>
                    </Tooltip>
                  );
                })}
              </Box>

              <Box
                sx={{
                  alignItems: "center",
                  border: 1,
                  borderColor: activeTheme === "custom" ? "primary.main" : "divider",
                  borderRadius: 2,
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: "40px minmax(0, 1fr) auto",
                  p: 1,
                }}
              >
                <Box
                  component="input"
                  aria-label="Choose custom primary color"
                  type="color"
                  value={customPrimary}
                  onChange={(event) => {
                    onCustomPrimaryChange(event.target.value);
                    onThemeChange("custom");
                  }}
                  sx={{
                    bgcolor: "transparent",
                    border: 0,
                    cursor: "pointer",
                    height: 32,
                    p: 0,
                    width: 36,
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.86rem", fontWeight: 850 }}>Custom primary</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "0.78rem" }}>
                    Applies to buttons, chips, and accents.
                  </Typography>
                </Box>
                {activeTheme === "custom" && <CheckIcon color="primary" fontSize="small" />}
              </Box>
            </Stack>
          </MotionPaper>
        )}
      </AnimatePresence>

      <Tooltip title="Theme settings">
        <Fab
          aria-label="Theme settings"
          color="primary"
          component={motion.button}
          onClick={handleToggle}
          size="medium"
          whileHover={{ scale: 1.07, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <PaletteIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}
