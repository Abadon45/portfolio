import type { ProjectStatus } from "../../data/portfolio";
import { Chip } from "@mui/material";

export function ProjectStatusLabel({ status }: { status: ProjectStatus }) {
  return (
    <Chip
      label={status}
      size="small"
      variant="outlined"
      sx={{
        borderColor: "divider",
        borderRadius: 1,
        color: "text.secondary",
        fontWeight: 650,
        mb: 1,
      }}
    />
  );
}
