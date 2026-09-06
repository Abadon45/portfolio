"use client";

import { Box, Button, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NextLink from "next/link";
import { useLayoutEffect } from "react";
import { MotionConfig } from "framer-motion";
import { PortfolioShell } from "./PortfolioShell";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { SkillsSection } from "./SkillsSection";
import { ProjectsSection } from "./ProjectsSection";
import { LandingPagesSection } from "./LandingPagesSection";

export function PortfolioDetails({ view }: { view: "about" | "work" }) {
  useLayoutEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [view]);

  return (
    <PortfolioShell>
      <MotionConfig reducedMotion="user">
        <Box sx={{ py: { xs: 5, md: 8 }, pb: 12 }}>
          <Button
            component={NextLink}
            href="/"
            startIcon={<ArrowBackRoundedIcon />}
            variant="outlined"
            sx={{
              mb: 3,
              px: 2.5,
              py: 1.25,
              minHeight: 44,
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              letterSpacing: "0.025em",
              textTransform: "none",
              borderWidth: 1.5,
              bgcolor: "background.paper",
              "& .MuiButton-startIcon": { mr: 1.25 },
              "&:hover": {
                borderWidth: 1.5,
                bgcolor: "action.hover",
              },
              "&:focus-visible": {
                outline: "2px solid",
                outlineColor: "primary.main",
                outlineOffset: 3,
              },
            }}
          >
            Back to home
          </Button>
          <Typography component="h1" variant="h2" sx={{ mb: 2 }}>
            {view === "about"
              ? "Experience behind the work."
              : "More work. A closer look."}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 650, mb: 6, lineHeight: 1.8 }}
          >
            {view === "about"
              ? "My background in web development, business, and the tools I work with."
              : "Past platform contributions, interactive demos, and design explorations. Production experience and portfolio reconstructions are described separately below."}
          </Typography>
          {view === "about" ? (
            <>
              <ExperienceSection />
              <SkillsSection />
              <EducationSection />
            </>
          ) : (
            <>
              <ProjectsSection />
              <LandingPagesSection />
            </>
          )}
        </Box>
      </MotionConfig>
    </PortfolioShell>
  );
}
