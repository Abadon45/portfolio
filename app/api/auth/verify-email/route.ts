import { NextResponse } from "next/server";
import {
  createSession,
  normalizedAuthEmail,
  publicUser,
  setSessionCookie,
  verifyEmailCode,
} from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? normalizedAuthEmail(body.email) : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ message: "Enter the 6-digit confirmation code." }, { status: 400 });
  }

  try {
    const user = await verifyEmailCode(email, code);
    if (!user) {
      return NextResponse.json(
        { message: "That code is invalid or expired." },
        { status: 400 },
      );
    }

    const token = await createSession(String(user.id));
    const response = NextResponse.json({ user: publicUser(user) });
    setSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json(
      { message: "Email verification is temporarily unavailable." },
      { status: 503 },
    );
  }
}
