"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useColorMode } from "../../theme/solarThemeProvider";

const reasons = [
  [
    "01",
    "Local knowledge",
    "We design for Mindanao heat, roof types, weather, and grid realities.",
  ],
  [
    "02",
    "Clear recommendations",
    "You get a system sized around your actual property and energy use.",
  ],
  [
    "03",
    "Reliable installation",
    "Our process keeps the work organized from first inspection to commissioning.",
  ],
  [
    "04",
    "Support that stays close",
    "A local team remains available for questions, maintenance, and next steps.",
  ],
] as const;

export default function WhyChooseUsSection() {
  const { mode } = useColorMode();
  const [active, setActive] = useState(0);
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
        setOffset((rect.top + rect.height / 2 - window.innerHeight / 2) * 0.12);
      });
    };

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateOffset);
    };
  }, []);

  return (
    <Box
      id="whyus"
      ref={sectionRef}
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 9, md: 15 },
        bgcolor: "background.paper",
        color: "text.primary",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${mode === "dark" ? "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85" : "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=85"})`,
          backgroundPosition: `center calc(50% + ${offset}px)`,
          backgroundSize: "cover",
          opacity: mode === "dark" ? 0.16 : 0.1,
          transition:
            "background-image .4s ease, background-position .08s linear, opacity .4s ease",
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "background.paper",
          opacity: 0.82,
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack spacing={2} sx={{ mb: { xs: 6, md: 8 }, maxWidth: 680 }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ fontWeight: 800, letterSpacing: ".16em" }}
          >
            Why choose Cotabato Solar
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 42, md: 58 } }}>
            Solar decisions made
            <Box component="span" color="primary.main">
              easier.
            </Box>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 570, lineHeight: 1.7 }}
          >
            The same day-and-night thinking behind our systems shapes how we
            assess, explain, install, and support every project.
          </Typography>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.35fr" },
            gap: { xs: 2, md: 8 },
          }}
        >
          <Stack spacing={1}>
            {reasons.map(([number, title, copy], index) => (
              <Box
                key={number}
                component="button"
                type="button"
                onClick={() => setActive(index)}
                sx={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "42px 1fr",
                  gap: 2,
                  textAlign: "left",
                  p: 2,
                  border: 1,
                  borderColor: active === index ? "primary.main" : "divider",
                  borderRadius: 2,
                  bgcolor: active === index ? "action.hover" : "transparent",
                  color: "text.primary",
                  cursor: "pointer",
                  font: "inherit",
                  transition: "all .25s ease",
                }}
              >
                <Typography color="primary.main" sx={{ fontWeight: 800 }}>
                  {number}
                </Typography>
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 0.5, fontSize: 12, lineHeight: 1.5 }}
                  >
                    {copy}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
          <Box
            sx={{
              minHeight: { xs: 260, md: 350 },
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 3,
              bgcolor: "#143c2c",
              color: "white",
            }}
          >
            <Typography
              color="primary.main"
              sx={{ fontWeight: 800, letterSpacing: ".12em", fontSize: 12 }}
            >
              {reasons[active][0]} / THE DIFFERENCE
            </Typography>
            <Stack spacing={2}>
              <Typography
                variant="h3"
                sx={{ fontSize: { xs: 30, md: 44 }, color: "white" }}
              >
                {reasons[active][1]}
              </Typography>
              <Typography
                sx={{ color: "#c9d9cc", maxWidth: 500, lineHeight: 1.7 }}
              >
                {reasons[active][2]}
              </Typography>
              <Button
                href="#contact"
                variant="contained"
                sx={{ alignSelf: "flex-start", borderRadius: 99 }}
              >
                Talk through your project ↗
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
