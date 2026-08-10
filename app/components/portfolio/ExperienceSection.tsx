import { motion } from "framer-motion";
import PlaceIcon from "@mui/icons-material/Place";
import WorkIcon from "@mui/icons-material/Work";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { experiences } from "../../data/portfolio";
import { SectionHeading } from "./SectionHeading";
import { SectionMotion } from "./SectionMotion";
import { cardSx, cardVariant, listItemVariant, staggerContainer } from "./styles";

const MotionCard = motion.create(Card);
const MotionStack = motion.create(Stack);
const MotionUl = motion.ul;
const MotionLi = motion.li;

export function ExperienceSection() {
  return (
    <SectionMotion>
      <Box component="section" id="experience" sx={{ mb: { xs: 7, md: 10 }, scrollMarginTop: 96 }}>
        <SectionHeading eyebrow="Professional Experience" title="Work history" />
        <MotionStack spacing={2} variants={staggerContainer}>
          {experiences.map((experience) => (
            <MotionCard
              key={`${experience.company}-${experience.role}`}
              variants={cardVariant}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              sx={cardSx}
            >
              <CardContent sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "240px minmax(0, 1fr)" }, p: 2.5 }}>
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main", mb: 0.75 }}>
                    <WorkIcon fontSize="small" />
                    <Typography sx={{ fontWeight: 850 }}>{experience.period}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                    <PlaceIcon fontSize="small" />
                    <Typography sx={{ fontWeight: 750 }}>{experience.location}</Typography>
                  </Stack>
                </Box>
                <Box>
                  <Typography component="h3" variant="h3" sx={{ fontSize: "1.25rem", mb: 0.5 }}>
                    {experience.role}
                  </Typography>
                  <Typography color="primary.dark" sx={{ fontWeight: 850, mb: 1.5 }}>
                    {experience.company}
                  </Typography>
                  <MotionUl variants={staggerContainer} style={{ display: "grid", gap: 8, margin: 0, paddingLeft: 18 }}>
                    {experience.bullets.map((bullet) => (
                      <MotionLi key={bullet} variants={listItemVariant}>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {bullet}
                        </Typography>
                      </MotionLi>
                    ))}
                  </MotionUl>
                </Box>
              </CardContent>
            </MotionCard>
          ))}
        </MotionStack>
      </Box>
    </SectionMotion>
  );
}
