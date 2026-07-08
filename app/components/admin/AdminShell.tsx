import {
  BadgePercent,
  BarChart3,
  Boxes,
  FileText,
  ImageIcon,
  Layers3,
  MessageSquareText,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Users
} from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/ui/Logo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Boxes },
  { href: "/admin/colecoes", label: "Coleções", icon: Layers3 },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/cupons", label: "Cupons", icon: BadgePercent },
  { href: "/admin/cms", label: "CMS", icon: FileText },
  { href: "/admin/midia", label: "Mídia", icon: ImageIcon },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: MessageSquareText },
  { href: "/admin/personalizacoes", label: "Personalizações", icon: Palette },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-obsidian">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-black/35 p-5 xl:block">
        <Logo />
        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-premium px-3 py-3 text-sm font-semibold text-mist transition hover:bg-white/[.06] hover:text-frost"
            >
              <item.icon className="size-4 text-gold" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="xl:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-obsidian/85 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="xl:hidden">
              <Logo compact />
            </div>
            <div className="hidden text-sm text-mist xl:block">Painel administrativo protegido</div>
            <Link href="/" className="rounded-premium border border-white/10 px-3 py-2 text-sm font-semibold text-mist transition hover:text-gold">
              Ver loja
            </Link>
          </div>
          <nav className="scrollbar-soft flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 xl:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-premium border border-white/10 bg-white/[.04] px-3 py-2 text-sm text-mist"
              >
                <item.icon className="size-4 text-gold" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
