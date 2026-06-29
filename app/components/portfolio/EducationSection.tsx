import { Card, CardContent, Typography } from "@mui/material";
import { Eyebrow } from "./Eyebrow";
import { SectionMotion } from "./SectionMotion";
import { cardSx } from "./styles";

export function EducationSection() {
  return (
    <SectionMotion amount={0.2}>
      <Card component="section" sx={{ ...cardSx, mb: { xs: 7, md: 10 } }}>
        <CardContent sx={{ p: 2.5 }}>
          <Eyebrow>Education</Eyebrow>
          <Typography component="h2" variant="h2" sx={{ fontSize: { xs: "1.8rem", md: "2.3rem" }, mb: 1 }}>
            Ateneo de Davao University
          </Typography>
          <Typography color="text.secondary">BS Computer Engineering - Undergraduate Studies, 2004 - 2010</Typography>
        </CardContent>
      </Card>
    </SectionMotion>
  );
}
