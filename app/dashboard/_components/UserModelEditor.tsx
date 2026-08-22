"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import type { PortfolioUser } from "../../../lib/portfolioAuth";
import { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";

export function UserModelEditor({
  user,
  currentAdminId,
}: {
  user: PortfolioUser;
  currentAdminId: string;
}) {
  const { toastError, toastSuccess } = useTwcAlert();
  const [form, setForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    displayName: user.displayName,
    username: user.username ?? "",
    phone: user.phone ?? "",
    role: user.role.toLowerCase() === "admin" ? "admin" : "viewer",
    isActive: user.isActive,
  });
  const [saving, setSaving] = useState(false);

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(result.message ?? "Unable to save user.");
      toastSuccess("User model updated successfully.");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Unable to save user.",
      );
    } finally {
      setSaving(false);
    }
  }

  const isCurrentAdmin = user.id === currentAdminId;
  const isProtectedAdmin = user.role.toLowerCase() === "admin";

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography sx={{ fontWeight: 800 }} variant="h6">
          Edit user model
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
          Update persisted profile and access fields in the Neon user record.
        </Typography>
        <Stack spacing={2} sx={{ mt: 2.5 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              onChange={(event) => updateField("firstName", event.target.value)}
              value={form.firstName}
            />
            <TextField
              fullWidth
              label="Last name"
              onChange={(event) => updateField("lastName", event.target.value)}
              value={form.lastName}
            />
          </Stack>
          <TextField
            fullWidth
            label="Display name"
            onChange={(event) => updateField("displayName", event.target.value)}
            required
            value={form.displayName}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Username"
              onChange={(event) => updateField("username", event.target.value)}
              value={form.username}
            />
            <TextField
              fullWidth
              label="Phone"
              onChange={(event) => updateField("phone", event.target.value)}
              value={form.phone}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="user-role-label">Role</InputLabel>
              <Select
                label="Role"
                labelId="user-role-label"
                onChange={(event) => updateField("role", event.target.value)}
                value={form.role}
              >
                <MenuItem value="viewer">Viewer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  disabled={isCurrentAdmin}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                />
              }
              label="Active account"
              sx={{ minWidth: { sm: 180 } }}
            />
          </Stack>
          <Button
            disabled={
              saving ||
              (isCurrentAdmin && !form.isActive) ||
              (isProtectedAdmin && form.role !== "admin")
            }
            onClick={save}
            startIcon={<SaveRoundedIcon />}
            variant="contained"
          >
            {saving ? "Saving…" : "Save user model"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
