import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function safeCallbackUrl(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/profile";
}

export async function GET(request: Request) {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?authError=Facebook+Sign-In+is+not+configured", request.url),
    );
  }

  const requestUrl = new URL(request.url);
  const redirectUri =
    process.env.FACEBOOK_REDIRECT_URI ??
    `${requestUrl.origin}/api/auth/facebook/callback`;
  const state = randomBytes(32).toString("base64url");
  const callbackUrl = safeCallbackUrl(requestUrl.searchParams.get("callbackUrl"));
  const facebookUrl = new URL("https://www.facebook.com/v22.0/dialog/oauth");

  facebookUrl.searchParams.set("client_id", clientId);
  facebookUrl.searchParams.set("redirect_uri", redirectUri);
  facebookUrl.searchParams.set("response_type", "code");
  facebookUrl.searchParams.set("scope", "email,public_profile");
  facebookUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(facebookUrl);
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set("portfolio_facebook_state", state, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("portfolio_facebook_callback", callbackUrl, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secure,
  });

  return response;
}
