import type { Metadata } from "next";

import { BenefitGrid } from "@/components/commerce/BenefitGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheca a Magic The Galo."
};

export default function AboutPage() {
  return (
    <>
      <section className="section-band pt-32">
        <div className="container-shell">
          <SectionHeader
            eyebrow="Sobre"
            title="Uma loja premium para Magic: The Gathering."
            description="A Magic The Galo nasce para unir nostalgia, raridade, magia, protecao e desejo de compra em uma experiencia completa para jogadores e colecionadores de Magic."
          />
          <div className="rounded-premium border border-white/10 bg-white/[.045] p-6 text-sm leading-7 text-mist">
            <p>
              O projeto foi estruturado para crescer: cartas avulsas com campos especificos, produtos selados,
              acessorios, personalizados, catalogo por categorias e colecoes, SEO automatico, CMS, upload de midia,
              painel administrativo, autenticacao por funcao, APIs organizadas e integracoes preparadas para pagamento
              e frete.
            </p>
          </div>
        </div>
      </section>
      <section className="section-band bg-white/[.025]">
        <div className="container-shell">
          <BenefitGrid />
        </div>
      </section>
    </>
  );
}
