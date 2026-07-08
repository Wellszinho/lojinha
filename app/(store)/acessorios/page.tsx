import type { Metadata } from "next";

import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Acessorios",
  description: "Sleeves, playmats, dados, tokens, ficharios, pastas e acessorios para Magic."
};

export default function AccessoriesPage() {
  const accessories = products.filter((product) =>
    ["sleeve", "playmat", "token", "dado", "fichario", "outro"].includes(product.productType)
  );

  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Acessorios"
          title="Tudo para proteger, organizar e jogar melhor."
          description="Sleeves, playmats, dados, marcadores, tokens, ficharios e pastas para Magic."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {accessories.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
