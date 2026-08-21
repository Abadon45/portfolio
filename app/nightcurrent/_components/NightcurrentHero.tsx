"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { Box, Button, Chip, Container, Typography } from "@mui/material";

const PARALLAX_LAYERS = [
  ["sky", "Sky", 0.02],
  ["star-far", "Far stars", 0.02],
  ["star-mid", "Mid stars", 0.04],
  ["star-near", "Near stars", 0.06],
  ["ocean", "Ocean", 0.06],
  ["island", "Distant island", 0.09],
  ["cliffs", "Cliffs", 0.14],
  ["station", "Station", 0.18],
  ["shoreline", "Shoreline", 0.22],
  ["midground", "Midground", 0.28],
  ["foreground", "Foreground", 0.34],
  ["lights", "Floating lights", 0.2],
  ["ui", "UI", 0.08],
] as const;

const FLOATING_LIGHTS = [
  [14, 64, 3, 0, 9],
  [23, 53, 2, 2, 12],
  [31, 70, 4, 4, 10],
  [40, 58, 2, 1, 14],
  [49, 67, 3, 6, 11],
  [57, 52, 2, 3, 13],
  [66, 73, 4, 7, 10],
  [75, 61, 2, 2, 15],
  [84, 69, 3, 5, 12],
  [91, 56, 2, 8, 9],
] as const;

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (Math.imul(31, hash) + value.charCodeAt(index)) | 0;
  }
  return hash;
}

type Star = {
  delay: number;
  duration: number;
  id: string;
  opacity: number;
  size: number;
  twinkle: "none" | "subtle" | "pulse";
  x: number;
  y: number;
};

const TWINKLE_DURATIONS = [4, 6, 8, 11];

function inMoonZone(x: number, y: number) {
  return x > 60 && x < 86 && y > 6 && y < 34;
}

function generateStars(seedLabel: string, count: number): Star[] {
  const random = mulberry32(hashSeed(seedLabel));
  const stars: Star[] = [];

  for (let index = 0; index < count; index += 1) {
    let x = random() * 100;
    let y = random() * 60;
    if (inMoonZone(x, y)) {
      x = random() * 100;
      y = random() * 60;
    }
    const roll = random();
    const [size, opacity] =
      roll < 0.7
        ? [1 + random() * 0.5, 0.35 + random() * 0.25]
        : roll < 0.9
          ? [1.6 + random() * 0.6, 0.45 + random() * 0.25]
          : roll < 0.98
            ? [2.4 + random() * 0.8, 0.55 + random() * 0.25]
            : [3.2 + random(), 0.75 + random() * 0.2];
    const twinkleRoll = random();

    stars.push({
      delay: random() * 8,
      duration:
        TWINKLE_DURATIONS[Math.floor(random() * TWINKLE_DURATIONS.length)],
      id: `${seedLabel}-${index}`,
      opacity,
      size,
      twinkle:
        twinkleRoll < 0.9 ? "none" : twinkleRoll < 0.98 ? "subtle" : "pulse",
      x,
      y,
    });
  }

  return stars;
}

type LayerId = (typeof PARALLAX_LAYERS)[number][0];
const depthOf = (id: LayerId) =>
  PARALLAX_LAYERS.find(([layerId]) => layerId === id)?.[2] ?? 0;

function Layer({
  id,
  children,
  className,
  sx,
}: {
  id: LayerId;
  children?: ReactNode;
  className?: string;
  sx?: Record<string, unknown>;
}) {
  return (
    <Box
      className={className}
      data-parallax-layer={id}
      data-depth={depthOf(id)}
      sx={{
        inset: 0,
        pointerEvents: "none",
        position: "absolute",
        transform: "translate3d(0, 0, 0)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function StarLayer({ stars }: { stars: Star[] }) {
  return (
    <>
      {stars.map((star) => (
        <Box
          key={star.id}
          className={
            star.twinkle !== "none" ? "nightcurrent-animated" : undefined
          }
          sx={{
            ...(star.twinkle === "subtle" && {
              animation: `nightcurrent-twinkle-subtle ${star.duration}s ${star.delay}s ease-in-out infinite`,
            }),
            ...(star.twinkle === "pulse" && {
              animation: `nightcurrent-twinkle-pulse ${star.duration}s ${star.delay}s ease-in-out infinite`,
              boxShadow: `0 0 ${star.size * 2}px rgba(244,247,255,0.35)`,
            }),
            bgcolor: "#f4f7ff",
            borderRadius: "50%",
            height: star.size,
            left: `${star.x}%`,
            opacity: star.opacity,
            position: "absolute",
            top: `${star.y}%`,
            width: star.size,
          }}
        />
      ))}
    </>
  );
}

export function NightcurrentHero() {
  const heroRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const visibleRef = useRef(false);
  const targetRef = useRef({ x: 0, y: 0, scroll: 0 });
  const currentRef = useRef({ x: 0, y: 0, scroll: 0 });
  const [debug, setDebug] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const scene = sceneRef.current;
    if (!hero || !scene) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const layers = Array.from(
      scene.querySelectorAll<HTMLElement>("[data-parallax-layer]"),
    );
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updateScroll = () => {
      const rect = hero.getBoundingClientRect();
      targetRef.current.scroll =
        Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1))) *
        (coarsePointer.matches ? -20 : -36);
    };
    const updatePointer = (event: PointerEvent) => {
      if (coarsePointer.matches) return;
      targetRef.current.x = (event.clientX / window.innerWidth - 0.5) * 34;
      targetRef.current.y = (event.clientY / window.innerHeight - 0.5) * 24;
    };
    const animate = () => {
      if (!activeRef.current || motionQuery.matches) return;
      const current = currentRef.current;
      const target = targetRef.current;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      current.scroll += (target.scroll - current.scroll) * 0.08;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth ?? 0);
        const isUiLayer = layer.dataset.parallaxLayer === "ui";
        const overscan = isUiLayer ? "" : "scale(1.06) ";
        layer.style.transform = `${overscan}translate3d(${(current.x * depth).toFixed(2)}px, ${(current.y * depth + current.scroll * depth).toFixed(2)}px, 0)`;
      });
      frameRef.current = window.requestAnimationFrame(animate);
    };
    const start = () => {
      if (activeRef.current || motionQuery.matches) return;
      activeRef.current = true;
      setVisible(true);
      layers.forEach((layer) => {
        layer.style.willChange = "transform";
      });
      updateScroll();
      if (!coarsePointer.matches) {
        window.addEventListener("pointermove", updatePointer, {
          passive: true,
        });
      }
      window.addEventListener("scroll", updateScroll, { passive: true });
      frameRef.current = window.requestAnimationFrame(animate);
    };
    const stop = () => {
      activeRef.current = false;
      setVisible(false);
      if (!coarsePointer.matches) {
        window.removeEventListener("pointermove", updatePointer);
      }
      window.removeEventListener("scroll", updateScroll);
      layers.forEach((layer) => {
        layer.style.willChange = "auto";
      });
      if (frameRef.current !== null)
        window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    setDebug(
      new URLSearchParams(window.location.search).get("parallaxDebug") ===
        "true",
    );
    updateMotion();
    const handleMotionChange = () => {
      updateMotion();
      if (motionQuery.matches) stop();
      else if (visibleRef.current) start();
    };
    observer.observe(hero);
    motionQuery.addEventListener("change", handleMotionChange);
    return () => {
      stop();
      observer.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  const starsFar = useMemo(
    () => generateStars("nightcurrent-star-far", 140),
    [],
  );
  const starsMid = useMemo(
    () => generateStars("nightcurrent-star-mid", 45),
    [],
  );
  const starsNear = useMemo(
    () => generateStars("nightcurrent-star-near", 12),
    [],
  );

  return (
    <Box
      ref={heroRef}
      component="section"
      aria-labelledby="nightcurrent-title"
      data-motion={reducedMotion ? "reduced" : "active"}
      data-visible={visible ? "true" : "false"}
      sx={{
        bgcolor: "#173343",
        minHeight: { xs: 720, md: "100svh" },
        overflow: "hidden",
        position: "relative",
        ...(reducedMotion && {
          "& .nightcurrent-animated": {
            animation: "none !important",
          },
          "& [data-parallax-layer]": {
            transform: "none !important",
            willChange: "auto",
          },
        }),
        "&[data-visible='false'] .nightcurrent-animated": {
          animationPlayState: "paused",
        },
        "&[data-visible='false'] .nightcurrent-intro": {
          animationPlayState: "paused",
        },
        "&[data-motion='reduced'] .nightcurrent-animated": {
          animation: "none !important",
        },
        "&[data-motion='reduced'] .nightcurrent-intro": {
          animation: "none !important",
          opacity: 1,
          transform: "none",
        },
        "@keyframes nightcurrent-camera": {
          from: { opacity: 0, transform: "scale(1.06)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        "@keyframes nightcurrent-wave": {
          from: { transform: "translateX(-3%)" },
          to: { transform: "translateX(3%)" },
        },
        "@keyframes nightcurrent-twinkle-subtle": {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.4)" },
        },
        "@keyframes nightcurrent-twinkle-pulse": {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.8)" },
        },
        "@keyframes nightcurrent-light-drift": {
          "0%, 100%": {
            opacity: 0.15,
            transform: "translate3d(0, 12px, 0) scale(0.88)",
          },
          "45%": {
            opacity: 0.9,
            transform: "translate3d(10px, -22px, 0) scale(1)",
          },
          "75%": {
            opacity: 0.38,
            transform: "translate3d(-5px, -44px, 0) scale(0.94)",
          },
        },
        "@keyframes nightcurrent-station-intro": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "@keyframes nightcurrent-ui-intro": {
          from: { opacity: 0, transform: "translate3d(0, 18px, 0)" },
          to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
      }}
    >
      <Box
        ref={sceneRef}
        className="nightcurrent-camera nightcurrent-animated"
        sx={{
          inset: 0,
          position: "absolute",
          animation:
            "nightcurrent-camera 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
          "[data-motion='reduced'] &": { animation: "none" },
          "[data-visible='false'] &": { animationPlayState: "paused" },
        }}
      >
        <Layer id="sky" sx={{ bgcolor: "#173343" }}>
          <Box
            sx={{
              background:
                "linear-gradient(180deg, #112536 0%, #315d6c 52%, #89a39d 100%)",
              inset: 0,
              position: "absolute",
            }}
          />
          <Box
            sx={{
              height: { xs: 220, md: 370 },
              position: "absolute",
              right: "calc(17% - 50px)",
              top: "calc(15% - 50px)",
              width: { xs: 220, md: 370 },
              zIndex: 2,
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                background:
                  "radial-gradient(circle, rgba(243,214,162,0.2) 0%, rgba(243,214,162,0.08) 38%, transparent 72%)",
                inset: 0,
                position: "absolute",
              }}
            />
            <Box
              aria-label="Moon"
              role="img"
              sx={{
                bgcolor: "#f3d6a2",
                borderRadius: "50%",
                height: { xs: 100, md: 170 },
                left: "50%",
                position: "absolute",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: 100, md: 170 },
              }}
            />
          </Box>
        </Layer>
        <Layer id="star-far">
          <StarLayer stars={starsFar} />
        </Layer>
        <Layer id="star-mid">
          <StarLayer stars={starsMid} />
        </Layer>
        <Layer id="star-near">
          <StarLayer stars={starsNear} />
        </Layer>
        <Layer id="ocean">
          <Box
            sx={{
              bgcolor: "#4d8490",
              bottom: 0,
              position: "absolute",
              top: "49%",
            }}
          />
          {["54%", "58%", "63%", "70%", "78%"].map((top, index) => (
            <Box
              key={top}
              className="nightcurrent-animated"
              sx={{
                animation: `nightcurrent-wave ${12 + index * 2}s ${index}s ease-in-out infinite alternate`,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(221,239,220,0.16) 35%, rgba(221,239,220,0.08) 65%, transparent 100%)",
                height: 2,
                left: "-4%",
                position: "absolute",
                top,
                width: "108%",
              }}
            />
          ))}
        </Layer>
        <Layer id="island">
          <Box
            sx={{
              bgcolor: "#37636b",
              clipPath:
                "polygon(0 75%, 16% 44%, 29% 63%, 46% 32%, 61% 60%, 78% 42%, 100% 67%, 100% 100%, 0 100%)",
              bottom: "48%",
              position: "absolute",
              top: "34%",
            }}
          />
        </Layer>
        <Layer
          id="cliffs"
          sx={{ "& > *:not(.nightcurrent-artwork)": { display: "none" } }}
        >
          <Box
            className="nightcurrent-artwork"
            component="img"
            src="/images/nightcurrent/hero/cliffs-shoreline.png"
            alt=""
            aria-hidden="true"
            sx={{
              bottom: 0,
              height: "76%",
              left: 0,
              objectFit: "contain",
              objectPosition: "bottom left",
              position: "absolute",
              width: "100%",
            }}
          />
          <Box
            sx={{
              bgcolor: "#244b50",
              clipPath:
                "polygon(0 47%, 12% 30%, 24% 43%, 38% 18%, 52% 49%, 69% 27%, 84% 45%, 100% 20%, 100% 100%, 0 100%)",
              bottom: "22%",
              position: "absolute",
              top: "45%",
            }}
          />
          <Box
            sx={{
              background:
                "linear-gradient(180deg, rgba(108,142,131,0.5), transparent 38%)",
              bottom: "22%",
              position: "absolute",
              top: "45%",
            }}
          />
        </Layer>
        <Layer
          id="station"
          className="nightcurrent-animated nightcurrent-station-intro"
          sx={{
            "& > *:not(.nightcurrent-artwork)": { display: "none" },
            animation: "nightcurrent-station-intro 700ms 350ms both",
          }}
        >
          <Box
            className="nightcurrent-artwork"
            component="img"
            src="/images/nightcurrent/hero/station.png"
            alt=""
            aria-hidden="true"
            sx={{
              height: "68%",
              left: "44%",
              objectFit: "contain",
              objectPosition: "bottom center",
              position: "absolute",
              top: "18%",
              width: "52%",
            }}
          />
          <Box
            sx={{
              bgcolor: "#172d32",
              bottom: "24%",
              height: 105,
              left: "61%",
              position: "absolute",
              transform: "skewY(-7deg)",
              width: 155,
            }}
          />
          <Box
            sx={{
              bgcolor: "#b9c7b0",
              bottom: "42%",
              height: 12,
              left: "59%",
              position: "absolute",
              width: 170,
            }}
          />
          <Box
            sx={{
              bgcolor: "#e8aa71",
              borderRadius: "50%",
              bottom: "47%",
              boxShadow: "0 0 30px 10px rgba(232,170,113,0.42)",
              height: 10,
              left: "65%",
              position: "absolute",
              width: 10,
            }}
          />
          <Box
            sx={{
              border: "2px solid #162a32",
              borderBottom: 0,
              borderRadius: "50% 50% 0 0",
              bottom: "58%",
              height: 48,
              left: "67%",
              position: "absolute",
              width: 78,
            }}
          />
          <Box
            sx={{
              bgcolor: "#162a32",
              bottom: 0,
              height: "43%",
              left: "65%",
              position: "absolute",
              transform: "rotate(8deg)",
              width: 10,
            }}
          />
          <Box
            sx={{
              bgcolor: "#162a32",
              bottom: 0,
              height: "43%",
              left: "76%",
              position: "absolute",
              transform: "rotate(-8deg)",
              width: 10,
            }}
          />
          <Box
            sx={{
              bgcolor: "#162a32",
              bottom: "66%",
              height: 90,
              left: "76%",
              position: "absolute",
              transform: "rotate(18deg)",
              width: 4,
            }}
          />
          <Box
            sx={{
              bgcolor: "#202f32",
              border: "1px solid rgba(232,170,113,0.35)",
              bottom: "43%",
              height: 30,
              left: "63%",
              position: "absolute",
              width: 78,
            }}
          />
          <Box
            sx={{
              bgcolor: "#89a99c",
              bottom: "45%",
              height: 5,
              left: "66%",
              opacity: 0.7,
              position: "absolute",
              width: 12,
            }}
          />
          <Box
            sx={{
              bgcolor: "#172d32",
              bottom: "25%",
              height: 3,
              left: "57%",
              position: "absolute",
              transform: "rotate(-7deg)",
              width: 70,
            }}
          />
          <Box
            sx={{
              bgcolor: "#172d32",
              bottom: "25%",
              height: 3,
              left: "76%",
              position: "absolute",
              transform: "rotate(7deg)",
              width: 52,
            }}
          />
        </Layer>
        <Layer id="shoreline">
          <Box
            sx={{
              bgcolor: "#9b997d",
              clipPath:
                "polygon(0 25%, 18% 18%, 34% 29%, 50% 14%, 70% 28%, 88% 19%, 100% 25%, 100% 100%, 0 100%)",
              bottom: 0,
              position: "absolute",
              top: "67%",
            }}
          />
          <Box
            sx={{
              bgcolor: "rgba(82,143,145,0.66)",
              borderRadius: "50%",
              bottom: "12%",
              height: 24,
              left: "25%",
              position: "absolute",
              width: 76,
            }}
          />
          <Box
            sx={{
              bgcolor: "rgba(82,143,145,0.52)",
              borderRadius: "50%",
              bottom: "18%",
              height: 15,
              left: "43%",
              position: "absolute",
              width: 48,
            }}
          />
        </Layer>
        <Layer id="midground">
          <Box
            sx={{
              bgcolor: "#16383b",
              clipPath:
                "polygon(0 40%, 18% 25%, 34% 48%, 52% 22%, 71% 44%, 87% 27%, 100% 43%, 100% 100%, 0 100%)",
              bottom: 0,
              position: "absolute",
              top: "64%",
            }}
          />
          {["19%", "27%", "82%", "88%"].map((left) => (
            <Box
              key={left}
              sx={{
                bgcolor: "#96b58f",
                bottom: "24%",
                height: 100,
                left,
                position: "absolute",
                transform: "rotate(18deg)",
                width: 3,
              }}
            />
          ))}
        </Layer>
        <Layer
          id="foreground"
          sx={{ "& > *:not(.nightcurrent-artwork)": { display: "none" } }}
        >
          <Box
            className="nightcurrent-artwork"
            component="img"
            src="/images/nightcurrent/hero/foreground-vegetation.png"
            alt=""
            aria-hidden="true"
            sx={{
              bottom: "-8%",
              height: "76%",
              left: 0,
              maskImage:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 13%, #000 30%)",
              objectFit: "cover",
              objectPosition: "center bottom",
              position: "absolute",
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 13%, #000 30%)",
              width: "100%",
            }}
          />
          <Box
            sx={{
              bgcolor: "#081b24",
              clipPath:
                "polygon(0 37%, 14% 11%, 26% 31%, 43% 8%, 58% 35%, 77% 14%, 100% 33%, 100% 100%, 0 100%)",
              bottom: 0,
              position: "absolute",
              top: "74%",
            }}
          />
          {["8%", "13%", "31%", "47%", "84%", "92%"].map((left, index) => (
            <Box
              key={left}
              sx={{
                bgcolor: "#0b252c",
                bottom: 0,
                clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                height: 120 + index * 12,
                left,
                position: "absolute",
                transform: `rotate(${index % 2 ? -8 : 8}deg)`,
                width: 70,
              }}
            />
          ))}
        </Layer>
        <Layer id="lights">
          {FLOATING_LIGHTS.map(([left, top, size, delay, duration]) => (
            <Box
              key={`${left}-${top}`}
              className="nightcurrent-animated"
              sx={{
                animation: `nightcurrent-light-drift ${duration}s ${delay}s ease-in-out infinite`,
                bgcolor: "#f8fff4",
                borderRadius: "50%",
                boxShadow: "0 0 12px 2px rgba(235,255,239,0.36)",
                height: size,
                left: `${left}%`,
                opacity: 0.15,
                position: "absolute",
                top: `${top}%`,
                width: size,
              }}
            />
          ))}
        </Layer>
        <Layer id="ui" sx={{ pointerEvents: "auto" }}>
          <Container
            maxWidth="lg"
            sx={{ height: "100%", pointerEvents: "none", position: "relative" }}
          >
            <Box
              sx={{
                maxWidth: 680,
                pointerEvents: "auto",
                pt: { xs: 12, md: 16 },
                position: "relative",
              }}
            >
              <Chip
                label="AN ORIGINAL ARCHIVE STUDY"
                sx={{
                  bgcolor: "rgba(232,170,113,0.14)",
                  color: "#f4c38d",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  mb: 3,
                }}
              />
              <Typography
                id="nightcurrent-title"
                className="nightcurrent-intro"
                component="h1"
                sx={{
                  animation: "nightcurrent-ui-intro 700ms 700ms both",
                  color: "#fff4df",
                  fontFamily: "Georgia, serif",
                  fontSize: { xs: "4.4rem", sm: "6.5rem", md: "8.3rem" },
                  fontWeight: 400,
                  letterSpacing: "-0.07em",
                  lineHeight: 0.8,
                }}
              >
                night
                <br />
                <Box component="span" sx={{ color: "#e8aa71" }}>
                  current
                </Box>
              </Typography>
              <Typography
                className="nightcurrent-intro"
                sx={{
                  animation: "nightcurrent-ui-intro 700ms 900ms both",
                  color: "#c1d0d1",
                  fontSize: { xs: "1.05rem", md: "1.3rem" },
                  lineHeight: 1.6,
                  maxWidth: 480,
                  mt: 4,
                }}
              >
                The island remembers what the sea takes. Follow the signal
                beyond the last weather line.
              </Typography>
              <Box
                className="nightcurrent-intro"
                sx={{
                  animation: "nightcurrent-ui-intro 700ms 1100ms both",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 4,
                }}
              >
                <Button
                  href="#world"
                  variant="contained"
                  endIcon={<ArrowDownwardRoundedIcon />}
                  sx={{
                    bgcolor: "#e8aa71",
                    color: "#17232b",
                    px: 2.5,
                    "&:hover": { bgcolor: "#f3bf89" },
                  }}
                >
                  Enter Tideglass
                </Button>
                <Button
                  href="#recovery"
                  variant="text"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  sx={{ color: "#f4efe5" }}
                >
                  Read the study
                </Button>
              </Box>
            </Box>
          </Container>
        </Layer>
      </Box>
      <Typography
        sx={{
          bottom: 28,
          color: "#91a9ac",
          fontSize: "0.65rem",
          left: { xs: 24, md: 48 },
          letterSpacing: "0.16em",
          position: "absolute",
          textTransform: "uppercase",
          zIndex: 4,
        }}
      >
        Tideglass Island · 47° 18′ N
      </Typography>
      {debug && (
        <Box
          sx={{
            bgcolor: "rgba(5,12,17,0.9)",
            border: "1px solid rgba(232,170,113,0.4)",
            color: "#f4efe5",
            fontFamily: "monospace",
            fontSize: 11,
            left: 16,
            p: 1.5,
            position: "absolute",
            top: 80,
            zIndex: 6,
          }}
        >
          <Typography
            sx={{
              color: "#e8aa71",
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: 800,
              mb: 0.5,
            }}
          >
            PARALLAX DEBUG
          </Typography>
          {PARALLAX_LAYERS.map(([id, label, depth]) => (
            <Box key={id}>
              {label.padEnd(17, " ")} depth {depth.toFixed(2)}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
