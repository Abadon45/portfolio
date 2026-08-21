"use client";

import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTwcStore, type StoreProduct } from "./TwcStoreProvider";
import { useStorefrontTheme } from "./twcEcommerceTheme";

const money = (value: number) => `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export default function TwcProductCard({ product, onAdd }: { product: StoreProduct; onAdd: () => void }) {
  const router = useRouter();
  const { cart } = useTwcStore();
  const { themeConfig } = useStorefrontTheme();
  const added = cart.some((line) => line.product.slug === product.slug);
  const open = () => router.push(`/twc-ecommerce/shop/${product.slug}`);
  const variant = themeConfig.cardVariant;

  if (variant === "premium") return <PremiumCard added={added} onAdd={onAdd} onOpen={open} product={product} />;
  if (variant === "marketplace") return <MarketplaceCard added={added} onAdd={onAdd} onOpen={open} product={product} />;
  if (variant === "compact") return <CorporateCard added={added} onAdd={onAdd} onOpen={open} product={product} />;
  return <WellnessCard added={added} onAdd={onAdd} onOpen={open} product={product} />;
}

type CardProps = { product: StoreProduct; added: boolean; onAdd: () => void; onOpen: () => void };

function AddButton({ added, onAdd, label = "Add to basket", sx }: { added: boolean; onAdd: () => void; label?: string; sx?: object }) {
  return <Button disabled={added} onClick={onAdd} startIcon={added ? <CheckRoundedIcon /> : <AddShoppingCartRoundedIcon />} sx={sx} variant="contained">{added ? "Added" : label}</Button>;
}

function ProductImage({ product, onOpen, height = 260, alt = product.name, surface = "action.hover" }: { product: StoreProduct; onOpen: () => void; height?: number; alt?: string; surface?: string }) {
  return <Box role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(); } }} aria-label={`View ${product.name}`} sx={{ bgcolor: surface, cursor: "pointer", height, overflow: "hidden", position: "relative", "&:focus-visible": { outline: 2, outlineColor: "primary.main", outlineOffset: -2 } }}><Box component="img" src={product.image} alt={alt} loading="lazy" sx={{ height: "100%", objectFit: "contain", p: { xs: 1.5, md: 2 }, transition: "transform .45s ease", width: "100%", "&:hover": { transform: "scale(1.05)" } }} /></Box>;
}

function PremiumCard({ product, added, onAdd, onOpen }: CardProps) {
  return <Card sx={{ bgcolor: "background.paper", border: 1, borderColor: "rgba(139,73,98,.14)", borderRadius: 2, boxShadow: "0 12px 30px rgba(72,33,48,.06)", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", p: { xs: 1, md: 1.25 }, transition: "box-shadow .3s, transform .3s", "&:hover": { boxShadow: "0 18px 42px rgba(72,33,48,.12)", transform: "translateY(-4px)" } }}><ProductImage height={300} onOpen={onOpen} product={product} surface="#f8efed" /><CardContent sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: { xs: 150, md: 170 }, p: { xs: 1, sm: 1.5, md: 2 } }}><Typography color="text.secondary" sx={{ fontSize: 10, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>{product.category}</Typography><Typography onClick={onOpen} component="h3" sx={{ cursor: "pointer", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: 17, md: 20 }, fontWeight: 500, lineHeight: 1.2, mt: .75, minHeight: { xs: 42, md: 48 } }}>{product.name}</Typography><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mt: "auto", minHeight: 36, pt: 1.5 }}><Typography sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 900 }}>{money(product.price)}</Typography><Button disabled={added} onClick={onAdd} endIcon={<ArrowForwardRoundedIcon />} size="small" sx={{ color: "primary.main", minWidth: 0, px: .5 }}>{added ? "Added" : "Add"}</Button></Stack></CardContent></Card>;
}

function WellnessCard({ product, added, onAdd, onOpen }: CardProps) {
  return <Card sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 2, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", p: { xs: .75, sm: 1 }, transition: "border-color .25s, box-shadow .25s, transform .25s", "&:hover": { borderColor: "primary.main", boxShadow: "0 14px 30px rgba(52,113,83,.1)", transform: "translateY(-3px)" } }}><ProductImage height={220} onOpen={onOpen} product={product} surface="#eef6ec" /><CardContent sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: { xs: 230, sm: 242 }, p: { xs: 1.25, sm: 1.75 } }}><Chip label={product.category} size="small" sx={{ alignSelf: "flex-start", bgcolor: "action.selected", color: "primary.main", fontWeight: 800 }} /><Typography onClick={onOpen} component="h3" sx={{ cursor: "pointer", fontSize: { xs: 14, sm: 16 }, fontWeight: 850, lineHeight: 1.3, mt: 1, minHeight: { xs: 36, sm: 42 } }}>{product.name}</Typography><Typography color="text.secondary" sx={{ display: "-webkit-box", fontSize: 12, lineHeight: 1.55, minHeight: 37, mt: .75, overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>{product.description}</Typography><Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between", minHeight: 32, mt: "auto", pt: 1.5 }}><Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 900 }}>{money(product.price)}</Typography>{!product.unlimitedStock && <Typography color="text.secondary" sx={{ fontSize: 11 }}>{product.stock} left</Typography>}</Stack><Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.5 }}><Button fullWidth onClick={onOpen} size="small" sx={{ borderColor: "divider", color: "text.primary", flex: 1, minHeight: 36 }} variant="outlined">Details</Button><AddButton added={added} onAdd={onAdd} sx={{ flex: 1, minHeight: 36, whiteSpace: "nowrap" }} /></Stack></CardContent></Card>;
}

function MarketplaceCard({ product, added, onAdd, onOpen }: CardProps) {
  return <Card sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", transition: "border-color .25s, box-shadow .25s, transform .25s", "&:hover": { borderColor: "primary.main", boxShadow: "0 12px 26px rgba(36,87,197,.12)", transform: "translateY(-3px)" } }}><Box sx={{ position: "relative" }}><ProductImage height={205} onOpen={onOpen} product={product} /><Chip label={product.category} size="small" sx={{ bgcolor: "rgba(255,255,255,.92)", color: "primary.main", fontSize: 10, fontWeight: 900, left: 8, position: "absolute", top: 8 }} /></Box><CardContent sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: 146, p: { xs: 1.25, sm: 1.5 } }}><Typography color="text.secondary" sx={{ fontSize: 10, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>{product.category}</Typography><Typography onClick={onOpen} component="h3" sx={{ cursor: "pointer", fontSize: { xs: 13, sm: 15 }, fontWeight: 850, lineHeight: 1.25, mt: .5, minHeight: 38 }}>{product.name}</Typography><Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between", mt: "auto", pt: 1.25 }}><Typography color="primary.main" sx={{ fontSize: { xs: 17, sm: 20 }, fontWeight: 950 }}>{money(product.price)}</Typography>{!product.unlimitedStock && <Typography color="text.secondary" sx={{ fontSize: 10 }}>{product.stock} available</Typography>}</Stack><Stack direction="row" spacing={.75} sx={{ mt: 1.25 }}><Button onClick={onOpen} size="small" sx={{ borderColor: "divider", color: "text.primary", flex: 1, minWidth: 0 }} variant="outlined">View</Button><AddButton added={added} label="Add" onAdd={onAdd} sx={{ flex: 1, minWidth: 0, whiteSpace: "nowrap" }} /></Stack></CardContent></Card>;
}

function CorporateCard({ product, added, onAdd, onOpen }: CardProps) {
  return <Card sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 0, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", transition: "border-color .25s, box-shadow .25s, transform .25s", "&:hover": { borderColor: "primary.main", boxShadow: "0 14px 30px rgba(23,48,68,.1)", transform: "translateY(-3px)" } }}><ProductImage height={240} onOpen={onOpen} product={product} surface="#edf2f5" /><CardContent sx={{ display: "flex", flex: 1, flexDirection: "column", minHeight: 205, p: { xs: 1.75, md: 2 } }}><Typography color="text.secondary" sx={{ fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase" }}>{product.category}</Typography><Typography onClick={onOpen} component="h3" sx={{ color: "text.primary", cursor: "pointer", fontSize: { xs: 16, md: 18 }, fontWeight: 900, lineHeight: 1.3, mt: .75, minHeight: 47 }}>{product.name}</Typography><Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between", mt: "auto", minHeight: 34, pt: 1.5 }}><Typography color="text.primary" sx={{ fontSize: { xs: 17, md: 19 }, fontWeight: 950 }}>{money(product.price)}</Typography>{!product.unlimitedStock && <Typography color="text.secondary" sx={{ fontSize: 11 }}>{product.stock} available</Typography>}</Stack><Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.5 }}><Button fullWidth onClick={onOpen} size="small" sx={{ borderColor: "divider", color: "text.primary", flex: 1, minHeight: 38 }} variant="outlined">View details</Button><AddButton added={added} label="Add" onAdd={onAdd} sx={{ flex: 1, minHeight: 38, whiteSpace: "nowrap" }} /></Stack></CardContent></Card>;
}
