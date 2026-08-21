"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
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
  const filterKey = `${category}|${query}|${sort}`;
  const gridColumns = themeConfig.headerVariant === "marketplace" ? 5 : themeConfig.headerVariant === "corporate" ? 4 : themeConfig.headerVariant === "editorial" ? 3 : 4;
  useEffect(() => { setVisibleCount(16); setLoadingMore(false); loadingMoreRef.current = false; }, [filterKey]);
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || loadingMoreRef.current) return;
      loadingMoreRef.current = true;
      setLoadingMore(true);
      timer = window.setTimeout(() => { setVisibleCount((current) => Math.min(current + 16, filtered.length)); setLoadingMore(false); loadingMoreRef.current = false; }, 650);
    }, { rootMargin: "240px" });
    observer.observe(target);
    return () => { observer.disconnect(); if (timer) window.clearTimeout(timer); };
  }, [filterKey, filtered.length, hasMore, visibleCount]);
  const add = (product: (typeof products)[number]) => { addToCart(product); onCartOpen?.(); };

  return <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
    <ShopIntro themeName={themeConfig.name} variant={themeConfig.headerVariant} count={filtered.length} onBack={() => router.push("/twc-ecommerce")} />
    {themeConfig.headerVariant === "wellness" && <WellnessShopDiscovery categories={categories.slice(1, 7)} onSelect={setCategory} />}
    {themeConfig.headerVariant === "editorial" && <PremiumShopDiscovery categories={categories.slice(1, 5)} onSelect={setCategory} />}
    <ShopControls variant={themeConfig.headerVariant} query={query} category={category} sort={sort} categories={categories} onQueryChange={setQuery} onCategoryChange={setCategory} onSortChange={setSort} />
    <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mb: 2, gap: 1 }}><Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Typography sx={{ fontWeight: 850 }}>{filtered.length} {themeConfig.headerVariant === "marketplace" ? "items" : "results"}</Typography>{category !== "All" && <Chip label={category} onDelete={() => setCategory("All")} size="small" color="primary" />}</Stack><Typography color="text.secondary" sx={{ fontSize: 13 }}>{themeConfig.headerVariant === "editorial" ? "A focused edit of the TWC collection." : themeConfig.headerVariant === "corporate" ? "Compare the assortment by collection and specification." : "Tap a product to see the full story."}</Typography></Stack>
    {filtered.length ? <><ProductGrid columns={gridColumns} products={visibleProducts} onAdd={add} />{loadingMore && <ProductSkeletonGrid columns={gridColumns} count={Math.min(8, filtered.length - visibleCount)} variant={themeConfig.headerVariant} />}<Box ref={loadMoreRef} sx={{ minHeight: hasMore ? 24 : 0, py: hasMore ? 2 : 0 }} aria-busy={loadingMore}>{hasMore && <Typography color="text.secondary" sx={{ fontSize: 12, textAlign: "center" }}>{loadingMore ? "Loading more products…" : "Scroll for more products"}</Typography>}</Box></> : <Card sx={{ border: 1, borderColor: "divider", p: 7, textAlign: "center" }}><Typography variant="h3" sx={{ fontSize: 26, fontWeight: 900 }}>No products found</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Try another search or clear the category filter.</Typography><Button onClick={() => { setQuery(""); setCategory("All"); }} sx={{ mt: 2 }} variant="contained">Reset filters</Button></Card>}
  </Container>;
}

function PremiumShopDiscovery({ categories, onSelect }: { categories: string[]; onSelect: (category: string) => void }) {
  return <Box sx={{ mb: 4 }}><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>SHOP THE EDIT</Typography><Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, mt: 1.5 }}>{categories.map((category, index) => { const media = premiumMedia.categories[index % premiumMedia.categories.length]; return <Button key={category} onClick={() => onSelect(category)} sx={{ display: "block", p: 0, textAlign: "left", textTransform: "none" }}><Box component="img" src={media.image} alt="" sx={{ display: "block", height: { xs: 130, sm: 180 }, objectFit: "cover", width: "100%" }} /><Typography sx={{ color: "text.primary", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 18, mt: .75 }}>{category}</Typography></Button>; })}</Box></Box>;
}

function WellnessShopDiscovery({ categories, onSelect }: { categories: string[]; onSelect: (category: string) => void }) {
  const icons = [SpaOutlinedIcon, LocalFloristOutlinedIcon, FavoriteBorderRoundedIcon, LocalDrinkOutlinedIcon, SelfImprovementRoundedIcon, ShoppingBagOutlinedIcon];
  const imagePositions = ["left center", "center center", "right center", "center 35%", "left 65%", "right 65%"];
  const categoryImages = ["/images/twc/wellness-category-bundle.png", "/images/twc/wellness-category-beauty.png", "/images/twc/wellness-category-intimate.png", "/images/twc/wellness-category-beverage.png", "/images/twc/wellness-category-nutraceutical.png", "/images/twc/wellness-category-bags.png"];
  const categoryImageByName: Record<string, string> = { bags: categoryImages[5], bundle: categoryImages[0], "sante beauty skin care": categoryImages[1], "sante beverage": categoryImages[3], "sante intimate care": categoryImages[2], "sante nutraceutical": categoryImages[4] };
  return <Box sx={{ mb: 4 }}><Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "end" }, justifyContent: "space-between", gap: 2 }}><Box><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>BROWSE BY COLLECTION</Typography><Typography component="h2" sx={{ color: "#173b27", fontSize: { xs: 28, md: 38 }, fontWeight: 850, letterSpacing: "-.07em", mt: .5 }}>Find a place to begin.</Typography><Typography color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: 590, mt: 1 }}>Explore the real TWC catalog through a more visual wellness lens.</Typography></Box><Typography color="primary.main" sx={{ fontSize: 12, fontWeight: 800 }}>Choose a collection →</Typography></Stack><Box sx={{ display: "grid", gap: { xs: 2, md: 2.5 }, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, mt: 3 }}>{categories.map((category, index) => { const Icon = icons[index % icons.length]; const image = categoryImageByName[category.toLowerCase()] ?? categoryImages[index % categoryImages.length]; return <Button key={category} onClick={() => onSelect(category)} sx={{ bgcolor: "#fff", border: 1, borderColor: "#d7e4d2", borderRadius: 2, color: "#173b27", display: "block", overflow: "hidden", p: 0, textAlign: "left", textTransform: "none", transition: "border-color .3s, box-shadow .3s, transform .3s", "&:hover": { borderColor: "primary.main", boxShadow: "0 16px 34px rgba(52,113,83,.13)", transform: "translateY(-4px)" }, "&:hover .wellness-category-image": { transform: "scale(1.06)" }, "&:hover .wellness-category-icon": { transform: "translateY(-3px)" } }}><Box sx={{ height: { xs: 150, md: 178 }, overflow: "hidden", position: "relative" }}><Box className="wellness-category-image" component="img" src={image} alt={`${category} collection visual`} sx={{ height: "100%", objectFit: "cover", objectPosition: imagePositions[index % imagePositions.length], transition: "transform .5s", width: "100%" }} /><Box sx={{ background: "linear-gradient(180deg, rgba(23,59,39,.04), rgba(23,59,39,.3))", inset: 0, position: "absolute" }} /></Box><Box sx={{ px: { xs: 1.75, md: 2.25 }, pb: 2, pt: 0 }}><Box className="wellness-category-icon" sx={{ alignItems: "center", bgcolor: "#d7e9d2", border: 4, borderColor: "#fff", borderRadius: "50%", color: "#347153", display: "flex", height: 52, justifyContent: "center", mt: -3.25, position: "relative", transition: "transform .3s", width: 52 }}><Icon /></Box><Typography component="h3" sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 850, lineHeight: 1.2, mt: 1.25 }}>{category}</Typography><Typography color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.55, mt: .75 }}>Explore {category.toLowerCase()} products from the TWC catalog.</Typography><Stack direction="row" spacing={.5} sx={{ alignItems: "center", mt: 1.5 }}><Typography sx={{ color: "#347153", fontSize: 12, fontWeight: 800 }}>Explore collection</Typography><ArrowBackRoundedIcon sx={{ color: "#347153", fontSize: 15, transform: "rotate(180deg)" }} /></Stack></Box></Button>; })}</Box></Box>;
}

function ProductSkeleton() {
  return <Card sx={{ border: 1, borderColor: "divider", overflow: "hidden" }}><Skeleton animation="wave" variant="rectangular" sx={{ height: { xs: 175, sm: 230 } }} /><Box sx={{ p: { xs: 1.5, sm: 2.1 } }}><Skeleton animation="wave" width="42%" /><Skeleton animation="wave" height={28} sx={{ mt: .75 }} /><Skeleton animation="wave" width="88%" /><Stack direction="row" sx={{ justifyContent: "space-between", mt: 2 }}><Skeleton animation="wave" width="34%" /><Skeleton animation="wave" width="25%" /></Stack><Skeleton animation="wave" height={42} sx={{ mt: 1.5 }} /></Box></Card>;
}

function ProductSkeletonGrid({ columns, count, variant }: { columns: number; count: number; variant: "editorial" | "wellness" | "marketplace" | "corporate" }) {
  if (!count) return null;
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Box key={`skeleton-${variant}-${index}`}>
      <ProductSkeleton />
    </Box>
  ));
  return (
    <Box
      aria-label="Loading more products"
      sx={{
        display: "grid",
        gap: { xs: 2, sm: 3, md: 3.5 },
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(3, minmax(0, 1fr))",
          lg: `repeat(${columns}, minmax(0, 1fr))`,
        },
        mt: { xs: 2, md: 3.5 },
      }}
    >
      {skeletons}
    </Box>
  );
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
