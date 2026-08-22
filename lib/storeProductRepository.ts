import { getNeonSql } from "./neon";

export type StoreProductModel = {
  slug: string;
  sku: string;
  name: string;
  category1: string;
  category2: string;
  category: string;
  shop: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  details: string;
  stock: number | null;
  unlimitedStock: boolean;
  barleyPoint: number;
  shippingQuantity: number;
  forVirtualWarehouse: boolean;
};

type StoreProductRow = Record<string, unknown>;

const stringValue = (value: unknown) => String(value ?? "");
const numberValue = (value: unknown) => Number(value ?? 0);

function imageList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.length > 0,
  );
}

function mapStoreProduct(row: StoreProductRow): StoreProductModel {
  const images = imageList(row.images);
  const description = stringValue(row.description_1);
  const details = [row.description_2, row.advantage, row.feature, row.specification]
    .filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    )
    .join("\n\n");

  return {
    slug: stringValue(row.slug),
    sku: stringValue(row.sku),
    name: stringValue(row.name),
    category1: stringValue(row.category_1),
    category2: stringValue(row.category_2),
    category: stringValue(row.category),
    shop: stringValue(row.shop),
    price: numberValue(row.customer_price),
    image: images[0] || "https://placehold.co/800x800/eaf0f5/233044?text=TWC+Store",
    images,
    description,
    details,
    stock: row.stock === null ? null : numberValue(row.stock),
    unlimitedStock: Boolean(row.unlimited_stock),
    barleyPoint: numberValue(row.barley_point),
    shippingQuantity: numberValue(row.shipping_quantity),
    forVirtualWarehouse: Boolean(row.for_virtual_warehouse),
  };
}

export async function getStoreProducts(slug?: string) {
  const sql = getNeonSql();
  const rows = slug
    ? await sql`
        select * from saas_demo.store_products
        where slug = ${slug} and is_visible = true
        limit 1
      `
    : await sql`
        select * from saas_demo.store_products
        where is_visible = true
        order by name asc
      `;

  return rows.map(mapStoreProduct);
}

export async function appendStoreProductImage(slug: string, imageUrl: string) {
  const sql = getNeonSql();
  const rows = await sql`
    select images
    from saas_demo.store_products
    where slug = ${slug}
    limit 1
  `;

  if (!rows[0]) return null;

  const images = imageList(rows[0].images);
  if (!images.includes(imageUrl)) images.push(imageUrl);

  await sql`
    update saas_demo.store_products
    set images = ${JSON.stringify(images)}::jsonb,
        updated_at = now()
    where slug = ${slug}
  `;

  return images;
}
