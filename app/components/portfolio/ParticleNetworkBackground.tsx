"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import {
  type Engine,
  MoveDirection,
  OutMode,
  type ISourceOptions,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { Box } from "@mui/material";

type ParticleNetworkBackgroundProps = {
  backgroundColor?: string;
  particleColor?: string;
  linkColor?: string;
  density?: number;
  speed?: number;
};

const initializeParticles = async (engine: Engine) => {
  await loadSlim(engine);
};

export function ParticleNetworkBackground({
  backgroundColor = "#050b16",
  particleColor = "#dbeafe",
  linkColor = "#60a5fa",
  density = 58,
  speed = 1.6,
}: ParticleNetworkBackgroundProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  const options = useMemo<ISourceOptions>(
    () => ({
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: false, mode: "push" },
          onHover: { enable: false, mode: "repulse" },
        },
      },
      particles: {
        color: { value: particleColor },
        links: {
          color: linkColor,
          distance: 150,
          enable: true,
          opacity: 0.34,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: !reducedMotion,
          outModes: { default: OutMode.out },
          speed: reducedMotion ? 0 : speed,
        },
        number: {
          value: reducedMotion ? Math.round(density / 2) : density,
          density: { enable: true, area: 800 },
        },
        opacity: { value: 0.48 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 2.5 } },
      },
      detectRetina: true,
    }),
    [density, linkColor, particleColor, reducedMotion, speed],
  );

  return (
    <Box
      aria-hidden="true"
      sx={{
        bgcolor: backgroundColor,
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        position: "absolute",
        zIndex: 0,
      }}
    >
      <ParticlesProvider init={initializeParticles}>
        <Particles
          id="portfolio-particle-network"
          options={options}
          style={{ inset: 0, position: "absolute" }}
        />
      </ParticlesProvider>
    </Box>
  );
}
