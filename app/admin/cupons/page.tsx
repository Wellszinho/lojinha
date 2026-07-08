import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

const coupons = [
  ["LENDARIO10", "%", "10%", "31/12/2026", "500", "Ativo"],
  ["FRETEGRATIS", "Frete grátis", "100%", "30/09/2026", "200", "Ativo"],
  ["GALO25", "Valor fixo", "R$ 25", "15/08/2026", "100", "Pausado"]
];

export default function AdminCouponsPage() {
  return (
    <AdminCrudPage
      eyebrow="Promoções"
      title="Cupons"
      description="Sistema completo com percentual, valor fixo, frete grátis, validade, limite e quantidade."
      actionLabel="Criar cupom"
      columns={["Código", "Tipo", "Valor", "Validade", "Limite", "Status"]}
      rows={coupons.map(([code, type, value, expires, limit, status]) => ({
        Código: code,
        Tipo: type,
        Valor: value,
        Validade: expires,
        Limite: limit,
        Status: status
      }))}
    />
  );
}
