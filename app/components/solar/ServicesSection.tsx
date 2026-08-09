import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const services = [
  {
    icon: "⌂",
    title: "Residential solar roofing",
    copy: "A roof-ready system designed around your household, roof shape, and everyday energy use.",
    features: ["Site assessment", "Roof layout", "Net metering guidance"],
  },
  {
    icon: "▦",
    title: "Commercial rooftop solar",
    copy: "Scalable systems for stores, offices, farms, schools, and businesses that need predictable costs.",
    features: ["Energy audit", "System sizing", "Business continuity"],
  },
  {
    icon: "◒",
    title: "Battery backup",
    copy: "Store daytime generation for evenings, brownouts, and the moments when reliable power matters most.",
    features: ["Backup planning", "Battery sizing", "Load prioritization"],
  },
  {
    icon: "✓",
    title: "Care after installation",
    copy: "Keep your system healthy with monitoring, maintenance, and a local team that knows your setup.",
    features: ["System checks", "Panel cleaning", "After-sales support"],
  },
];

export default function ServicesSection() {
  return (
    <Box
      id="services"
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        py: { xs: 8, md: 14 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} sx={{ mb: { xs: 5, md: 7 }, maxWidth: 690 }}>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ fontWeight: 800, letterSpacing: ".16em" }}
          >
            Services for real properties
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 42, md: 58 } }}>
            From your roof to your
            <Box component="span" color="primary.main">
              power bill.
            </Box>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 570, lineHeight: 1.7 }}
          >
            Choose the support your home or business needs today, with room to
            expand as your energy goals change.
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          {services.map((service) => (
            <Grid key={service.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  border: 1,
                  borderColor: "divider",
                  transition: "transform .25s ease, border-color .25s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack spacing={2.5} sx={{ height: "100%" }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        color: "primary.main",
                        fontSize: 25,
                        fontWeight: 700,
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 800, fontSize: 21 }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: 13, lineHeight: 1.65 }}
                    >
                      {service.copy}
                    </Typography>
                    <Stack spacing={1} sx={{ mt: "auto" }}>
                      {service.features.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          size="small"
                          sx={{
                            justifyContent: "flex-start",
                            bgcolor: "transparent",
                            border: 1,
                            borderColor: "divider",
                            color: "text.secondary",
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
