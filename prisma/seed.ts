import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// ── Categories ────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Skincare", slug: "skincare", description: "Face serums, toners, moisturisers, and treatments." },
  { name: "Beauty",   slug: "beauty",   description: "Eye care, lip treatments, and colour cosmetics."  },
  { name: "Wellness", slug: "wellness", description: "Body butters, oils, and holistic self-care sets." },
];

// ── Products ──────────────────────────────────────────────────
// Mirrors ALL_PRODUCTS in shopData.ts exactly (slugs, prices, images)

const PRODUCTS = [
  {
    name:        "Radiance Serum",
    slug:        "radiance-serum",
    description: "A lightweight, fast-absorbing serum packed with Vitamin C and hyaluronic acid for a luminous, even-toned complexion.",
    price:       68,
    salePrice:   null,
    stock:       100,
    category:    "skincare",
    images: [
      "/images/products/radiance-serum/radiance-serum.webp",
    ],
    tags: ["serum", "glow", "vitamin-c"],
  },
  {
    name:        "Glow Face Mist",
    slug:        "glow-face-mist",
    description: "A refreshing hydrating mist that delivers an instant burst of radiance and moisture throughout the day.",
    price:       42,
    salePrice:   35,
    stock:       80,
    category:    "skincare",
    images: [
      "/images/products/glow-face-mist/glow-face-mist.webp",
    ],
    tags: ["mist", "hydration", "glow"],
  },
  {
    name:        "Velvet Body Butter",
    slug:        "velvet-body-butter",
    description: "Rich, whipped body butter infused with shea and mango butter for deep, lasting moisturisation.",
    price:       55,
    salePrice:   null,
    stock:       60,
    category:    "wellness",
    images: [
      "/images/products/velvet-body-butter/velvet-body-butter.webp",
    ],
    tags: ["body", "moisturizer", "butter"],
  },
  {
    name:        "Rose Toner",
    slug:        "rose-toner",
    description: "A gentle rose water toner that balances skin pH, tightens pores, and preps skin for serums.",
    price:       38,
    salePrice:   null,
    stock:       90,
    category:    "skincare",
    images: [
      "/images/products/rose-toner/rose-toner.webp",
    ],
    tags: ["toner", "rose", "balancing"],
  },
  {
    name:        "Cloud Cream SPF 30",
    slug:        "cloud-cream-spf",
    description: "A featherlight daily moisturiser with broad-spectrum SPF 30 — hydration and sun protection in one step.",
    price:       72,
    salePrice:   null,
    stock:       75,
    category:    "skincare",
    images: [
      "/images/products/could-cream-spf/cloud-cream-spf.webp",
    ],
    tags: ["spf", "moisturizer", "daily"],
  },
  {
    name:        "Lip Treatment Set",
    slug:        "lip-treatment-set",
    description: "A nourishing trio of lip scrub, mask, and balm for soft, smooth, hydrated lips.",
    price:       34,
    salePrice:   28,
    stock:       70,
    category:    "beauty",
    images: [
      "/images/products/lip-treatment-set/lip-treatment-set.webp",
    ],
    tags: ["lips", "set", "nourishing"],
  },
  {
    name:        "Deep Clean Mask",
    slug:        "deep-clean-mask",
    description: "A purifying kaolin clay mask that draws out impurities, unclogs pores, and leaves skin fresh and matte.",
    price:       48,
    salePrice:   null,
    stock:       55,
    category:    "skincare",
    images: [
      "/images/products/deep-clean-mask/deep-clean-mask.webp",
    ],
    tags: ["mask", "cleansing", "clay"],
  },
  {
    name:        "Vitamin C Booster",
    slug:        "vitamin-c-booster",
    description: "A concentrated 20% Vitamin C booster that visibly brightens dark spots and boosts collagen for firmer skin.",
    price:       85,
    salePrice:   null,
    stock:       85,
    category:    "skincare",
    images: [
      "/images/products/vitamin-c-booster/vitamin-c-booster.webp",
    ],
    tags: ["vitamin-c", "serum", "brightening"],
  },
  {
    name:        "Overnight Recovery",
    slug:        "overnight-recovery",
    description: "An intensive overnight repair cream with retinol and peptides that works while you sleep to renew and plump skin.",
    price:       92,
    salePrice:   75,
    stock:       45,
    category:    "skincare",
    images: [
      "/images/products/overnight-recovery/overnight-recovery.webp",
    ],
    tags: ["night", "repair", "retinol"],
  },
  {
    name:        "Calming Eye Cream",
    slug:        "calming-eye-cream",
    description: "A gentle, fragrance-free eye cream with caffeine and ceramides to reduce puffiness and smooth fine lines.",
    price:       58,
    salePrice:   null,
    stock:       65,
    category:    "beauty",
    images: [
      "/images/products/calming-eye-cream/calming-eye-cream.webp",
    ],
    tags: ["eyes", "sensitive", "caffeine"],
  },
  {
    name:        "Hydra Boost Essence",
    slug:        "hydra-boost-essence",
    description: "A lightweight essence with 5 types of hyaluronic acid for multi-depth hydration and a plump, dewy finish.",
    price:       65,
    salePrice:   null,
    stock:       70,
    category:    "skincare",
    images: [
      "/images/products/hydra-boost-essence/hydra-boost-essence.webp",
    ],
    tags: ["essence", "hydration", "hyaluronic"],
  },
  {
    name:        "Wellness Bundle",
    slug:        "wellness-bundle",
    description: "A complete self-care collection — body oil, bath salts, and body butter — for a full wellness ritual.",
    price:       120,
    salePrice:   99,
    stock:       30,
    category:    "wellness",
    images: [
      "/images/products/wellness-bundle/wellness-bundle.webp",
    ],
    tags: ["bundle", "set", "self-care"],
  },
];

// ── Seed ──────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  // 1. Upsert categories
  const categoryMap: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const record = await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    categoryMap[cat.slug] = record.id;
    console.log(`  ✓ Category: ${cat.name}`);
  }

  // 2. Upsert products
  for (const p of PRODUCTS) {
    const categoryId = categoryMap[p.category];
    if (!categoryId) {
      console.warn(`  ⚠ Skipping "${p.name}" — category "${p.category}" not found`);
      continue;
    }

    await prisma.product.upsert({
      where:  { slug: p.slug },
      update: {
        name:        p.name,
        description: p.description,
        price:       p.price,
        salePrice:   p.salePrice,
        stock:       p.stock,
        images:      JSON.stringify(p.images),
        tags:        JSON.stringify(p.tags),
        categoryId,
        isActive:    true,
      },
      create: {
        name:        p.name,
        slug:        p.slug,
        description: p.description,
        price:       p.price,
        salePrice:   p.salePrice,
        stock:       p.stock,
        images:      JSON.stringify(p.images),
        tags:        JSON.stringify(p.tags),
        categoryId,
        isActive:    true,
      },
    });

    console.log(`  ✓ Product: ${p.name}`);
  }

  console.log("\n✅ Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
