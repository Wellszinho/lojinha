import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

const customizations = [
  ["Gravação", "Texto", "R$ 30", "Obrigatório: não", "Ativo"],
  ["Cor externa", "Seleção", "R$ 0", "Obrigatório: sim", "Ativo"],
  ["Upload de arte", "Arquivo", "R$ 45", "Obrigatório: não", "Ativo"],
  ["Interior premium", "Checkbox", "R$ 25", "Obrigatório: não", "Pausado"]
];

export default function AdminCustomizationsPage() {
  return (
    <AdminCrudPage
      eyebrow="Personalização"
      title="Modulo de produtos personalizados"
      description="Criar opcoes de personalizacao para deck boxes, tokens, playmats e acessorios: precos extras, campos personalizados, listas de opcoes e ativacao por campanha."
      actionLabel="Criar opção"
      columns={["Opção", "Tipo", "Preço extra", "Regra", "Status"]}
      rows={customizations.map(([option, type, price, rule, status]) => ({
        Opção: option,
        Tipo: type,
        "Preço extra": price,
        Regra: rule,
        Status: status
      }))}
    />
  );
}
