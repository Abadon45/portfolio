import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { Box, Button, Divider, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { Eyebrow } from "./Eyebrow";
import { ProjectStatusLabel } from "./ProjectStatusLabel";
import { proofMetrics } from "../../data/portfolio";

const selectedWork = [
  {
    name: "LedgerCheck",
    status: "Product demo" as const,
    category: "Financial management",
    description:
      "A financial record and deterministic checking toolkit for small organizations.",
    image: "/images/portfolio/ledgercheck.svg",
    href: "https://ledgercheck-app.vercel.app",
    alt: "LedgerCheck financial management workspace",
    actionLabel: "Visit LedgerCheck",
    external: true,
  },
  {
    name: "Medora",
    status: "Case study" as const,
    category: "Healthcare discovery",
    description:
      "A doctor-discovery directory for the Philippines, organized around specialties, cities, and clinics.",
    image: "/images/portfolio/medora-care.webp",
    href: "/work/medora",
    alt: "Medora homepage introducing doctor discovery by specialty and city",
    actionLabel: "Read project audit",
  },
  {
    name: "Commerce OS",
    status: "Reconstruction" as const,
    category: "SaaS operations",
    description:
      "An interactive, fictional commerce workspace for products, inventory, " +
      "and business operations.",
    image: "/images/portfolio/commerce.webp",
    href: "/saas-platform",
    alt:
      "Portfolio reconstruction of a Commerce OS dashboard with business " +
      "navigation and operational panels",
    actionLabel: "Explore reconstruction",
  },
  {
    name: "TWC Ecommerce",
    status: "Reconstruction" as const,
    category: "Commerce workflows",
    description:
      "An offline storefront reconstruction with product discovery, cart, " +
      "shipping, and checkout flows.",
    image: "/images/portfolio/store.webp",
    href: "/twc-ecommerce",
    alt:
      "Portfolio reconstruction of a TWC Ecommerce storefront with product " +
      "collection and shopping navigation",
    actionLabel: "Try the storefront",
  },
  {
    name: "Cotabato Solar",
    status: "Portfolio project" as const,
    category: "Solar services",
    description:
      "A welcoming service website that helps visitors explore solar and request an assessment.",
    image: "/images/portfolio/solar.webp",
    href: "/solar",
    alt: "Cotabato Solar website introducing its solar installation services",
    actionLabel: "View project",
  },
];

const services = [
  {
    icon: LanguageRoundedIcon,
    title: "Business websites",
    text: "A clear, responsive home for your business, with an easy path from visitor to enquiry.",
  },
  {
    icon: ShoppingBagOutlinedIcon,
    title: "Online stores",
    text: "Thoughtful shopping experiences, from your product catalogue to checkout and payments.",
  },
  {
    icon: DashboardCustomizeOutlinedIcon,
    title: "Custom web apps",
    text: "Dashboards, accounts, and practical tools built around the way your business works.",
  },
];

const sectionSpacing = { py: { xs: 6, md: 9 }, scrollMarginTop: 150 };
const sectionHeading = {
  fontSize: { xs: "2rem", sm: "2.5rem", md: "2.85rem" },
  fontWeight: 700,
  letterSpacing: "-0.045em",
  lineHeight: 1.16,
  textWrap: "balance",
};
const bodyCopy = {
  fontSize: { xs: 15, md: 16 },
  fontWeight: 400,
  lineHeight: 1.8,
};

function ProofMetrics({ placement }: { placement: "inline" | "below-portrait" }) {
  const belowPortrait = placement === "below-portrait";

  return (
    <Stack
      direction="row"
      spacing={{ xs: 2, sm: 3.5 }}
      useFlexGap
      sx={{
        borderColor: "divider",
        borderTop: 1,
        display: belowPortrait
          ? { xs: "flex", sm: "none" }
          : { xs: "none", sm: "flex" },
        flexWrap: "wrap",
        gridColumn: belowPortrait ? { md: "1" } : undefined,
        maxWidth: 620,
        mt: belowPortrait ? 0 : { xs: 3.5, md: 4.5 },
        order: belowPortrait ? 3 : undefined,
        pt: 2.5,
        width: "100%",
      }}
    >
      {proofMetrics.map((metric) => (
        <Box key={metric.label} sx={{ minWidth: 90, flex: "1 1 110px" }}>
          <Typography
            component="strong"
            sx={{
              display: "block",
              fontSize: { xs: 19, sm: 23 },
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {metric.value}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: 12, lineHeight: 1.4, mt: 0.5 }}
          >
            {metric.label}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

export function ClientHomepage() {
  return (
    <>
      <Box
        component="section"
        id="top"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1.1fr) minmax(280px, .9fr)",
          },
          alignItems: "center",
          columnGap: { xs: 4, md: 8 },
          rowGap: { xs: 4, md: 3 },
          pt: { xs: 4, md: 8 },
          pb: { xs: 6, md: 9 },
        }}
      >
        <Box sx={{ order: { xs: 1, sm: 2, md: 1 } }}>
          <Eyebrow>
            Full Stack Web Developer · Davao City, Philippines · Remote-ready
          </Eyebrow>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "4rem", md: "5rem" },
              fontWeight: 800,
              letterSpacing: "-0.055em",
              lineHeight: 1.06,
              maxWidth: { xs: "15ch", md: "13ch" },
              mt: 1.5,
              textWrap: "balance",
            }}
          >
            I build the systems behind the storefront.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: 16, md: 19 },
              lineHeight: { xs: 1.65, md: 1.8 },
              maxWidth: "52ch",
              mt: 2,
            }}
          >
            I build frontend architecture and customer experiences for
            large-scale SaaS and e-commerce platforms, alongside the APIs and
            operational tools behind them.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            useFlexGap
            sx={{
              alignItems: { sm: "center" },
              flexWrap: "wrap",
              mt: { xs: 2, sm: 3.5 },
              "& > .MuiButton-root": {
                justifyContent: { xs: "space-between", sm: "center" },
                minHeight: 48,
                width: { xs: "100%", sm: "auto" },
              },
            }}
          >
            <Button
              href="#work"
              variant="contained"
              size="large"
              endIcon={<ArrowDownwardRoundedIcon />}
            >
              Explore selected work
            </Button>
            <Button
              href="mailto:noypangan5@gmail.com"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Get in touch
            </Button>
          </Stack>
          <Box
            component="section"
            aria-labelledby="resume-downloads-title"
            sx={{ mt: 1.5 }}
          >
            <Typography
              component="h2"
              id="resume-downloads-title"
              color="text.secondary"
              sx={{ fontSize: 12, fontWeight: 700, mb: 0.25 }}
            >
              Résumé versions
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 0, sm: 2 }}
              useFlexGap
              sx={{ alignItems: { sm: "center" }, flexWrap: "wrap" }}
            >
              <Link
                component="a"
                href="/files/emmanuel-noy-pangan-resume-ph.pdf"
                download
                underline="hover"
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                  fontSize: 14,
                  fontWeight: 650,
                  gap: 0.75,
                  minHeight: 44,
                  width: "fit-content",
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 3,
                  },
                }}
              >
                <PictureAsPdfOutlinedIcon fontSize="small" />
                Philippines · with photo
              </Link>
              <Link
                component="a"
                href="/files/emmanuel-noy-pangan-resume-international.pdf"
                download
                color="text.secondary"
                underline="hover"
                sx={{
                  alignItems: "center",
                  display: "inline-flex",
                  fontSize: 14,
                  fontWeight: 600,
                  minHeight: 44,
                  width: "fit-content",
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 3,
                  },
                }}
              >
                International · no photo
              </Link>
            </Stack>
          </Box>
          <Typography color="text.secondary" sx={{ fontSize: 12, mt: 1.25 }}>
            Open to full-time remote roles and select project work
          </Typography>
          <ProofMetrics placement="inline" />
        </Box>
        <Box
          sx={{
            order: { xs: 2, sm: 1, md: 2 },
            maxWidth: { xs: 520, md: 430 },
            width: "100%",
            justifySelf: { xs: "center", md: "end" },
            position: "relative",
          }}
        >
          <Box
            component="img"
            src="/display-image/noy-dp.jpg"
            alt="Noy Pangan, Full Stack Web Developer"
            width={860}
            height={960}
            fetchPriority="high"
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              height: { xs: 240, sm: 390, md: 500 },
              objectFit: "cover",
              objectPosition: "center 22%",
              display: "block",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
            }}
          />
          <Stack
            direction="row"
            sx={{
              mt: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                Noy Pangan
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                Davao City, Philippines
              </Typography>
            </Box>
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                color: "text.secondary",
                fontSize: 12,
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  height: 8,
                  width: 8,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                }}
              />
              Open to opportunities
            </Box>
          </Stack>
        </Box>
        <ProofMetrics placement="below-portrait" />
      </Box>

      <Divider />
      <Box component="section" id="work" sx={sectionSpacing}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            justifyContent: "space-between",
            alignItems: { sm: "end" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Eyebrow>Selected work</Eyebrow>
            <Typography
              component="h2"
              sx={{
                ...sectionHeading,
              }}
            >
              Production systems, then products you can explore.
            </Typography>
          </Box>
          <Button
            component={NextLink}
            href="/work"
            scroll={false}
            color="inherit"
            endIcon={<ArrowOutwardRoundedIcon />}
          >
            More work & background
          </Button>
        </Stack>
        <Box
          component="article"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.2fr) auto" },
            alignItems: "center",
            gap: { xs: 2.5, md: 5 },
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
            p: { xs: 2.5, md: 4 },
            mb: 4,
          }}
        >
          <Box>
            <ProjectStatusLabel status="Production work" />
            <Eyebrow color="text.secondary">TWC IT Solutions</Eyebrow>
            <Typography
              component="h3"
              sx={{
                fontWeight: 750,
                fontSize: { xs: 23, md: 30 },
                letterSpacing: "-.035em",
                lineHeight: 1.25,
                mt: 1,
              }}
            >
              Modernizing a commerce platform across frontend, APIs, and
              storefront tools.
            </Typography>
            <Typography color="text.secondary" sx={{ ...bodyCopy, mt: 1.5 }}>
              My work on the Next.js V4 frontend and Django APIs supported a
              platform with 60,000+ registered users, checkout workflows, and
              supplier storefront customization.
            </Typography>
            <Stack
              direction="row"
              useFlexGap
              spacing={1}
              sx={{ flexWrap: "wrap", mt: 2 }}
            >
              {["Next.js", "TypeScript", "Django APIs", "Puck builder"].map(
                (item) => (
                  <Typography
                    key={item}
                    component="span"
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      color: "text.secondary",
                      fontSize: 12,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    {item}
                  </Typography>
                ),
              )}
            </Stack>
          </Box>
          <Button
            component={NextLink}
            href="/work/twc-platform"
            variant="contained"
            endIcon={<ArrowOutwardRoundedIcon />}
            sx={{ minHeight: 48, whiteSpace: "nowrap" }}
          >
            Read the case study
          </Button>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            columnGap: { xs: 2.5, md: 4 },
            rowGap: { xs: 4, md: 5 },
          }}
        >
          {selectedWork.map((project) => (
            <Box component="article" key={project.name} sx={{ minWidth: 0 }}>
              <Link
                component={project.external ? "a" : NextLink}
                href={project.href}
                target={project.external ? "_blank" : undefined}
                rel={project.external ? "noreferrer" : undefined}
                aria-label={`Open ${project.name} project`}
                sx={{
                  display: "block",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  transition: "border-color 180ms ease-out",
                  "&:active": { transform: "scale(0.99)" },
                  "& img": {
                    transition: "transform 220ms cubic-bezier(0.23, 1, 0.32, 1)",
                  },
                  "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": { borderColor: "primary.main" },
                    "&:hover img": { transform: "scale(1.025)" },
                  },
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 4,
                  },
                }}
              >
                <Box
                  component="img"
                  src={project.image}
                  alt={project.alt}
                  width={1200}
                  height={833}
                  loading="lazy"
                  sx={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "1.44",
                    objectFit: "cover",
                  }}
                />
              </Link>
              <Box sx={{ mt: 2.5 }}>
                <ProjectStatusLabel status={project.status} />
              </Box>
              <Typography
                color="text.secondary"
                sx={{
                  mt: 0,
                  mb: 0.75,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                }}
              >
                {project.category}
              </Typography>
              <Typography
                component="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: 25,
                  letterSpacing: "-.035em",
                  lineHeight: 1.25,
                }}
              >
                {project.name}
              </Typography>
              <Typography color="text.secondary" sx={{ ...bodyCopy, mt: 1 }}>
                {project.description}
              </Typography>
              <Button
                component={project.external ? "a" : NextLink}
                href={project.href}
                target={project.external ? "_blank" : undefined}
                rel={project.external ? "noreferrer" : undefined}
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={{ mt: 1.5, px: 0 }}
              >
                {project.actionLabel}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider />
      <Box component="section" id="services" sx={sectionSpacing}>
        <Eyebrow>How I can help</Eyebrow>
        <Typography
          component="h2"
          sx={{
            ...sectionHeading,
            mb: 4,
          }}
        >
          The right build for your business.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 3, md: 5 },
          }}
        >
          {services.map(({ icon: Icon, title, text }) => (
            <Box key={title}>
              <Icon color="primary" sx={{ mb: 1.5, fontSize: 28 }} />
              <Typography
                component="h3"
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-.025em",
                  lineHeight: 1.3,
                  mb: 1,
                }}
              >
                {title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ ...bodyCopy, maxWidth: "38ch" }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        component="section"
        id="about"
        sx={{
          ...sectionSpacing,
          borderTop: 1,
          borderColor: "divider",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 3, md: 8 },
        }}
      >
        <Box>
          <Eyebrow>Work experience & background</Eyebrow>
          <Typography
            component="h2"
            sx={{
              ...sectionHeading,
              maxWidth: "18ch",
            }}
          >
            A developer who understands business, too.
          </Typography>
        </Box>
        <Box>
          <Typography
            color="text.secondary"
            sx={{ ...bodyCopy, fontWeight: 500 }}
          >
            At TWC IT Solutions, I helped modernize a commerce platform serving
            60,000+ registered users. My work spanned the Next.js frontend,
            frontend-facing Django APIs, authentication, checkout, and
            supplier storefront tooling.
          </Typography>
          <Typography color="text.secondary" sx={{ ...bodyCopy, mt: 2 }}>
            I’m now looking for a full-stack or frontend-focused role where I
            can contribute across product UI and the systems behind it.
          </Typography>
          <Button
            component={NextLink}
            href="/about"
            scroll={false}
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ mt: 3 }}
          >
            View my experience & skills
          </Button>
        </Box>
      </Box>

      <Box
        component="section"
        id="contact"
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 3, md: 6 },
          mb: 7,
          scrollMarginTop: 150,
        }}
      >
        <Eyebrow>Let’s make it happen</Eyebrow>
        <Typography
          component="h2"
          sx={{
            ...sectionHeading,
            fontSize: { xs: 36, md: 52 },
            fontWeight: 800,
            letterSpacing: "-.05em",
          }}
        >
          Have a project in mind?
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ mt: 1.5, mb: 3, maxWidth: "50ch", lineHeight: 1.8 }}
        >
          Tell me what you want to build, improve, or simplify. We can work out
          the next step together.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { sm: "center" } }}
        >
          <Button
            href="mailto:noypangan5@gmail.com"
            variant="contained"
            size="large"
            endIcon={<ArrowOutwardRoundedIcon />}
          >
            Let’s talk
          </Button>
          <Link
            href="mailto:noypangan5@gmail.com"
            color="text.secondary"
            sx={{ fontSize: 14, overflowWrap: "anywhere" }}
          >
            noypangan5@gmail.com
          </Link>
          <Link
            href="https://linkedin.com/in/emmanuel-pangan-071502a7"
            color="text.secondary"
            sx={{ fontSize: 14 }}
          >
            LinkedIn
          </Link>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Link
            href="https://linkedin.com/in/emmanuel-pangan-071502a7"
            color="text.secondary"
            aria-label="LinkedIn profile"
          >
            <LinkedInIcon />
          </Link>
          <Link
            href="https://github.com/Abadon45"
            color="text.secondary"
            aria-label="GitHub profile"
          >
            <GitHubIcon />
          </Link>
        </Stack>
      </Box>
    </>
  );
}
