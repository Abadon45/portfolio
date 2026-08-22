"use client";

import Link from "next/link";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import SignLanguageRoundedIcon from "@mui/icons-material/SignLanguageRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { SnedLanguage } from "../../../../lib/snedLearning";

export default function SnedLandingClient({ languages }: { languages: SnedLanguage[] }) {
  return <Stack spacing={3}>
    <Box>
      <Typography color="primary.main" sx={{ fontWeight: 800, letterSpacing: "0.08em" }} variant="overline">TEACHER&apos;S LOUNGE / SNED</Typography>
      <Typography component="h1" sx={{ fontWeight: 850 }} variant="h3">Sign Language Learning</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>Explore visual vocabulary, watch demonstrations when licensed media is available, and build your own learning progress.</Typography>
    </Box>
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
      <Chip icon={<SignLanguageRoundedIcon />} label="Interactive resource" color="primary" variant="outlined" />
      <Typography color="text.secondary" variant="body2">Choose a sign language to begin.</Typography>
    </Stack>
    <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
      {languages.map((language) => <Card key={language.code} variant="outlined" sx={{ height: "100%" }}><CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ alignItems: "center", bgcolor: "action.selected", borderRadius: 2, color: "primary.main", display: "flex", height: 72, justifyContent: "center", width: 72 }}><Typography sx={{ fontWeight: 900, letterSpacing: "-0.06em" }} variant="h4">{language.code.toUpperCase()}</Typography></Box>
        <Typography sx={{ fontWeight: 800, mt: 2 }} variant="h5">{language.name}</Typography>
        <Typography color="text.secondary" sx={{ flex: 1, mt: 1 }}>{language.description}</Typography>
        <Button component={Link} href={`/dashboard/teachers-lounge/sned/sign-language/${language.code}`} endIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: "flex-start", mt: 2 }} variant="contained">Learn {language.code.toUpperCase()}</Button>
      </CardContent></Card>)}
    </Box>
    <Typography color="text.secondary" variant="caption">Demo entries are clearly labeled until approved image and video media is added by an authorized content manager.</Typography>
  </Stack>;
}
