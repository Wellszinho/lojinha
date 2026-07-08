import type { Metadata } from "next";

import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Cartas Avulsas",
  description: "Cartas avulsas com jogo, edicao, idioma, raridade, condicao, foil e estoque."
};

export default function SinglesPage() {
  const singles = products.filter((product) => product.productType === "carta-avulsa");

  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Cartas Avulsas"
          title="Singles raras, staples e cartas de colecao."
          description="Cada carta pode ter jogo, edicao, idioma, raridade, condicao, foil, estoque, preco, imagem frente e verso opcional."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {singles.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
