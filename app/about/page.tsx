import type { Metadata } from "next";
import { PortfolioDetails } from "../components/portfolio/PortfolioDetails";

export const metadata: Metadata = {
  title: "About Noy Pangan | Experience & Skills",
  description:
    "The development experience and business background behind Noy Pangan’s work.",
};

export default function AboutPage() {
  return <PortfolioDetails view="about" />;
}
