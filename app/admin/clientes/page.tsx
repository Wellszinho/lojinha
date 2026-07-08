import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { formatMoney } from "@/lib/utils";

const customers = [
  ["Rafael M.", "rafael@example.com", "(11) 99999-0101", 8, 148990, "04/02/2026"],
  ["Bianca S.", "bianca@example.com", "(21) 99999-0202", 5, 98990, "18/03/2026"],
  ["Leonardo A.", "leo@example.com", "(31) 99999-0303", 3, 62970, "11/04/2026"]
];

export default function AdminCustomersPage() {
  return (
    <AdminCrudPage
      eyebrow="Clientes"
      title="Clientes"
      description="Listagem completa com nome, email, telefone, pedidos, valor gasto e data de cadastro."
      actionLabel="Adicionar cliente"
      columns={["Nome", "Email", "Telefone", "Pedidos", "Valor gasto", "Cadastro"]}
      rows={customers.map(([name, email, phone, orders, spent, date]) => ({
        Nome: String(name),
        Email: String(email),
        Telefone: String(phone),
        Pedidos: String(orders),
        "Valor gasto": formatMoney(Number(spent)),
        Cadastro: String(date)
      }))}
    />
  );
}
