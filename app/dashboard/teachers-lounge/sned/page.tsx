import { redirect } from "next/navigation";
import { getTeacherPortfolioUser } from "../../../../lib/portfolioAuth";
import { listSnedLanguages } from "../../../../lib/snedLearning";
import SnedLandingClient from "./SnedLandingClient";

export const dynamic = "force-dynamic";

export default async function SnedLearningPage() {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) redirect("/dashboard");
  return <SnedLandingClient languages={await listSnedLanguages()} />;
}
