import assert from "node:assert/strict";
import { chromium } from "playwright";
import { GenericBrowserProductExtractor } from "./generic-browser-extractor.mjs";

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto("https://shopee.ph/", { waitUntil: "domcontentloaded" });
  await page.setContent(`
    <a class="contents" href="/-EXCLUSIVE-BUNDLE-Avon-Fresh-Fierce-Perfect-Nonsense-Choco-Tuberose-EDP-Ultra-Matte-Lipstick-i.423937044.56402271682?extraParams=%7B%22display_model_id%22%3A420219827474%7D">
      <img src="https://down-ph.img.susercontent.com/file/ph-11134207-81ztj-mhriu36snq4l00" alt="[EXCLUSIVE BUNDLE] Avon Fresh &amp; Fierce - Perfect Nonsense Choco Tuberose EDP + Ultra Matte Lipstick">
      <span>₱1,301</span><span>Sold Out</span>
    </a>
  `, { waitUntil: "domcontentloaded" });
  const products = await new GenericBrowserProductExtractor().extractListing(page);
  assert.equal(products.length, 1);
  assert.equal(products[0].sourceProductId, "56402271682");
  assert.equal(products[0].sourceShopId, "423937044");
  assert.equal(products[0].price, 1301);
  assert.equal(products[0].currency, "PHP");
  assert.equal(products[0].availability, "out_of_stock");
  assert.match(products[0].name, /Perfect Nonsense Choco Tuberose/);
  assert.match(products[0].image, /ph-11134207-81ztj-mhriu36snq4l00/);
  console.log(JSON.stringify({ status: "passed", products }, null, 2));
} finally {
  await browser.close();
}
