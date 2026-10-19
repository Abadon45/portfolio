const productionOrigin = "https://emmanuelpanganportfolio.vercel.app";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    try {
      const parsedUrl = new URL(configuredUrl);
      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        throw new Error("Unsupported URL protocol.");
      }
      return parsedUrl.origin;
    } catch {
      throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTP(S) URL.");
    }
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return productionOrigin;
}
