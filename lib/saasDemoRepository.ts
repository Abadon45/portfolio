import { getNeonSql } from "./neon";
import type {
  AffiliateLink,
  InventoryMovement,
  Order,
  Payout,
  PriceRequest,
  Product,
  Settlement,
  Subscription,
} from "../app/saas-platform/_components/commerceOsData";

type DatabaseRow = Record<string, unknown>;

const stringValue = (value: unknown) => String(value ?? "");
const numberValue = (value: unknown) => Number(value ?? 0);
const booleanValue = (value: unknown) => Boolean(value);

function mapProduct(row: DatabaseRow): Product {
  return {
    id: stringValue(row.id),
    supplierProductId: stringValue(row.supplier_product_id),
    inventoryId: stringValue(row.inventory_id),
    name: stringValue(row.name),
    sku: stringValue(row.sku),
    category: stringValue(row.category),
    supplier: stringValue(row.supplier),
    supplierPrice: numberValue(row.supplier_price),
    price: numberValue(row.price),
    margin: numberValue(row.margin),
    stock: numberValue(row.stock),
    reserved: numberValue(row.reserved),
    available: numberValue(row.available),
    reorderPoint: numberValue(row.reorder_point),
    reorderQuantity: numberValue(row.reorder_quantity),
    commissionRate: numberValue(row.commission_rate),
    status: row.status as Product["status"],
    sold: numberValue(row.sold),
    revenue: numberValue(row.revenue),
    featured: booleanValue(row.featured),
  };
}

function mapMovement(row: DatabaseRow): InventoryMovement {
  return {
    id: stringValue(row.id),
    date: new Date(stringValue(row.created_at)).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    }),
    product: stringValue(row.product_name),
    type: row.movement_type as InventoryMovement["type"],
    quantity: numberValue(row.quantity),
    reference: stringValue(row.reference),
    user: stringValue(row.user_name),
    referenceType: row.reference_type as InventoryMovement["referenceType"],
  };
}

function mapOrder(row: DatabaseRow): Order {
  return {
    id: stringValue(row.id),
    customer: stringValue(row.customer),
    store: stringValue(row.store),
    product: stringValue(row.product),
    quantity: numberValue(row.quantity),
    total: numberValue(row.total),
    status: row.status as Order["status"],
    date: stringValue(row.order_date),
  };
}

function mapPriceRequest(row: DatabaseRow): PriceRequest {
  return {
    id: stringValue(row.id),
    product: stringValue(row.product),
    current: numberValue(row.current_price),
    proposed: numberValue(row.proposed_price),
    reason: stringValue(row.reason),
    status: row.status as PriceRequest["status"],
    reviewer: stringValue(row.reviewer),
  };
}

function mapSettlement(row: DatabaseRow): Settlement {
  return {
    id: stringValue(row.id),
    period: stringValue(row.period),
    orders: numberValue(row.orders),
    gross: numberValue(row.gross),
    fees: numberValue(row.fees),
    payable: numberValue(row.payable),
    status: row.status as Settlement["status"],
  };
}

function mapPayout(row: DatabaseRow): Payout {
  return {
    id: stringValue(row.id),
    date: stringValue(row.payout_date),
    amount: numberValue(row.amount),
    method: row.method as Payout["method"],
    status: row.status as Payout["status"],
    reference: stringValue(row.reference),
  };
}

function mapAffiliateLink(row: DatabaseRow): AffiliateLink {
  return {
    id: stringValue(row.id),
    product: stringValue(row.product),
    slug: stringValue(row.slug),
    clicks: numberValue(row.clicks),
    orders: numberValue(row.orders),
    revenue: numberValue(row.revenue),
    commission: numberValue(row.commission),
  };
}

function mapSubscription(row: DatabaseRow): Subscription {
  return {
    plan: row.plan as Subscription["plan"],
    status: row.status as Subscription["status"],
    monthlyPrice: numberValue(row.monthly_price),
    renewalDate: stringValue(row.renewal_date),
    usagePercent: numberValue(row.usage_percent),
    stores: numberValue(row.stores),
  };
}

export type SaaSData = {
  products: Product[];
  movements: InventoryMovement[];
  orders: Order[];
  priceRequests: PriceRequest[];
  settlements: Settlement[];
  payouts: Payout[];
  affiliateLinks: AffiliateLink[];
  subscription: Subscription | null;
};

export async function getSaaSData(): Promise<SaaSData> {
  const sql = getNeonSql();
  const [products, movements, orders, priceRequests, settlements, payouts, links, subscriptions] =
    await Promise.all([
      sql`select * from saas_demo.products order by created_at desc`,
      sql`
        select m.*, p.name as product_name
        from saas_demo.inventory_movements m
        join saas_demo.products p on p.id = m.product_id
        order by m.created_at desc
      `,
      sql`select * from saas_demo.orders order by order_date desc`,
      sql`select * from saas_demo.price_requests order by created_at desc`,
      sql`select * from saas_demo.settlements order by id desc`,
      sql`select * from saas_demo.payouts order by payout_date desc`,
      sql`select * from saas_demo.affiliate_links order by clicks desc`,
      sql`select * from saas_demo.subscriptions order by id limit 1`,
    ]);

  return {
    products: products.map(mapProduct),
    movements: movements.map(mapMovement),
    orders: orders.map(mapOrder),
    priceRequests: priceRequests.map(mapPriceRequest),
    settlements: settlements.map(mapSettlement),
    payouts: payouts.map(mapPayout),
    affiliateLinks: links.map(mapAffiliateLink),
    subscription: subscriptions[0] ? mapSubscription(subscriptions[0]) : null,
  };
}

export type ProductMutation = Omit<
  Product,
  "id" | "supplierProductId" | "inventoryId" | "sold" | "revenue" | "available"
>;

export async function createSaaSProduct(product: ProductMutation) {
  const sql = getNeonSql();
  const id = `p-${crypto.randomUUID()}`;
  const supplierProductId = `sp-${crypto.randomUUID()}`;
  const inventoryId = `si-${crypto.randomUUID()}`;
  const available = Math.max(0, product.stock - product.reserved);

  const rows = await sql`
    insert into saas_demo.products (
      id, supplier_product_id, inventory_id, name, sku, category, supplier,
      supplier_price, price, margin, stock, reserved, available, reorder_point,
      reorder_quantity, commission_rate, status, sold, revenue, featured
    ) values (
      ${id}, ${supplierProductId}, ${inventoryId}, ${product.name}, ${product.sku},
      ${product.category}, ${product.supplier}, ${product.supplierPrice}, ${product.price},
      ${product.margin}, ${product.stock}, ${product.reserved}, ${available},
      ${product.reorderPoint}, ${product.reorderQuantity}, ${product.commissionRate},
      ${product.status}, 0, 0, ${product.featured}
    ) returning *
  `;

  return mapProduct(rows[0]);
}

export async function updateSaaSProduct(id: string, product: ProductMutation) {
  const sql = getNeonSql();
  const available = Math.max(0, product.stock - product.reserved);
  const rows = await sql`
    update saas_demo.products set
      name = ${product.name}, sku = ${product.sku}, category = ${product.category},
      supplier = ${product.supplier}, supplier_price = ${product.supplierPrice},
      price = ${product.price}, margin = ${product.margin}, stock = ${product.stock},
      reserved = ${product.reserved}, available = ${available},
      reorder_point = ${product.reorderPoint}, reorder_quantity = ${product.reorderQuantity},
      commission_rate = ${product.commissionRate}, status = ${product.status},
      featured = ${product.featured}, updated_at = now()
    where id = ${id}
    returning *
  `;

  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function recordSaaSInventoryMovement(
  productId: string,
  kind: "receive" | "adjust",
  quantity: number,
  reorderPoint: number,
) {
  const sql = getNeonSql();
  const rows = await sql`select * from saas_demo.products where id = ${productId}`;
  const current = rows[0];

  if (!current) return null;

  const currentStock = numberValue(current.stock);
  const nextStock = kind === "receive"
    ? currentStock + quantity
    : Math.max(0, currentStock + quantity);
  const appliedQuantity = nextStock - currentStock;
  const nextAvailable = Math.max(0, nextStock - numberValue(current.reserved));
  const movementId = `m-${crypto.randomUUID()}`;

  const updated = await sql.transaction([
    sql`
      update saas_demo.products set
        stock = ${nextStock}, available = ${nextAvailable},
        reorder_point = ${reorderPoint}, updated_at = now()
      where id = ${productId}
      returning *
    `,
    sql`
      insert into saas_demo.inventory_movements
        (id, product_id, movement_type, quantity, reference, reference_type, user_name)
      values (
        ${movementId}, ${productId}, ${kind === "receive" ? "Received" : "Adjusted"},
        ${appliedQuantity}, ${`LOCAL-${movementId.slice(-6)}`}, 'adjustment', 'Portfolio demo'
      )
      returning id
    `,
  ]);

  return mapProduct(updated[0][0]);
}

export async function createSaaSPriceRequest(input: {
  product: string;
  current: number;
  proposed: number;
  reason: string;
}) {
  const sql = getNeonSql();
  const id = `PR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const rows = await sql`
    insert into saas_demo.price_requests
      (id, product, current_price, proposed_price, reason, status, reviewer)
    values (${id}, ${input.product}, ${input.current}, ${input.proposed}, ${input.reason}, 'Draft', 'Commerce team')
    returning *
  `;

  return mapPriceRequest(rows[0]);
}

export async function createSaaSPayout(input: {
  amount: number;
  method: Payout["method"];
  reference: string;
}) {
  const sql = getNeonSql();
  const id = `PO-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const rows = await sql`
    insert into saas_demo.payouts
      (id, payout_date, amount, method, status, reference)
    values (${id}, 'Just now', ${input.amount}, ${input.method}, 'Processing', ${input.reference})
    returning *
  `;

  return mapPayout(rows[0]);
}

export async function createSaaSAffiliateLink(input: {
  product: string;
  slug: string;
}) {
  const sql = getNeonSql();
  const id = `link-${crypto.randomUUID()}`;
  const rows = await sql`
    insert into saas_demo.affiliate_links
      (id, product, slug, clicks, orders, revenue, commission)
    values (${id}, ${input.product}, ${input.slug}, 0, 0, 0, 0)
    returning *
  `;

  return mapAffiliateLink(rows[0]);
}
