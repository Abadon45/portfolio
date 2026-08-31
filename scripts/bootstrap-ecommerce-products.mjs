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
const sourceSnapshotAt = new Date().toISOString();

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
    return (
      !isHidden &&
      !Boolean(product.is_for_vw) &&
      (isSante || Number(product.quantity ?? 0) > 0)
    );
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
    const imageSources = images.map((url, index) => ({
      url,
      source: "catalog",
      alt_text: product.name,
      is_primary: index === 0,
      sort_order: index,
    }));
    const sourceQuantity = Number(product.quantity ?? 0);

    return {
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      brand: null,
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
      imageSources,
      sourceQuantity,
      stock: isSante ? null : Math.max(0, sourceQuantity),
      unlimitedStock: isSante,
      barleyPoint: Number(product.barley_point ?? 0),
      shippingQuantity: Number(product.shipping_qty ?? 1),
      forVirtualWarehouse: Boolean(product.is_for_vw),
      sourceProductId: product.id ? String(product.id) : null,
      sourceSnapshotAt,
      status: isSante || sourceQuantity > 0 ? "active" : "out_of_stock",
      currency: "PHP",
      compareAtPrice: null,
      weightGrams: null,
      lengthCm: null,
      widthCm: null,
      heightCm: null,
      shippingProfile: null,
      minimumOrderQuantity: 1,
      maximumOrderQuantity: null,
      isFeatured: false,
      sortOrder: 0,
      seoTitle: null,
      seoDescription: null,
    };
  });

await sql`create schema if not exists saas_demo`;

await sql`
  create table if not exists saas_demo.store_products (
    slug text primary key,
    sku text not null unique,
    name text not null,
    brand text,
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
    image_sources jsonb not null default '[]'::jsonb,
    source_quantity integer not null default 0,
    stock integer,
    unlimited_stock boolean not null default false,
    barley_point numeric(12, 2) not null default 0,
    shipping_quantity numeric(12, 2) not null default 1,
    for_virtual_warehouse boolean not null default false,
    source_product_id text,
    source_snapshot_at timestamptz,
    status text not null default 'active',
    currency text not null default 'PHP',
    compare_at_price numeric(12, 2),
    weight_grams numeric(12, 3),
    length_cm numeric(12, 3),
    width_cm numeric(12, 3),
    height_cm numeric(12, 3),
    shipping_profile text,
    minimum_order_quantity integer not null default 1,
    maximum_order_quantity integer,
    is_featured boolean not null default false,
    sort_order integer not null default 0,
    seo_title text,
    seo_description text,
    is_visible boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (customer_price >= 0),
    check (stock is null or stock >= 0),
    check (status in ('draft', 'active', 'out_of_stock', 'archived')),
    check (minimum_order_quantity > 0),
    check (maximum_order_quantity is null or maximum_order_quantity >= minimum_order_quantity)
  )
`;

await sql`
  alter table saas_demo.store_products
    add column if not exists image_sources jsonb not null default '[]'::jsonb,
    add column if not exists brand text,
    add column if not exists source_product_id text,
    add column if not exists source_snapshot_at timestamptz,
    add column if not exists status text not null default 'active',
    add column if not exists currency text not null default 'PHP',
    add column if not exists compare_at_price numeric(12, 2),
    add column if not exists weight_grams numeric(12, 3),
    add column if not exists length_cm numeric(12, 3),
    add column if not exists width_cm numeric(12, 3),
    add column if not exists height_cm numeric(12, 3),
    add column if not exists shipping_profile text,
    add column if not exists minimum_order_quantity integer not null default 1,
    add column if not exists maximum_order_quantity integer,
    add column if not exists is_featured boolean not null default false,
    add column if not exists sort_order integer not null default 0,
    add column if not exists seo_title text,
    add column if not exists seo_description text
`;

await sql`
  update saas_demo.store_products
  set is_visible = false, updated_at = now()
`;

for (const product of visibleProducts) {
  await sql`
    insert into saas_demo.store_products (
      slug, sku, name, brand, category_1, category_2, category, shop, customer_price,
      description_1, description_2, advantage, feature, specification, images, image_sources,
      source_quantity, stock, unlimited_stock, barley_point, shipping_quantity,
      for_virtual_warehouse, source_product_id, source_snapshot_at, status, currency,
      compare_at_price, weight_grams, length_cm, width_cm, height_cm, shipping_profile,
      minimum_order_quantity, maximum_order_quantity, is_featured, sort_order,
      seo_title, seo_description, is_visible
    ) values (
      ${product.slug}, ${product.sku}, ${product.name}, ${product.brand}, ${product.category1},
      ${product.category2}, ${product.category}, ${product.shop}, ${product.customerPrice},
      ${product.description1}, ${product.description2}, ${product.advantage},
      ${product.feature}, ${product.specification}, ${JSON.stringify(product.images)}::jsonb,
      ${JSON.stringify(product.imageSources)}::jsonb,
      ${product.sourceQuantity}, ${product.stock}, ${product.unlimitedStock},
      ${product.barleyPoint}, ${product.shippingQuantity}, ${product.forVirtualWarehouse},
      ${product.sourceProductId}, ${product.sourceSnapshotAt}, ${product.status}, ${product.currency},
      ${product.compareAtPrice}, ${product.weightGrams}, ${product.lengthCm}, ${product.widthCm},
      ${product.heightCm}, ${product.shippingProfile}, ${product.minimumOrderQuantity},
      ${product.maximumOrderQuantity}, ${product.isFeatured}, ${product.sortOrder},
      ${product.seoTitle}, ${product.seoDescription}, true
    )
    on conflict (slug) do update set
      sku = excluded.sku,
      name = excluded.name,
      brand = excluded.brand,
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
      image_sources = excluded.image_sources,
      source_quantity = excluded.source_quantity,
      stock = excluded.stock,
      unlimited_stock = excluded.unlimited_stock,
      barley_point = excluded.barley_point,
      shipping_quantity = excluded.shipping_quantity,
      for_virtual_warehouse = excluded.for_virtual_warehouse,
      source_product_id = excluded.source_product_id,
      source_snapshot_at = excluded.source_snapshot_at,
      status = excluded.status,
      currency = excluded.currency,
      compare_at_price = excluded.compare_at_price,
      weight_grams = excluded.weight_grams,
      length_cm = excluded.length_cm,
      width_cm = excluded.width_cm,
      height_cm = excluded.height_cm,
      shipping_profile = excluded.shipping_profile,
      minimum_order_quantity = excluded.minimum_order_quantity,
      maximum_order_quantity = excluded.maximum_order_quantity,
      is_featured = excluded.is_featured,
      sort_order = excluded.sort_order,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
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
