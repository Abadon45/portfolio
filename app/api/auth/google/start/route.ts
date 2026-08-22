import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function safeCallbackUrl(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/profile";
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?authError=Google+Sign-In+is+not+configured", request.url));
  }

  const requestUrl = new URL(request.url);
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    `${requestUrl.origin}/api/auth/google/callback`;
  const state = randomBytes(32).toString("base64url");
  const callbackUrl = safeCallbackUrl(requestUrl.searchParams.get("callbackUrl"));
  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  googleUrl.searchParams.set("client_id", clientId);
  googleUrl.searchParams.set("redirect_uri", redirectUri);
  googleUrl.searchParams.set("response_type", "code");
  googleUrl.searchParams.set("scope", "openid email profile");
  googleUrl.searchParams.set("state", state);
  googleUrl.searchParams.set("access_type", "online");

  const response = NextResponse.redirect(googleUrl);
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set("portfolio_google_state", state, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("portfolio_google_callback", callbackUrl, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secure,
  });

  return response;
}
