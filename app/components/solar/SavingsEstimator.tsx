"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

export default function SavingsEstimator({
  onAssessment,
}: {
  onAssessment: () => void;
}) {
  const [bill, setBill] = useState(6500);
  const kw = useMemo(
    () => Math.max(1, Math.round((bill / 950) * 10) / 10),
    [bill],
  );
  const savings = useMemo(() => Math.round(bill * 0.72), [bill]);
  return (
    <Container
      maxWidth="lg"
      id="estimate"
      sx={{ py: { xs: 8, md: 15 }, color: "text.primary" }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 3, md: 8 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 7,
        }}
      >
        <Stack spacing={2.5}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 800, letterSpacing: ".16em" }}
          >
            Start with a simple estimate
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 43, md: 52 }, mt: 1 }}>
            What could your
            <br />
            <Box component="span" color="primary.dark">
              sunlight save?
            </Box>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.7, maxWidth: 330 }}
          >
            Share your average monthly bill for a quick, non-final estimate. A
            proper site assessment will give you the complete picture.
          </Typography>
          <Button
            onClick={onAssessment}
            variant="contained"
            sx={{ borderRadius: 99 }}
          >
            Book a proper assessment ↗
          </Button>
        </Stack>
        <Paper
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 2,
            alignSelf: "center",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Stack spacing={2.5}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", gap: 2 }}
            >
              <Typography sx={{ fontSize: 12 }}>
                Average monthly electricity bill
              </Typography>
              <Typography color="primary.dark" sx={{ fontWeight: 800 }}>
                ₱{bill.toLocaleString()}
              </Typography>
            </Stack>
            <Box>
              <Slider
                value={bill}
                min={2000}
                max={30000}
                step={500}
                onChange={(_, value) => setBill(value as number)}
                aria-label="Average monthly electricity bill"
              />
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", mt: 0.5 }}
              >
                <Typography color="text.secondary" sx={{ fontSize: 10 }}>
                  ₱2,000
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 10 }}>
                  ₱30,000+
                </Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                bgcolor: "#143c2c",
                color: "white",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography sx={{ fontSize: 11 }} color="#c9d9cc">
                Your property may benefit from approximately
              </Typography>
              <Typography
                sx={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.06em" }}
              >
                {kw} kW
              </Typography>
              <Typography sx={{ fontSize: 11 }} color="#9db3a0">
                of solar capacity
              </Typography>
              <Box sx={{ borderTop: 1, borderColor: "#476655", my: 2 }} />
              <Typography sx={{ fontSize: 11 }} color="#c9d9cc">
                Potential bill reduction of up to
              </Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 800 }}>
                ₱{savings.toLocaleString()}
                <Typography
                  component="span"
                  sx={{ fontSize: 12 }}
                  color="#9db3a0"
                >
                  {" "}
                  / month
                </Typography>
              </Typography>
              <Typography
                sx={{ display: "block", mt: 2, fontSize: 9 }}
                color="#9db3a0"
              >
                Initial estimate only · Actual results vary by site
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
