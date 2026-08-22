import { redirect } from "next/navigation";
import { getTeacherPortfolioUser } from "../../../lib/portfolioAuth";
import TeacherLoungeClient from "./TeacherLoungeClient";

export const dynamic = "force-dynamic";

export default async function TeacherLoungePage() {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) redirect("/dashboard");
  return <TeacherLoungeClient teacherName={teacher.displayName} />;
}
