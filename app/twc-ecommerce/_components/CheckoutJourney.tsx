"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Radio,
  RadioGroup,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";
import TwcAddressForm, { type TwcAddressValues } from "./TwcAddressForm";
import {
  calculateDemoShippingFee,
  useTwcStore,
  type CartLine,
  type CheckoutQuote,
} from "./TwcStoreProvider";

const money = (value: number) =>
  `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
const steps = ["Cart", "Shipping address", "Payment", "Order complete"];

export default function CheckoutJourney() {
  const router = useRouter();
  const {
    cart,
    selectedShop,
    activeCheckout,
    setActiveCheckout,
    setLastOrder,
    clearCart,
  } = useTwcStore();
  const { showModal, toastSuccess } = useTwcAlert();
  const checkoutCart = selectedShop
    ? cart.filter((line) => line.product.shop === selectedShop)
    : cart;
  const checkoutTotal = checkoutCart.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const [step, setStep] = useState(activeCheckout ? 2 : 1);
  const [addressMode, setAddressMode] = useState<"another" | "saved">(
    "another",
  );
  const [address, setAddress] = useState<TwcAddressValues | null>(null);
  const [payment, setPayment] = useState("cod");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const quote = activeCheckout;
  const displayQuote = quote ?? {
    itemsTotal: checkoutTotal,
    shippingFee: 0,
    discountAmount: 0,
    platformFee: 0,
    amount: checkoutTotal,
    orderNumber: "Not created",
    status: "in_progress" as const,
    discountLabel: null,
  };

  const saveShipping = (values: TwcAddressValues & { number: string }) => {
    if (!checkoutCart.length) {
      setError("Select a shop with products before checkout.");
      return;
    }
    setAddress(values);
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      const shippingFee = calculateDemoShippingFee(checkoutCart, values);
      const nextQuote: CheckoutQuote = {
        orderNumber: `TWC-DEMO-${Date.now().toString().slice(-6)}`,
        status: "in_progress",
        itemsTotal: checkoutTotal,
        shippingFee,
        discountAmount: 0,
        discountLabel: null,
        platformFee: 0,
        amount: checkoutTotal + shippingFee,
      };
      setActiveCheckout(nextQuote);
      setLoading(false);
      setStep(2);
      toastSuccess(
        `Shipping saved. Order ${nextQuote.orderNumber} is in progress.`,
      );
    }, 650);
  };

  const saveSavedAddress = () => {
    if (!checkoutCart.length) {
      setError("Select a shop with products before checkout.");
      return;
    }
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      const shippingFee = calculateDemoShippingFee(checkoutCart, {
        city: "Cotabato City",
        province: "Cotabato",
      });
      const nextQuote: CheckoutQuote = {
        orderNumber: `TWC-DEMO-${Date.now().toString().slice(-6)}`,
        status: "in_progress",
        itemsTotal: checkoutTotal,
        shippingFee,
        discountAmount: 0,
        discountLabel: null,
        platformFee: 0,
        amount: checkoutTotal + shippingFee,
      };
      setActiveCheckout(nextQuote);
      setLoading(false);
      setStep(2);
      toastSuccess(
        `Saved address accepted. Order ${nextQuote.orderNumber} is in progress.`,
      );
    }, 650);
  };

  const confirmPayment = () => {
    if (!quote) return;
    setLoading(true);
    window.setTimeout(() => {
      const completedQuote = { ...quote, status: "for-booking" as const };
      const shippingAddress =
        addressMode === "saved"
          ? "Noy Pangan · Brgy. Poblacion, Cotabato City"
          : `${address?.name} ${address?.last_name}, ${address?.address}, ${address?.barangay}, ${address?.city}, ${address?.province}`;
      setLastOrder({
        reference: quote.orderNumber,
        total: quote.amount,
        lines: checkoutCart,
        address: shippingAddress,
        payment: payment === "cod" ? "Cash on Delivery" : "Xendit demo",
        quote: completedQuote,
      });
      setActiveCheckout(null);
      clearCart();
      setLoading(false);
      toastSuccess("Demo payment completed. Redirecting to your receipt.");
      router.push("/twc-ecommerce/thank-you");
    }, 900);
  };

  const reviewPayment = async () => {
    const result = await showModal({
      title: "Confirm your order?",
      content:
        payment === "xendit"
          ? "This demo will simulate the Xendit handoff and return locally. No provider will be called."
          : "This demo will place the COD order locally and move it to for-booking.",
      confirmText:
        payment === "xendit" ? "Continue to payment" : "Yes, place order",
      cancelText: "Review order",
    });
    if (result.action === "confirm") confirmPayment();
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            color="primary.main"
            sx={{ fontSize: 12, fontWeight: 800, letterSpacing: ".12em" }}
          >
            TWC CHECKOUT
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 36, md: 50 },
              fontWeight: 800,
              letterSpacing: "-.07em",
              mt: 1,
            }}
          >
            Complete your order.
          </Typography>
        </Box>
        <Chip
          icon={<LockRoundedIcon />}
          label="Offline demo transaction"
          sx={{ color: "primary.main", bgcolor: "action.hover" }}
        />
      </Stack>
      <Stepper activeStep={step} sx={{ mb: 4, overflowX: "auto", py: 1 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {step === 1 && (
        <Box>
          <Stack
            direction="row"
            sx={{ alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}
          >
            <Typography sx={{ fontWeight: 800 }}>Delivery option</Typography>
            <RadioGroup
              row
              value={addressMode}
              onChange={(event) =>
                setAddressMode(event.target.value as "another" | "saved")
              }
            >
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <Radio value="another" />
                <Typography sx={{ fontSize: 14 }}>Another address</Typography>
              </Stack>
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <Radio value="saved" />
                <Typography sx={{ fontSize: 14 }}>Saved address</Typography>
              </Stack>
            </RadioGroup>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1.2fr .8fr" },
            }}
          >
            {addressMode === "another" ? (
              <TwcAddressForm submitting={loading} onSubmit={saveShipping} />
            ) : (
              <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
                <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 800 }}>
                  Saved address
                </Typography>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Noy Pangan · Brgy. Poblacion, Cotabato City · address_id: 101
                </Alert>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mt: 2, gap: 1 }}>
                  <Button onClick={() => router.push("/twc-ecommerce/shop")} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "text.secondary" }}>Shop more</Button>
                  <Button
                    disabled={loading}
                    onClick={saveSavedAddress}
                    startIcon={
                      loading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <ArrowForwardRoundedIcon />
                      )
                    }
                    variant="contained"
                  >
                    {loading ? "Saving address..." : "Continue to payment"}
                  </Button>
                </Stack>
              </Card>
            )}
            <Summary quote={displayQuote} items={checkoutCart} />
          </Box>
          {error && (
            <Alert
              severity="warning"
              sx={{ mt: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}
        </Box>
      )}
      {step === 2 && (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "1.2fr .8fr" },
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, md: 3 },
              borderRadius: 3,
            }}
          >
            <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 800 }}>
              Choose payment
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              COD is the default source flow. Xendit is represented as an
              offline handoff.
            </Typography>
            <RadioGroup
              onChange={(event) => setPayment(event.target.value)}
              sx={{ mt: 2 }}
              value={payment}
            >
              <Card
                variant="outlined"
                sx={{ mb: 1, p: 1.5, boxShadow: "none" }}
              >
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  <Radio value="cod" />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      Cash on Delivery
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                      Place locally and mark the order for booking.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
              <Card variant="outlined" sx={{ p: 1.5, boxShadow: "none" }}>
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  <Radio value="xendit" />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      Xendit payment
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                      Simulate the external payment handoff and return.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </RadioGroup>
            <Box sx={{ bgcolor: "action.hover", borderRadius: 2, mt: 3, p: 2 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <CodeRoundedIcon color="primary" />
                <Typography sx={{ fontWeight: 700 }}>
                  Simulated API lifecycle
                </Typography>
              </Stack>
              <Typography
                color="text.secondary"
                sx={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  lineHeight: 1.8,
                  mt: 1,
                }}
              >
                POST /api/checkout/shipping-info →{" "}
                {quote?.orderNumber ?? "waiting"}
                <br />
                response.status: {quote?.status ?? "not_started"}
                <br />
                POST /api/order/place-{payment} →{" "}
                {loading ? "processing" : "pending"}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              <Button
                onClick={() => setStep(1)}
                startIcon={<ArrowBackRoundedIcon />}
              >
                Back
              </Button>
              <Button
                disabled={loading}
                onClick={() => void reviewPayment()}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CheckRoundedIcon />
                  )
                }
                variant="contained"
              >
                Review and place order
              </Button>
            </Stack>
          </Card>
          <Summary
            quote={displayQuote}
            items={checkoutCart}
            address={
              addressMode === "saved"
                ? "Noy Pangan · Saved default address"
                : `${address?.name ?? "Guest customer"}, ${address?.address ?? "Address pending"}`
            }
          />
        </Box>
      )}
    </Container>
  );
}

function Summary({
  quote,
  items,
  address,
}: {
  quote: CheckoutQuote;
  items: CartLine[];
  address?: string;
}) {
  return (
    <Stack spacing={2}>
      <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 800 }}>
          Order totals
        </Typography>
        <Stack divider={<Divider flexItem />} sx={{ mt: 2 }}>
          {[
            ["Items total", money(quote.itemsTotal)],
            [
              "Delivery fee",
              quote.shippingFee
                ? money(quote.shippingFee)
                : "Calculated after address",
            ],
            ...(quote.discountAmount
              ? [
                  [
                    quote.discountLabel ?? "Discount",
                    `-${money(quote.discountAmount)}`,
                  ],
                ]
              : []),
            ...(quote.platformFee
              ? [["Platform fee", money(quote.platformFee)]]
              : []),
          ].map(([label, value]) => (
            <Stack
              direction="row"
              key={label}
              sx={{ justifyContent: "space-between", py: 1.25 }}
            >
              <Typography color="text.secondary">{label}</Typography>
              <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
            </Stack>
          ))}
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", pt: 2 }}
          >
            <Typography sx={{ fontWeight: 800 }}>TOTAL</Typography>
            <Typography
              color="primary.main"
              sx={{ fontSize: 22, fontWeight: 800 }}
            >
              {money(quote.amount)}
            </Typography>
          </Stack>
        </Stack>
        {address && (
          <Box sx={{ borderTop: 1, borderColor: "divider", mt: 2, pt: 2 }}>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
              Shipping to
            </Typography>
            <Typography sx={{ fontWeight: 700, mt: 0.5 }}>{address}</Typography>
          </Box>
        )}
      </Card>
      <Card sx={{ borderRadius: 3, p: { xs: 2, md: 3 } }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 800 }}>
            Your cart
          </Typography>
          <Chip
            label={`${items.reduce((sum, line) => sum + line.quantity, 0)} items`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>
        <Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
          {items.map((line) => (
            <Stack
              direction="row"
              key={line.product.slug}
              spacing={1.25}
              sx={{ alignItems: "center", py: 1.25 }}
            >
              <Box
                sx={{
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  flexShrink: 0,
                  height: 52,
                  p: 0.5,
                  width: 52,
                }}
              >
                <Box
                  component="img"
                  src={line.product.image}
                  alt=""
                  sx={{ height: "100%", objectFit: "contain", width: "100%" }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 13, fontWeight: 800 }}>
                  {line.product.name}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                  Qty {line.quantity}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
                {money(line.product.price * line.quantity)}
              </Typography>
            </Stack>
          ))}
          {!items.length && (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              Select a shop in your cart drawer to continue.
            </Typography>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
