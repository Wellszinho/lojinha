import { Check, Palette } from "lucide-react";
import type { Metadata } from "next";

import { ProductCard } from "@/components/commerce/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Produtos Personalizados",
  description: "Produtos personalizados para Magic com campos e precos extras configuraveis."
};

const options = [
  "Deck boxes com tema e nome",
  "Tokens e marcadores personalizados",
  "Playmats sob demanda",
  "Cores, materiais e acabamento",
  "Upload de referencia visual",
  "Precos extras por opcao"
];

export default function CustomPage() {
  const customProducts = products.filter((product) => product.productType === "produto-personalizado");

  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_.75fr]">
          <div>
            <SectionHeader
              eyebrow="Personalizados"
              title="Reliquias unicas para jogadores e colecionadores."
              description="Produtos sob demanda com tema, cor, material, gravacao, arte e campos configuraveis no painel administrativo."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((option) => (
                <div key={option} className="flex items-center gap-3 rounded-premium border border-white/10 bg-white/[.045] p-4">
                  <Check className="size-5 text-gold" />
                  <span className="text-sm font-semibold text-frost">{option}</span>
                </div>
              ))}
            </div>
            <ButtonLink href="/contato" className="mt-8">
              <Palette className="size-4" />
              Solicitar produto personalizado
            </ButtonLink>
          </div>
          <div className="rounded-premium border border-gold/25 bg-gradient-to-br from-gold/16 via-violet/14 to-white/[.04] p-6">
            <h2 className="text-xl font-black text-frost">Modulo preparado</h2>
            <div className="mt-5 space-y-3 text-sm text-mist">
              <p>Campos personalizados: texto, selecao, cor, checkbox e upload.</p>
              <p>Preco extra por opcao e regra de obrigatoriedade.</p>
              <p>Status ativo/inativo para campanhas, eventos e colecoes limitadas.</p>
              <p>Administracao separada em /admin/personalizacoes.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {customProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
