"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { Avatar, Box, Button, Checkbox, Divider, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";
import { useTwcStore } from "./TwcStoreProvider";

const money = (value: number) => `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
const titleCase = (value: string) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function TwcCartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { cart, selectedShop, setSelectedShop, activeCheckout, updateQuantity, removeFromCart, clearCart } = useTwcStore();
  const { showModal, toastSuccess, toastInfo } = useTwcAlert();
  const groups = useMemo(() => Object.entries(cart.reduce<Record<string, typeof cart>>((result, line) => {
    const shop = line.product.shop || "TWC Store";
    result[shop] = [...(result[shop] ?? []), line];
    return result;
  }, {})), [cart]);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const selectedTotal = cart.filter((line) => line.product.shop === selectedShop).reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const confirmRemove = async (slug: string, name: string) => {
    const result = await showModal({ title: "Remove item?", content: "You're about to remove this item from your cart.", type: "warning", confirmText: "Remove", cancelText: "Cancel", showCancel: true });
    if (result.action === "confirm") { removeFromCart(slug); toastInfo(`${name} removed from your cart`); }
  };
  const confirmClear = async () => {
    const result = await showModal({ title: "Clear Cart?", content: "This will remove all items from your cart. This cannot be undone.", type: "warning", confirmText: "Yes, clear it", cancelText: "Cancel", showCancel: true });
    if (result.action === "confirm") { clearCart(); toastSuccess("Your cart has been cleared."); }
  };

  return <Drawer anchor="right" open={open} onClose={onClose} transitionDuration={{ enter: 300, exit: 250 }} ModalProps={{ keepMounted: true }} sx={{ zIndex: 1700, "& .MuiDrawer-paper": { width: { xs: "95%", sm: 420, md: 520 }, maxWidth: "95vw", display: "flex", flexDirection: "column", borderTopLeftRadius: { xs: 0, sm: 12 }, borderBottomLeftRadius: { xs: 0, sm: 12 } } }}>
    <Box sx={{ alignItems: "center", bgcolor: "background.paper", borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", px: 2, py: 1.5, position: "sticky", top: 0, zIndex: 2 }}>
      <Box sx={{ alignItems: "center", display: "flex", gap: 1, minWidth: 0 }}><IconButton onClick={() => { onClose(); router.push("/twc-ecommerce/shop"); }} aria-label="Back to shop" sx={{ bgcolor: "action.hover", mr: .5 }}><ArrowBackRoundedIcon /></IconButton><Box sx={{ minWidth: 0 }}><Typography variant="h6" sx={{ fontWeight: 800 }} noWrap>Continue Shopping</Typography><Typography variant="caption" color="text.secondary" noWrap>{itemCount ? `${itemCount} item${itemCount === 1 ? "" : "s"}` : "Your basket is empty."}</Typography></Box></Box>
      {itemCount > 0 && <Button variant="outlined" color="warning" size="small" startIcon={<DeleteSweepRoundedIcon />} onClick={() => void confirmClear()} sx={{ fontWeight: 700, textTransform: "none", borderWidth: 1.5, flexShrink: 0 }}>Clear Basket</Button>}
    </Box>
    {activeCheckout && <Box sx={{ bgcolor: "info.main", color: "info.contrastText", px: 2, py: 1 }}><Typography variant="body2">Unfinished checkout · {activeCheckout.orderNumber}</Typography></Box>}
    <Box sx={{ flex: 1, overflowY: "auto" }}>
      {!groups.length ? <Box sx={{ px: 2, py: 5, textAlign: "center" }}><Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Cart is Empty</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Add some items to get started.</Typography><Button variant="contained" onClick={() => { onClose(); router.push("/twc-ecommerce/shop"); }}>Go back to Shopping</Button></Box> : <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>{groups.map(([shop, items]) => { const isSelected = selectedShop === shop; return <Box key={shop} sx={{ mb: 3, opacity: selectedShop && !isSelected ? .55 : 1 }}><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}><Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}><Checkbox size="small" checked={isSelected} onChange={() => setSelectedShop(isSelected ? null : shop)} sx={{ p: 0 }} /><StorefrontRoundedIcon fontSize="small" /><Typography sx={{ fontWeight: 800 }} noWrap>Shop: {titleCase(shop)}</Typography></Stack><Typography variant="caption" color="text.secondary">{items.reduce((sum, line) => sum + line.quantity, 0)} items</Typography></Stack><Divider sx={{ mb: 1.5 }} /><Stack spacing={1.25}>{items.map((line) => <Box key={line.product.slug} sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 1.25 }}><Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}><Avatar src={line.product.image} alt={line.product.name} variant="rounded" sx={{ bgcolor: "background.default", height: { xs: 56, sm: 64 }, width: { xs: 56, sm: 64 } }} /><Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ fontWeight: 800 }} noWrap>{line.product.name}</Typography>{line.product.sku && <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>SKU: {line.product.sku}</Typography>}<Typography variant="body2" sx={{ fontWeight: 700, mt: .5 }}>{money(line.product.price)}</Typography></Box><Stack direction="row" spacing={.25} sx={{ alignItems: "center" }}><IconButton size="small" disabled={line.quantity <= 1} onClick={() => updateQuantity(line.product.slug, -1)} aria-label="Decrease quantity">−</IconButton><Typography sx={{ minWidth: 24, textAlign: "center" }}>{line.quantity}</Typography><IconButton size="small" onClick={() => updateQuantity(line.product.slug, 1)} aria-label="Increase quantity">+</IconButton><IconButton size="small" onClick={() => void confirmRemove(line.product.slug, line.product.name)} aria-label={`Remove ${line.product.name}`}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton></Stack></Stack></Box>)}</Stack><Box sx={{ borderTop: "1px dashed", borderColor: "divider", mt: 1.5, pt: 1.25 }}><Stack direction="row" sx={{ justifyContent: "space-between" }}><Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Shop total</Typography><Typography sx={{ fontWeight: 900 }}>{money(items.reduce((sum, line) => sum + line.product.price * line.quantity, 0))}</Typography></Stack></Box></Box>; })}</Box>}
    </Box>
    {itemCount > 0 && <><Divider /><Box sx={{ bgcolor: "background.paper", flexShrink: 0, px: 2, py: 2 }}><Stack spacing={1.25} sx={{ mb: 1.5 }}><Stack direction="row" sx={{ justifyContent: "space-between" }}><Typography variant="body2" color="text.secondary">Selected shop total</Typography><Typography sx={{ fontWeight: 800 }}>{money(selectedTotal)}</Typography></Stack>{!selectedShop && <Typography variant="caption" color="warning.main">Select one shop to continue checkout.</Typography>}{activeCheckout && <Typography variant="caption" color="warning.main">You have an unfinished checkout. Resume checkout to complete payment.</Typography>}</Stack><Button fullWidth variant="contained" disabled={!selectedShop} onClick={() => { onClose(); router.push("/twc-ecommerce/checkout"); }}>{activeCheckout ? "Resume Checkout" : "Proceed To Checkout"}</Button></Box></>}
  </Drawer>;
}
