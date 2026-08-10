import type { ReactNode } from "react";
import TwcAlertProvider from "../components/portfolio/TwcAlertSystem";
import TwcStoreProvider from "./_components/TwcStoreProvider";

export default function TwcEcommerceLayout({ children }: { children: ReactNode }) {
  return <TwcAlertProvider><TwcStoreProvider>{children}</TwcStoreProvider></TwcAlertProvider>;
}
