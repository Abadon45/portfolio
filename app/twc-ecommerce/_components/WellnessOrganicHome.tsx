"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import TwcProductCard from "./TwcProductCard";
import type { StoreProduct } from "./TwcStoreProvider";

type Props = {
  categories: string[];
  products: StoreProduct[];
  onAdd: (product: StoreProduct) => void;
  onShop: (category?: string) => void;
};

const categoryArtwork: Record<string, string> = {
  bags: "/images/twc/wellness-category-bags.png",
  bundle: "/images/twc/wellness-category-bundle.png",
  beverage: "/images/twc/wellness-category-beverage.png",
  "sante beauty skin care": "/images/twc/wellness-category-beauty.png",
  "sante nutraceutical": "/images/twc/wellness-category-nutraceutical.png",
  "sante intimate": "/images/twc/wellness-category-intimate.png",
};

export default function WellnessOrganicHome({ categories, products, onAdd, onShop }: Props) {
  const featured = products.slice(0, 4);
  const dailyFinds = products.slice(4, 8);

  return (
    <Box sx={{ bgcolor: "#f6f5ed", color: "#28392f" }}>
      <WellnessHero onShop={onShop} />
      <Container maxWidth="xl">
        <RhythmIndex />
        <Box id="collections" sx={{ py: { xs: 4, md: 7 }, scrollMarginTop: 90 }}>
          <SectionHeading
            eyebrow="SHOP BY CATEGORY"
            title="Find your everyday essentials."
            action={<Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />}>View the whole shop</Button>}
          />
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" } }}>
            {categories.slice(0, 4).map((category, index) => (
              <Button
                key={category}
                onClick={() => onShop(category)}
                sx={{ bgcolor: "#e8ebe1", display: "block", overflow: "hidden", p: 0, textAlign: "left", textTransform: "none" }}
              >
                <Box
                  component="img"
                  src={categoryArtwork[category.toLowerCase()] ?? "/images/twc/wellness-greenery.png"}
                  alt={`${category} collection`}
                  sx={{ display: "block", height: { xs: 170, md: 250 }, objectFit: "cover", transition: "transform .35s ease", width: "100%", "&:hover": { transform: "scale(1.035)" } }}
                />
                <Box sx={{ bgcolor: "#f6f5ed", p: { xs: 1.25, md: 1.75 } }}>
                  <Typography sx={{ color: "#354d3c", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: { xs: 15, md: 18 } }}>{category}</Typography>
                  <Typography sx={{ color: "#71806f", fontSize: 11, mt: .4 }}>Collection {String(index + 1).padStart(2, "0")}</Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Box>

        <EditorialProductShelf
          eyebrow="THE DAILY EDIT"
          title="A few good places to begin."
          copy="A small selection from the shared catalog, with product details and basket actions intact."
          products={featured}
          onAdd={onAdd}
          onShop={onShop}
        />

        <Box id="story" sx={{ borderBottom: 1, borderColor: "#d8ded0", borderTop: 1, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, py: { xs: 4, md: 6 }, scrollMarginTop: 90 }}>
          <Box component="img" src="/images/twc/wellness-category-beverage.png" alt="Everyday wellness products" sx={{ height: { xs: 250, md: 370 }, objectFit: "cover", width: "100%" }} />
          <Stack sx={{ alignSelf: "center", maxWidth: 500 }} spacing={1.5}>
            <Typography sx={{ color: "#668064", fontSize: 10, fontWeight: 800, letterSpacing: ".14em" }}>A GENTLER WAY TO BROWSE</Typography>
            <Typography component="h2" sx={{ color: "#2e4436", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: { xs: 30, md: 42 }, fontWeight: 500, lineHeight: 1.05 }}>Choose what fits. Build a routine of your own.</Typography>
            <Typography sx={{ color: "#68766a", lineHeight: 1.8 }}>No prescribed routine, no promises. Just a clear selection of products to explore at your own pace.</Typography>
            <Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: "flex-start", color: "#315842", px: 0 }}>Continue browsing</Button>
          </Stack>
        </Box>

        <EditorialProductShelf
          eyebrow="A FEW MORE FINDS"
          title="Made for real life."
          products={dailyFinds}
          onAdd={onAdd}
          onShop={onShop}
        />

        <Box sx={{ bgcolor: "#315842", color: "#fff", mb: { xs: 5, md: 8 }, p: { xs: 3, md: 5 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", gap: 2 }}>
            <Box>
              <Typography sx={{ color: "#d3e1cc", fontSize: 10, fontWeight: 800, letterSpacing: ".14em" }}>THE WELLNESS FIELD GUIDE</Typography>
              <Typography component="h2" sx={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: { xs: 26, md: 38 }, fontWeight: 500, mt: .5 }}>A little more room for what works.</Typography>
            </Box>
            <Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, bgcolor: "#f6f5ed", color: "#315842" }}>Browse the shop</Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

function WellnessHero({ onShop }: { onShop: Props["onShop"] }) {
  return (
    <Box sx={{ bgcolor: "#dce7d4", overflow: "hidden" }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: ".9fr 1.1fr" }, minHeight: { md: 600 } }}>
          <Stack spacing={2.25} sx={{ alignSelf: "center", maxWidth: 580, py: { xs: 5, md: 8 }, pr: { md: 5 } }}>
            <Typography sx={{ color: "#547454", fontSize: 11, fontWeight: 800, letterSpacing: ".15em" }}>THE WELLNESS FIELD GUIDE</Typography>
            <Typography component="h1" sx={{ color: "#263e2f", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: { xs: 44, md: 72 }, fontWeight: 500, letterSpacing: "-.045em", lineHeight: .98 }}>A good day starts with the small things.</Typography>
            <Typography sx={{ color: "#536658", lineHeight: 1.8, maxWidth: 470 }}>Find the useful products that fit your own rhythm, from first light to the end of the day.</Typography>
            <Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: "flex-start", bgcolor: "#315842", color: "#fff", mt: 1 }} variant="contained">Explore the collection</Button>
          </Stack>
          <Box sx={{ minHeight: { xs: 320, md: 600 }, position: "relative" }}>
            <Box component="img" src="/images/twc/wellness-greenery.png" alt="Green leaves and natural textures" sx={{ height: "100%", inset: 0, objectFit: "cover", position: "absolute", width: "100%" }} />
            <Box sx={{ bgcolor: "#f6f5ed", bottom: { xs: 16, md: 28 }, left: { xs: 16, md: 28 }, maxWidth: 270, p: 2, position: "absolute" }}>
              <Typography sx={{ color: "#668064", fontSize: 10, fontWeight: 800, letterSpacing: ".12em" }}>A NOTE ON WELLNESS</Typography>
              <Typography sx={{ color: "#344b3b", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 18, lineHeight: 1.35, mt: .5 }}>Keep what supports you. Let the rest be simple.</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function RhythmIndex() {
  const moments = [["Morning", "A considered start"], ["Midday", "An easy reset"], ["On the go", "Useful essentials"], ["Evening", "A quieter close"]];

  return (
    <Box sx={{ borderBottom: 1, borderColor: "#d8ded0", borderTop: 1, display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, my: { xs: 3, md: 4 }, py: 1.5 }}>
      {moments.map(([time, label], index) => (
        <Box key={time} sx={{ borderRight: { md: index < moments.length - 1 ? 1 : 0 }, borderColor: "#d8ded0", px: { md: 2 }, py: 1 }}>
          <Typography sx={{ color: "#74816d", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{time}</Typography>
          <Typography sx={{ color: "#354d3c", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 15, mt: .4 }}>{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "end" }, justifyContent: "space-between", gap: 2, mb: 2.5 }}>
      <Box>
        <Typography sx={{ color: "#668064", fontSize: 10, fontWeight: 800, letterSpacing: ".14em" }}>{eyebrow}</Typography>
        <Typography component="h2" sx={{ color: "#2e4436", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: { xs: 30, md: 44 }, fontWeight: 500, mt: .5 }}>{title}</Typography>
      </Box>
      {action}
    </Stack>
  );
}

function EditorialProductShelf({ eyebrow, title, copy, products, onAdd, onShop }: { eyebrow: string; title: string; copy?: string; products: StoreProduct[]; onAdd: Props["onAdd"]; onShop: Props["onShop"] }) {
  return (
    <Box sx={{ py: { xs: 4, md: 7 } }}>
      <SectionHeading eyebrow={eyebrow} title={title} action={<Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />}>Shop all</Button>} />
      {copy && <Typography sx={{ color: "#68766a", lineHeight: 1.7, mb: 2.5, maxWidth: 580 }}>{copy}</Typography>}
      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
        {products.map((product) => <TwcProductCard key={product.slug} product={product} onAdd={() => onAdd(product)} />)}
      </Box>
    </Box>
  );
}
