import TwcProductDetailPage from "../../_components/TwcProductDetailPage";

export default async function ProductDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TwcProductDetailPage slug={slug} />;
}
