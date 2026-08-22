import { notFound, redirect } from "next/navigation";
import { getTeacherPortfolioUser } from "../../../../../../../lib/portfolioAuth";
import { listSnedItems } from "../../../../../../../lib/snedLearning";
import SnedRosterClient from "../../../SnedRosterClient";

export const dynamic = "force-dynamic";

export default async function SnedCategoryPage({ params }: { params: Promise<{ language: string; category: string }> }) {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) redirect("/dashboard");
  const { language, category } = await params;
  if (language !== "asl" && language !== "fsl") notFound();
  const items = await listSnedItems(language, category);
  if (!items.length) notFound();
  return <SnedRosterClient language={language} category={category} items={items} />;
}
