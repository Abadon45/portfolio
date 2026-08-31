"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  type PaletteMode,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import type { PortfolioUser } from "../../../lib/portfolioAuth";
import { createPortfolioTheme } from "../../theme/portfolioTheme";
import TwcAlertProvider from "../../components/portfolio/TwcAlertSystem";
import ThemeToggle from "../../components/solar/ThemeToggle";

const drawerWidth = 248;

const navigation = [
  { label: "Overview", href: "/dashboard", icon: <DashboardRoundedIcon /> },
  {
    label: "Teacher's Lounge",
    href: "/dashboard/teachers-lounge",
    icon: <SchoolRoundedIcon />,
  },
  {
    label: "SNED Learning",
    href: "/dashboard/teachers-lounge/sned",
    icon: <MenuBookRoundedIcon />,
  },
  { label: "Users", href: "/dashboard/users", icon: <GroupRoundedIcon /> },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: <Inventory2RoundedIcon />,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: <AssessmentRoundedIcon />,
    soon: true,
  },
];

const teacherNavigation = [
  { label: "Overview", href: "/dashboard", icon: <DashboardRoundedIcon /> },
  {
    label: "Teacher's Lounge",
    href: "/dashboard/teachers-lounge",
    icon: <SchoolRoundedIcon />,
  },
  {
    label: "Schedule Creator",
    href: "/dashboard/teachers-lounge/schedule",
    icon: <CalendarMonthRoundedIcon />,
  },
  {
    label: "SNED Learning",
    href: "/dashboard/teachers-lounge/sned",
    icon: <MenuBookRoundedIcon />,
  },
];

const regularNavigation = [
  { label: "Overview", href: "/dashboard", icon: <DashboardRoundedIcon /> },
];

type DashboardNavigationItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  soon?: boolean;
};

function initials(user: PortfolioUser) {
  return user.displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SidebarContent({
  user,
  onNavigate,
}: {
  user: PortfolioUser;
  onNavigate: (href: string) => void;
}) {
  const pathname = usePathname();
  const isAdmin = user.role.toLowerCase() === "admin";
  const isTeacher = user.userType === "public_school_teacher";
  const items: DashboardNavigationItem[] = isAdmin
    ? navigation
    : isTeacher
      ? teacherNavigation
      : regularNavigation;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Typography
          sx={{ fontWeight: 900, letterSpacing: "-0.04em" }}
          variant="h6"
        >
          Emmanuel Pangan
        </Typography>
        <Typography color="text.secondary" variant="caption">
          Portfolio administration
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 1.5, py: 2 }}>
        <Typography
          color="text.secondary"
          sx={{ px: 1.5, mb: 1, fontWeight: 800, letterSpacing: "0.08em" }}
          variant="overline"
        >
          Portfolio
        </Typography>
        <List disablePadding>
          {items.map((item) => (
            <ListItemButton
              aria-current={pathname === item.href ? "page" : undefined}
              key={item.href}
              onClick={() => !item.soon && onNavigate(item.href)}
              selected={pathname === item.href}
              sx={{ borderRadius: 1, mb: 0.5, minHeight: 46 }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {item.soon && (
                <Chip label="Soon" size="small" variant="outlined" />
              )}
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ px: 1.5 }}>
        <Typography
          color="text.secondary"
          sx={{ px: 1.5, mb: 1, fontWeight: 800, letterSpacing: "0.08em" }}
          variant="overline"
        >
          Account
        </Typography>
        <List disablePadding>
          <ListItemButton
            onClick={() => onNavigate("/profile")}
            sx={{ borderRadius: 1, minHeight: 46 }}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>
              <PersonOutlineRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton disabled sx={{ borderRadius: 1, minHeight: 46 }}>
            <ListItemIcon sx={{ minWidth: 38 }}>
              <SettingsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" secondary="Coming soon" />
          </ListItemButton>
        </List>
      </Box>
      <Box sx={{ flex: 1 }} />
      <Box sx={{ borderTop: 1, borderColor: "divider", p: 2 }}>
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: "center", minWidth: 0 }}
        >
          <Avatar
            src={user.avatarUrl ?? undefined}
            sx={{ bgcolor: "primary.main", width: 36, height: 36 }}
          >
            {initials(user)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 700 }} variant="body2">
              {user.displayName}
            </Typography>
            <Typography noWrap color="text.secondary" variant="caption">
              {isAdmin
                ? "Administrator"
                : isTeacher
                  ? "Public school teacher"
                  : "Regular user"}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default function DashboardShell({
  user,
  children,
}: {
  user: PortfolioUser;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mode, setMode] = useState<PaletteMode>("dark");
  const theme = useMemo(() => createPortfolioTheme(mode, "modern"), [mode]);
  const pageLabel = pathname.includes("/users")
    ? "Users"
    : pathname.includes("/teachers-lounge/schedule")
      ? "Schedule Creator"
      : pathname.includes("/teachers-lounge/sned")
        ? "SNED Learning"
        : pathname.includes("/teachers-lounge")
          ? "Teacher's Lounge"
          : "Overview";

  useEffect(() => {
    const savedMode = window.localStorage.getItem("portfolio-theme-mode");
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("portfolio-theme-mode", mode);
    document.documentElement.dataset.mode = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  function navigate(href: string) {
    setMobileOpen(false);
    router.push(href);
  }

  async function logOut() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/login");
    router.refresh();
  }

  const sidebar = <SidebarContent onNavigate={navigate} user={user} />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TwcAlertProvider>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <AppBar
            color="inherit"
            elevation={0}
            position="fixed"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              width: { md: `calc(100% - ${drawerWidth}px)` },
              ml: { md: `${drawerWidth}px` },
            }}
          >
            <Toolbar sx={{ gap: 1, minHeight: { xs: 64, sm: 72 } }}>
              <IconButton
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
                sx={{ display: { md: "none" } }}
              >
                <MenuRoundedIcon />
              </IconButton>
              <Breadcrumbs aria-label="Breadcrumb" sx={{ minWidth: 0 }}>
                <Typography color="text.secondary" noWrap variant="body2">
                  Dashboard
                </Typography>
                <Typography
                  color="text.primary"
                  noWrap
                  sx={{ fontWeight: 700 }}
                  variant="body2"
                >
                  {pageLabel}
                </Typography>
              </Breadcrumbs>
              <Box sx={{ flex: 1 }} />
              <ThemeToggle
                compact
                mode={mode}
                onToggle={() =>
                  setMode((current) => (current === "dark" ? "light" : "dark"))
                }
              />
              <Tooltip title="Notifications">
                <IconButton
                  aria-label="Notifications"
                  onClick={(event) =>
                    setNotificationAnchor(event.currentTarget)
                  }
                >
                  <NotificationsNoneRoundedIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={notificationAnchor}
                onClose={() => setNotificationAnchor(null)}
                open={Boolean(notificationAnchor)}
              >
                <Box sx={{ maxWidth: 260, px: 2, py: 1.5 }}>
                  <Typography sx={{ fontWeight: 700 }} variant="body2">
                    Notifications
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    You&apos;re all caught up. New workspace activity will
                    appear here.
                  </Typography>
                </Box>
              </Menu>
              <Tooltip title="Account menu">
                <IconButton
                  aria-label="Open account menu"
                  onClick={(event) => setUserMenuAnchor(event.currentTarget)}
                >
                  <Avatar
                    src={user.avatarUrl ?? undefined}
                    sx={{
                      bgcolor: "primary.main",
                      width: 34,
                      height: 34,
                      fontSize: 14,
                    }}
                  >
                    {initials(user)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={userMenuAnchor}
                onClose={() => setUserMenuAnchor(null)}
                open={Boolean(userMenuAnchor)}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography sx={{ fontWeight: 700 }} variant="body2">
                    {user.displayName}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    setUserMenuAnchor(null);
                    navigate("/profile");
                  }}
                >
                  <PersonOutlineRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
                  Profile
                </MenuItem>
                <MenuItem disabled>
                  <SettingsOutlinedIcon fontSize="small" sx={{ mr: 1.5 }} />
                  Settings
                </MenuItem>
                <MenuItem disabled={loggingOut} onClick={logOut}>
                  <LogoutRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
                  {loggingOut ? "Signing out…" : "Sign out"}
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          >
            <Drawer
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {sidebar}
            </Drawer>
            <Drawer
              open
              variant="permanent"
              sx={{
                display: { xs: "none", md: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                  borderRight: 1,
                  borderColor: "divider",
                },
              }}
            >
              {sidebar}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              pt: { xs: 10, sm: 12 },
              px: { xs: 2, sm: 3, lg: 5 },
              pb: 6,
            }}
          >
            {children}
          </Box>
        </Box>
      </TwcAlertProvider>
    </ThemeProvider>
  );
}
