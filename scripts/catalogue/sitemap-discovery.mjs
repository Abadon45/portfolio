export async function discoverSitemapCandidates(sourceUrl, options = {}) {
  const origin = new URL(sourceUrl).origin;
  const visited = new Set();
  const urls = new Set();
  const seeds = [`${origin}/robots.txt`, `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];

  async function read(url) {
    if (visited.has(url) || visited.size >= (options.maxSitemaps || 10)) return;
    visited.add(url);
    let response;
    try { response = await fetch(url, { headers: { "user-agent": "ProductCatalogue/1.0" } }); } catch { return; }
    if (!response.ok) return;
    const body = await response.text();
    for (const match of body.matchAll(/(?:Sitemap:\s*|<loc>)(https?:\/\/[^<\s]+)(?:<\/loc>)?/gi)) {
      const found = match[1].trim();
      if (/robots\.txt/i.test(url) || /sitemap/i.test(found)) await read(found);
      else if (found) urls.add(found);
    }
  }

  await Promise.all(seeds.map(read));
  return [...urls].filter((url) => options.urlPattern ? options.urlPattern.test(url) : true).map((url) => ({ url, discoveredFrom: "sitemap", confidence: "medium" }));
}
