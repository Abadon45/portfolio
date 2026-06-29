import { Box, Typography } from "@mui/material";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
};

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <Box
      sx={{
        alignItems: "end",
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.72fr) minmax(260px, 1fr)" },
        mb: 3,
      }}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Typography component="h2" variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.7rem", lg: "3rem" } }}>
        {title}
      </Typography>
    </Box>
  );
}
