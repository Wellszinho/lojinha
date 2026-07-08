import type { Metadata } from "next";

import { CartPageClient } from "@/components/commerce/CartPageClient";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Revise produtos, quantidades, cupom, frete e total antes do checkout."
};

export default function CartPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader eyebrow="Carrinho" title="Revise sua compra." />
        <CartPageClient />
      </div>
    </section>
  );
}
