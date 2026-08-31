import { NextResponse } from "next/server";
import {
  createAdminStoreProduct,
  listAdminStoreProducts,
  type AdminStoreProductInput,
} from "../../../../lib/adminStoreProductRepository";
import { getAdminPortfolioUser } from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

const text = (value: unknown, fallback = "") => String(value ?? fallback).trim();
const nullableText = (value: unknown) => text(value) || null;
const number = (value: unknown, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const nullableNumber = (value: unknown) => value === null || value === "" || value === undefined ? null : number(value);

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeInput(payload: Record<string, unknown>): AdminStoreProductInput {
  const images = Array.isArray(payload.images) ? payload.images.filter((image): image is string => typeof image === "string" && image.trim().length > 0).slice(0, 10) : [];
  const imageSources = images.map((url, index) => ({ url, source: "external" as const, altText: text(payload.name) || null, isPrimary: index === 0, sortOrder: index }));
  const name = text(payload.name, "Untitled product");
  return {
    slug: slugify(text(payload.slug) || `${name}-${text(payload.sku, crypto.randomUUID().slice(0, 8))}`),
    sku: text(payload.sku) || `manual-${crypto.randomUUID().slice(0, 8)}`,
    name,
    brand: nullableText(payload.brand),
    category1: text(payload.category1, "Beauty"),
    category2: text(payload.category2, text(payload.category1, "Beauty")),
    category: text(payload.category, text(payload.category2, "Beauty")),
    shop: text(payload.shop, "TWC Store"),
    customerPrice: Math.max(0, number(payload.customerPrice)),
    description1: text(payload.description1, name),
    description2: nullableText(payload.description2),
    advantage: nullableText(payload.advantage),
    feature: nullableText(payload.feature),
    specification: nullableText(payload.specification),
    images,
    imageSources,
    sourceQuantity: Math.max(0, Math.round(number(payload.sourceQuantity))),
    stock: payload.stock === null || payload.stock === "" ? null : Math.max(0, Math.round(number(payload.stock))),
    unlimitedStock: Boolean(payload.unlimitedStock),
    barleyPoint: Math.max(0, number(payload.barleyPoint)),
    shippingQuantity: Math.max(0, number(payload.shippingQuantity, 1)),
    forVirtualWarehouse: Boolean(payload.forVirtualWarehouse),
    sourceProductId: nullableText(payload.sourceProductId),
    status: ["draft", "active", "out_of_stock", "archived"].includes(text(payload.status)) ? text(payload.status) as AdminStoreProductInput["status"] : "draft",
    currency: text(payload.currency, "PHP"),
    compareAtPrice: nullableNumber(payload.compareAtPrice),
    weightGrams: nullableNumber(payload.weightGrams),
    lengthCm: nullableNumber(payload.lengthCm),
    widthCm: nullableNumber(payload.widthCm),
    heightCm: nullableNumber(payload.heightCm),
    shippingProfile: nullableText(payload.shippingProfile),
    minimumOrderQuantity: Math.max(1, Math.round(number(payload.minimumOrderQuantity, 1))),
    maximumOrderQuantity: nullableNumber(payload.maximumOrderQuantity),
    isFeatured: Boolean(payload.isFeatured),
    sortOrder: Math.round(number(payload.sortOrder)),
    seoTitle: nullableText(payload.seoTitle),
    seoDescription: nullableText(payload.seoDescription),
  };
}

export async function GET(request: Request) {
  const admin = await getAdminPortfolioUser();
  if (!admin) return NextResponse.json({ message: "Administrator access is required." }, { status: 403 });
  const search = new URL(request.url).searchParams.get("search") ?? "";
  return NextResponse.json({ products: await listAdminStoreProducts(search) });
}

export async function POST(request: Request) {
  const admin = await getAdminPortfolioUser();
  if (!admin) return NextResponse.json({ message: "Administrator access is required." }, { status: 403 });
  try {
    const input = normalizeInput(await request.json() as Record<string, unknown>);
    if (!input.name || !input.sku) return NextResponse.json({ message: "Name and SKU are required." }, { status: 400 });
    return NextResponse.json({ product: await createAdminStoreProduct(input) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create product." }, { status: 400 });
  }
}

export { normalizeInput };
