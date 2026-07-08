import { z } from "zod";

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10)
  }),
  address: z.object({
    zipCode: z.string().min(8),
    street: z.string().min(3),
    number: z.string().min(1),
    district: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2)
  }),
  paymentMethod: z.enum(["pix", "card", "boleto"]),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string().optional(),
        unitPrice: z.number().int().positive().optional(),
        quantity: z.number().int().positive()
      })
    )
    .min(1),
  coupon: z.string().optional()
});

export const productUpsertSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(20),
  productType: z
    .enum([
      "carta-avulsa",
      "deck-box",
      "sleeve",
      "booster",
      "display",
      "playmat",
      "token",
      "dado",
      "fichario",
      "produto-personalizado",
      "outro"
    ])
    .default("outro"),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional(),
  categoryId: z.string(),
  collectionId: z.string().optional(),
  sku: z.string().min(3),
  stock: z.number().int().min(0),
  material: z.string().min(3),
  compatibility: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  card: z
    .object({
      cardName: z.string(),
      game: z.string(),
      edition: z.string(),
      language: z.string(),
      rarity: z.string(),
      condition: z.string(),
      foil: z.boolean().default(false),
      frontImage: z.string(),
      backImage: z.string().optional()
    })
    .optional(),
  sealed: z
    .object({
      game: z.string(),
      set: z.string(),
      language: z.string(),
      sealedType: z.string()
    })
    .optional(),
  accessory: z
    .object({
      material: z.string(),
      dimensions: z.string(),
      capacity: z.string().optional(),
      theme: z.string(),
      color: z.string()
    })
    .optional()
});
