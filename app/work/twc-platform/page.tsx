import type { Metadata } from "next";
import { TwcPlatformCaseStudy } from "./TwcPlatformCaseStudy";

export const metadata: Metadata = {
  title: "TWC Platform Case Study | Noy Pangan",
  description:
    "Production experience building a Next.js frontend and integrating Django APIs across commerce, member, supplier, affiliate, and distributor workflows.",
  alternates: { canonical: "/work/twc-platform" },
  openGraph: {
    title: "TWC Platform Case Study | Noy Pangan",
    description:
      "Frontend architecture and API integration for a large commerce platform, with my role and portfolio reconstruction clearly separated.",
    images: [
      {
        url: "/images/portfolio/store.webp",
        alt: "Portfolio reconstruction of a commerce storefront",
      },
    ],
    type: "article",
  },
};

export default function TwcPlatformCaseStudyPage() {
  return <TwcPlatformCaseStudy />;
}
