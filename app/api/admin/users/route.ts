import { NextResponse } from "next/server";
import {
  getAdminPortfolioUser,
  listPortfolioUsers,
} from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const admin = await getAdminPortfolioUser();
    if (!admin) {
      return NextResponse.json(
        { message: "Administrator access is required." },
        { status: 403 },
      );
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const search = url.searchParams.get("search") ?? "";
    const data = await listPortfolioUsers({ page, pageSize: 10, search });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Unable to load users right now." },
      { status: 503 },
    );
  }
}
