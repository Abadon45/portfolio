import { NextResponse } from "next/server";
import { getCurrentPortfolioUser } from "../../../../lib/portfolioAuth";
import { markSnedItemLearned } from "../../../../lib/snedLearning";

export async function POST(request: Request) {
  const user = await getCurrentPortfolioUser();
  if (!user?.isActive) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { itemId?: unknown } | null;
  const itemId = typeof body?.itemId === "string" ? body.itemId.trim() : "";
  if (!itemId) {
    return NextResponse.json({ error: "A lesson is required." }, { status: 400 });
  }

  const progress = await markSnedItemLearned(itemId);
  if (!progress) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  return NextResponse.json(progress);
}
