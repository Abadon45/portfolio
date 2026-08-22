import { NextResponse } from "next/server";
import {
  createSession,
  findUserByEmail,
  normalizedAuthEmail,
  publicUser,
  setSessionCookie,
  verifyPassword,
} from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? normalizedAuthEmail(body.email) : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const user = await findUserByEmail(email);
    const valid = user
      ? await verifyPassword(password, String(user.password_hash))
      : false;

    if (!user || !valid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    if (!user.email_verified_at) {
      return NextResponse.json(
        { message: "Please confirm your email before signing in." },
        { status: 403 },
      );
    }

    const token = await createSession(String(user.id));
    const response = NextResponse.json({ user: publicUser(user) });
    setSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json(
      { message: "Authentication is temporarily unavailable." },
      { status: 503 },
    );
  }
}
