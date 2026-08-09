"use client";

import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ThemeToggle from "./ThemeToggle";

export default function SiteNav({
  onAssessment,
}: {
  onAssessment: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateNavbar = () => setScrolled(window.scrollY > 72);

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    return () => window.removeEventListener("scroll", updateNavbar);
  }, []);

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: scrolled ? "background.paper" : "transparent",
        color: "text.primary",
        borderBottom: scrolled ? 1 : 0,
        borderColor: "divider",
        boxShadow: scrolled ? 2 : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition:
          "background-color .25s ease, box-shadow .25s ease, border-color .25s ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 92, gap: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexGrow: 1, alignItems: "center" }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: "50%",
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                fontSize: 22,
              }}
            >
              ☼
            </Box>
            <Typography
              sx={{ fontWeight: 800, letterSpacing: "-.06em", fontSize: 21 }}
            >
              Cotabato<span style={{ color: "#72b635" }}>Solar</span>
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button href="#services" color="inherit">
              Services
            </Button>
            <Button href="#whyus" color="inherit">
              Why us
            </Button>
            <Button href="#testimonials" color="inherit">
              Testimonials
            </Button>
            <Button href="#contact" color="inherit">
              Contact
            </Button>
          </Stack>
          <ThemeToggle />
          <Button
            onClick={onAssessment}
            variant="contained"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: 99,
            }}
          >
            Talk to our team ↗
          </Button>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            aria-label="Open navigation"
          >
            ☰
          </IconButton>
        </Toolbar>
      </Container>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }} role="presentation">
          <Typography variant="overline" color="text.secondary" sx={{ px: 2 }}>
            Navigate
          </Typography>
          <List>
            {[
              ["Services", "#services"],
              ["How it works", "#process"],
              ["Why us", "#whyus"],
              ["Testimonials", "#testimonials"],
              ["Estimate savings", "#estimate"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  component="a"
                  href={href}
                  onClick={() => setMobileOpen(false)}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setMobileOpen(false);
              onAssessment();
            }}
          >
            Talk to our team ↗
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}
