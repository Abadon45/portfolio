import { NextResponse } from "next/server";
import { getSaaSData } from "../../../../lib/saasDemoRepository";
import { getAdminPortfolioUser } from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getAdminPortfolioUser();
  if (!admin) {
    return NextResponse.json(
      { message: "Administrator access is required." },
      { status: 403 },
    );
  }

  try {
    return NextResponse.json(await getSaaSData());
  } catch {
    return NextResponse.json(
      { message: "Unable to load SaaS demo data." },
      { status: 502 },
    );
  }
}
