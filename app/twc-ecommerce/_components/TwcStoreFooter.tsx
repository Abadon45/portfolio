"use client";

import { Box, Button, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useStorefrontTheme } from "./twcEcommerceTheme";

const groups = {
  minimal: [["Explore", "Shop", "Collections", "Our story"], ["Connect", "Instagram", "Support", "Newsletter"]],
  wellness: [["Wellness", "Barley & nutrition", "Beauty & self-care", "Everyday essentials"], ["Support", "FAQs", "Shipping", "Contact us"], ["About", "Our story", "Trust & quality", "Join the community"]],
  marketplace: [["Shop", "All products", "New arrivals", "Best sellers", "Deals"], ["Customer service", "Help center", "Shipping", "Returns"], ["Your account", "Orders", "Saved items", "Basket"]],
  corporate: [["Company", "About TWC", "Collections", "Partners"], ["Products", "Wellness", "Lifestyle", "Technology"], ["Resources", "Support", "FAQs", "Contact"]],
} as const;

export default function TwcStoreFooter() {
  const { themeConfig } = useStorefrontTheme();
  const footerVariant = themeConfig.footerVariant;
  if (footerVariant === "minimal") return <PremiumFooter />;
  if (footerVariant === "wellness") return <WellnessFooter />;
  if (footerVariant === "marketplace") return <MarketplaceFooter />;
  if (footerVariant === "corporate") return <CorporateFooter />;
  const footerGroups = groups.corporate;

  return (
    <Box component="footer" sx={{ bgcolor: themeConfig.heroText, color: "#fff", mt: { xs: 6, md: 10 }, py: { xs: 5, md: 8 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ color: themeConfig.accent, fontSize: 12, fontWeight: 900, letterSpacing: ".14em" }}>TWC ONLINE</Typography>
            <Typography component="h2" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, mt: 1 }}>A storefront framework for better everyday commerce.</Typography>
            <Typography sx={{ color: "rgba(255,255,255,.7)", lineHeight: 1.7, maxWidth: 430, mt: 1.5 }}>An offline portfolio reconstruction demonstrating shared commerce components across distinct storefront identities.</Typography>
          </Grid>
          {footerGroups.map(([title, ...links]) => <Grid key={title} size={{ xs: 6, md: 2 }}><Typography sx={{ color: themeConfig.accent, fontSize: 12, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase" }}>{title}</Typography><Stack spacing={1} sx={{ mt: 1.5 }}>{links.map((link) => <Typography key={link} sx={{ color: "rgba(255,255,255,.72)", fontSize: 14 }}>{link}</Typography>)}</Stack></Grid>)}
        </Grid>
        <Divider sx={{ borderColor: "rgba(255,255,255,.16)", my: 4 }} />
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 1 }}><Typography sx={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>Portfolio demo · No real orders are processed</Typography><Typography sx={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>Privacy · Terms · Accessibility</Typography></Stack>
      </Container>
    </Box>
  );
}

function WellnessFooter() {
  const router = useRouter();
  const goToSection = (section: string) => {
    if (window.location.pathname === "/twc-ecommerce") {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`/twc-ecommerce?section=${section}`);
  };
  const groups: Array<[string, Array<[string, string]>]> = [
    ["SHOP", [["All products", "/twc-ecommerce/shop"], ["Collections", "collections"]]],
    ["WELLNESS", [["Our story", "story"], ["Guides", "story"], ["FAQ", "faq"]]],
    ["SUPPORT", [["Shipping", "/twc-ecommerce/checkout"], ["Checkout", "/twc-ecommerce/checkout"], ["Contact", "faq"]]],
    ["DEMO", [["Theme overview", "/twc-ecommerce"], ["Basket", "/twc-ecommerce/checkout"]]],
  ];
  return <Box component="footer" sx={{ bgcolor: "#173b27", color: "#fff", mt: { xs: 6, md: 10 }, overflow: "hidden", position: "relative", py: { xs: 6, md: 9 } }}><Box component="img" src="/images/twc/wellness-greenery.png" alt="" aria-hidden="true" sx={{ filter: "blur(8px)", height: "100%", inset: 0, objectFit: "cover", opacity: .28, position: "absolute", transform: "scale(1.08)", width: "100%" }} /><Box sx={{ bgcolor: "rgba(23,59,39,.78)", inset: 0, position: "absolute" }} /><Container maxWidth="xl" sx={{ position: "relative" }}><Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", gap: 6 }}><Box sx={{ maxWidth: 420 }}><Typography sx={{ color: "#cfe3c8", fontSize: 12, fontWeight: 900, letterSpacing: ".16em" }}>WELLNESS ORGANIC</Typography><Typography component="h2" sx={{ fontSize: { xs: 30, md: 46 }, fontWeight: 850, letterSpacing: "-.07em", lineHeight: 1, mt: 1 }}>A calmer way to discover everyday essentials.</Typography><Typography sx={{ color: "rgba(255,255,255,.7)", lineHeight: 1.8, mt: 1.5 }}>An original portfolio storefront concept powered by the shared TWC commerce engine. No real orders are processed.</Typography><Button onClick={() => router.push("/twc-ecommerce/shop")} sx={{ borderColor: "rgba(255,255,255,.5)", color: "#fff", mt: 2 }} variant="outlined">Shop all products</Button></Box><Box sx={{ display: "grid", gap: { xs: 3, sm: 5 }, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" } }}>{groups.map(([title, links]) => <Stack key={title} spacing={1}><Typography sx={{ color: "#cfe3c8", fontSize: 11, fontWeight: 900, letterSpacing: ".12em" }}>{title}</Typography>{links.map(([label, target]) => <Button key={label} onClick={() => target.startsWith("/") ? router.push(target) : goToSection(target)} sx={{ color: "rgba(255,255,255,.72)", justifyContent: "flex-start", minWidth: 0, p: 0, textTransform: "none" }}>{label}</Button>)}</Stack>)}</Box></Stack><Divider sx={{ borderColor: "rgba(255,255,255,.16)", my: 5 }} /><Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 1 }}><Typography sx={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>Portfolio demo · No real orders are processed</Typography><Typography sx={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>Wellness Organic template · TWC Ecommerce</Typography></Stack></Container></Box>;
}

function MarketplaceFooter() {
  const router = useRouter();
  const groups: Array<[string, Array<[string, string]>]> = [["SHOP", [["All products", "/twc-ecommerce/shop"], ["Categories", "/twc-ecommerce/shop"], ["Featured", "/twc-ecommerce"]]], ["CUSTOMER SERVICE", [["Shipping", "/twc-ecommerce/checkout"], ["Checkout", "/twc-ecommerce/checkout"], ["Basket", "/twc-ecommerce/checkout"]]], ["DEMO", [["Home", "/twc-ecommerce"], ["Theme switching", "/twc-ecommerce"], ["Order confirmation", "/twc-ecommerce/thank-you"]]]];
  return <Box component="footer" sx={{ bgcolor: "#142c63", color: "#fff", mt: { xs: 6, md: 10 }, py: { xs: 5, md: 8 } }}><Container maxWidth="xl"><Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: { md: "end" }, justifyContent: "space-between", gap: 4 }}><Box sx={{ maxWidth: 520 }}><Typography sx={{ color: "#b9ccf5", fontSize: 12, fontWeight: 950, letterSpacing: ".16em" }}>TWC MARKETPLACE</Typography><Typography component="h2" sx={{ fontSize: { xs: 32, md: 50 }, fontWeight: 950, letterSpacing: "-.08em", lineHeight: .95, mt: 1 }}>Keep exploring what is useful.</Typography><Typography sx={{ color: "rgba(255,255,255,.7)", lineHeight: 1.75, mt: 1.5 }}>A product-first storefront demonstration with shared catalog, cart, shipping, checkout, and order state.</Typography><Button onClick={() => router.push("/twc-ecommerce/shop")} sx={{ bgcolor: "#fff", color: "#142c63", mt: 2 }}>Explore products</Button></Box><Box sx={{ display: "grid", gap: { xs: 3, sm: 5 }, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" } }}>{groups.map(([title, links]) => <Stack key={title} spacing={1}><Typography sx={{ color: "#b9ccf5", fontSize: 11, fontWeight: 900, letterSpacing: ".1em" }}>{title}</Typography>{links.map(([label, href]) => <Button key={label} onClick={() => router.push(href)} sx={{ color: "rgba(255,255,255,.72)", justifyContent: "flex-start", minWidth: 0, p: 0, textTransform: "none" }}>{label}</Button>)}</Stack>)}</Box></Stack><Divider sx={{ borderColor: "rgba(255,255,255,.16)", my: 4 }} /><Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 1 }}><Typography sx={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>Portfolio demo · No real orders are processed</Typography><Typography sx={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>Modern Marketplace · TWC Ecommerce</Typography></Stack></Container></Box>;
}

function CorporateFooter() {
  const router = useRouter();
  const goToSection = (section: string) => {
    if (window.location.pathname === "/twc-ecommerce") {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`/twc-ecommerce?section=${section}`);
  };
  const groups: Array<[string, Array<[string, string]>]> = [
    ["PRODUCTS", [["All products", "/twc-ecommerce/shop"], ["Collections", "collections"], ["Featured register", "products"]]],
    ["COMPANY", [["About the platform", "about"], ["How it works", "benefits"], ["Theme overview", "/twc-ecommerce"]]],
    ["SUPPORT", [["FAQ", "faq"], ["Checkout", "/twc-ecommerce/checkout"], ["Basket", "/twc-ecommerce/checkout"]]],
  ];
  return <Box component="footer" sx={{ bgcolor: "#122735", color: "#fff", mt: { xs: 6, md: 10 }, py: { xs: 6, md: 9 } }}><Container maxWidth="xl"><Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", gap: { xs: 5, md: 8 } }}><Box sx={{ maxWidth: 480 }}><Typography sx={{ color: "#b9cddd", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>TWC CORPORATE COMMERCE</Typography><Typography component="h2" sx={{ fontSize: { xs: 34, md: 52 }, fontWeight: 900, letterSpacing: "-.07em", lineHeight: .98, mt: 1 }}>Useful commerce, clearly presented.</Typography><Typography sx={{ color: "rgba(255,255,255,.68)", lineHeight: 1.8, mt: 1.5 }}>A distinct corporate storefront template powered by the shared TWC catalog and transaction journey. No real orders are processed.</Typography><Button onClick={() => router.push("/twc-ecommerce/shop")} sx={{ bgcolor: "#fff", color: "#122735", mt: 2 }} variant="contained">Explore products</Button></Box><Box sx={{ display: "grid", gap: { xs: 3, sm: 5 }, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" } }}>{groups.map(([title, links]) => <Stack key={title} spacing={1}><Typography sx={{ color: "#b9cddd", fontSize: 11, fontWeight: 900, letterSpacing: ".1em" }}>{title}</Typography>{links.map(([label, target]) => <Button key={label} onClick={() => target.startsWith("/") ? router.push(target) : goToSection(target)} sx={{ color: "rgba(255,255,255,.7)", justifyContent: "flex-start", minWidth: 0, p: 0, textTransform: "none" }}>{label}</Button>)}</Stack>)}</Box></Stack><Divider sx={{ borderColor: "rgba(255,255,255,.16)", my: 5 }} /><Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 1 }}><Typography sx={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>Portfolio demonstration · No real orders are processed</Typography><Typography sx={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>Corporate Commerce · TWC Ecommerce</Typography></Stack></Container></Box>;
}

function PremiumFooter() {
  const router = useRouter();
  return <Box component="footer" sx={{ bgcolor: "#271a21", color: "#fff", mt: { xs: 6, md: 10 }, py: { xs: 6, md: 10 } }}><Container maxWidth="lg"><Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", gap: 5 }}><Box sx={{ maxWidth: 440 }}><Typography sx={{ color: "#ead9d7", fontSize: 12, fontWeight: 900, letterSpacing: ".16em" }}>TWC / THE EDIT</Typography><Typography component="h2" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: 32, md: 46 }, fontWeight: 500, lineHeight: 1.05, mt: 1 }}>A more considered way to browse.</Typography><Typography sx={{ color: "rgba(255,255,255,.68)", lineHeight: 1.8, mt: 1.5 }}>An original portfolio storefront template powered by shared TWC commerce behavior.</Typography><Button onClick={() => router.push("/twc-ecommerce/shop")} sx={{ borderColor: "rgba(255,255,255,.5)", color: "#fff", mt: 2 }} variant="outlined">Shop the edit</Button></Box><Stack spacing={1}><Typography sx={{ color: "#ead9d7", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>EXPLORE</Typography><Button onClick={() => router.push("/twc-ecommerce")} sx={{ color: "#fff", justifyContent: "flex-start", px: 0 }}>Home</Button><Button onClick={() => router.push("/twc-ecommerce/shop")} sx={{ color: "#fff", justifyContent: "flex-start", px: 0 }}>Shop</Button><Button onClick={() => router.push("/twc-ecommerce/checkout")} sx={{ color: "#fff", justifyContent: "flex-start", px: 0 }}>Basket and checkout</Button></Stack></Stack><Divider sx={{ borderColor: "rgba(255,255,255,.16)", my: 5 }} /><Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 1 }}><Typography sx={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>Portfolio demonstration · No real orders are processed</Typography><Typography sx={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>TWC Ecommerce template</Typography></Stack></Container></Box>;
}
