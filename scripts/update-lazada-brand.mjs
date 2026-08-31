import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const result = await sql`
  update saas_demo.store_products
  set brand = ${"Avon"}, updated_at = now()
  where source_product_id is not null
    and sku like ${"lazada-%"}
    and (brand is null or brand = ${""})
`;

const remaining = await sql`
  select shop, count(*)::int as count
  from saas_demo.store_products
  where source_product_id is not null and brand is null
  group by shop
  order by count desc
`;
const summary = await sql`
  select
    count(*)::int as products,
    count(*) filter (where brand is not null and brand <> '')::int as with_brand,
    count(*) filter (where category_1 is not null and category_2 is not null)::int as with_categories,
    count(*) filter (where description_1 is not null and length(description_1) > 0)::int as with_descriptions,
    count(*) filter (where customer_price > 0)::int as with_prices,
    count(*) filter (where slug is not null and slug <> '')::int as with_slugs
  from saas_demo.store_products
  where sku like ${"lazada-%"}
`;

console.log(JSON.stringify({ updated: result.length, summary: summary[0], remaining }, null, 2));
