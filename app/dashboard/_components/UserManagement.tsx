"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import type {
  PortfolioUser,
  PortfolioUserPage,
} from "../../../lib/portfolioAuth";
import { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";
import { EmptyState, PageHeader } from "./DashboardPrimitives";

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

function UserIdentity({ user }: { user: PortfolioUser }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: "center", minWidth: 0 }}
    >
      <Avatar
        src={user.avatarUrl ?? undefined}
        sx={{ bgcolor: "primary.main", height: 38, width: 38 }}
      >
        {initials(user.displayName)}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 700 }}>
          {user.displayName}
        </Typography>
        <Typography color="text.secondary" noWrap variant="body2">
          {user.email}
        </Typography>
      </Box>
    </Stack>
  );
}

export function UserManagement({
  initialData,
}: {
  initialData: PortfolioUserPage;
}) {
  const router = useRouter();
  const { showModal, toastError, toastSuccess } = useTwcAlert();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [grantingAdminId, setGrantingAdminId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/users?search=${encodeURIComponent(search)}`,
        );
        const nextData = (await response.json()) as PortfolioUserPage & {
          message?: string;
        };
        if (!response.ok)
          throw new Error(nextData.message ?? "Unable to load users.");
        setData(nextData);
      } catch (requestError) {
        toastError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load users.",
        );
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  async function changePage(page: number) {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`,
      );
      const nextData = (await response.json()) as PortfolioUserPage & {
        message?: string;
      };
      if (!response.ok)
        throw new Error(nextData.message ?? "Unable to load users.");
      setData(nextData);
    } catch (requestError) {
      toastError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load users.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(user: PortfolioUser) {
    const confirmation = await showModal({
      title: `Delete ${user.displayName}?`,
      content: "This permanently removes the account and its active sessions.",
      type: "warning",
      confirmText: "Delete user",
      cancelText: "Keep user",
    });
    if (confirmation.action !== "confirm") {
      return;
    }

    setDeletingId(user.id);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message ?? "Unable to delete this user.");
      }
      setData((current) => ({
        ...current,
        total: Math.max(0, current.total - 1),
        users: current.users.filter((item) => item.id !== user.id),
      }));
    } catch (requestError) {
      toastError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete this user.",
      );
      return;
    } finally {
      setDeletingId(null);
    }

    toastSuccess(`${user.displayName} was deleted.`);
  }

  async function grantAdmin(user: PortfolioUser) {
    const confirmation = await showModal({
      title: `Grant admin status to ${user.displayName}?`,
      content:
        "This gives the user access to administration, user management, and protected workspace tools.",
      type: "warning",
      confirmText: "Grant admin status",
      cancelText: "Cancel",
    });
    if (confirmation.action !== "confirm") return;

    setGrantingAdminId(user.id);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "POST",
        body: JSON.stringify({ role: "admin" }),
        headers: { "Content-Type": "application/json" },
      });
      const result = (await response.json()) as {
        message?: string;
        user?: PortfolioUser;
      };
      if (!response.ok || !result.user) {
        throw new Error(result.message ?? "Unable to grant admin status.");
      }
      setData((current) => ({
        ...current,
        users: current.users.map((item) =>
          item.id === user.id ? result.user! : item,
        ),
      }));
      toastSuccess(`${user.displayName} is now an administrator.`);
    } catch (requestError) {
      toastError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to grant admin status.",
      );
    } finally {
      setGrantingAdminId(null);
    }
  }

  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="DIRECTORY"
        title="Users"
        description="Review authenticated accounts and their current access state."
        action={
          <Button onClick={() => router.refresh()} variant="outlined">
            Refresh
          </Button>
        }
      />
      <Card variant="outlined">
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextField
            fullWidth
            aria-label="Search users"
            label="Search users"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or email"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            value={search}
          />
          {loading && <LinearLoading />}
          {!loading && !data.users.length ? (
            <Box sx={{ mt: 2 }}>
              <EmptyState
                description="Try another name or email, or wait for the first registration."
                title="No matching users"
              />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                  overflowX: "auto",
                  mt: 2,
                }}
              >
                <Box
                  component="table"
                  sx={{
                    borderCollapse: "collapse",
                    minWidth: 720,
                    width: "100%",
                  }}
                >
                  <Box component="thead">
                    <Box component="tr">
                      {["User", "Role", "Status", "Provider", "Joined", ""].map(
                        (heading) => (
                          <Box
                            component="th"
                            key={heading}
                            sx={{
                              borderBottom: 1,
                              borderColor: "divider",
                              color: "text.secondary",
                              fontSize: 12,
                              p: 1.5,
                              textAlign: "left",
                              textTransform: "uppercase",
                            }}
                          >
                            {heading}
                          </Box>
                        ),
                      )}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {data.users.map((user) => (
                      <Box
                        component="tr"
                        key={user.id}
                        sx={{ "&:hover": { bgcolor: "action.hover" } }}
                      >
                        <Box
                          component="td"
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            p: 1.5,
                          }}
                        >
                          <UserIdentity user={user} />
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            p: 1.5,
                          }}
                        >
                          <Chip
                            label={user.role}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            p: 1.5,
                          }}
                        >
                          <Chip
                            color={user.isActive ? "success" : "default"}
                            label={user.isActive ? "Active" : "Inactive"}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            p: 1.5,
                            textTransform: "capitalize",
                          }}
                        >
                          {user.authProvider}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            color: "text.secondary",
                            p: 1.5,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(user.createdAt)}
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            p: 1.5,
                            verticalAlign: "middle",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center" }}
                          >
                            <Button
                              aria-label={`View ${user.displayName}`}
                              onClick={() =>
                                router.push(`/dashboard/users/${user.id}`)
                              }
                              size="small"
                              startIcon={<VisibilityRoundedIcon />}
                            >
                              View
                            </Button>
                            {user.role.toLowerCase() !== "admin" && (
                              <Button
                                aria-label={`Grant admin status to ${user.displayName}`}
                                disabled={grantingAdminId === user.id}
                                onClick={() => void grantAdmin(user)}
                                size="small"
                                startIcon={<AdminPanelSettingsRoundedIcon />}
                              >
                                {grantingAdminId === user.id
                                  ? "Granting…"
                                  : "Make admin"}
                              </Button>
                            )}
                            {user.role.toLowerCase() === "admin" ? (
                              <Chip
                                icon={<LockRoundedIcon />}
                                label="Protected"
                                size="small"
                                variant="outlined"
                              />
                            ) : (
                              <Button
                                aria-label={`Delete ${user.displayName}`}
                                color="error"
                                disabled={deletingId === user.id}
                                onClick={() => void deleteUser(user)}
                                size="small"
                                startIcon={<DeleteOutlineRoundedIcon />}
                              >
                                Delete
                              </Button>
                            )}
                          </Stack>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Stack
                divider={<Divider />}
                sx={{ display: { xs: "flex", md: "none" }, mt: 2 }}
              >
                {data.users.map((user) => (
                  <Stack key={user.id} spacing={1.5} sx={{ py: 2 }}>
                    <UserIdentity user={user} />
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: "wrap" }}
                    >
                      <Chip label={user.role} size="small" variant="outlined" />
                      <Chip
                        color={user.isActive ? "success" : "default"}
                        label={user.isActive ? "Active" : "Inactive"}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={user.authProvider}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Button
                      fullWidth
                      onClick={() => router.push(`/dashboard/users/${user.id}`)}
                      startIcon={<VisibilityRoundedIcon />}
                      variant="outlined"
                    >
                      View user
                    </Button>
                    {user.role.toLowerCase() !== "admin" && (
                      <Button
                        disabled={grantingAdminId === user.id}
                        fullWidth
                        onClick={() => void grantAdmin(user)}
                        startIcon={<AdminPanelSettingsRoundedIcon />}
                        variant="outlined"
                      >
                        {grantingAdminId === user.id
                          ? "Granting admin status…"
                          : "Grant admin status"}
                      </Button>
                    )}
                    {user.role.toLowerCase() === "admin" ? (
                      <Chip
                        icon={<LockRoundedIcon />}
                        label="Administrator profile protected"
                        sx={{ alignSelf: "center" }}
                        variant="outlined"
                      />
                    ) : (
                      <Button
                        color="error"
                        disabled={deletingId === user.id}
                        fullWidth
                        onClick={() => void deleteUser(user)}
                        startIcon={<DeleteOutlineRoundedIcon />}
                        variant="outlined"
                      >
                        Delete user
                      </Button>
                    )}
                  </Stack>
                ))}
              </Stack>
            </>
          )}
          {pageCount > 1 && (
            <Stack sx={{ alignItems: "center", mt: 3 }}>
              <Pagination
                count={pageCount}
                page={data.page}
                onChange={(_event, page) => void changePage(page)}
              />
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

function LinearLoading() {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: "center", color: "text.secondary", mt: 2 }}
    >
      <CircularProgress size={16} />
      <Typography variant="body2">Loading users…</Typography>
    </Stack>
  );
}
