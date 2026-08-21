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
  const footerGroups = groups[footerVariant];

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

function PremiumFooter() {
  const router = useRouter();
  return <Box component="footer" sx={{ bgcolor: "#271a21", color: "#fff", mt: { xs: 6, md: 10 }, py: { xs: 6, md: 10 } }}><Container maxWidth="lg"><Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", gap: 5 }}><Box sx={{ maxWidth: 440 }}><Typography sx={{ color: "#ead9d7", fontSize: 12, fontWeight: 900, letterSpacing: ".16em" }}>TWC / THE EDIT</Typography><Typography component="h2" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: 32, md: 46 }, fontWeight: 500, lineHeight: 1.05, mt: 1 }}>A more considered way to browse.</Typography><Typography sx={{ color: "rgba(255,255,255,.68)", lineHeight: 1.8, mt: 1.5 }}>An original portfolio storefront template powered by shared TWC commerce behavior.</Typography><Button onClick={() => router.push("/twc-ecommerce/shop")} sx={{ borderColor: "rgba(255,255,255,.5)", color: "#fff", mt: 2 }} variant="outlined">Shop the edit</Button></Box><Stack spacing={1}><Typography sx={{ color: "#ead9d7", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>EXPLORE</Typography><Button onClick={() => router.push("/twc-ecommerce")} sx={{ color: "#fff", justifyContent: "flex-start", px: 0 }}>Home</Button><Button onClick={() => router.push("/twc-ecommerce/shop")} sx={{ color: "#fff", justifyContent: "flex-start", px: 0 }}>Shop</Button><Button onClick={() => router.push("/twc-ecommerce/checkout")} sx={{ color: "#fff", justifyContent: "flex-start", px: 0 }}>Basket and checkout</Button></Stack></Stack><Divider sx={{ borderColor: "rgba(255,255,255,.16)", my: 5 }} /><Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 1 }}><Typography sx={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>Portfolio demonstration · No real orders are processed</Typography><Typography sx={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>TWC Ecommerce template</Typography></Stack></Container></Box>;
}
