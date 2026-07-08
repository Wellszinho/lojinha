import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

import { products } from "@/lib/catalog";
import { getPaymentProvider } from "@/lib/payments";
import { rateLimit } from "@/lib/security";
import { quoteShipping } from "@/lib/shipping";
import { checkoutSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 12);
  if (limited) return limited;

  const payload = await request.json();
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Checkout inválido.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const items = parsed.data.items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) return null;
    return {
      product,
      quantity: item.quantity,
      name: item.name ?? product.name,
      unitPrice: item.unitPrice ?? product.price,
      total: (item.unitPrice ?? product.price) * item.quantity
    };
  });

  if (items.some((item) => item === null)) {
    return NextResponse.json({ error: "Produto indisponível." }, { status: 422 });
  }

  const safeItems = items.filter(Boolean) as Array<{
    product: (typeof products)[number];
    quantity: number;
    name: string;
    unitPrice: number;
    total: number;
  }>;

  const subtotalInCents = safeItems.reduce((sum, item) => sum + item.total, 0);
  const [shipping] = await quoteShipping({
    postalCode: parsed.data.address.zipCode,
    subtotalInCents,
    weightInGrams: safeItems.reduce((sum, item) => sum + 320 * item.quantity, 0)
  });

  const orderId = `MTG-${randomUUID().slice(0, 8).toUpperCase()}`;
  const payment = await getPaymentProvider("mercado-pago").createIntent({
    orderId,
    amountInCents: subtotalInCents + shipping.amountInCents,
    customerEmail: parsed.data.customer.email,
    method: parsed.data.paymentMethod
  });

  return NextResponse.json({
    order: {
      id: orderId,
      status: "RECEIVED",
      subtotalInCents,
      shipping,
      totalInCents: subtotalInCents + shipping.amountInCents,
      items: safeItems.map((item) => ({
        productId: item.product.id,
        name: item.name,
        quantity: item.quantity,
        totalInCents: item.total
      }))
    },
    payment
  });
}
