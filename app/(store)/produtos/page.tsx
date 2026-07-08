import type { Metadata } from "next";

import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductFilters } from "@/components/commerce/ProductFilters";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Loja de Magic com cartas avulsas, boosters, displays, deck boxes, sleeves, playmats e acessorios."
};

export default function ProductsPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Loja"
          title="Produtos Magic, colecionismo e mesa organizada"
          description="Filtre por tipo, categoria, colecao, disponibilidade, novidades, ofertas e mais vendidos."
        />
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <ProductFilters />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
