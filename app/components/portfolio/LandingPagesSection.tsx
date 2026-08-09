import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { landingPages } from "../../data/portfolio";
import { Eyebrow } from "./Eyebrow";
import { SectionHeading } from "./SectionHeading";
import { SectionMotion } from "./SectionMotion";
import { cardSx } from "./styles";

export function LandingPagesSection() {
  return (
    <SectionMotion>
      <Stack component="section" id="landing-pages" spacing={2} sx={{ mb: { xs: 7, md: 10 }, scrollMarginTop: 96 }}>
        <SectionHeading eyebrow="Landing Pages" title="Standalone page experiments" />
        {landingPages.map((page) => (
          <Card key={page.href} sx={{ ...cardSx, bgcolor: "background.paper" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Eyebrow>Template / landing page</Eyebrow>
              <Typography component="h3" variant="h3" sx={{ fontSize: { xs: "1.35rem", md: "1.55rem" }, mb: 1 }}>
                {page.title}
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.65, maxWidth: 720 }}>
                {page.summary}
              </Typography>
              <Button href={page.href} endIcon={<ArrowOutwardRoundedIcon />} sx={{ mt: 2 }}>
                Open landing page
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </SectionMotion>
  );
}
