import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { projects, type Project } from "../../data/portfolio";
import { Eyebrow } from "./Eyebrow";
import { ProjectStatusLabel } from "./ProjectStatusLabel";
import { SectionHeading } from "./SectionHeading";
import { SectionMotion } from "./SectionMotion";
import {
  cardSx,
  cardVariant,
  listItemVariant,
  staggerContainer,
} from "./styles";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionUl = motion.ul;
const MotionLi = motion.li;

function ProjectCard({ project }: { project: Project }) {
  return (
    <MotionCard
      key={project.title}
      variants={cardVariant}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      sx={{ ...cardSx, minHeight: { md: 330 } }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <ProjectStatusLabel status={project.status} />
        <Eyebrow>{project.eyebrow}</Eyebrow>
        <Typography
          component="h3"
          variant="h3"
          sx={{ fontSize: "1.3rem", mb: 1 }}
        >
          {project.title}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
          {project.summary}
        </Typography>
        {project.href && (
          <Button
            component="a"
            href={project.href}
            target={project.external ? "_blank" : undefined}
            rel={project.external ? "noreferrer" : undefined}
            endIcon={<ArrowOutwardRoundedIcon />}
            sx={{ mt: 2, width: "fit-content" }}
          >
            {project.external
              ? `Visit ${project.eyebrow}`
              : `View ${project.eyebrow} details`}
          </Button>
        )}
        <MotionUl
          variants={staggerContainer}
          style={{
            display: "grid",
            gap: 8,
            listStyle: "none",
            margin: "16px 0 0",
            paddingLeft: 0,
          }}
        >
          {project.details.map((detail) => (
            <MotionLi
              key={detail}
              variants={listItemVariant}
              style={{
                alignItems: "flex-start",
                display: "flex",
                gap: 8,
              }}
            >
              <CheckCircleIcon
                color="secondary"
                sx={{ fontSize: 18, marginTop: 2 }}
              />
              <Typography sx={{ lineHeight: 1.5 }}>{detail}</Typography>
            </MotionLi>
          ))}
        </MotionUl>
      </CardContent>
    </MotionCard>
  );
}

export function ProjectsSection() {
  const productionProjects = projects.filter(
    (project) => project.status === "Production work",
  );
  const [featuredProject, ...supportingProjects] = productionProjects;
  const portfolioProjects = projects.filter(
    (project) => project.status !== "Production work",
  );

  return (
    <SectionMotion>
      <Box
        component="section"
        id="projects"
        sx={{ mb: { xs: 7, md: 10 }, scrollMarginTop: 96 }}
      >
        <SectionHeading
          eyebrow="Production experience"
          title="Platform work, with my role made clear."
        />
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
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "minmax(0, 0.9fr) minmax(320px, 1fr)",
                  },
                  p: { xs: 2.5, md: 3.5 },
                  "&:last-child": { pb: { xs: 2.5, md: 3.5 } },
                }}
              >
                <Box>
                  <ProjectStatusLabel status={featuredProject.status} />
                  <Eyebrow>{featuredProject.eyebrow}</Eyebrow>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 12, fontWeight: 700, mb: 1, textTransform: "uppercase", letterSpacing: ".08em" }}
                  >
                    Full Stack Web Developer · Jan 2024 – Jun 2026
                  </Typography>
                  <Typography
                    component="h3"
                    variant="h3"
                    sx={{ fontSize: { xs: "1.45rem", md: "1.75rem" }, mb: 1 }}
                  >
                    {featuredProject.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: "1.02rem", lineHeight: 1.65 }}
                  >
                    {featuredProject.summary}
                  </Typography>
                  {featuredProject.href && (
                    <Button
                      component="a"
                      href={featuredProject.href}
                      target={featuredProject.external ? "_blank" : undefined}
                      rel={featuredProject.external ? "noreferrer" : undefined}
                      endIcon={<ArrowOutwardRoundedIcon />}
                      sx={{ mt: 2, width: "fit-content" }}
                    >
                      Read {featuredProject.eyebrow} case study
                    </Button>
                  )}
                </Box>
                <MotionUl
                  variants={staggerContainer}
                  style={{
                    display: "grid",
                    gap: 10,
                    listStyle: "none",
                    margin: 0,
                    paddingLeft: 0,
                  }}
                >
                  {featuredProject.details.map((detail) => (
                    <MotionLi
                      key={detail}
                      variants={listItemVariant}
                      style={{
                        alignItems: "flex-start",
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <CheckCircleIcon
                        color="secondary"
                        sx={{ fontSize: 19, mt: 0.25 }}
                      />
                      <Typography sx={{ lineHeight: 1.55 }}>
                        {detail}
                      </Typography>
                    </MotionLi>
                  ))}
                </MotionUl>
              </CardContent>
            </MotionCard>
          )}

          <MotionBox
            variants={staggerContainer}
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {supportingProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </MotionBox>

          <Box
            component="section"
            id="portfolio-projects"
            aria-labelledby="portfolio-projects-heading"
            sx={{
              borderTop: 1,
              borderColor: "divider",
              mt: 3,
              pt: 3,
            }}
          >
            <SectionHeading
              headingId="portfolio-projects-heading"
              eyebrow="Demos, case studies & reconstructions"
              title="Portfolio work you can explore."
            />
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 680, lineHeight: 1.7 }}
            >
              Each entry is labeled as a product demo, case study, or
              reconstruction. Demos use fictional or sanitized data where
              applicable and are separate from my production work at TWC IT
              Solutions.
            </Typography>
            <MotionBox
              variants={staggerContainer}
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                mt: 3,
              }}
            >
              {portfolioProjects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </MotionBox>
          </Box>
        </MotionBox>
      </Box>
    </SectionMotion>
  );
}
