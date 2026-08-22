"use client";

import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import { useMemo, useState } from "react";
import { FloatingHomeButton } from "../../components/FloatingHomeButton";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import TwcAlertProvider, { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";
import { createPortfolioTheme } from "../../theme/portfolioTheme";

type OrderStatus = "Ready to pack" | "In transit" | "Delivered" | "Attention";
type Order = {
  id: string;
  customer: string;
  initials: string;
  channel: string;
  items: number;
  total: string;
  placed: string;
  status: OrderStatus;
  destination: string;
  carrier: string;
  eta: string;
};

type CreateOrderInput = {
  customer: string;
  destination: string;
  items: string;
  total: string;
};

type CustomerRecord = {
  name: string;
  company: string;
  orders: number;
  value: string;
  health: string;
  initials: string;
};

type NavItem = {
  label: string;
  icon: typeof DashboardRoundedIcon;
};

const navItems: NavItem[] = [
  { label: "Overview", icon: DashboardRoundedIcon },
  { label: "Orders", icon: AssignmentTurnedInRoundedIcon },
  { label: "Inventory", icon: Inventory2RoundedIcon },
  { label: "Customers", icon: PeopleAltRoundedIcon },
];

const orders: Order[] = [
  {
    id: "FO-84291",
    customer: "Mara Santos",
    initials: "MS",
    channel: "Direct store",
    items: 3,
    total: "₱2,480",
    placed: "12 min ago",
    status: "Ready to pack",
    destination: "Davao City, PH",
    carrier: "J&T Express",
    eta: "Aug 14, 2026",
  },
  {
    id: "FO-84290",
    customer: "Eli Navarro",
    initials: "EN",
    channel: "Marketplace",
    items: 1,
    total: "₱890",
    placed: "38 min ago",
    status: "In transit",
    destination: "Cebu City, PH",
    carrier: "Ninja Van",
    eta: "Aug 13, 2026",
  },
  {
    id: "FO-84289",
    customer: "Joana Lim",
    initials: "JL",
    channel: "Direct store",
    items: 6,
    total: "₱5,120",
    placed: "1 hr ago",
    status: "Attention",
    destination: "Quezon City, PH",
    carrier: "J&T Express",
    eta: "Address review",
  },
  {
    id: "FO-84288",
    customer: "Paolo Reyes",
    initials: "PR",
    channel: "Wholesale",
    items: 12,
    total: "₱12,640",
    placed: "2 hrs ago",
    status: "Delivered",
    destination: "Makati City, PH",
    carrier: "LBC Express",
    eta: "Delivered today",
  },
  {
    id: "FO-84287",
    customer: "Nina Cruz",
    initials: "NC",
    channel: "Direct store",
    items: 2,
    total: "₱1,760",
    placed: "3 hrs ago",
    status: "Ready to pack",
    destination: "Iloilo City, PH",
    carrier: "Ninja Van",
    eta: "Aug 15, 2026",
  },
];

const statusColors: Record<OrderStatus, "warning" | "info" | "success" | "error"> = {
  "Ready to pack": "warning",
  "In transit": "info",
  Delivered: "success",
  Attention: "error",
};

const statusIcon: Record<OrderStatus, typeof AddTaskRoundedIcon> = {
  "Ready to pack": AddTaskRoundedIcon,
  "In transit": LocalShippingRoundedIcon,
  Delivered: DoneAllRoundedIcon,
  Attention: WarningAmberRoundedIcon,
};

function FulfillmentOsShell() {
  const [mode, setMode] = useState<PaletteMode>("dark");
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeStatus, setActiveStatus] = useState<"All" | OrderStatus>("All");
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [ordersState, setOrdersState] = useState(orders);
  const alert = useTwcAlert();
  const theme = useMemo(() => createPortfolioTheme(mode, "modern"), [mode]);

  const visibleOrders = ordersState.filter((order) => {
    const matchesStatus = activeStatus === "All" || order.status === activeStatus;
    const search = query.trim().toLowerCase();
    const matchesQuery =
      !search ||
      order.id.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.destination.toLowerCase().includes(search);
    return matchesStatus && matchesQuery;
  });

  const handleNavClick = (label: string) => {
    setActiveNav(label);
  };

  const handleRefresh = () => {
    alert.toastSuccess("Workspace refreshed · all operational data is current.");
  };

  const handleCreateOrder = (input: CreateOrderInput) => {
    const nextOrder: Order = {
      id: `FO-${84292 + ordersState.length}`,
      customer: input.customer,
      initials: input.customer
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      channel: "Direct store",
      items: Number(input.items),
      total: `₱${Number(input.total).toLocaleString("en-PH")}`,
      placed: "Just now",
      status: "Ready to pack",
      destination: input.destination,
      carrier: "Assign carrier",
      eta: "Pending pickup",
    };

    setOrdersState((current) => [nextOrder, ...current]);
    setCreateOrderOpen(false);
    setActiveNav("Orders");
    alert.toastSuccess(`${nextOrder.id} was created and added to the order queue.`);
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleMarkReady = () => {
    if (!selectedOrder) return;
    const updatedOrder = { ...selectedOrder, status: "Ready to pack" as const };
    setOrdersState((current) =>
      current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
    );
    setSelectedOrder(updatedOrder);
    alert.toastSuccess(`${updatedOrder.id} moved to Ready to pack.`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FulfillmentOsContent
        activeNav={activeNav}
        activeStatus={activeStatus}
        detailOpen={detailOpen}
        mobileNavOpen={mobileNavOpen}
        mode={mode}
        onCloseDrawer={() => setDetailOpen(false)}
        onMarkReady={handleMarkReady}
        onNavClick={handleNavClick}
        onOpenCreateOrder={() => setCreateOrderOpen(true)}
        onRefresh={handleRefresh}
        onSelectOrder={handleOrderSelect}
        onStatusChange={setActiveStatus}
        onToggleMode={() => setMode((current) => (current === "dark" ? "light" : "dark"))}
        onToggleNav={() => setMobileNavOpen((current) => !current)}
        orders={visibleOrders}
        query={query}
        selectedOrder={selectedOrder}
        setQuery={setQuery}
      />
      <CreateOrderDialog onClose={() => setCreateOrderOpen(false)} onSubmit={handleCreateOrder} open={createOrderOpen} />
    </ThemeProvider>
  );
}

type FulfillmentOsContentProps = {
  activeNav: string;
  activeStatus: "All" | OrderStatus;
  detailOpen: boolean;
  mobileNavOpen: boolean;
  mode: PaletteMode;
  onCloseDrawer: () => void;
  onMarkReady: () => void;
  onNavClick: (label: string) => void;
  onOpenCreateOrder: () => void;
  onRefresh: () => void;
  onSelectOrder: (order: Order) => void;
  onStatusChange: (status: "All" | OrderStatus) => void;
  onToggleMode: () => void;
  onToggleNav: () => void;
  orders: Order[];
  query: string;
  selectedOrder: Order | null;
  setQuery: (query: string) => void;
};

function FulfillmentOsContent({
  activeNav,
  activeStatus,
  detailOpen,
  mobileNavOpen,
  mode,
  onCloseDrawer,
  onMarkReady,
  onNavClick,
  onOpenCreateOrder,
  onRefresh,
  onSelectOrder,
  onStatusChange,
  onToggleMode,
  onToggleNav,
  orders,
  query,
  selectedOrder,
  setQuery,
}: FulfillmentOsContentProps) {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <OperationsSidebar activeNav={activeNav} mobile={isMobile} onNavClick={onNavClick} open={mobileNavOpen} onClose={onToggleNav} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            component="header"
            sx={{
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              gap: 1.5,
              height: { xs: 64, md: 72 },
              justifyContent: "space-between",
              px: { xs: 2, md: 4 },
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              {isMobile && (
                <IconButton aria-label="Open navigation" onClick={onToggleNav}>
                  <MenuRoundedIcon />
                </IconButton>
              )}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
                  FulfillmentOS
                </Typography>
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.75 }}>
                <Chip label="Workspace" size="small" sx={{ bgcolor: "action.hover", fontWeight: 800 }} />
                <Typography color="text.secondary" sx={{ alignSelf: "center", fontSize: "0.78rem" }}>
                  / Operations
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={{ xs: 0.5, md: 1.25 }} sx={{ alignItems: "center" }}>
              <Tooltip title="Refresh workspace">
                <IconButton aria-label="Refresh workspace" onClick={onRefresh}>
                  <RefreshRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={mode === "dark" ? "Use light mode" : "Use dark mode"}>
                <IconButton aria-label="Toggle color mode" onClick={onToggleMode}>
                  {mode === "dark" ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <IconButton aria-label="Notifications" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
                <NotificationsNoneRoundedIcon fontSize="small" />
              </IconButton>
              <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
              <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontSize: "0.76rem", fontWeight: 900, height: 32, width: 32 }}>
                NP
              </Avatar>
            </Stack>
          </Box>

          <Box component="main" sx={{ mx: "auto", maxWidth: 1520, p: { xs: 2, sm: 3, lg: 4 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "flex-end" }, justifyContent: "space-between", mb: 3.5 }}>
              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                  <Box sx={{ bgcolor: "success.main", borderRadius: "50%", height: 7, width: 7 }} />
                  <Typography color="success.main" sx={{ fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Live operations
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                    Updated just now
                  </Typography>
                </Stack>
                <Typography component="h1" sx={{ fontSize: { xs: "2rem", md: "2.8rem" }, fontWeight: 950, letterSpacing: "-0.055em", lineHeight: 1 }}>
                  Good morning, Noy.
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mt: 1 }}>
                  Keep today&apos;s orders moving with less operational noise.
                </Typography>
              </Box>
              <Button onClick={onOpenCreateOrder} startIcon={<AddTaskRoundedIcon />} variant="contained">
                Create order
              </Button>
            </Stack>

            <WorkspaceView
              activeNav={activeNav}
              activeStatus={activeStatus}
              onOpenCreateOrder={onOpenCreateOrder}
              onSelectOrder={onSelectOrder}
              onStatusChange={onStatusChange}
              orders={orders}
              query={query}
              setQuery={setQuery}
            />
          </Box>
        </Box>
      </Box>

      <OrderDetailDrawer onClose={onCloseDrawer} onMarkReady={onMarkReady} open={detailOpen} order={selectedOrder} />
      <FloatingHomeButton />
      <ScrollToTopButton color="secondary" threshold={360} />
    </Box>
  );
}

type WorkspaceViewProps = {
  activeNav: string;
  activeStatus: "All" | OrderStatus;
  onOpenCreateOrder: () => void;
  onSelectOrder: (order: Order) => void;
  onStatusChange: (status: "All" | OrderStatus) => void;
  orders: Order[];
  query: string;
  setQuery: (query: string) => void;
};

function WorkspaceView({
  activeNav,
  activeStatus,
  onOpenCreateOrder,
  onSelectOrder,
  onStatusChange,
  orders: visibleOrders,
  query,
  setQuery,
}: WorkspaceViewProps) {
  if (activeNav === "Orders") {
    return (
      <OrderWorkspace
        activeStatus={activeStatus}
        onOpenCreateOrder={onOpenCreateOrder}
        onSelectOrder={onSelectOrder}
        onStatusChange={onStatusChange}
        orders={visibleOrders}
        query={query}
        setQuery={setQuery}
      />
    );
  }

  if (activeNav === "Inventory") {
    return <InventoryWorkspace />;
  }

  if (activeNav === "Customers") {
    return <CustomersWorkspace />;
  }

  return (
    <OverviewWorkspace
      activeStatus={activeStatus}
      onSelectOrder={onSelectOrder}
      onStatusChange={onStatusChange}
      orders={visibleOrders}
      query={query}
      setQuery={setQuery}
    />
  );
}

function OverviewWorkspace({
  activeStatus,
  onSelectOrder,
  onStatusChange,
  orders,
  query,
  setQuery,
}: Omit<WorkspaceViewProps, "activeNav" | "onOpenCreateOrder">) {
  return (
    <>
      <MetricRow />
      <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ mt: 2 }}>
        <Paper sx={{ border: 1, borderColor: "divider", borderRadius: 2, boxShadow: "none", flex: 1, minWidth: 0, p: { xs: 2, md: 2.5 } }}>
          <SectionHeader icon={<LocalShippingRoundedIcon />} subtitle="Where work is accumulating" title="Fulfillment pipeline" />
          <Pipeline />
        </Paper>
        <Paper sx={{ border: 1, borderColor: "divider", borderRadius: 2, boxShadow: "none", flex: 1, minWidth: 0, p: { xs: 2, md: 2.5 } }}>
          <SectionHeader icon={<WarningAmberRoundedIcon />} subtitle="Items that need a decision" title="Attention needed" />
          <AttentionList />
        </Paper>
      </Stack>
      <OrderQueue
        activeStatus={activeStatus}
        onSelectOrder={onSelectOrder}
        onStatusChange={onStatusChange}
        orders={orders}
        query={query}
        setQuery={setQuery}
      />
    </>
  );
}

function OrderWorkspace({
  activeStatus,
  onOpenCreateOrder,
  onSelectOrder,
  onStatusChange,
  orders,
  query,
  setQuery,
}: Omit<WorkspaceViewProps, "activeNav">) {
  return (
    <>
      <WorkspaceTitle
        eyebrow="Orders workspace"
        title="Move every order forward."
        description="A focused queue for fulfillment teams to review, filter, and hand off work."
        action="Export queue"
        onAction={onOpenCreateOrder}
      />
      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { md: "repeat(3, 1fr)" }, mb: 2 }}>
        <MiniMetric label="Open queue" value="42" detail="Ready to pack" color="warning.main" />
        <MiniMetric label="In transit" value="88" detail="Across 3 carriers" color="info.main" />
        <MiniMetric label="Avg. handling time" value="18m" detail="4m faster this week" color="success.main" />
      </Box>
      <OrderQueue
        activeStatus={activeStatus}
        onSelectOrder={onSelectOrder}
        onStatusChange={onStatusChange}
        orders={orders}
        query={query}
        setQuery={setQuery}
      />
    </>
  );
}

function OrderQueue({
  activeStatus,
  onSelectOrder,
  onStatusChange,
  orders,
  query,
  setQuery,
}: Omit<WorkspaceViewProps, "activeNav" | "onOpenCreateOrder">) {
  return (
    <Paper sx={{ border: 1, borderColor: "divider", borderRadius: 2, boxShadow: "none", mt: 2, overflow: "hidden" }}>
      <Box sx={{ p: { xs: 2, md: 2.5, lg: 3 } }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ alignItems: { lg: "center" }, justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 900 }}>Order queue</Typography>
            <Typography color="text.secondary" sx={{ fontSize: "0.8rem", mt: 0.4 }}>
              Review, update, and hand off today&apos;s work.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", lg: "auto" } }}>
            <TextField
              fullWidth
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders or customers"
              size="small"
              value={query}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }}
              sx={{ minWidth: { sm: 260 } }}
            />
            <Button startIcon={<FilterListRoundedIcon />} sx={{ borderColor: "divider", minWidth: 110 }} variant="outlined">
              Filters
            </Button>
          </Stack>
        </Stack>
        <Tabs onChange={(_, value: "All" | OrderStatus) => onStatusChange(value)} scrollButtons="auto" sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }} value={activeStatus} variant="scrollable">
          {(["All", "Ready to pack", "In transit", "Attention", "Delivered"] as const).map((status) => (
            <Tab key={status} label={status} value={status} sx={{ fontSize: "0.78rem", fontWeight: 850, minHeight: 44, minWidth: "auto", mr: 2, px: 0, textTransform: "none" }} />
          ))}
        </Tabs>
      </Box>
      <OrderTable orders={orders} onSelect={onSelectOrder} />
    </Paper>
  );
}

function InventoryWorkspace() {
  const [replenishmentItem, setReplenishmentItem] = useState<string | null>(null);
  const inventory = [
    { name: "Ava Clutch Wallet · Tan", sku: "AVA-TAN-01", stock: 8, reorder: 12, supplier: "Mood", status: "Reorder soon" },
    { name: "Moments Anion Day Pads", sku: "SAN-DAY-10", stock: 284, reorder: 80, supplier: "Santé", status: "Healthy" },
    { name: "AlloyBuds M5", sku: "ALLOY-M5-BLK", stock: 0, reorder: 20, supplier: "Mood", status: "Out of stock" },
    { name: "Boost Coffee 10-pack", sku: "BOOST-10-PK", stock: 42, reorder: 30, supplier: "Santé", status: "Healthy" },
  ];

  return (
    <>
      <WorkspaceTitle onAction={() => setReplenishmentItem("New purchase order")} eyebrow="Inventory workspace" title="Know what needs replenishing." description="Track availability across suppliers before stockouts become customer support tickets." action="Create purchase order" />
      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { md: "repeat(3, 1fr)" }, mb: 2 }}>
        <MiniMetric label="Units on hand" value="12,840" detail="Across 428 SKUs" color="primary.main" />
        <MiniMetric label="Low stock" value="14" detail="3 need action today" color="warning.main" />
        <MiniMetric label="Inventory value" value="₱2.8M" detail="+6.2% this month" color="success.main" />
      </Box>
      <Paper sx={{ border: 1, borderColor: "divider", borderRadius: 2, boxShadow: "none", overflow: "hidden" }}>
        <Box sx={{ p: { xs: 2, md: 2.5 } }}><SectionHeader icon={<Inventory2RoundedIcon />} subtitle="Supplier stock levels and reorder points" title="Inventory health" /></Box>
        <Stack divider={<Divider flexItem />}>
          {inventory.map((item) => {
            const percentage = Math.min((item.stock / item.reorder) * 100, 100);
            const color: "error" | "warning" | "success" = item.stock === 0 ? "error" : item.stock <= item.reorder ? "warning" : "success";
            return <Stack direction={{ xs: "column", sm: "row" }} key={item.sku} spacing={2} sx={{ alignItems: { sm: "center" }, p: { xs: 2, md: 2.5 } }}>
              <Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontSize: "0.82rem", fontWeight: 850 }}>{item.name}</Typography><Typography color="text.secondary" sx={{ fontSize: "0.7rem", mt: 0.35 }}>{item.sku} · {item.supplier}</Typography></Box>
              <Box sx={{ minWidth: { sm: 190 }, width: { xs: "100%", sm: "auto" } }}><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.5 }}><Typography sx={{ fontSize: "0.72rem", fontWeight: 850 }}>{item.stock} units</Typography><Typography color="text.secondary" sx={{ fontSize: "0.68rem" }}>reorder at {item.reorder}</Typography></Stack><LinearProgress color={color} value={percentage} variant="determinate" /></Box>
              <Chip color={color} label={item.status} size="small" sx={{ fontSize: "0.68rem", fontWeight: 850, minWidth: 104 }} />
              <Button onClick={() => setReplenishmentItem(item.name)} size="small" sx={{ whiteSpace: "nowrap" }}>Review</Button>
            </Stack>;
          })}
        </Stack>
      </Paper>
      <ReplenishmentDialog itemName={replenishmentItem} onClose={() => setReplenishmentItem(null)} open={Boolean(replenishmentItem)} />
    </>
  );
}

function ReplenishmentDialog({ itemName, onClose, open }: { itemName: string | null; onClose: () => void; open: boolean }) {
  const alert = useTwcAlert();
  const [quantity, setQuantity] = useState("25");
  const [priority, setPriority] = useState("Standard");

  const handleSubmit = () => {
    const requestedQuantity = Number(quantity);
    if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
      alert.toastError("Enter a replenishment quantity greater than zero.");
      return;
    }
    alert.toastSuccess(`${requestedQuantity} units requested for ${itemName}.`);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle sx={{ pr: 6 }}>Create replenishment request<IconButton aria-label="Close replenishment form" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}><CloseRoundedIcon /></IconButton></DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ fontSize: "0.8rem", mb: 2 }}>{itemName ?? "Select an item"}</Typography>
        <Stack spacing={2}>
          <TextField fullWidth helperText="Use whole units only" label="Quantity" onChange={(event) => setQuantity(event.target.value)} type="number" value={quantity} />
          <FormControl fullWidth><InputLabel id="replenishment-priority-label">Priority</InputLabel><Select label="Priority" labelId="replenishment-priority-label" onChange={(event) => setPriority(event.target.value)} value={priority}><MenuItem value="Standard">Standard</MenuItem><MenuItem value="Urgent">Urgent</MenuItem></Select></FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}><Button onClick={onClose}>Cancel</Button><Button onClick={handleSubmit} variant="contained">Submit request</Button></DialogActions>
    </Dialog>
  );
}

function CreateOrderDialog({ onClose, onSubmit, open }: { onClose: () => void; onSubmit: (input: CreateOrderInput) => void; open: boolean }) {
  const alert = useTwcAlert();
  const [customer, setCustomer] = useState("");
  const [destination, setDestination] = useState("");
  const [items, setItems] = useState("1");
  const [total, setTotal] = useState("1200");

  const handleSubmit = () => {
    const itemCount = Number(items);
    const orderTotal = Number(total);
    if (!customer.trim() || !destination.trim() || !Number.isInteger(itemCount) || itemCount <= 0 || !Number.isFinite(orderTotal) || orderTotal <= 0) {
      alert.toastError("Complete the customer, destination, item count, and order value fields.");
      return;
    }
    onSubmit({ customer: customer.trim(), destination: destination.trim(), items, total });
    setCustomer("");
    setDestination("");
    setItems("1");
    setTotal("1200");
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle sx={{ pr: 6 }}>Create demo order<IconButton aria-label="Close create order form" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}><CloseRoundedIcon /></IconButton></DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ fontSize: "0.8rem", mb: 2 }}>Add a local order to the queue and simulate the packing handoff.</Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { sm: "repeat(2, 1fr)" } }}>
          <TextField autoFocus fullWidth label="Customer name" onChange={(event) => setCustomer(event.target.value)} value={customer} />
          <TextField fullWidth label="Destination" onChange={(event) => setDestination(event.target.value)} value={destination} />
          <TextField fullWidth label="Items" onChange={(event) => setItems(event.target.value)} type="number" value={items} />
          <TextField fullWidth label="Order value" onChange={(event) => setTotal(event.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start">₱</InputAdornment> } }} type="number" value={total} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}><Button onClick={onClose}>Cancel</Button><Button onClick={handleSubmit} startIcon={<AddTaskRoundedIcon />} variant="contained">Create order</Button></DialogActions>
    </Dialog>
  );
}

function CustomersWorkspace() {
  const customers: CustomerRecord[] = [
    { name: "Mara Santos", company: "Santos Studio", orders: 18, value: "₱42,800", health: "Growing", initials: "MS" },
    { name: "Paolo Reyes", company: "Reyes Wholesale", orders: 34, value: "₱128,400", health: "VIP", initials: "PR" },
    { name: "Joana Lim", company: "J. Lim Home", orders: 7, value: "₱15,240", health: "At risk", initials: "JL" },
    { name: "Nina Cruz", company: "Cruz Essentials", orders: 12, value: "₱28,600", health: "Growing", initials: "NC" },
  ];

  const [customerDialog, setCustomerDialog] = useState<CustomerRecord | "new" | null>(null);

  return (
    <>
      <WorkspaceTitle onAction={() => setCustomerDialog("new")} eyebrow="Customers workspace" title="Build better customer context." description="See purchase behavior, account health, and the next action for every relationship." action="Add customer" />
      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { md: "repeat(3, 1fr)" }, mb: 2 }}>
        <MiniMetric label="Active customers" value="2,418" detail="+14 this week" color="primary.main" />
        <MiniMetric label="Repeat purchase rate" value="68.2%" detail="+4.8% this quarter" color="success.main" />
        <MiniMetric label="Accounts at risk" value="09" detail="Needs outreach" color="error.main" />
      </Box>
      <Paper sx={{ border: 1, borderColor: "divider", borderRadius: 2, boxShadow: "none", overflow: "hidden" }}>
        <Box sx={{ p: { xs: 2, md: 2.5 } }}><SectionHeader icon={<PeopleAltRoundedIcon />} subtitle="Recent customer activity and account health" title="Customer accounts" /></Box>
        <Stack divider={<Divider flexItem />}>
          {customers.map((customer) => {
            const healthColor: "error" | "secondary" | "success" = customer.health === "At risk" ? "error" : customer.health === "VIP" ? "secondary" : "success";
            return <Stack direction={{ xs: "column", sm: "row" }} key={customer.name} spacing={1.5} sx={{ alignItems: { sm: "center" }, p: { xs: 2, md: 2.5 } }}>
              <Avatar sx={{ bgcolor: "action.selected", color: "primary.main", fontSize: "0.68rem", fontWeight: 900, height: 34, width: 34 }}>{customer.initials}</Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontSize: "0.82rem", fontWeight: 850 }}>{customer.name}</Typography><Typography color="text.secondary" sx={{ fontSize: "0.7rem", mt: 0.3 }}>{customer.company}</Typography></Box>
              <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}><Box><Typography color="text.secondary" sx={{ fontSize: "0.65rem", textTransform: "uppercase" }}>Orders</Typography><Typography sx={{ fontSize: "0.78rem", fontWeight: 850, mt: 0.25 }}>{customer.orders}</Typography></Box><Box><Typography color="text.secondary" sx={{ fontSize: "0.65rem", textTransform: "uppercase" }}>Lifetime value</Typography><Typography sx={{ fontSize: "0.78rem", fontWeight: 850, mt: 0.25 }}>{customer.value}</Typography></Box><Chip color={healthColor} label={customer.health} size="small" sx={{ fontSize: "0.68rem", fontWeight: 850 }} /></Stack>
              <Button onClick={() => setCustomerDialog(customer)} size="small">View</Button>
            </Stack>;
          })}
        </Stack>
      </Paper>
      <CustomerDialog customer={customerDialog} onClose={() => setCustomerDialog(null)} open={Boolean(customerDialog)} />
    </>
  );
}

function CustomerDialog({ customer, onClose, open }: { customer: CustomerRecord | "new" | null; onClose: () => void; open: boolean }) {
  const alert = useTwcAlert();
  const isNew = customer === "new";
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !company.trim() || !email.includes("@")) {
      alert.toastError("Enter a name, company, and valid email address.");
      return;
    }
    alert.toastSuccess(`${name} was added to customer accounts.`);
    onClose();
    setName("");
    setCompany("");
    setEmail("");
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle sx={{ pr: 6 }}>{isNew ? "Add customer" : customer?.name}<IconButton aria-label="Close customer form" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}><CloseRoundedIcon /></IconButton></DialogTitle>
      <DialogContent>
        {isNew ? <Stack spacing={2} sx={{ mt: 1 }}><TextField autoFocus fullWidth label="Customer name" onChange={(event) => setName(event.target.value)} value={name} /><TextField fullWidth label="Company" onChange={(event) => setCompany(event.target.value)} value={company} /><TextField fullWidth label="Email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} /></Stack> : <Stack spacing={2} sx={{ mt: 1 }}><DetailRow label="Company" value={customer?.company ?? ""} /><DetailRow label="Orders" value={String(customer?.orders ?? 0)} /><DetailRow label="Lifetime value" value={customer?.value ?? ""} /><DetailRow label="Account health" value={customer?.health ?? ""} /></Stack>}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>{isNew ? <><Button onClick={onClose}>Cancel</Button><Button onClick={handleSubmit} variant="contained">Save customer</Button></> : <Button onClick={() => alert.toastInfo(`Timeline for ${customer?.name} is ready for the next demo slice.`)} variant="contained">View timeline</Button>}</DialogActions>
    </Dialog>
  );
}

function WorkspaceTitle({ action, description, eyebrow, onAction, title }: { action: string; description: string; eyebrow: string; onAction?: () => void; title: string }) {
  const alert = useTwcAlert();
  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }
    alert.toastInfo(`${action} is available in the full workflow demo.`);
  };

  return <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "flex-end" }, justifyContent: "space-between", mb: 3.5 }}><Box><Typography color="primary.main" sx={{ fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>{eyebrow}</Typography><Typography component="h2" sx={{ fontSize: { xs: "1.9rem", md: "2.5rem" }, fontWeight: 950, letterSpacing: "-0.055em", lineHeight: 1, mt: 0.8 }}>{title}</Typography><Typography color="text.secondary" sx={{ fontSize: "0.9rem", mt: 1 }}>{description}</Typography></Box><Button onClick={handleAction} startIcon={<AddTaskRoundedIcon />} variant="contained">{action}</Button></Stack>;
}

function MiniMetric({ color, detail, label, value }: { color: string; detail: string; label: string; value: string }) {
  return <Paper sx={{ border: 1, borderColor: "divider", borderRadius: 2, boxShadow: "none", p: 2 }}><Typography color="text.secondary" sx={{ fontSize: "0.68rem", fontWeight: 850, textTransform: "uppercase" }}>{label}</Typography><Typography sx={{ color, fontSize: "1.65rem", fontWeight: 950, letterSpacing: "-0.05em", mt: 0.8 }}>{value}</Typography><Typography color="text.secondary" sx={{ fontSize: "0.72rem", mt: 0.25 }}>{detail}</Typography></Paper>;
}

function OperationsSidebar({ activeNav, mobile, onClose, onNavClick, open }: { activeNav: string; mobile: boolean; onClose: () => void; onNavClick: (label: string) => void; open: boolean }) {
  const content = (
    <Box sx={{ bgcolor: "background.paper", borderRight: { md: 1 }, borderColor: "divider", display: "flex", flexDirection: "column", height: "100%", width: 248 }}>
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", px: 2.5, py: 2.5 }}>
        <Box sx={{ alignItems: "center", bgcolor: "primary.main", borderRadius: 1.5, color: "primary.contrastText", display: "flex", height: 34, justifyContent: "center", width: 34 }}>
          <AppsRoundedIcon fontSize="small" />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 950, letterSpacing: "-0.03em", lineHeight: 1 }}>FulfillmentOS</Typography>
          <Typography color="text.secondary" sx={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.08em", mt: 0.45, textTransform: "uppercase" }}>Order operations</Typography>
        </Box>
        {mobile && <IconButton aria-label="Close navigation" onClick={onClose} sx={{ ml: "auto" }}><CloseRoundedIcon fontSize="small" /></IconButton>}
      </Stack>

      <Box sx={{ px: 1.5 }}>
        <Typography color="text.secondary" sx={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.12em", mb: 1, px: 1, textTransform: "uppercase" }}>Workspace</Typography>
        <List disablePadding>
          {navItems.map(({ icon: Icon, label }) => (
            <ListItemButton
              key={label}
              onClick={() => { onNavClick(label); if (mobile) onClose(); }}
              selected={activeNav === label}
              sx={{ borderRadius: 1.5, mb: 0.5, minHeight: 42, px: 1.25, "&.Mui-selected": { bgcolor: "action.selected", color: "primary.main" }, "&.Mui-selected:hover": { bgcolor: "action.selected" } }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 34 }}><Icon fontSize="small" /></ListItemIcon>
              <ListItemText primary={<Typography component="span" sx={{ fontSize: "0.84rem", fontWeight: 800 }}>{label}</Typography>} />
              {label === "Orders" && <Chip label="24" size="small" sx={{ bgcolor: "warning.main", color: "warning.contrastText", fontSize: "0.64rem", fontWeight: 900, height: 21 }} />}
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Paper sx={{ bgcolor: "action.hover", border: 1, borderColor: "divider", boxShadow: "none", p: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
            <StorefrontRoundedIcon color="primary" fontSize="small" />
            <Box>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 850 }}>Acme Commerce</Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.68rem", lineHeight: 1.4, mt: 0.3 }}>Production workspace</Typography>
            </Box>
            <IconButton aria-label="Switch workspace" size="small" sx={{ ml: "auto", mt: -0.5 }}><ExpandMoreRoundedIcon fontSize="small" /></IconButton>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );

  if (mobile) return <Drawer onClose={onClose} open={open} slotProps={{ paper: { sx: { bgcolor: "background.paper" } } }}>{content}</Drawer>;
  return <Box component="aside" sx={{ display: { xs: "none", md: "block" }, flexShrink: 0, width: 248 }}>{content}</Box>;
}

function MetricRow() {
  const metrics = [
    { label: "Orders today", value: "184", change: "+12.8%", positive: true, icon: AssignmentTurnedInRoundedIcon },
    { label: "On-time delivery", value: "96.4%", change: "+2.1%", positive: true, icon: LocalShippingRoundedIcon },
    { label: "Revenue processed", value: "₱428K", change: "+8.4%", positive: true, icon: AttachMoneyRoundedIcon },
    { label: "Needs attention", value: "07", change: "3 urgent", positive: false, icon: WarningAmberRoundedIcon },
  ];

  return (
    <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" } }}>
      {metrics.map(({ change, icon: Icon, label, positive, value }) => (
        <Paper key={label} sx={{ border: 1, borderColor: "divider", borderRadius: 2, boxShadow: "none", p: 2 }}>
          <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
            <Typography color="text.secondary" sx={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>{label}</Typography>
            <Box sx={{ alignItems: "center", bgcolor: positive ? alpha("#2e7d5b", 0.14) : alpha("#d97706", 0.16), borderRadius: 1, color: positive ? "success.main" : "warning.main", display: "flex", height: 29, justifyContent: "center", width: 29 }}><Icon sx={{ fontSize: 16 }} /></Box>
          </Stack>
          <Typography sx={{ fontSize: "1.85rem", fontWeight: 950, letterSpacing: "-0.05em", mt: 1.1 }}>{value}</Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.4 }}>
            {positive ? <TrendingUpRoundedIcon color="success" sx={{ fontSize: 15 }} /> : <TrendingDownRoundedIcon color="warning" sx={{ fontSize: 15 }} />}
            <Typography color={positive ? "success.main" : "warning.main"} sx={{ fontSize: "0.72rem", fontWeight: 850 }}>{change}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: "0.7rem" }}>{positive ? "vs last week" : "right now"}</Typography>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}

function SectionHeader({ icon, subtitle, title }: { icon: React.ReactNode; subtitle: string; title: string }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
      <Box>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}><Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box><Typography sx={{ fontSize: "1rem", fontWeight: 900 }}>{title}</Typography></Stack>
        <Typography color="text.secondary" sx={{ fontSize: "0.76rem", mt: 0.45 }}>{subtitle}</Typography>
      </Box>
      <IconButton aria-label={`More ${title.toLowerCase()} options`} size="small"><MoreHorizRoundedIcon fontSize="small" /></IconButton>
    </Stack>
  );
}

function Pipeline() {
  const steps = [
    { label: "Ready to pack", count: 42, total: 184, color: "warning.main" },
    { label: "In transit", count: 88, total: 184, color: "info.main" },
    { label: "Delivered", count: 47, total: 184, color: "success.main" },
  ];

  return (
    <Stack spacing={2.1} sx={{ mt: 3 }}>
      {steps.map(({ color, count, label, total }) => (
        <Box key={label}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.8 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 800 }}>{label}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: "0.75rem" }}><Box component="span" sx={{ color, fontWeight: 950 }}>{count}</Box> / {total}</Typography>
          </Stack>
          <LinearProgress sx={{ bgcolor: "action.hover", borderRadius: 999, height: 8, "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 999 } }} value={(count / total) * 100} variant="determinate" />
        </Box>
      ))}
    </Stack>
  );
}

function AttentionList() {
  const items = [
    { title: "Address needs review", detail: "FO-84289 · Quezon City", color: "error.main" },
    { title: "Carrier pickup in 24 min", detail: "18 parcels waiting", color: "warning.main" },
    { title: "3 products below reorder point", detail: "Inventory · 2 suppliers", color: "info.main" },
  ];

  return (
    <Stack divider={<Divider flexItem />} sx={{ mt: 1.25 }}>
      {items.map(({ color, detail, title }) => (
        <Stack direction="row" key={title} spacing={1.25} sx={{ alignItems: "center", py: 1.45 }}>
          <Box sx={{ bgcolor: color, borderRadius: "50%", height: 8, width: 8 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontSize: "0.78rem", fontWeight: 850 }}>{title}</Typography><Typography color="text.secondary" sx={{ fontSize: "0.7rem", mt: 0.25 }}>{detail}</Typography></Box>
          <IconButton aria-label={`Open ${title}`} size="small"><KeyboardArrowRightRoundedIcon fontSize="small" /></IconButton>
        </Stack>
      ))}
    </Stack>
  );
}

function OrderTable({ orders: visibleOrders, onSelect }: { orders: Order[]; onSelect: (order: Order) => void }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={{ borderCollapse: "collapse", minWidth: 820, width: "100%" }}>
        <Box component="thead" sx={{ bgcolor: "action.hover" }}>
          <Box component="tr">
            {['Order', 'Customer', 'Destination', 'Value', 'Placed', 'Status', ''].map((heading) => <Box component="th" key={heading} sx={{ color: "text.secondary", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.05em", p: "12px 18px", textAlign: "left", textTransform: "uppercase" }}>{heading}</Box>)}
          </Box>
        </Box>
        <Box component="tbody">
          {visibleOrders.map((order) => {
            const StatusIcon = statusIcon[order.status];
            return (
              <Box component="tr" key={order.id} onClick={() => onSelect(order)} sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" }, "&:last-child td": { borderBottom: 0 } }}>
                <Box component="td" sx={{ borderBottom: 1, borderColor: "divider", p: "15px 18px" }}><Typography sx={{ fontSize: "0.78rem", fontWeight: 900 }}>{order.id}</Typography><Typography color="text.secondary" sx={{ fontSize: "0.68rem", mt: 0.35 }}>{order.channel}</Typography></Box>
                <Box component="td" sx={{ borderBottom: 1, borderColor: "divider", p: "15px 18px" }}><Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Avatar sx={{ bgcolor: "action.selected", color: "primary.main", fontSize: "0.65rem", fontWeight: 900, height: 28, width: 28 }}>{order.initials}</Avatar><Box><Typography sx={{ fontSize: "0.78rem", fontWeight: 800 }}>{order.customer}</Typography><Typography color="text.secondary" sx={{ fontSize: "0.68rem" }}>{order.items} items</Typography></Box></Stack></Box>
                <Box component="td" sx={{ borderBottom: 1, borderColor: "divider", color: "text.secondary", fontSize: "0.75rem", p: "15px 18px" }}>{order.destination}</Box>
                <Box component="td" sx={{ borderBottom: 1, borderColor: "divider", fontSize: "0.78rem", fontWeight: 900, p: "15px 18px" }}>{order.total}</Box>
                <Box component="td" sx={{ borderBottom: 1, borderColor: "divider", color: "text.secondary", fontSize: "0.74rem", p: "15px 18px" }}>{order.placed}</Box>
                <Box component="td" sx={{ borderBottom: 1, borderColor: "divider", p: "15px 18px" }}><Chip icon={<StatusIcon sx={{ fontSize: "14px !important" }} />} label={order.status} color={statusColors[order.status]} size="small" sx={{ fontSize: "0.68rem", fontWeight: 850 }} /></Box>
                <Box component="td" sx={{ borderBottom: 1, borderColor: "divider", p: "15px 18px", textAlign: "right" }}><IconButton aria-label={`Open ${order.id}`} size="small"><KeyboardArrowRightRoundedIcon fontSize="small" /></IconButton></Box>
              </Box>
            );
          })}
          {visibleOrders.length === 0 && <Box component="tr"><Box component="td" colSpan={7} sx={{ p: 5, textAlign: "center" }}><Typography sx={{ fontWeight: 850 }}>No orders match this view.</Typography><Typography color="text.secondary" sx={{ fontSize: "0.8rem", mt: 0.5 }}>Try a different search or status filter.</Typography></Box></Box>}
        </Box>
      </Box>
    </Box>
  );
}

function OrderDetailDrawer({ onClose, onMarkReady, open, order }: { onClose: () => void; onMarkReady: () => void; open: boolean; order: Order | null }) {
  return (
    <Drawer anchor="right" onClose={onClose} open={open} slotProps={{ paper: { sx: { bgcolor: "background.paper", width: { xs: "100%", sm: 420 } } } }}>
      {order && (
        <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
            <Box><Typography color="text.secondary" sx={{ fontSize: "0.7rem", fontWeight: 850, letterSpacing: "0.08em", textTransform: "uppercase" }}>Order detail</Typography><Typography sx={{ fontSize: "1.55rem", fontWeight: 950, letterSpacing: "-0.04em", mt: 0.5 }}>{order.id}</Typography></Box>
            <IconButton aria-label="Close order detail" onClick={onClose}><CloseRoundedIcon /></IconButton>
          </Stack>
          <Chip color={statusColors[order.status]} label={order.status} sx={{ mt: 2 }} />
          <Divider sx={{ my: 2.5 }} />
          <Stack spacing={2.25}>
            <DetailRow label="Customer" value={order.customer} />
            <DetailRow label="Destination" value={order.destination} />
            <DetailRow label="Carrier" value={order.carrier} />
            <DetailRow label="Estimated delivery" value={order.eta} />
            <DetailRow label="Order value" value={order.total} />
          </Stack>
          <Paper sx={{ bgcolor: "action.hover", border: 1, borderColor: "divider", boxShadow: "none", mt: 3, p: 2 }}>
            <Stack direction="row" spacing={1.25}><LocalShippingRoundedIcon color="primary" fontSize="small" /><Box><Typography sx={{ fontSize: "0.78rem", fontWeight: 900 }}>Next best action</Typography><Typography color="text.secondary" sx={{ fontSize: "0.74rem", lineHeight: 1.5, mt: 0.4 }}>{order.status === "Attention" ? "Review the shipping address before releasing this order." : "Confirm the parcel is packed before the carrier pickup window."}</Typography></Box></Stack>
          </Paper>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 3 }}>
            <Button fullWidth onClick={onMarkReady} startIcon={<AddTaskRoundedIcon />} variant="contained">Mark ready</Button>
            <Button fullWidth onClick={onClose} variant="outlined">Close</Button>
          </Stack>
        </Box>
      )}
    </Drawer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <Box><Typography color="text.secondary" sx={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase" }}>{label}</Typography><Typography sx={{ fontSize: "0.9rem", fontWeight: 800, mt: 0.45 }}>{value}</Typography></Box>;
}

export default function FulfillmentOsPage() {
  return (
    <TwcAlertProvider>
      <FulfillmentOsShell />
    </TwcAlertProvider>
  );
}
