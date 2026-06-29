import type { SxProps, Theme } from "@mui/material";
import type { Variants } from "framer-motion";

export const cardSx: SxProps<Theme> = {
  border: 1,
  borderColor: "divider",
  boxShadow: "0 10px 40px rgba(23, 32, 51, 0.05)",
  transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
  "&:hover": {
    borderColor: "primary.main",
    transform: "translateY(-5px)",
    boxShadow: "0 16px 50px rgba(23, 32, 51, 0.08)",
  },
};

export const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.09,
    },
  },
};

export const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const listItemVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};
