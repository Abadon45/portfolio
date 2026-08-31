import { prisma } from "./prisma";

export type StoreProductModel = {
  slug: string;
  sku: string;
  name: string;
  brand: string | null;
  category1: string;
  category2: string;
  category: string;
  shop: string;
  price: number;
  image: string;
  images: string[];
  imageSources: StoreProductImage[];
  description: string;
  details: string;
  description2: string | null;
  advantage: string | null;
  feature: string | null;
  specification: string | null;
  stock: number | null;
  sourceQuantity: number;
  unlimitedStock: boolean;
  barleyPoint: number;
  shippingQuantity: number;
  forVirtualWarehouse: boolean;
  status: "draft" | "active" | "out_of_stock" | "archived";
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
  sourceProductId: string | null;
  sourceSnapshotAt: string | null;
};

export type StoreProductImage = {
  url: string;
  source: "catalog" | "external" | "blob";
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

type StoreProductRow = Record<string, unknown>;

const stringValue = (value: unknown) => String(value ?? "");
const numberValue = (value: unknown) => Number(value ?? 0);
const nullableNumberValue = (value: unknown) =>
  value === null || value === undefined || value === ""
    ? null
    : Number(value);

function imageList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.length > 0,
  );
}

function imageSourceList(value: unknown, images: string[], name: string) {
  if (!Array.isArray(value)) {
    return images.map((url, index) => ({
      url,
      source: "external" as const,
      altText: name || null,
      isPrimary: index === 0,
      sortOrder: index,
    }));
  }

  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const url = stringValue(record.url);
    if (!url) return [];
    const rawSource = String(record.source ?? "external");
    const source = ["catalog", "external", "blob"].includes(rawSource)
      ? (rawSource as StoreProductImage["source"])
      : "external";

    return [{
      url,
      source,
      altText: stringValue(record.alt_text) || name || null,
      isPrimary: Boolean(record.is_primary) || index === 0,
      sortOrder: numberValue(record.sort_order ?? index),
    }];
  });
}

function mapStoreProduct(row: StoreProductRow): StoreProductModel {
  const images = imageList(row.images);
  const imageSources = imageSourceList(row.image_sources, images, stringValue(row.name));
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
    brand: stringValue(row.brand) || null,
    category1: stringValue(row.category_1),
    category2: stringValue(row.category_2),
    category: stringValue(row.category),
    shop: stringValue(row.shop),
    price: numberValue(row.customer_price),
    image: images[0] || "https://placehold.co/800x800/eaf0f5/233044?text=TWC+Store",
    images,
    imageSources,
    description,
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
    status: ["draft", "active", "out_of_stock", "archived"].includes(
      String(row.status),
    )
      ? (String(row.status) as StoreProductModel["status"])
      : "active",
    currency: stringValue(row.currency) || "PHP",
    compareAtPrice: nullableNumberValue(row.compare_at_price),
    weightGrams: nullableNumberValue(row.weight_grams),
    lengthCm: nullableNumberValue(row.length_cm),
    widthCm: nullableNumberValue(row.width_cm),
    heightCm: nullableNumberValue(row.height_cm),
    shippingProfile: stringValue(row.shipping_profile) || null,
    minimumOrderQuantity: Math.max(1, numberValue(row.minimum_order_quantity ?? 1)),
    maximumOrderQuantity: nullableNumberValue(row.maximum_order_quantity),
    isFeatured: Boolean(row.is_featured),
    sortOrder: numberValue(row.sort_order),
    seoTitle: stringValue(row.seo_title) || null,
    seoDescription: stringValue(row.seo_description) || null,
    sourceProductId: stringValue(row.source_product_id) || null,
    sourceSnapshotAt: row.source_snapshot_at
      ? new Date(String(row.source_snapshot_at)).toISOString()
      : null,
  };
}

export async function getStoreProducts(slug?: string) {
  const rows = slug
    ? await prisma.store_products.findMany({
        where: {
          slug,
          is_visible: true,
          status: "active",
        },
        take: 1,
      })
    : await prisma.store_products.findMany({
        where: {
          is_visible: true,
          status: "active",
        },
        orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      });

  return rows.map(mapStoreProduct);
}

export async function appendStoreProductImage(slug: string, imageUrl: string) {
  const product = await prisma.store_products.findUnique({
    where: { slug },
    select: {
      images: true,
      image_sources: true,
    },
  });

  if (!product) return null;

  const images = imageList(product.images);
  if (!images.includes(imageUrl)) images.push(imageUrl);
  const imageSources = imageSourceList(
    product.image_sources,
    images.filter((image) => image !== imageUrl),
    "",
  );
  imageSources.push({
    url: imageUrl,
    source: "blob",
    altText: null,
    isPrimary: imageSources.length === 0,
    sortOrder: imageSources.length,
  });

  await prisma.store_products.update({
    where: { slug },
    data: {
      images,
      image_sources: imageSources,
      updated_at: new Date(),
    },
  });

  return images;
}
