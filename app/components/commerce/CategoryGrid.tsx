import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { categories } from "@/lib/catalog";

export function CategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/categoria/${category.slug}`}
          className="group relative min-h-[210px] overflow-hidden rounded-premium border border-white/10 bg-white/[.045] p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[.07]"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${category.tone} opacity-70 transition group-hover:opacity-90`} />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative flex h-full flex-col justify-between">
            <span className="w-fit rounded-premium border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold text-frost backdrop-blur">
              {category.productCount} modelos
            </span>
            <div>
              <h3 className="text-2xl font-black text-frost">{category.name}</h3>
              <p className="mt-2 max-w-xs text-sm leading-5 text-white/76">{category.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                Explorar <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
