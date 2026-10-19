"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { Box, Button, Divider, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { FloatingHomeButton } from "../../components/FloatingHomeButton";
import { Eyebrow } from "../../components/portfolio/Eyebrow";
import { PortfolioShell } from "../../components/portfolio/PortfolioShell";

const projectFacts = [
  { label: "Project", value: "Medora · Healthcare discovery" },
  { label: "Audience", value: "People looking for care in the Philippines" },
  { label: "Primary paths", value: "Specialty, city, doctor, and clinic discovery" },
  { label: "Live site", value: "medora-ph.vercel.app" },
];

const findings = [
  {
    title: "A clear discovery proposition",
    description:
      "The home page leads with finding doctors by specialty and city. This makes the main task understandable without requiring visitors to know a clinic or provider in advance.",
  },
  {
    title: "Useful paths into the directory",
    description:
      "Specialty shortcuts link into filtered doctor listings, while profile pages and clinic listings provide more focused routes for comparing care options.",
  },
  {
    title: "Trust needs careful handling",
    description:
      "A visible notice explains that the site is a demo and that some profiles and schedules are fictional. Keep that disclosure close to any action that could be read as a real appointment or medical service.",
  },
  {
    title: "Strong editorial visual direction",
    description:
      "Warm neutral surfaces, deep green accents, and serif display type give the directory a calm, approachable character that suits a healthcare discovery product.",
  },
];

const reviewNotes = [
  "Keep specialty and location search prominent on small screens, with filters that remain easy to change.",
  "Make profile completeness, clinic location, consultation fee, and schedule availability easy to scan and compare.",
  "Use explicit verified and demo labels consistently so people understand what has been confirmed and what is illustrative.",
  "Provide clear empty and no-match states when a specialty or city has no listed providers.",
];

export function MedoraCaseStudy() {
  return (
    <PortfolioShell>
      <Box sx={{ py: { xs: 5, md: 9 }, pb: { xs: 10, md: 14 } }}>
        <Box component="header" sx={{ maxWidth: 900, mb: { xs: 5, md: 8 } }}>
          <Eyebrow>Healthcare discovery · Product audit</Eyebrow>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.35rem", sm: "3.25rem", md: "4.2rem" },
              fontWeight: 800,
              letterSpacing: "-.055em",
              lineHeight: 1.06,
              mt: 1.5,
              maxWidth: "18ch",
              textWrap: "balance",
            }}
          >
            Helping people find care across the Philippines.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: 16, md: 19 }, lineHeight: 1.8, mt: 2.5, maxWidth: 760 }}
          >
            Medora is a doctor-discovery directory organized around specialties,
            cities, provider profiles, and clinics. This review looks at its
            public experience and highlights the product decisions that make
            healthcare discovery easier to navigate.
          </Typography>
          <Button
            component="a"
            href="https://medora-ph.vercel.app/"
            target="_blank"
            rel="noreferrer"
            variant="contained"
            endIcon={<ArrowOutwardRoundedIcon />}
            sx={{ mt: 3 }}
          >
            Visit Medora
          </Button>
        </Box>

        <Box
          component="section"
          aria-label="Project overview"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            borderTop: 1,
            borderBottom: 1,
            borderColor: "divider",
            py: 2.5,
            mb: { xs: 8, md: 9 },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {projectFacts.map((fact) => (
            <Box key={fact.label}>
              <Typography
                color="text.secondary"
                sx={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}
              >
                {fact.label}
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 650, lineHeight: 1.55, mt: 0.75 }}>
                {fact.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          component="section"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(190px, .65fr) 1.35fr" },
            gap: { xs: 2, md: 8 },
            mb: { xs: 6, md: 9 },
          }}
        >
          <Eyebrow>Product overview</Eyebrow>
          <Box>
            <Typography component="h2" sx={{ fontSize: { xs: 25, md: 34 }, fontWeight: 750, letterSpacing: "-.04em" }}>
              Start with the kind of care, then narrow the search.
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.85, mt: 2, maxWidth: 760 }}>
              The public directory links specialty discovery to doctor listings,
              with city context, profile pages, and a separate clinic directory.
              The visible flow is simple: choose a way into the search, inspect
              provider information, then continue to a profile for more detail.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: { xs: 5, md: 7 } }} />

        <Box component="section" sx={{ mb: { xs: 6, md: 9 } }}>
          <Eyebrow>Audit findings</Eyebrow>
          <Typography component="h2" sx={{ fontSize: { xs: 27, md: 36 }, fontWeight: 750, letterSpacing: "-.04em", mb: 3 }}>
            What works in the public experience.
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: { xs: 3, md: 5 } }}>
            {findings.map((finding) => (
              <Box component="article" key={finding.title}>
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
                  <CheckCircleOutlineRoundedIcon color="primary" sx={{ mt: 0.3 }} />
                  <Box>
                    <Typography component="h3" sx={{ fontSize: 19, fontWeight: 700 }}>
                      {finding.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.8, mt: 0.75 }}>
                      {finding.description}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(190px, .65fr) 1.35fr" },
            gap: { xs: 2, md: 8 },
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Eyebrow>Review opportunities</Eyebrow>
          <Box>
            <Typography component="h2" sx={{ fontSize: { xs: 24, md: 31 }, fontWeight: 750, letterSpacing: "-.04em" }}>
              Make comparison and trust signals effortless.
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 2.5 }}>
              {reviewNotes.map((note) => (
                <Typography key={note} color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  {note}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box component="section" sx={{ mt: { xs: 6, md: 9 } }}>
          <Eyebrow>Scope and safety</Eyebrow>
          <Typography component="h2" sx={{ fontSize: { xs: 25, md: 34 }, fontWeight: 750, letterSpacing: "-.04em", mt: 1 }}>
            A discovery demo, not a source of medical advice.
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.85, maxWidth: 800, mt: 2 }}>
            Medora's public notice says the site is for demo purposes and that
            some provider profiles and schedules are fictional. Treat listings
            as illustrative, confirm details with the provider, and use
            emergency services for urgent care. This portfolio audit describes
            visible site behavior and does not verify provider credentials or
            availability.
          </Typography>
        </Box>

        <Box sx={{ borderTop: 1, borderColor: "divider", display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mt: { xs: 6, md: 8 }, pt: 3 }}>
          <Button component="a" href="https://medora-ph.vercel.app/" target="_blank" rel="noreferrer" variant="contained" endIcon={<ArrowOutwardRoundedIcon />}>
            Open live project
          </Button>
          <Button component={NextLink} href="/work" variant="outlined" endIcon={<ArrowForwardRoundedIcon />}>
            See more work
          </Button>
        </Box>

        <Typography color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.7, mt: 3, maxWidth: 800 }}>
          Review based on the public homepage, doctor directory, sample provider profiles, and clinic listing pages.{" "}
          <Link component={NextLink} href="/work" color="inherit">View other projects</Link>.
        </Typography>
      </Box>
      <FloatingHomeButton />
    </PortfolioShell>
  );
}
