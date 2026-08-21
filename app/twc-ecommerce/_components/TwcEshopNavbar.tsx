"use client";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AppBar, Badge, Box, Button, Container, Divider, Drawer, FormControl, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { storefrontThemes, useStorefrontTheme, type StorefrontThemeName } from "./twcEcommerceTheme";

export default function TwcEshopNavbar({ count, mode, onCart, onToggleMode }: { count: number; mode: "light" | "dark"; onCart: () => void; onToggleMode: () => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { themeName, themeConfig, setThemeName } = useStorefrontTheme();
  const go = (path: string) => { setMenuOpen(false); router.push(path); };
  const submitSearch = () => {
    const value = query.trim();
    router.push(value ? `/twc-ecommerce/shop?search=${encodeURIComponent(value)}` : "/twc-ecommerce/shop");
  };

  const headerProps = { count, mode, onCart, onToggleMode, themeName, setThemeName, menuOpen, setMenuOpen, query, setQuery, submitSearch, go };
  if (themeConfig.headerVariant === "editorial") return <EditorialNavbar {...headerProps} />;
  if (themeConfig.headerVariant === "marketplace") return <MarketplaceNavbar {...headerProps} />;
  if (themeConfig.headerVariant === "corporate") return <CorporateNavbar {...headerProps} />;

  return <>
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: 1, borderColor: "divider" }}>
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar disableGutters sx={{ gap: { xs: 1, md: 2 }, minHeight: 76 }}>
          <IconButton onClick={() => setMenuOpen(true)} sx={{ display: { xs: "inline-flex", md: "none" }, color: "inherit" }} aria-label="Open menu"><MenuRoundedIcon /></IconButton>
          <Button onClick={() => go("/twc-ecommerce")} startIcon={<ShoppingBagOutlinedIcon />} sx={{ color: "text.primary", fontSize: { xs: 16, sm: 19 }, fontWeight: 800, letterSpacing: "-.04em", p: 0, minWidth: "auto", whiteSpace: "nowrap" }}>TWC <Box component="span" sx={{ color: "primary.main", ml: .5 }}>ONLINE</Box></Button>
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", lg: "flex" }, ml: 2 }}><Button onClick={() => go("/twc-ecommerce")} sx={{ color: "text.primary" }}>Home</Button><Button onClick={() => go("/twc-ecommerce/shop")} sx={{ color: "text.primary" }}>Shop</Button></Stack>
          <TextField value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submitSearch(); }} placeholder="Search products" size="small" sx={{ display: { xs: "none", md: "flex" }, flex: 1, maxWidth: 360, ml: { md: 2 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }} />
          <Box sx={{ flexGrow: 1 }} />
          <FormControl size="small" sx={{ display: { xs: "none", lg: "flex" }, minWidth: 150 }}>
            <Select aria-label="Choose storefront theme" value={themeName} onChange={(event) => setThemeName(event.target.value as StorefrontThemeName)}>
              {Object.entries(storefrontThemes).map(([value, config]) => <MenuItem key={value} value={value}>{config.name}</MenuItem>)}
            </Select>
          </FormControl>
          <IconButton onClick={onToggleMode} aria-label="Toggle light and dark mode" sx={{ color: "text.secondary" }}>{mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}</IconButton>
          <IconButton onClick={onCart} aria-label="Open basket" sx={{ color: "text.primary" }}><Badge badgeContent={count} color="primary"><ShoppingBagOutlinedIcon /></Badge></IconButton>
        </Toolbar>
      </Container>
    </AppBar>
    <Drawer anchor="left" onClose={() => setMenuOpen(false)} open={menuOpen}>
      <Box sx={{ p: 2, width: 300 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}><Typography sx={{ fontWeight: 800 }}>TWC ONLINE</Typography><IconButton onClick={() => setMenuOpen(false)} aria-label="Close menu"><CloseRoundedIcon /></IconButton></Stack>
        <Stack spacing={1.25} sx={{ mt: 3 }}><TextField value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { setMenuOpen(false); submitSearch(); } }} label="Search products" size="small" /><Button onClick={() => go("/twc-ecommerce")} sx={{ justifyContent: "flex-start" }}>Home</Button><Button onClick={() => go("/twc-ecommerce/shop")} sx={{ justifyContent: "flex-start" }}>Shop</Button><FormControl size="small"><Select aria-label="Choose storefront theme" value={themeName} onChange={(event) => setThemeName(event.target.value as StorefrontThemeName)}>{Object.entries(storefrontThemes).map(([value, config]) => <MenuItem key={value} value={value}>{config.name}</MenuItem>)}</Select></FormControl><Button onClick={() => { setMenuOpen(false); onCart(); }} startIcon={<ShoppingBagOutlinedIcon />} sx={{ justifyContent: "flex-start" }}>Basket ({count})</Button></Stack>
      </Box>
    </Drawer>
  </>;
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
};

function HeaderLogo({ onClick, centered = false }: { onClick: () => void; centered?: boolean }) {
  return <Button onClick={onClick} startIcon={<ShoppingBagOutlinedIcon />} sx={{ color: "text.primary", fontSize: centered ? { xs: 18, md: 22 } : 18, fontWeight: 900, letterSpacing: "-.04em", minWidth: "auto", p: 0 }}>TWC <Box component="span" sx={{ color: "primary.main", ml: .5 }}>ONLINE</Box></Button>;
}

function ThemeSelect({ themeName, setThemeName }: Pick<NavbarProps, "themeName" | "setThemeName">) {
  return <FormControl size="small" sx={{ minWidth: 180 }}><Select aria-label="Choose storefront theme" value={themeName} onChange={(event) => setThemeName(event.target.value as StorefrontThemeName)} renderValue={(value) => storefrontThemes[value as StorefrontThemeName].name}>{Object.entries(storefrontThemes).map(([value, config]) => <MenuItem key={value} value={value}><Box><Typography sx={{ fontSize: 13, fontWeight: 800 }}>{config.name}</Typography><Typography color="text.secondary" sx={{ fontSize: 11 }}>{config.description}</Typography></Box></MenuItem>)}</Select></FormControl>;
}

function HeaderModeButton({ mode, onToggleMode }: Pick<NavbarProps, "mode" | "onToggleMode">) {
  return <IconButton onClick={onToggleMode} aria-label="Toggle light and dark mode" sx={{ color: "text.secondary" }}>{mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}</IconButton>;
}

function MarketplaceNavbar(props: NavbarProps) {
  return <><AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: 1, borderColor: "divider" }}><Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 4 } }}><Toolbar disableGutters sx={{ gap: 2, minHeight: 66 }}><IconButton onClick={() => props.setMenuOpen(true)} sx={{ display: { xs: "inline-flex", md: "none" } }} aria-label="Open menu"><MenuRoundedIcon /></IconButton><HeaderLogo onClick={() => props.go("/twc-ecommerce")} /><TextField autoComplete="off" fullWidth value={props.query} onChange={(event) => props.setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") props.submitSearch(); }} placeholder="Search products, categories, and keywords" size="small" sx={{ display: { xs: "none", sm: "flex" }, maxWidth: 620, mx: "auto" }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }} /><Box sx={{ flexGrow: 1 }} /><Box sx={{ display: { xs: "none", lg: "block" } }}><ThemeSelect {...props} /></Box><ThemeModeAndCart {...props} /></Toolbar><Stack direction="row" spacing={1} sx={{ borderTop: 1, borderColor: "divider", display: { xs: "none", md: "flex" }, py: .75 }}><Button onClick={() => props.go("/twc-ecommerce/shop")}>Categories</Button><Button onClick={() => props.go("/twc-ecommerce/shop")}>Deals</Button><Button onClick={() => props.go("/twc-ecommerce/shop")}>New arrivals</Button><Button onClick={() => props.go("/twc-ecommerce/shop")}>Best sellers</Button></Stack></Container></AppBar><VariantDrawer {...props} /></>;
}

function EditorialNavbar(props: NavbarProps) {
  return <><AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: 1, borderColor: "divider" }}><Container maxWidth="lg"><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", minHeight: { xs: 68, md: 82 } }}><IconButton onClick={() => props.setMenuOpen(true)} sx={{ display: { xs: "inline-flex", md: "none" } }} aria-label="Open editorial menu"><MenuRoundedIcon /></IconButton><HeaderLogo centered onClick={() => props.go("/twc-ecommerce")} /><Stack direction="row" spacing={1} sx={{ alignItems: "center", display: { xs: "none", md: "flex" } }}><Button onClick={() => props.go("/twc-ecommerce/shop")} sx={{ color: "text.primary", fontSize: 12 }}>Shop</Button><Button onClick={() => props.go("/twc-ecommerce#collections")} sx={{ color: "text.primary", fontSize: 12 }}>Collections</Button><Button onClick={() => props.go("/twc-ecommerce#journal")} sx={{ color: "text.primary", fontSize: 12 }}>Journal</Button></Stack><Stack direction="row" sx={{ alignItems: "center" }}><IconButton onClick={() => props.go("/twc-ecommerce/shop")} aria-label="Search products" sx={{ display: { xs: "none", sm: "inline-flex" } }}><SearchRoundedIcon /></IconButton><IconButton onClick={() => props.go("/twc-ecommerce#about")} aria-label="About this storefront"><InfoOutlinedIcon /></IconButton><ThemeSelect {...props} /><ThemeModeAndCart {...props} /></Stack></Stack></Container></AppBar><PremiumDrawer {...props} /></>;
}

function PremiumDrawer(props: NavbarProps) {
  return <Drawer anchor="left" onClose={() => props.setMenuOpen(false)} open={props.menuOpen}><Box sx={{ bgcolor: "#fffaf8", color: "#3f2631", minHeight: "100%", p: 3, width: 320 }}><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}><HeaderLogo onClick={() => props.go("/twc-ecommerce")} /><IconButton onClick={() => props.setMenuOpen(false)} aria-label="Close menu"><CloseRoundedIcon /></IconButton></Stack><Typography sx={{ color: "#8b4962", fontSize: 11, fontWeight: 900, letterSpacing: ".16em", mt: 6 }}>THE TWC EDIT</Typography><Stack spacing={1} sx={{ mt: 2 }}><Button onClick={() => props.go("/twc-ecommerce/shop")} sx={{ color: "inherit", justifyContent: "flex-start", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 24, fontWeight: 500, px: 0 }}>Shop</Button><Button onClick={() => props.go("/twc-ecommerce#collections")} sx={{ color: "inherit", justifyContent: "flex-start", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 24, fontWeight: 500, px: 0 }}>Collections</Button><Button onClick={() => props.go("/twc-ecommerce#journal")} sx={{ color: "inherit", justifyContent: "flex-start", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 24, fontWeight: 500, px: 0 }}>Journal</Button><Button onClick={() => props.go("/twc-ecommerce#about")} sx={{ color: "inherit", justifyContent: "flex-start", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 24, fontWeight: 500, px: 0 }}>About</Button></Stack><Divider sx={{ my: 3 }} /><ThemeSelect {...props} /><Button onClick={() => { props.setMenuOpen(false); props.onCart(); }} startIcon={<ShoppingBagOutlinedIcon />} sx={{ color: "inherit", justifyContent: "flex-start", mt: 2, px: 0 }}>Basket ({props.count})</Button></Box></Drawer>;
}

function CorporateNavbar(props: NavbarProps) {
  return <><Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", display: { xs: "none", md: "block" }, px: 3, py: .6 }}><Container maxWidth="xl"><Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em" }}>TWC COMMERCE PLATFORM · OFFLINE PORTFOLIO DEMONSTRATION</Typography></Container></Box><AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: 1, borderColor: "divider" }}><Container maxWidth="xl"><Toolbar disableGutters sx={{ gap: 3, minHeight: 76 }}><IconButton onClick={() => props.setMenuOpen(true)} sx={{ display: { xs: "inline-flex", lg: "none" } }} aria-label="Open menu"><MenuRoundedIcon /></IconButton><HeaderLogo onClick={() => props.go("/twc-ecommerce")} /><Stack direction="row" spacing={1} sx={{ display: { xs: "none", lg: "flex" } }}>{["Products", "Solutions", "Collections", "About", "Support"].map((item) => <Button key={item} onClick={() => props.go("/twc-ecommerce/shop")} sx={{ color: "text.primary" }}>{item}</Button>)}</Stack><Box sx={{ flexGrow: 1 }} /><ThemeSelect {...props} /><ThemeModeAndCart {...props} /></Toolbar></Container></AppBar><VariantDrawer {...props} /></>;
}

function ThemeModeAndCart(props: Pick<NavbarProps, "mode" | "onToggleMode" | "onCart" | "count">) {
  return <Stack direction="row" sx={{ alignItems: "center" }}><HeaderModeButton mode={props.mode} onToggleMode={props.onToggleMode} /><IconButton onClick={props.onCart} aria-label="Open basket"><Badge badgeContent={props.count} color="primary"><ShoppingBagOutlinedIcon /></Badge></IconButton></Stack>;
}

function VariantDrawer(props: NavbarProps) {
  return <Drawer anchor="left" onClose={() => props.setMenuOpen(false)} open={props.menuOpen}><Box sx={{ p: 2, width: 300 }}><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}><HeaderLogo onClick={() => props.go("/twc-ecommerce")} /><IconButton onClick={() => props.setMenuOpen(false)} aria-label="Close menu"><CloseRoundedIcon /></IconButton></Stack><Stack spacing={1.25} sx={{ mt: 3 }}><TextField label="Search products" value={props.query} onChange={(event) => props.setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { props.setMenuOpen(false); props.submitSearch(); } }} size="small" /><Button onClick={() => props.go("/twc-ecommerce")} sx={{ justifyContent: "flex-start" }}>Home</Button><Button onClick={() => props.go("/twc-ecommerce/shop")} sx={{ justifyContent: "flex-start" }}>Shop</Button><ThemeSelect {...props} /><Button onClick={() => { props.setMenuOpen(false); props.onCart(); }} startIcon={<ShoppingBagOutlinedIcon />} sx={{ justifyContent: "flex-start" }}>Basket ({props.count})</Button></Stack></Box></Drawer>;
}
