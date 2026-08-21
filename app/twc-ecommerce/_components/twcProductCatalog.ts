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

export const titleCaseCategory = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const hiddenCategories = new Set(["promo", "twc-freebie", "twc-freebies"]);

export const products: StoreProduct[] = (productResponse.products as ApiProduct[])
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
      category: titleCaseCategory(product.category_2 || product.category_1 || "General"),
      shop: titleCaseCategory(product.category_1 || "TWC Store"),
      image: images[0] || "https://placehold.co/800x800/eaf0f5/233044?text=TWC+Store",
      images,
      description: product.description_1 || "A product from the TWC ecommerce catalog.",
      details: [product.description_2, product.feature, product.specification]
        .filter(Boolean)
        .join("\n\n"),
      sku: product.sku,
      stock: isSante ? undefined : Number(product.quantity ?? 0),
      unlimitedStock: isSante,
    };
  });
