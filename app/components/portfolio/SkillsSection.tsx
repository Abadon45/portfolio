import { motion } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { skills } from "../../data/portfolio";
import { SectionHeading } from "./SectionHeading";
import { SectionMotion } from "./SectionMotion";
import { cardSx, cardVariant, listItemVariant, staggerContainer } from "./styles";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionChip = motion.create(Chip);

export function SkillsSection() {
  return (
    <SectionMotion>
      <Box component="section" id="skills" sx={{ mb: { xs: 7, md: 10 }, scrollMarginTop: 96 }}>
        <SectionHeading eyebrow="Technical Skills" title="Stack and strengths" />
        <MotionBox variants={staggerContainer} sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
          {Object.entries(skills).map(([category, items]) => (
            <MotionCard key={category} variants={cardVariant} whileHover={{ y: -6 }} transition={{ duration: 0.2 }} sx={cardSx}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
                  <CodeIcon color="primary" />
                  <Typography component="h3" variant="h3" sx={{ fontSize: "1.2rem" }}>
                    {category}
                  </Typography>
                </Stack>
                <MotionBox variants={staggerContainer} sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {items.map((item) => (
                    <MotionChip
                      color="primary"
                      key={item}
                      label={item}
                      variants={listItemVariant}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      variant="outlined"
                    />
                  ))}
                </MotionBox>
              </CardContent>
            </MotionCard>
          ))}
        </MotionBox>
      </Box>
    </SectionMotion>
  );
}
