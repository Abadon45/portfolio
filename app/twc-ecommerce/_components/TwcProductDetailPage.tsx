"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  Container,
  CssBaseline,
  Dialog,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FloatingHomeButton } from "../../components/FloatingHomeButton";
import { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";
import TwcCartDrawer from "./TwcCartDrawer";
import TwcEshopNavbar from "./TwcEshopNavbar";
import TwcProductCard from "./TwcProductCard";
import { products, useTwcStore } from "./TwcStoreProvider";
import { createTwcEcommerceTheme } from "./twcEcommerceTheme";

const money = (value: number) =>
  `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function TwcProductDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const product = products.find((item) => item.slug === slug);
  const { cart, addToCart } = useTwcStore();
  const { toastSuccess } = useTwcAlert();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = useMemo(() => createTwcEcommerceTheme(mode), [mode]);
  if (!product)
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{ py: 10, textAlign: "center" }}>
          <Typography component="h1" sx={{ fontSize: 42, fontWeight: 900 }}>
            Product not found
          </Typography>
          <Button
            onClick={() => router.push("/twc-ecommerce/shop")}
            sx={{ mt: 3 }}
            variant="contained"
          >
            Back to shop
          </Button>
          <FloatingHomeButton />
        </Container>
      </ThemeProvider>
    );
  const added = cart.some((line) => line.product.slug === product.slug);
  const add = (quantity: number) => {
    addToCart(product);
    for (let index = 1; index < quantity; index += 1) addToCart(product);
    toastSuccess(`${product.name} added to your basket`);
    setDrawerOpen(true);
  };
  const addRelated = (item: (typeof products)[number]) => {
    addToCart(item);
    toastSuccess(`${item.name} added to your basket`);
    setDrawerOpen(true);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
        }}
      >
        <TwcEshopNavbar
          count={cart.reduce((sum, line) => sum + line.quantity, 0)}
          mode={mode}
          onCart={() => setDrawerOpen(true)}
          onToggleMode={() =>
            setMode((value) => (value === "dark" ? "light" : "dark"))
          }
        />
        <TwcCartDrawer onClose={() => setDrawerOpen(false)} open={drawerOpen} />
        <ProductDetail
          product={product}
          added={added}
          onAdd={add}
          onRelatedAdd={addRelated}
        />
        <FloatingHomeButton />
      </Box>
    </ThemeProvider>
  );
}

function ProductDetail({
  product,
  added,
  onAdd,
  onRelatedAdd,
}: {
  product: (typeof products)[number];
  added: boolean;
  onAdd: (quantity: number) => void;
  onRelatedAdd: (product: (typeof products)[number]) => void;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [tab, setTab] = useState(0);
  const gallery = product.images.length ? product.images : [product.image];
  const related = products
    .filter(
      (item) =>
        item.slug !== product.slug && item.category === product.category,
    )
    .slice(0, 4);
  const tabText =
    tab === 0
      ? product.description
      : product.details ||
        (tab === 1
          ? "Designed for everyday use with a considered balance of function, quality, and comfort."
          : "Demo product · standard shipping · simulated inventory");
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Button
          onClick={() => router.push("/twc-ecommerce/shop")}
          startIcon={<ArrowBackRoundedIcon />}
          size="small"
          sx={{ color: "text.secondary", pl: 0 }}
        >
          Back to shop
        </Button>
        <Typography
          color="text.primary"
          noWrap
          sx={{ maxWidth: 360, fontWeight: 800 }}
        >
          {product.name}
        </Typography>
      </Breadcrumbs>
      <Paper
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.05fr .95fr" },
          }}
        >
          <Box sx={{ bgcolor: "action.hover", p: { xs: 2, md: 4 } }}>
            <Box
              onClick={() => setLightbox(true)}
              sx={{
                alignItems: "center",
                bgcolor: "background.paper",
                borderRadius: 3,
                cursor: "zoom-in",
                display: "flex",
                height: { xs: 360, sm: 520 },
                justifyContent: "center",
                overflow: "hidden",
                p: 3,
                position: "relative",
              }}
            >
              <Chip
                label="Tap to zoom"
                size="small"
                sx={{
                  bgcolor: "action.hover",
                  left: 16,
                  position: "absolute",
                  top: 16,
                }}
              />
              <Box
                component="img"
                src={gallery[0]}
                alt={product.name}
                sx={{
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform .3s",
                  width: "100%",
                  "&:hover": { transform: "scale(1.04)" },
                }}
              />
            </Box>
            {gallery.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                {gallery.slice(0, 5).map((image) => (
                  <Box
                    key={image}
                    sx={{
                      bgcolor: "background.paper",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 2,
                      height: 68,
                      p: 0.5,
                      width: 68,
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt="Product thumbnail"
                      sx={{
                        height: "100%",
                        objectFit: "contain",
                        width: "100%",
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
          <Box
            sx={{
              p: { xs: 2.5, md: 5 },
              position: { lg: "sticky" },
              top: { lg: 90 },
              alignSelf: "start",
            }}
          >
            <Stack direction="row" spacing={1}>
              <Chip label={product.shop} color="primary" size="small" />
              {!product.unlimitedStock && (
                <Chip
                  label={`${product.stock} in stock`}
                  color="success"
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 32, md: 50 },
                fontWeight: 900,
                letterSpacing: "-.07em",
                lineHeight: 1.03,
                mt: 2,
              }}
            >
              {product.name}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: 16, lineHeight: 1.8, mt: 2 }}
            >
              {product.description}
            </Typography>
            <Typography
              color="primary.main"
              sx={{ fontSize: { xs: 30, md: 38 }, fontWeight: 900, mt: 2 }}
            >
              {money(product.price * quantity)}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", mt: 2 }}
            >
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Quantity
              </Typography>
              <IconButton
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => value - 1)}
                sx={{ border: 1, borderColor: "divider" }}
              >
                −
              </IconButton>
              <Typography
                sx={{ fontWeight: 900, minWidth: 24, textAlign: "center" }}
              >
                {quantity}
              </Typography>
              <IconButton
                onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                sx={{ border: 1, borderColor: "divider" }}
              >
                +
              </IconButton>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Button
                disabled={added}
                onClick={() => onAdd(quantity)}
                startIcon={
                  added ? <CheckRoundedIcon /> : <AddShoppingCartRoundedIcon />
                }
                size="large"
                variant="contained"
              >
                {added ? "Added to cart" : "Add to cart"}
              </Button>
              <Button
                disabled={added}
                onClick={() => onAdd(quantity)}
                size="large"
                variant="outlined"
              >
                Buy now
              </Button>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              sx={{ borderTop: 1, borderColor: "divider", mt: 3, pt: 2 }}
            >
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: "center" }}
              >
                <LocalShippingOutlinedIcon color="primary" fontSize="small" />
                <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                  Nationwide demo delivery
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: "center" }}
              >
                <SecurityOutlinedIcon color="primary" fontSize="small" />
                <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                  Secure offline flow
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Paper>
      <Paper
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 4,
          mt: 3,
          p: { xs: 2, md: 4 },
        }}
      >
        <Typography component="h2" sx={{ fontSize: 26, fontWeight: 900 }}>
          Everything you need to know.
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="scrollable"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mt: 2,
            "& .MuiTab-root": { fontWeight: 800, textTransform: "none" },
          }}
        >
          <Tab label="Description" />
          <Tab label="Features" />
          <Tab label="Specifications" />
        </Tabs>
        <Typography
          sx={{
            color: "text.secondary",
            lineHeight: 1.9,
            maxWidth: 900,
            py: 3,
            whiteSpace: "pre-line",
          }}
        >
          {tabText}
        </Typography>
      </Paper>
      {related.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Stack
            direction="row"
            sx={{ alignItems: "end", justifyContent: "space-between", mb: 2 }}
          >
            <Box>
              <Typography
                color="primary.main"
                sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}
              >
                YOU MAY ALSO LIKE
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontSize: 30,
                  fontWeight: 900,
                  letterSpacing: "-.05em",
                  mt: 0.5,
                }}
              >
                More from {product.category}
              </Typography>
            </Box>
            <Button onClick={() => router.push("/twc-ecommerce/shop")}>
              View all
            </Button>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(4, minmax(0, 1fr))",
              },
            }}
          >
            {related.map((item) => (
              <TwcProductCard
                key={item.slug}
                product={item}
                onAdd={() => onRelatedAdd(item)}
              />
            ))}
          </Box>
        </Box>
      )}
      <Dialog
        open={lightbox}
        onClose={() => setLightbox(false)}
        maxWidth="lg"
        fullWidth
      >
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "background.paper",
            display: "flex",
            justifyContent: "center",
            minHeight: { xs: 400, md: 700 },
            p: 4,
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setLightbox(false)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseRoundedIcon />
          </IconButton>
          <Box
            component="img"
            src={gallery[0]}
            alt={product.name}
            sx={{ maxHeight: 640, maxWidth: "100%", objectFit: "contain" }}
          />
        </Box>
      </Dialog>
    </Container>
  );
}
