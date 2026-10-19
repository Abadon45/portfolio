import assert from "node:assert/strict";
import test from "node:test";
import { getSiteUrl } from "../lib/siteUrl.ts";
import { publicRoutes } from "../lib/publicRoutes.ts";

const originalEnvironment = {
  configuredUrl: process.env.NEXT_PUBLIC_SITE_URL,
  nodeEnv: process.env.NODE_ENV,
  vercelUrl: process.env.VERCEL_URL,
};

function restoreEnvironment() {
  for (const [key, value] of Object.entries({
    NEXT_PUBLIC_SITE_URL: originalEnvironment.configuredUrl,
    NODE_ENV: originalEnvironment.nodeEnv,
    VERCEL_URL: originalEnvironment.vercelUrl,
  })) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

test("configured site URL is normalized to an origin", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://portfolio.example/path/";
  process.env.NODE_ENV = "production";

  assert.equal(getSiteUrl(), "https://portfolio.example");
  restoreEnvironment();
});

test("configured site URL rejects invalid and non-HTTP protocols", () => {
  process.env.NODE_ENV = "production";
  process.env.NEXT_PUBLIC_SITE_URL = "not-a-url";
  assert.throws(() => getSiteUrl(), /absolute HTTP\(S\) URL/);

  process.env.NEXT_PUBLIC_SITE_URL = "ftp://portfolio.example";
  assert.throws(() => getSiteUrl(), /absolute HTTP\(S\) URL/);
  restoreEnvironment();
});

test("development without a configured URL uses localhost", () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.VERCEL_URL;
  process.env.NODE_ENV = "development";

  assert.equal(getSiteUrl(), "http://localhost:3000");
  restoreEnvironment();
});

test("production without a configured URL uses the stable public domain", () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NODE_ENV = "production";
  process.env.VERCEL_URL = "preview-123.vercel.app";

  assert.equal(getSiteUrl(), "https://emmanuelpanganportfolio.vercel.app");
  restoreEnvironment();
});

test("sitemap includes public case studies and excludes the noindex store", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://portfolio.example/";

  const urls = publicRoutes.map((route) => `${getSiteUrl()}${route}`);

  assert.ok(urls.includes("https://portfolio.example/work/twc-platform"));
  assert.ok(urls.includes("https://portfolio.example/work/medora"));
  assert.ok(!urls.includes("https://portfolio.example/twc-ecommerce"));
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(
    urls.every(
      (url) =>
        url === "https://portfolio.example" ||
        url.startsWith("https://portfolio.example/"),
    ),
  );

  restoreEnvironment();
});
