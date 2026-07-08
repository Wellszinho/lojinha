"use client";

import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

import { ProductVisual } from "@/components/commerce/ProductVisual";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/lib/catalog";
import { cn, formatMoney, getDiscountPercent } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, toggleFavorite, isFavorite } = useCart();
  const favorite = isFavorite(product.id);
  const discount = getDiscountPercent(product.price, product.compareAtPrice);

  return (
    <article className="group premium-card overflow-hidden">
      <Link href={`/produto/${product.slug}`} aria-label={`Ver ${product.name}`}>
        <ProductVisual
          tone={product.tone}
          name={product.name}
          productType={product.productType}
          imageSrc={product.images?.[0]?.src}
          imageAlt={product.images?.[0]?.alt}
          className="min-h-[250px] rounded-none border-b border-white/10"
        />
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/produto/${product.slug}`} className="font-bold text-frost transition hover:text-gold">
              {product.name}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-mist">{product.description}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-premium border border-white/10 bg-white/[.05] text-mist transition hover:border-gold/40 hover:text-gold",
              favorite && "border-gold/50 bg-gold/10 text-gold"
            )}
            aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            title={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className="size-4" fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 text-gold">
            <Star className="size-4 fill-current" />
            {product.rating.toFixed(1)}
          </span>
          <span className="text-mist">({product.reviewCount})</span>
          <span className="rounded-premium border border-emerald/20 bg-emerald/10 px-2 py-1 text-xs font-semibold text-emerald">
            {product.stock} em estoque
          </span>
          {discount > 0 ? (
            <span className="rounded-premium border border-gold/30 bg-gold/10 px-2 py-1 text-xs font-semibold text-gold">
              -{discount}%
            </span>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            {product.compareAtPrice ? (
              <p className="text-sm text-mist line-through">{formatMoney(product.compareAtPrice)}</p>
            ) : null}
            <p className="text-xl font-black text-frost">{formatMoney(product.price)}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/produto/${product.slug}`}
              className="grid size-11 place-items-center rounded-premium border border-white/10 bg-white/[.05] text-mist transition hover:border-violet/60 hover:text-frost"
              aria-label="Quick view"
              title="Quick view"
            >
              <Eye className="size-4" />
            </Link>
            <Button
              type="button"
              className="size-11 px-0"
              data-testid={`add-to-cart-${product.slug}`}
              aria-label="Adicionar ao carrinho"
              title="Adicionar ao carrinho"
              onClick={() =>
                addItem({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  stock: product.stock,
                  tone: product.tone
                })
              }
            >
              <ShoppingCart className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
