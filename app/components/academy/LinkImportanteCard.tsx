import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { ImportantLink } from "@/lib/academy-data";

type LinkImportanteCardProps = {
  link: ImportantLink;
};

export function LinkImportanteCard({ link }: LinkImportanteCardProps) {
  const Icon = link.icon;
  const external = link.href.startsWith("http") || link.href.startsWith("mailto:");
  const content = (
    <>
      <span className="rounded-lg bg-sky-50 p-3 text-sky-700">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-sm font-black text-slate-950">{link.title}</strong>
        <span className="mt-1 block text-sm leading-6 text-slate-600">{link.description}</span>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-sky-700">
          {link.label}
          {external ? <ExternalLink className="size-3.5" /> : null}
        </span>
      </span>
    </>
  );

  if (external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow-md">
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow-md">
      {content}
    </Link>
  );
}
