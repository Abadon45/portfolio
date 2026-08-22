"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { FloatingHomeButton } from "../components/FloatingHomeButton";
import { ParticleNetworkBackground } from "../components/portfolio/ParticleNetworkBackground";

type LoginClientProps = {
  authError?: string;
  callbackUrl: string;
};

export default function LoginClient({ authError, callbackUrl }: LoginClientProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "verify">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [developmentCode, setDevelopmentCode] = useState("");
  const [error, setError] = useState(authError ?? "");
  const [fieldErrors, setFieldErrors] = useState({
    displayName: "",
    email: "",
    password: "",
    verificationCode: "",
  });
  const [googlePending, setGooglePending] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const nextFieldErrors = {
      displayName: isRegistration && !displayName.trim() ? "Enter your name." : "",
      email: !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email address." : "",
      password:
        !password
          ? "Enter your password."
          : isRegistration && password.length < 8
            ? "Use at least 8 characters."
            : "",
      verificationCode: "",
    };
    setFieldErrors(nextFieldErrors);
    if (Object.values(nextFieldErrors).some(Boolean)) return;
    setPending(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });
      const data = (await response.json().catch(() => null)) as {
        message?: string;
        developmentCode?: string;
      } | null;

      if (!response.ok) {
        setError(data?.message ?? "Unable to sign in.");
        return;
      }

      if (mode === "register") {
        setDevelopmentCode(data?.developmentCode ?? "");
        setMode("verify");
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError("Unable to reach the authentication service.");
    } finally {
      setPending(false);
    }
  }

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const nextFieldErrors = {
      displayName: "",
      email: !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email address." : "",
      password: "",
      verificationCode: !/^\d{6}$/.test(verificationCode)
        ? "Enter the 6-digit code from your email."
        : "",
    };
    setFieldErrors(nextFieldErrors);
    if (Object.values(nextFieldErrors).some(Boolean)) return;
    setPending(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        setError(data?.message ?? "Unable to confirm your email.");
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError("Unable to reach the authentication service.");
    } finally {
      setPending(false);
    }
  }

  const isVerification = mode === "verify";
  const isRegistration = mode === "register";

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        overflow: "hidden",
        p: { xs: 2, sm: 4 },
        position: "relative",
        "&::after": {
          background: "rgba(5, 11, 22, 0.35)",
          content: '""',
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
        },
      }}
    >
      <ParticleNetworkBackground />
      <FloatingHomeButton />
      <Card
        sx={{
          bgcolor: "rgba(11, 20, 36, 0.9)",
          border: "1px solid rgba(148, 163, 184, 0.22)",
          color: "common.white",
          maxWidth: 460,
          position: "relative",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
          width: "100%",
          zIndex: 1,
          "& .MuiInputLabel-root": {
            color: "rgba(226, 232, 240, 0.72)",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "primary.light",
          },
          "& .MuiOutlinedInput-root": {
            color: "common.white",
            "& fieldset": {
              borderColor: "rgba(148, 163, 184, 0.35)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(191, 219, 254, 0.7)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.light",
            },
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Box
                sx={{
                  alignItems: "center",
                  bgcolor: "rgba(96, 165, 250, 0.14)",
                  border: "1px solid rgba(147, 197, 253, 0.24)",
                  borderRadius: 2,
                  display: "inline-flex",
                  mb: 1.5,
                  p: 1,
                }}
              >
                <LockOutlinedIcon color="primary" sx={{ fontSize: 26 }} />
              </Box>
              <Typography component="h1" variant="h4">
                {isVerification
                  ? "Confirm your email"
                  : isRegistration
                    ? "Create an account"
                    : "Welcome back"}
              </Typography>
              <Typography color="grey.300" sx={{ mt: 1 }}>
                {isVerification
                  ? `Enter the 6-digit code sent to ${email}.`
                  : isRegistration
                    ? "Create your portfolio account to continue."
                    : "Sign in to continue to your portfolio experience."}
              </Typography>
            </Box>

            {error && (
              <Alert aria-live="polite" severity="error">
                {error}
              </Alert>
            )}

            {isVerification ? (
              <Box component="form" onSubmit={handleVerification}>
                <Stack spacing={2}>
                  <TextField
                    autoComplete="one-time-code"
                    fullWidth
                    error={Boolean(fieldErrors.verificationCode)}
                    helperText={fieldErrors.verificationCode}
                    label="Confirmation code"
                    name="verificationCode"
                    onChange={(event) => setVerificationCode(event.target.value)}
                    slotProps={{
                      htmlInput: {
                        inputMode: "numeric",
                        maxLength: 6,
                        pattern: "[0-9]*",
                      },
                    }}
                    value={verificationCode}
                  />
                  {developmentCode && (
                    <Alert severity="info">
                      Local development code: <strong>{developmentCode}</strong>
                    </Alert>
                  )}
                  <Button
                    disabled={pending}
                    endIcon={pending ? <CircularProgress size={18} /> : <ArrowForwardRoundedIcon />}
                    type="submit"
                    variant="contained"
                  >
                    {pending ? "Confirming…" : "Confirm email"}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  {isRegistration && (
                    <TextField
                      autoComplete="name"
                      error={Boolean(fieldErrors.displayName)}
                      fullWidth
                      helperText={fieldErrors.displayName}
                      label="Name"
                      name="name"
                      onChange={(event) => setDisplayName(event.target.value)}
                      placeholder="Your name…"
                      value={displayName}
                    />
                  )}
                  <TextField
                    autoComplete="email"
                    error={Boolean(fieldErrors.email)}
                    fullWidth
                    helperText={fieldErrors.email}
                    label="Email"
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com…"
                    spellCheck={false}
                    type="email"
                    value={email}
                  />
                  <TextField
                    autoComplete={isRegistration ? "new-password" : "current-password"}
                    error={Boolean(fieldErrors.password)}
                    fullWidth
                    helperText={fieldErrors.password}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              edge="end"
                              onClick={() => setShowPassword((visible) => !visible)}
                              sx={{ color: "grey.300" }}
                            >
                              {showPassword ? (
                                <VisibilityOffRoundedIcon />
                              ) : (
                                <VisibilityRoundedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    label="Password"
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <Button
                    disabled={pending}
                    endIcon={pending ? <CircularProgress size={18} /> : <ArrowForwardRoundedIcon />}
                    type="submit"
                    variant="contained"
                  >
                    {pending
                      ? isRegistration
                        ? "Creating account…"
                        : "Signing in…"
                      : isRegistration
                        ? "Create account"
                        : "Sign in"}
                  </Button>
                </Stack>
              </Box>
            )}

            {mode === "login" && (
              <>
                <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.22)", color: "grey.400" }}>
                  or
                </Divider>
                <Button
                  component="a"
                  href={`/api/auth/google/start?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  aria-busy={googlePending}
                  disabled={googlePending}
                  onClick={(event) => {
                    if (googlePending) {
                      event.preventDefault();
                      return;
                    }
                    setGooglePending(true);
                  }}
                  startIcon={<GoogleIcon />}
                  sx={{
                    borderColor: "rgba(191, 219, 254, 0.45)",
                    color: "common.white",
                  }}
                  variant="outlined"
                >
                  {googlePending ? "Connecting to Google…" : "Continue with Google"}
                </Button>
              </>
            )}

            {!isVerification && (
              <Button
                onClick={() => {
                  setError("");
                  setMode(isRegistration ? "login" : "register");
                }}
                variant="text"
              >
                {isRegistration ? "Already have an account? Sign in" : "Need an account? Register"}
              </Button>
            )}

            <Button component={Link} href="/" variant="text">
              Return to portfolio
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
