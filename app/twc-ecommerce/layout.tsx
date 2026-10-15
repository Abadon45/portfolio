import type { ReactNode } from "react";
import TwcAlertProvider from "../components/portfolio/TwcAlertSystem";
import { getStoreProducts } from "../../lib/storeProductRepository";
import TwcStoreProvider from "./_components/TwcStoreProvider";
import {
  StorefrontModeProvider,
  StorefrontThemeProvider,
} from "./_components/twcEcommerceTheme";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TwcEcommerceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const catalogue = await getStoreProducts()
    .then((products) => ({ products, unavailable: false }))
    .catch(() => ({ products: [], unavailable: true }));

  return (
    <StorefrontThemeProvider>
      <StorefrontModeProvider>
        <TwcAlertProvider>
          <TwcStoreProvider
            products={catalogue.products}
            catalogueUnavailable={catalogue.unavailable}
          >
            {children}
          </TwcStoreProvider>
        </TwcAlertProvider>
      </StorefrontModeProvider>
    </StorefrontThemeProvider>
  );
}
