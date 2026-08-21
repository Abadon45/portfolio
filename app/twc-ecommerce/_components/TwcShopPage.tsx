"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { Box, Button, Card, Chip, Container, InputAdornment, MenuItem, Select, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { products, useTwcStore } from "./TwcStoreProvider";
import TwcProductCard from "./TwcProductCard";
import { ProductGrid } from "./StorefrontPrimitives";
import { useStorefrontTheme } from "./twcEcommerceTheme";
import { premiumMedia } from "./storefrontContent";

export default function TwcShopPage({ onCartOpen }: { onCartOpen?: () => void }) {
  const router = useRouter();
  const { addToCart } = useTwcStore();
  const { themeConfig } = useStorefrontTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(16);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get("category");
    const initialSearch = params.get("search");
    if (initialCategory) setCategory(initialCategory);
    if (initialSearch) setQuery(initialSearch);
  }, []);
  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const filtered = useMemo(() => products.filter((product) => (category === "All" || product.category === category) && `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : a.name.localeCompare(b.name)), [category, query, sort]);
  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleProducts.length < filtered.length;
  useEffect(() => { setVisibleCount(16); setLoadingMore(false); loadingMoreRef.current = false; }, [category, query, sort]);
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || loadingMore) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || loadingMoreRef.current) return;
      loadingMoreRef.current = true;
      setLoadingMore(true);
      timer = window.setTimeout(() => { setVisibleCount((current) => Math.min(current + 16, filtered.length)); setLoadingMore(false); loadingMoreRef.current = false; }, 650);
    }, { rootMargin: "240px" });
    observer.observe(target);
    return () => { observer.disconnect(); if (timer) window.clearTimeout(timer); };
  }, [filtered.length, hasMore]);
  const add = (product: (typeof products)[number]) => { addToCart(product); onCartOpen?.(); };

  return <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
    <ShopIntro themeName={themeConfig.name} variant={themeConfig.headerVariant} count={filtered.length} onBack={() => router.push("/twc-ecommerce")} />
    {themeConfig.headerVariant === "editorial" && <PremiumShopDiscovery categories={categories.slice(1, 5)} onSelect={setCategory} />}
    <ShopControls variant={themeConfig.headerVariant} query={query} category={category} sort={sort} categories={categories} onQueryChange={setQuery} onCategoryChange={setCategory} onSortChange={setSort} />
    <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mb: 2, gap: 1 }}><Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Typography sx={{ fontWeight: 850 }}>{filtered.length} {themeConfig.headerVariant === "marketplace" ? "items" : "results"}</Typography>{category !== "All" && <Chip label={category} onDelete={() => setCategory("All")} size="small" color="primary" />}</Stack><Typography color="text.secondary" sx={{ fontSize: 13 }}>{themeConfig.headerVariant === "editorial" ? "A focused edit of the TWC collection." : themeConfig.headerVariant === "corporate" ? "Compare the assortment by collection and specification." : "Tap a product to see the full story."}</Typography></Stack>
    {filtered.length ? <><ProductGrid columns={themeConfig.headerVariant === "marketplace" ? 5 : themeConfig.headerVariant === "corporate" ? 2 : themeConfig.headerVariant === "editorial" ? 3 : 4} products={visibleProducts} onAdd={add} />{loadingMore && Array.from({ length: Math.min(8, filtered.length - visibleCount) }, (_, index) => <ProductSkeleton key={`skeleton-${index}`} />)}<Box ref={loadMoreRef} sx={{ minHeight: hasMore ? 24 : 0, py: hasMore ? 2 : 0 }} aria-busy={loadingMore}>{hasMore && <Typography color="text.secondary" sx={{ fontSize: 12, textAlign: "center" }}>{loadingMore ? "Loading more products…" : "Scroll for more products"}</Typography>}</Box></> : <Card sx={{ border: 1, borderColor: "divider", p: 7, textAlign: "center" }}><Typography variant="h3" sx={{ fontSize: 26, fontWeight: 900 }}>No products found</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Try another search or clear the category filter.</Typography><Button onClick={() => { setQuery(""); setCategory("All"); }} sx={{ mt: 2 }} variant="contained">Reset filters</Button></Card>}
  </Container>;
}

function PremiumShopDiscovery({ categories, onSelect }: { categories: string[]; onSelect: (category: string) => void }) {
  return <Box sx={{ mb: 4 }}><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>SHOP THE EDIT</Typography><Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, mt: 1.5 }}>{categories.map((category, index) => { const media = premiumMedia.categories[index % premiumMedia.categories.length]; return <Button key={category} onClick={() => onSelect(category)} sx={{ display: "block", p: 0, textAlign: "left", textTransform: "none" }}><Box component="img" src={media.image} alt="" sx={{ display: "block", height: { xs: 130, sm: 180 }, objectFit: "cover", width: "100%" }} /><Typography sx={{ color: "text.primary", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 18, mt: .75 }}>{category}</Typography></Button>; })}</Box></Box>;
}

function ProductSkeleton() {
  return <Card sx={{ border: 1, borderColor: "divider", overflow: "hidden" }}><Skeleton animation="wave" variant="rectangular" sx={{ height: { xs: 175, sm: 230 } }} /><Box sx={{ p: { xs: 1.5, sm: 2.1 } }}><Skeleton animation="wave" width="42%" /><Skeleton animation="wave" height={28} sx={{ mt: .75 }} /><Skeleton animation="wave" width="88%" /><Stack direction="row" sx={{ justifyContent: "space-between", mt: 2 }}><Skeleton animation="wave" width="34%" /><Skeleton animation="wave" width="25%" /></Stack><Skeleton animation="wave" height={42} sx={{ mt: 1.5 }} /></Box></Card>;
}

function ShopControls({ variant, query, category, sort, categories, onQueryChange, onCategoryChange, onSortChange }: {
  variant: "editorial" | "wellness" | "marketplace" | "corporate";
  query: string;
  category: string;
  sort: string;
  categories: string[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}) {
  const isEditorial = variant === "editorial";
  return <Card sx={{ border: isEditorial ? 0 : 1, borderColor: "divider", borderRadius: isEditorial ? 0 : 3, boxShadow: "none", mb: 3, p: { xs: 1.5, md: isEditorial ? 0 : 2 } }}>
    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
      <TextField fullWidth size="small" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={isEditorial ? "Search the edit" : "Search products, categories, or keywords"} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }} />
      <Select size="small" value={category} onChange={(event) => onCategoryChange(event.target.value)} sx={{ minWidth: { md: 220 } }} startAdornment={<TuneRoundedIcon sx={{ color: "text.secondary", ml: 1, mr: .5 }} />}>{categories.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select>
      <Select size="small" value={sort} onChange={(event) => onSortChange(event.target.value)} sx={{ minWidth: { md: 180 } }}><MenuItem value="featured">{variant === "marketplace" ? "Recommended" : "Featured"}</MenuItem><MenuItem value="price-low">Price: low to high</MenuItem><MenuItem value="price-high">Price: high to low</MenuItem></Select>
    </Stack>
  </Card>;
}

function ShopIntro({ themeName, variant, count, onBack }: { themeName: string; variant: "editorial" | "wellness" | "marketplace" | "corporate"; count: number; onBack: () => void }) {
  if (variant === "editorial") return <Box sx={{ mb: 5, textAlign: "center" }}><Button onClick={onBack} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "text.secondary" }}>Store home</Button><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em", mt: 3 }}>THE EDIT · {themeName.toUpperCase()}</Typography><Typography component="h1" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: 44, md: 72 }, fontWeight: 500, lineHeight: 1, mt: 1 }}>A considered collection.</Typography><Typography color="text.secondary" sx={{ lineHeight: 1.8, maxWidth: 560, mx: "auto", mt: 1.5 }}>Browse the TWC edit with generous imagery, quiet details, and a focused path to the basket.</Typography></Box>;
  if (variant === "marketplace") return <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", mb: 3, p: { xs: 2, md: 4 } }}><Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", gap: 2 }}><Box><Button onClick={onBack} sx={{ color: "inherit", p: 0 }}>← Store home</Button><Typography component="h1" sx={{ fontSize: { xs: 32, md: 48 }, fontWeight: 950, letterSpacing: "-.07em", mt: 1 }}>Shop all products.</Typography></Box><Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><FilterAltRoundedIcon /><Typography sx={{ fontSize: 30, fontWeight: 950 }}>{count}</Typography><Typography sx={{ fontSize: 12 }}>results</Typography></Stack></Stack></Box>;
  if (variant === "corporate") return <Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: { md: "end" }, borderBottom: 1, borderColor: "divider", justifyContent: "space-between", mb: 4, pb: 3, gap: 3 }}><Box><Button onClick={onBack} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "text.secondary", mb: 2, pl: 0 }}>Store home</Button><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>CORPORATE COLLECTIONS</Typography><Typography component="h1" sx={{ fontSize: { xs: 42, md: 62 }, fontWeight: 900, letterSpacing: "-.08em", lineHeight: .95, mt: 1 }}>Products, clearly considered.</Typography></Box><Typography color="text.secondary" sx={{ maxWidth: 330, lineHeight: 1.7 }}>A structured catalog experience powered by the shared TWC storefront engine.</Typography></Stack>;
  return <Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: { md: "end" }, justifyContent: "space-between", mb: 4, gap: 3 }}><Box><Button onClick={onBack} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "text.secondary", mb: 2, pl: 0 }}>Store home</Button><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>WELLNESS COLLECTION</Typography><Typography component="h1" sx={{ fontSize: { xs: 42, md: 68 }, fontWeight: 900, letterSpacing: "-.08em", lineHeight: .95, mt: 1 }}>Find your next everyday favorite.</Typography><Typography color="text.secondary" sx={{ fontSize: 16, lineHeight: 1.7, maxWidth: 600, mt: 1.5 }}>Explore wellness, style, and useful essentials in one calm shopping experience.</Typography></Box><Card sx={{ bgcolor: "action.hover", minWidth: { md: 210 }, p: 2.5 }}><Typography color="text.secondary" sx={{ fontSize: 12 }}>Curated products</Typography><Typography color="primary.main" sx={{ fontSize: 34, fontWeight: 900 }}>{count}</Typography></Card></Stack>;
}
