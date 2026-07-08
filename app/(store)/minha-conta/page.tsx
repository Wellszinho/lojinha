import { Heart, KeyRound, MapPin, Package, UserRound } from "lucide-react";
import type { Metadata } from "next";

import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Minha Conta",
  description: "Pedidos, favoritos, endereços e dados pessoais."
};

const cards = [
  { icon: Package, title: "Pedidos", text: "Acompanhe pagamento, produção, envio e entrega." },
  { icon: Heart, title: "Favoritos", text: "Produtos salvos para comprar depois." },
  { icon: MapPin, title: "Endereços", text: "Gerencie endereços de entrega." },
  { icon: UserRound, title: "Dados pessoais", text: "Nome, email, telefone e preferências." },
  { icon: KeyRound, title: "Senha", text: "Alteração segura de senha." }
];

export default function AccountPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader eyebrow="Minha Conta" title="Central do cliente." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-premium border border-white/10 bg-white/[.045] p-5">
              <card.icon className="size-6 text-gold" />
              <h2 className="mt-4 font-bold text-frost">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-mist">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
