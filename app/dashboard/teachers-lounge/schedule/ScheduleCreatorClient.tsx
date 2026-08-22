"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useTwcAlert } from "../../../components/portfolio/TwcAlertSystem";

type Entry = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  section: string | null;
  room: string | null;
  notes: string | null;
};

type Schedule = {
  id: string;
  name: string;
  academicPeriod: string | null;
  entries: Entry[];
};

export default function ScheduleCreatorClient() {
  const { showModal, toastError, toastSuccess } = useTwcAlert();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [name, setName] = useState("");
  const [academicPeriod, setAcademicPeriod] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAcademicPeriod, setEditAcademicPeriod] = useState("");

  async function loadSchedules() {
    setLoading(true);
    try {
      const response = await fetch("/api/teacher/schedules", {
        cache: "no-store",
      });
      const data = (await response.json()) as {
        schedules?: Schedule[];
        message?: string;
      };
      if (!response.ok)
        throw new Error(data.message ?? "Unable to load schedules.");
      setSchedules(data.schedules ?? []);
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Unable to load schedules.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSchedules();
  }, []);

  async function createSchedule() {
    if (!name.trim()) {
      toastError("Enter a schedule name first.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/teacher/schedules", {
        body: JSON.stringify({ academicPeriod, entries: [], name }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as {
        schedule?: Schedule;
        message?: string;
      };
      if (!response.ok || !data.schedule)
        throw new Error(data.message ?? "Unable to create schedule.");
      setSchedules((current) => [data.schedule!, ...current]);
      setName("");
      setAcademicPeriod("");
      toastSuccess("Schedule created.");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Unable to create schedule.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeSchedule(schedule: Schedule) {
    const confirmation = await showModal({
      title: `Delete ${schedule.name}?`,
      content: "This permanently removes the schedule and its entries.",
      type: "warning",
      confirmText: "Delete schedule",
      cancelText: "Keep schedule",
    });
    if (confirmation.action !== "confirm") return;
    try {
      const response = await fetch(`/api/teacher/schedules/${schedule.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(data.message ?? "Unable to delete schedule.");
      setSchedules((current) =>
        current.filter((item) => item.id !== schedule.id),
      );
      toastSuccess("Schedule deleted.");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Unable to delete schedule.",
      );
    }
  }

  function beginEdit(schedule: Schedule) {
    setEditingId(schedule.id);
    setEditName(schedule.name);
    setEditAcademicPeriod(schedule.academicPeriod ?? "");
  }

  async function saveEdit() {
    if (!editingId || !editName.trim()) return;
    try {
      const response = await fetch(`/api/teacher/schedules/${editingId}`, {
        body: JSON.stringify({
          academicPeriod: editAcademicPeriod,
          name: editName,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const data = (await response.json()) as {
        message?: string;
        schedule?: Schedule;
      };
      if (!response.ok || !data.schedule) {
        throw new Error(data.message ?? "Unable to update schedule.");
      }
      setSchedules((current) =>
        current.map((item) =>
          item.id === data.schedule?.id ? data.schedule : item,
        ),
      );
      setEditingId(null);
      toastSuccess("Schedule updated.");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Unable to update schedule.",
      );
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          color="primary.main"
          sx={{ fontWeight: 800, letterSpacing: "0.08em" }}
          variant="overline"
        >
          TEACHER&apos;S LOUNGE
        </Typography>
        <Typography component="h1" sx={{ fontWeight: 850 }} variant="h3">
          Schedule Creator
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Create private schedules that belong to your teacher account.
        </Typography>
      </Box>
      <Card variant="outlined">
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 800 }} variant="h6">
              New schedule
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Schedule name"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
              <TextField
                fullWidth
                label="Academic period (optional)"
                onChange={(event) => setAcademicPeriod(event.target.value)}
                value={academicPeriod}
              />
            </Stack>
            <Button
              disabled={saving}
              onClick={createSchedule}
              startIcon={
                saving ? <CircularProgress size={18} /> : <AddRoundedIcon />
              }
              sx={{ alignSelf: "flex-start" }}
              variant="contained"
            >
              {saving ? "Creating…" : "Create schedule"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
      {loading ? (
        <Typography color="text.secondary">Loading your schedules…</Typography>
      ) : !schedules.length ? (
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontWeight: 800 }} variant="h6">
              No schedules yet.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Create your first teaching schedule to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        schedules.map((schedule) => (
          <Card key={schedule.id} variant="outlined">
            <CardContent>
              {editingId === schedule.id ? (
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Schedule name"
                    onChange={(event) => setEditName(event.target.value)}
                    value={editName}
                  />
                  <TextField
                    fullWidth
                    label="Academic period"
                    onChange={(event) =>
                      setEditAcademicPeriod(event.target.value)
                    }
                    value={editAcademicPeriod}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button onClick={saveEdit} variant="contained">
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 800 }} variant="h6">
                      {schedule.name}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {schedule.academicPeriod ?? "No academic period set"} ·{" "}
                      {schedule.entries.length} entries
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => beginEdit(schedule)}
                      startIcon={<EditRoundedIcon />}
                      variant="outlined"
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      onClick={() => removeSchedule(schedule)}
                      startIcon={<DeleteOutlineRoundedIcon />}
                      variant="outlined"
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              )}
              {schedule.entries.length > 0 && (
                <Stack divider={<Divider />} sx={{ mt: 2 }}>
                  {schedule.entries.map((entry) => (
                    <Stack
                      key={entry.id}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{ py: 1 }}
                    >
                      <Typography sx={{ minWidth: 150 }}>
                        {entry.day} · {entry.startTime}–{entry.endTime}
                      </Typography>
                      <Typography color="text.secondary">
                        {entry.subject}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
}
