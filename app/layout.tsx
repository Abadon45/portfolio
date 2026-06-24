import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emmanuel Noy Pangan | Full Stack Web Developer",
  description:
    "Portfolio and resume for Emmanuel Noy Pangan, a Full Stack Web Developer specializing in Next.js, React, TypeScript, and Django.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
