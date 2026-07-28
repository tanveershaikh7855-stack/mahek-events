/**
 * Seeds the database from the static content CMS in lib/content.ts.
 *
 *   npm run db:seed
 *
 * Idempotent — every write is an upsert keyed on a natural unique column, so
 * running it repeatedly will not create duplicates.
 */
import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  productCategories,
  products,
  galleryImages,
  delivery,
} from "../lib/content";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL (or DIRECT_URL) must be set to seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function seedCategories() {
  for (const [index, category] of productCategories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.subtitle,
        image: category.image,
        sortOrder: index,
      },
      create: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.subtitle,
        image: category.image,
        type: "PRODUCT",
        sortOrder: index,
      },
    });
  }
  console.log(`  categories: ${productCategories.length}`);
}

async function seedProducts() {
  for (const product of products) {
    const data = {
      name: product.name,
      description: product.description,
      shortDesc: product.shortDesc,
      basePrice: new Prisma.Decimal(product.basePrice),
      salePrice:
        product.salePrice != null ? new Prisma.Decimal(product.salePrice) : null,
      stock: product.stock,
      images: product.images,
      variants: product.variants ?? [],
      rating: product.rating,
      reviewCount: product.reviewCount,
      isFeatured: product.isFeatured,
      deliveryBadge: product.deliveryBadge,
      tags: product.tags?.join(","),
      categoryId: product.categoryId,
    };

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: { ...data, id: product.id, slug: product.slug, sku: product.sku },
    });
  }
  console.log(`  products: ${products.length}`);
}

async function seedGallery() {
  for (const [index, image] of galleryImages.entries()) {
    const existing = await prisma.galleryImage.findFirst({
      where: { image: image.image },
    });
    if (existing) continue;

    await prisma.galleryImage.create({
      data: {
        title: image.title,
        image: image.image,
        category: image.category,
        sortOrder: index,
      },
    });
  }
  console.log(`  gallery images: ${galleryImages.length}`);
}

async function seedDeliveryCharges() {
  const existing = await prisma.deliveryCharge.count();
  if (existing > 0) {
    console.log("  delivery charges: already present, skipped");
    return;
  }

  await prisma.deliveryCharge.createMany({
    data: delivery.charges.map((slab) => ({
      minDistance: slab.minDistance,
      maxDistance: slab.maxDistance,
      charge: new Prisma.Decimal(slab.charge),
      freeAbove:
        slab.freeAbove != null ? new Prisma.Decimal(slab.freeAbove) : null,
    })),
  });
  console.log(`  delivery charges: ${delivery.charges.length}`);
}

/**
 * Creates the first admin only when ADMIN_EMAIL and ADMIN_SEED_PASSWORD are
 * both set. Never invents a default password — the previous code shipped
 * "admin123" as a hardcoded fallback.
 */
async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminEmail || !seedPassword) {
    console.log(
      "  admin user: skipped (set ADMIN_EMAIL and ADMIN_SEED_PASSWORD to create one)",
    );
    return;
  }

  if (seedPassword.length < 10) {
    throw new Error("ADMIN_SEED_PASSWORD must be at least 10 characters.");
  }

  const passwordHash = await bcrypt.hash(seedPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail.toLowerCase(),
      password: passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`  admin user: ${adminEmail}`);
}

async function main() {
  console.log("Seeding Mahek Balloon database...");
  await seedCategories();
  await seedProducts();
  await seedGallery();
  await seedDeliveryCharges();
  await seedAdmin();
  console.log("Done.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
