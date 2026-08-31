import { getNeonSql } from "./neon";
import type { StoreProductModel, StoreProductImage } from "./storeProductRepository";

export type AdminStoreProductInput = {
  slug?: string;
  sku: string;
  name: string;
  brand: string | null;
  category1: string;
  category2: string;
  category: string;
  shop: string;
  customerPrice: number;
  description1: string;
  description2: string | null;
  advantage: string | null;
  feature: string | null;
  specification: string | null;
  images: string[];
  imageSources: StoreProductImage[];
  sourceQuantity: number;
  stock: number | null;
  unlimitedStock: boolean;
  barleyPoint: number;
  shippingQuantity: number;
  forVirtualWarehouse: boolean;
  sourceProductId: string | null;
  status: StoreProductModel["status"];
  currency: string;
  compareAtPrice: number | null;
  weightGrams: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  shippingProfile: string | null;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number | null;
  isFeatured: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

type AdminRow = Record<string, unknown>;

const value = (input: unknown) => String(input ?? "");
const numberValue = (input: unknown) => Number(input ?? 0);
const nullableNumber = (input: unknown) => input === null || input === undefined || input === "" ? null : Number(input);

function mapAdminProduct(row: AdminRow): StoreProductModel {
  const images = Array.isArray(row.images) ? row.images.filter((item): item is string => typeof item === "string") : [];
  const imageSources = Array.isArray(row.image_sources) ? row.image_sources as StoreProductImage[] : [];
  const details = [row.description_2, row.advantage, row.feature, row.specification]
    .filter((item): item is string => typeof item === "string" && item.length > 0)
    .join("\n\n");

  return {
    slug: value(row.slug),
    sku: value(row.sku),
    name: value(row.name),
    brand: value(row.brand) || null,
    category1: value(row.category_1),
    category2: value(row.category_2),
    category: value(row.category),
    shop: value(row.shop),
    price: numberValue(row.customer_price),
    image: images[0] || "https://placehold.co/800x800/eaf0f5/233044?text=TWC+Store",
    images,
    imageSources,
    description: value(row.description_1),
    details,
    description2: typeof row.description_2 === "string" ? row.description_2 : null,
    advantage: typeof row.advantage === "string" ? row.advantage : null,
    feature: typeof row.feature === "string" ? row.feature : null,
    specification: typeof row.specification === "string" ? row.specification : null,
    stock: row.stock === null ? null : numberValue(row.stock),
    sourceQuantity: numberValue(row.source_quantity),
    unlimitedStock: Boolean(row.unlimited_stock),
    barleyPoint: numberValue(row.barley_point),
    shippingQuantity: numberValue(row.shipping_quantity),
    forVirtualWarehouse: Boolean(row.for_virtual_warehouse),
    status: ["draft", "active", "out_of_stock", "archived"].includes(value(row.status)) ? value(row.status) as StoreProductModel["status"] : "draft",
    currency: value(row.currency) || "PHP",
    compareAtPrice: nullableNumber(row.compare_at_price),
    weightGrams: nullableNumber(row.weight_grams),
    lengthCm: nullableNumber(row.length_cm),
    widthCm: nullableNumber(row.width_cm),
    heightCm: nullableNumber(row.height_cm),
    shippingProfile: value(row.shipping_profile) || null,
    minimumOrderQuantity: Math.max(1, numberValue(row.minimum_order_quantity || 1)),
    maximumOrderQuantity: nullableNumber(row.maximum_order_quantity),
    isFeatured: Boolean(row.is_featured),
    sortOrder: numberValue(row.sort_order),
    seoTitle: value(row.seo_title) || null,
    seoDescription: value(row.seo_description) || null,
    sourceProductId: value(row.source_product_id) || null,
    sourceSnapshotAt: row.source_snapshot_at ? new Date(String(row.source_snapshot_at)).toISOString() : null,
  };
}

export async function listAdminStoreProducts(search = "") {
  const sql = getNeonSql();
  const term = `%${search.trim()}%`;
  const rows = await sql`
    select *
    from saas_demo.store_products
    where ${search.trim() ? sql`name ilike ${term} or sku ilike ${term} or brand ilike ${term}` : sql`true`}
    order by updated_at desc, name asc
  `;
  return rows.map((row) => mapAdminProduct(row));
}

export async function getAdminStoreProduct(slug: string) {
  const sql = getNeonSql();
  const rows = await sql`select * from saas_demo.store_products where slug = ${slug} limit 1`;
  return rows[0] ? mapAdminProduct(rows[0]) : null;
}

function columns(input: AdminStoreProductInput) {
  const images = input.images.slice(0, 10);
  const imageSources = input.imageSources.filter((image) => images.includes(image.url)).slice(0, 10);
  return { ...input, images, imageSources };
}

export async function createAdminStoreProduct(input: AdminStoreProductInput) {
  const sql = getNeonSql();
  const data = columns(input);
  const rows = await sql`
    insert into saas_demo.store_products (
      slug, sku, name, brand, category_1, category_2, category, shop,
      customer_price, description_1, description_2, advantage, feature, specification,
      images, image_sources, source_quantity, stock, unlimited_stock, barley_point,
      shipping_quantity, for_virtual_warehouse, source_product_id, status, currency,
      compare_at_price, weight_grams, length_cm, width_cm, height_cm, shipping_profile,
      minimum_order_quantity, maximum_order_quantity, is_featured, sort_order, seo_title,
      seo_description, is_visible
    ) values (
      ${data.slug}, ${data.sku}, ${data.name}, ${data.brand}, ${data.category1}, ${data.category2}, ${data.category}, ${data.shop},
      ${data.customerPrice}, ${data.description1}, ${data.description2}, ${data.advantage}, ${data.feature}, ${data.specification},
      ${JSON.stringify(data.images)}::jsonb, ${JSON.stringify(data.imageSources)}::jsonb, ${data.sourceQuantity}, ${data.stock}, ${data.unlimitedStock}, ${data.barleyPoint},
      ${data.shippingQuantity}, ${data.forVirtualWarehouse}, ${data.sourceProductId}, ${data.status}, ${data.currency},
      ${data.compareAtPrice}, ${data.weightGrams}, ${data.lengthCm}, ${data.widthCm}, ${data.heightCm}, ${data.shippingProfile},
      ${data.minimumOrderQuantity}, ${data.maximumOrderQuantity}, ${data.isFeatured}, ${data.sortOrder}, ${data.seoTitle}, ${data.seoDescription}, true
    ) returning *
  `;
  return mapAdminProduct(rows[0]);
}

export async function updateAdminStoreProduct(slug: string, input: AdminStoreProductInput) {
  const sql = getNeonSql();
  const data = columns(input);
  const rows = await sql`
    update saas_demo.store_products
    set sku = ${data.sku}, name = ${data.name}, brand = ${data.brand}, category_1 = ${data.category1}, category_2 = ${data.category2}, category = ${data.category}, shop = ${data.shop},
        customer_price = ${data.customerPrice}, description_1 = ${data.description1}, description_2 = ${data.description2}, advantage = ${data.advantage}, feature = ${data.feature}, specification = ${data.specification},
        images = ${JSON.stringify(data.images)}::jsonb, image_sources = ${JSON.stringify(data.imageSources)}::jsonb, source_quantity = ${data.sourceQuantity}, stock = ${data.stock}, unlimited_stock = ${data.unlimitedStock}, barley_point = ${data.barleyPoint},
        shipping_quantity = ${data.shippingQuantity}, for_virtual_warehouse = ${data.forVirtualWarehouse}, source_product_id = ${data.sourceProductId}, status = ${data.status}, currency = ${data.currency},
        compare_at_price = ${data.compareAtPrice}, weight_grams = ${data.weightGrams}, length_cm = ${data.lengthCm}, width_cm = ${data.widthCm}, height_cm = ${data.heightCm}, shipping_profile = ${data.shippingProfile},
        minimum_order_quantity = ${data.minimumOrderQuantity}, maximum_order_quantity = ${data.maximumOrderQuantity}, is_featured = ${data.isFeatured}, sort_order = ${data.sortOrder}, seo_title = ${data.seoTitle}, seo_description = ${data.seoDescription}, updated_at = now()
    where slug = ${slug}
    returning *
  `;
  return rows[0] ? mapAdminProduct(rows[0]) : null;
}
