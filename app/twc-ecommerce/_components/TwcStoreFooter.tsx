"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useStorefrontMode, useStorefrontTheme } from "./twcEcommerceTheme";

const groups = {
  minimal: [
    ["Explore", "Shop", "Collections", "Our story"],
    ["Connect", "Instagram", "Support", "Newsletter"],
  ],
  wellness: [
    [
      "Wellness",
      "Barley & nutrition",
      "Beauty & self-care",
      "Everyday essentials",
    ],
    ["Support", "FAQs", "Shipping", "Contact us"],
    ["About", "Our story", "Trust & quality", "Join the community"],
  ],
  marketplace: [
    ["Shop", "All products", "New arrivals", "Best sellers", "Deals"],
    ["Customer service", "Help center", "Shipping", "Returns"],
    ["Your account", "Orders", "Saved items", "Basket"],
  ],
  corporate: [
    ["Company", "About TWC", "Collections", "Partners"],
    ["Products", "Wellness", "Lifestyle", "Technology"],
    ["Resources", "Support", "FAQs", "Contact"],
  ],
} as const;

export default function TwcStoreFooter() {
  const { themeConfig } = useStorefrontTheme();
  const footerVariant = themeConfig.footerVariant;
  if (footerVariant === "minimal") return <PremiumFooter />;
  if (footerVariant === "wellness") return <WellnessFooter />;
  if (footerVariant === "marketplace") return <MarketplaceFooter />;
  if (footerVariant === "corporate") return <CorporateFooter />;
  const footerGroups = groups.corporate;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: themeConfig.heroText,
        color: "#fff",
        mt: { xs: 6, md: 10 },
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              sx={{
                color: themeConfig.accent,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: ".14em",
              }}
            >
              TWC ONLINE
            </Typography>
            <Typography
              component="h2"
              sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, mt: 1 }}
            >
              A storefront framework for better everyday commerce.
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,.7)",
                lineHeight: 1.7,
                maxWidth: 430,
                mt: 1.5,
              }}
            >
              An offline portfolio reconstruction demonstrating shared commerce
              components across distinct storefront identities.
            </Typography>
          </Grid>
          {footerGroups.map(([title, ...links]) => (
            <Grid key={title} size={{ xs: 6, md: 2 }}>
              <Typography
                sx={{
                  color: themeConfig.accent,
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </Typography>
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                {links.map((link) => (
                  <Typography
                    key={link}
                    sx={{ color: "rgba(255,255,255,.72)", fontSize: 14 }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ borderColor: "rgba(255,255,255,.16)", my: 4 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", gap: 1 }}
        >
          <Typography sx={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>
            Portfolio demo · No real orders are processed
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>
            Privacy · Terms · Accessibility
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function WellnessFooter() {
  const router = useRouter();
  const goToSection = (section: string) => {
    if (window.location.pathname === "/twc-ecommerce") {
      document
        .getElementById(section)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`/twc-ecommerce?section=${section}`);
  };
  const groups: Array<[string, Array<[string, string]>]> = [
    [
      "SHOP",
      [
        ["All products", "/twc-ecommerce/shop"],
        ["Collections", "collections"],
      ],
    ],
    [
      "WELLNESS",
      [
        ["Our story", "story"],
        ["Guides", "story"],
        ["FAQ", "faq"],
      ],
    ],
    [
      "SUPPORT",
      [
        ["Shipping", "/twc-ecommerce/checkout"],
        ["Checkout", "/twc-ecommerce/checkout"],
        ["Contact", "faq"],
      ],
    ],
    [
      "DEMO",
      [
        ["Theme overview", "/twc-ecommerce"],
        ["Basket", "/twc-ecommerce/checkout"],
      ],
    ],
  ];
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#173b27",
        color: "#fff",
        mt: { xs: 6, md: 10 },
        overflow: "hidden",
        position: "relative",
        py: { xs: 6, md: 9 },
      }}
    >
      <Box
        component="img"
        src="/images/twc/wellness-greenery.png"
        alt=""
        aria-hidden="true"
        sx={{
          filter: "blur(8px)",
          height: "100%",
          inset: 0,
          objectFit: "cover",
          opacity: 0.28,
          position: "absolute",
          transform: "scale(1.08)",
          width: "100%",
        }}
      />
      <Box
        sx={{ bgcolor: "rgba(23,59,39,.78)", inset: 0, position: "absolute" }}
      />
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ justifyContent: "space-between", gap: 6 }}
        >
          <Box sx={{ maxWidth: 420 }}>
            <Typography
              sx={{
                color: "#cfe3c8",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: ".16em",
              }}
            >
              WELLNESS ORGANIC
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 30, md: 46 },
                fontWeight: 850,
                letterSpacing: "-.07em",
                lineHeight: 1,
                mt: 1,
              }}
            >
              A calmer way to discover everyday essentials.
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,.7)", lineHeight: 1.8, mt: 1.5 }}
            >
              An original portfolio storefront concept powered by the shared TWC
              commerce engine. No real orders are processed.
            </Typography>
            <Button
              onClick={() => router.push("/twc-ecommerce/shop")}
              sx={{ borderColor: "rgba(255,255,255,.5)", color: "#fff", mt: 2 }}
              variant="outlined"
            >
              Shop all products
            </Button>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: { xs: 3, sm: 5 },
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(4, 1fr)",
              },
            }}
          >
            {groups.map(([title, links]) => (
              <Stack key={title} spacing={1}>
                <Typography
                  sx={{
                    color: "#cfe3c8",
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: ".12em",
                  }}
                >
                  {title}
                </Typography>
                {links.map(([label, target]) => (
                  <Button
                    key={label}
                    onClick={() =>
                      target.startsWith("/")
                        ? router.push(target)
                        : goToSection(target)
                    }
                    sx={{
                      color: "rgba(255,255,255,.72)",
                      justifyContent: "flex-start",
                      minWidth: 0,
                      p: 0,
                      textTransform: "none",
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Stack>
            ))}
          </Box>
        </Stack>
        <Divider sx={{ borderColor: "rgba(255,255,255,.16)", my: 5 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", gap: 1 }}
        >
          <Typography sx={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>
            Portfolio demo · No real orders are processed
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>
            Wellness Organic template · TWC Ecommerce
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function MarketplaceFooter() {
  const router = useRouter();
  const { themeConfig } = useStorefrontTheme();
  const groups: Array<[string, Array<[string, string]>]> = [
    ["SHOP", [["All products", "/twc-ecommerce/shop"]]],
    ["YOUR SHOPPING", [["Checkout", "/twc-ecommerce/checkout"]]],
    ["STOREFRONT", [["Choose a theme", "/twc-ecommerce"]]],
  ];
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: themeConfig.heroText,
        color: "#fff",
        mt: { xs: 6, md: 10 },
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            alignItems: { md: "end" },
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Box sx={{ maxWidth: 520 }}>
            <Typography
              sx={{
                color: themeConfig.accent,
                fontSize: 12,
                fontWeight: 850,
                letterSpacing: ".12em",
              }}
            >
              TWC MARKETPLACE
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 30, md: 44 },
                fontWeight: 750,
                letterSpacing: "-.04em",
                lineHeight: 1.02,
                mt: 1,
              }}
            >
              Useful finds, easy to browse.
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,.78)", lineHeight: 1.7, mt: 1.5 }}
            >
              Explore the shared catalog and try the portfolio demo checkout. No
              real orders are processed.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: { xs: 3, sm: 5 },
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              maxWidth: 560,
              width: "100%",
            }}
          >
            {groups.map(([title, links]) => (
              <Stack key={title} spacing={1}>
                <Typography
                  sx={{
                    color: themeConfig.accent,
                    fontSize: 11,
                    fontWeight: 850,
                    letterSpacing: ".08em",
                  }}
                >
                  {title}
                </Typography>
                {links.map(([label, href]) => (
                  <Button
                    key={label}
                    onClick={() => router.push(href)}
                    sx={{
                      color: "rgba(255,255,255,.84)",
                      justifyContent: "flex-start",
                      minHeight: 36,
                      minWidth: 0,
                      p: 0,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,.1)",
                        color: "#fff",
                      },
                      "&:focus-visible": {
                        outline: "2px solid #fff",
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Stack>
            ))}
          </Box>
        </Stack>
        <Divider sx={{ borderColor: "rgba(255,255,255,.2)", my: 4 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", gap: 1 }}
        >
          <Typography sx={{ color: "rgba(255,255,255,.68)", fontSize: 12 }}>
            Portfolio demo · No real orders are processed
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,.68)", fontSize: 12 }}>
            Modern Marketplace · TWC Ecommerce
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function CorporateFooter() {
  const router = useRouter();
  const { mode } = useStorefrontMode();
  const { themeConfig } = useStorefrontTheme();
  const footerBackground =
    mode === "dark" ? themeConfig.darkSurface : themeConfig.heroText;
  const footerText = "#f5f5ef";
  const footerMuted = "rgba(245,245,239,.76)";
  const footerAccent = mode === "dark" ? themeConfig.accent : "#b9d0ce";
  const goToSection = (section: string) => {
    if (window.location.pathname === "/twc-ecommerce") {
      document
        .getElementById(section)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`/twc-ecommerce?section=${section}`);
  };
  const groups: Array<[string, Array<[string, string]>]> = [
    [
      "COLLECTION",
      [
        ["All products", "/twc-ecommerce/shop"],
        ["Browse categories", "corporate-categories"],
      ],
    ],
    ["YOUR ORDER", [["Basket and checkout", "/twc-ecommerce/checkout"]]],
    ["STOREFRONT", [["Choose another theme", "/twc-ecommerce"]]],
  ];
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: footerBackground,
        color: footerText,
        mt: { xs: 6, md: 9 },
        py: { xs: 5, md: 7 },
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ justifyContent: "space-between", gap: { xs: 4, md: 7 } }}
        >
          <Box sx={{ maxWidth: 430 }}>
            <Typography
              sx={{
                color: footerAccent,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".14em",
              }}
            >
              TWC ONLINE
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: { xs: 30, md: 42 },
                fontWeight: 400,
                lineHeight: 1.08,
                mt: 1,
              }}
            >
              A considered way to shop.
            </Typography>
            <Typography sx={{ color: footerMuted, lineHeight: 1.75, mt: 1.5 }}>
              Browse the shared TWC catalog and try the portfolio checkout. No
              real orders are processed.
            </Typography>
            <Button
              onClick={() => router.push("/twc-ecommerce/shop")}
              sx={{
                borderColor: footerAccent,
                color: footerText,
                mt: 2,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,.1)",
                  borderColor: footerText,
                  color: footerText,
                },
              }}
              variant="outlined"
            >
              Explore products
            </Button>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: { xs: 2.5, sm: 4 },
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(3, minmax(120px, 1fr))",
              },
              maxWidth: 620,
              width: "100%",
            }}
          >
            {groups.map(([title, links]) => (
              <Stack key={title} spacing={0.75}>
                <Typography
                  sx={{
                    color: footerAccent,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    mb: 0.25,
                  }}
                >
                  {title}
                </Typography>
                {links.map(([label, target]) => (
                  <Button
                    key={label}
                    onClick={() =>
                      target.startsWith("/")
                        ? router.push(target)
                        : goToSection(target)
                    }
                    sx={{
                      color: footerMuted,
                      justifyContent: "flex-start",
                      minHeight: 38,
                      minWidth: 0,
                      p: 0,
                      textAlign: "left",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "transparent",
                        color: footerText,
                        textDecoration: "underline",
                        textUnderlineOffset: 4,
                      },
                      "&:focus-visible": {
                        outline: `2px solid ${footerText}`,
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Stack>
            ))}
          </Box>
        </Stack>
        <Divider sx={{ borderColor: "rgba(255,255,255,.2)", my: 4 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", gap: 1 }}
        >
          <Typography sx={{ color: footerMuted, fontSize: 12 }}>
            Portfolio demonstration · No real orders are processed
          </Typography>
          <Typography sx={{ color: footerMuted, fontSize: 12 }}>
            Corporate Commerce · TWC Ecommerce
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function PremiumFooter() {
  const router = useRouter();
  const { themeConfig } = useStorefrontTheme();
  const isPremiumBeauty = themeConfig.name === "Premium Beauty";
  const goToSection = (section: string) => {
    if (window.location.pathname === "/twc-ecommerce") {
      document
        .getElementById(section)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`/twc-ecommerce?section=${section}`);
  };
  const links: Array<[string, string]> = [
    ["Shop all", "/twc-ecommerce/shop"],
    [isPremiumBeauty ? "Fragrances" : "Product lines", "collections"],
    [isPremiumBeauty ? "Beauty notes" : "Our story", "story"],
    [isPremiumBeauty ? "Featured beauty" : "Featured products", "bestsellers"],
    ["Basket and checkout", "/twc-ecommerce/checkout"],
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: themeConfig.heroText,
        color: "#f7f9fa",
        mt: { xs: 6, md: 10 },
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ justifyContent: "space-between", gap: 5 }}
        >
          <Box sx={{ maxWidth: 440 }}>
            <Typography
              sx={{
                color: themeConfig.accent,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: ".16em",
              }}
            >
              {themeConfig.name.toUpperCase()}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: { xs: 30, md: 42 },
                fontWeight: 500,
                lineHeight: 1.05,
                mt: 1,
              }}
            >
              {isPremiumBeauty
                ? "Explore the beauty collection."
                : "Explore the wellness collection."}
            </Typography>
            <Typography
              sx={{ color: "rgba(255,250,247,.78)", lineHeight: 1.8, mt: 1.5 }}
            >
              {isPremiumBeauty
                ? "Explore beauty, fragrance, and style, then try the demo checkout. No real orders are processed."
                : "Browse product details and try the portfolio storefront’s demo checkout. No real orders are processed."}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: { xs: 1, sm: 1.25 },
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              maxWidth: 560,
              width: "100%",
            }}
          >
            {links.map(([label, target]) => (
              <Button
                key={label}
                onClick={() =>
                  target.startsWith("/")
                    ? router.push(target)
                    : goToSection(target)
                }
                sx={{
                  color: "rgba(255,250,247,.82)",
                  justifyContent: "flex-start",
                  minHeight: 42,
                  px: 0,
                  textAlign: "left",
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Stack>
        <Divider sx={{ borderColor: "rgba(255,255,255,.2)", my: 4 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", gap: 1 }}
        >
          <Typography sx={{ color: "rgba(255,250,247,.58)", fontSize: 12 }}>
            Portfolio demonstration · No real orders are processed
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,.62)", fontSize: 12 }}>
            {themeConfig.name} · Portfolio demo
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
