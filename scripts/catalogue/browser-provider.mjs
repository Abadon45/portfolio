import { chromium } from "playwright";

const DEFAULT_TIMEOUT = Number(process.env.BROWSER_TIMEOUT || 30000);

export class PlaywrightBrowserProvider {
  constructor(options = {}) {
    this.headless = options.headless ?? true;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
  }

  async isAvailable() {
    let browser;
    try {
      browser = await chromium.launch({ headless: this.headless });
      return true;
    } catch {
      return false;
    } finally {
      await browser?.close();
    }
  }

  async open(url, options = {}) {
    const browser = await chromium.launch({ headless: this.headless });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      locale: "en-PH",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/151 Safari/537.36",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(this.timeout);
    const networkResponses = [];
    page.on("response", async (response) => {
      const contentType = response.headers()["content-type"] || "";
      if (!/json|graphql|javascript|html|text/i.test(contentType) && !/api|graphql|product|item|shop|search/i.test(response.url())) return;
      if (networkResponses.length >= Number(process.env.MAX_NETWORK_RESPONSES || 500)) return;
      try {
        const body = await response.text();
        if (body.length > 5_000_000) return;
        networkResponses.push({
          url: response.url(),
          status: response.status(),
          contentType,
          body,
        });
        options.onResponse?.(networkResponses.at(-1));
      } catch {
        // Some responses cannot be read after the page closes.
      }
    });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: this.timeout });
    return { browser, context, page, url, networkResponses };
  }

  async waitForContent(session, options = {}) {
    const timeout = options.timeout || this.timeout;
    const startedAt = Date.now();
    try {
      await session.page.waitForFunction(() => {
        const text = document.body?.innerText || "";
        const links = Array.from(document.querySelectorAll("a[href]"));
        const images = document.querySelectorAll("img").length;
        return links.some((link) => /(?:\/i\.|\/product|\/products|\/item|\/p\/|\/goods|\/detail)/i.test(link.href)) ||
          images > 3 || /product|shop|catalog|category|vacation|loading/i.test(text);
      }, { timeout });
    } catch {
      // Browser readiness is a source status, not a process-fatal error.
    }
    return { waitedMs: Date.now() - startedAt };
  }

  async close(session) {
    await session?.context?.close();
    await session?.browser?.close();
  }
}
