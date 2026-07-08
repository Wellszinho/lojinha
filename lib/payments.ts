export type PaymentIntentInput = {
  orderId: string;
  amountInCents: number;
  customerEmail: string;
  method: "pix" | "card" | "boleto";
};

export type PaymentIntentResult = {
  provider: "mercado-pago" | "stripe" | "pix" | "boleto";
  status: "created" | "requires_action";
  checkoutUrl?: string;
  pixQrCode?: string;
};

export interface PaymentProvider {
  createIntent(input: PaymentIntentInput): Promise<PaymentIntentResult>;
}

class MercadoPagoProvider implements PaymentProvider {
  async createIntent(input: PaymentIntentInput) {
    return {
      provider: "mercado-pago" as const,
      status: "created" as const,
      checkoutUrl: `/checkout/pagamento?pedido=${input.orderId}&metodo=${input.method}`
    };
  }
}

class StripeProvider implements PaymentProvider {
  async createIntent(input: PaymentIntentInput) {
    return {
      provider: "stripe" as const,
      status: "created" as const,
      checkoutUrl: `/checkout/pagamento?pedido=${input.orderId}&metodo=${input.method}`
    };
  }
}

export function getPaymentProvider(provider: "mercado-pago" | "stripe" = "mercado-pago") {
  return provider === "stripe" ? new StripeProvider() : new MercadoPagoProvider();
}
