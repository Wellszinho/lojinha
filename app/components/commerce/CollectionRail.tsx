import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { collections } from "@/lib/catalog";

export function CollectionRail() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {collections.map((collection) => (
        <Link
          key={collection.slug}
          href={`/colecoes?colecao=${collection.slug}`}
          className="group overflow-hidden rounded-premium border border-white/10 bg-white/[.045] transition hover:-translate-y-1 hover:border-gold/40"
        >
          <div className={`h-28 bg-gradient-to-br ${collection.tone}`} />
          <div className="flex items-start justify-between gap-4 p-5">
            <div>
              <h3 className="text-lg font-bold text-frost">{collection.name}</h3>
              <p className="mt-2 text-sm leading-5 text-mist">{collection.description}</p>
            </div>
            <ArrowUpRight className="mt-1 size-5 shrink-0 text-gold transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}
