"use client";

import { useMemo, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { FloatingHomeButton } from "../../components/FloatingHomeButton";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";
import CheckoutJourney from "./CheckoutJourney";
import TwcCartDrawer from "./TwcCartDrawer";
import TwcEshopNavbar from "./TwcEshopNavbar";
import TwcHomeView from "./TwcHomeView";
import TwcShopPage from "./TwcShopPage";
import TwcThankYouView from "./TwcThankYouView";
import { AnnouncementBar } from "./StorefrontPrimitives";
import TwcStoreFooter from "./TwcStoreFooter";
import { useTwcStore, type StoreProduct } from "./TwcStoreProvider";
import {
  createTwcEcommerceTheme,
  useStorefrontMode,
  useStorefrontTheme,
} from "./twcEcommerceTheme";

type View = "home" | "shop" | "checkout" | "thank-you";

export default function TwcStorePage({ view }: { view: View }) {
  return <ThemedStorePage view={view} />;
}

function ThemedStorePage({ view }: { view: View }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addToCart, cartCount } = useTwcStore();
  const { toastSuccess } = useTwcAlert();
  const { themeName } = useStorefrontTheme();
  const { mode, setMode } = useStorefrontMode();
  const theme = useMemo(
    () => createTwcEcommerceTheme(mode, themeName),
    [mode, themeName],
  );

  const addProduct = (product: StoreProduct) => {
    addToCart(product);
    toastSuccess(`${product.name} added to your basket`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh" }}>
        <AnnouncementBar />
        <TwcEshopNavbar
          count={cartCount}
          mode={mode}
          onCart={() => setDrawerOpen(true)}
          onToggleMode={() => setMode((current) => (current === "dark" ? "light" : "dark"))}
        />
        <TwcCartDrawer onClose={() => setDrawerOpen(false)} open={drawerOpen} />
        {view === "home" && <TwcHomeView onAdd={addProduct} />}
        {view === "shop" && <TwcShopPage onCartOpen={() => setDrawerOpen(true)} />}
        {view === "checkout" && <CheckoutJourney />}
        {view === "thank-you" && <><TwcThankYouView /><TransactionMeta /></>}
        <TwcStoreFooter />
        <ScrollToTopButton threshold={520} />
        <FloatingHomeButton />
      </Box>
    </ThemeProvider>
  );
}

function TransactionMeta() {
  const { lastOrder } = useTwcStore();

  if (!lastOrder) return null;

  return (
    <Box sx={{ mx: "auto", maxWidth: 900, pb: 6, px: { xs: 2, md: 3 } }}>
      <Box sx={{ bgcolor: "action.hover", border: 1, borderColor: "divider", p: { xs: 2, md: 3 } }}>
        <Box component="pre" sx={{ color: "text.secondary", fontFamily: "monospace", fontSize: 12, mb: 0, mt: 0, overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {JSON.stringify({
            shippingInfo: {
              success: true,
              order_number: lastOrder.quote.orderNumber,
              amount: lastOrder.quote.amount.toFixed(2),
              shipping_fee: lastOrder.quote.shippingFee.toFixed(2),
            },
            payment: {
              success: true,
              order_status: lastOrder.quote.status,
              payment_method: lastOrder.payment,
            },
          }, null, 2)}
        </Box>
      </Box>
    </Box>
  );
}
