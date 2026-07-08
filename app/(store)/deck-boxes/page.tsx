import type { Metadata } from "next";

import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Deck Boxes",
  description: "Deck boxes premium para proteger decks e colecoes de Magic."
};

export default function DeckBoxesPage() {
  const deckBoxes = products.filter((product) => product.productType === "deck-box" || product.productType === "produto-personalizado");

  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Deck Boxes"
          title="Protecao premium para decks lendarios."
          description="Modelos magneticos e personalizados para Commander, Modern, Pioneer e colecoes de Magic."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {deckBoxes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
