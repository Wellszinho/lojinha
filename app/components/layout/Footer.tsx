import { Instagram, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/ui/Logo";

const usefulLinks = [
  ["Produtos", "/produtos"],
  ["Classificados Magic", "/marketplace"],
  ["Criar Deck", "/criar-deck"],
  ["Analisador de Deck", "/deck-analyzer"],
  ["Cartas Avulsas", "/cartas-avulsas"],
  ["Deck Boxes", "/deck-boxes"],
  ["Acessorios", "/acessorios"],
  ["Colecoes", "/colecoes"],
  ["Personalizados", "/personalizados"],
  ["Favoritos", "/favoritos"]
];

const institutionalLinks = [
  ["Sobre", "/sobre"],
  ["Contato", "/contato"],
  ["Politica", "/politica"],
  ["Termos", "/politica#termos"]
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/35">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.3fr_.7fr_.7fr_.8fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-mist">
            Cartas, acessorios e reliquias para jogadores lendarios. Singles, boosters, displays, deck boxes, sleeves,
            playmats, dados, tokens, ficharios e personalizados para Magic.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase text-frost">Links uteis</h3>
          <div className="mt-4 grid gap-3 text-sm text-mist">
            {usefulLinks.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-gold">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase text-frost">Institucional</h3>
          <div className="mt-4 grid gap-3 text-sm text-mist">
            {institutionalLinks.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-gold">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase text-frost">Contato</h3>
          <div className="mt-4 grid gap-3 text-sm text-mist">
            <a href="https://instagram.com/magicthegalo" className="inline-flex items-center gap-2 transition hover:text-gold">
              <Instagram className="size-4" /> Instagram
            </a>
            <a href="https://wa.me/5511999999999" className="inline-flex items-center gap-2 transition hover:text-gold">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
            <a href="mailto:contato@magicthegalo.com" className="inline-flex items-center gap-2 transition hover:text-gold">
              <Mail className="size-4" /> contato@magicthegalo.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="container-shell flex flex-col gap-2 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <span>2026 Magic The Galo. Todos os direitos reservados.</span>
          <span>Loja Magic preparada para escala, SEO e operacao profissional.</span>
        </div>
      </div>
    </footer>
  );
}
