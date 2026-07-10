"use client";

import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useCart } from "@/components/providers/CartProvider";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/produtos", label: "Produtos" },
  { href: "/marketplace", label: "Classificados" },
  { href: "/criar-deck", label: "Criar Deck" },
  { href: "/deck-analyzer", label: "Analisador" },
  { href: "/cartas-avulsas", label: "Cartas Avulsas" },
  { href: "/deck-boxes", label: "Deck Boxes" },
  { href: "/acessorios", label: "Acessorios" },
  { href: "/colecoes", label: "Colecoes" },
  { href: "/personalizados", label: "Personalizados" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" }
];

export function Header() {
  const router = useRouter();
  const { openCart, itemCount, favorites } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value) {
      router.push(`/pesquisa?q=${encodeURIComponent(value)}`);
      setIsOpen(false);
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-obsidian/78 backdrop-blur-xl">
      <div className="container-shell flex min-h-[76px] items-center gap-4">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 xl:flex" aria-label="Navegacao principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-premium px-2.5 py-2 text-sm font-semibold text-mist transition hover:bg-white/[.06] hover:text-frost"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={handleSearch}
          className="ml-auto hidden w-full max-w-xs items-center gap-2 rounded-premium border border-white/10 bg-white/[.05] px-3 py-2 md:flex"
        >
          <Search className="size-4 text-mist" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar cartas, boosters, acessorios..."
            className="w-full bg-transparent text-sm text-frost outline-none placeholder:text-mist"
            type="search"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/favoritos"
            className="relative grid size-10 place-items-center rounded-premium border border-white/10 bg-white/[.04] text-mist transition hover:text-frost"
            aria-label="Favoritos"
            title="Favoritos"
          >
            <Heart className="size-4" />
            {favorites.length > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-gold text-[11px] font-black text-obsidian">
                {favorites.length}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={openCart}
            data-testid="cart-button"
            className="relative grid size-10 place-items-center rounded-premium border border-white/10 bg-white/[.04] text-mist transition hover:text-frost"
            aria-label="Abrir carrinho"
            title="Carrinho"
          >
            <ShoppingBag className="size-4" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-gold text-[11px] font-black text-obsidian">
                {itemCount}
              </span>
            ) : null}
          </button>
          <Link
            href="/login"
            className="hidden h-10 items-center gap-2 rounded-premium border border-gold/30 bg-gold/10 px-3 text-sm font-semibold text-gold transition hover:bg-gold/15 sm:inline-flex"
          >
            <User className="size-4" /> Entrar
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-premium border border-white/10 text-mist xl:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            title={isOpen ? "Fechar" : "Menu"}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-white/10 bg-obsidian xl:hidden", isOpen ? "block" : "hidden")}>
        <div className="container-shell space-y-4 py-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-premium border border-white/10 bg-white/[.05] px-3 py-2">
            <Search className="size-4 text-mist" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar cartas, boosters, acessorios..."
              className="w-full bg-transparent text-sm text-frost outline-none placeholder:text-mist"
              type="search"
            />
          </form>
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-premium px-3 py-3 text-sm font-semibold text-mist transition hover:bg-white/[.06] hover:text-frost"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="rounded-premium px-3 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10"
            >
              Entrar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
