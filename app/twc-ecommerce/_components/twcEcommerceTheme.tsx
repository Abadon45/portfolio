"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createTheme, type PaletteMode, type Theme } from "@mui/material";
import { createPortfolioTheme } from "../../theme/portfolioTheme";

export type StorefrontThemeName = "premium-beauty" | "wellness-organic" | "modern-marketplace" | "corporate-commerce";
export type ProductCardVariant = "standard" | "premium" | "compact" | "marketplace" | "horizontal";
export type HeaderVariant = "editorial" | "wellness" | "marketplace" | "corporate";
export type ProductDetailVariant = "editorial" | "wellness" | "conversion" | "corporate";
export type FooterVariant = "minimal" | "wellness" | "marketplace" | "corporate";
export type HomepageSection = "hero" | "trust" | "categories" | "featured" | "story" | "deals" | "benefits" | "testimonials" | "faq" | "cta";

export type StorefrontThemeConfig = {
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  lightSurface: string;
  darkSurface: string;
  heroSurface: string;
  heroText: string;
  radius: number;
  density: "airy" | "balanced" | "dense";
  cardVariant: ProductCardVariant;
  heroStyle: "editorial" | "organic" | "marketplace" | "structured";
  headerVariant: HeaderVariant;
  productDetailVariant: ProductDetailVariant;
  footerVariant: FooterVariant;
  homepage: HomepageSection[];
};

export const storefrontThemes: Record<StorefrontThemeName, StorefrontThemeConfig> = {
  "premium-beauty": { name: "Premium Beauty", description: "Editorial, spacious, and image-led.", primary: "#8b4962", secondary: "#c49374", accent: "#ead9d7", lightSurface: "#fffaf8", darkSurface: "#271a21", heroSurface: "#f4e7e4", heroText: "#3f2631", radius: 3, density: "airy", cardVariant: "premium", heroStyle: "editorial", headerVariant: "editorial", productDetailVariant: "editorial", footerVariant: "minimal", homepage: ["hero", "featured", "story", "categories", "deals", "testimonials", "cta"] },
  "wellness-organic": { name: "Wellness Organic", description: "Natural, calm, and trust-focused.", primary: "#347153", secondary: "#b47a42", accent: "#dcebdc", lightSurface: "#f8fbf6", darkSurface: "#17261d", heroSurface: "#e4f0e4", heroText: "#173b27", radius: 3, density: "balanced", cardVariant: "standard", heroStyle: "organic", headerVariant: "wellness", productDetailVariant: "wellness", footerVariant: "wellness", homepage: ["hero", "trust", "categories", "featured", "story", "benefits", "testimonials", "faq", "cta"] },
  "modern-marketplace": { name: "Modern Marketplace", description: "Fast discovery and information density.", primary: "#2457c5", secondary: "#e07a35", accent: "#dce8ff", lightSurface: "#f5f8fc", darkSurface: "#172033", heroSurface: "#e6efff", heroText: "#142c63", radius: 1, density: "dense", cardVariant: "marketplace", heroStyle: "marketplace", headerVariant: "marketplace", productDetailVariant: "conversion", footerVariant: "marketplace", homepage: ["categories", "hero", "deals", "featured", "trust", "cta"] },
  "corporate-commerce": { name: "Corporate Commerce", description: "Structured, polished, and brand-forward.", primary: "#173f5f", secondary: "#c28c36", accent: "#dce6ec", lightSurface: "#f7f9fb", darkSurface: "#14202c", heroSurface: "#e8eef3", heroText: "#173044", radius: 1, density: "balanced", cardVariant: "compact", heroStyle: "structured", headerVariant: "corporate", productDetailVariant: "corporate", footerVariant: "corporate", homepage: ["hero", "featured", "categories", "story", "benefits", "cta"] },
};

const defaultThemeName: StorefrontThemeName = "wellness-organic";
export type StorefrontMode = "light" | "dark";
type StorefrontThemeContextValue = { themeName: StorefrontThemeName; themeConfig: StorefrontThemeConfig; setThemeName: (themeName: StorefrontThemeName) => void };
const StorefrontThemeContext = createContext<StorefrontThemeContextValue | null>(null);

export function useStorefrontTheme() {
  const context = useContext(StorefrontThemeContext);
  if (!context) throw new Error("useStorefrontTheme must be used inside StorefrontThemeProvider");
  return context;
}

export function StorefrontThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<StorefrontThemeName>(defaultThemeName);
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("twc-ecommerce-theme") ?? window.localStorage.getItem("twc-storefront-theme");
    if (savedTheme && savedTheme in storefrontThemes) {
      setThemeName(savedTheme as StorefrontThemeName);
      window.localStorage.removeItem("twc-storefront-theme");
    }
  }, []);
  useEffect(() => { window.localStorage.setItem("twc-ecommerce-theme", themeName); }, [themeName]);
  const value = useMemo(() => ({ themeName, themeConfig: storefrontThemes[themeName], setThemeName }), [themeName]);
  return <StorefrontThemeContext.Provider value={value}>{children}</StorefrontThemeContext.Provider>;
}

type StorefrontModeContextValue = {
  mode: StorefrontMode;
  setMode: (mode: StorefrontMode | ((current: StorefrontMode) => StorefrontMode)) => void;
};

const StorefrontModeContext = createContext<StorefrontModeContextValue | null>(null);

export function useStorefrontMode() {
  const context = useContext(StorefrontModeContext);
  if (!context) throw new Error("useStorefrontMode must be used inside StorefrontModeProvider");
  return context;
}

export function StorefrontModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<StorefrontMode>("light");

  useEffect(() => {
    const savedMode = window.localStorage.getItem("twc-ecommerce-mode");
    if (savedMode === "light" || savedMode === "dark") setMode(savedMode);
  }, []);

  useEffect(() => { window.localStorage.setItem("twc-ecommerce-mode", mode); }, [mode]);

  const value = useMemo(() => ({ mode, setMode }), [mode]);
  return <StorefrontModeContext.Provider value={value}>{children}</StorefrontModeContext.Provider>;
}

export function createTwcEcommerceTheme(mode: PaletteMode, themeName: StorefrontThemeName = defaultThemeName): Theme {
  const storefront = storefrontThemes[themeName];
  const portfolioBase = createPortfolioTheme(mode, "classic");
  const surface = mode === "dark" ? storefront.darkSurface : storefront.lightSurface;
  return createTheme(portfolioBase, {
    palette: {
      mode,
      primary: { main: storefront.primary, contrastText: "#fff" },
      secondary: { main: storefront.secondary },
      background: { default: surface, paper: mode === "dark" ? "#1e3026" : "#ffffff" },
      text: { primary: mode === "dark" ? "#f4faf5" : "#17241e", secondary: mode === "dark" ? "#c4d4c8" : "#52675a" },
      divider: mode === "dark" ? "#385443" : "#d7e1da",
    },
    shape: { borderRadius: storefront.radius * 4 },
    typography: { fontFamily: themeName === "premium-beauty" ? 'Georgia, "Times New Roman", serif' : 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: storefront.radius * 4, textTransform: themeName === "modern-marketplace" ? "uppercase" : "none", fontWeight: 800 } } },
      MuiCard: { styleOverrides: { root: { borderRadius: storefront.radius * 4, boxShadow: themeName === "premium-beauty" ? "0 18px 45px rgba(100, 45, 65, .08)" : "0 8px 24px rgba(20, 45, 70, .06)" } } },
    },
  });
}
