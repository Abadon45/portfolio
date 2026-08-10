"use client";

import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Avatar, Box, Button, Card as MuiCard, Chip, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, LinearProgress, MenuItem, Select, Snackbar, Stack as MuiStack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FloatingHomeButton } from "../FloatingHomeButton";
import ThemeToggle from "../solar/ThemeToggle";

type LayoutStackProps = React.ComponentProps<typeof MuiStack> & {
  alignItems?: React.CSSProperties["alignItems"];
  justifyContent?: React.CSSProperties["justifyContent"];
};

function Stack({ alignItems, justifyContent, sx, ...props }: LayoutStackProps) {
  return <MuiStack {...props} sx={sx} style={{ alignItems, justifyContent }} />;
}

function Card(props: React.ComponentProps<typeof MuiCard>) {
  return <MuiCard {...props} sx={props.sx} style={{ ...props.style, backgroundColor: "var(--cloud-surface)" }} />;
}

function createCloudTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? "#ffb74d" : "#b76500", contrastText: isDark ? "#251706" : "#ffffff" },
      background: { default: isDark ? "#07111f" : "#f3f7fb", paper: isDark ? "#10243a" : "#ffffff" },
      text: { primary: isDark ? "#f5f9ff" : "#172b43", secondary: isDark ? "#c2d2e2" : "#5b7188" },
      divider: isDark ? "rgba(172,198,222,.3)" : "#d8e3ed",
    },
    typography: { fontFamily: "var(--font-poppins), sans-serif", button: { fontWeight: 700, textTransform: "none" }, caption: { color: isDark ? "#c2d2e2" : "#5b7188" } },
    shape: { borderRadius: 14 },
    components: {
      MuiOutlinedInput: { styleOverrides: { root: { color: isDark ? "#f5f9ff" : "#172b43", "& .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "#57718c" : "#b9c9d8" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "#9eb8d0" : "#7a96ad" } } } },
      MuiIconButton: { styleOverrides: { root: { color: isDark ? "#c2d2e2" : "#5b7188" } } },
    },
  });
}

const services = [
  { name: "API Gateway", detail: "12.4k requests", icon: <CodeRoundedIcon />, color: "#9cdbff", status: "Healthy" },
  { name: "Lambda", detail: "8 functions", icon: <DataObjectRoundedIcon />, color: "#ffb74d", status: "Healthy" },
  { name: "DynamoDB", detail: "3 tables", icon: <StorageRoundedIcon />, color: "#b8a1ff", status: "Healthy" },
  { name: "S3 storage", detail: "68.2 GB used", icon: <CloudQueueRoundedIcon />, color: "#6ed6bd", status: "Healthy" },
];

const initialActivity = [
  { title: "Production API deployed", detail: "Version 2.4.1 · completed", time: "2h ago", tone: "success" },
  { title: "Daily backup completed", detail: "DynamoDB snapshot · 18.4 MB", time: "4h ago", tone: "info" },
  { title: "Auth policy updated", detail: "Cloudline production · Noy", time: "6h ago", tone: "warning" },
];

function Metric({ label, value, change, accent }: { label: string; value: string; change: string; accent: string }) {
  return <Card sx={{ p: 2.25, bgcolor: "#0d1b2d", border: "1px solid rgba(139,160,184,.16)", boxShadow: "none" }}>
    <Typography color="text.secondary" sx={{ fontSize: 12, letterSpacing: ".04em" }}>{label}</Typography>
    <Box sx={{ alignItems: "flex-end", display: "flex", justifyContent: "space-between", mt: 1 }}>
      <Typography sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 700, letterSpacing: "-.04em" }}>{value}</Typography>
      <Typography sx={{ color: accent, fontSize: 12, fontWeight: 700 }}>{change}</Typography>
    </Box>
  </Card>;
}

export default function AwsOperationsPage() {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [region, setRegion] = useState("us-east-1");
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [deploymentOpen, setDeploymentOpen] = useState(false);
  const [activity, setActivity] = useState(initialActivity);
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    const saved = window.localStorage.getItem("cloudline-theme");
    if (saved === "light" || saved === "dark") setMode(saved);
  }, []);
  const cloudTheme = useMemo(() => createCloudTheme(mode), [mode]);
  const toggleMode = () => setMode((current) => {
    const next = current === "dark" ? "light" : "dark";
    window.localStorage.setItem("cloudline-theme", next);
    return next;
  });
  const tabs = ["Overview", "Services", "Activity"];
  const startDeployment = () => setDeploymentOpen(true);
  const confirmDeployment = () => {
    setDeploymentOpen(false);
    setActivity((current) => [{ title: "Production API deploying", detail: `Version 2.4.2 · ${region}`, time: "now", tone: "success" }, ...current]);
    setNotice("Deployment started successfully");
    setActiveTab("Activity");
  };

  return <ThemeProvider theme={cloudTheme}>
    <CssBaseline />
    <Box style={{ "--cloud-surface": mode === "dark" ? "#10243a" : "#ffffff" } as React.CSSProperties} sx={{ color: "text.primary", minHeight: "100vh", bgcolor: "background.default", backgroundImage: mode === "dark" ? "radial-gradient(circle at 80% 0%, rgba(33,81,126,.28), transparent 32rem)" : "radial-gradient(circle at 80% 0%, rgba(139,196,235,.25), transparent 32rem)" }}>
      <Box component="header" sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper", position: "sticky", top: 0, zIndex: 2 }}>
        <Container maxWidth="xl"><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", minHeight: 72 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}><Avatar sx={{ bgcolor: "#ffb74d", color: "#251706", width: 38, height: 38 }}><CloudQueueRoundedIcon /></Avatar><Box><Typography sx={{ fontWeight: 800, lineHeight: 1 }}>cloudline</Typography><Typography color="text.secondary" sx={{ fontSize: 10, mt: .5, letterSpacing: ".12em", textTransform: "uppercase" }}>AWS operations hub</Typography></Box></Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Select size="small" value={region} onChange={(event) => setRegion(event.target.value)} IconComponent={KeyboardArrowDownRoundedIcon} sx={{ color: "text.secondary", fontSize: 12, ".MuiOutlinedInput-notchedOutline": { borderColor: "divider" }, display: { xs: "none", sm: "flex" } }}><MenuItem value="us-east-1">us-east-1</MenuItem><MenuItem value="ap-southeast-1">ap-southeast-1</MenuItem><MenuItem value="eu-west-1">eu-west-1</MenuItem></Select><ThemeToggle compact mode={mode} onToggle={toggleMode} /><IconButton onClick={() => setNotice("No new incidents. Your environment is healthy.")} sx={{ color: "text.secondary" }} aria-label="Notifications"><NotificationsNoneRoundedIcon /></IconButton><Avatar sx={{ bgcolor: "#294361", fontSize: 13, width: 34, height: 34 }}>NP</Avatar></Stack>
        </Stack></Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ justifyContent: "space-between", mb: 5 }}>
          <Box><Stack alignItems="center" direction="row" spacing={1} sx={{ mb: 1.5 }}><Chip label="●  All systems operational" size="small" sx={{ bgcolor: "rgba(110,214,189,.12)", color: "#6ed6bd", fontWeight: 700 }} /><Typography color="text.secondary" sx={{ fontSize: 12 }}>Updated just now</Typography></Stack><Typography component="h1" sx={{ fontSize: { xs: 34, md: 48 }, fontWeight: 800, letterSpacing: "-.055em", lineHeight: 1.08 }}>Good morning, Noy.</Typography><Typography color="text.secondary" sx={{ mt: 1, maxWidth: 540 }}>A calm view of your production environment in <Box component="span" sx={{ color: "#ffcf82", fontWeight: 700 }}>{region}</Box>. Everything important, in one place.</Typography></Box>
          <Button onClick={startDeployment} variant="contained" startIcon={<RocketLaunchRoundedIcon />} sx={{ bgcolor: "#ffb74d", color: "#251706", alignSelf: { xs: "flex-start", md: "center" }, px: 2.5, "&:hover": { bgcolor: "#ffc875" } }}>New deployment</Button>
        </Stack>

        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, mb: 3 }}><Metric label="MONTHLY SPEND" value="$42.86" change="↓ 8.4%" accent="#6ed6bd" /><Metric label="API REQUESTS" value="12.4k" change="↑ 14.2%" accent="#9cdbff" /><Metric label="AVG. LATENCY" value="184ms" change="↓ 12ms" accent="#6ed6bd" /><Metric label="ERROR RATE" value="0.08%" change="↓ 0.02%" accent="#6ed6bd" /></Box>

        <Stack role="tablist" direction="row" spacing={3} sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>{tabs.map((tab) => <Button aria-selected={activeTab === tab} key={tab} onClick={() => setActiveTab(tab)} role="tab" sx={{ color: activeTab === tab ? "#ffcf82" : "text.secondary", borderRadius: 0, borderBottom: activeTab === tab ? 2 : 0, borderColor: "#ffb74d", pb: 1.5 }}>{tab}</Button>)}</Stack>

        <Box aria-label="Overview panel" role="tabpanel" sx={{ display: activeTab === "Overview" ? "grid" : "none", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.4fr .8fr" } }}>
          <Card sx={{ bgcolor: "#0d1b2d", border: "1px solid rgba(139,160,184,.16)", boxShadow: "none" }}><Box sx={{ p: 2.5 }}><Stack alignItems="center" direction="row" justifyContent="space-between"><Box><Typography sx={{ fontWeight: 700 }}>Request volume</Typography><Typography color="text.secondary" sx={{ fontSize: 12, mt: .5 }}>Last 24 hours · all services</Typography></Box><InsightsRoundedIcon sx={{ color: "#9cdbff" }} /></Stack><Box sx={{ alignItems: "end", display: "flex", gap: .7, height: 190, mt: 3, px: 1 }}>{[30, 45, 38, 62, 50, 72, 80, 62, 92, 68, 76, 100, 82, 96, 110, 90, 122, 105, 132, 115, 145, 128, 138, 155].map((height, index) => <Box key={index} sx={{ bgcolor: index > 17 ? "#ffb74d" : "#3988b9", borderRadius: "5px 5px 2px 2px", flex: 1, height: `${height}px`, opacity: index > 17 ? .95 : .72 }} />)}</Box><Stack direction="row" justifyContent="space-between" sx={{ color: "text.secondary", fontSize: 11, mt: 1 }}><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>Now</span></Stack></Box></Card>
          <Card sx={{ bgcolor: "#0d1b2d", border: "1px solid rgba(139,160,184,.16)", boxShadow: "none" }}><Box sx={{ p: 2.5 }}><Stack alignItems="center" direction="row" justifyContent="space-between"><Typography sx={{ fontWeight: 700 }}>Service health</Typography><Button size="small" endIcon={<ArrowOutwardRoundedIcon sx={{ fontSize: 15 }} />} sx={{ color: "#9cdbff" }}>Details</Button></Stack><Stack spacing={2} sx={{ mt: 2.5 }}>{services.map((service) => <Stack alignItems="center" direction="row" key={service.name} spacing={1.5}><Avatar sx={{ bgcolor: `${service.color}18`, color: service.color, width: 36, height: 36 }}>{service.icon}</Avatar><Box sx={{ flexGrow: 1 }}><Typography sx={{ fontSize: 13, fontWeight: 700 }}>{service.name}</Typography><Typography color="text.secondary" sx={{ fontSize: 11 }}>{service.detail}</Typography></Box><Chip label={service.status} size="small" sx={{ bgcolor: "rgba(110,214,189,.1)", color: "#6ed6bd", fontSize: 10, fontWeight: 700 }} /></Stack>)}</Stack></Box></Card>
          <Card sx={{ bgcolor: "#0d1b2d", border: "1px solid rgba(139,160,184,.16)", boxShadow: "none" }}><Box sx={{ p: 2.5 }}><Typography sx={{ fontWeight: 700 }}>Infrastructure capacity</Typography><Typography color="text.secondary" sx={{ fontSize: 12, mt: .5 }}>Current usage across your stack</Typography><Stack spacing={2.5} sx={{ mt: 3 }}>{[["Lambda concurrency", "24%", 24, "#ffb74d"], ["DynamoDB capacity", "41%", 41, "#b8a1ff"], ["S3 storage", "68%", 68, "#6ed6bd"]].map(([label, value, progress, color]) => <Box key={label as string}><Stack direction="row" justifyContent="space-between" sx={{ mb: .8 }}><Typography sx={{ fontSize: 12 }}>{label}</Typography><Typography color="text.secondary" sx={{ fontSize: 12 }}>{value}</Typography></Stack><LinearProgress variant="determinate" value={progress as number} sx={{ height: 7, borderRadius: 5, bgcolor: "#162b43", "& .MuiLinearProgress-bar": { bgcolor: color as string, borderRadius: 5 } }} /></Box>)}</Stack></Box></Card>
          <Card sx={{ bgcolor: "#0d1b2d", border: "1px solid rgba(139,160,184,.16)", boxShadow: "none" }}><Box sx={{ p: 2.5 }}><Typography sx={{ fontWeight: 700 }}>Recent activity</Typography><Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>{["Production API deployed", "Daily backup completed", "Auth policy updated"].map((item, index) => <Stack direction="row" justifyContent="space-between" key={item} sx={{ py: 1.5 }}><Typography sx={{ fontSize: 12 }}>{item}</Typography><Typography color="text.secondary" sx={{ fontSize: 11 }}>{index + 2}h ago</Typography></Stack>)}</Stack></Box></Card>
        </Box>
        {activeTab === "Services" && <Card aria-label="Services panel" role="tabpanel" sx={{ bgcolor: "#0d1b2d", border: "1px solid rgba(139,160,184,.16)", boxShadow: "none", p: { xs: 2, md: 3 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mb: 2 }}><Box><Typography variant="h3" sx={{ fontSize: 22 }}>AWS service catalog</Typography><Typography color="text.secondary" sx={{ mt: .5 }}>Select a service to inspect its current workload.</Typography></Box><Chip icon={<CheckCircleRoundedIcon />} label="4 healthy services" sx={{ color: "#6ed6bd", bgcolor: "rgba(110,214,189,.1)", mt: { xs: 1.5, sm: 0 } }} /></Stack>
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" } }}>{services.map((service) => <Button key={service.name} onClick={() => setSelectedService(service.name)} sx={{ alignItems: "center", bgcolor: selectedService === service.name ? "rgba(156,219,255,.12)" : "rgba(139,160,184,.06)", border: 1, borderColor: selectedService === service.name ? service.color : "divider", color: "text.primary", display: "flex", justifyContent: "flex-start", p: 2, textAlign: "left" }}><Avatar sx={{ bgcolor: `${service.color}18`, color: service.color, mr: 1.5 }}>{service.icon}</Avatar><Box sx={{ flexGrow: 1 }}><Typography sx={{ fontWeight: 700 }}>{service.name}</Typography><Typography color="text.secondary" sx={{ fontSize: 12 }}>{service.detail}</Typography></Box><Chip label={service.status} size="small" sx={{ bgcolor: "rgba(110,214,189,.1)", color: "#6ed6bd", fontSize: 10 }} /></Button>)}</Box>
        </Card>}
        {activeTab === "Activity" && <Card aria-label="Activity panel" role="tabpanel" sx={{ bgcolor: "#0d1b2d", border: "1px solid rgba(139,160,184,.16)", boxShadow: "none", p: { xs: 2, md: 3 } }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}><Box><Typography variant="h3" sx={{ fontSize: 22 }}>Activity timeline</Typography><Typography color="text.secondary" sx={{ mt: .5 }}>A running log of actions in {region}.</Typography></Box><Chip label={`${activity.length} events`} size="small" sx={{ color: "#9cdbff", bgcolor: "rgba(156,219,255,.1)" }} /></Stack>
          <Stack divider={<Divider flexItem />} sx={{ mt: 1 }}>{activity.map((item) => <Stack direction="row" key={`${item.title}-${item.time}`} spacing={1.5} sx={{ alignItems: "center", py: 2 }}><Avatar sx={{ bgcolor: item.tone === "success" ? "rgba(110,214,189,.12)" : "rgba(156,219,255,.12)", color: item.tone === "success" ? "#6ed6bd" : "#9cdbff", width: 36, height: 36 }}><CheckCircleRoundedIcon fontSize="small" /></Avatar><Box sx={{ flexGrow: 1 }}><Typography sx={{ fontWeight: 700 }}>{item.title}</Typography><Typography color="text.secondary" sx={{ fontSize: 12 }}>{item.detail}</Typography></Box><Typography color="text.secondary" sx={{ fontSize: 12 }}>{item.time}</Typography></Stack>)}</Stack>
        </Card>}
        <Dialog open={deploymentOpen} onClose={() => setDeploymentOpen(false)} fullWidth maxWidth="xs"><DialogTitle>Deploy production API?</DialogTitle><DialogContent><Typography color="text.secondary">This demo will create a deployment event for version 2.4.2 in {region}. No real AWS resources will be changed.</Typography></DialogContent><DialogActions><Button onClick={() => setDeploymentOpen(false)}>Cancel</Button><Button onClick={confirmDeployment} variant="contained" startIcon={<RocketLaunchRoundedIcon />}>Start deployment</Button></DialogActions></Dialog>
        <Dialog open={Boolean(selectedService)} onClose={() => setSelectedService(null)} fullWidth maxWidth="xs"><DialogTitle>{selectedService} details</DialogTitle><DialogContent><Typography color="text.secondary">This service is operating normally in {region}. The next step would be connecting this panel to CloudWatch and the AWS SDK.</Typography></DialogContent><DialogActions><Button onClick={() => setSelectedService(null)} startIcon={<CloseRoundedIcon />}>Close</Button></DialogActions></Dialog>
        <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice(null)} message={notice ?? ""} />
      </Container>
      <FloatingHomeButton />
    </Box>
  </ThemeProvider>;
}
