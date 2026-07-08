import { ChevronDown, Star } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductGallery, ProductPurchasePanel } from "@/components/commerce/ProductPurchasePanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProductBySlug, productTypeLabels, products } from "@/lib/catalog";
import { productJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: ["/images/magic-the-galo-hero.png"]
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />

      <section className="section-band pt-32">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_440px]">
          <ProductGallery product={product} />
          <ProductPurchasePanel product={product} />
        </div>
      </section>

      <section className="section-band bg-white/[.025]">
        <div className="container-shell grid gap-6 lg:grid-cols-[1fr_.85fr]">
          <div className="rounded-premium border border-white/10 bg-white/[.045] p-6">
            <h2 className="text-2xl font-black text-frost">Descrição</h2>
            <p className="mt-4 text-sm leading-7 text-mist">{product.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.specs.map((spec) => (
                <div key={spec} className="rounded-premium border border-white/10 bg-black/20 p-4 text-sm text-mist">
                  {spec}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-premium border border-white/10 bg-white/[.045] p-6">
            <h2 className="text-2xl font-black text-frost">Especificações</h2>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-mist">Tipo</dt>
                <dd className="text-right font-semibold text-frost">{productTypeLabels[product.productType]}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-mist">Material</dt>
                <dd className="text-right font-semibold text-frost">{product.material}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-mist">SKU</dt>
                <dd className="font-semibold text-frost">{product.sku}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-mist">Peso</dt>
                <dd className="font-semibold text-frost">{product.dimensions.weight}</dd>
              </div>
              <div>
                <dt className="text-mist">Compatibilidade</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {product.compatibility.map((item) => (
                    <span key={item} className="rounded-premium border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            {product.card ? (
              <div className="mt-6 rounded-premium border border-gold/20 bg-gold/10 p-4">
                <h3 className="font-bold text-gold">Dados da carta avulsa</h3>
                <dl className="mt-4 grid gap-2 text-sm text-mist">
                  {[
                    ["Nome da carta", product.card.cardName],
                    ["Jogo", product.card.game],
                    ["Edicao", product.card.edition],
                    ["Idioma", product.card.language],
                    ["Raridade", product.card.rarity],
                    ["Condicao", product.card.condition],
                    ["Foil", product.card.foil ? "Sim" : "Nao"]
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt>{label}</dt>
                      <dd className="text-right font-semibold text-frost">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {product.sealed ? (
              <div className="mt-6 rounded-premium border border-gold/20 bg-gold/10 p-4">
                <h3 className="font-bold text-gold">Dados do produto selado</h3>
                <dl className="mt-4 grid gap-2 text-sm text-mist">
                  {[
                    ["Jogo", product.sealed.game],
                    ["Colecao", product.sealed.set],
                    ["Idioma", product.sealed.language],
                    ["Tipo de produto", product.sealed.sealedType]
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt>{label}</dt>
                      <dd className="text-right font-semibold text-frost">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {product.accessory ? (
              <div className="mt-6 rounded-premium border border-gold/20 bg-gold/10 p-4">
                <h3 className="font-bold text-gold">Dados do acessorio</h3>
                <dl className="mt-4 grid gap-2 text-sm text-mist">
                  {[
                    ["Material", product.accessory.material],
                    ["Dimensoes", product.accessory.dimensions],
                    ["Capacidade", product.accessory.capacity ?? "-"],
                    ["Tema", product.accessory.theme],
                    ["Cor", product.accessory.color]
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt>{label}</dt>
                      <dd className="text-right font-semibold text-frost">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-shell">
          <SectionHeader eyebrow="Avaliações" title="Feedback de jogadores" />
          <div className="grid gap-4 md:grid-cols-3">
            {["Acabamento impecável.", "Fecho muito seguro.", "Cabe double sleeve sem apertar."].map((review) => (
              <article key={review} className="rounded-premium border border-white/10 bg-white/[.045] p-5">
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-mist">{review}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band bg-white/[.025]">
        <div className="container-shell">
          <SectionHeader eyebrow="FAQ" title="Dúvidas frequentes" />
          <div className="grid gap-3">
            {[
              ["O estoque e real?", "Sim, cada produto exibe quantidade disponivel e pode ser integrado ao Prisma/PostgreSQL."],
              ["Como cartas avulsas sao enviadas?", "Cartas podem ser enviadas com sleeve, top loader e embalagem reforcada."],
              ["Produtos personalizados entram aqui?", "Sim, a personalizacao pode adicionar preco extra, campos configuraveis e aprovacao."]
            ].map(([question, answer]) => (
              <details key={question} className="rounded-premium border border-white/10 bg-white/[.045] p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-frost">
                  {question}
                  <ChevronDown className="size-4 text-gold" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-mist">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-shell">
          <SectionHeader eyebrow="Relacionados" title="Produtos vistos recentemente e recomendações" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
