"use client";

import { useEffect, useRef } from "react";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import NorthRoundedIcon from "@mui/icons-material/NorthRounded";
import { Box, Button, Stack, Typography } from "@mui/material";

const navigation = [
  ["World", "world"],
  ["Story", "story"],
  ["Recovery notes", "recovery"],
] as const;

export function NightcurrentHero() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runway = runwayRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;

    if (!runway || !stage || !scene) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const desktopQuery = window.matchMedia("(min-width: 900px)");
    const layers = Array.from(
      scene.querySelectorAll<HTMLElement>("[data-parallax-layer]"),
    );
    const target = { pointerX: 0, pointerY: 0, scrollY: 0 };
    const current = { pointerX: 0, pointerY: 0, scrollY: 0 };
    let frameId: number | null = null;
    let active = false;
    let visible = false;

    const clamp = (value: number) => Math.max(0, Math.min(1, value));

    const animate = () => {
      frameId = null;
      if (!active || reducedMotionQuery.matches) return;

      current.pointerX += (target.pointerX - current.pointerX) * 0.09;
      current.pointerY += (target.pointerY - current.pointerY) * 0.09;
      current.scrollY += (target.scrollY - current.scrollY) * 0.09;

      let isMoving = false;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth ?? 0);
        const offsetX = current.pointerX * depth;
        const offsetY = (current.pointerY + current.scrollY) * depth;
        const scale = 1 + depth * 0.035;

        layer.style.transform =
          `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0) ` +
          `scale(${scale.toFixed(3)})`;

        if (
          Math.abs(target.pointerX - current.pointerX) > 0.1 ||
          Math.abs(target.pointerY - current.pointerY) > 0.1 ||
          Math.abs(target.scrollY - current.scrollY) > 0.1
        ) {
          isMoving = true;
        }
      });

      if (isMoving) frameId = window.requestAnimationFrame(animate);
    };

    const scheduleAnimation = () => {
      if (frameId === null && active && !reducedMotionQuery.matches) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const updateScrollTarget = () => {
      if (desktopQuery.matches) {
        const scrollDistance = runway.offsetHeight - stage.offsetHeight;
        const progress =
          scrollDistance > 0
            ? clamp(-runway.getBoundingClientRect().top / scrollDistance)
            : 0;
        target.scrollY = -260 * progress;
      } else {
        const bounds = runway.getBoundingClientRect();
        const travel = bounds.height + window.innerHeight;
        const progress = clamp((window.innerHeight - bounds.top) / travel);
        target.scrollY = (0.5 - progress) * 135;
      }

      scheduleAnimation();
    };

    const updatePointerTarget = (event: PointerEvent) => {
      if (!finePointerQuery.matches) return;

      const bounds = scene.getBoundingClientRect();
      const pointerIsInsideScene =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!pointerIsInsideScene) {
        target.pointerX = 0;
        target.pointerY = 0;
        scheduleAnimation();
        return;
      }

      const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

      target.pointerX = Math.max(-1, Math.min(1, pointerX)) * 54;
      target.pointerY = Math.max(-1, Math.min(1, pointerY)) * 36;
      scheduleAnimation();
    };

    const clearPointerTarget = () => {
      target.pointerX = 0;
      target.pointerY = 0;
      scheduleAnimation();
    };

    const start = () => {
      if (active || reducedMotionQuery.matches) return;
      active = true;
      layers.forEach((layer) => {
        layer.style.willChange = "transform";
      });
      updateScrollTarget();
      window.addEventListener("scroll", updateScrollTarget, { passive: true });
      window.addEventListener("resize", updateScrollTarget, { passive: true });
      if (finePointerQuery.matches) {
        window.addEventListener("pointermove", updatePointerTarget, {
          passive: true,
        });
        scene.addEventListener("pointerleave", clearPointerTarget);
      }
    };

    const stop = () => {
      active = false;
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", updateScrollTarget);
      window.removeEventListener("pointermove", updatePointerTarget);
      scene.removeEventListener("pointerleave", clearPointerTarget);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      target.pointerX = 0;
      target.pointerY = 0;
      target.scrollY = 0;
      layers.forEach((layer) => {
        layer.style.transform = "";
        layer.style.willChange = "auto";
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 },
    );

    const handleMotionPreference = () => {
      if (reducedMotionQuery.matches) stop();
      else if (visible) start();
    };

    observer.observe(runway);
    reducedMotionQuery.addEventListener("change", handleMotionPreference);

    return () => {
      stop();
      observer.disconnect();
      reducedMotionQuery.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <Box
      ref={runwayRef}
      component="section"
      aria-labelledby="nightcurrent-title"
      sx={{
        bgcolor: "#0d1b23",
        height: { xs: "auto", md: "145svh" },
        position: "relative",
        "@media (prefers-reduced-motion: reduce)": {
          height: "auto",
        },
      }}
    >
      <Box
        ref={stageRef}
        data-parallax-stage
        sx={{
          color: "#f5efdf",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1.55fr) minmax(360px, 0.9fr)",
          },
          height: { xs: "auto", md: "100svh" },
          minHeight: { xs: "auto", md: "100svh" },
          overflow: "hidden",
          position: { xs: "relative", md: "sticky" },
          top: 0,
          "@media (prefers-reduced-motion: reduce)": {
            height: "auto",
            position: "relative",
          },
        }}
      >
        <Box
          component="header"
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            left: 0,
            px: { xs: 2.5, sm: 4, lg: 6 },
            py: { xs: 2.5, md: 3.5 },
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 2,
          }}
        >
          <Box
            component="a"
            href="#nightcurrent-title"
            aria-label="Nightcurrent home"
            sx={{
              alignItems: "center",
              color: "inherit",
              display: "inline-flex",
              gap: 1.25,
              textDecoration: "none",
              "&:focus-visible": {
                borderRadius: 1,
                outline: "2px solid #f3b46f",
                outlineOffset: 5,
              },
            }}
          >
            <NorthRoundedIcon sx={{ color: "#f3b46f", fontSize: 21 }} />
            <Typography
              component="span"
              sx={{
                fontSize: "0.73rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
              }}
            >
              NIGHTCURRENT
            </Typography>
          </Box>

          <Stack
            component="nav"
            aria-label="Nightcurrent sections"
            direction="row"
            spacing={{ xs: 1.6, sm: 3 }}
            sx={{
              display: { xs: "none", sm: "flex" },
              "& a": {
                borderBottom: "1px solid transparent",
                color: "#f5efdf",
                fontFamily: "Georgia, serif",
                fontSize: "0.92rem",
                pb: 0.45,
                textDecoration: "none",
                transition: "border-color 160ms ease, color 160ms ease",
                "&:hover": {
                  borderColor: "#f3b46f",
                  color: "#f3b46f",
                },
                "&:focus-visible": {
                  borderRadius: 0.5,
                  outline: "2px solid #f3b46f",
                  outlineOffset: 4,
                },
              },
            }}
          >
            {navigation.map(([label, id]) => (
              <Box component="a" href={`#${id}`} key={id}>
                {label}
              </Box>
            ))}
          </Stack>
        </Box>

        <Box
          ref={sceneRef}
          sx={{
            isolation: "isolate",
            minHeight: { xs: "42svh", sm: 500, md: 640 },
            overflow: "hidden",
            position: "relative",
            "&::after": {
              background: {
                xs: "linear-gradient(180deg, rgba(8,20,27,0.58) 0%, transparent 35%, " +
                  "rgba(8,20,27,0.12) 100%)",
                md: "linear-gradient(180deg, rgba(8,20,27,0.44) 0%, transparent 22%, " +
                  "transparent 72%, rgba(8,20,27,0.12) 100%)",
              },
              content: '""',
              inset: 0,
              pointerEvents: "none",
              position: "absolute",
              zIndex: 3,
            },
          }}
        >
          <Box
            component="img"
            data-parallax-layer
            data-depth="0.06"
            src="/images/nightcurrent/parallax/sea-and-sky.webp"
            alt="Moonlit waves and distant islands beyond the Tideglass coast."
            fetchPriority="high"
            sx={{
              height: "112%",
              left: "-6%",
              objectFit: "cover",
              objectPosition: { xs: "62% center", md: "59% center" },
              position: "absolute",
              top: "-6%",
              width: "112%",
              zIndex: 0,
            }}
          />
          <Box
            component="img"
            data-parallax-layer
            data-depth="0.34"
            src="/images/nightcurrent/parallax/station-headland.webp"
            alt=""
            aria-hidden="true"
            sx={{
              height: "132%",
              left: "-16%",
              objectFit: "contain",
              objectPosition: "right bottom",
              position: "absolute",
              top: "-16%",
              width: "132%",
              zIndex: 1,
            }}
          />
          <Box
            component="img"
            data-parallax-layer
            data-depth="0.62"
            src="/images/nightcurrent/parallax/nearshore-foreground.webp"
            alt=""
            aria-hidden="true"
            sx={{
              height: "132%",
              left: "-16%",
              objectFit: "contain",
              objectPosition: "center bottom",
              position: "absolute",
              top: "-16%",
              width: "132%",
              zIndex: 2,
            }}
          />
          <Box
            sx={{
              alignItems: "flex-end",
              bottom: { xs: 2.5, md: 4 },
              color: "#f5efdf",
              display: "flex",
              justifyContent: "space-between",
              left: { xs: 2.5, sm: 4, md: 88, lg: 88 },
              pointerEvents: "none",
              position: "absolute",
              right: { xs: 2.5, sm: 4, lg: 6 },
              zIndex: 4,
            }}
          >
            <Typography
              sx={{ fontSize: "0.62rem", letterSpacing: "0.16em", opacity: 0.8 }}
            >
              TIDEGLASS ISLAND
            </Typography>
            <Typography
              sx={{ fontSize: "0.62rem", letterSpacing: "0.16em", opacity: 0.8 }}
            >
              STATION 04
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={0.5}
            aria-hidden="true"
            sx={{
              alignItems: "center",
              bottom: { xs: 2.5, md: 4 },
              color: "#f5efdf",
              display: "flex",
              left: "50%",
              opacity: 0.84,
              pointerEvents: "none",
              position: "absolute",
              transform: "translateX(-50%)",
              zIndex: 4,
            }}
          >
            <ArrowDownwardRoundedIcon sx={{ fontSize: 13 }} />
            <Typography sx={{ fontSize: "0.58rem", letterSpacing: "0.14em" }}>
              SCROLL TO EXPLORE
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            alignItems: "center",
            bgcolor: "#0d1b23",
            display: "flex",
            minHeight: { xs: 430, md: 640 },
            px: { xs: 3, sm: 5, lg: 7 },
            py: { xs: 4, md: 12 },
            position: "relative",
            "&::after": {
              background: "linear-gradient(0deg, rgba(17,39,47,0.46), transparent 60%)",
              bottom: 0,
              content: '""',
              height: 180,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              width: "100%",
            },
          }}
        >
          <Box sx={{ maxWidth: 520, position: "relative", width: "100%", zIndex: 1 }}>
            <Typography
              sx={{
                color: "#f3b46f",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.19em",
                mb: 2,
              }}
            >
              AN ORIGINAL NARRATIVE EXPLORATION
            </Typography>
            <Typography
              id="nightcurrent-title"
              component="h1"
              sx={{
                color: "#f5efdf",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: { xs: "clamp(4.4rem, 17vw, 6rem)", md: "clamp(4.8rem, 7vw, 7.2rem)" },
                fontWeight: 400,
                letterSpacing: "-0.075em",
                lineHeight: 0.78,
              }}
            >
              Night
              <Box component="span" sx={{ color: "#f3b46f", display: "block" }}>
                current
              </Box>
            </Typography>
            <Typography sx={{
              color: "#c8d2cb",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: { xs: "1.12rem", md: "1.22rem" },
              lineHeight: 1.65,
              maxWidth: 450,
              mt: { xs: 2, md: 3.5 },
            }}>
              The island remembers what the sea takes. Follow the signal beyond
              the last weather line.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 2.5 }}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
                mt: { xs: 2.5, md: 4 },
              }}
            >
              <Button
                href="#world"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  bgcolor: "#f3b46f",
                  borderRadius: 0.5,
                  color: "#14252b",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.94rem",
                  fontWeight: 700,
                  justifyContent: "space-between",
                  minHeight: 52,
                  minWidth: { xs: "100%", sm: 200 },
                  px: 2.5,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#ffd08e" },
                  "&:focus-visible": {
                    outline: "2px solid #f5efdf",
                    outlineOffset: 3,
                  },
                }}
              >
                Enter Tideglass
              </Button>
              <Button
                href="#story"
                endIcon={<ArrowDownwardRoundedIcon />}
                sx={{
                  alignSelf: { xs: "flex-start", sm: "auto" },
                  borderRadius: 0,
                  color: "#f5efdf",
                  fontFamily: "Georgia, serif",
                  minHeight: 48,
                  px: 0.5,
                  textDecoration: "underline",
                  textDecorationColor: "rgba(245,239,223,0.55)",
                  textUnderlineOffset: 5,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "#f3b46f",
                    textDecorationColor: "#f3b46f",
                  },
                  "&:focus-visible": {
                    outline: "2px solid #f3b46f",
                    outlineOffset: 3,
                  },
                }}
              >
                Meet Mara
              </Button>
            </Stack>

            <Box
              sx={{
                borderTop: "1px solid rgba(245,239,223,0.2)",
                display: { xs: "none", md: "grid" },
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mt: { xs: 3.5, md: 8 },
                pt: 2,
              }}
            >
              <Box>
              <Typography
                sx={{
                  color: "#f3b46f",
                  fontSize: "0.62rem",
                  letterSpacing: "0.16em",
                }}
              >
                  FIELD NOTES
                </Typography>
              <Typography
                sx={{ color: "#c8d2cb", fontSize: "0.82rem", mt: 0.6 }}
              >
                  Three places. One signal.
                </Typography>
              </Box>
              <Box>
              <Typography
                sx={{
                  color: "#f3b46f",
                  fontSize: "0.62rem",
                  letterSpacing: "0.16em",
                }}
              >
                  FIRST CONTACT
                </Typography>
              <Typography
                sx={{ color: "#c8d2cb", fontSize: "0.82rem", mt: 0.6 }}
              >
                  After the station wakes.
                </Typography>
              </Box>
            </Box>
          </Box>
      </Box>
      </Box>
    </Box>
  );
}
