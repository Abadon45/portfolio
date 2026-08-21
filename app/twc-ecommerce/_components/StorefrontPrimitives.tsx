"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useStorefrontTheme } from "./twcEcommerceTheme";
import TwcProductCard from "./TwcProductCard";
import type { StoreProduct } from "./TwcStoreProvider";

export function AnnouncementBar() {
  const { themeConfig } = useStorefrontTheme();

  return (
    <Box sx={{ bgcolor: themeConfig.heroText, color: "#fff", px: 2, py: 0.75, textAlign: "center" }}>
      <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em" }}>
        OFFLINE PORTFOLIO STOREFRONT · {themeConfig.name.toUpperCase()} THEME
      </Typography>
    </Box>
  );
}

export function StoreSectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "end" }, justifyContent: "space-between", mb: 3, gap: 2 }}>
      <Box>
        <Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>{eyebrow}</Typography>
        <Typography component="h2" sx={{ fontSize: { xs: 30, md: 42 }, fontWeight: 850, letterSpacing: "-.06em", mt: .5 }}>{title}</Typography>
      </Box>
      {action}
    </Stack>
  );
}

export function ProductGrid({ products, onAdd, columns = 4 }: { products: StoreProduct[]; onAdd: (product: StoreProduct) => void; columns?: number }) {
  return (
    <Box sx={{ display: "grid", gap: { xs: 2, sm: 3, md: 3.5 }, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: `repeat(${columns}, minmax(0, 1fr))` } }}>
      {products.map((product) => <TwcProductCard key={product.slug} onAdd={() => onAdd(product)} product={product} />)}
    </Box>
  );
}

export function PriceDisplay({ price, size = "medium" }: { price: number; size?: "small" | "medium" | "large" }) {
  return <Typography color="primary.main" sx={{ fontSize: size === "large" ? { xs: 30, md: 38 } : size === "small" ? 16 : { xs: 20, md: 24 }, fontWeight: 900 }}>₱{price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</Typography>;
}

export function ThemeBadge() {
  const { themeConfig } = useStorefrontTheme();
  return <Chip label={themeConfig.name} size="small" sx={{ bgcolor: themeConfig.accent, color: "primary.main", fontWeight: 800 }} />;
}

export function ShopAction({ onClick }: { onClick: () => void }) {
  return <Button endIcon={<ArrowForwardRoundedIcon />} onClick={onClick} sx={{ color: "text.primary" }}>Shop all</Button>;
}

export function StorefrontCarousel({ children, label, interval = 0 }: { children: ReactNode[]; label: string; interval?: number }) {
  const [active, setActive] = useState(0);
  const total = children.length;
  useEffect(() => {
    if (!interval || total < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % total), interval);
    return () => window.clearInterval(timer);
  }, [interval, total]);
  if (!total) return null;
  const move = (direction: number) => setActive((current) => (current + direction + total) % total);
  return <Box aria-label={label} aria-roledescription="carousel" sx={{ position: "relative" }}>
    <Box sx={{ overflow: "hidden" }}>
      <Box sx={{ display: "flex", transform: `translateX(-${active * 100}%)`, transition: "transform .55s cubic-bezier(.2,.75,.25,1)" }}>
        {children.map((child, index) => <Box aria-hidden={index !== active} key={index} sx={{ flex: "0 0 100%", minWidth: 0 }}>{child}</Box>)}
      </Box>
    </Box>
    {total > 1 && <Stack direction="row" spacing={1} sx={{ alignItems: "center", bottom: 20, left: { xs: 20, md: 40 }, position: "absolute" }}>
      <IconButton aria-label="Previous slide" onClick={() => move(-1)} sx={{ bgcolor: "rgba(255,255,255,.88)", color: "text.primary" }}><ArrowBackRoundedIcon fontSize="small" /></IconButton>
      <IconButton aria-label="Next slide" onClick={() => move(1)} sx={{ bgcolor: "rgba(255,255,255,.88)", color: "text.primary" }}><ArrowForwardRoundedIcon fontSize="small" /></IconButton>
      <Stack direction="row" spacing={.75} sx={{ ml: 1 }}>{children.map((_, index) => <Box aria-label={`Go to slide ${index + 1}`} component="button" key={index} onClick={() => setActive(index)} sx={{ bgcolor: index === active ? "#fff" : "rgba(255,255,255,.5)", border: 0, borderRadius: "50%", cursor: "pointer", height: 8, p: 0, width: 8 }} />)}</Stack>
    </Stack>}
  </Box>;
}
