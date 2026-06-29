import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { AppBar, Avatar, Box, Button, Container, IconButton, Link as MuiLink, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import { navItems } from "../../data/portfolio";

type PortfolioAppBarProps = {
  isDark: boolean;
  onScrollToSection: (sectionId: string) => void;
  onScrollToTop: () => void;
  onToggleMode: () => void;
};

export function PortfolioAppBar({ isDark, onScrollToSection, onScrollToTop, onToggleMode }: PortfolioAppBarProps) {
  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="sticky"
      sx={{
        backdropFilter: "blur(16px)",
        bgcolor: isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(251, 252, 255, 0.88)",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1.5, sm: 2 },
            justifyContent: "space-between",
            py: { xs: 1.5, sm: 0 },
          }}
        >
          <MuiLink
            component="button"
            underline="none"
            aria-label="Back to top"
            onClick={onScrollToTop}
            sx={{
              alignItems: "center",
              bgcolor: "transparent",
              border: 0,
              color: "text.primary",
              cursor: "pointer",
              display: "inline-flex",
              font: "inherit",
              gap: 1.5,
              p: 0,
              textAlign: "left",
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", borderRadius: 2, color: "primary.contrastText", fontSize: "0.78rem", fontWeight: 850 }}>
              EP
            </Avatar>
            <Box>
              <Typography component="strong" sx={{ display: "block", fontWeight: 850, lineHeight: 1.1 }}>
                Emmanuel "Noy" Pangan
              </Typography>
              <Typography color="text.secondary" component="small" sx={{ display: "block", mt: 0.25 }}>
                Full Stack Web Developer
              </Typography>
            </Box>
          </MuiLink>

          <Stack
            component="nav"
            aria-label="Primary navigation"
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: "center",
              maxWidth: "100%",
              overflowX: "auto",
              pb: { xs: 0.5, sm: 0 },
            }}
          >
            {navItems.map((item) => (
              <Button
                color="inherit"
                key={item.href}
                onClick={() => onScrollToSection(item.href.replace("#", ""))}
                size="small"
                sx={{ color: "text.secondary", whiteSpace: "nowrap", transition: "transform 150ms ease", "&:hover": { transform: "scale(1.03)" } }}
              >
                {item.label}
              </Button>
            ))}
            <Tooltip title={`Switch to ${isDark ? "light" : "dark"} mode`}>
              <IconButton
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                color="primary"
                onClick={onToggleMode}
                size="small"
                sx={{
                  aspectRatio: "1 / 1",
                  bgcolor: "action.hover",
                  flexShrink: 0,
                  height: 36,
                  ml: 0.5,
                  minHeight: 36,
                  p: 0,
                  width: 36,
                  "&:hover": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
