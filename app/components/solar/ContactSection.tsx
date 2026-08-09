"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const serviceAreas = [
  "Cotabato City",
  "Kidapawan",
  "Carmen",
  "Midsayap",
  "Tacurong",
  "Isulan",
  "Maguindanao",
  "Sultan Kudarat",
  "South Cotabato",
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const updateOffset = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current;

        if (!section) {
          return;
        }

        const rect = section.getBoundingClientRect();
        setOffset((rect.top + rect.height / 2 - window.innerHeight / 2) * 0.08);
      });
    };

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateOffset);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Box
      id="contact"
      ref={sectionRef}
      component="section"
      sx={{ bgcolor: "background.default" }}
    >
      <Box
        sx={{
          minHeight: { xs: 360, md: 460 },
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=90)",
            backgroundPosition: `center calc(50% + ${offset}px)`,
            backgroundSize: "cover",
            transition: "background-position .08s linear",
          }}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(5,18,12,.96), rgba(5,18,12,.72) 48%, rgba(5,18,12,.18))",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={2} sx={{ maxWidth: 700, py: { xs: 7, md: 9 } }}>
            <Typography
              variant="overline"
              color="primary.main"
              sx={{ fontWeight: 800, letterSpacing: ".16em" }}
            >
              Start with a free assessment
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: "white", fontSize: { xs: 43, md: 65 } }}
            >
              Let&apos;s make your roof
              <Box component="span" color="primary.main">
                work harder.
              </Box>
            </Typography>
            <Typography
              sx={{ color: "#d2e2d5", maxWidth: 570, lineHeight: 1.7 }}
            >
              Tell us where you are, what you want to power, and what your
              monthly bill looks like. We&apos;ll help you understand the next
              sensible step.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{ py: { xs: 8, md: 13 }, color: "text.primary" }}
      >
        <Grid container spacing={{ xs: 6, md: 10 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={4}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{ fontSize: { xs: 30, md: 38 }, mb: 1.5 }}
                >
                  A local conversation first.
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Our team is based in Cotabato and works with homeowners,
                  businesses, farms, schools, and growing properties across
                  Mindanao.
                </Typography>
              </Box>
              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    color="primary.main"
                    sx={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: ".12em",
                    }}
                  >
                    OFFICE
                  </Typography>
                  <Typography sx={{ mt: 0.5 }}>
                    Cotabato City, Maguindanao del Norte
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    Philippines · By appointment
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    color="primary.main"
                    sx={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: ".12em",
                    }}
                  >
                    CONTACT
                  </Typography>
                  <Typography sx={{ mt: 0.5 }}>
                    hello@cotabatosolar.ph
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    Mon–Sat · 9:00 AM–5:00 PM
                  </Typography>
                </Box>
              </Stack>
              <Box>
                <Typography
                  color="primary.main"
                  sx={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: ".12em",
                    mb: 1.5,
                  }}
                >
                  SERVICE AREA
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ flexWrap: "wrap" }}
                >
                  {serviceAreas.map((area) => (
                    <Chip
                      key={area}
                      label={area}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
              <Box
                sx={{
                  height: 210,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Box
                  component="iframe"
                  title="Cotabato Solar office map"
                  src="https://www.google.com/maps?q=Cotabato+City,+Maguindanao+del+Norte,+Philippines&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sx={{ width: "100%", height: "100%", border: 0 }}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: { xs: 3, md: 5 },
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              {submitted ? (
                <Stack
                  spacing={2}
                  sx={{
                    minHeight: 440,
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography color="primary.main" sx={{ fontSize: 44 }}>
                    ✓
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontSize: { xs: 30, md: 40 } }}
                  >
                    Thanks for reaching out.
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, maxWidth: 480 }}
                  >
                    We&apos;ve received your details. Our team will review your
                    property information and get back to you soon.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another request
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={2.5}>
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{ fontSize: { xs: 30, md: 40 } }}
                    >
                      Request your assessment.
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1, fontSize: 14 }}
                    >
                      A few details help us prepare a more useful first
                      conversation.
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        label="Your name"
                        name="name"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        type="email"
                        label="Email address"
                        name="email"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Phone number" name="phone" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Property type"
                        name="propertyType"
                        defaultValue="home"
                      >
                        <MenuItem value="home">Home</MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                        <MenuItem value="farm">Farm, school, or other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Average monthly electricity bill"
                        name="bill"
                        placeholder="e.g. ₱6,500"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Tell us about your roof or energy goals"
                        name="message"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ alignSelf: "flex-start", borderRadius: 99, px: 3 }}
                  >
                    Request a free assessment ↗
                  </Button>
                  <Typography color="text.secondary" sx={{ fontSize: 11 }}>
                    No pressure, no obligation. This is an initial conversation,
                    not a final quotation.
                  </Typography>
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
