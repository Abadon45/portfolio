"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, ButtonBase, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import type { StoreProduct } from "./TwcStoreProvider";
import { ProductGrid } from "./StorefrontPrimitives";
import {
  premiumBeautyCategories,
  selectPremiumBeautyProducts,
} from "./storefrontContent";

type Props = {
  products: StoreProduct[];
  onAdd: (product: StoreProduct) => void;
  onShop: (category?: string) => void;
};

type ScentNote = {
  label: string;
  description: string;
};

export default function PremiumBeautyHome({ products, onAdd, onShop }: Props) {
  const beautyProducts = selectPremiumBeautyProducts(products);
  const heroProducts = beautyProducts.slice(0, 3);
  const fragrances = beautyProducts.filter(
    (product) => product.category2.toLowerCase() === "perfume",
  );
  const noteFeature = fragrances.find((product) => extractScentNotes(product.details).length > 0);
  const categories = premiumBeautyCategories(products);
  const featured = beautyProducts.slice(0, 4);
  const moreProducts = beautyProducts.slice(4, 8);
  const beautyCategory = beautyProducts[0]?.category;

  return (
    <>
      <PremiumHero
        products={heroProducts}
        productCount={beautyProducts.length}
        onShop={() => onShop(beautyCategory)}
        onViewEdit={() =>
          document
            .getElementById("collections")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      />

      <Container maxWidth="xl">
        <BeautyCategorySection categories={categories} onShop={onShop} />
        <FragranceSection
          eyebrow="THE BEAUTY EDIT"
          title="Find a new everyday favorite."
          products={featured}
          onAdd={onAdd}
          onShop={() => onShop(beautyCategory)}
        />

        {noteFeature && <ScentNotesFeature product={noteFeature} />}

        {moreProducts.length > 0 && (
          <FragranceSection
            id="bestsellers"
            eyebrow="MORE TO EXPLORE"
            title="A few more good finds."
            products={moreProducts}
            onAdd={onAdd}
            onShop={() => onShop(beautyCategory)}
          />
        )}
      </Container>
    </>
  );
}

function PremiumHero({
  products,
  productCount,
  onShop,
  onViewEdit,
}: {
  products: StoreProduct[];
  productCount: number;
  onShop: () => void;
  onViewEdit: () => void;
}) {
  const leadProduct = products[0];

  return (
    <Box component="section" sx={{ bgcolor: "background.default", py: { xs: 2, md: 3 } }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            bgcolor: "background.paper",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            minHeight: { md: 555 },
          }}
        >
          <Stack
            spacing={2.25}
            sx={{
              alignSelf: "center",
              maxWidth: 590,
              order: { xs: 0, md: 0 },
              p: { xs: 3, sm: 4, md: 6, xl: 8 },
            }}
          >
            <Typography
              color="primary.main"
              sx={{ fontSize: 11, fontWeight: 800, letterSpacing: ".16em" }}
            >
              BEAUTY & FRAGRANCE · TWC COLLECTION
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: { xs: 42, sm: 54, md: 64, xl: 72 },
                fontWeight: 500,
                letterSpacing: "-.04em",
                lineHeight: 1.02,
                maxWidth: 520,
                textWrap: "balance",
              }}
            >
              Make a little room for beauty.
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: 16, lineHeight: 1.75, maxWidth: 430 }}
            >
              Discover fragrances, beauty finds, accessories, and everyday
              pieces chosen to make getting ready feel like your own.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ pt: 0.5 }}
            >
              <Button
                onClick={onShop}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ minHeight: 46, px: 2.25 }}
                variant="contained"
              >
                Shop the collection
              </Button>
              <Button
                onClick={onViewEdit}
                sx={{ minHeight: 46, px: 2 }}
              >
                View the edit
              </Button>
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ fontSize: 12, pt: 0.5 }}
            >
              {productCount} {productCount === 1 ? "find" : "finds"} across the collection
            </Typography>
          </Stack>

          {leadProduct ? (
            <Box
              sx={{
                minHeight: { xs: 300, md: 555 },
                order: { xs: 1, md: 1 },
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                component="img"
                src="/images/twc/premium-beauty-campaign.webp"
                alt="A quiet moment at a beauty dressing table"
                width={1536}
                height={1024}
                fetchPriority="high"
                sx={{
                  display: "block",
                  height: "100%",
                  inset: 0,
                  objectFit: "cover",
                  objectPosition: "right center",
                  position: "absolute",
                  width: "100%",
                }}
              />
              <Box
                sx={{
                  bgcolor: "background.paper",
                  bottom: { xs: 78, md: 24 },
                  left: { xs: 12, md: 24 },
                  maxWidth: { xs: 240, md: 290 },
                  p: { xs: 1.5, md: 2 },
                  position: "absolute",
                }}
              >
                <Typography color="primary.main" sx={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em" }}>
                  A NOTE ON BEAUTY
                </Typography>
                <Typography sx={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: 16, md: 20 }, lineHeight: 1.35, mt: 0.5 }}>
                  Make getting ready feel like your own.
                </Typography>
                <Button
                  component={Link}
                  href={`/twc-ecommerce/shop/${leadProduct.slug}`}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ fontSize: 12, mt: 0.75, px: 0 }}
                >
                  Explore the edit
                </Button>
              </Box>
            </Box>
          ) : (
            <EmptyBeautyHero />
          )}
        </Box>
      </Container>
    </Box>
  );
}

function HeroProductTile({
  product,
  large = false,
  sx,
}: {
  product: StoreProduct;
  large?: boolean;
  sx?: object;
}) {
  return (
    <ButtonBase
      component={Link}
      href={`/twc-ecommerce/shop/${product.slug}`}
      aria-label={`View ${product.name}`}
      sx={{
        alignItems: "stretch",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        overflow: "hidden",
        textAlign: "left",
        width: "100%",
        "&:hover img": { transform: "scale(1.035)" },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: -2,
        },
        "@media (prefers-reduced-motion: reduce)": {
          "&:hover img": { transform: "none" },
          "& img": { transition: "none" },
        },
        ...sx,
      }}
    >
      <Box
        component="img"
        src={product.image}
        alt={product.name}
        width={900}
        height={900}
        loading={large ? "eager" : "lazy"}
        fetchPriority={large ? "high" : "auto"}
        decoding="async"
        sx={{
          bgcolor: "background.paper",
          flex: 1,
          height: 0,
          minHeight: 0,
          objectFit: "contain",
          p: large ? { xs: 2, md: 4 } : 1,
          transition: "transform 300ms ease",
          width: "100%",
        }}
      />
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: { xs: 1.25, md: large ? 2 : 1.25 },
          py: { xs: 1, md: large ? 1.5 : 1 },
        }}
      >
        <Typography
          noWrap
          sx={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: large ? { xs: 14, md: 18 } : 12,
            minWidth: 0,
          }}
        >
          {product.name}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: large ? 13 : 11, flexShrink: 0 }}
        >
          ₱{product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </Typography>
      </Stack>
    </ButtonBase>
  );
}

function EmptyBeautyHero() {
  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "action.hover",
        display: "flex",
        justifyContent: "center",
        minHeight: { xs: 260, md: 555 },
        p: 4,
      }}
    >
      <Typography color="text.secondary" sx={{ textAlign: "center" }}>
        Beauty products will appear here when the catalog is available.
      </Typography>
    </Box>
  );
}

function BeautyCategorySection({
  categories,
  onShop,
}: {
  categories: ReturnType<typeof premiumBeautyCategories>;
  onShop: Props["onShop"];
}) {
  if (!categories.length) return null;

  return (
    <Box component="section" id="collections" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ alignItems: { sm: "end" }, justifyContent: "space-between", gap: 1.5, mb: 2.5 }}
      >
        <Box>
          <Typography color="primary.main" sx={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em" }}>
            SHOP BY CATEGORY
          </Typography>
          <Typography component="h2" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: 30, md: 42 }, fontWeight: 500, mt: 0.5 }}>
            A good place to begin.
          </Typography>
        </Box>
        <Button onClick={() => onShop()} endIcon={<ArrowForwardRoundedIcon />}>
          View all beauty
        </Button>
      </Stack>
      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" } }}>
        {categories.slice(0, 4).map(({ category, label, count, image }) => (
          <ButtonBase
            key={category}
            onClick={() => onShop(category)}
            sx={{ bgcolor: "background.paper", display: "block", overflow: "hidden", textAlign: "left", width: "100%", "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 } }}
          >
            <Box
              component="img"
              src={image}
              alt=""
              width={720}
              height={520}
              loading="lazy"
              sx={{ aspectRatio: "1.3 / 1", bgcolor: "action.hover", display: "block", height: "auto", objectFit: "contain", p: 1, width: "100%" }}
            />
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1, p: { xs: 1.25, md: 1.75 } }}>
              <Box>
                <Typography sx={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: 15, md: 18 } }}>{label}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 11, mt: 0.4 }}>{count} {count === 1 ? "item" : "items"}</Typography>
              </Box>
              <ArrowForwardRoundedIcon fontSize="small" color="primary" />
            </Stack>
          </ButtonBase>
        ))}
      </Box>
    </Box>
  );
}

function FragranceSection({
  id,
  eyebrow,
  title,
  products,
  onAdd,
  onShop,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  products: StoreProduct[];
  onAdd: Props["onAdd"];
  onShop: () => void;
}) {
  if (!products.length) return null;

  return (
    <Box
      component="section"
      id={id}
      sx={{ py: { xs: 5, md: 7 }, scrollMarginTop: 90 }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          alignItems: { sm: "end" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            color="primary.main"
            sx={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em" }}
          >
            {eyebrow}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: { xs: 30, md: 42 },
              fontWeight: 500,
              lineHeight: 1.1,
              mt: 0.5,
              textWrap: "balance",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Button
          onClick={onShop}
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
        >
          See all in the collection
        </Button>
      </Stack>
      <ProductGrid columns={4} products={products} onAdd={onAdd} />
    </Box>
  );
}

function ScentNotesFeature({ product }: { product: StoreProduct }) {
  const notes = extractScentNotes(product.details);

  if (!notes.length) return null;

  return (
    <Box
      component="section"
      id="story"
      sx={{
        bgcolor: "action.hover",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
        my: { xs: 2, md: 3 },
        scrollMarginTop: 90,
      }}
    >
      <Box
        component="img"
        src={product.image}
        alt={product.name}
        width={900}
        height={900}
        loading="lazy"
        decoding="async"
        sx={{
          bgcolor: "background.paper",
          height: { xs: 300, md: "100%" },
          minHeight: { md: 380 },
          objectFit: "contain",
          p: { xs: 2, md: 4 },
          width: "100%",
        }}
      />
      <Stack
        spacing={2}
        sx={{ alignSelf: "center", p: { xs: 3, sm: 4, md: 6 } }}
      >
        <Typography
          color="primary.main"
          sx={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em" }}
        >
          A CLOSER LOOK
        </Typography>
        <Typography
          component="h2"
          sx={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: { xs: 30, md: 42 },
            fontWeight: 500,
            lineHeight: 1.1,
          }}
        >
          {product.name}
        </Typography>
        <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}>
          {notes.map((note) => (
            <Stack
              key={note.label}
              direction={{ xs: "column", sm: "row" }}
              sx={{ gap: 0.5, justifyContent: "space-between", py: 1.25 }}
            >
              <Typography
                color="text.secondary"
                sx={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em" }}
              >
                {note.label}
              </Typography>
              <Typography sx={{ fontSize: 14, lineHeight: 1.6, maxWidth: 340 }}>
                {note.description}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Button
          component={Link}
          href={`/twc-ecommerce/shop/${product.slug}`}
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{ alignSelf: "flex-start", mt: 0.5, px: 0 }}
        >
          View fragrance details
        </Button>
      </Stack>
    </Box>
  );
}

function extractScentNotes(details: string): ScentNote[] {
  const notes: ScentNote[] = [];
  const matcher = /(Top|Middle|Base) Notes:\s*([^\r\n.]+)/gi;

  for (const match of details.matchAll(matcher)) {
    const description = match[2]
      .replace(/,\s*(?:offering|creating|adding|delivering|providing)\b.*$/i, "")
      .trim();

    if (description) {
      notes.push({
        label: `${match[1]} notes`,
        description,
      });
    }
  }

  return notes;
}
