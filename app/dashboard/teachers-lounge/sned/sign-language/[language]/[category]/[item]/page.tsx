import { notFound, redirect } from "next/navigation";
import { getTeacherPortfolioUser } from "../../../../../../../../lib/portfolioAuth";
import { getSnedItem, listSnedItems } from "../../../../../../../../lib/snedLearning";
import SnedLessonClient from "../../../../SnedLessonClient";

export const dynamic = "force-dynamic";

export default async function SnedLessonPage({ params }: { params: Promise<{ language: string; category: string; item: string }> }) {
  const teacher = await getTeacherPortfolioUser();
  if (!teacher) redirect("/dashboard");
  const { language, category, item } = await params;
  if (language !== "asl" && language !== "fsl") notFound();
  const lesson = await getSnedItem(language, category, item);
  if (!lesson) notFound();
  const items = await listSnedItems(language, category);
  return <SnedLessonClient lesson={lesson} previous={items[lesson.position - 2] ?? null} next={items[lesson.position] ?? null} />;
}
