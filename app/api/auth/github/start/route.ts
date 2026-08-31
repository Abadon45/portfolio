import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function safeCallbackUrl(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/profile";
}

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?authError=GitHub+Sign-In+is+not+configured", request.url),
    );
  }

  const requestUrl = new URL(request.url);
  const redirectUri =
    process.env.GITHUB_REDIRECT_URI ??
    `${requestUrl.origin}/api/auth/github/callback`;
  const state = randomBytes(32).toString("base64url");
  const callbackUrl = safeCallbackUrl(requestUrl.searchParams.get("callbackUrl"));
  const githubUrl = new URL("https://github.com/login/oauth/authorize");

  githubUrl.searchParams.set("client_id", clientId);
  githubUrl.searchParams.set("redirect_uri", redirectUri);
  githubUrl.searchParams.set("scope", "read:user user:email");
  githubUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubUrl);
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set("portfolio_github_state", state, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("portfolio_github_callback", callbackUrl, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
    secure,
  });

  return response;
}
