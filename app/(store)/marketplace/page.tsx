import type { Metadata } from "next";

import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";

export const metadata: Metadata = {
  title: "Classificados Magic",
  description:
    "Anuncie cartas de Magic para vender ou trocar e encontre jogadores procurando singles para Commander, Standard, Modern, Pioneer e outros formatos."
};

export default function MarketplacePage() {
  return (
    <div className="pt-28">
      <section className="section-band pb-10">
        <div className="container-shell">
          <p className="text-xs font-bold uppercase text-gold">Classificados Magic</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-frost md:text-6xl">
            Anuncie, procure e conecte jogadores por cartas especificas.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-mist md:text-lg">
            Um espaco da comunidade Magic The Galo para vender, trocar e encontrar cartas avulsas de Magic.
            Publique o que voce tem ou o que esta procurando e veja possiveis conexoes automaticamente.
          </p>
        </div>
      </section>

      <section className="section-band pt-0">
        <div className="container-shell">
          <MarketplaceClient />
        </div>
      </section>
    </div>
  );
}
