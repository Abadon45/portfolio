function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "extraParams"].forEach((key) => url.searchParams.delete(key));
    return url.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

export class ProductDiscoveryQueue {
  constructor(options = {}) {
    this.sourceSystem = options.sourceSystem || "web";
    this.allowedHostname = options.allowedHostname || null;
    this.maxProducts = options.maxProducts || Number(process.env.MAX_PRODUCTS || 1000);
    this.items = [];
    this.seen = new Set();
    this.processed = new Set();
    this.duplicatesSkipped = 0;
    this.bySource = {};
  }

  add(candidate) {
    const url = normalizeUrl(candidate.url);
    if (!url || this.items.length + this.processed.size >= this.maxProducts) return false;
    if (this.allowedHostname && new URL(url).hostname !== this.allowedHostname) return false;
    const sourceProductId = candidate.sourceProductId ? String(candidate.sourceProductId) : null;
    const key = sourceProductId ? `${this.sourceSystem}:id:${sourceProductId}` : `${this.sourceSystem}:url:${url}`;
    if (this.seen.has(key) || this.items.some((item) => item.url === url) || [...this.processed].some((item) => item === key)) {
      this.duplicatesSkipped += 1;
      return false;
    }
    const item = { ...candidate, sourceSystem: this.sourceSystem, sourceProductId, url, confidence: candidate.confidence || "medium", depth: candidate.depth || 0, parentUrl: candidate.parentUrl || null };
    this.items.push(item);
    this.seen.add(key);
    this.bySource[item.discoveredFrom || "unknown"] = (this.bySource[item.discoveredFrom || "unknown"] || 0) + 1;
    return true;
  }

  next() {
    const item = this.items.shift();
    if (!item) return null;
    const key = item.sourceProductId ? `${this.sourceSystem}:id:${item.sourceProductId}` : `${this.sourceSystem}:url:${item.url}`;
    this.processed.add(key);
    return item;
  }

  get size() { return this.items.length; }
  get processedCount() { return this.processed.size; }
}
