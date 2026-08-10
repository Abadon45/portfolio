import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { projects } from "../../data/portfolio";
import { Eyebrow } from "./Eyebrow";
import { SectionHeading } from "./SectionHeading";
import { SectionMotion } from "./SectionMotion";
import { cardSx, cardVariant, listItemVariant, staggerContainer } from "./styles";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionUl = motion.ul;
const MotionLi = motion.li;

export function ProjectsSection() {
  const [featuredProject, ...supportingProjects] = projects;

  return (
    <SectionMotion>
      <Box component="section" id="projects" sx={{ mb: { xs: 7, md: 10 }, scrollMarginTop: 96 }}>
        <SectionHeading eyebrow="Selected Projects" title="Portfolio case studies" />
        <MotionBox variants={staggerContainer} sx={{ display: "grid", gap: 2 }}>
          {featuredProject && (
            <MotionCard
              key={featuredProject.title}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              sx={{
                ...cardSx,
                bgcolor: "background.paper",
                borderLeft: 5,
                borderLeftColor: "primary.main",
              }}
            >
              <CardContent
                sx={{
                  display: "grid",
                  gap: { xs: 2, md: 4 },
                  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.9fr) minmax(320px, 1fr)" },
                  p: { xs: 2.5, md: 3.5 },
                  "&:last-child": { pb: { xs: 2.5, md: 3.5 } },
                }}
              >
                <Box>
                  <Eyebrow>{featuredProject.eyebrow}</Eyebrow>
                  <Typography component="h3" variant="h3" sx={{ fontSize: { xs: "1.45rem", md: "1.75rem" }, mb: 1 }}>
                    {featuredProject.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "1.02rem", lineHeight: 1.65 }}>
                    {featuredProject.summary}
                  </Typography>
                </Box>
                <MotionUl variants={staggerContainer} style={{ display: "grid", gap: 10, listStyle: "none", margin: 0, paddingLeft: 0 }}>
                  {featuredProject.details.map((detail) => (
                    <MotionLi key={detail} variants={listItemVariant} style={{ alignItems: "flex-start", display: "flex", gap: 8 }}>
                      <CheckCircleIcon color="secondary" sx={{ fontSize: 19, mt: 0.25 }} />
                      <Typography sx={{ lineHeight: 1.55 }}>{detail}</Typography>
                    </MotionLi>
                  ))}
                </MotionUl>
              </CardContent>
            </MotionCard>
          )}

          <MotionBox variants={staggerContainer} sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
            {supportingProjects.map((project) => (
              <MotionCard
                key={project.title}
                variants={cardVariant}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                sx={{ ...cardSx, minHeight: { md: 330 } }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Eyebrow>{project.eyebrow}</Eyebrow>
                  <Typography component="h3" variant="h3" sx={{ fontSize: "1.3rem", mb: 1 }}>
                    {project.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    {project.summary}
                  </Typography>
                  <MotionUl variants={staggerContainer} style={{ display: "grid", gap: 8, listStyle: "none", margin: "16px 0 0", paddingLeft: 0 }}>
                    {project.details.map((detail) => (
                      <MotionLi key={detail} variants={listItemVariant} style={{ alignItems: "flex-start", display: "flex", gap: 8 }}>
                        <CheckCircleIcon color="secondary" sx={{ fontSize: 18, marginTop: 2 }} />
                        <Typography sx={{ lineHeight: 1.5 }}>{detail}</Typography>
                      </MotionLi>
                    ))}
                  </MotionUl>
                </CardContent>
              </MotionCard>
            ))}
          </MotionBox>
        </MotionBox>
      </Box>
    </SectionMotion>
  );
}
