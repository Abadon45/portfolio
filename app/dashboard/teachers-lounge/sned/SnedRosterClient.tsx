"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Box, Breadcrumbs, Card, CardActionArea, CardContent, Chip, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import type { SnedItem } from "../../../../lib/snedLearning";

export default function SnedRosterClient({ language, category, items }: { language: "asl" | "fsl"; category: string; items: SnedItem[] }) {
  const [query, setQuery] = useState("");
  const filteredItems = useMemo(() => items.filter((item) => item.word.toLowerCase().includes(query.trim().toLowerCase())), [items, query]);
  const categoryName = items[0]?.categoryName ?? category;
  return <Stack spacing={3}>
    <Breadcrumbs aria-label="Breadcrumbs"><Link href="/dashboard/teachers-lounge/sned">SNED</Link><Link href={`/dashboard/teachers-lounge/sned/sign-language/${language}`}>{language.toUpperCase()}</Link><Typography color="text.primary">{categoryName}</Typography></Breadcrumbs>
    <Box><Typography color="primary.main" sx={{ fontWeight: 800, letterSpacing: "0.08em" }} variant="overline">{language.toUpperCase()} / {categoryName.toUpperCase()}</Typography><Typography component="h1" sx={{ fontWeight: 850 }} variant="h3">Visual roster</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Select an image to open the focused learning view.</Typography></Box>
    <TextField value={query} onChange={(event) => setQuery(event.target.value)} label="Search sign language" placeholder="Search words" slotProps={{ htmlInput: { "aria-label": "Search sign language words" }, input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> } }} />
    <Typography color="text.secondary" variant="body2">Showing {filteredItems.length} of {items.length} lessons</Typography>
    <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(5, minmax(0, 1fr))" } }}>
      {filteredItems.map((item) => <Card key={item.id} variant="outlined" sx={{ overflow: "hidden", transition: "transform 160ms ease, box-shadow 160ms ease", "&:hover": { boxShadow: 4, transform: "translateY(-2px)" }, "&:focus-within": { outline: "2px solid", outlineColor: "primary.main" } }}><CardActionArea component={Link} href={`/dashboard/teachers-lounge/sned/sign-language/${language}/${category}/${item.slug}`} sx={{ height: "100%" }}>
        <Box sx={{ alignItems: "center", bgcolor: "action.hover", display: "flex", minHeight: { xs: 130, sm: 160 }, justifyContent: "center", position: "relative" }}>{item.imageUrl ? <Box component="img" src={item.imageUrl} alt={item.imageAlt} sx={{ height: "100%", objectFit: "cover", position: "absolute", width: "100%" }} /> : <Typography aria-label={item.imageAlt} sx={{ color: "primary.main", fontSize: { xs: "3.25rem", sm: "4.5rem" }, fontWeight: 900 }}>{item.word.length <= 2 ? item.word : "✋"}</Typography>}{item.learned && <Chip icon={<CheckCircleRoundedIcon />} label="Learned" color="success" size="small" sx={{ bgcolor: "background.paper", position: "absolute", right: 8, top: 8 }} />}</Box>
        <CardContent sx={{ p: 1.5 }}><Typography noWrap sx={{ fontWeight: 800 }}>{item.word}</Typography><Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary", mt: 0.5 }}><PlayCircleOutlineRoundedIcon fontSize="small" /><Typography variant="caption">Learn sign</Typography></Stack></CardContent>
      </CardActionArea></Card>)}
    </Box>
    {!filteredItems.length && <Typography color="text.secondary">No lessons match that search.</Typography>}
  </Stack>;
}
