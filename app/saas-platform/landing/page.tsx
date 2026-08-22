import type { Metadata } from "next";
import SaaSLandingPage from "../_components/SaaSLandingPage";

export const metadata: Metadata = {
  title: "Northstar Commerce | One workspace for modern commerce",
  description:
    "Explore Northstar Commerce, a portfolio-built operating system for products, customers, workflows, and business performance.",
  alternates: { canonical: "/saas-platform/landing" },
  openGraph: {
    title: "Northstar Commerce | One workspace for modern commerce",
    description:
      "A focused commerce operating system for teams that want connected workflows and clearer decisions.",
    type: "website",
  },
};

export default function SaaSLandingRoute() {
  return <SaaSLandingPage />;
}
