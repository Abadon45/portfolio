"use client";

import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTwcStore, type StoreProduct } from "./TwcStoreProvider";
import { useStorefrontTheme } from "./twcEcommerceTheme";
import { santeProductImage } from "./storefrontContent";

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
  const { themeConfig } = useStorefrontTheme();
  const added = cart.some((line) => line.product.slug === product.slug);
  const open = () => router.push(`/twc-ecommerce/shop/${product.slug}`);
  const variant = themeConfig.cardVariant;

  if (variant === "premium")
    return (
      <PremiumCard
        added={added}
        isBeautyTheme={themeConfig.name === "Premium Beauty"}
        onAdd={onAdd}
        onOpen={open}
        product={product}
        productImage={
          themeConfig.name === "Wellness Organic"
            ? santeProductImage(product)
            : product.image
        }
      />
    );
  if (variant === "marketplace")
    return (
      <MarketplaceCard
        added={added}
        onAdd={onAdd}
        onOpen={open}
        product={product}
      />
    );
  if (variant === "compact")
    return (
      <CorporateCard
        added={added}
        onAdd={onAdd}
        onOpen={open}
        product={product}
      />
    );
  return (
    <WellnessCard added={added} onAdd={onAdd} onOpen={open} product={product} />
  );
}

type CardProps = {
  product: StoreProduct;
  added: boolean;
  onAdd: () => void;
  onOpen: () => void;
};

function AddButton({
  added,
  onAdd,
  label = "Add to basket",
  sx,
}: {
  added: boolean;
  onAdd: () => void;
  label?: string;
  sx?: object;
}) {
  return (
    <Button
      disabled={added}
      onClick={onAdd}
      startIcon={added ? <CheckRoundedIcon /> : <AddShoppingCartRoundedIcon />}
      sx={sx}
      variant="contained"
    >
      {added ? "Added to basket" : label}
    </Button>
  );
}

function ProductImage({
  product,
  onOpen,
  src = product.image,
  height = 260,
  alt = product.name,
  surface = "action.hover",
}: {
  product: StoreProduct;
  onOpen: () => void;
  src?: string;
  height?: number | Record<string, number>;
  alt?: string;
  surface?: string;
}) {
  const [failed, setFailed] = useState(false);
  const isPremiumSurface = surface === "#fffdfc";
  return (
    <ButtonBase
      component="button"
      type="button"
      onClick={onOpen}
      aria-label={`View ${product.name}`}
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "action.hover" : surface,
        cursor: "pointer",
        display: "block",
        height,
        overflow: "hidden",
        position: "relative",
        textAlign: "left",
        width: "100%",
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: -3,
        },
      }}
    >
      {failed ? (
        <Stack
          sx={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            color: "text.secondary",
            p: 2,
          }}
        >
          <Inventory2OutlinedIcon fontSize="large" />
          <Typography variant="caption">Image unavailable</Typography>
        </Stack>
      ) : (
        <Box
          onError={() => setFailed(true)}
          component="img"
          src={src}
          alt={alt}
          width={800}
          height={800}
          loading="lazy"
          decoding="async"
          sx={{
            height: "100%",
            objectFit: "contain",
            p: isPremiumSurface ? { xs: 0.5, md: 0.75 } : { xs: 1.5, md: 2 },
            transition: "transform .45s ease",
            width: "100%",
            "&:hover": { transform: "scale(1.05)" },
          }}
        />
      )}
    </ButtonBase>
  );
}

function PremiumCard({
  product,
  productImage,
  isBeautyTheme,
  added,
  onAdd,
  onOpen,
}: CardProps & { productImage: string; isBeautyTheme: boolean }) {
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        border: isBeautyTheme ? 0 : 1,
        borderColor: "divider",
        borderRadius: isBeautyTheme ? 0 : 1,
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        p: isBeautyTheme ? 0 : { xs: 0.75, md: 1 },
        transition:
          "border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
        "&:hover": isBeautyTheme
          ? {
              boxShadow: "0 14px 32px rgba(51, 31, 42, .09)",
              transform: "translateY(-3px)",
            }
          : { borderColor: "primary.main" },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
        },
      }}
    >
      <ProductImage
        height={
          isBeautyTheme
            ? { xs: 154, sm: 225, lg: 245 }
            : { xs: 190, sm: 205, lg: 195 }
        }
        onOpen={onOpen}
        product={product}
        src={productImage}
        surface={isBeautyTheme ? "background.default" : "background.paper"}
      />
      <CardContent
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          minHeight: isBeautyTheme
            ? { xs: 126, md: 150 }
            : { xs: 152, md: 150 },
          p: isBeautyTheme ? { xs: 1.5, sm: 2 } : { xs: 1, sm: 1.5, md: 1.25 },
        }}
      >
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          {isBeautyTheme
            ? product.brand || prettyBeautyCategory(product.category2)
            : product.brand || product.category}
        </Typography>
        {product.brand && (
          <Typography
            color="text.secondary"
            sx={{
              fontSize: 10,
              letterSpacing: ".08em",
              mt: 0.35,
              textTransform: "uppercase",
            }}
          >
            {isBeautyTheme
              ? prettyBeautyCategory(product.category2)
              : product.category}
          </Typography>
        )}
        <Typography
          component="h3"
          sx={{
            cursor: "pointer",
            display: "-webkit-box",
            fontFamily: isBeautyTheme
              ? 'Georgia, "Times New Roman", serif'
              : undefined,
            fontSize: { xs: 16, sm: 18, md: 18 },
            fontWeight: isBeautyTheme ? 500 : 700,
            lineHeight: 1.35,
            mt: 0.5,
            minHeight: isBeautyTheme ? { xs: 42, md: 54 } : { xs: 67, md: 54 },
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: isBeautyTheme
              ? { xs: 2, sm: 3 }
              : { xs: 4, sm: 3 },
          }}
        >
          <Link
            href={`/twc-ecommerce/shop/${product.slug}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.name}
          </Link>
        </Typography>
        <Stack
          direction={isBeautyTheme ? { xs: "column", md: "row" } : "row"}
          sx={{
            alignItems: isBeautyTheme
              ? { xs: "stretch", md: "center" }
              : "center",
            justifyContent: isBeautyTheme ? "flex-start" : "space-between",
            mt: "auto",
            minHeight: isBeautyTheme ? { xs: 82, md: 48 } : 44,
            gap: isBeautyTheme ? { xs: 0.5, md: 1 } : 1,
            pt: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "baseline", flexWrap: "wrap" }}
          >
            <Typography
              sx={{
                fontSize: { xs: 15, md: 16 },
                fontWeight: 750,
                whiteSpace: "nowrap",
              }}
            >
              {money(product.price)}
            </Typography>
            {product.compareAtPrice !== null &&
              product.compareAtPrice > product.price && (
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 11, textDecoration: "line-through" }}
                >
                  {money(product.compareAtPrice)}
                </Typography>
              )}
          </Stack>
          <Button
            disabled={added}
            onClick={onAdd}
            endIcon={<ArrowForwardRoundedIcon />}
            size="small"
            aria-label={`Add ${product.name} to basket`}
            sx={{
              flex: isBeautyTheme
                ? { xs: "1 1 auto", md: "0 0 auto" }
                : undefined,
              minWidth: isBeautyTheme ? { xs: "100%", md: 146 } : 64,
              minHeight: 42,
              px: 1.5,
              whiteSpace: "nowrap",
            }}
            variant="contained"
          >
            {added
              ? "Added to basket"
              : isBeautyTheme
                ? "Add to basket"
                : "Add"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function prettyBeautyCategory(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function WellnessCard({ product, added, onAdd, onOpen }: CardProps) {
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        p: { xs: 0.75, sm: 1 },
        transition: "border-color .25s, box-shadow .25s, transform .25s",
        "&:active": { transform: "scale(.99)" },
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 14px 30px rgba(52,113,83,.1)",
          transform: "translateY(-3px)",
        },
      }}
    >
      <ProductImage
        height={220}
        onOpen={onOpen}
        product={product}
        surface="#eef6ec"
      />
      <CardContent
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          minHeight: { xs: 230, sm: 242 },
          p: { xs: 1.25, sm: 1.75 },
        }}
      >
        <Chip
          label={product.category}
          size="small"
          sx={{
            alignSelf: "flex-start",
            bgcolor: "action.selected",
            color: "primary.main",
            fontWeight: 800,
          }}
        />
        <Typography
          component="h3"
          sx={{
            cursor: "pointer",
            fontSize: { xs: 14, sm: 16 },
            fontWeight: 850,
            lineHeight: 1.3,
            mt: 1,
            minHeight: { xs: 36, sm: 42 },
          }}
        >
          <Link
            href={`/twc-ecommerce/shop/${product.slug}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.name}
          </Link>
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            fontSize: 12,
            lineHeight: 1.55,
            minHeight: 37,
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
            minHeight: 32,
            mt: "auto",
            pt: 1.5,
          }}
        >
          <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 900 }}>
            {money(product.price)}
          </Typography>
          {!product.unlimitedStock && (
            <Typography color="text.secondary" sx={{ fontSize: 11 }}>
              {product.stock} left
            </Typography>
          )}
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mt: 1.5 }}
        >
          <Button
            fullWidth
            onClick={onOpen}
            size="small"
            sx={{
              borderColor: "divider",
              color: "text.primary",
              flex: 1,
              minHeight: 36,
            }}
            variant="outlined"
          >
            Details
          </Button>
          <AddButton
            added={added}
            onAdd={onAdd}
            sx={{ flex: 1, minHeight: 36, whiteSpace: "nowrap" }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function MarketplaceCard({ product, added, onAdd, onOpen }: CardProps) {
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        transition:
          "border-color .2s ease, box-shadow .2s ease, transform .2s ease",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 8px 22px rgba(20, 44, 99, .1)",
        },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <ProductImage
          height={{ xs: 158, sm: 210, md: 220 }}
          onOpen={onOpen}
          product={product}
          surface="background.default"
        />
      </Box>
      <CardContent
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          minHeight: { xs: 150, sm: 158 },
          p: { xs: 1.25, sm: 1.75 },
        }}
      >
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          {product.brand || product.category}
        </Typography>
        <Typography
          component="h3"
          sx={{
            cursor: "pointer",
            fontSize: { xs: 13, sm: 15 },
            fontWeight: 650,
            lineHeight: 1.4,
            mt: 0.75,
            minHeight: { xs: 54, sm: 42 },
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          <Link
            href={`/twc-ecommerce/shop/${product.slug}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.name}
          </Link>
        </Typography>
        <Stack
          direction="row"
          sx={{
            alignItems: "baseline",
            justifyContent: "space-between",
            mt: "auto",
            gap: 0.5,
            pt: 1,
          }}
        >
          <Typography
            color="primary.main"
            sx={{
              fontSize: { xs: 16, sm: 19 },
              fontWeight: 850,
              whiteSpace: "nowrap",
            }}
          >
            {money(product.price)}
          </Typography>
          {!product.unlimitedStock && (
            <Typography
              color="text.secondary"
              sx={{ fontSize: 10, textAlign: "right" }}
            >
              {product.stock} left
            </Typography>
          )}
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={0.75}
          sx={{ mt: 1.25 }}
        >
          <AddButton
            added={added}
            label="Add"
            onAdd={onAdd}
            sx={{ flex: 1, minWidth: 0, minHeight: 36, whiteSpace: "nowrap" }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function CorporateCard({ product, added, onAdd, onOpen }: CardProps) {
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        transition: "border-color .25s, box-shadow .25s, transform .25s",
        "&:active": { transform: "scale(.99)" },
        "&:hover": {
          borderColor: "divider",
          boxShadow: "0 14px 34px rgba(24,48,46,.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <ProductImage
        height={{ xs: 170, sm: 210, md: 230 }}
        onOpen={onOpen}
        product={product}
        surface="#edf2f5"
      />
      <CardContent
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          minHeight: 205,
          p: { xs: 1.75, md: 2 },
        }}
      >
        <Typography
          color="text.secondary"
          sx={{
            fontSize: 11,
            fontWeight: 650,
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          {product.category}
        </Typography>
        <Typography
          component="h3"
          sx={{
            color: "text.primary",
            cursor: "pointer",
            fontSize: { xs: 16, md: 18 },
            fontWeight: 600,
            lineHeight: 1.38,
            mt: 0.75,
            minHeight: 50,
          }}
        >
          <Link
            href={`/twc-ecommerce/shop/${product.slug}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.name}
          </Link>
        </Typography>
        <Stack
          direction="row"
          sx={{
            alignItems: "baseline",
            justifyContent: "space-between",
            mt: "auto",
            minHeight: 34,
            pt: 1.5,
          }}
        >
          <Typography
            color="text.primary"
            sx={{ fontSize: { xs: 17, md: 19 }, fontWeight: 950 }}
          >
            {money(product.price)}
          </Typography>
          {!product.unlimitedStock && (
            <Typography color="text.secondary" sx={{ fontSize: 11 }}>
              {product.stock} available
            </Typography>
          )}
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mt: 1.5 }}
        >
          <Button
            fullWidth
            onClick={onOpen}
            size="small"
            sx={{
              borderColor: "divider",
              color: "text.primary",
              flex: 1,
              minHeight: 38,
            }}
            variant="outlined"
          >
            View details
          </Button>
          <AddButton
            added={added}
            label="Add"
            onAdd={onAdd}
            sx={{ flex: 1, minHeight: 38, whiteSpace: "nowrap" }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
