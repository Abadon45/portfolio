"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {
  Box,
  Button,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { FloatingHomeButton } from "../../components/FloatingHomeButton";
import { Eyebrow } from "../../components/portfolio/Eyebrow";
import { PortfolioShell } from "../../components/portfolio/PortfolioShell";

const projectFacts = [
  { label: "Role and period", value: "Full Stack Web Developer · Jan 2024–Jun 2026" },
  { label: "Platform scale", value: "60,000+ registered users" },
  {
    label: "Product areas",
    value: "Commerce, member accounts, supplier tools, affiliate and distributor workflows",
  },
  {
    label: "Core stack",
    value: "Next.js, React, TypeScript, Django REST, Django Ninja",
  },
];

const workAreas = [
  {
    title: "Frontend foundations",
    description:
      "Built shared context providers, typed API utilities, and role-aware UI " +
      "foundations for dashboard, storefront, and account experiences.",
  },
  {
    title: "API integration and identity",
    description:
      "Added a Next.js API route layer for consistent authentication and " +
      "request handling. Maintained frontend-facing Django APIs for user " +
      "identity, membership, storefronts, logistics, and checkout.",
  },
  {
    title: "Commerce and partner journeys",
    description:
      "Built across cart, address, order, and checkout flows, including COD " +
      "and Xendit payment paths in the legacy storefront. The platform also " +
      "supports affiliate and distributor workflows.",
  },
  {
    title: "Business and supplier operations",
    description:
      "Connected dashboard and supplier experiences to backend services for " +
      "customer and member records, logistics, storefront customization, and " +
      "operational data, alongside the affiliate and distributor workflows.",
  },
  {
    title: "Supplier storefront tools",
    description:
      "Extended a 38-block drag-and-drop Puck builder and a dual-layer theme " +
      "system, keeping platform UI styling separate from supplier-configurable " +
      "storefront colors.",
  },
];

const implementationPrinciples = [
  "Keep Django services in place and modernize through a Next.js API layer instead of rewriting the backend.",
  "Share typed request, identity, and state patterns across dashboards, storefronts, and commerce modules.",
  "Use NextAuth with JWT and cookie-based sessions for the frontend's authenticated workflows.",
  "Separate Material UI platform chrome from supplier-controlled storefront themes.",
];

export function TwcPlatformCaseStudy() {
  return (
    <PortfolioShell>
      <Box sx={{ py: { xs: 5, md: 9 }, pb: { xs: 10, md: 14 } }}>
        <Box component="header" sx={{ maxWidth: 900, mb: { xs: 5, md: 8 } }}>
          <Eyebrow>Production experience · TWC IT Solutions</Eyebrow>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.35rem", sm: "3.25rem", md: "4.2rem" },
              fontWeight: 800,
              letterSpacing: "-.055em",
              lineHeight: 1.06,
              mt: 1.5,
              maxWidth: "19ch",
              textWrap: "balance",
            }}
          >
            Modernizing the systems behind a commerce platform.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: 16, md: 19 },
              lineHeight: 1.8,
              mt: 2.5,
              maxWidth: 760,
            }}
          >
            I worked across the Next.js V4 frontend and maintained Django APIs
            for a commerce platform serving more than 60,000 registered users.
            The work connected customer-facing experiences with identity,
            checkout, supplier tooling, and the services behind them.
          </Typography>
        </Box>

        <Box
          component="section"
          aria-label="Project overview"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            borderTop: 1,
            borderBottom: 1,
            borderColor: "divider",
            py: 2.5,
            mb: { xs: 7, md: 9 },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {projectFacts.map((fact) => (
            <Box key={fact.label}>
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                {fact.label}
              </Typography>
              <Typography
                sx={{ fontSize: 14, fontWeight: 650, lineHeight: 1.55, mt: 0.75 }}
              >
                {fact.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(190px, .65fr) 1.35fr" },
            gap: { xs: 2, md: 8 },
            mb: { xs: 6, md: 9 },
          }}
        >
          <Eyebrow>Context</Eyebrow>
          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 25, md: 34 },
                fontWeight: 750,
                letterSpacing: "-.04em",
              }}
            >
              Keep the product moving while integrating with its existing Django services.
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.85, mt: 2, maxWidth: 760 }}
            >
              The platform spans customer accounts, business dashboards,
              supplier storefronts, checkout and payment, member identity, and
              affiliate and distributor workflows. The existing Django backend
              remained the system of record. I built the V4 Next.js frontend,
              its shared frontend architecture, and integrations to Django APIs
              as part of a collaborative team; backend ownership was shared.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: { xs: 5, md: 7 } }} />

        <Box component="section" sx={{ mb: { xs: 6, md: 9 } }}>
          <Eyebrow>My contribution</Eyebrow>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 27, md: 36 },
              fontWeight: 750,
              letterSpacing: "-.04em",
              mb: 3,
            }}
          >
            Frontend architecture, API integration, and product workflows.
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: { xs: 3, md: 5 },
            }}
          >
            {workAreas.map((area) => (
              <Box component="article" key={area.title}>
                <Stack
                  direction="row"
                  spacing={1.25}
                  sx={{ alignItems: "flex-start" }}
                >
                  <CheckCircleOutlineRoundedIcon
                    color="primary"
                    sx={{ mt: 0.3 }}
                  />
                  <Box>
                    <Typography
                      component="h3"
                      sx={{ fontSize: 19, fontWeight: 700 }}
                    >
                      {area.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ lineHeight: 1.8, mt: 0.75 }}
                    >
                      {area.description}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          component="section"
          aria-labelledby="reconstruction-heading"
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "background.paper",
            mb: { xs: 6, md: 9 },
          }}
        >
          <Box
            component="img"
            src="/images/portfolio/store.webp"
            alt="Portfolio reconstruction of a TWC storefront, with product browsing and shopping navigation"
            loading="lazy"
            sx={{
              display: "block",
              width: "100%",
              maxHeight: { xs: 260, md: 430 },
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
          <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Eyebrow>Separate portfolio demo</Eyebrow>
            <Typography
              component="h2"
              id="reconstruction-heading"
              sx={{ fontSize: { xs: 21, md: 25 }, fontWeight: 700, mt: 0.75 }}
            >
              Explore a locally simulated storefront and commerce flow.
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75, mt: 1 }}>
              This portfolio reconstruction demonstrates related interface
              patterns. It is separate from the production platform and contains
              no production customer records or services.
            </Typography>
            <Button
              component={NextLink}
              href="/twc-ecommerce"
              variant="outlined"
              endIcon={<ArrowOutwardRoundedIcon />}
              sx={{ mt: 2 }}
            >
              Open the storefront reconstruction
            </Button>
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
          <Eyebrow>Implementation approach</Eyebrow>
          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 24, md: 31 },
                fontWeight: 750,
                letterSpacing: "-.04em",
              }}
            >
              Build clear boundaries that let the product grow.
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 2.5 }}>
              {implementationPrinciples.map((principle) => (
                <Typography
                  key={principle}
                  color="text.secondary"
                  sx={{ lineHeight: 1.75 }}
                >
                  {principle}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box component="section" sx={{ mt: { xs: 6, md: 9 } }}>
          <Eyebrow>Outcome and scope</Eyebrow>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 25, md: 34 },
              fontWeight: 750,
              letterSpacing: "-.04em",
              mt: 1,
            }}
          >
            A modern frontend connected to the systems commerce depends on.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.85, maxWidth: 800, mt: 2 }}
          >
            I delivered and maintained frontend foundations, API integrations,
            commerce workflows, and supplier tooling for the V4 platform. The
            platform scale and builder scope give context to the work; this
            case study does not assign platform-wide user growth or business
            results to my individual contribution.
          </Typography>
        </Box>

        <Box
          sx={{
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            mt: { xs: 6, md: 8 },
            pt: 3,
          }}
        >
          <Button
            component={NextLink}
            href="/saas-platform/landing"
            variant="contained"
            endIcon={<ArrowOutwardRoundedIcon />}
          >
            Explore the portfolio reconstruction
          </Button>
          <Button
            component={NextLink}
            href="/work"
            variant="outlined"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            See more work
          </Button>
          <Button
            component="a"
            href="https://www.technowealthcreators.com"
            target="_blank"
            rel="noreferrer"
            variant="text"
            endIcon={<ArrowOutwardRoundedIcon />}
          >
            TWC company site · historical reference
          </Button>
        </Box>

        <Typography
          color="text.secondary"
          sx={{ fontSize: 12, lineHeight: 1.7, mt: 3, maxWidth: 800 }}
        >
          This summary describes my production role at TWC IT Solutions.
          Interactive portfolio reconstructions use separate demo experiences
          and do not reproduce production systems or customer data.{" "}
          <Link component={NextLink} href="/work" color="inherit">
            View project labels and demos
          </Link>
          .
        </Typography>
      </Box>
      <FloatingHomeButton />
    </PortfolioShell>
  );
}
