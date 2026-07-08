export type ShippingQuoteInput = {
  postalCode: string;
  weightInGrams: number;
  subtotalInCents: number;
};

export type ShippingQuote = {
  provider: "correios" | "melhor-envio" | "custom";
  service: string;
  amountInCents: number;
  deliveryDays: number;
};

export async function quoteShipping(input: ShippingQuoteInput): Promise<ShippingQuote[]> {
  const freeShipping = input.subtotalInCents >= 35000;

  return [
    {
      provider: "melhor-envio",
      service: freeShipping ? "Expresso Premium" : "Expresso",
      amountInCents: freeShipping ? 0 : 2490,
      deliveryDays: 4
    },
    {
      provider: "correios",
      service: "PAC Seguro",
      amountInCents: freeShipping ? 0 : 1790,
      deliveryDays: 8
    },
    {
      provider: "custom",
      service: "Retirada em evento parceiro",
      amountInCents: 0,
      deliveryDays: 2
    }
  ];
}
