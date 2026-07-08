import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@magicthegalo.com" },
    update: {},
    create: {
      name: "Admin Magic The Galo",
      email: "admin@magicthegalo.com",
      passwordHash,
      role: "ADMIN"
    }
  });

  const category = await prisma.category.upsert({
    where: { slug: "cartas-avulsas" },
    update: {
      name: "Cartas Avulsas",
      description: "Singles raras, staples competitivas e cartas para colecionadores."
    },
    create: {
      name: "Cartas Avulsas",
      slug: "cartas-avulsas",
      description: "Singles raras, staples competitivas e cartas para colecionadores."
    }
  });

  const collection = await prisma.collection.upsert({
    where: { slug: "reliquias-arcanas" },
    update: {
      name: "Reliquias Arcanas",
      description: "Cartas raras, selados e acessorios com visual de grimorio premium.",
      isFeatured: true
    },
    create: {
      name: "Reliquias Arcanas",
      slug: "reliquias-arcanas",
      description: "Cartas raras, selados e acessorios com visual de grimorio premium.",
      isFeatured: true
    }
  });

  await prisma.product.upsert({
    where: { slug: "sol-ring-commander-masters" },
    update: {
      productType: "CARD_SINGLE",
      stock: 7,
      isFeatured: true,
      isWeeklyDeal: true
    },
    create: {
      name: "Sol Ring - Commander Masters",
      slug: "sol-ring-commander-masters",
      description: "Carta avulsa essencial para Commander, revisada e embalada para colecionadores.",
      productType: "CARD_SINGLE",
      price: 49.9,
      compareAtPrice: 59.9,
      sku: "MTG-SOL-CMM-001",
      stock: 7,
      isFeatured: true,
      isWeeklyDeal: true,
      material: "Card stock original",
      compatibility: ["Magic", "Commander"],
      tags: ["single", "commander", "rara", "oferta"],
      cardName: "Sol Ring",
      game: "Magic: The Gathering",
      edition: "Commander Masters",
      language: "Ingles",
      rarity: "Uncommon",
      condition: "Near Mint",
      isFoil: false,
      frontImageUrl: "/images/magic-the-galo-logo.png",
      categoryId: category.id,
      collectionId: collection.id,
      images: {
        create: {
          url: "/images/magic-the-galo-logo.png",
          alt: "Carta avulsa Magic The Galo"
        }
      }
    }
  });

  await prisma.storeSettings.upsert({
    where: { id: "store-settings" },
    update: {
      name: "Magic The Galo",
      description: "Cartas, acessorios e reliquias para jogadores lendarios.",
      logoUrl: "/images/magic-the-galo-logo.png",
      faviconUrl: "/images/magic-the-galo-logo.png",
      metaTitle: "Magic The Galo | Loja Magic",
      metaDescription: "Cartas avulsas, selados, deck boxes e acessorios para Magic."
    },
    create: {
      id: "store-settings",
      name: "Magic The Galo",
      description: "Cartas, acessorios e reliquias para jogadores lendarios.",
      logoUrl: "/images/magic-the-galo-logo.png",
      faviconUrl: "/images/magic-the-galo-logo.png",
      email: "contato@magicthegalo.com",
      whatsapp: "5511999999999",
      instagram: "https://instagram.com/magicthegalo",
      metaTitle: "Magic The Galo | Loja Magic",
      metaDescription: "Cartas avulsas, selados, deck boxes e acessorios para Magic."
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "seed",
      entity: "database",
      metadata: { source: "prisma/seed.ts", concept: "magic-store" }
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
