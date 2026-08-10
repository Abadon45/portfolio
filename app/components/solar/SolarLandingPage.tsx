"use client";

import { useState } from "react";
import AssessmentDialog from "./AssessmentDialog";
import ContactSection from "./ContactSection";
import HeroSection from "./HeroSection";
import ProcessSection from "./ProcessSection";
import SavingsEstimator from "./SavingsEstimator";
import ScrollToTopButton from "../ScrollToTopButton";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import ServicesSection from "./ServicesSection";
import SolutionsSection from "./SolutionsSection";
import TestimonialsSection from "./TestimonialsSection";
import TrustStrip from "./TrustStrip";
import WhyChooseUsSection from "./WhyChooseUsSection";

export default function SolarLandingPage() {
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const openAssessment = () => setAssessmentOpen(true);
  return (
    <>
      <SiteNav onAssessment={openAssessment} />
      <HeroSection onAssessment={openAssessment} />
      <TrustStrip />
      <ServicesSection />
      <SolutionsSection />
      <ProcessSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <SavingsEstimator onAssessment={openAssessment} />
      <ContactSection />
      <SiteFooter />
      <ScrollToTopButton />
      <AssessmentDialog
        open={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
      />
    </>
  );
}
