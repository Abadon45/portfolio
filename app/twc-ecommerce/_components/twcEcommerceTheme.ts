import { createTheme, type PaletteMode } from "@mui/material";
import { createPortfolioTheme } from "../../theme/portfolioTheme";

export function createTwcEcommerceTheme(mode: PaletteMode) {
  const portfolioBase = createPortfolioTheme(mode, "classic");
  return createTheme(portfolioBase, {
    palette: {
      mode,
      primary: { main: mode === "dark" ? "#2f7d32" : "#2f7d32", contrastText: "#fff" },
      secondary: { main: "#c47b3d" },
      background: { default: mode === "dark" ? "#101a15" : "#f7faf5", paper: mode === "dark" ? "#17261d" : "#fff" },
      text: { primary: mode === "dark" ? "#f1f8ef" : "#17241e", secondary: mode === "dark" ? "#c2d2c6" : "#476157" },
      divider: mode === "dark" ? "#33503d" : "#d6e1d8",
    },
    components: {
      MuiStack: {
        styleOverrides: {
          root: {
            "&:has(> .MuiButton-root) > .MuiButton-root:last-child": {
              marginLeft: "auto",
            },
          },
        },
      },
    },
  });
}
