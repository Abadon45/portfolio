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
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
            {submitted ? (
              <Typography color="primary" sx={{ py: 4 }}>
                Thanks! We&apos;ll use these details to prepare your initial
                conversation. Our local team will be in touch soon.
              </Typography>
            ) : (
              <>
                <TextField required label="Your name" fullWidth />
                <TextField
                  required
                  type="email"
                  label="Email address"
                  fullWidth
                />
                <TextField
                  select
                  label="Property type"
                  defaultValue="home"
                  fullWidth
                >
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="farm">Farm or school</MenuItem>
                </TextField>
                <TextField
                  label="What would you like us to know?"
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
              <Button type="submit" variant="contained">
                Request assessment
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
