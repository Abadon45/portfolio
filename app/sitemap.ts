import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/siteUrl";

const publicRoutes = [
  "",
  "/about",
  "/privacy",
  "/work",
  "/solar",
  "/nightcurrent",
  "/saas-platform/landing",
  "/twc-ecommerce",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
