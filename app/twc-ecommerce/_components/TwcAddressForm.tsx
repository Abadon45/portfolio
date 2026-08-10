"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Autocomplete, Alert, Box, Button, Grid, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import addressResponse from "../_data/ph-addresses.json";

export type TwcAddressValues = {
  name: string;
  last_name: string;
  mobile: string;
  email: string;
  address: string;
  province: string;
  city: string;
  barangay: string;
  landmark: string;
  notes: string;
};

const directory = Object.fromEntries(addressResponse.addresses.map((province) => [province.province, Object.fromEntries(province.cities.map((city) => [city.city, city.barangays]))])) as Record<string, Record<string, string[]>>;
const empty: TwcAddressValues = { name: "", last_name: "", mobile: "", email: "", address: "", province: "", city: "", barangay: "", landmark: "", notes: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeMobile = (value: string) => { let digits = value.replace(/\D/g, ""); if (digits.startsWith("63")) digits = digits.slice(2); if (digits.startsWith("0")) digits = digits.slice(1); return digits.slice(0, 10); };
const displayMobile = (value: string) => value.length === 10 ? `${value.slice(0, 3)}  ${value.slice(3, 6)}  ${value.slice(6)}` : value;

export default function TwcAddressForm({ initialData, onSubmit, submitting = false }: { initialData?: Partial<TwcAddressValues>; onSubmit: (values: TwcAddressValues & { number: string }) => void; submitting?: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...empty, ...initialData });
  const [error, setError] = useState("");
  const provinces = Object.keys(directory);
  const cities = useMemo(() => Object.keys(directory[form.province] ?? {}), [form.province]);
  const barangays = useMemo(() => directory[form.province]?.[form.city] ?? [], [form.province, form.city]);

  useEffect(() => { if (!cities.includes(form.city)) setForm((current) => ({ ...current, city: cities[0] ?? "", barangay: "" })); }, [cities, form.city]);
  useEffect(() => { if (!barangays.includes(form.barangay)) setForm((current) => ({ ...current, barangay: "" })); }, [barangays, form.barangay]);
  const set = (key: keyof TwcAddressValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setError(""); setForm((current) => ({ ...current, [key]: event.target.value })); };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const localMobile = normalizeMobile(form.mobile);
    if (!form.name.trim() || !form.last_name.trim() || !form.address.trim() || !form.province || !form.city || !form.barangay || !form.landmark.trim()) return setError("Please complete the required shipping fields.");
    if (localMobile.length !== 10 || !localMobile.startsWith("9")) return setError("Please enter a valid 10-digit PH mobile number.");
    if (form.email && !emailPattern.test(form.email)) return setError("Please enter a valid email address.");
    onSubmit({ ...form, mobile: `+63${localMobile}`, number: `+63${localMobile}`, name: form.name.trim(), last_name: form.last_name.trim(), address: form.address.trim(), landmark: form.landmark.trim(), notes: form.notes.trim(), email: form.email.trim() });
  };
  const success = (value: string) => Boolean(value.trim());
  return <Paper component="form" onSubmit={submit} variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
    <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 800 }}>Shipping address</Typography>
    <Typography color="text.secondary" sx={{ mt: .75, mb: 2.5 }}>Select your location from the same cascading address flow used in the source app.</Typography>
    {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}
    <Grid container spacing={2}>
      {([["name", "First name"], ["last_name", "Last name"]] as const).map(([key, label]) => <Grid key={key} size={{ xs: 12, sm: 6 }}><TextField fullWidth required disabled={submitting} label={label} value={form[key]} onChange={set(key)} slotProps={{ input: { endAdornment: success(form[key]) ? <InputAdornment position="end"><CheckCircleRoundedIcon color="success" fontSize="small" /></InputAdornment> : undefined } }} /></Grid>)}
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth required disabled={submitting} label="Phone number" value={displayMobile(normalizeMobile(form.mobile))} onChange={(event) => { setError(""); setForm((current) => ({ ...current, mobile: event.target.value })); }} helperText="Enter 0917, +63917, or 917 format" slotProps={{ input: { startAdornment: <InputAdornment position="start">+63</InputAdornment>, endAdornment: normalizeMobile(form.mobile).length === 10 ? <InputAdornment position="end"><CheckCircleRoundedIcon color="success" fontSize="small" /></InputAdornment> : undefined } }} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth disabled={submitting} label="Email (optional)" value={form.email} onChange={set("email")} /></Grid>
      <Grid size={12}><TextField fullWidth required disabled={submitting} label="Address" multiline minRows={2} value={form.address} onChange={set("address")} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><Autocomplete disablePortal options={provinces} value={form.province} onChange={(_, value) => setForm((current) => ({ ...current, province: value ?? "", city: "", barangay: "" }))} renderInput={(params) => <TextField {...params} required label="Province" />} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><Autocomplete disablePortal disabled={!form.province} options={cities} value={form.city || null} onChange={(_, value) => setForm((current) => ({ ...current, city: value ?? "", barangay: "" }))} renderInput={(params) => <TextField {...params} required label="City" />} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><Autocomplete disablePortal disabled={!form.city} options={barangays} value={form.barangay || null} onChange={(_, value) => setForm((current) => ({ ...current, barangay: value ?? "" }))} renderInput={(params) => <TextField {...params} required label="Barangay" />} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth disabled label="Country" value="Philippines" /></Grid>
      <Grid size={12}><TextField fullWidth required disabled={submitting} label="Landmark" multiline minRows={2} value={form.landmark} onChange={set("landmark")} /></Grid>
      <Grid size={12}><TextField fullWidth disabled={submitting} label="Shipping notes (optional)" multiline minRows={2} value={form.notes} onChange={set("notes")} /></Grid>
    </Grid>
    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mt: 2, gap: 1 }}>
      <Button type="button" onClick={() => router.push("/twc-ecommerce/shop")} startIcon={<ArrowBackRoundedIcon />} sx={{ color: "text.secondary" }}>Shop more</Button>
      <Button type="submit" disabled={submitting} endIcon={<ArrowForwardRoundedIcon />} variant="contained">{submitting ? "Saving address..." : "Continue to payment"}</Button>
    </Stack>
  </Paper>;
}
