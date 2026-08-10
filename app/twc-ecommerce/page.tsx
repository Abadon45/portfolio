import type { Metadata } from "next";
import TwcStorePage from "./_components/TwcStorePage";

export const metadata: Metadata = { title: "TWC Online Store | Portfolio Demo", description: "A MUI storefront demo recreated from the TWC Ecommerce project." };

export default function TwcHomeRoute() { return <TwcStorePage view="home" />; }
