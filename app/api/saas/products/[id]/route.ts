import { NextResponse } from "next/server";
import {
  updateSaaSProduct,
  type ProductMutation,
} from "../../../../../lib/saasDemoRepository";
import { getAdminPortfolioUser } from "../../../../../lib/portfolioAuth";

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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminPortfolioUser();
  if (!admin) {
    return NextResponse.json(
      { message: "Administrator access is required." },
      { status: 403 },
    );
  }

  const payload: unknown = await request.json().catch(() => null);

  if (!isProductMutation(payload)) {
    return NextResponse.json({ message: "Invalid product payload." }, { status: 400 });
  }

  try {
    const { id } = await context.params;
    const product = await updateSaaSProduct(id, payload);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ message: "Unable to update product." }, { status: 502 });
  }
}
