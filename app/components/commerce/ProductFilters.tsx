import { SlidersHorizontal } from "lucide-react";

import { categories, collections, productTypeLabels } from "@/lib/catalog";

function FilterGroups() {
  return (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="font-semibold text-frost">Preco</h3>
        <div className="mt-3 grid gap-2 text-mist">
          {["Ate R$ 150", "R$ 150 a R$ 250", "Acima de R$ 250"].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" className="size-4 accent-[#D7B46A]" />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-frost">Tipo de produto</h3>
        <div className="mt-3 grid gap-2 text-mist">
          {Object.values(productTypeLabels).map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input type="checkbox" className="size-4 accent-[#D7B46A]" />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-frost">Categoria</h3>
        <div className="mt-3 grid gap-2 text-mist">
          {categories.map((category) => (
            <label key={category.slug} className="flex items-center gap-2">
              <input type="checkbox" className="size-4 accent-[#D7B46A]" />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-frost">Colecao</h3>
        <div className="mt-3 grid gap-2 text-mist">
          {collections.slice(0, 5).map((collection) => (
            <label key={collection.slug} className="flex items-center gap-2">
              <input type="checkbox" className="size-4 accent-[#D7B46A]" />
              {collection.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-frost">Disponibilidade</h3>
        <div className="mt-3 grid gap-2 text-mist">
          {["Em estoque", "Lancamentos", "Promocoes", "Mais vendidos"].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" className="size-4 accent-[#D7B46A]" />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterTitle() {
  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="size-4 text-gold" />
      <h2 className="font-bold text-frost">Filtros</h2>
    </div>
  );
}

export function ProductFilters() {
  return (
    <>
      <details className="group rounded-premium border border-white/10 bg-white/[.045] lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 marker:hidden">
          <FilterTitle />
          <span className="text-xs font-semibold uppercase tracking-[.16em] text-gold group-open:hidden">Abrir</span>
          <span className="hidden text-xs font-semibold uppercase tracking-[.16em] text-gold group-open:inline">
            Fechar
          </span>
        </summary>
        <div className="border-t border-white/10 p-4">
          <FilterGroups />
        </div>
      </details>

      <aside className="hidden h-fit rounded-premium border border-white/10 bg-white/[.045] p-4 lg:sticky lg:top-28 lg:block">
        <div className="border-b border-white/10 pb-4">
          <FilterTitle />
        </div>
        <div className="mt-5">
          <FilterGroups />
        </div>
      </aside>
    </>
  );
}
