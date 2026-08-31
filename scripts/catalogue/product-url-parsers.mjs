export function parseShopeeProductUrl(value) {
  let url;
  try { url = new URL(value); } catch { return null; }
  const match = url.pathname.match(/-i\.(\d+)\.(\d+)/i);
  if (!match || !/(?:www\.)?shopee\.[^/]+$/i.test(url.hostname)) return null;
  url.hash = "";
  ["extraParams", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => url.searchParams.delete(key));
  return { sourceSystem: "shopee", sourceProductId: match[2], sourceShopId: match[1], canonicalUrl: url.href };
}

export function parseProductUrl(value) {
  return parseShopeeProductUrl(value) || parseLazadaProductUrl(value);
}

export function parseLazadaProductUrl(value) {
  let url;
  try { url = new URL(value); } catch { return null; }
  if (!/(?:www\.)?lazada\.[^/]+$/i.test(url.hostname)) return null;
  const match = url.pathname.match(/\/products\/[^/]+-i(\d+)(?:-s\d+)?\.html/i);
  if (!match) return null;
  url.hash = "";
  [...url.searchParams.keys()].forEach((key) => url.searchParams.delete(key));
  return { sourceSystem: "lazada", sourceProductId: match[1], sourceShopId: null, canonicalUrl: url.href };
}
