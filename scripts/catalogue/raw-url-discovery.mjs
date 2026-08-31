import { parseProductUrl } from "./product-url-parsers.mjs";

const URL_PATTERN = /https?:[\\/\\w.%?=&+#:-]+/gi;

export function discoverRawProductUrls(text, options = {}) {
  const candidates = [];
  const seen = new Set();
  const values = String(text || "").replaceAll("\\/", "/").match(URL_PATTERN) || [];
  for (const value of values) {
    const parsed = parseProductUrl(value.replace(/["'<>),;]+$/g, ""));
    if (!parsed || seen.has(parsed.canonicalUrl)) continue;
    if (options.shopId && parsed.sourceShopId !== String(options.shopId)) continue;
    seen.add(parsed.canonicalUrl);
    candidates.push({ url: parsed.canonicalUrl, sourceProductId: parsed.sourceProductId, sourceShopId: parsed.sourceShopId, discoveredFrom: options.discoveredFrom || "raw-url", confidence: options.confidence || "high" });
  }
  return candidates;
}
