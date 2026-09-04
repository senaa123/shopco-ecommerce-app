/**
 * Database seed — idempotent.
 *
 * Run with `npm run seed` (which delegates to `prisma db seed`, so `.env` is
 * loaded automatically). Re-running never creates duplicates: users/categories/
 * products are upserted on their unique fields, images are reset deterministically,
 * variants are only added when a product has none, and reviews are topped up to a
 * target count (one per distinct customer).
 */

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// `npm run seed` -> `prisma db seed` already loads .env; this is a fallback for a
// bare `ts-node prisma/seed.ts` invocation.
loadDotenvIfNeeded();

function loadDotenvIfNeeded(): void {
  if (process.env.ADMIN_EMAIL && process.env.DATABASE_URL) return;
  try {
    /* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
    require('dotenv').config();
    /* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
  } catch {
    /* dotenv unavailable — rely on the caller's environment */
  }
}

const prisma = new PrismaClient();

/** Same cost factor as the auth module. */
const BCRYPT_COST = 12;
/** Shared password for the demo CUSTOMER accounts (not secret — demo data only). */
const DEMO_CUSTOMER_PASSWORD = 'password123';

const CATEGORIES = [
  { name: 'Casual', slug: 'casual' },
  { name: 'Formal', slug: 'formal' },
  { name: 'Party', slug: 'party' },
  { name: 'Gym', slug: 'gym' },
];

const DEMO_CUSTOMERS = [
  { name: 'Ava Thompson', email: 'ava@shopco.dev' },
  { name: 'Liam Carter', email: 'liam@shopco.dev' },
  { name: 'Noah Bennett', email: 'noah@shopco.dev' },
  { name: 'Mia Rodriguez', email: 'mia@shopco.dev' },
  { name: 'Ethan Walker', email: 'ethan@shopco.dev' },
];

interface SeedProduct {
  slug: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  /** Fixed product-type list. */
  type: 'T-shirts' | 'Shorts' | 'Shirts' | 'Hoodie' | 'Jeans';
  /** Category slug — the categories double as the "dress style". */
  category: 'casual' | 'formal' | 'party' | 'gym';
}

const PRODUCTS: SeedProduct[] = [
  // --- Casual ---
  {
    slug: 'gradient-graphic-t-shirt',
    name: 'Gradient Graphic T-shirt',
    description:
      'A bold gradient graphic tee in soft, breathable cotton — an easy statement piece for everyday wear.',
    price: 145,
    type: 'T-shirts',
    category: 'casual',
  },
  {
    slug: 'black-striped-t-shirt',
    name: 'Black Striped T-shirt',
    description:
      'Pinstriped tee with a raglan sleeve for a sporty, vintage-inspired look.',
    price: 150,
    discountPrice: 120,
    type: 'T-shirts',
    category: 'casual',
  },
  {
    slug: 'sleeve-striped-t-shirt',
    name: 'Sleeve Striped T-shirt',
    description:
      'Colour-blocked tee with striped sleeves and a contrast body. Relaxed fit.',
    price: 160,
    discountPrice: 130,
    type: 'T-shirts',
    category: 'casual',
  },
  {
    slug: 'courage-graphic-t-shirt',
    name: 'Courage Graphic T-shirt',
    description:
      'Vivid orange graphic tee with an oversized cut and a hand-drawn print.',
    price: 145,
    type: 'T-shirts',
    category: 'casual',
  },
  {
    slug: 'one-life-graphic-t-shirt',
    name: 'One Life Graphic T-shirt',
    description:
      'This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.',
    price: 300,
    discountPrice: 260,
    type: 'T-shirts',
    category: 'casual',
  },
  {
    slug: 't-shirt-with-tape-details',
    name: 'T-shirt with Tape Details',
    description:
      'Minimal black tee with tonal taping down the sleeves for a subtle technical edge.',
    price: 120,
    type: 'T-shirts',
    category: 'casual',
  },
  {
    slug: 'skinny-fit-jeans',
    name: 'Skinny Fit Jeans',
    description:
      'Mid-wash skinny jeans with just enough stretch to move with you all day.',
    price: 260,
    discountPrice: 240,
    type: 'Jeans',
    category: 'casual',
  },
  {
    slug: 'faded-skinny-jeans',
    name: 'Faded Skinny Jeans',
    description: 'Black faded skinny jeans with a lived-in, worn finish.',
    price: 210,
    type: 'Jeans',
    category: 'casual',
  },
  {
    slug: 'checkered-shirt',
    name: 'Checkered Shirt',
    description:
      'A timeless checkered flannel shirt in a comfortable regular fit.',
    price: 180,
    type: 'Shirts',
    category: 'casual',
  },
  {
    slug: 'loose-fit-bermuda-shorts',
    name: 'Loose Fit Bermuda Shorts',
    description: 'Relaxed denim bermuda shorts, cut for warm days off.',
    price: 80,
    type: 'Shorts',
    category: 'casual',
  },
  // --- Formal ---
  {
    slug: 'vertical-striped-shirt',
    name: 'Vertical Striped Shirt',
    description:
      'Lightweight vertical striped shirt with a band collar — effortless smart-casual style.',
    price: 232,
    discountPrice: 212,
    type: 'Shirts',
    category: 'formal',
  },
  {
    slug: 'polo-with-contrast-trims',
    name: 'Polo with Contrast Trims',
    description:
      'Teal polo with contrast trims on the placket and sleeves for a crisp finish.',
    price: 242,
    discountPrice: 212,
    type: 'Shirts',
    category: 'formal',
  },
  {
    slug: 'polo-with-tipping-details',
    name: 'Polo with Tipping Details',
    description:
      'Classic polo with contrast tipping on the collar and cuffs. Smart yet relaxed.',
    price: 180,
    type: 'Shirts',
    category: 'formal',
  },
  {
    slug: 'classic-fit-oxford-shirt',
    name: 'Classic Fit Oxford Shirt',
    description:
      'A crisp cotton Oxford shirt that works from the office to the weekend.',
    price: 195,
    type: 'Shirts',
    category: 'formal',
  },
  // --- Party ---
  {
    slug: 'tailored-party-blazer',
    name: 'Tailored Party Blazer',
    description:
      'A sharp single-breasted blazer with a slim lapel, made for evenings out.',
    price: 420,
    discountPrice: 360,
    type: 'Shirts',
    category: 'party',
  },
  {
    slug: 'satin-evening-shirt',
    name: 'Satin Evening Shirt',
    description:
      'Fluid satin shirt with a subtle sheen — dress it up or wear it open over a tee.',
    price: 260,
    type: 'Shirts',
    category: 'party',
  },
  // --- Gym ---
  {
    slug: 'essential-zip-hoodie',
    name: 'Essential Zip Hoodie',
    description:
      'A heavyweight zip-through hoodie in a mid-grey marl for warm-ups and cool-downs.',
    price: 175,
    type: 'Hoodie',
    category: 'gym',
  },
  {
    slug: 'performance-training-shorts',
    name: 'Performance Training Shorts',
    description: 'Quick-dry training shorts with a hidden zip pocket.',
    price: 95,
    type: 'Shorts',
    category: 'gym',
  },
  {
    slug: 'flex-training-tee',
    name: 'Flex Training Tee',
    description:
      'Lightweight moisture-wicking training tee with four-way stretch.',
    price: 90,
    type: 'T-shirts',
    category: 'gym',
  },
];

const SIZES = ['Small', 'Medium', 'Large', 'X-Large'];
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Orange'];

const REVIEW_COMMENTS = [
  'I absolutely love this — the design is unique and the fabric feels so comfortable.',
  'Exceeded my expectations. The colours are vibrant and the print quality is top-notch.',
  'Great fit and finish. It has quickly become one of my go-to pieces.',
  'Comfortable, well made, and it washes well. Would buy again.',
  'The material is soft and breathable. Perfect for everyday wear.',
  'Solid quality for the price. Sizing was accurate for me.',
  'Looks even better in person. Lots of compliments already.',
  'A fusion of comfort and style — you can tell care went into the details.',
];

const categoryNameBySlug = new Map(CATEGORIES.map((c) => [c.slug, c.name]));

/** Deterministic 2–3 (size, color) variant combos for a product. */
function variantCombosFor(index: number): { size: string; color: string }[] {
  const count = 2 + (index % 2); // 2 or 3
  return Array.from({ length: count }, (_, i) => ({
    size: SIZES[(index + i) % SIZES.length],
    color: COLORS[(index * 2 + i) % COLORS.length],
  }));
}

async function main(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required. ' +
        'Copy .env.example to .env and set them, then run `npm run seed` again.',
    );
  }

  let usersCreated = 0;
  let categoriesCreated = 0;
  let productsCreated = 0;
  let reviewsCreated = 0;

  /* --------------------------------------------------------------------- *
   * Reset the catalog + transactional data so a run is fully deterministic
   * (users are never touched — the admin and any real accounts survive).
   * Re-running still yields the exact same database, so it stays idempotent.
   * --------------------------------------------------------------------- */
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  /* -------------------------- admin (from env) -------------------------- */
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      name: 'Store Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, BCRYPT_COST),
      role: Role.ADMIN,
    },
  });
  if (!existingAdmin) usersCreated += 1;

  /* ------------------------- demo customers --------------------------- */
  const demoHash = await bcrypt.hash(DEMO_CUSTOMER_PASSWORD, BCRYPT_COST);
  const customers: { id: string }[] = [];
  for (const c of DEMO_CUSTOMERS) {
    const existing = await prisma.user.findUnique({ where: { email: c.email } });
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: { name: c.name },
      create: {
        name: c.name,
        email: c.email,
        passwordHash: demoHash,
        role: Role.CUSTOMER,
      },
      select: { id: true },
    });
    customers.push(user);
    if (!existing) usersCreated += 1;
  }

  /* ---------------------------- categories ---------------------------- */
  const categoryIdBySlug = new Map<string, string>();
  for (const c of CATEGORIES) {
    const existing = await prisma.category.findUnique({
      where: { slug: c.slug },
    });
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
      select: { id: true },
    });
    categoryIdBySlug.set(c.slug, row.id);
    if (!existing) categoriesCreated += 1;
  }

  /* ----------------------------- products ----------------------------- */
  for (const [index, p] of PRODUCTS.entries()) {
    const categoryId = categoryIdBySlug.get(p.category);
    if (!categoryId) continue;
    const dressStyle = categoryNameBySlug.get(p.category) ?? null;

    const existing = await prisma.product.findUnique({
      where: { slug: p.slug },
      select: { id: true },
    });

    const scalars = {
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice ?? null,
      type: p.type,
      dressStyle,
      isDeleted: false,
    };

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...scalars, category: { connect: { id: categoryId } } },
      create: {
        slug: p.slug,
        ...scalars,
        category: { connect: { id: categoryId } },
      },
      select: { id: true },
    });
    if (!existing) productsCreated += 1;

    // Images — nothing references ProductImage, so reset them each run.
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: [1, 2].map((n) => ({
        productId: product.id,
        url: `https://picsum.photos/seed/${p.slug}-${n}/600/700`,
      })),
    });

    // Variants — 2–3 per product, stock 10–50.
    await prisma.productVariant.createMany({
      data: variantCombosFor(index).map((combo, i) => ({
        productId: product.id,
        size: combo.size,
        color: combo.color,
        stock: 10 + ((index * 5 + i * 13) % 41),
      })),
    });

    // Reviews — top up to a target (3–5), one review per distinct customer.
    const target = 3 + (index % 3);
    const existingReviews = await prisma.review.findMany({
      where: { productId: product.id },
      select: { userId: true },
    });
    const reviewers = new Set(existingReviews.map((r) => r.userId));
    for (const [ci, customer] of customers.entries()) {
      if (reviewers.size >= target) break;
      if (reviewers.has(customer.id)) continue;
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: customer.id,
          rating: 3 + ((index + ci) % 3), // 3, 4 or 5
          comment: REVIEW_COMMENTS[(index + ci) % REVIEW_COMMENTS.length],
        },
      });
      reviewers.add(customer.id);
      reviewsCreated += 1;
    }
  }

  /* ------------------------------ summary ----------------------------- */
  const [userCount, categoryCount, productCount, reviewCount] = await Promise.all(
    [
      prisma.user.count(),
      prisma.category.count(),
      prisma.product.count(),
      prisma.review.count(),
    ],
  );

  console.log('\nSeed complete.');
  console.log('  created this run:');
  console.log(`    users      ${usersCreated}`);
  console.log(`    categories ${categoriesCreated}`);
  console.log(`    products   ${productsCreated}`);
  console.log(`    reviews    ${reviewsCreated}`);
  console.log('  totals in database:');
  console.log(`    users      ${userCount}`);
  console.log(`    categories ${categoryCount}`);
  console.log(`    products   ${productCount}`);
  console.log(`    reviews    ${reviewCount}`);
  console.log(`\n  admin:     ${adminEmail} (password from ADMIN_PASSWORD)`);
  console.log(
    `  customers: ${DEMO_CUSTOMERS.map((c) => c.email).join(', ')} (password: ${DEMO_CUSTOMER_PASSWORD})\n`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
