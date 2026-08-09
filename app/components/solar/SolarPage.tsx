"use client";

import SolarLandingPage from "./SolarLandingPage";
import SolarThemeProvider from "../../theme/solarThemeProvider";
import { FloatingHomeButton } from "../FloatingHomeButton";

export default function SolarPage() {
  return (
    <SolarThemeProvider>
      <SolarLandingPage />
      <FloatingHomeButton />
    </SolarThemeProvider>
  );
}
