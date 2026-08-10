"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import productResponse from "../_data/product-list.json";

type ApiProduct = {
  slug: string;
  name: string;
  category_1?: string;
  category_2?: string;
  image_1?: string | null;
  image_2?: string | null;
  image_3?: string | null;
  image_4?: string | null;
  image_5?: string | null;
  customer_price?: string | number;
  description_1?: string | null;
  description_2?: string | null;
  feature?: string | null;
  specification?: string | null;
  sku?: string;
  quantity?: string | number;
};
export type StoreProduct = {
  slug: string;
  name: string;
  price: number;
  category: string;
  shop: string;
  image: string;
  images: string[];
  description: string;
  details: string;
  sku?: string;
  stock?: number;
  unlimitedStock: boolean;
};
export type CartLine = { product: StoreProduct; quantity: number };

export const titleCaseCategory = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
const hiddenCategories = new Set(["promo", "twc-freebie", "twc-freebies"]);

export const products: StoreProduct[] = (
  productResponse.products as ApiProduct[]
)
  .filter((product) => {
    const isHidden = [product.category_1, product.category_2].some((category) =>
      hiddenCategories.has(category?.toLowerCase() ?? ""),
    );
    const isSante = product.category_1?.trim().toLowerCase() === "sante";
    return !isHidden && (isSante || Number(product.quantity ?? 0) > 0);
  })
  .map((product) => {
    const isSante = product.category_1?.trim().toLowerCase() === "sante";
    const images = [
      product.image_1,
      product.image_2,
      product.image_3,
      product.image_4,
      product.image_5,
    ].filter((image): image is string => Boolean(image));
    return {
      slug: product.slug,
      name: product.name,
      price: Number(product.customer_price ?? 0),
      category: titleCaseCategory(
        product.category_2 || product.category_1 || "General",
      ),
      shop: titleCaseCategory(product.category_1 || "TWC Store"),
      image:
        images[0] ||
        "https://placehold.co/800x800/eaf0f5/233044?text=TWC+Store",
      images,
      description:
        product.description_1 || "A product from the TWC ecommerce catalog.",
      details: [product.description_2, product.feature, product.specification]
        .filter(Boolean)
        .join("\n\n"),
      sku: product.sku,
      stock: isSante ? undefined : Number(product.quantity ?? 0),
      unlimitedStock: isSante,
    };
  });

type DemoDestination = { city?: string; province?: string };
type ShippingZone = "MANILA" | "LUZON" | "VISAYAS" | "MINDANAO" | "ISLAND";

const pouchRates: Record<
  ShippingZone,
  [number, number, number, number, number]
> = {
  MANILA: [60, 80, 90, 95, 110],
  LUZON: [70, 90, 120, 150, 175],
  VISAYAS: [90, 150, 180, 140, 195],
  MINDANAO: [95, 160, 190, 180, 205],
  ISLAND: [110, 175, 205, 195, 215],
};
const boxRates: Record<ShippingZone, number[]> = {
  MANILA: [85, 115, 155, 200, 220, 255, 295, 335, 375, 415],
  LUZON: [95, 165, 190, 280, 320, 375, 435, 495, 555, 615],
  VISAYAS: [100, 180, 200, 300, 370, 435, 505, 575, 645, 715],
  MINDANAO: [105, 195, 220, 330, 370, 435, 505, 575, 645, 715],
  ISLAND: [115, 205, 230, 340, 380, 445, 515, 585, 655, 725],
};

const destinationZone = ({
  city = "",
  province = "",
}: DemoDestination): ShippingZone => {
  const location = `${city} ${province}`.toLowerCase();
  if (
    /manila|makati|pasay|pasig|taguig|quezon|caloocan|mandaluyong|marikina|paranaque|parañaque|muntinlupa|malabon|navotas|valenzuela|san juan|las pinas|las piñas|pateros/.test(
      location,
    )
  )
    return "MANILA";
  if (
    /cebu|bohol|iloilo|bacolod|leyte|samar|negros|capiz|aklan|antique/.test(
      location,
    )
  )
    return "VISAYAS";
  if (
    /mindanao|cotabato|davao|misamis|zamboanga|bukidnon|surigao|agusan|lanao|maguindanao|sultan kudarat/.test(
      location,
    )
  )
    return "MINDANAO";
  return "LUZON";
};

/** Offline version of the backend's J&T quote: shipping quantity, package size, zone, weight bracket, and packaging fee. */
export function calculateDemoShippingFee(
  lines: CartLine[],
  destination: DemoDestination = {},
) {
  const zone = destinationZone(destination);
  const totals = lines.reduce(
    (result, line) => {
      const category =
        `${line.product.category} ${line.product.shop}`.toLowerCase();
      const profile = category.includes("bundle")
        ? { weight: 1.5, slots: 30 }
        : category.includes("bag")
          ? { weight: 0.6, slots: 15 }
          : category.includes("electronic")
            ? { weight: 0.4, slots: 7 }
            : category.includes("watch")
              ? { weight: 0.3, slots: 2.5 }
              : { weight: 0.5, slots: 7 };
      return {
        weight: result.weight + profile.weight * line.quantity,
        slots: result.slots + profile.slots * line.quantity,
      };
    },
    { weight: 0, slots: 0 },
  );
  const packageTypes = [
    { name: "PS", capacity: 2.5 },
    { name: "PM", capacity: 7 },
    { name: "PL", capacity: 15 },
    { name: "BXS", capacity: 24 },
    { name: "BS", capacity: 43 },
    { name: "BM", capacity: 100 },
  ];
  const chosen = packageTypes.find(
    (item) => totals.slots <= item.capacity,
  )?.name;
  let fee = 5;
  if (chosen === "PS" || chosen === "PM" || chosen === "PL")
    fee += pouchRates[zone][chosen === "PS" ? 0 : chosen === "PM" ? 1 : 2];
  else {
    const boxes = chosen ? 1 : Math.ceil(totals.slots / 250);
    const boxType = chosen ?? "BL";
    const minimumWeight = ({ BXS: 3, BS: 4, BM: 6, BL: 10 } as Record<string, number>)[boxType] ?? 10;
    const packagingFee = ({ BXS: 30, BS: 40, BM: 50, BL: 80 } as Record<string, number>)[boxType] ?? 80;
    const weight = Math.max(totals.weight / boxes, minimumWeight);
    const bracket = [0.5, 1, 3, 4, 5, 6, 7, 8, 9, 10].findIndex(
      (limit) => weight <= limit,
    );
    const safeBracket = bracket < 0 ? 9 : bracket;
    fee += (boxRates[zone][safeBracket] + packagingFee) * boxes;
  }
  return Number(fee.toFixed(2));
}

export type CheckoutQuote = {
  orderNumber: string;
  status: "in_progress" | "for-booking";
  itemsTotal: number;
  shippingFee: number;
  discountAmount: number;
  discountLabel: string | null;
  platformFee: number;
  amount: number;
};
type StoreContextValue = {
  cart: CartLine[];
  addToCart: (product: StoreProduct) => void;
  updateQuantity: (slug: string, change: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  selectedShop: string | null;
  setSelectedShop: (shop: string | null) => void;
  activeCheckout: CheckoutQuote | null;
  setActiveCheckout: (quote: CheckoutQuote | null) => void;
  lastOrder: {
    reference: string;
    total: number;
    lines: CartLine[];
    address: string;
    payment: string;
    quote: CheckoutQuote;
  } | null;
  setLastOrder: (order: StoreContextValue["lastOrder"]) => void;
  cartCount: number;
  cartTotal: number;
};
const StoreContext = createContext<StoreContextValue | null>(null);

export function useTwcStore() {
  const value = useContext(StoreContext);
  if (!value)
    throw new Error("useTwcStore must be used inside TwcStoreProvider");
  return value;
}

export default function TwcStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [activeCheckout, setActiveCheckout] = useState<CheckoutQuote | null>(
    null,
  );
  const [lastOrder, setLastOrder] =
    useState<StoreContextValue["lastOrder"]>(null);
  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      addToCart: (product) => {
        setSelectedShop(product.shop);
        setCart((current) => {
          const found = current.find(
            (line) => line.product.slug === product.slug,
          );
          return found
            ? current.map((line) =>
                line.product.slug === product.slug
                  ? { ...line, quantity: line.quantity + 1 }
                  : line,
              )
            : [...current, { product, quantity: 1 }];
        });
      },
      updateQuantity: (slug, change) =>
        setCart((current) =>
          current.flatMap((line) =>
            line.product.slug === slug
              ? line.quantity + change > 0
                ? [{ ...line, quantity: line.quantity + change }]
                : []
              : [line],
          ),
        ),
      removeFromCart: (slug) =>
        setCart((current) =>
          current.filter((line) => line.product.slug !== slug),
        ),
      clearCart: () => {
        setCart([]);
        setSelectedShop(null);
      },
      selectedShop,
      setSelectedShop,
      activeCheckout,
      setActiveCheckout,
      lastOrder,
      setLastOrder,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      cartTotal: cart.reduce(
        (sum, line) => sum + line.product.price * line.quantity,
        0,
      ),
    }),
    [activeCheckout, cart, lastOrder, selectedShop],
  );
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
