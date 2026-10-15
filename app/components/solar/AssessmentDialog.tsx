"use client";

import { useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function AssessmentDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    }).catch(() => null);

    setSubmitting(false);

    if (!response?.ok) {
      const result = (await response?.json().catch(() => null)) as {
        message?: unknown;
      } | null;
      setSubmitError(
        typeof result?.message === "string"
          ? result.message
          : "We couldn’t send your request. Please email hello@cotabatosolar.ph.",
      );
      return;
    }

    setSubmitted(true);
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { color: "text.primary" } } }}
    >
      <form onSubmit={submit}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 28 }}>
          Let&apos;s plan your solar setup
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.2} sx={{ pt: 1 }}>
            {submitError && (
              <Typography color="error" role="alert">
                {submitError}
              </Typography>
            )}
            {submitted ? (
              <Typography color="primary" sx={{ py: 4 }}>
                Thanks! We&apos;ll use these details to prepare your initial
                conversation. Our local team will be in touch soon.
              </Typography>
            ) : (
              <>
                <TextField required label="Your name" name="name" fullWidth />
                <TextField
                  required
                  type="email"
                  label="Email address"
                  name="email"
                  fullWidth
                />
                <TextField
                  select
                  label="Property type"
                  name="propertyType"
                  defaultValue="home"
                  fullWidth
                >
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="farm">Farm or school</MenuItem>
                </TextField>
                <TextField
                  label="What would you like us to know?"
                  name="message"
                  multiline
                  minRows={3}
                  fullWidth
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {submitted ? (
            <Button onClick={onClose} variant="contained">
              Done
            </Button>
          ) : (
            <>
              <Button onClick={onClose}>Maybe later</Button>
              <Button disabled={submitting} type="submit" variant="contained">
                {submitting ? "Sending request…" : "Request assessment"}
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
