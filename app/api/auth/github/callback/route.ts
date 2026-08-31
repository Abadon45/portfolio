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

type GithubProfile = {
  id?: unknown;
  login?: unknown;
  name?: unknown;
  email?: unknown;
  avatar_url?: unknown;
};

type GithubEmail = {
  email?: unknown;
  primary?: unknown;
  verified?: unknown;
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
  const expectedState = cookieStore.get("portfolio_github_state")?.value;
  const callbackUrl = cookieStore.get("portfolio_github_callback")?.value;

  if (error) return redirectToLogin(request, "GitHub sign-in was cancelled.");
  if (!state || !code || !expectedState || state !== expectedState) {
    return redirectToLogin(request, "The GitHub sign-in session expired. Please try again.");
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri =
    process.env.GITHUB_REDIRECT_URI ??
    `${requestUrl.origin}/api/auth/github/callback`;

  if (!clientId || !clientSecret) {
    return redirectToLogin(request, "GitHub Sign-In is not configured.");
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenResponse.ok || !tokenData.access_token) {
      return redirectToLogin(request, "GitHub could not complete sign-in.");
    }

    const githubHeaders = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${tokenData.access_token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    };
    const [profileResponse, emailsResponse] = await Promise.all([
      fetch("https://api.github.com/user", { headers: githubHeaders }),
      fetch("https://api.github.com/user/emails", { headers: githubHeaders }),
    ]);
    const profile = (await profileResponse.json()) as GithubProfile;
    const emails = (await emailsResponse.json()) as GithubEmail[];
    const verifiedEmail = emails.find(
      (item) => item.primary === true && item.verified === true,
    ) ?? emails.find((item) => item.verified === true);
    const rawEmail =
      typeof verifiedEmail?.email === "string"
        ? verifiedEmail.email
        : typeof profile.email === "string"
          ? profile.email
          : "";
    const email = rawEmail ? normalizedAuthEmail(rawEmail) : "";
    const providerUserId = typeof profile.id === "number" ? String(profile.id) : "";

    if (!profileResponse.ok || !emailsResponse.ok || !providerUserId || !email) {
      return redirectToLogin(request, "GitHub did not provide a verified email address.");
    }

    const login = typeof profile.login === "string" ? profile.login : email;
    const fullName =
      typeof profile.name === "string" && profile.name.trim()
        ? profile.name.trim()
        : login;
    const avatarUrl =
      typeof profile.avatar_url === "string" ? profile.avatar_url : null;

    let user = await findUserByProviderId("github", providerUserId);
    if (user) {
      user = await synchronizeOAuthUser(String(user.id), "github", {
        email,
        fullName,
        avatarUrl,
      });
    } else {
      const sameEmailUser = await findUserByEmail(email);
      if (sameEmailUser) {
        user = await linkOAuthIdentityToUser(String(sameEmailUser.id), "github", providerUserId, {
          email,
          fullName,
          avatarUrl,
        });
      } else {
        user = await createOAuthUser({
          provider: "github",
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
    return redirectToLogin(request, "GitHub sign-in is temporarily unavailable.");
  }
}
