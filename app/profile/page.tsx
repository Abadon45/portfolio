import { redirect } from "next/navigation";
import { getCurrentPortfolioUser } from "../../lib/portfolioAuth";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getCurrentPortfolioUser();
  if (!user) redirect("/login?callbackUrl=/profile");
  if (!user.setupCompleted) redirect("/profile/setup?callbackUrl=/profile");

  return <ProfileClient initialUser={user} />;
}
