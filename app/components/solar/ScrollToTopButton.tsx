"use client";

import { useEffect, useState } from "react";
import { Fab, Zoom } from "@mui/material";

const SHOW_AFTER = 520;

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > SHOW_AFTER);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Zoom in={visible} unmountOnExit>
      <Fab
        color="primary"
        size="medium"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        sx={{
          position: "fixed",
          right: { xs: 16, sm: 24 },
          bottom: { xs: 16, sm: 24 },
          zIndex: (theme) => theme.zIndex.fab,
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        ↑
      </Fab>
    </Zoom>
  );
}
