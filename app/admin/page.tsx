import { AlertTriangle, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { formatMoney } from "@/lib/utils";

const recentOrders = [
  { number: "#MTG-1024", customer: "Rafael M.", status: "Pagamento aprovado", total: 18990 },
  { number: "#MTG-1023", customer: "Bianca S.", status: "Em produção", total: 29990 },
  { number: "#MTG-1022", customer: "Leonardo A.", status: "Enviado", total: 14990 }
];

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Visão geral da operação."
        description="Faturamento, pedidos, clientes, produtos sem estoque, mais vendidos e pedidos recentes."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard icon={TrendingUp} label="Faturamento" value="R$ 84.920" trend="+18%" />
        <AdminStatCard icon={ShoppingCart} label="Pedidos" value="342" trend="+9%" />
        <AdminStatCard icon={Users} label="Clientes" value="1.284" trend="+12%" />
        <AdminStatCard icon={Package} label="Produtos" value="86" />
        <AdminStatCard icon={AlertTriangle} label="Sem estoque" value="7" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_.75fr]">
        <section className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <h2 className="text-xl font-black text-frost">Pedidos recentes</h2>
          <div className="mt-5 divide-y divide-white/10">
            {recentOrders.map((order) => (
              <div key={order.number} className="flex items-center justify-between gap-4 py-4 text-sm">
                <div>
                  <p className="font-bold text-frost">{order.number}</p>
                  <p className="text-mist">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gold">{order.status}</p>
                  <p className="text-mist">{formatMoney(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-premium border border-white/10 bg-white/[.045] p-5">
          <h2 className="text-xl font-black text-frost">Produtos mais vendidos</h2>
          <div className="mt-5 space-y-4">
            {["Charizard ex - Scarlet & Violet 151", "Arcane Vault Pro", "Sleeves Dragon Guard Matte"].map((product, index) => (
              <div key={product} className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-premium bg-gold/10 text-sm font-black text-gold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-frost">{product}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${88 - index * 18}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
