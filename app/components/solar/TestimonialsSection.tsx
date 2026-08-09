"use client";

import { useEffect, useState } from "react";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";

const testimonials = [
  [
    "MS",
    "Maria Santos",
    "Homeowner, Cotabato City",
    "The team explained everything clearly and helped us understand what our roof could support. The process felt simple from start to finish.",
  ],
  [
    "RC",
    "Roberto Cruz",
    "Business owner, Carmen",
    "Our system was planned around our operating hours, so the savings make sense for the business instead of just looking good on paper.",
  ],
  [
    "AR",
    "Ana Reyes",
    "Homeowner, Kidapawan",
    "They were organized, responsive, and patient with every question. We finally feel confident about our home’s energy future.",
  ],
] as const;

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [active]);

  const testimonial = testimonials[active];

  return (
    <Box
      id="testimonials"
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        py: { xs: 9, md: 14 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          width: 340,
          height: 340,
          borderRadius: "50%",
          border: 1,
          borderColor: "primary.contrastText",
          opacity: 0.12,
          top: -130,
          right: -90,
        }}
      />
      <Container
        maxWidth="md"
        sx={{ position: "relative", textAlign: "center" }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "inherit",
            opacity: 0.72,
            fontWeight: 800,
            letterSpacing: ".16em",
          }}
        >
          From homes and businesses we serve
        </Typography>
        <Typography
          variant="h2"
          sx={{ color: "inherit", fontSize: { xs: 40, md: 56 }, mt: 1 }}
        >
          What our clients say.
        </Typography>
        <Box
          sx={{
            minHeight: { xs: 280, md: 245 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography
            sx={{
              color: "inherit",
              opacity: 0.95,
              fontSize: { xs: 20, md: 27 },
              lineHeight: 1.5,
              maxWidth: 760,
            }}
          >
            “{testimonial[3]}”
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "primary.contrastText",
                color: "primary.main",
                fontWeight: 800,
              }}
            >
              {testimonial[0]}
            </Box>
            <Box sx={{ textAlign: "left" }}>
              <Typography sx={{ color: "inherit", fontWeight: 800 }}>
                {testimonial[1]}
              </Typography>
              <Typography sx={{ color: "inherit", opacity: 0.7, fontSize: 12 }}>
                {testimonial[2]}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
          <IconButton
            onClick={() =>
              setActive(
                (active - 1 + testimonials.length) % testimonials.length,
              )
            }
            aria-label="Previous testimonial"
            sx={{ color: "inherit" }}
          >
            ‹
          </IconButton>
          {testimonials.map((item, index) => (
            <Box
              key={item[0]}
              component="button"
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show testimonial from ${item[1]}`}
              sx={{
                width: active === index ? 26 : 7,
                height: 7,
                p: 0,
                border: 0,
                borderRadius: 99,
                bgcolor: "primary.contrastText",
                opacity: active === index ? 1 : 0.45,
                cursor: "pointer",
                alignSelf: "center",
                transition: "all .25s ease",
              }}
            />
          ))}
          <IconButton
            onClick={() => setActive((active + 1) % testimonials.length)}
            aria-label="Next testimonial"
            sx={{ color: "inherit" }}
          >
            ›
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
}
