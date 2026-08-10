"use client";

import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { Fab, Zoom, type FabProps, type SxProps, type Theme } from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";

export type ScrollToTopButtonProps = {
  threshold?: number;
  label?: string;
  icon?: ReactNode;
  color?: FabProps["color"];
  size?: FabProps["size"];
  sx?: SxProps<Theme>;
};

export default function ScrollToTopButton({
  threshold = 520,
  label = "Scroll to top",
  icon = <KeyboardArrowUpRoundedIcon />,
  color = "primary",
  size = "medium",
  sx,
}: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > threshold);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [threshold]);

  return (
    <Zoom in={visible} unmountOnExit>
      <Fab
        aria-label={label}
        color={color}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        size={size}
        sx={{
          bottom: { xs: 16, sm: 24 },
          position: "fixed",
          right: { xs: 16, sm: 24 },
          zIndex: (theme) => theme.zIndex.fab,
          ...sx,
        }}
      >
        {icon}
      </Fab>
    </Zoom>
  );
}
