"use client";

import Link from "next/link";
import { useState } from "react";
import { Box, Breadcrumbs, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import type { SnedItem } from "../../../../lib/snedLearning";
import { useTwcAlert } from "../../../components/portfolio/TwcAlertSystem";

export default function SnedLessonClient({ lesson, previous, next }: { lesson: SnedItem; previous: SnedItem | null; next: SnedItem | null }) {
  const [learned, setLearned] = useState(lesson.learned);
  const [saving, setSaving] = useState(false);
  const { toastError, toastSuccess } = useTwcAlert();
  const categoryPath = `/dashboard/teachers-lounge/sned/sign-language/${lesson.languageCode}/${lesson.categorySlug}`;

  async function markLearned() {
    if (learned || saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/sned/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ itemId: lesson.id }) });
      if (!response.ok) throw new Error("Unable to save progress");
      setLearned(true);
      toastSuccess(`${lesson.word} marked as learned.`);
    } catch {
      toastError("We could not save your progress. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return <Stack spacing={3}>
    <Breadcrumbs aria-label="Breadcrumbs"><Link href="/dashboard/teachers-lounge/sned">SNED</Link><Link href={`/dashboard/teachers-lounge/sned/sign-language/${lesson.languageCode}`}>{lesson.languageCode.toUpperCase()}</Link><Link href={categoryPath}>{lesson.categoryName}</Link><Typography color="text.primary">{lesson.word}</Typography></Breadcrumbs>
    <Button component={Link} href={categoryPath} startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: "flex-start" }}>Back to {lesson.categoryName}</Button>
    <Stack spacing={1} sx={{ alignItems: "center", textAlign: "center" }}><Typography color="primary.main" sx={{ fontWeight: 800, letterSpacing: "0.08em" }} variant="overline">{lesson.languageCode.toUpperCase()} / {lesson.categoryName.toUpperCase()}</Typography><Typography component="h1" sx={{ fontWeight: 900 }} variant="h2">{lesson.word}</Typography><Typography color="text.secondary">{lesson.position} of {lesson.totalInCategory}</Typography></Stack>
    <Card variant="outlined"><CardContent sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ alignItems: "center", bgcolor: "action.hover", borderRadius: 2, display: "flex", minHeight: { xs: 220, sm: 330 }, justifyContent: "center", overflow: "hidden", position: "relative" }}>{lesson.imageUrl ? <Box component="img" src={lesson.imageUrl} alt={lesson.imageAlt} sx={{ height: "100%", objectFit: "contain", position: "absolute", width: "100%" }} /> : <Stack spacing={1} sx={{ alignItems: "center", color: "primary.main" }}><Typography sx={{ fontSize: { xs: "6rem", sm: "8rem" }, fontWeight: 900, lineHeight: 1 }}>{lesson.word.length <= 2 ? lesson.word : "✋"}</Typography><Typography color="text.secondary" variant="caption">Demo visual — approved media not supplied</Typography></Stack>}</Box>
      <Stack spacing={1.5} sx={{ mt: 3 }}><Typography sx={{ fontWeight: 800 }} variant="h6">Watch the sign, then practice</Typography>{lesson.videoUrl ? <Box component="video" controls preload="metadata" src={lesson.videoUrl} sx={{ borderRadius: 1, display: "block", maxHeight: 460, width: "100%" }} aria-label={`${lesson.word} sign language demonstration`} /> : <Box sx={{ alignItems: "center", bgcolor: "action.hover", border: 1, borderColor: "divider", borderRadius: 1, display: "flex", gap: 1.5, p: 2 }}><PlayCircleOutlineRoundedIcon color="disabled" /><Typography color="text.secondary">Video unavailable. Add an approved uploaded or external video before publishing this lesson.</Typography></Box>}{lesson.videoProvider && <Typography color="text.secondary" variant="caption">Video source: {lesson.videoProvider}</Typography>}<Typography color="text.secondary">{lesson.description}</Typography></Stack>
    </CardContent></Card>
    <LinearProgress aria-label={`Lesson progress: ${lesson.position} of ${lesson.totalInCategory}`} variant="determinate" value={(lesson.position / lesson.totalInCategory) * 100} />
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button component={Link} disabled={!previous} href={previous ? `${categoryPath}/${previous.slug}` : "#"} startIcon={<ArrowBackRoundedIcon />} variant="outlined">Previous</Button><Button color={learned ? "success" : "primary"} disabled={saving || learned} onClick={markLearned} startIcon={<CheckCircleRoundedIcon />} variant="contained">{saving ? "Saving…" : learned ? "Learned" : "Mark as learned"}</Button><Button component={Link} disabled={!next} href={next ? `${categoryPath}/${next.slug}` : "#"} endIcon={<ArrowForwardRoundedIcon />} variant="outlined">Next</Button></Stack>
    {learned && <Chip icon={<CheckCircleRoundedIcon />} label="Progress saved to your account" color="success" sx={{ alignSelf: "center" }} />}
  </Stack>;
}
