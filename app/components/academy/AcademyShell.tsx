"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { Header } from "@/components/academy/Header";
import { Sidebar } from "@/components/academy/Sidebar";

type AcademyShellProps = {
  children: ReactNode;
};

export function AcademyShell({ children }: AcademyShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
