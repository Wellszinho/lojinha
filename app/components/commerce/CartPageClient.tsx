"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/components/providers/CartProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatMoney } from "@/lib/utils";

export function CartPageClient() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const shipping = subtotal >= 35000 ? 0 : 2490;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="rounded-premium border border-white/10 bg-white/[.045] p-8 text-center">
        <h1 className="text-2xl font-black text-frost">Seu carrinho está vazio.</h1>
        <p className="mt-3 text-mist">A loja esta cheia de cartas, selados e reliquias esperando por voce.</p>
        <ButtonLink href="/produtos" className="mt-6">
          Ver produtos
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-premium border border-white/10 bg-white/[.045] p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className={`h-28 w-full rounded-premium bg-gradient-to-br ${item.tone} sm:w-32`} />
              <div className="flex-1">
                <Link href={`/produto/${item.slug}`} className="text-lg font-bold text-frost hover:text-gold">
                  {item.name}
                </Link>
                <p className="mt-2 text-sm text-mist">{formatMoney(item.price)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-premium border border-white/10">
                    <button type="button" className="grid size-9 place-items-center text-mist" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Diminuir" title="Diminuir">
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-frost">{item.quantity}</span>
                    <button type="button" className="grid size-9 place-items-center text-mist" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Aumentar" title="Aumentar">
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeItem(item.id)}>
                    <Trash2 className="size-4" />
                    Remover
                  </Button>
                </div>
              </div>
              <strong className="text-xl text-frost">{formatMoney(item.price * item.quantity)}</strong>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-premium border border-white/10 bg-white/[.045] p-5 lg:sticky lg:top-28">
        <h2 className="text-xl font-black text-frost">Resumo</h2>
        <div className="mt-5 space-y-3 text-sm text-mist">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete</span>
            <span>{shipping === 0 ? "Grátis" : formatMoney(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-black text-frost">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>
        <ButtonLink href="/checkout" className="mt-6 w-full">
          Finalizar Compra
        </ButtonLink>
      </aside>
    </div>
  );
}
