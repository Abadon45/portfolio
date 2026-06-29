import type { ReactNode } from "react";
import { Typography } from "@mui/material";

type EyebrowProps = {
  children: ReactNode;
  color?: string;
};

export function Eyebrow({ children, color = "secondary.main" }: EyebrowProps) {
  return (
    <Typography
      component="p"
      sx={{
        color,
        fontSize: "0.78rem",
        fontWeight: 850,
        letterSpacing: "0.08em",
        mb: 1,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Typography>
  );
}
