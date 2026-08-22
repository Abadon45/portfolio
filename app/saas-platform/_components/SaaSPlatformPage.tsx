"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AccountBalanceWalletRounded,
  AddRounded,
  AnalyticsRounded,
  ArchiveRounded,
  ArrowBackRounded,
  AssessmentRounded,
  AutoGraphRounded,
  CheckCircleRounded,
  ChevronRightRounded,
  CircleRounded,
  DarkModeRounded,
  DashboardRounded,
  EditRounded,
  GroupsRounded,
  Inventory2Rounded,
  LightModeRounded,
  LocalShippingRounded,
  MenuRounded,
  NotificationsNoneRounded,
  PeopleAltRounded,
  PaymentsRounded,
  RestoreRounded,
  SearchRounded,
  SettingsRounded,
  ShoppingBagRounded,
  StorefrontRounded,
  TaskAltRounded,
  TrendingUpRounded,
  TuneRounded,
  WarehouseRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  LinearProgress,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
  useTheme,
  type PaletteMode,
} from "@mui/material";
import { FloatingHomeButton } from "../../components/FloatingHomeButton";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import TwcAlertProvider, {
  useTwcAlert,
} from "../../components/portfolio/TwcAlertSystem";
import { createPortfolioTheme } from "../../theme/portfolioTheme";
import {
  MOVEMENTS,
  ORDERS,
  PERSONAS,
  PERSONA_CAPABILITIES,
  PRODUCTS,
  PRICE_REQUESTS,
  AFFILIATE_LINKS,
  PAYOUTS,
  SETTLEMENTS,
  SUBSCRIPTION,
  STORES,
  formatPeso,
  personaLabel,
  type Capability,
  type InventoryMovement,
  type Order,
  type Persona,
  type Product,
  type AffiliateLink,
  type Payout,
  type PriceRequest,
  type Settlement,
  type SaaSView,
} from "./commerceOsData";
import {
  ProductEditorDialog,
  StockEditorDialog,
  type ProductDraft,
  type StockMutation,
} from "./ProductMutationDialogs";

type NavItem = { label: string; view: SaaSView; icon: typeof DashboardRounded };

const BASE_NAV: NavItem[] = [
  { label: "Overview", view: "overview", icon: DashboardRounded },
  { label: "Products", view: "products", icon: Inventory2Rounded },
  { label: "Orders", view: "orders", icon: ShoppingBagRounded },
  { label: "Storefront", view: "storefront", icon: StorefrontRounded },
  { label: "Analytics", view: "analytics", icon: AnalyticsRounded },
  { label: "Billing", view: "billing", icon: PaymentsRounded },
  { label: "Settings", view: "settings", icon: SettingsRounded },
];

const SUPPLIER_NAV: NavItem[] = [
  { label: "Overview", view: "overview", icon: DashboardRounded },
  { label: "Products", view: "products", icon: Inventory2Rounded },
  { label: "Inventory", view: "inventory", icon: WarehouseRounded },
  { label: "Orders", view: "orders", icon: ShoppingBagRounded },
  {
    label: "Settlements",
    view: "settlements",
    icon: AccountBalanceWalletRounded,
  },
  { label: "Payouts", view: "payouts", icon: PaymentsRounded },
  { label: "Analytics", view: "analytics", icon: AnalyticsRounded },
  { label: "Price requests", view: "price-requests", icon: TuneRounded },
  { label: "Storefront", view: "storefront", icon: StorefrontRounded },
  { label: "Settings", view: "settings", icon: SettingsRounded },
];

const AFFILIATE_NAV: NavItem[] = [
  { label: "Overview", view: "overview", icon: DashboardRounded },
  { label: "Links", view: "affiliates", icon: StorefrontRounded },
  { label: "Performance", view: "analytics", icon: TrendingUpRounded },
  { label: "Commissions", view: "settlements", icon: PaymentsRounded },
  { label: "Payouts", view: "payouts", icon: AccountBalanceWalletRounded },
  { label: "Settings", view: "settings", icon: SettingsRounded },
];

const COACH_NAV: NavItem[] = [
  { label: "Overview", view: "overview", icon: DashboardRounded },
  { label: "Students", view: "students", icon: PeopleAltRounded },
  { label: "Learning", view: "learning", icon: AssessmentRounded },
  { label: "Community", view: "community", icon: GroupsRounded },
  { label: "Settings", view: "settings", icon: SettingsRounded },
];

const statusColor = (status: string) => {
  if (["Completed", "Active", "Approved", "Paid", "Healthy"].includes(status))
    return "success";
  if (["Processing", "Shipped", "Ready", "Submitted"].includes(status))
    return "info";
  if (
    ["Low stock", "Under review", "Pending", "Draft", "Archived"].includes(
      status,
    )
  )
    return "warning";
  if (["Exception", "Out of stock", "Rejected", "Failed"].includes(status))
    return "error";
  return "default";
};

type InventoryStatus = "Healthy" | "Low stock" | "Out of stock";

type SaaSDataPayload = {
  products: Product[];
  movements: InventoryMovement[];
  orders: Order[];
  priceRequests: PriceRequest[];
  settlements: Settlement[];
  payouts: Payout[];
  affiliateLinks: AffiliateLink[];
};

function isSaaSDataPayload(value: unknown): value is SaaSDataPayload {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  return [
    "products",
    "movements",
    "orders",
    "priceRequests",
    "settlements",
    "payouts",
    "affiliateLinks",
  ].every((key) => Array.isArray(data[key]));
}

function toProductPayload(product: Product) {
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    supplier: product.supplier,
    supplierPrice: product.supplierPrice,
    price: product.price,
    margin: product.margin,
    stock: product.stock,
    reserved: product.reserved,
    reorderPoint: product.reorderPoint,
    reorderQuantity: product.reorderQuantity,
    commissionRate: product.commissionRate,
    status: product.status,
    featured: product.featured,
  };
}

const inventoryStatus = (product: Product): InventoryStatus => {
  if (product.stock <= 0) return "Out of stock";
  if (product.stock <= product.reorderPoint) return "Low stock";
  return "Healthy";
};

const activeProducts = (products: Product[]) =>
  products.filter((product) => product.status === "Active");

function StatusChip({ status }: { status: string }) {
  return (
    <Chip
      color={statusColor(status)}
      label={status}
      size="small"
      variant="outlined"
      sx={{ fontSize: 11, fontWeight: 750 }}
    />
  );
}

function CardShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderColor: "divider", height: "100%", overflow: "hidden" }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          p: { xs: 2, md: 2.5 },
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 800 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.4 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: string;
  icon: typeof TrendingUpRounded;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderColor: "divider", minHeight: 132, p: { xs: 2, md: 2.5 } }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
      >
        <Typography
          color="text.secondary"
          sx={{ fontSize: 12, fontWeight: 700 }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "action.selected",
            color: "primary.main",
            display: "flex",
            height: 30,
            justifyContent: "center",
            width: 30,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Stack>
      <Typography
        sx={{
          fontSize: { xs: 25, md: 29 },
          fontWeight: 850,
          letterSpacing: "-0.04em",
          mt: 2,
        }}
      >
        {value}
      </Typography>
      {change && (
        <Typography
          sx={{ color: "success.main", fontSize: 11, fontWeight: 700, mt: 0.5 }}
        >
          {change}{" "}
          <Box
            component="span"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            vs. last period
          </Box>
        </Typography>
      )}
    </Paper>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{
        alignItems: { sm: "flex-end" },
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography
          sx={{
            color: "primary.main",
            fontSize: 10,
            fontWeight: 850,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 30, md: 40 },
            fontWeight: 850,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            mt: 0.75,
          }}
        >
          {title}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 14, lineHeight: 1.65, maxWidth: 640, mt: 1 }}
        >
          {description}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}

function RevenueChart() {
  const theme = useTheme();
  const [range, setRange] = useState("30d");
  const points: Record<string, string> = {
    "7d": "0,128 62,116 124,122 186,84 248,94 310,52 372,64 434,26",
    "30d": "0,146 62,130 124,136 186,108 248,118 310,76 372,90 434,42",
    "90d": "0,154 62,140 124,146 186,116 248,126 310,82 372,96 434,44",
    "12m": "0,162 62,148 124,132 186,140 248,104 310,110 372,70 434,30",
  };

  return (
    <CardShell
      title="Revenue performance"
      subtitle="Gross revenue across the selected workspace"
      action={
        <Select
          size="small"
          value={range}
          onChange={(event) => setRange(event.target.value)}
          sx={{ fontSize: 12, minWidth: 92 }}
        >
          <MenuItem value="7d">7 days</MenuItem>
          <MenuItem value="30d">30 days</MenuItem>
          <MenuItem value="90d">90 days</MenuItem>
          <MenuItem value="12m">12 months</MenuItem>
        </Select>
      }
    >
      <Box sx={{ overflow: "hidden", px: { xs: 2, md: 2.5 }, pb: 1 }}>
        <svg
          aria-label="Revenue chart"
          role="img"
          viewBox="0 0 434 180"
          width="100%"
        >
          {[35, 75, 115, 155].map((y) => (
            <line
              key={y}
              x1="0"
              x2="434"
              y1={y}
              y2={y}
              stroke={theme.palette.divider}
              strokeDasharray="3 5"
            />
          ))}
          <polyline
            fill="none"
            points={points[range]}
            stroke={theme.palette.primary.main}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <circle
            cx="310"
            cy={Number(points[range].split(" ")[5].split(",")[1])}
            fill={theme.palette.background.paper}
            r="5"
            stroke={theme.palette.primary.main}
            strokeWidth="3"
          />
        </svg>
      </Box>
    </CardShell>
  );
}

function OrdersTable({ rows = ORDERS }: { rows?: Order[] }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 680 }}>
        <TableHead>
          <TableRow>
            {["Order", "Customer", "Product", "Total", "Status"].map(
              (heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    color: "text.secondary",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {heading}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((order) => (
            <TableRow hover key={order.id}>
              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                {order.id}
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>{order.customer}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{order.product}</TableCell>
              <TableCell sx={{ fontSize: 12, fontWeight: 750 }}>
                {formatPeso(order.total)}
              </TableCell>
              <TableCell>
                <StatusChip status={order.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function ProductTable({
  products,
  onSelect,
  onEdit,
  onToggleArchive,
}: {
  products: Product[];
  onSelect: (product: Product) => void;
  onEdit: (product: Product) => void;
  onToggleArchive: (product: Product) => void;
}) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 850 }}>
        <TableHead>
          <TableRow>
            {[
              "Product",
              "SKU",
              "Category",
              "Stock",
              "Price",
              "Margin",
              "Sales",
              "Inventory",
              "Product status",
              "Actions",
            ].map((heading) => (
              <TableCell
                key={heading}
                sx={{ color: "text.secondary", fontSize: 11, fontWeight: 800 }}
              >
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow hover key={product.id}>
              <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                <Button
                  color="inherit"
                  onClick={() => onSelect(product)}
                  sx={{
                    fontSize: 12,
                    fontWeight: 800,
                    justifyContent: "flex-start",
                    p: 0,
                    textTransform: "none",
                  }}
                >
                  {product.name}
                </Button>
              </TableCell>
              <TableCell sx={{ color: "text.secondary", fontSize: 12 }}>
                {product.sku}
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>{product.category}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{product.stock}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>
                {formatPeso(product.price)}
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>{product.margin}%</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{product.sold}</TableCell>
              <TableCell>
                <StatusChip status={inventoryStatus(product)} />
              </TableCell>
              <TableCell>
                <StatusChip status={product.status} />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Edit product">
                    <IconButton
                      aria-label={`Edit ${product.name}`}
                      onClick={() => onEdit(product)}
                      size="small"
                    >
                      <EditRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      product.status === "Archived"
                        ? "Restore product"
                        : "Archive product"
                    }
                  >
                    <IconButton
                      aria-label={`${product.status === "Archived" ? "Restore" : "Archive"} ${product.name}`}
                      onClick={() => onToggleArchive(product)}
                      size="small"
                    >
                      {product.status === "Archived" ? (
                        <RestoreRounded fontSize="small" />
                      ) : (
                        <ArchiveRounded fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function ActionQueue({
  onNavigate,
  products,
}: {
  onNavigate: (view: SaaSView) => void;
  products: Product[];
}) {
  const attentionCount = activeProducts(products).filter(
    (product) => inventoryStatus(product) !== "Healthy",
  ).length;
  const actions = [
    ["4 orders need fulfillment", "orders", LocalShippingRounded],
    [
      `${attentionCount} products need stock attention`,
      "inventory",
      WarehouseRounded,
    ],
    ["1 price change requires review", "price-requests", TuneRounded],
  ] as const;

  return (
    <CardShell
      title="Action queue"
      subtitle="The next decisions that need an operator"
    >
      <Stack sx={{ px: { xs: 2, md: 2.5 }, pb: 1 }}>
        {actions.map(([label, view, Icon]) => (
          <Button
            key={label}
            onClick={() => onNavigate(view)}
            startIcon={<Icon />}
            endIcon={<ChevronRightRounded />}
            sx={{
              justifyContent: "space-between",
              py: 1.25,
              textTransform: "none",
            }}
          >
            {label}
          </Button>
        ))}
      </Stack>
    </CardShell>
  );
}

function ProductDetail({
  product,
  onBack,
  onEdit,
  onUpdateInventory,
  movements,
}: {
  product: Product;
  onBack: () => void;
  onEdit: (product: Product) => void;
  onUpdateInventory: (product: Product) => void;
  movements: InventoryMovement[];
}) {
  return (
    <>
      <Button startIcon={<ArrowBackRounded />} onClick={onBack} sx={{ mb: 2 }}>
        Back to products
      </Button>
      <PageHeading
        eyebrow="Supplier operations / Product detail"
        title={product.name}
        description="Review catalog, inventory, pricing, sales, and movement history for this product."
        action={
          <Stack direction="row" spacing={1}>
            <Button
              onClick={() => onEdit(product)}
              startIcon={<EditRounded />}
              variant="outlined"
            >
              Edit product
            </Button>
            <Button
              onClick={() => onUpdateInventory(product)}
              variant="contained"
              startIcon={<AddRounded />}
            >
              Update stock
            </Button>
          </Stack>
        }
      />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {[
          ["SKU", product.sku],
          ["Current stock", String(product.stock)],
          ["Reserved", String(product.reserved)],
          ["Available", String(product.stock - product.reserved)],
          ["Reorder point", String(product.reorderPoint)],
          ["Price", formatPeso(product.price)],
          ["Margin", `${product.margin}%`],
          ["Units sold", String(product.sold)],
        ].map(([label, value]) => (
          <MetricCard
            key={label}
            label={label}
            value={value}
            icon={Inventory2Rounded}
          />
        ))}
      </Box>
      <CardShell
        title="Stock movement history"
        subtitle="A coherent audit trail for inventory changes"
      >
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 680 }}>
            <TableHead>
              <TableRow>
                {["Date", "Type", "Quantity", "Reference", "User"].map(
                  (heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        color: "text.secondary",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {heading}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {movements
                .filter((movement) => movement.product === product.name)
                .concat(
                  movements
                    .filter((movement) => movement.product !== product.name)
                    .slice(0, 2),
                )
                .map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.date}</TableCell>
                    <TableCell>
                      <StatusChip status={movement.type} />
                    </TableCell>
                    <TableCell>
                      {movement.quantity > 0
                        ? `+${movement.quantity}`
                        : movement.quantity}
                    </TableCell>
                    <TableCell>{movement.reference}</TableCell>
                    <TableCell>{movement.user}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </CardShell>
    </>
  );
}

function DataView({
  view,
  persona,
  products,
  orders,
  onProductSelect,
  onAddProduct,
  onEditProduct,
  onToggleArchive,
  onUpdateInventory,
  onReviewAlert,
  reviewedAlerts,
  affiliateLinks,
  payouts,
  priceRequests,
  settlements,
  onCreateAffiliateLink,
  onCreatePriceRequest,
  onDownloadReport,
  onPreviewStore,
  onRequestPayout,
  onManagePlan,
}: {
  view: SaaSView;
  persona: Persona;
  products: Product[];
  orders: Order[];
  onProductSelect: (product: Product) => void;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onToggleArchive: (product: Product) => void;
  onUpdateInventory: (product: Product) => void;
  onReviewAlert: (productId: string) => void;
  reviewedAlerts: Set<string>;
  affiliateLinks: AffiliateLink[];
  payouts: Payout[];
  priceRequests: PriceRequest[];
  settlements: Settlement[];
  onCreateAffiliateLink: () => void;
  onCreatePriceRequest: () => void;
  onDownloadReport: () => void;
  onPreviewStore: () => void;
  onRequestPayout: () => void;
  onManagePlan: () => void;
}) {
  const [productQuery, setProductQuery] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState("All");
  const [inventoryFilter, setInventoryFilter] = useState("All");
  const [orderFilter, setOrderFilter] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.sku} ${product.category}`
      .toLowerCase()
      .includes(productQuery.toLowerCase());
    const matchesStatus =
      productStatusFilter === "All" || product.status === productStatusFilter;
    return matchesQuery && matchesStatus;
  });
  const filteredInventory = products.filter((product) => {
    if (inventoryFilter === "All") return product.status !== "Archived";
    if (inventoryFilter === "Critical")
      return (
        product.stock > 0 &&
        product.stock <= Math.max(3, product.reorderPoint / 2)
      );
    return inventoryStatus(product) === inventoryFilter;
  });
  const filteredOrders =
    orderFilter === "All"
      ? orders
      : orders.filter((order) => order.status === orderFilter);
  const inventoryAlerts = activeProducts(products).filter(
    (product) => inventoryStatus(product) !== "Healthy",
  );

  if (view === "products")
    return (
      <>
        <PageHeading
          eyebrow="Commerce / Catalog"
          title={persona === "supplier" ? "Product management" : "Products"}
          description="Search, filter, update, and inspect the products connected to this workspace."
          action={
            <Button
              onClick={onAddProduct}
              variant="contained"
              startIcon={<AddRounded />}
            >
              Add product
            </Button>
          }
        />
        <CardShell
          title="Catalog"
          subtitle={`${products.length} products in this workspace`}
          action={
            <Stack direction="row" sx={{ gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search products"
                value={productQuery}
                onChange={(event) => setProductQuery(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRounded fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Select
                aria-label="Filter products by status"
                size="small"
                value={productStatusFilter}
                onChange={(event) => setProductStatusFilter(event.target.value)}
                sx={{ minWidth: 120 }}
              >
                {["All", "Active", "Draft", "Archived"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          }
        >
          <ProductTable
            products={filteredProducts}
            onSelect={onProductSelect}
            onEdit={onEditProduct}
            onToggleArchive={onToggleArchive}
          />
        </CardShell>
      </>
    );
  if (view === "inventory")
    return (
      <>
        <PageHeading
          eyebrow="Supplier operations"
          title="Inventory"
          description="Understand stock health, reservations, reorder points, and incoming inventory."
          action={
            <Button
              disabled={!activeProducts(products)[0]}
              onClick={() =>
                activeProducts(products)[0] &&
                onUpdateInventory(activeProducts(products)[0])
              }
              startIcon={<AddRounded />}
              variant="contained"
            >
              Record movement
            </Button>
          }
        />
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
          }}
        >
          <MetricCard
            label="Inventory value"
            value={formatPeso(
              activeProducts(products).reduce(
                (total, product) => total + product.stock * product.price,
                0,
              ),
            )}
            icon={Inventory2Rounded}
          />
          <MetricCard
            label="Reserved units"
            value={String(
              activeProducts(products).reduce(
                (total, product) => total + product.reserved,
                0,
              ),
            )}
            icon={WarehouseRounded}
          />
          <MetricCard
            label="Low stock"
            value={String(
              activeProducts(products).filter(
                (product) => inventoryStatus(product) === "Low stock",
              ).length,
            )}
            icon={AssessmentRounded}
          />
          <MetricCard
            label="Out of stock"
            value={String(
              activeProducts(products).filter(
                (product) => inventoryStatus(product) === "Out of stock",
              ).length,
            )}
            icon={CircleRounded}
          />
        </Box>
        <CardShell
          title="Inventory health"
          subtitle="Filter by operational stock status"
        >
          <Stack
            direction="row"
            sx={{ flexWrap: "wrap", gap: 1, px: { xs: 2, md: 2.5 }, pb: 2 }}
          >
            {["All", "Healthy", "Low stock", "Critical", "Out of stock"].map(
              (filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  onClick={() => setInventoryFilter(filter)}
                  variant={filter === inventoryFilter ? "filled" : "outlined"}
                />
              ),
            )}
          </Stack>
          <ProductTable
            products={filteredInventory}
            onSelect={onProductSelect}
            onEdit={onEditProduct}
            onToggleArchive={onToggleArchive}
          />
        </CardShell>
        <CardShell
          title="Low-stock alerts"
          subtitle={`${inventoryAlerts.filter((product) => !reviewedAlerts.has(product.id)).length} products require attention`}
        >
          <Stack sx={{ px: { xs: 2, md: 2.5 }, pb: 1 }}>
            {inventoryAlerts.map((product) => (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                key={product.id}
                sx={{
                  alignItems: { sm: "center" },
                  borderTop: 1,
                  borderColor: "divider",
                  gap: 1.5,
                  py: 1.5,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
                    {product.name}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 11, mt: 0.25 }}
                  >
                    {product.stock} units remaining · reorder at{" "}
                    {product.reorderPoint}
                  </Typography>
                </Box>
                <StatusChip status={inventoryStatus(product)} />
                <Button onClick={() => onUpdateInventory(product)} size="small">
                  Adjust stock
                </Button>
                <Button
                  disabled={reviewedAlerts.has(product.id)}
                  onClick={() => onReviewAlert(product.id)}
                  size="small"
                  variant="outlined"
                >
                  {reviewedAlerts.has(product.id)
                    ? "Reviewed"
                    : "Mark reviewed"}
                </Button>
              </Stack>
            ))}
          </Stack>
        </CardShell>
      </>
    );
  if (view === "orders")
    return (
      <>
        <PageHeading
          eyebrow={persona === "supplier" ? "Supplier operations" : "Commerce"}
          title="Orders"
          description="Track order status, fulfillment, customer context, and operational exceptions."
        />
        <CardShell
          title="Order queue"
          subtitle="All orders connected to this workspace"
        >
          <Stack
            direction="row"
            sx={{ flexWrap: "wrap", gap: 1, px: { xs: 2, md: 2.5 }, pb: 2 }}
          >
            {[
              "All",
              "New",
              "Processing",
              "Ready",
              "Shipped",
              "Completed",
              "Exception",
            ].map((filter) => (
              <Chip
                key={filter}
                label={filter}
                onClick={() => setOrderFilter(filter)}
                variant={filter === orderFilter ? "filled" : "outlined"}
              />
            ))}
          </Stack>
          <OrdersTable rows={filteredOrders} />
        </CardShell>
      </>
    );
  if (view === "settlements")
    return (
      <>
        <PageHeading
          eyebrow="Supplier finance"
          title="Settlements"
          description="Track money moving from completed orders into supplier payouts."
          action={
            <Button onClick={onDownloadReport} variant="outlined">
              Download report
            </Button>
          }
        />
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          }}
        >
          <MetricCard
            label="Available payout"
            value={formatPeso(
              settlements.reduce(
                (total, settlement) => total + settlement.payable,
                0,
              ),
            )}
            icon={AccountBalanceWalletRounded}
          />
          <MetricCard
            label="Pending settlement"
            value={formatPeso(
              settlements
                .filter((settlement) => settlement.status === "Pending")
                .reduce((total, settlement) => total + settlement.payable, 0),
            )}
            icon={PaymentsRounded}
          />
          <MetricCard
            label="Next payout"
            value="Aug 25"
            icon={TrendingUpRounded}
          />
        </Box>
        <CardShell
          title="Settlement history"
          subtitle="SupplierSettlement records"
        >
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Settlement",
                    "Period",
                    "Orders",
                    "Gross",
                    "Fees",
                    "Payable",
                    "Status",
                  ].map((heading) => (
                    <TableCell key={heading}>{heading}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {settlements.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell sx={{ fontWeight: 800 }}>
                      {settlement.id}
                    </TableCell>
                    <TableCell>{settlement.period}</TableCell>
                    <TableCell>{settlement.orders}</TableCell>
                    <TableCell>{formatPeso(settlement.gross)}</TableCell>
                    <TableCell>{formatPeso(settlement.fees)}</TableCell>
                    <TableCell>{formatPeso(settlement.payable)}</TableCell>
                    <TableCell>
                      <StatusChip status={settlement.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardShell>
      </>
    );
  if (view === "payouts")
    return (
      <>
        <PageHeading
          eyebrow="Finance"
          title="Payouts"
          description="Review payout status, methods, references, and settlement timing."
          action={
            <Button onClick={onRequestPayout} variant="contained">
              Request payout
            </Button>
          }
        />
        <CardShell title="Payout history">
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 680 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Payout ID",
                    "Date",
                    "Amount",
                    "Method",
                    "Status",
                    "Reference",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        color: "text.secondary",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>{payout.id}</TableCell>
                    <TableCell>{payout.date}</TableCell>
                    <TableCell>{formatPeso(payout.amount)}</TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell>
                      <StatusChip status={payout.status} />
                    </TableCell>
                    <TableCell>{payout.reference}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardShell>
      </>
    );
  if (view === "price-requests")
    return (
      <>
        <PageHeading
          eyebrow="Supplier operations"
          title="Price change requests"
          description="Submit and track pricing decisions through a visible review workflow."
          action={
            <Button
              onClick={onCreatePriceRequest}
              variant="contained"
              startIcon={<AddRounded />}
            >
              New request
            </Button>
          }
        />
        <CardShell
          title="Request workflow"
          subtitle="Draft → Submitted → Under review → Approved or rejected"
        >
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Product",
                    "Current",
                    "Proposed",
                    "Reason",
                    "Status",
                    "Reviewer",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        color: "text.secondary",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {priceRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell sx={{ fontWeight: 800 }}>
                      {request.product}
                    </TableCell>
                    <TableCell>{formatPeso(request.current)}</TableCell>
                    <TableCell>{formatPeso(request.proposed)}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <StatusChip status={request.status} />
                    </TableCell>
                    <TableCell>{request.reviewer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardShell>
      </>
    );
  if (view === "affiliates")
    return (
      <>
        <PageHeading
          eyebrow="Growth / Affiliate tools"
          title="Affiliate links"
          description="Manage tracking links, conversion performance, and commission-generating activity."
          action={
            <Button
              onClick={onCreateAffiliateLink}
              variant="contained"
              startIcon={<AddRounded />}
            >
              Create link
            </Button>
          }
        />
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          }}
        >
          <MetricCard label="Clicks" value="2,267" icon={TrendingUpRounded} />
          <MetricCard
            label="Conversions"
            value="52"
            icon={ShoppingBagRounded}
          />
          <MetricCard
            label="Commission"
            value="₱18,420"
            icon={PaymentsRounded}
          />
        </Box>
        <CardShell
          title="Top links"
          subtitle="Synthetic tracking data for the selected workspace"
        >
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 680 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Product",
                    "Tracking URL",
                    "Clicks",
                    "Orders",
                    "Revenue",
                    "Commission",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        color: "text.secondary",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {affiliateLinks.map((link) => (
                  <TableRow hover key={link.id}>
                    <TableCell sx={{ fontSize: 12, fontWeight: 800 }}>
                      {link.product}
                    </TableCell>
                    <TableCell>commerce-os.demo/r/{link.slug}</TableCell>
                    <TableCell>{link.clicks.toLocaleString()}</TableCell>
                    <TableCell>{link.orders}</TableCell>
                    <TableCell>{formatPeso(link.revenue)}</TableCell>
                    <TableCell>{formatPeso(link.commission)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardShell>
      </>
    );
  if (["learning", "community", "students"].includes(view))
    return (
      <>
        <PageHeading
          eyebrow={
            view === "students" ? "Coach workspace" : "Business ecosystem"
          }
          title={
            view === "students"
              ? "Students"
              : view === "learning"
                ? "Learning"
                : "Community"
          }
          description="A focused workspace for education, progress, and the people around the commerce ecosystem."
        />
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          }}
        >
          {[
            ["Active learners", "128", PeopleAltRounded],
            ["Completion rate", "72%", AssessmentRounded],
            ["Upcoming sessions", "6", GroupsRounded],
          ].map(([label, value, Icon]) => (
            <MetricCard
              key={label as string}
              label={label as string}
              value={value as string}
              icon={Icon as typeof TrendingUpRounded}
            />
          ))}
        </Box>
        <CardShell title="Recent activity">
          <Stack sx={{ px: 2.5, pb: 1 }}>
            {[
              "Maria completed Building your first store",
              "Cohort session starts Tuesday at 7pm PH",
              "New recommendation: Pricing fundamentals",
            ].map((item) => (
              <Stack
                direction="row"
                key={item}
                sx={{
                  alignItems: "center",
                  borderBottom: 1,
                  borderColor: "divider",
                  gap: 1,
                  py: 1.5,
                }}
              >
                <TaskAltRounded color="success" fontSize="small" />
                <Typography sx={{ fontSize: 13 }}>{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </CardShell>
      </>
    );
  if (view === "storefront")
    return (
      <>
        <PageHeading
          eyebrow="Storefront / Northstar"
          title="Storefront manager"
          description="Keep your commerce presence connected to the operational workspace."
          action={
            <Button onClick={onPreviewStore} variant="contained">
              Preview store
            </Button>
          }
        />
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1.2fr .8fr" },
          }}
        >
          <CardShell
            title="Northstar Wellness"
            subtitle="Published · northstar-wellness.demo"
          >
            <Box sx={{ bgcolor: "action.hover", minHeight: 220, m: 2, p: 2 }}>
              <Typography color="text.secondary" sx={{ fontSize: 11 }}>
                STOREFRONT PREVIEW
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 850, mt: 7 }}>
                Wellness, made practical.
              </Typography>
              <Button
                onClick={onPreviewStore}
                sx={{ mt: 2 }}
                variant="contained"
              >
                Preview
              </Button>
            </Box>
          </CardShell>
          <CardShell title="Configuration">
            <Stack sx={{ px: 2.5, pb: 2 }}>
              {[
                "Store",
                "Theme",
                "Navigation",
                "Pages",
                "Products",
                "Domain",
                "Settings",
              ].map((item) => (
                <Button
                  key={item}
                  sx={{
                    justifyContent: "space-between",
                    py: 1,
                    textTransform: "none",
                  }}
                >
                  {item}
                  <ChevronRightRounded fontSize="small" />
                </Button>
              ))}
            </Stack>
          </CardShell>
        </Box>
      </>
    );
  if (view === "billing")
    return (
      <>
        <PageHeading
          eyebrow="Commerce OS"
          title="Subscription"
          description="Plan-aware access keeps capabilities aligned with the way each business works."
        />
        <CardShell title="Current plan" subtitle="Business Pro">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              alignItems: { sm: "center" },
              gap: 2,
              justifyContent: "space-between",
              p: 2.5,
            }}
          >
            <Box>
              <Chip color="success" label="Active" size="small" />
              <Typography sx={{ fontSize: 25, fontWeight: 850, mt: 1 }}>
                ₱1,999 / month
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.5 }}>
                Renews September 21, 2026 · 84% of monthly usage included
              </Typography>
            </Box>
            <Button onClick={onManagePlan} variant="contained">
              Manage plan
            </Button>
          </Stack>
        </CardShell>
      </>
    );
  if (view === "settings")
    return (
      <>
        <PageHeading
          eyebrow="Workspace"
          title="Settings"
          description="Manage workspace preferences, notifications, and account context."
        />
        <CardShell title="Workspace settings">
          <Stack sx={{ px: 2.5, pb: 2 }}>
            {[
              "Workspace profile",
              "Team access",
              "Notifications",
              "Connected services",
              "Security",
            ].map((item) => (
              <Button
                key={item}
                sx={{
                  justifyContent: "space-between",
                  py: 1.25,
                  textTransform: "none",
                }}
              >
                {item}
                <ChevronRightRounded fontSize="small" />
              </Button>
            ))}
          </Stack>
        </CardShell>
      </>
    );
  return (
    <>
      <PageHeading
        eyebrow={personaLabel(persona)}
        title="Analytics"
        description="Read revenue, order, inventory, margin, and operational performance over time."
      />
      <RevenueChart />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          mt: 2,
        }}
      >
        {[
          ["Average order value", "₱1,842"],
          ["Fulfillment time", "1.8 days"],
          ["Inventory turnover", "4.6x"],
        ].map(([label, value]) => (
          <MetricCard
            key={label}
            label={label}
            value={value}
            icon={TrendingUpRounded}
          />
        ))}
      </Box>
    </>
  );
}

function DashboardModules({
  persona,
  onNavigate,
  products,
}: {
  persona: Persona;
  onNavigate: (view: SaaSView) => void;
  products: Product[];
}) {
  return (
    <>
      {(persona === "business-pro" ||
        persona === "business-advanced" ||
        persona === "supplier") && (
        <ActionQueue onNavigate={onNavigate} products={products} />
      )}
      {persona !== "coach" && <RevenueChart />}
      {!["coach", "affiliate"].includes(persona) && (
        <CardShell
          title="Recent orders"
          subtitle="Latest activity across your connected storefronts"
          action={
            <Button size="small" onClick={() => onNavigate("orders")}>
              View all
            </Button>
          }
        >
          <OrdersTable rows={ORDERS.slice(0, 4)} />
        </CardShell>
      )}
      {!["affiliate", "coach"].includes(persona) && (
        <CardShell
          title={
            persona === "supplier" ? "Inventory health" : "Store performance"
          }
          subtitle="Operational signals across the workspace"
        >
          <Stack sx={{ px: { xs: 2, md: 2.5 }, pb: 1 }}>
            {activeProducts(products)
              .slice(0, 3)
              .map((product) => (
                <Stack
                  key={product.id}
                  direction="row"
                  sx={{
                    alignItems: "center",
                    borderBottom: 1,
                    borderColor: "divider",
                    gap: 1,
                    py: 1.2,
                  }}
                >
                  <CircleRounded
                    sx={{
                      color:
                        inventoryStatus(product) === "Healthy"
                          ? "success.main"
                          : "warning.main",
                      fontSize: 10,
                    }}
                  />
                  <Typography sx={{ flex: 1, fontSize: 12 }}>
                    {product.name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                    {product.stock} left
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </CardShell>
      )}
      {(persona === "business-pro" ||
        persona === "business-advanced" ||
        persona === "affiliate") && (
        <CardShell
          title="Affiliate performance"
          subtitle="Links and conversions contributing to revenue"
          action={
            <Button size="small" onClick={() => onNavigate("affiliates")}>
              Manage links
            </Button>
          }
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ gap: 2, px: { xs: 2, md: 2.5 }, pb: 2 }}
          >
            {[
              ["TikTok bio", "1,204 clicks", "28 orders"],
              ["Instagram story", "743 clicks", "15 orders"],
              ["Facebook page", "320 clicks", "9 orders"],
            ].map(([label, clicks, orders]) => (
              <Paper
                key={label}
                variant="outlined"
                sx={{ borderColor: "divider", flex: 1, p: 1.5 }}
              >
                <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
                  {label}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 11, mt: 1 }}>
                  {clicks} · {orders}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </CardShell>
      )}
      {persona !== "affiliate" && (
        <CardShell
          title="Commerce OS Pro"
          subtitle="Your current workspace plan"
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              alignItems: { sm: "center" },
              gap: 2,
              justifyContent: "space-between",
              px: { xs: 2, md: 2.5 },
              pb: 2,
            }}
          >
            <Box>
              <Chip color="success" label="Active" size="small" />
              <Typography sx={{ fontSize: 22, fontWeight: 850, mt: 1 }}>
                ₱1,999 / month
              </Typography>
            </Box>
            <Button variant="outlined" onClick={() => onNavigate("billing")}>
              Manage plan
            </Button>
          </Stack>
        </CardShell>
      )}
      {persona === "business-basic" && (
        <CardShell
          title="You're 72% ready to launch"
          subtitle="Complete these steps to unlock your first store"
        >
          <LinearProgress
            value={72}
            variant="determinate"
            sx={{ mx: 2.5, mb: 1, height: 6 }}
          />
          <Stack sx={{ px: 2.5, pb: 1 }}>
            {[
              "Account created",
              "Store created",
              "Products added",
              "Customize storefront",
              "Connect payment",
            ].map((item, index) => (
              <Button
                key={item}
                startIcon={
                  index < 3 ? (
                    <CheckCircleRounded color="success" />
                  ) : (
                    <CircleRounded color="disabled" />
                  )
                }
                onClick={() =>
                  onNavigate(index === 3 ? "storefront" : "settings")
                }
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                {item}
              </Button>
            ))}
          </Stack>
        </CardShell>
      )}
      {persona === "coach" && (
        <CardShell
          title="Coaching activity"
          subtitle="Progress across your learner community"
        >
          <Stack sx={{ px: 2.5, pb: 1 }}>
            {[
              "128 active learners",
              "6 upcoming sessions",
              "72% average completion",
              "3 learners reached a new achievement",
            ].map((item) => (
              <Stack
                direction="row"
                key={item}
                sx={{
                  alignItems: "center",
                  borderBottom: 1,
                  borderColor: "divider",
                  gap: 1,
                  py: 1.3,
                }}
              >
                <TaskAltRounded color="success" fontSize="small" />
                <Typography sx={{ fontSize: 13 }}>{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </CardShell>
      )}
    </>
  );
}

function CommerceOsWorkspace() {
  const { showModal, toastInfo, toastSuccess } = useTwcAlert();
  const [persona, setPersona] = useState<Persona>("business-pro");
  const [view, setView] = useState<SaaSView>("overview");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [movements, setMovements] = useState<InventoryMovement[]>(MOVEMENTS);
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [settlements, setSettlements] = useState(SETTLEMENTS);
  const [payouts, setPayouts] = useState(PAYOUTS);
  const [priceRequests, setPriceRequests] = useState(PRICE_REQUESTS);
  const [affiliateLinks, setAffiliateLinks] = useState(AFFILIATE_LINKS);
  const [reviewedAlerts, setReviewedAlerts] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productEditorOpen, setProductEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [storeId, setStoreId] = useState("s1");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState<PaletteMode>("dark");
  const theme = useMemo(() => createPortfolioTheme(mode, "classic"), [mode]);
  const capabilities = PERSONA_CAPABILITIES[persona];
  const nav =
    persona === "supplier"
      ? SUPPLIER_NAV
      : persona === "affiliate"
        ? AFFILIATE_NAV
        : persona === "coach"
          ? COACH_NAV
          : BASE_NAV;
  const selectedStore =
    STORES.find((store) => store.id === storeId) ?? STORES[0];
  const lowStockCount = activeProducts(products).filter(
    (product) => inventoryStatus(product) !== "Healthy",
  ).length;

  const loadSaaSData = async () => {
    const response = await fetch("/api/saas/data", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to load SaaS data.");
    }

    const payload: unknown = await response.json();

    if (!isSaaSDataPayload(payload)) {
      throw new Error("SaaS data response was invalid.");
    }

    setProducts(payload.products);
    setMovements(payload.movements);
    setOrders(payload.orders);
    setPriceRequests(payload.priceRequests);
    setSettlements(payload.settlements);
    setPayouts(payload.payouts);
    setAffiliateLinks(payload.affiliateLinks);
  };

  useEffect(() => {
    loadSaaSData().catch(() => {
      toastInfo("Neon data is unavailable; showing the local demo fixtures.");
    });
  }, []);

  useEffect(() => {
    const storedPersona = window.localStorage.getItem("commerce-os-persona");
    const storedMode = window.localStorage.getItem("commerce-os-mode");
    if (PERSONAS.some((item) => item.id === storedPersona))
      setPersona(storedPersona as Persona);
    if (storedMode === "light" || storedMode === "dark") setMode(storedMode);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("commerce-os-persona", persona);
    window.localStorage.setItem("commerce-os-mode", mode);
    document.documentElement.style.colorScheme = mode;
  }, [mode, persona]);

  const navigate = (nextView: SaaSView) => {
    setSelectedProduct(null);
    setView(nextView);
    setMobileOpen(false);
  };

  const openProductEditor = (product: Product | null = null) => {
    setEditingProduct(product);
    setProductEditorOpen(true);
  };

  const recordMovement = (
    product: Product,
    quantity: number,
    type: InventoryMovement["type"],
  ) => {
    setMovements((current) => [
      {
        id: `m-${Date.now()}`,
        date: "Just now",
        product: product.name,
        type,
        quantity,
        reference: `LOCAL-${String(Date.now()).slice(-6)}`,
        user: "Emmanuel Santos",
        referenceType:
          type === "Received"
            ? "purchase"
            : type === "Sold"
              ? "sale"
              : type === "Reserved"
                ? "reservation"
                : type === "Returned"
                  ? "return"
                  : "adjustment",
      },
      ...current,
    ]);
  };

  const saveProduct = async (draft: ProductDraft) => {
    if (editingProduct) {
      const updated = {
        ...editingProduct,
        ...draft,
        available: Math.max(0, draft.stock - editingProduct.reserved),
      };
      const stockDelta = updated.stock - editingProduct.stock;
      const response = await fetch(`/api/saas/products/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toProductPayload(updated)),
      });

      if (!response.ok) throw new Error("Unable to update product.");
      const payload = (await response.json()) as { product: Product };
      const persisted = payload.product;
      setProducts((current) =>
        current.map((product) =>
          product.id === persisted.id ? persisted : product,
        ),
      );
      if (selectedProduct?.id === persisted.id) setSelectedProduct(persisted);
      if (stockDelta !== 0) await loadSaaSData();
      setReviewedAlerts((current) => {
        const next = new Set(current);
        next.delete(persisted.id);
        return next;
      });
      toastSuccess(`${persisted.name} was updated.`);
    } else {
      const draftProduct: Product = {
        ...draft,
        id: `p-${Date.now()}`,
        supplierProductId: `sp-${Date.now()}`,
        inventoryId: `si-${Date.now()}`,
        supplierPrice: Math.round(draft.price * 0.6 * 100) / 100,
        available: Math.max(0, draft.stock - draft.reserved),
        reorderQuantity: Math.max(10, draft.reorderPoint * 2),
        commissionRate: 8,
        sold: 0,
        revenue: 0,
        featured: false,
      };
      const response = await fetch("/api/saas/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toProductPayload(draftProduct)),
      });

      if (!response.ok) throw new Error("Unable to create product.");
      const payload = (await response.json()) as { product: Product };
      setProducts((current) => [payload.product, ...current]);
      toastSuccess(`${payload.product.name} was added to the catalog.`);
    }
    setEditingProduct(null);
    setProductEditorOpen(false);
  };

  const toggleArchive = async (product: Product) => {
    const restoring = product.status === "Archived";
    if (!restoring) {
      const result = await showModal({
        title: `Archive ${product.name}?`,
        content:
          "The product will leave active inventory views but can be restored from the product catalog.",
        confirmText: "Archive product",
      });
      if (result.action !== "confirm") return;
    }
    const updated: Product = {
      ...product,
      status: restoring ? "Draft" : "Archived",
    };
    const response = await fetch(`/api/saas/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toProductPayload(updated)),
    });

    if (!response.ok) {
      toastInfo("The product could not be updated in Neon.");
      return;
    }

    setProducts((current) =>
      current.map((item) => (item.id === product.id ? updated : item)),
    );
    if (selectedProduct?.id === product.id) setSelectedProduct(updated);
    toastSuccess(
      `${product.name} was ${restoring ? "restored as a draft" : "archived"}.`,
    );
  };

  const saveStockMutation = async (mutation: StockMutation) => {
    if (!stockProduct) return;
    const response = await fetch("/api/saas/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: stockProduct.id, ...mutation }),
    });

    if (!response.ok) {
      toastInfo("The inventory movement could not be saved.");
      return;
    }

    const payload = (await response.json()) as { product: Product };
    const updated = payload.product;
    setProducts((current) =>
      current.map((product) => (product.id === updated.id ? updated : product)),
    );
    if (selectedProduct?.id === updated.id) setSelectedProduct(updated);
    await loadSaaSData();
    setReviewedAlerts((current) => {
      const next = new Set(current);
      next.delete(updated.id);
      return next;
    });
    setStockProduct(null);
    toastSuccess(`${updated.name} now has ${updated.stock} units in stock.`);
  };

  const reviewAlert = (productId: string) => {
    setReviewedAlerts((current) => new Set(current).add(productId));
    toastInfo("Inventory alert marked as reviewed.");
  };

  const requestPayout = async () => {
    const response = await fetch("/api/saas/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "payout",
        amount: 184220,
        method: "GCash",
      }),
    });

    if (!response.ok) {
      toastInfo("The payout request could not be saved.");
      return;
    }

    const payload = (await response.json()) as { payout: Payout };
    setPayouts((current) => [payload.payout, ...current]);
    toastSuccess("Payout request submitted for review.");
  };

  const createPriceRequest = async () => {
    const product = activeProducts(products)[0];
    if (!product) return;
    const response = await fetch("/api/saas/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "price-request",
        product: product.name,
        current: product.price,
        proposed: Math.round(product.price * 1.05),
        reason: "Demo request prepared from current supplier pricing.",
      }),
    });

    if (!response.ok) {
      toastInfo("The price request could not be saved.");
      return;
    }

    const payload = (await response.json()) as { priceRequest: PriceRequest };
    setPriceRequests((current) => [payload.priceRequest, ...current]);
    toastSuccess(`${payload.priceRequest.id} was saved as a draft.`);
  };

  const createAffiliateLink = async () => {
    const product = activeProducts(products)[0];
    if (!product) return;
    const response = await fetch("/api/saas/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "affiliate-link",
        product: product.name,
        slug: `${product.sku.toLowerCase()}-${Date.now()}`,
      }),
    });

    if (!response.ok) {
      toastInfo("The affiliate link could not be saved.");
      return;
    }

    const payload = (await response.json()) as { affiliateLink: AffiliateLink };
    setAffiliateLinks((current) => [payload.affiliateLink, ...current]);
    toastSuccess("Affiliate tracking link created.");
  };

  const downloadReport = () => {
    toastInfo("Settlement report prepared for download in this demo.");
  };

  const previewStore = () => {
    toastInfo(
      "Storefront preview opened in the source project; this demo keeps the preview in place.",
    );
  };

  const managePlan = () => {
    toastInfo(
      `Plan management is simulated for the ${SUBSCRIPTION.plan} plan.`,
    );
  };

  const navigation = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", gap: 1.25, minHeight: 76, px: 2.5 }}
      >
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            fontSize: 11,
            fontWeight: 900,
            height: 32,
            justifyContent: "center",
            width: 32,
          }}
        >
          CO
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 900 }}>
            commerce os
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            one platform · many roles
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Viewing as
        </Typography>
        <Select
          fullWidth
          size="small"
          value={persona}
          onChange={(event) => {
            setPersona(event.target.value as Persona);
            navigate("overview");
          }}
          sx={{ mt: 1, fontSize: 12 }}
        >
          {PERSONAS.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        {nav.map(({ label, view: target, icon: Icon }) => (
          <ListItemButton
            key={label}
            selected={view === target}
            onClick={() => navigate(target)}
            sx={{
              borderRadius: 1.5,
              minHeight: 42,
              px: 1.5,
              "&.Mui-selected": {
                bgcolor: "action.selected",
                color: "primary.main",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={label}
              slotProps={{ primary: { sx: { fontSize: 12, fontWeight: 700 } } }}
            />
          </ListItemButton>
        ))}
      </Box>
      <Paper
        variant="outlined"
        sx={{ bgcolor: "action.hover", borderColor: "divider", m: 1.5, p: 1.5 }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 800 }}>
          {personaLabel(persona)}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 10, lineHeight: 1.5, mt: 0.5 }}
        >
          {PERSONAS.find((item) => item.id === persona)?.description}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          minHeight: "100vh",
        }}
      >
        <Box
          component="aside"
          sx={{
            bgcolor: "background.paper",
            borderRight: 1,
            borderColor: "divider",
            display: { xs: "none", md: "block" },
            flex: "0 0 248px",
            position: "sticky",
            top: 0,
            zIndex: 4,
          }}
        >
          <Box sx={{ height: "100vh" }}>{navigation}</Box>
        </Box>
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          slotProps={{ paper: { sx: { width: 280 } } }}
        >
          {navigation}
        </Drawer>
        <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
          <Box
            component="header"
            sx={{
              alignItems: "center",
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              height: 76,
              justifyContent: "space-between",
              px: { xs: 2, md: 3 },
              position: "sticky",
              top: 0,
              zIndex: 3,
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { md: "none" } }}
              >
                <MenuRounded />
              </IconButton>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
                  {view === "overview" ? "Overview" : view}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 11 }}>
                  {selectedStore.name} · {personaLabel(persona)}
                </Typography>
              </Box>
            </Stack>
            <Stack
              direction="row"
              sx={{ alignItems: "center", gap: { xs: 0.5, sm: 1 } }}
            >
              <Button
                aria-label="Return to product overview"
                component={Link}
                href="/saas-platform/landing"
                size="small"
                startIcon={<ArrowBackRounded />}
                sx={{
                  color: "text.secondary",
                  display: "inline-flex",
                  fontSize: 12,
                  minWidth: 0,
                  px: { xs: 0.5, sm: 1 },
                  "&:hover": { color: "text.primary" },
                }}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Product overview
                </Box>
              </Button>
              <Tooltip
                title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
              >
                <IconButton
                  aria-label="Toggle color mode"
                  onClick={() =>
                    setMode((current) =>
                      current === "dark" ? "light" : "dark",
                    )
                  }
                >
                  {mode === "dark" ? <LightModeRounded /> : <DarkModeRounded />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton aria-label="Notifications">
                  <NotificationsNoneRounded />
                </IconButton>
              </Tooltip>
              <Avatar
                sx={{
                  bgcolor: "primary.dark",
                  fontSize: 12,
                  height: 32,
                  width: 32,
                }}
              >
                ES
              </Avatar>
            </Stack>
          </Box>
          <Box
            sx={{ maxWidth: 1440, p: { xs: 2, sm: 3, lg: 4 }, width: "100%" }}
          >
            {view === "overview" ? (
              <>
                <PageHeading
                  eyebrow={`${personaLabel(persona)} · Commerce OS`}
                  title={
                    persona === "supplier"
                      ? "Supplier overview"
                      : persona === "coach"
                        ? "Coach workspace"
                        : persona === "affiliate"
                          ? "Affiliate overview"
                          : "Good morning, Emmanuel"
                  }
                  description="Commerce OS brings storefronts, operations, analytics, subscriptions, and growth tools into one workspace."
                  action={
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      sx={{ alignItems: { sm: "center" }, gap: 1 }}
                    >
                      <Select
                        size="small"
                        value={storeId}
                        onChange={(event) => setStoreId(event.target.value)}
                        sx={{ minWidth: 190, fontSize: 12 }}
                      >
                        {STORES.map((store) => (
                          <MenuItem key={store.id} value={store.id}>
                            {store.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Button startIcon={<TuneRounded />} variant="outlined">
                        Customize
                      </Button>
                    </Stack>
                  }
                />
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                  }}
                >
                  <MetricCard
                    label="Revenue"
                    value={
                      persona === "supplier"
                        ? "₱1.24M"
                        : formatPeso(selectedStore.revenue)
                    }
                    change="+12.8%"
                    icon={TrendingUpRounded}
                  />
                  <MetricCard
                    label="Orders"
                    value={
                      persona === "supplier"
                        ? "3,482"
                        : selectedStore.orders.toLocaleString()
                    }
                    change="+8.4%"
                    icon={ShoppingBagRounded}
                  />
                  <MetricCard
                    label={persona === "supplier" ? "Products" : "Margin"}
                    value={
                      persona === "supplier"
                        ? String(activeProducts(products).length)
                        : "31.8%"
                    }
                    change="+6.2%"
                    icon={
                      persona === "supplier"
                        ? Inventory2Rounded
                        : AutoGraphRounded
                    }
                  />
                  <MetricCard
                    label={persona === "supplier" ? "Low stock" : "Customers"}
                    value={
                      persona === "supplier" ? String(lowStockCount) : "8,492"
                    }
                    change="+0.7%"
                    icon={
                      persona === "supplier"
                        ? WarehouseRounded
                        : PeopleAltRounded
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { lg: "1.2fr .8fr" },
                    mt: 2,
                  }}
                >
                  <Box sx={{ display: "grid", gap: 2 }}>
                    <DashboardModules
                      persona={persona}
                      onNavigate={navigate}
                      products={products}
                    />
                  </Box>
                  <Box sx={{ display: "grid", gap: 2, alignContent: "start" }}>
                    <CardShell
                      title="Capability profile"
                      subtitle="Persona + plan determines the workspace"
                    >
                      <Stack sx={{ px: 2.5, pb: 2 }}>
                        {[
                          ["Advanced analytics", "advancedAnalytics"],
                          ["Multiple stores", "multipleStores"],
                          ["Affiliate tools", "affiliateTools"],
                          ["Advanced margins", "advancedMargins"],
                          ["Supplier operations", "supplierOperations"],
                        ].map(([label, key]) => {
                          const enabled = capabilities.includes(
                            key as Capability,
                          );
                          return (
                            <Stack
                              direction="row"
                              key={label}
                              sx={{ alignItems: "center", gap: 1, py: 0.9 }}
                            >
                              <CircleRounded
                                sx={{
                                  color: enabled
                                    ? "success.main"
                                    : "text.disabled",
                                  fontSize: 9,
                                }}
                              />
                              <Typography
                                color={
                                  enabled ? "text.primary" : "text.secondary"
                                }
                                sx={{ flex: 1, fontSize: 12 }}
                              >
                                {label}
                              </Typography>
                              {!enabled && (
                                <Chip
                                  label="Plan gated"
                                  size="small"
                                  sx={{ fontSize: 10 }}
                                />
                              )}
                            </Stack>
                          );
                        })}
                      </Stack>
                    </CardShell>
                    <CardShell
                      title="Activity"
                      subtitle="Recent events across the workspace"
                    >
                      <Stack sx={{ px: 2.5, pb: 1 }}>
                        {[
                          "Order #NC-10282 completed",
                          "Storefront published",
                          "Payout processed",
                          "New affiliate conversion",
                        ].map((item) => (
                          <Stack
                            direction="row"
                            key={item}
                            sx={{
                              alignItems: "center",
                              borderBottom: 1,
                              borderColor: "divider",
                              gap: 1,
                              py: 1.2,
                            }}
                          >
                            <TaskAltRounded color="success" fontSize="small" />
                            <Typography sx={{ fontSize: 12 }}>
                              {item}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardShell>
                  </Box>
                </Box>
              </>
            ) : selectedProduct ? (
              <ProductDetail
                movements={movements}
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
                onEdit={openProductEditor}
                onUpdateInventory={setStockProduct}
              />
            ) : (
              <DataView
                view={view}
                persona={persona}
                products={products}
                orders={orders}
                onProductSelect={setSelectedProduct}
                onAddProduct={() => openProductEditor()}
                onEditProduct={openProductEditor}
                onToggleArchive={toggleArchive}
                onUpdateInventory={setStockProduct}
                onReviewAlert={reviewAlert}
                reviewedAlerts={reviewedAlerts}
                affiliateLinks={affiliateLinks}
                payouts={payouts}
                priceRequests={priceRequests}
                settlements={settlements}
                onCreateAffiliateLink={createAffiliateLink}
                onCreatePriceRequest={createPriceRequest}
                onDownloadReport={downloadReport}
                onPreviewStore={previewStore}
                onRequestPayout={requestPayout}
                onManagePlan={managePlan}
              />
            )}
            <Paper
              sx={{
                bgcolor: "primary.dark",
                color: "primary.contrastText",
                mt: 4,
                p: { xs: 2, md: 2.5 },
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
                Portfolio Demonstration
              </Typography>
              <Typography
                sx={{
                  color: "inherit",
                  fontSize: 11,
                  lineHeight: 1.5,
                  mt: 0.4,
                  opacity: 0.78,
                }}
              >
                This is a fictionalized reconstruction inspired by SaaS
                architecture and workflows worked with professionally. All
                users, products, metrics, transactions, and data are synthetic.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
      <ProductEditorDialog
        onClose={() => {
          setEditingProduct(null);
          setProductEditorOpen(false);
        }}
        onSave={saveProduct}
        open={productEditorOpen}
        product={editingProduct}
      />
      <StockEditorDialog
        onClose={() => setStockProduct(null)}
        onSave={saveStockMutation}
        open={Boolean(stockProduct)}
        product={stockProduct}
      />
      <FloatingHomeButton />
      <ScrollToTopButton threshold={420} />
    </ThemeProvider>
  );
}

export default function SaaSPlatformPage() {
  return (
    <TwcAlertProvider>
      <CommerceOsWorkspace />
    </TwcAlertProvider>
  );
}
