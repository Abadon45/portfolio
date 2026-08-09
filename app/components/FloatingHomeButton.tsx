"use client";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Fab, Tooltip } from "@mui/material";
import Link from "next/link";

type FloatingHomeButtonProps = {
  href?: string;
  label?: string;
};

/** Reusable floating navigation control for standalone template pages. */
export function FloatingHomeButton({
  href = "/",
  label = "Back to portfolio home",
}: FloatingHomeButtonProps) {
  return (
    <Tooltip title={label} placement="right">
      <Fab
        aria-label={label}
        color="primary"
        component={Link}
        href={href}
        size="medium"
        sx={{
          position: "fixed",
          left: { xs: 16, sm: 24 },
          bottom: { xs: 16, sm: 24 },
          zIndex: (theme) => theme.zIndex.fab,
        }}
      >
        <HomeRoundedIcon fontSize="small" />
      </Fab>
    </Tooltip>
  );
}
