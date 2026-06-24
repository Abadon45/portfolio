"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CodeIcon from "@mui/icons-material/Code";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LightModeIcon from "@mui/icons-material/LightMode";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import PublicIcon from "@mui/icons-material/Public";
import WorkIcon from "@mui/icons-material/Work";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Fab,
  GlobalStyles,
  IconButton,
  Link as MuiLink,
  Stack,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
  type PaletteMode,
} from "@mui/material";

type Experience = {
  company: string;
  location: string;
  role: string;
  period: string;
  bullets: string[];
};

type Project = {
  title: string;
  eyebrow: string;
  summary: string;
  details: string[];
};

const createPortfolioTheme = (mode: PaletteMode) => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      background: {
        default: isDark ? "#0b1120" : "#f5f7fb",
        paper: isDark ? "#111827" : "#ffffff",
      },
      primary: {
        main: isDark ? "#e1c340" : "#2457c5",
        dark: isDark ? "#c7a900" : "#183c8d",
        contrastText: isDark ? "#111827" : "#ffffff",
      },
      secondary: {
        main: isDark ? "#62d5d0" : "#0f9f9a",
      },
      warning: {
        main: isDark ? "#f2c94c" : "#d49a20",
      },
      text: {
        primary: isDark ? "#f8fafc" : "#172033",
        secondary: isDark ? "#cbd5e1" : "#667085",
      },
      divider: isDark ? "rgba(148, 163, 184, 0.22)" : "#d8e0ea",
      action: {
        hover: isDark ? "rgba(226, 232, 240, 0.08)" : "rgba(36, 87, 197, 0.08)",
        selected: isDark ? "rgba(226, 195, 64, 0.14)" : "rgba(36, 87, 197, 0.12)",
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: {
        fontWeight: 850,
        letterSpacing: 0,
        lineHeight: 0.98,
      },
      h2: {
        fontWeight: 850,
        letterSpacing: 0,
        lineHeight: 1.08,
      },
      h3: {
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: 1.25,
      },
      button: {
        fontWeight: 800,
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            minHeight: 46,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundImage: "none",
          },
        },
      },
    },
  });
};

const skills = {
  Frontend: [
    "Next.js App Router",
    "React",
    "TypeScript",
    "JavaScript ES6+",
    "Material UI",
    "SWR",
    "Responsive Design",
  ],
  "Backend & APIs": [
    "Django",
    "Django REST Framework",
    "Django Ninja",
    "Python",
    "REST API Design",
    "PostgreSQL",
    "NextAuth",
  ],
  "Architecture & Systems": [
    "API Gateway Design",
    "Multi-Tenant SaaS",
    "Frontend State Management",
    "CSS Variable Theming",
    "E-Commerce Checkout",
  ],
  "DevOps & Integration": [
    "Docker",
    "NGINX",
    "Vercel",
    "Railway",
    "Git",
    "GitHub",
    "Puck Page Builder",
    "Xendit",
    "Webhooks",
  ],
};

const projects: Project[] = [
  {
    eyebrow: "TWC Ako Platform",
    title: "Modern Next.js frontend for a 60,000+ user multi-tenant platform",
    summary:
      "Architected the V4 frontend for a large SaaS and e-commerce platform spanning dashboards, storefronts, checkout, authentication, and supplier customization.",
    details: [
      "Built shared context providers, typed API utilities, and role-aware UI foundations.",
      "Standardized dashboard, e-commerce, and storefront modules around reusable frontend patterns.",
      "Modernized legacy Django flows into a scalable API-driven Next.js architecture.",
    ],
  },
  {
    eyebrow: "Auth & API Architecture",
    title: "Centralized API gateway and normalized user identity system",
    summary:
      "Implemented a Next.js API route layer that standardizes authentication, error handling, request processing, and Django service communication.",
    details: [
      "Used NextAuth with JWT and cookie-based sessions for authenticated workflows.",
      "Normalized memberships, roles, and verification states through a dedicated user context.",
      "Kept browser code calling local Next.js routes instead of direct backend URLs.",
    ],
  },
  {
    eyebrow: "Commerce Systems",
    title: "Checkout, cart, Xendit payments, and cross-device continuation",
    summary:
      "Delivered end-to-end checkout workflows with server-owned order state, address handling, payment confirmation, and webhook-backed processing.",
    details: [
      "Handled cart management, order lifecycle, platform fees, discounts, and payment steps.",
      "Designed checkout resume behavior around authenticated in-progress orders.",
      "Integrated Xendit payment creation and webhook confirmation flows.",
    ],
  },
  {
    eyebrow: "Storefront Builder",
    title: "Puck page builder and supplier-configurable theming",
    summary:
      "Optimized a 38-block drag-and-drop storefront builder with a dual-layer theming system and theme-compatible components.",
    details: [
      "Combined Material UI platform theming with storefront CSS variable palettes.",
      "Supported supplier themes, light/dark behavior, and WCAG-minded color decisions.",
      "Improved maintainability and template consistency across storefront experiences.",
    ],
  },
];

const experiences: Experience[] = [
  {
    company: "TWC IT Solutions",
    location: "Davao City",
    role: "Full Stack Web Developer",
    period: "Jan 2024 - Jun 2026",
    bullets: [
      "Architected and developed the platform's Next.js V4 frontend, modernizing a legacy Django platform serving 60,000+ registered users into a scalable, API-driven architecture.",
      "Established shared frontend infrastructure including reusable context providers, typed API utilities, and application-wide state management across dashboard, e-commerce, and storefront modules.",
      "Implemented a centralized API gateway layer using Next.js API routes to standardize authentication, error handling, request processing, and communication with Django REST Framework and Django Ninja services.",
      "Built and maintained authentication and user-identity systems using NextAuth with JWT and cookie-based sessions, supporting multiple membership types, roles, and verification states.",
      "Designed, developed, and maintained Django APIs, serializers, and data models supporting e-commerce, user management, affiliate systems, storefront customization, and checkout workflows.",
      "Engineered a dual-layer theming architecture combining Material UI theme management with supplier-configurable storefront themes powered by CSS variables, light/dark support, and multi-tenant customization.",
      "Delivered end-to-end e-commerce checkout workflows including cart management, address handling, order lifecycle, cross-device continuation, and Xendit payment integration.",
      "Developed affiliate referral tracking and commission-processing functionality supporting multiple commission structures and attribution workflows.",
      "Optimized and extended a 38-block drag-and-drop Puck page builder, improving maintainability, theme compatibility, and performance across storefront experiences.",
    ],
  },
  {
    company: "Vendics Enterprise",
    location: "Davao City",
    role: "Owner - IT Services & Computer Rental",
    period: "2014 - Present",
    bullets: [
      "Operate an IT services business providing computer rentals, technical support, repair services, and data-entry solutions.",
      "Manage customer support, budgeting, system maintenance, and service delivery.",
    ],
  },
  {
    company: "Datamarked ApS",
    location: "Hybrid",
    role: "Product Manager",
    period: "2012 - 2018",
    bullets: [
      "Managed product data operations including catalog structuring, lifecycle tracking, and dataset organization.",
      "Improved categorization, sorting, and duplicate-detection workflows to increase operational efficiency and data quality.",
    ],
  },
];

const contactLinks = [
  { label: "Email", value: "noypangan5@gmail.com", href: "mailto:noypangan5@gmail.com", icon: EmailIcon },
  { label: "Phone", value: "0917-770-0256", href: "tel:+639177700256", icon: PhoneIcon },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/emmanuel-pangan-071502a7",
    href: "https://linkedin.com/in/emmanuel-pangan-071502a7",
    icon: LinkedInIcon,
  },
  { label: "GitHub", value: "github.com/Abadon45", href: "https://github.com/Abadon45", icon: GitHubIcon },
  {
    label: "Demo",
    value: "demo.technowealthcreators.com",
    href: "https://demo.technowealthcreators.com",
    icon: PublicIcon,
  },
];

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const cardSx = {
  border: 1,
  borderColor: "divider",
  boxShadow: "0 10px 40px rgba(23, 32, 51, 0.05)",
  transition: "transform 200ms ease, box-shadow 200ms ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 16px 50px rgba(23, 32, 51, 0.08)",
  },
};

function Eyebrow({ children, color = "secondary.main" }: { children: React.ReactNode; color?: string }) {
  return (
    <Typography
      component="p"
      sx={{
        color,
        fontSize: "0.78rem",
        fontWeight: 850,
        letterSpacing: "0.08em",
        mb: 1,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Typography>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Box
      sx={{
        alignItems: "end",
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.72fr) minmax(260px, 1fr)" },
        mb: 3,
      }}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Typography component="h2" variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.7rem", lg: "3rem" } }}>
        {title}
      </Typography>
    </Box>
  );
}

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  const [mode, setMode] = useState<PaletteMode>("light");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const theme = useMemo(() => createPortfolioTheme(mode), [mode]);
  const isDark = mode === "dark";

  useEffect(() => {
    const savedMode = window.localStorage.getItem("portfolio-theme-mode");

    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("portfolio-theme-mode", mode);
    document.documentElement.dataset.mode = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 520);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMode = () => {
    setMode((currentMode) => (currentMode === "light" ? "dark" : "light"));
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: "easeOut" },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={(activeTheme) => ({
          html: { scrollBehavior: "smooth" },
          body: {
            backgroundColor: activeTheme.palette.background.default,
            backgroundImage: isDark
              ? "radial-gradient(circle, rgba(226, 195, 64, 0.17) 1px, transparent 1px), radial-gradient(circle, rgba(98, 213, 208, 0.1) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(36, 87, 197, 0.16) 1px, transparent 1px), radial-gradient(circle, rgba(15, 159, 154, 0.1) 1px, transparent 1px)",
            backgroundPosition: "0 0, 12px 12px",
            backgroundSize: "32px 32px, 24px 24px",
          },
        })}
      />

      <AppBar
        color="transparent"
        elevation={0}
        position="sticky"
        sx={{
          backdropFilter: "blur(16px)",
          bgcolor: isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(251, 252, 255, 0.88)",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1.5, sm: 2 },
              justifyContent: "space-between",
              py: { xs: 1.5, sm: 0 },
            }}
          >
            <MuiLink
              component="button"
              underline="none"
              aria-label="Back to top"
              onClick={scrollToTop}
              sx={{
                alignItems: "center",
                bgcolor: "transparent",
                border: 0,
                color: "text.primary",
                cursor: "pointer",
                display: "inline-flex",
                font: "inherit",
                gap: 1.5,
                p: 0,
                textAlign: "left",
              }}
            >
              <Avatar sx={{ bgcolor: "primary.main", borderRadius: 2, color: "primary.contrastText", fontSize: "0.78rem", fontWeight: 850 }}>
                EP
              </Avatar>
              <Box>
                <Typography component="strong" sx={{ display: "block", fontWeight: 850, lineHeight: 1.1 }}>
                  Emmanuel "Noy" Pangan
                </Typography>
                <Typography color="text.secondary" component="small" sx={{ display: "block", mt: 0.25 }}>
                  Full Stack Web Developer
                </Typography>
              </Box>
            </MuiLink>

            <Stack
              component="nav"
              aria-label="Primary navigation"
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: "center",
                maxWidth: "100%",
                overflowX: "auto",
                pb: { xs: 0.5, sm: 0 },
              }}
            >
              {navItems.map((item) => (
                <Button
                  color="inherit"
                  key={item.href}
                  onClick={() => scrollToSection(item.href.replace("#", ""))}
                  size="small"
                  sx={{ color: "text.secondary", whiteSpace: "nowrap", transition: "transform 150ms ease", "&:hover": { transform: "scale(1.03)" } }}
                >
                  {item.label}
                </Button>
              ))}
              <Tooltip title={`Switch to ${isDark ? "light" : "dark"} mode`}>
                <IconButton
                  aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                  color="primary"
                  onClick={toggleMode}
                  size="small"
                  sx={{
                    aspectRatio: "1 / 1",
                    bgcolor: "action.hover",
                    flexShrink: 0,
                    height: 36,
                    ml: 0.5,
                    minHeight: 36,
                    p: 0,
                    width: 36,
                    "&:hover": {
                      bgcolor: "action.selected",
                    },
                  }}
                >
                  {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ pb: 6 }}>
        <Box
          component="section"
          id="top"
          sx={{
            alignItems: "center",
            display: "grid",
            gap: { xs: 4, md: 6, lg: 8 },
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.1fr) minmax(320px, 0.75fr)" },
            minHeight: { xs: "auto", md: "calc(100vh - 74px)" },
            py: { xs: 6, md: 8 },
          }}
        >
          <Box>
            <Eyebrow>Next.js / React / TypeScript / Django</Eyebrow>
            <Typography component="h1" variant="h1" sx={{ fontSize: { xs: "2.45rem", sm: "3.65rem", lg: "5rem" }, maxWidth: { xs: "none", md: "12.5ch" }, mb: 2 }}>
              Full Stack Developer building scalable SaaS and{" "}
              <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                e-commerce
              </Box>{" "}
              systems.
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: { xs: "1.04rem", md: "1.18rem" }, lineHeight: 1.72, maxWidth: "66ch" }}>
              I specialize in modern Next.js frontends, Django APIs, authentication,
              checkout workflows, API gateway patterns, and multi-tenant theming
              infrastructure for production platforms.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}>
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => scrollToSection("projects")}
                size="large"
                variant="contained"
                sx={{ transition: "transform 200ms ease", "&:hover": { transform: "scale(1.02)" } }}
              >
                View portfolio
              </Button>
              <Button
                component="a"
                href="mailto:noypangan5@gmail.com"
                size="large"
                startIcon={<EmailIcon />}
                variant="outlined"
                sx={{ transition: "transform 200ms ease", "&:hover": { transform: "scale(1.02)" } }}
              >
                Email me
              </Button>
            </Stack>
          </Box>

          <Card
            component="aside"
            aria-label="Profile snapshot"
            sx={{
              bgcolor: isDark ? "#0f172a" : "text.primary",
              border: 1,
              borderColor: "rgba(255,255,255,0.12)",
              boxShadow: "0 20px 70px rgba(18, 31, 56, 0.16)",
              color: "common.white",
              transition: "transform 200ms ease, box-shadow 200ms ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 26px 80px rgba(18, 31, 56, 0.2)",
              },
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", borderBottom: 1, borderColor: "rgba(255,255,255,0.12)", p: 2 }}>
              <Box sx={{ bgcolor: "#37d67a", borderRadius: "50%", boxShadow: "0 0 0 6px rgba(55, 214, 122, 0.12)", height: 10, width: 10 }} />
              <Typography sx={{ fontWeight: 850 }}>Open to remote opportunities</Typography>
            </Stack>
            <Box sx={{ p: 2, pb: 0 }}>
              <Box
                component="img"
                src="/display-image/noy-dp.jpg"
                alt="Emmanuel Noy Pangan"
                sx={{
                  aspectRatio: "4 / 3",
                  border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 2,
                  display: "block",
                  height: "auto",
                  objectFit: "cover",
                  objectPosition: "center 18%",
                  width: "100%",
                }}
              />
            </Box>
            {[
              ["Location", "Davao City, Philippines"],
              ["Core stack", "Next.js, React, TypeScript, Django"],
              ["Production scope", "60,000+ registered users"],
              ["Current focus", "SaaS architecture, commerce workflows, storefront tooling"],
            ].map(([label, value]) => (
              <Box key={label} sx={{ borderBottom: label === "Current focus" ? 0 : 1, borderColor: "rgba(255,255,255,0.1)", p: 2 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: "0.78rem", fontWeight: 850, mb: 0.5, textTransform: "uppercase" }}>
                  {label}
                </Typography>
                <Typography>{value}</Typography>
              </Box>
            ))}
          </Card>
        </Box>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariant}
        >
          <Box component="section" sx={{ mb: { xs: 7, md: 10 } }}>
            <SectionHeading eyebrow="Professional Summary" title="Systems-minded full stack development" />
            <motion.div variants={fadeUp}>
              <Card sx={{ bgcolor: "background.paper", borderLeft: 5, borderLeftColor: "warning.main", boxShadow: "0 10px 40px rgba(23, 32, 51, 0.05)" }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, "&:last-child": { pb: { xs: 2.5, md: 3.5 } } }}>
                  <Typography color="text.secondary" sx={{ fontSize: "1.06rem", lineHeight: 1.72 }}>
                    Full Stack Web Developer specializing in Next.js, React, TypeScript, and
                    Django, with frontend-architecture experience across large-scale SaaS and
                    e-commerce platforms. Architected and developed a modern Next.js frontend
                    for a multi-tenant platform serving 60,000+ registered users, spanning
                    authentication, API integrations, checkout workflows, and theming
                    infrastructure. A former product and IT operations professional, I bring
                    strong systems thinking and end-to-end ownership of software delivery.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariant}
        >
          <Box component="section" id="projects" sx={{ mb: { xs: 7, md: 10 }, scrollMarginTop: 96 }}>
            <SectionHeading eyebrow="Selected Projects" title="Portfolio case studies" />
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
              {projects.map((project) => (
                <Card key={project.title} sx={{ ...cardSx, minHeight: { md: 330 } }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Eyebrow>{project.eyebrow}</Eyebrow>
                    <Typography component="h3" variant="h3" sx={{ fontSize: "1.22rem", mb: 1 }}>
                      {project.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.72 }}>
                      {project.summary}
                    </Typography>
                    <Stack component="ul" spacing={1} sx={{ mt: 2, pl: 0, listStyle: "none" }}>
                      {project.details.map((detail) => (
                        <Stack component="li" direction="row" key={detail} spacing={1} sx={{ alignItems: "flex-start" }}>
                          <CheckCircleIcon color="secondary" sx={{ fontSize: 18, mt: 0.25 }} />
                          <Typography sx={{ lineHeight: 1.5 }}>{detail}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariant}
        >
          <Box component="section" id="skills" sx={{ mb: { xs: 7, md: 10 }, scrollMarginTop: 96 }}>
            <SectionHeading eyebrow="Technical Skills" title="Stack and strengths" />
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
              {Object.entries(skills).map(([category, items]) => (
                <Card key={category} sx={cardSx}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                      <CodeIcon color="primary" />
                      <Typography component="h3" variant="h3" sx={{ fontSize: "1.2rem" }}>
                        {category}
                      </Typography>
                    </Stack>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {items.map((item) => (
                        <Chip
                          color="primary"
                          key={item}
                          label={item}
                          variant="outlined"
                          sx={{ transition: "transform 150ms ease", "&:hover": { transform: "scale(1.05)" } }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariant}
        >
          <Box component="section" id="experience" sx={{ mb: { xs: 7, md: 10 }, scrollMarginTop: 96 }}>
            <SectionHeading eyebrow="Professional Experience" title="Work history" />
            <Stack spacing={2}>
              {experiences.map((experience) => (
                <Card key={`${experience.company}-${experience.role}`} sx={cardSx}>
                  <CardContent sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "240px minmax(0, 1fr)" }, p: 2.5 }}>
                    <Box>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main", mb: 0.75 }}>
                        <WorkIcon fontSize="small" />
                        <Typography sx={{ fontWeight: 850 }}>{experience.period}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                        <PlaceIcon fontSize="small" />
                        <Typography sx={{ fontWeight: 750 }}>{experience.location}</Typography>
                      </Stack>
                    </Box>
                    <Box>
                      <Typography component="h3" variant="h3" sx={{ fontSize: "1.25rem", mb: 0.5 }}>
                        {experience.role}
                      </Typography>
                      <Typography color="primary.dark" sx={{ fontWeight: 850, mb: 1.5 }}>
                        {experience.company}
                      </Typography>
                      <Stack component="ul" spacing={1} sx={{ m: 0, pl: 2.25 }}>
                        {experience.bullets.map((bullet) => (
                          <Typography color="text.secondary" component="li" key={bullet} sx={{ lineHeight: 1.72 }}>
                            {bullet}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariant}
        >
          <Card component="section" sx={{ ...cardSx, mb: { xs: 7, md: 10 } }}>
            <CardContent sx={{ p: 2.5 }}>
              <Eyebrow>Education</Eyebrow>
              <Typography component="h2" variant="h2" sx={{ fontSize: { xs: "1.8rem", md: "2.3rem" }, mb: 1 }}>
                Ateneo de Davao University
              </Typography>
              <Typography color="text.secondary">BS Computer Engineering - Undergraduate Studies, 2004 - 2010</Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariant}
        >
          <Card component="section" id="contact" sx={{ bgcolor: isDark ? "#0f172a" : "text.primary", color: "common.white", scrollMarginTop: 96 }}>
            <CardContent sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.9fr) minmax(320px, 1fr)" }, p: { xs: 2.5, md: 4 } }}>
              <Box>
                <Eyebrow color="secondary.main">Contact</Eyebrow>
                <Typography component="h2" variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.7rem" } }}>
                  Available for full stack, frontend architecture, and remote platform work.
                </Typography>
              </Box>
              <Stack spacing={1}>
                {contactLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <MuiLink
                      href={link.href}
                      key={link.label}
                      rel="noreferrer"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      underline="none"
                      sx={{
                        alignItems: "center",
                        bgcolor: "rgba(255,255,255,0.07)",
                        border: 1,
                        borderColor: "rgba(255,255,255,0.12)",
                        borderRadius: 2,
                        color: "common.white",
                        display: "grid",
                        gap: 1.5,
                        gridTemplateColumns: "40px minmax(0, 1fr)",
                        p: 1.25,
                        transition: "transform 200ms ease, bgcolor 200ms ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          bgcolor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      <Tooltip title={link.label}>
                        <IconButton aria-label={link.label} size="small" sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "common.white" }}>
                          <Icon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: "0.78rem", fontWeight: 850, textTransform: "uppercase" }}>
                          {link.label}
                        </Typography>
                        <Typography component="strong" sx={{ display: "block", fontWeight: 850, overflowWrap: "anywhere" }}>
                          {link.value}
                        </Typography>
                      </Box>
                    </MuiLink>
                  );
                })}
              </Stack>
            </CardContent>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
          </Card>
        </motion.div>
      </Container >

      {showScrollTop && (
        <Fab
          aria-label="Scroll back to top"
          color="primary"
          onClick={scrollToTop}
          size="medium"
          sx={{
            bottom: { xs: 18, md: 28 },
            position: "fixed",
            right: { xs: 18, md: 28 },
            zIndex: (t) => t.zIndex.tooltip,
            transition: "transform 200ms ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </ThemeProvider >
  );
}
