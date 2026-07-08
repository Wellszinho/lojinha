import { PackageCheck } from "lucide-react";
import type { Metadata } from "next";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pedidos",
  description: "Histórico de pedidos do cliente."
};

const orders = [
  { number: "#MTG-1024", status: "Pagamento aprovado", date: "02/07/2026", total: 18990 },
  { number: "#MTG-0988", status: "Entregue", date: "18/06/2026", total: 29990 }
];

export default function OrdersPage() {
  return (
    <section className="section-band pt-32">
      <div className="container-shell">
        <SectionHeader eyebrow="Pedidos" title="Acompanhe suas compras." />
        <div className="grid gap-4">
          {orders.map((order) => (
            <article key={order.number} className="rounded-premium border border-white/10 bg-white/[.045] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-premium border border-gold/30 bg-gold/10 text-gold">
                    <PackageCheck className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-frost">{order.number}</h2>
                    <p className="text-sm text-mist">{order.date}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-gold">{order.status}</p>
                  <p className="text-sm text-mist">{formatMoney(order.total)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
