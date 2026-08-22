"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

export default function TeacherLoungeClient({
  teacherName,
}: {
  teacherName: string;
}) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          color="primary.main"
          sx={{ fontWeight: 800, letterSpacing: "0.08em" }}
          variant="overline"
        >
          TEACHER WORKSPACE
        </Typography>
        <Typography component="h1" sx={{ fontWeight: 850 }} variant="h3">
          Teacher&apos;s Lounge
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
          Welcome, {teacherName}. A focused workspace for planning, organizing,
          and supporting your teaching work.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        }}
      >
        <ToolCard
          description="Create and manage schedules that belong to your teacher account."
          href="/dashboard/teachers-lounge/schedule"
          icon={<CalendarMonthRoundedIcon />}
          title="Schedule Creator"
        />
        <ToolCard
          description="A foundation for organizing SNED-related learning materials and resources."
          href="/dashboard/teachers-lounge/sned"
          icon={<MenuBookRoundedIcon />}
          title="SNED Learning"
        />
      </Box>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontWeight: 800 }} variant="h6">
            Your workspace
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Teacher-specific data is private to your account. More tools can be
            added here after real teacher testing and feedback.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}

function ToolCard({
  description,
  href,
  icon,
  title,
}: {
  description: string;
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: { xs: 2.5, sm: 3 },
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "action.selected",
            borderRadius: 1,
            color: "primary.main",
            display: "flex",
            height: 44,
            justifyContent: "center",
            width: 44,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontWeight: 800, mt: 2 }} variant="h6">
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          {description}
        </Typography>
        <Button
          component={Link}
          href={href}
          sx={{ alignSelf: "flex-start", mt: 2 }}
          variant="contained"
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
}
