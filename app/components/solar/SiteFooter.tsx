import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const serviceLinks = [
  "Residential solar",
  "Commercial solar",
  "Hybrid systems",
  "Solar maintenance",
];
const companyLinks = [
  "About us",
  "How it works",
  "Our solutions",
  "Request a quote",
];

export default function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#143c2c", color: "white", pt: { xs: 7, md: 10 }, pb: 3 }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{
            justifyContent: "space-between",
            alignItems: { md: "flex-end" },
            pb: { xs: 6, md: 8 },
          }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 800,
                letterSpacing: ".16em",
              }}
            >
              Solar to every roof
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: "white", fontSize: { xs: 40, md: 58 }, mt: 1 }}
            >
              Make your roof work harder.
            </Typography>
          </Box>
          <Button
            href="#contact"
            variant="contained"
            sx={{ borderRadius: 99, flexShrink: 0 }}
          >
            Request a free roof assessment ↗
          </Button>
        </Stack>
        <Grid container spacing={{ xs: 5, md: 3 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "#143c2c",
                    borderRadius: "50%",
                    width: 34,
                    height: 34,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 22,
                  }}
                >
                  ☼
                </Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: 21, letterSpacing: "-.06em" }}
                >
                  Cotabato<span style={{ color: "#a8ed4e" }}>Solar</span>
                </Typography>
              </Stack>
              <Typography
                color="#b4cabb"
                sx={{ lineHeight: 1.7, maxWidth: 320 }}
              >
                Solar roofing, battery backup, and practical energy systems for
                homes and businesses across Cotabato and Mindanao.
              </Typography>
              <Button
                href="#contact"
                variant="contained"
                sx={{ borderRadius: 99, alignSelf: "flex-start" }}
              >
                Start your solar journey ↗
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              color="primary.main"
              sx={{ fontWeight: 800, fontSize: 12, mb: 2 }}
            >
              SOLAR SOLUTIONS
            </Typography>
            <Stack spacing={1.2}>
              {serviceLinks.map((link) => (
                <Typography
                  component="a"
                  href="#solutions"
                  key={link}
                  color="#b4cabb"
                  sx={{ fontSize: 13 }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              color="primary.main"
              sx={{ fontWeight: 800, fontSize: 12, mb: 2 }}
            >
              EXPLORE
            </Typography>
            <Stack spacing={1.2}>
              {companyLinks.map((link) => (
                <Typography
                  component="a"
                  href={
                    link === "How it works"
                      ? "#process"
                      : link === "Request a quote"
                        ? "#contact"
                        : "#solutions"
                  }
                  key={link}
                  color="#b4cabb"
                  sx={{ fontSize: 13 }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              color="primary.main"
              sx={{ fontWeight: 800, fontSize: 12, mb: 2 }}
            >
              GET IN TOUCH
            </Typography>
            <Stack spacing={1.2}>
              <Typography color="#b4cabb" sx={{ fontSize: 13 }}>
                📍 Cotabato City, Mindanao
              </Typography>
              <Typography
                component="a"
                href="mailto:hello@cotabatosolar.ph"
                color="#b4cabb"
                sx={{ fontSize: 13 }}
              >
                ✉ hello@cotabatosolar.ph
              </Typography>
              <Typography color="#b4cabb" sx={{ fontSize: 13 }}>
                ☼ Mon–Sat · 9:00 AM–5:00 PM
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: "#52715e", my: 6 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "space-between" }}
        >
          <Typography color="#8fae98" sx={{ fontSize: 11 }}>
            © 2026 Cotabato Solar. Clean energy, made practical.
          </Typography>
          <Typography color="#8fae98" sx={{ fontSize: 11 }}>
            Privacy · Terms · Facebook ↗
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
