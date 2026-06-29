import { motion } from "framer-motion";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { SectionHeading } from "./SectionHeading";
import { SectionMotion } from "./SectionMotion";
import { fadeUp } from "./styles";

export function SummarySection() {
  return (
    <SectionMotion amount={0.08}>
      <Box component="section" sx={{ mb: { xs: 7, md: 10 } }}>
        <SectionHeading eyebrow="Professional Summary" title="Systems-minded full stack development" />
        <motion.div variants={fadeUp}>
          <Card sx={{ bgcolor: "background.paper", borderLeft: 5, borderLeftColor: "warning.main", boxShadow: "0 10px 40px rgba(23, 32, 51, 0.05)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, "&:last-child": { pb: { xs: 2.5, md: 3.5 } } }}>
              <Typography color="text.secondary" sx={{ fontSize: "1.06rem", lineHeight: 1.72 }}>
                Full Stack Web Developer specializing in Next.js, React, TypeScript, and
                Django, with frontend-architecture experience across large-scale SaaS and
                e-commerce platforms. Architected and developed a modern Next.js frontend
                for a multi-tenant platform serving 60,000+ registered users, spanning
                authentication, API integrations, checkout workflows, and theming
                infrastructure. A former product and IT operations professional, I bring
                strong systems thinking and end-to-end ownership of software delivery.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </SectionMotion>
  );
}
