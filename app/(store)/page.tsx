import { ArrowRight, BrainCircuit, Handshake } from "lucide-react";

import { BenefitGrid } from "@/components/commerce/BenefitGrid";
import { CategoryGrid } from "@/components/commerce/CategoryGrid";
import { Hero } from "@/components/commerce/Hero";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ReviewGrid } from "@/components/commerce/ReviewGrid";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";

export default function StoreHomePage() {
  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const rareCards = products.filter((product) => product.productType === "carta-avulsa").slice(0, 4);
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="section-band bg-white/[.025]">
        <div className="container-shell">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="grid gap-6 rounded-premium border border-gold/20 bg-black/24 p-6 shadow-premium lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-bold text-gold">
                  <BrainCircuit className="size-4" />
                  Inteligência para Magic
                </p>
                <h2 className="mt-3 text-2xl font-black text-frost md:text-3xl">Analise seu deck como um jogador profissional.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-mist">
                  Escolha jogo e formato, importe lista, arquivo ou link e receba power level, curva, combos, matchups, counters e upgrades.
                </p>
              </div>
              <ButtonLink href="/deck-analyzer" size="lg">
                Abrir analisador <ArrowRight className="size-5" />
              </ButtonLink>
            </div>

            <div className="grid gap-6 rounded-premium border border-violet/25 bg-black/24 p-6 shadow-premium lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-bold text-gold">
                  <Handshake className="size-4" />
                  Classificados da comunidade
                </p>
                <h2 className="mt-3 text-2xl font-black text-frost md:text-3xl">Venda, troque ou procure cartas específicas.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-mist">
                  Anuncie singles de Magic e conecte ofertas com quem está procurando a mesma carta.
                </p>
              </div>
              <ButtonLink href="/marketplace" size="lg" variant="secondary">
                Ver classificados <ArrowRight className="size-5" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-shell">
          <SectionHeader
            eyebrow="Categorias"
            title="Tudo para jogar, colecionar e proteger suas relíquias."
            description="Cartas avulsas, produtos selados, deck boxes, sleeves, playmats, dados, tokens, fichários e personalizados."
          />
          <CategoryGrid />
        </div>
      </section>

      <section className="section-band bg-white/[.025]">
        <div className="container-shell">
          <SectionHeader
            eyebrow="Destaques"
            title="Deck boxes premium, selados e acessórios essenciais."
            description="Uma vitrine completa para quem quer comprar, proteger, organizar e exibir cartas com estilo."
            action={
              <ButtonLink href="/produtos" variant="secondary">
                Ver loja <ArrowRight className="size-4" />
              </ButtonLink>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-shell">
          <SectionHeader
            eyebrow="Cartas raras"
            title="Singles de desejo para completar decks e coleções."
            description="Cartas avulsas com jogo, edição, idioma, raridade, condição e estoque sempre visíveis."
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {rareCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-band bg-white/[.025]">
        <div className="container-shell">
          <SectionHeader eyebrow="Mais vendidos" title="Itens que os jogadores estão levando para a mesa." />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-shell">
          <SectionHeader eyebrow="Por que comprar" title="Uma loja pensada para colecionismo, raridade e proteção." />
          <BenefitGrid />
        </div>
      </section>

      <section className="section-band bg-white/[.025]">
        <div className="container-shell">
          <SectionHeader eyebrow="Avaliações" title="A experiência que jogadores e colecionadores esperam." />
          <ReviewGrid />
        </div>
      </section>
    </>
  );
}
