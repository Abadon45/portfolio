"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import TwcProductCard from "./TwcProductCard";
import type { StoreProduct } from "./TwcStoreProvider";

type Props = {
  categories: string[];
  products: StoreProduct[];
  onAdd: (product: StoreProduct) => void;
  onShop: (category?: string) => void;
};

export default function ModernMarketplaceHome({ categories, products, onAdd, onShop }: Props) {
  const router = useRouter();
  const firstProducts = products.slice(0, 8);
  const moreProducts = products.slice(8, 16);

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
      <Container maxWidth="xl" sx={{ pb: { xs: 3, md: 6 }, pt: { xs: 2, md: 3 } }}>
        <Box
          component="section"
          aria-labelledby="marketplace-heading"
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            minHeight: { md: 370 },
            overflow: "hidden",
          }}
        >
          <Stack spacing={2} sx={{ alignSelf: "center", p: { xs: 3, sm: 4, md: 6 } }}>
            <Typography sx={{ color: "primary.contrastText", fontSize: 11, fontWeight: 800, letterSpacing: ".14em", opacity: 0.78 }}>
              TWC MARKETPLACE
            </Typography>
            <Typography id="marketplace-heading" component="h1" sx={{ fontSize: { xs: 38, sm: 46, md: 58 }, fontWeight: 800, letterSpacing: "-.055em", lineHeight: 1.02, maxWidth: 520 }}>
              Everyday finds, all in one place.
            </Typography>
            <Typography sx={{ color: "primary.contrastText", lineHeight: 1.7, maxWidth: 450, opacity: 0.86 }}>
              Explore the current TWC collection across wellness, personal care, and useful essentials.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ pt: 0.5 }}>
              <Button
                onClick={() => onShop()}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ bgcolor: "background.paper", color: "text.primary", minHeight: 44, px: 2.25, "&:hover": { bgcolor: "action.hover", color: "text.primary" } }}
                variant="contained"
              >
                Shop all products
              </Button>
              <Button
                onClick={() => router.push("/twc-ecommerce/shop")}
                startIcon={<SearchRoundedIcon />}
                sx={{ borderColor: "primary.contrastText", color: "primary.contrastText", minHeight: 44, px: 2.25, "&:hover": { bgcolor: "rgba(255,255,255,.12)", borderColor: "primary.contrastText", color: "primary.contrastText" } }}
                variant="outlined"
              >
                Search the catalog
              </Button>
            </Stack>
          </Stack>
          <ProductShowcase products={firstProducts.slice(0, 4)} />
        </Box>

        {categories.length > 0 && (
          <Box component="section" aria-label="Shop by category" sx={{ borderBottom: 1, borderColor: "divider", mt: { xs: 2, md: 3 }, pb: 1.5, pt: 2 }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, overflowX: "auto", pb: 0.5 }}>
              <Typography sx={{ color: "text.secondary", flex: "0 0 auto", fontSize: 12, fontWeight: 800, mr: 0.5 }}>Shop by category</Typography>
              {categories.slice(0, 8).map((category) => (
                <Button
                  key={category}
                  onClick={() => onShop(category)}
                  sx={{ border: 1, borderColor: "divider", color: "text.primary", flex: "0 0 auto", fontSize: 12, minHeight: 36, px: 1.5, "&:hover": { bgcolor: "action.hover", borderColor: "primary.main", color: "primary.main" } }}
                  variant="outlined"
                >
                  {category}
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        <ProductSection title="Browse the collection" products={firstProducts} onAdd={onAdd} onShop={onShop} />

        <Box sx={{ alignItems: { md: "center" }, borderBottom: 1, borderColor: "divider", borderTop: 1, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr auto" }, my: { xs: 3, md: 5 }, py: { xs: 2.5, md: 3 } }}>
          <Box>
            <Typography component="h2" sx={{ fontSize: { xs: 22, md: 27 }, fontWeight: 750, letterSpacing: "-.03em" }}>Find what you came for</Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.65, mt: 0.5 }}>Search the shared catalog or narrow it down by category and price.</Typography>
          </Box>
          <Button onClick={() => router.push("/twc-ecommerce/shop")} endIcon={<ArrowForwardRoundedIcon />} sx={{ justifySelf: { md: "end" }, minHeight: 42 }} variant="outlined">
            Browse all products
          </Button>
        </Box>

        {moreProducts.length > 0 && <ProductSection title="More to explore" products={moreProducts} onAdd={onAdd} onShop={onShop} />}
      </Container>
    </Box>
  );
}

function ProductShowcase({ products }: { products: StoreProduct[] }) {
  return (
    <Box sx={{ bgcolor: "#e7edf5", display: "grid", gap: 1, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", minHeight: { xs: 240, sm: 300, md: 370 }, p: { xs: 1.25, md: 2 } }}>
      {products.map((product) => (
        <Box key={product.slug} sx={{ alignItems: "center", bgcolor: "#fff", display: "flex", justifyContent: "center", minHeight: 0, overflow: "hidden", p: { xs: 1, md: 1.5 } }}>
          <Box component="img" src={product.image} alt={product.name} loading="lazy" sx={{ height: "100%", maxHeight: 168, maxWidth: "100%", objectFit: "contain", width: "100%" }} />
        </Box>
      ))}
      {products.length === 0 && <Box sx={{ gridColumn: "1 / -1" }} />}
    </Box>
  );
}

function ProductSection({ title, products, onAdd, onShop }: { title: string; products: StoreProduct[]; onAdd: Props["onAdd"]; onShop: Props["onShop"] }) {
  return (
    <Box component="section" sx={{ pt: { xs: 3, md: 4 } }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1, mb: 2 }}>
        <Typography component="h2" sx={{ fontSize: { xs: 23, md: 30 }, fontWeight: 750, letterSpacing: "-.04em" }}>{title}</Typography>
        <Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} sx={{ flexShrink: 0 }}>View all</Button>
      </Stack>
      <Box sx={{ display: "grid", gap: { xs: 1, sm: 1.5 }, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
        {products.map((product) => <TwcProductCard key={product.slug} product={product} onAdd={() => onAdd(product)} />)}
      </Box>
    </Box>
  );
}
