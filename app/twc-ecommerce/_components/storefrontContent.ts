import type { StoreProduct } from "./TwcStoreProvider";

export function isPremiumBeautyProduct(product: StoreProduct) {
  const category = product.category2.trim().toLowerCase();
  const brand = (product.brand ?? "").trim().toLowerCase();
  const shop = product.shop.trim().toLowerCase();
  const isHidden = ["twc-freebie", "twc-freebies"].includes(category);
  const isBeautyBrand =
    brand === "avon" ||
    brand === "mary kay" ||
    brand === "marykay" ||
    shop.includes("avon beauty");
  const isMoodBeauty =
    product.category1.trim().toLowerCase() === "mood" &&
    ["perfume", "bags"].includes(category);

  return !isHidden && (isBeautyBrand || isMoodBeauty);
}

export function selectPremiumBeautyProducts(items: StoreProduct[]) {
  return items
    .filter(isPremiumBeautyProduct)
    .sort(
      (first, second) =>
        Number(second.isFeatured) - Number(first.isFeatured) ||
        first.sortOrder - second.sortOrder ||
        first.name.localeCompare(second.name),
    );
}

export function premiumBeautyCategories(items: StoreProduct[]) {
  const categoryOrder = [
    "beauty / makeup",
    "beauty / skin care",
    "beauty / hair care",
    "beauty / fragrance",
    "beauty",
    "perfume",
    "bags",
  ];
  const counts = new Map<string, number>();

  const eligibleProducts = items.filter(isPremiumBeautyProduct);
  eligibleProducts
    .forEach((product) => {
      const category = product.category2.trim().toLowerCase();
      counts.set(category, (counts.get(category) ?? 0) + 1);
    });

  return [...counts.entries()]
    .sort(([first], [second]) => {
      const firstOrder = categoryOrder.indexOf(first);
      const secondOrder = categoryOrder.indexOf(second);
      return (firstOrder < 0 ? categoryOrder.length : firstOrder) -
        (secondOrder < 0 ? categoryOrder.length : secondOrder) ||
        first.localeCompare(second);
    })
    .map(([category, count]) => ({
      category,
      count,
      label: category === "bundle" ? "Beauty & lifestyle sets" : titleCase(category),
      image:
        eligibleProducts.find(
          (product) => product.category2.trim().toLowerCase() === category,
        )?.image ?? "/images/twc/premium-beauty-campaign.webp",
    }));
}

function titleCase(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function packCount(product: StoreProduct) {
  const text = [product.name, product.slug].join(" ");
  const match = text.match(/(?:^|[^0-9])(10|30)(?:[^0-9]|$)/);
  return match ? Number(match[1]) : null;
}

export function santeProductImage(product: StoreProduct) {
  const identity = (product.name + " " + product.slug).toLowerCase();

  if (!identity.includes("barley")) return product.image;

  const pack = packCount(product);
  if (pack === 10) {
    return "/images/twc/sante/sante-barley-powder-10-sachets-no-added-sweetener.png";
  }
  if (pack === 30) {
    return "/images/twc/sante/sante-barley-powder-30-sachets-no-added-sweetener.png";
  }

  return product.image;
}

export function selectSanteProducts(items: StoreProduct[]) {
  const santeProducts = items.filter(
    (product) => product.category1.trim().toLowerCase() === "sante",
  );
  const barleyProducts = santeProducts.filter((product) =>
    /barley/i.test(product.name + " " + product.category),
  );
  const preferredPacks = [10, 30].flatMap((count) => {
    const match = barleyProducts.find((product) => packCount(product) === count);
    return match ? [match] : [];
  });
  const remaining = santeProducts
    .filter((product) => !preferredPacks.includes(product))
    .sort(
      (first, second) =>
        Number(second.isFeatured) - Number(first.isFeatured) ||
        first.sortOrder - second.sortOrder ||
        first.name.localeCompare(second.name),
    );

  return [...preferredPacks, ...remaining];
}

export type SanteCategoryTile = {
  label: string;
  query: string;
  image: string;
};

export function selectSanteCategories(items: StoreProduct[]): SanteCategoryTile[] {
  const categories = new Map<string, StoreProduct>();

  items.forEach((product) => {
    if (
      product.category1.trim().toLowerCase() !== "sante" ||
      categories.has(product.category)
    ) {
      return;
    }
    categories.set(product.category, product);
  });

  const categoryLabels: Record<string, string> = {
    "sante beauty skin care": "Beauty & care",
    "sante intimate care": "Intimate care",
    "sante beverage": "Everyday essentials",
    "sante nutraceutical": "Nutrition",
  };
  const preferredOrder = [
    "sante beauty skin care",
    "sante intimate care",
    "sante beverage",
    "sante nutraceutical",
  ];
  const orderedEntries = [
    ...preferredOrder.flatMap((preferred) =>
      [...categories.entries()].filter(([query]) => query.toLowerCase() === preferred),
    ),
    ...[...categories.entries()].filter(
      ([query]) => !preferredOrder.includes(query.toLowerCase()),
    ),
  ];
  return orderedEntries.slice(0, 4).map(([query, product]) => ({
    label: categoryLabels[query.toLowerCase()] ?? query,
    query,
    image: santeProductImage(product),
  }));
}
