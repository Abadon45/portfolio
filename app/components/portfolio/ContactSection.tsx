import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import { Box, Card, CardContent, Divider, IconButton, Link as MuiLink, Stack, Tooltip, Typography } from "@mui/material";
import type { ContactLink } from "../../data/portfolio";
import { contactLinks } from "../../data/portfolio";
import { Eyebrow } from "./Eyebrow";
import { SectionMotion } from "./SectionMotion";
import { listItemVariant, staggerContainer } from "./styles";

const contactIcons = {
  Email: EmailIcon,
  Phone: PhoneIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Demo: PublicIcon,
} satisfies Record<ContactLink["label"], typeof EmailIcon>;

const MotionStack = motion.create(Stack);
const MotionMuiLink = motion.create(MuiLink);

type ContactSectionProps = {
  isDark: boolean;
};

export function ContactSection({ isDark }: ContactSectionProps) {
  return (
    <SectionMotion amount={0.2}>
      <Card component="section" id="contact" sx={{ bgcolor: isDark ? "#0f172a" : "text.primary", color: "common.white", scrollMarginTop: 96 }}>
        <CardContent sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.9fr) minmax(320px, 1fr)" }, p: { xs: 2.5, md: 4 } }}>
          <Box>
            <Eyebrow color="secondary.main">Contact</Eyebrow>
            <Typography component="h2" variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.7rem" } }}>
              Available for full stack, frontend architecture, and remote platform work.
            </Typography>
          </Box>
          <MotionStack spacing={1} variants={staggerContainer}>
            {contactLinks.map((link) => {
              const Icon = contactIcons[link.label];

              return (
                <MotionMuiLink
                  href={link.href}
                  key={link.label}
                  rel="noreferrer"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  underline="none"
                  variants={listItemVariant}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  sx={{
                    alignItems: "center",
                    bgcolor: "rgba(255,255,255,0.07)",
                    border: 1,
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: 2,
                    color: "common.white",
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: "40px minmax(0, 1fr)",
                    p: 1.25,
                    transition: "transform 200ms ease, bgcolor 200ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <Tooltip title={link.label}>
                    <IconButton aria-label={link.label} size="small" sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "common.white" }}>
                      <Icon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.58)", fontSize: "0.78rem", fontWeight: 850, textTransform: "uppercase" }}>
                      {link.label}
                    </Typography>
                    <Typography component="strong" sx={{ display: "block", fontWeight: 850, overflowWrap: "anywhere" }}>
                      {link.value}
                    </Typography>
                  </Box>
                </MotionMuiLink>
              );
            })}
          </MotionStack>
        </CardContent>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      </Card>
    </SectionMotion>
  );
}
