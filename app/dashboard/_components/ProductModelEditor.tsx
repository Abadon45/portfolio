"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTwcAlert } from "../../components/portfolio/TwcAlertSystem";
import type { StoreProductModel } from "../../../lib/storeProductRepository";

type ProductDraft = {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category1: string;
  category2: string;
  category: string;
  shop: string;
  customerPrice: string;
  description1: string;
  description2: string;
  advantage: string;
  feature: string;
  specification: string;
  images: string;
  sourceQuantity: string;
  stock: string;
  unlimitedStock: boolean;
  sourceProductId: string;
  status: StoreProductModel["status"];
  currency: string;
  compareAtPrice: string;
  weightGrams: string;
  shippingProfile: string;
  minimumOrderQuantity: string;
  maximumOrderQuantity: string;
  isFeatured: boolean;
  forVirtualWarehouse: boolean;
  sortOrder: string;
  seoTitle: string;
  seoDescription: string;
};

const emptyDraft: ProductDraft = {
  slug: "", sku: "", name: "", brand: "", category1: "Beauty", category2: "Beauty", category: "Beauty", shop: "TWC Store",
  customerPrice: "0", description1: "", description2: "", advantage: "", feature: "", specification: "", images: "",
  sourceQuantity: "0", stock: "99", unlimitedStock: false, sourceProductId: "", status: "draft", currency: "PHP", compareAtPrice: "",
  weightGrams: "", shippingProfile: "", minimumOrderQuantity: "1", maximumOrderQuantity: "", isFeatured: false, forVirtualWarehouse: false, sortOrder: "0", seoTitle: "", seoDescription: "",
};

function toDraft(product: StoreProductModel): ProductDraft {
  return {
    slug: product.slug, sku: product.sku, name: product.name, brand: product.brand || "", category1: product.category1, category2: product.category2, category: product.category, shop: product.shop,
    customerPrice: String(product.price), description1: product.description, description2: product.description2 || "", advantage: product.advantage || "", feature: product.feature || "", specification: product.specification || "", images: product.images.join("\n"),
    sourceQuantity: String(product.sourceQuantity), stock: product.stock === null ? "" : String(product.stock), unlimitedStock: product.unlimitedStock, sourceProductId: product.sourceProductId || "", status: product.status, currency: product.currency,
    compareAtPrice: product.compareAtPrice === null ? "" : String(product.compareAtPrice), weightGrams: product.weightGrams === null ? "" : String(product.weightGrams), shippingProfile: product.shippingProfile || "", minimumOrderQuantity: String(product.minimumOrderQuantity), maximumOrderQuantity: product.maximumOrderQuantity === null ? "" : String(product.maximumOrderQuantity),
    isFeatured: product.isFeatured, forVirtualWarehouse: product.forVirtualWarehouse, sortOrder: String(product.sortOrder), seoTitle: product.seoTitle || "", seoDescription: product.seoDescription || "",
  };
}

function payloadFromDraft(draft: ProductDraft) {
  return {
    ...draft,
    images: draft.images.split("\n").map((value) => value.trim()).filter(Boolean).slice(0, 10),
    customerPrice: Number(draft.customerPrice), sourceQuantity: Number(draft.sourceQuantity), stock: draft.stock === "" ? null : Number(draft.stock), compareAtPrice: draft.compareAtPrice === "" ? null : Number(draft.compareAtPrice), weightGrams: draft.weightGrams === "" ? null : Number(draft.weightGrams),
    minimumOrderQuantity: Number(draft.minimumOrderQuantity), maximumOrderQuantity: draft.maximumOrderQuantity === "" ? null : Number(draft.maximumOrderQuantity), sortOrder: Number(draft.sortOrder),
  };
}

export default function ProductModelEditor({ initialProducts }: { initialProducts: StoreProductModel[] }) {
  const { toastError, toastSuccess } = useTwcAlert();
  const [products, setProducts] = useState(initialProducts);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const filtered = useMemo(() => products.filter((product) => `${product.name} ${product.brand || ""} ${product.sku}`.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const startNew = () => { setEditingSlug(null); setDraft(emptyDraft); };
  const edit = (product: StoreProductModel) => { setEditingSlug(product.slug); setDraft(toDraft(product)); };
  const save = async () => {
    if (!draft.name.trim() || !draft.sku.trim()) { toastError("Product name and SKU are required."); return; }
    setSaving(true);
    try {
      const response = await fetch(editingSlug ? `/api/admin/ecommerce-products/${encodeURIComponent(editingSlug)}` : "/api/admin/ecommerce-products", { body: JSON.stringify(payloadFromDraft(draft)), headers: { "Content-Type": "application/json" }, method: editingSlug ? "PATCH" : "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save product.");
      const saved = data.product as StoreProductModel;
      setProducts((current) => editingSlug ? current.map((product) => product.slug === editingSlug ? saved : product) : [saved, ...current]);
      setEditingSlug(saved.slug); setDraft(toDraft(saved)); toastSuccess(editingSlug ? "Product updated." : "Product created.");
    } catch (error) { toastError(error instanceof Error ? error.message : "Unable to save product."); } finally { setSaving(false); }
  };

  return <Stack spacing={3}>
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "end" }, justifyContent: "space-between" }}>
      <Box><Typography color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".08em" }} variant="overline">ECOMMERCE ADMIN</Typography><Typography component="h1" sx={{ fontWeight: 850 }} variant="h3">Product model</Typography><Typography color="text.secondary">Create and maintain the Neon catalogue, including up to 10 public image URLs per product.</Typography></Box>
      <Button onClick={startNew} startIcon={<AddRoundedIcon />} variant="contained">Add product</Button>
    </Stack>
    <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "minmax(280px, .7fr) minmax(0, 1.3fr)" } }}>
      <Card variant="outlined"><CardContent><TextField fullWidth onChange={(event) => setSearch(event.target.value)} placeholder="Search name, brand, or SKU" value={search} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }} /><Stack divider={<Divider />} sx={{ maxHeight: 700, mt: 2, overflowY: "auto" }}>{filtered.map((product) => <Stack direction="row" key={product.slug} spacing={1.25} sx={{ alignItems: "center", py: 1.25 }}><Box component="img" src={product.image} alt="" sx={{ bgcolor: "action.hover", height: 48, objectFit: "contain", width: 48 }} /><Box sx={{ flex: 1, minWidth: 0 }}><Typography noWrap sx={{ fontSize: 13, fontWeight: 800 }}>{product.name}</Typography><Typography color="text.secondary" noWrap variant="caption">{product.brand || "No brand"} · {product.sku}</Typography></Box><Chip label={product.status} size="small" variant="outlined" /><Button aria-label={`Edit ${product.name}`} onClick={() => edit(product)} size="small"><EditRoundedIcon fontSize="small" /></Button></Stack>)}</Stack><Typography color="text.secondary" sx={{ mt: 2 }} variant="caption">{filtered.length} of {products.length} products</Typography></CardContent></Card>
      <Card variant="outlined"><CardContent><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}><Box><Typography sx={{ fontWeight: 800 }} variant="h6">{editingSlug ? "Edit product" : "New product"}</Typography><Typography color="text.secondary" variant="body2">The storefront reads these fields directly from Neon.</Typography></Box><Button disabled={saving} onClick={save} startIcon={<SaveRoundedIcon />} variant="contained">{saving ? "Saving…" : "Save product"}</Button></Stack><Divider sx={{ mb: 3 }} /><Stack spacing={2}>
        <SectionTitle title="Identity and merchandising" /><FieldGrid><TextField fullWidth label="Product name" onChange={(event) => set("name", event.target.value)} value={draft.name} /><TextField fullWidth label="SKU" onChange={(event) => set("sku", event.target.value)} value={draft.sku} /><TextField disabled={Boolean(editingSlug)} fullWidth helperText={editingSlug ? "Slug is stable after creation." : "Optional; generated from name and SKU."} label="Slug" onChange={(event) => set("slug", event.target.value)} value={draft.slug} /><TextField fullWidth label="Brand" onChange={(event) => set("brand", event.target.value)} value={draft.brand} /><TextField fullWidth label="Shop" onChange={(event) => set("shop", event.target.value)} value={draft.shop} /><TextField fullWidth label="Currency" onChange={(event) => set("currency", event.target.value)} value={draft.currency} /></FieldGrid><FieldGrid><TextField fullWidth label="Category 1" onChange={(event) => set("category1", event.target.value)} value={draft.category1} /><TextField fullWidth label="Category 2" onChange={(event) => set("category2", event.target.value)} value={draft.category2} /><TextField fullWidth label="Display category" onChange={(event) => set("category", event.target.value)} value={draft.category} /></FieldGrid>
        <SectionTitle title="Price and inventory" /><FieldGrid><TextField fullWidth inputMode="decimal" label="Customer price" onChange={(event) => set("customerPrice", event.target.value)} value={draft.customerPrice} /><TextField fullWidth inputMode="decimal" label="Compare-at price" onChange={(event) => set("compareAtPrice", event.target.value)} value={draft.compareAtPrice} /><TextField fullWidth inputMode="numeric" label="Stock" onChange={(event) => set("stock", event.target.value)} value={draft.stock} /><TextField fullWidth inputMode="numeric" label="Source quantity" onChange={(event) => set("sourceQuantity", event.target.value)} value={draft.sourceQuantity} /><Select fullWidth onChange={(event) => set("status", event.target.value as ProductDraft["status"])} value={draft.status}><MenuItem value="draft">Draft</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="out_of_stock">Out of stock</MenuItem><MenuItem value="archived">Archived</MenuItem></Select></FieldGrid><FieldGrid><TextField fullWidth label="Source product ID" onChange={(event) => set("sourceProductId", event.target.value)} value={draft.sourceProductId} /><TextField fullWidth label="Minimum order quantity" onChange={(event) => set("minimumOrderQuantity", event.target.value)} value={draft.minimumOrderQuantity} /><TextField fullWidth label="Maximum order quantity" onChange={(event) => set("maximumOrderQuantity", event.target.value)} value={draft.maximumOrderQuantity} /><TextField fullWidth label="Sort order" onChange={(event) => set("sortOrder", event.target.value)} value={draft.sortOrder} /></FieldGrid><FormControlLabel control={<Checkbox checked={draft.unlimitedStock} onChange={(event) => set("unlimitedStock", event.target.checked)} />} label="Unlimited stock" />
        <SectionTitle title="Content" /><TextField fullWidth multiline label="Description" minRows={4} onChange={(event) => set("description1", event.target.value)} value={draft.description1} /><TextField fullWidth multiline label="Additional description" minRows={3} onChange={(event) => set("description2", event.target.value)} value={draft.description2} /><FieldGrid><TextField fullWidth label="Advantages" onChange={(event) => set("advantage", event.target.value)} value={draft.advantage} /><TextField fullWidth label="Features" onChange={(event) => set("feature", event.target.value)} value={draft.feature} /></FieldGrid><TextField fullWidth multiline label="Specifications / details" minRows={4} onChange={(event) => set("specification", event.target.value)} value={draft.specification} />
        <SectionTitle title="Images" /><Alert severity="info">Add one public image URL per line. The first image is primary; up to 10 are saved.</Alert><TextField fullWidth multiline label="Image URLs" minRows={5} onChange={(event) => set("images", event.target.value)} value={draft.images} />
        <SectionTitle title="Delivery and visibility" /><FieldGrid><TextField fullWidth label="Shipping profile" onChange={(event) => set("shippingProfile", event.target.value)} value={draft.shippingProfile} /><TextField fullWidth label="Weight (grams)" onChange={(event) => set("weightGrams", event.target.value)} value={draft.weightGrams} /></FieldGrid><Stack direction={{ xs: "column", sm: "row" }}><FormControlLabel control={<Checkbox checked={draft.isFeatured} onChange={(event) => set("isFeatured", event.target.checked)} />} label="Featured product" /><FormControlLabel control={<Checkbox checked={draft.forVirtualWarehouse} onChange={(event) => set("forVirtualWarehouse", event.target.checked)} />} label="Virtual warehouse" /></Stack>
        <SectionTitle title="SEO" /><TextField fullWidth label="SEO title" onChange={(event) => set("seoTitle", event.target.value)} value={draft.seoTitle} /><TextField fullWidth multiline label="SEO description" minRows={3} onChange={(event) => set("seoDescription", event.target.value)} value={draft.seoDescription} />
      </Stack></CardContent></Card>
    </Box>
  </Stack>;
}

function SectionTitle({ title }: { title: string }) { return <Typography color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".08em", mt: 1 }} variant="overline">{title}</Typography>; }
function FieldGrid({ children }: { children: React.ReactNode }) { return <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>{children}</Box>; }
