import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createOAuthUser,
  createSession,
  findUserByEmail,
  findUserByProviderId,
  linkOAuthIdentityToUser,
  normalizedAuthEmail,
  setSessionCookie,
  synchronizeOAuthUser,
} from "../../../../../lib/portfolioAuth";

export const runtime = "nodejs";

type MicrosoftProfile = {
  id?: unknown;
  mail?: unknown;
  userPrincipalName?: unknown;
  displayName?: unknown;
};

function redirectToLogin(request: Request, message: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("authError", message);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const state = requestUrl.searchParams.get("state");
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("portfolio_microsoft_state")?.value;
  const callbackUrl = cookieStore.get("portfolio_microsoft_callback")?.value;

  if (error) return redirectToLogin(request, "Microsoft sign-in was cancelled.");
  if (!state || !code || !expectedState || state !== expectedState) {
    return redirectToLogin(request, "The Microsoft sign-in session expired. Please try again.");
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const tenant = process.env.MICROSOFT_TENANT ?? "common";
  const redirectUri =
    process.env.MICROSOFT_REDIRECT_URI ??
    `${requestUrl.origin}/api/auth/microsoft/callback`;

  if (!clientId || !clientSecret) {
    return redirectToLogin(request, "Microsoft Sign-In is not configured.");
  }

  try {
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          scope: "openid profile email User.Read",
        }),
      },
    );
    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenResponse.ok || !tokenData.access_token) {
      return redirectToLogin(request, "Microsoft could not complete sign-in.");
    }

    const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = (await profileResponse.json()) as MicrosoftProfile;
    const providerUserId = typeof profile.id === "string" ? profile.id : "";
    const rawEmail =
      typeof profile.mail === "string"
        ? profile.mail
        : typeof profile.userPrincipalName === "string"
          ? profile.userPrincipalName
          : "";
    const email = rawEmail ? normalizedAuthEmail(rawEmail) : "";
    const fullName =
      typeof profile.displayName === "string" && profile.displayName.trim()
        ? profile.displayName.trim()
        : email;

    if (!profileResponse.ok || !providerUserId || !email) {
      return redirectToLogin(request, "Microsoft did not provide an email address.");
    }

    let user = await findUserByProviderId("microsoft", providerUserId);
    if (user) {
      user = await synchronizeOAuthUser(String(user.id), "microsoft", {
        email,
        fullName,
        avatarUrl: null,
      });
    } else {
      const sameEmailUser = await findUserByEmail(email);
      if (sameEmailUser) {
        user = await linkOAuthIdentityToUser(String(sameEmailUser.id), "microsoft", providerUserId, {
          email,
          fullName,
          avatarUrl: null,
        });
      } else {
        user = await createOAuthUser({
          provider: "microsoft",
          providerUserId,
          email,
          fullName,
          avatarUrl: null,
        });
      }
    }

    if (!user) return redirectToLogin(request, "Unable to create your application profile.");

    const token = await createSession(String(user.id));
    const destination = callbackUrl ? decodeURIComponent(callbackUrl) : "/profile";
    const response = NextResponse.redirect(new URL(destination, request.url));
    setSessionCookie(response, token);
    return response;
  } catch {
    return redirectToLogin(request, "Microsoft sign-in is temporarily unavailable.");
  }
}
