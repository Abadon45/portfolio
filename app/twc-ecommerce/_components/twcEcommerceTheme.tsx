"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createTheme, type PaletteMode, type Theme } from "@mui/material";
import { createPortfolioTheme } from "../../theme/portfolioTheme";

export type StorefrontThemeName =
  | "premium-beauty"
  | "wellness-organic"
  | "modern-marketplace"
  | "corporate-commerce";
export type ProductCardVariant =
  "standard" | "premium" | "compact" | "marketplace" | "horizontal";
export type HeaderVariant =
  "editorial" | "wellness" | "marketplace" | "corporate";
export type ProductDetailVariant =
  "editorial" | "wellness" | "conversion" | "corporate";
export type FooterVariant =
  "minimal" | "wellness" | "marketplace" | "corporate";
export type HomepageSection =
  | "hero"
  | "trust"
  | "categories"
  | "featured"
  | "story"
  | "deals"
  | "benefits"
  | "testimonials"
  | "faq"
  | "cta";

export type StorefrontThemeConfig = {
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  lightSurface: string;
  darkSurface: string;
  darkPaper: string;
  darkText: string;
  darkMuted: string;
  lightDivider: string;
  darkDivider: string;
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

export const storefrontThemes: Record<
  StorefrontThemeName,
  StorefrontThemeConfig
> = {
  "premium-beauty": {
    name: "Premium Beauty",
    description: "A fragrance-led Premium Beauty storefront.",
    primary: "#392631",
    secondary: "#98556f",
    accent: "#e8bdcc",
    lightSurface: "#f8eff3",
    darkSurface: "#181116",
    darkPaper: "#261b22",
    darkText: "#f7eff3",
    darkMuted: "#d1bdc6",
    lightDivider: "#e6d3dc",
    darkDivider: "#493640",
    heroSurface: "#f1e3e9",
    heroText: "#392631",
    radius: 3,
    density: "airy",
    cardVariant: "premium",
    heroStyle: "editorial",
    headerVariant: "editorial",
    productDetailVariant: "editorial",
    footerVariant: "minimal",
    homepage: ["hero", "featured", "story", "categories", "cta"],
  },
  "wellness-organic": {
    name: "Wellness Organic",
    description: "An organic wellness storefront featuring the Santé catalog.",
    primary: "#183826",
    secondary: "#ac4437",
    accent: "#ddc7ab",
    lightSurface: "#f3e9e0",
    darkSurface: "#142019",
    darkPaper: "#1d2d22",
    darkText: "#f3e9e0",
    darkMuted: "#d4c5b5",
    lightDivider: "#ddc7ab",
    darkDivider: "#455449",
    heroSurface: "#f3e9e0",
    heroText: "#183826",
    radius: 2,
    density: "airy",
    cardVariant: "premium",
    heroStyle: "editorial",
    headerVariant: "editorial",
    productDetailVariant: "editorial",
    footerVariant: "minimal",
    homepage: [
      "hero",
      "featured",
      "story",
      "categories",
      "deals",
      "testimonials",
      "cta",
    ],
  },
  "modern-marketplace": {
    name: "Modern Marketplace",
    description: "Fast discovery and information density.",
    primary: "#2457c5",
    secondary: "#e07a35",
    accent: "#dce8ff",
    lightSurface: "#f5f7fa",
    darkSurface: "#111a2a",
    darkPaper: "#1a2639",
    darkText: "#f4f6fa",
    darkMuted: "#b8c2d1",
    lightDivider: "#dce2e9",
    darkDivider: "#344154",
    heroSurface: "#e9eff7",
    heroText: "#142c63",
    radius: 2,
    density: "balanced",
    cardVariant: "marketplace",
    heroStyle: "marketplace",
    headerVariant: "marketplace",
    productDetailVariant: "conversion",
    footerVariant: "marketplace",
    homepage: ["categories", "hero", "deals", "featured", "trust", "cta"],
  },
  "corporate-commerce": {
    name: "Corporate Commerce",
    description:
      "An elevated catalog experience with clear product details and a considered checkout.",
    primary: "#24494e",
    secondary: "#8d6d4f",
    accent: "#b9d0ce",
    lightSurface: "#f5f6f2",
    darkSurface: "#172423",
    darkPaper: "#202f2d",
    darkText: "#f5f5ef",
    darkMuted: "#c1ceca",
    lightDivider: "#d9dfda",
    darkDivider: "#3c504d",
    heroSurface: "#e9eeea",
    heroText: "#1a302e",
    radius: 2,
    density: "airy",
    cardVariant: "compact",
    heroStyle: "structured",
    headerVariant: "corporate",
    productDetailVariant: "corporate",
    footerVariant: "corporate",
    homepage: ["hero", "featured", "categories", "story", "benefits", "cta"],
  },
};

const defaultThemeName: StorefrontThemeName = "wellness-organic";
export type StorefrontMode = "light" | "dark";
type StorefrontThemeContextValue = {
  themeName: StorefrontThemeName;
  themeConfig: StorefrontThemeConfig;
  setThemeName: (themeName: StorefrontThemeName) => void;
};
const StorefrontThemeContext =
  createContext<StorefrontThemeContextValue | null>(null);

export function useStorefrontTheme() {
  const context = useContext(StorefrontThemeContext);
  if (!context)
    throw new Error(
      "useStorefrontTheme must be used inside StorefrontThemeProvider",
    );
  return context;
}

export function StorefrontThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] =
    useState<StorefrontThemeName>(defaultThemeName);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const requestedTheme = new URLSearchParams(window.location.search).get(
        "theme",
      );
      if (requestedTheme && requestedTheme in storefrontThemes) {
        setThemeName(requestedTheme as StorefrontThemeName);
        setHydrated(true);
        return;
      }

      const savedTheme =
        window.localStorage.getItem("twc-ecommerce-theme") ??
        window.localStorage.getItem("twc-storefront-theme");
      if (savedTheme && savedTheme in storefrontThemes) {
        setThemeName(savedTheme as StorefrontThemeName);
      }
    } catch {
      // Theme changes still work when browser storage is unavailable.
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem("twc-ecommerce-theme", themeName);
      window.localStorage.removeItem("twc-storefront-theme");
    } catch {
      // Keep the current theme for this session.
    }
  }, [hydrated, themeName]);
  const value = useMemo(
    () => ({
      themeName,
      themeConfig: storefrontThemes[themeName],
      setThemeName,
    }),
    [themeName],
  );
  return (
    <StorefrontThemeContext.Provider value={value}>
      {children}
    </StorefrontThemeContext.Provider>
  );
}

type StorefrontModeContextValue = {
  mode: StorefrontMode;
  setMode: (
    mode: StorefrontMode | ((current: StorefrontMode) => StorefrontMode),
  ) => void;
};

const StorefrontModeContext = createContext<StorefrontModeContextValue | null>(
  null,
);

export function useStorefrontMode() {
  const context = useContext(StorefrontModeContext);
  if (!context)
    throw new Error(
      "useStorefrontMode must be used inside StorefrontModeProvider",
    );
  return context;
}

export function StorefrontModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<StorefrontMode>("light");

  useEffect(() => {
    try {
      const savedMode = window.localStorage.getItem("twc-ecommerce-mode");
      if (savedMode === "light" || savedMode === "dark") setMode(savedMode);
    } catch {
      // The mode toggle remains available for the current page session.
    }
  }, []);

  const updateMode: StorefrontModeContextValue["setMode"] = (nextMode) => {
    setMode((current) => {
      const value =
        typeof nextMode === "function" ? nextMode(current) : nextMode;
      try {
        window.localStorage.setItem("twc-ecommerce-mode", value);
      } catch {
        // Keep the selected mode in memory when browser storage is unavailable.
      }
      return value;
    });
  };

  const value = useMemo(() => ({ mode, setMode: updateMode }), [mode]);
  return (
    <StorefrontModeContext.Provider value={value}>
      {children}
    </StorefrontModeContext.Provider>
  );
}

export function createTwcEcommerceTheme(
  mode: PaletteMode,
  themeName: StorefrontThemeName = defaultThemeName,
): Theme {
  const storefront = storefrontThemes[themeName];
  const isPremiumTheme = themeName === "premium-beauty";
  const isMarketplaceTheme = themeName === "modern-marketplace";
  const isWellnessTheme = themeName === "wellness-organic";
  const isEditorialTheme = isPremiumTheme || isWellnessTheme;
  const portfolioBase = createPortfolioTheme(mode, "classic");
  const surface =
    mode === "dark" ? storefront.darkSurface : storefront.lightSurface;
  return createTheme(portfolioBase, {
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? storefront.accent : storefront.primary,
        contrastText:
          mode === "dark"
            ? isMarketplaceTheme
              ? "#111a2a"
              : storefront.darkSurface
            : "#fff",
      },
      secondary: {
        main: storefront.secondary,
        ...(isEditorialTheme ? { contrastText: "#fff" } : {}),
      },
      background: {
        default: surface,
        paper:
          mode === "dark"
            ? storefront.darkPaper
            : isPremiumTheme
              ? "#f9fbfc"
              : isWellnessTheme
                ? "#fbf7f1"
                : "#ffffff",
      },
      text: {
        primary:
          mode === "dark"
            ? storefront.darkText
            : isMarketplaceTheme
              ? "#202a36"
              : isWellnessTheme
                ? "#1b2920"
                : isPremiumTheme
                  ? "#20292d"
                  : "#17241e",
        secondary:
          mode === "dark"
            ? storefront.darkMuted
            : isMarketplaceTheme
              ? "#5d6875"
              : isWellnessTheme
                ? "#50574d"
                : isPremiumTheme
                  ? "#526167"
                  : "#52675a",
      },
      divider:
        mode === "dark" ? storefront.darkDivider : storefront.lightDivider,
    },
    shape: { borderRadius: storefront.radius * 4 },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: storefront.radius * 4,
            textTransform: "none",
            fontWeight: isEditorialTheme ? 600 : 800,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: storefront.radius * 4,
            boxShadow: isEditorialTheme
              ? "none"
              : "0 8px 24px rgba(20, 45, 70, .06)",
          },
        },
      },
    },
  });
}
