"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { academyPath, navigation } from "@/lib/academy-data";
import { cn } from "@/lib/utils";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-slate-950/40 transition lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")} onClick={onClose} />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link href={academyPath()} onClick={onClose} className="min-w-0">
            <span className="block text-lg font-black text-slate-950">FIT Academy</span>
            <span className="block text-xs font-bold text-sky-700">AVA 2.0</span>
          </Link>
          <button type="button" onClick={onClose} className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden" aria-label="Fechar menu">
            <X className="size-4" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.href === academyPath() ? pathname === academyPath() : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition",
                  active ? "bg-sky-700 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                <Icon className="size-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">Próximo passo</p>
            <p className="mt-2 text-sm font-black text-slate-950">Finalizar Curso 1</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">Você está quase lá em Fundamentos em Python.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
