"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";
import { useTwcStore } from "./TwcStoreProvider";
import { useStorefrontTheme } from "./twcEcommerceTheme";

const money = (value: number) =>
  `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function TwcThankYouView() {
  const router = useRouter();
  const { lastOrder } = useTwcStore();
  const { toastSuccess } = useTwcAlert();
  const { themeConfig } = useStorefrontTheme();
  const isEditorial = themeConfig.headerVariant === "editorial";
  const isMarketplace = themeConfig.headerVariant === "marketplace";
  const isCorporate = themeConfig.headerVariant === "corporate";
  if (!lastOrder)
    return (
      <Container maxWidth={isMarketplace ? "lg" : "md"} sx={{ py: 10, textAlign: "center" }}>
        <Typography component="h1" sx={{ fontSize: 42, fontWeight: 900 }}>
          No recent order
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Complete the demo checkout to see the order confirmation.
        </Typography>
        <Button
          onClick={() => router.push("/twc-ecommerce/shop")}
          sx={{ mt: 3 }}
          variant="contained"
        >
          Browse the shop
        </Button>
      </Container>
    );
  const copyOrder = () => {
    void navigator.clipboard?.writeText(lastOrder.reference);
    toastSuccess("Order reference copied.");
  };
  return (
    <Container maxWidth={isMarketplace ? "lg" : "md"} sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ textAlign: "center" }}>
        <Avatar
          sx={{
            bgcolor: isEditorial || isCorporate ? "primary.main" : "success.main",
            color: "success.contrastText",
            height: 74,
            mx: "auto",
            width: 74,
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 46 }} />
        </Avatar>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 38, md: 58 },
            fontFamily: isEditorial ? 'Georgia, "Times New Roman", serif' : undefined,
            fontWeight: isEditorial ? 500 : 950,
            letterSpacing: "-.07em",
            mt: 2,
          }}
        >
          Thanks for your order!
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 16, lineHeight: 1.7, mt: 1 }}
        >
          We’ve received your order and simulated the next step in the delivery
          journey.
        </Typography>
      </Box>
      <Card
        sx={{ border: 1, borderColor: "divider", borderRadius: isEditorial || isCorporate ? 0 : isMarketplace ? 1 : undefined, borderTop: isCorporate ? 4 : undefined, borderTopColor: isCorporate ? "primary.main" : undefined, mt: 4, p: { xs: 2, md: 3 } }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            alignItems: { sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              color="text.secondary"
              sx={{ fontSize: 11, fontWeight: 900, letterSpacing: ".12em" }}
            >
              ORDER NUMBER
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 900, mt: 0.5 }}>
              {lastOrder.reference}
            </Typography>
            <Chip
              label={lastOrder.quote.status}
              size="small"
              color="success"
              sx={{ mt: 1, textTransform: "capitalize" }}
            />
          </Box>
          <Button
            onClick={copyOrder}
            startIcon={<ContentCopyRoundedIcon />}
            variant="outlined"
          >
            Copy order number
          </Button>
        </Stack>
      </Card>
      <Box
        sx={{
          borderRadius: isEditorial ? 0 : isMarketplace ? 1 : undefined,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          mt: 2,
        }}
      >
        <Card sx={{ border: 1, borderColor: "divider", p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", mb: 1.5 }}
          >
            <LocalShippingOutlinedIcon color="primary" />
            <Typography sx={{ fontSize: 18, fontWeight: 900 }}>
              Shipping address
            </Typography>
          </Stack>
          <Typography sx={{ fontWeight: 800 }}>
            {lastOrder.address.split(",")[0]}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, mt: 0.5 }}>
            {lastOrder.address.split(",").slice(1).join(",").trim() ||
              lastOrder.address}
          </Typography>
          <Alert severity="info" icon={false} sx={{ mt: 2 }}>
            This address is attached to the completed demo order.
          </Alert>
        </Card>
        <Card sx={{ border: 1, borderColor: "divider", p: { xs: 2, md: 2.5 } }}>
          <Typography sx={{ fontSize: 18, fontWeight: 900 }}>
            Payment summary
          </Typography>
          <Stack spacing={1.25} sx={{ mt: 1.5 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography color="text.secondary">Payment method</Typography>
              <Typography sx={{ fontWeight: 800 }}>
                {lastOrder.payment}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography color="text.secondary">Items total</Typography>
              <Typography sx={{ fontWeight: 800 }}>
                {money(lastOrder.quote.itemsTotal)}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography color="text.secondary">Delivery fee</Typography>
              <Typography sx={{ fontWeight: 800 }}>
                {money(lastOrder.quote.shippingFee)}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography color="text.secondary">Order total</Typography>
              <Typography
                color="primary.main"
                sx={{ fontSize: 20, fontWeight: 900 }}
              >
                {money(lastOrder.total)}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Box>
      <Card
        sx={{ border: 1, borderColor: "divider", mt: 2, p: { xs: 2, md: 3 } }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
            Items in this order
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            {lastOrder.lines.reduce((sum, line) => sum + line.quantity, 0)}{" "}
            items
          </Typography>
        </Stack>
        <Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
          {lastOrder.lines.map((line) => (
            <Stack
              direction="row"
              key={line.product.slug}
              spacing={1.5}
              sx={{ alignItems: "center", py: 1.25 }}
            >
              <Box
                sx={{ bgcolor: "action.hover", height: 58, p: 0.5, width: 58 }}
              >
                <Box
                  component="img"
                  src={line.product.image}
                  alt=""
                  sx={{ height: "100%", objectFit: "contain", width: "100%" }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 800 }}>
                  {line.product.name}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                  Quantity {line.quantity}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 900 }}>
                {money(line.product.price * line.quantity)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Card>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ justifyContent: "center", mt: 3 }}
      >
        <Button
          onClick={() => router.push("/twc-ecommerce/shop")}
          endIcon={<ArrowForwardRoundedIcon />}
          variant="contained"
        >
          Continue shopping
        </Button>
        <Button
          onClick={() => router.push("/twc-ecommerce")}
          sx={{ color: "text.primary" }}
        >
          Store home
        </Button>
      </Stack>
    </Container>
  );
}
