import type { Metadata } from "next";

import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { searchCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Pesquisa",
  description: "Busca inteligente de produtos, categorias, coleções e compatibilidade."
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = searchCatalog(q);

  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader
          eyebrow="Pesquisa"
          title={q ? `Resultados para “${q}”` : "Busque cartas, selados e acessorios"}
          description="A busca cruza nome, tipo, jogo, edicao, categoria, colecao, tags e compatibilidade."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {results.length === 0 ? (
          <div className="rounded-premium border border-white/10 bg-white/[.045] p-8 text-center text-mist">
            Nenhum produto encontrado.
          </div>
        ) : null}
      </div>
    </section>
  );
}
