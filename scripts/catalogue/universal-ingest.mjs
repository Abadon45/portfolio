import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { PlaywrightBrowserProvider } from "./browser-provider.mjs";
import { GenericBrowserProductExtractor } from "./generic-browser-extractor.mjs";
import { ProductDiscoveryQueue } from "./discovery-queue.mjs";
import { discoverNetworkCandidates } from "./network-discovery.mjs";
import { discoverSitemapCandidates } from "./sitemap-discovery.mjs";
import { discoverRawProductUrls } from "./raw-url-discovery.mjs";
import { parseProductUrl } from "./product-url-parsers.mjs";

const defaultUrl = "https://shopee.ph/avonbeautyph";
const sourceUrl = process.argv.find((argument) => argument.startsWith("http")) || defaultUrl;
const shouldImport = process.argv.includes("--import");
const discoverOnly = process.argv.includes("--discover-only");
const manualSeeds = process.argv.flatMap((argument, index) => argument === "--seed" ? [process.argv[index + 1]] : []).filter(Boolean);
const browserTimeout = Number(process.env.BROWSER_TIMEOUT || 30000);
const detailDelayMs = Number(process.env.DETAIL_DELAY_MS || 2500);
const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function slugify(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function asNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value || "").replace(/[^0-9.]+/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePrice(value) {
  const match = clean(value).match(/(?:₱|PHP|USD|\$|€|£)\s*[\d,]+(?:\.\d{1,2})?/i);
  if (!match) return { price: null, currency: null };
  return { price: asNumber(match[0]), currency: /₱|PHP/i.test(match[0]) ? "PHP" : "USD" };
}

function inferCategory(name, description) {
  const text = `${name} ${description || ""}`.toLowerCase();
  if (/perfume|fragrance|eau de toilette|eau de parfum|body mist|cologne/.test(text)) return "Beauty / Fragrance";
  if (/lipstick|lip balm|lip liner|foundation|powder|mascara|eyeliner|makeup/.test(text)) return "Beauty / Makeup";
  if (/shampoo|conditioner|hair|scalp/.test(text)) return "Beauty / Hair Care";
  if (/cream|lotion|serum|cleanser|skincare|skin care|moistur/.test(text)) return "Beauty / Skin Care";
  return "Beauty";
}

function parseEmbeddedJson(html) {
  const payloads = [];
  for (const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
    const content = match[1].trim();
    if (!content.startsWith("{") && !content.startsWith("[")) continue;
    try { payloads.push(JSON.parse(content)); } catch { /* unrelated script */ }
  }
  return payloads;
}

function collectProducts(value, results = []) {
  if (!value || typeof value !== "object") return results;
  if (Array.isArray(value)) { value.forEach((item) => collectProducts(item, results)); return results; }
  const record = value;
  const name = record.name || record.title || record.item_name;
  const id = record.itemid || record.itemId || record.product_id || record.id;
  if (name && id && (record.price !== undefined || record.price_min !== undefined || record.offers)) results.push(record);
  Object.values(record).forEach((item) => collectProducts(item, results));
  return results;
}

function parseJsonLd(html) {
  const products = [];
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      const records = Array.isArray(data) ? data : data["@graph"] || [data];
      products.push(...records.filter((record) => /Product/i.test(record?.["@type"] || "")));
    } catch { /* malformed structured data */ }
  }
  return products;
}

function normalize(raw, index, fetchedAt, method, fallbackUrl) {
  const sourceProductId = clean(raw.sourceProductId || raw.itemid || raw.itemId || raw.product_id || raw.id || raw.sku);
  const name = clean(raw.name || raw.title || raw.item_name);
  const sourceUrlValue = raw.sourceUrl || raw.url || fallbackUrl;
  if (!name || (!sourceProductId && !sourceUrlValue)) return null;
  const parsedPrice = parsePrice(raw.price ?? raw.price_min ?? raw.price_before_discount ?? raw.text);
  const imageUrls = [raw.image, raw.image_url, raw.cover, ...(raw.images || []).map((image) => typeof image === "string" ? image : image?.url)].filter(Boolean);
  const sourceSystem = parseProductUrl(sourceUrlValue)?.sourceSystem || raw.sourceSystem || "web";
  const description = raw.description || raw.description_1 || null;
  const inferredBrand = clean(raw.brand?.name || raw.brand) || (sourceSystem === "lazada" && (/^avon\b/i.test(name) || /lazada\.com\.ph\/shop\/avon-beauty/i.test(sourceUrl)) ? "Avon" : null);
  const inferredCategory = raw.category_name || raw.category || raw.categorySlugs?.[0] || inferCategory(name, description);
  return {
    sourceSystem,
    sourceProductId: sourceProductId || sourceUrlValue,
    sourceShopId: raw.sourceShopId || raw.shopId || null,
    sourceSku: raw.sourceSku || raw.sku || raw.item_sku || null,
    canonicalSku: raw.canonicalSku || null,
    slug: `${slugify(name)}-${slugify(sourceProductId || sourceUrlValue).slice(-48)}`,
    name,
    shortDescription: raw.shortDescription || null,
    description: description || `${name}. Product details are available on the source listing.`,
    brand: inferredBrand || clean(raw.description?.match(/\bBrand\s+([A-Za-z][A-Za-z0-9&.-]*)/i)?.[1] || raw.bodyText?.match(/\bBrand\s+([A-Za-z][A-Za-z0-9&.-]*)/i)?.[1]) || null,
    manufacturer: raw.manufacturer || null,
    productType: raw.productType || null,
    category: inferredCategory || raw.description?.match(/\bCategory\s+([^\n]+?)(?:\s+Brand\b|$)/i)?.[1] || "General",
    price: raw.price ?? parsePrice(`${raw.priceValue || ""} ${raw.bodyText || ""}`).price ?? parsedPrice.price,
    currency: raw.currency || parsedPrice.currency || "PHP",
    stock: raw.stock === undefined || raw.stock === null
      ? (sourceSystem === "lazada" ? 99 : null)
      : asNumber(raw.stock),
    images: [...new Map(imageUrls.map((url, imageIndex) => [url, { url, sourceSystem: "web", provider: raw.imageSource || "source", mediaType: "image", altText: name, isPrimary: imageIndex === 0, sortOrder: imageIndex, license: null }])).values()],
    variants: raw.variants || [],
    attributes: { availability: raw.availability || null, rating: raw.rating || null, enrichment: { brand: inferredBrand ? "title-prefix-or-source" : null, category: inferredCategory ? "term-mapping" : null, description: description ? "source" : "neutral-fallback" } },
    sourceUrl: sourceUrlValue,
    canonicalUrl: raw.canonicalUrl || sourceUrlValue,
    extractionMethod: method,
    sourceSnapshotAt: fetchedAt,
    contentHash: createHash("sha256").update(JSON.stringify(raw)).digest("hex"),
    sortOrder: index,
  };
}

function merge(listing, detail) {
  if (!detail) return listing;
  return { ...listing, ...Object.fromEntries(Object.entries(detail).filter(([, value]) => value !== null && value !== undefined && value !== "")), images: detail.images?.length ? detail.images : listing.images, sourceUrl: listing.sourceUrl || detail.sourceUrl, sourceProductId: listing.sourceProductId || detail.sourceProductId };
}

function isProductDetailUrl(value) {
  try {
    const parsed = new URL(value);
    return Boolean(parseProductUrl(value)) && (/\/products\/[^/]+-i\d+(?:-s\d+)?\.html/i.test(parsed.pathname) || /-i\.\d+\.\d+/i.test(parsed.pathname));
  } catch {
    return false;
  }
}

async function staticDiscover(html, fetchedAt) {
  const structured = parseEmbeddedJson(html).flatMap((payload) => collectProducts(payload));
  const jsonLd = parseJsonLd(html);
  const records = structured.map((record, index) => normalize(record, index, fetchedAt, "embedded-json", sourceUrl)).concat(jsonLd.map((record, index) => normalize(record, index, fetchedAt, "json-ld", sourceUrl))).filter(Boolean);
  const links = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]).filter((href) => /(?:\/i\.|\/product|\/products|\/item|\/p\/|\/goods|\/detail)/i.test(href));
  return { records, links: [...new Set(links)], rawCandidates: discoverRawProductUrls(html, { discoveredFrom: "raw-url" }) };
}

async function browserDiscover(fetchedAt) {
  const provider = new PlaywrightBrowserProvider({ timeout: browserTimeout });
  if (!(await provider.isAvailable())) return { status: "browser_unavailable", available: false, records: [], details: {} };
  let session;
  try {
    const networkResponses = [];
    session = await provider.open(sourceUrl, { onResponse: (response) => networkResponses.push(response) });
    await provider.waitForContent(session);
    const extractor = new GenericBrowserProductExtractor();
    const queue = new ProductDiscoveryQueue({ sourceSystem: "web", allowedHostname: new URL(sourceUrl).hostname });
    const seedUrls = [sourceUrl, ...manualSeeds];
    const knownProductPattern = /-i\.(\d+)\.(\d+)/i;
    for (const seedUrl of seedUrls) {
      const match = new URL(seedUrl).pathname.match(knownProductPattern);
      if (match) queue.add({ url: seedUrl, sourceProductId: match[2], discoveredFrom: "manual-seed", confidence: "high" });
    }
    const seedShopId = seedUrls.map((url) => parseProductUrl(url)?.sourceShopId).find(Boolean) || null;
    const networkCandidates = discoverNetworkCandidates(networkResponses, {
      shopId: seedShopId,
      buildProductUrl: (record) => {
        const shopId = record.shopid || record.shop_id || record.shopId;
        const itemId = record.itemid || record.itemId || record.product_id || record.productId;
        const seedMatch = new URL(manualSeeds[0] || sourceUrl).pathname.match(knownProductPattern);
        if (!shopId || !itemId || !seedMatch) return null;
        const path = new URL(manualSeeds[0] || sourceUrl).pathname.replace(/^[^/]+/, "").replace(/-i\.\d+\.\d+.*$/, "");
        return `${new URL(manualSeeds[0] || sourceUrl).origin}${path}-i.${shopId}.${itemId}`;
      },
    });
    const rawCandidates = staticResult.rawCandidates || [];
    [...rawCandidates, ...networkCandidates].forEach((candidate) => {
      if (seedShopId && candidate.sourceShopId && candidate.sourceShopId !== seedShopId) return;
      queue.add(candidate);
    });
    const sitemapDiscovered = isProductDetailUrl(sourceUrl) ? [] : (await discoverSitemapCandidates(sourceUrl, { urlPattern: /product|item|goods|detail|\/i\./i })).filter((candidate) => parseProductUrl(candidate.url));
    const sitemapCandidates = /\/shop\//i.test(new URL(sourceUrl).pathname) ? [] : sitemapDiscovered;
    sitemapCandidates.forEach((candidate) => queue.add(candidate));
    const discoveredCandidates = [...queue.items];
    const seedRecords = [];
    const seedDetailUrls = seedUrls.filter((url) => isProductDetailUrl(url) && (!seedShopId || parseProductUrl(url)?.sourceShopId === seedShopId));
    const rejectedSeedCount = seedUrls.filter((url) => isProductDetailUrl(url) && seedShopId && parseProductUrl(url)?.sourceShopId !== seedShopId).length;
    const discoverySummary = { network: networkCandidates.length, rawUrls: rawCandidates.length, sitemap: sitemapCandidates.length, sitemapDiscovered: sitemapDiscovered.length, queue: discoveredCandidates.length, duplicatesSkipped: queue.duplicatesSkipped, wrongShopRejected: rejectedSeedCount + [...rawCandidates, ...networkCandidates].filter((candidate) => seedShopId && candidate.sourceShopId && candidate.sourceShopId !== seedShopId).length, pagesProcessed: 1, networkResponses: networkResponses.length };
    for (const seedUrl of seedDetailUrls.slice(0, Number(process.env.MAX_DETAIL_PAGES || 100))) {
      try {
        const seedPage = seedUrl === sourceUrl ? session.page : await session.context.newPage();
        if (seedPage !== session.page) await seedPage.goto(seedUrl, { waitUntil: "domcontentloaded", timeout: browserTimeout });
        await provider.waitForContent({ page: seedPage }, { timeout: 10000 });
        const seedDetail = await extractor.extractProductPage(seedPage, seedUrl);
        const normalizedSeed = normalize(seedDetail, seedRecords.length, fetchedAt, "detail-page", seedUrl);
        if (normalizedSeed) seedRecords.push(normalizedSeed);
        const related = await extractor.discoverRelatedLinks(seedPage, seedUrl);
        related.forEach((candidate) => queue.add({ url: candidate.url, discoveredFrom: "related-product", confidence: "medium", depth: 1 }));
        if (seedPage !== session.page) await seedPage.close();
      } catch {
        // Continue through the remaining seed/detail candidates.
      }
    }
    if (isProductDetailUrl(sourceUrl)) {
      const detail = await extractor.extractProductPage(session.page, sourceUrl);
      return { status: detail.name ? "success" : "no_products_visible", available: true, records: [normalize(detail, 0, fetchedAt, "detail-page", sourceUrl)].filter(Boolean), candidates: discoveredCandidates, details: { ...discoverySummary, detailPages: 1, detailFailures: detail.name ? 0 : 1, error: detail.name ? null : "Lazada detail page did not expose product content in the permitted browser session." } };
    }
    const maxPages = Number(process.env.MAX_PAGES || 20);
    const pageUrls = new Set([session.page.url()]);
    const allCards = [];
    let totalScrolls = 0;
    for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
      const expanded = await extractor.expandListing(session.page);
      totalScrolls += expanded.scrolls;
      allCards.push(...expanded.products);
      const pagination = await extractor.discoverPagination(session.page);
      const nextPage = pagination.find((candidate) => {
        if (!candidate.url || pageUrls.has(candidate.url)) return false;
        return /next|page=|\/page\/|cursor/i.test(`${candidate.label} ${candidate.url}`);
      });
      if (!nextPage) break;
      pageUrls.add(nextPage.url);
      await session.page.goto(nextPage.url, { waitUntil: "domcontentloaded", timeout: browserTimeout });
      await provider.waitForContent(session);
    }
    const allNormalizedCards = [...new Map(allCards.map((record) => [record.sourceUrl, record]))].map(([, record], index) => normalize(record, index, fetchedAt, "dom-anchor", sourceUrl)).filter(Boolean);
    const resolvedShopId = seedShopId || allNormalizedCards.map((card) => card.sourceShopId).find(Boolean) || null;
    const cards = allNormalizedCards.filter((card) => !resolvedShopId || !card.sourceShopId || card.sourceShopId === resolvedShopId);
    cards.forEach((card) => queue.add({ url: card.sourceUrl, sourceProductId: card.sourceProductId, sourceShopId: card.sourceShopId, discoveredFrom: "dom-anchor", confidence: "high" }));
    const relatedLinks = await extractor.discoverRelatedLinks(session.page, session.page.url());
    relatedLinks.forEach((candidate) => queue.add({ url: candidate.url, discoveredFrom: "related-product", confidence: "medium" }));
    if (discoverOnly) return { status: cards.length || seedRecords.length ? "success" : "no_products_discovered", available: true, records: seedRecords, candidates: [...queue.items], details: { ...discoverySummary, targetShopId: resolvedShopId, domAnchorsScanned: extractor.lastDomMetrics?.anchorsScanned || 0, productUrlsFound: extractor.lastDomMetrics?.productUrlsFound || 0, seedDetails: seedRecords.length, related: relatedLinks.length } };
    const merged = [...seedRecords];
    let detailFailures = 0;
    let detailChallengeDetected = false;
    for (const [detailIndex, card] of cards.slice(0, extractor.maxDetailPages).entries()) {
      try {
        if (merged.length > seedRecords.length) await wait(detailDelayMs);
        const detailPage = await session.context.newPage();
        await detailPage.goto(card.sourceUrl, { waitUntil: "domcontentloaded", timeout: browserTimeout });
        await provider.waitForContent({ page: detailPage }, { timeout: 10000 });
        const challengeText = clean(await detailPage.locator("body").innerText().catch(() => ""));
        if (/_____tmd_____|captcha|verify you are human|security check|punish/i.test(`${detailPage.url()} ${challengeText}`)) {
          detailChallengeDetected = true;
          detailFailures += 1;
          merged.push(card, ...cards.slice(detailIndex + 1));
          await detailPage.close();
          break;
        }
        const detailRecord = normalize(await extractor.extractProductPage(detailPage, card.sourceUrl), card.sortOrder, fetchedAt, "detail-page", card.sourceUrl);
        if (!detailRecord) detailFailures += 1;
        merged.push(merge(card, detailRecord));
        await detailPage.close();
      } catch { detailFailures += 1; merged.push(card); }
    }
    return { status: detailChallengeDetected ? "partial_detail_challenge" : merged.length ? "success" : "no_products_visible", available: true, records: merged, candidates: [...queue.items], details: { ...discoverySummary, targetShopId: resolvedShopId, domAnchorsScanned: extractor.lastDomMetrics?.anchorsScanned || 0, productUrlsFound: extractor.lastDomMetrics?.productUrlsFound || 0, wrongShopRejected: (discoverySummary.wrongShopRejected || 0) + (allNormalizedCards.length - cards.length), pages: pageUrls.size, scrolls: totalScrolls, detailPages: Math.min(cards.length, extractor.maxDetailPages), detailFailures, detailChallengeDetected, detailDelayMs, discoveredCards: allCards.length, validCards: cards.length, related: relatedLinks.length } };
  } catch (error) {
    return { status: /captcha|login|forbidden|blocked|access/i.test(error.message) ? "inaccessible" : "extraction_failed", available: true, records: [], details: { error: error.message } };
  } finally { await provider.close(session); }
}

async function importProducts(products) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required with --import.");
  const sql = neon(databaseUrl);
  let imported = 0;
  for (const product of products) {
    if (!product.price || !product.sourceProductId) continue;
    const images = product.images.map((image) => image.url);
    const imageSources = product.images.map((image) => ({ url: image.url, source: image.provider === "blob" ? "blob" : "external", alt_text: image.altText, is_primary: image.isPrimary, sort_order: image.sortOrder }));
    await sql`
      insert into saas_demo.store_products (slug, sku, brand, name, category_1, category_2, category, shop, customer_price, description_1, images, image_sources, source_quantity, stock, source_product_id, source_snapshot_at, status, currency, sort_order)
      values (${product.slug}, ${product.sourceSku || `${product.sourceSystem}-${product.sourceProductId}`}, ${product.brand}, ${product.name}, ${product.category || "general"}, ${product.category || "general"}, ${product.category || "General"}, ${product.sourceSystem === "lazada" ? "Avon Beauty" : product.sourceSystem}, ${product.price}, ${product.description || product.shortDescription || product.name}, ${JSON.stringify(images)}::jsonb, ${JSON.stringify(imageSources)}::jsonb, ${product.stock || 0}, ${product.stock}, ${product.sourceProductId}, ${product.sourceSnapshotAt}, 'active', ${product.currency}, ${product.sortOrder})
      on conflict (slug) do update set sku = excluded.sku, brand = excluded.brand, name = excluded.name, customer_price = excluded.customer_price, description_1 = excluded.description_1, images = excluded.images, image_sources = excluded.image_sources, source_product_id = excluded.source_product_id, source_snapshot_at = excluded.source_snapshot_at, updated_at = now()
    `;
    imported += 1;
  }
  return imported;
}

const fetchedAt = new Date().toISOString();
const response = await fetch(sourceUrl, { headers: { accept: "text/html,application/xhtml+xml", "user-agent": "Mozilla/5.0 (compatible; ProductCatalogue/1.0)" } });
if (!response.ok) throw new Error(`Source returned HTTP ${response.status}.`);
const staticResult = await staticDiscover(await response.text(), fetchedAt);
let records = staticResult.records;
let status = records.length ? "success" : "requires_browser";
let browserResult = { status: "not_attempted", records: [], details: {} };
if (!records.length) { browserResult = await browserDiscover(fetchedAt); records = browserResult.records; status = browserResult.status; }
const discoveredBeforeDeduplication = records.length;
records = [...new Map(records.map((product) => [product.sourceProductId, product])).values()];
const imported = shouldImport && !discoverOnly && status === "success" ? await importProducts(records) : 0;
const report = { source: sourceUrl, sourceSystem: "web", status, fetchedAt, initialExtraction: staticResult.records.length ? "static" : "none", browserFallback: browserResult.status, browserAttempted: browserResult.status !== "not_attempted", browserAvailable: browserResult.available ?? null, browserUsed: browserResult.status === "success", discovery: browserResult.details || {}, candidates: browserResult.candidates || [], pagesProcessed: browserResult.details.pages || 1, detailPagesProcessed: browserResult.details.detailPages || 0, productsDiscovered: records.length, productsBeforeDeduplication: discoveredBeforeDeduplication, duplicatesSkipped: Math.max(browserResult.details.duplicatesSkipped || 0, discoveredBeforeDeduplication - records.length), productsNormalized: records.length, productsImported: imported, images: records.reduce((count, product) => count + product.images.length, 0), fieldSources: records[0] ? { title: records[0].extractionMethod, description: records[0].description ? records[0].extractionMethod : "none", images: records[0].images.length ? records[0].extractionMethod : "none", brand: records[0].brand ? records[0].extractionMethod : "none", price: records[0].price ? records[0].extractionMethod : "none" } : {}, warnings: [...(status === "requires_browser" ? ["Static extraction found no products; browser rendering is required."] : []), ...(browserResult.details.detailFailures ? [`${browserResult.details.detailFailures} product detail pages did not expose usable product content.`] : []), ...(browserResult.details.detailChallengeDetected ? ["Lazada presented an anti-bot challenge; detail crawling stopped to avoid repeated retries."] : [])], errors: browserResult.details.error ? [browserResult.details.error] : [], products: records };
await writeFile(".catalogue-preview.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, products: records.slice(0, 5) }, null, 2));
if (process.argv.includes("--debug-discovery")) {
  console.error(JSON.stringify({ domAnchorsScanned: report.discovery.domAnchorsScanned || 0, productUrlsFound: report.discovery.productUrlsFound || 0, samples: report.candidates.slice(0, 5) }, null, 2));
}
