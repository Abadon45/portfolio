"use client";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AppBar, Badge, Box, Button, Container, Drawer, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TwcEshopNavbar({ count, mode, onCart, onToggleMode }: { count: number; mode: "light" | "dark"; onCart: () => void; onToggleMode: () => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (path: string) => { setMenuOpen(false); router.push(path); };
  return <><AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: 1, borderColor: "divider" }}><Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 } }}><Toolbar disableGutters sx={{ gap: 2, minHeight: 76 }}><IconButton onClick={() => setMenuOpen(true)} sx={{ display: { xs: "inline-flex", md: "none" }, color: "inherit" }} aria-label="Open menu"><MenuRoundedIcon /></IconButton><Button onClick={() => go("/twc-ecommerce")} startIcon={<ShoppingBagOutlinedIcon />} sx={{ color: "text.primary", fontSize: { xs: 16, sm: 19 }, fontWeight: 800, letterSpacing: "-.04em", p: 0, minWidth: "auto" }}>TWC <Box component="span" sx={{ color: "primary.main", ml: .5 }}>ONLINE</Box></Button><Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" }, ml: 3 }}><Button onClick={() => go("/twc-ecommerce")} sx={{ color: "text.primary" }}>Home</Button><Button onClick={() => go("/twc-ecommerce/shop")} sx={{ color: "text.primary" }}>Shop</Button></Stack><Box sx={{ flexGrow: 1 }} /><IconButton onClick={onToggleMode} aria-label="Toggle theme" sx={{ color: "text.secondary" }}>{mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}</IconButton><IconButton onClick={onCart} aria-label="Open basket" sx={{ color: "text.primary" }}><Badge badgeContent={count} color="primary"><ShoppingBagOutlinedIcon /></Badge></IconButton></Toolbar></Container></AppBar><Drawer anchor="left" onClose={() => setMenuOpen(false)} open={menuOpen}><Box sx={{ p: 2, width: 280 }}><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}><Typography sx={{ fontWeight: 800 }}>TWC ONLINE</Typography><IconButton onClick={() => setMenuOpen(false)} aria-label="Close menu"><CloseRoundedIcon /></IconButton></Stack><Stack spacing={1} sx={{ mt: 3 }}><Button onClick={() => go("/twc-ecommerce")} sx={{ justifyContent: "flex-start" }}>Home</Button><Button onClick={() => go("/twc-ecommerce/shop")} sx={{ justifyContent: "flex-start" }}>Shop</Button><Button onClick={() => { setMenuOpen(false); onCart(); }} startIcon={<ShoppingBagOutlinedIcon />} sx={{ justifyContent: "flex-start" }}>Basket ({count})</Button></Stack></Box></Drawer></>;
}
