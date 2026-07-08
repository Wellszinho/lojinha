import type { Metadata } from "next";

import { CheckoutForm } from "@/components/commerce/CheckoutForm";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout simples com dados pessoais, entrega, pagamento e resumo do pedido."
};

export default function CheckoutPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Checkout"
          title="Poucos passos até proteger seu deck."
          description="Dados pessoais, entrega, pagamento e resumo em uma única jornada."
        />
        <CheckoutForm />
      </div>
    </section>
  );
}
