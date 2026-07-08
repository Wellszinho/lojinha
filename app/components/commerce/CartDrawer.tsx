"use client";

import { Minus, Plus, ShoppingBag, Ticket, Trash2, Truck, X } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/components/providers/CartProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const shippingPreview = subtotal >= 35000 ? 0 : 2490;
  const total = subtotal + shippingPreview;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition ${isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-white/10 bg-obsidian shadow-premium transition duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Carrinho"
        aria-hidden={!isCartOpen}
        inert={!isCartOpen}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-premium border border-gold/30 bg-gold/10 text-gold">
              <ShoppingBag className="size-5" />
            </span>
            <div>
              <h2 className="font-bold text-frost">Carrinho</h2>
              <p className="text-sm text-mist">{items.length} item(ns)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid size-10 place-items-center rounded-premium border border-white/10 text-mist transition hover:text-frost"
            aria-label="Fechar carrinho"
            title="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="scrollbar-soft flex-1 space-y-4 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="rounded-premium border border-white/10 bg-white/[.04] p-6 text-center">
              <ShoppingBag className="mx-auto size-8 text-gold" />
              <p className="mt-3 font-semibold text-frost">Seu carrinho está vazio.</p>
              <p className="mt-2 text-sm text-mist">Escolha cartas, selados ou acessorios e volte para finalizar.</p>
              <ButtonLink href="/produtos" className="mt-5" onClick={closeCart}>
                Ver produtos
              </ButtonLink>
            </div>
          ) : null}

          {items.map((item) => (
            <div key={item.id} className="rounded-premium border border-white/10 bg-white/[.045] p-4">
              <div className="flex gap-4">
                <div className={`h-20 w-20 shrink-0 rounded-premium bg-gradient-to-br ${item.tone}`} />
                <div className="min-w-0 flex-1">
                  <Link href={`/produto/${item.slug}`} className="font-bold text-frost hover:text-gold" onClick={closeCart}>
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-mist">{formatMoney(item.price)}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-premium border border-white/10">
                      <button
                        type="button"
                        className="grid size-8 place-items-center text-mist hover:text-frost"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Diminuir quantidade"
                        title="Diminuir"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold text-frost">{item.quantity}</span>
                      <button
                        type="button"
                        className="grid size-8 place-items-center text-mist hover:text-frost"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Aumentar quantidade"
                        title="Aumentar"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-premium border border-white/10 text-mist hover:border-red-400/40 hover:text-red-200"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remover produto"
                      title="Remover"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t border-white/10 p-5">
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between text-mist">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-mist">
              <span className="inline-flex items-center gap-2">
                <Truck className="size-4" /> Frete
              </span>
              <span>{shippingPreview === 0 ? "Grátis" : formatMoney(shippingPreview)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-black text-frost">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-premium border border-gold/25 bg-gold/10 px-3 py-2 text-sm text-gold">
            <Ticket className="size-4" />
            Cupons e frete são recalculados no checkout.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" type="button" onClick={closeCart}>
              Continuar
            </Button>
            <ButtonLink href="/checkout" onClick={closeCart}>
              Finalizar
            </ButtonLink>
          </div>
        </div>
      </aside>
    </>
  );
}
