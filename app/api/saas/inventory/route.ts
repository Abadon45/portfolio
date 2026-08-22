import { NextResponse } from "next/server";
import { recordSaaSInventoryMovement } from "../../../../lib/saasDemoRepository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ message: "Invalid inventory payload." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const productId = typeof body.productId === "string" ? body.productId : "";
  const kind = body.kind === "receive" || body.kind === "adjust" ? body.kind : null;
  const quantity = typeof body.quantity === "number" ? body.quantity : NaN;
  const reorderPoint = typeof body.reorderPoint === "number" ? body.reorderPoint : NaN;

  if (!productId || !kind || !Number.isFinite(quantity) || !Number.isFinite(reorderPoint)) {
    return NextResponse.json({ message: "Invalid inventory payload." }, { status: 400 });
  }

  try {
    const product = await recordSaaSInventoryMovement(
      productId,
      kind,
      quantity,
      reorderPoint,
    );

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { message: "Unable to record inventory movement." },
      { status: 502 },
    );
  }
}
