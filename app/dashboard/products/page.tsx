import { redirect } from "next/navigation";
import { getAdminPortfolioUser } from "../../../lib/portfolioAuth";
import { listAdminStoreProducts } from "../../../lib/adminStoreProductRepository";
import ProductModelEditor from "../_components/ProductModelEditor";

export const dynamic = "force-dynamic";

export default async function DashboardProductsPage() {
  const admin = await getAdminPortfolioUser();
  if (!admin) redirect("/dashboard");
  const products = await listAdminStoreProducts();
  return <ProductModelEditor initialProducts={products} />;
}
