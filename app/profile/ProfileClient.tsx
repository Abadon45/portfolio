"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { FloatingHomeButton } from "../components/FloatingHomeButton";
import type { PortfolioUser } from "../../lib/portfolioAuth";

type ProfileSection = "overview" | "personal" | "security";

type ProfileClientProps = {
  initialUser: PortfolioUser;
};

function initials(user: PortfolioUser) {
  return user.displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value: string | null) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(value));
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [section, setSection] = useState<ProfileSection>("overview");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [draft, setDraft] = useState({
    firstName: initialUser.firstName ?? "",
    lastName: initialUser.lastName ?? "",
    displayName: initialUser.displayName,
    phone: initialUser.phone ?? "",
  });

  const completion = useMemo(() => {
    const fields = [
      Boolean(user.displayName),
      Boolean(user.email),
      Boolean(user.firstName),
      Boolean(user.lastName),
      Boolean(user.phone),
      Boolean(user.avatarUrl),
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [user]);

  async function saveProfile() {
    setFeedback(null);
    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => null)) as {
        message?: string;
        user?: PortfolioUser;
      } | null;

      if (!response.ok || !data?.user) {
        setFeedback({
          type: "error",
          message: data?.message ?? "Unable to save your profile.",
        });
        return;
      }

      setUser(data.user);
      setEditing(false);
      setFeedback({ type: "success", message: "Profile updated successfully." });
    } catch {
      setFeedback({ type: "error", message: "Unable to reach the profile service." });
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    setDraft({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      displayName: user.displayName,
      phone: user.phone ?? "",
    });
    setEditing(false);
  }

  async function logOut() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/login");
    router.refresh();
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <FloatingHomeButton />
      <Box sx={{ maxWidth: 1120, mx: "auto", px: { xs: 2, sm: 4 }, pt: { xs: 8, sm: 10 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography color="text.secondary" variant="overline">
              Account center
            </Typography>
            <Typography component="h1" sx={{ textWrap: "balance" }} variant="h3">
              Your profile
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
              Manage your identity, account status, and the details used across the portfolio.
            </Typography>
          </Box>

          <Card variant="outlined">
            <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{
                  alignItems: { sm: "center" },
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={2} sx={{ alignItems: "center", minWidth: 0 }}>
                  <Avatar
                    alt={`${user.displayName} profile picture`}
                    src={user.avatarUrl ?? undefined}
                    sx={{ bgcolor: "primary.main", height: 72, width: 72 }}
                  >
                    {initials(user)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography noWrap variant="h5">
                      {user.displayName}
                    </Typography>
                    <Typography noWrap color="text.secondary">
                      {user.email}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
                      <Chip color="primary" label={user.role} size="small" />
                      <Chip
                        color={user.emailVerified ? "success" : "warning"}
                        icon={<CheckCircleOutlineRoundedIcon />}
                        label={user.emailVerified ? "Email verified" : "Email not verified"}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                </Stack>
                <Button
                  onClick={() => {
                    setSection("personal");
                    setEditing(true);
                  }}
                  startIcon={<EditRoundedIcon />}
                  variant="contained"
                >
                  Edit profile
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {feedback && (
            <Alert aria-live="polite" severity={feedback.type}>
              {feedback.message}
            </Alert>
          )}

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Card component="nav" variant="outlined" sx={{ alignSelf: "flex-start", minWidth: { md: 210 } }}>
              <CardContent sx={{ p: 1 }}>
                <Stack direction={{ xs: "row", md: "column" }} spacing={0.5}>
                  {([
                    ["overview", "Overview", <PersonOutlineRoundedIcon key="overview-icon" />],
                    ["personal", "Personal information", <EditRoundedIcon key="personal-icon" />],
                    ["security", "Security", <SecurityRoundedIcon key="security-icon" />],
                  ] as const).map(([value, label, icon]) => (
                    <Button
                      aria-current={section === value ? "page" : undefined}
                      key={value}
                      onClick={() => setSection(value)}
                      startIcon={icon}
                      sx={{ justifyContent: "flex-start", textAlign: "left", whiteSpace: "nowrap" }}
                      variant={section === value ? "contained" : "text"}
                    >
                      {label}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              {section === "overview" && (
                <Stack spacing={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="h6">Profile completeness</Typography>
                          <Typography color="text.secondary" variant="body2">
                            Add a few more details to make your account easier to recognize.
                          </Typography>
                        </Box>
                        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                          <Typography sx={{ fontWeight: 600 }}>{completion}% complete</Typography>
                          <Typography color="text.secondary" variant="body2">
                            {completion < 100 ? "A few details remain" : "Looking good"}
                          </Typography>
                        </Stack>
                        <LinearProgress aria-label={`Profile ${completion}% complete`} value={completion} variant="determinate" />
                        {completion < 100 && (
                          <Button onClick={() => { setSection("personal"); setEditing(true); }} sx={{ alignSelf: "flex-start" }}>
                            Complete your profile
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <InfoCard label="Member since" value={formatDate(user.createdAt)} />
                    <InfoCard label="Last active" value={formatDate(user.lastLogin)} />
                    <InfoCard label="Sign-in method" value={user.authProvider === "google" ? "Google" : "Email & password"} />
                  </Stack>
                </Stack>
              )}

              {section === "personal" && (
                <Card variant="outlined">
                  <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6">Personal information</Typography>
                        <Typography color="text.secondary" variant="body2">
                          Keep the name and contact details shown on your account.
                        </Typography>
                      </Box>
                      {editing ? (
                        <Stack spacing={2}>
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField fullWidth label="First name" name="firstName" value={draft.firstName} onChange={(event) => setDraft({ ...draft, firstName: event.target.value })} />
                            <TextField fullWidth label="Last name" name="lastName" value={draft.lastName} onChange={(event) => setDraft({ ...draft, lastName: event.target.value })} />
                          </Stack>
                          <TextField fullWidth label="Display name" name="displayName" value={draft.displayName} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} />
                          <TextField fullWidth label="Phone" name="phone" type="tel" autoComplete="tel" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} placeholder="Optional…" />
                          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                            <Button disabled={saving} onClick={cancelEditing}>Cancel</Button>
                            <Button disabled={saving} onClick={saveProfile} variant="contained">{saving ? "Saving…" : "Save changes"}</Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack divider={<Divider />} spacing={2}>
                          <ProfileRow label="First name" value={user.firstName ?? "Not added yet"} />
                          <ProfileRow label="Last name" value={user.lastName ?? "Not added yet"} />
                          <ProfileRow label="Display name" value={user.displayName} />
                          <ProfileRow label="Phone" value={user.phone ?? "Not added yet"} />
                          <Button onClick={() => setEditing(true)} startIcon={<EditRoundedIcon />} sx={{ alignSelf: "flex-start" }}>Edit details</Button>
                        </Stack>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {section === "security" && (
                <Card variant="outlined">
                  <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                    <Stack spacing={2.5}>
                      <Box>
                        <Typography variant="h6">Security & connected accounts</Typography>
                        <Typography color="text.secondary" variant="body2">
                          Review how this account can be accessed.
                        </Typography>
                      </Box>
                      <ProfileRow label="Email status" value={user.emailVerified ? "Verified" : "Verification required"} />
                      <ProfileRow label="Account status" value={user.isActive ? "Active" : "Inactive"} />
                      <Divider />
                      <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Stack direction="row" spacing={1.5}>
                          {user.authProvider === "google" ? <GoogleIcon color="primary" /> : <SecurityRoundedIcon color="primary" />}
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>{user.authProvider === "google" ? "Google" : "Email & password"}</Typography>
                            <Typography color="text.secondary" variant="body2">Connected authentication method</Typography>
                          </Box>
                        </Stack>
                        <Chip color="success" label="Connected" size="small" variant="outlined" />
                      </Stack>
                      <Button color="error" disabled={loggingOut} onClick={logOut} startIcon={<LogoutRoundedIcon />} sx={{ alignSelf: "flex-start" }} variant="outlined">
                        {loggingOut ? "Signing out…" : "Sign out"}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <CardContent>
        <Typography color="text.secondary" variant="caption">{label}</Typography>
        <Typography sx={{ fontWeight: 600, mt: 0.5 }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ overflowWrap: "anywhere", textAlign: "right" }}>{value}</Typography>
    </Stack>
  );
}
