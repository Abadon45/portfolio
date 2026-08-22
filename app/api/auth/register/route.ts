import { NextResponse } from "next/server";
import {
  createPendingUser,
  findUserByEmail,
  hashPassword,
  normalizedAuthEmail,
  sendEmailVerificationCode,
} from "../../../../lib/portfolioAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? normalizedAuthEmail(body.email) : "";
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !displayName || password.length < 8) {
    return NextResponse.json(
      { message: "Name, email, and a password of at least 8 characters are required." },
      { status: 400 },
    );
  }

  try {
    if (await findUserByEmail(email)) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 },
      );
    }

    const registration = await createPendingUser({
      email,
      displayName,
      passwordHash: await hashPassword(password),
    });
    const delivery = await sendEmailVerificationCode(email, registration.code);

    return NextResponse.json({
      message: "Check your email for the confirmation code.",
      ...(delivery.developmentCode ? { developmentCode: delivery.developmentCode } : {}),
    });
  } catch {
    return NextResponse.json(
      { message: "Registration or email delivery is temporarily unavailable." },
      { status: 503 },
    );
  }
}
