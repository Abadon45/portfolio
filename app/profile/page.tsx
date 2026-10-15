import { redirect } from "next/navigation";
import { getCurrentPortfolioUser } from "../../lib/portfolioAuth";
import ProfileClient from "./ProfileClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile | Noy Pangan",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await getCurrentPortfolioUser();
  if (!user) redirect("/login?callbackUrl=/profile");
  if (!user.setupCompleted) redirect("/profile/setup?callbackUrl=/profile");

  return <ProfileClient initialUser={user} />;
}
