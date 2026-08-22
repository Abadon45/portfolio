import { NextResponse } from "next/server";
import { getStoreProducts } from "../../../../lib/storeProductRepository";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json({ products: await getStoreProducts() });
  } catch {
    return NextResponse.json(
      { message: "Unable to load ecommerce products." },
      { status: 502 },
    );
  }
}
