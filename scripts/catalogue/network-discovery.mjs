const ID_KEYS = ["itemid", "itemId", "product_id", "productId", "productID", "sku"];
const NAME_KEYS = ["name", "title", "item_name", "product_name"];
const URL_KEYS = ["url", "product_url", "productUrl", "item_url", "link"];
import { discoverRawProductUrls } from "./raw-url-discovery.mjs";

function valueFrom(record, keys) {
  for (const key of keys) if (record[key] !== undefined && record[key] !== null && record[key] !== "") return record[key];
  return null;
}

export function discoverNetworkCandidates(responses, options = {}) {
  const candidates = [];
  for (const response of responses) {
    candidates.push(...discoverRawProductUrls(response.body, { discoveredFrom: "network", shopId: options.shopId }));
    let payload;
    try { payload = JSON.parse(response.body); } catch { continue; }
    walk(payload, response, candidates, options, 0);
  }
  return candidates;
}

function walk(value, response, candidates, options, depth) {
  if (depth > 20 || !value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, response, candidates, options, depth + 1));
    return;
  }
  const record = value;
  const id = valueFrom(record, ID_KEYS);
  const name = valueFrom(record, NAME_KEYS);
  const url = valueFrom(record, URL_KEYS);
  const image = record.image || record.image_url || record.cover;
  const price = record.price ?? record.price_min ?? record.price_before_discount;
  const productIdentity = record.itemid || record.itemId || record.product_id || record.productId || record.sku;
  const productEvidence = productIdentity && (record.price !== undefined || record.price_min !== undefined || record.image || record.image_url || record.product_url || record.item_url);
  const signalCount = [id, name, url, image, price, record.shop_id, record.shopId].filter(Boolean).length;
  if (productEvidence && signalCount >= 2 && (id || url) && (name || image || price)) {
    candidates.push({
      url: url ? new URL(String(url), response.url).href : options.buildProductUrl?.(record),
      sourceProductId: id ? String(id) : null,
      name: name ? String(name) : null,
      image,
      price,
      discoveredFrom: "network",
      confidence: signalCount >= 4 ? "high" : "medium",
      responseUrl: response.url,
      raw: record,
    });
  }
  Object.values(record).forEach((item) => walk(item, response, candidates, options, depth + 1));
}
