"use client";

import { ProductCard } from "@/components/commerce/ProductCard";
import { useCart } from "@/components/providers/CartProvider";
import { ButtonLink } from "@/components/ui/Button";
import { products } from "@/lib/catalog";

export function FavoritesClient() {
  const { favorites } = useCart();
  const selected = products.filter((product) => favorites.includes(product.id));

  if (selected.length === 0) {
    return (
      <div className="rounded-premium border border-white/10 bg-white/[.045] p-8 text-center">
        <h1 className="text-2xl font-black text-frost">Nenhum favorito salvo.</h1>
        <p className="mt-3 text-mist">Use o coração nos produtos para montar sua lista.</p>
        <ButtonLink href="/produtos" className="mt-6">Ver produtos</ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {selected.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
