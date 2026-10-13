"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { StoreProduct } from "./TwcStoreProvider";
import { useTwcStore } from "./TwcStoreProvider";
import CorporateCommerceHome from "./CorporateCommerceHome";
import ModernMarketplaceHome from "./ModernMarketplaceHome";
import PremiumBeautyHome from "./PremiumBeautyHome";
import SanteHome from "./SanteHome";
import { useStorefrontTheme } from "./twcEcommerceTheme";

export default function TwcHomeView({
  onAdd,
}: {
  onAdd: (product: StoreProduct) => void;
}) {
  const { themeName } = useStorefrontTheme();
  const { products } = useTwcStore();
  const router = useRouter();

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get("section");
    const availableSections = [
      "collections",
      "journal",
      "about",
      "story",
      "benefits",
      "faq",
      "bestsellers",
    ];

    if (!section || !availableSections.includes(section)) return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(section)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    window.history.replaceState(null, "", window.location.pathname);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ].slice(0, 8);
  const openShop = (category?: string) => {
    const path = category
      ? "/twc-ecommerce/shop?category=" + encodeURIComponent(category)
      : "/twc-ecommerce/shop";
    router.push(path);
  };

  if (themeName === "premium-beauty") {
    return (
      <PremiumBeautyHome
        products={products}
        onAdd={onAdd}
        onShop={openShop}
      />
    );
  }

  if (themeName === "wellness-organic") {
    return <SanteHome onAdd={onAdd} onShop={openShop} />;
  }

  if (themeName === "modern-marketplace") {
    return (
      <ModernMarketplaceHome
        categories={categories}
        products={products}
        onAdd={onAdd}
        onShop={openShop}
      />
    );
  }

  if (themeName === "corporate-commerce") {
    return (
      <CorporateCommerceHome
        categories={categories}
        products={products}
        onAdd={onAdd}
        onShop={openShop}
      />
    );
  }

  return <SanteHome onAdd={onAdd} onShop={openShop} />;
}
