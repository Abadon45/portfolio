import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  deleteCurrentSession,
} from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await deleteCurrentSession();
    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);
    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to end the current session." },
      { status: 503 },
    );
  }
}
