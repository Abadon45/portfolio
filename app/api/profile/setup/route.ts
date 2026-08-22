import { NextResponse } from "next/server";
import { completePortfolioSetup } from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const userType =
    body?.userType === "public_school_teacher"
      ? "public_school_teacher"
      : body?.userType === "regular_user"
        ? "regular_user"
        : null;

  if (!userType) {
    return NextResponse.json(
      { message: "Choose a valid account type." },
      { status: 400 },
    );
  }

  try {
    const user = await completePortfolioSetup(userType);
    if (!user)
      return NextResponse.json(
        { message: "You must be signed in." },
        { status: 401 },
      );
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Unable to save your account setup." },
      { status: 503 },
    );
  }
}
