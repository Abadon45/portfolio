import { NextResponse } from "next/server";
import { getAdminPortfolioUser } from "../../../../../lib/portfolioAuth";
import { getAdminStoreProduct, updateAdminStoreProduct } from "../../../../../lib/adminStoreProductRepository";
import { normalizeInput } from "../route";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const admin = await getAdminPortfolioUser();
  if (!admin) return NextResponse.json({ message: "Administrator access is required." }, { status: 403 });
  const { slug } = await context.params;
  const product = await getAdminStoreProduct(slug);
  return product ? NextResponse.json({ product }) : NextResponse.json({ message: "Product not found." }, { status: 404 });
}

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  const admin = await getAdminPortfolioUser();
  if (!admin) return NextResponse.json({ message: "Administrator access is required." }, { status: 403 });
  try {
    const { slug } = await context.params;
    const input = normalizeInput(await request.json() as Record<string, unknown>);
    const product = await updateAdminStoreProduct(slug, input);
    return product ? NextResponse.json({ product }) : NextResponse.json({ message: "Product not found." }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to update product." }, { status: 400 });
  }
}
