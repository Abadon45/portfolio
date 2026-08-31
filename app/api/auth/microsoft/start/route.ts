import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function safeCallbackUrl(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/profile";
}

export async function GET(request: Request) {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?authError=Microsoft+Sign-In+is+not+configured", request.url),
    );
  }

  const requestUrl = new URL(request.url);
  const tenant = process.env.MICROSOFT_TENANT ?? "common";
  const redirectUri =
    process.env.MICROSOFT_REDIRECT_URI ??
    `${requestUrl.origin}/api/auth/microsoft/callback`;
  const state = randomBytes(32).toString("base64url");
  const callbackUrl = safeCallbackUrl(requestUrl.searchParams.get("callbackUrl"));
  const microsoftUrl = new URL(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
  );

  microsoftUrl.searchParams.set("client_id", clientId);
  microsoftUrl.searchParams.set("redirect_uri", redirectUri);
  microsoftUrl.searchParams.set("response_type", "code");
  microsoftUrl.searchParams.set("scope", "openid profile email User.Read");
  microsoftUrl.searchParams.set("response_mode", "query");
  microsoftUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(microsoftUrl);
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set("portfolio_microsoft_state", state, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("portfolio_microsoft_callback", callbackUrl, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secure,
  });

  return response;
}
