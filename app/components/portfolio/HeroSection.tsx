import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmailIcon from "@mui/icons-material/Email";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { profileSnapshot, proofMetrics } from "../../data/portfolio";
import { Eyebrow } from "./Eyebrow";

type HeroSectionProps = {
  isDark: boolean;
  onScrollToSection: (sectionId: string) => void;
};

export function HeroSection({ isDark, onScrollToSection }: HeroSectionProps) {
  return (
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
        <Typography component="h1" variant="h1" sx={{ fontSize: { xs: "2.25rem", sm: "3.55rem", lg: "4.85rem" }, maxWidth: { xs: "none", md: "12.5ch" }, mb: 2 }}>
          Full Stack Developer building scalable SaaS and{" "}
          <Box component="span" sx={{ whiteSpace: "nowrap" }}>
            e-commerce
          </Box>{" "}
          systems.
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: { xs: "1.04rem", md: "1.18rem" }, lineHeight: 1.72, maxWidth: "66ch" }}>
          I build production platforms with Next.js, React, TypeScript, and Django, from
          authenticated dashboards to checkout flows, API gateways, and supplier storefront
          tooling.
        </Typography>
        <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, maxWidth: 680, mt: 3 }}>
          {proofMetrics.map((metric) => (
            <Box
              key={metric.label}
              sx={{
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                boxShadow: "0 10px 30px rgba(23, 32, 51, 0.04)",
                p: 1.5,
              }}
            >
              <Typography component="strong" sx={{ color: "primary.main", display: "block", fontSize: "1.6rem", fontWeight: 850, lineHeight: 1 }}>
                {metric.value}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.84rem", lineHeight: 1.35, mt: 0.75 }}>
                {metric.label}
              </Typography>
            </Box>
          ))}
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => onScrollToSection("projects")}
            size="large"
            variant="contained"
            sx={{ transition: "transform 200ms ease", "&:hover": { transform: "scale(1.02)" } }}
          >
            View portfolio
          </Button>
          <Button
            component="a"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=noypangan5@gmail.com"
            rel="noreferrer"
            size="large"
            startIcon={<EmailIcon />}
            target="_blank"
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
        {profileSnapshot.map(([label, value]) => (
          <Box key={label} sx={{ borderBottom: label === "Current focus" ? 0 : 1, borderColor: "rgba(255,255,255,0.1)", p: 2 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: "0.78rem", fontWeight: 850, mb: 0.5, textTransform: "uppercase" }}>
              {label}
            </Typography>
            <Typography>{value}</Typography>
          </Box>
        ))}
      </Card>
    </Box>
  );
}
