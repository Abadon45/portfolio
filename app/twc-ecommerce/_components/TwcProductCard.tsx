"use client";

import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
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

function AddButton({ added, onAdd, label = "Add to basket" }: { added: boolean; onAdd: () => void; label?: string }) {
  return <Button disabled={added} onClick={onAdd} startIcon={added ? <CheckRoundedIcon /> : <AddShoppingCartRoundedIcon />} variant="contained">{added ? "Added" : label}</Button>;
}

function ProductImage({ product, onOpen, height = 260, alt = product.name, surface = "action.hover" }: { product: StoreProduct; onOpen: () => void; height?: number; alt?: string; surface?: string }) {
  return <Box role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(); } }} aria-label={`View ${product.name}`} sx={{ bgcolor: surface, cursor: "pointer", height, overflow: "hidden", position: "relative", "&:focus-visible": { outline: 2, outlineColor: "primary.main", outlineOffset: -2 } }}><Box component="img" src={product.image} alt={alt} loading="lazy" sx={{ height: "100%", objectFit: "contain", p: { xs: 1.5, md: 2 }, transition: "transform .45s ease", width: "100%", "&:hover": { transform: "scale(1.05)" } }} /></Box>;
}

function PremiumCard({ product, added, onAdd, onOpen }: CardProps) {
  return <Card sx={{ bgcolor: "background.paper", border: 1, borderColor: "rgba(139,73,98,.14)", borderRadius: 2, boxShadow: "0 12px 30px rgba(72,33,48,.06)", height: "100%", overflow: "hidden", p: { xs: 1, md: 1.25 }, transition: "box-shadow .3s, transform .3s", "&:hover": { boxShadow: "0 18px 42px rgba(72,33,48,.12)", transform: "translateY(-4px)" } }}><ProductImage height={300} onOpen={onOpen} product={product} surface="#f8efed" /><CardContent sx={{ display: "flex", flexDirection: "column", minHeight: { xs: 150, md: 170 }, p: { xs: 1, sm: 1.5, md: 2 } }}><Typography color="text.secondary" sx={{ fontSize: 10, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>{product.category}</Typography><Typography onClick={onOpen} component="h3" sx={{ cursor: "pointer", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: 17, md: 20 }, fontWeight: 500, lineHeight: 1.2, mt: .75, minHeight: { xs: 42, md: 48 } }}>{product.name}</Typography><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mt: "auto", pt: 1.5 }}><Typography sx={{ fontSize: { xs: 15, md: 17 }, fontWeight: 900 }}>{money(product.price)}</Typography><Button disabled={added} onClick={onAdd} endIcon={<ArrowForwardRoundedIcon />} size="small" sx={{ color: "primary.main", minWidth: 0, px: .5 }}>{added ? "Added" : "Add"}</Button></Stack></CardContent></Card>;
}

function WellnessCard({ product, added, onAdd, onOpen }: CardProps) {
  return <Card sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", height: "100%", overflow: "hidden" }}><ProductImage height={220} onOpen={onOpen} product={product} /><CardContent sx={{ display: "flex", flexDirection: "column", minHeight: 188, p: { xs: 1.5, sm: 2.25 } }}><Chip label={product.category} size="small" sx={{ alignSelf: "flex-start", bgcolor: "action.selected", color: "primary.main", fontWeight: 800 }} /><Typography onClick={onOpen} sx={{ cursor: "pointer", fontSize: 16, fontWeight: 850, lineHeight: 1.3, mt: 1 }}>{product.name}</Typography><Typography color="text.secondary" sx={{ display: "-webkit-box", fontSize: 12, lineHeight: 1.55, mt: .75, overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>{product.description}</Typography><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mt: "auto", pt: 1.5 }}><Typography sx={{ fontSize: 18, fontWeight: 900 }}>{money(product.price)}</Typography>{!product.unlimitedStock && <Typography color="text.secondary" sx={{ fontSize: 11 }}>{product.stock} left</Typography>}</Stack><AddButton added={added} onAdd={onAdd} /></CardContent></Card>;
}

function MarketplaceCard({ product, added, onAdd, onOpen }: CardProps) {
  return <Card sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1, height: "100%", overflow: "hidden" }}><Box sx={{ position: "relative" }}><ProductImage height={205} onOpen={onOpen} product={product} /><Chip label="FEATURED" size="small" sx={{ bgcolor: "secondary.main", color: "#fff", fontSize: 10, fontWeight: 900, left: 8, position: "absolute", top: 8 }} /></Box><CardContent sx={{ p: 1.5 }}><Typography color="text.secondary" sx={{ fontSize: 11, fontWeight: 800 }}>{product.category}</Typography><Typography onClick={onOpen} noWrap sx={{ cursor: "pointer", fontSize: 14, fontWeight: 850, mt: .5 }}>{product.name}</Typography><Stack direction="row" sx={{ alignItems: "baseline", gap: 1, mt: 1 }}><Typography color="primary.main" sx={{ fontSize: 19, fontWeight: 950 }}>{money(product.price)}</Typography>{!product.unlimitedStock && <Typography color="text.secondary" sx={{ fontSize: 10 }}>{product.stock} available</Typography>}</Stack><AddButton added={added} label="Add" onAdd={onAdd} /></CardContent></Card>;
}

function CorporateCard({ product, added, onAdd, onOpen }: CardProps) {
  return <Card sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1, height: "100%", overflow: "hidden" }}><Stack direction="row" sx={{ minHeight: 148 }}><Box sx={{ bgcolor: "action.hover", flex: "0 0 42%" }}><Box component="img" src={product.image} alt={product.name} loading="lazy" sx={{ height: "100%", objectFit: "contain", width: "100%" }} /></Box><CardContent sx={{ display: "flex", flexDirection: "column", minWidth: 0, p: 1.75 }}><Typography color="text.secondary" sx={{ fontSize: 10, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase" }}>{product.category}</Typography><Typography onClick={onOpen} sx={{ cursor: "pointer", fontSize: 14, fontWeight: 850, lineHeight: 1.3, mt: .75 }}>{product.name}</Typography><Typography sx={{ fontSize: 16, fontWeight: 900, mt: "auto" }}>{money(product.price)}</Typography><IconButton aria-label={`Add ${product.name} to basket`} disabled={added} onClick={onAdd} size="small" sx={{ alignSelf: "flex-start", bgcolor: added ? "action.selected" : "primary.main", color: added ? "text.primary" : "primary.contrastText", mt: 1 }}>{added ? <CheckRoundedIcon fontSize="small" /> : <AddShoppingCartRoundedIcon fontSize="small" />}</IconButton></CardContent></Stack></Card>;
}
