"use client";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  storefrontThemes,
  useStorefrontTheme,
  type StorefrontThemeName,
} from "./twcEcommerceTheme";
import ThemeToggle from "../../components/solar/ThemeToggle";

export default function TwcEshopNavbar({
  count,
  mode,
  onCart,
  onToggleMode,
}: {
  count: number;
  mode: "light" | "dark";
  onCart: () => void;
  onToggleMode: () => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { themeName, themeConfig, setThemeName } = useStorefrontTheme();
  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };
  const goToSection = (
    section:
      | "collections"
      | "journal"
      | "about"
      | "story"
      | "benefits"
      | "faq"
      | "bestsellers",
  ) => {
    setMenuOpen(false);
    if (window.location.pathname === "/twc-ecommerce") {
      document
        .getElementById(section)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }
    router.push(`/twc-ecommerce?section=${section}`);
  };
  const submitSearch = () => {
    const value = query.trim();
    router.push(
      value
        ? `/twc-ecommerce/shop?search=${encodeURIComponent(value)}`
        : "/twc-ecommerce/shop",
    );
  };

  const headerProps = {
    count,
    mode,
    onCart,
    onToggleMode,
    themeName,
    setThemeName,
    menuOpen,
    setMenuOpen,
    query,
    setQuery,
    submitSearch,
    go,
    goToSection,
  };
  if (themeConfig.headerVariant === "editorial")
    return <EditorialNavbar {...headerProps} />;
  if (themeConfig.headerVariant === "marketplace")
    return <MarketplaceNavbar {...headerProps} />;
  if (themeConfig.headerVariant === "corporate")
    return <CorporateNavbar {...headerProps} />;
  if (themeConfig.headerVariant === "wellness")
    return <WellnessNavbar {...headerProps} />;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container
          maxWidth="xl"
          disableGutters
          sx={{ px: { xs: 2, sm: 3, md: 4 } }}
        >
          <Toolbar disableGutters sx={{ gap: { xs: 1, md: 2 }, minHeight: 76 }}>
            <IconButton
              onClick={() => setMenuOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                color: "inherit",
              }}
              aria-label="Open menu"
            >
              <MenuRoundedIcon />
            </IconButton>
            <Button
              onClick={() => go("/twc-ecommerce")}
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{
                color: "text.primary",
                fontSize: { xs: 16, sm: 19 },
                fontWeight: 800,
                letterSpacing: "-.04em",
                p: 0,
                minWidth: "auto",
                whiteSpace: "nowrap",
              }}
            >
              TWC{" "}
              <Box component="span" sx={{ color: "primary.main", ml: 0.5 }}>
                ONLINE
              </Box>
            </Button>
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", lg: "flex" }, ml: 2 }}
            >
              <Button
                onClick={() => go("/twc-ecommerce")}
                sx={{ color: "text.primary" }}
              >
                Home
              </Button>
              <Button
                onClick={() => go("/twc-ecommerce/shop")}
                sx={{ color: "text.primary" }}
              >
                Shop
              </Button>
            </Stack>
            <TextField
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitSearch();
              }}
              placeholder="Search products"
              size="small"
              sx={{
                display: { xs: "none", md: "flex" },
                flex: 1,
                maxWidth: 360,
                ml: { md: 2 },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <FormControl
              size="small"
              sx={{ display: { xs: "none", lg: "flex" }, minWidth: 150 }}
            >
              <Select
                aria-label="Choose storefront theme"
                value={themeName}
                onChange={(event) =>
                  setThemeName(event.target.value as StorefrontThemeName)
                }
              >
                {Object.entries(storefrontThemes).map(([value, config]) => (
                  <MenuItem key={value} value={value}>
                    {config.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ThemeToggle compact mode={mode} onToggle={onToggleMode} />
            <IconButton
              onClick={onCart}
              aria-label="Open basket"
              sx={{ color: "text.primary" }}
            >
              <Badge badgeContent={count} color="primary">
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="left" onClose={() => setMenuOpen(false)} open={menuOpen}>
        <Box sx={{ p: 2, width: 300 }}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography sx={{ fontWeight: 800 }}>TWC ONLINE</Typography>
            <IconButton
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Stack spacing={1.25} sx={{ mt: 3 }}>
            <TextField
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setMenuOpen(false);
                  submitSearch();
                }
              }}
              label="Search products"
              size="small"
            />
            <Button
              onClick={() => go("/twc-ecommerce")}
              sx={{ justifyContent: "flex-start" }}
            >
              Home
            </Button>
            <Button
              onClick={() => go("/twc-ecommerce/shop")}
              sx={{ justifyContent: "flex-start" }}
            >
              Shop
            </Button>
            <FormControl size="small">
              <Select
                aria-label="Choose storefront theme"
                value={themeName}
                onChange={(event) =>
                  setThemeName(event.target.value as StorefrontThemeName)
                }
              >
                {Object.entries(storefrontThemes).map(([value, config]) => (
                  <MenuItem key={value} value={value}>
                    {config.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={() => {
                setMenuOpen(false);
                onCart();
              }}
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{ justifyContent: "flex-start" }}
            >
              Basket ({count})
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

type NavbarProps = {
  count: number;
  mode: "light" | "dark";
  onCart: () => void;
  onToggleMode: () => void;
  themeName: StorefrontThemeName;
  setThemeName: (themeName: StorefrontThemeName) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  submitSearch: () => void;
  go: (path: string) => void;
  goToSection: (
    section:
      | "collections"
      | "journal"
      | "about"
      | "story"
      | "benefits"
      | "faq"
      | "bestsellers",
  ) => void;
};

function HeaderLogo({
  onClick,
  centered = false,
  brand,
}: {
  onClick: () => void;
  centered?: boolean;
  brand?: string;
}) {
  if (brand) {
    return (
      <Button
        onClick={onClick}
        sx={{
          color: "primary.main",
          fontSize: centered ? { xs: 18, md: 21 } : { xs: 22, md: 25 },
          minWidth: "auto",
          p: centered ? 0.5 : 0,
          textTransform: "none",
        }}
      >
        <Box
          component="span"
          sx={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {brand}
        </Box>
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      startIcon={centered ? undefined : <ShoppingBagOutlinedIcon />}
      sx={{
        color: "text.primary",
        fontSize: centered ? { xs: 17, md: 19 } : 18,
        fontWeight: centered ? 600 : 900,
        letterSpacing: centered ? ".04em" : "-.04em",
        minWidth: "auto",
        p: centered ? 1 : 0,
        textTransform: "none",
      }}
    >
      {centered ? (
        <Stack spacing={0} sx={{ alignItems: "center", lineHeight: 1 }}>
          <Box
            component="span"
            sx={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: { xs: 22, md: 25 },
              letterSpacing: ".08em",
            }}
          >
            TWC
          </Box>
          <Box
            component="span"
            sx={{
              color: "primary.main",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: ".25em",
              mt: 0.25,
            }}
          >
            ONLINE
          </Box>
        </Stack>
      ) : (
        <>
          TWC{" "}
          <Box component="span" sx={{ color: "primary.main", ml: 0.5 }}>
            ONLINE
          </Box>
        </>
      )}
    </Button>
  );
}

function EditorialNavLink({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disableRipple
      sx={{
        color: "text.secondary",
        fontSize: 11,
        fontWeight: 650,
        letterSpacing: ".035em",
        minHeight: 42,
        minWidth: "auto",
        px: { md: 0.65, lg: 1.1 },
        position: "relative",
        textTransform: "none",
        transition: "color 150ms ease-out",
        whiteSpace: "nowrap",
        "&::after": {
          bgcolor: "primary.main",
          bottom: 5,
          content: '""',
          height: "1px",
          left: "50%",
          position: "absolute",
          transform: "translateX(-50%) scaleX(0)",
          transformOrigin: "center",
          transition: "transform 180ms ease-out",
          width: "calc(100% - 20px)",
        },
        "&:hover": {
          bgcolor: "transparent",
          color: "text.primary",
          "&::after": { transform: "translateX(-50%) scaleX(1)" },
        },
        "&.MuiButton-root:hover": {
          backgroundColor: "transparent",
          color: "text.primary",
        },
        "&:active": { transform: "scale(0.98)" },
        "&:focus-visible": {
          bgcolor: "transparent",
          color: "text.primary",
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&::after": { transition: "none" },
        },
      }}
    >
      {children}
    </Button>
  );
}

function ThemeSelect({
  themeName,
  setThemeName,
}: Pick<NavbarProps, "themeName" | "setThemeName">) {
  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <Select
        aria-label="Choose storefront theme"
        value={themeName}
        onChange={(event) =>
          setThemeName(event.target.value as StorefrontThemeName)
        }
        renderValue={(value) =>
          storefrontThemes[value as StorefrontThemeName].name
        }
      >
        {Object.entries(storefrontThemes).map(([value, config]) => (
          <MenuItem key={value} value={value}>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
                {config.name}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 11 }}>
                {config.description}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function HeaderModeButton({
  mode,
  onToggleMode,
}: Pick<NavbarProps, "mode" | "onToggleMode">) {
  return <ThemeToggle compact mode={mode} onToggle={onToggleMode} />;
}

function MarketplaceNavbar(props: NavbarProps) {
  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar
            disableGutters
            sx={{ gap: { xs: 0.5, md: 2 }, minHeight: 66 }}
          >
            <IconButton
              onClick={() => props.setMenuOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              aria-label="Open menu"
            >
              <MenuRoundedIcon />
            </IconButton>
            <HeaderLogo onClick={() => props.go("/twc-ecommerce")} />
            <TextField
              autoComplete="off"
              fullWidth
              value={props.query}
              onChange={(event) => props.setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") props.submitSearch();
              }}
              placeholder="Search products, categories, and keywords"
              size="small"
              sx={{
                display: { xs: "none", sm: "flex" },
                maxWidth: 620,
                mx: "auto",
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <ThemeSelect {...props} />
            </Box>
            <ThemeModeAndCart {...props} />
          </Toolbar>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              borderTop: 1,
              borderColor: "divider",
              display: { xs: "none", md: "flex" },
              py: 0.75,
            }}
          >
            <Button
              onClick={() => props.go("/twc-ecommerce")}
              sx={{
                color: "text.secondary",
                "&:hover": { bgcolor: "action.hover", color: "text.primary" },
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                },
              }}
            >
              Home
            </Button>
            <Button
              onClick={() => props.go("/twc-ecommerce/shop")}
              sx={{
                color: "text.primary",
                fontWeight: 750,
                "&:hover": { bgcolor: "action.hover", color: "primary.main" },
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                },
              }}
            >
              All products
            </Button>
          </Stack>
        </Container>
      </AppBar>
      <VariantDrawer {...props} />
    </>
  );
}

function EditorialNavbar(props: NavbarProps) {
  const storefrontLabel =
    props.themeName === "premium-beauty"
      ? "Premium Beauty"
      : "Wellness Organic";
  const isBeauty = props.themeName === "premium-beauty";

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container
          maxWidth="xl"
          disableGutters
          sx={{ px: { xs: 1.5, sm: 3, lg: 4 } }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              gap: { xs: 0.5, md: 1.5, xl: 3 },
              justifyContent: "space-between",
              minHeight: { xs: 62, md: 64 },
            }}
          >
            <IconButton
              onClick={() => props.setMenuOpen(true)}
              sx={{
                color: "text.primary",
                display: { xs: "inline-flex", md: "none" },
                minHeight: 44,
                minWidth: 44,
              }}
              aria-label={`Open ${storefrontLabel} menu`}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Box sx={{ display: { xs: "none", md: "block" }, flexShrink: 0 }}>
              <HeaderLogo
                centered
                brand={storefrontLabel}
                onClick={() => props.go("/twc-ecommerce")}
              />
            </Box>
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flex: 1,
                justifyContent: "center",
              }}
            >
              <HeaderLogo
                centered
                brand={storefrontLabel}
                onClick={() => props.go("/twc-ecommerce")}
              />
            </Box>
            <Stack
              component="nav"
              aria-label={`${storefrontLabel} storefront navigation`}
              direction="row"
              spacing={{ md: 0, lg: 0.5 }}
              sx={{
                alignItems: "center",
                display: { xs: "none", md: "flex" },
                flex: 1,
                justifyContent: "center",
                minWidth: 0,
              }}
            >
              <EditorialNavLink onClick={() => props.go("/twc-ecommerce/shop")}>
                {isBeauty ? "Beauty & style" : "Shop"}
              </EditorialNavLink>
              <EditorialNavLink
                onClick={() => props.goToSection("collections")}
              >
                Collections
              </EditorialNavLink>
              <EditorialNavLink onClick={() => props.goToSection("story")}>
                {isBeauty ? "Beauty notes" : "Our story"}
              </EditorialNavLink>
            </Stack>
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                flexShrink: 0,
                ml: { md: "auto", lg: 0 },
              }}
            >
              {props.themeName === "premium-beauty" ? (
                <>
                  <TextField
                    autoComplete="off"
                    value={props.query}
                    onChange={(event) => props.setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") props.submitSearch();
                    }}
                    placeholder="Search beauty & more"
                    size="small"
                    aria-label="Search beauty and style products"
                    sx={{
                      display: { xs: "none", lg: "flex" },
                      mr: 1,
                      width: 190,
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => props.go("/twc-ecommerce/shop")}
                    aria-label="Browse and search products"
                    sx={{
                      color: "text.secondary",
                      display: { xs: "none", md: "inline-flex", lg: "none" },
                    }}
                  >
                    <SearchRoundedIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  onClick={() => props.go("/twc-ecommerce/shop")}
                  aria-label="Search products"
                  sx={{
                    color: "text.secondary",
                    display: { xs: "none", md: "inline-flex" },
                  }}
                >
                  <SearchRoundedIcon />
                </IconButton>
              )}
              <Box sx={{ display: { xs: "none", md: "block" }, mx: 0.5 }}>
                <ThemeSelect {...props} />
              </Box>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <ThemeModeAndCart {...props} />
              </Box>
              <IconButton
                onClick={props.onCart}
                aria-label={`Open basket, ${props.count} items`}
                sx={{
                  color: "text.primary",
                  display: { xs: "inline-flex", md: "none" },
                  minHeight: 44,
                  minWidth: 44,
                }}
              >
                <Badge badgeContent={props.count} color="primary">
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </IconButton>
              <Box sx={{ display: { xs: "block", md: "none" }, ml: 0.25 }}>
                <ThemeToggle
                  compact
                  mode={props.mode}
                  onToggle={props.onToggleMode}
                />
              </Box>
            </Stack>
          </Stack>
        </Container>
      </AppBar>
      <PremiumDrawer {...props} />
    </>
  );
}

function WellnessNavbar(props: NavbarProps) {
  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar
            disableGutters
            sx={{ gap: { xs: 1, md: 2 }, minHeight: { xs: 68, md: 76 } }}
          >
            <IconButton
              onClick={() => props.setMenuOpen(true)}
              sx={{
                display: { xs: "inline-flex", lg: "none" },
                color: "primary.main",
              }}
              aria-label="Open wellness menu"
            >
              <MenuRoundedIcon />
            </IconButton>
            <HeaderLogo onClick={() => props.go("/twc-ecommerce")} />
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", lg: "flex" }, ml: 2 }}
            >
              <Button
                onClick={() => props.go("/twc-ecommerce/shop")}
                sx={{ color: "text.primary" }}
              >
                Shop
              </Button>
              <Button
                onClick={() => props.goToSection("collections")}
                sx={{ color: "text.primary" }}
              >
                Collections
              </Button>
              <Button
                onClick={() => props.goToSection("story")}
                sx={{ color: "text.primary" }}
              >
                Our story
              </Button>
              <Button
                onClick={() => props.goToSection("faq")}
                sx={{ color: "text.primary" }}
              >
                FAQ
              </Button>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <TextField
              autoComplete="off"
              value={props.query}
              onChange={(event) => props.setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") props.submitSearch();
              }}
              placeholder="Search wellness essentials"
              size="small"
              sx={{ display: { xs: "none", md: "flex" }, maxWidth: 300 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <ThemeSelect {...props} />
            </Box>
            <ThemeModeAndCart {...props} />
          </Toolbar>
        </Container>
      </AppBar>
      <WellnessDrawer {...props} />
    </>
  );
}

function WellnessDrawer(props: NavbarProps) {
  const theme = storefrontThemes[props.themeName];
  const dark = props.mode === "dark";
  return (
    <Drawer
      anchor="left"
      onClose={() => props.setMenuOpen(false)}
      open={props.menuOpen}
    >
      <Box
        sx={{
          bgcolor: dark ? theme.darkPaper : theme.lightSurface,
          color: dark ? theme.darkText : "#173b27",
          minHeight: "100%",
          p: { xs: 2.5, sm: 3 },
          width: { xs: 300, sm: 340 },
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <HeaderLogo onClick={() => props.go("/twc-ecommerce")} />
          <IconButton
            onClick={() => props.setMenuOpen(false)}
            aria-label="Close wellness menu"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Box
          sx={{ bgcolor: dark ? theme.darkSurface : "#e4f0e4", mt: 4, p: 2.25 }}
        >
          <Typography
            sx={{
              color: dark ? theme.accent : "#347153",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: ".14em",
            }}
          >
            WELLNESS ORGANIC
          </Typography>
          <Typography
            sx={{ fontSize: 18, fontWeight: 800, lineHeight: 1.25, mt: 0.75 }}
          >
            Good choices for real routines.
          </Typography>
        </Box>
        <Stack spacing={0.75} sx={{ mt: 3 }}>
          <Button
            onClick={() => props.go("/twc-ecommerce")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontWeight: 800,
              px: 1.5,
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => props.go("/twc-ecommerce/shop")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontWeight: 800,
              px: 1.5,
            }}
          >
            Shop all
          </Button>
          <Button
            onClick={() => props.goToSection("collections")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontWeight: 800,
              px: 1.5,
            }}
          >
            Collections
          </Button>
          <Button
            onClick={() => props.goToSection("story")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontWeight: 800,
              px: 1.5,
            }}
          >
            Our story
          </Button>
          <Button
            onClick={() => props.goToSection("benefits")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontWeight: 800,
              px: 1.5,
            }}
          >
            Why shop with us
          </Button>
          <Button
            onClick={() => props.goToSection("faq")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontWeight: 800,
              px: 1.5,
            }}
          >
            FAQ
          </Button>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <TextField
          fullWidth
          label="Search products"
          value={props.query}
          onChange={(event) => props.setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              props.setMenuOpen(false);
              props.submitSearch();
            }
          }}
          size="small"
        />
        <ThemeSelect {...props} />
        <Button
          onClick={() => {
            props.setMenuOpen(false);
            props.onCart();
          }}
          startIcon={<ShoppingBagOutlinedIcon />}
          sx={{
            color: "inherit",
            justifyContent: "flex-start",
            mt: 1.5,
            px: 1.5,
          }}
        >
          Basket ({props.count})
        </Button>
      </Box>
    </Drawer>
  );
}

function PremiumDrawer(props: NavbarProps) {
  const theme = storefrontThemes[props.themeName];
  const dark = props.mode === "dark";
  const isPremiumBeauty = props.themeName === "premium-beauty";
  const storefrontLabel = isPremiumBeauty
    ? "Premium Beauty"
    : "Wellness Organic";

  return (
    <Drawer
      anchor="left"
      onClose={() => props.setMenuOpen(false)}
      open={props.menuOpen}
    >
      <Box
        sx={{
          bgcolor: dark ? theme.darkPaper : theme.lightSurface,
          color: dark ? theme.darkText : theme.primary,
          minHeight: "100%",
          p: 3,
          width: 320,
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <HeaderLogo
            brand={storefrontLabel}
            onClick={() => props.go("/twc-ecommerce")}
          />
          <IconButton
            onClick={() => props.setMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Typography
          sx={{
            color: dark ? theme.accent : theme.primary,
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: ".16em",
            mt: 4,
          }}
        >
          {isPremiumBeauty ? "PREMIUM BEAUTY" : "SANTÉ WELLNESS SHOP"}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 14, lineHeight: 1.6, mt: 1 }}
        >
          {isPremiumBeauty
            ? "Browse beauty, fragrance, accessories, or search the collection."
            : "Good choices for real routines."}
        </Typography>
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Button
            onClick={() => props.go("/twc-ecommerce/shop")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 24,
              fontWeight: 500,
              px: 0,
            }}
          >
            {isPremiumBeauty ? "Shop beauty & style" : "Shop all products"}
          </Button>
          <Button
            onClick={() => props.goToSection("story")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 24,
              fontWeight: 500,
              px: 0,
            }}
          >
            {isPremiumBeauty ? "Beauty notes" : "Our story"}
          </Button>
          <Button
            onClick={() => props.goToSection("collections")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 24,
              fontWeight: 500,
              px: 0,
            }}
          >
            {isPremiumBeauty ? "Featured beauty" : "Product lines"}
          </Button>
          {!isPremiumBeauty && (
            <Button
              onClick={() => props.goToSection("bestsellers")}
              sx={{
                color: "inherit",
                justifyContent: "flex-start",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 24,
                fontWeight: 500,
                px: 0,
              }}
            >
              Shop products
            </Button>
          )}
          {!isPremiumBeauty && (
            <Button
              onClick={() => props.goToSection("bestsellers")}
              sx={{
                color: "inherit",
                justifyContent: "flex-start",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 24,
                fontWeight: 500,
                px: 0,
              }}
            >
              Featured products
            </Button>
          )}
        </Stack>
        <Divider sx={{ my: 3 }} />
        <TextField
          fullWidth
          label={isPremiumBeauty ? "Search beauty & more" : "Search products"}
          value={props.query}
          onChange={(event) => props.setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              props.setMenuOpen(false);
              props.submitSearch();
            }
          }}
          size="small"
          sx={{ mb: 1.5 }}
        />
        <Divider sx={{ my: 2 }} />
        <ThemeSelect {...props} />
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mt: 1 }}
        >
          <Typography color="text.secondary" sx={{ fontSize: 12 }}>
            Appearance
          </Typography>
          <HeaderModeButton
            mode={props.mode}
            onToggleMode={props.onToggleMode}
          />
        </Stack>
        <Button
          onClick={() => {
            props.setMenuOpen(false);
            props.onCart();
          }}
          startIcon={<ShoppingBagOutlinedIcon />}
          sx={{ color: "inherit", justifyContent: "flex-start", mt: 2, px: 0 }}
        >
          Basket ({props.count})
        </Button>
      </Box>
    </Drawer>
  );
}

function CorporateNavbar(props: NavbarProps) {
  return (
    <>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: { xs: "none", md: "block" },
          px: 3,
          py: 0.6,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            sx={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em" }}
          >
            A TWC ONLINE STOREFRONT · PORTFOLIO DEMONSTRATION
          </Typography>
        </Container>
      </Box>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ gap: { xs: 0.5, md: 2 }, minHeight: { xs: 68, md: 76 } }}
          >
            <IconButton
              onClick={() => props.setMenuOpen(true)}
              sx={{ display: { xs: "inline-flex", lg: "none" } }}
              aria-label="Open menu"
            >
              <MenuRoundedIcon />
            </IconButton>
            <HeaderLogo onClick={() => props.go("/twc-ecommerce")} />
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ display: { xs: "none", lg: "flex" }, ml: 1 }}
            >
              <Button
                onClick={() => props.go("/twc-ecommerce/shop")}
                sx={corporateNavButtonSx}
              >
                Products
              </Button>
              <Button
                onClick={() => props.goToSection("collections")}
                sx={corporateNavButtonSx}
              >
                Collections
              </Button>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <TextField
              autoComplete="off"
              value={props.query}
              onChange={(event) => props.setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") props.submitSearch();
              }}
              placeholder="Search the collection"
              size="small"
              sx={{ display: { xs: "none", md: "flex" }, maxWidth: 260 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <ThemeSelect {...props} />
            </Box>
            <ThemeModeAndCart {...props} />
          </Toolbar>
        </Container>
      </AppBar>
      <CorporateDrawer {...props} />
    </>
  );
}

const corporateNavButtonSx = {
  color: "text.primary",
  minHeight: 42,
  px: 1.25,
  position: "relative",
  "&::after": {
    bgcolor: "primary.main",
    bottom: 5,
    content: '""',
    height: "1px",
    left: 10,
    position: "absolute",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform .22s cubic-bezier(.2,.7,.2,1)",
    width: "calc(100% - 20px)",
  },
  "&:hover": { bgcolor: "transparent", color: "text.primary" },
  "&:hover::after, &:focus-visible::after": { transform: "scaleX(1)" },
  "&:focus-visible": {
    outline: "2px solid",
    outlineColor: "primary.main",
    outlineOffset: 2,
  },
};

function CorporateDrawer(props: NavbarProps) {
  const theme = storefrontThemes[props.themeName];
  const dark = props.mode === "dark";
  return (
    <Drawer
      anchor="left"
      onClose={() => props.setMenuOpen(false)}
      open={props.menuOpen}
    >
      <Box
        sx={{
          bgcolor: dark ? theme.darkPaper : theme.lightSurface,
          color: dark ? theme.darkText : "#173044",
          minHeight: "100%",
          p: { xs: 2.5, sm: 3 },
          width: { xs: 300, sm: 350 },
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <HeaderLogo onClick={() => props.go("/twc-ecommerce")} />
          <IconButton
            onClick={() => props.setMenuOpen(false)}
            aria-label="Close corporate menu"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Box
          sx={{
            bgcolor: dark ? theme.darkSurface : "#173044",
            color: "#fff",
            mt: 4,
            p: 2.5,
          }}
        >
          <Typography
            sx={{
              color: dark ? theme.accent : "#b9cddd",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: ".14em",
            }}
          >
            CORPORATE COMMERCE
          </Typography>
          <Typography
            sx={{ fontSize: 20, fontWeight: 900, lineHeight: 1.2, mt: 0.75 }}
          >
            Clear paths to useful products.
          </Typography>
        </Box>
        <Stack spacing={0.75} sx={{ mt: 3 }}>
          <Button
            onClick={() => props.go("/twc-ecommerce")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontWeight: 800,
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => props.go("/twc-ecommerce/shop")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontWeight: 800,
            }}
          >
            Products
          </Button>
          <Button
            onClick={() => props.goToSection("collections")}
            sx={{
              color: "inherit",
              justifyContent: "flex-start",
              fontWeight: 800,
            }}
          >
            Collections
          </Button>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <TextField
          fullWidth
          label="Search products"
          value={props.query}
          onChange={(event) => props.setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              props.setMenuOpen(false);
              props.submitSearch();
            }
          }}
          size="small"
        />
        <ThemeSelect {...props} />
        <Button
          onClick={() => {
            props.setMenuOpen(false);
            props.onCart();
          }}
          startIcon={<ShoppingBagOutlinedIcon />}
          sx={{ color: "inherit", justifyContent: "flex-start", mt: 1.5 }}
        >
          Basket ({props.count})
        </Button>
      </Box>
    </Drawer>
  );
}

function ThemeModeAndCart(
  props: Pick<NavbarProps, "mode" | "onToggleMode" | "onCart" | "count">,
) {
  return (
    <Stack direction="row" sx={{ alignItems: "center" }}>
      <HeaderModeButton mode={props.mode} onToggleMode={props.onToggleMode} />
      <IconButton onClick={props.onCart} aria-label="Open basket">
        <Badge badgeContent={props.count} color="primary">
          <ShoppingBagOutlinedIcon />
        </Badge>
      </IconButton>
    </Stack>
  );
}

function VariantDrawer(props: NavbarProps) {
  const isMarketplace =
    storefrontThemes[props.themeName].headerVariant === "marketplace";
  return (
    <Drawer
      anchor="left"
      onClose={() => props.setMenuOpen(false)}
      open={props.menuOpen}
    >
      <Box
        sx={{
          bgcolor: isMarketplace ? "background.paper" : undefined,
          color: "text.primary",
          minHeight: "100%",
          p: 2,
          width: 300,
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <HeaderLogo onClick={() => props.go("/twc-ecommerce")} />
          <IconButton
            onClick={() => props.setMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Stack spacing={1.25} sx={{ mt: 3 }}>
          <TextField
            label="Search products"
            value={props.query}
            onChange={(event) => props.setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                props.setMenuOpen(false);
                props.submitSearch();
              }
            }}
            size="small"
          />
          <Button
            onClick={() => props.go("/twc-ecommerce")}
            sx={{ justifyContent: "flex-start" }}
          >
            Home
          </Button>
          <Button
            onClick={() => props.go("/twc-ecommerce/shop")}
            sx={{
              color: "text.primary",
              justifyContent: "flex-start",
              "&:hover": { bgcolor: "action.hover", color: "primary.main" },
              "&:focus-visible": {
                outline: "2px solid",
                outlineColor: "primary.main",
              },
            }}
          >
            All products
          </Button>
          <ThemeSelect {...props} />
          <Button
            onClick={() => {
              props.setMenuOpen(false);
              props.onCart();
            }}
            startIcon={<ShoppingBagOutlinedIcon />}
            sx={{ justifyContent: "flex-start" }}
          >
            Basket ({props.count})
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
