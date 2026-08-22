import "server-only";

import { getNeonSql } from "./neon";
import { getCurrentPortfolioUser } from "./portfolioAuth";

export type SnedLanguage = {
  id: string;
  code: "asl" | "fsl";
  name: string;
  description: string;
};

export type SnedCategory = {
  id: string;
  languageCode: "asl" | "fsl";
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  learnedCount: number;
};

export type SnedItem = {
  id: string;
  languageCode: "asl" | "fsl";
  languageName: string;
  categoryName: string;
  categorySlug: string;
  word: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
  videoUrl: string | null;
  videoProvider: string | null;
  isDemo: boolean;
  learned: boolean;
  practiceCount: number;
  position: number;
  totalInCategory: number;
};

function languageCode(value: unknown): "asl" | "fsl" {
  return value === "fsl" ? "fsl" : "asl";
}

function itemFromRow(row: Record<string, unknown>): SnedItem {
  return {
    id: String(row.id),
    languageCode: languageCode(row.language_code),
    languageName: String(row.language_name),
    categoryName: String(row.category_name),
    categorySlug: String(row.category_slug),
    word: String(row.word),
    slug: String(row.slug),
    description: String(row.description),
    imageUrl: row.image_url ? String(row.image_url) : null,
    imageAlt: String(row.image_alt ?? `${row.word} learning visual`),
    videoUrl: row.video_url ? String(row.video_url) : null,
    videoProvider: row.video_provider ? String(row.video_provider) : null,
    isDemo: Boolean(row.is_demo),
    learned: Boolean(row.learned),
    practiceCount: Number(row.practice_count ?? 0),
    position: Number(row.position),
    totalInCategory: Number(row.total_in_category),
  };
}

async function getLearner() {
  const user = await getCurrentPortfolioUser();
  return user?.isActive ? user : null;
}

export async function listSnedLanguages() {
  const user = await getLearner();
  if (!user) return [];
  const sql = getNeonSql();
  const rows = await sql`
    select id, code, name, description
    from portfolio_auth.sned_languages
    order by sort_order, name
  `;
  return rows.map((row) => ({
    id: String(row.id),
    code: languageCode(row.code),
    name: String(row.name),
    description: String(row.description),
  }));
}

export async function listSnedCategories(code: "asl" | "fsl") {
  const user = await getLearner();
  if (!user) return [];
  const sql = getNeonSql();
  const rows = await sql`
    select c.id, l.code as language_code, c.name, c.slug, c.description,
      count(i.id)::int as item_count,
      count(p.item_id) filter (where p.completed)::int as learned_count
    from portfolio_auth.sned_categories c
    join portfolio_auth.sned_languages l on l.id = c.language_id
    left join portfolio_auth.sned_items i on i.category_id = c.id and i.status = 'published'
    left join portfolio_auth.sned_progress p on p.item_id = i.id and p.user_id = ${user.id}
    where l.code = ${code}
    group by c.id, l.code, c.name, c.slug, c.description, c.sort_order
    order by c.sort_order, c.name
  `;
  return rows.map((row) => ({
    id: String(row.id),
    languageCode: languageCode(row.language_code),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description),
    itemCount: Number(row.item_count),
    learnedCount: Number(row.learned_count),
  } satisfies SnedCategory));
}

export async function listSnedItems(code: "asl" | "fsl", categorySlug: string) {
  const user = await getLearner();
  if (!user) return [];
  const sql = getNeonSql();
  const rows = await sql`
    select i.*, l.code as language_code, l.name as language_name,
      c.name as category_name, c.slug as category_slug,
      row_number() over (order by i.sort_order, i.word)::int as position,
      count(*) over ()::int as total_in_category,
      coalesce(p.completed, false) as learned,
      coalesce(p.practice_count, 0)::int as practice_count
    from portfolio_auth.sned_items i
    join portfolio_auth.sned_categories c on c.id = i.category_id
    join portfolio_auth.sned_languages l on l.id = c.language_id
    left join portfolio_auth.sned_progress p on p.item_id = i.id and p.user_id = ${user.id}
    where l.code = ${code} and c.slug = ${categorySlug} and i.status = 'published'
    order by i.sort_order, i.word
  `;
  return rows.map(itemFromRow);
}

export async function getSnedItem(
  code: "asl" | "fsl",
  categorySlug: string,
  itemSlug: string,
) {
  const items = await listSnedItems(code, categorySlug);
  return items.find((item) => item.slug === itemSlug) ?? null;
}

export async function markSnedItemLearned(itemId: string) {
  const user = await getLearner();
  if (!user) return null;
  const sql = getNeonSql();
  const rows = await sql`
    insert into portfolio_auth.sned_progress
      (user_id, item_id, completed, completed_at, practice_count, updated_at)
    select ${user.id}, i.id, true, now(), 1, now()
    from portfolio_auth.sned_items i
    where i.id = ${itemId} and i.status = 'published'
    on conflict (user_id, item_id) do update set
      completed = true,
      completed_at = coalesce(portfolio_auth.sned_progress.completed_at, now()),
      practice_count = portfolio_auth.sned_progress.practice_count + 1,
      updated_at = now()
    returning completed, practice_count
  `;
  return rows[0]
    ? { completed: Boolean(rows[0].completed), practiceCount: Number(rows[0].practice_count) }
    : null;
}
