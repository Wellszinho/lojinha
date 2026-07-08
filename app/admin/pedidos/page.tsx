import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { formatMoney } from "@/lib/utils";

const rows = [
  ["#MTG-1024", "Rafael M.", "Arcane Vault Pro", "Pix", "Melhor Envio", 18990, "Pagamento aprovado", "02/07/2026"],
  ["#MTG-1023", "Bianca S.", "Summoner Duo Box", "Cartão", "Correios", 29990, "Em produção", "02/07/2026"],
  ["#MTG-1022", "Leonardo A.", "Neon Sideboard Case", "Boleto", "Correios", 14990, "Enviado", "01/07/2026"]
];

export default function AdminOrdersPage() {
  return (
    <AdminCrudPage
      eyebrow="Pedidos"
      title="Gerenciamento de pedidos"
      description="Tela completa com número, cliente, produtos, pagamento, frete, valor, status e data. Status: recebido, aprovado, produção, enviado, entregue, cancelado e reembolsado."
      actionLabel="Criar pedido"
      columns={["Número", "Cliente", "Produtos", "Pagamento", "Frete", "Valor", "Status", "Data"]}
      rows={rows.map(([number, customer, product, payment, shipping, total, status, date]) => ({
        Número: String(number),
        Cliente: String(customer),
        Produtos: String(product),
        Pagamento: String(payment),
        Frete: String(shipping),
        Valor: formatMoney(Number(total)),
        Status: String(status),
        Data: String(date)
      }))}
    />
  );
}
