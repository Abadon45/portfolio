"use client";

import Link from "next/link";
import { Box, Breadcrumbs, Card, CardActionArea, CardContent, LinearProgress, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { SnedCategory } from "../../../../lib/snedLearning";

export default function SnedCategoryBrowser({ language, categories }: { language: "asl" | "fsl"; categories: SnedCategory[] }) {
  return <Stack spacing={3}>
    <Breadcrumbs aria-label="Breadcrumbs"><Link href="/dashboard/teachers-lounge/sned">SNED</Link><Typography color="text.primary">{language.toUpperCase()}</Typography></Breadcrumbs>
    <Box><Typography color="primary.main" sx={{ fontWeight: 800, letterSpacing: "0.08em" }} variant="overline">{language.toUpperCase()} LEARNING</Typography><Typography component="h1" sx={{ fontWeight: 850 }} variant="h3">Choose a category</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Start with a small visual set and return later to continue your progress.</Typography></Box>
    <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" } }}>
      {categories.map((category) => { const progress = category.itemCount ? (category.learnedCount / category.itemCount) * 100 : 0; return <Card key={category.id} variant="outlined"><CardActionArea component={Link} href={`/dashboard/teachers-lounge/sned/sign-language/${language}/${category.slug}`} sx={{ height: "100%" }}><CardContent sx={{ minHeight: 190, p: 2.5 }}><Typography sx={{ fontWeight: 850 }} variant="h5">{category.name}</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>{category.description}</Typography><Typography sx={{ fontWeight: 700, mt: 3 }} variant="body2">{category.learnedCount} / {category.itemCount} learned</Typography><LinearProgress aria-label={`${category.learnedCount} of ${category.itemCount} learned`} variant="determinate" value={progress} sx={{ mt: 1 }} /><Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "primary.main", mt: 2 }}><Typography variant="body2">Open category</Typography><ArrowForwardRoundedIcon fontSize="small" /></Stack></CardContent></CardActionArea></Card>; })}
    </Box>
  </Stack>;
}
