"use client";

import { useSyncExternalStore } from "react";
import type { PaletteMode } from "@mui/material";

const key = "portfolio-theme-mode-v2";
const changeEvent = "portfolio-theme-change";
let currentMode: PaletteMode = "dark";

function getMode(): PaletteMode {
  try {
    const saved = localStorage.getItem(key);
    if (saved === "light" || saved === "dark") currentMode = saved;
  } catch {
    // Keep the in-memory preference when storage is unavailable.
  }
  return currentMode;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

function getServerMode(): PaletteMode {
  return "dark";
}

export function usePortfolioMode() {
  const mode = useSyncExternalStore(subscribe, getMode, getServerMode);

  function toggleMode() {
    currentMode = getMode() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(key, currentMode);
    } catch {
      // Keep the in-memory preference for this browser session.
    }
    window.dispatchEvent(new Event(changeEvent));
  }

  return { mode, toggleMode };
}
