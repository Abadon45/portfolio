"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
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
import { createTwcEcommerceTheme, useStorefrontMode, useStorefrontTheme } from "./twcEcommerceTheme";
import TwcStoreFooter from "./TwcStoreFooter";

const money = (value: number) =>
  `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function TwcProductDetailPage({ slug }: { slug: string }) {
  return <ThemedProductDetailPage slug={slug} />;
}

function ThemedProductDetailPage({ slug }: { slug: string }) {
  const router = useRouter();
  const product = products.find((item) => item.slug === slug);
  const { cart, addToCart } = useTwcStore();
  const { toastSuccess } = useTwcAlert();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { themeName } = useStorefrontTheme();
  const { mode, setMode } = useStorefrontMode();
  const theme = useMemo(() => createTwcEcommerceTheme(mode, themeName), [mode, themeName]);
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
        <TwcStoreFooter />
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
  const { themeConfig } = useStorefrontTheme();
  if (themeConfig.productDetailVariant === "editorial") {
    return <EditorialProductDetail product={product} added={added} onAdd={onAdd} onRelatedAdd={onRelatedAdd} />;
  }
  if (themeConfig.productDetailVariant === "conversion") {
    return <MarketplaceProductDetail product={product} added={added} onAdd={onAdd} onRelatedAdd={onRelatedAdd} />;
  }
  if (themeConfig.productDetailVariant === "corporate") {
    return <CorporateProductDetail product={product} added={added} onAdd={onAdd} onRelatedAdd={onRelatedAdd} />;
  }
  if (themeConfig.productDetailVariant === "wellness") {
    return <WellnessProductDetail product={product} added={added} onAdd={onAdd} onRelatedAdd={onRelatedAdd} />;
  }
  const isEditorial = false;
  const isConversion = false;
  const isWellness = true;
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
          border: isEditorial ? 0 : 1,
          borderColor: "divider",
          borderRadius: isEditorial ? 0 : 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: isConversion ? ".8fr 1.2fr" : "1.05fr .95fr" },
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
            bgcolor: isEditorial ? "background.paper" : "action.hover",
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
                bgcolor: isEditorial ? "action.hover" : "background.paper",
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
                fontFamily: isEditorial ? 'Georgia, "Times New Roman", serif' : undefined,
                fontSize: { xs: 32, md: isConversion ? 42 : 50 },
                fontWeight: isEditorial ? 500 : 900,
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
              sx={{ fontSize: { xs: 30, md: 38 }, fontWeight: 900, mt: isConversion ? 1 : 2 }}
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
      {isWellness && <Paper sx={{ bgcolor: "action.hover", border: 0, mt: 3, p: { xs: 2, md: 3 } }}><Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}><Box><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".12em" }}>WHY IT FITS</Typography><Typography sx={{ fontWeight: 800, mt: .5 }}>A considered addition to an everyday routine.</Typography></Box><Typography color="text.secondary" sx={{ maxWidth: 520, lineHeight: 1.7 }}>Explore the product story, features, and specifications below before adding it to your basket.</Typography></Stack></Paper>}
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

type DetailProps = {
  product: (typeof products)[number];
  added: boolean;
  onAdd: (quantity: number) => void;
  onRelatedAdd: (product: (typeof products)[number]) => void;
};

function ProductGallery({ product, editorial = false }: { product: DetailProps["product"]; editorial?: boolean }) {
  const [lightbox, setLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const gallery = product.images.length ? product.images : [product.image];
  const moveImage = (direction: number) => setSelectedImage((current) => (current + direction + gallery.length) % gallery.length);
  return <Box>
    <Box onClick={() => setLightbox(true)} sx={{ alignItems: "center", bgcolor: editorial ? "background.paper" : "action.hover", cursor: "zoom-in", display: "flex", height: { xs: 360, md: editorial ? 650 : 500 }, justifyContent: "center", overflow: "hidden", p: { xs: 2, md: 4 }, position: "relative" }}>
      <Box component="img" src={gallery[selectedImage]} alt={product.name} sx={{ height: "100%", objectFit: "contain", width: "100%" }} />
      {gallery.length > 1 && <><IconButton aria-label="Previous product image" onClick={(event) => { event.stopPropagation(); moveImage(-1); }} sx={{ bgcolor: "rgba(255,255,255,.86)", left: 12, position: "absolute", top: "50%" }}><ArrowBackRoundedIcon fontSize="small" /></IconButton><IconButton aria-label="Next product image" onClick={(event) => { event.stopPropagation(); moveImage(1); }} sx={{ bgcolor: "rgba(255,255,255,.86)", position: "absolute", right: 12, top: "50%" }}><ArrowForwardRoundedIcon fontSize="small" /></IconButton></>}
    </Box>
    {gallery.length > 1 && <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>{gallery.slice(0, 5).map((image, index) => <Box component="button" key={image} onClick={() => setSelectedImage(index)} sx={{ bgcolor: "background.paper", border: 1, borderColor: selectedImage === index ? "primary.main" : "divider", cursor: "pointer", height: 64, p: .5, width: 64 }}><Box component="img" src={image} alt={`${product.name} thumbnail`} sx={{ height: "100%", objectFit: "contain", width: "100%" }} /></Box>)}</Stack>}
    <Dialog open={lightbox} onClose={() => setLightbox(false)} maxWidth="lg" fullWidth><Box sx={{ alignItems: "center", bgcolor: "background.paper", display: "flex", justifyContent: "center", minHeight: { xs: 400, md: 700 }, p: 4, position: "relative" }}><IconButton onClick={() => setLightbox(false)} sx={{ position: "absolute", right: 12, top: 12 }} aria-label="Close product image"><CloseRoundedIcon /></IconButton><Box component="img" src={gallery[selectedImage]} alt={product.name} sx={{ maxHeight: 640, maxWidth: "100%", objectFit: "contain" }} /></Box></Dialog>
  </Box>;
}

function PurchasePanel({ product, added, onAdd, eyebrow = "PRODUCT DETAILS" }: DetailProps & { eyebrow?: string }) {
  const [quantity, setQuantity] = useState(1);
  return <Stack spacing={2.25}>
    <Stack direction="row" spacing={1}><Chip label={product.shop} color="primary" size="small" />{!product.unlimitedStock && <Chip label={`${product.stock} in stock`} color="success" size="small" variant="outlined" />}</Stack>
    <Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>{eyebrow}</Typography>
    <Typography component="h1" sx={{ fontFamily: eyebrow === "THE EDIT" ? 'Georgia, "Times New Roman", serif' : undefined, fontSize: { xs: 34, md: 54 }, fontWeight: eyebrow === "THE EDIT" ? 500 : 900, letterSpacing: "-.07em", lineHeight: 1.02 }}>{product.name}</Typography>
    <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>{product.description}</Typography>
    <Typography color="primary.main" sx={{ fontSize: { xs: 30, md: 38 }, fontWeight: 900 }}>₱{(product.price * quantity).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</Typography>
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Typography color="text.secondary" sx={{ fontSize: 13 }}>Qty</Typography><IconButton disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)} sx={{ border: 1, borderColor: "divider" }} aria-label="Decrease quantity">−</IconButton><Typography sx={{ fontWeight: 900, minWidth: 24, textAlign: "center" }}>{quantity}</Typography><IconButton onClick={() => setQuantity((value) => Math.min(99, value + 1))} sx={{ border: 1, borderColor: "divider" }} aria-label="Increase quantity">+</IconButton></Stack>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}><Button disabled={added} onClick={() => onAdd(quantity)} startIcon={added ? <CheckRoundedIcon /> : <AddShoppingCartRoundedIcon />} size="large" variant="contained">{added ? "Added to cart" : "Add to cart"}</Button><Button disabled={added} onClick={() => onAdd(quantity)} size="large" variant="outlined">Buy now</Button></Stack>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}><Stack direction="row" spacing={.75} sx={{ alignItems: "center" }}><LocalShippingOutlinedIcon color="primary" fontSize="small" /><Typography color="text.secondary" sx={{ fontSize: 12 }}>Nationwide demo delivery</Typography></Stack><Stack direction="row" spacing={.75} sx={{ alignItems: "center" }}><SecurityOutlinedIcon color="primary" fontSize="small" /><Typography color="text.secondary" sx={{ fontSize: 12 }}>Secure offline flow</Typography></Stack></Stack>
  </Stack>;
}

function ProductFacts({ product }: { product: DetailProps["product"] }) {
  return <Stack divider={<Divider flexItem />} spacing={1.5} sx={{ borderTop: 1, borderColor: "divider", mt: 3, pt: 2 }}>{[["Shop", product.shop], ["Category", product.category], ["Availability", product.unlimitedStock ? "Available for demo" : `${product.stock} units`], ["Delivery", "Calculated at checkout"]].map(([label, value]) => <Stack direction="row" key={label} sx={{ justifyContent: "space-between", gap: 2 }}><Typography color="text.secondary" sx={{ fontSize: 13 }}>{label}</Typography><Typography sx={{ fontSize: 13, fontWeight: 800, textAlign: "right" }}>{value}</Typography></Stack>)}</Stack>;
}

function RelatedProducts({ product, onAdd }: { product: DetailProps["product"]; onAdd: DetailProps["onRelatedAdd"] }) {
  const related = products.filter((item) => item.slug !== product.slug && item.category === product.category).slice(0, 4);
  const router = useRouter();
  if (!related.length) return null;
  return <Box sx={{ mt: { xs: 6, md: 10 } }}><Stack direction="row" sx={{ alignItems: "end", justifyContent: "space-between", mb: 2 }}><Box><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>COMPLETE THE COLLECTION</Typography><Typography component="h2" sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 900, letterSpacing: "-.06em", mt: .5 }}>More from {product.category}</Typography></Box><Button onClick={() => router.push("/twc-ecommerce/shop")}>View all</Button></Stack><Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" } }}>{related.map((item) => <TwcProductCard key={item.slug} product={item} onAdd={() => onAdd(item)} />)}</Box></Box>;
}

function EditorialProductDetail(props: DetailProps) {
  const router = useRouter();
  return <Container maxWidth="lg" sx={{ py: { xs: 3, md: 7 } }}><Button onClick={() => router.push("/twc-ecommerce/shop")} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "text.secondary", mb: 3 }}>Back to the edit</Button><Box sx={{ display: "grid", gap: { xs: 4, md: 9 }, gridTemplateColumns: { xs: "1fr", md: "1.15fr .85fr" } }}><ProductGallery editorial product={props.product} /><Box sx={{ alignSelf: "center" }}><PurchasePanel {...props} eyebrow="THE EDIT" /><Typography color="text.secondary" sx={{ borderLeft: 2, borderColor: "primary.main", lineHeight: 1.8, mt: 4, pl: 2 }}>A considered addition to a slower, more intentional daily ritual.</Typography></Box></Box><Paper sx={{ bgcolor: "background.paper", borderTop: 1, borderColor: "divider", borderRadius: 0, mt: { xs: 7, md: 12 }, p: { xs: 2.5, sm: 3.5, md: 5 } }}><Typography component="h2" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: 30, md: 44 }, fontWeight: 500 }}>The story behind the choice.</Typography><Divider sx={{ borderColor: "divider", my: { xs: 2, md: 3 } }} /><Typography color="text.secondary" sx={{ lineHeight: 1.9, maxWidth: 720, whiteSpace: "pre-line" }}>{props.product.details || props.product.description}</Typography></Paper><RelatedProducts product={props.product} onAdd={props.onRelatedAdd} /></Container>;
}

function MarketplaceProductDetail(props: DetailProps) {
  const router = useRouter();
  return <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}><Button onClick={() => router.push("/twc-ecommerce/shop")} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "text.secondary", mb: 2 }}>Back to results</Button><Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: ".9fr 1.1fr" } }}><Paper sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: { xs: 1, md: 2 } }}><ProductGallery product={props.product} /></Paper><Paper sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: { xs: 2, md: 4 } }}><PurchasePanel {...props} eyebrow="FAST CHECKOUT" /><ProductFacts product={props.product} /></Paper></Box><RelatedProducts product={props.product} onAdd={props.onRelatedAdd} /></Container>;
}

function WellnessProductDetail(props: DetailProps) {
  const router = useRouter();
  return <Container maxWidth="xl" sx={{ py: { xs: 3, md: 7 } }}><Breadcrumbs sx={{ mb: 3 }}><Button onClick={() => router.push("/twc-ecommerce/shop")} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "text.secondary", pl: 0 }}>Wellness shop</Button><Typography color="text.primary" noWrap sx={{ maxWidth: 360, fontWeight: 800 }}>{props.product.name}</Typography></Breadcrumbs><Box sx={{ display: "grid", gap: { xs: 3, lg: 6 }, gridTemplateColumns: { xs: "1fr", lg: "1.05fr .95fr" } }}><Box><ProductGallery product={props.product} /><Box sx={{ bgcolor: "#e5efe2", mt: 2, p: { xs: 2, md: 3 } }}><Typography sx={{ color: "#347153", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>HOW IT FITS</Typography><Typography sx={{ color: "#173b27", fontSize: 20, fontWeight: 850, mt: .5 }}>A practical addition to an everyday routine.</Typography><Typography sx={{ color: "#496653", lineHeight: 1.7, mt: 1 }}>Explore this product as part of your own routine. This demo description is intentionally general and does not make medical or performance claims.</Typography></Box></Box><Paper sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 0, p: { xs: 2.5, md: 5 } }}><PurchasePanel {...props} eyebrow="WELLNESS COLLECTION" /><ProductFacts product={props.product} /></Paper></Box><Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, mt: { xs: 5, md: 8 } }}><Paper sx={{ bgcolor: "#f0e8dc", borderRadius: 0, p: { xs: 2.5, md: 4 } }}><Typography sx={{ color: "#9a6634", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>PRODUCT DESCRIPTION</Typography><Typography component="h2" sx={{ color: "#3d352c", fontSize: 28, fontWeight: 850, mt: 1 }}>What to know before you choose.</Typography><Typography sx={{ color: "#665e54", lineHeight: 1.85, mt: 1.5, whiteSpace: "pre-line" }}>{props.product.description}</Typography></Paper><Paper sx={{ bgcolor: "#fff", border: 1, borderColor: "divider", borderRadius: 0, p: { xs: 2.5, md: 4 } }}><Typography sx={{ color: "#347153", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>PRODUCT DETAILS</Typography><Typography component="h2" sx={{ color: "#173b27", fontSize: 28, fontWeight: 850, mt: 1 }}>Simple, useful context.</Typography><Typography sx={{ color: "#607467", lineHeight: 1.85, mt: 1.5, whiteSpace: "pre-line" }}>{props.product.details || "Product details are presented from the shared TWC catalog fixture."}</Typography></Paper></Box><RelatedProducts product={props.product} onAdd={props.onRelatedAdd} /></Container>;
}

function CorporateProductDetail(props: DetailProps) {
  const router = useRouter();
  return <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}><Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: { md: "end" }, justifyContent: "space-between", mb: 3, gap: 2 }}><Box><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>CORPORATE COLLECTIONS</Typography><Typography component="h1" sx={{ fontSize: { xs: 34, md: 52 }, fontWeight: 900, letterSpacing: "-.07em", mt: .5 }}>Product specification</Typography></Box><Button onClick={() => router.push("/twc-ecommerce/shop")} startIcon={<ArrowBackRoundedIcon />}>Back to catalog</Button></Stack><Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr .9fr" } }}><ProductGallery product={props.product} /><Paper sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: { xs: 2, md: 4 } }}><PurchasePanel {...props} eyebrow="PRODUCT BRIEF" /><ProductFacts product={props.product} /></Paper></Box><Paper sx={{ border: 1, borderColor: "divider", borderRadius: 1, mt: 3, p: { xs: 2, md: 4 } }}><Typography component="h2" sx={{ fontSize: 26, fontWeight: 900 }}>Details and specifications</Typography><Divider sx={{ my: 2 }} /><Typography color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: "pre-line" }}>{props.product.details || props.product.description}</Typography></Paper><RelatedProducts product={props.product} onAdd={props.onRelatedAdd} /></Container>;
}
