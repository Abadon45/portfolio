import { NextResponse } from "next/server";
import {
  deletePortfolioUserById,
  findPortfolioUserById,
  getAdminPortfolioUser,
} from "../../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAdminPortfolioUser();
    if (!admin) {
      return NextResponse.json(
        { message: "Administrator access is required." },
        { status: 403 },
      );
    }

    const { id } = await params;
    const user = await findPortfolioUserById(id);
    if (!user)
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Unable to load this user right now." },
      { status: 503 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAdminPortfolioUser();
    if (!admin) {
      return NextResponse.json(
        { message: "Administrator access is required." },
        { status: 403 },
      );
    }

    const { id } = await params;
    if (id === admin.id) {
      return NextResponse.json(
        { message: "You cannot delete your own administrator account." },
        { status: 400 },
      );
    }

    const target = await findPortfolioUserById(id);
    if (!target) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    if (target.role.toLowerCase() === "admin") {
      return NextResponse.json(
        { message: "Administrator accounts are protected from this action." },
        { status: 409 },
      );
    }

    await deletePortfolioUserById(id);
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to delete this user right now." },
      { status: 503 },
    );
  }
}
