import type { Metadata } from "next";
import { PortfolioDetails } from "../components/portfolio/PortfolioDetails";

export const metadata: Metadata = {
  title: "Selected Work | Noy Pangan",
  description:
    "Explore web applications, storefronts, and business websites by Noy Pangan.",
};

export default function WorkPage() {
  return <PortfolioDetails view="work" />;
}
