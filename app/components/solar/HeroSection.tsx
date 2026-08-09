"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Fade,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useColorMode } from "../../theme/solarThemeProvider";

const slides = [
  {
    eyebrow: "DAY MODE · SOLAR ROOFING FOR HOMES",
    title: (
      <>
        Capture the day.
        <br />
        <Box component="span" color="primary.main">
          Power the night.
        </Box>
      </>
    ),
    copy: "Turn your roof into a cleaner, more affordable source of electricity for the people and routines that make your house a home.",
    chip: "☼  Energy being generated",
    stat: "4.8 kW",
    statLabel: "clean power from the sun",
    image:
      "https://images.squarespace-cdn.com/content/v1/65bdc1cdcec94a301b91fe76/4dd7281a-611a-47d1-95de-ad9d043e0ad0/18%2BkW%2BSunsynk%2BGen%2B2%2BHybrid%2BSolar%2BEnergy%2BSystem%2BMuntinlupa%2BCity%2B%282%29.webp?format=1500w",
    mode: "light" as const,
  },
  {
    eyebrow: "DAY MODE · ROOF-READY ENERGY",
    title: (
      <>
        Built for your roof.
        <br />
        <Box component="span" color="primary.main">
          Ready for your life.
        </Box>
      </>
    ),
    copy: "A properly planned rooftop system can work with the way Filipino families use energy—from morning routines to evening meals.",
    chip: "↗  Roof sized for you",
    stat: "5–8 kW",
    statLabel: "common home range",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1800&q=90",
    mode: "light" as const,
  },
  {
    eyebrow: "DAY MODE · SMARTER SAVINGS",
    title: (
      <>
        Let sunlight do
        <br />
        <Box component="span" color="primary.main">
          more for you.
        </Box>
      </>
    ),
    copy: "Generate more of your own electricity during the day and make every square meter of your roof work harder.",
    chip: "☼  Daytime generation",
    stat: "72%",
    statLabel: "potential bill reduction*",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=90",
    mode: "light" as const,
  },
  {
    eyebrow: "NIGHT MODE · ROOFTOP BATTERY BACKUP",
    title: (
      <>
        When the sun goes down,
        <br />
        <Box component="span" color="primary.main">
          your power stays on.
        </Box>
      </>
    ),
    copy: "With the right battery-backed roof system, the energy you made during the day keeps working after sunset and through unexpected outages.",
    chip: "☾  Battery backup ready",
    stat: "24/7",
    statLabel: "energy confidence",
    image:
      "https://images.squarespace-cdn.com/content/v1/65bdc1cdcec94a301b91fe76/a1b73267-a168-4574-8ee1-a3b354c1c240/AIKO%2Bsolar%2Bpanel%2Binstallation%2Bin%2Bthe%2BPhilippines%2B2.png?format=1500w",
    mode: "dark" as const,
  },
  {
    eyebrow: "NIGHT MODE · HOME ENERGY CONFIDENCE",
    title: (
      <>
        Keep the essentials
        <br />
        <Box component="span" color="primary.main">
          powered on.
        </Box>
      </>
    ),
    copy: "With battery backup, your lights, internet, refrigerator, and work-from-home setup can stay ready after sunset or during an outage.",
    chip: "☾  Backup-ready home",
    stat: "24/7",
    statLabel: "energy confidence",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=90",
    mode: "dark" as const,
  },
];

export default function HeroSection({
  onAssessment,
}: {
  onAssessment: () => void;
}) {
  const { mode, toggleMode } = useColorMode();
  const [active, setActive] = useState(mode === "dark" ? 3 : 0);
  const [isVisible, setIsVisible] = useState(true);
  const heroRef = useRef<HTMLElement | null>(null);
  const slide = slides[active];
  const heroText = mode === "dark" ? "#f4faef" : "#17241e";
  const heroMutedText = mode === "dark" ? "#d6e6d9" : "#294137";

  useEffect(() => {
    if (slides[active].mode !== mode) {
      setActive(mode === "dark" ? 3 : 0);
    }
  }, [active, mode]);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      const next = (active + 1) % slides.length;
      setActive(next);
      if (slides[next].mode !== mode) toggleMode();
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [active, isVisible, mode, toggleMode]);

  function selectSlide(index: number) {
    setActive(index);
    if (slides[index].mode !== mode) toggleMode();
  }

  function move(direction: number) {
    selectSlide((active + direction + slides.length) % slides.length);
  }

  return (
    <Box
      component="section"
      ref={heroRef}
      sx={{ width: "100%", bgcolor: "background.default", overflow: "hidden" }}
      aria-roledescription="carousel"
      aria-label="How solar works through the day and night"
    >
      <Box
        sx={{
          height: { xs: 760, md: "calc(100svh - 126px)" },
          minHeight: { md: 650 },
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            transition: "background-image .4s ease",
          }}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              mode === "dark"
                ? "linear-gradient(90deg, rgba(5,18,12,.98) 0%, rgba(5,18,12,.82) 42%, rgba(5,18,12,.24) 100%)"
                : "linear-gradient(90deg, rgba(247,250,245,.94) 0%, rgba(247,250,245,.72) 40%, rgba(247,250,245,.12) 78%, rgba(247,250,245,.02) 100%)",
            transition: "background .4s ease",
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            py: { xs: 6, md: 7 },
            pb: { xs: 13, md: 12 },
          }}
        >
          <Fade in key={active} timeout={400}>
            <Box sx={{ maxWidth: 650, color: heroText }}>
              <Typography
                variant="overline"
                sx={{
                  color: heroMutedText,
                  fontWeight: 800,
                  letterSpacing: ".16em",
                }}
              >
                {slide.eyebrow}
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  color: heroText,
                  fontSize: { xs: 44, md: 64 },
                  mt: 2.5,
                  mb: 3,
                }}
              >
                {slide.title}
              </Typography>
              <Typography
                sx={{
                  color: heroMutedText,
                  fontSize: 17,
                  lineHeight: 1.65,
                  maxWidth: 490,
                }}
              >
                {slide.copy}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2.5}
                sx={{ alignItems: { xs: "stretch", sm: "center" }, mt: 4 }}
              >
                <Button
                  onClick={onAssessment}
                  variant="contained"
                  size="large"
                  sx={{ borderRadius: 99, px: 3 }}
                >
                  Get a free assessment ↗
                </Button>
                <Button href="#solutions" color="inherit">
                  Explore solutions ↗
                </Button>
              </Stack>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ alignItems: { xs: "flex-start", sm: "center" }, mt: 5 }}
              >
                <Chip
                  label={slide.chip}
                  sx={{
                    bgcolor: "background.paper",
                    color: "text.primary",
                    fontWeight: 700,
                    border: 1,
                    borderColor: "divider",
                  }}
                />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "baseline" }}
                >
                  <Typography
                    color="primary.main"
                    sx={{ fontSize: 27, fontWeight: 800 }}
                  >
                    {slide.stat}
                  </Typography>
                  <Typography sx={{ color: heroMutedText, fontSize: 11 }}>
                    {slide.statLabel}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Fade>
        </Container>
        <IconButton
          onClick={() => move(-1)}
          aria-label="Previous solar cycle"
          sx={{
            position: "absolute",
            left: { xs: 12, md: 28 },
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            width: { xs: 36, md: 44 },
            height: { xs: 36, md: 44 },
            color: "text.primary",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            boxShadow: 2,
            transition: "transform .2s ease, background-color .25s ease",
            "&:hover": {
              bgcolor: "background.paper",
              transform: "translateY(-50%) scale(1.06)",
            },
          }}
        >
          ‹
        </IconButton>
        <IconButton
          onClick={() => move(1)}
          aria-label="Next solar cycle"
          sx={{
            position: "absolute",
            right: { xs: 12, md: 28 },
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            width: { xs: 36, md: 44 },
            height: { xs: 36, md: 44 },
            color: "text.primary",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            boxShadow: 2,
            transition: "transform .2s ease, background-color .25s ease",
            "&:hover": {
              bgcolor: "background.paper",
              transform: "translateY(-50%) scale(1.06)",
            },
          }}
        >
          ›
        </IconButton>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            left: "50%",
            bottom: { xs: 20, md: 28 },
            transform: "translateX(-50%)",
            zIndex: 2,
            alignItems: "center",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            borderRadius: 99,
            px: 1,
            py: 0.5,
            boxShadow: 2,
          }}
        >
          {slides.map((item, index) => (
            <Box
              key={item.eyebrow}
              component="button"
              onClick={() => selectSlide(index)}
              aria-label={`Show ${item.eyebrow.toLowerCase()}`}
              aria-current={active === index}
              sx={{
                border: 0,
                cursor: "pointer",
                width: active === index ? 28 : 7,
                height: 7,
                borderRadius: 99,
                bgcolor: active === index ? "primary.main" : "text.secondary",
                opacity: active === index ? 1 : 0.4,
                transition: "all .25s",
                p: 0,
              }}
            />
          ))}
        </Stack>
        <Typography
          sx={{
            position: "absolute",
            right: { xs: 18, md: "calc((100% - 1180px) / 2)" },
            bottom: { xs: 32, md: 38 },
            color: heroMutedText,
            fontSize: 10,
            zIndex: 2,
          }}
        >
          *Initial estimate only
        </Typography>
      </Box>
    </Box>
  );
}
