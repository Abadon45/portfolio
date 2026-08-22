"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import type { PortfolioUser } from "../../../lib/portfolioAuth";
import { ParticleNetworkBackground } from "../../components/portfolio/ParticleNetworkBackground";

type UserType = "regular_user" | "public_school_teacher";

export default function ProfileSetupClient({
  callbackUrl,
  user,
}: {
  callbackUrl: string;
  user: PortfolioUser;
}) {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("regular_user");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function completeSetup() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/profile/setup", {
        body: JSON.stringify({ userType }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(data.message ?? "Unable to save setup.");
      router.replace(callbackUrl);
      router.refresh();
    } catch (setupError) {
      setError(
        setupError instanceof Error
          ? setupError.message
          : "Unable to save your setup.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        bgcolor: "#050b16",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        overflow: "hidden",
        p: { xs: 2, sm: 4 },
        position: "relative",
      }}
    >
      <ParticleNetworkBackground />
      <Card
        sx={{ maxWidth: 640, position: "relative", width: "100%", zIndex: 1 }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography color="primary.main" variant="overline">
                Welcome, {user.firstName ?? user.displayName}
              </Typography>
              <Typography component="h1" variant="h4">
                How will you use this platform?
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Choose the workspace that best fits your current needs. You can
                continue to your profile after setup.
              </Typography>
            </Box>
            {error && <Typography color="error.main">{error}</Typography>}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <SetupChoice
                description="General personal use and access to the platform."
                icon={<PersonRoundedIcon />}
                label="Regular user"
                onClick={() => setUserType("regular_user")}
                selected={userType === "regular_user"}
              />
              <SetupChoice
                description="Teaching-focused tools and resources for public school teachers."
                icon={<SchoolRoundedIcon />}
                label="Public school teacher"
                onClick={() => setUserType("public_school_teacher")}
                selected={userType === "public_school_teacher"}
              />
            </Stack>
            <Button
              disabled={pending}
              onClick={completeSetup}
              startIcon={pending ? <CircularProgress size={18} /> : undefined}
              variant="contained"
            >
              {pending ? "Saving setup…" : "Continue to profile"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function SetupChoice({
  description,
  icon,
  label,
  onClick,
  selected,
}: {
  description: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <Button
      fullWidth
      onClick={onClick}
      sx={{
        alignItems: "flex-start",
        borderColor: selected ? "primary.main" : "divider",
        justifyContent: "flex-start",
        minHeight: 150,
        p: 2,
        textAlign: "left",
        textTransform: "none",
      }}
      variant={selected ? "contained" : "outlined"}
    >
      <Stack spacing={1}>
        {icon}
        <Typography sx={{ fontWeight: 800 }}>{label}</Typography>
        <Typography sx={{ fontSize: 13, opacity: 0.82 }}>
          {description}
        </Typography>
      </Stack>
    </Button>
  );
}
