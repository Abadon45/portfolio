"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import TwcProductCard from "./TwcProductCard";
import type { StoreProduct } from "./TwcStoreProvider";
import { useStorefrontMode, useStorefrontTheme } from "./twcEcommerceTheme";

type Props = {
  categories: string[];
  products: StoreProduct[];
  onAdd: (product: StoreProduct) => void;
  onShop: (category?: string) => void;
};

const money = (value: number) =>
  `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function CorporateCommerceHome({
  categories,
  products,
  onAdd,
  onShop,
}: Props) {
  const { mode } = useStorefrontMode();
  const { themeConfig } = useStorefrontTheme();
  const featured = products.slice(0, 4);
  const heroProducts = products.slice(0, 3);
  const dark = mode === "dark";
  const heroBackground = dark
    ? themeConfig.darkSurface
    : themeConfig.heroSurface;
  const heroForeground = dark ? themeConfig.darkText : themeConfig.heroText;
  const heroMuted = dark ? themeConfig.darkMuted : "#526675";

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Box
        component="section"
        aria-labelledby="corporate-home-title"
        sx={{
          bgcolor: heroBackground,
          color: heroForeground,
          overflow: "hidden",
          position: "relative",
          "@keyframes corporate-intro": {
            from: {
              opacity: 0,
              transform: "translateY(18px)",
              filter: "blur(5px)",
            },
            to: { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
          },
          "@media (prefers-reduced-motion: reduce)": {
            "&, & *": {
              animationDuration: "0.01ms !important",
              transitionDuration: "0.01ms !important",
            },
          },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              py: 1.5,
            }}
          >
            <Typography
              sx={{
                color: heroMuted,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".13em",
              }}
            >
              TWC&nbsp; / &nbsp;CORPORATE COMMERCE
            </Typography>
            <Typography
              sx={{
                color: heroMuted,
                display: { xs: "none", sm: "block" },
                fontSize: 11,
              }}
            >
              The shared product catalog
            </Typography>
          </Box>

          <Box
            sx={{
              alignItems: "center",
              display: "grid",
              gap: { xs: 4, md: 8 },
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              minHeight: { md: 520 },
              py: { xs: 5, md: 7 },
            }}
          >
            <Stack
              spacing={2.5}
              sx={{
                animation: "corporate-intro .8s cubic-bezier(.16,1,.3,1) both",
                maxWidth: 650,
              }}
            >
              <Typography
                component="h1"
                id="corporate-home-title"
                sx={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: { xs: 44, sm: 56, md: 74 },
                  fontWeight: 400,
                  letterSpacing: "-.035em",
                  lineHeight: 1.02,
                  maxWidth: 660,
                }}
              >
                A considered way to shop.
              </Typography>
              <Typography
                sx={{
                  color: heroMuted,
                  fontSize: { md: 17 },
                  lineHeight: 1.75,
                  maxWidth: 480,
                }}
              >
                Explore the TWC collection with clear product details, current
                availability, and a straightforward checkout.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                sx={{ pt: 0.5 }}
              >
                <Button
                  onClick={() => onShop()}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ alignSelf: "flex-start", px: 2.25, py: 1.25 }}
                  variant="contained"
                >
                  Explore the collection
                </Button>
                <Button
                  onClick={() =>
                    document
                      .getElementById("corporate-categories")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  sx={{
                    alignSelf: "flex-start",
                    color: heroForeground,
                    px: 2,
                    py: 1.25,
                    "&:hover": {
                      bgcolor: dark
                        ? "rgba(255,255,255,.08)"
                        : "rgba(23,63,95,.08)",
                      color: heroForeground,
                    },
                  }}
                >
                  Browse by category
                </Button>
              </Stack>
            </Stack>

            <Box
              sx={{
                animation:
                  "corporate-intro .9s cubic-bezier(.16,1,.3,1) .12s both",
                display: "grid",
                gap: 1.25,
                gridTemplateColumns: "1.2fr .8fr",
                gridTemplateRows: "repeat(2, minmax(0, 1fr))",
                minHeight: { xs: 300, sm: 380, md: 420 },
              }}
            >
              {heroProducts[0] ? (
                <Box
                  component="button"
                  onClick={() => onShop()}
                  aria-label="Browse the TWC product collection"
                  sx={{
                    bgcolor: "background.paper",
                    border: 0,
                    cursor: "pointer",
                    gridRow: "1 / span 2",
                    minWidth: 0,
                    overflow: "hidden",
                    p: 0,
                    position: "relative",
                    textAlign: "left",
                    "&:hover .corporate-hero-image": {
                      transform: "scale(1.035)",
                    },
                    "&:focus-visible": {
                      outline: "3px solid",
                      outlineColor: "primary.main",
                      outlineOffset: 3,
                    },
                  }}
                >
                  <Box
                    className="corporate-hero-image"
                    component="img"
                    src={heroProducts[0].image}
                    alt={heroProducts[0].name}
                    sx={{
                      height: "100%",
                      inset: 0,
                      objectFit: "contain",
                      p: { xs: 2, md: 3 },
                      position: "absolute",
                      transition: "transform .55s cubic-bezier(.2,.7,.2,1)",
                      width: "100%",
                    }}
                  />
                  <Box
                    sx={{
                      bgcolor: "rgba(13,31,43,.84)",
                      bottom: 0,
                      color: "#fff",
                      left: 0,
                      p: { xs: 1.25, md: 1.75 },
                      position: "absolute",
                      right: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, opacity: 0.8 }}>
                      {heroProducts[0].category}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 13, md: 15 },
                        fontWeight: 650,
                        lineHeight: 1.35,
                        mt: 0.35,
                      }}
                    >
                      {heroProducts[0].name}
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 0.5 }}>
                      {money(heroProducts[0].price)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{ bgcolor: "background.paper", gridRow: "1 / span 2" }}
                />
              )}
              {heroProducts.slice(1).map((product) => (
                <Box
                  key={product.slug}
                  component="button"
                  onClick={() => onShop(product.category)}
                  aria-label={`Browse ${product.category}`}
                  sx={{
                    bgcolor: "background.paper",
                    border: 0,
                    cursor: "pointer",
                    minHeight: 0,
                    minWidth: 0,
                    overflow: "hidden",
                    p: 1,
                    position: "relative",
                    "&:hover .corporate-tile-image": {
                      transform: "scale(1.04)",
                    },
                    "&:focus-visible": {
                      outline: "3px solid",
                      outlineColor: "primary.main",
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Box
                    className="corporate-tile-image"
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{
                      height: "100%",
                      objectFit: "contain",
                      transition: "transform .5s cubic-bezier(.2,.7,.2,1)",
                      width: "100%",
                    }}
                  />
                  <Typography
                    sx={{
                      bgcolor: "rgba(13,31,43,.84)",
                      bottom: 0,
                      color: "#fff",
                      fontSize: 11,
                      left: 0,
                      px: 1,
                      py: 0.75,
                      position: "absolute",
                      right: 0,
                      textAlign: "left",
                    }}
                  >
                    {product.category}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Box
          component="section"
          id="corporate-featured"
          sx={{ py: { xs: 5, md: 8 }, scrollMarginTop: 90 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              alignItems: { sm: "end" },
              justifyContent: "space-between",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                component="h2"
                sx={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: { xs: 30, md: 42 },
                  fontWeight: 400,
                  lineHeight: 1.12,
                }}
              >
                The current collection
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.7, mt: 0.75 }}
              >
                Product details and availability from the shared TWC catalog.
              </Typography>
            </Box>
            <Button
              onClick={() => onShop()}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ alignSelf: "flex-start" }}
            >
              View all products
            </Button>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gap: { xs: 1.5, md: 2.5 },
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
            }}
          >
            {featured.map((product) => (
              <TwcProductCard
                key={product.slug}
                product={product}
                onAdd={() => onAdd(product)}
              />
            ))}
          </Box>
        </Box>

        <Divider />
        <Box
          component="section"
          id="corporate-categories"
          aria-labelledby="corporate-categories-title"
          sx={{ py: { xs: 4, md: 6 }, scrollMarginTop: 90 }}
        >
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
                component="h2"
                id="corporate-categories-title"
                sx={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: { xs: 28, md: 38 },
                  fontWeight: 400,
                }}
              >
                Browse by category
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.7, mt: 0.75 }}
              >
                Choose a department to narrow the collection.
              </Typography>
            </Box>
            <Button
              onClick={() => onShop()}
              endIcon={<ArrowForwardRoundedIcon />}
            >
              All products
            </Button>
          </Stack>
          <Stack divider={<Divider flexItem />} sx={{ mt: 2 }}>
            {categories.slice(0, 8).map((category) => {
              const count = products.filter(
                (product) => product.category === category,
              ).length;
              return (
                <Button
                  key={category}
                  onClick={() => onShop(category)}
                  sx={{
                    alignItems: "center",
                    color: "text.primary",
                    justifyContent: "space-between",
                    minHeight: 58,
                    px: 0.5,
                    textAlign: "left",
                    textTransform: "none",
                    transition: "padding .25s cubic-bezier(.2,.7,.2,1)",
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "primary.main",
                      pl: 1.25,
                      pr: 0.5,
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 650 }}
                  >
                    {category}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1.25}
                    sx={{ alignItems: "center", color: "text.secondary" }}
                  >
                    <Typography component="span" sx={{ fontSize: 12 }}>
                      {count} items
                    </Typography>
                    <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                  </Stack>
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
