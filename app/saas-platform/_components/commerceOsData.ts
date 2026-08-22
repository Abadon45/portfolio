export type Persona =
  | "business-basic"
  | "business-pro"
  | "business-advanced"
  | "supplier"
  | "coach"
  | "affiliate"
  | "legacy";

export type Capability =
  | "advancedAnalytics"
  | "multipleStores"
  | "affiliateTools"
  | "advancedMargins"
  | "supplierOperations";

export type SaaSView =
  | "overview"
  | "products"
  | "inventory"
  | "orders"
  | "settlements"
  | "payouts"
  | "analytics"
  | "price-requests"
  | "storefront"
  | "affiliates"
  | "learning"
  | "community"
  | "students"
  | "billing"
  | "settings";

export type Product = {
  id: string;
  supplierProductId: string;
  inventoryId: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  supplierPrice: number;
  price: number;
  margin: number;
  stock: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  reorderQuantity: number;
  commissionRate: number;
  status: "Active" | "Draft" | "Archived";
  sold: number;
  revenue: number;
  featured: boolean;
};

export type Order = {
  id: string;
  customer: string;
  store: string;
  product: string;
  quantity: number;
  total: number;
  status:
    "New" | "Processing" | "Ready" | "Shipped" | "Completed" | "Exception";
  date: string;
};

export type InventoryMovement = {
  id: string;
  date: string;
  product: string;
  type: "Received" | "Sold" | "Adjusted" | "Returned" | "Reserved" | "Released";
  quantity: number;
  reference: string;
  user: string;
  referenceType: "purchase" | "sale" | "adjustment" | "reservation" | "return";
};

export type PriceRequest = {
  id: string;
  product: string;
  current: number;
  proposed: number;
  reason: string;
  status: "Draft" | "Submitted" | "Under review" | "Approved" | "Rejected";
  reviewer: string;
};

export type Settlement = {
  id: string;
  period: string;
  orders: number;
  gross: number;
  fees: number;
  payable: number;
  status: "Pending" | "Approved" | "Paid" | "Disputed";
};

export type Payout = {
  id: string;
  date: string;
  amount: number;
  method: "GCash" | "Bank transfer";
  status: "Processing" | "Paid";
  reference: string;
};

export type AffiliateLink = {
  id: string;
  product: string;
  slug: string;
  clicks: number;
  orders: number;
  revenue: number;
  commission: number;
};

export type Subscription = {
  plan: "Business Basic" | "Business Pro" | "Business Advanced";
  status: "Active" | "Pending" | "Cancelled";
  monthlyPrice: number;
  renewalDate: string;
  usagePercent: number;
  stores: number;
};

export const PERSONAS: Array<{
  id: Persona;
  label: string;
  description: string;
}> = [
  {
    id: "business-basic",
    label: "Business Basic",
    description: "A focused launch workspace for growing stores.",
  },
  {
    id: "business-pro",
    label: "Business Pro",
    description: "A complete operating view for an active commerce business.",
  },
  {
    id: "business-advanced",
    label: "Business Advanced",
    description: "Multi-store performance and deeper business intelligence.",
  },
  {
    id: "supplier",
    label: "Supplier",
    description: "Inventory, orders, settlements, and catalog operations.",
  },
  {
    id: "coach",
    label: "Coach",
    description: "Learner progress, community, and coaching activity.",
  },
  {
    id: "affiliate",
    label: "Affiliate",
    description: "Links, conversions, commissions, and payouts.",
  },
  {
    id: "legacy",
    label: "Legacy / Default",
    description: "A fallback view for accounts without a persona.",
  },
];

export const PERSONA_CAPABILITIES: Record<Persona, Capability[]> = {
  "business-basic": [],
  "business-pro": ["affiliateTools", "advancedMargins"],
  "business-advanced": [
    "advancedAnalytics",
    "multipleStores",
    "affiliateTools",
    "advancedMargins",
  ],
  supplier: ["supplierOperations", "advancedAnalytics", "advancedMargins"],
  coach: ["affiliateTools"],
  affiliate: ["affiliateTools"],
  legacy: [],
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    supplierProductId: "sp-2048",
    inventoryId: "si-2048",
    name: "Northstar Daily Kit",
    sku: "NS-2048",
    category: "Wellness",
    supplier: "Vela Supply Co.",
    supplierPrice: 876,
    price: 1280,
    margin: 31.8,
    stock: 248,
    reserved: 18,
    available: 230,
    reorderPoint: 40,
    reorderQuantity: 120,
    commissionRate: 8,
    status: "Active",
    sold: 842,
    revenue: 1077760,
    featured: true,
  },
  {
    id: "p2",
    supplierProductId: "sp-1884",
    inventoryId: "si-1884",
    name: "Hydrate+ Electrolytes",
    sku: "NS-1884",
    category: "Nutrition",
    supplier: "Brightwell Labs",
    supplierPrice: 489.6,
    price: 680,
    margin: 28.4,
    stock: 86,
    reserved: 12,
    available: 74,
    reorderPoint: 30,
    reorderQuantity: 60,
    commissionRate: 8,
    status: "Active",
    sold: 416,
    revenue: 282880,
    featured: true,
  },
  {
    id: "p3",
    supplierProductId: "sp-1742",
    inventoryId: "si-1742",
    name: "Recovery Travel Set",
    sku: "NS-1742",
    category: "Wellness",
    supplier: "Vela Supply Co.",
    supplierPrice: 1587.2,
    price: 2480,
    margin: 36.2,
    stock: 14,
    reserved: 8,
    available: 6,
    reorderPoint: 20,
    reorderQuantity: 50,
    commissionRate: 8,
    status: "Active",
    sold: 218,
    revenue: 540640,
    featured: false,
  },
  {
    id: "p4",
    supplierProductId: "sp-1609",
    inventoryId: "si-1609",
    name: "Focus Desk Bundle",
    sku: "NS-1609",
    category: "Lifestyle",
    supplier: "Morrow Goods",
    supplierPrice: 1470.3,
    price: 1950,
    margin: 24.1,
    stock: 0,
    reserved: 0,
    available: 0,
    reorderPoint: 12,
    reorderQuantity: 40,
    commissionRate: 8,
    status: "Active",
    sold: 132,
    revenue: 257400,
    featured: false,
  },
];

export const ORDERS: Order[] = [
  {
    id: "#NC-10282",
    customer: "Mara Villanueva",
    store: "Northstar Wellness",
    product: "Northstar Daily Kit",
    quantity: 2,
    total: 8420,
    status: "Processing",
    date: "Today, 10:24",
  },
  {
    id: "#NC-10281",
    customer: "Paolo Reyes",
    store: "Northstar Home",
    product: "Hydrate+ Electrolytes",
    quantity: 3,
    total: 3180,
    status: "Completed",
    date: "Today, 09:51",
  },
  {
    id: "#NC-10280",
    customer: "Althea Cruz",
    store: "Northstar Wellness",
    product: "Recovery Travel Set",
    quantity: 1,
    total: 2480,
    status: "New",
    date: "Yesterday, 18:08",
  },
  {
    id: "#NC-10279",
    customer: "Jonas Lim",
    store: "Northstar Essentials",
    product: "Northstar Daily Kit",
    quantity: 1,
    total: 2890,
    status: "Shipped",
    date: "Yesterday, 16:42",
  },
  {
    id: "#NC-10278",
    customer: "Camille Santos",
    store: "Northstar Wellness",
    product: "Hydrate+ Electrolytes",
    quantity: 4,
    total: 5740,
    status: "Exception",
    date: "Yesterday, 14:13",
  },
];

export const MOVEMENTS: InventoryMovement[] = [
  {
    id: "m1",
    date: "Aug 21",
    product: "Northstar Daily Kit",
    type: "Received",
    quantity: 120,
    reference: "PO-2048",
    user: "Emmanuel Santos",
    referenceType: "purchase",
  },
  {
    id: "m2",
    date: "Aug 20",
    product: "Recovery Travel Set",
    type: "Sold",
    quantity: -18,
    reference: "#NC-10261",
    user: "System",
    referenceType: "sale",
  },
  {
    id: "m3",
    date: "Aug 18",
    product: "Hydrate+ Electrolytes",
    type: "Sold",
    quantity: -12,
    reference: "#NC-10244",
    user: "System",
    referenceType: "sale",
  },
  {
    id: "m4",
    date: "Aug 17",
    product: "Focus Desk Bundle",
    type: "Adjusted",
    quantity: -4,
    reference: "ADJ-0081",
    user: "Emmanuel Santos",
    referenceType: "adjustment",
  },
];

export const PRICE_REQUESTS: PriceRequest[] = [
  {
    id: "PR-018",
    product: "Recovery Travel Set",
    current: 2480,
    proposed: 2690,
    reason: "Supplier cost increased 6%.",
    status: "Under review",
    reviewer: "Commerce team",
  },
  {
    id: "PR-017",
    product: "Hydrate+ Electrolytes",
    current: 680,
    proposed: 720,
    reason: "Align with updated packaging cost.",
    status: "Approved",
    reviewer: "A. Mendoza",
  },
];

export const SETTLEMENTS: Settlement[] = [
  {
    id: "SET-8128",
    period: "Aug 16–21, 2026",
    orders: 184,
    gross: 285400,
    fees: 14270,
    payable: 271130,
    status: "Approved",
  },
  {
    id: "SET-8104",
    period: "Aug 09–15, 2026",
    orders: 162,
    gross: 198300,
    fees: 9915,
    payable: 188385,
    status: "Paid",
  },
];

export const PAYOUTS: Payout[] = [
  {
    id: "PO-4421",
    date: "Aug 21",
    amount: 48220,
    method: "GCash",
    status: "Paid",
    reference: "SET-8128",
  },
  {
    id: "PO-4412",
    date: "Aug 14",
    amount: 62480,
    method: "Bank transfer",
    status: "Processing",
    reference: "SET-8104",
  },
  {
    id: "PO-4402",
    date: "Aug 07",
    amount: 38920,
    method: "GCash",
    status: "Paid",
    reference: "SET-8079",
  },
];

export const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    id: "link-1",
    product: "Northstar Daily Kit",
    slug: "emmanuel-kit",
    clicks: 1204,
    orders: 28,
    revenue: 35840,
    commission: 4280,
  },
  {
    id: "link-2",
    product: "Hydrate+ Electrolytes",
    slug: "hydrate",
    clicks: 743,
    orders: 15,
    revenue: 18220,
    commission: 2180,
  },
  {
    id: "link-3",
    product: "Recovery Travel Set",
    slug: "recovery",
    clicks: 320,
    orders: 9,
    revenue: 12600,
    commission: 1512,
  },
];

export const SUBSCRIPTION: Subscription = {
  plan: "Business Pro",
  status: "Active",
  monthlyPrice: 1999,
  renewalDate: "September 21, 2026",
  usagePercent: 84,
  stores: 3,
};

export const STORES = [
  { id: "s1", name: "Northstar Wellness", revenue: 184620, orders: 742 },
  { id: "s2", name: "Northstar Home", revenue: 72400, orders: 318 },
  { id: "s3", name: "Northstar Essentials", revenue: 27600, orders: 224 },
];

export const formatPeso = (value: number) =>
  `₱${value.toLocaleString("en-PH")}`;

export const personaLabel = (persona: Persona) =>
  PERSONAS.find((item) => item.id === persona)?.label ?? "Business Pro";
