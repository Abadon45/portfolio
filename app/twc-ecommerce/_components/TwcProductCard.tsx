"use client";

import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useTwcStore, type StoreProduct } from "./TwcStoreProvider";

const money = (value: number) =>
  `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function TwcProductCard({
  product,
  onAdd,
}: {
  product: StoreProduct;
  onAdd: () => void;
}) {
  const router = useRouter();
  const { cart } = useTwcStore();
  const added = cart.some((line) => line.product.slug === product.slug);
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        boxShadow: "0 6px 18px rgba(15,23,42,.04)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        transition:
          "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
        "&:hover": {
          borderColor: "#8eb8d3",
          boxShadow: "0 14px 30px rgba(15,23,42,.1)",
          transform: "translateY(-3px)",
        },
      }}
    >
      <Box
        onClick={() => router.push(`/twc-ecommerce/shop/${product.slug}`)}
        sx={{
          bgcolor: "#fff",
          cursor: "pointer",
          height: { xs: 175, sm: 230 },
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          loading="lazy"
          sx={{
            display: "block",
            height: "100%",
            objectFit: "contain",
            transition: "transform .35s ease",
            width: "100%",
            "&:hover": { transform: "scale(1.04)" },
          }}
        />
        <Chip
          label={product.shop}
          size="small"
          sx={{
            bgcolor: alpha("#43846a", 0.13),
            color: "#287249",
            fontSize: 10,
            fontWeight: 800,
            left: 12,
            position: "absolute",
            top: 12,
          }}
        />
      </Box>
      <CardContent
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          p: { xs: 1.5, sm: 2.1 },
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography
            color="primary.main"
            sx={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: ".12em",
              textTransform: "uppercase",
            }}
          >
            {product.category}
          </Typography>
          <IconButton size="small" aria-label="Save product">
            <FavoriteBorderRoundedIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Stack>
        <Typography
          onClick={() => router.push(`/twc-ecommerce/shop/${product.slug}`)}
          sx={{
            cursor: "pointer",
            fontSize: { xs: 13, sm: 16 },
            fontWeight: 850,
            lineHeight: 1.35,
            minHeight: { xs: 35, sm: 44 },
            mt: 0.75,
          }}
        >
          {product.name}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            display: { xs: "none", sm: "-webkit-box" },
            fontSize: 12,
            lineHeight: 1.55,
            mt: 0.75,
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {product.description}
        </Typography>
        <Stack
          direction="row"
          sx={{
            alignItems: "baseline",
            justifyContent: "space-between",
            mt: "auto",
            pt: 1.5,
          }}
        >
          <Typography sx={{ fontSize: { xs: 16, sm: 19 }, fontWeight: 900 }}>
            {money(product.price)}
          </Typography>
          {!product.unlimitedStock && (
            <Typography color="text.secondary" sx={{ fontSize: 11 }}>
              {product.stock} in stock
            </Typography>
          )}
        </Stack>
        <Button
          disabled={added}
          fullWidth
          onClick={onAdd}
          startIcon={
            added ? <CheckRoundedIcon /> : <AddShoppingCartRoundedIcon />
          }
          sx={{
            bgcolor: added ? "#d8f1e4" : "primary.main",
            borderRadius: 1.5,
            color: added ? "#174a34" : "primary.contrastText",
            fontSize: 12,
            fontWeight: 900,
            mt: 1.5,
            py: 1.1,
            textTransform: "uppercase",
            "&:hover": { bgcolor: added ? "#d8f1e4" : "primary.dark" },
          }}
        >
          {added ? "Added to cart" : "Add to cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
