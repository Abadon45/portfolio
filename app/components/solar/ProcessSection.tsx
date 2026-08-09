import { Box, Container, Grid, Stack, Typography } from "@mui/material";
const steps = [
  [
    "01",
    "Request an assessment",
    "Tell us about your property and your energy goals.",
  ],
  [
    "02",
    "Inspect & understand",
    "We visit your site and study your electricity use.",
  ],
  [
    "03",
    "Design your system",
    "Get a clear recommendation and transparent quotation.",
  ],
  [
    "04",
    "Install & support",
    "Our team installs, tests, and stands behind your system.",
  ],
];
export default function ProcessSection() {
  return (
    <Box
      id="process"
      sx={{ bgcolor: "#143c2c", color: "white", py: { xs: 8, md: 15 } }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            justifyContent: "space-between",
            alignItems: { md: "flex-end" },
            mb: 8,
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ color: "#a1bd9f", fontWeight: 800, letterSpacing: ".16em" }}
            >
              A clear path to clean energy
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: 43, md: 55 }, mt: 1 }}
            >
              From first hello
              <br />
              to{" "}
              <Box component="span" color="primary.main">
                first harvest.
              </Box>
            </Typography>
          </Box>
          <Typography color="#abc0b0" sx={{ maxWidth: 310, lineHeight: 1.7 }}>
            No confusing jargon. No guesswork. Just a thoughtful process and a
            team that keeps you informed at every step.
          </Typography>
        </Stack>
        <Grid container spacing={{ xs: 4, md: 0 }}>
          {steps.map(([number, title, copy]) => (
            <Grid
              key={number}
              size={{ xs: 6, md: 3 }}
              sx={{
                borderTop: 1,
                borderColor: "#52715e",
                pt: 2,
                pr: { md: 3 },
              }}
            >
              <Typography
                color="primary.main"
                sx={{ fontWeight: 800, fontSize: 12 }}
              >
                {number}
              </Typography>
              <Typography variant="h6" sx={{ mt: 4 }}>
                {title}
              </Typography>
              <Typography
                color="#aac0b2"
                sx={{ fontSize: 12, lineHeight: 1.6, mt: 1 }}
              >
                {copy}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
