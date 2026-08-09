"use client";

import { Box, Tooltip, type SxProps, type Theme } from "@mui/material";
import { useColorMode } from "../../theme/solarThemeProvider";

const stars = [
  { top: 5, left: 10, size: 2, opacity: 0.9 },
  { top: 15, left: 19, size: 1.5, opacity: 0.65 },
  { top: 7, left: 35, size: 2, opacity: 0.8 },
  { top: 22, left: 46, size: 1.5, opacity: 0.7 },
  { top: 11, left: 56, size: 2, opacity: 0.9 },
  { top: 25, left: 28, size: 1.5, opacity: 0.6 },
  { top: 6, left: 63, size: 1.5, opacity: 0.7 },
];

const reducedMotion: SxProps<Theme> = {
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none !important",
  },
};

function SkyCloud({
  isDark,
  secondary = false,
}: {
  isDark: boolean;
  secondary?: boolean;
}) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        left: secondary ? "auto" : 8,
        right: secondary ? 8 : "auto",
        bottom: secondary ? 7 : 4,
        width: secondary ? 18 : 28,
        height: secondary ? 6 : 9,
        borderRadius: 99,
        bgcolor: secondary ? "#f8fdff" : "#ffffff",
        opacity: isDark ? 0 : secondary ? 0.55 : 0.9,
        transform: isDark
          ? `translateX(${secondary ? 10 : -8}px) scale(${secondary ? 0.6 : 0.7})`
          : "translateX(0) scale(1)",
        boxShadow: secondary
          ? "5px -4px 0 -1px #f8fdff, 11px -2px 0 -1px #f8fdff"
          : "7px -5px 0 -1px #fff, 15px -3px 0 -1px #fff, 21px 1px 0 -1px #fff",
        transition: secondary
          ? "opacity 450ms ease, transform 600ms cubic-bezier(.22,1,.36,1)"
          : "opacity 350ms ease, transform 500ms cubic-bezier(.22,1,.36,1)",
        ...reducedMotion,
      }}
    />
  );
}

function CelestialThumb({ isDark }: { isDark: boolean }) {
  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        position: "absolute",
        top: 3,
        left: isDark ? "calc(100% - 29px)" : 3,
        width: 26,
        height: 26,
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        bgcolor: isDark ? "#f4f0c7" : "#ffd45c",
        boxShadow: isDark
          ? "0 0 8px rgba(255,245,190,.45)"
          : "0 0 8px rgba(255,210,70,.55)",
        transition:
          "left 500ms cubic-bezier(.22,1,.36,1), background-color 320ms ease, box-shadow 400ms ease",
        ...reducedMotion,
      }}
    >
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          opacity: isDark ? 0 : 1,
          transform: isDark
            ? "scale(.5) rotate(-45deg)"
            : "scale(1) rotate(0deg)",
          transition: "opacity 220ms ease, transform 360ms ease",
          fontSize: 17,
          color: "#fff8d8",
          ...reducedMotion,
        }}
      >
        ☼
      </Box>
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          position: "absolute",
          width: 20,
          height: 20,
          borderRadius: "50%",
          bgcolor: "#f4f0c7",
          opacity: isDark ? 1 : 0,
          transform: isDark
            ? "scale(1) rotate(0deg)"
            : "scale(.5) rotate(45deg)",
          transition: "opacity 220ms ease, transform 360ms ease",
          "&::after": {
            content: '""',
            position: "absolute",
            top: -2,
            right: -3,
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#172b4b",
          },
          ...reducedMotion,
        }}
      />
    </Box>
  );
}

type ThemeToggleProps = {
  mode?: "light" | "dark";
  onToggle?: () => void;
  compact?: boolean;
};

export default function ThemeToggle({ mode: controlledMode, onToggle, compact = false }: ThemeToggleProps = {}) {
  const colorMode = useColorMode();
  const mode = controlledMode ?? colorMode.mode;
  const isDark = mode === "dark";

  return (
    <Tooltip title={`Switch to ${isDark ? "light" : "dark"} mode`}>
      <Box
        component="button"
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        onClick={onToggle ?? colorMode.toggleMode}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: compact ? 54 : 68,
          minHeight: compact ? 34 : 44,
          flexShrink: 0,
          p: 0,
          border: 0,
          bgcolor: "transparent",
          cursor: "pointer",
          transition: "transform 180ms ease",
          "&:hover": { transform: "translateY(-1px)" },
          "&:focus-visible": {
            outline: "3px solid",
            outlineColor: "primary.light",
            outlineOffset: 2,
          },
          ...reducedMotion,
        }}
      >
        <Box
          component="span"
          sx={{
            position: "relative",
            display: "block",
            width: 68,
            height: 34,
            border: "1px solid",
            borderColor: isDark ? "#405879" : "#91c9e8",
            borderRadius: 99,
            background: isDark
              ? "linear-gradient(135deg, #0d1b2e 0%, #1b3154 55%, #263e64 100%)"
              : "linear-gradient(135deg, #62c9f5 0%, #a9e5ff 55%, #e6f9ff 100%)",
            overflow: "hidden",
            transform: compact ? "scale(0.78)" : "none",
            transformOrigin: "center",
            transition: "background 500ms ease, border-color 400ms ease",
            ...reducedMotion,
          }}
        >
          {stars.map((star, index) => (
            <Box
              key={index}
              component="span"
              aria-hidden="true"
              sx={{
                position: "absolute",
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                borderRadius: "50%",
                bgcolor: "#fff",
                opacity: isDark ? star.opacity : 0,
                transform: isDark ? "scale(1)" : "scale(0.2)",
                boxShadow: isDark
                  ? `0 0 ${star.size * 2}px rgba(255,255,255,0.8)`
                  : "none",
                transition:
                  "opacity 400ms ease, transform 500ms cubic-bezier(.22,1,.36,1)",
                ...reducedMotion,
              }}
            />
          ))}
          <SkyCloud isDark={isDark} />
          <SkyCloud isDark={isDark} secondary />
          <CelestialThumb isDark={isDark} />
        </Box>
      </Box>
    </Tooltip>
  );
}
