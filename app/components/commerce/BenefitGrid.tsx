import { BadgeCheck, Gem, PackageCheck, ScrollText, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  { icon: ScrollText, title: "Cartas com dados claros", text: "Jogo, edicao, idioma, raridade, condicao, foil e estoque visiveis." },
  { icon: ShieldCheck, title: "Protecao de colecao", text: "Sleeves, top loaders, deck boxes, ficharios e embalagens reforcadas." },
  { icon: PackageCheck, title: "Selados confiaveis", text: "Boosters, displays e produtos lacrados com estoque organizado." },
  { icon: BadgeCheck, title: "Acessorios essenciais", text: "Playmats, dados, tokens, marcadores e itens para torneios." },
  { icon: Gem, title: "Reliquias personalizadas", text: "Produtos sob demanda com tema, cor, material e preco extra por opcao." },
  { icon: Truck, title: "Envio para todo Brasil", text: "Arquitetura preparada para Correios, Melhor Envio e frete personalizado." }
];

export function BenefitGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map((benefit) => (
        <article key={benefit.title} className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <benefit.icon className="size-6 text-gold" />
          <h3 className="mt-4 font-bold text-frost">{benefit.title}</h3>
          <p className="mt-2 text-sm leading-6 text-mist">{benefit.text}</p>
        </article>
      ))}
    </div>
  );
}
