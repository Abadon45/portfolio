import { NextResponse } from "next/server";
import {
  createSaaSProduct,
  getSaaSData,
  type ProductMutation,
} from "../../../../lib/saasDemoRepository";

export const runtime = "nodejs";

function isProductMutation(value: unknown): value is ProductMutation {
  if (!value || typeof value !== "object") return false;
  const product = value as Record<string, unknown>;

  return [
    "name", "sku", "category", "supplier", "supplierPrice", "price", "margin",
    "stock", "reserved", "reorderPoint", "reorderQuantity", "commissionRate",
    "status", "featured",
  ].every((key) => key in product);
}

export async function GET() {
  try {
    const data = await getSaaSData();
    return NextResponse.json({ products: data.products });
  } catch {
    return NextResponse.json({ message: "Unable to load products." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);

  if (!isProductMutation(payload)) {
    return NextResponse.json({ message: "Invalid product payload." }, { status: 400 });
  }

  try {
    const product = await createSaaSProduct(payload);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Unable to create product." }, { status: 502 });
  }
}
