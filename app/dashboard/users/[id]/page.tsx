import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
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
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {
  findPortfolioUserById,
  getAdminPortfolioUser,
} from "../../../../lib/portfolioAuth";
import { UserModelEditor } from "../../_components/UserModelEditor";

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
function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
        new Date(value),
      )
    : "Not available";
}

export default async function DashboardUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminPortfolioUser();
  if (!admin) redirect("/dashboard");
  const { id } = await params;
  const user = await findPortfolioUserById(id);
  if (!user) notFound();

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "flex-end" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography
            color="primary.main"
            sx={{ fontWeight: 800, letterSpacing: "0.08em" }}
            variant="overline"
          >
            USER DIRECTORY
          </Typography>
          <Typography component="h1" sx={{ fontWeight: 850 }} variant="h3">
            {user.displayName}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Authenticated account details and access status.
          </Typography>
        </Box>
        <Box
          component="a"
          href="/dashboard/users"
          sx={{ textDecoration: "none" }}
        >
          ← Back to users
        </Box>
      </Stack>
      <Card variant="outlined">
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { sm: "center" } }}
          >
            <Avatar
              src={user.avatarUrl ?? undefined}
              sx={{ bgcolor: "primary.main", height: 72, width: 72 }}
            >
              {initials(user.displayName)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 850 }} variant="h5">
                {user.displayName}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ overflowWrap: "anywhere" }}
              >
                {user.email}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", mt: 1 }}
              >
                <Chip label={user.role} color="primary" size="small" />
                <Chip
                  label={user.isActive ? "Active" : "Inactive"}
                  color={user.isActive ? "success" : "default"}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<CheckCircleOutlineRoundedIcon />}
                  label={user.emailVerified ? "Verified" : "Unverified"}
                  color={user.emailVerified ? "success" : "warning"}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontWeight: 800 }} variant="h6">
              Account information
            </Typography>
            <Stack divider={<Divider />} spacing={2} sx={{ mt: 2 }}>
              <Detail
                label="First name"
                value={user.firstName ?? "Not added"}
              />
              <Detail label="Last name" value={user.lastName ?? "Not added"} />
              <Detail label="Phone" value={user.phone ?? "Not added"} />
              <Detail label="Joined" value={formatDate(user.createdAt)} />
            </Stack>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontWeight: 800 }} variant="h6">
              Security
            </Typography>
            <Stack divider={<Divider />} spacing={2} sx={{ mt: 2 }}>
              <Detail
                label="Sign-in method"
                value={
                  user.authProvider === "google" ? "Google" : "Email & password"
                }
              />
              <Detail
                label="Email verification"
                value={user.emailVerified ? "Verified" : "Required"}
              />
              <Detail label="Last active" value={formatDate(user.lastLogin)} />
              <Detail label="Account role" value={user.role} />
            </Stack>
          </CardContent>
        </Card>
      </Box>
      <UserModelEditor currentAdminId={admin.id} user={user} />
    </Stack>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      sx={{ justifyContent: "space-between" }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ overflowWrap: "anywhere", textAlign: { sm: "right" } }}>
        {value}
      </Typography>
    </Stack>
  );
}
