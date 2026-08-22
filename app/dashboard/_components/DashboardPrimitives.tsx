import {
  Alert,
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  actionHref,
  actionLabel,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
}) {
  const headerAction = actionHref ? (
    <Box
      component="a"
      href={actionHref}
      sx={{
        alignItems: "center",
        display: "inline-flex",
        gap: 1,
        textDecoration: "none",
      }}
    >
      <ArrowBackRoundedIcon fontSize="small" />
      {actionLabel}
    </Box>
  ) : (
    action
  );

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        alignItems: { sm: "flex-end" },
        justifyContent: "space-between",
        mb: 4,
      }}
    >
      <Box>
        {eyebrow && (
          <Typography
            color="primary.main"
            sx={{ fontWeight: 800, letterSpacing: "0.08em" }}
            variant="overline"
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          component="h1"
          sx={{ fontWeight: 850, textWrap: "balance" }}
          variant="h3"
        >
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 700 }}>
            {description}
          </Typography>
        )}
      </Box>
      {headerAction}
    </Stack>
  );
}

export function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between" }}
        >
          <Box>
            <Typography color="text.secondary" variant="body2">
              {label}
            </Typography>
            <Typography sx={{ mt: 1, fontWeight: 850 }} variant="h4">
              {value}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 0.75 }}
              variant="body2"
            >
              {detail}
            </Typography>
          </Box>
          <Box
            sx={{
              alignItems: "center",
              bgcolor: "action.selected",
              borderRadius: 1,
              color: "primary.main",
              display: "flex",
              height: 42,
              justifyContent: "center",
              width: 42,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: { xs: 3, sm: 4 },
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontWeight: 800 }} variant="h6">
        {title}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mt: 1, mx: "auto", maxWidth: 440 }}
      >
        {description}
      </Typography>
    </Box>
  );
}

export function ErrorState({ message }: { message: string }) {
  return <Alert severity="error">{message}</Alert>;
}

export function CardSkeleton() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Skeleton height={20} width="42%" />
        <Skeleton height={44} width="55%" />
        <Skeleton height={20} width="70%" />
      </CardContent>
    </Card>
  );
}
