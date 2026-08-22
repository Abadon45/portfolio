import { NextResponse } from "next/server";
import { getCurrentPortfolioUser } from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentPortfolioUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Unable to read the current session." },
      { status: 503 },
    );
  }
}
