import { NextResponse } from "next/server";
import {
  getCurrentPortfolioUser,
  updateCurrentPortfolioUser,
} from "../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentPortfolioUser();
    if (!user) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Unable to load your profile." },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

  if (!displayName || displayName.length > 80 || firstName.length > 60 || lastName.length > 60) {
    return NextResponse.json(
      { message: "Enter a display name and keep profile names within 60–80 characters." },
      { status: 400 },
    );
  }

  try {
    const user = await updateCurrentPortfolioUser({
      firstName: firstName || null,
      lastName: lastName || null,
      displayName,
      phone: phone || null,
    });
    if (!user) return NextResponse.json({ message: "You must be signed in." }, { status: 401 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Unable to save your profile right now." },
      { status: 503 },
    );
  }
}
