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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";
import TwcAddressForm, { type TwcAddressValues } from "./TwcAddressForm";
import {
  calculateDemoShippingFee,
  useTwcStore,
  type CartLine,
  type CheckoutQuote,
} from "./TwcStoreProvider";
import { useStorefrontTheme } from "./twcEcommerceTheme";

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
    completeShop,
  } = useTwcStore();
  const { showModal, toastSuccess } = useTwcAlert();
  const { themeConfig } = useStorefrontTheme();
  const isEditorial = themeConfig.headerVariant === "editorial";
  const isMarketplace = themeConfig.headerVariant === "marketplace";
  const isCorporate = themeConfig.headerVariant === "corporate";
  const checkoutColumns = isMarketplace
    ? { xs: "minmax(0, 1fr)", md: "minmax(0, 1.2fr) minmax(0, .8fr)" }
    : { xs: "minmax(0, 1fr)", lg: "minmax(0, 2fr) minmax(300px, 1fr)" };
  const checkoutCart = selectedShop
    ? cart.filter((line) => line.product.shop === selectedShop)
    : [];
  const checkoutTotal = checkoutCart.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const [requestedStep, setStep] = useState(activeCheckout ? 2 : 1);
  const step = activeCheckout ? requestedStep : 1;
  const address = activeCheckout?.address;
  const payment = activeCheckout?.payment ?? "cod";
  const setPayment = (value: string) => {
    if (activeCheckout && (value === "cod" || value === "xendit")) {
      setActiveCheckout({ ...activeCheckout, payment: value });
    }
  };
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const quote = activeCheckout;
  const pending = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const latestQuote = useRef(quote);
  useEffect(() => {
    latestQuote.current = quote;
  }, [quote]);
  useEffect(() => {
    window.clearTimeout(timer.current);
    pending.current = false;
    setLoading(false);
  }, [cart, selectedShop]);
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      pending.current = false;
    },
    [],
  );
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
    if (pending.current || !selectedShop) return;
    pending.current = true;
    setLoading(true);
    setError("");
    timer.current = window.setTimeout(() => {
      const shippingFee = calculateDemoShippingFee(checkoutCart, values);
      const nextQuote: CheckoutQuote = {
        payment,
        address: values,
        shop: selectedShop,
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
      pending.current = false;
      setLoading(false);
      setStep(2);
      toastSuccess(
        `Shipping saved. Order ${nextQuote.orderNumber} is in progress.`,
      );
    }, 650);
  };

  const confirmPayment = () => {
    if (
      !quote ||
      latestQuote.current !== quote ||
      !checkoutCart.length ||
      quote.shop !== selectedShop
    ) {
      pending.current = false;
      return;
    }
    setLoading(true);
    timer.current = window.setTimeout(() => {
      const completedQuote = { ...quote, status: "for-booking" as const };
      const shippingAddress = `${quote.address.name} ${quote.address.last_name}, ${quote.address.address}, ${quote.address.barangay}, ${quote.address.city}, ${quote.address.province} · ${quote.address.mobile}`;
      setLastOrder({
        reference: quote.orderNumber,
        total: quote.amount,
        lines: checkoutCart,
        address: shippingAddress,
        payment: payment === "cod" ? "Cash on Delivery" : "Xendit demo",
        quote: completedQuote,
      });
      setActiveCheckout(null);
      completeShop(quote.shop);
      pending.current = false;
      setLoading(false);
      toastSuccess("Demo payment completed. Redirecting to your receipt.");
      router.push("/twc-ecommerce/thank-you");
    }, 900);
  };

  const reviewPayment = async () => {
    if (pending.current || !quote) return;
    pending.current = true;
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
    else pending.current = false;
  };

  if (!checkoutCart.length) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Select a shop with items in your basket to start checkout.
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push("/twc-ecommerce/shop")}
        >
          Browse products
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        bgcolor: isCorporate ? "background.default" : undefined,
        py: { xs: 4, md: 7 },
      }}
    >
      <Box
        sx={{
          borderTop: isEditorial ? 0 : 1,
          borderColor: "divider",
          pt: isEditorial ? 0 : 3,
        }}
      >
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
              {isEditorial
                ? "THE TWC EDIT · CHECKOUT"
                : isMarketplace
                  ? "FAST CHECKOUT"
                  : isCorporate
                    ? "CORPORATE COMMERCE · CHECKOUT"
                    : "TWC CHECKOUT"}
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 36, md: 50 },
                fontFamily: isEditorial
                  ? 'Georgia, "Times New Roman", serif'
                  : undefined,
                fontWeight: isEditorial ? 500 : 900,
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
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: checkoutColumns,
              }}
            >
              <TwcAddressForm
                initialData={address}
                submitting={loading}
                onSubmit={saveShipping}
              />
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
              gridTemplateColumns: checkoutColumns,
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
              <Box
                sx={{ bgcolor: "action.hover", borderRadius: 2, mt: 3, p: 2 }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
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
                address
                  ? `${address.name} ${address.last_name}, ${address.address}, ${address.barangay}, ${address.city}, ${address.province} · ${address.mobile}`
                  : "Address pending"
              }
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}

function Summary({
  quote,
  items,
  address,
}: {
  quote: Omit<CheckoutQuote, "address" | "shop" | "payment">;
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
