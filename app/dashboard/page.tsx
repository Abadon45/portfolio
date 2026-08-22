import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import {
  getAdminPortfolioUser,
  listPortfolioUsers,
} from "../../lib/portfolioAuth";
import {
  EmptyState,
  PageHeader,
  StatCard,
} from "./_components/DashboardPrimitives";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export default async function DashboardOverviewPage() {
  const admin = await getAdminPortfolioUser();
  if (!admin) return null;
  const users = await listPortfolioUsers({ page: 1, pageSize: 5 });

  return (
    <Stack spacing={4}>
      <PageHeader
        eyebrow="PORTFOLIO ADMIN"
        title={`Good to see you, ${admin.displayName}.`}
        description="A clear operational view of your portfolio and authenticated users."
      />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <StatCard
          detail="Live from portfolio_auth"
          icon={<GroupRoundedIcon />}
          label="Registered users"
          value={String(users.total)}
        />
        <StatCard
          detail="Storefront API not connected"
          icon={<ShoppingBagRoundedIcon />}
          label="Orders"
          value="—"
        />
        <StatCard
          detail="Storefront API not connected"
          icon={<PaymentsRoundedIcon />}
          label="Revenue"
          value="—"
        />
        <StatCard
          detail="Catalog management foundation"
          icon={<Inventory2RoundedIcon />}
          label="Products"
          value="—"
        />
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.5fr) minmax(300px, 1fr)",
          },
        }}
      >
        <Card variant="outlined">
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography sx={{ fontWeight: 800 }} variant="h6">
              Recent users
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
              The latest accounts created in this portfolio auth database.
            </Typography>
            <Stack divider={<Divider />}>
              {users.users.map((user) => (
                <Stack
                  direction="row"
                  key={user.id}
                  spacing={1.5}
                  sx={{ alignItems: "center", py: 1.5 }}
                >
                  <Avatar
                    src={user.avatarUrl ?? undefined}
                    sx={{ bgcolor: "primary.main", height: 36, width: 36 }}
                  >
                    {initials(user.displayName)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 700 }}>
                      {user.displayName}
                    </Typography>
                    <Typography color="text.secondary" noWrap variant="body2">
                      {user.email}
                    </Typography>
                  </Box>
                  <Chip
                    color={user.isActive ? "success" : "default"}
                    label={user.isActive ? "Active" : "Inactive"}
                    size="small"
                    variant="outlined"
                  />
                  <Typography
                    color="text.secondary"
                    sx={{ display: { xs: "none", sm: "block" } }}
                    variant="caption"
                  >
                    {formatDate(user.createdAt)}
                  </Typography>
                </Stack>
              ))}
              {!users.users.length && (
                <EmptyState
                  description="New registered accounts will appear here."
                  title="No users yet"
                />
              )}
            </Stack>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography sx={{ fontWeight: 800 }} variant="h6">
              Commerce insights
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
              This area is ready for real commerce data.
            </Typography>
            <EmptyState
              description="Orders, revenue, and product analytics will appear when their APIs are connected."
              title="No commerce data connected"
            />
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
