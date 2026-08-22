import { notFound, redirect } from "next/navigation";
import { getTeacherPortfolioUser } from "../../../../../../lib/portfolioAuth";
import { listSnedCategories } from "../../../../../../lib/snedLearning";
import SnedCategoryBrowser from "../../SnedCategoryBrowser";

export const dynamic = "force-dynamic";

export default async function SignLanguagePage({ params }: { params: Promise<{ language: string }> }) {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) redirect("/dashboard");
  const { language } = await params;
  if (language !== "asl" && language !== "fsl") notFound();
  return <SnedCategoryBrowser language={language} categories={await listSnedCategories(language)} />;
}
