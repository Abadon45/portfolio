import Link from "next/link";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Container, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "background.default",
        display: "flex",
        minHeight: "100vh",
        py: 8,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".12em" }}>
          EMMANUEL NOY PANGAN
        </Typography>
        <Typography component="h1" sx={{ fontSize: { xs: 72, sm: 104 }, fontWeight: 800, letterSpacing: "-.07em", lineHeight: 1.1, mt: 2 }}>
          404
        </Typography>
        <Typography component="h2" sx={{ fontWeight: 700, mt: 1 }} variant="h4">
          This page isn’t here.
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          The link may be outdated, or the page may have moved.
        </Typography>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBackRoundedIcon />} sx={{ mt: 3 }} variant="contained">
            Return to portfolio
          </Button>
        </Link>
      </Container>
    </Box>
  );
}
