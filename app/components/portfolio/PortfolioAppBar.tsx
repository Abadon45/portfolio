import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "../../data/portfolio";
import ThemeToggle from "../solar/ThemeToggle";

type PortfolioAppBarProps = {
  initialUser?: PortfolioNavUser | null;
  isDark: boolean;
  onScrollToSection?: (sectionId: string) => void;
  onScrollToTop?: () => void;
  onToggleMode: () => void;
};

type PortfolioNavUser = {
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  role: string;
};

function visibleUserName(user: PortfolioNavUser) {
  const personalName = [user.firstName, user.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .trim();
  const fallbackName = (user.fullName || user.displayName)
    .replace(/\s*[([].*?[)\]]\s*$/, "")
    .trim();

  return personalName || fallbackName || "Account";
}

function userInitials(user: PortfolioNavUser) {
  return visibleUserName(user)
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PortfolioAppBar({
  initialUser = null,
  isDark,
  onToggleMode,
  onScrollToSection,
  onScrollToTop,
}: PortfolioAppBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >(
    initialUser === undefined
      ? "loading"
      : initialUser
        ? "authenticated"
        : "unauthenticated",
  );
  const [user, setUser] = useState<PortfolioNavUser | null>(initialUser);
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) return null;
        if (!response.ok) return undefined;
        const data = (await response.json()) as { user?: PortfolioNavUser };
        return data.user ?? null;
      })
      .then((nextUser) => {
        if (!active) return;
        if (nextUser === undefined) {
          if (initialUser === undefined) setAuthState("unauthenticated");
          return;
        }
        setUser(nextUser);
        setAuthState(nextUser ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (active && initialUser === undefined)
          setAuthState("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    setUserMenuAnchor(null);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    setAuthState("unauthenticated");
    router.refresh();
  }

  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="sticky"
      sx={{
        backdropFilter: "blur(16px)",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            alignItems: "center",
            flexDirection: "row",
            gap: 2,
            justifyContent: "space-between",
            minHeight: { xs: 68, sm: 72 },
            py: { xs: 1, sm: 0 },
          }}
        >
          <MuiLink
            component={NextLink}
            href={isHomepage ? "#top" : "/"}
            onClick={onScrollToTop}
            underline="none"
            aria-label={isHomepage ? "Back to top" : "Home"}
            sx={{
              alignItems: "center",
              bgcolor: "transparent",
              border: 0,
              color: "text.primary",
              cursor: "pointer",
              display: "inline-flex",
              font: "inherit",
              gap: 1.5,
              p: 0,
              textAlign: "left",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                borderRadius: 2,
                color: "primary.contrastText",
                fontSize: "0.78rem",
                fontWeight: 850,
                height: { xs: 36, sm: 40 },
                width: { xs: 36, sm: 40 },
              }}
            >
              EP
            </Avatar>
            <Box>
              <Typography
                component="strong"
                sx={{ display: "block", fontWeight: 850, lineHeight: 1.1 }}
              >
                Noy Pangan
              </Typography>
              <Typography
                color="text.secondary"
                component="small"
                sx={{ display: { xs: "none", sm: "block" }, mt: 0.25 }}
              >
                Full Stack Web Developer
              </Typography>
            </Box>
          </MuiLink>

          <Stack
            component="nav"
            aria-label="Primary navigation"
            direction="row"
            spacing={{ xs: 0, sm: 0.5 }}
            sx={{
              alignItems: "center",
              display: { xs: "none", md: "flex" },
              minHeight: 40,
              flexWrap: "nowrap",
            }}
          >
            {!isHomepage && (
              <Button
                component={NextLink}
                href="/"
                color="inherit"
                size="small"
              >
                Home
              </Button>
            )}
            {navItems.map((item) => (
              <Button
                color="inherit"
                key={item.href}
                scroll={item.href !== "#work" && item.href !== "#about"}
                component={NextLink}
                href={
                  item.href === "#work"
                    ? isHomepage
                      ? "#work"
                      : onScrollToSection
                        ? "/#work"
                        : "/work"
                    : item.href === "#about"
                      ? "/about"
                      : isHomepage
                        ? item.href
                        : `/${item.href}`
                }
                onClick={
                  onScrollToSection
                    ? () => onScrollToSection(item.href.slice(1))
                    : undefined
                }
                size="small"
                sx={{
                  color: "text.secondary",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  transition: "color 150ms ease, text-decoration-color 150ms ease",
                  "&:hover": {
                    color: "text.primary",
                    textDecorationLine: "underline",
                    textDecorationColor: "primary.main",
                    textUnderlineOffset: 6,
                  },
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 2,
                  },
                }}
              >
                {item.href === "#about" ? "Experience" : item.label}
              </Button>
            ))}
            <ThemeToggle
              compact
              mode={isDark ? "dark" : "light"}
              onToggle={onToggleMode}
            />
            {authState === "loading" ? (
              <AccountActionSkeleton />
            ) : user ? (
              <>
                <Button
                  aria-controls={
                    userMenuAnchor ? "portfolio-user-menu" : undefined
                  }
                  aria-expanded={userMenuAnchor ? "true" : undefined}
                  aria-haspopup="menu"
                  onClick={(event) => setUserMenuAnchor(event.currentTarget)}
                  size="small"
                  sx={{
                    alignItems: "center",
                    color: "text.primary",
                    flexShrink: 0,
                    gap: 0.75,
                    justifyContent: "flex-start",
                    lineHeight: 1.2,
                    minHeight: 28,
                    minWidth: 0,
                    px: { xs: 0.25, sm: 0.75 },
                    py: 0.25,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Avatar
                    src={user.avatarUrl ?? undefined}
                    sx={{ bgcolor: "primary.main", height: 28, width: 28 }}
                  >
                    {userInitials(user)}
                  </Avatar>
                  <Box
                    sx={{
                      display: { xs: "none", sm: "block" },
                      maxWidth: { sm: 150, md: 190 },
                      minWidth: 0,
                      textAlign: "left",
                    }}
                  >
                    <Typography noWrap sx={{ fontSize: 12, fontWeight: 800 }}>
                      {visibleUserName(user)}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      noWrap
                      sx={{ fontSize: 10, textAlign: "left" }}
                    >
                      {user.role}
                    </Typography>
                  </Box>
                </Button>
                <Menu
                  anchorEl={userMenuAnchor}
                  id="portfolio-user-menu"
                  onClose={() => setUserMenuAnchor(null)}
                  open={Boolean(userMenuAnchor)}
                  slotProps={{
                    list: { sx: { p: 0 } },
                    paper: {
                      sx: {
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        maxWidth: "calc(100vw - 24px)",
                        overflow: "hidden",
                        width: { xs: 286, sm: 320 },
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      p: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "center" }}
                    >
                      <Avatar
                        src={user.avatarUrl ?? undefined}
                        sx={{
                          bgcolor: "primary.contrastText",
                          color: "primary.main",
                          height: 52,
                          width: 52,
                        }}
                      >
                        {userInitials(user)}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{ fontWeight: 800 }}>
                          {visibleUserName(user)}
                        </Typography>
                        <Typography noWrap sx={{ fontSize: 12, opacity: 0.82 }}>
                          {user.email}
                        </Typography>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            borderColor: "currentColor",
                            color: "inherit",
                            fontSize: 10,
                            height: 22,
                            mt: 0.75,
                          }}
                          variant="outlined"
                        />
                      </Box>
                    </Stack>
                    <Button
                      fullWidth
                      onClick={() => {
                        setUserMenuAnchor(null);
                        router.push("/profile");
                      }}
                      size="small"
                      sx={{
                        bgcolor: "primary.contrastText",
                        color: "primary.main",
                        mt: 2,
                        textTransform: "none",
                        "&:hover": { bgcolor: "primary.contrastText" },
                      }}
                      variant="contained"
                    >
                      View profile
                    </Button>
                  </Box>
                  <Box sx={{ p: 1 }}>
                    <MenuItem
                      onClick={() => {
                        setUserMenuAnchor(null);
                        router.push("/profile");
                      }}
                    >
                      <ListItemIcon>
                        <PersonRoundedIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setUserMenuAnchor(null);
                        router.push("/saas-platform");
                      }}
                    >
                      <ListItemIcon>
                        <SpaceDashboardRoundedIcon fontSize="small" />
                      </ListItemIcon>
                      SaaS workspace
                    </MenuItem>
                    {user.role.toLowerCase() === "admin" && (
                      <MenuItem
                        onClick={() => {
                          setUserMenuAnchor(null);
                          router.push("/dashboard");
                        }}
                      >
                        <ListItemIcon>
                          <SpaceDashboardRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        Admin dashboard
                      </MenuItem>
                    )}
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{ color: "error.main", m: 1 }}
                  >
                    <ListItemIcon>
                      <LogoutRoundedIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={NextLink}
                href="/login?callbackUrl=/"
                size="small"
                sx={{
                  border: 1,
                  borderColor: "primary.main",
                  color: "primary.main",
                  flexShrink: 0,
                  lineHeight: 1.2,
                  ml: { sm: 0.5 },
                  minHeight: 28,
                  py: 0.25,
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: "primary.dark",
                    color: "primary.dark",
                  },
                }}
              >
                Account
              </Button>
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center", display: { xs: "flex", md: "none" } }}
          >
            <ThemeToggle
              compact
              mode={isDark ? "dark" : "light"}
              onToggle={onToggleMode}
            />
            <IconButton
              aria-label={`${mobileMenuOpen ? "Close" : "Open"} navigation menu`}
              aria-controls="portfolio-mobile-navigation"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              sx={{
                color: "text.primary",
                minHeight: 44,
                minWidth: 44,
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
      <Drawer
        anchor="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        transitionDuration={prefersReducedMotion ? 0 : undefined}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              color: "text.primary",
              maxWidth: "calc(100vw - 32px)",
              width: 320,
            },
          },
        }}
      >
        <Box
          component="nav"
          aria-label="Mobile navigation"
          id="portfolio-mobile-navigation"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 2,
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography component="h2" sx={{ fontSize: 18, fontWeight: 750 }}>
              Menu
            </Typography>
            <IconButton
              aria-label="Close navigation menu"
              autoFocus
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: "text.primary" }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <List disablePadding>
            {!isHomepage && (
              <ListItemButton
                component={NextLink}
                href="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary="Home" />
              </ListItemButton>
            )}
            {navItems.map((item) => {
              const href =
                item.href === "#work"
                  ? isHomepage
                    ? "#work"
                    : onScrollToSection
                      ? "/#work"
                      : "/work"
                  : item.href === "#about"
                    ? "/about"
                    : isHomepage
                      ? item.href
                      : `/${item.href}`;

              return (
                <ListItemButton
                  component={NextLink}
                  href={href}
                  key={item.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isHomepage) {
                      onScrollToSection?.(item.href.slice(1));
                    }
                  }}
                  sx={{
                    minHeight: 48,
                    "&.Mui-focusVisible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: -2,
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: -2,
                    },
                  }}
                >
                  <ListItemText
                    primary={item.href === "#about" ? "Experience" : item.label}
                  />
                </ListItemButton>
              );
            })}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ my: 1.5 }} />
          {authState === "loading" ? (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              Loading account…
            </Typography>
          ) : user ? (
            <>
              <ListItemButton
                component={NextLink}
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemIcon>
                  <PersonRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={visibleUserName(user)}
                  secondary="Profile"
                />
              </ListItemButton>
              <ListItemButton
                component={NextLink}
                href="/saas-platform"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemIcon>
                  <SpaceDashboardRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="SaaS workspace" />
              </ListItemButton>
              {user.role.toLowerCase() === "admin" && (
                <ListItemButton
                  component={NextLink}
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>
                    <SpaceDashboardRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Admin dashboard" />
                </ListItemButton>
              )}
              <ListItemButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  void handleLogout();
                }}
                sx={{ color: "error.main" }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <LogoutRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </>
          ) : (
            <Button
              component={NextLink}
              href="/login?callbackUrl=/"
              onClick={() => setMobileMenuOpen(false)}
              variant="outlined"
            >
              Account
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}

function AccountActionSkeleton() {
  return (
    <Stack
      aria-label="Loading account"
      direction="row"
      spacing={0.75}
      sx={{ alignItems: "center", flexShrink: 0, px: 0.75 }}
    >
      <Skeleton
        animation="wave"
        variant="circular"
        sx={{ height: 28, width: 28 }}
      />
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          width: { sm: 96, md: 132 },
        }}
      >
        <Skeleton animation="wave" height={14} width="82%" />
        <Skeleton animation="wave" height={11} width="48%" />
      </Box>
    </Stack>
  );
}
