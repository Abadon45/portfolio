import { NextResponse } from "next/server";
import {
  getCurrentPortfolioUser,
  updateCurrentPortfolioUser,
} from "../../../lib/portfolioAuth";
import type { PortfolioUser } from "../../../lib/portfolioAuth";

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
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  let currentUser: PortfolioUser | null;
  try {
    currentUser = await getCurrentPortfolioUser();
  } catch {
    return NextResponse.json(
      { message: "Unable to load your profile right now." },
      { status: 503 },
    );
  }
  if (!currentUser) {
    return NextResponse.json(
      { message: "You must be signed in." },
      { status: 401 },
    );
  }
  const firstName =
    typeof body?.firstName === "string"
      ? body.firstName.trim()
      : (currentUser.firstName ?? "");
  const lastName =
    typeof body?.lastName === "string"
      ? body.lastName.trim()
      : (currentUser.lastName ?? "");
  const displayName =
    typeof body?.displayName === "string"
      ? body.displayName.trim()
      : currentUser.displayName;
  const phone =
    typeof body?.phone === "string"
      ? body.phone.trim()
      : (currentUser.phone ?? "");

  if (
    !displayName ||
    displayName.length > 80 ||
    firstName.length > 60 ||
    lastName.length > 60 ||
    phone.length > 32 ||
    !/^[0-9+().\-\s]*$/.test(phone)
  ) {
    return NextResponse.json(
      {
        message:
          "Enter a valid display name and phone number within the allowed length.",
      },
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
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Unable to save your profile right now." },
      { status: 503 },
    );
  }
}
