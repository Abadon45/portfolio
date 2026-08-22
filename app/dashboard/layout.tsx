import { redirect } from "next/navigation";
import { getDashboardPortfolioUser } from "../../lib/portfolioAuth";
import DashboardShell from "./_components/DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getDashboardPortfolioUser();
  if (!user) redirect("/login?callbackUrl=/dashboard");

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
