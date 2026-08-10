import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const portfolioRoot = resolve(import.meta.dirname, "..");
const fixtureRoot = resolve(portfolioRoot, "app/twc-ecommerce/_data");
const sourceRoot = resolve(portfolioRoot, "../TWC-Ecommerce/src/onlinestore/data");

async function writeJson(relativePath, value) {
  const target = resolve(fixtureRoot, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  console.log(`${relativePath}: ${Buffer.byteLength(JSON.stringify(value))} bytes`);
}

const productResponse = JSON.parse(await readFile(resolve(sourceRoot, "products.json"), "utf8"));
const prefixResponse = { ph_number_prefixes: [
  "0905", "0906", "0907", "0908", "0909", "0910", "0911", "0912", "0913", "0915", "0916", "0917", "0918", "0919", "0920", "0921", "0922", "0923", "0924", "0925", "0926", "0927", "0928", "0929", "0930", "0935", "0936", "0937", "0938", "0939", "0940", "0941", "0942", "0943", "0945", "0946", "0947", "0948", "0949", "0950", "0951", "0953", "0954", "0955", "0956", "0957", "0958", "0959", "0960", "0961", "0963", "0964", "0965", "0966", "0967", "0968", "0969", "0970", "0971", "0973", "0974", "0975", "0976", "0977", "0978", "0979", "0980", "0981", "0982", "0983", "0984", "0985", "0986", "0987", "0988", "0989", "0990", "0991", "0992", "0993", "0994", "0995", "0996", "0997", "0998", "0999"
] };
const addresses = JSON.parse(await readFile(resolve(sourceRoot, "addresses.json"), "utf8"));

await writeJson("product-list.json", productResponse);
await writeJson("ph-addresses.json", { addresses });
await writeJson("ph-number-prefixes.json", prefixResponse);
