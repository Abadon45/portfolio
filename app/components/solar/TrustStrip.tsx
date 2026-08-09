import { Box, Container, Stack, Typography } from "@mui/material";
const trust = [
  ["⌖", "Cotabato based", "Serving Mindanao"],
  ["⌂", "Home & business", "Systems sized for you"],
  ["✓", "End-to-end care", "Assessment to after-sales"],
] as const;
export default function TrustStrip() {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBlock: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "1.2fr 1fr 1fr 1fr" },
            minHeight: 126,
            alignItems: "center",
            gap: 2,
            py: { xs: 3, md: 0 },
          }}
        >
          <Typography
            sx={{ color: "text.primary", fontSize: 14, lineHeight: 1.55 }}
          >
            Solar made <b>clear.</b>
            <br />
            Support made local.
          </Typography>
          {trust.map(([icon, title, subtitle]) => (
            <Stack
              direction="row"
              spacing={1.5}
              key={title}
              sx={{
                borderLeft: { md: 1 },
                borderColor: "divider",
                pl: { md: 3 },
              }}
            >
              <Typography color="primary" sx={{ fontSize: 23 }}>
                {icon}
              </Typography>
              <Box>
                <Typography
                  sx={{ color: "text.primary", fontWeight: 700, fontSize: 13 }}
                >
                  {title}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 11 }}>
                  {subtitle}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
