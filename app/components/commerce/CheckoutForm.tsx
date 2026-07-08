"use client";

import { CheckCircle2, CreditCard, MapPin, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";

import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/utils";

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const shipping = subtotal >= 35000 ? 0 : 2490;
  const total = subtotal + shipping;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = new FormData(event.currentTarget);
    await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone")
        },
        address: {
          zipCode: form.get("zipCode"),
          street: form.get("street"),
          number: form.get("number"),
          district: form.get("district"),
          city: form.get("city"),
          state: form.get("state")
        },
        paymentMethod: form.get("paymentMethod"),
        items: items.map((item) => ({
          productId: item.productId ?? item.id,
          name: item.name,
          unitPrice: item.price,
          quantity: item.quantity
        })),
        coupon: form.get("coupon") || undefined
      })
    });

    clearCart();
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rounded-premium border border-emerald/30 bg-emerald/10 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald" />
        <h1 className="mt-4 text-2xl font-black text-frost">Pedido recebido.</h1>
        <p className="mt-3 text-mist">O fluxo está preparado para direcionar Pix, cartão ou boleto conforme o provedor.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <fieldset className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <legend className="flex items-center gap-2 px-2 text-lg font-bold text-frost">
            <UserRound className="size-5 text-gold" /> Informações pessoais
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="name" required placeholder="Nome completo" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
            <input name="email" required type="email" placeholder="Email" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
            <input name="phone" required placeholder="Telefone" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50 sm:col-span-2" />
          </div>
        </fieldset>

        <fieldset className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <legend className="flex items-center gap-2 px-2 text-lg font-bold text-frost">
            <MapPin className="size-5 text-gold" /> Entrega
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="zipCode" required placeholder="CEP" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
            <input name="street" required placeholder="Rua" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
            <input name="number" required placeholder="Número" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
            <input name="district" required placeholder="Bairro" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
            <input name="city" required placeholder="Cidade" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
            <input name="state" required placeholder="UF" className="rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
          </div>
        </fieldset>

        <fieldset className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <legend className="flex items-center gap-2 px-2 text-lg font-bold text-frost">
            <CreditCard className="size-5 text-gold" /> Pagamento
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["pix", "card", "boleto"].map((method) => (
              <label key={method} className="rounded-premium border border-white/10 bg-black/20 p-4 text-sm font-semibold text-frost">
                <input required type="radio" name="paymentMethod" value={method} className="mr-2 accent-[#D7B46A]" defaultChecked={method === "pix"} />
                {method === "pix" ? "Pix" : method === "card" ? "Cartão" : "Boleto"}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="h-fit rounded-premium border border-white/10 bg-white/[.045] p-5 lg:sticky lg:top-28">
        <h2 className="text-xl font-black text-frost">Resumo</h2>
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-sm text-mist">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatMoney(item.price * item.quantity)}</span>
            </div>
          ))}
          <input name="coupon" placeholder="Cupom" className="w-full rounded-premium border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-gold/50" />
          <div className="space-y-2 border-t border-white/10 pt-4 text-sm text-mist">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
            <div className="flex justify-between"><span>Frete</span><span>{shipping === 0 ? "Grátis" : formatMoney(shipping)}</span></div>
            <div className="flex justify-between text-lg font-black text-frost"><span>Total</span><span>{formatMoney(total)}</span></div>
          </div>
        </div>
        <Button disabled={items.length === 0 || status === "loading"} className="mt-6 w-full">
          {status === "loading" ? "Processando..." : "Finalizar Compra"}
        </Button>
      </aside>
    </form>
  );
}
