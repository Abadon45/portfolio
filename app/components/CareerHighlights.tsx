"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Typography } from "@mui/material";

export function CareerHighlights() {
  const highlights = [
    ["60,000+", "registered users served by the modernized platform"],
    ["38", "drag-and-drop storefront builder blocks maintained"],
    ["2024-2026", "Next.js and Django platform engineering at TWC IT Solutions"],
  ];

  return (
    <AnimatePresence>
      <motion.div
        aria-label="Career highlights"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr",
          marginBottom: "2rem",
        }}
      >
        {highlights.map(([value, label], idx) => (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.65, delay: idx * 0.12 }}
            whileHover={{ y: -4 }}
            style={{
              border: "1px solid var(--mui-palette-divider, #d8e0ea)",
              borderRadius: 8,
              boxShadow: "0 10px 40px rgba(23, 32, 51, 0.05)",
              padding: "20px",
              minHeight: 144,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              color="primary.dark"
              component="strong"
              sx={{
                display: "block",
                fontSize: { xs: "2rem", md: "2.7rem" },
                fontWeight: 850,
                lineHeight: 1,
                mb: 1,
              }}
            >
              {value}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.45 }}>
              {label}
            </Typography>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
