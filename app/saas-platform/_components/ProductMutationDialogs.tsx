"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { Product } from "./commerceOsData";

export type ProductDraft = Omit<
  Product,
  | "id"
  | "supplierProductId"
  | "inventoryId"
  | "sold"
  | "revenue"
  | "available"
  | "featured"
  | "reorderQuantity"
  | "commissionRate"
  | "supplierPrice"
>;

const EMPTY_PRODUCT: ProductDraft = {
  name: "",
  sku: "",
  category: "Wellness",
  supplier: "",
  price: 0,
  margin: 0,
  stock: 0,
  reserved: 0,
  reorderPoint: 10,
  status: "Draft",
};

export function ProductEditorDialog({
  open,
  product,
  onClose,
  onSave,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (draft: ProductDraft) => void;
}) {
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_PRODUCT);
  const isEditing = Boolean(product);

  useEffect(() => {
    if (!open) return;
    setDraft(
      product
        ? {
            name: product.name,
            sku: product.sku,
            category: product.category,
            supplier: product.supplier,
            price: product.price,
            margin: product.margin,
            stock: product.stock,
            reserved: product.reserved,
            reorderPoint: product.reorderPoint,
            status: product.status,
          }
        : EMPTY_PRODUCT,
    );
  }, [open, product]);

  const update = <Key extends keyof ProductDraft>(
    key: Key,
    value: ProductDraft[Key],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const isValid =
    draft.name.trim().length > 1 &&
    draft.sku.trim().length > 1 &&
    draft.supplier.trim().length > 1 &&
    draft.price >= 0 &&
    draft.stock >= 0 &&
    draft.reorderPoint >= 0;

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? "Edit product" : "Add product"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            autoFocus
            label="Product name"
            value={draft.name}
            onChange={(event) => update("name", event.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="SKU"
              value={draft.sku}
              onChange={(event) =>
                update("sku", event.target.value.toUpperCase())
              }
            />
            <TextField
              fullWidth
              label="Category"
              value={draft.category}
              onChange={(event) => update("category", event.target.value)}
            />
          </Stack>
          <TextField
            label="Supplier"
            value={draft.supplier}
            onChange={(event) => update("supplier", event.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={draft.price}
              onChange={(event) => update("price", Number(event.target.value))}
              slotProps={{ htmlInput: { min: 0 } }}
            />
            <TextField
              fullWidth
              label="Margin %"
              type="number"
              value={draft.margin}
              onChange={(event) => update("margin", Number(event.target.value))}
              slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={draft.stock}
              onChange={(event) => update("stock", Number(event.target.value))}
              slotProps={{ htmlInput: { min: 0 } }}
            />
            <TextField
              fullWidth
              label="Reorder threshold"
              type="number"
              value={draft.reorderPoint}
              onChange={(event) =>
                update("reorderPoint", Number(event.target.value))
              }
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Stack>
          <FormControl fullWidth>
            <InputLabel id="product-status-label">Product status</InputLabel>
            <Select
              label="Product status"
              labelId="product-status-label"
              value={draft.status}
              onChange={(event) =>
                update("status", event.target.value as Product["status"])
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={!isValid}
          onClick={() => onSave(draft)}
          variant="contained"
        >
          {isEditing ? "Save changes" : "Add product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export type StockMutation = {
  kind: "receive" | "adjust";
  quantity: number;
  reorderPoint: number;
};

export function StockEditorDialog({
  open,
  product,
  onClose,
  onSave,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (mutation: StockMutation) => void;
}) {
  const [kind, setKind] = useState<StockMutation["kind"]>("receive");
  const [quantity, setQuantity] = useState(1);
  const [reorderPoint, setReorderPoint] = useState(0);

  useEffect(() => {
    if (!open || !product) return;
    setKind("receive");
    setQuantity(1);
    setReorderPoint(product.reorderPoint);
  }, [open, product]);

  const resultingStock = product
    ? kind === "receive"
      ? product.stock + quantity
      : Math.max(0, product.stock + quantity)
    : 0;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>Update inventory</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="movement-kind-label">Movement type</InputLabel>
            <Select
              label="Movement type"
              labelId="movement-kind-label"
              value={kind}
              onChange={(event) =>
                setKind(event.target.value as StockMutation["kind"])
              }
            >
              <MenuItem value="receive">Receive stock</MenuItem>
              <MenuItem value="adjust">Adjust stock</MenuItem>
            </Select>
          </FormControl>
          <TextField
            helperText={
              kind === "adjust"
                ? "Use a negative number to reduce stock."
                : undefined
            }
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            slotProps={{
              htmlInput: { min: kind === "receive" ? 1 : undefined },
            }}
          />
          <TextField
            label="Reorder threshold"
            type="number"
            value={reorderPoint}
            onChange={(event) => setReorderPoint(Number(event.target.value))}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField disabled label="Resulting stock" value={resultingStock} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={!product || quantity === 0 || reorderPoint < 0}
          onClick={() => onSave({ kind, quantity, reorderPoint })}
          variant="contained"
        >
          Record movement
        </Button>
      </DialogActions>
    </Dialog>
  );
}
