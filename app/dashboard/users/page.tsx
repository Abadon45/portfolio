import {
  getAdminPortfolioUser,
  listPortfolioUsers,
} from "../../../lib/portfolioAuth";
import { UserManagement } from "../_components/UserManagement";

export const dynamic = "force-dynamic";

export default async function DashboardUsersPage() {
  const admin = await getAdminPortfolioUser();
  if (!admin) return null;
  const initialData = await listPortfolioUsers({ page: 1, pageSize: 10 });
  return <UserManagement initialData={initialData} />;
}
