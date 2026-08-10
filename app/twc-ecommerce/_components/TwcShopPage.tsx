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

export default function TwcShopPage({ onCartOpen }: { onCartOpen?: () => void }) {
  const router = useRouter();
  const { addToCart } = useTwcStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(16);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const initialCategory = new URLSearchParams(window.location.search).get("category");
    if (initialCategory) setCategory(initialCategory);
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
    <Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: { md: "end" }, justifyContent: "space-between", mb: 4, gap: 3 }}><Box><Button onClick={() => router.push("/twc-ecommerce")} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "text.secondary", mb: 2, pl: 0 }}>Store home</Button><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>THE TWC COLLECTION</Typography><Typography component="h1" sx={{ fontSize: { xs: 42, md: 68 }, fontWeight: 900, letterSpacing: "-.08em", lineHeight: .95, mt: 1 }}>Good products,<br />thoughtfully chosen.</Typography><Typography color="text.secondary" sx={{ fontSize: 16, lineHeight: 1.7, maxWidth: 600, mt: 1.5 }}>Explore the backed-up TWC catalog with product details, cart-aware actions, and a complete offline purchase journey.</Typography></Box><Card sx={{ bgcolor: "primary.main", color: "primary.contrastText", minWidth: { md: 210 }, p: 2.5, borderRadius: 3 }}><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}><FilterAltRoundedIcon /><Typography sx={{ fontSize: 34, fontWeight: 900 }}>{filtered.length}</Typography></Stack><Typography sx={{ fontSize: 12, fontWeight: 700, mt: 1 }}>products ready to browse</Typography></Card></Stack>
    <Card sx={{ border: 1, borderColor: "divider", borderRadius: 3, boxShadow: "none", mb: 3, p: { xs: 1.5, md: 2 } }}><Stack direction={{ xs: "column", md: "row" }} spacing={1.5}><TextField fullWidth size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, categories, or keywords" slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }} /><Select size="small" value={category} onChange={(event) => setCategory(event.target.value)} sx={{ minWidth: { md: 220 } }} startAdornment={<TuneRoundedIcon sx={{ color: "text.secondary", ml: 1, mr: .5 }} />}>{categories.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select><Select size="small" value={sort} onChange={(event) => setSort(event.target.value)} sx={{ minWidth: { md: 180 } }}><MenuItem value="featured">Featured</MenuItem><MenuItem value="price-low">Price: low to high</MenuItem><MenuItem value="price-high">Price: high to low</MenuItem></Select></Stack></Card>
    <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mb: 2, gap: 1 }}><Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Typography sx={{ fontWeight: 850 }}>{filtered.length} results</Typography>{category !== "All" && <Chip label={category} onDelete={() => setCategory("All")} size="small" color="primary" />}</Stack><Typography color="text.secondary" sx={{ fontSize: 13 }}>Tap a product to see the full story.</Typography></Stack>
    {filtered.length ? <><Box sx={{ display: "grid", gap: { xs: 1.5, sm: 2.5 }, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>{visibleProducts.map((product) => <TwcProductCard key={product.slug} product={product} onAdd={() => add(product)} />)}{loadingMore && Array.from({ length: Math.min(8, filtered.length - visibleCount) }, (_, index) => <ProductSkeleton key={`skeleton-${index}`} />)}</Box><Box ref={loadMoreRef} sx={{ minHeight: hasMore ? 24 : 0, py: hasMore ? 2 : 0 }} aria-busy={loadingMore}>{hasMore && <Typography color="text.secondary" sx={{ fontSize: 12, textAlign: "center" }}>{loadingMore ? "Loading more products…" : "Scroll for more products"}</Typography>}</Box></> : <Card sx={{ border: 1, borderColor: "divider", p: 7, textAlign: "center" }}><Typography variant="h3" sx={{ fontSize: 26, fontWeight: 900 }}>No products found</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Try another search or clear the category filter.</Typography><Button onClick={() => { setQuery(""); setCategory("All"); }} sx={{ mt: 2 }} variant="contained">Reset filters</Button></Card>}
  </Container>;
}

function ProductSkeleton() {
  return <Card sx={{ border: 1, borderColor: "divider", overflow: "hidden" }}><Skeleton animation="wave" variant="rectangular" sx={{ height: { xs: 175, sm: 230 } }} /><Box sx={{ p: { xs: 1.5, sm: 2.1 } }}><Skeleton animation="wave" width="42%" /><Skeleton animation="wave" height={28} sx={{ mt: .75 }} /><Skeleton animation="wave" width="88%" /><Stack direction="row" sx={{ justifyContent: "space-between", mt: 2 }}><Skeleton animation="wave" width="34%" /><Skeleton animation="wave" width="25%" /></Stack><Skeleton animation="wave" height={42} sx={{ mt: 1.5 }} /></Box></Card>;
}
