"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import TwcProductCard from "./TwcProductCard";
import { products, type StoreProduct } from "./TwcStoreProvider";
import { StorefrontCarousel } from "./StorefrontPrimitives";

type Props = { categories: string[]; onAdd: (product: StoreProduct) => void; onShop: (category?: string) => void };

export default function ModernMarketplaceHome({ categories, onAdd, onShop }: Props) {
  const router = useRouter();
  const featured = products.slice(0, 8);
  const popular = products.slice(8, 16);
  return <Box sx={{ bgcolor: "#f5f8fc" }}>
    <MarketplaceHero onShop={onShop} />
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <MarketplaceCategoryRail categories={categories} onSelect={onShop} />
      <MarketplaceTrust />
      <MarketplaceMerchandising onShop={onShop} />
      <MarketplaceProducts eyebrow="FEATURED PRODUCTS" title="Popular across the catalog" products={featured} onAdd={onAdd} onShop={onShop} />
      <MarketplaceSplit />
      <MarketplaceProducts eyebrow="MORE TO DISCOVER" title="Keep exploring" products={popular} onAdd={onAdd} onShop={onShop} />
      <Box sx={{ bgcolor: "#2457c5", color: "#fff", my: { xs: 6, md: 10 }, p: { xs: 3, md: 6 } }}><Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: { md: "center" }, justifyContent: "space-between", gap: 3 }}><Box><Typography sx={{ color: "#dce8ff", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>ONE CATALOG, MANY POSSIBILITIES</Typography><Typography component="h2" sx={{ fontSize: { xs: 30, md: 46 }, fontWeight: 950, letterSpacing: "-.07em", mt: 1 }}>Search less. Find more.</Typography><Typography sx={{ color: "rgba(255,255,255,.78)", lineHeight: 1.7, maxWidth: 520, mt: 1 }}>Use search, categories, filters, and product detail pages to move through the shared TWC catalog quickly.</Typography></Box><Button onClick={() => router.push("/twc-ecommerce/shop")} endIcon={<SearchRoundedIcon />} sx={{ alignSelf: { xs: "flex-start", md: "center" }, bgcolor: "#fff", color: "#2457c5", px: 3 }}>Search the catalog</Button></Stack></Box>
    </Container>
  </Box>;
}

function MarketplaceHero({ onShop }: { onShop: Props["onShop"] }) {
  const slides = [
    { eyebrow: "THE MARKETPLACE EDIT", title: "Find what moves your day forward.", copy: "Explore useful products, fresh categories, and everyday upgrades in one fast catalog.", image: "/images/twc/marketplace-hero-a.png" },
    { eyebrow: "DISCOVER MORE", title: "A better way to browse the everyday.", copy: "Search, compare, and build your basket from a product-first storefront experience.", image: "/images/twc/marketplace-hero-b.png" },
  ];
  return <StorefrontCarousel interval={6500} label="Modern Marketplace promotional hero">{slides.map((slide) => <Box key={slide.title} sx={{ bgcolor: "#e6efff", minHeight: { xs: 530, md: 570 }, overflow: "hidden", position: "relative" }}><Container maxWidth="xl" sx={{ height: "100%" }}><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, minHeight: { md: 570 } }}><Stack sx={{ justifyContent: "center", maxWidth: 600, p: { xs: 3, md: 7 }, position: "relative", zIndex: 1 }} spacing={2}><Chip label={slide.eyebrow} sx={{ alignSelf: "flex-start", bgcolor: "#dce8ff", color: "#2457c5", fontWeight: 900 }} /><Typography component="h1" sx={{ color: "#142c63", fontSize: { xs: 46, md: 72 }, fontWeight: 950, letterSpacing: "-.09em", lineHeight: .92 }}>{slide.title}</Typography><Typography sx={{ color: "#4c6390", fontSize: 16, lineHeight: 1.75, maxWidth: 500 }}>{slide.copy}</Typography><Stack direction="row" spacing={1.25}><Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} variant="contained">Shop now</Button><Button onClick={() => document.getElementById("marketplace-categories")?.scrollIntoView({ behavior: "smooth" })} sx={{ color: "#2457c5" }} variant="outlined">Explore categories</Button></Stack></Stack><Box sx={{ minHeight: { xs: 260, md: 570 }, p: { xs: 2, md: 5 }, position: "relative" }}><Box sx={{ bgcolor: "#fff", boxShadow: "0 22px 55px rgba(36,87,197,.2)", height: { xs: 260, md: 430 }, mt: { md: 6 }, overflow: "hidden", transform: { md: "rotate(3deg)" } }}><Box component="img" src={slide.image} alt="Featured marketplace product" sx={{ height: "100%", objectFit: "contain", p: { xs: 2, md: 4 }, width: "100%" }} /></Box><Box sx={{ bgcolor: "#e07a35", bottom: { xs: 18, md: 48 }, color: "#fff", p: 1.5, position: "absolute", right: { xs: 22, md: 56 }, transform: "rotate(-6deg)" }}><Typography sx={{ fontSize: 11, fontWeight: 950, letterSpacing: ".1em" }}>SHOP THE EDIT</Typography></Box></Box></Box></Container></Box>)}</StorefrontCarousel>;
}

function MarketplaceCategoryRail({ categories, onSelect }: { categories: string[]; onSelect: Props["onShop"] }) {
  return <Box id="marketplace-categories" sx={{ scrollMarginTop: 90 }}><Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", gap: 1, mb: 1.5 }}><Typography component="h2" sx={{ color: "#142c63", fontSize: 21, fontWeight: 950 }}>Quick shop by category</Typography><Typography color="text.secondary" sx={{ fontSize: 12 }}>Fast paths into the catalog</Typography></Stack><Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { display: "none" } }}>{categories.map((category) => <Button key={category} onClick={() => onSelect(category)} startIcon={<CategoryRoundedIcon fontSize="small" />} sx={{ bgcolor: "#fff", border: 1, borderColor: "#d4def0", color: "#142c63", flex: "0 0 auto", fontSize: 12, fontWeight: 850, px: 1.75, textTransform: "none", whiteSpace: "nowrap", "&:hover": { bgcolor: "#e6efff", borderColor: "#2457c5" } }}>{category}</Button>)}</Box></Box>;
}

function MarketplaceTrust() {
  return <Box sx={{ borderBottom: 1, borderColor: "#dce3ef", borderTop: 1, display: "grid", gap: 0, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, my: { xs: 4, md: 6 }, py: 1 }}>{[[<TrendingUpRoundedIcon key="trend" />, "Product-first discovery", "Search and filter the real catalog."], [<VerifiedOutlinedIcon key="verified" />, "Clear product detail", "Compare information before adding."], [<LocalShippingOutlinedIcon key="delivery" />, "Demo-ready checkout", "Shipping is calculated in the shared flow."]].map(([icon, title, copy]) => <Stack direction="row" key={String(title)} spacing={1.25} sx={{ alignItems: "center", borderRight: { sm: 1 }, borderColor: "#dce3ef", p: 1.5 }}>{icon}<Box><Typography sx={{ color: "#142c63", fontSize: 12, fontWeight: 900 }}>{title}</Typography><Typography color="text.secondary" sx={{ fontSize: 11, mt: .25 }}>{copy}</Typography></Box></Stack>)}</Box>;
}

function MarketplaceMerchandising({ onShop }: { onShop: Props["onShop"] }) {
  return <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1.4fr .6fr" }, mb: { xs: 6, md: 9 } }}><Paper sx={{ bgcolor: "#142c63", color: "#fff", overflow: "hidden", p: { xs: 2.5, md: 4 }, position: "relative" }}><Box sx={{ maxWidth: 520, position: "relative", zIndex: 1 }}><Typography sx={{ color: "#b9ccf5", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>FEATURED COLLECTION</Typography><Typography component="h2" sx={{ fontSize: { xs: 27, md: 38 }, fontWeight: 950, letterSpacing: "-.07em", lineHeight: 1, mt: .75 }}>Useful things, gathered in one place.</Typography><Typography sx={{ color: "rgba(255,255,255,.72)", lineHeight: 1.7, mt: 1 }}>A merchandising banner for the shared catalog—clear, direct, and ready for a collection link.</Typography><Button onClick={() => onShop()} sx={{ bgcolor: "#fff", color: "#142c63", mt: 2 }}>Browse products</Button></Box><Box sx={{ bgcolor: "rgba(224,122,53,.9)", borderRadius: "50%", height: 210, position: "absolute", right: -45, top: -55, width: 210 }} /></Paper><Paper sx={{ bgcolor: "#fff3e8", border: 1, borderColor: "#f3d4b7", p: { xs: 2.5, md: 3 } }}><Typography sx={{ color: "#b45720", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>JUST IN THE CATALOG</Typography><Typography component="h2" sx={{ color: "#703112", fontSize: 27, fontWeight: 950, letterSpacing: "-.06em", mt: 1 }}>New finds to explore.</Typography><Typography sx={{ color: "#8e5f49", fontSize: 13, lineHeight: 1.7, mt: 1 }}>Browse the latest available products without fabricated discounts or claims.</Typography><Button onClick={() => onShop()} sx={{ color: "#b45720", mt: 2, px: 0 }}>See what is new →</Button></Paper></Box>;
}

function MarketplaceProducts({ eyebrow, title, products: items, onAdd, onShop }: { eyebrow: string; title: string; products: StoreProduct[]; onAdd: Props["onAdd"]; onShop: Props["onShop"] }) {
  return <Box sx={{ mb: { xs: 7, md: 10 } }}><Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "end" }, justifyContent: "space-between", gap: 2, mb: 2.5 }}><Box><Typography sx={{ color: "#2457c5", fontSize: 11, fontWeight: 950, letterSpacing: ".14em" }}>{eyebrow}</Typography><Typography component="h2" sx={{ color: "#142c63", fontSize: { xs: 28, md: 42 }, fontWeight: 950, letterSpacing: "-.08em", mt: .5 }}>{title}</Typography></Box><Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} sx={{ color: "#2457c5" }}>View all</Button></Stack><Box sx={{ display: "grid", gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }}}>{items.map((product) => <TwcProductCard key={product.slug} product={product} onAdd={() => onAdd(product)} />)}</Box></Box>;
}

function MarketplaceSplit() {
  return <Box sx={{ bgcolor: "#fff", border: 1, borderColor: "#dce3ef", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, mb: { xs: 7, md: 10 }, overflow: "hidden" }}><Box component="img" src="/images/twc/marketplace-everyday.png" alt="Useful everyday products arranged in a bright home setting" sx={{ height: { xs: 260, md: 350 }, objectFit: "cover", width: "100%" }} /><Stack sx={{ justifyContent: "center", p: { xs: 3, md: 5 } }} spacing={1.5}><Typography sx={{ color: "#2457c5", fontSize: 11, fontWeight: 950, letterSpacing: ".14em" }}>EDITOR'S PICK</Typography><Typography component="h2" sx={{ color: "#142c63", fontSize: { xs: 28, md: 40 }, fontWeight: 950, letterSpacing: "-.08em", lineHeight: 1 }}>Make the everyday more useful.</Typography><Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>A visual break between product collections keeps the marketplace energetic without inventing a promotion.</Typography></Stack></Box>;
}
