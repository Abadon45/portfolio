import { NextResponse } from "next/server";
import { getStoreProducts } from "../../../../../lib/storeProductRepository";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const products = await getStoreProducts(slug);

    if (!products[0]) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product: products[0] });
  } catch {
    return NextResponse.json(
      { message: "Unable to load ecommerce product." },
      { status: 502 },
    );
  }
}
