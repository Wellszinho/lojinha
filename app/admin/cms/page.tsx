import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

const content = [
  ["Banner principal", "Homepage", "Proteja seu deck com estilo lendário.", "Ativo"],
  ["Rodapé", "Global", "Links, redes sociais e contato", "Ativo"],
  ["Popup promocional", "Campanha", "Frete grátis acima de R$ 350", "Agendado"],
  ["Página Sobre", "Institucional", "História e proposta da marca", "Ativo"]
];

export default function AdminCmsPage() {
  return (
    <AdminCrudPage
      eyebrow="CMS"
      title="Gerenciamento de conteúdo"
      description="Editar banner principal, textos, botões, logo, favicon, redes sociais, rodapé, páginas institucionais, homepage, banners, popups, avisos e destaques sem tocar no código."
      actionLabel="Criar conteúdo"
      columns={["Bloco", "Área", "Conteúdo", "Status"]}
      rows={content.map(([block, area, copy, status]) => ({
        Bloco: block,
        Área: area,
        Conteúdo: copy,
        Status: status
      }))}
    />
  );
}
