"use client";

import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import NorthRoundedIcon from "@mui/icons-material/NorthRounded";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { FloatingHomeButton } from "../../components/FloatingHomeButton";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import { NightcurrentHero } from "./NightcurrentHero";

const locations = [
  [
    "The Blackwater Shelf",
    "A basalt shoreline where the tide leaves behind glassy mineral fragments and unfamiliar signals.",
    "#e8aa71",
  ],
  [
    "Station 04",
    "An abandoned weather station still transmitting one incomplete reading every midnight.",
    "#9ab7c2",
  ],
  [
    "The Lantern Fields",
    "Wind-bent grasslands lit by small blue organisms that gather around old survey markers.",
    "#87b69c",
  ],
] as const;

const reportRows = [
  [
    "Historical structure",
    "Recovered",
    "Navigation rhythm, cinematic sequencing, and environmental depth were used as design evidence.",
  ],
  [
    "Original visual assets",
    "New",
    "Nightcurrent branding, Tideglass Island scenes, copy, and UI are intentionally original.",
  ],
  [
    "Backend integrations",
    "Unavailable",
    "The demo is a self-contained frontend reconstruction; no purchase, account, or analytics system is invented.",
  ],
  [
    "Parallax behavior",
    "Reconstructed",
    "A single camera drives hero-relative pointer and scroll depth with a static reduced-motion presentation.",
  ],
] as const;

export function NightcurrentPage() {
  return (
    <Box
      sx={{
        bgcolor: "#101d27",
        color: "#f4efe5",
        minHeight: "100vh",
      }}
    >
      <Box
        component="header"
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          left: 0,
          px: { xs: 2.5, md: 6 },
          py: 2.5,
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ alignItems: "center", display: "flex", gap: 1.2 }}>
          <NorthRoundedIcon sx={{ color: "#e8aa71" }} />
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
            }}
          >
            NIGHTCURRENT
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={3}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          {[
            ["World", "world"],
            ["Story", "story"],
            ["Recovery", "recovery"],
          ].map(([label, id]) => (
            <Typography
              key={id}
              component="a"
              href={`#${id}`}
              sx={{
                color: "inherit",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textDecoration: "none",
              }}
            >
              {label}
            </Typography>
          ))}
        </Stack>
      </Box>

      <Box component="main">
        <NightcurrentHero />

        <Box
          id="world"
          component="section"
          sx={{ bgcolor: "#f1eadc", color: "#20343a", py: { xs: 9, md: 16 } }}
        >
          <Container maxWidth="lg">
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 4, md: 12 }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#b76e4f",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                  }}
                >
                  01 / THE WORLD
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: "Georgia, serif",
                    fontSize: { xs: "3rem", md: "5.2rem" },
                    fontWeight: 400,
                    letterSpacing: "-0.05em",
                    lineHeight: 0.95,
                    mt: 2,
                  }}
                >
                  A coast
                  <br />
                  without a map.
                </Typography>
              </Box>
              <Box sx={{ flex: 1, pt: { md: 6 } }}>
                <Typography
                  sx={{ color: "#53686b", fontSize: "1.1rem", lineHeight: 1.8 }}
                >
                  Tideglass Island sits just outside the shipping lanes:
                  volcanic, wind-scoured, and threaded with the remains of a
                  research program no one remembers commissioning. Every place
                  has a trace. Every trace points farther out.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <ExploreRoundedIcon sx={{ color: "#b76e4f" }} />
                  <Typography
                    sx={{
                      color: "#53686b",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      pt: 0.4,
                    }}
                  >
                    EXPLORE THE UNMARKED
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                mt: 10,
              }}
            >
              {locations.map(([title, text, accent]) => (
                <Box
                  key={title}
                  sx={{
                    bgcolor: "#e4dccb",
                    minHeight: 280,
                    overflow: "hidden",
                    p: 3,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: accent,
                      clipPath:
                        "polygon(0 45%, 40% 20%, 75% 50%, 100% 27%, 100% 100%, 0 100%)",
                      inset: 0,
                      opacity: 0.75,
                      position: "absolute",
                    }}
                  />
                  <Box sx={{ position: "relative", zIndex: 1, mt: 19 }}>
                    <Typography
                      component="h3"
                      sx={{ fontFamily: "Georgia, serif", fontSize: "1.7rem" }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#53686b",
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        mt: 1,
                      }}
                    >
                      {text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        <Box
          id="story"
          component="section"
          sx={{ bgcolor: "#152832", py: { xs: 10, md: 18 } }}
        >
          <Container maxWidth="md">
            <Typography
              sx={{
                color: "#e8aa71",
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
              }}
            >
              02 / THE STORY
            </Typography>
            <Typography
              component="h2"
              sx={{
                color: "#f4efe5",
                fontFamily: "Georgia, serif",
                fontSize: { xs: "3rem", md: "5.8rem" },
                fontWeight: 400,
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                mt: 2,
              }}
            >
              A signal is a promise
              <br />
              you can’t unhear.
            </Typography>
            <Typography
              sx={{
                color: "#b6c5c4",
                fontSize: "1.1rem",
                lineHeight: 1.85,
                maxWidth: 620,
                mt: 5,
              }}
            >
              Mara Venn arrives to catalogue the island’s abandoned instruments.
              On her first night, Station 04 wakes up. The transmission contains
              a second voice — not a message, but a map being drawn in real
              time.
            </Typography>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.16)", my: 6 }} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={5}>
              {[
                "ARRIVE AFTER DARK",
                "FOLLOW WHAT FLICKERS",
                "DECIDE WHAT TO BRING BACK",
              ].map((label, index) => (
                <Box key={label}>
                  <Typography
                    sx={{
                      color: "#f4efe5",
                      fontFamily: "Georgia, serif",
                      fontSize: "2rem",
                    }}
                  >{`0${index + 1}`}</Typography>
                  <Typography
                    sx={{ color: "#91a9ac", fontSize: "0.8rem", mt: 1 }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>

        <Box
          id="recovery"
          component="section"
          sx={{ bgcolor: "#d8e0da", color: "#20343a", py: { xs: 9, md: 14 } }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                alignItems: { md: "flex-end" },
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 5,
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#b76e4f",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                  }}
                >
                  03 / RECOVERY NOTES
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: "Georgia, serif",
                    fontSize: { xs: "3rem", md: "4.5rem" },
                    fontWeight: 400,
                    letterSpacing: "-0.05em",
                    lineHeight: 0.95,
                    mt: 2,
                  }}
                >
                  What was found,
                  <br />
                  what was made.
                </Typography>
              </Box>
              <Typography
                sx={{ color: "#53686b", lineHeight: 1.8, maxWidth: 380 }}
              >
                A concise record of the archive-informed decisions behind this
                portfolio reconstruction. Historical design principles are
                separated from original production content.
              </Typography>
            </Box>
            <Box sx={{ mt: 8 }}>
              {reportRows.map(([element, status, note]) => (
                <Box
                  key={element}
                  sx={{
                    borderTop: "1px solid rgba(32,52,58,0.18)",
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "1fr 150px 2fr" },
                    py: 3,
                  }}
                >
                  <Typography sx={{ fontWeight: 800 }}>{element}</Typography>
                  <Chip
                    label={status}
                    size="small"
                    sx={{
                      color: "#b76e4f",
                      fontWeight: 800,
                      justifySelf: "start",
                    }}
                  />
                  <Typography sx={{ color: "#53686b", lineHeight: 1.6 }}>
                    {note}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        <Box
          component="section"
          sx={{
            bgcolor: "#0b1820",
            py: { xs: 9, md: 13 },
            textAlign: "center",
          }}
        >
          <Container maxWidth="sm">
            <MenuBookRoundedIcon sx={{ color: "#e8aa71", fontSize: 34 }} />
            <Typography
              component="h2"
              sx={{
                color: "#f4efe5",
                fontFamily: "Georgia, serif",
                fontSize: { xs: "2.7rem", md: "4rem" },
                fontWeight: 400,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                mt: 2,
              }}
            >
              The horizon is a beginning.
            </Typography>
            <Typography sx={{ color: "#91a9ac", lineHeight: 1.7, mt: 3 }}>
              Nightcurrent is an original fictional IP created for a portfolio
              reconstruction study. No original game artwork, branding, story,
              or backend services are reproduced.
            </Typography>
            <Button
              href="/"
              variant="outlined"
              sx={{ borderColor: "#e8aa71", color: "#e8aa71", mt: 4 }}
            >
              Return to portfolio
            </Button>
          </Container>
        </Box>
      </Box>
      <FloatingHomeButton />
      <ScrollToTopButton
        color="secondary"
        sx={{
          bgcolor: "#e8aa71",
          color: "#17232b",
          "&:hover": { bgcolor: "#f3bf89" },
        }}
      />
    </Box>
  );
}
