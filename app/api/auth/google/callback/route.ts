import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createGoogleUser,
  createSession,
  findUserByEmail,
  findUserByGoogleId,
  linkGoogleIdentityToUser,
  normalizedAuthEmail,
  setSessionCookie,
  synchronizeGoogleUser,
} from "../../../../../lib/portfolioAuth";

export const runtime = "nodejs";

type GoogleProfile = {
  sub?: unknown;
  email?: unknown;
  email_verified?: unknown;
  given_name?: unknown;
  family_name?: unknown;
  name?: unknown;
  picture?: unknown;
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
  const expectedState = cookieStore.get("portfolio_google_state")?.value;
  const callbackUrl = cookieStore.get("portfolio_google_callback")?.value;

  if (error) return redirectToLogin(request, "Google sign-in was cancelled.");
  if (!state || !code || !expectedState || state !== expectedState) {
    return redirectToLogin(request, "The Google sign-in session expired. Please try again.");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    `${requestUrl.origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return redirectToLogin(request, "Google Sign-In is not configured.");
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenResponse.ok || !tokenData.access_token) {
      return redirectToLogin(request, "Google could not complete sign-in.");
    }

    const profileResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
    );
    const profile = (await profileResponse.json()) as GoogleProfile;
    const providerUserId = typeof profile.sub === "string" ? profile.sub : "";
    const email = typeof profile.email === "string" ? normalizedAuthEmail(profile.email) : "";
    const emailVerified = profile.email_verified === true;

    if (!profileResponse.ok || !providerUserId || !email || !emailVerified) {
      return redirectToLogin(request, "Google did not provide a verified email address.");
    }

    const firstName = typeof profile.given_name === "string" ? profile.given_name : null;
    const lastName = typeof profile.family_name === "string" ? profile.family_name : null;
    const fullName =
      typeof profile.name === "string" && profile.name.trim()
        ? profile.name.trim()
        : [firstName, lastName].filter(Boolean).join(" ") || email;
    const avatarUrl = typeof profile.picture === "string" ? profile.picture : null;

    let user = await findUserByGoogleId(providerUserId);
    if (user) {
      user = await synchronizeGoogleUser(String(user.id), {
        email,
        firstName,
        lastName,
        fullName,
        avatarUrl,
      });
    } else {
      const sameEmailUser = await findUserByEmail(email);
      if (sameEmailUser) {
        if (String(sameEmailUser.auth_provider) !== "password") {
          return redirectToLogin(request, "This Google identity is already linked to another account.");
        }

        user = await linkGoogleIdentityToUser(String(sameEmailUser.id), providerUserId, {
          email,
          firstName,
          lastName,
          fullName,
          avatarUrl,
        });
      } else {
        user = await createGoogleUser({
          providerUserId,
          email,
          firstName,
          lastName,
          fullName,
          avatarUrl,
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
    return redirectToLogin(request, "Google sign-in is temporarily unavailable.");
  }
}
