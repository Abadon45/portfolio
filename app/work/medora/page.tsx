import type { Metadata } from "next";
import { MedoraCaseStudy } from "./MedoraCaseStudy";

export const metadata: Metadata = {
  title: "Medora Project Audit | Noy Pangan",
  description: "A product audit of Medora, a doctor-discovery directory for the Philippines.",
  alternates: { canonical: "/work/medora" },
  openGraph: {
    title: "Medora Project Audit | Noy Pangan",
    description: "A review of Medora's doctor discovery, specialty browsing, profiles, and clinic directory.",
    type: "article",
  },
};

export default function MedoraCaseStudyPage() {
  return <MedoraCaseStudy />;
}
