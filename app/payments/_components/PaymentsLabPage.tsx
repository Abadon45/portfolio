"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import WebhookRoundedIcon from "@mui/icons-material/WebhookRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  LinearProgress,
  MenuItem,
  Select,
  Stack as MuiStack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FloatingHomeButton } from "../../components/FloatingHomeButton";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import { createPortfolioTheme } from "../../theme/portfolioTheme";

type Provider = "xendit" | "stripe";
type FlowStep = "created" | "redirected" | "paid" | "fulfilled";

type LayoutStackProps = React.ComponentProps<typeof MuiStack> & {
  alignItems?: React.CSSProperties["alignItems"];
  justifyContent?: React.CSSProperties["justifyContent"];
};

function Stack({ alignItems, justifyContent, sx, ...props }: LayoutStackProps) {
  return (
    <MuiStack
      {...props}
      sx={{
        alignItems,
        justifyContent,
        ...sx,
      }}
    />
  );
}

const flowSteps: Array<{ id: FlowStep; label: string }> = [
  { id: "created", label: "Payment created" },
  { id: "redirected", label: "Customer redirected" },
  { id: "paid", label: "Webhook verified" },
  { id: "fulfilled", label: "Order fulfilled" },
];

const providerDetails = {
  xendit: {
    name: "Xendit",
    accent: "#21b573",
    tagline: "Invoice-first payments for Southeast Asia",
    createLabel: "Create Xendit invoice",
    endpoint: "POST https://api.xendit.co/v2/invoices",
    event: "PAID · external_id matched",
    secret: "XENDIT_API_KEY",
    verify: "x-callback-token",
    summary:
      "The backend creates an invoice with an external_id, stores the transaction, and sends the customer to Xendit’s hosted payment page.",
  },
  stripe: {
    name: "Stripe",
    accent: "#635bff",
    tagline: "Developer-first global payment infrastructure",
    createLabel: "Create Stripe Checkout",
    endpoint: "stripe.checkout.sessions.create()",
    event: "checkout.session.completed",
    secret: "STRIPE_SECRET_KEY",
    verify: "Stripe-Signature",
    summary:
      "The backend creates a Checkout Session, returns its URL, and fulfills the order only after Stripe’s signed webhook confirms payment.",
  },
} satisfies Record<Provider, Record<string, string>>;

const eventForStep = (provider: Provider, step: FlowStep) => {
  if (step === "created") {
    return provider === "xendit"
      ? "cash_transaction created · status=in_progress"
      : "Checkout Session created · payment_status=unpaid";
  }

  if (step === "redirected") {
    return provider === "xendit"
      ? "invoice_url returned to the browser"
      : "session.url returned to the browser";
  }

  if (step === "paid") {
    return provider === "xendit"
      ? "PAID received · callback token matched · reference resolved"
      : "checkout.session.completed · signature verified · event deduplicated";
  }

  return "Fulfillment unlocked · transaction marked approved";
};

function FlowNode({
  active,
  complete,
  label,
  index,
}: {
  active: boolean;
  complete: boolean;
  label: string;
  index: number;
}) {
  return (
    <Stack alignItems="center" spacing={1} sx={{ minWidth: 76, flex: 1 }}>
      <Box
        sx={{
          alignItems: "center",
          bgcolor: complete || active ? "primary.main" : "action.hover",
          border: 1,
          borderColor: complete || active ? "primary.main" : "divider",
          borderRadius: "50%",
          color: complete || active ? "primary.contrastText" : "text.secondary",
          display: "flex",
          height: 36,
          justifyContent: "center",
          width: 36,
        }}
      >
        {complete ? <CheckCircleRoundedIcon fontSize="small" /> : index + 1}
      </Box>
      <Typography
        align="center"
        color={active || complete ? "text.primary" : "text.secondary"}
        sx={{ fontSize: 11, fontWeight: active || complete ? 700 : 500 }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

export default function PaymentsLabPage() {
  const [provider, setProvider] = useState<Provider>("xendit");
  const [step, setStep] = useState<FlowStep>("created");
  const [amount, setAmount] = useState("1490");
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const details = providerDetails[provider];
  const stepIndex = flowSteps.findIndex((item) => item.id === step);
  const theme = useMemo(() => createPortfolioTheme(mode, "executive"), [mode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("stripe_session_id");
    const xenditReturn = params.get("xendit_return");
    const wasCancelled = params.get("stripe_cancelled") === "true";
    const xenditCancelled = params.get("xendit_cancelled") === "true";

    if (wasCancelled) {
      setProvider("stripe");
      setCheckoutError("Stripe Checkout was cancelled. No payment was recorded.");
      return;
    }

    if (xenditCancelled) {
      setProvider("xendit");
      setCheckoutError("Xendit invoice checkout was cancelled. No payment was recorded.");
      return;
    }

    if (!sessionId) {
      if (!xenditReturn) {
        return;
      }

      const invoiceId = window.sessionStorage.getItem("xendit-invoice-id");

      if (!invoiceId) {
        setProvider("xendit");
        setCheckoutError("The Xendit invoice could not be found in this browser session.");
        return;
      }

      setProvider("xendit");
      setStep("redirected");
      setCheckoutError(null);

      fetch(`/api/payments/xendit/invoice?invoice_id=${encodeURIComponent(invoiceId)}`)
        .then(async (response) => {
          const data = (await response.json()) as { message?: string; paid?: boolean };

          if (!response.ok || !data.paid) {
            throw new Error(data.message ?? "Xendit has not confirmed this invoice yet.");
          }

          setStep("fulfilled");
        })
        .catch((error: unknown) => {
          setCheckoutError(error instanceof Error ? error.message : "Unable to verify Xendit payment.");
          setStep("redirected");
        });

      return;
    }

    setProvider("stripe");
    setStep("redirected");
    setCheckoutError(null);

    fetch(`/api/payments/stripe/checkout?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const data = (await response.json()) as { message?: string; paid?: boolean };

        if (!response.ok || !data.paid) {
          throw new Error(data.message ?? "Stripe has not confirmed this payment yet.");
        }

        setStep("fulfilled");
      })
      .catch((error: unknown) => {
        setCheckoutError(error instanceof Error ? error.message : "Unable to verify Stripe payment.");
        setStep("redirected");
      });
  }, []);

  const resetFlow = () => {
    setStep("created");
    setCheckoutError(null);
  };

  const switchProvider = (nextProvider: Provider) => {
    setProvider(nextProvider);
    resetFlow();
  };

  const openStripeCheckout = async () => {
    setCheckoutError(null);
    setIsCreatingCheckout(true);

    try {
      const response = await fetch("/api/payments/stripe/checkout", {
        body: JSON.stringify({
          amount: Number(amount),
          orderReference: "PAY-DEMO-2048",
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as { message?: string; url?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.message ?? "Unable to open Stripe Checkout.");
      }

      setStep("redirected");
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to open Stripe Checkout.");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const openXenditInvoice = async () => {
    setCheckoutError(null);
    setIsCreatingCheckout(true);

    try {
      const response = await fetch("/api/payments/xendit/invoice", {
        body: JSON.stringify({
          amount: Number(amount),
          externalId: "PAY-DEMO-2048",
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as { message?: string; invoiceId?: string; url?: string };

      if (!response.ok || !data.url || !data.invoiceId) {
        throw new Error(data.message ?? "Unable to open Xendit Invoice.");
      }

      window.sessionStorage.setItem("xendit-invoice-id", data.invoiceId);
      setStep("redirected");
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to open Xendit Invoice.");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Box
          component="header"
          sx={{
            backdropFilter: "blur(14px)",
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            position: "sticky",
            top: 0,
            zIndex: 3,
          }}
        >
          <Container maxWidth="lg">
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              sx={{ minHeight: 68 }}
            >
              <Stack alignItems="center" direction="row" spacing={1.25}>
                <Box sx={{ color: "primary.main", display: "flex" }}>
                  <CreditCardRoundedIcon />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
                    payments lab
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase" }}
                  >
                    gateway integration study
                  </Typography>
                </Box>
              </Stack>
              <Select
                aria-label="Color mode"
                size="small"
                value={mode}
                onChange={(event) => setMode(event.target.value as "light" | "dark")}
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="dark">Dark mode</MenuItem>
                <MenuItem value="light">Light mode</MenuItem>
              </Select>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ pb: 10, pt: { xs: 5, md: 8 } }}>
          <Stack spacing={2} sx={{ maxWidth: 760, mb: { xs: 5, md: 7 } }}>
            <Chip
              icon={<LockRoundedIcon />}
              label="Server-side payment architecture"
              sx={{ alignSelf: "flex-start", fontWeight: 700 }}
            />
            <Typography component="h1" sx={{ fontSize: { xs: 40, md: 64 }, maxWidth: 720 }}>
              Payments are a state machine, not a button.
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: { xs: 16, md: 19 }, lineHeight: 1.7, maxWidth: 680 }}>
              A hands-on comparison of the gateway flow I built around Xendit and a real Stripe test Checkout flow. Both providers now redirect to hosted test payment pages and verify the returned payment server-side.
            </Typography>
          </Stack>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1.25fr .75fr" } }}>
            <Card sx={{ border: 1, borderColor: "divider", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 2.25, md: 3.5 }, "&:last-child": { pb: { xs: 2.25, md: 3.5 } } }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mb: 3 }}>
                  <Box>
                    <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                      Interactive sandbox
                    </Typography>
                    <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 28 }, mt: .5 }}>
                      Checkout lifecycle
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {(["xendit", "stripe"] as Provider[]).map((item) => (
                      <Button
                        key={item}
                        onClick={() => switchProvider(item)}
                        variant={provider === item ? "contained" : "outlined"}
                        sx={{ minWidth: 90 }}
                      >
                        {providerDetails[item].name}
                      </Button>
                    ))}
                  </Stack>
                </Stack>

                <Box sx={{ alignItems: "flex-start", display: "flex", mb: 3 }}>
                  {flowSteps.map((flowStep, index) => (
                    <Box key={flowStep.id} sx={{ alignItems: "center", display: "flex", flex: index < flowSteps.length - 1 ? 1 : "initial" }}>
                      <FlowNode active={flowStep.id === step} complete={index < stepIndex} index={index} label={flowStep.label} />
                      {index < flowSteps.length - 1 && <Box sx={{ bgcolor: index < stepIndex ? "primary.main" : "divider", height: 2, mt: -2.5, width: "100%" }} />}
                    </Box>
                  ))}
                </Box>
                <LinearProgress variant="determinate" value={(stepIndex / (flowSteps.length - 1)) * 100} sx={{ mb: 3, height: 6, borderRadius: 3 }} />

                <Box sx={{ bgcolor: "action.hover", border: 1, borderColor: "divider", borderRadius: 2, p: { xs: 2, md: 2.5 } }}>
                  <Stack alignItems="center" direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <WebhookRoundedIcon sx={{ color: details.accent }} />
                      <Typography sx={{ fontWeight: 800 }}>{details.name} event stream</Typography>
                    </Stack>
                    <Chip label={`Step ${stepIndex + 1}/4`} size="small" />
                  </Stack>
                  <Typography color="text.secondary" sx={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.7 }}>
                    {eventForStep(provider, step)}
                  </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                  {provider === "xendit" ? (
                    <Button disabled={isCreatingCheckout || step === "fulfilled"} onClick={openXenditInvoice} startIcon={step === "fulfilled" ? <CheckCircleRoundedIcon /> : <CreditCardRoundedIcon />} variant="contained">
                      {isCreatingCheckout ? "Creating Invoice..." : step === "fulfilled" ? "Payment fulfilled" : "Open Xendit test Invoice"}
                    </Button>
                  ) : (
                    <Button disabled={isCreatingCheckout || step === "fulfilled"} onClick={openStripeCheckout} startIcon={step === "fulfilled" ? <CheckCircleRoundedIcon /> : <CreditCardRoundedIcon />} variant="contained">
                      {isCreatingCheckout ? "Creating Checkout..." : step === "fulfilled" ? "Payment fulfilled" : "Open Stripe test Checkout"}
                    </Button>
                  )}
                  <Button onClick={resetFlow} startIcon={<ReplayRoundedIcon />} variant="text">
                    Reset flow
                  </Button>
                </Stack>
                {step !== "fulfilled" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                      You will be redirected to {details.name}&apos;s hosted test page. Return here after payment to verify the payment server-side.
                    </Typography>
                    {checkoutError && (
                      <Typography color="error" sx={{ fontSize: 12, mt: 1 }}>
                        {checkoutError}
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card sx={{ border: 1, borderColor: "divider", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 2.25, md: 3.5 }, "&:last-child": { pb: { xs: 2.25, md: 3.5 } } }}>
                <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                  Test order
                </Typography>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>Commerce OS Pro</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 12, mt: .5 }}>1 × annual workspace</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 800 }}>₱{Number(amount || 0).toLocaleString("en-PH")}</Typography>
                </Stack>
                <Box component="input" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9]/g, ""))} aria-label="Test payment amount" sx={{ bgcolor: "transparent", border: 0, borderBottom: 1, borderColor: "divider", color: "text.primary", font: "inherit", mt: 3, outline: 0, pb: 1, width: "100%" }} />
                <Divider sx={{ my: 2.5 }} />
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary" sx={{ fontSize: 13 }}>Order reference</Typography><Typography sx={{ fontFamily: "monospace", fontSize: 12 }}>PAY-DEMO-2048</Typography></Stack>
                  <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary" sx={{ fontSize: 13 }}>Mode</Typography><Chip label="Test / offline" size="small" /></Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Card sx={{ border: 1, borderColor: "divider", boxShadow: "none", mt: 2 }}>
            <CardContent sx={{ p: { xs: 2.25, md: 3.5 }, "&:last-child": { pb: { xs: 2.25, md: 3.5 } } }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" }, justifyContent: "space-between", mb: 3 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontSize: 24 }}>{details.name} integration notes</Typography>
                  <Typography color="text.secondary" sx={{ mt: .75 }}>{details.tagline}</Typography>
                </Box>
                <Chip label="No live credentials" icon={<LockRoundedIcon />} />
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: 800, mb: 3 }}>{details.summary}</Typography>
              <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
                {[
                  ["Create", details.endpoint, <CodeRoundedIcon key="create" />],
                  ["Redirect", provider === "xendit" ? "invoice_url" : "session.url", <LinkRoundedIcon key="redirect" />],
                  ["Verify", details.verify, <LockRoundedIcon key="verify" />],
                  ["Fulfill", details.event, <EventAvailableRoundedIcon key="fulfill" />],
                ].map(([label, value, icon]) => (
                  <Box key={label as string} sx={{ bgcolor: "action.hover", border: 1, borderColor: "divider", borderRadius: 1.5, p: 2 }}>
                    <Stack alignItems="center" direction="row" spacing={1} sx={{ color: details.accent, mb: 1 }}>
                      {icon}
                      <Typography sx={{ fontSize: 12, fontWeight: 800 }}>{label}</Typography>
                    </Stack>
                    <Typography color="text.secondary" sx={{ fontFamily: "monospace", fontSize: 11, overflowWrap: "anywhere" }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
              <Typography color="text.secondary" sx={{ fontSize: 12, mt: 2 }}>
                Secret stays on the server: <Box component="span" sx={{ color: "text.primary", fontFamily: "monospace" }}>{details.secret}</Box>. The browser only receives a hosted checkout URL.
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, mt: 2 }}>
            {[
              ["01", "Create intent", "Persist an internal reference before asking the gateway to create a payment."],
              ["02", "Trust the webhook", "Redirects are UX. A verified server event is the source of truth for money."],
              ["03", "Make it idempotent", "A retried webhook must not ship twice, grant credits twice, or double-count revenue."],
            ].map(([number, title, body]) => (
              <Box key={number} sx={{ borderTop: 2, borderColor: "primary.main", pt: 2 }}>
                <Typography color="primary.main" sx={{ fontFamily: "monospace", fontSize: 12, fontWeight: 800 }}>{number}</Typography>
                <Typography sx={{ fontWeight: 800, mt: .75 }}>{title}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.65, mt: .75 }}>{body}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
        <FloatingHomeButton />
        <ScrollToTopButton />
      </Box>
    </ThemeProvider>
  );
}
