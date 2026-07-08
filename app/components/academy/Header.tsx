"use client";

import { Bell, Menu, Search } from "lucide-react";

import { academyUser } from "@/lib/academy-data";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const initials = academyUser.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center gap-4 px-4 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase text-sky-700">FIT Academy / AVA 2.0</p>
          <h1 className="truncate text-sm font-black text-slate-950 sm:text-base">Ambiente de aprendizagem corporativa</h1>
        </div>
        <label className="hidden h-10 w-full max-w-sm items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 md:flex">
          <Search className="size-4" />
          <span className="sr-only">Buscar</span>
          <input className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Buscar cursos, trilhas e suporte" />
        </label>
        <button type="button" className="relative inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700" aria-label="Notificações">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-emerald-500" />
        </button>
        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-950">{academyUser.name}</p>
            <p className="text-xs text-slate-500">{academyUser.role}</p>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-sky-700 text-sm font-black text-white">{initials}</span>
        </div>
      </div>
    </header>
  );
}
