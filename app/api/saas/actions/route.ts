import { NextResponse } from "next/server";
import {
  createSaaSAffiliateLink,
  createSaaSPayout,
  createSaaSPriceRequest,
} from "../../../../lib/saasDemoRepository";
import { getAdminPortfolioUser } from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await getAdminPortfolioUser();
  if (!admin) {
    return NextResponse.json(
      { message: "Administrator access is required." },
      { status: 403 },
    );
  }

  const payload: unknown = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ message: "Invalid action payload." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const action = typeof body.action === "string" ? body.action : "";

  try {
    if (action === "price-request") {
      if (
        typeof body.product !== "string" ||
        typeof body.current !== "number" ||
        typeof body.proposed !== "number" ||
        typeof body.reason !== "string"
      ) {
        return NextResponse.json({ message: "Invalid price request." }, { status: 400 });
      }

      return NextResponse.json({
        priceRequest: await createSaaSPriceRequest({
          product: body.product,
          current: body.current,
          proposed: body.proposed,
          reason: body.reason,
        }),
      }, { status: 201 });
    }

    if (action === "payout") {
      if (typeof body.amount !== "number" || body.method !== "GCash") {
        return NextResponse.json({ message: "Invalid payout request." }, { status: 400 });
      }

      return NextResponse.json({
        payout: await createSaaSPayout({
          amount: body.amount,
          method: body.method,
          reference: "SET-8128",
        }),
      }, { status: 201 });
    }

    if (action === "affiliate-link") {
      if (typeof body.product !== "string" || typeof body.slug !== "string") {
        return NextResponse.json({ message: "Invalid affiliate link." }, { status: 400 });
      }

      return NextResponse.json({
        affiliateLink: await createSaaSAffiliateLink({
          product: body.product,
          slug: body.slug,
        }),
      }, { status: 201 });
    }

    return NextResponse.json({ message: "Unknown SaaS action." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { message: "Unable to save SaaS action." },
      { status: 502 },
    );
  }
}
