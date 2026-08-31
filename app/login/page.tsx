import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentPortfolioUser } from "../../lib/portfolioAuth";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Authentication demo",
  description: "A Neon-backed authentication demonstration from the portfolio.",
};

type LoginPageProps = {
  searchParams?: Promise<{
    authError?: string;
    callbackUrl?: string;
    mode?: string;
  }>;
};

function safeCallbackUrl(value: string | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/profile";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  let user: Awaited<ReturnType<typeof getCurrentPortfolioUser>> = null;
  try {
    user = await getCurrentPortfolioUser();
  } catch {
    user = null;
  }

  if (user) {
    if (!user.setupCompleted) {
      redirect(
        `/profile/setup?callbackUrl=${encodeURIComponent(safeCallbackUrl(params?.callbackUrl))}`,
      );
    }
    redirect("/profile");
  }

  return (
    <LoginClient
      authError={params?.authError}
      callbackUrl={safeCallbackUrl(params?.callbackUrl)}
      facebookConfigured={Boolean(process.env.FACEBOOK_CLIENT_ID)}
      microsoftConfigured={Boolean(process.env.MICROSOFT_CLIENT_ID)}
      initialMode={params?.mode === "register" ? "register" : "login"}
    />
  );
}
