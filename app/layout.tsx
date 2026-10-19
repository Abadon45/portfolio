import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";
import { getSiteUrl } from "../lib/siteUrl";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Emmanuel Noy Pangan | Full Stack Web Developer",
  description:
    "Portfolio and resume for Emmanuel Noy Pangan, a Full Stack Web Developer focused on frontend architecture for large-scale SaaS and e-commerce platforms.",
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "Emmanuel Noy Pangan",
    title: "Emmanuel Noy Pangan | Full Stack Web Developer",
    description:
      "Frontend architecture and customer experiences for large-scale SaaS and e-commerce platforms, with Next.js, React, TypeScript, and Django.",
    images: [
      {
        url: "/images/portfolio/commerce.webp",
        alt: "Commerce platform portfolio project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Noy Pangan | Full Stack Web Developer",
    description:
      "Frontend architecture and customer experiences for large-scale SaaS and e-commerce platforms, with Next.js, React, TypeScript, and Django.",
    images: ["/images/portfolio/commerce.webp"],
  },
  robots: { index: true, follow: true },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Emmanuel Noy Pangan",
              url: getSiteUrl(),
              jobTitle: "Full Stack Web Developer",
              email: "mailto:noypangan5@gmail.com",
              sameAs: [
                "https://github.com/Abadon45",
                "https://linkedin.com/in/emmanuel-pangan-071502a7",
              ],
            }),
          }}
        />
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
