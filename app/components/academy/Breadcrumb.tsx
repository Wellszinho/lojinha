import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { academyPath } from "@/lib/academy-data";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href={academyPath()} className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-sky-700">
        <Home className="size-4" />
        Início
      </Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.href ?? "current"}`} className="inline-flex items-center gap-2">
          <ChevronRight className="size-4 text-slate-300" />
          {item.href ? (
            <Link href={item.href} className="font-semibold text-slate-600 hover:text-sky-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
