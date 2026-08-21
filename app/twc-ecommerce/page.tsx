import type { Metadata } from "next";
import TwcStorePage from "./_components/TwcStorePage";

export const metadata: Metadata = {
  title: "TWC Ecommerce | Multi-theme storefront framework",
  description: "An offline portfolio reconstruction demonstrating reusable ecommerce components, theme switching, product discovery, cart, and checkout flows.",
  alternates: { canonical: "/twc-ecommerce" },
  openGraph: {
    title: "TWC Ecommerce | Multi-theme storefront framework",
    description: "A reusable offline ecommerce storefront demonstration powered by shared product and commerce components.",
    type: "website",
  },
};

export default function TwcHomeRoute() { return <TwcStorePage view="home" />; }
