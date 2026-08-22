import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const sql = neon(databaseUrl);

await sql`create schema if not exists saas_demo`;

await sql`
  create table if not exists saas_demo.products (
    id text primary key,
    supplier_product_id text not null unique,
    inventory_id text not null unique,
    name text not null,
    sku text not null unique,
    category text not null,
    supplier text not null,
    supplier_price numeric(12, 2) not null default 0,
    price numeric(12, 2) not null default 0,
    margin numeric(5, 2) not null default 0,
    stock integer not null default 0,
    reserved integer not null default 0,
    available integer not null default 0,
    reorder_point integer not null default 0,
    reorder_quantity integer not null default 0,
    commission_rate numeric(5, 2) not null default 0,
    status text not null default 'Active',
    sold integer not null default 0,
    revenue numeric(14, 2) not null default 0,
    featured boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (status in ('Active', 'Draft', 'Archived')),
    check (stock >= 0),
    check (reserved >= 0),
    check (available >= 0),
    check (reorder_point >= 0),
    check (available <= stock)
  )
`;

await sql`
  create table if not exists saas_demo.inventory_movements (
    id text primary key,
    product_id text not null references saas_demo.products(id) on delete cascade,
    movement_type text not null,
    quantity integer not null,
    reference text not null,
    reference_type text not null,
    user_name text not null,
    created_at timestamptz not null default now(),
    check (movement_type in ('Received', 'Sold', 'Adjusted', 'Returned', 'Reserved', 'Released'))
  )
`;

await sql`
  create table if not exists saas_demo.orders (
    id text primary key,
    customer text not null,
    store text not null,
    product text not null,
    quantity integer not null,
    total numeric(14, 2) not null,
    status text not null,
    order_date text not null,
    order_type text not null default 'storefront'
  )
`;

await sql`
  create table if not exists saas_demo.price_requests (
    id text primary key,
    product text not null,
    current_price numeric(12, 2) not null,
    proposed_price numeric(12, 2) not null,
    reason text not null,
    status text not null,
    reviewer text not null,
    created_at timestamptz not null default now()
  )
`;

await sql`
  create table if not exists saas_demo.settlements (
    id text primary key,
    period text not null,
    orders integer not null,
    gross numeric(14, 2) not null,
    fees numeric(14, 2) not null,
    payable numeric(14, 2) not null,
    status text not null
  )
`;

await sql`
  create table if not exists saas_demo.payouts (
    id text primary key,
    payout_date text not null,
    amount numeric(14, 2) not null,
    method text not null,
    status text not null,
    reference text not null
  )
`;

await sql`
  create table if not exists saas_demo.affiliate_links (
    id text primary key,
    product text not null,
    slug text not null unique,
    clicks integer not null default 0,
    orders integer not null default 0,
    revenue numeric(14, 2) not null default 0,
    commission numeric(14, 2) not null default 0
  )
`;

await sql`
  create table if not exists saas_demo.subscriptions (
    id text primary key,
    plan text not null,
    status text not null,
    monthly_price numeric(12, 2) not null,
    renewal_date text not null,
    usage_percent integer not null,
    stores integer not null
  )
`;

const products = [
  ["p1", "sp-2048", "si-2048", "Northstar Daily Kit", "NS-2048", "Wellness", "Vela Supply Co.", 876, 1280, 31.8, 248, 18, 230, 40, 120, 8, "Active", 842, 1077760, true],
  ["p2", "sp-1884", "si-1884", "Hydrate+ Electrolytes", "NS-1884", "Nutrition", "Brightwell Labs", 489.6, 680, 28.4, 86, 12, 74, 30, 60, 8, "Active", 416, 282880, true],
  ["p3", "sp-1742", "si-1742", "Recovery Travel Set", "NS-1742", "Wellness", "Vela Supply Co.", 1587.2, 2480, 36.2, 14, 8, 6, 20, 50, 8, "Active", 218, 540640, false],
  ["p4", "sp-1609", "si-1609", "Focus Desk Bundle", "NS-1609", "Lifestyle", "Morrow Goods", 1470.3, 1950, 24.1, 0, 0, 0, 12, 40, 8, "Active", 132, 257400, false],
];

for (const product of products) {
  await sql`
    insert into saas_demo.products (
      id, supplier_product_id, inventory_id, name, sku, category, supplier,
      supplier_price, price, margin, stock, reserved, available, reorder_point,
      reorder_quantity, commission_rate, status, sold, revenue, featured
    ) values (
      ${product[0]}, ${product[1]}, ${product[2]}, ${product[3]}, ${product[4]},
      ${product[5]}, ${product[6]}, ${product[7]}, ${product[8]}, ${product[9]},
      ${product[10]}, ${product[11]}, ${product[12]}, ${product[13]}, ${product[14]},
      ${product[15]}, ${product[16]}, ${product[17]}, ${product[18]}, ${product[19]}
    )
    on conflict (id) do update set
      name = excluded.name,
      sku = excluded.sku,
      category = excluded.category,
      supplier = excluded.supplier,
      supplier_price = excluded.supplier_price,
      price = excluded.price,
      margin = excluded.margin,
      stock = excluded.stock,
      reserved = excluded.reserved,
      available = excluded.available,
      reorder_point = excluded.reorder_point,
      reorder_quantity = excluded.reorder_quantity,
      commission_rate = excluded.commission_rate,
      status = excluded.status,
      sold = excluded.sold,
      revenue = excluded.revenue,
      featured = excluded.featured,
      updated_at = now()
  `;
}

const movements = [
  ["m1", "p1", "Received", 120, "PO-2048", "purchase", "Emmanuel Santos"],
  ["m2", "p3", "Sold", -18, "#NC-10261", "sale", "System"],
  ["m3", "p2", "Sold", -12, "#NC-10244", "sale", "System"],
  ["m4", "p4", "Adjusted", -4, "ADJ-0081", "adjustment", "Emmanuel Santos"],
];

for (const movement of movements) {
  await sql`
    insert into saas_demo.inventory_movements
      (id, product_id, movement_type, quantity, reference, reference_type, user_name)
    values (${movement[0]}, ${movement[1]}, ${movement[2]}, ${movement[3]}, ${movement[4]}, ${movement[5]}, ${movement[6]})
    on conflict (id) do nothing
  `;
}

await sql`
  insert into saas_demo.orders (id, customer, store, product, quantity, total, status, order_date, order_type)
  values
    ('#NC-10282', 'Mara Villanueva', 'Northstar Wellness', 'Northstar Daily Kit', 2, 8420, 'Processing', 'Today, 10:24', 'storefront'),
    ('#NC-10281', 'Paolo Reyes', 'Northstar Home', 'Hydrate+ Electrolytes', 3, 3180, 'Completed', 'Today, 09:51', 'storefront'),
    ('#NC-10280', 'Althea Cruz', 'Northstar Wellness', 'Recovery Travel Set', 1, 2480, 'New', 'Yesterday, 18:08', 'storefront'),
    ('#NC-10279', 'Jonas Lim', 'Northstar Essentials', 'Northstar Daily Kit', 1, 2890, 'Shipped', 'Yesterday, 16:42', 'storefront'),
    ('#NC-10278', 'Camille Santos', 'Northstar Wellness', 'Hydrate+ Electrolytes', 4, 5740, 'Exception', 'Yesterday, 14:13', 'storefront')
  on conflict (id) do nothing
`;

await sql`
  insert into saas_demo.price_requests (id, product, current_price, proposed_price, reason, status, reviewer)
  values
    ('PR-018', 'Recovery Travel Set', 2480, 2690, 'Supplier cost increased 6%.', 'Under review', 'Commerce team'),
    ('PR-017', 'Hydrate+ Electrolytes', 680, 720, 'Align with updated packaging cost.', 'Approved', 'A. Mendoza')
  on conflict (id) do nothing
`;

await sql`
  insert into saas_demo.settlements (id, period, orders, gross, fees, payable, status)
  values
    ('SET-8128', 'Aug 16–21, 2026', 184, 285400, 14270, 271130, 'Approved'),
    ('SET-8104', 'Aug 09–15, 2026', 162, 198300, 9915, 188385, 'Paid')
  on conflict (id) do nothing
`;

await sql`
  insert into saas_demo.payouts (id, payout_date, amount, method, status, reference)
  values
    ('PO-4421', 'Aug 21', 48220, 'GCash', 'Paid', 'SET-8128'),
    ('PO-4412', 'Aug 14', 62480, 'Bank transfer', 'Processing', 'SET-8104'),
    ('PO-4402', 'Aug 07', 38920, 'GCash', 'Paid', 'SET-8079')
  on conflict (id) do nothing
`;

await sql`
  insert into saas_demo.affiliate_links (id, product, slug, clicks, orders, revenue, commission)
  values
    ('link-1', 'Northstar Daily Kit', 'emmanuel-kit', 1204, 28, 35840, 4280),
    ('link-2', 'Hydrate+ Electrolytes', 'hydrate', 743, 15, 18220, 2180),
    ('link-3', 'Recovery Travel Set', 'recovery', 320, 9, 12600, 1512)
  on conflict (id) do nothing
`;

await sql`
  insert into saas_demo.subscriptions (id, plan, status, monthly_price, renewal_date, usage_percent, stores)
  values ('workspace-1', 'Business Pro', 'Active', 1999, 'September 21, 2026', 84, 3)
  on conflict (id) do nothing
`;

const counts = await sql`
  select table_name, table_rows
  from (
    select 'products' as table_name, count(*)::int as table_rows from saas_demo.products
    union all select 'inventory_movements', count(*)::int from saas_demo.inventory_movements
    union all select 'orders', count(*)::int from saas_demo.orders
    union all select 'price_requests', count(*)::int from saas_demo.price_requests
    union all select 'settlements', count(*)::int from saas_demo.settlements
    union all select 'payouts', count(*)::int from saas_demo.payouts
    union all select 'affiliate_links', count(*)::int from saas_demo.affiliate_links
    union all select 'subscriptions', count(*)::int from saas_demo.subscriptions
  ) seeded
  order by table_name
`;

console.log(JSON.stringify(counts, null, 2));
