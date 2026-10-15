import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentPortfolioUser } from "../../../lib/portfolioAuth";
import ProfileSetupClient from "./ProfileSetupClient";

export const metadata: Metadata = {
  title: "Complete Your Profile | Noy Pangan",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProfileSetupPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const user = await getCurrentPortfolioUser();
  if (!user) redirect("/login?callbackUrl=/profile/setup");
  if (user.setupCompleted) redirect("/profile");

  const params = await searchParams;
  const callbackUrl =
    params?.callbackUrl?.startsWith("/") && !params.callbackUrl.startsWith("//")
      ? params.callbackUrl
      : "/profile";

  return <ProfileSetupClient callbackUrl={callbackUrl} user={user} />;
}
