"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import TwcProductCard from "./TwcProductCard";
import type { StoreProduct } from "./TwcStoreProvider";

type Props = { categories: string[]; products: StoreProduct[]; onAdd: (product: StoreProduct) => void; onShop: (category?: string) => void };

const wellnessImages = [
  "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85",
];

export default function WellnessOrganicHome({ categories, products, onAdd, onShop }: Props) {
  const router = useRouter();
  const featured = products.slice(0, 4);
  const collection = products.slice(4, 9);

  return <Box sx={{ bgcolor: "#f8fbf6" }}>
    <WellnessHero onShop={onShop} />
    <WellnessTrust />
    <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
      <CategoryDiscovery categories={categories} onSelect={onShop} />
      <FeaturedWellness products={featured} onAdd={onAdd} onShop={onShop} />
      <WellnessParallaxMessage />
      <RoutineStory />
      <CollectionFeature products={collection} onAdd={onAdd} onShop={onShop} />
      <WellnessEducation />
      <ApproachSection />
      <WellnessFaq />
      <Box sx={{ bgcolor: "#173b27", color: "#fff", my: { xs: 7, md: 12 }, p: { xs: 3, md: 7 } }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ alignItems: { md: "center" }, justifyContent: "space-between", gap: 3 }}>
          <Box><Typography sx={{ color: "#cfe3c8", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>MAKE ROOM FOR WELLNESS</Typography><Typography component="h2" sx={{ fontSize: { xs: 30, md: 50 }, fontWeight: 850, letterSpacing: "-.06em", lineHeight: 1, mt: 1 }}>Find what fits your routine.</Typography><Typography sx={{ color: "rgba(255,255,255,.72)", lineHeight: 1.7, maxWidth: 520, mt: 1.5 }}>A focused collection of products for everyday living, presented through a calm offline shopping experience.</Typography></Box>
          <Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: { xs: "flex-start", md: "center" }, bgcolor: "#fff", color: "#173b27", px: 3, py: 1.25 }}>Shop wellness</Button>
        </Stack>
      </Box>
      <NewsletterDemo />
    </Container>
  </Box>;
}

function WellnessHero({ onShop }: { onShop: Props["onShop"] }) {
  return <Box sx={{ bgcolor: "#e5efe2", overflow: "hidden" }}><Container maxWidth="xl"><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.08fr" }, minHeight: { md: 620 } }}><Stack sx={{ justifyContent: "center", maxWidth: 610, p: { xs: 3, sm: 5, md: 8 } }} spacing={2.5}><Chip label="WELLNESS ORGANIC · TWC DEMO" sx={{ alignSelf: "flex-start", bgcolor: "#d3e4cf", color: "#347153", fontWeight: 900 }} /><Typography component="h1" sx={{ color: "#173b27", fontSize: { xs: 48, sm: 62, md: 82 }, fontWeight: 850, letterSpacing: "-.09em", lineHeight: .92 }}>Everyday wellness, thoughtfully gathered.</Typography><Typography sx={{ color: "#496653", fontSize: 17, lineHeight: 1.75, maxWidth: 500 }}>Discover useful products for the rituals, resets, and small upgrades that shape a good day.</Typography><Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ pt: 1 }}><Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: "flex-start" }} variant="contained">Shop wellness</Button><Button onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })} sx={{ alignSelf: "flex-start", color: "#347153" }} variant="outlined">Explore collections</Button></Stack></Stack><Box role="img" aria-label="Fresh greens, herbs, and produce arranged for a wellness routine" sx={{ backgroundImage: "url('/images/twc/wellness-greenery.png')", backgroundPosition: "center", backgroundSize: "cover", minHeight: { xs: 360, md: 620 }, position: "relative" }}><Box sx={{ bgcolor: "rgba(23,59,39,.08)", inset: 0, position: "absolute" }} /><Box sx={{ bgcolor: "rgba(255,255,255,.9)", bottom: { xs: 16, md: 28 }, left: { xs: 16, md: 28 }, maxWidth: 250, p: 2, position: "absolute" }}><Typography sx={{ color: "#347153", fontSize: 10, fontWeight: 900, letterSpacing: ".14em" }}>A SIMPLE START</Typography><Typography sx={{ color: "#173b27", fontSize: 18, fontWeight: 800, lineHeight: 1.2, mt: .5 }}>Build a basket around real routines.</Typography></Box></Box></Box></Container></Box>;
}

function WellnessTrust() {
  return <Box sx={{ bgcolor: "#173b27", color: "#fff" }}><Container maxWidth="xl"><Box sx={{ display: "grid", gap: 0, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" } }}>{[[<VerifiedOutlinedIcon key="quality" />, "Thoughtful selection"], [<AutoAwesomeRoundedIcon key="routine" />, "Made for routines"], [<LocalShippingOutlinedIcon key="delivery" />, "Demo delivery flow"], [<PaymentOutlinedIcon key="checkout" />, "Clear checkout"]].map(([icon, label]) => <Stack key={String(label)} direction="row" spacing={1} sx={{ alignItems: "center", borderRight: { md: 1 }, borderColor: "rgba(255,255,255,.15)", minHeight: 84, p: { xs: 1.5, md: 2.5 } }}><Box sx={{ color: "#cfe3c8" }}>{icon}</Box><Typography sx={{ fontSize: { xs: 12, md: 13 }, fontWeight: 800 }}>{label}</Typography></Stack>)}</Box></Container></Box>;
}

function SectionHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: React.ReactNode }) {
  return <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: { sm: "end" }, justifyContent: "space-between", gap: 2, mb: 3.5 }}><Box><Typography sx={{ color: "#347153", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>{eyebrow}</Typography><Typography component="h2" sx={{ color: "#173b27", fontSize: { xs: 32, md: 50 }, fontWeight: 850, letterSpacing: "-.08em", lineHeight: 1, mt: .7 }}>{title}</Typography>{copy && <Typography sx={{ color: "#607467", lineHeight: 1.7, maxWidth: 580, mt: 1 }}>{copy}</Typography>}</Box>{action}</Stack>;
}

function CategoryDiscovery({ categories, onSelect }: { categories: string[]; onSelect: Props["onShop"] }) {
  return (
    <Box id="collections" sx={{ mb: { xs: 8, md: 13 }, scrollMarginTop: 90 }}>
      <SectionHeading
        copy="Start with a category, then shape a collection around the products that make sense for your day."
        eyebrow="FIND YOUR FIT"
        title="Shop by the way you live."
      />
      <Box sx={{ display: "grid", gap: { xs: 1.5, md: 2.5 }, gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>
        {categories.slice(0, 4).map((category, index) => (
          <Button
            key={category}
            onClick={() => onSelect(category)}
            sx={{
              "&:hover img": { transform: "scale(1.05)" },
              bgcolor: "#edf4ea",
              display: "block",
              minHeight: { xs: 210, md: 330 },
              overflow: "hidden",
              p: 0,
              position: "relative",
              textAlign: "left",
              textTransform: "none",
            }}
          >
            <Box component="img" src={wellnessImages[index]} alt={`${category} collection`} sx={{ height: "100%", objectFit: "cover", transition: "transform .45s", width: "100%" }} />
            <Box sx={{ background: "linear-gradient(transparent, rgba(15,39,25,.8))", inset: 0, position: "absolute" }} />
            <Box sx={{ bottom: 0, color: "#fff", left: 0, p: { xs: 1.5, md: 2.5 }, position: "absolute" }}>
              <Typography sx={{ fontSize: { xs: 17, md: 22 }, fontWeight: 850 }}>{category}</Typography>
              <Typography sx={{ color: "rgba(255,255,255,.75)", fontSize: 12, mt: .4 }}>Explore the collection</Typography>
            </Box>
          </Button>
        ))}
      </Box>
    </Box>
  );
}

function FeaturedWellness({ products: items, onAdd, onShop }: { products: StoreProduct[]; onAdd: Props["onAdd"]; onShop: Props["onShop"] }) {
  return (
    <Box sx={{ mb: { xs: 9, md: 14 } }}>
      <SectionHeading
        action={<Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />} sx={{ color: "#347153" }}>View all products</Button>}
        copy="Real products from the shared TWC catalog, presented with room to compare and choose."
        eyebrow="EVERYDAY WELLNESS ESSENTIALS"
        title="A considered place to begin."
      />
      <Box sx={{ display: "grid", gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }}}>
        {items.map((product) => <TwcProductCard key={product.slug} product={product} onAdd={() => onAdd(product)} />)}
      </Box>
    </Box>
  );
}

function WellnessParallaxMessage() {
  return <Box sx={{ alignItems: "center", backgroundImage: "linear-gradient(90deg, rgba(23,59,39,.88), rgba(23,59,39,.35)), url('/images/twc/wellness-greenery.png')", backgroundPosition: "center", backgroundSize: "cover", color: "#fff", display: "flex", minHeight: { xs: 360, md: 480 }, mb: { xs: 9, md: 14 }, ml: "calc(50% - 50vw)", position: "relative", width: "100vw", "@media (min-width: 900px)": { backgroundAttachment: "fixed" } }}><Container maxWidth="lg"><Box sx={{ maxWidth: 560, py: { xs: 5, md: 8 } }}><Typography sx={{ color: "#cfe3c8", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>A VISUAL PAUSE</Typography><Typography component="h2" sx={{ fontSize: { xs: 34, md: 58 }, fontWeight: 850, letterSpacing: "-.08em", lineHeight: .95, mt: 1 }}>Make space for what supports your day.</Typography><Typography sx={{ color: "rgba(255,255,255,.78)", fontSize: 16, lineHeight: 1.8, mt: 2 }}>Wellness is not a single destination. It is the collection of small choices that make an everyday rhythm feel more considered.</Typography></Box></Container></Box>;
}

function RoutineStory() {
  return <Box id="story" sx={{ display: "grid", gap: { xs: 0, md: 5 }, gridTemplateColumns: { xs: "1fr", md: "1.05fr .95fr" }, mb: { xs: 9, md: 14 }, scrollMarginTop: 90 }}><Box component="img" src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=85" alt="A calm kitchen wellness routine" sx={{ height: { xs: 300, md: 540 }, objectFit: "cover", width: "100%" }} /><Box sx={{ bgcolor: "#dcebdc", p: { xs: 3, md: 7 } }}><Typography sx={{ color: "#347153", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>WELLNESS THAT FITS YOUR DAY</Typography><Typography component="h2" sx={{ color: "#173b27", fontSize: { xs: 32, md: 52 }, fontWeight: 850, letterSpacing: "-.08em", lineHeight: .98, mt: 1 }}>Small rituals, made easier to return to.</Typography><Typography sx={{ color: "#496653", lineHeight: 1.8, mt: 2 }}>Browse by moment rather than by noise: a considered start, a useful reset, an active afternoon, or a calmer close to the day.</Typography><Stack divider={<Divider flexItem />} sx={{ mt: 3 }}>{["Morning reset", "Workday refresh", "Active everyday", "Evening wind-down"].map((item, index) => <Stack direction="row" key={item} sx={{ alignItems: "center", justifyContent: "space-between", py: 1.5 }}><Typography sx={{ color: "#173b27", fontWeight: 800 }}>{item}</Typography><Typography sx={{ color: "#347153", fontSize: 12 }}>0{index + 1}</Typography></Stack>)}</Stack></Box></Box>;
}

function CollectionFeature({ products: items, onAdd, onShop }: { products: StoreProduct[]; onAdd: Props["onAdd"]; onShop: Props["onShop"] }) {
  const lead = items[0];
  if (!lead) return null;
  return <Box sx={{ mb: { xs: 9, md: 14 } }}><SectionHeading eyebrow="START YOUR ROUTINE" title="The daily wellness collection." action={<Button onClick={() => onShop()} sx={{ color: "#347153" }}>Explore the shop</Button>} /><Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1.2fr .8fr" } }}><Paper sx={{ bgcolor: "#f0f5ed", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, overflow: "hidden" }}><Box sx={{ alignItems: "center", bgcolor: "#e5efe2", display: "flex", minHeight: { xs: 280, sm: 410 }, p: 3 }}><Box component="img" src={lead.image} alt={lead.name} sx={{ height: "100%", maxHeight: 360, objectFit: "contain", width: "100%" }} /></Box><Stack sx={{ justifyContent: "center", p: { xs: 3, md: 4 } }} spacing={1.5}><Typography sx={{ color: "#347153", fontSize: 11, fontWeight: 900, letterSpacing: ".14em" }}>{lead.category}</Typography><Typography component="h3" sx={{ color: "#173b27", fontSize: { xs: 24, md: 32 }, fontWeight: 850, lineHeight: 1.05 }}>{lead.name}</Typography><Typography sx={{ color: "#607467", fontSize: 13, lineHeight: 1.7 }}>{lead.description}</Typography><Button onClick={() => onAdd(lead)} sx={{ alignSelf: "flex-start", mt: 1 }} variant="contained">Add to basket</Button></Stack></Paper><Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "1fr" } }}>{items.slice(1, 3).map((product) => <Paper key={product.slug} sx={{ alignItems: "center", bgcolor: "#fff", display: "flex", gap: 2, p: 1.5 }}><Box sx={{ bgcolor: "#edf4ea", flex: "0 0 34%", height: { xs: 120, md: 195 } }}><Box component="img" src={product.image} alt={product.name} sx={{ height: "100%", objectFit: "contain", width: "100%" }} /></Box><Box sx={{ minWidth: 0 }}><Typography sx={{ color: "#347153", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>{product.category}</Typography><Typography sx={{ color: "#173b27", fontSize: 15, fontWeight: 800, mt: .5 }}>{product.name}</Typography><Button onClick={() => onAdd(product)} size="small" sx={{ color: "#347153", mt: 1, px: 0 }}>Add</Button></Box></Paper>)}</Box></Box></Box>;
}

function WellnessEducation() {
  return <Box sx={{ mb: { xs: 9, md: 14 } }}><SectionHeading eyebrow="THE WELLNESS NOTE" title="Build a better everyday rhythm." copy="A small editorial space for practical inspiration. This demo keeps the guidance general, useful, and grounded in everyday shopping." /><Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>{[["01", "Start with one repeatable habit", "Choose products that make a routine feel easier to revisit."], ["02", "Keep your essentials visible", "A thoughtful basket can reduce friction in the moments that matter."], ["03", "Make room for what works", "Browse, compare, and keep only the products that fit your life."]].map(([number, title, copy]) => <Paper key={number} elevation={0} sx={{ bgcolor: "#fff", borderTop: 3, borderColor: "#347153", p: { xs: 2.5, md: 3.5 } }}><Typography sx={{ color: "#b47a42", fontSize: 12, fontWeight: 900 }}>{number}</Typography><Typography component="h3" sx={{ color: "#173b27", fontSize: 22, fontWeight: 850, lineHeight: 1.1, mt: 3 }}>{title}</Typography><Typography sx={{ color: "#607467", lineHeight: 1.7, mt: 1.5 }}>{copy}</Typography></Paper>)}</Box></Box>;
}

function ApproachSection() {
  return <Box sx={{ display: "grid", gap: 0, gridTemplateColumns: { xs: "1fr", md: ".85fr 1.15fr" }, mb: { xs: 9, md: 14 } }}><Box component="img" src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=85" alt="Natural botanical textures" sx={{ height: { xs: 300, md: 450 }, objectFit: "cover", width: "100%" }} /><Box sx={{ bgcolor: "#f0e8dc", p: { xs: 3, md: 7 } }}><Typography sx={{ color: "#9a6634", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>OUR APPROACH</Typography><Typography component="h2" sx={{ color: "#3d352c", fontSize: { xs: 32, md: 50 }, fontWeight: 850, letterSpacing: "-.08em", lineHeight: 1, mt: 1 }}>Wellness designed for real life.</Typography><Typography sx={{ color: "#665e54", lineHeight: 1.85, maxWidth: 520, mt: 2 }}>This original storefront concept brings together wellness, beauty, and useful essentials in a clear, human shopping journey. It is a visual study, not a claim about a real company or health outcome.</Typography></Box></Box>;
}

function WellnessFaq() {
  return <Box id="faq" sx={{ mb: { xs: 8, md: 12 }, scrollMarginTop: 90 }}><SectionHeading eyebrow="NEED TO KNOW" title="Questions, answered." /><Stack divider={<Divider flexItem />} sx={{ borderBottom: 1, borderColor: "divider" }}>{[["How do I place an order?", "Choose a product, add it to your basket, select a shop, and continue through the demo checkout."], ["How is shipping calculated?", "The shared demo engine calculates delivery from the basket, destination, weight, and packaging profile."], ["Can I update my basket?", "Yes. Quantity changes, shop selection, and item removal are available in the basket drawer."], ["Does checkout process a real payment?", "No. This is an offline portfolio demonstration and does not process real orders."]].map(([question, answer]) => <Box component="details" key={question} sx={{ py: 2.25, "& summary": { color: "#173b27", cursor: "pointer", fontWeight: 850, listStyle: "none", "&::-webkit-details-marker": { display: "none" } } }}><Box component="summary">{question}</Box><Typography sx={{ color: "#607467", lineHeight: 1.7, maxWidth: 720, pt: 1.25 }}>{answer}</Typography></Box>)}</Stack></Box>;
}

function NewsletterDemo() {
  return <Box sx={{ borderTop: 1, borderColor: "#d7e4d2", pt: { xs: 5, md: 7 }, textAlign: "center" }}><Typography sx={{ color: "#347153", fontSize: 11, fontWeight: 900, letterSpacing: ".16em" }}>WELLNESS, DELIVERED</Typography><Typography component="h2" sx={{ color: "#173b27", fontSize: { xs: 30, md: 44 }, fontWeight: 850, letterSpacing: "-.07em", mt: 1 }}>Notes for the everyday routine.</Typography><Typography sx={{ color: "#607467", lineHeight: 1.7, maxWidth: 540, mx: "auto", mt: 1.5 }}>A newsletter interface for product updates and wellness inspiration. Subscription is not connected in this offline demo.</Typography><Button disabled sx={{ mt: 2 }} variant="outlined">Newsletter coming soon</Button></Box>;
}
