"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Box, Button, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import type { StoreProduct } from "./TwcStoreProvider";
import TwcProductCard from "./TwcProductCard";

type Props = {
  categories: string[];
  products: StoreProduct[];
  onAdd: (product: StoreProduct) => void;
  onShop: (category?: string) => void;
};

const categoryDescriptions: Record<string, string> = {
  bundle: "Ready-made combinations for a simpler starting point.",
  bags: "Practical carry pieces for work, travel, and everyday use.",
  "sante beauty skin care": "Personal care essentials for a considered routine.",
};

export default function CorporateCommerceHome({ categories, products, onAdd, onShop }: Props) {
  const featured = products[0];

  return (
    <>
      <CorporateHero onShop={onShop} />
      <CorporateTrust />
      {featured && <CorporateFeatured product={featured} onAdd={onAdd} onShop={onShop} />}
      <CorporateCategories categories={categories} onShop={onShop} />
      <Container maxWidth="xl">
        <CorporateCollection products={products} onAdd={onAdd} onShop={onShop} />
        <CorporateStory onShop={onShop} />
        <CorporateOperatingModel />
        <CorporateFaq />
        <CorporateCta onShop={onShop} />
      </Container>
    </>
  );
}

function CorporateHero({ onShop }: { onShop: (category?: string) => void }) {
  return (
    <Box sx={{ bgcolor: "#122735", color: "#fff", overflow: "hidden", position: "relative" }}>
      <Box sx={{ border: "1px solid rgba(255,255,255,.12)", borderRadius: "50%", height: 620, position: "absolute", right: { xs: -260, md: -120 }, top: -250, width: 620 }} />
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        <Stack direction="row" sx={{ alignItems: "center", borderBottom: "1px solid rgba(255,255,255,.16)", justifyContent: "space-between", py: 1.5 }}>
          <Typography sx={{ color: "#b9cddd", fontSize: 10, fontWeight: 900, letterSpacing: ".18em" }}>TWC / CORPORATE COMMERCE</Typography>
          <Typography sx={{ color: "rgba(255,255,255,.55)", display: { xs: "none", sm: "block" }, fontSize: 10, letterSpacing: ".08em" }}>PORTFOLIO SYSTEM 04</Typography>
        </Stack>
        <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1.15fr .85fr" }, minHeight: { md: 590 }, py: { xs: 5, md: 8 } }}>
          <Stack spacing={2.5} sx={{ alignSelf: "center", maxWidth: 700 }}>
            <Typography sx={{ color: "#d3a34f", fontSize: 12, fontWeight: 900, letterSpacing: ".16em" }}>THE PRODUCT REGISTER</Typography>
            <Typography component="h1" sx={{ fontSize: { xs: 50, md: 88 }, fontWeight: 900, letterSpacing: "-.09em", lineHeight: .88, maxWidth: 720 }}>A better way to put commerce to work.</Typography>
            <Typography sx={{ color: "rgba(255,255,255,.7)", fontSize: { md: 17 }, lineHeight: 1.8, maxWidth: 520 }}>A disciplined storefront for browsing, comparing, and ordering everyday products through one connected commerce engine.</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1 }}>
              <Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: "flex-start", bgcolor: "#d3a34f", color: "#122735", px: 2.5 }} variant="contained">Explore the register</Button>
              <Button onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })} sx={{ alignSelf: "flex-start", borderColor: "rgba(255,255,255,.35)", color: "#fff" }} variant="outlined">See the model</Button>
            </Stack>
          </Stack>
          <Stack spacing={1.5} sx={{ alignSelf: "center" }}>
            <Box sx={{ bgcolor: "#e8eef3", p: { xs: 1.5, md: 2 }, transform: { md: "rotate(2deg)" } }}>
              <Box component="img" src="/images/twc/marketplace-hero-a.png" alt="TWC product assortment" sx={{ display: "block", height: { xs: 250, md: 330 }, objectFit: "cover", width: "100%" }} />
            </Box>
            <Stack direction="row" sx={{ gap: 1.5, justifyContent: "space-between" }}>
              {[['01', 'Browse'], ['02', 'Compare'], ['03', 'Order']].map(([number, label]) => <Box key={number} sx={{ borderTop: 1, borderColor: "rgba(255,255,255,.25)", flex: 1, pt: 1 }}><Typography sx={{ color: "#d3a34f", fontSize: 11, fontWeight: 900 }}>{number}</Typography><Typography sx={{ fontSize: 13, fontWeight: 800, mt: .35 }}>{label}</Typography></Box>)}
            </Stack>
          </Stack>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ borderTop: "1px solid rgba(255,255,255,.16)", gap: { xs: 2, sm: 0 }, justifyContent: "space-between", py: 2 }}>
          <Typography sx={{ color: "rgba(255,255,255,.6)", fontSize: 12 }}>One engine · Four storefront identities</Typography>
          <Typography sx={{ color: "#b9cddd", fontSize: 12 }}>Offline demo · Shared cart · Simulated checkout</Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function CorporateTrust() {
  const items = [
    [<VerifiedOutlinedIcon key="verified" />, "Shared commerce engine", "Products, cart, checkout, and order state stay connected."],
    [<LocalShippingOutlinedIcon key="shipping" />, "Clear delivery flow", "Shipping is calculated transparently in the demo checkout."],
    [<SupportAgentOutlinedIcon key="support" />, "Designed to explain", "Every section has a job: orient, compare, decide, or continue."],
  ];
  return <Container maxWidth="xl"><Box sx={{ borderBottom: 1, borderColor: "divider", display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, py: { xs: 3, md: 4 } }}>{items.map(([icon, title, copy]) => <Stack key={String(title)} direction="row" spacing={1.5}><Box sx={{ color: "primary.main", pt: .25 }}>{icon}</Box><Box><Typography sx={{ fontSize: 14, fontWeight: 900 }}>{title}</Typography><Typography color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.6, mt: .35 }}>{copy}</Typography></Box></Stack>)}</Box></Container>;
}

function CorporateFeatured({ product, onAdd, onShop }: { product: StoreProduct; onAdd: (product: StoreProduct) => void; onShop: () => void }) {
  return <Box sx={{ bgcolor: "#173044", color: "#fff", py: { xs: 5, md: 8 } }}><Container maxWidth="xl"><Box sx={{ display: "grid", gap: { xs: 3, md: 7 }, gridTemplateColumns: { xs: "1fr", md: ".9fr 1.1fr" }, alignItems: "center" }}><Box component="img" src={product.image} alt={product.name} sx={{ bgcolor: "#f1f4f6", display: "block", height: { xs: 280, md: 390 }, objectFit: "contain", p: 3, width: "100%" }} /><Stack spacing={2} sx={{ maxWidth: 560 }}><Typography sx={{ color: "#b9cddd", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>FEATURED PRODUCT</Typography><Typography component="h2" sx={{ fontSize: { xs: 32, md: 52 }, fontWeight: 900, letterSpacing: "-.06em", lineHeight: 1 }}>{product.name}</Typography><Typography sx={{ color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>{product.description}</Typography><Typography sx={{ fontSize: 24, fontWeight: 900 }}>₱{product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</Typography><Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}><Button onClick={() => onAdd(product)} sx={{ bgcolor: "#fff", color: "#173044", alignSelf: "flex-start" }} variant="contained">Add to basket</Button><Button onClick={onShop} sx={{ borderColor: "#b9cddd", color: "#fff", alignSelf: "flex-start" }} variant="outlined">View catalog</Button></Stack></Stack></Box></Container></Box>;
}

function CorporateCategories({ categories, onShop }: { categories: string[]; onShop: (category?: string) => void }) {
  return <Box id="collections" sx={{ bgcolor: "background.paper", py: { xs: 6, md: 9 }, scrollMarginTop: 90 }}><Container maxWidth="xl"><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>COLLECTIONS</Typography><Typography component="h2" sx={{ color: "text.primary", fontSize: { xs: 34, md: 52 }, fontWeight: 900, letterSpacing: "-.07em", mt: .75 }}>Organized for confident browsing.</Typography><Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, mt: 4 }}>{categories.slice(0, 8).map((category) => { const label = category.replace(/[-_]/g, " "); const description = categoryDescriptions[label.toLowerCase()] ?? "A focused part of the TWC catalog, ready to explore."; return <Paper key={category} onClick={() => onShop(category)} sx={{ bgcolor: "background.default", border: 1, borderColor: "divider", borderRadius: 0, cursor: "pointer", minHeight: 180, p: { xs: 2.5, md: 3 }, transition: "border-color .2s, transform .2s", "&:hover": { borderColor: "primary.main", transform: "translateY(-3px)" } }}><Typography color="primary.main" sx={{ fontSize: 12, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase" }}>CATEGORY {String(categories.indexOf(category) + 1).padStart(2, "0")}</Typography><Typography sx={{ color: "text.primary", fontSize: 22, fontWeight: 900, mt: 4 }}>{label}</Typography><Typography color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.6, mt: 1 }}>{description}</Typography><Typography color="primary.main" sx={{ fontSize: 13, fontWeight: 800, mt: 2 }}>Explore <ArrowForwardRoundedIcon sx={{ fontSize: 15, verticalAlign: "middle" }} /></Typography></Paper>; })}</Box></Container></Box>;
}

function CorporateCollection({ products, onAdd, onShop }: { products: StoreProduct[]; onAdd: (product: StoreProduct) => void; onShop: () => void }) {
  return <Box id="products" sx={{ py: { xs: 6, md: 10 }, scrollMarginTop: 90 }}><Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "end" }, justifyContent: "space-between", gap: 2, mb: 3 }}><Box><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>THE PRODUCT REGISTER</Typography><Typography component="h2" sx={{ color: "text.primary", fontSize: { xs: 34, md: 50 }, fontWeight: 900, letterSpacing: "-.07em", mt: .75 }}>A useful assortment.</Typography></Box><Button onClick={onShop} endIcon={<ArrowForwardRoundedIcon />}>View all products</Button></Stack><Box sx={{ display: "grid", gap: { xs: 2, md: 2.5 }, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" } }}>{products.slice(0, 4).map((product) => <TwcProductCard key={product.slug} product={product} onAdd={() => onAdd(product)} />)}</Box></Box>;
}

function CorporateStory({ onShop }: { onShop: () => void }) {
  return <Box id="about" sx={{ borderTop: 1, borderColor: "divider", display: "grid", gap: { xs: 3, md: 7 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, py: { xs: 6, md: 10 }, scrollMarginTop: 90 }}><Box component="img" src="/images/twc/marketplace-hero-b.png" alt="TWC marketplace campaign" sx={{ height: { xs: 280, md: 430 }, objectFit: "cover", width: "100%" }} /><Stack spacing={2} sx={{ alignSelf: "center", maxWidth: 540 }}><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>THE TWC APPROACH</Typography><Typography component="h2" sx={{ color: "text.primary", fontSize: { xs: 34, md: 52 }, fontWeight: 900, letterSpacing: "-.07em", lineHeight: 1 }}>A storefront should make decisions easier.</Typography><Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>Corporate Commerce gives the catalog a disciplined, informative presentation. It is intentionally different from the editorial, wellness, and marketplace templates while using the same commerce engine underneath.</Typography><Button onClick={onShop} sx={{ alignSelf: "flex-start" }} variant="outlined">Browse the full register</Button></Stack></Box>;
}

function CorporateOperatingModel() {
  const steps = [["01", "Choose a collection", "Start with a category or browse the complete product register."], ["02", "Compare the details", "Open a product page for specifications, availability, and purchase options."], ["03", "Complete the journey", "Review the basket, add a delivery address, and place the offline demo order."]];
  return <Box id="benefits" sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", p: { xs: 2.5, md: 5 }, scrollMarginTop: 90 }}><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>HOW THE EXPERIENCE WORKS</Typography><Typography component="h2" sx={{ color: "text.primary", fontSize: { xs: 30, md: 42 }, fontWeight: 900, letterSpacing: "-.06em", mt: .75 }}>A clear path from interest to order.</Typography><Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, mt: 4 }}>{steps.map(([number, title, copy]) => <Box key={number} sx={{ borderTop: 3, borderColor: "primary.main", pt: 2 }}><Typography color="primary.main" sx={{ fontSize: 12, fontWeight: 900 }}>{number}</Typography><Typography sx={{ color: "text.primary", fontSize: 20, fontWeight: 900, mt: 1 }}>{title}</Typography><Typography color="text.secondary" sx={{ fontSize: 14, lineHeight: 1.7, mt: 1 }}>{copy}</Typography></Box>)}</Box></Box>;
}

function CorporateFaq() {
  const questions = [["Is this a live store?", "No. This is a self-contained portfolio demonstration with local catalog and checkout behavior."], ["Do all storefront templates share the same cart?", "Yes. The catalog, cart, shipping calculation, checkout state, and thank-you page are shared."], ["Can I change the storefront theme?", "Yes. Use the theme selector in the header to compare the distinct storefront templates."]];
  return <Box id="faq" sx={{ borderTop: 1, borderColor: "divider", py: { xs: 6, md: 9 }, scrollMarginTop: 90 }}><Typography color="primary.main" sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>SUPPORT & FAQ</Typography><Typography component="h2" sx={{ color: "text.primary", fontSize: { xs: 32, md: 46 }, fontWeight: 900, letterSpacing: "-.07em", mt: .75 }}>Useful answers, upfront.</Typography><Stack divider={<Divider flexItem />} sx={{ mt: 3 }}>{questions.map(([question, answer]) => <Box component="details" key={question} sx={{ py: 2, "& summary": { color: "text.primary", cursor: "pointer", fontSize: 17, fontWeight: 900 }, "& p": { color: "text.secondary", lineHeight: 1.75, maxWidth: 680, mb: 0, mt: 1 } }}><summary>{question}</summary><Typography component="p">{answer}</Typography></Box>)}</Stack></Box>;
}

function CorporateCta({ onShop }: { onShop: () => void }) {
  return <Box sx={{ bgcolor: "#173044", color: "#fff", my: { xs: 5, md: 8 }, p: { xs: 3, md: 6 }, textAlign: "center" }}><CheckCircleOutlineRoundedIcon sx={{ color: "#b9cddd", fontSize: 32 }} /><Typography component="h2" sx={{ fontSize: { xs: 30, md: 44 }, fontWeight: 900, letterSpacing: "-.06em", mt: 1 }}>Ready to review the catalog?</Typography><Typography sx={{ color: "rgba(255,255,255,.7)", lineHeight: 1.7, mt: 1, mx: "auto", maxWidth: 530 }}>Explore a storefront template built around clarity, structure, and a complete commerce journey.</Typography><Button onClick={onShop} sx={{ bgcolor: "#fff", color: "#173044", mt: 2.5 }} variant="contained">Open the product register</Button></Box>;
}
