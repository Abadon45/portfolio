"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import NextLink from "next/link";
import {
  Box,
  Button,
  Container,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { useTwcStore, type StoreProduct } from "./TwcStoreProvider";
import {
  santeProductImage,
  selectSanteCategories,
  selectSanteProducts,
} from "./storefrontContent";
import { santeFlyerFont } from "./santeTypography";

const money = (value: number) =>
  "₱" +
  value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
  });

export default function SanteHome({
  onAdd,
  onShop,
}: {
  onAdd: (product: StoreProduct) => void;
  onShop: (category?: string) => void;
}) {
  const { cart, products } = useTwcStore();
  const categories = selectSanteCategories(products);
  const featuredProducts = selectSanteProducts(products).slice(0, 2);
  const categoryNames = categories.map((category) => category.label);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        overflow: "hidden",
      }}
    >
      <Box
        component="section"
        aria-labelledby="sante-hero-title"
        sx={{
          alignItems: { md: "center" },
          backgroundImage:
            "url('/images/twc/sante/sante-flyer-wall-texture.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr .9fr" },
          minHeight: { xs: 620, sm: 660, md: "66svh" },
          px: { xs: 2.5, sm: 5, lg: "9vw" },
          py: { xs: 6, md: 0 },
          position: "relative",
          "&::before": {
            bgcolor: "rgba(243, 233, 224, .10)",
            content: '""',
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
          },
        }}
      >
        <Box
          sx={{
            alignSelf: { md: "start" },
            maxWidth: 760,
            mt: { md: 2 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            className={santeFlyerFont.className}
            id="sante-hero-title"
            component="h1"
            sx={{
              color: "#183826",
              fontSize: { xs: 66, sm: 104, md: 132, lg: 160 },
              fontWeight: 500,
              letterSpacing: "-.035em",
              lineHeight: 0.88,
              maxWidth: "100%",
              textWrap: "balance",
            }}
          >
            Everyday
            <br />
            wellness
          </Typography>
        </Box>

        <Stack
          spacing={2.25}
          sx={{
            alignSelf: "center",
            bgcolor: "background.paper",
            boxShadow: "4px 9px 24px rgba(24, 56, 38, .14)",
            justifySelf: { md: "end" },
            maxWidth: 410,
            p: { xs: 2.5, sm: 3.5 },
            position: "relative",
            width: "100%",
            zIndex: 1,
          }}
        >
          <Typography
            className={santeFlyerFont.className}
            component="p"
            sx={{
              fontSize: 26,
              lineHeight: 1.1,
            }}
          >
            Get to know Wellness Organic.
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Start with the Santé range, then browse the products and categories
            available in the shop.
          </Typography>
          <Button
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => onShop()}
            sx={{
              alignSelf: "flex-start",
              minHeight: 48,
              px: 2.25,
            }}
            variant="contained"
          >
            Explore Santé products
          </Button>
        </Stack>
      </Box>

      <Container
        maxWidth="xl"
        sx={{ px: { xs: 2.5, sm: 4, lg: "6.75vw" }, py: { xs: 3, md: 2.5 } }}
      >
        <Box
          id="bestsellers"
          component="section"
          aria-labelledby="sante-products-title"
          sx={{ scrollMarginTop: 84 }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "baseline",
              borderBottom: 1,
              borderColor: "divider",
              justifyContent: "space-between",
              mb: 1.5,
              pb: 1,
            }}
          >
            <Typography
              className={santeFlyerFont.className}
              id="sante-products-title"
              component="h2"
              sx={{
                fontSize: { xs: 28, md: 34 },
                fontWeight: 500,
              }}
            >
              Shop Santé
            </Typography>
            <Button
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => onShop()}
              sx={{ color: "text.primary", minWidth: 0, px: 0.5 }}
            >
              View all
            </Button>
          </Stack>

          {featuredProducts.length ? (
            <Box
              aria-label="Featured Santé products"
              sx={{
                display: "grid",
                gap: { xs: 1, md: 3 },
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
              }}
            >
              {featuredProducts.map((product) => (
                <SanteProductRow
                  key={product.slug}
                  added={cart.some(
                    (line) => line.product.slug === product.slug,
                  )}
                  onAdd={() => onAdd(product)}
                  product={product}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ py: 4 }}>
              <Typography color="text.secondary">
                Santé products are not available in the catalog right now.
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          id="story"
          component="section"
          aria-labelledby="sante-story-title"
          sx={{
            alignItems: { md: "center" },
            borderTop: 1,
            borderColor: "divider",
            display: "grid",
            gap: { xs: 2, md: 6 },
            gridTemplateColumns: { xs: "1fr", md: ".9fr 1.1fr" },
            mt: { xs: 5, md: 8 },
            py: { xs: 4, md: 6 },
            scrollMarginTop: 84,
          }}
        >
          <Typography
            className={santeFlyerFont.className}
            id="sante-story-title"
            component="h2"
            sx={{
              fontSize: { xs: 42, md: 64 },
              fontWeight: 500,
              lineHeight: 0.98,
              maxWidth: 520,
            }}
          >
            The Santé story starts with barley.
          </Typography>
          <Stack spacing={2} sx={{ maxWidth: 620 }}>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Santé’s brand site presents Santé Barley as its flagship wellness
              line. Explore the available pack sizes, then browse the other
              Santé categories in this shop.
            </Typography>
            {categoryNames.length > 0 && (
              <Typography sx={{ fontWeight: 650, lineHeight: 1.7 }}>
                In this shop: {categoryNames.join(" · ")}.
              </Typography>
            )}
            <Button
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => {
                document
                  .getElementById("collections")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              sx={{ alignSelf: "flex-start", px: 0 }}
            >
              Browse product lines
            </Button>
          </Stack>
        </Box>

        <Box
          id="collections"
          component="section"
          aria-labelledby="sante-collections-title"
          sx={{ py: { xs: 2, md: 4 }, scrollMarginTop: 84 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              alignItems: { sm: "baseline" },
              justifyContent: "space-between",
              gap: 1,
              mb: 2.5,
            }}
          >
            <Typography
              className={santeFlyerFont.className}
              id="sante-collections-title"
              component="h2"
              sx={{
                fontSize: { xs: 34, md: 44 },
                fontWeight: 500,
              }}
            >
              Browse by product line
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Choose a category to narrow the catalog.
            </Typography>
          </Stack>

          {categories.length ? (
            <Box
              sx={{
                display: "grid",
                gap: { xs: 1.5, sm: 2, lg: 3 },
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
              }}
            >
              {categories.map((category) => (
                <MuiLink
                  component="button"
                  key={category.query}
                  onClick={() => onShop(category.query)}
                  underline="none"
                  sx={{
                    color: "text.primary",
                    display: "block",
                    minWidth: 0,
                    p: 0,
                    textAlign: "left",
                    "&:hover img": { transform: "scale(1.03)" },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: 3,
                    },
                  }}
                  type="button"
                >
                  <Box
                    sx={{
                      bgcolor: "action.hover",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={category.image}
                      alt=""
                      loading="lazy"
                      sx={{
                        aspectRatio: "1 / 1",
                        display: "block",
                        objectFit: "contain",
                        p: { xs: 1, md: 1.5 },
                        transition: "transform 220ms ease-out",
                        width: "100%",
                        "@media (prefers-reduced-motion: reduce)": {
                          transition: "none",
                        },
                      }}
                    />
                  </Box>
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      borderBottom: 1,
                      borderColor: "divider",
                      justifyContent: "space-between",
                      py: 1,
                    }}
                  >
                    <Typography component="span" sx={{ fontWeight: 650 }}>
                      {category.label}
                    </Typography>
                    <ArrowForwardRoundedIcon
                      aria-hidden="true"
                      sx={{ color: "primary.main", fontSize: 17 }}
                    />
                  </Stack>
                </MuiLink>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">
              Product lines will appear here when Santé products are available.
            </Typography>
          )}
        </Box>

        <Divider sx={{ mt: { xs: 5, md: 8 } }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            alignItems: { sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
            py: 2,
          }}
        >
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            Product names, images, and prices follow the current catalog.
          </Typography>
          <Button
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => onShop()}
          >
            Visit the Santé shop
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

function SanteProductRow({
  product,
  added,
  onAdd,
}: {
  product: StoreProduct;
  added: boolean;
  onAdd: () => void;
}) {
  return (
    <Box
      sx={{
        alignItems: "center",
        borderBottom: { xs: 1, md: 0 },
        borderColor: "divider",
        display: "grid",
        gap: { xs: 1.5, sm: 2.5 },
        gridTemplateColumns: {
          xs: "145px minmax(0, 1fr)",
          sm: "190px minmax(0, 1fr)",
          lg: "250px minmax(0, 1fr)",
        },
        minWidth: 0,
        pb: { xs: 1.5, md: 0 },
        pt: { xs: 1, md: 0 },
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          height: { xs: 142, sm: 164, lg: 184 },
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <Box
          component="img"
          src={santeProductImage(product)}
          alt={product.name}
          loading="lazy"
          sx={{
            height: { xs: 190, sm: 225, lg: 260 },
            left: "50%",
            maxWidth: "none",
            objectFit: "contain",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 190, sm: 225, lg: 260 },
          }}
        />
      </Box>
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".045em",
            textTransform: "uppercase",
          }}
        >
          {product.brand || product.category}
        </Typography>
        <MuiLink
          className={santeFlyerFont.className}
          component={NextLink}
          href={"/twc-ecommerce/shop/" + product.slug}
          underline="hover"
          sx={{
            color: "text.primary",
            fontSize: { xs: 19, sm: 22 },
            lineHeight: 1.08,
            textWrap: "balance",
          }}
        >
          {product.name}
        </MuiLink>
        <Typography sx={{ fontSize: 16, fontWeight: 750, mt: 0.25 }}>
          {money(product.price)}
        </Typography>
        <Button
          disabled={added}
          onClick={onAdd}
          startIcon={
            added ? <CheckRoundedIcon /> : <AddShoppingCartRoundedIcon />
          }
          sx={{
            alignSelf: "flex-start",
            mt: 0.5,
            minHeight: 40,
            px: 1.5,
          }}
          variant="contained"
        >
          {added ? "Added to basket" : "Add to basket"}
        </Button>
      </Stack>
    </Box>
  );
}
