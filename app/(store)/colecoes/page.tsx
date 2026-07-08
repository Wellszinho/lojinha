import type { Metadata } from "next";

import { CollectionRail } from "@/components/commerce/CollectionRail";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Coleções",
  description: "Colecoes tematicas Magic The Galo para cartas, selados, acessorios e personalizados."
};

export default function CollectionsPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Coleções"
          title="Linhas visuais prontas para crescer."
          description="Cada colecao pode destacar cartas raras, selados, acessorios, banners e paginas promocionais pelo CMS."
        />
        <CollectionRail />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
