import TwcProductDetailPage from "../../_components/TwcProductDetailPage";
import { products } from "../../_components/twcProductCatalog";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) return { title: "Product not found | TWC Ecommerce" };

  return {
    title: `${product.name} | TWC Ecommerce`,
    description: product.description.slice(0, 155),
    alternates: { canonical: `/twc-ecommerce/shop/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TwcProductDetailPage slug={slug} />;
}
