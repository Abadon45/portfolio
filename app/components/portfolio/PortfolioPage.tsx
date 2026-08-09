"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, CssBaseline, GlobalStyles, ThemeProvider, type PaletteMode } from "@mui/material";
import { createPortfolioTheme } from "../../theme/portfolioTheme";
import { ContactSection } from "./ContactSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { HeroSection } from "./HeroSection";
import { LandingPagesSection } from "./LandingPagesSection";
import { PortfolioAppBar } from "./PortfolioAppBar";
import { ProjectsSection } from "./ProjectsSection";
import { ScrollTopButton } from "./ScrollTopButton";
import { SkillsSection } from "./SkillsSection";
import { SummarySection } from "./SummarySection";
import { ThemeSettingsButton } from "./ThemeSettingsButton";
import type { PortfolioThemeName } from "../../theme/portfolioTheme";

export function PortfolioPage() {
  const [mode, setMode] = useState<PaletteMode>("light");
  const [activeTheme, setActiveTheme] = useState<PortfolioThemeName>("executive");
  const [customPrimary, setCustomPrimary] = useState("#1a237e");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const theme = useMemo(() => createPortfolioTheme(mode, activeTheme, customPrimary), [activeTheme, customPrimary, mode]);
  const isDark = mode === "dark";

  useEffect(() => {
    const savedMode = window.localStorage.getItem("portfolio-theme-mode");
    const savedTheme = window.localStorage.getItem("portfolio-color-theme");
    const savedCustomPrimary = window.localStorage.getItem("portfolio-custom-primary");

    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }

    if (
      savedTheme === "executive" ||
      savedTheme === "modern" ||
      savedTheme === "classic" ||
      savedTheme === "bold" ||
      savedTheme === "minimalist" ||
      savedTheme === "vibrant" ||
      savedTheme === "custom"
    ) {
      setActiveTheme(savedTheme);
    } else if (savedTheme === "twc") {
      setActiveTheme("executive");
    }

    if (savedCustomPrimary?.match(/^#[0-9a-fA-F]{6}$/)) {
      setCustomPrimary(savedCustomPrimary);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("portfolio-theme-mode", mode);
    window.localStorage.setItem("portfolio-color-theme", activeTheme);
    window.localStorage.setItem("portfolio-custom-primary", customPrimary);
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.colorTheme = activeTheme;
    document.documentElement.style.colorScheme = mode;
  }, [activeTheme, customPrimary, mode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 520);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMode = () => {
    setMode((currentMode) => (currentMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={(activeTheme) => ({
          html: { scrollBehavior: "smooth" },
          body: {
            backgroundColor: activeTheme.palette.background.default,
            backgroundImage: isDark
              ? `radial-gradient(circle, ${activeTheme.palette.primary.main}2b 1px, transparent 1px), radial-gradient(circle, rgba(98, 213, 208, 0.1) 1px, transparent 1px)`
              : `radial-gradient(circle, ${activeTheme.palette.primary.main}29 1px, transparent 1px), radial-gradient(circle, rgba(15, 159, 154, 0.1) 1px, transparent 1px)`,
            backgroundPosition: "0 0, 12px 12px",
            backgroundSize: "32px 32px, 24px 24px",
          },
        })}
      />

      <PortfolioAppBar isDark={isDark} onScrollToSection={scrollToSection} onScrollToTop={scrollToTop} onToggleMode={toggleMode} />

      <Container component="main" maxWidth="lg" sx={{ pb: 6 }}>
        <HeroSection isDark={isDark} onScrollToSection={scrollToSection} />
        <SummarySection />
        <ProjectsSection />
        <LandingPagesSection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <ContactSection isDark={isDark} />
      </Container>

      <ScrollTopButton show={showScrollTop} onScrollToTop={scrollToTop} />
      <ThemeSettingsButton
        activeTheme={activeTheme}
        customPrimary={customPrimary}
        onCustomPrimaryChange={setCustomPrimary}
        onThemeChange={setActiveTheme}
      />
    </ThemeProvider>
  );
}
