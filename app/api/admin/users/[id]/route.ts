import { NextResponse } from "next/server";
import {
  deletePortfolioUserById,
  findPortfolioUserById,
  getAdminPortfolioUser,
  setPortfolioUserRoleByAdmin,
  updatePortfolioUserByAdmin,
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

export async function PATCH(
  request: Request,
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
    const target = await findPortfolioUserById(id);
    if (!target) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    const firstName =
      typeof body?.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body?.lastName === "string" ? body.lastName.trim() : "";
    const displayName =
      typeof body?.displayName === "string" ? body.displayName.trim() : "";
    const username =
      typeof body?.username === "string" ? body.username.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const role =
      body?.role === "admin"
        ? "admin"
        : body?.role === "viewer"
          ? "viewer"
          : null;
    const isActive = typeof body?.isActive === "boolean" ? body.isActive : null;

    if (
      !displayName ||
      displayName.length > 80 ||
      firstName.length > 60 ||
      lastName.length > 60 ||
      username.length > 40 ||
      phone.length > 32 ||
      !role ||
      isActive === null
    ) {
      return NextResponse.json(
        { message: "Enter valid profile values before saving." },
        { status: 400 },
      );
    }
    if (username && !/^[a-zA-Z0-9._-]+$/.test(username)) {
      return NextResponse.json(
        {
          message:
            "Username may only contain letters, numbers, dots, underscores, and hyphens.",
        },
        { status: 400 },
      );
    }
    if (phone && !/^[0-9+().\-\s]*$/.test(phone)) {
      return NextResponse.json(
        { message: "Enter a valid phone number." },
        { status: 400 },
      );
    }
    if (id === admin.id && (role !== "admin" || !isActive)) {
      return NextResponse.json(
        {
          message:
            "Your administrator account must remain active and protected.",
        },
        { status: 400 },
      );
    }
    if (target.role.toLowerCase() === "admin" && role !== "admin") {
      return NextResponse.json(
        { message: "Administrator accounts cannot be demoted here." },
        { status: 409 },
      );
    }

    const user = await updatePortfolioUserByAdmin({
      id,
      firstName: firstName || null,
      lastName: lastName || null,
      displayName,
      username: username || null,
      phone: phone || null,
      role,
      isActive,
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Unable to update this user right now." },
      { status: 503 },
    );
  }
}

export async function POST(
  request: Request,
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
    const target = await findPortfolioUserById(id);
    if (!target) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    const role = body?.role === "admin" ? "admin" : null;
    if (!role) {
      return NextResponse.json(
        { message: "Only the administrator role can be granted here." },
        { status: 400 },
      );
    }

    const user = await setPortfolioUserRoleByAdmin(id, role);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Unable to grant administrator access right now." },
      { status: 503 },
    );
  }
}
