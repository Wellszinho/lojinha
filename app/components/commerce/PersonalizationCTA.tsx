import { Palette, Plus, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";

export function PersonalizationCTA() {
  return (
    <section className="section-band">
      <div className="container-shell">
        <div className="grid gap-8 rounded-premium border border-gold/25 bg-gradient-to-br from-gold/14 via-violet/12 to-white/[.04] p-6 md:grid-cols-[1fr_.75fr] md:p-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-premium border border-gold/30 bg-black/25 px-3 py-2 text-sm font-semibold text-gold">
              <Palette className="size-4" />
              Personalizados
            </div>
            <h2 className="max-w-2xl text-2xl font-black text-frost sm:text-3xl">
              Crie uma reliquia unica: deck box, token, playmat ou acessorio com o seu tema.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-mist sm:text-base">
              O modulo aceita campos extras, precos adicionais, listas de opcoes, upload de referencia e aprovacao
              administrativa antes da producao.
            </p>
            <ButtonLink href="/personalizados" className="mt-6">
              Solicitar personalizado <Sparkles className="size-4" />
            </ButtonLink>
          </div>
          <div className="grid content-center gap-3">
            {["Tema medieval ou geek", "Nome ou nick", "Cores e materiais", "Upload de referencia"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-premium border border-white/10 bg-black/22 p-3">
                <span className="grid size-8 place-items-center rounded-premium bg-gold/15 text-gold">
                  <Plus className="size-4" />
                </span>
                <span className="text-sm font-semibold text-frost">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
