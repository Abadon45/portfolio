import type { Metadata } from "next";
import SolarPage from "../components/solar/SolarPage";

export const metadata: Metadata = {
  title: "Cotabato Solar | Reliable Solar Solutions",
  description:
    "Professionally designed solar systems for homes and businesses in Cotabato and Mindanao.",
  alternates: { canonical: "/solar" },
  openGraph: {
    title: "Cotabato Solar | Reliable Solar Solutions",
    description:
      "Professionally designed solar systems for homes and businesses in Cotabato and Mindanao.",
    images: [{ url: "/images/portfolio/solar.webp", alt: "Cotabato Solar project" }],
    type: "website",
  },
};

export default function SolarRoute() {
  return <SolarPage />;
}
