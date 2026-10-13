"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTwcStore, type StoreProduct } from "./TwcStoreProvider";
import TwcProductCard from "./TwcProductCard";
import { ProductGrid } from "./StorefrontPrimitives";
import { useStorefrontTheme } from "./twcEcommerceTheme";
import {
  selectPremiumBeautyProducts,
  selectSanteCategories,
} from "./storefrontContent";

export default function TwcShopPage({
  onCartOpen,
}: {
  onCartOpen?: () => void;
}) {
  const router = useRouter();
  const { addToCart, products } = useTwcStore();
  const { themeConfig, themeName } = useStorefrontTheme();
  const catalogueProducts = useMemo(
    () =>
      themeName === "wellness-organic"
        ? products.filter(
            (product) => product.category1.trim().toLowerCase() === "sante",
          )
        : themeName === "premium-beauty"
          ? selectPremiumBeautyProducts(products)
          : products,
    [products, themeName],
  );
  const gridColumns = 4;
  const batchSize = gridColumns * 2;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(batchSize);
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
  const categories = [
    "All",
    ...Array.from(
      new Set(catalogueProducts.map((product) => product.category)),
    ),
  ];
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      catalogueProducts
        .filter(
          (product) =>
            (category === "All" || product.category === category) &&
            `${product.name} ${product.description} ${product.category} ${product.brand ?? ""} ${product.shop} ${product.sku}`
              .toLowerCase()
              .includes(normalizedQuery),
        )
        .sort((a, b) =>
          sort === "price-low"
            ? a.price - b.price
            : sort === "price-high"
              ? b.price - a.price
              : a.name.localeCompare(b.name),
        ),
    [category, catalogueProducts, normalizedQuery, sort],
  );
  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleProducts.length < filtered.length;
  const filterKey = `${batchSize}|${category}|${query}|${sort}`;
  useEffect(() => {
    setVisibleCount(batchSize);
    setLoadingMore(false);
    loadingMoreRef.current = false;
  }, [filterKey]);
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadingMoreRef.current) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
        timer = window.setTimeout(() => {
          setVisibleCount((current) =>
            Math.min(current + batchSize, filtered.length),
          );
          setLoadingMore(false);
          loadingMoreRef.current = false;
        }, 650);
      },
      { rootMargin: "240px" },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [filterKey, filtered.length, hasMore, visibleCount]);
  const add = (product: StoreProduct) => {
    addToCart(product);
    onCartOpen?.();
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      <ShopIntro
        themeName={themeConfig.name}
        variant={themeConfig.headerVariant}
        count={filtered.length}
        onBack={() => router.push("/twc-ecommerce")}
      />
      {themeConfig.headerVariant === "wellness" && (
        <WellnessShopDiscovery
          categories={categories.slice(1, 7)}
          onSelect={setCategory}
        />
      )}
      {themeName === "wellness-organic" && (
        <SanteShopDiscovery
          categories={selectSanteCategories(catalogueProducts)}
          onSelect={setCategory}
        />
      )}
      <ShopControls
        storefrontName={themeConfig.name}
        variant={themeConfig.headerVariant}
        query={query}
        category={category}
        sort={sort}
        categories={categories}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          mb: 2,
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography aria-live="polite" sx={{ fontWeight: 800 }}>
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </Typography>
          {(category !== "All" || normalizedQuery) && (
            <Button
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              size="small"
            >
              Clear filters
            </Button>
          )}
        </Stack>
        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
          {themeConfig.headerVariant === "editorial"
            ? themeName === "wellness-organic"
              ? "Product details and prices follow the current Santé catalog."
              : "Explore fragrances, beauty finds, accessories, and style from the current collection."
            : themeConfig.headerVariant === "corporate"
              ? "Product details and availability follow the current TWC catalog."
              : "Choose a product to view details, availability, and delivery options."}
        </Typography>
      </Stack>
      {filtered.length ? (
        <>
          <ProductGrid
            columns={gridColumns}
            products={visibleProducts}
            onAdd={add}
          />
          {loadingMore && (
            <ProductSkeletonGrid
              columns={gridColumns}
              count={Math.min(batchSize, filtered.length - visibleCount)}
              variant={themeConfig.headerVariant}
            />
          )}
          <Box
            ref={loadMoreRef}
            sx={{ minHeight: hasMore ? 24 : 0, py: hasMore ? 2 : 0 }}
            aria-busy={loadingMore}
          >
            {hasMore && (
              <Typography
                color="text.secondary"
                sx={{ fontSize: 12, textAlign: "center" }}
              >
                {loadingMore
                  ? "Loading more products…"
                  : "Scroll for more products"}
              </Typography>
            )}
          </Box>
        </>
      ) : (
        <Card
          sx={{ border: 1, borderColor: "divider", p: 7, textAlign: "center" }}
        >
          <Typography variant="h3" sx={{ fontSize: 26, fontWeight: 900 }}>
            No products found
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try another search or clear the category filter.
          </Typography>
          <Button
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Reset filters
          </Button>
        </Card>
      )}
    </Container>
  );
}

function SanteShopDiscovery({
  categories,
  onSelect,
}: {
  categories: ReturnType<typeof selectSanteCategories>;
  onSelect: (category: string) => void;
}) {
  if (!categories.length) return null;

  return (
    <Box
      component="section"
      aria-labelledby="shop-wellness-categories"
      sx={{ mb: 4 }}
    >
      <Typography
        id="shop-wellness-categories"
        component="h2"
        sx={{
          fontSize: { xs: 22, md: 26 },
          fontWeight: 700,
          mb: 1.5,
        }}
      >
        Browse wellness by category
      </Typography>
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        {categories.map((category) => (
          <Button
            key={category.query}
            onClick={() => onSelect(category.query)}
            sx={{
              color: "text.primary",
              display: "block",
              minWidth: 0,
              p: 0,
              textAlign: "left",
              textTransform: "none",
              "&:focus-visible": {
                outline: "2px solid",
                outlineColor: "primary.main",
                outlineOffset: 2,
              },
            }}
          >
            <Box
              component="img"
              src={category.image}
              alt=""
              sx={{
                aspectRatio: "1 / 1",
                bgcolor: "background.paper",
                display: "block",
                objectFit: "contain",
                width: "100%",
              }}
            />
            <Typography sx={{ fontSize: 15, fontWeight: 650, mt: 0.75 }}>
              {category.label}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}

function WellnessShopDiscovery({
  categories,
  onSelect,
}: {
  categories: string[];
  onSelect: (category: string) => void;
}) {
  const icons = [
    SpaOutlinedIcon,
    LocalFloristOutlinedIcon,
    FavoriteBorderRoundedIcon,
    LocalDrinkOutlinedIcon,
    SelfImprovementRoundedIcon,
    ShoppingBagOutlinedIcon,
  ];
  const imagePositions = [
    "left center",
    "center center",
    "right center",
    "center 35%",
    "left 65%",
    "right 65%",
  ];
  const categoryImages = [
    "/images/twc/wellness-category-bundle.png",
    "/images/twc/wellness-category-beauty.png",
    "/images/twc/wellness-category-intimate.png",
    "/images/twc/wellness-category-beverage.png",
    "/images/twc/wellness-category-nutraceutical.png",
    "/images/twc/wellness-category-bags.png",
  ];
  const categoryImageByName: Record<string, string> = {
    bags: categoryImages[5],
    bundle: categoryImages[0],
    "sante beauty skin care": categoryImages[1],
    "sante beverage": categoryImages[3],
    "sante intimate care": categoryImages[2],
    "sante nutraceutical": categoryImages[4],
  };
  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          alignItems: { sm: "end" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            color="primary.main"
            sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}
          >
            BROWSE BY COLLECTION
          </Typography>
          <Typography
            component="h2"
            sx={{
              color: "#173b27",
              fontSize: { xs: 28, md: 38 },
              fontWeight: 850,
              letterSpacing: "-.07em",
              mt: 0.5,
            }}
          >
            Find a place to begin.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.7, maxWidth: 590, mt: 1 }}
          >
            Explore the real TWC catalog through a more visual wellness lens.
          </Typography>
        </Box>
        <Typography color="primary.main" sx={{ fontSize: 12, fontWeight: 800 }}>
          Choose a collection →
        </Typography>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, md: 2.5 },
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          mt: 3,
        }}
      >
        {categories.map((category, index) => {
          const Icon = icons[index % icons.length];
          const image =
            categoryImageByName[category.toLowerCase()] ??
            categoryImages[index % categoryImages.length];
          return (
            <Button
              key={category}
              onClick={() => onSelect(category)}
              sx={{
                bgcolor: "#fff",
                border: 1,
                borderColor: "#d7e4d2",
                borderRadius: 2,
                color: "#173b27",
                display: "block",
                overflow: "hidden",
                p: 0,
                textAlign: "left",
                textTransform: "none",
                transition: "border-color .3s, box-shadow .3s, transform .3s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 16px 34px rgba(52,113,83,.13)",
                  transform: "translateY(-4px)",
                },
                "&:hover .wellness-category-image": {
                  transform: "scale(1.06)",
                },
                "&:hover .wellness-category-icon": {
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Box
                sx={{
                  height: { xs: 150, md: 178 },
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  className="wellness-category-image"
                  component="img"
                  src={image}
                  alt={`${category} collection visual`}
                  sx={{
                    height: "100%",
                    objectFit: "cover",
                    objectPosition:
                      imagePositions[index % imagePositions.length],
                    transition: "transform .5s",
                    width: "100%",
                  }}
                />
                <Box
                  sx={{
                    background:
                      "linear-gradient(180deg, rgba(23,59,39,.04), rgba(23,59,39,.3))",
                    inset: 0,
                    position: "absolute",
                  }}
                />
              </Box>
              <Box sx={{ px: { xs: 1.75, md: 2.25 }, pb: 2, pt: 0 }}>
                <Box
                  className="wellness-category-icon"
                  sx={{
                    alignItems: "center",
                    bgcolor: "#d7e9d2",
                    border: 4,
                    borderColor: "#fff",
                    borderRadius: "50%",
                    color: "#347153",
                    display: "flex",
                    height: 52,
                    justifyContent: "center",
                    mt: -3.25,
                    position: "relative",
                    transition: "transform .3s",
                    width: 52,
                  }}
                >
                  <Icon />
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: { xs: 16, md: 18 },
                    fontWeight: 850,
                    lineHeight: 1.2,
                    mt: 1.25,
                  }}
                >
                  {category}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 12, lineHeight: 1.55, mt: 0.75 }}
                >
                  Explore {category.toLowerCase()} products from the TWC
                  catalog.
                </Typography>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: "center", mt: 1.5 }}
                >
                  <Typography
                    sx={{ color: "#347153", fontSize: 12, fontWeight: 800 }}
                  >
                    Explore collection
                  </Typography>
                  <ArrowBackRoundedIcon
                    sx={{
                      color: "#347153",
                      fontSize: 15,
                      transform: "rotate(180deg)",
                    }}
                  />
                </Stack>
              </Box>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

function ProductSkeleton() {
  return (
    <Card sx={{ border: 1, borderColor: "divider", overflow: "hidden" }}>
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ height: { xs: 175, sm: 230 } }}
      />
      <Box sx={{ p: { xs: 1.5, sm: 2.1 } }}>
        <Skeleton animation="wave" width="42%" />
        <Skeleton animation="wave" height={28} sx={{ mt: 0.75 }} />
        <Skeleton animation="wave" width="88%" />
        <Stack direction="row" sx={{ justifyContent: "space-between", mt: 2 }}>
          <Skeleton animation="wave" width="34%" />
          <Skeleton animation="wave" width="25%" />
        </Stack>
        <Skeleton animation="wave" height={42} sx={{ mt: 1.5 }} />
      </Box>
    </Card>
  );
}

function ProductSkeletonGrid({
  columns,
  count,
  variant,
}: {
  columns: number;
  count: number;
  variant: "editorial" | "wellness" | "marketplace" | "corporate";
}) {
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

function ShopControls({
  storefrontName,
  variant,
  query,
  category,
  sort,
  categories,
  onQueryChange,
  onCategoryChange,
  onSortChange,
}: {
  storefrontName: string;
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
  const hasFilters = category !== "All" || Boolean(query.trim());

  return (
    <Card
      component="form"
      onSubmit={(event) => event.preventDefault()}
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "none",
        mb: 3,
        p: { xs: 1.5, md: 2 },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{ alignItems: { md: "center" } }}
      >
        <TextField
          fullWidth
          label="Search products"
          size="small"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={
            isEditorial && storefrontName === "Wellness Organic"
              ? "Search Santé products"
              : isEditorial
                ? storefrontName === "Premium Beauty"
                  ? "Search beauty, style, and fragrance"
                  : "Search beauty and care products"
                : "Search products, brands, or categories"
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear search"
                    edge="end"
                    onClick={() => onQueryChange("")}
                    size="small"
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
        <TextField
          select
          fullWidth
          label="Category"
          size="small"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          sx={{ minWidth: { md: 205 } }}
        >
          {categories.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label="Sort by"
          size="small"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          sx={{ minWidth: { md: 190 } }}
        >
          <MenuItem value="featured">Product name</MenuItem>
          <MenuItem value="price-low">Price: low to high</MenuItem>
          <MenuItem value="price-high">Price: high to low</MenuItem>
        </TextField>
      </Stack>
      {hasFilters && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", flexWrap: "wrap", mt: 1.5, rowGap: 1 }}
        >
          <Typography color="text.secondary" sx={{ fontSize: 12 }}>
            Showing results for
          </Typography>
          {category !== "All" && (
            <Chip
              label={category}
              onDelete={() => onCategoryChange("All")}
              size="small"
              variant="outlined"
            />
          )}
          {query.trim() && (
            <Chip
              label={`“${query.trim()}”`}
              onDelete={() => onQueryChange("")}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      )}
    </Card>
  );
}

function ShopIntro({
  themeName,
  variant,
  count,
  onBack,
}: {
  themeName: string;
  variant: "editorial" | "wellness" | "marketplace" | "corporate";
  count: number;
  onBack: () => void;
}) {
  if (variant === "editorial") {
    const isPremiumBeauty = themeName === "Premium Beauty";
    const description = isPremiumBeauty
      ? "Explore fragrances, beauty finds, accessories, and style from the current collection."
      : "Browse Santé products currently available in this shop.";

    return (
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ color: "text.secondary" }}
        >
          Store home
        </Button>
        <Typography
          color="primary.main"
          sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em", mt: 3 }}
        >
          {themeName.toUpperCase()} · PRODUCT EDIT
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: { xs: 44, md: 72 },
            fontWeight: 500,
            lineHeight: 1,
            mt: 1,
          }}
        >
          {isPremiumBeauty ? "Shop beauty & style." : `Shop ${themeName}.`}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ lineHeight: 1.8, maxWidth: 560, mx: "auto", mt: 1.5 }}
        >
          {description}
        </Typography>
      </Box>
    );
  }
  if (variant === "marketplace")
    return (
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 3,
          pb: { xs: 2.5, md: 3.5 },
        }}
      >
        <Button
          onClick={onBack}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ color: "text.secondary", mb: 2, pl: 0 }}
        >
          Store home
        </Button>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            alignItems: { sm: "end" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              color="primary.main"
              sx={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em" }}
            >
              TWC MARKETPLACE
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 34, md: 48 },
                fontWeight: 780,
                letterSpacing: "-.055em",
                lineHeight: 1.05,
                mt: 0.5,
              }}
            >
              Shop all products
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.65, mt: 0.75 }}
            >
              Search and filter the current catalog to find what you need.
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", color: "text.secondary" }}
          >
            <FilterAltRoundedIcon fontSize="small" />
            <Typography
              sx={{ color: "text.primary", fontSize: 24, fontWeight: 800 }}
            >
              {count}
            </Typography>
            <Typography sx={{ fontSize: 13 }}>results</Typography>
          </Stack>
        </Stack>
      </Box>
    );
  if (variant === "corporate") {
    return (
      <Stack
        component="section"
        direction={{ xs: "column", md: "row" }}
        sx={{
          alignItems: { md: "end" },
          borderBottom: 1,
          borderColor: "divider",
          justifyContent: "space-between",
          mb: 3.5,
          pb: { xs: 2.5, md: 3.5 },
          gap: 2.5,
        }}
      >
        <Box>
          <Button
            onClick={onBack}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ color: "text.secondary", mb: 1.75, pl: 0 }}
          >
            Store home
          </Button>
          <Typography
            component="h1"
            sx={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: { xs: 38, md: 56 },
              fontWeight: 400,
              letterSpacing: "-.035em",
              lineHeight: 1.06,
            }}
          >
            Explore the collection.
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "baseline", color: "text.secondary" }}
        >
          <Typography
            sx={{
              color: "text.primary",
              fontSize: 24,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count}
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            products in the current catalog
          </Typography>
        </Stack>
      </Stack>
    );
  }
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{
        alignItems: { md: "end" },
        justifyContent: "space-between",
        mb: 4,
        gap: 3,
      }}
    >
      <Box>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ color: "text.secondary", mb: 2, pl: 0 }}
        >
          Store home
        </Button>
        <Typography
          color="primary.main"
          sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}
        >
          WELLNESS COLLECTION
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 42, md: 68 },
            fontWeight: 900,
            letterSpacing: "-.08em",
            lineHeight: 0.95,
            mt: 1,
          }}
        >
          Find your next everyday favorite.
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 16, lineHeight: 1.7, maxWidth: 600, mt: 1.5 }}
        >
          Explore wellness, style, and useful essentials in one calm shopping
          experience.
        </Typography>
      </Box>
      <Card sx={{ bgcolor: "action.hover", minWidth: { md: 210 }, p: 2.5 }}>
        <Typography color="text.secondary" sx={{ fontSize: 12 }}>
          Curated products
        </Typography>
        <Typography color="primary.main" sx={{ fontSize: 34, fontWeight: 900 }}>
          {count}
        </Typography>
      </Card>
    </Stack>
  );
}
