import type { Metadata } from "next";
import SaaSPlatformPage from "./_components/SaaSPlatformPage";

export const metadata: Metadata = {
  title: "Northstar Commerce | SaaS operations platform",
  description:
    "A fictional SaaS commerce and business operations platform demonstrating dashboards, fulfillment, suppliers, storefronts, and analytics.",
  alternates: { canonical: "/saas-platform" },
};

export default function SaaSPlatformRoute() {
  return <SaaSPlatformPage />;
}
