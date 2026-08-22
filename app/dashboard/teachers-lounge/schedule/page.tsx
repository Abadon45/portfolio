import { redirect } from "next/navigation";
import { getTeacherPortfolioUser } from "../../../../lib/portfolioAuth";
import ScheduleGeneratorClient from "./ScheduleGeneratorClient";

export const dynamic = "force-dynamic";

export default async function ScheduleCreatorPage() {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) redirect("/dashboard");
  return <ScheduleGeneratorClient />;
}
