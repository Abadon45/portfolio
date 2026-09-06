import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import { Box, Button, Divider, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { Eyebrow } from "./Eyebrow";

const selectedWork = [
  {
    name: "Commerce OS",
    category: "Custom web application",
    description:
      "A workspace that brings products, inventory, and business operations together.",
    image: "/images/portfolio/commerce.webp",
    href: "/saas-platform",
    alt: "Commerce OS dashboard with business navigation and operational panels",
  },
  {
    name: "TWC Ecommerce",
    category: "Online store",
    description:
      "From finding the right product to checking out. A complete shopping demo.",
    image: "/images/portfolio/store.webp",
    href: "/twc-ecommerce",
    alt: "TWC Ecommerce storefront with a product collection and shopping navigation",
  },
  {
    name: "Cotabato Solar",
    category: "Business website",
    description:
      "A welcoming service website that helps visitors explore solar and request an assessment.",
    image: "/images/portfolio/solar.webp",
    href: "/solar",
    alt: "Cotabato Solar website introducing its solar installation services",
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

export function ClientHomepage() {
  return (
    <>
      <Box
        component="section"
        id="top"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.4fr 0.6fr" },
          alignItems: "center",
          gap: { xs: 4, md: 8 },
          pt: { xs: 5, md: 8 },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Box>
          <Eyebrow>Independent developer · Based in the Philippines</Eyebrow>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.8rem", sm: "3.9rem", md: "4.8rem" },
              fontWeight: 800,
              letterSpacing: "-0.055em",
              lineHeight: 1.06,
              maxWidth: "14ch",
              mt: 2,
              textWrap: "balance",
            }}
          >
            Your next idea.
            <br />
            <Box component="span" sx={{ color: "primary.main" }}>
              Built for the web.
            </Box>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: 17, md: 20 },
              fontWeight: 500,
              lineHeight: 1.75,
              maxWidth: "48ch",
              mt: 3,
            }}
          >
            I’m Noy. I build websites, online stores, and custom web apps that
            help businesses move forward.
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1.5,
              mt: 3.5,
              "& .MuiButton-root": {
                minHeight: 52,
                px: 2,
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: "nowrap",
              },
            }}
          >
            <Button
              href="#work"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              View my work
            </Button>
            <Button
              component={NextLink}
              href="/about"
              scroll={false}
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              My experience
            </Button>
            <Button
              href="mailto:noypangan5@gmail.com"
              size="large"
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Let’s talk
            </Button>
          </Box>
          <Typography color="text.secondary" sx={{ fontSize: 12, mt: 2 }}>
            Full-stack development · Open to remote projects
          </Typography>
        </Box>
        <Box
          sx={{
            maxWidth: { xs: 300, md: 330 },
            width: "100%",
            justifySelf: { xs: "start", md: "end" },
          }}
        >
          <Box
            component="img"
            src="/display-image/noy-dp.jpg"
            alt="Noy Pangan, full-stack developer"
            width={660}
            height={740}
            fetchPriority="high"
            sx={{
              width: "100%",
              height: { xs: 240, md: 340 },
              objectFit: "cover",
              objectPosition: "center 22%",
              display: "block",
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
                Your partner from idea to launch.
              </Typography>
            </Box>
            <Box
              aria-hidden="true"
              sx={{
                height: 8,
                width: 8,
                borderRadius: "50%",
                bgcolor: "success.main",
              }}
            />
          </Stack>
        </Box>
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
              A few things I’ve built.
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
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 3,
          }}
        >
          {selectedWork.map((project) => (
            <Box component="article" key={project.name} sx={{ minWidth: 0 }}>
              <Link
                component={NextLink}
                href={project.href}
                aria-label={`Explore ${project.name} demo`}
                sx={{
                  display: "block",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  "&:hover": { borderColor: "primary.main" },
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
              <Typography
                color="text.secondary"
                sx={{
                  mt: 2.5,
                  mb: 0.75,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                }}
              >
                {project.category} · Demo
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
                component={NextLink}
                href={project.href}
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={{ mt: 1.5, px: 0 }}
              >
                Explore demo
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
            I’m a full-stack developer and small-business owner in Davao City.
            I’ve worked on production commerce platforms serving over 60,000
            registered users, from storefronts to the tools behind them.
          </Typography>
          <Typography color="text.secondary" sx={{ ...bodyCopy, mt: 2 }}>
            I bring that experience to clear, practical web experiences — with
            care for both your customers and the people running your business.
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
      </Box>
    </>
  );
}
