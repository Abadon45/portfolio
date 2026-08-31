import { parseProductUrl } from "./product-url-parsers.mjs";

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function absoluteUrl(value, baseUrl) {
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return null;
  }
}

function priceFromText(value) {
  const match = compact(value).match(/(?:₱|PHP|USD|\$|€|£)\s*[\d,]+(?:\.\d{1,2})?/i);
  if (!match) return { price: null, currency: null };
  const currency = /₱|PHP/i.test(match[0]) ? "PHP" : /€/.test(match[0]) ? "EUR" : /£/.test(match[0]) ? "GBP" : "USD";
  const price = Number(match[0].replace(/[^\d.]/g, ""));
  return { price: Number.isFinite(price) ? price : null, currency };
}

function sourceFromUrl(url) {
  const parsedProduct = parseProductUrl(url);
  if (parsedProduct) return parsedProduct.sourceProductId;
  try {
    const parsed = new URL(url);
    const itemMatch = parsed.pathname.match(/-i\.(\d+)\.(\d+)/i);
    return itemMatch?.[2] || parsed.pathname;
  } catch {
    return url;
  }
}

export class GenericBrowserProductExtractor {
  constructor(options = {}) {
    this.maxScrolls = options.maxScrolls || Number(process.env.MAX_SCROLLS || 8);
    this.maxProducts = options.maxProducts || Number(process.env.MAX_PRODUCTS || 100);
    this.maxDetailPages = options.maxDetailPages || Number(process.env.MAX_DETAIL_PAGES || 100);
  }

  async extractListing(page) {
    const baseUrl = /^https?:/i.test(page.url()) ? page.url() : "https://catalogue.invalid/";
    const anchors = await page.evaluate(({ baseUrl }) => {
      const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
      const results = [];
      for (const anchor of Array.from(document.querySelectorAll("a[href]"))) {
        const href = new URL(anchor.getAttribute("href"), baseUrl).href;
        const image = anchor.querySelector("img") || anchor.closest("article, li, [role=article], div")?.querySelector("img");
        const text = clean(anchor.innerText || anchor.getAttribute("aria-label") || anchor.getAttribute("title"));
        const nearby = clean(anchor.closest("article, li, [role=article], div")?.innerText || text);
        results.push({
          sourceUrl: href,
          name: text || clean(image?.alt) || nearby.split("\n")[0],
          image: image?.currentSrc || image?.src || image?.getAttribute("data-src") || null,
          imageAlt: image?.alt || null,
          text: nearby,
        });
      }
      return results;
    }, { baseUrl });
    this.lastDomMetrics = { anchorsScanned: anchors.length };

    const seen = new Set();
    const products = anchors.flatMap((candidate, index) => {
      const parsed = parseProductUrl(candidate.sourceUrl);
      if (!parsed || seen.has(parsed.canonicalUrl)) return [];
      seen.add(parsed.canonicalUrl);
      const title = candidate.imageAlt && !/rating|star|flag|icon/i.test(candidate.imageAlt)
        ? candidate.imageAlt
        : candidate.name;
      return [{
        ...candidate,
        ...parsed,
        sourceUrl: parsed.canonicalUrl,
        name: title,
        sourceShopId: parsed.sourceShopId,
        ...priceFromText(candidate.text),
        availability: /sold out|out of stock|unavailable/i.test(candidate.text) ? "out_of_stock" : "active",
        sortOrder: index,
        extractionMethod: "dom-anchor",
      }];
    }).filter((candidate) => candidate.name && candidate.sourceUrl).slice(0, this.maxProducts);
    this.lastDomMetrics.productUrlsFound = products.length;
    return products;
  }

  async extractProductPage(page, sourceUrl) {
    await page.evaluate(() => window.scrollTo(0, Math.min(window.innerHeight * 2, document.body.scrollHeight)));
    await page.waitForTimeout(450);
    const raw = await page.evaluate(() => {
      const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
      const imageCandidates = (element) => [
        element.currentSrc,
        element.src,
        element.getAttribute("data-src"),
        element.getAttribute("data-lazy-src"),
        element.getAttribute("data-original"),
        element.getAttribute("data-image"),
        ...(element.getAttribute("srcset") || "").split(",").map((item) => item.trim().split(/\s+/)[0]),
      ].filter(Boolean);
      const visible = (selector) => {
        const element = document.querySelector(selector);
        return element && element.getBoundingClientRect().width > 0 ? clean(element.innerText || element.getAttribute("content")) : "";
      };
      const descriptionLabels = /description|product details|details|overview|about this product|features|specifications/i;
      const descriptionNode = Array.from(document.querySelectorAll("section, article, div, [role=tabpanel]")).find((element) => descriptionLabels.test(clean(element.innerText).slice(0, 120)));
      const images = Array.from(document.querySelectorAll("img, picture source"))
        .flatMap((element) => imageCandidates(element).map((url) => ({ url, altText: element.alt || null })));
      const bodyText = clean(document.body?.innerText);
      const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .flatMap((script) => {
          try {
            const parsed = JSON.parse(script.textContent || "null");
            return Array.isArray(parsed) ? parsed : parsed?.["@graph"] || [parsed];
          } catch {
            return [];
          }
        })
        .find((record) => /Product/i.test(record?.["@type"] || ""));
      const skuMatch = bodyText.match(/(?:SKU|model|item\s*id)\s*[:#-]?\s*([A-Za-z0-9._-]{3,})/i);
      return {
        name: visible("h1") || visible("[itemprop=name]") || jsonLd?.name || clean(document.title),
        description: clean(descriptionNode?.innerText) || visible("[itemprop=description]") || jsonLd?.description || null,
        brand: visible("[itemprop=brand]") || jsonLd?.brand?.name || jsonLd?.brand || null,
        sku: visible("[itemprop=sku]") || visible('meta[name="sku"]') || jsonLd?.sku || skuMatch?.[1] || null,
        priceValue: visible("[itemprop=price], meta[itemprop=price], [data-testid*=price i]"),
        priceText: Array.from(document.querySelectorAll("[itemprop=price], meta[itemprop=price], [data-testid*=price i]"))
          .map((element) => clean(element.innerText || element.getAttribute("content")))
          .filter(Boolean)
          .join(" "),
        availability: visible("[itemprop=availability]") || null,
        bodyText,
        images,
      };
    });
    return {
      ...raw,
      sourceUrl,
      sourceProductId: sourceFromUrl(sourceUrl),
      ...priceFromText(`${raw.priceValue} ${raw.priceText} ${raw.bodyText}`),
        images: [...new Map(raw.images
        .filter((image) => image.url && !/^data:/i.test(image.url) && !/logo|icon|sprite|favicon|tracking|banner|avatar/i.test(`${image.url} ${image.altText || ""}`))
        .map((image) => [image.url.split("@resize_")[0].replace(/[?&](?:x-oss-process|quality|width|height)=[^&]+/gi, ""), { ...image, url: image.url.split("@resize_")[0].replace(/[?&](?:x-oss-process|quality|width|height)=[^&]+/gi, "") }]))
        .values()].slice(0, Number(process.env.MAX_PRODUCT_IMAGES || 10)),
      extractionMethod: "detail-page",
    };
  }

  async discoverPagination(page) {
    return page.evaluate(() => Array.from(document.querySelectorAll("a[href]"))
      .filter((link) => /next|more|page=|\/page\/|cursor/i.test(`${link.innerText} ${link.href}`))
      .map((link) => ({ label: link.innerText.trim(), url: link.href }))
      .slice(0, 20));
  }

  async discoverRelatedLinks(page, baseUrl) {
    return page.evaluate((input) => Array.from(document.querySelectorAll("a[href]"))
      .map((link) => ({ url: new URL(link.getAttribute("href"), input).href, label: (link.innerText || link.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim() }))
      .filter((link) => /-i\.\d+\.\d+/i.test(new URL(link.url).pathname) || (/similar|recommend|related|more from/i.test(link.label) && !/search|login|signup|seller/i.test(link.url)))
      .slice(0, 100), baseUrl);
  }

  async expandListing(page) {
    const known = new Set();
    let scrolls = 0;
    for (; scrolls < this.maxScrolls; scrolls += 1) {
      const before = known.size;
      const clicked = await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll("button, a")).find((element) => /load more|show more|view more|see more|more products/i.test(element.innerText || ""));
        if (!button) return false;
        button.click();
        return true;
      });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(700);
      const current = await this.extractListing(page);
      current.forEach((product) => known.add(product.sourceUrl));
      if (!clicked && known.size === before) break;
    }
    return { scrolls, products: await this.extractListing(page) };
  }
}
