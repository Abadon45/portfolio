import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const result = await sql`
  update saas_demo.store_products
  set stock = ${99}, source_quantity = ${99}, updated_at = now()
  where sku like ${"lazada-%"}
    and (stock is null or stock = 0)
  returning slug
`;

const summary = await sql`
  select
    count(*)::int as products,
    count(*) filter (where stock = 99)::int as stock_99,
    count(*) filter (where jsonb_array_length(images) > 0)::int as with_images,
    count(*) filter (where jsonb_array_length(image_sources) > 0 and image_sources->0->>'source' = 'external')::int as with_external_image_provenance
  from saas_demo.store_products
  where sku like ${"lazada-%"}
`;

console.log(JSON.stringify({ updated: result.length, defaultStock: 99, ...summary[0] }, null, 2));
