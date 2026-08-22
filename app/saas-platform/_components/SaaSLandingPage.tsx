"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  GlobalStyles,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  type PaletteMode,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { FloatingHomeButton } from "../../components/FloatingHomeButton";
import ThemeToggle from "../../components/solar/ThemeToggle";
import { createPortfolioTheme } from "../../theme/portfolioTheme";

type PreviewKey =
  "overview" | "commerce" | "customers" | "automation" | "analytics";

type Preview = {
  label: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: ReactNode;
  accent: string;
  rows: { label: string; value: string; detail: string }[];
};

const previews: Record<PreviewKey, Preview> = {
  overview: {
    label: "Overview",
    title: "See the whole operation at a glance.",
    description:
      "A focused workspace for the decisions that move your business forward.",
    metric: "82%",
    metricLabel: "workflow health",
    icon: <AutoGraphRoundedIcon />,
    accent: "#8fb4ff",
    rows: [
      { label: "Orders to review", value: "24", detail: "Needs attention" },
      { label: "Inventory signals", value: "08", detail: "Across 3 catalogs" },
      { label: "Active workflows", value: "12", detail: "2 running now" },
    ],
  },
  commerce: {
    label: "Commerce",
    title: "Keep products, orders, and inventory connected.",
    description:
      "Move from catalog changes to fulfillment decisions without switching contexts.",
    metric: "1,284",
    metricLabel: "demo orders",
    icon: <ShoppingBagRoundedIcon />,
    accent: "#62d5d0",
    rows: [
      { label: "Ready to fulfill", value: "148", detail: "Across all stores" },
      { label: "Low-stock items", value: "09", detail: "3 critical" },
      { label: "Open returns", value: "17", detail: "Within SLA" },
    ],
  },
  customers: {
    label: "Customers",
    title: "Turn customer activity into useful context.",
    description:
      "Understand who needs help, what they want, and which conversations matter next.",
    metric: "8,421",
    metricLabel: "demo customers",
    icon: <GroupsRoundedIcon />,
    accent: "#d9a7ff",
    rows: [
      { label: "New this week", value: "126", detail: "+14% from last week" },
      { label: "Follow-ups due", value: "31", detail: "5 high priority" },
      {
        label: "Returning customers",
        value: "64%",
        detail: "Across connected stores",
      },
    ],
  },
  automation: {
    label: "Automation",
    title: "Make repeatable work feel lighter.",
    description:
      "Build clearer handoffs for alerts, follow-ups, and the small tasks that compound.",
    metric: "36",
    metricLabel: "hours saved in demo",
    icon: <SettingsSuggestRoundedIcon />,
    accent: "#ffc875",
    rows: [
      { label: "Order alerts", value: "06", detail: "Running reliably" },
      { label: "Follow-up paths", value: "11", detail: "Across 4 segments" },
      { label: "Failed steps", value: "02", detail: "Ready to retry" },
    ],
  },
  analytics: {
    label: "Analytics",
    title: "Trade noise for a clearer signal.",
    description:
      "Bring performance indicators into one calm view built for action, not decoration.",
    metric: "₱482K",
    metricLabel: "demo gross volume",
    icon: <InsightsRoundedIcon />,
    accent: "#ff9eac",
    rows: [
      {
        label: "Revenue trend",
        value: "+18.4%",
        detail: "Compared with prior period",
      },
      { label: "Top category", value: "Audio", detail: "22% of demo volume" },
      { label: "Average order", value: "₱1,842", detail: "Across demo orders" },
    ],
  },
};

const capabilities = [
  {
    key: "commerce" as const,
    title: "Commerce control",
    description:
      "Products, orders, inventory, and supplier activity in one connected flow.",
    icon: <ShoppingBagRoundedIcon />,
  },
  {
    key: "customers" as const,
    title: "Customer context",
    description:
      "Give every conversation a useful place to live and a clear next action.",
    icon: <GroupsRoundedIcon />,
  },
  {
    key: "automation" as const,
    title: "Operational rhythm",
    description:
      "Turn repetitive handoffs into visible workflows your team can improve.",
    icon: <BoltRoundedIcon />,
  },
  {
    key: "analytics" as const,
    title: "Business signal",
    description:
      "Make performance easier to read with focused metrics and honest context.",
    icon: <AutoGraphRoundedIcon />,
  },
];

function DemoChart({ accent }: { accent: string }) {
  return (
    <Box
      aria-label="Illustrative revenue trend"
      role="img"
      sx={{ height: 112, position: "relative" }}
    >
      <Box
        component="svg"
        preserveAspectRatio="none"
        viewBox="0 0 520 140"
        sx={{ height: "100%", overflow: "visible", width: "100%" }}
      >
        <path
          d="M0 118 C45 110 60 90 100 96 S150 116 187 85 S250 42 290 69 S345 100 375 66 S438 28 520 18"
          fill="none"
          stroke={accent}
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          d="M0 118 C45 110 60 90 100 96 S150 116 187 85 S250 42 290 69 S345 100 375 66 S438 28 520 18 V140 H0 Z"
          fill={accent}
          opacity="0.12"
        />
      </Box>
      <Stack
        direction="row"
        sx={{
          bottom: -4,
          color: "text.secondary",
          justifyContent: "space-between",
          left: 0,
          position: "absolute",
          right: 0,
        }}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <Typography key={day} variant="caption">
            {day}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

function ProductPreview({ preview }: { preview: Preview }) {
  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: "background.paper",
        borderColor: "divider",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 28px 80px rgba(0, 0, 0, .28)"
            : "0 28px 80px rgba(25, 55, 105, .14)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          gap: 1,
          px: { xs: 2, sm: 3 },
          py: 1.5,
        }}
      >
        <Stack direction="row" spacing={0.5}>
          {["#ff7a8b", "#ffc75f", "#62d5d0"].map((color) => (
            <Box
              key={color}
              sx={{ bgcolor: color, borderRadius: "50%", height: 8, width: 8 }}
            />
          ))}
        </Stack>
        <Typography
          color="text.secondary"
          sx={{ flex: 1, fontSize: 12, ml: 1 }}
        >
          northstar.app / workspace / {preview.label.toLowerCase()}
        </Typography>
        <Chip
          label="Demo view"
          size="small"
          sx={{ bgcolor: "action.hover", fontSize: 11 }}
        />
      </Box>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between" }}
        >
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: preview.accent,
                  color: "#0b1120",
                  height: 34,
                  width: 34,
                }}
              >
                {preview.icon}
              </Avatar>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                {preview.label}
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontSize: { xs: 22, sm: 28 },
                fontWeight: 850,
                mt: 2,
                maxWidth: 460,
              }}
            >
              {preview.title}
            </Typography>
          </Box>
          <Box sx={{ minWidth: { sm: 150 }, textAlign: { sm: "right" } }}>
            <Typography
              sx={{ color: preview.accent, fontSize: 30, fontWeight: 900 }}
            >
              {preview.metric}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {preview.metricLabel}
            </Typography>
          </Box>
        </Stack>
        <Box
          sx={{
            bgcolor: "action.hover",
            borderRadius: 2,
            mt: 3,
            p: { xs: 1.5, sm: 2 },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", mb: 1 }}
          >
            <Typography sx={{ fontWeight: 800 }}>Performance signal</Typography>
            <Chip label="Illustrative" size="small" variant="outlined" />
          </Stack>
          <DemoChart accent={preview.accent} />
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            mt: 2,
          }}
        >
          {preview.rows.map((row) => (
            <Paper
              key={row.label}
              sx={{ bgcolor: "background.default", p: 1.5 }}
              variant="outlined"
            >
              <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                {row.label}
              </Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 850, mt: 0.5 }}>
                {row.value}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 11, mt: 0.25 }}
              >
                {row.detail}
              </Typography>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

function NetworkMap({ active }: { active: PreviewKey }) {
  const nodes = [
    {
      key: "commerce" as const,
      label: "Commerce",
      icon: <Inventory2RoundedIcon />,
    },
    {
      key: "customers" as const,
      label: "Customers",
      icon: <GroupsRoundedIcon />,
    },
    {
      key: "automation" as const,
      label: "Operations",
      icon: <SettingsSuggestRoundedIcon />,
    },
    {
      key: "analytics" as const,
      label: "Analytics",
      icon: <InsightsRoundedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        position: "relative",
      }}
    >
      {nodes.map((node) => (
        <Paper
          key={node.key}
          sx={{
            bgcolor: node.key === active ? "primary.main" : "background.paper",
            color:
              node.key === active ? "primary.contrastText" : "text.primary",
            p: { xs: 1.5, sm: 2 },
            position: "relative",
            transition: "all 180ms ease",
            transform: node.key === active ? "translateY(-4px)" : "none",
          }}
          variant="outlined"
        >
          <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center" }}>
            {node.key === active ? <CheckRoundedIcon /> : node.icon}
            <Typography sx={{ fontSize: { xs: 13, sm: 15 }, fontWeight: 800 }}>
              {node.label}
            </Typography>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}

export default function SaaSLandingPage() {
  const [mode, setMode] = useState<PaletteMode>("dark");
  const [previewKey, setPreviewKey] = useState<PreviewKey>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const theme = useMemo(() => createPortfolioTheme(mode, "modern"), [mode]);
  const preview = previews[previewKey];

  useEffect(() => {
    const savedMode = window.localStorage.getItem("portfolio-theme-mode");
    if (savedMode === "light" || savedMode === "dark") setMode(savedMode);
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => setAuthenticated(response.ok))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("portfolio-theme-mode", mode);
    document.documentElement.dataset.mode = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const dashboardHref = "/saas-platform";
  const authHref = authenticated
    ? dashboardHref
    : "/login?callbackUrl=/saas-platform";
  const registerHref = "/login?mode=register&callbackUrl=/saas-platform";

  function scrollTo(id: string) {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FloatingHomeButton />
      <GlobalStyles
        styles={{
          html: { scrollBehavior: "smooth" },
          body: { backgroundColor: theme.palette.background.default },
        }}
      />
      <AppBar
        color="transparent"
        elevation={0}
        position="sticky"
        sx={{
          backdropFilter: "blur(16px)",
          bgcolor:
            mode === "dark"
              ? "rgba(11, 17, 32, .88)"
              : "rgba(245, 247, 251, .9)",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ gap: 2, minHeight: { xs: 68, sm: 76 } }}
          >
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ alignItems: "center", flex: 1 }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: 13,
                  fontWeight: 900,
                }}
              >
                N
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 900,
                    letterSpacing: "-.03em",
                    lineHeight: 1,
                  }}
                >
                  Northstar
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: 10,
                    letterSpacing: ".12em",
                    mt: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Commerce OS
                </Typography>
              </Box>
            </Stack>
            <Stack
              component="nav"
              direction="row"
              spacing={0.5}
              sx={{ alignItems: "center", display: { xs: "none", md: "flex" } }}
            >
              <Button
                component={Link}
                href="/twc-ecommerce"
                size="small"
                sx={{ color: "text.secondary" }}
              >
                Shop
              </Button>
              {["capabilities", "workflow", "tour", "faq"].map((id) => (
                <Button
                  color="inherit"
                  key={id}
                  onClick={() => scrollTo(id)}
                  size="small"
                  sx={{ color: "text.secondary" }}
                >
                  {id === "faq" ? "FAQ" : id[0].toUpperCase() + id.slice(1)}
                </Button>
              ))}
            </Stack>
            <ThemeToggle
              compact
              mode={mode}
              onToggle={() =>
                setMode((current) => (current === "dark" ? "light" : "dark"))
              }
            />
            <Button
              component={Link}
              href={authHref}
              size="small"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              {authenticated ? "Open workspace" : "Sign in"}
            </Button>
            {!authenticated && (
              <Button
                component={Link}
                href={registerHref}
                size="small"
                variant="contained"
              >
                Get started
              </Button>
            )}
            <IconButton
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMobileOpen((current) => !current)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              {mobileOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
            </IconButton>
          </Toolbar>
          {mobileOpen && (
            <Paper
              elevation={0}
              sx={{
                borderTop: 1,
                borderColor: "divider",
                display: { md: "none" },
                pb: 1,
                pt: 1,
              }}
            >
              <Stack>
                <Button
                  component={Link}
                  href="/twc-ecommerce"
                  sx={{ justifyContent: "flex-start" }}
                >
                  Shop
                </Button>
                {["capabilities", "workflow", "tour", "faq"].map((id) => (
                  <Button
                    color="inherit"
                    key={id}
                    onClick={() => scrollTo(id)}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {id[0].toUpperCase() + id.slice(1)}
                  </Button>
                ))}
              </Stack>
            </Paper>
          )}
        </Container>
      </AppBar>

      <Box component="main">
        <Box sx={{ overflow: "hidden", position: "relative" }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: "50%",
              filter: "blur(2px)",
              height: 360,
              opacity: 0.12,
              position: "absolute",
              right: "-10%",
              top: 80,
              width: 360,
            }}
          />
          <Container
            maxWidth="lg"
            sx={{
              pb: { xs: 8, md: 12 },
              pt: { xs: 8, md: 13 },
              position: "relative",
            }}
          >
            <Box sx={{ maxWidth: 850 }}>
              <Chip
                icon={<RocketLaunchRoundedIcon />}
                label="A calmer operating layer for modern commerce"
                sx={{ bgcolor: "action.hover", borderColor: "divider", mb: 3 }}
                variant="outlined"
              />
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 48, sm: 68, md: 86 },
                  fontWeight: 900,
                  letterSpacing: "-.075em",
                  lineHeight: 0.94,
                  maxWidth: 900,
                }}
              >
                Your business, in one clear workspace.
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: { xs: 18, md: 21 },
                  lineHeight: 1.65,
                  mt: 3,
                  maxWidth: 660,
                }}
              >
                Northstar connects the operational details behind a growing
                online business—products, customers, workflows, and
                performance—so your team can act with more context.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mt: 4 }}
              >
                <Button
                  component={Link}
                  endIcon={<ArrowForwardRoundedIcon />}
                  href={authenticated ? dashboardHref : registerHref}
                  size="large"
                  sx={{ px: 2.5 }}
                  variant="contained"
                >
                  {authenticated
                    ? "Open your workspace"
                    : "Start with the demo"}
                </Button>
                <Button
                  endIcon={<KeyboardArrowDownRoundedIcon />}
                  onClick={() => scrollTo("capabilities")}
                  size="large"
                  sx={{ px: 2.5 }}
                  variant="outlined"
                >
                  Explore the platform
                </Button>
              </Stack>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 3 }}
                sx={{ color: "text.secondary", mt: 3 }}
              >
                {[
                  "Products and orders",
                  "Customer context",
                  "Actionable signals",
                ].map((item) => (
                  <Stack
                    direction="row"
                    key={item}
                    spacing={0.75}
                    sx={{ alignItems: "center" }}
                  >
                    <CheckRoundedIcon color="secondary" sx={{ fontSize: 18 }} />
                    <Typography variant="body2">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
            <Box sx={{ mt: { xs: 6, md: 9 }, mx: "auto", maxWidth: 1040 }}>
              <ProductPreview preview={preview} />
            </Box>
          </Container>
        </Box>

        <Box
          id="capabilities"
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            borderTop: 1,
          }}
        >
          <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{ justifyContent: "space-between", mb: 5 }}
            >
              <Box>
                <Typography
                  color="primary.main"
                  sx={{ fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}
                >
                  ONE CONNECTED SYSTEM
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { xs: 34, md: 52 },
                    fontWeight: 900,
                    letterSpacing: "-.06em",
                    lineHeight: 1,
                    mt: 1,
                  }}
                >
                  Everything important,
                  <br />
                  closer together.
                </Typography>
              </Box>
              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.7, maxWidth: 390 }}
              >
                The platform is organized around the work your team actually
                does. Select a capability to change the preview and see how the
                system fits together.
              </Typography>
            </Stack>
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
              {capabilities.map((item) => (
                <Card
                  key={item.key}
                  onClick={() => setPreviewKey(item.key)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ")
                      setPreviewKey(item.key);
                  }}
                  role="button"
                  tabIndex={0}
                  variant="outlined"
                  sx={{
                    bgcolor:
                      previewKey === item.key
                        ? "action.selected"
                        : "background.paper",
                    borderColor:
                      previewKey === item.key ? "primary.main" : "divider",
                    cursor: "pointer",
                    transition: "transform 180ms ease, border-color 180ms ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor:
                          previewKey === item.key
                            ? "primary.main"
                            : "action.hover",
                        color:
                          previewKey === item.key
                            ? "primary.contrastText"
                            : "primary.main",
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Typography sx={{ fontWeight: 850 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: 14, lineHeight: 1.55, mt: 1 }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>

        <Container id="workflow" maxWidth="lg" sx={{ py: { xs: 8, md: 13 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 5, md: 10 }}
            sx={{ alignItems: "center" }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                color="primary.main"
                sx={{ fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}
              >
                THE OPERATING LAYER
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: 34, md: 52 },
                  fontWeight: 900,
                  letterSpacing: "-.06em",
                  lineHeight: 1,
                  mt: 1,
                }}
              >
                One platform.
                <br />
                Many moving parts.
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.7, mt: 2, maxWidth: 480 }}
              >
                Northstar is designed to make connections visible. When a
                product changes, an order moves, or a customer needs attention,
                the right context is easier to find.
              </Typography>
              <Button
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => setPreviewKey("overview")}
                sx={{ mt: 3 }}
                variant="outlined"
              >
                View the overview
              </Button>
            </Box>
            <Box sx={{ flex: 1, width: "100%" }}>
              <NetworkMap active={previewKey} />
              <Box
                sx={{
                  bgcolor: "action.hover",
                  borderRadius: 3,
                  mt: 2,
                  p: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontWeight: 850 }}>Your business</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 14, mt: 0.5 }}
                >
                  A shared layer for commerce, customers, operations, and
                  insight.
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Container>

        <Box
          id="tour"
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            borderTop: 1,
          }}
        >
          <Container maxWidth="lg" sx={{ py: { xs: 8, md: 13 } }}>
            <Typography
              color="primary.main"
              sx={{ fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}
            >
              PRODUCT TOUR
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 34, md: 52 },
                fontWeight: 900,
                letterSpacing: "-.06em",
                lineHeight: 1,
                mt: 1,
              }}
            >
              Move from signal to action.
            </Typography>
            <Tabs
              aria-label="Product preview categories"
              onChange={(_event, value: PreviewKey) => setPreviewKey(value)}
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}
              value={previewKey}
              variant="scrollable"
            >
              {Object.values(previews).map((item) => (
                <Tab
                  key={item.label}
                  label={item.label}
                  value={item.label.toLowerCase() as PreviewKey}
                />
              ))}
            </Tabs>
            <Box sx={{ mt: 4 }}>
              <ProductPreview preview={preview} />
            </Box>
          </Container>
        </Box>

        <Container id="faq" maxWidth="md" sx={{ py: { xs: 8, md: 13 } }}>
          <Typography
            color="primary.main"
            sx={{ fontSize: 12, fontWeight: 900, letterSpacing: ".15em" }}
          >
            A FEW GOOD QUESTIONS
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 34, md: 52 },
              fontWeight: 900,
              letterSpacing: "-.06em",
              lineHeight: 1,
              mt: 1,
            }}
          >
            Built to be explored.
          </Typography>
          <Stack divider={<Divider />} sx={{ mt: 4 }}>
            {[
              {
                question: "Is this a live commerce platform?",
                answer:
                  "This portfolio experience is a product demonstration. The workspace uses clearly labeled demo data while the authentication and profile flows use the connected portfolio application.",
              },
              {
                question: "Who is the workspace for?",
                answer:
                  "It is designed around the needs of operators, sellers, suppliers, and small teams who need their catalog, customers, workflows, and business signals in one place.",
              },
              {
                question: "Can I try the authenticated workspace?",
                answer:
                  "Yes. Use Get started to create an account or Sign in if you already have one. After authentication, the flow opens the existing portfolio workspace.",
              },
            ].map((item) => (
              <Box key={item.question} sx={{ py: 2.5 }}>
                <Typography sx={{ fontWeight: 850 }}>
                  {item.question}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ lineHeight: 1.7, mt: 1 }}
                >
                  {item.answer}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>

        <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
          <Container
            maxWidth="md"
            sx={{ py: { xs: 8, md: 11 }, textAlign: "center" }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 34, md: 54 },
                fontWeight: 900,
                letterSpacing: "-.06em",
                lineHeight: 1,
              }}
            >
              Make the next decision easier.
            </Typography>
            <Typography
              sx={{ color: "inherit", opacity: 0.82, lineHeight: 1.7, mt: 2 }}
            >
              Explore the workspace, test the flow, and see how the pieces fit
              together.
            </Typography>
            <Button
              component={Link}
              href={authenticated ? dashboardHref : registerHref}
              sx={{
                bgcolor: "background.paper",
                color: "text.primary",
                mt: 3,
                "&:hover": { bgcolor: "background.default" },
              }}
              variant="contained"
            >
              {authenticated ? "Open workspace" : "Get started"}
            </Button>
          </Container>
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ justifyContent: "space-between" }}
          >
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: 12,
                    fontWeight: 900,
                    height: 28,
                    width: 28,
                  }}
                >
                  N
                </Avatar>
                <Typography sx={{ fontWeight: 900 }}>
                  Northstar Commerce
                </Typography>
              </Stack>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 13, lineHeight: 1.6, mt: 1, maxWidth: 320 }}
              >
                A portfolio-built SaaS concept for connected commerce operations
                and clearer business decisions.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Button component={Link} href={dashboardHref} size="small">
                Workspace
              </Button>
              <Button component={Link} href="/profile" size="small">
                Profile
              </Button>
              <Button component={Link} href="/" size="small">
                Portfolio
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Typography color="text.secondary" sx={{ fontSize: 12 }}>
            © 2026 Emmanuel Pangan · Product experience study
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
