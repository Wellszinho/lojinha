import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

const settings = [
  ["Nome da loja", "Magic The Galo", "Branding"],
  ["Descricao", "Cartas, acessorios e reliquias para jogadores lendarios.", "Branding"],
  ["WhatsApp", "+55 11 99999-9999", "Contato"],
  ["Instagram", "@magicthegalo", "Redes sociais"],
  ["Meta Title", "Magic The Galo | Loja Magic", "SEO"],
  ["Google Analytics", "Preparado", "Marketing"],
  ["Pixel Meta", "Preparado", "Marketing"]
];

export default function AdminSettingsPage() {
  return (
    <AdminCrudPage
      eyebrow="Configuracoes"
      title="Configuracoes da loja"
      description="Editar nome, descricao, logo, favicon, telefone, email, redes, WhatsApp, endereco, SEO, Analytics e Pixel Meta."
      actionLabel="Nova configuracao"
      columns={["Campo", "Valor", "Grupo"]}
      rows={settings.map(([field, value, group]) => ({
        Campo: field,
        Valor: value,
        Grupo: group
      }))}
    />
  );
}
