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

type FacebookProfile = {
  id?: unknown;
  name?: unknown;
  email?: unknown;
  picture?: { data?: { url?: unknown } };
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
  const expectedState = cookieStore.get("portfolio_facebook_state")?.value;
  const callbackUrl = cookieStore.get("portfolio_facebook_callback")?.value;

  if (error) return redirectToLogin(request, "Facebook sign-in was cancelled.");
  if (!state || !code || !expectedState || state !== expectedState) {
    return redirectToLogin(request, "The Facebook sign-in session expired. Please try again.");
  }

  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const redirectUri =
    process.env.FACEBOOK_REDIRECT_URI ??
    `${requestUrl.origin}/api/auth/facebook/callback`;

  if (!clientId || !clientSecret) {
    return redirectToLogin(request, "Facebook Sign-In is not configured.");
  }

  try {
    const tokenUrl = new URL("https://graph.facebook.com/v22.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenResponse.ok || !tokenData.access_token) {
      return redirectToLogin(request, "Facebook could not complete sign-in.");
    }

    const profileUrl = new URL("https://graph.facebook.com/me");
    profileUrl.searchParams.set("fields", "id,name,email,picture.type(large)");
    profileUrl.searchParams.set("access_token", tokenData.access_token);
    const profileResponse = await fetch(profileUrl);
    const profile = (await profileResponse.json()) as FacebookProfile;
    const providerUserId = typeof profile.id === "string" ? profile.id : "";
    const email =
      typeof profile.email === "string" ? normalizedAuthEmail(profile.email) : "";
    const fullName =
      typeof profile.name === "string" && profile.name.trim()
        ? profile.name.trim()
        : email;
    const avatarUrl =
      typeof profile.picture?.data?.url === "string"
        ? profile.picture.data.url
        : null;

    if (!profileResponse.ok || !providerUserId || !email) {
      return redirectToLogin(request, "Facebook did not provide an email address.");
    }

    let user = await findUserByProviderId("facebook", providerUserId);
    if (user) {
      user = await synchronizeOAuthUser(String(user.id), "facebook", {
        email,
        fullName,
        avatarUrl,
      });
    } else {
      const sameEmailUser = await findUserByEmail(email);
      if (sameEmailUser) {
        user = await linkOAuthIdentityToUser(String(sameEmailUser.id), "facebook", providerUserId, {
          email,
          fullName,
          avatarUrl,
        });
      } else {
        user = await createOAuthUser({
          provider: "facebook",
          providerUserId,
          email,
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
    return redirectToLogin(request, "Facebook sign-in is temporarily unavailable.");
  }
}
