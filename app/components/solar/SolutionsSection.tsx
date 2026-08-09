import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const solutions = [
  {
    title: "Solar Roofing for Homes",
    copy: "A roof-ready system designed around your household, your energy use, and the life you want to power.",
    tag: "Start at home",
    image:
      "https://images.squarespace-cdn.com/content/v1/65bdc1cdcec94a301b91fe76/ab28e4ac-bed1-4256-984c-cb74dc8099de/18%2BkW%2BSunsynk%2BGen%2B2%2BHybrid%2BSolar%2BEnergy%2BSystem%2BMuntinlupa%2BCity.webp?format=1200w",
  },
  {
    title: "Solar Roofing for Business",
    copy: "Scalable rooftop systems for stores, offices, farms, schools, and growing businesses.",
    tag: "For business",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Hybrid Roof Systems",
    copy: "Solar and battery storage working together for dependable energy after sunset and during outages.",
    tag: "Solar + storage",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function SolutionsSection() {
  return (
    <Container
      maxWidth="lg"
      id="solutions"
      sx={{ py: { xs: 8, md: 15 }, color: "text.primary" }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{
          justifyContent: "space-between",
          alignItems: { md: "flex-end" },
          mb: 6,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              fontWeight: 800,
              letterSpacing: ".16em",
            }}
          >
            Our solar solutions
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 43, md: 55 }, mt: 1 }}>
            Power that fits{" "}
            <Box component="span" color="primary.main">
              your world.
            </Box>
          </Typography>
        </Box>
        <Typography
          color="text.secondary"
          sx={{ maxWidth: 310, lineHeight: 1.7 }}
        >
          Every property is different. We help you find the right balance of
          savings, reliability, and room to grow.
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        {solutions.map((item) => (
          <Grid key={item.title} size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: 430,
                position: "relative",
                overflow: "hidden",
                color: "white",
                borderRadius: 2,
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  height: "100%",
                  background: `linear-gradient(180deg, transparent 25%, rgba(15,40,28,.85)), url(${item.image}) center/cover`,
                  transition: "transform .5s",
                  "&:hover": { transform: "scale(1.04)" },
                }}
              />
              <CardContent
                sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
              >
                <Chip
                  label={item.tag}
                  variant="outlined"
                  sx={{ color: "white", borderColor: "#ffffff99" }}
                />
                <Typography variant="h4" sx={{ mt: 1.5, fontSize: 26 }}>
                  {item.title}
                </Typography>
                <Typography
                  color="#d8e6d7"
                  sx={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    maxWidth: 280,
                    mb: 2,
                  }}
                >
                  {item.copy}
                </Typography>
                <Button href="#estimate" color="primary" sx={{ p: 0 }}>
                  Learn more ↗
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
