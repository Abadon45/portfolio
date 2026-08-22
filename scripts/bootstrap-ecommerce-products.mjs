import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const sql = neon(databaseUrl);
const sourcePath = resolve("app/twc-ecommerce/_data/product-list.json");
const source = JSON.parse(await readFile(sourcePath, "utf8"));
const hiddenCategories = new Set(["promo", "twc-freebie", "twc-freebies"]);

const titleCaseCategory = (value) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const visibleProducts = source.products
  .filter((product) => {
    const isHidden = [product.category_1, product.category_2].some((category) =>
      hiddenCategories.has(String(category ?? "").toLowerCase()),
    );
    const isSante = String(product.category_1 ?? "").trim().toLowerCase() === "sante";
    return !isHidden && (isSante || Number(product.quantity ?? 0) > 0);
  })
  .map((product) => {
    const isSante = String(product.category_1 ?? "").trim().toLowerCase() === "sante";
    const images = [
      product.image_1,
      product.image_2,
      product.image_3,
      product.image_4,
      product.image_5,
    ].filter(Boolean);

    return {
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      category1: product.category_1 || "general",
      category2: product.category_2 || product.category_1 || "general",
      category: titleCaseCategory(product.category_2 || product.category_1 || "General"),
      shop: titleCaseCategory(product.category_1 || "TWC Store"),
      customerPrice: Number(product.customer_price ?? 0),
      description1: product.description_1 || "A product from the TWC ecommerce catalog.",
      description2: product.description_2 || null,
      advantage: product.advantage || null,
      feature: product.feature || null,
      specification: product.specification || null,
      images,
      sourceQuantity: Number(product.quantity ?? 0),
      stock: isSante ? null : Number(product.quantity ?? 0),
      unlimitedStock: isSante,
      barleyPoint: Number(product.barley_point ?? 0),
      shippingQuantity: Number(product.shipping_qty ?? 1),
      forVirtualWarehouse: Boolean(product.is_for_vw),
    };
  });

await sql`create schema if not exists saas_demo`;

await sql`
  create table if not exists saas_demo.store_products (
    slug text primary key,
    sku text not null unique,
    name text not null,
    category_1 text not null,
    category_2 text not null,
    category text not null,
    shop text not null,
    customer_price numeric(12, 2) not null default 0,
    description_1 text not null default '',
    description_2 text,
    advantage text,
    feature text,
    specification text,
    images jsonb not null default '[]'::jsonb,
    source_quantity integer not null default 0,
    stock integer,
    unlimited_stock boolean not null default false,
    barley_point numeric(12, 2) not null default 0,
    shipping_quantity numeric(12, 2) not null default 1,
    for_virtual_warehouse boolean not null default false,
    is_visible boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (customer_price >= 0),
    check (stock is null or stock >= 0)
  )
`;

await sql`
  update saas_demo.store_products
  set is_visible = false, updated_at = now()
`;

for (const product of visibleProducts) {
  await sql`
    insert into saas_demo.store_products (
      slug, sku, name, category_1, category_2, category, shop, customer_price,
      description_1, description_2, advantage, feature, specification, images,
      source_quantity, stock, unlimited_stock, barley_point, shipping_quantity,
      for_virtual_warehouse, is_visible
    ) values (
      ${product.slug}, ${product.sku}, ${product.name}, ${product.category1},
      ${product.category2}, ${product.category}, ${product.shop}, ${product.customerPrice},
      ${product.description1}, ${product.description2}, ${product.advantage},
      ${product.feature}, ${product.specification}, ${JSON.stringify(product.images)}::jsonb,
      ${product.sourceQuantity}, ${product.stock}, ${product.unlimitedStock},
      ${product.barleyPoint}, ${product.shippingQuantity}, ${product.forVirtualWarehouse},
      true
    )
    on conflict (slug) do update set
      sku = excluded.sku,
      name = excluded.name,
      category_1 = excluded.category_1,
      category_2 = excluded.category_2,
      category = excluded.category,
      shop = excluded.shop,
      customer_price = excluded.customer_price,
      description_1 = excluded.description_1,
      description_2 = excluded.description_2,
      advantage = excluded.advantage,
      feature = excluded.feature,
      specification = excluded.specification,
      images = excluded.images,
      source_quantity = excluded.source_quantity,
      stock = excluded.stock,
      unlimited_stock = excluded.unlimited_stock,
      barley_point = excluded.barley_point,
      shipping_quantity = excluded.shipping_quantity,
      for_virtual_warehouse = excluded.for_virtual_warehouse,
      is_visible = true,
      updated_at = now()
  `;
}

const summary = await sql`
  select
    count(*)::int as total,
    count(*) filter (where is_visible)::int as visible,
    count(*) filter (where unlimited_stock)::int as unlimited_stock
  from saas_demo.store_products
`;

console.log(JSON.stringify({ summary: summary[0], categories: [...new Set(visibleProducts.map((product) => `${product.category1}/${product.category2}`))].sort() }, null, 2));
