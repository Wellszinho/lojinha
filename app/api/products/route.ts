import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

import { authOptions } from "@/lib/auth";
import { categories, collections, products } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { assertAdmin, rateLimit } from "@/lib/security";
import { productUpsertSchema } from "@/lib/validations";

const productTypeToPrisma = {
  "carta-avulsa": "CARD_SINGLE",
  "deck-box": "DECK_BOX",
  sleeve: "SLEEVE",
  booster: "BOOSTER",
  display: "DISPLAY",
  playmat: "PLAYMAT",
  token: "TOKEN",
  dado: "DICE",
  fichario: "BINDER",
  "produto-personalizado": "CUSTOM_PRODUCT",
  outro: "OTHER"
} as const;

function collectionMeta(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;

  return NextResponse.json({
    products,
    categories,
    collections
  });
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!assertAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = productUpsertSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Produto invalido.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;
  const categoryMeta = categories.find((categoryItem) => categoryItem.slug === data.categoryId);

  try {
    const category = await prisma.category.upsert({
      where: { slug: data.categoryId },
      update: {
        name: categoryMeta?.name ?? data.categoryId
      },
      create: {
        name: categoryMeta?.name ?? data.categoryId,
        slug: data.categoryId,
        description: categoryMeta?.description
      }
    });

    const collection = data.collectionId
      ? await prisma.collection.upsert({
          where: { slug: data.collectionId },
          update: {
            name: collectionMeta(data.collectionId)?.name ?? data.collectionId
          },
          create: {
            name: collectionMeta(data.collectionId)?.name ?? data.collectionId,
            slug: data.collectionId,
            description: collectionMeta(data.collectionId)?.description
          }
        })
      : null;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        productType: productTypeToPrisma[data.productType],
        price: data.price / 100,
        compareAtPrice: data.compareAtPrice ? data.compareAtPrice / 100 : undefined,
        sku: data.sku,
        stock: data.stock,
        material: data.material,
        compatibility: data.compatibility,
        tags: data.tags,
        categoryId: category.id,
        collectionId: collection?.id,
        cardName: data.card?.cardName,
        game: data.card?.game ?? data.sealed?.game,
        edition: data.card?.edition,
        language: data.card?.language ?? data.sealed?.language,
        rarity: data.card?.rarity,
        condition: data.card?.condition,
        isFoil: data.card?.foil ?? false,
        frontImageUrl: data.card?.frontImage,
        backImageUrl: data.card?.backImage,
        sealedCollection: data.sealed?.set,
        sealedProductType: data.sealed?.sealedType,
        accessoryMaterial: data.accessory?.material,
        accessoryDimensions: data.accessory?.dimensions,
        accessoryCapacity: data.accessory?.capacity,
        accessoryTheme: data.accessory?.theme,
        accessoryColor: data.accessory?.color,
        images: data.card?.frontImage
          ? {
              create: [
                {
                  url: data.card.frontImage,
                  alt: `${data.name} frente`,
                  sortOrder: 0
                },
                ...(data.card.backImage
                  ? [
                      {
                        url: data.card.backImage,
                        alt: `${data.name} verso`,
                        sortOrder: 1
                      }
                    ]
                  : [])
              ]
            }
          : undefined
      }
    });

    return NextResponse.json(
      {
        message: "Produto cadastrado com sucesso.",
        product
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Slug ou SKU ja cadastrado." }, { status: 409 });
    }

    return NextResponse.json({ error: "Nao foi possivel cadastrar o produto." }, { status: 500 });
  }
}
