import type { ReactNode } from "react";
import TwcAlertProvider from "../components/portfolio/TwcAlertSystem";
import TwcStoreProvider from "./_components/TwcStoreProvider";
import { StorefrontModeProvider, StorefrontThemeProvider } from "./_components/twcEcommerceTheme";

export default function TwcEcommerceLayout({ children }: { children: ReactNode }) {
  return <StorefrontThemeProvider><StorefrontModeProvider><TwcAlertProvider><TwcStoreProvider>{children}</TwcStoreProvider></TwcAlertProvider></StorefrontModeProvider></StorefrontThemeProvider>;
}
