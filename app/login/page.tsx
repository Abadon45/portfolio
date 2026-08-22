import type { Metadata } from "next";
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
  return (
    <LoginClient
      authError={params?.authError}
      callbackUrl={safeCallbackUrl(params?.callbackUrl)}
      initialMode={params?.mode === "register" ? "register" : "login"}
    />
  );
}
